import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Building a World-Class Design Team (v2)',
  description: 'Six-slide variant of the design org thesis deck, without the team-shape slide.',
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
