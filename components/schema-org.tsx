import Script from "next/script"

export function SchemaOrg() {
  const schemaData = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "WireGuard Config Generator",
    description: "Erstellen Sie schnell und einfach sichere WireGuard-Konfigurationen für Ihre Server und Clients.",
    applicationCategory: "UtilityApplication",
    operatingSystem: "Any",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "EUR",
    },
    author: {
      "@type": "Organization",
      name: "WireGuard Config Generator",
      url: "https://wireguard-config-generator.example.com",
    },
  }

  return (
    <Script id="schema-org" type="application/ld+json">
      {JSON.stringify(schemaData)}
    </Script>
  )
}
