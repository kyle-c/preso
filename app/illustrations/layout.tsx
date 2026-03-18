import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Illustrations',
  description: 'Félix illustration library — brand characters, 3D flags, hands, money & payments, communication, and status icons in SVG and PNG.',
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
