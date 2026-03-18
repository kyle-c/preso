import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Design Principles',
  description: 'The five UX principles guiding Félix product design — conversational transactions, progressive disclosure, user guidance, protective friction, and growth.',
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
