import { WireGuardConfigGenerator } from "@/components/wireguard-config-generator"
import { ThemeToggle } from "@/components/theme-toggle"
import { SchemaOrg } from "@/components/schema-org"
import { AdBanner } from "@/components/ad-banner"
import Link from "next/link"

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900">
      <SchemaOrg />
      <header className="container px-4 py-8 mx-auto">
        <div className="flex justify-end mb-4">
          <ThemeToggle />
        </div>

        <div className="py-12 text-center">
          <div className="inline-flex items-center justify-center p-2 mb-4 bg-white rounded-full shadow-sm dark:bg-gray-800">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-6 h-6 text-emerald-500"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl dark:text-gray-100">
            WireGuard Config Generator
          </h1>
          <p className="max-w-2xl mx-auto mt-6 text-xl text-gray-600 dark:text-gray-200">
            Erstellen Sie schnell und einfach sichere WireGuard-Konfigurationen für Ihren Server und mehrere Clients.
          </p>
        </div>
      </header>

      <main className="container px-4 mx-auto">
        {/* Werbebanner oben */}
        <div className="max-w-4xl mx-auto mb-6">
          <AdBanner adSlot="1234567890" format="horizontal" />
        </div>

        <div className="max-w-4xl p-6 mx-auto mt-8 bg-white rounded-lg shadow-md dark:bg-gray-800 dark:text-gray-100">
          <WireGuardConfigGenerator />
        </div>

        {/* Werbebanner unten */}
        <div className="max-w-4xl mx-auto mt-8">
          <AdBanner adSlot="0987654321" format="rectangle" className="mx-auto" />
        </div>
      </main>

      <footer className="container px-4 py-8 mx-auto mt-12">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 gap-8 py-6 border-t border-gray-200 md:grid-cols-3 dark:border-gray-700">
            <div>
              <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-gray-100">Über uns</h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Der WireGuard Config Generator ist ein kostenloses Tool, das Ihnen hilft, sichere VPN-Konfigurationen zu
                erstellen. Alle Daten werden lokal in Ihrem Browser verarbeitet und nicht an Server übertragen.
              </p>
            </div>
            <div>
              <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-gray-100">Rechtliches</h2>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <li>
                  <Link href="/datenschutz" className="hover:text-emerald-500 dark:hover:text-emerald-400">
                    Datenschutzerklärung
                  </Link>
                </li>
                <li>
                  <Link href="/impressum" className="hover:text-emerald-500 dark:hover:text-emerald-400">
                    Impressum
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-gray-100">Hinweise</h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                WireGuard® ist eine eingetragene Marke von Jason A. Donenfeld. Dieser Generator ist nicht mit dem
                offiziellen WireGuard-Projekt verbunden.
              </p>
            </div>
          </div>
          <div className="py-4 text-center text-sm text-gray-600 border-t border-gray-200 dark:text-gray-400 dark:border-gray-700">
            <p>© {new Date().getFullYear()} WireGuard Config Generator - Alle Rechte vorbehalten</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
