import { useEffect } from 'react'

/** Avisa al cerrar o recargar la pestaña si hay cambios sin guardar. */
export function useUnsavedWarning(dirty: boolean) {
  useEffect(() => {
    if (!dirty) return
    const onBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault()
      e.returnValue = ''
    }
    window.addEventListener('beforeunload', onBeforeUnload)
    return () => window.removeEventListener('beforeunload', onBeforeUnload)
  }, [dirty])
}

export const confirmDiscard = (dirty: boolean) =>
  !dirty || window.confirm('Tienes cambios sin guardar. ¿Salir sin guardar?')
