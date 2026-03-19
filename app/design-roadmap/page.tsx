'use client'

import { SlideRenderer, type SlideData } from '@/components/studio/slide-renderer'

const slides: SlideData[] = [
  /* ── 1. Title ── */
  {
    type: 'title',
    bg: 'brand',
    badge: 'Product Design',
    title: 'Product Design Roadmap',
    subtitle: 'Establishing a centralized, embedded design organization to support Félix\'s platform + business lines model.',
    imageUrl: '/illustrations/Hands%20-%202%20Cell%20Phones%20-%20Juntos%20we%20Succeed.svg',
    notes: 'This deck outlines the product design organization roadmap for Q2–Q4 2026 and beyond. It covers the vision, org model, hiring sequence, roadmap priorities, and deep dives into research, content design, and AI/omnichannel design.',
  },

  /* ── 2. Vision ── */
  {
    type: 'two-column',
    bg: 'dark',
    badge: 'Vision',
    title: 'Design Makes the Promise Real',
    columns: [
      {
        heading: 'An Experience Claim',
        body: 'Félix\'s vision is to be the **Trusted Financial Companion for Latinos in the US**. That\'s fundamentally an experience claim, not a feature claim. Design is how we deliver on it.\n\nOur users told us: trust comes from **human interaction**, not just slick UX. We replicate the warmth of "la tiendita" — digitally. Design\'s job is to make that warmth consistent across every product, on every surface, through every interaction.',
      },
      {
        heading: 'Two Design Principles',
        bullets: [
          { text: '**Design as connective tissue** — The platform gives us speed and consistency. The business lines give us depth and market fit. Design ensures every touchpoint feels like the same trusted companion.', icon: '✓' },
          { text: '**Build once, deploy everywhere** — Design the system once at the platform level, adapt it for each business line and surface. This is how we ship quality at speed across WhatsApp, app, web, and whatever comes next.', icon: '✓' },
        ],
      },
    ],
    imageUrl: '/illustrations/Heart%20-F%C3%A9lix.svg',
    notes: 'Design is the connective tissue between platform and business lines. The "la tiendita" warmth is our north star — digitizing that experience of warmth and human trust across every touchpoint.',
  },

  /* ── 3. Org Model ── */
  {
    type: 'cards',
    bg: 'light',
    badge: 'Org Model',
    title: 'Centralized but Embedded',
    subtitle: 'Three design functions aligned to the platform architecture. Total team: 10–12 people including Head of Design.',
    cards: [
      {
        title: 'Surface & UX Platform',
        titleColor: '#35605F',
        body: '**5–6 designers.** Design system, content design, UX research, app design, and conversational UX (future). This team creates leverage for everyone — the components, patterns, voice, and research infrastructure that all business lines build on.',
      },
      {
        title: 'Fintech Core',
        titleColor: '#6060BF',
        body: '**1 designer.** Identity/KYC flows, payment UX, trust & security patterns, and FX transparency. Shared trust patterns that every product inherits — the foundational experience layer that makes Félix feel safe and reliable.',
      },
      {
        title: 'Embedded in Business Lines',
        titleColor: '#F26629',
        body: '**4–5 designers.** Consumer Payments (2–3), Credit (1), Wallet/Store of Value (1). These designers live inside product squads, bringing depth and market fit while leveraging the platform team\'s design system and patterns.',
      },
    ],
    imageUrl: '/illustrations/3%20Paper%20Airplanes%20%2B%20Coins.svg',
    notes: 'The split is approximately 55% platform and 45% embedded. Plus 1–2 staff augmentation contractors for design system and app production work. This model ensures both leverage (platform) and depth (embedded).',
  },

  /* ── 4. Team Composition ── */
  {
    type: 'bullets',
    bg: 'dark',
    badge: 'Org Model',
    title: 'Team Composition & Ratios',
    subtitle: 'Platform roles create leverage for everyone. Embedded roles create depth in each business line.',
    bullets: [
      { text: '**Head of Design** — Spans all three functions, sets quality bar and design strategy', icon: '→' },
      { text: '**Design System Designer** — Highest-leverage hire. Enables staff aug, speeds every designer on the team', icon: '→' },
      { text: '**Content Design Lead** — Voice, tone, conversational patterns, and bilingual guidelines across all surfaces', icon: '→' },
      { text: '**UX Researcher (R1)** — Foundational research plus building the practice org-wide', icon: '→' },
      { text: '**App Designer** — Cross-product app experience, works across all business lines', icon: '→' },
      { text: '**UX Researcher (R2)** — 6–8 week rotations across business lines. Hired at month 6–9', icon: '→' },
      { text: '**Fintech Core Designer** — KYC, payments, fraud alerts, FX transparency. Shared trust patterns', icon: '→' },
      { text: '**Consumer Payments ×2–3** — ~3:1 PM-to-designer ratio, organized by funnel stage', icon: '→' },
      { text: '**Credit + Wallet Designers** — Senior ICs comfortable with ambiguity. Greenfield product exploration', icon: '→' },
    ],
    notes: 'Each role is mapped to either the platform or embedded function. The design system designer is our highest-priority hire because it creates the foundation that makes staff augmentation viable and every other designer more productive.',
  },

  /* ── 5. Hiring Sequence ── */
  {
    type: 'cards',
    bg: 'light',
    badge: 'Hiring Plan',
    title: 'Hiring Sequence',
    subtitle: 'Three phases aligned to the reorg migration timeline. All core reqs open in parallel.',
    cards: [
      {
        title: 'Phase 1 · Q1–Q2: Foundation',
        titleColor: '#35605F',
        body: '**5–6 people + you.** Design System Designer, Content Design Lead, Consumer Payments ×2, Fintech Core Designer. Plus 1 contractor for design system build-out. Establish the platform, support current product priorities.',
      },
      {
        title: 'Phase 2 · Q3: Build Capability',
        titleColor: '#6060BF',
        body: '**8–9 people + you.** App Designer, UX Researcher (R1), Credit Designer (if product ready), Wallet Designer (if product ready). Flex contractor for app launch support. Go multi-surface, deepen product design.',
      },
      {
        title: 'Phase 3 · Q4+: Scale',
        titleColor: '#F19D38',
        body: '**10–12 people + you.** UX Researcher (R2) at month 6–9, Conversational UX Designer (evaluate need), 3rd Consumer Payments designer (if volume warrants). Steady-state: 1 permanent + flex contractors.',
      },
    ],
    imageUrl: '/illustrations/Rocket%20Launch%20-%20Growth%20%2B%20Coin%20-%20Turquoise.svg',
    notes: 'The phased approach ensures we build the platform foundation first (Phase 1), then expand capability (Phase 2), then scale (Phase 3). Each phase aligns to the company reorg timeline.',
  },

  /* ── 6. Staff Aug Strategy ── */
  {
    type: 'cards',
    bg: 'dark',
    badge: 'Org Model',
    title: 'Staff Augmentation Strategy',
    subtitle: 'Contractors extend capacity — they don\'t replace ownership. The design system is the prerequisite.',
    cards: [
      {
        title: 'Good Fit for Contractors',
        titleColor: '#60D06F',
        body: 'Design system production — components, docs, Figma libraries. App UI screen production when the design system provides sufficient guardrails. Consumer Payments overflow during launches or geographic expansion.',
      },
      {
        title: 'Situational',
        titleColor: '#F19D38',
        body: 'Fintech core pattern execution under full-time employee direction. Usability test moderation and analysis support. These require close oversight from an FTE who owns the quality bar.',
      },
      {
        title: 'Must Be Full-Time',
        titleColor: '#F26629',
        body: 'Content design, UX research, Credit/Wallet embedded designers, and the design system IC (the strategist, not the production layer). These roles require deep context, ownership, and judgment that contractors can\'t provide.',
      },
    ],
    notes: 'Key insight: a contractor without a design system is a freelancer making things up. A contractor with a design system produces on-brand, consistent work from week one. This is why the design system designer is our highest-priority hire.',
  },

  /* ── 7. Roadmap Overview ── */
  {
    type: 'two-column',
    bg: 'light',
    badge: 'Roadmap',
    title: 'Design Roadmap — Two Tracks',
    subtitle: 'Complements the product roadmap, doesn\'t duplicate it.',
    columns: [
      {
        heading: 'Track 1: Design Foundation',
        body: 'What the centralized design org builds — regardless of what any product team ships.',
        bullets: [
          { text: 'Design system & pattern library', icon: '✓' },
          { text: 'Content & conversational UX patterns', icon: '✓' },
          { text: 'Research infrastructure & practice', icon: '✓' },
          { text: 'Cross-surface experience coherence', icon: '✓' },
          { text: 'Omnichannel + AI design patterns', icon: '✓' },
        ],
      },
      {
        heading: 'Track 2: Design in Product',
        body: 'How design shows up within the product roadmap — the design lens on product priorities.',
        bullets: [
          { text: 'Multi-product discovery framework', icon: '✓' },
          { text: 'Checkout flow restructuring', icon: '✓' },
          { text: 'Credit & wallet product definition', icon: '✓' },
          { text: 'Geo expansion experience design', icon: '✓' },
          { text: 'Receiver-side experience', icon: '✓' },
        ],
      },
    ],
    imageUrl: '/illustrations/Survey.svg',
    notes: 'Track 1 is what the centralized platform team owns. Track 2 is how embedded designers contribute to product squad priorities. Both tracks run in parallel and reinforce each other.',
  },

  /* ── 8. Now — Q2 2026 ── */
  {
    type: 'bullets',
    bg: 'dark',
    badge: 'Now · Q2 2026',
    title: 'Stand Up the Org, Establish Credibility',
    subtitle: 'Support current priorities while building the foundation for everything that follows.',
    bullets: [
      { text: '**Multi-product discovery** — Establish scalable framework for exposing top-ups, bill pay, and credit in WhatsApp. Account for user journey, session intensity, transaction history, and likely next actions.', icon: '→' },
      { text: '**Checkout improvements** — Collaborate with Fintech Core on UX restructuring of checkout flow to optimize for scalable payment methods across business lines.', icon: '→' },
      { text: '**Design system** — Expand component library to support redesigned checkout, wallet, top-ups, and bill pay. Define UX guidelines and pattern library for shared patterns across WhatsApp and web/app.', icon: '→' },
      { text: '**Research foundation** — Empower PMs and engineers to conduct more research, more regularly. Establish consistent framework and cadence for user recruitment pipelines.', icon: '→' },
      { text: '**Content design** — Define the Félix voice & tone system across all touchpoints. Build initial conversational flow patterns library. Establish bilingual content guidelines.', icon: '→' },
    ],
    notes: 'Q2 is about establishing credibility by shipping alongside product priorities while simultaneously building the design infrastructure that makes everything else possible.',
  },

  /* ── 9. Next — Q3 2026 ── */
  {
    type: 'bullets',
    bg: 'light',
    badge: 'Next · Q3 2026',
    title: 'Build Capability, Go Multi-Surface',
    subtitle: 'Deepen product design and launch the app experience.',
    bullets: [
      { text: '**App launch** — Define the holistic app experience: navigation, IA, how remittances, credit, and wallet coexist. Cross-channel handoff patterns from WhatsApp to app.', icon: '→' },
      { text: '**Credit & wallet product design** — Embedded designers lead discovery for SNPL flows in conversational and app interfaces. Wallet experience definition — making abstract financial concepts tangible and trustworthy.', icon: '→' },
      { text: '**Design system v1** — Ship v1 of cross-surface design system supporting WhatsApp patterns, app components, and web. Establish design critique and quality review processes.', icon: '→' },
      { text: '**Research practice** — R1 has built the lightweight research toolkit. Foundational study: user mental models around trust, money movement, and financial products. Evaluate hiring R2.', icon: '→' },
      { text: '**Content & conversational UX** — AI agent personality & prompt guidelines. Conversational flow patterns extended to credit and wallet. Cross-channel tone adaptation.', icon: '→' },
    ],
    imageUrl: '/illustrations/Hand%20-%20Cell%20Phone%20OK.svg',
    notes: 'Q3 is when we go multi-surface with the app launch and start deepening into credit and wallet products. The research practice should be self-sustaining by this point.',
  },

  /* ── 10. Later — Q4 2026+ ── */
  {
    type: 'cards',
    bg: 'dark',
    badge: 'Later · Q4 2026+',
    title: 'Scale the Ecosystem, Mature the Practice',
    cards: [
      {
        title: 'Full Financial Ecosystem',
        titleColor: '#2BF2F1',
        body: 'Design patterns for insurance, DeFi lending, and yield products as they come online. Receiver-side experience investment — understanding and designing for families abroad. Geo expansion design support for new corridors.',
      },
      {
        title: 'Omnichannel + AI Maturity',
        titleColor: '#FFCD9C',
        body: 'Evaluate dedicated conversational UX designer role. Human-AI handoff optimization based on data. Multi-agent design patterns as product complexity grows. Voice channel exploration.',
      },
      {
        title: 'Design System & Ops at Scale',
        titleColor: '#60D06F',
        body: 'Design system supports full product ecosystem across all surfaces. Design ops practice: tooling, handoff processes, design-to-eng efficiency metrics. Quality bar enforcement across 4+ business lines.',
      },
      {
        title: 'Research at Scale',
        titleColor: '#F19D38',
        body: 'R2 in steady rotation across business lines. Receiver-side research capability with LATAM logistics and in-market fieldwork. Insight-driven product strategy as a core design org competency.',
      },
    ],
    notes: 'Q4 and beyond is about scaling the practice to support a full financial ecosystem. The design org should be mature enough to enforce quality across multiple business lines while supporting new product exploration.',
  },

  /* ── 11. Research Model ── */
  {
    type: 'two-column',
    bg: 'light',
    badge: 'Deep Dive',
    title: 'Research Model',
    subtitle: 'Building the practice from scratch with a staggered two-researcher approach.',
    columns: [
      {
        heading: 'Researcher 1 — Platform',
        body: '**Hired in Phase 1 · Surface & UX team.**\n\nFoundational studies on trust, mental models, and financial literacy. Builds research practice: templates, recruiting pipelines, insight repository, lightweight testing toolkit. Teaches designers and PMs to self-serve on evaluative research.',
      },
      {
        heading: 'Researcher 2 — Roaming',
        body: '**Hired at month 6–9 · Rotates across business lines.**\n\n6–8 week research sprints aligned to highest-priority product decisions. Tactical and evaluative research: usability testing, concept validation, funnel analysis. Quarterly rotation planning with Head of Design.',
      },
    ],
    imageUrl: '/illustrations/Magnifying%20Glass.svg',
    notes: 'Why stagger: Starting from zero, R1 needs 2–3 months to establish how research works at Félix. Once those rails exist, R2 rides them from day one and focuses on producing research rather than also building infrastructure.',
  },

  /* ── 12. Content Design ── */
  {
    type: 'cards',
    bg: 'dark',
    badge: 'Deep Dive',
    title: 'Content Design Lead — Key Projects',
    subtitle: 'The words are the UI — especially in a conversational-first product.',
    cards: [
      {
        title: 'Voice & Tone System (Q2)',
        titleColor: '#2BF2F1',
        body: 'Define how Félix speaks across every touchpoint. Bilingual guidelines — Spanish, English, Spanglish — when to use each. Emotional tone calibration by moment type: celebratory, reassuring, calm, warm.',
      },
      {
        title: 'Conversational Patterns (Q2–Q3)',
        titleColor: '#FFCD9C',
        body: 'Standardized patterns for greetings, disambiguation, high-stakes confirmations, error recovery, and product introduction within conversation. Directly feeds the multi-product discovery framework.',
      },
      {
        title: 'AI Agent Personality (Q3)',
        titleColor: '#60D06F',
        body: 'Working with the omnichannel + AI team, define personality parameters that guide the LLM agent. Behavioral rules, tone constraints, and how personality adapts by context — first-time sender vs. power user.',
      },
      {
        title: 'Cross-Channel Adaptation (Q3–Q4)',
        titleColor: '#F19D38',
        body: 'How Félix\'s voice adapts: WhatsApp (conversational, brief), app (scannable, structured), push notifications (action-oriented), SMS (ultra-concise). Same personality, different expression.',
      },
    ],
    notes: 'Content design is uniquely important at Félix because our primary interface is a conversation. The words ARE the product — every greeting, confirmation, and error message shapes trust.',
  },

  /* ── 13. Omnichannel + AI ── */
  {
    type: 'two-column',
    bg: 'light',
    badge: 'Deep Dive',
    title: 'Omnichannel + AI — Design\'s Role',
    subtitle: 'The conversation is the product. This layer needs deliberate design investment.',
    columns: [
      {
        heading: 'Design Decisions That Don\'t Look Like UI',
        bullets: [
          { text: '**Conversational UX architecture** — Flow structure, decision logic, fallback behavior, disambiguation patterns', icon: '✓' },
          { text: '**Agent personality & behavior** — "La tiendita" warmth as agent behavior rules — proactive vs. reactive, sensitivity calibration', icon: '✓' },
          { text: '**Cross-channel adaptation** — How a conversation on WhatsApp continues in the app. Context handoff, notification bridges', icon: '✓' },
          { text: '**Human-AI handoff** — When to escalate, how the transition feels, what context carries over, transparency with users', icon: '✓' },
        ],
      },
      {
        heading: 'Staged Approach',
        body: '**Months 1–6:** Content Design Lead covers this layer, defining initial patterns for WhatsApp conversational flows.\n\n**Months 6–12:** As the product goes multi-channel and multi-product, evaluate adding a dedicated conversational UX designer embedded with the omnichannel engineering team.\n\nThe conversation is Félix\'s primary interface. Getting this right is not a nice-to-have — it\'s the product.',
      },
    ],
    imageUrl: '/illustrations/Speech%20Bubbles%20%2B%20Hearts.svg',
    notes: 'Félix\'s primary interface is a conversation with an AI agent. The omnichannel + AI layer determines what that conversation says, how it adapts across channels, and when it escalates. These are design decisions that don\'t look like traditional UI design.',
  },

  /* ── 14. Closing ── */
  {
    type: 'closing',
    bg: 'brand',
    badge: 'The Promise',
    title: 'Design Makes the Promise Real.',
    subtitle: '"Trusted Financial Companion" is a promise made through experience — every conversation, every transaction, every moment a user trusts us with their money.',
    body: '**10–12 designers** at full build · **3 platform functions** — Surface & UX, Fintech Core, Embedded · **Q4 2026 target** for full team, phased hiring aligned to reorg.\n\nLet\'s prepare ourselves for a period of learnings and iterating. It will be an adjustment that will take energy — but will make us stronger.',
    imageUrl: '/illustrations/Rocket%20Launch%20-%20Growth%20%2B%20Coin%20-%20Turquoise.svg',
    notes: 'Close with the key message: design is how we keep the "trusted financial companion" promise consistently, at scale, across every product and surface. The roadmap is phased to build on itself — foundation first, then capability, then scale.',
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
