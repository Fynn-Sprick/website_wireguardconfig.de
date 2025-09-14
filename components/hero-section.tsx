import { Shield, Server, Laptop } from "lucide-react"

export function HeroSection() {
  return (
    <div className="py-12 text-center">
      <div className="inline-flex items-center justify-center p-2 mb-4 bg-white rounded-full shadow-sm dark:bg-gray-800">
        <Shield className="w-6 h-6 text-emerald-500" />
      </div>
      <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl dark:text-gray-100">
        WireGuard Config Generator
      </h1>
      <p className="max-w-2xl mx-auto mt-6 text-xl text-gray-600 dark:text-gray-200">
        Erstellen Sie schnell und einfach sichere WireGuard-Konfigurationen für Ihre Server und Clients.
      </p>

      <div className="grid max-w-3xl grid-cols-1 gap-8 mx-auto mt-12 sm:grid-cols-2">
        <div className="p-6 bg-white rounded-lg shadow-sm dark:bg-gray-700">
          <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 bg-emerald-100 rounded-full dark:bg-emerald-900">
            <Server className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">Server Konfiguration</h3>
          <p className="mt-2 text-gray-600 dark:text-gray-300">
            Generieren Sie eine vollständige Serverkonfiguration mit anpassbaren Netzwerkeinstellungen.
          </p>
        </div>

        <div className="p-6 bg-white rounded-lg shadow-sm dark:bg-gray-700">
          <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 bg-emerald-100 rounded-full dark:bg-emerald-900">
            <Laptop className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">Client Konfiguration</h3>
          <p className="mt-2 text-gray-600 dark:text-gray-300">
            Erstellen Sie Client-Konfigurationen, die sich nahtlos mit Ihrem WireGuard-Server verbinden.
          </p>
        </div>
      </div>
    </div>
  )
}
