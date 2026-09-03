import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Building a Design Team Worth Talking About',
  description: 'A product design organization built for quality, speed, learning, and scale — the ambition, the standard, the operating model, and the near-term actions.',
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
