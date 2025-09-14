"use client"

import { useEffect, useRef, useState } from "react"
import QRCode from "qrcode"

interface QRCodeGeneratorProps {
  text: string
  size?: number
  className?: string
}

export function QRCodeGenerator({ text, size = 200, className = "" }: QRCodeGeneratorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!canvasRef.current || !text) return

    const generateQR = async () => {
      try {
        await QRCode.toCanvas(canvasRef.current, text, {
          width: size,
          margin: 2,
          color: {
            dark: "#000000",
            light: "#ffffff",
          },
        })
        setError(null)
      } catch (err) {
        console.error("QR-Code-Generierungsfehler:", err)
        setError("QR-Code konnte nicht generiert werden.")
      }
    }

    generateQR()
  }, [text, size])

  if (error) {
    return <div className="text-red-500 text-center">{error}</div>
  }

  return (
    <div className={`flex justify-center ${className}`}>
      <canvas ref={canvasRef} className="rounded" />
    </div>
  )
}
