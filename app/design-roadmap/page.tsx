'use client'

import { SlideRenderer, type SlideData } from '@/components/studio/slide-renderer'

const slides: SlideData[] = [
  /* ── 1. Title ── */
  {
    type: 'title',
    bg: 'brand',
    badge: 'Q2–Q4 2026',
    title: 'Product Design Roadmap',
    subtitle: 'A centralized, embedded design org for Félix\'s platform + business lines model.',
    imageUrl: '/illustrations/Hands%20-%202%20Cell%20Phones%20-%20Juntos%20we%20Succeed.svg',
    notes: 'This deck outlines the product design organization roadmap for Q2–Q4 2026 and beyond.',
  },

  /* ── 2. Vision ── */
  {
    type: 'quote',
    bg: 'dark',
    badge: 'Vision',
    title: 'Design Makes the Promise Real',
    quote: {
      text: '"Trusted Financial Companion" is an experience claim, not a feature claim. Design is how we deliver on it.',
      attribution: 'Design\'s role at Félix',
    },
    body: 'Trust comes from **human interaction**, not just slick UX. We replicate the warmth of "la tiendita" — digitally. Design ensures every touchpoint feels like the same trusted companion.',
    imageUrl: '/illustrations/Heart%20-F%C3%A9lix.svg',
    notes: 'Design as connective tissue between platform and business lines. Build the system once, deploy everywhere.',
  },

  /* ── 3. Org Model ── */
  {
    type: 'cards',
    bg: 'light',
    badge: 'Org Model',
    title: 'Centralized but Embedded',
    subtitle: '10–12 people across three functions. ~55% platform, ~45% embedded.',
    cards: [
      {
        title: 'Surface & UX Platform',
        titleColor: '#35605F',
        body: '**5–6 designers.** Design system, content design, UX research, app design. Creates leverage for everyone.',
      },
      {
        title: 'Fintech Core',
        titleColor: '#6060BF',
        body: '**1 designer.** KYC, payments, trust & security patterns. The foundational layer every product inherits.',
      },
      {
        title: 'Embedded in Business Lines',
        titleColor: '#F26629',
        body: '**4–5 designers.** Consumer Payments (2–3), Credit (1), Wallet (1). Depth and market fit inside product squads.',
      },
    ],
    imageUrl: '/illustrations/3%20Paper%20Airplanes%20%2B%20Coins.svg',
    notes: 'Plus 1–2 staff augmentation contractors for design system and app production.',
  },

  /* ── 4. Hiring Sequence ── */
  {
    type: 'cards',
    bg: 'dark',
    badge: 'Hiring Plan',
    title: 'Three Phases, All Reqs Open in Parallel',
    cards: [
      {
        title: 'Q1–Q2: Foundation',
        titleColor: '#2BF2F1',
        body: '• Design System Designer\n• Content Design Lead\n• Consumer Payments ×1\n• Fintech Core Designer\n• 1 contractor for design system',
      },
      {
        title: 'Q3: Build Capability',
        titleColor: '#FFCD9C',
        body: '• App Designer\n• Consumer Payments ×2\n• Credit Designer\n• Wallet Designer\n• Flex contractor for app launch',
      },
      {
        title: 'Q4+: Scale',
        titleColor: '#F19D38',
        body: '• Second UX Researcher\n• Conversational UX Designer (evaluate)\n• 3rd Consumer Payments (if needed)\n• Steady-state contractors',
      },
    ],
    notes: 'The design system designer is our highest-priority hire — it unlocks staff augmentation and makes every other designer more productive.',
  },

  /* ── 5. Staff Aug ── */
  {
    type: 'cards',
    bg: 'light',
    badge: 'Org Model',
    title: 'Staff Augmentation Strategy',
    subtitle: 'Contractors extend capacity — they don\'t replace ownership.',
    cards: [
      {
        title: 'Good for Contractors',
        titleColor: '#35605F',
        body: '• Design system component production\n• Figma library build-out\n• App UI screen production\n• Consumer Payments launch overflow',
      },
      {
        title: 'Situational',
        titleColor: '#F19D38',
        body: '• Fintech core pattern execution\n• Usability test moderation\n• Requires close FTE oversight',
      },
      {
        title: 'Must Be Full-Time',
        titleColor: '#F26629',
        body: '• Content design\n• UX research\n• Credit & Wallet designers\n• Design system strategist',
      },
    ],
    imageUrl: '/illustrations/Fast.svg',
    notes: 'A contractor without a design system is a freelancer making things up. A contractor with a design system produces on-brand work from week one.',
  },

  /* ── 6. Two Tracks ── */
  {
    type: 'two-column',
    bg: 'dark',
    badge: 'Roadmap',
    title: 'Two Parallel Tracks',
    columns: [
      {
        heading: 'Design Foundation',
        bullets: [
          { text: 'Design system & pattern library', icon: '✓' },
          { text: 'Content & conversational UX patterns', icon: '✓' },
          { text: 'Research infrastructure', icon: '✓' },
          { text: 'Cross-surface coherence', icon: '✓' },
        ],
      },
      {
        heading: 'Design in Product',
        bullets: [
          { text: 'Multi-product discovery framework', icon: '✓' },
          { text: 'Checkout flow restructuring', icon: '✓' },
          { text: 'Credit & wallet definition', icon: '✓' },
          { text: 'Geo expansion design', icon: '✓' },
        ],
      },
    ],
    notes: 'Track 1 is what the platform team builds regardless. Track 2 is the design lens on product priorities.',
  },

  /* ── 7. Now — Q2 ── */
  {
    type: 'cards',
    bg: 'light',
    badge: 'Now · Q2 2026',
    title: 'Stand Up the Org, Establish Credibility',
    cards: [
      {
        title: 'Multi-Product Discovery',
        titleColor: '#F26629',
        body: 'Scalable framework for exposing top-ups, bill pay, and credit in WhatsApp — based on user journey and transaction history.',
      },
      {
        title: 'Checkout Restructuring',
        titleColor: '#6060BF',
        body: 'UX restructuring with Fintech Core to optimize for scalable payment methods across all business lines.',
      },
      {
        title: 'Design System Expansion',
        titleColor: '#35605F',
        body: 'Component library for checkout, wallet, top-ups. Shared UX guidelines across WhatsApp and web/app.',
      },
      {
        title: 'Research & Content Foundations',
        titleColor: '#F19D38',
        body: 'Research recruiting pipelines and lightweight toolkit. Félix voice & tone system and bilingual content guidelines.',
      },
    ],
    imageUrl: '/illustrations/Hand%20-%20Stars.svg',
    notes: 'Q2 is about shipping alongside product priorities while building the infrastructure that makes everything else possible.',
  },

  /* ── 8. Next — Q3 ── */
  {
    type: 'cards',
    bg: 'dark',
    badge: 'Next · Q3 2026',
    title: 'Build Capability, Go Multi-Surface',
    cards: [
      {
        title: 'App Launch',
        titleColor: '#2BF2F1',
        body: 'Holistic app experience — navigation, IA, cross-product coexistence. WhatsApp-to-app handoff patterns.',
      },
      {
        title: 'Credit & Wallet Design',
        titleColor: '#FFCD9C',
        body: 'SNPL flows for conversational and app. Making abstract financial concepts tangible and trustworthy.',
      },
      {
        title: 'Design System v1',
        titleColor: '#60D06F',
        body: 'Cross-surface system supporting WhatsApp, app, and web. Design critique and quality review processes.',
      },
      {
        title: 'AI Agent Personality',
        titleColor: '#F19D38',
        body: 'LLM personality parameters, behavioral rules, and tone adaptation by context with the omnichannel team.',
      },
    ],
    notes: 'Q3 is when we go multi-surface with the app launch and deepen into credit and wallet.',
  },

  /* ── 9. Later — Q4+ ── */
  {
    type: 'cards',
    bg: 'light',
    badge: 'Later · Q4 2026+',
    title: 'Scale the Ecosystem',
    cards: [
      {
        title: 'Full Financial Ecosystem',
        titleColor: '#35605F',
        body: 'Insurance, lending, yield products. Receiver-side experience for families abroad. New corridor expansion.',
      },
      {
        title: 'AI & Omnichannel Maturity',
        titleColor: '#6060BF',
        body: 'Human-AI handoff optimization. Multi-agent patterns. Evaluate dedicated conversational UX designer.',
      },
      {
        title: 'Design Ops at Scale',
        titleColor: '#F26629',
        body: 'Tooling, handoff processes, design-to-eng efficiency metrics. Quality enforcement across 4+ business lines.',
      },
      {
        title: 'Research at Scale',
        titleColor: '#F19D38',
        body: 'Second researcher in rotation. Receiver-side fieldwork in LATAM. Insight-driven product strategy.',
      },
    ],
    imageUrl: '/illustrations/Rocket%20Launch%20-%20Growth%20%2B%20Coin%20-%20Turquoise.svg',
    notes: 'Q4 and beyond is about scaling to support the full financial ecosystem while maintaining quality.',
  },

  /* ── 10. Research Model ── */
  {
    type: 'two-column',
    bg: 'dark',
    badge: 'Deep Dive',
    title: 'Two Researchers, Staggered',
    columns: [
      {
        heading: 'R1 — Platform (Phase 1)',
        bullets: [
          { text: 'Foundational studies: trust, mental models', icon: '✓' },
          { text: 'Builds templates, pipelines, insight repo', icon: '✓' },
          { text: 'Teaches PMs and designers to self-serve', icon: '✓' },
        ],
      },
      {
        heading: 'R2 — Roaming (Month 6–9)',
        bullets: [
          { text: '6–8 week sprints across business lines', icon: '✓' },
          { text: 'Usability testing, concept validation', icon: '✓' },
          { text: 'Rides the rails R1 built from day one', icon: '✓' },
        ],
      },
    ],
    imageUrl: '/illustrations/Magnifying%20Glass.svg',
    notes: 'R1 builds the infrastructure. R2 produces research at speed because the infrastructure already exists.',
  },

  /* ── 11. Content Design ── */
  {
    type: 'cards',
    bg: 'light',
    badge: 'Deep Dive',
    title: 'Content Design — The Words Are the UI',
    cards: [
      {
        title: 'Voice & Tone (Q2)',
        titleColor: '#35605F',
        body: 'How Félix speaks. Bilingual guidelines. Emotional tone by moment: celebratory, reassuring, calm, warm.',
      },
      {
        title: 'Conversational Patterns (Q2–Q3)',
        titleColor: '#6060BF',
        body: 'Greetings, confirmations, error recovery, product discovery within conversation. Feeds multi-product framework.',
      },
      {
        title: 'AI Personality (Q3)',
        titleColor: '#F26629',
        body: 'LLM agent personality parameters. Behavioral rules and tone constraints. Bridge between content and AI engineering.',
      },
      {
        title: 'Cross-Channel (Q3–Q4)',
        titleColor: '#F19D38',
        body: 'Same personality, different expression. WhatsApp (brief), app (structured), push (action-oriented), SMS (concise).',
      },
    ],
    imageUrl: '/illustrations/Speech%20Bubbles%20%2B%20Hearts.svg',
    notes: 'Content design is critical because our primary interface is a conversation. The words ARE the product.',
  },

  /* ── 12. Omnichannel + AI ── */
  {
    type: 'cards',
    bg: 'dark',
    badge: 'Deep Dive',
    title: 'Omnichannel + AI — Design\'s Role',
    subtitle: 'The conversation is the product.',
    cards: [
      {
        title: 'Conversational Architecture',
        titleColor: '#2BF2F1',
        body: 'Flow structure, decision logic, fallback behavior, disambiguation. Design decisions that don\'t look like traditional UI.',
      },
      {
        title: 'Agent Personality',
        titleColor: '#FFCD9C',
        body: '"La tiendita" warmth as behavior rules. Proactive vs. reactive calibration. Context-aware personality.',
      },
      {
        title: 'Cross-Channel Continuity',
        titleColor: '#60D06F',
        body: 'Conversations that flow from WhatsApp to app. Context handoff. Notification bridges between surfaces.',
      },
      {
        title: 'Human-AI Handoff',
        titleColor: '#F19D38',
        body: 'When to escalate, how it feels, what context carries. Transparency with users throughout the transition.',
      },
    ],
    notes: 'Months 1–6: Content Design Lead covers this. Months 6–12: Evaluate dedicated Conversational UX Designer.',
  },

  /* ── 13. Key Numbers ── */
  {
    type: 'chart',
    bg: 'light',
    badge: 'Summary',
    title: 'Team Scales with Platform Maturity',
    body: 'Each phase builds on the last. Foundation enables capability, capability enables scale.',
    chart: {
      chartType: 'bar',
      data: [
        { label: 'Today', headcount: 3 },
        { label: 'Q2 (Foundation)', headcount: 6 },
        { label: 'Q3 (Capability)', headcount: 9 },
        { label: 'Q4+ (Scale)', headcount: 12 },
      ],
      xKey: 'label',
      yKeys: ['headcount'],
      colors: ['#2BF2F1'],
      yLabel: 'Designers',
    },
    notes: 'Including Head of Design. Plus 1–2 contractors at steady state.',
  },

  /* ── 14. Closing ── */
  {
    type: 'closing',
    bg: 'brand',
    badge: 'The Promise',
    title: 'Design Makes the Promise Real.',
    subtitle: 'Every conversation, every transaction, every moment a user trusts us with their money.',
    body: '**10–12 designers** at full build · **3 platform functions** · **Q4 2026 target** for full team.\n\nLet\'s prepare for a period of learnings and iterating. It will take energy — but will make us stronger.',
    imageUrl: '/illustrations/Rocket%20Launch%20-%20Growth%20%2B%20Coin%20-%20Turquoise.svg',
    notes: 'Design is how we keep the "trusted financial companion" promise at scale, across every product and surface.',
  },
]

export default function DesignRoadmapPage() {
  return (
    <div className="fixed inset-0 z-40">
      <SlideRenderer
        slides={slides}
        title="Product Design Roadmap"
        deckId="design-roadmap"
        isFullScreen
      />
    </div>
  )
}
