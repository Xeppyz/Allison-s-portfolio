import { useRef, useState } from 'react'
import { useEditor, useEditorState, EditorContent, type Editor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Image from '@tiptap/extension-image'
import { Placeholder } from '@tiptap/extensions'
import {
  Bold, Italic, Heading2, Heading3, List, ListOrdered, Quote, Link2, ImagePlus, Undo2, Redo2, Pilcrow, Minus,
} from 'lucide-react'
import { uploadImage } from './upload'
import { inputCls } from './ui'

const tb =
  'inline-flex h-9 min-w-9 items-center justify-center rounded-lg px-2 text-navy/75 transition hover:bg-sand hover:text-navy focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy disabled:opacity-40'
const on = 'bg-navy text-white hover:bg-navy hover:text-white'

function Btn({ label, active, onClick, disabled, children }: {
  label: string; active?: boolean; onClick: () => void; disabled?: boolean; children: React.ReactNode
}) {
  return (
    <button type="button" title={label} aria-label={label} aria-pressed={active} disabled={disabled}
      onMouseDown={(e) => e.preventDefault()} onClick={onClick} className={`${tb} ${active ? on : ''}`}>
      {children}
    </button>
  )
}

const Sep = () => <span aria-hidden="true" className="mx-1 h-6 w-px bg-navy/10" />

function Toolbar({ editor, onBusy }: { editor: Editor; onBusy?: (b: boolean) => void }) {
  const s = useEditorState({
    editor,
    selector: ({ editor: e }) => ({
      p: e.isActive('paragraph'),
      h2: e.isActive('heading', { level: 2 }),
      h3: e.isActive('heading', { level: 3 }),
      bold: e.isActive('bold'),
      italic: e.isActive('italic'),
      ul: e.isActive('bulletList'),
      ol: e.isActive('orderedList'),
      quote: e.isActive('blockquote'),
      link: e.isActive('link'),
      href: (e.getAttributes('link').href as string | undefined) ?? '',
      image: e.isActive('image'),
      alt: (e.getAttributes('image').alt as string | undefined) ?? '',
      undo: e.can().undo(),
      redo: e.can().redo(),
    }),
  })
  const [linkOpen, setLinkOpen] = useState(false)
  const [url, setUrl] = useState('')
  const [uploading, setUploading] = useState(false)
  const [msg, setMsg] = useState('')
  const file = useRef<HTMLInputElement>(null)
  const c = () => editor.chain().focus()

  function openLink() {
    setUrl(s.href)
    setLinkOpen((v) => !v)
  }
  function applyLink(e: React.FormEvent) {
    e.preventDefault()
    const href = url.trim()
    if (!href) c().extendMarkRange('link').unsetLink().run()
    else {
      // Rutas internas tal cual (/planes); dominios sin protocolo → https://
      const full = href.startsWith('/') || /^(https?:|mailto:|tel:)/i.test(href) ? href : `https://${href}`
      c().extendMarkRange('link').setLink({ href: full }).run()
    }
    setLinkOpen(false)
  }
  async function pickImage(f: File | undefined) {
    if (!f) return
    setMsg('')
    setUploading(true)
    onBusy?.(true)
    try {
      const src = await uploadImage(f)
      c().setImage({ src, alt: '' }).run()
      setMsg('Imagen añadida. Escribe abajo qué muestra (texto alternativo).')
    } catch (err) {
      setMsg((err as Error).message)
    } finally {
      setUploading(false)
      onBusy?.(false)
    }
  }

  return (
    <div className="sticky top-0 z-10 rounded-t-2xl border-b border-navy/10 bg-white/95 backdrop-blur">
      <div role="toolbar" aria-label="Formato del texto" className="flex flex-wrap items-center gap-0.5 px-2 py-1.5">
        <Btn label="Párrafo" active={s.p} onClick={() => c().setParagraph().run()}><Pilcrow className="h-4 w-4" /></Btn>
        <Btn label="Subtítulo" active={s.h2} onClick={() => c().toggleHeading({ level: 2 }).run()}><Heading2 className="h-4 w-4" /></Btn>
        <Btn label="Subtítulo menor" active={s.h3} onClick={() => c().toggleHeading({ level: 3 }).run()}><Heading3 className="h-4 w-4" /></Btn>
        <Sep />
        <Btn label="Negrita" active={s.bold} onClick={() => c().toggleBold().run()}><Bold className="h-4 w-4" /></Btn>
        <Btn label="Cursiva" active={s.italic} onClick={() => c().toggleItalic().run()}><Italic className="h-4 w-4" /></Btn>
        <Btn label="Enlace" active={s.link || linkOpen} onClick={openLink}><Link2 className="h-4 w-4" /></Btn>
        <Sep />
        <Btn label="Lista con viñetas" active={s.ul} onClick={() => c().toggleBulletList().run()}><List className="h-4 w-4" /></Btn>
        <Btn label="Lista numerada" active={s.ol} onClick={() => c().toggleOrderedList().run()}><ListOrdered className="h-4 w-4" /></Btn>
        <Btn label="Cita" active={s.quote} onClick={() => c().toggleBlockquote().run()}><Quote className="h-4 w-4" /></Btn>
        <Btn label="Línea divisoria" onClick={() => c().setHorizontalRule().run()}><Minus className="h-4 w-4" /></Btn>
        <Btn label={uploading ? 'Subiendo imagen…' : 'Insertar imagen'} disabled={uploading} onClick={() => file.current?.click()}>
          <ImagePlus className={`h-4 w-4 ${uploading ? 'animate-pulse' : ''}`} />
        </Btn>
        <input ref={file} type="file" accept="image/png,image/jpeg,image/webp" className="hidden"
          onChange={(e) => { void pickImage(e.target.files?.[0]); e.target.value = '' }} />
        <span className="ml-auto flex">
          <Btn label="Deshacer" disabled={!s.undo} onClick={() => c().undo().run()}><Undo2 className="h-4 w-4" /></Btn>
          <Btn label="Rehacer" disabled={!s.redo} onClick={() => c().redo().run()}><Redo2 className="h-4 w-4" /></Btn>
        </span>
      </div>

      {linkOpen && (
        <form onSubmit={applyLink} className="flex flex-wrap items-center gap-2 border-t border-navy/10 px-3 py-2">
          <label htmlFor="rte-link" className="text-sm font-medium text-navy">Enlace</label>
          <input id="rte-link" autoFocus value={url} onChange={(e) => setUrl(e.target.value)}
            placeholder="/planes o https://…" className={`${inputCls} h-9 flex-1 text-sm`} />
          <button type="submit" className="h-9 rounded-full bg-navy px-4 text-sm font-semibold text-white">Aplicar</button>
          {s.link && (
            <button type="button" className="h-9 rounded-full px-3 text-sm text-red-700 hover:bg-red-50"
              onClick={() => { c().extendMarkRange('link').unsetLink().run(); setLinkOpen(false) }}>Quitar</button>
          )}
        </form>
      )}

      {s.image && (
        <div className="flex flex-wrap items-center gap-2 border-t border-navy/10 bg-sand/50 px-3 py-2">
          <label htmlFor="rte-alt" className="text-sm font-medium text-navy">Texto alternativo</label>
          <input id="rte-alt" value={s.alt} placeholder="Describe la imagen (lo lee Google)"
            onChange={(e) => editor.chain().updateAttributes('image', { alt: e.target.value }).run()}
            className={`${inputCls} h-9 flex-1 text-sm ${s.alt ? '' : 'border-amber-400'}`} />
        </div>
      )}
      {msg && <p role="status" className="border-t border-navy/10 px-3 py-1.5 text-xs text-navy/70">{msg}</p>}
    </div>
  )
}

/** Editor tipo Word. Devuelve HTML limpio (h2/h3, listas, enlaces, imágenes). */
export default function RichEditor({ value, onChange, onBusy, label }: {
  value: string; onChange: (html: string) => void; onBusy?: (b: boolean) => void; label: string
}) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3] }, // el H1 es el título del artículo
        code: false,
        codeBlock: false,
        // Sin nofollow ni target: los enlaces internos deben pasar autoridad y abrir en la misma pestaña.
        link: { openOnClick: false, autolink: true, defaultProtocol: 'https', HTMLAttributes: { target: null, rel: null } },
      }),
      Image.configure({ inline: false }),
      Placeholder.configure({ placeholder: 'Empieza a escribir… Usa “Subtítulo” para dividir el artículo en secciones.' }),
    ],
    content: value,
    editorProps: {
      attributes: {
        class: 'article-content min-h-[55vh] px-5 py-6 sm:px-8 focus:outline-none',
        'aria-label': label,
        'aria-multiline': 'true',
        role: 'textbox',
      },
    },
    onUpdate: ({ editor: e }) => onChange(e.isEmpty ? '' : e.getHTML()),
  })

  if (!editor) return null
  return (
    <div className="rounded-2xl border border-navy/10 bg-white focus-within:border-navy/30">
      <Toolbar editor={editor} onBusy={onBusy} />
      <EditorContent editor={editor} />
    </div>
  )
}
