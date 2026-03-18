import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Consumer Payments',
  description: 'Consumer Payments Mission — squad missions, themes, and team structure for the product offsite.',
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
