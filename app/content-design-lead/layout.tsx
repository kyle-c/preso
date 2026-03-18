import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Content Design Lead Onboarding',
  description: 'Onboarding presentation for the founding Content Design Lead at Félix — role overview, team, 90-day plan, and first week checklist.',
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
