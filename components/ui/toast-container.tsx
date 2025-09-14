"use client"

import { useEffect, useState } from "react"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"

export type ToastProps = {
  id: string
  title?: string
  description?: string
  variant?: "default" | "destructive"
}

// Globaler Event-Emitter für Toasts
type ToastEvent = {
  type: "add" | "remove"
  toast?: ToastProps
  id?: string
}

const toastEvents: ToastEvent[] = []
let listeners: (() => void)[] = []

const emitToastEvent = (event: ToastEvent) => {
  toastEvents.push(event)
  listeners.forEach((listener) => listener())
}

export const toast = (props: Omit<ToastProps, "id">) => {
  const id = Math.random().toString(36).substring(2, 9)
  emitToastEvent({ type: "add", toast: { ...props, id } })

  // Automatisch nach 5 Sekunden entfernen
  setTimeout(() => {
    emitToastEvent({ type: "remove", id })
  }, 5000)

  return id
}

export const dismissToast = (id: string) => {
  emitToastEvent({ type: "remove", id })
}

export function ToastContainer() {
  const [toasts, setToasts] = useState<ToastProps[]>([])

  useEffect(() => {
    const handleToastEvents = () => {
      // Verarbeite alle ausstehenden Events
      while (toastEvents.length > 0) {
        const event = toastEvents.shift()
        if (!event) continue

        if (event.type === "add" && event.toast) {
          setToasts((prev) => [...prev, event.toast!])
        } else if (event.type === "remove" && event.id) {
          setToasts((prev) => prev.filter((t) => t.id !== event.id))
        }
      }
    }

    // Füge den Listener hinzu
    listeners.push(handleToastEvents)

    // Entferne den Listener beim Unmount
    return () => {
      listeners = listeners.filter((l) => l !== handleToastEvents)
    }
  }, [])

  if (toasts.length === 0) return null

  return (
    <div className="fixed bottom-0 right-0 z-50 flex flex-col items-end p-4 space-y-4">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={cn(
            "flex w-full max-w-md overflow-hidden rounded-lg shadow-lg transition-all animate-in slide-in-from-right-full",
            "bg-white dark:bg-gray-800 border",
            toast.variant === "destructive"
              ? "border-red-500 dark:border-red-600"
              : "border-gray-200 dark:border-gray-700",
          )}
        >
          <div className={cn("w-2", toast.variant === "destructive" ? "bg-red-500" : "bg-emerald-500")} />
          <div className="flex-1 p-4">
            {toast.title && (
              <h3
                className={cn(
                  "font-medium",
                  toast.variant === "destructive"
                    ? "text-red-500 dark:text-red-400"
                    : "text-gray-900 dark:text-gray-100",
                )}
              >
                {toast.title}
              </h3>
            )}
            {toast.description && <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">{toast.description}</p>}
          </div>
          <button
            onClick={() => dismissToast(toast.id)}
            className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <X className="w-4 h-4" />
            <span className="sr-only">Schließen</span>
          </button>
        </div>
      ))}
    </div>
  )
}
