'use client'

import { useCallback, useEffect, useState } from 'react'

type Slide = {
  id: string
  section: string
  title: string
  subtitle: string | null
  content: (() => JSX.Element) | null
  footer?: string
}

const slides: Slide[] = [
  {
    id: 'cover',
    section: '',
    title: 'Product Design Roadmap',
    subtitle: "Establishing a centralized, embedded design organization to support Felix's platform + business lines model",
    content: null,
    footer: 'Q2-Q4 2026 & Beyond',
  },
  {
    id: 'vision',
    section: 'VISION',
    title: "Design's role at Felix",
    subtitle: null,
    content: () => (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        <p style={{ fontSize: 18, lineHeight: 1.7, color: 'var(--color-text-secondary)', margin: 0 }}>
          Felix&apos;s vision is to be the{' '}
          <strong style={{ color: 'var(--color-text-primary)' }}>Trusted Financial Companion for Latinos in the US</strong>. That&apos;s
          fundamentally an experience claim, not a feature claim. Design is how we deliver on it.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div style={{ background: 'var(--color-background-secondary)', borderRadius: 12, padding: 16 }}>
            <p style={{ margin: '0 0 4px', fontSize: 13, fontWeight: 500, color: 'var(--color-text-info)' }}>Design as connective tissue</p>
            <p style={{ margin: 0, fontSize: 14, lineHeight: 1.6, color: 'var(--color-text-secondary)' }}>
              The platform gives us speed and consistency. The business lines give us depth and market fit. Design ensures every touchpoint feels
              like the same trusted companion.
            </p>
          </div>
          <div style={{ background: 'var(--color-background-secondary)', borderRadius: 12, padding: 16 }}>
            <p style={{ margin: '0 0 4px', fontSize: 13, fontWeight: 500, color: 'var(--color-text-info)' }}>Build once, deploy everywhere</p>
            <p style={{ margin: 0, fontSize: 14, lineHeight: 1.6, color: 'var(--color-text-secondary)' }}>
              Design the system once at the platform level, adapt it for each business line and surface. This is how we ship quality at speed
              across WhatsApp, app, web, and whatever comes next.
            </p>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: 'org-model',
    section: 'ORG MODEL',
    title: 'Centralized but embedded',
    subtitle: 'Two design functions aligned to the platform architecture',
    content: () => (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          {[
            {
              label: 'Surface & UX platform',
              color: '#0F6E56',
              bg: '#E1F5EE',
              count: '5-6',
              desc: 'Design system, content design, UX research, app design, conversational UX (future)',
            },
            {
              label: 'Embedded in business lines',
              color: '#993C1D',
              bg: '#FAECE7',
              count: '5-6',
              desc: 'Consumer Payments (2-3), Credit (1), Wallet/Store of Value (1), Fintech Core (1)',
            },
          ].map((c, i) => (
            <div key={i} style={{ background: c.bg, padding: 16, borderLeft: `3px solid ${c.color}` }}>
              <p style={{ margin: '0 0 2px', fontSize: 13, fontWeight: 500, color: c.color }}>{c.label}</p>
              <p style={{ margin: '0 0 8px', fontSize: 22, fontWeight: 500, color: c.color }}>{c.count} designers</p>
              <p style={{ margin: 0, fontSize: 13, lineHeight: 1.5, color: 'var(--color-text-secondary)' }}>{c.desc}</p>
            </div>
          ))}
        </div>
        <div
          style={{
            background: 'var(--color-background-secondary)',
            borderRadius: 12,
            padding: 16,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div>
            <p style={{ margin: 0, fontSize: 15, fontWeight: 500, color: 'var(--color-text-primary)' }}>Total team: 10-12 people</p>
            <p style={{ margin: 0, fontSize: 13, color: 'var(--color-text-secondary)' }}>
              Including Head of Design · ~50% platform / ~50% embedded
            </p>
          </div>
          <div style={{ fontSize: 13, color: 'var(--color-text-secondary)', textAlign: 'right' }}>
            <p style={{ margin: 0 }}>+ 1-2 staff aug contractors</p>
            <p style={{ margin: 0 }}>for design system & app production</p>
          </div>
        </div>
        <div style={{ background: 'var(--color-background-secondary)', borderRadius: 12, padding: 16 }}>
          <p style={{ margin: 0, fontSize: 13, lineHeight: 1.6, color: 'var(--color-text-secondary)' }}>
            Two functions: platform (creates leverage) and embedded (creates depth). Fintech Core designer is embedded with the fintech
            engineering team but their trust & payment patterns are shared across all business lines.
          </p>
        </div>
      </div>
    ),
  },
  {
    id: 'team-detail',
    section: 'ORG MODEL',
    title: 'Team composition & ratios',
    subtitle: 'Platform roles create leverage for everyone. Embedded roles create depth in each business line.',
    content: () => (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {[
          {
            role: 'Design System Designer',
            team: 'Surface & UX',
            note: 'Highest-leverage hire - enables staff aug, speeds every designer',
            accent: '#0F6E56',
          },
          { role: 'Content Design Lead', team: 'Surface & UX', note: 'Voice, tone, conversational patterns, bilingual guidelines', accent: '#0F6E56' },
          { role: 'UX Researcher (R1)', team: 'Surface & UX', note: 'Foundational research + building the practice org-wide', accent: '#0F6E56' },
          { role: 'App Designer', team: 'Surface & UX', note: 'Cross-product app experience, works across all business lines', accent: '#0F6E56' },
          { role: 'UX Researcher (R2)', team: 'Roaming', note: '6-8 week rotations across business lines · Hired at month 6-9', accent: '#534AB7' },
          {
            role: 'Fintech Core Designer',
            team: 'Embedded',
            note: 'KYC, payments, fraud alerts, FX - embedded with fintech eng, patterns shared org-wide',
            accent: '#993C1D',
          },
          { role: 'Consumer Payments x2-3', team: 'Embedded', note: '~3:1 PM-to-designer ratio · Organized by funnel stage', accent: '#993C1D' },
          { role: 'Credit Designer', team: 'Embedded', note: 'Senior IC, comfortable with ambiguity · 1:1 with PM', accent: '#993C1D' },
          { role: 'Wallet Designer', team: 'Embedded', note: 'Scrappy, autonomous · Greenfield product exploration', accent: '#993C1D' },
        ].map((r, i) => (
          <div
            key={i}
            style={{
              display: 'grid',
              gridTemplateColumns: '200px 100px 1fr',
              gap: 8,
              padding: '8px 12px',
              background: i % 2 === 0 ? 'var(--color-background-secondary)' : 'transparent',
              borderRadius: 6,
              alignItems: 'center',
            }}
          >
            <span style={{ fontSize: 14, fontWeight: 500, color: 'var(--color-text-primary)' }}>{r.role}</span>
            <span style={{ fontSize: 12, color: r.accent, fontWeight: 500 }}>{r.team}</span>
            <span style={{ fontSize: 12, color: 'var(--color-text-secondary)' }}>{r.note}</span>
          </div>
        ))}
      </div>
    ),
  },
  {
    id: 'hiring',
    section: 'ORG MODEL',
    title: 'Hiring sequence',
    subtitle: 'Aligned to the reorg migration timeline',
    content: () => (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {[
          {
            phase: 'Phase 1 · Q1-Q2',
            label: 'Foundation',
            color: '#0F6E56',
            hires: [
              'Product Designer: Conversational Experiences (Pato)',
              'Product Designer: Conversational Experiences (TBH)',
              'Fintech Designer / Design Systems (Patricia)',
              'UX Researcher (Jose)',
              'Content Design Lead (TBH)',
            ],
            aug: '1 contractor for design system build-out + fintech support (Darwoft)',
          },
          {
            phase: 'Phase 2 · Q2',
            label: 'Build capability',
            color: '#534AB7',
            hires: [
              'Product Designer: Conversational Experiences (Credit)',
              'App Designer',
              'Wallet Designer (if product ready)',
              'Product Designer: Conversational Experiences (Platform)',
            ],
            aug: '',
          },
          {
            phase: 'Phase 3 · Q4+',
            label: 'Scale',
            color: '#BA7517',
            hires: ['UX Researcher (R2) - month 6-9'],
            aug: 'Steady-state: 1 permanent + flex contractors',
          },
        ].map((p, i) => (
          <div key={i} style={{ borderLeft: `3px solid ${p.color}`, paddingLeft: 16 }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 4 }}>
              <span style={{ fontSize: 14, fontWeight: 500, color: p.color }}>{p.phase}</span>
              <span style={{ fontSize: 13, color: 'var(--color-text-secondary)' }}>- {p.label}</span>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 6 }}>
              {p.hires.map((h, j) => (
                <span
                  key={j}
                  style={{
                    fontSize: 12,
                    padding: '3px 10px',
                    borderRadius: 20,
                    background: 'var(--color-background-secondary)',
                    color: 'var(--color-text-primary)',
                  }}
                >
                  {h}
                </span>
              ))}
            </div>
            {p.aug && <p style={{ margin: 0, fontSize: 12, color: 'var(--color-text-secondary)' }}>{p.aug}</p>}
          </div>
        ))}
      </div>
    ),
  },
  {
    id: 'staff-aug',
    section: 'ORG MODEL',
    title: 'Staff augmentation strategy',
    subtitle: "Contractors extend capacity - they don't replace ownership",
    content: () => (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
          <div style={{ background: '#EAF3DE', padding: 16, borderLeft: '3px solid #3B6D11' }}>
            <p style={{ margin: '0 0 4px', fontSize: 13, fontWeight: 500, color: '#27500A' }}>Good fit for contractors</p>
            <p style={{ margin: 0, fontSize: 13, lineHeight: 1.5, color: '#3B6D11' }}>
              Design system production (components, docs, Figma libraries), app UI screen production, Consumer Payments overflow during
              launches or geo expansion
            </p>
          </div>
          <div style={{ background: '#FAEEDA', padding: 16, borderLeft: '3px solid #854F0B' }}>
            <p style={{ margin: '0 0 4px', fontSize: 13, fontWeight: 500, color: '#633806' }}>Situational</p>
            <p style={{ margin: 0, fontSize: 13, lineHeight: 1.5, color: '#854F0B' }}>
              Fintech core pattern execution (under FTE direction), usability test moderation and analysis support
            </p>
          </div>
          <div style={{ background: '#FCEBEB', padding: 16, borderLeft: '3px solid #A32D2D' }}>
            <p style={{ margin: '0 0 4px', fontSize: 13, fontWeight: 500, color: '#791F1F' }}>Must be full-time</p>
            <p style={{ margin: 0, fontSize: 13, lineHeight: 1.5, color: '#A32D2D' }}>
              Content design, UX research, Credit/Wallet embedded designers, design system IC (the strategist, not the production layer)
            </p>
          </div>
        </div>
        <div style={{ background: 'var(--color-background-secondary)', borderRadius: 12, padding: 16 }}>
          <p style={{ margin: 0, fontSize: 14, lineHeight: 1.6, color: 'var(--color-text-secondary)' }}>
            <strong style={{ color: 'var(--color-text-primary)' }}>Key prerequisite:</strong> Staff aug only works once the design system has
            enough coverage to provide guardrails. A contractor without a design system is a freelancer making things up. A contractor with a
            design system produces on-brand, consistent work from week one. This is why the design system designer is our highest-priority hire.
          </p>
        </div>
      </div>
    ),
  },
  {
    id: 'roadmap-overview',
    section: 'ROADMAP',
    title: 'Design roadmap - two tracks',
    subtitle: "Complements the product roadmap, doesn't duplicate it",
    content: () => (
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <div style={{ background: '#E1F5EE', padding: 20, borderLeft: '3px solid #0F6E56' }}>
          <p style={{ margin: '0 0 4px', fontSize: 15, fontWeight: 500, color: '#085041' }}>Track 1: Design foundation</p>
          <p style={{ margin: '0 0 12px', fontSize: 13, color: '#0F6E56' }}>
            What the centralized design org builds - regardless of what any product team ships
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {[
              'Design system & pattern library',
              'Content & conversational UX patterns',
              'Research infrastructure & practice',
              'Cross-surface experience coherence',
              'Omnichannel + AI design patterns',
            ].map((t, i) => (
              <p key={i} style={{ margin: 0, fontSize: 13, color: '#085041', padding: '4px 0', borderBottom: i < 4 ? '1px solid #9FE1CB' : 'none' }}>
                {t}
              </p>
            ))}
          </div>
        </div>
        <div style={{ background: '#FAECE7', padding: 20, borderLeft: '3px solid #993C1D' }}>
          <p style={{ margin: '0 0 4px', fontSize: 15, fontWeight: 500, color: '#712B13' }}>Track 2: Design in product</p>
          <p style={{ margin: '0 0 12px', fontSize: 13, color: '#993C1D' }}>
            How design shows up within the product roadmap - the design lens on product priorities
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {[
              'Multi-product discovery framework',
              'Checkout flow restructuring',
              'Credit & wallet product definition',
              'Geo expansion experience design',
              'Receiver-side experience',
            ].map((t, i) => (
              <p key={i} style={{ margin: 0, fontSize: 13, color: '#712B13', padding: '4px 0', borderBottom: i < 4 ? '1px solid #F5C4B3' : 'none' }}>
                {t}
              </p>
            ))}
          </div>
        </div>
      </div>
    ),
  },
  {
    id: 'roadmap-now',
    section: 'ROADMAP',
    title: 'Now - Q2 2026',
    subtitle: 'Stand up the org, establish credibility, support current priorities',
    content: () => (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {[
          {
            area: 'Multi-product discovery',
            color: '#993C1D',
            bg: '#FAECE7',
            items:
              'Establish scalable framework for exposing top-ups, bill pay, and credit in WhatsApp - accounting for user journey, session intensity, transaction history, and likely next actions',
          },
          {
            area: 'Checkout improvements',
            color: '#993C1D',
            bg: '#FAECE7',
            items:
              'Collaborate with Fintech Core on UX restructuring of checkout flow to optimize for scalable payment methods across business lines',
          },
          {
            area: 'Design system',
            color: '#0F6E56',
            bg: '#E1F5EE',
            items:
              'Expand component library to support redesigned checkout, wallet, top-ups, and bill pay. Define UX guidelines and pattern library for shared patterns across WhatsApp and web/app',
          },
          {
            area: 'Research foundation',
            color: '#0F6E56',
            bg: '#E1F5EE',
            items:
              'Empower PMs and engineers to conduct more research, more regularly. Establish consistent framework and cadence for user recruitment pipelines. Research support for multi-product discovery, wallet/credit validation, and future product definition',
          },
          {
            area: 'Content design',
            color: '#0F6E56',
            bg: '#E1F5EE',
            items:
              'Hire our Content Lead to partner with brand and establish the Felix voice & tone system across all touchpoints (WhatsApp, app, notifications, errors). Build initial conversational flow patterns library. Establish bilingual content guidelines (Spanish, English, Spanglish)',
          },
        ].map((r, i) => (
          <div key={i} style={{ background: r.bg, padding: 16, borderLeft: `3px solid ${r.color}` }}>
            <p style={{ margin: '0 0 6px', fontSize: 14, fontWeight: 500, color: r.color }}>{r.area}</p>
            <p style={{ margin: 0, fontSize: 13, lineHeight: 1.6, color: 'var(--color-text-secondary)' }}>{r.items}</p>
          </div>
        ))}
      </div>
    ),
  },
  {
    id: 'research',
    section: 'DEEP DIVE',
    title: 'Research model',
    subtitle: 'Building the practice from scratch with a staggered two-researcher approach',
    content: () => (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div style={{ background: '#EEEDFE', padding: 16, borderLeft: '3px solid #534AB7' }}>
            <p style={{ margin: '0 0 2px', fontSize: 14, fontWeight: 500, color: '#3C3489' }}>Researcher 1 - Platform</p>
            <p style={{ margin: '0 0 8px', fontSize: 12, color: '#534AB7' }}>Hired in Phase 1 · Surface & UX team</p>
            <p style={{ margin: 0, fontSize: 13, lineHeight: 1.6, color: 'var(--color-text-secondary)' }}>
              Foundational studies (trust, mental models, financial literacy). Builds research practice: templates, recruiting pipelines,
              insight repository, lightweight testing toolkit. Teaches designers and PMs to self-serve on evaluative research.
            </p>
          </div>
          <div style={{ background: '#EEEDFE', padding: 16, borderLeft: '3px solid #534AB7' }}>
            <p style={{ margin: '0 0 2px', fontSize: 14, fontWeight: 500, color: '#3C3489' }}>Researcher 2 - Roaming</p>
            <p style={{ margin: '0 0 8px', fontSize: 12, color: '#534AB7' }}>Hired at month 6-9 · Rotates across business lines</p>
            <p style={{ margin: 0, fontSize: 13, lineHeight: 1.6, color: 'var(--color-text-secondary)' }}>
              6-8 week research sprints aligned to highest-priority product decisions. Tactical and evaluative research: usability testing,
              concept validation, funnel analysis. Quarterly rotation planning with Head of Design.
            </p>
          </div>
        </div>
        <div style={{ background: 'var(--color-background-secondary)', borderRadius: 12, padding: 16 }}>
          <p style={{ margin: 0, fontSize: 14, lineHeight: 1.6, color: 'var(--color-text-secondary)' }}>
            <strong style={{ color: 'var(--color-text-primary)' }}>Why stagger:</strong> Starting from zero, R1 needs 2-3 months to establish
            how research works at Felix. Once those rails exist, R2 rides them from day one and focuses on producing research rather than also
            building infrastructure.
          </p>
        </div>
      </div>
    ),
  },
  {
    id: 'content-design',
    section: 'DEEP DIVE',
    title: 'Content design lead — key projects',
    subtitle: 'The words are the UI - especially in a conversational-first product',
    content: () => (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {[
          {
            project: 'Felix voice & tone system',
            timeline: 'Foundational',
            desc:
              'Define how Felix speaks across every touchpoint. Bilingual guidelines (Spanish, English, Spanglish and when to use each). Emotional tone calibration by moment type: celebratory (transfer landed), reassuring (KYC), calm (errors), warm (onboarding). Writing principles the whole team can follow.',
          },
          {
            project: 'Conversational flow patterns library',
            timeline: 'Next',
            desc:
              'Standardized patterns for: greetings (new vs. returning), disambiguation, high-stakes confirmations, error recovery, product introduction within conversation. Directly feeds the multi-product discovery framework.',
          },
          {
            project: 'Partner with AI for agent personality & prompt guidelines',
            timeline: 'Soon',
            desc:
              'Working with the omnichannel + AI team, define personality parameters that guide the LLM agent. Behavioral rules, tone constraints, things Felix should never say, and how personality adapts by context (first-time sender vs. power user).',
          },
          {
            project: 'Cross-channel content adaptation',
            timeline: 'Later',
            desc:
              "How Felix's voice adapts across WhatsApp (conversational, brief), app (scannable, structured), push notifications (action-oriented), SMS (ultra-concise). Same personality, different expression. Feeds directly into app launch and multi-surface expansion.",
          },
        ].map((p, i) => (
          <div key={i} style={{ background: 'var(--color-background-secondary)', padding: 16, borderLeft: '3px solid #0F6E56' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 6 }}>
              <p style={{ margin: 0, fontSize: 14, fontWeight: 500, color: 'var(--color-text-primary)' }}>{p.project}</p>
              <span
                style={{
                  fontSize: 11,
                  padding: '2px 8px',
                  borderRadius: 20,
                  background: '#E1F5EE',
                  color: '#0F6E56',
                  fontWeight: 500,
                  whiteSpace: 'nowrap',
                }}
              >
                {p.timeline}
              </span>
            </div>
            <p style={{ margin: 0, fontSize: 13, lineHeight: 1.6, color: 'var(--color-text-secondary)' }}>{p.desc}</p>
          </div>
        ))}
      </div>
    ),
  },
  {
    id: 'closing',
    section: '',
    title: 'End of year goal',
    subtitle: null,
    content: () => (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 24, paddingTop: 8 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
          {[
            { num: '10-12', label: 'designers at full build', sub: 'including 1-2 contractors' },
            { num: '2', label: 'design functions', sub: 'Surface & UX Platform · Embedded' },
            { num: "Q4 '26", label: 'target for full team', sub: 'phased hiring aligned to reorg' },
          ].map((s, i) => (
            <div key={i} style={{ textAlign: 'center', padding: 16 }}>
              <p style={{ margin: 0, fontSize: 28, fontWeight: 500, color: 'var(--color-text-primary)' }}>{s.num}</p>
              <p style={{ margin: '4px 0 0', fontSize: 14, color: 'var(--color-text-secondary)' }}>{s.label}</p>
              <p style={{ margin: '2px 0 0', fontSize: 12, color: 'var(--color-text-tertiary)' }}>{s.sub}</p>
            </div>
          ))}
        </div>
        <div style={{ background: 'var(--color-background-secondary)', borderRadius: 12, padding: 20, textAlign: 'center' }}>
          <p style={{ margin: 0, fontSize: 15, lineHeight: 1.7, color: 'var(--color-text-secondary)' }}>
            Let&apos;s prepare ourselves for a period of learnings and iterating. It will be an adjustment that will take energy - but will
            make us stronger.
          </p>
        </div>
      </div>
    ),
  },
]

export default function DesignRoadmapPage() {
  const [idx, setIdx] = useState(0)
  const [touchX, setTouchX] = useState<number | null>(null)
  const s = slides[idx]
  const total = slides.length

  const prev = useCallback(() => setIdx((p) => Math.max(0, p - 1)), [])
  const next = useCallback(() => setIdx((p) => Math.min(total - 1, p + 1)), [total])

  useEffect(() => {
    const hash = window.location.hash
    if (!hash) return
    const n = parseInt(hash.replace('#slide-', ''), 10)
    if (!Number.isNaN(n) && n >= 0 && n < total) setIdx(n)
  }, [total])

  useEffect(() => {
    window.history.replaceState(null, '', `#slide-${idx}`)
  }, [idx])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement | null
      if (t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA')) return
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown' || e.key === ' ') {
        e.preventDefault()
        next()
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        e.preventDefault()
        prev()
      } else if (e.key === 'Home') {
        e.preventDefault()
        setIdx(0)
      } else if (e.key === 'End') {
        e.preventDefault()
        setIdx(total - 1)
      }
    }
    window.addEventListener('keydown', handler, true)
    return () => window.removeEventListener('keydown', handler, true)
  }, [next, prev, total])

  const onTouchStart = (e: React.TouchEvent) => setTouchX(e.targetTouches[0].clientX)
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchX === null) return
    const diff = touchX - e.changedTouches[0].clientX
    if (diff > 50) next()
    else if (diff < -50) prev()
    setTouchX(null)
  }

  return (
    <div
      className="h-screen w-screen overflow-hidden relative bg-gradient-to-b from-stone to-linen"
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      <div className="absolute top-0 inset-x-0 h-1 z-50 bg-concrete/30">
        <div className="h-full bg-turquoise-600 transition-all duration-400" style={{ width: `${((idx + 1) / total) * 100}%` }} />
      </div>

      <div className="absolute top-4 left-4 z-50 px-3 py-1.5 rounded-full border border-border bg-white/90">
        <span className="text-xs sm:text-sm font-medium text-foreground">
          {idx + 1} / {total}
        </span>
      </div>

      <div className="h-full w-full px-4 sm:px-6 lg:px-10 py-12 sm:py-16">
        <div className="h-full max-w-[1180px] mx-auto rounded-2xl border border-border bg-white/95 shadow-xl p-6 sm:p-8 lg:p-10 overflow-auto">
          <div style={{ minHeight: 480, display: 'flex', flexDirection: 'column' }}>
            {s.section && (
              <p
                style={{
                  margin: '0 0 4px',
                  fontSize: 11,
                  fontWeight: 500,
                  letterSpacing: '0.08em',
                  color: 'var(--color-text-tertiary)',
                  textTransform: 'uppercase',
                }}
              >
                {s.section}
              </p>
            )}
            <h1 style={{ margin: '0 0 4px', fontSize: 28, fontWeight: 600, color: 'var(--color-text-primary)', lineHeight: 1.25 }}>
              {s.title}
            </h1>
            {s.subtitle ? (
              <p style={{ margin: '0 0 20px', fontSize: 14, color: 'var(--color-text-secondary)', lineHeight: 1.5 }}>{s.subtitle}</p>
            ) : (
              <div style={{ marginBottom: 20 }} />
            )}
            {s.id === 'cover' ? (
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: 8 }}>
                <p style={{ fontSize: 15, color: 'var(--color-text-secondary)', margin: 0, textAlign: 'center', maxWidth: 560 }}>{s.subtitle}</p>
                <p style={{ fontSize: 13, color: 'var(--color-text-tertiary)', margin: 0 }}>{s.footer}</p>
              </div>
            ) : (
              <div style={{ flex: 1 }}>{s.content && s.content()}</div>
            )}
          </div>

          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '16px 0',
              borderTop: '1px solid var(--color-border-tertiary)',
              marginTop: 16,
            }}
          >
            <button
              onClick={prev}
              disabled={idx === 0}
              style={{
                padding: '6px 16px',
                borderRadius: 8,
                border: '1px solid var(--color-border-tertiary)',
                background: 'var(--color-background-primary)',
                color: idx === 0 ? 'var(--color-text-tertiary)' : 'var(--color-text-primary)',
                cursor: idx === 0 ? 'default' : 'pointer',
                fontSize: 13,
              }}
            >
              Previous
            </button>

            <div className="flex items-center gap-2">
              {slides.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setIdx(i)}
                  aria-label={`Go to slide ${i + 1}`}
                  className={`rounded-full transition-all duration-300 ${
                    i === idx ? 'w-8 h-2 bg-turquoise-600' : 'w-2 h-2 bg-concrete hover:bg-concrete/70'
                  }`}
                />
              ))}
            </div>

            <button
              onClick={next}
              disabled={idx === slides.length - 1}
              style={{
                padding: '6px 16px',
                borderRadius: 8,
                border: '1px solid var(--color-border-tertiary)',
                background: 'var(--color-background-primary)',
                color: idx === slides.length - 1 ? 'var(--color-text-tertiary)' : 'var(--color-text-primary)',
                cursor: idx === slides.length - 1 ? 'default' : 'pointer',
                fontSize: 13,
              }}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
