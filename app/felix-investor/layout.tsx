import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Félix Pago — Investor Deck',
  description: 'Conversational Finance for the New American Majority — Powered by AI & Stablecoins. Investor presentation for Félix Pago.',
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
