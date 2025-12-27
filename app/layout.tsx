import type React from "react"
import type { Metadata, Viewport } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Catalogo Portabilidad - Catálogo de Teléfonos",
  description:
    "Encuentra el teléfono ideal para ti. Catálogo completo con precios, especificaciones y consulta por WhatsApp.",
  generator: "v0.app",
  openGraph: {
    title: "Catalogo Portabilidad- Catálogo de Teléfonos",
    description: "Encuentra el teléfono ideal para ti. Catálogo completo con precios y especificaciones.",
    type: "website",
  },
  icons: {
    icon: "/favicon.png",
    apple: "/apple-icon.png",
  },
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#000000",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es">
      <body className={`font-sans antialiased`}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
