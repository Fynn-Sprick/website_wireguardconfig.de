interface ServerConfigData {
  serverAddress: string
  serverPort: string
  dnsServer: string
  privateKey: string
  publicKey: string
  useDns: boolean
}

interface ClientConfigData {
  clientName: string
  clientAddress: string
  serverPublicKey: string
  serverEndpoint: string
  serverPort: string
  allowedIPs: string
  keepAlive: string
  privateKey: string
  publicKey: string
  dns: string
  useDns: boolean
}

export function generateServerConfig(data: ServerConfigData): string {
  return `# WireGuard Server Konfiguration
# Generiert von WireGuard Config Generator
# Datum: ${new Date().toLocaleString()}

[Interface]
Address = ${data.serverAddress}
ListenPort = ${data.serverPort}
PrivateKey = ${data.privateKey}
PostUp = iptables -A FORWARD -i %i -j ACCEPT; iptables -t nat -A POSTROUTING -o $(ip route | grep default | awk '{print $5}') -j MASQUERADE; ip6tables -A FORWARD -i %i -j ACCEPT; ip6tables -t nat -A POSTROUTING -o $(ip route | grep default | awk '{print $5}') -j MASQUERADE
PostDown = iptables -D FORWARD -i %i -j ACCEPT; iptables -t nat -D POSTROUTING -o $(ip route | grep default | awk '{print $5}') -j MASQUERADE; ip6tables -D FORWARD -i %i -j ACCEPT; ip6tables -t nat -D POSTROUTING -o $(ip route | grep default | awk '{print $5}') -j MASQUERADE
${data.useDns ? `DNS = ${data.dnsServer}` : ""}

# Fügen Sie hier Ihre Client-Konfigurationen hinzu
# Beispiel:
# [Peer]
# PublicKey = ClientPublicKey
# AllowedIPs = 10.0.0.2/32
`
}

export function generateClientConfig(data: ClientConfigData): string {
  return `# WireGuard Client Konfiguration für ${data.clientName}
# Generiert von WireGuard Config Generator
# Datum: ${new Date().toLocaleString()}

[Interface]
PrivateKey = ${data.privateKey}
Address = ${data.clientAddress}
${data.useDns ? `DNS = ${data.dns}` : ""}

[Peer]
PublicKey = ${data.serverPublicKey}
Endpoint = ${data.serverEndpoint}:${data.serverPort}
AllowedIPs = ${data.allowedIPs}
PersistentKeepalive = ${data.keepAlive}
`
}
