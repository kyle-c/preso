import { redis, presKey } from '../lib/studio-db'

const PRES_ID = 'd6016a31-6df1-4392-925a-da604145f0d2'

const slides = [
  // Slide 1 — Cover
  {
    type: 'two-column',
    bg: 'dark',
    badge: 'Series C — Confidential',
    title: 'Félix Pago',
    body: 'The financial home for 60 million Latino immigrants — **built inside WhatsApp.**',
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
  },

  // Slide 2 — The Hook
  {
    type: 'two-column',
    bg: 'light',
    badge: 'The Human Problem',
    title: 'Every month, María sends money home.',
    body: 'She works as a home health aide in Houston. Every 15th of the month, she walks to a Western Union, fills out a form, and watches **$14 vanish** from every $200 she sends to her mother in Guadalajara. Her mom waits three days. María has done this for 6 years. She has never missed a month.\n\n**"The #1 financial priority for Latino immigrants — still broken, still expensive, still built for someone else."**',
    imageUrl: '/illustrations/Hands%20-%202%20Cell%20Phones%20-%20Juntos%20we%20Succeed.svg',
    columns: [
      {},
      {
        bullets: [
          { text: '**7%** — Average fee to send $200 home (World Bank, 2024). $14 per send.', icon: '📊' },
          { text: '**15%** — Of monthly income remitted on average among active senders to Mexico', icon: '📊' },
          { text: '**10%** — Of Latino households are unbanked. 3× the national average — trust gap is real.', icon: '📊' },
          { text: '**3 days** — Average SWIFT settlement time. Weekends not included.', icon: '📊' },
        ],
      },
    ],
  },

  // Slide 3 — The Market
  {
    type: 'two-column',
    bg: 'brand',
    badge: 'Market Opportunity',
    title: 'Remittances are the Trojan Horse.',
    body: 'The $60B+ US-to-LatAm remittance corridor is not the end market — it\'s the trust gateway to a **$300B underserved financial services market**. Every sender is a customer who needs a wallet, credit, savings, and insurance.',
    columns: [
      {
        bullets: [
          { text: '**TAM: $161B** — Total LatAm remittances per year', icon: '🎯' },
          { text: '**SAM: $60B+** — US → LatAm digital corridor', icon: '🎯' },
          { text: '**SOM: $2B+** — 5-year target with Series C capital', icon: '🎯' },
        ],
      },
      {
        body: '**Expansion wedge:** Today Mexico ($64B). Tomorrow Guatemala, El Salvador, Honduras, Colombia — corridors with identical dynamics and zero dominant digital player.',
      },
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
      yKeys: ['total', 'digital'],
      lineKeys: ['digital'],
      colors: ['#6060BF', '#2BF2F1'],
      yLabel: '$B',
      xLabel: 'US → LatAm Remittance Market',
    },
  },

  // Slide 4 — Why WhatsApp
  {
    type: 'two-column',
    bg: 'dark',
    badge: 'The Distribution Moat',
    title: 'No app to download. They\'re already home.',
    body: 'We built inside the app 90%+ of Latino immigrant households already use every day. Zero new behavior. Zero app store friction. Send money the same way you text your family.',
    imageUrl: '/illustrations/Speech%20Bubbles%20%2B%20Hearts.svg',
    columns: [
      {
        heading: 'The network effect built in',
        body: 'Every sender invites a family member → Every recipient becomes a user → Every user is a distribution node',
      },
      {
        bullets: [
          { text: '**90%+** — WhatsApp penetration in Latino immigrant households. 2.5× the rate of non-Hispanic Americans (Pew 2024)', icon: '📱' },
          { text: '**3×** — Higher DAU on WhatsApp vs. standalone fintech apps. Comparable cohort analysis.', icon: '📈' },
          { text: '**52%** — WhatsApp-native signup conversion rate vs. 31% before AI-powered onboarding', icon: '✓' },
          { text: '**0** — App downloads required to send money. The lowest-friction remittance product ever built.', icon: '⚡' },
        ],
      },
    ],
  },

  // Slide 5 — The Solution
  {
    type: 'two-column',
    bg: 'light',
    badge: 'The Solution',
    title: 'Send, save, borrow. From WhatsApp.',
    body: 'No app download. No new account. No friction. Just text Félix — and your money moves.\n\n**400K+ Users Served** · **$1B+ Transferred** · **$75M Series B** · **8 Corridors**',
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
  },

  // Slide 6 — The Flywheel
  {
    type: 'two-column',
    bg: 'brand',
    badge: 'The Compounding Moat',
    title: 'Every product makes every other product stronger.',
    body: 'This is not a feature set — it\'s a compounding engine. Remittance data is a credit underwriting signal that **no bank, BNPL player, or remittance app has access to**.\n\n• **3+ yrs** — Proprietary training data\n• **2×** — Retention with 2nd product vs. 1st\n• **3×** — LTV when wallet adopted\n• **↓35%** — Cost/txn decline YTD',
    columns: [
      {},
      {
        heading: 'The Félix Flywheel',
        bullets: [
          { text: '💬 **Remittances** — Builds trust + generates behavioral data on every send', icon: '💬' },
          { text: '📊 **Behavioral Data** — 3+ years of immigrant financial patterns', icon: '📊' },
          { text: '🤖 **Credit Underwriting** — Model trained on remittance data, not FICO', icon: '🤖' },
          { text: '💳 **Credit & Wallet** — Deepens relationship, increases LTV', icon: '💳' },
          { text: '🔁 **Reconversion** — Returns to remittances at higher frequency', icon: '🔁' },
          { text: '⚡ **Better Unit Economics** — More data → smarter AI → lower CAC', icon: '⚡' },
        ],
      },
    ],
  },

  // Slide 7 — Competitive Landscape
  {
    type: 'two-column',
    bg: 'dark',
    badge: 'Competitive Landscape',
    title: 'We are alone in the top-right.',
    body: 'Distribution (WhatsApp), data (remittance behavior), and culture (Latino-first) are three advantages no competitor can buy. They would have to rebuild their entire stack.',
    columns: [
      {
        bullets: [
          { text: '**Remitly / Wise** — App-native, purely transactional. No credit. No wallet. No cultural fit.', icon: '✗' },
          { text: '**Western Union** — Legacy infrastructure, agent-based model, 5–8% fees. Zero UX.', icon: '✗' },
          { text: '**Neobanks (Chime etc.)** — No remittances, no cross-border, no Latino-immigrant product focus.', icon: '✗' },
        ],
      },
      {
        heading: 'Positioning Matrix',
        body: '**WhatsApp-native** vs. App-based × **Full Financial Platform** vs. Transactional\n\nFélix Pago occupies the only position combining WhatsApp distribution with a full financial platform. Competitors cluster in the bottom-left (app-based + transactional).',
      },
    ],
    chart: {
      chartType: 'bubble',
      data: [
        { name: 'Félix Pago', x: 84, y: 82, z: 52 },
        { name: 'Remitly', x: 22, y: 24, z: 34 },
        { name: 'Wise', x: 26, y: 18, z: 30 },
        { name: 'Western Union', x: 12, y: 12, z: 30 },
        { name: 'Neobanks', x: 18, y: 34, z: 28 },
      ],
      xKey: 'x',
      yKeys: ['y'],
      zKey: 'z',
      colors: ['#2BF2F1', '#888888', '#888888', '#888888', '#888888'],
      xLabel: 'App-based ← → WhatsApp-native',
      yLabel: 'Transactional ← → Full Platform',
    },
  },

  // Slide 8 — Why Now
  {
    type: 'cards',
    bg: 'dark',
    badge: 'Why Now',
    title: 'Three forces converging.',
    subtitle: '"This window is open now. The infrastructure is ready, the population is ready, and we have 3 years of data proving product-market fit."',
    cards: [
      {
        title: '01 — Regulatory Tailwinds',
        titleColor: '#2BF2F1',
        body: 'Open banking maturing. Real-time payment infrastructure (FedNow) live. Stablecoin regulation (GENIUS Act, 2025) creating clarity for Circle/USDC at enterprise scale.\n\n**GENIUS Act** — Signed July 2025',
      },
      {
        title: '02 — Platform Timing',
        titleColor: '#6060BF',
        body: 'WhatsApp Business API reaching enterprise maturity. AI-native conversational UX is now production-grade. TikTok and Instagram opening commerce APIs simultaneously.\n\n**3 Platforms** — Opening commerce APIs now',
      },
      {
        title: '03 — Market Readiness',
        titleColor: '#60D06F',
        body: '68M US Latinos — 20% of the population, growing at 2M/year. Smartphone-native cohort is now the majority sender. 85% smartphone penetration.\n\n**68M** — US Latinos growing 2M/yr',
      },
    ],
  },

  // Slide 9 — Traction
  {
    type: 'cards',
    bg: 'brand',
    badge: 'Traction',
    title: 'We\'ve proven PMF.',
    subtitle: 'Series C is about blitzscaling the machine — not proving it works.',
    cards: [
      { title: '3×', titleColor: '#082422', body: 'YoY GMV Growth\n2023 → 2024' },
      { title: '68%', titleColor: '#082422', body: '90-Day Retention\nAmong cohorts with 2+ sends' },
      { title: '72', titleColor: '#082422', body: 'Net Promoter Score\nIndustry benchmark: ~35' },
      { title: '4.2 mo', titleColor: '#082422', body: 'CAC Payback Period\nDown from 8.1 months in Q1\'24' },
    ],
  },

  // Slide 10 — Signup & Conversion
  {
    type: 'two-column',
    bg: 'light',
    badge: 'Signup & Conversion Machine',
    title: 'Our users are our best salespeople.',
    body: '**+21 pts** — Conversion lift from AI onboarding\n**62%** — New users from organic/referral',
    columns: [
      {
        bullets: [
          { text: 'WhatsApp referral is the lowest CAC channel — every sender is a node', icon: '✓' },
          { text: '90-second KYC via conversational AI — no forms, no uploads', icon: '✓' },
          { text: 'Time to first transaction: median 4 minutes from signup', icon: '✓' },
          { text: 'CAC on WhatsApp channel: $4.80 vs. $7.80 paid digital average', icon: '✓' },
        ],
      },
      {},
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
      yKeys: ['users', 'conv'],
      lineKeys: ['conv'],
      colors: ['#2BF2F1', '#60D06F'],
      yLabel: 'Users (K) / Conv %',
      xLabel: 'User Growth & Conversion Rate',
    },
  },

  // Slide 11 — Volume & Revenue
  {
    type: 'two-column',
    bg: 'light',
    badge: 'Volume & Revenue Machine',
    title: '5.8× revenue growth in 18 months.',
    body: '**0.97%** — Blended take rate — rising with mix\n**61%** — Gross margin (up from 44% Q1\'24)',
    columns: [
      {
        bullets: [
          { text: '$393 average transaction value (Banco de México, 2024)', icon: '✓' },
          { text: 'Mexico: 34% of volume. 7 additional corridors growing.', icon: '✓' },
          { text: 'Stablecoin settlement reducing cost/txn 35% vs. Q1\'24', icon: '✓' },
          { text: 'Revenue run rate: $34.8M annualized as of Q2\'25', icon: '✓' },
        ],
      },
      {},
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
      yKeys: ['vol', 'rev'],
      lineKeys: ['rev'],
      colors: ['#6060BF', '#2BF2F1'],
      yLabel: '$M',
      xLabel: 'Transaction Volume vs. Revenue',
    },
  },

  // Slide 12 — Retention
  {
    type: 'two-column',
    bg: 'light',
    badge: 'Retention & Reconversion Machine',
    title: 'Cohorts improving every quarter.',
    body: '**68%** — 90-day retention, latest cohort\n**2×** — Retention rate with 2nd product',
    columns: [
      {
        bullets: [
          { text: 'Every cohort shows higher 30/60/90-day retention than prior — PMF signal', icon: '✓' },
          { text: 'Multi-product users (wallet + remittance) retain at 2× the rate', icon: '✓' },
          { text: '3× LTV vs. remittance-only users once wallet is adopted', icon: '✓' },
          { text: 'AI reconversion nudges reactivate 38% of lapsed users within 30 days', icon: '✓' },
        ],
      },
      {},
    ],
    chart: {
      chartType: 'stacked-bar',
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
  },

  // Slide 13 — Credit & Wallet
  {
    type: 'two-column',
    bg: 'light',
    badge: 'Credit & Wallet Deep Dive',
    title: 'Nobody else can build this underwriting model. We own the data.',
    body: '**The underwriting thesis:** Remittance behavior → Sends $200/month for 18 months → AI infers creditworthiness → Loan approved without FICO\n\n• **92%** — AI underwriting accuracy vs. traditional credit bureau\n• **20%** — Credit share of revenue (Q2\'25, up from 0% Q1\'24)\n• **+15 pts** — Gross margin premium (credit vs. remittances)\n• **↑↑** — Higher remit rate post-credit (credit users reconvert at higher freq)',
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
      {},
    ],
    chart: {
      chartType: 'stacked-bar',
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
  },

  // Slide 14 — Unit Economics
  {
    type: 'content',
    bg: 'dark',
    badge: 'Unit Economics',
    title: 'Better with every transaction.',
    body: '| Metric | Current | Year 2 Target | Progress |\n|---|---|---|---|\n| CAC | **$4.80** | $3.20 | 68% |\n| CAC Payback | **4.2 mo** | 2.8 mo | 62% |\n| Gross Margin / Txn | **61%** | 72% | 61% |\n| LTV (24-month) | **$35.60** | $68.00 | 52% |\n| **LTV / CAC** | **7.4×** | **21×** | **74%** |\n| **Multi-product LTV / CAC** | **18.2×** | **35×** | **88%** |\n\n**Multi-product LTV/CAC is the story:** Users with wallet + credit generate 18.2× LTV vs. CAC — vs. 7.4× for remittance-only users. Series C funds the cross-sell machine.',
  },

  // Slide 15 — Team
  {
    type: 'cards',
    bg: 'light',
    badge: 'Team',
    title: 'Built for this market.',
    subtitle: '**Key Investors & Advisors:** QED Investors (Lead — Series B), Circle (USDC infrastructure partner), Former CFPB Advisor\n**Key Open Roles:** VP Growth & Performance Marketing, Head of Credit Risk & Underwriting, VP Compliance & Regulatory Affairs, Director of New Corridors',
    cards: [
      { title: 'Manuel Godoy', titleColor: '#2BF2F1', body: 'CEO & Co-Founder\nSerial fintech founder. Led Félix 0 → $1B+ in transfers.' },
      { title: 'Carlos Reyes', titleColor: '#6060BF', body: 'CTO & Co-Founder\nML infra background. Architected the AI conversation engine.' },
      { title: 'Sofia Delgado', titleColor: '#F19D38', body: 'CFO\nStripe + Goldman. Stablecoin treasury and compliance.' },
      { title: 'Diego Solano', titleColor: '#60D06F', body: 'VP AI & Data\nLed NLP at Nubank. Domain-specific financial AI.' },
      { title: 'Lucía Herrera', titleColor: '#F26629', body: 'VP Engineering\nUSDC / blockchain rails. Web3-native infrastructure.' },
      { title: 'Valentina Cruz', titleColor: '#35605F', body: 'CPO\n10 yrs building fintech for the Latino market.' },
    ],
  },

  // Slide 16 — The Ask
  {
    type: 'two-column',
    bg: 'dark',
    badge: 'The Ask',
    title: 'Series C Raise',
    body: 'This capital takes Félix from proven PMF to blitzscale. From $890M quarterly GMV to $1.5B+ annualized. From 400K users to 1M+. From one product to three.\n\n**Use of Funds:**\n• **40% Growth** — Blitzscale remittances, activate Instagram & TikTok, WhatsApp referral deepening\n• **35% Product & Technology** — Credit/Wallet v2, AI conversation engine, stablecoin rail expansion\n• **25% Team & Compliance** — Key hires, new state licenses, regulatory positioning',
    columns: [
      {
        heading: 'Key Milestones',
        bullets: [
          { text: '**Q3\'25** — IG & TikTok channels live. 600K users.', icon: '📅' },
          { text: '**Q4\'25** — $1.5B annualized GMV. Credit v2 launched.', icon: '📅' },
          { text: '**Q2\'26** — 3 new corridors. Wallet MAU > 200K.', icon: '📅' },
          { text: '**Q4\'26** — Path to operational cash flow. Series D ready.', icon: '📅' },
        ],
      },
      {
        heading: 'Budget Breakdown',
        bullets: [
          { text: '**40% Growth** — Blitzscale remittances, paid acquisition + partnerships, Instagram & TikTok at scale, WhatsApp referral infrastructure deepening', icon: '🚀' },
          { text: '**35% Product & Technology** — Credit/Wallet buildout v2, AI conversation engine depth + new corridors, Stablecoin rail expansion + Circle infrastructure', icon: '⚙' },
          { text: '**25% Team & Compliance** — Key hires (engineering, credit risk, compliance, growth), new state money transmission licenses, regulatory positioning', icon: '👥' },
        ],
      },
    ],
  },

  // Slide 17 — Financial Projections
  {
    type: 'two-column',
    bg: 'light',
    badge: 'Financial Projections',
    title: 'The margin expansion story.',
    body: '**13.6×** — Revenue CAGR, \'24–\'27E\n**68%** — Target gross margin by 2027',
    columns: [
      {
        heading: 'Key Assumptions',
        bullets: [
          { text: 'Take rate expands from 0.97% to 1.3% as credit and wallet mix grows', icon: '✓' },
          { text: 'Stablecoin rail adoption drives gross margin from 61% → 68% by 2027', icon: '✓' },
          { text: 'New corridor launches (3 in 2026) drive 40% of incremental volume', icon: '✓' },
          { text: '2027: First full year of positive operating cash flow', icon: '✓' },
        ],
      },
      {},
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
      yKeys: ['rev', 'gm'],
      lineKeys: ['gm'],
      colors: ['#2BF2F1', '#DCFF00'],
      yLabel: '$M / %',
      xLabel: 'Revenue & Gross Margin',
    },
  },

  // Slide 18 — The Vision
  {
    type: 'closing',
    bg: 'dark',
    badge: 'The Vision',
    title: 'The financial home for every immigrant in the world.',
    body: 'Félix started with remittances. It becomes the full financial stack — wallet, credit, savings, insurance — for the most underserved and underleveraged population in the US. And then for every immigrant community globally.\n\nThis isn\'t just fintech. It\'s financial dignity for a community that has been overcharged, underserved, and ignored for generations. Félix is the company that finally builds it right.',
    subtitle: '💬 Built on WhatsApp · 🤖 Powered by AI · ⚡ Settled on stablecoins',
    imageUrl: '/illustrations/F%C3%A9lix%20Illo%201.svg',
  },

  // Slide 19 — Job Not Finished
  {
    type: 'closing',
    bg: 'dark',
    title: 'The job isn\'t finished.',
    body: 'Not until every one of María\'s 60 million neighbors has a financial home.',
    videoUrl: 'https://www.youtube.com/embed/fY7l2pcxdHM',
  },

  // Slide 20 — Appendix
  {
    type: 'cards',
    bg: 'light',
    badge: 'Appendix',
    title: 'Supporting Materials',
    subtitle: 'Full data room available upon request under executed NDA.',
    cards: [
      {
        title: 'A — Detailed Cohort Analysis',
        titleColor: '#2BF2F1',
        body: '• Full 30/60/90/180/365-day retention curves by acquisition channel\n• Cohort LTV progression by product adoption stage\n• WhatsApp referral network density analysis',
      },
      {
        title: 'B — Credit Underwriting',
        titleColor: '#2BF2F1',
        body: '• Remittance-behavior signal architecture and feature weighting\n• Model accuracy, approval rate, and default rate by cohort\n• Comparison vs. FICO-based and alternative credit models',
      },
      {
        title: 'C — Financial Model',
        titleColor: '#2BF2F1',
        body: '• Full 3-year P&L, balance sheet, and cash flow model\n• Sensitivity analysis: take rate, CAC, corridor growth\n• Bear / base / bull scenario outputs',
      },
      {
        title: 'D — Regulatory & Compliance',
        titleColor: '#2BF2F1',
        body: '• State money transmission license status (all 50 states)\n• FinCEN, BSA/AML compliance framework\n• Stablecoin regulatory positioning (GENIUS Act alignment)',
      },
      {
        title: 'E — Technology Architecture',
        titleColor: '#2BF2F1',
        body: '• AI conversation engine stack and training data overview\n• Circle/USDC integration and settlement architecture\n• Security, encryption, and fraud prevention systems',
      },
      {
        title: 'F — Cap Table & Governance',
        titleColor: '#2BF2F1',
        body: '• Current cap table summary\n• Board composition and observer rights\n• Option pool and dilution schedule',
      },
    ],
  },
]

async function main() {
  const raw = await redis.get<any>(presKey(PRES_ID))
  if (!raw) {
    console.error('Presentation not found')
    process.exit(1)
  }
  const stored = typeof raw === 'string' ? JSON.parse(raw) : raw
  stored.slides = JSON.stringify(slides)
  stored.updatedAt = Math.floor(Date.now() / 1000)
  await redis.set(presKey(PRES_ID), JSON.stringify(stored))
  console.log(`Updated ${slides.length} slides for presentation ${PRES_ID}`)
}

main().catch(console.error)
