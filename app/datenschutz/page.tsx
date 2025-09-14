import Link from "next/link"
import { ThemeToggle } from "@/components/theme-toggle"

export const metadata = {
  title: "Datenschutzerklärung | WireGuard Config Generator",
  description: "Datenschutzerklärung des WireGuard Config Generators. Erfahren Sie, wie wir mit Ihren Daten umgehen.",
}

export default function DatenschutzPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900">
      <div className="container px-4 py-8 mx-auto">
        <div className="flex items-center justify-between mb-8">
          <Link
            href="/"
            className="text-emerald-600 hover:text-emerald-700 dark:text-emerald-500 dark:hover:text-emerald-400"
          >
            ← Zurück zur Startseite
          </Link>
          <ThemeToggle />
        </div>

        <div className="max-w-4xl p-8 mx-auto bg-white rounded-lg shadow-md dark:bg-gray-800 dark:text-gray-100">
          <h1 className="mb-6 text-3xl font-bold">Datenschutzerklärung</h1>

          <div className="space-y-6">
            <section>
              <h2 className="mb-3 text-xl font-semibold">1. Allgemeine Informationen</h2>
              <p>
                Der Schutz Ihrer persönlichen Daten ist uns ein wichtiges Anliegen. Diese Datenschutzerklärung
                informiert Sie darüber, wie der WireGuard Config Generator mit Ihren Daten umgeht.
              </p>
            </section>

            <section>
              <h2 className="mb-3 text-xl font-semibold">2. Verantwortliche Stelle</h2>
              <p>
                Nexora IT Solutions
                Fynn Sprick
                <br />
                Schuhstr. 21
                32657 Lemgo
                <br />
                E-Mail: websites@nexora-it.eu
                Tel: 05261-9439989
              </p>
            </section>

            <section>
              <h2 className="mb-3 text-xl font-semibold">3. Datenverarbeitung</h2>
              <p>
                Der WireGuard Config Generator verarbeitet alle Konfigurationsdaten ausschließlich lokal in Ihrem
                Browser. Es werden keine personenbezogenen Daten an unsere Server übermittelt. Die generierten
                Konfigurationen und Schlüssel verbleiben auf Ihrem Gerät und werden nicht gespeichert, es sei denn, Sie
                speichern sie selbst.
              </p>
            </section>

            <section>
              <h2 className="mb-3 text-xl font-semibold">4. Cookies und lokale Speicherung</h2>
              <p>
                Wir verwenden technisch notwendige Cookies, um die Funktionalität der Website zu gewährleisten. Diese
                Cookies speichern keine personenbezogenen Daten und werden nur mit Ihrer Zustimmung gesetzt.
              </p>
              <p className="mt-2">
                Für die Speicherung von Einstellungen und Präferenzen nutzen wir den lokalen Speicher (localStorage)
                Ihres Browsers. Diese Daten verbleiben auf Ihrem Gerät und werden nicht an uns übermittelt.
              </p>
            </section>

            <section>
              <h2 className="mb-3 text-xl font-semibold">5. Google AdSense</h2>
              <p>
                Wir nutzen Google AdSense, einen Dienst zum Einbinden von Werbeanzeigen der Google LLC, 1600
                Amphitheatre Parkway, Mountain View, CA 94043, USA. Google AdSense verwendet Cookies und Web Beacons
                (unsichtbare Grafiken), über die Informationen wie der Besucherverkehr auf dieser Website gesammelt,
                gespeichert und ausgewertet werden können.
              </p>
              <p className="mt-2">
                Google AdSense speichert Cookies auf Ihrem Endgerät, über die Google Informationen über Ihre Nutzung
                unserer Website erhält. Google nutzt diese Informationen, um Ihre Nutzung unserer Website auszuwerten,
                um Reports über die Websiteaktivitäten für uns zusammenzustellen und um weitere mit der Websitenutzung
                und der Internetnutzung verbundene Dienstleistungen zu erbringen. Dabei können aus den verarbeiteten
                Daten pseudonyme Nutzungsprofile der Nutzer erstellt werden.
              </p>
              <p className="mt-2">
                Wir haben Google AdSense nur mit Ihrer Einwilligung aktiviert. Sie können Ihre Einwilligung jederzeit
                widerrufen, indem Sie Ihre Cookie-Einstellungen anpassen.
              </p>
              <p className="mt-2">
                Weitere Informationen zur Datenverarbeitung und Hinweise zum Datenschutz durch Google finden Sie unter:
                <a
                  href="https://policies.google.com/privacy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ml-1 text-emerald-600 hover:text-emerald-700 dark:text-emerald-500 dark:hover:text-emerald-400"
                >
                  https://policies.google.com/privacy
                </a>
              </p>
            </section>

            <section>
              <h2 className="mb-3 text-xl font-semibold">6. Ihre Rechte</h2>
              <p>
                Sie haben das Recht auf Auskunft, Berichtigung, Löschung und Einschränkung der Verarbeitung Ihrer
                personenbezogenen Daten. Zudem haben Sie das Recht, Ihre Einwilligung jederzeit zu widerrufen, ohne dass
                die Rechtmäßigkeit der aufgrund der Einwilligung bis zum Widerruf erfolgten Verarbeitung berührt wird.
              </p>
              <p className="mt-2">
                Für Anfragen bezüglich Ihrer Rechte kontaktieren Sie uns bitte unter den oben genannten Kontaktdaten.
              </p>
            </section>

            <section>
              <h2 className="mb-3 text-xl font-semibold">7. Änderungen dieser Datenschutzerklärung</h2>
              <p>
                Wir behalten uns vor, diese Datenschutzerklärung anzupassen, damit sie stets den aktuellen rechtlichen
                Anforderungen entspricht oder um Änderungen unserer Leistungen in der Datenschutzerklärung umzusetzen.
              </p>
            </section>

            <p className="pt-4 text-sm text-gray-600 dark:text-gray-400">Stand: {new Date().toLocaleDateString()}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
