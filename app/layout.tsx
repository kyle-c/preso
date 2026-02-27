import React from "react"
import type { Metadata } from 'next'
import { Analytics } from '@vercel/analytics/next'
import { DSLangProvider } from '@/components/design-system/ds-lang-context'
import './globals.css'

export const metadata: Metadata = {
  title: 'Felix Pago Design System',
  description: 'A comprehensive design system for Felix Pago built with shadcn/ui',
  generator: 'v0.app',
  icons: {
    icon: '/favicon.png',
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
