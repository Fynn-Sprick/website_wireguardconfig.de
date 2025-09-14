"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Clipboard, Download, QrCode } from "lucide-react"
import { generateKeyPair } from "@/lib/wireguard-crypto"
import { toast } from "@/components/ui/toast-container"
import { QRCodeGenerator } from "@/components/qr-code-generator"
import JSZip from "jszip"

interface WireGuardConfig {
  name: string
  type: "server" | "client"
  content: string
  showQrCode?: boolean
}

export function WireGuardConfigGenerator() {
  const [configs, setConfigs] = useState<WireGuardConfig[]>([])
  const [useDns, setUseDns] = useState(true)
  const [formData, setFormData] = useState({
    serverAddress: "10.0.0.1/24",
    serverPort: "51820",
    serverEndpoint: "",
    dnsServer: "1.1.1.1",
    mtu: "1420",
    clientCount: "3",
    serverPrivateKey: "",
    serverPublicKey: "",
  })

  // Automatisch Schlüssel generieren, wenn die Komponente geladen wird
  useEffect(() => {
    async function generateInitialKeys() {
      try {
        const { privateKey, publicKey } = await generateKeyPair()
        setFormData((prev) => ({
          ...prev,
          serverPrivateKey: privateKey,
          serverPublicKey: publicKey,
        }))
      } catch (error) {
        console.error("Fehler bei der Schlüsselgenerierung:", error)
      }
    }

    generateInitialKeys()
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.serverPrivateKey || !formData.serverPublicKey) {
      toast({
        title: "Fehlende Schlüssel",
        description: "Es wurden keine Server-Schlüssel generiert. Bitte laden Sie die Seite neu.",
        variant: "destructive",
      })
      return
    }

    if (!formData.serverEndpoint) {
      toast({
        title: "Fehlende Server-IP",
        description: "Bitte geben Sie die öffentliche IP-Adresse oder den Hostnamen des Servers ein.",
        variant: "destructive",
      })
      return
    }

    const clientCount = Number.parseInt(formData.clientCount, 10)
    if (isNaN(clientCount) || clientCount < 1) {
      toast({
        title: "Ungültige Anzahl von Clients",
        description: "Bitte geben Sie eine gültige Anzahl von Clients ein (mindestens 1).",
        variant: "destructive",
      })
      return
    }

    // Generiere die Server-Konfiguration
    const serverConfig = generateServerConfig(formData, useDns)

    // Generiere Client-Konfigurationen
    const clientConfigs: WireGuardConfig[] = []

    for (let i = 0; i < clientCount; i++) {
      try {
        // Generiere ein Schlüsselpaar für den Client
        const { privateKey, publicKey } = await generateKeyPair()

        // Extrahiere die Basis-IP aus der Server-Adresse
        const baseIp = formData.serverAddress.split("/")[0].split(".")
        baseIp[3] = (i + 2).toString() // Client IPs beginnen bei .2
        const clientIp = `${baseIp.join(".")}/${formData.serverAddress.split("/")[1]}`

        // Generiere die Client-Konfiguration
        const clientConfig = generateClientConfig({
          clientName: `client${i + 1}`,
          clientAddress: clientIp,
          clientPrivateKey: privateKey,
          clientPublicKey: publicKey,
          serverPublicKey: formData.serverPublicKey,
          serverEndpoint: formData.serverEndpoint,
          serverPort: formData.serverPort,
          mtu: formData.mtu,
          dnsServer: formData.dnsServer,
          useDns,
        })

        clientConfigs.push({
          name: `Client ${i + 1}`,
          type: "client",
          content: clientConfig,
          showQrCode: false,
        })

        // Füge den Client zur Server-Konfiguration hinzu
        serverConfig.content += `\n# Client ${i + 1}\n[Peer]\nPublicKey = ${publicKey}\nAllowedIPs = ${clientIp.split("/")[0]}/32\n`
      } catch (error) {
        console.error(`Fehler bei der Generierung von Client ${i + 1}:`, error)
      }
    }

    // Setze alle Konfigurationen
    setConfigs([serverConfig, ...clientConfigs])

    toast({
      title: "Konfigurationen erstellt",
      description: `Es wurden ${clientCount + 1} Konfigurationen erstellt (1 Server, ${clientCount} Clients).`,
    })
  }

  const generateServerConfig = (data: typeof formData, useDns: boolean): WireGuardConfig => {
    const config = `# WireGuard Server Konfiguration
# Generiert von WireGuard Config Generator
# Datum: ${new Date().toLocaleString()}

[Interface]
Address = ${data.serverAddress}
ListenPort = ${data.serverPort}
PrivateKey = ${data.serverPrivateKey}
${useDns ? `DNS = ${data.dnsServer}` : ""}
MTU = ${data.mtu}

# Client-Konfigurationen:
`

    return {
      name: "Server",
      type: "server",
      content: config,
    }
  }

  const generateClientConfig = (data: {
    clientName: string
    clientAddress: string
    clientPrivateKey: string
    clientPublicKey: string
    serverPublicKey: string
    serverEndpoint: string
    serverPort: string
    mtu: string
    dnsServer: string
    useDns: boolean
  }): string => {
    return `# WireGuard Client Konfiguration für ${data.clientName}
# Generiert von WireGuard Config Generator
# Datum: ${new Date().toLocaleString()}

[Interface]
PrivateKey = ${data.clientPrivateKey}
Address = ${data.clientAddress}
${data.useDns ? `DNS = ${data.dnsServer}` : ""}
MTU = ${data.mtu}

[Peer]
PublicKey = ${data.serverPublicKey}
Endpoint = ${data.serverEndpoint}:${data.serverPort}
AllowedIPs = 0.0.0.0/0, ::/0
PersistentKeepalive = 25
`
  }

  const copyToClipboard = (content: string) => {
    navigator.clipboard.writeText(content)
    toast({
      title: "Kopiert",
      description: "Die Konfiguration wurde in die Zwischenablage kopiert.",
    })
  }

  const downloadConfig = (name: string, content: string) => {
    const blob = new Blob([content], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `wg-${name.toLowerCase().replace(/\s+/g, "-")}.conf`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)

    toast({
      title: "Download gestartet",
      description: `Die Konfigurationsdatei "${name}" wird heruntergeladen.`,
    })
  }

  const downloadAllConfigs = async () => {
    try {
      // Erstelle ein neues ZIP-Archiv
      const zip = new JSZip()

      // Füge jede Konfiguration als separate Datei hinzu
      configs.forEach((config) => {
        const fileName = `wg-${config.name.toLowerCase().replace(/\s+/g, "-")}.conf`
        zip.file(fileName, config.content)
      })

      // Generiere die ZIP-Datei
      const content = await zip.generateAsync({ type: "blob" })

      // Erstelle einen Download-Link und klicke darauf
      const url = URL.createObjectURL(content)
      const a = document.createElement("a")
      a.href = url
      a.download = "wireguard-configs.zip"
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)

      toast({
        title: "Download gestartet",
        description: "Alle Konfigurationen werden als ZIP-Datei heruntergeladen.",
      })
    } catch (error) {
      console.error("Fehler beim Erstellen der ZIP-Datei:", error)
      toast({
        title: "Fehler",
        description: "Beim Erstellen der ZIP-Datei ist ein Fehler aufgetreten.",
        variant: "destructive",
      })
    }
  }

  const toggleQrCode = (index: number) => {
    setConfigs((prev) =>
      prev.map((config, i) => {
        if (i === index && config.type === "client") {
          return { ...config, showQrCode: !config.showQrCode }
        }
        return config
      }),
    )
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="mb-4 text-2xl font-bold">WireGuard Konfigurationen generieren</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="serverAddress">Server CIDR</Label>
              <Input
                id="serverAddress"
                name="serverAddress"
                value={formData.serverAddress}
                onChange={handleChange}
                placeholder="10.0.0.1/24"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="serverEndpoint">Server IP / Hostname</Label>
              <Input
                id="serverEndpoint"
                name="serverEndpoint"
                value={formData.serverEndpoint}
                onChange={handleChange}
                placeholder="beispiel.de oder 123.123.123.123"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="serverPort">Port</Label>
              <Input
                id="serverPort"
                name="serverPort"
                value={formData.serverPort}
                onChange={handleChange}
                placeholder="51820"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="mtu">MTU</Label>
              <Input id="mtu" name="mtu" value={formData.mtu} onChange={handleChange} placeholder="1420" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="clientCount">Anzahl der Clients</Label>
              <Input
                id="clientCount"
                name="clientCount"
                type="number"
                min="1"
                max="100"
                value={formData.clientCount}
                onChange={handleChange}
                placeholder="3"
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="dnsServer">DNS-Server</Label>
              <div className="flex items-center space-x-2">
                <Switch id="dns-switch" checked={useDns} onCheckedChange={setUseDns} />
                <Label htmlFor="dns-switch" className="text-sm font-normal">
                  {useDns ? "Aktiviert" : "Deaktiviert"}
                </Label>
              </div>
            </div>
            {useDns && (
              <Input
                id="dnsServer"
                name="dnsServer"
                value={formData.dnsServer}
                onChange={handleChange}
                placeholder="1.1.1.1"
                disabled={!useDns}
              />
            )}
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="serverPrivateKey">Server Private Key</Label>
              <div className="relative">
                <Input
                  id="serverPrivateKey"
                  name="serverPrivateKey"
                  value={formData.serverPrivateKey}
                  onChange={handleChange}
                  placeholder="Privater Schlüssel"
                  type="password"
                  className="pr-10"
                  readOnly
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full"
                  onClick={() => {
                    const input = document.getElementById("serverPrivateKey") as HTMLInputElement
                    if (input) {
                      input.type = input.type === "password" ? "text" : "password"
                    }
                  }}
                >
                  <span className="sr-only">Schlüssel anzeigen/verbergen</span>
                  👁️
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="serverPublicKey">Server Public Key</Label>
              <Input
                id="serverPublicKey"
                name="serverPublicKey"
                value={formData.serverPublicKey}
                onChange={handleChange}
                placeholder="Öffentlicher Schlüssel"
                readOnly
              />
            </div>
          </div>

          <div className="flex gap-4">
            <Button type="submit">Konfigurationen erstellen</Button>
          </div>
        </form>
      </div>

      {configs.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Generierte Konfigurationen</h2>
            <Button variant="outline" onClick={downloadAllConfigs}>
              <Download className="w-4 h-4 mr-2" />
              Alle herunterladen (ZIP)
            </Button>
          </div>

          <Tabs defaultValue="server" className="w-full">
            <TabsList className="mb-4">
              {configs.map((config, index) => (
                <TabsTrigger key={index} value={config.name.toLowerCase().replace(/\s+/g, "-")}>
                  {config.name}
                </TabsTrigger>
              ))}
            </TabsList>

            {configs.map((config, index) => (
              <TabsContent key={index} value={config.name.toLowerCase().replace(/\s+/g, "-")}>
                <Card className="dark:bg-gray-700 dark:text-gray-100">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-lg font-medium dark:text-gray-100">{config.name} Konfiguration</h3>
                      <div className="flex gap-2">
                        <Button size="sm" variant="ghost" onClick={() => copyToClipboard(config.content)}>
                          <Clipboard className="w-4 h-4 mr-2" />
                          Kopieren
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => downloadConfig(config.name, config.content)}>
                          <Download className="w-4 h-4 mr-2" />
                          Download
                        </Button>
                        {config.type === "client" && (
                          <Button size="sm" variant="ghost" onClick={() => toggleQrCode(index)}>
                            <QrCode className="w-4 h-4 mr-2" />
                            QR-Code
                          </Button>
                        )}
                      </div>
                    </div>

                    {config.type === "client" && config.showQrCode ? (
                      <div className="flex flex-col items-center justify-center p-4 bg-white dark:bg-gray-800">
                        <div className="p-4 border rounded dark:border-gray-600">
                          <QRCodeGenerator text={config.content} size={250} />
                          <p className="mt-2 text-xs text-center text-gray-500 dark:text-gray-400">
                            Scannen Sie diesen QR-Code mit der WireGuard-App
                          </p>
                        </div>
                      </div>
                    ) : (
                      <Textarea
                        className="h-[300px] font-mono text-sm dark:bg-gray-800 dark:text-gray-200"
                        value={config.content}
                        readOnly
                      />
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            ))}
          </Tabs>
        </div>
      )}
    </div>
  )
}
