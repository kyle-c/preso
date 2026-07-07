import React from "react"
import type { Metadata } from 'next'
import { Analytics } from '@vercel/analytics/next'
import { DSLangProvider } from '@/components/design-system/ds-lang-context'
import './globals.css'

export const metadata: Metadata = {
  title: 'Preso | Felix Studio',
  description: 'A branded AI presentation studio for creating Felix decks from prompts, documents, and research.',
  icons: {
    icon: '/favicon.png',
    apple: '/apple-icon.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">
        <DSLangProvider>
          {children}
        </DSLangProvider>
        <Analytics />
      </body>
    </html>
  )
}
