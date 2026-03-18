import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Components',
  description: 'Félix UI component library — buttons, cards, inputs, badges, and interactive patterns built on the design system.',
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
