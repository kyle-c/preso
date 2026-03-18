import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Presentations',
  description: 'Slide decks built with the Félix design system — design system overview, consumer payments strategy, onboarding, and presentation templates.',
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
