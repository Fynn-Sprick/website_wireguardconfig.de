import { NextResponse } from "next/server"

export function GET() {
  return new NextResponse(
    `User-agent: *
Allow: /
Disallow: /api/

Sitemap: https://wireguard-config-generator.example.com/sitemap.xml`,
    {
      headers: {
        "Content-Type": "text/plain",
      },
    },
  )
}
