"use client"

import { useEffect, useState } from "react"
import Script from "next/script"

export function GoogleAdsense() {
  const [consentGiven, setConsentGiven] = useState(false)

  useEffect(() => {
    // Prüfe, ob der Benutzer der Verwendung von Cookies zugestimmt hat
    const cookieConsent = localStorage.getItem("cookie-consent")
    const adsConsent = localStorage.getItem("ads-consent")

    if (cookieConsent === "accepted" && adsConsent === "accepted") {
      setConsentGiven(true)
    }
  }, [])

  if (!consentGiven) {
    return null
  }

  return (
    <Script
      async
      src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7624147411924098"
      crossOrigin="anonymous"
      strategy="lazyOnload"
    />
  )
}
