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
