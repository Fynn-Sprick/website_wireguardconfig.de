"use client"

import { useEffect, useState } from "react"
import { Moon, Sun } from "lucide-react"
import { Button } from "@/components/ui/button"

export function ThemeToggle() {
  const [isDarkMode, setIsDarkMode] = useState(false)

  // Initialisiere den Theme-Status beim ersten Laden
  useEffect(() => {
    // Prüfe, ob das Dokument existiert (Client-Side)
    if (typeof document !== "undefined") {
      // Prüfe, ob das Theme im localStorage gespeichert ist
      const savedTheme = localStorage.getItem("theme")

      // Prüfe, ob das System-Theme dunkel ist
      const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches

      // Setze das initiale Theme basierend auf localStorage oder System-Präferenz
      const initialIsDark = savedTheme === "dark" || (!savedTheme && systemPrefersDark)

      setIsDarkMode(initialIsDark)

      // Wende das Theme an
      if (initialIsDark) {
        document.documentElement.classList.add("dark")
      } else {
        document.documentElement.classList.remove("dark")
      }
    }
  }, [])

  // Funktion zum Umschalten des Themes
  const toggleTheme = () => {
    const newIsDarkMode = !isDarkMode
    setIsDarkMode(newIsDarkMode)

    // Speichere die Präferenz im localStorage
    localStorage.setItem("theme", newIsDarkMode ? "dark" : "light")

    // Wende das Theme auf das HTML-Element an
    if (newIsDarkMode) {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
  }

  return (
    <Button variant="outline" size="icon" className="rounded-full" onClick={toggleTheme} aria-label="Theme wechseln">
      {isDarkMode ? <Sun className="h-[1.2rem] w-[1.2rem]" /> : <Moon className="h-[1.2rem] w-[1.2rem]" />}
      <span className="sr-only">Theme wechseln</span>
    </Button>
  )
}
