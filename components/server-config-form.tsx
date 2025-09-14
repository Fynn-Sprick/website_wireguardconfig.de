"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Clipboard, Download, RefreshCw } from "lucide-react"
import { Switch } from "@/components/ui/switch"
import { generateServerConfig } from "@/lib/wireguard-utils"
import { generateKeyPair } from "@/lib/wireguard-crypto"
import { toast } from "@/components/ui/toast-container"

export function ServerConfigForm() {
  const [serverConfig, setServerConfig] = useState("")
  const [isGeneratingKeys, setIsGeneratingKeys] = useState(false)
  const [useDns, setUseDns] = useState(true)
  const [formData, setFormData] = useState({
    serverAddress: "10.0.0.1/24",
    serverPort: "51820",
    dnsServer: "1.1.1.1",
    privateKey: "",
    publicKey: "",
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

    const config = generateServerConfig({
      ...formData,
      useDns,
    })
    setServerConfig(config)

    toast({
      title: "Konfiguration erstellt",
      description: "Die WireGuard-Serverkonfiguration wurde erfolgreich erstellt.",
    })
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(serverConfig)
    toast({
      title: "Kopiert",
      description: "Die Konfiguration wurde in die Zwischenablage kopiert.",
    })
  }

  const downloadConfig = () => {
    const blob = new Blob([serverConfig], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "wg-server.conf"
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)

    toast({
      title: "Download gestartet",
      description: "Die Konfigurationsdatei wird heruntergeladen.",
    })
  }

  return (
    <div className="grid gap-8 md:grid-cols-2">
      <div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="serverAddress">Server IP-Adresse</Label>
            <Input
              id="serverAddress"
              name="serverAddress"
              value={formData.serverAddress}
              onChange={handleChange}
              placeholder="10.0.0.1/24"
            />
          </div>

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

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="privateKey">Private Key</Label>
              <div className="relative">
                <Input
                  id="privateKey"
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
                    const input = document.getElementById("privateKey") as HTMLInputElement
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
              <Label htmlFor="publicKey">Public Key</Label>
              <Input
                id="publicKey"
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
        {serverConfig ? (
          <Card className="dark:bg-gray-700 dark:text-gray-100">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-medium dark:text-gray-100">Server Konfiguration</h3>
                <div className="flex gap-2">
                  <Button size="sm" variant="ghost" onClick={copyToClipboard}>
                    <Clipboard className="w-4 h-4 mr-2" />
                    Kopieren
                  </Button>
                  <Button size="sm" variant="ghost" onClick={downloadConfig}>
                    <Download className="w-4 h-4 mr-2" />
                    Download
                  </Button>
                </div>
              </div>
              <Textarea
                className="h-[300px] font-mono text-sm dark:bg-gray-800 dark:text-gray-200"
                value={serverConfig}
                readOnly
              />
            </CardContent>
          </Card>
        ) : (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-500 dark:text-gray-300">
              Füllen Sie das Formular aus und klicken Sie auf "Konfiguration erstellen", um eine
              WireGuard-Serverkonfiguration zu generieren.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
