import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Sr. Product Designer Onboarding',
  description: 'Onboarding presentation for the Senior Product Designer (Design Systems & Multisurface) at Félix — role overview, team, 90-day plan, and first week checklist.',
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
