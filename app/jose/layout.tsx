import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Researcher Onboarding',
  description: 'Onboarding presentation for the founding UX Researcher at Félix — role overview, team, 90-day plan, and first week checklist.',
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
