import type React from "react"
import "./globals.css"
import type { Metadata } from "next"
import { Kantumruy_Pro } from "next/font/google"
import { LanguageProvider } from "@/contexts/language-context"

const kantumruyPro = Kantumruy_Pro({
  subsets: ["khmer"],
  weight: ["100", "200", "300", "400", "500", "600", "700"],
})

export const metadata: Metadata = {
  title: "Doktor AI",
  description: "AI-powered medical test translation service",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="km">
      <body className={kantumruyPro.className}>
        <LanguageProvider>{children}</LanguageProvider>
      </body>
    </html>
  )
}
