/**
 * One-time script: copy the /consumer-payments mission deck into kyle.cooney@felixpago.com's studio account.
 *
 * Run: npx tsx scripts/copy-consumer-payments-deck.ts
 */

import { getUserByEmail, createPresentation } from '../lib/studio-db'

const slides = [
  /* 1. Title — Consumer Payments Mission */
  {
    type: 'title',
    bg: 'dark' as const,
    badge: 'Consumer Payments',
    title: 'Consumer Payments Mission',
    subtitle: 'Product Offsite · March 2026 · Confidential',
    imageUrl: '/illustrations/Cell%20Phone%20%2B%20Flying%20Dollar%20Bills%20-%20Turquoise.svg',
    notes: 'Dark title slide with Felix branding and phone mockup showing WhatsApp chat interface. FX notification bubble highlights the real-time exchange rate feature. Background illustrations include dollar bills, coins, and cloud coins.',
  },
  /* 2. Org Chart */
  {
    type: 'cards',
    bg: 'dark' as const,
    badge: 'Team Structure',
    title: 'Consumer Payments',
    subtitle: 'Sam C. · Product VP',
    cards: [
      { title: 'Activation', titleColor: '#2BF2F1', body: '**Hernan A.** — Product Lead' },
      { title: 'Core Send', titleColor: '#2BF2F1', body: '**Santi S.** — Product Lead\n\nReports: Core 2 (Hiring PM)' },
      { title: 'Geos and Pricing', titleColor: '#2BF2F1', body: '**Carla C.** — Product Director\n\nReports: Dani R. (Geo Launch PM), Geo Scale (Hiring PM), Pricing (Hiring PM)' },
      { title: 'Payment Bets', titleColor: '#2BF2F1', body: '**Diego V.** — Sr. PM' },
      { title: 'Product Design', titleColor: '#60D06F', body: '**Kyle C.** — Head\n\nReports: Pato Beltran (Prod. Designer), 2× Hiring (Prod. Designer), Jose SM (Research PM)' },
      { title: 'Data', titleColor: '#FFCD9C', body: '**Fabricio Q.** — Analyst' },
    ],
    notes: 'Org chart showing Sam C. (Product VP) at the top with 6 direct reports: Activation, Core Send, Geos & Pricing, Payment Bets, Product Design, and Data. Several sub-reports under Geos & Pricing and Product Design, with multiple hiring positions open.',
  },
  /* 3. Activation Squad Mission */
  {
    type: 'two-column',
    bg: 'light' as const,
    badge: 'Activation Squad',
    title: 'Activation Squad',
    columns: [
      {
        heading: '',
        body: 'Bridging the gap between discovery and habit, ensuring every user\'s introduction to our product is the start of a lasting financial relationship.',
      },
      {
        heading: 'Mission',
        body: '**Bridge the gap between discovery and habit, ensuring every user\'s introduction is the start of a lasting financial relationship.**',
        bullets: [
          { text: 'Nail the signup before the first send', icon: '✓' },
          { text: 'Get money to the recipient with minimal friction', icon: '✓' },
          { text: 'Assist at each drop-off until habit forms', icon: '✓' },
        ],
      },
    ],
    imageUrl: '/illustrations/Hand%20-%20Stars.svg',
    notes: 'Activation Squad mission slide. Two-column layout with editorial description on the left and mission statement with lime-highlighted text on the right. F icon in turquoise circle. Three key objectives listed with checkmarks.',
  },
  /* 4. Activation Bridge */
  {
    type: 'content',
    bg: 'dark' as const,
    badge: 'Activation Squad',
    title: 'Activation',
    body: '**Signup** (Pre-first transaction) → **Aha!** (1-2 trx) → **Habit** (3-6 trx)\n\nThe bridge from Acquisition to Product. Users arrive skeptical ("What is Felix, does it work?") and leave as believers ("Felix is amazing!").\n\nProduct Offsite March 2026 · Confidential',
    imageUrl: '/illustrations/Rocket%20Launch%20-%20Growth%20%2B%20Coin%20-%20Turquoise.svg',
    notes: 'Dark slide showing the activation bridge diagram. A visual arc connects Acquisition (left) to Product (right) with Activation spanning the bridge. Below, a timeline shows three stages: Signup (pre-first transaction), Aha! (1-2 transactions), and Habit (3-6 transactions).',
  },
  /* 5. Activation Themes */
  {
    type: 'cards',
    bg: 'light' as const,
    title: 'Activation Themes',
    cards: [
      {
        title: 'Make it easy — non tech-savvy',
        titleColor: '#082422',
        body: '**Remove friction at every step**\n\n• Non-text inputs for key data (e.g., account photo)\n• Seamless web → WhatsApp handoff with full context\n• Step-by-step flow with clear guidance',
      },
      {
        title: 'Make it easy — tech-savvy',
        titleColor: '#082422',
        body: '**Give them the wheel**\n\n• Capture preferences early (e.g., FX alerts)\n• Skip steps, fewer confirmations, faster path to send\n• Surface richer information on demand',
      },
      {
        title: 'Nudges',
        titleColor: '#082422',
        body: '**Assist at every drop-off point**\n\n• FX nudges timed to convert\n• Proactive nudges for slow users (25–105 min)\n• Next-day re-engagement for late-night users\n• 50-day follow-up',
      },
    ],
    notes: 'Three activation theme cards with turquoise bottom accent. Each card targets a different user segment or strategy: reducing friction for non-tech-savvy users, empowering tech-savvy users with control, and proactive nudging at drop-off points.',
  },
  /* 6. Core Send Squad Mission */
  {
    type: 'two-column',
    bg: 'dark' as const,
    badge: 'Core Send Squad',
    title: 'Core Send Squad',
    columns: [
      {
        heading: '',
        body: 'Making every send so reliable, effortless, and intelligent that users don\'t need to ask for help — and the experience gets better the longer they stay.',
      },
      {
        heading: 'Mission',
        body: '**Make every send so reliable and intelligent that users never need a human — unless they truly want one.**',
        bullets: [
          { text: '**Quality:** Self-serve by default. Human by choice.', icon: '✓' },
          { text: '**Power Users:** The longer you stay, the better Felix gets.', icon: '✓' },
          { text: '**UX Horizontal:** Same trusted partner in every room.', icon: '✓' },
          { text: '**Experience:** Make every interaction smoother.', icon: '✓' },
        ],
      },
    ],
    imageUrl: '/illustrations/Fast.svg',
    notes: 'Core Send Squad mission slide on dark background. Two-column layout with editorial on left and mission card on right. Lime-highlighted mission text. Four themes listed: Quality, Power Users, UX Horizontal, Experience Improvements.',
  },
  /* 7. Quality Themes */
  {
    type: 'cards',
    bg: 'light' as const,
    title: 'Quality — users never need a human until they truly want one',
    cards: [
      {
        title: 'Prevent the Problem',
        titleColor: '#082422',
        body: '• **Errors:** Error handling, bot failure recovery\n• **Reliability:** Kill Switch, Catalogs/Limits fix, speed indicators per payout method\n\n*Users never hit a dead-end we could have prevented*',
      },
      {
        title: 'Let Them Solve It',
        titleColor: '#082422',
        body: '• **Self-service:** Cancellations, modifications, transaction status\n• **Options Menu:** Make every button functional\n• **Account Mgmt:** Self-service beneficiary deletion\n\n*If something does happen, users resolve it themselves*',
      },
      {
        title: 'Enhanced Ninjas',
        titleColor: '#082422',
        body: '• **Process automation:** Holds & payment ops streamlined\n• **The guardrail:** Felix is never a bot carousel that blocks users from reaching help when they REALLY need it\n\n*When a human is truly needed, they arrive informed and fast*',
      },
    ],
    notes: 'Three quality theme cards with turquoise bottom accent. Progressive escalation: prevent problems, let users self-serve, and when humans are needed they arrive informed. Each card ends with an italicized principle statement.',
  },
  /* 8. Core Send — Loyalty & Consistency */
  {
    type: 'cards',
    bg: 'dark' as const,
    title: 'Core Send — Building for Loyalty & Consistency',
    cards: [
      {
        title: 'Power Users',
        titleColor: '#2BF2F1',
        body: '**Reward loyalty with efficiency**\n\n• Define the power user segment, then build for them:\n  ○ Skip-steps\n  ○ Recurring sends\n  ○ Rate benefits & alerts\n  ○ Saved recipients\n  ○ Higher limits (L3)',
      },
      {
        title: 'UX Horizontal',
        titleColor: '#2BF2F1',
        body: '**Same partner in every room.**\n\n• Multi-product consistency\n• Tone of voice and communication protocol for message orchestration',
      },
      {
        title: 'Experience Improvements',
        titleColor: '#2BF2F1',
        body: '**Make every interaction smoother**\n\n• WhatsApp Flows to improve chat usability\n• Post-TXN Revamp: better communication after payment is completed',
      },
    ],
    notes: 'Dark slide with three Core Send theme cards. Power Users focuses on loyalty rewards and efficiency features. UX Horizontal ensures consistency across products. Experience Improvements targets WhatsApp usability and post-transaction communication.',
  },
  /* 9. Geo Expansion Squad Mission */
  {
    type: 'two-column',
    bg: 'light' as const,
    badge: 'Geo Expansion Squad',
    title: 'Geo Expansion Squad',
    columns: [
      {
        heading: '',
        body: 'Expanding Felix into new markets and optimizing non-MX corridors, which represent ~60% of US →LatAm remittances.',
      },
      {
        heading: 'Mission',
        body: '**Expand Felix into new markets and optimize non-MX corridors, which represent ~60% of US →LatAm remittances.**',
        bullets: [
          { text: 'Launch ~11 new countries in 2026', icon: '✓' },
          { text: 'Launch velocity — streamline process & technology', icon: '✓' },
          { text: 'Graduation & Scaling — Launch→Land→Scale framework', icon: '✓' },
          { text: 'Country Optimization (360 view) — take to MX levels', icon: '✓' },
        ],
      },
    ],
    imageUrl: '/illustrations/Map.svg',
    notes: 'Geo Expansion Squad mission slide. Two-column layout with Map illustration. ~60% of US→LatAm remittances are non-MX corridors. Plan to launch ~11 new countries in 2026 with a Launch→Land→Scale framework.',
  },
  /* 10. Geo Expansion Themes */
  {
    type: 'cards',
    bg: 'dark' as const,
    title: 'Geo Expansion Themes',
    cards: [
      {
        title: 'Launch velocity',
        titleColor: '#2BF2F1',
        body: '**Tech & processes to launch many countries fast**\n\n• Processes to help us speed up and act smarter on each launch\n• Tech capability for rapid, repeatable launches\n• Multi-language capability for non-Spanish corridors',
      },
      {
        title: 'Graduation & Scale',
        titleColor: '#2BF2F1',
        body: '**Healthy standards from launch to scale**\n\n• Reviewing and executing launch & land criterias that go together with company-wide needs',
      },
      {
        title: 'Country Optimizations',
        titleColor: '#2BF2F1',
        body: '**Improve every scaling non-MX corridor**\n\n• Country-specific action plans and ownership\n• Target metrics: conversion, NPS, disbursement success, bot failures, margins (360 approach)',
      },
    ],
    notes: 'Dark slide with three Geo Expansion theme cards. Launch velocity focuses on repeatable launch processes. Graduation & Scale defines standards from launch to scale. Country Optimizations targets corridor-specific metrics.',
  },
  /* 11. Pricing Squad Mission */
  {
    type: 'two-column',
    bg: 'light' as const,
    badge: 'Pricing Squad',
    title: 'Pricing Squad',
    columns: [
      {
        heading: '',
        body: 'Maximizing the value we deliver to users and capture as a business — through research, experimentation, and user-centric thinking.',
      },
      {
        heading: 'Mission',
        body: '**Maximize the value we deliver to users and capture as a business — through research, experimentation, and user-centric thinking.**',
        bullets: [
          { text: 'Infrastructure & Foundations for Experimentation', icon: '✓' },
          { text: 'Pricing Discovery & Optimization (structures, levels & UX)', icon: '✓' },
          { text: 'Loyalty & Multi-Product', icon: '✓' },
        ],
      },
    ],
    imageUrl: '/illustrations/Calculator%20%2B%20Stack%20of%20coins.svg',
    notes: 'Pricing Squad mission slide. Operates in a price-sensitive market where users actively switch between providers. Three focus areas: experimentation infrastructure, pricing optimization, and loyalty/multi-product strategy.',
  },
  /* 12. Pricing Squad Themes */
  {
    type: 'cards',
    bg: 'dark' as const,
    title: 'Pricing Squad Themes',
    cards: [
      {
        title: 'Infrastructure & Foundations',
        titleColor: '#2BF2F1',
        body: '**Build the engine to experiment**\n\n• Migrate pricing logic from chat to glucose\n• Enable experimentation in Amplitude\n• Ongoing assessments for infra enhancements depending on experimentation needs',
      },
      {
        title: 'Pricing Discovery & Optimization',
        titleColor: '#2BF2F1',
        body: '**Research, structure, price levels and UX, per corridor**\n\n• Test pricing structures informed by user research\n• Sensitivity testing per country and corridor\n• Pricing transparency and E2E UX',
      },
      {
        title: 'Loyalty & Multi-product',
        titleColor: '#2BF2F1',
        body: '**High-leverage retention plays**\n\n• New pricing products: Subscription models, Reward loyalty with pricing benefits\n• Multi-product pricing strategy\n• Clear value communication throughout E2E journey',
      },
    ],
    notes: 'Dark slide with three Pricing Squad theme cards. Infrastructure focuses on migrating pricing to glucose and enabling Amplitude experimentation. Discovery targets per-corridor pricing optimization. Loyalty explores subscription models and multi-product pricing.',
  },
  /* 13. New Bets Squad Mission */
  {
    type: 'two-column',
    bg: 'light' as const,
    badge: 'New Bets Squad',
    title: 'New Bets Squad',
    columns: [
      {
        heading: '',
        body: 'Expanding Félix\'s consumer payments offering by launching new products that give users more reasons to not leave.',
      },
      {
        heading: 'Mission',
        body: '**Expand Felix\'s consumer payments offering by launching new products that give users more reasons to not leave.**',
        bullets: [
          { text: '**Engagement:** Give users new reasons to open Felix between remittance cycles', icon: '✓' },
          { text: '**Moat:** Reduce the need for users to leave Felix by bundling adjacent financial services', icon: '✓' },
          { text: '**Moonshot:** Experiment and validate unproven ideas (voice notes, zelle, etc.)', icon: '✓' },
        ],
      },
    ],
    imageUrl: '/illustrations/Gift%20Box%20%2B%20Coins.svg',
    notes: 'New Bets Squad mission slide. Three strategic pillars: increase session frequency (engagement), drive deeper ecosystem loyalty (moat), and moonshot exploration of unproven ideas.',
  },
  /* 14. New Bets Themes */
  {
    type: 'cards',
    bg: 'dark' as const,
    title: 'New Bets Themes',
    cards: [
      {
        title: 'Increased Session Frequency',
        titleColor: '#2BF2F1',
        body: '**Increase the number of jobs-to-be-done for which Felix provides a solution**\n\n• Top-ups\n• Domestic P2P\n• International bill payments\n• Domestic bill payments\n• Merchant payments',
      },
      {
        title: 'Drive deeper ecosystem loyalty',
        titleColor: '#2BF2F1',
        body: '**Helping users forget about the competition**\n\n• Loyalty/Subscription program',
      },
      {
        title: 'Moonshot exploration',
        titleColor: '#2BF2F1',
        body: '**Try the things that don\'t fit in any roadmap**\n\n• Outbound voice note messaging\n• Sending remittance with phone number only\n• Recipient link (user creates link for others to send money)\n\n*Note: These are not all planned projects but themes to be explored and tested*',
      },
    ],
    notes: 'Dark slide with three New Bets theme cards. Session Frequency adds new payment types (top-ups, P2P, bill payments). Ecosystem Loyalty focuses on subscription/loyalty programs. Moonshot explores novel ideas like voice notes and phone-number-only sends.',
  },
]

async function main() {
  const user = await getUserByEmail('kyle.cooney@felixpago.com')
  if (!user) {
    console.error('User kyle.cooney@felixpago.com not found in studio DB')
    process.exit(1)
  }

  console.log(`Found user: ${user.name} (${user.id})`)

  const pres = await createPresentation(
    user.id,
    'Consumer Payments Mission',
    'Consumer Payments team mission deck — squad missions, themes, and org structure for the product offsite March 2026',
    slides,
    'anthropic',
    'claude-sonnet-4-20250514',
    {
      title: 'Consumer Payments Mission',
      type: 'strategy',
      summary: 'Consumer Payments team mission deck covering org structure, and the missions and themes for 5 squads: Activation, Core Send, Geo Expansion, Pricing, and New Bets.',
      sections: [
        { title: 'Title', content: 'Consumer Payments Mission — Product Offsite March 2026.', slideIndex: 0 },
        { title: 'Org Chart', content: 'Sam C. (Product VP) leads 6 direct reports: Activation (Hernan A.), Core Send (Santi S.), Geos & Pricing (Carla C.), Payment Bets (Diego V.), Product Design (Kyle C.), Data (Fabricio Q.).', slideIndex: 1 },
        { title: 'Activation Squad', content: 'Mission: Bridge the gap between discovery and habit. Key goals: nail signup, minimize friction, assist at every drop-off.', slideIndex: 2 },
        { title: 'Activation Bridge', content: 'User journey from Acquisition through Activation to Product: Signup (pre-first trx) → Aha! (1-2 trx) → Habit (3-6 trx).', slideIndex: 3 },
        { title: 'Activation Themes', content: 'Three themes: Make it easy for non-tech-savvy users, empower tech-savvy users, and proactive nudges at drop-off points.', slideIndex: 4 },
        { title: 'Core Send Squad', content: 'Mission: Make every send reliable, effortless, and intelligent. Themes: Quality, Power Users, UX Horizontal, Experience Improvements.', slideIndex: 5 },
        { title: 'Quality', content: 'Three pillars: Prevent the Problem, Let Them Solve It, Enhanced Ninjas. Progressive escalation from prevention to self-service to human support.', slideIndex: 6 },
        { title: 'Core Send Themes', content: 'Power Users (loyalty rewards), UX Horizontal (cross-product consistency), Experience Improvements (WhatsApp Flows, Post-TXN Revamp).', slideIndex: 7 },
        { title: 'Geo Expansion Squad', content: 'Mission: Expand to new markets and optimize non-MX corridors (~60% of US→LatAm remittances). Launch ~11 new countries in 2026.', slideIndex: 8 },
        { title: 'Geo Expansion Themes', content: 'Launch velocity (rapid repeatable launches), Graduation & Scale (standards), Country Optimizations (360 approach per corridor).', slideIndex: 9 },
        { title: 'Pricing Squad', content: 'Mission: Maximize value for users and business through research and experimentation in a price-sensitive market.', slideIndex: 10 },
        { title: 'Pricing Squad Themes', content: 'Infrastructure (migrate to glucose, Amplitude), Discovery & Optimization (per-corridor testing), Loyalty & Multi-product (subscriptions, pricing benefits).', slideIndex: 11 },
        { title: 'New Bets Squad', content: 'Mission: Launch new products that give users more reasons to stay. Focus on engagement, moat, and moonshot exploration.', slideIndex: 12 },
        { title: 'New Bets Themes', content: 'Session Frequency (top-ups, P2P, bill pay), Ecosystem Loyalty (subscription), Moonshot (voice notes, phone-number sends, recipient links).', slideIndex: 13 },
      ],
    },
  )

  console.log(`Created presentation: ${pres.id}`)
  console.log(`Title: ${pres.title}`)
  console.log(`Slides: ${pres.slides.length}`)
  console.log(`Done! View at /create/${pres.id}`)
}

main().catch(console.error)
