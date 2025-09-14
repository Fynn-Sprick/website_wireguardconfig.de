"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Clipboard, Download, QrCode, RefreshCw } from "lucide-react"
import { generateClientConfig } from "@/lib/wireguard-utils"
import { generateKeyPair } from "@/lib/wireguard-crypto"
import { toast } from "@/components/ui/toast-container"
import { QRCodeGenerator } from "@/components/qr-code-generator"

export function ClientConfigForm() {
  const [clientConfig, setClientConfig] = useState("")
  const [showQrCode, setShowQrCode] = useState(false)
  const [isGeneratingKeys, setIsGeneratingKeys] = useState(false)
  const [useDns, setUseDns] = useState(true)
  const [formData, setFormData] = useState({
    clientName: "smartphone",
    clientAddress: "10.0.0.2/24",
    serverPublicKey: "",
    serverEndpoint: "",
    serverPort: "51820",
    allowedIPs: "0.0.0.0/0, ::/0",
    keepAlive: "25",
    privateKey: "",
    publicKey: "",
    dns: "1.1.1.1",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const generateKeys = async () => {
    try {
      setIsGeneratingKeys(true)

      // Generiere ein neues Schlüsselpaar mit der WireGuard-Kryptographie
      const { privateKey, publicKey } = await generateKeyPair()

      setFormData((prev) => ({
        ...prev,
        privateKey,
        publicKey,
      }))
    } catch (error) {
      console.error("Fehler bei der Schlüsselgenerierung:", error)
    } finally {
      setIsGeneratingKeys(false)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.privateKey || !formData.publicKey) {
      toast({
        title: "Fehlende Schlüssel",
        description: "Bitte generieren Sie zuerst ein Schlüsselpaar.",
        variant: "destructive",
      })
      return
    }

    if (!formData.serverPublicKey) {
      toast({
        title: "Fehlender Server-Schlüssel",
        description: "Bitte geben Sie den öffentlichen Schlüssel des Servers ein.",
        variant: "destructive",
      })
      return
    }

    if (!formData.serverEndpoint) {
      toast({
        title: "Fehlender Server-Endpoint",
        description: "Bitte geben Sie den Endpunkt des Servers ein.",
        variant: "destructive",
      })
      return
    }

    const config = generateClientConfig({
      ...formData,
      useDns,
    })
    setClientConfig(config)

    toast({
      title: "Konfiguration erstellt",
      description: "Die WireGuard-Clientkonfiguration wurde erfolgreich erstellt.",
    })
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(clientConfig)
    toast({
      title: "Kopiert",
      description: "Die Konfiguration wurde in die Zwischenablage kopiert.",
    })
  }

  const downloadConfig = () => {
    const blob = new Blob([clientConfig], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `wg-${formData.clientName}.conf`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)

    toast({
      title: "Download gestartet",
      description: "Die Konfigurationsdatei wird heruntergeladen.",
    })
  }

  const toggleQrCode = () => {
    setShowQrCode(!showQrCode)
  }

  return (
    <div className="grid gap-8 md:grid-cols-2">
      <div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="clientName">Client Name</Label>
            <Input
              id="clientName"
              name="clientName"
              value={formData.clientName}
              onChange={handleChange}
              placeholder="smartphone"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="clientAddress">Client IP-Adresse</Label>
            <Input
              id="clientAddress"
              name="clientAddress"
              value={formData.clientAddress}
              onChange={handleChange}
              placeholder="10.0.0.2/24"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="serverPublicKey">Server Public Key</Label>
            <Input
              id="serverPublicKey"
              name="serverPublicKey"
              value={formData.serverPublicKey}
              onChange={handleChange}
              placeholder="Server Public Key"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="serverEndpoint">Server Endpoint</Label>
              <Input
                id="serverEndpoint"
                name="serverEndpoint"
                value={formData.serverEndpoint}
                onChange={handleChange}
                placeholder="example.com oder IP"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="serverPort">Server Port</Label>
              <Input
                id="serverPort"
                name="serverPort"
                value={formData.serverPort}
                onChange={handleChange}
                placeholder="51820"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="allowedIPs">Allowed IPs</Label>
            <Input
              id="allowedIPs"
              name="allowedIPs"
              value={formData.allowedIPs}
              onChange={handleChange}
              placeholder="0.0.0.0/0, ::/0"
            />
            <p className="text-xs text-gray-500 dark:text-gray-400">
              0.0.0.0/0 leitet den gesamten Verkehr über WireGuard (VPN)
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="dns">DNS-Server</Label>
              <div className="flex items-center space-x-2">
                <Switch id="dns-switch-client" checked={useDns} onCheckedChange={setUseDns} />
                <Label htmlFor="dns-switch-client" className="text-sm font-normal">
                  {useDns ? "Aktiviert" : "Deaktiviert"}
                </Label>
              </div>
            </div>
            {useDns && (
              <Input
                id="dns"
                name="dns"
                value={formData.dns}
                onChange={handleChange}
                placeholder="1.1.1.1"
                disabled={!useDns}
              />
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="keepAlive">PersistentKeepalive (Sekunden)</Label>
            <Input
              id="keepAlive"
              name="keepAlive"
              value={formData.keepAlive}
              onChange={handleChange}
              placeholder="25"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="clientPrivateKey">Private Key</Label>
              <div className="relative">
                <Input
                  id="clientPrivateKey"
                  name="privateKey"
                  value={formData.privateKey}
                  onChange={handleChange}
                  placeholder="Privater Schlüssel"
                  type="password"
                  className="pr-10"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full"
                  onClick={() => {
                    const input = document.getElementById("clientPrivateKey") as HTMLInputElement
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
              <Label htmlFor="clientPublicKey">Public Key</Label>
              <Input
                id="clientPublicKey"
                name="publicKey"
                value={formData.publicKey}
                onChange={handleChange}
                placeholder="Öffentlicher Schlüssel"
                readOnly
              />
            </div>
          </div>

          <div className="flex gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={generateKeys}
              disabled={isGeneratingKeys}
              className="flex items-center"
            >
              {isGeneratingKeys && <RefreshCw className="w-4 h-4 mr-2 animate-spin" />}
              Schlüssel generieren
            </Button>
            <Button type="submit">Konfiguration erstellen</Button>
          </div>
        </form>
      </div>

      <div>
        {clientConfig ? (
          <Card className="dark:bg-gray-700 dark:text-gray-100">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-medium dark:text-gray-100">Client Konfiguration</h3>
                <div className="flex gap-2">
                  <Button size="sm" variant="ghost" onClick={copyToClipboard}>
                    <Clipboard className="w-4 h-4 mr-2" />
                    Kopieren
                  </Button>
                  <Button size="sm" variant="ghost" onClick={downloadConfig}>
                    <Download className="w-4 h-4 mr-2" />
                    Download
                  </Button>
                  <Button size="sm" variant="ghost" onClick={toggleQrCode}>
                    <QrCode className="w-4 h-4 mr-2" />
                    QR-Code
                  </Button>
                </div>
              </div>

              {showQrCode ? (
                <div className="flex flex-col items-center justify-center p-4 bg-white dark:bg-gray-800">
                  <div className="p-4 border rounded dark:border-gray-600">
                    <QRCodeGenerator text={clientConfig} size={250} />
                    <p className="mt-2 text-xs text-center text-gray-500 dark:text-gray-400">
                      Scannen Sie diesen QR-Code mit der WireGuard-App
                    </p>
                  </div>
                </div>
              ) : (
                <Textarea
                  className="h-[300px] font-mono text-sm dark:bg-gray-800 dark:text-gray-200"
                  value={clientConfig}
                  readOnly
                />
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-500 dark:text-gray-300">
              Füllen Sie das Formular aus und klicken Sie auf "Konfiguration erstellen", um eine
              WireGuard-Clientkonfiguration zu generieren.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
