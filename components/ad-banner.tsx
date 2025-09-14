"use client"

import { useEffect, useState } from "react"

interface AdBannerProps {
  adSlot: string
  format?: "auto" | "horizontal" | "vertical" | "rectangle"
  className?: string
}

export function AdBanner({ adSlot, format = "auto", className = "" }: AdBannerProps) {
  const [adsEnabled, setAdsEnabled] = useState(false)

  useEffect(() => {
    // Prüfe, ob der Benutzer der Verwendung von Werbe-Cookies zugestimmt hat
    const cookieConsent = localStorage.getItem("cookie-consent")
    const adsConsent = localStorage.getItem("ads-consent")

    if (cookieConsent === "accepted" && adsConsent === "accepted") {
      setAdsEnabled(true)
    }
  }, [])

  useEffect(() => {
    // Initialisiere AdSense, wenn Anzeigen aktiviert sind
    if (adsEnabled && typeof window !== "undefined") {
      try {
        // @ts-ignore
        ;(window.adsbygoogle = window.adsbygoogle || []).push({})
      } catch (error) {
        console.error("AdSense-Fehler:", error)
      }
    }
  }, [adsEnabled])

  if (!adsEnabled) {
    return null
  }

  let formatClass = "block"
  switch (format) {
    case "horizontal":
      formatClass = "block w-full h-[90px]"
      break
    case "vertical":
      formatClass = "block w-[160px] h-[600px]"
      break
    case "rectangle":
      formatClass = "block w-[300px] h-[250px]"
      break
    default:
      formatClass = "block w-full"
  }

  return (
    <div className={`${formatClass} ${className} overflow-hidden`}>
      <ins
        className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-client="ca-pub-7624147411924098"
        data-ad-slot={adSlot}
        data-ad-format={format}
        data-full-width-responsive="true"
      ></ins>
    </div>
  )
}
