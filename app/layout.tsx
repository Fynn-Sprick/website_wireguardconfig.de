import type React from "react"
import "@/app/globals.css"
import { Inter } from "next/font/google"
import { ToastContainer } from "@/components/ui/toast-container"
import { CookieBanner } from "@/components/cookie-banner"
import { GoogleAdsense } from "@/components/google-adsense"
import type { Metadata } from "next"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "WireGuard Config Generator | Sichere VPN-Konfigurationen erstellen",
  description:
    "Erstellen Sie schnell und einfach sichere WireGuard-Konfigurationen für Ihre Server und Clients. Kostenlos, sicher und datenschutzkonform.",
  keywords: "WireGuard, VPN, Konfiguration, Generator, Sicherheit, Datenschutz, Server, Client",
  authors: [{ name: "WireGuard Config Generator" }],
  creator: "WireGuard Config Generator",
  publisher: "WireGuard Config Generator",
  robots: "index, follow",
  openGraph: {
    title: "WireGuard Config Generator | Sichere VPN-Konfigurationen erstellen",
    description:
      "Erstellen Sie schnell und einfach sichere WireGuard-Konfigurationen für Ihre Server und Clients. Kostenlos, sicher und datenschutzkonform.",
    url: "https://wireguard-config-generator.example.com",
    siteName: "WireGuard Config Generator",
    locale: "de_DE",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "WireGuard Config Generator | Sichere VPN-Konfigurationen erstellen",
    description:
      "Erstellen Sie schnell und einfach sichere WireGuard-Konfigurationen für Ihre Server und Clients. Kostenlos, sicher und datenschutzkonform.",
  },
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="de" suppressHydrationWarning>
      <head>
        <link rel="canonical" href="https://wireguard-config-generator.example.com" />
        <meta name="theme-color" content="#10b981" />
      </head>
      <body className={inter.className}>
        <GoogleAdsense />
        {children}
        <ToastContainer />
        <CookieBanner />
      </body>
    </html>
  )
}
