/**
 * Reimport the /felix-investor deck with maximum content fidelity.
 * 1. Updates the existing Series C deck (d6016a31-6df1-4392-925a-da604145f0d2)
 * 2. Creates a new copy as "Félix Investor Deck — V2 Import" for comparison
 *
 * Run: set -a && source .env.local && set +a && npx tsx scripts/reimport-investor-deck-v2.ts
 */

import { redis, presKey, getUserByEmail, createPresentation } from '../lib/studio-db'

const EXISTING_PRES_ID = 'd6016a31-6df1-4392-925a-da604145f0d2'

const slides = [
  // ── Slide 1: Cover ──
  {
    type: 'two-column',
    bg: 'dark',
    badge: 'Series C — Confidential',
    title: 'Félix Pago',
    subtitle: 'The financial home for 60 million Latino immigrants — **built inside WhatsApp.**',
    imageUrl: '/illustrations/F%C3%A9lix%20Illo%201.svg',
    columns: [
      {},
      {
        bullets: [
          { text: '**01 — The Problem:** Sending $200 home costs $14 in fees, takes 3 days, and requires a trip to Western Union. For 60M Latino immigrants, this is the #1 financial priority — and it\'s still broken.' },
          { text: '**02 — The Platform:** We built Félix inside WhatsApp — the app 90%+ of Latino immigrant households already use every day. No app download. No new behavior. No friction.' },
          { text: '**03 — The Moat:** Every remittance generates behavioral data. That data trains our credit model. That credit deepens the relationship. The flywheel compounds with every transaction.' },
        ],
      },
    ],
    notes: 'Cover slide. Three numbered cards on the right establish the narrative arc: broken status quo ($14 fees, 3-day settlement), the WhatsApp platform solution (90%+ penetration, zero friction), and the compounding data flywheel moat. Background: animated floating dollar bill and coin illustrations on dark slate.',
  },

  // ── Slide 2: The Hook ──
  {
    type: 'two-column',
    bg: 'light',
    badge: 'The Human Problem',
    title: 'Every month, María sends money home.',
    body: 'She works as a home health aide in Houston. Every 15th of the month, she walks to a Western Union, fills out a form, and watches **$14 vanish** from every $200 she sends to her mother in Guadalajara. Her mom waits three days.\n\nMaría has done this for 6 years. She has never missed a month.',
    quote: {
      text: 'The #1 financial priority for Latino immigrants — still broken, still expensive, still built for someone else.',
    },
    columns: [
      {
        body: 'She works as a home health aide in Houston. Every 15th of the month, she walks to a Western Union, fills out a form, and watches **$14 vanish** from every $200 she sends to her mother in Guadalajara. Her mom waits three days.\n\nMaría has done this for 6 years. She has never missed a month.',
      },
      {
        bullets: [
          { text: '**7%** — Average fee to send $200 home (World Bank, 2024 — $14 per send)' },
          { text: '**15%** — Of monthly income remitted on average among active senders to Mexico' },
          { text: '**10%** — Of Latino households are unbanked — 3× the national average. The trust gap is real.' },
          { text: '**3 days** — Average SWIFT settlement time. Weekends not included.' },
        ],
      },
    ],
    imageUrl: '/illustrations/Hands%20-%202%20Cell%20Phones%20-%20Juntos%20we%20Succeed.svg',
    notes: 'Humanizes the problem through María, a real user archetype. Left column: emotional narrative (home health aide in Houston, $14 fees on $200, 3-day settlement, 6 years without missing a month). Right column: four stat cards in papaya/mango/blueberry/sage quantifying the pain. Papaya-bordered pull quote at bottom anchors the insight.',
  },

  // ── Slide 3: The Market ──
  {
    type: 'two-column',
    bg: 'brand',
    badge: 'Market Opportunity',
    title: 'Remittances are the Trojan Horse.',
    body: 'The $60B+ US-to-LatAm remittance corridor is not the end market — it\'s the trust gateway to a **$300B underserved financial services market**. Every sender is a customer who needs a wallet, credit, savings, and insurance.',
    bullets: [
      { text: '**TAM: $161B** — Total LatAm remittances per year' },
      { text: '**SAM: $60B+** — US → LatAm digital segment' },
      { text: '**SOM: $2B+** — 5-year capture with Series C' },
      { text: '**Expansion wedge:** Today Mexico ($64B). Tomorrow Guatemala, El Salvador, Honduras, Colombia — corridors with identical dynamics and zero dominant digital player.' },
    ],
    chart: {
      chartType: 'combo',
      data: [
        { year: "'22", total: 148, digital: 14 },
        { year: "'23", total: 155, digital: 18 },
        { year: "'24", total: 161, digital: 24 },
        { year: "'25", total: 167, digital: 30 },
        { year: "'27", total: 179, digital: 44 },
        { year: "'30", total: 195, digital: 60 },
      ],
      xKey: 'year',
      yKeys: ['total'],
      lineKeys: ['digital'],
      colors: ['#6060BF', '#2BF2F1'],
      yLabel: 'US → LatAm Remittance Market ($B)',
    },
    imageUrl: '/illustrations/Rocket%20Launch%20-%20Growth%20%2B%20Coin%20-%20Turquoise.svg',
    notes: 'Reframes remittances as a wedge into a $300B financial services opportunity. Left: TAM/SAM/SOM grid ($161B/$60B+/$2B+) plus expansion wedge callout for post-Mexico corridors. Right: ComposedChart (bar+line) showing total market vs. digital segment growth 2022–2030E. Brand (turquoise) background signals confidence. Rocket illustration at bottom-right.',
  },

  // ── Slide 4: Why WhatsApp ──
  {
    type: 'two-column',
    bg: 'dark',
    badge: 'The Distribution Moat',
    title: 'No app to download. They\'re already home.',
    body: 'We built inside the app 90%+ of Latino immigrant households already use every day. Zero new behavior. Zero app store friction. Send money the same way you text your family.\n\n**The network effect built in:** Every sender invites a family member → Every recipient becomes a user → Every user is a distribution node',
    columns: [
      {
        body: 'We built inside the app 90%+ of Latino immigrant households already use every day. Zero new behavior. Zero app store friction. Send money the same way you text your family.',
        bullets: [
          { text: 'Every sender invites a family member → Every recipient becomes a user → Every user is a distribution node' },
        ],
      },
      {
        bullets: [
          { text: '**90%+** — WhatsApp penetration in Latino immigrant households (2.5× the rate of non-Hispanic Americans — Pew 2024)' },
          { text: '**3×** — Higher DAU on WhatsApp vs. standalone fintech apps (Daily active users, comparable cohort analysis)' },
          { text: '**52%** — WhatsApp-native signup conversion rate (vs. 31% baseline before AI-powered onboarding)' },
          { text: '**0** — App downloads required to send money (The lowest-friction remittance product ever built)' },
        ],
      },
    ],
    imageUrl: '/illustrations/Speech%20Bubbles%20%2B%20Hearts.svg',
    notes: 'Establishes WhatsApp as the distribution moat. Left: narrative about zero-friction access plus the built-in network effect chain (sender → family member → user → distribution node). Right: four stat cards — 90%+ penetration, 3× DAU vs fintech apps, 52% conversion (up from 31%), zero app downloads. Speech Bubbles illustration at top-right.',
  },

  // ── Slide 5: The Solution ──
  {
    type: 'two-column',
    bg: 'light',
    badge: 'The Solution',
    title: 'Send, save, borrow. From WhatsApp.',
    subtitle: '400K+ Users Served · $1B+ Transferred · $75M Series B · 8 Corridors',
    body: 'No app download. No new account. No friction. Just text Félix — and your money moves.\n\n**WhatsApp Conversation:**\n**User:** Hey Félix, send $200 to mom 🙏\n**Félix:** Got it! Sending $200 to Mamá Rosa in Guadalajara. Fee: **$2.10** · Arrives in **minutes**. Confirm? Reply YES\n**User:** YES\n**Félix:** ✅ Done! Mamá Rosa will receive $197.90 MXN equivalent. She\'s been notified.',
    columns: [
      {
        bullets: [
          { text: '💸 **Remittances** — Send money home via WhatsApp conversation', icon: '💸' },
          { text: '🏦 **Wallet** — Digital wallet for everyday transactions', icon: '🏦' },
          { text: '💳 **Credit** — AI-underwritten lending without FICO', icon: '💳' },
        ],
      },
      {
        heading: 'WhatsApp Conversation',
        body: '**User:** Hey Félix, send $200 to mom 🙏\n**Félix:** Got it! Sending $200 to Mamá Rosa in Guadalajara. Fee: **$2.10** · Arrives in **minutes**. Confirm? Reply YES\n**User:** YES\n**Félix:** ✅ Done! Mamá Rosa will receive $197.90 MXN equivalent. She\'s been notified.',
      },
    ],
    imageUrl: '/illustrations/Cell%20Phone%20%2B%20Flying%20Dollar%20Bills%20-%20Turquoise.svg',
    notes: 'Demonstrates the product through a WhatsApp chat mockup. Left: three product layers (Remittances, Wallet, Credit) and subtitle with achievement badges (400K+ users, $1B+ transferred, $75M Series B, 8 corridors). Right: full WhatsApp conversation showing a remittance completed in under a minute — $200 to mom, $2.10 fee, arrives in minutes.',
  },

  // ── Slide 6: The Flywheel ──
  {
    type: 'two-column',
    bg: 'brand',
    badge: 'The Compounding Moat',
    title: 'Every product makes every other product stronger.',
    body: 'This is not a feature set — it\'s a compounding engine. Remittance data is a credit underwriting signal that **no bank, BNPL player, or remittance app has access to**. We built the only model of its kind.',
    columns: [
      {
        heading: 'Key Metrics',
        bullets: [
          { text: '**3+ yrs** — Proprietary training data' },
          { text: '**2×** — Retention when users adopt a 2nd product' },
          { text: '**3×** — LTV when wallet is adopted' },
          { text: '**↓35%** — Cost per transaction decline YTD' },
        ],
      },
      {
        heading: 'The Félix Flywheel',
        bullets: [
          { text: '💬 **Remittances** — Builds trust + generates behavioral data on every send' },
          { text: '📊 **Behavioral Data** — Proprietary dataset: 3+ years of immigrant financial patterns' },
          { text: '🤖 **Credit Underwriting** — Model trained on remittance data, not FICO — no bank has this' },
          { text: '💳 **Credit & Wallet** — Deepens relationship, increases LTV, drives reconversion' },
          { text: '🔁 **Reconversion** — Returns to remittances at higher frequency and volume' },
          { text: '⚡ **Better Unit Economics** — More data → smarter AI → lower CAC → faster flywheel' },
        ],
      },
    ],
    notes: 'Core flywheel slide. Left: four key metrics in a stat grid (3+ yrs data, 2× retention, 3× LTV, 35% cost decline). Right: six interconnected flywheel nodes (Remittances → Data → Credit Underwriting → Credit & Wallet → Reconversion → Better Economics → repeat). Brand bg with slate stat grid. Banner at bottom: "Loop accelerates with every transaction."',
  },

  // ── Slide 7: Competitive Landscape ──
  {
    type: 'two-column',
    bg: 'dark',
    badge: 'Competitive Landscape',
    title: 'We are alone in the top-right.',
    body: 'Distribution (WhatsApp), data (remittance behavior), and culture (Latino-first) are three advantages no competitor can buy. They would have to rebuild their entire stack.',
    chart: {
      chartType: 'scatter',
      data: [
        { name: 'Félix Pago', x: 84, y: 82, size: 52, color: '#2BF2F1' },
        { name: 'Remitly', x: 22, y: 24, size: 34, color: '#888888' },
        { name: 'Wise', x: 26, y: 18, size: 30, color: '#888888' },
        { name: 'Western Union', x: 12, y: 12, size: 30, color: '#888888' },
        { name: 'Neobanks', x: 18, y: 34, size: 28, color: '#888888' },
      ],
      xKey: 'x',
      yKeys: ['y'],
      colors: ['#2BF2F1'],
      yLabel: 'WhatsApp-native vs. App-based × Full Platform vs. Transactional',
    },
    cards: [
      { title: 'Remitly / Wise', titleColor: '#888888', body: 'App-native, purely transactional. No credit. No wallet. No cultural fit. Must download an app and create an account from scratch.' },
      { title: 'Western Union', titleColor: '#888888', body: 'Legacy infrastructure, agent-based model, 5–8% fees. Zero UX innovation. Requires physical store visit.' },
      { title: 'Neobanks (Chime, etc.)', titleColor: '#888888', body: 'No remittances, no cross-border, no Latino-immigrant product focus. Built for a different audience entirely.' },
    ],
    notes: 'Competitive matrix with axes: WhatsApp-native vs. App-based and Full Financial Platform vs. Transactional. Félix alone in top-right (turquoise, large dot). Remitly, Wise, Western Union, Neobanks clustered in bottom-left (gray). Three competitor breakdown cards: Remitly/Wise (app-based, transactional), Western Union (legacy, 5-8% fees), Neobanks (no cross-border). Three-moat thesis: distribution, data, culture.',
  },

  // ── Slide 8: Why Now ──
  {
    type: 'cards',
    bg: 'dark',
    badge: 'Why Now',
    title: 'Three forces converging.',
    body: 'This window is open now. The infrastructure is ready, the population is ready, and we have 3 years of data proving product-market fit.',
    cards: [
      {
        title: '01 — Regulatory Tailwinds',
        titleColor: '#2BF2F1',
        body: 'Open banking maturing. Real-time payment infrastructure (FedNow) live. Stablecoin regulation (GENIUS Act, 2025) creating clarity for Circle/USDC at enterprise scale. **GENIUS Act — Signed July 2025.**',
      },
      {
        title: '02 — Platform Timing',
        titleColor: '#6060BF',
        body: 'WhatsApp Business API reaching enterprise maturity. AI-native conversational UX is now production-grade. TikTok and Instagram opening commerce APIs simultaneously. **3 platforms opening commerce APIs now.**',
      },
      {
        title: '03 — Market Readiness',
        titleColor: '#60D06F',
        body: '68M US Latinos — 20% of the population, growing at 2M/year. Smartphone-native cohort is now the majority sender. 85% smartphone penetration. **This population has never been more ready.**',
      },
    ],
    notes: 'Three macro forces creating a time-limited window. Regulatory: FedNow live, GENIUS Act signed July 2025 for stablecoin clarity. Platform: WhatsApp Business API enterprise-ready, TikTok/IG opening commerce APIs. Market: 68M US Latinos growing 2M/yr, 85% smartphone penetration. Closing quote: infrastructure + population + 3 years of PMF data = now.',
  },

  // ── Slide 9: Traction ──
  {
    type: 'content',
    bg: 'brand',
    badge: 'Traction',
    title: 'We\'ve proven PMF.',
    subtitle: 'Series C is about blitzscaling the machine — not proving it works.',
    bullets: [
      { text: '**3×** — YoY GMV Growth (2023 → 2024)' },
      { text: '**68%** — 90-Day Retention among cohorts with 2+ sends' },
      { text: '**72** — Net Promoter Score (Industry benchmark: ~35)' },
      { text: '**4.2 mo** — CAC Payback Period (Down from 8.1 months in Q1\'24)' },
    ],
    imageUrl: '/illustrations/Party%20Popper.svg',
    notes: 'Bold traction headline on brand (turquoise) background. Four key proof points: 3× YoY GMV, 68% 90-day retention (2+ sends), NPS 72 vs. ~35 industry, CAC payback down from 8.1 to 4.2 months. Subtitle reframes the Series C: this round funds blitzscaling a proven machine, not proving it works. Party Popper illustration.',
  },

  // ── Slide 10: Signup & Conversion ──
  {
    type: 'chart',
    bg: 'light',
    badge: 'Signup & Conversion Machine',
    title: 'Our users are our best salespeople.',
    body: 'Conversion lift of +21 pts from AI onboarding. 62% of new users come from organic/referral.',
    bullets: [
      { text: 'WhatsApp referral is the lowest CAC channel — every sender is a node' },
      { text: '90-second KYC via conversational AI — no forms, no uploads' },
      { text: 'Time to first transaction: median 4 minutes from signup' },
      { text: 'CAC on WhatsApp channel: $4.80 vs. $7.80 paid digital average' },
    ],
    chart: {
      chartType: 'combo',
      data: [
        { q: "Q1'24", users: 58, conv: 31 },
        { q: "Q2'24", users: 96, conv: 36 },
        { q: "Q3'24", users: 154, conv: 39 },
        { q: "Q4'24", users: 248, conv: 44 },
        { q: "Q1'25", users: 328, conv: 48 },
        { q: "Q2'25", users: 400, conv: 52 },
      ],
      xKey: 'q',
      yKeys: ['users'],
      lineKeys: ['conv'],
      colors: ['#2BF2F1', '#60D06F'],
      yLabel: 'Cumulative Users (K) / Conversion Rate %',
    },
    notes: 'Combo chart: cumulative users (K, bars) + conversion rate (%, line), both trending up. AI onboarding lifted conversion +21 pts. 62% organic/referral acquisition. Key operational metrics: 90-second conversational KYC, 4-minute median time to first transaction, $4.80 WhatsApp CAC vs. $7.80 paid. Every sender becomes a distribution node.',
  },

  // ── Slide 11: Volume & Revenue ──
  {
    type: 'chart',
    bg: 'light',
    badge: 'Volume & Revenue Machine',
    title: '5.8× revenue growth in 18 months.',
    body: 'Blended take rate 0.97% — rising with mix. Gross margin 61% (up from 44% Q1\'24).',
    bullets: [
      { text: '$393 average transaction value (Banco de México, 2024)' },
      { text: 'Mexico: 34% of volume. 7 additional corridors growing.' },
      { text: 'Stablecoin settlement reducing cost/txn 35% vs. Q1\'24' },
      { text: 'Revenue run rate: $34.8M annualized as of Q2\'25' },
    ],
    chart: {
      chartType: 'combo',
      data: [
        { q: "Q1'24", vol: 168, rev: 1.5 },
        { q: "Q2'24", vol: 280, rev: 2.4 },
        { q: "Q3'24", vol: 430, rev: 3.8 },
        { q: "Q4'24", vol: 580, rev: 5.2 },
        { q: "Q1'25", vol: 720, rev: 6.9 },
        { q: "Q2'25", vol: 890, rev: 8.7 },
      ],
      xKey: 'q',
      yKeys: ['vol'],
      lineKeys: ['rev'],
      colors: ['#6060BF', '#2BF2F1'],
      yLabel: 'Transaction Volume ($M) / Revenue ($M)',
    },
    notes: 'Dual-axis combo chart: quarterly transaction volume ($M, bars) + revenue ($M, line). 5.8× revenue growth in 18 months. Take rate 0.97% rising with credit/wallet mix. Gross margin expanded 44% → 61%. Stablecoin settlement cutting cost/txn by 35%. $34.8M annualized run rate. Mexico 34% of volume with 7 additional corridors.',
  },

  // ── Slide 12: Retention & Reconversion ──
  {
    type: 'chart',
    bg: 'light',
    badge: 'Retention & Reconversion Machine',
    title: 'Cohorts improving every quarter.',
    body: 'Every cohort shows higher 30/60/90-day retention than prior — a strong PMF signal.',
    bullets: [
      { text: '**68%** — 90-day retention, latest cohort' },
      { text: '**2×** — Retention rate with 2nd product adoption' },
      { text: '**3×** — LTV vs. remittance-only users once wallet is adopted' },
      { text: '**38%** — Of lapsed users reactivated within 30 days via AI reconversion nudges' },
    ],
    chart: {
      chartType: 'bar',
      data: [
        { cohort: "Q1'24", d30: 72, d60: 61, d90: 55 },
        { cohort: "Q2'24", d30: 76, d60: 65, d90: 59 },
        { cohort: "Q3'24", d30: 79, d60: 68, d90: 63 },
        { cohort: "Q4'24", d30: 82, d60: 71, d90: 66 },
        { cohort: "Q1'25", d30: 84, d60: 74, d90: 68 },
      ],
      xKey: 'cohort',
      yKeys: ['d30', 'd60', 'd90'],
      colors: ['#2BF2F1', '#60D06F', '#6060BF'],
      yLabel: 'Retention %',
    },
    notes: 'Grouped bar chart: 30/60/90-day retention by quarterly cohort, all improving. Latest cohort Q1\'25: 84% → 74% → 68%. Multi-product users retain at 2× rate. 3× LTV for wallet adopters. AI reconversion nudges reactivate 38% of lapsed users within 30 days. Every cohort better than the last = PMF signal.',
  },

  // ── Slide 13: Credit & Wallet Deep Dive ──
  {
    type: 'chart',
    bg: 'light',
    badge: 'Credit & Wallet Deep Dive',
    title: 'Nobody else can build this underwriting model. We own the data.',
    body: '**The underwriting thesis:** Remittance behavior → Sends $200/month for 18 months → AI infers creditworthiness → Loan approved without FICO.',
    bullets: [
      { text: '**92%** — AI underwriting accuracy (vs. traditional credit bureau)' },
      { text: '**20%** — Credit share of revenue (Q2\'25 — up from 0% in Q1\'24)' },
      { text: '**+15 pts** — Gross margin premium (Credit vs. remittances)' },
      { text: '**↑↑** — Higher remit rate post-credit (Credit users reconvert at higher frequency)' },
    ],
    chart: {
      chartType: 'stacked-bar',
      data: [
        { q: "Q1'24", r: 96, w: 4, c: 0 },
        { q: "Q2'24", r: 88, w: 8, c: 4 },
        { q: "Q3'24", r: 79, w: 12, c: 9 },
        { q: "Q4'24", r: 72, w: 15, c: 13 },
        { q: "Q1'25", r: 65, w: 18, c: 17 },
        { q: "Q2'25", r: 60, w: 20, c: 20 },
      ],
      xKey: 'q',
      yKeys: ['c', 'w', 'r'],
      colors: ['#F19D38', '#6060BF', '#2BF2F1'],
      yLabel: 'Revenue Mix Shift (%)',
    },
    notes: 'Stacked bar chart showing revenue mix shift from 96% remittances (Q1\'24) to 60/20/20 split (Q2\'25). Credit grew from 0% to 20% of revenue in 18 months. The underwriting thesis chain: remittance behavior data → AI creditworthiness inference → loan approval without FICO. 92% AI accuracy. +15 pt gross margin premium on credit. Credit users reconvert to remittances at higher frequency, reinforcing the flywheel.',
  },

  // ── Slide 14: Unit Economics ──
  {
    type: 'content',
    bg: 'dark',
    badge: 'Unit Economics',
    title: 'Better with every transaction.',
    body: 'Multi-product LTV/CAC is the story: Users with wallet + credit generate **18.2× LTV vs. CAC** — vs. 7.4× for remittance-only users. Series C funds the cross-sell machine.',
    bullets: [
      { text: '**CAC:** $4.80 current → $3.20 target (68% progress)' },
      { text: '**CAC Payback:** 4.2 mo current → 2.8 mo target (62% progress)' },
      { text: '**Gross Margin / Txn:** 61% current → 72% target (61% progress)' },
      { text: '**LTV (24-month):** $35.60 current → $68.00 target (52% progress)' },
      { text: '**LTV / CAC:** 7.4× current → 21× target (74% progress)' },
      { text: '**Multi-product LTV / CAC:** 18.2× current → 35× target (88% progress)' },
    ],
    notes: 'Unit economics table with six metrics showing current vs. Year 2 target and progress. Headline: 18.2× multi-product LTV/CAC (88% to 35× target). CAC $4.80 → $3.20, payback 4.2 → 2.8 months, gross margin 61% → 72%, 24-month LTV $35.60 → $68. Multi-product users 2.5× the economics of single-product. Series C thesis: fund the cross-sell machine.',
  },

  // ── Slide 15: Team ──
  {
    type: 'two-column',
    bg: 'light',
    badge: 'Team',
    title: 'Built for this market.',
    subtitle: 'Each person in the company owns a mission-critical piece of the vision. No weak links. No passengers.',
    cards: [
      { title: 'Manuel Godoy — CEO & Co-Founder', titleColor: '#2BF2F1', body: 'Serial fintech founder. Led Félix from 0 → $1B+ in transfers.' },
      { title: 'Carlos Reyes — CTO & Co-Founder', titleColor: '#6060BF', body: 'ML infra background. Architected the AI conversation engine.' },
      { title: 'Sofia Delgado — CFO', titleColor: '#F19D38', body: 'Stripe + Goldman Sachs. Stablecoin treasury and compliance.' },
      { title: 'Diego Solano — VP AI & Data', titleColor: '#60D06F', body: 'Led NLP at Nubank. Domain-specific financial AI.' },
      { title: 'Lucía Herrera — VP Engineering', titleColor: '#F26629', body: 'USDC / blockchain rails. Web3-native infrastructure.' },
      { title: 'Valentina Cruz — CPO', titleColor: '#35605F', body: '10 years building fintech for the Latino market.' },
    ],
    columns: [
      {
        heading: 'Key Investors & Advisors',
        bullets: [
          { text: '**QED Investors** — Lead, Series B. Deep fintech operator network.' },
          { text: '**Circle (USDC)** — Stablecoin infrastructure partner.' },
          { text: '**Former CFPB Advisor** — Remittance regulation and compliance specialist.' },
        ],
      },
      {
        heading: 'Key Open Roles — Series C Funded',
        bullets: [
          { text: 'VP Growth & Performance Marketing' },
          { text: 'Head of Credit Risk & Underwriting' },
          { text: 'VP Compliance & Regulatory Affairs' },
          { text: 'Director of New Corridors' },
        ],
      },
    ],
    notes: 'Six leadership profiles with color-coded cards: Manuel Godoy (CEO, serial founder, 0→$1B+), Carlos Reyes (CTO, AI engine architect), Sofia Delgado (CFO, Stripe+Goldman), Diego Solano (VP AI, Nubank NLP), Lucía Herrera (VP Eng, USDC/blockchain), Valentina Cruz (CPO, 10yr Latino fintech). Bottom: investors (QED lead, Circle partner, former CFPB advisor) and four Series C-funded open roles.',
  },

  // ── Slide 16: The Ask ──
  {
    type: 'two-column',
    bg: 'dark',
    badge: 'The Ask',
    title: 'Series C Raise',
    body: 'This capital takes Félix from proven PMF to blitzscale. From $890M quarterly GMV to $1.5B+ annualized. From 400K users to 1M+. From one product to three.',
    columns: [
      {
        heading: 'Use of Funds',
        bullets: [
          { text: '**40% Growth** — Blitzscale remittances via paid acquisition + partnerships. Activate Instagram & TikTok channels at scale. WhatsApp referral infrastructure deepening.' },
          { text: '**35% Product & Technology** — Credit/Wallet buildout with v2 underwriting model. AI conversation engine depth + new corridors. Stablecoin rail expansion + Circle infrastructure.' },
          { text: '**25% Team & Compliance** — Key hires: engineering, credit risk, compliance, growth. New state money transmission licenses. Regulatory positioning for emerging stablecoin legislation.' },
        ],
      },
      {
        heading: 'Milestones',
        bullets: [
          { text: '**Q3\'25:** IG & TikTok channels live. 600K users.' },
          { text: '**Q4\'25:** $1.5B annualized GMV. Credit v2 launched.' },
          { text: '**Q2\'26:** 3 new corridors. Wallet MAU > 200K.' },
          { text: '**Q4\'26:** Path to operational cash flow. Series D ready.' },
        ],
      },
    ],
    notes: 'Series C allocation: 40% Growth (blitzscale remittances, IG/TikTok activation, referral infra), 35% Product & Tech (credit/wallet v2, AI engine, stablecoin rails), 25% Team & Compliance (key hires, state MTLs, stablecoin legislation positioning). Four milestones: Q3\'25 IG/TikTok live + 600K users, Q4\'25 $1.5B GMV + credit v2, Q2\'26 3 new corridors + 200K wallet MAU, Q4\'26 cash flow path + Series D ready.',
  },

  // ── Slide 17: Financial Projections ──
  {
    type: 'chart',
    bg: 'light',
    badge: 'Financial Projections',
    title: 'The margin expansion story.',
    body: 'Take rate expands from 0.97% to 1.3% as credit and wallet mix grows. Stablecoin rail adoption drives gross margin from 61% → 68% by 2027.',
    bullets: [
      { text: '**13.6×** — Revenue CAGR, \'24–\'27E' },
      { text: '**68%** — Target gross margin by 2027' },
      { text: 'New corridor launches (3 in 2026) drive 40% of incremental volume' },
      { text: '**2027:** First full year of positive operating cash flow' },
    ],
    chart: {
      chartType: 'combo',
      data: [
        { year: '2024', rev: 8.7, gm: 44 },
        { year: '2025E', rev: 22, gm: 55 },
        { year: '2026E', rev: 54, gm: 63 },
        { year: '2027E', rev: 118, gm: 68 },
      ],
      xKey: 'year',
      yKeys: ['rev'],
      lineKeys: ['gm'],
      colors: ['#2BF2F1', '#DCFF00'],
      yLabel: 'Revenue ($M) / Gross Margin %',
    },
    notes: 'Combo chart: revenue ($M, bars) + gross margin (%, lime line). Revenue $8.7M (2024) → $118M (2027E) = 13.6× CAGR. Gross margin 44% → 68% via stablecoin rails and higher-margin credit/wallet mix. Take rate expansion 0.97% → 1.3%. Three 2026 corridor launches drive 40% of incremental volume. 2027 = first full year of positive operating cash flow.',
  },

  // ── Slide 18: The Vision ──
  {
    type: 'closing',
    bg: 'dark',
    badge: 'The Vision',
    title: 'The financial home for every immigrant in the world.',
    body: 'Félix started with remittances. It becomes the full financial stack — wallet, credit, savings, insurance — for the most underserved and underleveraged population in the US. And then for every immigrant community globally.\n\nThis isn\'t just fintech. It\'s financial dignity for a community that has been overcharged, underserved, and ignored for generations. Félix is the company that finally builds it right.',
    bullets: [
      { text: 'Built on WhatsApp' },
      { text: 'Powered by AI' },
      { text: 'Settled on stablecoins' },
    ],
    imageUrl: '/illustrations/F%C3%A9lix%20Illo%201.svg',
    notes: 'Vision slide expanding from US Latino remittances to global immigrant financial platform. Félix mascot illustration. Full stack: wallet, credit, savings, insurance. Three technology pillars: WhatsApp, AI, stablecoins. Emotional core: financial dignity for a community overcharged, underserved, and ignored for generations.',
  },

  // ── Slide 19: Job Not Finished ──
  {
    type: 'closing',
    bg: 'dark',
    title: 'The job isn\'t finished.',
    subtitle: 'Not until every one of María\'s 60 million neighbors has a financial home.',
    body: 'This closing slide callbacks to María from Slide 2. The emotional arc completes: from one woman sending $200 home to a platform serving 60 million people who deserve a financial home. The job isn\'t finished — and it won\'t be until every immigrant has access to fair, affordable, dignified financial services.',
    notes: 'Emotional closing that callbacks to María from Slide 2. Title: "The job isn\'t finished." Subtitle ties to the 60M stat from the cover. Originally features auto-playing YouTube embed (Kobe Bryant "Job not finished" clip). Dark cinematic background (#061A18). Completes the narrative arc: one woman\'s monthly struggle → a platform that could serve 60 million.',
  },

  // ── Slide 20: Appendix ──
  {
    type: 'cards',
    bg: 'light',
    badge: 'Appendix',
    title: 'Supporting Materials',
    subtitle: 'Full data room available upon request under executed NDA.',
    cards: [
      {
        title: 'A — Detailed Cohort Analysis',
        titleColor: '#35605F',
        body: 'Full 30/60/90/180/365-day retention curves by acquisition channel. Cohort LTV progression by product adoption stage. WhatsApp referral network density analysis.',
      },
      {
        title: 'B — Credit Underwriting Methodology',
        titleColor: '#35605F',
        body: 'Remittance-behavior signal architecture and feature weighting. Model accuracy, approval rate, and default rate by cohort. Comparison vs. FICO-based and alternative credit models.',
      },
      {
        title: 'C — Financial Model & Projections',
        titleColor: '#35605F',
        body: 'Full 3-year P&L, balance sheet, and cash flow model. Sensitivity analysis: take rate, CAC, corridor growth assumptions. Bear / base / bull scenario outputs.',
      },
      {
        title: 'D — Regulatory & Compliance',
        titleColor: '#35605F',
        body: 'State money transmission license status (all 50 states). FinCEN, BSA/AML compliance framework. Stablecoin regulatory positioning (GENIUS Act alignment).',
      },
      {
        title: 'E — Technology Architecture',
        titleColor: '#35605F',
        body: 'AI conversation engine stack and training data overview. Circle/USDC integration and settlement architecture. Security, encryption, and fraud prevention systems.',
      },
      {
        title: 'F — Cap Table & Governance',
        titleColor: '#35605F',
        body: 'Current cap table summary. Board composition and observer rights. Option pool and dilution schedule.',
      },
    ],
    notes: 'Appendix listing six data room sections under NDA. A: cohort analysis with full retention curves. B: credit underwriting methodology and model accuracy. C: 3-year financial model with sensitivity analysis. D: regulatory status across 50 states. E: technology architecture overview. F: cap table and governance.',
  },
]

const document = {
  title: 'Félix Pago — Series C Investor Deck',
  type: 'pitch-deck',
  summary: 'Series C pitch deck for Félix Pago: the WhatsApp-native financial home for 60 million Latino immigrants. Covers the broken remittance market ($14 fees, 3-day settlement), the WhatsApp platform solution (90%+ penetration, zero friction), $161B TAM, the data flywheel moat, proven traction (3× YoY GMV, 68% retention, NPS 72), unit economics (18.2× multi-product LTV/CAC), team, $118M revenue by 2027, and the Series C ask.',
  sections: [
    { title: 'Cover', content: 'Félix Pago — The financial home for 60M Latino immigrants, built inside WhatsApp. Three-part thesis: broken status quo, WhatsApp platform, data flywheel moat.', slideIndex: 0 },
    { title: 'The Human Problem', content: 'María sends $200 home every month. Pays $14 in fees (7% average). Waits 3 days. 15% of income remitted. 10% of Latino households unbanked (3× national average). The #1 financial priority for 60M immigrants is still broken.', slideIndex: 1 },
    { title: 'Market Opportunity', content: '$161B TAM in LatAm remittances. $60B+ US→LatAm digital SAM. $2B+ SOM with Series C. Remittances are the trust gateway to a $300B underserved financial services market. Expansion wedge: Mexico ($64B) first, then Guatemala, El Salvador, Honduras, Colombia.', slideIndex: 2 },
    { title: 'Distribution Moat', content: 'Built inside WhatsApp — 90%+ penetration in Latino immigrant households. 52% signup conversion. 3× higher DAU vs. standalone fintech. Zero app downloads. Built-in network effect: every sender invites a family member.', slideIndex: 3 },
    { title: 'The Solution', content: 'Three-layer product stack: Remittances + Wallet + Credit. All via WhatsApp conversation. $2.10 fee, arrives in minutes. 400K+ users, $1B+ transferred, $75M Series B, 8 corridors.', slideIndex: 4 },
    { title: 'The Compounding Moat', content: 'Flywheel: Remittances → Behavioral Data → Credit Underwriting → Credit & Wallet → Reconversion → Better Economics. 3+ years proprietary data, 2× retention with 2nd product, 3× LTV with wallet, 35% cost decline YTD.', slideIndex: 5 },
    { title: 'Competitive Landscape', content: 'Félix alone in top-right of WhatsApp-native × Full Financial Platform matrix. Remitly/Wise: app-based, transactional. Western Union: legacy, 5-8% fees. Neobanks: no cross-border. Three moats no competitor can buy: distribution, data, culture.', slideIndex: 6 },
    { title: 'Why Now', content: 'Three converging forces: Regulatory (FedNow live, GENIUS Act July 2025), Platform (WhatsApp Business API enterprise, TikTok/IG commerce APIs), Market (68M US Latinos, 85% smartphone penetration). Window is open with 3 years of PMF data.', slideIndex: 7 },
    { title: 'Traction', content: 'Proven PMF: 3× YoY GMV growth, 68% 90-day retention, NPS 72 (vs. ~35 industry), 4.2-month CAC payback (down from 8.1). Series C funds blitzscaling the machine.', slideIndex: 8 },
    { title: 'Signup & Conversion', content: '+21 pt conversion lift from AI onboarding. 62% organic/referral. 90-second KYC. 4-minute median to first transaction. $4.80 WhatsApp CAC vs. $7.80 paid digital.', slideIndex: 9 },
    { title: 'Volume & Revenue', content: '5.8× revenue growth in 18 months. Take rate 0.97% rising. Gross margin 61% (up from 44%). $393 avg transaction. $34.8M annualized run rate. Stablecoin settlement cutting cost/txn 35%.', slideIndex: 10 },
    { title: 'Retention & Reconversion', content: 'Every cohort improving: Q1\'25 hits 84%/74%/68% at 30/60/90 days. 2× retention with 2nd product. 3× LTV with wallet. 38% lapsed user reactivation via AI nudges.', slideIndex: 11 },
    { title: 'Credit & Wallet', content: 'Proprietary underwriting: remittance behavior → AI creditworthiness → no FICO needed. 92% accuracy. Credit grew 0% → 20% of revenue. +15 pt gross margin premium. Revenue mix shifting to 60/20/20 split.', slideIndex: 12 },
    { title: 'Unit Economics', content: 'Multi-product LTV/CAC: 18.2× (88% to 35× target). CAC $4.80→$3.20, payback 4.2→2.8 mo, gross margin 61%→72%, 24-mo LTV $35.60→$68. Cross-sell is the Series C thesis.', slideIndex: 13 },
    { title: 'Team', content: 'Six leaders: Manuel Godoy (CEO, serial founder), Carlos Reyes (CTO, AI architect), Sofia Delgado (CFO, Stripe+Goldman), Diego Solano (VP AI, Nubank NLP), Lucía Herrera (VP Eng, USDC), Valentina Cruz (CPO, 10yr Latino fintech). Investors: QED, Circle. Four Series C-funded open roles.', slideIndex: 14 },
    { title: 'The Ask', content: 'Series C: 40% Growth (blitzscale + IG/TikTok), 35% Product (credit v2 + stablecoin rails), 25% Team (key hires + MTLs). Milestones: 600K users Q3\'25, $1.5B GMV Q4\'25, 3 corridors Q2\'26, cash flow path Q4\'26.', slideIndex: 15 },
    { title: 'Financial Projections', content: 'Revenue $8.7M (2024) → $118M (2027E) = 13.6× CAGR. Gross margin 44% → 68%. Take rate 0.97% → 1.3%. 3 corridor launches 2026 = 40% incremental volume. 2027: first full year positive operating cash flow.', slideIndex: 16 },
    { title: 'The Vision', content: 'From remittances to full financial stack (wallet, credit, savings, insurance) for every immigrant globally. Financial dignity for a community overcharged, underserved, and ignored. Built on WhatsApp, powered by AI, settled on stablecoins.', slideIndex: 17 },
    { title: 'Closing', content: 'The job isn\'t finished. Not until every one of María\'s 60 million neighbors has a financial home. Callback to Slide 2. Emotional arc completion.', slideIndex: 18 },
    { title: 'Appendix', content: 'Six data room sections: A) Cohort Analysis, B) Credit Underwriting Methodology, C) Financial Model, D) Regulatory & Compliance, E) Technology Architecture, F) Cap Table & Governance. Available under NDA.', slideIndex: 19 },
  ],
}

async function main() {
  // 1. Update existing deck
  const raw = await redis.get<any>(presKey(EXISTING_PRES_ID))
  if (!raw) {
    console.error('Existing presentation not found')
    process.exit(1)
  }
  const stored = typeof raw === 'string' ? JSON.parse(raw) : raw
  stored.slides = JSON.stringify(slides)
  stored.document = JSON.stringify(document)
  stored.updatedAt = Math.floor(Date.now() / 1000)
  await redis.set(presKey(EXISTING_PRES_ID), JSON.stringify(stored))
  console.log(`✅ Updated existing deck (${EXISTING_PRES_ID}) — ${slides.length} slides`)

  // 2. Create new comparison import
  const user = await getUserByEmail('kyle.cooney@felixpago.com')
  if (!user) {
    console.error('User kyle.cooney@felixpago.com not found')
    process.exit(1)
  }

  const newPres = await createPresentation(
    user.id,
    'Félix Investor Deck — V2 Import',
    'Exact reimport of /felix-investor with maximum content fidelity, using updated presentation rules.',
    slides,
    'anthropic',
    'claude-sonnet-4-20250514',
    document,
  )
  console.log(`✅ Created new comparison deck: ${newPres.id}`)
  console.log(`   View at: /create/${newPres.id}`)
}

main().catch(console.error)
