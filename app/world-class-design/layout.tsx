import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Building a World-Class Design Team',
  description: 'The Félix design org thesis: a bar, not a headcount. Craft as the hiring gate, the functional-quality hierarchy, the eight-dimension bar, and team shape by size.',
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
