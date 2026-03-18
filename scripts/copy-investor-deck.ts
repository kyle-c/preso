/**
 * One-time script: copy the /felix-investor pitch deck into kyle.cooney@felixpago.com's studio account.
 *
 * Run: npx tsx scripts/copy-investor-deck.ts
 */

import { getUserByEmail, createPresentation } from '../lib/studio-db'

const slides = [
  // 1: Cover
  {
    type: 'two-column' as const,
    bg: 'dark' as const,
    badge: 'Series C — Confidential',
    title: 'Félix Pago',
    body: 'The financial home for 60 million Latino immigrants — **built inside WhatsApp.**',
    columns: [
      {
        heading: '',
        body: '',
      },
      {
        heading: '',
        bullets: [
          { text: '**01 — The Problem:** Sending $200 home costs $14 in fees, takes 3 days, and requires a trip to Western Union. For 60M Latino immigrants, this is the #1 financial priority — and it\'s still broken.', icon: '💸' },
          { text: '**02 — The Platform:** We built Félix inside WhatsApp — the app 90%+ of Latino immigrant households already use every day. No app download. No new behavior. No friction.', icon: '💬' },
          { text: '**03 — The Moat:** Every remittance generates behavioral data. That data trains our credit model. That credit deepens the relationship. The flywheel compounds with every transaction.', icon: '🔁' },
        ],
      },
    ],
    imageUrl: '/illustrations/F%C3%A9lix%20Illo%201.svg',
    notes: 'Cover slide. Dark background with Félix mascot. Two-column: left has title + subtitle, right has 3 numbered thesis cards.',
  },

  // 2: The Hook — The Human Problem
  {
    type: 'two-column' as const,
    bg: 'light' as const,
    badge: 'The Human Problem',
    title: 'Every month, María sends money home.',
    body: 'She works as a home health aide in Houston. Every 15th of the month, she walks to a Western Union, fills out a form, and watches **$14 vanish** from every $200 she sends to her mother in Guadalajara. Her mom waits three days. María has done this for 6 years. She has never missed a month.',
    columns: [
      {
        heading: '',
        body: 'The #1 financial priority for Latino immigrants — still broken, still expensive, still built for someone else.',
      },
      {
        heading: '',
        bullets: [
          { text: '**7%** — Average fee to send $200 home (World Bank, 2024)', icon: '📊' },
          { text: '**15%** — Of monthly income remitted on average among active senders', icon: '📊' },
          { text: '**10%** — Of Latino households are unbanked (3× national average)', icon: '📊' },
          { text: '**3 days** — Average SWIFT settlement time (weekends not included)', icon: '📊' },
        ],
      },
    ],
    imageUrl: '/illustrations/Hands%20-%202%20Cell%20Phones%20-%20Juntos%20we%20Succeed.svg',
    notes: 'Hook slide. María persona story on left, key market pain-point stats on right.',
  },

  // 3: The Market — The Trojan Horse
  {
    type: 'two-column' as const,
    bg: 'brand' as const,
    badge: 'Market Opportunity',
    title: 'Remittances are the Trojan Horse.',
    body: 'The $60B+ US-to-LatAm remittance corridor is not the end market — it\'s the trust gateway to a **$300B underserved financial services market**. Every sender is a customer who needs a wallet, credit, savings, and insurance.',
    columns: [
      {
        heading: '',
        bullets: [
          { text: '**TAM: $161B** — Total LatAm remittances/yr', icon: '🎯' },
          { text: '**SAM: $60B+** — US → LatAm digital', icon: '🎯' },
          { text: '**SOM: $2B+** — 5-yr with Series C', icon: '🎯' },
        ],
      },
      {
        heading: '',
        body: '**Expansion wedge:** Today Mexico ($64B). Tomorrow Guatemala, El Salvador, Honduras, Colombia — corridors with identical dynamics and zero dominant digital player.',
      },
    ],
    chart: {
      chartType: 'combo' as const,
      data: [
        { year: "'22", total: 148, digital: 14 },
        { year: "'23", total: 155, digital: 18 },
        { year: "'24", total: 161, digital: 24 },
        { year: "'25", total: 167, digital: 30 },
        { year: "'27", total: 179, digital: 44 },
        { year: "'30", total: 195, digital: 60 },
      ],
      xKey: 'year',
      yKeys: ['total', 'digital'],
      lineKeys: ['digital'],
      colors: ['#6060BF', '#2BF2F1'],
      yLabel: '$B',
      xLabel: 'US → LatAm Remittance Market',
    },
    notes: 'Market opportunity. Brand bg. TAM/SAM/SOM on left, combo chart (bar + line) showing total vs digital market on right.',
  },

  // 4: Why WhatsApp — Distribution Moat
  {
    type: 'two-column' as const,
    bg: 'dark' as const,
    badge: 'The Distribution Moat',
    title: 'No app to download. They\'re already home.',
    body: 'We built inside the app 90%+ of Latino immigrant households already use every day. Zero new behavior. Zero app store friction. Send money the same way you text your family.',
    columns: [
      {
        heading: 'The network effect built in',
        body: 'Every sender invites a family member → Every recipient becomes a user → Every user is a distribution node',
      },
      {
        heading: '',
        bullets: [
          { text: '**90%+** — WhatsApp penetration in Latino immigrant households (Pew 2024)', icon: '📱' },
          { text: '**3×** — Higher DAU on WhatsApp vs. standalone fintech apps', icon: '📈' },
          { text: '**52%** — WhatsApp-native signup conversion rate (vs. 31% baseline)', icon: '✓' },
          { text: '**0** — App downloads required to send money', icon: '⚡' },
        ],
      },
    ],
    imageUrl: '/illustrations/Speech%20Bubbles%20%2B%20Hearts.svg',
    notes: 'WhatsApp distribution moat. Dark background. Network effect explanation on left, key stats on right.',
  },

  // 5: The Solution — Three-Layer Stack
  {
    type: 'two-column' as const,
    bg: 'light' as const,
    badge: 'The Solution',
    title: 'Send, save, borrow. From WhatsApp.',
    body: 'No app download. No new account. No friction. Just text Félix — and your money moves.',
    columns: [
      {
        heading: '',
        bullets: [
          { text: '**400K+ Users Served**', icon: '✓' },
          { text: '**$1B+ Transferred**', icon: '✓' },
          { text: '**$75M Series B**', icon: '✓' },
          { text: '**8 Corridors**', icon: '✓' },
        ],
      },
      {
        heading: 'Three-layer product stack',
        bullets: [
          { text: '💸 **Remittances** — Send money home via WhatsApp conversation', icon: '💸' },
          { text: '🏦 **Wallet** — Digital wallet for everyday transactions', icon: '🏦' },
          { text: '💳 **Credit** — AI-underwritten lending without FICO', icon: '💳' },
        ],
      },
    ],
    notes: 'Solution overview with WhatsApp conversation mockup concept. Light bg. Key milestones on left, three product layers on right.',
  },

  // 6: The Flywheel — Compounding Moat
  {
    type: 'two-column' as const,
    bg: 'brand' as const,
    badge: 'The Compounding Moat',
    title: 'Every product makes every other product stronger.',
    body: 'This is not a feature set — it\'s a compounding engine. Remittance data is a credit underwriting signal that **no bank, BNPL player, or remittance app has access to**.',
    columns: [
      {
        heading: '',
        bullets: [
          { text: '**3+ yrs** — Proprietary training data', icon: '📊' },
          { text: '**2×** — Retention with 2nd product vs. 1st', icon: '🔁' },
          { text: '**3×** — LTV when wallet adopted', icon: '📈' },
          { text: '**↓35%** — Cost/txn decline YTD', icon: '⬇' },
        ],
      },
      {
        heading: 'The Félix Flywheel',
        bullets: [
          { text: '💬 **Remittances** — Builds trust + generates behavioral data', icon: '💬' },
          { text: '📊 **Behavioral Data** — 3+ years of immigrant financial patterns', icon: '📊' },
          { text: '🤖 **Credit Underwriting** — Model trained on remittance data, not FICO', icon: '🤖' },
          { text: '💳 **Credit & Wallet** — Deepens relationship, increases LTV', icon: '💳' },
          { text: '🔁 **Reconversion** — Returns to remittances at higher frequency', icon: '🔁' },
          { text: '⚡ **Better Unit Economics** — More data → smarter AI → lower CAC', icon: '⚡' },
        ],
      },
    ],
    notes: 'Flywheel slide. Brand bg. Stats on left, 6-step flywheel cycle on right.',
  },

  // 7: Competitive Landscape — 2×2 Matrix
  {
    type: 'two-column' as const,
    bg: 'dark' as const,
    badge: 'Competitive Landscape',
    title: 'We are alone in the top-right.',
    body: 'Distribution (WhatsApp), data (remittance behavior), and culture (Latino-first) are three advantages no competitor can buy.',
    columns: [
      {
        heading: '',
        bullets: [
          { text: '**Remitly / Wise** — App-native, purely transactional. No credit. No wallet. No cultural fit.', icon: '✗' },
          { text: '**Western Union** — Legacy infrastructure, agent-based model, 5–8% fees. Zero UX.', icon: '✗' },
          { text: '**Neobanks (Chime etc.)** — No remittances, no cross-border, no Latino-immigrant focus.', icon: '✗' },
        ],
      },
      {
        heading: '2×2 Matrix',
        body: 'WhatsApp-native vs. App-based × Full Financial Platform vs. Transactional — Félix Pago is the only player combining WhatsApp distribution with a full financial platform.',
      },
    ],
    notes: 'Competitive landscape. Dark bg. Competitor breakdown on left, 2×2 positioning matrix description on right. Félix is alone in top-right (WhatsApp + Full Platform).',
  },

  // 8: Why Now — Three Forces
  {
    type: 'cards' as const,
    bg: 'dark' as const,
    badge: 'Why Now',
    title: 'Three forces converging.',
    cards: [
      {
        title: '01 — Regulatory Tailwinds',
        titleColor: '#2BF2F1',
        body: 'Open banking maturing. Real-time payment infrastructure (FedNow) live. Stablecoin regulation (GENIUS Act, 2025) creating clarity for Circle/USDC at enterprise scale.\n\nGENIUS Act — Signed July 2025',
      },
      {
        title: '02 — Platform Timing',
        titleColor: '#6060BF',
        body: 'WhatsApp Business API reaching enterprise maturity. AI-native conversational UX is now production-grade. TikTok and Instagram opening commerce APIs simultaneously.\n\n3 Platforms — Opening commerce APIs now',
      },
      {
        title: '03 — Market Readiness',
        titleColor: '#60D06F',
        body: '68M US Latinos — 20% of the population, growing at 2M/year. Smartphone-native cohort is now the majority sender. 85% smartphone penetration. This population has never been more ready.\n\n68M — US Latinos growing 2M/yr',
      },
    ],
    notes: 'Why Now slide. Dark bg. Three cards for regulatory, platform, and market forces. Each with a key stat.',
  },

  // 9: Traction — PMF Proven
  {
    type: 'cards' as const,
    bg: 'brand' as const,
    badge: 'Traction',
    title: 'We\'ve proven PMF.',
    subtitle: 'Series C is about blitzscaling the machine — not proving it works.',
    cards: [
      { title: '3×', titleColor: '#082422', body: 'YoY GMV Growth\n2023 → 2024' },
      { title: '68%', titleColor: '#082422', body: '90-Day Retention\nAmong cohorts with 2+ sends' },
      { title: '72', titleColor: '#082422', body: 'Net Promoter Score\nIndustry benchmark: ~35' },
      { title: '4.2 mo', titleColor: '#082422', body: 'CAC Payback Period\nDown from 8.1 months in Q1\'24' },
    ],
    notes: 'Traction headline. Brand bg. Four metric cards showing PMF proof.',
  },

  // 10: Signup & Conversion — Acquisition Machine
  {
    type: 'two-column' as const,
    bg: 'light' as const,
    badge: 'Signup & Conversion Machine',
    title: 'Our users are our best salespeople.',
    columns: [
      {
        heading: '',
        bullets: [
          { text: '**+21 pts** — Conv. lift from AI onboarding', icon: '📈' },
          { text: '**62%** — New users from organic/referral', icon: '📈' },
          { text: 'WhatsApp referral is the lowest CAC channel — every sender is a node', icon: '✓' },
          { text: '90-second KYC via conversational AI — no forms, no uploads', icon: '✓' },
          { text: 'Time to first transaction: median 4 minutes from signup', icon: '✓' },
          { text: 'CAC on WhatsApp channel: $4.80 vs. $7.80 paid digital average', icon: '✓' },
        ],
      },
      { heading: '', body: '' },
    ],
    chart: {
      chartType: 'combo' as const,
      data: [
        { q: "Q1'24", users: 58, conv: 31 }, { q: "Q2'24", users: 96, conv: 36 },
        { q: "Q3'24", users: 154, conv: 39 }, { q: "Q4'24", users: 248, conv: 44 },
        { q: "Q1'25", users: 328, conv: 48 }, { q: "Q2'25", users: 400, conv: 52 },
      ],
      xKey: 'q',
      yKeys: ['users', 'conv'],
      lineKeys: ['conv'],
      colors: ['#2BF2F1', '#60D06F'],
      yLabel: 'Users (K) / Conv %',
      xLabel: 'User Growth & Conversion Rate',
    },
    notes: 'Signup & conversion slide. Light bg. Key acquisition metrics on left, combo chart (bar = cumulative users, line = conversion rate) on right.',
  },

  // 11: Volume & Revenue — Revenue Machine
  {
    type: 'two-column' as const,
    bg: 'light' as const,
    badge: 'Volume & Revenue Machine',
    title: '5.8× revenue growth in 18 months.',
    columns: [
      {
        heading: '',
        bullets: [
          { text: '**0.97%** — Blended take rate — rising with mix', icon: '📊' },
          { text: '**61%** — Gross margin (up from 44% Q1\'24)', icon: '📊' },
          { text: '$393 average transaction value (Banco de México, 2024)', icon: '✓' },
          { text: 'Mexico: 34% of volume. 7 additional corridors growing.', icon: '✓' },
          { text: 'Stablecoin settlement reducing cost/txn 35% vs. Q1\'24', icon: '✓' },
          { text: 'Revenue run rate: $34.8M annualized as of Q2\'25', icon: '✓' },
        ],
      },
      { heading: '', body: '' },
    ],
    chart: {
      chartType: 'combo' as const,
      data: [
        { q: "Q1'24", vol: 168, rev: 1.5 }, { q: "Q2'24", vol: 280, rev: 2.4 },
        { q: "Q3'24", vol: 430, rev: 3.8 }, { q: "Q4'24", vol: 580, rev: 5.2 },
        { q: "Q1'25", vol: 720, rev: 6.9 }, { q: "Q2'25", vol: 890, rev: 8.7 },
      ],
      xKey: 'q',
      yKeys: ['vol', 'rev'],
      lineKeys: ['rev'],
      colors: ['#6060BF', '#2BF2F1'],
      yLabel: '$M',
      xLabel: 'Transaction Volume vs. Revenue',
    },
    notes: 'Volume & revenue slide. Light bg. Key unit metrics on left, combo chart on right.',
  },

  // 12: Retention — Cohort Analysis
  {
    type: 'two-column' as const,
    bg: 'light' as const,
    badge: 'Retention & Reconversion Machine',
    title: 'Cohorts improving every quarter.',
    columns: [
      {
        heading: '',
        bullets: [
          { text: '**68%** — 90-day retention, latest cohort', icon: '📊' },
          { text: '**2×** — Retention rate with 2nd product', icon: '📊' },
          { text: 'Every cohort shows higher 30/60/90-day retention than prior — PMF signal', icon: '✓' },
          { text: 'Multi-product users (wallet + remittance) retain at 2× the rate', icon: '✓' },
          { text: '3× LTV vs. remittance-only users once wallet is adopted', icon: '✓' },
          { text: 'AI reconversion nudges reactivate 38% of lapsed users within 30 days', icon: '✓' },
        ],
      },
      { heading: '', body: '' },
    ],
    chart: {
      chartType: 'stacked-bar' as const,
      data: [
        { cohort: "Q1'24", '30-day': 72, '60-day': 61, '90-day': 55 },
        { cohort: "Q2'24", '30-day': 76, '60-day': 65, '90-day': 59 },
        { cohort: "Q3'24", '30-day': 79, '60-day': 68, '90-day': 63 },
        { cohort: "Q4'24", '30-day': 82, '60-day': 71, '90-day': 66 },
        { cohort: "Q1'25", '30-day': 84, '60-day': 74, '90-day': 68 },
      ],
      xKey: 'cohort',
      yKeys: ['30-day', '60-day', '90-day'],
      colors: ['#2BF2F1', '#60D06F', '#6060BF'],
      yLabel: 'Retention %',
      xLabel: 'Retention Cohort Analysis',
    },
    notes: 'Retention slide. Light bg. Cohort metrics on left, grouped bar chart on right.',
  },

  // 13: Credit & Wallet — The Data Moat
  {
    type: 'two-column' as const,
    bg: 'light' as const,
    badge: 'Credit & Wallet Deep Dive',
    title: 'Nobody else can build this underwriting model. We own the data.',
    columns: [
      {
        heading: 'The underwriting thesis',
        body: 'Remittance behavior → Sends $200/month for 18 months → AI infers creditworthiness → Loan approved without FICO',
        bullets: [
          { text: '**92%** — AI underwriting accuracy vs. traditional credit bureau', icon: '🤖' },
          { text: '**20%** — Credit share of revenue (Q2\'25, up from 0% Q1\'24)', icon: '📈' },
          { text: '**+15 pts** — Gross margin premium (credit vs. remittances)', icon: '💰' },
          { text: '**↑↑** — Higher remit rate post-credit (credit users reconvert at higher freq)', icon: '🔁' },
        ],
      },
      { heading: '', body: '' },
    ],
    chart: {
      chartType: 'stacked-bar' as const,
      data: [
        { q: "Q1'24", Remittances: 96, Wallet: 4, Credit: 0 },
        { q: "Q2'24", Remittances: 88, Wallet: 8, Credit: 4 },
        { q: "Q3'24", Remittances: 79, Wallet: 12, Credit: 9 },
        { q: "Q4'24", Remittances: 72, Wallet: 15, Credit: 13 },
        { q: "Q1'25", Remittances: 65, Wallet: 18, Credit: 17 },
        { q: "Q2'25", Remittances: 60, Wallet: 20, Credit: 20 },
      ],
      xKey: 'q',
      yKeys: ['Credit', 'Wallet', 'Remittances'],
      colors: ['#F19D38', '#6060BF', '#2BF2F1'],
      yLabel: '% of Revenue',
      xLabel: 'Revenue Mix Shift',
    },
    notes: 'Credit & wallet slide. Light bg. Underwriting thesis + stats on left, stacked bar chart showing revenue mix shift on right.',
  },

  // 14: Unit Economics — Better Every Transaction
  {
    type: 'content' as const,
    bg: 'dark' as const,
    badge: 'Unit Economics',
    title: 'Better with every transaction.',
    body: '**Key Metrics:**\n\n• **CAC:** $4.80 → $3.20 target (68% progress)\n• **CAC Payback:** 4.2 mo → 2.8 mo target\n• **Gross Margin / Txn:** 61% → 72% target\n• **LTV (24-month):** $35.60 → $68.00 target\n• **LTV / CAC:** 7.4× → 21× target (74% progress)\n• **Multi-product LTV / CAC:** 18.2× → 35× target (88% progress)\n\n**Multi-product LTV/CAC is the story:** Users with wallet + credit generate 18.2× LTV vs. CAC — vs. 7.4× for remittance-only users. Series C funds the cross-sell machine.',
    notes: 'Unit economics table. Dark bg. Six-row metrics table with current vs. target and progress bars. Highlight on LTV/CAC ratios.',
  },

  // 15: Team — Built for This Market
  {
    type: 'cards' as const,
    bg: 'light' as const,
    badge: 'Team',
    title: 'Built for this market.',
    cards: [
      { title: 'Manuel Godoy', titleColor: '#2BF2F1', body: 'CEO & Co-Founder\nSerial fintech founder. Led Félix 0 → $1B+ in transfers.' },
      { title: 'Carlos Reyes', titleColor: '#6060BF', body: 'CTO & Co-Founder\nML infra background. Architected the AI conversation engine.' },
      { title: 'Sofia Delgado', titleColor: '#F19D38', body: 'CFO\nStripe + Goldman. Stablecoin treasury and compliance.' },
      { title: 'Diego Solano', titleColor: '#60D06F', body: 'VP AI & Data\nLed NLP at Nubank. Domain-specific financial AI.' },
      { title: 'Lucía Herrera', titleColor: '#F26629', body: 'VP Engineering\nUSDC / blockchain rails. Web3-native infrastructure.' },
      { title: 'Valentina Cruz', titleColor: '#35605F', body: 'CPO\n10 yrs building fintech for the Latino market.' },
    ],
    notes: 'Team slide. Light bg. Six team member cards with roles and background. Plus investors/advisors and open roles.',
  },

  // 16: The Ask — Series C Raise
  {
    type: 'two-column' as const,
    bg: 'dark' as const,
    badge: 'The Ask',
    title: 'Series C Raise',
    body: 'This capital takes Félix from proven PMF to blitzscale. From $890M quarterly GMV to $1.5B+ annualized. From 400K users to 1M+. From one product to three.',
    columns: [
      {
        heading: 'Use of Funds',
        bullets: [
          { text: '**40% Growth** — Blitzscale remittances, activate Instagram & TikTok, WhatsApp referral deepening', icon: '🚀' },
          { text: '**35% Product & Technology** — Credit/Wallet v2, AI conversation engine, stablecoin rail expansion', icon: '⚙' },
          { text: '**25% Team & Compliance** — Key hires, new state licenses, regulatory positioning', icon: '👥' },
        ],
      },
      {
        heading: 'Key Milestones',
        bullets: [
          { text: '**Q3\'25** — IG & TikTok channels live. 600K users.', icon: '📅' },
          { text: '**Q4\'25** — $1.5B annualized GMV. Credit v2 launched.', icon: '📅' },
          { text: '**Q2\'26** — 3 new corridors. Wallet MAU > 200K.', icon: '📅' },
          { text: '**Q4\'26** — Path to operational cash flow. Series D ready.', icon: '📅' },
        ],
      },
    ],
    notes: 'The Ask slide. Dark bg. Use of funds breakdown (40/35/25) on left, milestones timeline on right.',
  },

  // 17: Financial Projections — 3-Year Model
  {
    type: 'two-column' as const,
    bg: 'light' as const,
    badge: 'Financial Projections',
    title: 'The margin expansion story.',
    columns: [
      {
        heading: '',
        bullets: [
          { text: '**13.6×** — Revenue CAGR, \'24–\'27E', icon: '📈' },
          { text: '**68%** — Target gross margin by 2027', icon: '📈' },
          { text: 'Take rate expands from 0.97% to 1.3% as credit and wallet mix grows', icon: '✓' },
          { text: 'Stablecoin rail adoption drives gross margin from 61% → 68% by 2027', icon: '✓' },
          { text: 'New corridor launches (3 in 2026) drive 40% of incremental volume', icon: '✓' },
          { text: '2027: First full year of positive operating cash flow', icon: '✓' },
        ],
      },
      { heading: '', body: '' },
    ],
    chart: {
      chartType: 'combo' as const,
      data: [
        { year: '2024', rev: 8.7, gm: 44 },
        { year: '2025E', rev: 22, gm: 55 },
        { year: '2026E', rev: 54, gm: 63 },
        { year: '2027E', rev: 118, gm: 68 },
      ],
      xKey: 'year',
      yKeys: ['rev', 'gm'],
      lineKeys: ['gm'],
      colors: ['#2BF2F1', '#DCFF00'],
      yLabel: '$M / %',
      xLabel: 'Revenue & Gross Margin',
    },
    notes: 'Financial projections. Light bg. Key assumptions on left, combo chart (bar = revenue, line = gross margin %) on right.',
  },

  // 18: The Vision — Financial Dignity
  {
    type: 'closing' as const,
    bg: 'dark' as const,
    title: 'The financial home for every immigrant in the world.',
    body: 'Félix started with remittances. It becomes the full financial stack — wallet, credit, savings, insurance — for the most underserved and underleveraged population in the US. And then for every immigrant community globally.\n\nThis isn\'t just fintech. It\'s financial dignity for a community that has been overcharged, underserved, and ignored for generations. Félix is the company that finally builds it right.',
    subtitle: '💬 Built on WhatsApp · 🤖 Powered by AI · ⚡ Settled on stablecoins',
    imageUrl: '/illustrations/F%C3%A9lix%20Illo%201.svg',
    notes: 'Vision slide. Dark bg. Centered layout with Félix mascot. Aspirational closing statement with three platform pillars.',
  },

  // 19: Job Not Finished — The Mission
  {
    type: 'closing' as const,
    bg: 'dark' as const,
    title: 'The job isn\'t finished.',
    body: 'Not until every one of María\'s 60 million neighbors has a financial home.',
    videoUrl: 'https://www.youtube.com/embed/fY7l2pcxdHM',
    notes: 'Emotional closing. Very dark bg. YouTube video embed of "Job Not Finished" speech, with title and mission statement below.',
  },

  // 20: Appendix — Supporting Materials
  {
    type: 'cards' as const,
    bg: 'light' as const,
    badge: 'Appendix',
    title: 'Supporting Materials',
    subtitle: 'Full data room available upon request under executed NDA.',
    cards: [
      { title: 'A — Detailed Cohort Analysis', titleColor: '#082422', body: '• Full 30/60/90/180/365-day retention curves by acquisition channel\n• Cohort LTV progression by product adoption stage\n• WhatsApp referral network density analysis' },
      { title: 'B — Credit Underwriting', titleColor: '#082422', body: '• Remittance-behavior signal architecture and feature weighting\n• Model accuracy, approval rate, and default rate by cohort\n• Comparison vs. FICO-based and alternative credit models' },
      { title: 'C — Financial Model', titleColor: '#082422', body: '• Full 3-year P&L, balance sheet, and cash flow model\n• Sensitivity analysis: take rate, CAC, corridor growth\n• Bear / base / bull scenario outputs' },
      { title: 'D — Regulatory & Compliance', titleColor: '#082422', body: '• State money transmission license status (all 50 states)\n• FinCEN, BSA/AML compliance framework\n• Stablecoin regulatory positioning (GENIUS Act alignment)' },
      { title: 'E — Technology Architecture', titleColor: '#082422', body: '• AI conversation engine stack and training data overview\n• Circle/USDC integration and settlement architecture\n• Security, encryption, and fraud prevention systems' },
      { title: 'F — Cap Table & Governance', titleColor: '#082422', body: '• Current cap table summary\n• Board composition and observer rights\n• Option pool and dilution schedule' },
    ],
    notes: 'Appendix index. Light bg. Six cards (A-F) for data room sections. NDA note at bottom.',
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
    'Félix Pago — Series C',
    'Series C investor pitch deck for Félix Pago: the financial home for 60 million Latino immigrants, built inside WhatsApp.',
    slides,
    'anthropic',
    'claude-sonnet-4-20250514',
    {
      title: 'Félix Pago — Series C Investor Deck',
      type: 'pitch-deck',
      summary: 'Series C pitch deck covering the problem (broken remittance market), solution (WhatsApp-native financial platform), market opportunity ($161B TAM), competitive moat (data flywheel), traction (3× YoY GMV, 68% retention), unit economics (18.2× multi-product LTV/CAC), team, financial projections ($118M revenue by 2027), and the ask.',
      sections: [
        { title: 'Cover', content: 'Félix Pago — The financial home for 60M Latino immigrants, built inside WhatsApp. Series C confidential.', slideIndex: 0 },
        { title: 'The Hook', content: 'María sends $200 home every month. Pays $14 in fees. Waits 3 days. The #1 financial priority for Latino immigrants is still broken.', slideIndex: 1 },
        { title: 'Market Opportunity', content: '$161B TAM in LatAm remittances. $60B+ digital SAM. Remittances are the trust gateway to a $300B underserved financial services market.', slideIndex: 2 },
        { title: 'Distribution Moat', content: 'Built inside WhatsApp — 90%+ penetration in Latino immigrant households. 52% signup conversion. Zero app downloads.', slideIndex: 3 },
        { title: 'The Solution', content: 'Send, save, borrow from WhatsApp. 400K+ users, $1B+ transferred, 8 corridors. Three-layer stack: remittances, wallet, credit.', slideIndex: 4 },
        { title: 'The Flywheel', content: 'Remittances → behavioral data → credit underwriting → wallet → reconversion. Every product strengthens every other product.', slideIndex: 5 },
        { title: 'Competitive Landscape', content: 'Alone in the top-right of WhatsApp-native × Full Financial Platform. Remitly/Wise are app-only transactional. WU is legacy. Neobanks have no cross-border.', slideIndex: 6 },
        { title: 'Why Now', content: 'Three forces: regulatory tailwinds (GENIUS Act), platform timing (WhatsApp Business API maturity), market readiness (68M US Latinos).', slideIndex: 7 },
        { title: 'Traction', content: '3× YoY GMV growth, 68% 90-day retention, NPS 72, 4.2 month CAC payback.', slideIndex: 8 },
        { title: 'Signup & Conversion', content: '+21 pt conversion lift from AI onboarding. 62% organic/referral. 4 min median time to first transaction.', slideIndex: 9 },
        { title: 'Volume & Revenue', content: '5.8× revenue growth in 18 months. 0.97% take rate. 61% gross margin. $34.8M annualized run rate.', slideIndex: 10 },
        { title: 'Retention', content: 'Cohorts improving every quarter. 68% 90-day retention. 2× retention with 2nd product. 3× LTV with wallet.', slideIndex: 11 },
        { title: 'Credit & Wallet', content: '92% AI underwriting accuracy. 20% credit share of revenue. Revenue mix shifting from pure remittances to full stack.', slideIndex: 12 },
        { title: 'Unit Economics', content: 'Multi-product LTV/CAC: 18.2× (vs. 7.4× remittance-only). CAC payback: 4.2 months. Gross margin: 61%.', slideIndex: 13 },
        { title: 'Team', content: '6 leaders: CEO (serial fintech founder), CTO (ML infra), CFO (Stripe+Goldman), VP AI (ex-Nubank), VP Eng (Web3), CPO (10yr Latino fintech).', slideIndex: 14 },
        { title: 'The Ask', content: 'Series C: 40% growth, 35% product/tech, 25% team/compliance. Milestones through Q4 2026 to Series D readiness.', slideIndex: 15 },
        { title: 'Financial Projections', content: '13.6× revenue CAGR. $8.7M (2024) → $118M (2027E). Gross margin 44% → 68%. First positive operating cash flow in 2027.', slideIndex: 16 },
        { title: 'The Vision', content: 'The financial home for every immigrant in the world. Financial dignity for a community that has been overcharged, underserved, and ignored.', slideIndex: 17 },
        { title: 'The Mission', content: 'The job isn\'t finished. Not until every one of María\'s 60 million neighbors has a financial home.', slideIndex: 18 },
        { title: 'Appendix', content: 'Supporting materials: cohort analysis, credit underwriting, financial model, regulatory, technology architecture, cap table.', slideIndex: 19 },
      ],
    },
  )

  console.log(`Created presentation: ${pres.id}`)
  console.log(`Title: ${pres.title}`)
  console.log(`Slides: ${pres.slides.length}`)
  console.log(`Done! View at /create/${pres.id}`)
}

main().catch(console.error)
