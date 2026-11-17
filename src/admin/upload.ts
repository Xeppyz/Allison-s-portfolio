import { supabase } from '../lib/supabase'

const MAX_INPUT = 20 * 1024 * 1024
const MAX_OUTPUT = 2 * 1024 * 1024 // límite del bucket `media`
const ACCEPTED = ['image/png', 'image/jpeg', 'image/webp']

/** Reduce a `maxWidth` px y convierte a WebP. Si el navegador no puede, devuelve el archivo tal cual. */
async function toWebp(file: File, maxWidth: number): Promise<Blob> {
  try {
    const bitmap = await createImageBitmap(file)
    const scale = Math.min(1, maxWidth / bitmap.width)
    const canvas = document.createElement('canvas')
    canvas.width = Math.round(bitmap.width * scale)
    canvas.height = Math.round(bitmap.height * scale)
    canvas.getContext('2d')!.drawImage(bitmap, 0, 0, canvas.width, canvas.height)
    bitmap.close()
    for (const quality of [0.82, 0.7, 0.55]) {
      const blob = await new Promise<Blob | null>((r) => canvas.toBlob(r, 'image/webp', quality))
      if (blob && blob.type === 'image/webp' && blob.size <= MAX_OUTPUT) return blob
    }
  } catch {
    // ponytail: navegadores sin WebP en canvas suben el original (si cabe)
  }
  return file
}

/** Optimiza y sube una imagen al bucket `media`. Devuelve la URL pública o lanza un Error con mensaje para el usuario. */
export async function uploadImage(file: File, maxWidth = 1600): Promise<string> {
  if (!supabase) throw new Error('Falta configurar Supabase')
  if (!ACCEPTED.includes(file.type)) throw new Error('Solo se aceptan imágenes PNG, JPG o WebP')
  if (file.size > MAX_INPUT) throw new Error('La imagen supera 20 MB')
  const blob = await toWebp(file, maxWidth)
  if (blob.size > MAX_OUTPUT) throw new Error('La imagen sigue pesando más de 2 MB; prueba con una más pequeña')
  const ext = blob.type === 'image/webp' ? 'webp' : blob.type === 'image/png' ? 'png' : 'jpg'
  const path = `${crypto.randomUUID()}.${ext}`
  const { error } = await supabase.storage.from('media').upload(path, blob, { contentType: blob.type })
  if (error) throw new Error(error.message)
  return supabase.storage.from('media').getPublicUrl(path).data.publicUrl
}
