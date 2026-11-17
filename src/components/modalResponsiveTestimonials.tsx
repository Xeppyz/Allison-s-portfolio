"use client"

import type React from "react"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../components/ui/dialog"
import { X } from "lucide-react"

interface ResponsiveModalProps {
  open: boolean
  onClose: () => void
  title: string
  children: React.ReactNode
}

export function ResponsiveModal({ open, onClose, title, children }: ResponsiveModalProps) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="mx-auto max-h-[90vh] max-w-lg overflow-y-auto rounded-2xl border-navy/10 bg-white p-6 sm:p-8">
        <DialogHeader>
          <span aria-hidden="true" className="mb-3 block h-px w-12 bg-taupe" />
          <DialogTitle className="pr-10 font-serif text-xl font-medium leading-snug text-navy">
            {title}
          </DialogTitle>
          <button
            type="button"
            onClick={onClose}
            className="absolute right-3 top-3 flex h-11 w-11 items-center justify-center rounded-full text-navy/70 transition hover:bg-sand hover:text-navy focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy"
            aria-label="Cerrar modal"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </DialogHeader>
        <div className="mt-4">{children}</div>
      </DialogContent>
    </Dialog>
  )
}
