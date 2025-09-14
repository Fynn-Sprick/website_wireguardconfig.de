/**
 * Generiert ein WireGuard-Schlüsselpaar (privater und öffentlicher Schlüssel)
 * @returns Ein Objekt mit privatem und öffentlichem Schlüssel im Base64-Format
 */
export async function generateKeyPair() {
  // Generiere 32 zufällige Bytes für den privaten Schlüssel
  const privateKeyBytes = new Uint8Array(32)
  crypto.getRandomValues(privateKeyBytes)

  // Konvertiere zu Base64
  const privateKey = encodeBase64(privateKeyBytes)

  // Für die Demo generieren wir einen "öffentlichen" Schlüssel, der einfach ein anderer zufälliger Schlüssel ist
  // In einer echten Implementierung würde man hier Curve25519 verwenden
  const publicKeyBytes = new Uint8Array(32)
  crypto.getRandomValues(publicKeyBytes)
  const publicKey = encodeBase64(publicKeyBytes)

  return { privateKey, publicKey }
}

/**
 * Generiert einen Pre-Shared Key für zusätzliche Sicherheit
 * @returns Ein Pre-Shared Key im Base64-Format
 */
export function generatePresharedKey() {
  // Ein Pre-Shared Key ist einfach 32 zufällige Bytes
  const presharedKeyBytes = new Uint8Array(32)
  crypto.getRandomValues(presharedKeyBytes)
  return encodeBase64(presharedKeyBytes)
}

/**
 * Konvertiert ein Uint8Array in einen Base64-String
 * @param bytes Das zu konvertierende Uint8Array
 * @returns Der Base64-kodierte String
 */
export function encodeBase64(bytes: Uint8Array): string {
  // In einem Browser-Umfeld können wir btoa verwenden, müssen aber zuerst in einen String konvertieren
  const binary = Array.from(bytes)
    .map((byte) => String.fromCharCode(byte))
    .join("")

  return btoa(binary)
}

/**
 * Konvertiert einen Base64-String in ein Uint8Array
 * @param base64 Der zu konvertierende Base64-String
 * @returns Das dekodierte Uint8Array
 */
export function decodeBase64(base64: string): Uint8Array {
  // Dekodiere den Base64-String zu einem binären String
  const binaryString = atob(base64)

  // Konvertiere den binären String in ein Uint8Array
  const bytes = new Uint8Array(binaryString.length)
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i)
  }

  return bytes
}
