import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Content Design — WhatsApp Copy Audit & Governance',
  description: 'WhatsApp copy audit framework — platform-wide content audit, copy bible, LLM enforcement tooling, and multilingual governance for Félix messaging.',
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
