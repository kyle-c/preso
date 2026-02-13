import React from "react"
import type { Metadata } from 'next'
import { DM_Sans, Plus_Jakarta_Sans } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const dmSans = DM_Sans({ 
  subsets: ["latin"],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-sans'
});

const plusJakarta = Plus_Jakarta_Sans({ 
  subsets: ["latin"],
  weight: ['700', '800'],
  variable: '--font-display'
});

export const metadata: Metadata = {
  title: 'Felix Pago Design System',
  description: 'A comprehensive design system for Felix Pago built with shadcn/ui',
  generator: 'v0.app',
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
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
      <body className={`${dmSans.variable} ${plusJakarta.variable} font-sans antialiased`}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
