import * as React from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
}
 from "./ui/dialog"

type ResponsiveDialogProps = {
  trigger: React.ReactNode
  title: string
  description?: string
  children?: React.ReactNode
}

export function ResponsiveDialog({
  trigger,
  title,
  description,
  children,
}: ResponsiveDialogProps) {
  return (
    <Dialog>
      {/* Botón o componente que abre el modal */}
      <DialogTrigger asChild>{trigger}</DialogTrigger>

      {/* Contenido del modal / bottom sheet */}
      <DialogContent
        className="
          fixed bottom-0 left-0 right-0
          sm:top-1/2 sm:left-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2
          sm:max-w-md
          max-h-[90vh] sm:max-h-[80vh]
          overflow-y-auto
          rounded-t-2xl sm:rounded-lg
          animate-in
          slide-in-from-bottom-5 sm:slide-in-from-top-5
          bg-white
          shadow-lg
          p-4 sm:p-6
        "
      >
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>

        {/* Contenido que pases dentro */}
        <div className="mt-4 flex flex-col gap-4">{children}</div>
      </DialogContent>
    </Dialog>
  )
}
