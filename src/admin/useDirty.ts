import { useEffect } from 'react'

let unsaved = 0

/** Marca el formulario como pendiente: avisa al cerrar la pestaña y al cambiar de sección. */
export function useUnsavedWarning(dirty: boolean) {
  useEffect(() => {
    if (!dirty) return
    unsaved++
    const onBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault()
      e.returnValue = ''
    }
    window.addEventListener('beforeunload', onBeforeUnload)
    return () => {
      unsaved--
      window.removeEventListener('beforeunload', onBeforeUnload)
    }
  }, [dirty])
}

export const confirmDiscard = (dirty = unsaved > 0) =>
  !dirty || window.confirm('Tienes cambios sin guardar. ¿Salir sin guardar?')
