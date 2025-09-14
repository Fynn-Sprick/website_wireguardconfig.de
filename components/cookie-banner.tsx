"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"

export function CookieBanner() {
  const [showBanner, setShowBanner] = useState(false)
  const [showAdvancedSettings, setShowAdvancedSettings] = useState(false)
  const [settings, setSettings] = useState({
    necessary: true, // Immer aktiviert
    analytics: false,
    advertising: false,
  })

  useEffect(() => {
    // Prüfe, ob der Benutzer bereits zugestimmt hat
    const cookieConsent = localStorage.getItem("cookie-consent")
    if (!cookieConsent) {
      setShowBanner(true)
    } else if (cookieConsent === "accepted") {
      // Lade gespeicherte Einstellungen
      const savedAnalytics = localStorage.getItem("analytics-consent")
      const savedAds = localStorage.getItem("ads-consent")

      setSettings({
        necessary: true,
        analytics: savedAnalytics === "accepted",
        advertising: savedAds === "accepted",
      })
    }
  }, [])

  const acceptAllCookies = () => {
    localStorage.setItem("cookie-consent", "accepted")
    localStorage.setItem("analytics-consent", "accepted")
    localStorage.setItem("ads-consent", "accepted")

    setSettings({
      necessary: true,
      analytics: true,
      advertising: true,
    })

    setShowBanner(false)

    // Seite neu laden, um Skripte zu aktivieren
    window.location.reload()
  }

  const saveSettings = () => {
    localStorage.setItem("cookie-consent", "accepted")
    localStorage.setItem("analytics-consent", settings.analytics ? "accepted" : "declined")
    localStorage.setItem("ads-consent", settings.advertising ? "accepted" : "declined")

    setShowBanner(false)

    // Seite neu laden, um Skripte zu aktivieren
    window.location.reload()
  }

  const declineAllCookies = () => {
    localStorage.setItem("cookie-consent", "declined")
    localStorage.setItem("analytics-consent", "declined")
    localStorage.setItem("ads-consent", "declined")

    setSettings({
      necessary: true,
      analytics: false,
      advertising: false,
    })

    setShowBanner(false)
  }

  const handleSettingChange = (setting: "analytics" | "advertising") => {
    setSettings((prev) => ({
      ...prev,
      [setting]: !prev[setting],
    }))
  }

  if (!showBanner) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-white border-t shadow-lg dark:bg-gray-800 dark:border-gray-700">
      <div className="container max-w-4xl mx-auto">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col items-start gap-4 md:items-center md:flex-row">
            <div className="flex-1">
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Diese Website verwendet Cookies, um Ihre Erfahrung zu verbessern und Ihnen relevante Werbung anzuzeigen.
                Sie können wählen, welche Cookies Sie akzeptieren möchten.
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => setShowAdvancedSettings(!showAdvancedSettings)}>
                Einstellungen
              </Button>
              <Button variant="outline" size="sm" onClick={declineAllCookies}>
                Ablehnen
              </Button>
              <Button size="sm" onClick={acceptAllCookies}>
                Alle akzeptieren
              </Button>
            </div>
          </div>

          {showAdvancedSettings && (
            <div className="p-4 mt-2 border rounded-md dark:border-gray-700">
              <h3 className="mb-3 text-sm font-medium">Cookie-Einstellungen</h3>

              <div className="space-y-3">
                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="necessary"
                      type="checkbox"
                      checked={settings.necessary}
                      disabled
                      className="w-4 h-4 border-gray-300 rounded text-emerald-600 focus:ring-emerald-500"
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label htmlFor="necessary" className="font-medium text-gray-700 dark:text-gray-200">
                      Notwendige Cookies
                    </label>
                    <p className="text-gray-500 dark:text-gray-400">
                      Diese Cookies sind für die Funktionalität der Website erforderlich und können nicht deaktiviert
                      werden.
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="analytics"
                      type="checkbox"
                      checked={settings.analytics}
                      onChange={() => handleSettingChange("analytics")}
                      className="w-4 h-4 border-gray-300 rounded text-emerald-600 focus:ring-emerald-500"
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label htmlFor="analytics" className="font-medium text-gray-700 dark:text-gray-200">
                      Analyse-Cookies
                    </label>
                    <p className="text-gray-500 dark:text-gray-400">
                      Diese Cookies helfen uns zu verstehen, wie Besucher mit unserer Website interagieren.
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="advertising"
                      type="checkbox"
                      checked={settings.advertising}
                      onChange={() => handleSettingChange("advertising")}
                      className="w-4 h-4 border-gray-300 rounded text-emerald-600 focus:ring-emerald-500"
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label htmlFor="advertising" className="font-medium text-gray-700 dark:text-gray-200">
                      Werbe-Cookies
                    </label>
                    <p className="text-gray-500 dark:text-gray-400">
                      Diese Cookies werden verwendet, um Ihnen relevante Werbung anzuzeigen (Google AdSense).
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex justify-end mt-4">
                <Button size="sm" onClick={saveSettings}>
                  Einstellungen speichern
                </Button>
              </div>
            </div>
          )}
        </div>

        <button
          onClick={() => setShowBanner(false)}
          className="absolute p-1 text-gray-500 rounded-full top-2 right-2 hover:bg-gray-100 dark:hover:bg-gray-700"
          aria-label="Schließen"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}
