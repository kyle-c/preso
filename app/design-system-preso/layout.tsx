import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Félix Design System Presentation',
  description: 'Interactive slide deck covering Félix design foundations — principles, color palette, typography, components, tokens, and product patterns.',
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
