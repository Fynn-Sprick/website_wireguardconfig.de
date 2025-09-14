import Link from "next/link"
import { ThemeToggle } from "@/components/theme-toggle"

export const metadata = {
  title: "Impressum | WireGuard Config Generator",
  description:
    "Impressum des WireGuard Config Generators. Hier finden Sie alle rechtlich erforderlichen Angaben zum Betreiber.",
}

export default function ImpressumPage() {
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
          <h1 className="mb-6 text-3xl font-bold">Impressum</h1>

          <div className="space-y-6">
            <section>
              <h2 className="mb-3 text-xl font-semibold">Angaben gemäß § 5 TMG</h2>
              <p>
                Nexora IT Solutions
                Fynn Sprick
                <br />
                Schuhstr. 21
                <br />
                32657 Lemgo
              </p>
            </section>

            <section>
              <h2 className="mb-3 text-xl font-semibold">Kontakt</h2>
              <p>
                Telefon: 05261-9439989
                <br />
                E-Mail: websites@nexora-it.eu
              </p>
            </section>

            <section>
              <h2 className="mb-3 text-xl font-semibold">Verantwortlich für den Inhalt nach § 55 Abs. 2 RStV</h2>
              <p>
                Fynn Sprick
                <br />
                Schuhstr. 21
                <br />
                32657 Lemgo
              </p>
            </section>

            <section>
              <h2 className="mb-3 text-xl font-semibold">Haftungsausschluss</h2>
              <h3 className="mb-2 font-medium">Haftung für Inhalte</h3>
              <p className="mb-3">
                Die Inhalte unserer Seiten wurden mit größter Sorgfalt erstellt. Für die Richtigkeit, Vollständigkeit
                und Aktualität der Inhalte können wir jedoch keine Gewähr übernehmen.
              </p>

              <h3 className="mb-2 font-medium">Haftung für Links</h3>
              <p>
                Unser Angebot enthält Links zu externen Webseiten Dritter, auf deren Inhalte wir keinen Einfluss haben.
                Deshalb können wir für diese fremden Inhalte auch keine Gewähr übernehmen. Für die Inhalte der
                verlinkten Seiten ist stets der jeweilige Anbieter oder Betreiber der Seiten verantwortlich.
              </p>
            </section>

            <section>
              <h2 className="mb-3 text-xl font-semibold">Urheberrecht</h2>
              <p>
                Die durch die Seitenbetreiber erstellten Inhalte und Werke auf diesen Seiten unterliegen dem deutschen
                Urheberrecht. Die Vervielfältigung, Bearbeitung, Verbreitung und jede Art der Verwertung außerhalb der
                Grenzen des Urheberrechtes bedürfen der schriftlichen Zustimmung des jeweiligen Autors bzw. Erstellers.
              </p>
            </section>

            <section>
              <h2 className="mb-3 text-xl font-semibold">Markenrecht</h2>
              <p>
                WireGuard® ist eine eingetragene Marke von Jason A. Donenfeld. Dieser Generator ist nicht mit dem
                offiziellen WireGuard-Projekt verbunden.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}
