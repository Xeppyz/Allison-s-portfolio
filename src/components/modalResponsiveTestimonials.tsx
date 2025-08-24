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
      <DialogContent className="max-w-lg mx-auto" style={{ backgroundColor: "#FBFCFF" }}>
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold pr-8" style={{ color: "#1E3A5F" }}>
            {title}
          </DialogTitle>
          <button
            onClick={onClose}
            className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none"
          >
            <X className="h-4 w-4" style={{ color: "#1E3A5F" }} />
          </button>
        </DialogHeader>
        <div className="mt-4">{children}</div>
      </DialogContent>
    </Dialog>
  )
}
