'use client'

import { SlideRenderer, type SlideData } from '@/components/studio/slide-renderer'

/* ═══════════════════════════════════════════════════════════════════════ */
/*  Comprehensive demo: every content structure the renderer supports     */
/*  De-duped by bg — each variation shown once on its best background    */
/* ═══════════════════════════════════════════════════════════════════════ */

const DEMO_SLIDES: SlideData[] = [

  // ─── COVER ───
  { type: 'title', bg: 'dark', badge: 'Template Catalog', title: 'Félix Studio', subtitle: 'Every content structure. Every template.' },

  // ═══════════════════════════════════════════
  //  EXEMPLAR SLIDES (preso-sample slides 1–7)
  // ═══════════════════════════════════════════
  { type: 'section', bg: 'dark', badge: '00', title: 'Exemplar Slides', subtitle: 'Adapted from the Team Weekly presentation' },

  // 1. North Star — two-column with mission + principles
  { type: 'two-column', bg: 'light', badge: 'North Star', title: 'Félix North Star', columns: [
    { heading: 'Mission', body: 'To empower Latinos in the US to care for what matters most back home.\n\nBecome the companion for Latinos in the United States enabling them to access financial services throughout their journey as immigrants.' },
    { heading: 'Key Principles', bullets: [
      { text: 'We are obsessed about our customers', icon: '✓' },
      { text: 'We get sh*t done with urgency and focus', icon: '✓' },
      { text: 'We collaborate without ego', icon: '✓' },
      { text: 'We practice extreme ownership', icon: '✓' },
      { text: 'We aim for insanely great', icon: '✓' },
      { text: 'We are insatiably curious', icon: '✓' },
    ] },
  ] },

  // 2. Our Values — 6 cards
  { type: 'cards', bg: 'dark', badge: 'Culture', title: 'Our Values', cards: [
    { title: '01 · User-Obsession', titleColor: '#2BF2F1', body: 'We earn the right to serve our users every day. We remember the hard work they went through to send this money.' },
    { title: '02 · Get Sh*t Done', titleColor: '#60D06F', body: 'We have a bias towards action. Champions adjust! We focus on what we want to accomplish.' },
    { title: '03 · Extreme Ownership', titleColor: '#F19D38', body: 'Each person owns a mission-critical piece of the vision. No weak links. No passengers.' },
    { title: '04 · No-Ego Collab', titleColor: '#6060BF', body: 'We disagree clearly and commit once decided. We break silos and move in lockstep.' },
    { title: '05 · Insanely Great', titleColor: '#F26629', body: 'We elevate quality by caring deeply. We obsess about every customer moment.' },
    { title: '06 · Insatiable Curiosity', titleColor: '#FFCD9C', body: 'We listen to users and base assumptions in data. We test and never take anything for granted.' },
  ] },

  // 3. Rules of the Land — 4 cards
  { type: 'cards', bg: 'light', badge: 'Weekly Sync', title: 'Rules of the Land', cards: [
    { title: '1 · Share What Matters', titleColor: '#35605F', body: 'Lead with metrics, impact, and insights tied to quarterly goals. Ask: does this show impact?' },
    { title: '2 · Be Concise', titleColor: '#6060BF', body: 'State your time upfront — we\'ll hold you to it. Cap slide decks at 4 slides max.' },
    { title: '3 · Limit Demos', titleColor: '#60D06F', body: 'Keep demos under 2 minutes. Have links ready so anyone can dig deeper async.' },
    { title: '4 · Follow the Structure', titleColor: '#F19D38', body: 'Objective → Action → Impact → Next Steps. Keep updates clear and predictable.' },
  ] },

  // 4. Agenda
  { type: 'bullets', bg: 'light', badge: 'Agenda', title: 'Feb. 23rd — Feb. 27th', bullets: [
    { text: 'Icebreaker — 3 min' },
    { text: 'FélixBook — 10 min' },
    { text: 'Weekly Recap — 5 min' },
    { text: 'Félix Weekly Updates — 35-40 min' },
  ], imageUrl: '/illustrations/3 Paper Airplanes + Coins.svg' },

  // 5. Goals / OKRs
  { type: 'two-column', bg: 'light', badge: 'OKRs', title: 'Zoo Goals for Q1 2025', columns: [
    { heading: 'Objectives', bullets: [
      { text: '**Reduce goose chaos** — Zero goose-related HR incidents (12% complete)', icon: '🔴' },
      { text: '**85% of visitors not chased** — Currently at 63%', icon: '🟡' },
      { text: '**Relocate Gerald** the alpha goose — Not started', icon: '🔴' },
      { text: '**1 capybara awake** during zoo hours — 47% progress', icon: '🟢' },
    ] },
    { heading: 'Urgent Situations', bullets: [
      { text: 'Find out who taught the parrot to say "you\'re fired"', icon: '🟡' },
      { text: 'Stop the raccoons from unionizing', icon: '🟡' },
    ] },
  ] },

  // 6. Product Demo — with embedded mobile device frame
  { type: 'content', bg: 'dark', badge: 'Product Demo', title: 'Send Money in 60 Seconds', body: 'Our remittance flow is designed for speed and trust. Three screens, one tap to confirm, real-time delivery tracking.\n\n**Step 1:** Corridor Selection — Auto-detected based on user profile\n**Step 2:** Amount & FX Lock — Live rate with 30-second lock\n**Step 3:** Review & Confirm — Biometric confirmation, no hidden fees', embedUrl: '/fintechtestflow/embed' },

  // 7. Org Chart — leadership cards
  { type: 'cards', bg: 'dark', badge: 'Leadership', title: 'Our Team', cards: [
    { title: 'Manuel G. — CEO', titleColor: '#2BF2F1', body: 'Founder and CEO. Setting the vision for Félix across all markets and products.' },
    { title: 'Carlos R. — CTO', titleColor: '#6060BF', body: 'Leading engineering, data, and infrastructure. Scaling from 8 to 20 engineers.' },
    { title: 'Sofía D. — CFO', titleColor: '#F19D38', body: 'Finance, treasury, and investor relations. Driving the path to profitability.' },
    { title: 'Valentina C. — CPO', titleColor: '#F26629', body: 'Product and design leadership. Owns corridor expansion strategy and user growth.' },
    { title: 'Ricardo M. — COO', titleColor: '#35605F', body: 'Operations, compliance, partnerships, and the payout network across 7 countries.' },
  ] },

  // ═══════════════════════════════════════════
  //  TITLE VARIATIONS
  // ═══════════════════════════════════════════
  { type: 'section', bg: 'dark', badge: '01', title: 'Title Slides' },

  // Full (badge + subtitle)
  { type: 'title', bg: 'light', badge: 'Launch 2026', title: 'The Future of Remittances', subtitle: 'Faster, cheaper, more human.' },
  // Minimal (title only)
  { type: 'title', bg: 'brand', title: 'Bold Statement' },

  // ═══════════════════════════════════════════
  //  SECTION VARIATIONS
  // ═══════════════════════════════════════════
  { type: 'section', bg: 'light', badge: '02', title: 'Section Dividers' },

  // Full (badge + subtitle)
  { type: 'section', bg: 'dark', badge: 'Part One', title: 'Understanding the Problem', subtitle: 'Why remittances are broken today.' },
  // Minimal (title only)
  { type: 'section', bg: 'brand', title: 'Key Takeaway' },

  // ═══════════════════════════════════════════
  //  CONTENT VARIATIONS
  // ═══════════════════════════════════════════
  { type: 'section', bg: 'dark', badge: '03', title: 'Content Slides' },

  // Body + illustration + badge
  { type: 'content', bg: 'dark', badge: 'Overview', title: 'How Félix Works', body: 'Users download the app, verify their identity, link a payment method, and send money in under 60 seconds. Recipients get cash, bank deposit, or mobile wallet credit.\n\n**No hidden fees.** The exchange rate you see is the rate you get.', imageUrl: '/illustrations/Hand - Cell Phone OK.svg' },
  // Body + illustration, no badge
  { type: 'content', bg: 'light', title: 'Savings Calculator', body: 'The average Félix user saves $847 per year compared to traditional providers. Over 5 years, that\'s a down payment on a home.', imageUrl: '/illustrations/Calculator + Stack of coins.svg' },
  // Body only (no illustration)
  { type: 'content', bg: 'dark', title: 'The Numbers Speak', body: 'Over **$150 billion** flows through remittance corridors in Latin America every year. The average fee is still 6.2% — more than double what it should be.\n\nFélix charges 1.9% on average, saving families thousands annually.' },
  // Hero metric (large centered stat — from dv-hero-metric blueprint)
  { type: 'content', bg: 'dark', badge: 'Key Metric', title: 'Transaction Volume Surges', body: '**2.4M** monthly transactions\n\n**+18.2% MoM** · **+142% YoY**\n\nMilestone reached December 2025 — fastest growth quarter in company history.' },
  // Problem statement (from pd-problem blueprint)
  { type: 'content', bg: 'dark', badge: 'The Problem', title: 'Families Pay Too Much', body: 'Latino immigrants in the US struggle to send money affordably because legacy providers charge 6-8% in fees and hidden markups, which results in **$4.2 billion** lost annually by the families who can least afford it.\n\n**68%** feel overcharged · **42%** skip meals to cover fees · **3.5 hours** average time per transaction', imageUrl: '/illustrations/Magnifying Glass.svg' },

  // ═══════════════════════════════════════════
  //  BULLETS VARIATIONS
  // ═══════════════════════════════════════════
  { type: 'section', bg: 'light', badge: '04', title: 'Bullet Slides' },

  // Standard bullets with illustration
  { type: 'bullets', bg: 'dark', badge: 'Features', title: 'Why Users Choose Félix', bullets: [
    { text: 'Send money in under 60 seconds' },
    { text: 'Real-time exchange rates with no markup' },
    { text: 'Track every transfer from send to receive' },
    { text: 'Multiple payout options: bank, cash, wallet' },
    { text: '24/7 bilingual customer support' },
  ], imageUrl: '/illustrations/Fast.svg' },
  // Short list, no illustration
  { type: 'bullets', bg: 'light', title: 'Core Principles', bullets: [
    { text: 'User needs drive every decision' },
    { text: 'Simplicity is the ultimate sophistication' },
    { text: 'Ship fast, learn faster' },
  ] },
  // Long list with illustration (7 items — roadmap style)
  { type: 'bullets', bg: 'dark', badge: 'Roadmap', title: 'H1 2026 Priorities', bullets: [
    { text: 'Launch Ecuador corridor' },
    { text: 'Introduce recurring transfers' },
    { text: 'Build referral rewards program' },
    { text: 'Ship dark mode across all platforms' },
    { text: 'Add biometric authentication' },
    { text: 'Integrate with WhatsApp Business' },
    { text: 'Achieve SOC 2 Type II certification' },
  ], imageUrl: '/illustrations/Map.svg' },
  // Agenda style (from pd-agenda blueprint) — numbered items
  { type: 'bullets', bg: 'light', badge: 'Agenda', title: 'Today\'s Agenda', bullets: [
    { text: '01 · Company Update — 10 min' },
    { text: '02 · Product Roadmap — 15 min' },
    { text: '03 · Design System Review — 10 min' },
    { text: '04 · Engineering Deep Dive — 15 min' },
    { text: '05 · Q&A and Next Steps — 10 min' },
  ] },

  // ═══════════════════════════════════════════
  //  TWO-COLUMN VARIATIONS
  // ═══════════════════════════════════════════
  { type: 'section', bg: 'dark', badge: '05', title: 'Two-Column Slides' },

  // Bullets with icons (before/after — pd-before-after)
  { type: 'two-column', bg: 'dark', badge: 'Before & After', title: 'The Félix Difference', columns: [
    { heading: 'Traditional', bullets: [
      { text: 'Wait in line at an agent', icon: '⏳' },
      { text: 'Hidden fees and markups', icon: '💸' },
      { text: 'No tracking or visibility', icon: '🔒' },
    ] },
    { heading: 'With Félix', bullets: [
      { text: 'Send from your couch', icon: '📱' },
      { text: 'Transparent, low fees', icon: '✅' },
      { text: 'Real-time tracking', icon: '👀' },
    ] },
  ] },
  // Bullets without icons
  { type: 'two-column', bg: 'dark', title: 'Technical Stack', columns: [
    { heading: 'Frontend', bullets: [
      { text: 'React Native for mobile' },
      { text: 'Next.js for web' },
      { text: 'Tailwind CSS + design tokens' },
    ] },
    { heading: 'Backend', bullets: [
      { text: 'Node.js microservices' },
      { text: 'PostgreSQL + Redis' },
      { text: 'AWS infrastructure' },
    ] },
  ] },
  // Body text (paragraphs)
  { type: 'two-column', bg: 'light', title: 'Design Tokens vs Components', columns: [
    { heading: 'Design Tokens', body: 'Centralized variables for color, spacing, typography, and motion. Tokens ensure consistency across every platform and product surface.' },
    { heading: 'Components', body: 'Pre-built, accessible UI components that consume design tokens. Each component is tested across mobile and web viewports.' },
  ] },
  // Mixed: one column bullets, one column body
  { type: 'two-column', bg: 'dark', badge: 'Mixed Layout', title: 'Platform Overview', columns: [
    { heading: 'Key Features', bullets: [
      { text: 'Instant transfers' },
      { text: 'Multi-currency support' },
      { text: 'Real-time notifications' },
      { text: 'Recipient management' },
    ] },
    { heading: 'Why It Matters', body: 'Every feature was designed from ethnographic research with real users sending money to their families. We don\'t build what sounds good — we build what\'s needed.' },
  ] },
  // OKR style (from pd-okr blueprint)
  { type: 'two-column', bg: 'dark', badge: 'OKRs', title: 'Q1 Objectives & Key Results', columns: [
    { heading: 'Objectives', bullets: [
      { text: '**Grow transaction volume 40%** — KR: 2.4M monthly transfers' },
      { text: '**Expand to 2 new corridors** — KR: Guatemala + Honduras live by March' },
      { text: '**Improve NPS to 65+** — KR: Reduce support tickets 30%' },
    ] },
    { heading: 'Status', body: 'Overall completion: **72%**\n\nOn track for volume and corridor goals. NPS improvement at risk — support hiring delayed. Mitigation: temporary contractor team starting Feb 1.' },
  ] },
  // Executive summary (from cs-exec-summary blueprint)
  { type: 'two-column', bg: 'light', badge: 'Executive Summary', title: 'Board Update — Q4 2025', columns: [
    { heading: 'Thesis', body: 'Félix has achieved product-market fit in the US→Mexico corridor and is ready to scale. Unit economics are positive, and the next two corridors represent $18B in addressable volume.' },
    { heading: 'Key Points', bullets: [
      { text: '**Context:** US→MX corridor now profitable with 200K MAU' },
      { text: '**Recommendation:** Raise Series B to fund Guatemala and Honduras expansion' },
      { text: '**Ask:** $25M at $180M pre-money valuation' },
    ] },
  ] },
  // Market sizing (from cs-market-sizing blueprint)
  { type: 'two-column', bg: 'light', badge: 'Market Size', title: 'TAM / SAM / SOM', columns: [
    { heading: 'Market Layers', body: '**TAM:** $156B — All remittances to Latin America\n\n**SAM:** $42B — US-originated digital transfers\n\n**SOM:** $840M — Corridors where Félix is licensed and active' },
    { heading: 'Methodology', bullets: [
      { text: 'World Bank bilateral remittance data (2024)' },
      { text: 'Digital share from FXC Intelligence estimates' },
      { text: 'SOM based on licensed corridors × 2% market share target' },
    ] },
  ] },
  // P&L / Financial summary (from cs-pnl blueprint)
  { type: 'two-column', bg: 'dark', badge: 'Financials', title: 'P&L Summary', columns: [
    { heading: 'Income Statement', body: '**Revenue:** $8.4M (+180% YoY)\n**COGS:** $3.2M (38% margin)\n**Gross Profit:** $5.2M\n**OpEx:** $6.8M\n**EBITDA:** -$1.6M (improving from -$4.2M)' },
    { heading: 'Key Takeaways', bullets: [
      { text: '**Gross margin expanding** — from 28% to 38% as volume scales' },
      { text: '**Path to profitability** — EBITDA positive by Q3 2026' },
      { text: '**CAC declining** — $18 → $12 as organic grows' },
    ] },
  ] },
  // A/B test results (from dv-ab-test blueprint)
  { type: 'two-column', bg: 'dark', badge: 'Experiment', title: 'Send Flow A/B Test Results', columns: [
    { heading: 'Control (A)', body: 'Standard 4-step send flow\n\n**Completion rate:** 72%\n**Avg. time:** 4.2 minutes\n**Sample:** 12,400 users' },
    { heading: 'Variant (B) — Winner', body: 'Simplified 2-step send flow\n\n**Completion rate:** 89%\n**Avg. time:** 1.8 minutes\n**+23.6% lift** · p < 0.01 · 99.4% confidence' },
  ] },
  // User persona (from pd-persona blueprint)
  { type: 'two-column', bg: 'light', badge: 'Persona', title: 'Maria — The Weekly Sender', columns: [
    { heading: 'Profile', body: 'Age 34, Houston TX. Housekeeper. Sends $200-400 weekly to her mother in Tegucigalpa, Honduras.\n\n*"I just want to know the money got there. That\'s all I need."*' },
    { heading: 'Needs & Pain Points', bullets: [
      { text: 'Confirmation that money arrived safely', icon: '💚' },
      { text: 'Spanish-language customer support', icon: '💚' },
      { text: 'Frustrated by agent office hours', icon: '😤' },
      { text: 'Confused by exchange rate math', icon: '😤' },
      { text: 'Wants to save for daughter\'s quinceañera', icon: '🎯' },
    ] },
  ] },
  // Career ladder (from hr-career-ladder blueprint)
  { type: 'two-column', bg: 'dark', badge: 'Career Path', title: 'Engineering Levels', columns: [
    { heading: 'Individual Contributor', bullets: [
      { text: '**IC1** — Executes well-defined tasks with guidance' },
      { text: '**IC2** — Owns features end-to-end independently' },
      { text: '**IC3** — Drives cross-team technical decisions' },
      { text: '**Staff** — Sets technical direction for a domain' },
      { text: '**Principal** — Shapes company-wide architecture' },
    ] },
    { heading: 'Expectations', body: 'Each level increases in **scope** (task → feature → system → org), **autonomy** (guided → independent → directing), and **complexity** (well-defined → ambiguous → undefined).\n\nPromotion requires sustained performance at the next level for 6+ months.' },
  ] },
  // Competitive positioning (from cs-competitive blueprint)
  { type: 'two-column', bg: 'light', badge: 'Competitive', title: 'Market Positioning', columns: [
    { heading: 'Landscape', body: '**Leaders:** Western Union, Wise (high reach + digital)\n**Challengers:** Remitly, Xoom (growing fast)\n**Niche:** Félix, Mama Money (corridor-specific)\n**Commodity:** Cash agents (declining)' },
    { heading: 'Our Advantages', bullets: [
      { text: 'Deepest LatAm corridor expertise' },
      { text: 'Lowest fee structure in our corridors' },
      { text: 'WhatsApp-native experience (unique)' },
      { text: 'Bilingual support with cultural fluency' },
    ] },
  ] },
  // Decision matrix (from cs-decision-matrix blueprint)
  { type: 'two-column', bg: 'light', badge: 'Decision', title: 'Payout Partner Evaluation', columns: [
    { heading: 'Scoring Matrix', body: '**Partner A:** Speed 9 · Cost 7 · Coverage 8 · Reliability 9 = **33**\n**Partner B:** Speed 7 · Cost 9 · Coverage 6 · Reliability 8 = **30**\n**Partner C:** Speed 8 · Cost 8 · Coverage 9 · Reliability 7 = **32**' },
    { heading: 'Recommendation', body: '**Partner A wins** with highest reliability and speed scores — the two factors our users rank as most important.\n\nNegotiating volume discount to address cost gap. Target: close by Feb 28.' },
  ] },
  // Cross-platform (from df-cross-platform blueprint)
  { type: 'two-column', bg: 'light', badge: 'Platforms', title: 'Cross-Platform Experience', columns: [
    { heading: 'Desktop', body: 'Full analytics dashboard, bulk transfer tools, admin controls, and detailed transaction history. Designed for power users and business accounts.' },
    { heading: 'Mobile', body: 'Touch-optimized send flow, push notifications, biometric login, and quick-repeat transfers. Designed for the weekly sender who needs speed above all.' },
  ] },

  // ═══════════════════════════════════════════
  //  CARDS VARIATIONS
  // ═══════════════════════════════════════════
  { type: 'section', bg: 'dark', badge: '06', title: 'Card Slides' },

  // 2 cards
  { type: 'cards', bg: 'light', title: 'Problem & Solution', cards: [
    { title: 'Problem', titleColor: '#35605F', body: 'Remittance fees are too high and the experience is stuck in the 1990s.' },
    { title: 'Solution', titleColor: '#6060BF', body: 'A mobile-first platform that makes sending money as easy as texting.' },
  ] },
  // 3 cards (classic)
  { type: 'cards', bg: 'dark', title: 'Send · Save · Spend', cards: [
    { title: 'Send', titleColor: '#2BF2F1', body: 'Transfer money across borders in under 60 seconds.' },
    { title: 'Save', titleColor: '#F19D38', body: 'Set aside money with automatic savings goals.' },
    { title: 'Spend', titleColor: '#60D06F', body: 'Use your balance for everyday purchases.' },
  ] },
  // 4 cards (KPI grid — from dv-kpi-grid blueprint)
  { type: 'cards', bg: 'light', badge: 'KPIs', title: 'Q4 Dashboard', cards: [
    { title: '$3.4M', titleColor: '#6060BF', body: 'Revenue · ↑ 42% YoY · Best quarter to date' },
    { title: '284K', titleColor: '#F26629', body: 'Monthly Active Users · ↑ 18% QoQ · Surpassed 250K target' },
    { title: '89%', titleColor: '#35605F', body: 'Completion Rate · ↑ 12pts · New 2-step flow launched' },
    { title: '68', titleColor: '#7BA882', body: 'Net Promoter Score · ↑ 16pts YoY · Highest ever' },
  ] },
  // 5 cards (customer journey — from pd-journey blueprint)
  { type: 'cards', bg: 'dark', badge: 'Journey', title: 'Customer Journey Map', cards: [
    { title: 'Awareness', titleColor: '#2BF2F1', body: 'Word-of-mouth referral from family. 68% discover Félix through someone they trust.' },
    { title: 'Consideration', titleColor: '#60D06F', body: 'Compare fees on first visit. Users check 2.3 providers on average before choosing.' },
    { title: 'Onboarding', titleColor: '#F19D38', body: 'KYC in under 3 minutes. ID scan + selfie verification powered by Onfido.' },
    { title: 'First Transfer', titleColor: '#F26629', body: 'Average first send: $185 to Mexico. 72% complete within 24 hours of signup.' },
    { title: 'Retention', titleColor: '#FFCD9C', body: 'Weekly sender pattern emerges. 60-day retention: 78%. Avg frequency: 4.2x/month.' },
  ] },
  // Phase-style titles (30-60-90 — from hr-30-60-90 blueprint)
  { type: 'cards', bg: 'dark', badge: 'Onboarding', title: '30-60-90 Day Plan', cards: [
    { title: 'Days 1-30: Immerse', titleColor: '#2BF2F1', body: '• Meet every team and shadow support calls\n• Complete all compliance training\n• Send 10 test transfers across corridors\n• Read user research repository' },
    { title: 'Days 31-60: Build', titleColor: '#60D06F', body: '• Ship your first feature to production\n• Present at design review\n• Own a corridor-level metric\n• Pair with senior engineer on architecture' },
    { title: 'Days 61-90: Lead', titleColor: '#F26629', body: '• Drive a project end-to-end\n• Mentor a new teammate\n• Present at all-hands\n• Write your first technical design doc' },
  ] },
  // SWOT analysis (from cs-swot blueprint)
  { type: 'cards', bg: 'dark', badge: 'SWOT', title: 'Strategic Analysis', cards: [
    { title: 'Strengths', titleColor: '#60D06F', body: '• Lowest fees in LatAm corridors\n• WhatsApp-native UX (unique)\n• Deep cultural fluency\n• 78% 60-day retention' },
    { title: 'Weaknesses', titleColor: '#F26629', body: '• Limited to 7 corridors\n• No cash-in option yet\n• Brand awareness still low\n• Small engineering team' },
    { title: 'Opportunities', titleColor: '#2BF2F1', body: '• Ecuador corridor ($4.2B)\n• Business/SMB transfers\n• Savings product expansion\n• Embedded finance partnerships' },
    { title: 'Threats', titleColor: '#F19D38', body: '• Wise entering LatAm\n• Regulatory changes in MX\n• FX volatility\n• WhatsApp policy shifts' },
  ] },
  // Now / Next / Later (from pd-now-next-later blueprint)
  { type: 'cards', bg: 'dark', badge: 'Priorities', title: 'Now / Next / Later', cards: [
    { title: 'Now', titleColor: '#2BF2F1', body: '• Recurring transfers\n• Rate alert notifications\n• Guatemala corridor launch\n• Accessibility audit' },
    { title: 'Next', titleColor: '#60D06F', body: '• Honduras corridor\n• Business API beta\n• Referral rewards v2\n• WhatsApp bot improvements' },
    { title: 'Later', titleColor: '#F19D38', body: '• Ecuador + Colombia\n• Virtual card issuance\n• Savings goals product\n• Crypto on-ramp exploration' },
  ] },
  // Quarterly roadmap (from pd-roadmap blueprint)
  { type: 'cards', bg: 'light', badge: 'Roadmap', title: '2026 Quarterly Plan', cards: [
    { title: 'Q1', titleColor: '#6060BF', body: '✓ Recurring transfers shipped\n✓ Guatemala corridor live\n→ Rate alerts in beta\n○ Accessibility audit' },
    { title: 'Q2', titleColor: '#35605F', body: '→ Honduras corridor\n→ Business API beta\n○ Referral rewards v2\n○ WhatsApp bot v2' },
    { title: 'Q3', titleColor: '#F26629', body: '○ Ecuador corridor\n○ Virtual card pilot\n○ Savings goals MVP\n○ SOC 2 Type II' },
    { title: 'Q4', titleColor: '#7BA882', body: '○ Colombia expansion\n○ Embedded finance SDK\n○ Premium tier launch\n○ 1M MAU target' },
  ] },
  // Risk register (from pd-risk-register blueprint)
  { type: 'cards', bg: 'dark', badge: 'Risks', title: 'Risk Register', cards: [
    { title: 'Regulatory Delay', titleColor: '#F19D38', body: '**Likelihood:** High · **Impact:** Critical\n**Mitigation:** Pre-file in parallel, engage local counsel\n**Owner:** Legal Team' },
    { title: 'FX Volatility', titleColor: '#F19D38', body: '**Likelihood:** Medium · **Impact:** Major\n**Mitigation:** Dynamic hedging + real-time rate engine\n**Owner:** Treasury' },
    { title: 'Key Person Risk', titleColor: '#FFCD9C', body: '**Likelihood:** Low · **Impact:** Major\n**Mitigation:** Document all systems, cross-train team\n**Owner:** Engineering Lead' },
    { title: 'Competitor Entry', titleColor: '#60D06F', body: '**Likelihood:** High · **Impact:** Minor\n**Mitigation:** Deepen corridor moats, accelerate NPS\n**Owner:** Product Team' },
  ] },
  // Scenario planning (from cs-scenario-planning blueprint)
  { type: 'cards', bg: 'dark', badge: 'Scenarios', title: 'Revenue Scenarios — 2026', cards: [
    { title: 'Bull Case', titleColor: '#60D06F', body: '**Probability:** 25%\n**Revenue:** $28M\n• All 4 new corridors launch on time\n• Organic growth exceeds 50%\n• Business API drives enterprise adoption' },
    { title: 'Base Case', titleColor: '#F19D38', body: '**Probability:** 55%\n**Revenue:** $18M\n• 2 of 4 corridors launch\n• Organic growth at 30%\n• Consumer-only focus through H1' },
    { title: 'Bear Case', titleColor: '#F26629', body: '**Probability:** 20%\n**Revenue:** $11M\n• Regulatory delays push corridors to 2027\n• Increased competitive pressure\n• FX headwinds reduce margins' },
  ] },
  // Unit economics (from cs-unit-economics blueprint)
  { type: 'cards', bg: 'light', badge: 'Unit Economics', title: 'Customer Economics', cards: [
    { title: '$12', titleColor: '#F26629', body: 'Customer Acquisition Cost\nDown from $18 in Q2. Organic now 62% of new signups. Payback period: 2.1 months.' },
    { title: '$847', titleColor: '#6060BF', body: 'Lifetime Value (3-year)\nBased on avg. 4.2 transfers/month at $1.68 revenue per transfer. 78% retention at 60 days.' },
    { title: '70.6x', titleColor: '#35605F', body: 'LTV:CAC Ratio\nWell above the 3x benchmark. Driven by high retention and low acquisition cost.' },
  ] },
  // Next steps / action items (from pd-next-steps blueprint)
  { type: 'cards', bg: 'dark', badge: 'Next Steps', title: 'Action Items', cards: [
    { title: 'Finalize Guatemala Pricing', titleColor: '#2BF2F1', body: 'Owner: Product · Deadline: Feb 15\nDependencies: FX partner contract signed' },
    { title: 'Ship Recurring Transfers', titleColor: '#60D06F', body: 'Owner: Engineering · Deadline: Feb 28\nDependencies: Compliance review complete' },
    { title: 'Hire Sr. Designer', titleColor: '#FFCD9C', body: 'Owner: Design Lead · Deadline: Mar 15\nDependencies: JD approved, recruiter sourcing' },
  ] },
  // Team introduction (from pd-team blueprint)
  { type: 'cards', bg: 'dark', badge: 'The Team', title: 'Meet the Leadership', cards: [
    { title: 'Kyle C.', titleColor: '#2BF2F1', body: 'Head of Design — Leading design system, brand, and product experience across all platforms.' },
    { title: 'Maria R.', titleColor: '#60D06F', body: 'VP Engineering — Scaling infrastructure and building the platform team from 8 to 20.' },
    { title: 'Carlos M.', titleColor: '#F19D38', body: 'Head of Product — Owns corridor expansion strategy and user growth metrics.' },
    { title: 'Ana L.', titleColor: '#6060BF', body: 'Head of Operations — Managing compliance, partnerships, and payout network across 7 countries.' },
  ] },
  // Org structure (from hr-org-chart blueprint)
  { type: 'cards', bg: 'light', badge: 'Organization', title: 'Team Structure', cards: [
    { title: 'Product & Design', titleColor: '#6060BF', body: 'Kyle C., VP · ~12 people\nProduct Management, UX Research, Product Design, Design Systems' },
    { title: 'Engineering', titleColor: '#F26629', body: 'Maria R., VP · ~20 people\nPlatform, Mobile, Web, Data Engineering, DevOps' },
    { title: 'Operations', titleColor: '#35605F', body: 'Ana L., Director · ~8 people\nCompliance, Partnerships, Support, Treasury' },
    { title: 'Growth', titleColor: '#7BA882', body: 'Carlos M., Director · ~6 people\nMarketing, Analytics, Community, Content' },
  ] },
  // Benefits summary (from hr-benefits blueprint)
  { type: 'cards', bg: 'light', badge: 'Benefits', title: 'Total Rewards', cards: [
    { title: 'Health', titleColor: '#6060BF', body: '100% premium coverage for employee + dependents. Dental, vision, and mental health included.' },
    { title: 'Equity', titleColor: '#35605F', body: 'Meaningful equity package with 4-year vesting. Quarterly refresh grants for top performers.' },
    { title: 'Time Off', titleColor: '#F26629', body: 'Unlimited PTO with 15-day minimum. 16 weeks parental leave. Sabbatical at 5 years.' },
    { title: 'Growth', titleColor: '#7BA882', body: '$5K annual learning budget. Conference attendance. Internal mentorship program.' },
  ] },
  // Three horizons (from cs-three-horizons blueprint)
  { type: 'cards', bg: 'dark', badge: 'Horizons', title: 'Strategic Horizons', cards: [
    { title: 'Horizon 1: Core', titleColor: '#2BF2F1', body: '70% of resources. Optimize existing US→LatAm corridors. Grow volume 40% YoY. Improve unit economics.' },
    { title: 'Horizon 2: Adjacent', titleColor: '#60D06F', body: '20% of resources. Business/SMB transfers. Savings product. New corridors in South America. Timeline: 12-18 months.' },
    { title: 'Horizon 3: Transformational', titleColor: '#F19D38', body: '10% of resources. Embedded finance SDK. Crypto on-ramp. Cross-border lending. 3-5 year investment horizon.' },
  ] },
  // Multi-screen flow (from df-multi-flow blueprint)
  { type: 'cards', bg: 'dark', badge: 'User Flow', title: 'Send Money in 3 Steps', cards: [
    { title: '1. Enter Amount', titleColor: '#2BF2F1', body: 'Type the amount in USD. See the exact amount recipient gets in their currency. No hidden fees shown.' },
    { title: '2. Choose Recipient', titleColor: '#60D06F', body: 'Select from saved contacts or add new. Recipient gets SMS notification that money is on the way.' },
    { title: '3. Confirm & Send', titleColor: '#F19D38', body: 'Review details. Authenticate with Face ID. Money arrives in minutes. Both parties get confirmation.' },
  ] },

  // Segment comparison (from dv-comparison-table blueprint)
  { type: 'two-column', bg: 'dark', badge: 'Comparison', title: 'Segment Performance', columns: [
    { heading: 'Power Senders (4+ /mo)', body: '**Revenue/user:** $7.12\n**Avg transfer:** $342\n**NPS:** 74\n**Retention (90d):** 92%\n**Support tickets:** 0.3/mo\n\n38% of users · 61% of revenue' },
    { heading: 'Casual Senders (1-2 /mo)', body: '**Revenue/user:** $2.84\n**Avg transfer:** $215\n**NPS:** 58\n**Retention (90d):** 64%\n**Support tickets:** 1.1/mo\n\n62% of users · 39% of revenue' },
  ] },
  // Dashboard 4-panel (from dv-dashboard blueprint)
  { type: 'cards', bg: 'dark', badge: 'Dashboard', title: 'Weekly Pulse — Mar 10', cards: [
    { title: '2.4M', titleColor: '#2BF2F1', body: 'Transfers this week\n↑ 8.2% vs last week · On track for monthly record' },
    { title: '$18.6M', titleColor: '#60D06F', body: 'Volume processed\n↑ 12% WoW · Mexico corridor drives 42%' },
    { title: '99.7%', titleColor: '#F19D38', body: 'Uptime SLA\n1 incident (P3) · MTTR 14 min · No customer impact' },
    { title: '4.8★', titleColor: '#6060BF', body: 'App Store rating\n+0.1 this month · 2,340 new reviews' },
  ] },
  // Headcount dashboard (from hr-headcount blueprint)
  { type: 'two-column', bg: 'light', badge: 'Headcount', title: 'Team Growth — Q1 2026', columns: [
    { heading: 'Current State', body: '**Total headcount:** 46\n**New hires (Q1):** 8\n**Attrition:** 2 (4.3%)\n**Open roles:** 6\n\nEngineering: 20 · Product: 12 · Ops: 8 · Growth: 6' },
    { heading: 'Hiring Plan', bullets: [
      { text: '**Sr. Backend Engineer** — Interviewing (3 candidates)' },
      { text: '**Product Designer** — Offer extended' },
      { text: '**Compliance Analyst** — Sourcing' },
      { text: '**Data Engineer** — Req approved, JD drafting' },
      { text: '**Support Lead (Guatemala)** — On hold pending launch' },
      { text: '**Growth Marketing Manager** — Screening' },
    ] },
  ] },
  // Recruiting pipeline (from hr-recruiting-pipeline blueprint)
  { type: 'cards', bg: 'light', badge: 'Recruiting', title: 'Hiring Pipeline — March', cards: [
    { title: '142', titleColor: '#6060BF', body: 'Applications received\nUp 34% after LinkedIn campaign. 68% from referrals or inbound.' },
    { title: '28', titleColor: '#35605F', body: 'Phone screens completed\n20% pass rate to onsite. Avg time-to-screen: 3.2 days.' },
    { title: '8', titleColor: '#F26629', body: 'Onsite interviews\n6 engineering, 2 design. 75% positive panel rating.' },
    { title: '3', titleColor: '#7BA882', body: 'Offers extended\n2 accepted, 1 pending. Avg time-to-offer: 18 days.' },
  ] },
  // Engagement survey (from hr-engagement blueprint)
  { type: 'two-column', bg: 'dark', badge: 'Engagement', title: 'Employee Pulse Survey — Q1', columns: [
    { heading: 'Scores (out of 5)', body: '**Overall satisfaction:** 4.2 (↑ 0.3)\n**Manager effectiveness:** 4.5\n**Career growth:** 3.8 (lowest)\n**Work-life balance:** 4.1\n**Mission alignment:** 4.7 (highest)\n**Participation rate:** 91%' },
    { heading: 'Action Items', bullets: [
      { text: 'Launch mentorship program to address career growth gap' },
      { text: 'Quarterly skip-level 1:1s for every IC' },
      { text: 'Publish promotion criteria and timeline transparency' },
      { text: 'Add $2K annual conference budget per person' },
    ] },
  ] },
  // DEI dashboard (from hr-dei blueprint)
  { type: 'cards', bg: 'light', badge: 'DEI', title: 'Diversity & Inclusion — 2026', cards: [
    { title: '52%', titleColor: '#6060BF', body: 'Women in workforce\nUp from 44% in 2024. Parity achieved in product & design.' },
    { title: '38%', titleColor: '#35605F', body: 'Underrepresented minorities\nIncluding leadership: 28%. Target: 35% by EOY.' },
    { title: '4.4', titleColor: '#F26629', body: 'Belonging score (out of 5)\nHighest in company history. ERG participation at 62%.' },
    { title: '12', titleColor: '#7BA882', body: 'Countries represented\nMost diverse team in fintech remittances. 8 languages spoken.' },
  ] },
  // Single screen + context (from df-single-screen blueprint)
  { type: 'content', bg: 'dark', badge: 'Screen Design', title: 'Send Flow — Amount Entry', body: 'The amount entry screen anchors the entire send experience. Users see real-time FX conversion as they type, with the recipient amount updating live.\n\n**Key decisions:**\n• USD input with MXN output (not reversible — tested)\n• 30-second rate lock with visible countdown\n• Fee disclosure inline, not in a modal', imageUrl: '/illustrations/Hand - Cell Phone OK.svg' },
  // A/B test UI (from df-ab-test-ui blueprint)
  { type: 'two-column', bg: 'light', badge: 'A/B Test', title: 'Confirmation Screen Redesign', columns: [
    { heading: 'Variant A — Current', body: 'Single-page summary with all details visible. Green "Confirm" button at bottom.\n\n**Completion rate:** 78%\n**Avg time on screen:** 12s\n**Error rate:** 2.1%' },
    { heading: 'Variant B — Proposed', body: 'Two-step: review → biometric confirm. Animated success state.\n\n**Completion rate:** 86%\n**Avg time on screen:** 8s\n**Error rate:** 0.8%\n\n**Winner: Variant B** (+10.3% lift)' },
  ] },
  // Error states (from df-error-states blueprint)
  { type: 'cards', bg: 'dark', badge: 'Error States', title: 'Edge Case Handling', cards: [
    { title: 'Network Failure', titleColor: '#F26629', body: 'Retry with exponential backoff. Show offline banner with cached rate. Queue transfer for auto-send on reconnect.' },
    { title: 'KYC Rejection', titleColor: '#F19D38', body: 'Clear explanation of why. One-tap to re-upload documents. Live chat escalation for edge cases.' },
    { title: 'Rate Expiry', titleColor: '#2BF2F1', body: 'Gentle prompt to refresh rate. Show old vs new rate delta. One-tap to accept new rate and continue.' },
  ] },

  // ═══════════════════════════════════════════
  //  QUOTE VARIATIONS
  // ═══════════════════════════════════════════
  { type: 'section', bg: 'light', badge: '07', title: 'Quote Slides' },

  // With attribution
  { type: 'quote', bg: 'dark', title: 'Inspiration', quote: { text: 'Design is not just what it looks like and feels like. Design is how it works.', attribution: 'Steve Jobs' } },
  // Without attribution (user voice)
  { type: 'quote', bg: 'light', title: 'User Voice', quote: { text: 'I used to spend my whole Saturday morning waiting at Western Union. Now I send money while my coffee brews.' } },
  // Investment thesis (from cs-investment-thesis blueprint)
  { type: 'quote', bg: 'dark', badge: 'Thesis', title: 'Investment Thesis', quote: { text: 'Félix will capture 5% of the US→LatAm digital remittance market by 2028, generating $120M in annual revenue with 45% gross margins — driven by the lowest unit economics in the industry.', attribution: 'Series B Memo, 2026' } },

  // ═══════════════════════════════════════════
  //  IMAGE VARIATIONS
  // ═══════════════════════════════════════════
  { type: 'section', bg: 'dark', badge: '08', title: 'Image Slides' },

  // With caption
  { type: 'image', bg: 'dark', title: 'Dashboard View', imageUrl: '/illustrations/Laptop Dark.svg', imageCaption: 'Real-time transfer tracking across all corridors.' },
  // Without caption
  { type: 'image', bg: 'light', title: 'Global Reach', imageUrl: '/illustrations/Map + F symbol.svg' },

  // ═══════════════════════════════════════════
  //  CHECKLIST VARIATIONS
  // ═══════════════════════════════════════════
  { type: 'section', bg: 'light', badge: '09', title: 'Checklist Slides' },

  // Mixed (checked + pending)
  { type: 'checklist', bg: 'dark', title: 'Launch Checklist', bullets: [
    { text: 'KYC verification complete', icon: 'check' },
    { text: 'Bank account linked', icon: 'check' },
    { text: 'First transfer sent', icon: 'check' },
    { text: 'Referral bonus earned', icon: 'pending' },
    { text: 'Premium tier unlocked', icon: 'pending' },
  ] },
  // All checked
  { type: 'checklist', bg: 'light', title: 'Sprint Review — All Done', bullets: [
    { text: 'Recurring transfers shipped', icon: 'check' },
    { text: 'Rate alert notifications live', icon: 'check' },
    { text: 'Accessibility audit passed', icon: 'check' },
    { text: 'Performance benchmarks met', icon: 'check' },
  ] },
  // All pending
  { type: 'checklist', bg: 'dark', title: 'Upcoming — Q2 Backlog', bullets: [
    { text: 'Ecuador corridor launch', icon: 'pending' },
    { text: 'WhatsApp bot v2', icon: 'pending' },
    { text: 'Biometric authentication', icon: 'pending' },
    { text: 'Business API beta', icon: 'pending' },
  ] },

  // ═══════════════════════════════════════════
  //  CHART VARIATIONS (all 9 types)
  // ═══════════════════════════════════════════
  { type: 'section', bg: 'dark', badge: '10', title: 'Chart Slides', subtitle: '20 chart types' },

  // Bar
  { type: 'chart', bg: 'dark', badge: 'Bar', title: 'Monthly Transfer Volume', chart: { chartType: 'bar', data: [
    { month: 'Jan', transfers: 12400 }, { month: 'Feb', transfers: 15800 }, { month: 'Mar', transfers: 18200 },
    { month: 'Apr', transfers: 22100 }, { month: 'May', transfers: 28500 }, { month: 'Jun', transfers: 34200 },
  ], xKey: 'month', yKeys: ['transfers'], yLabel: 'Transfers' } },
  // Horizontal bar (funnel — from dv-funnel blueprint)
  { type: 'chart', bg: 'dark', badge: 'Funnel', title: 'Conversion Drops 64% at Activation', chart: { chartType: 'horizontal-bar', data: [
    { stage: 'Visited', count: 100000 }, { stage: 'Signed Up', count: 42000 }, { stage: 'Verified', count: 28000 },
    { stage: 'First Send', count: 18000 }, { stage: 'Repeat User', count: 12600 },
  ], xKey: 'stage', yKeys: ['count'], yLabel: 'Users' } },
  // Stacked bar
  { type: 'chart', bg: 'light', badge: 'Stacked', title: 'Mobile Now Drives 84% of Volume', chart: { chartType: 'stacked-bar', data: [
    { quarter: 'Q1', mobile: 65, web: 25, agent: 10 }, { quarter: 'Q2', mobile: 72, web: 20, agent: 8 },
    { quarter: 'Q3', mobile: 78, web: 17, agent: 5 }, { quarter: 'Q4', mobile: 84, web: 13, agent: 3 },
  ], xKey: 'quarter', yKeys: ['mobile', 'web', 'agent'], yLabel: 'Channel Mix (%)' } },
  // Line
  { type: 'chart', bg: 'light', badge: 'Trend', title: 'NPS Climbed 26 Points in 8 Weeks', chart: { chartType: 'line', data: [
    { week: 'W1', nps: 42 }, { week: 'W2', nps: 45 }, { week: 'W3', nps: 48 }, { week: 'W4', nps: 52 },
    { week: 'W5', nps: 58 }, { week: 'W6', nps: 61 }, { week: 'W7', nps: 64 }, { week: 'W8', nps: 68 },
  ], xKey: 'week', yKeys: ['nps'], yLabel: 'NPS' } },
  // Multi-line
  { type: 'chart', bg: 'dark', badge: 'Comparison', title: 'Félix Fees Now Half the Competition', chart: { chartType: 'multi-line', data: [
    { month: 'Jan', felix: 4.2, competitor_a: 6.8, competitor_b: 8.5 },
    { month: 'Feb', felix: 3.9, competitor_a: 6.5, competitor_b: 8.2 },
    { month: 'Mar', felix: 3.5, competitor_a: 6.3, competitor_b: 7.9 },
    { month: 'Apr', felix: 3.1, competitor_a: 6.0, competitor_b: 7.5 },
    { month: 'May', felix: 2.8, competitor_a: 5.8, competitor_b: 7.2 },
    { month: 'Jun', felix: 2.5, competitor_a: 5.5, competitor_b: 6.9 },
  ], xKey: 'month', yKeys: ['felix', 'competitor_a', 'competitor_b'], yLabel: 'Fee %' } },
  // Area
  { type: 'chart', bg: 'light', badge: 'Growth', title: 'MAU Grew 2.3x in 6 Months', chart: { chartType: 'area', data: [
    { month: 'Jul', users: 125000 }, { month: 'Aug', users: 148000 }, { month: 'Sep', users: 172000 },
    { month: 'Oct', users: 201000 }, { month: 'Nov', users: 238000 }, { month: 'Dec', users: 285000 },
  ], xKey: 'month', yKeys: ['users'], yLabel: 'MAU' } },
  // Donut
  { type: 'chart', bg: 'dark', badge: 'Distribution', title: 'Bank Transfer is the Preferred Payout', chart: { chartType: 'donut', data: [
    { segment: 'Bank Transfer', value: 45 }, { segment: 'Cash Pickup', value: 25 },
    { segment: 'Mobile Wallet', value: 20 }, { segment: 'Home Delivery', value: 10 },
  ], xKey: 'segment', yKeys: ['value'] } },
  // Scatter
  { type: 'chart', bg: 'light', badge: 'Correlation', title: 'Faster Transfers = Higher Satisfaction', chart: { chartType: 'scatter', data: [
    { speed: 2, satisfaction: 92 }, { speed: 5, satisfaction: 85 }, { speed: 15, satisfaction: 72 },
    { speed: 30, satisfaction: 58 }, { speed: 60, satisfaction: 45 }, { speed: 8, satisfaction: 78 },
    { speed: 3, satisfaction: 88 }, { speed: 120, satisfaction: 32 },
  ], xKey: 'speed', yKeys: ['satisfaction'], xLabel: 'Transfer Time (min)', yLabel: 'Satisfaction %' } },
  // Radar
  { type: 'chart', bg: 'dark', badge: 'Scorecard', title: 'Platform Capabilities', chart: { chartType: 'radar', data: [
    { metric: 'Speed', score: 95 }, { metric: 'Cost', score: 88 }, { metric: 'UX', score: 92 },
    { metric: 'Coverage', score: 75 }, { metric: 'Support', score: 82 }, { metric: 'Trust', score: 90 },
  ], xKey: 'metric', yKeys: ['score'] } },

  // Waterfall
  { type: 'chart', bg: 'dark', badge: 'Waterfall', title: 'Revenue Bridge — Q3 to Q4', chart: { chartType: 'waterfall', data: [
    { item: 'Q3 Revenue', amount: 5200 },
    { item: 'New Users', amount: 1800 },
    { item: 'Upsells', amount: 600 },
    { item: 'Churn', amount: -1200 },
    { item: 'FX Loss', amount: -300 },
    { item: 'Q4 Revenue', amount: 0, total: true },
  ], xKey: 'item', yKeys: ['amount'] } },

  // Funnel
  { type: 'chart', bg: 'dark', badge: 'Funnel', title: 'Onboarding Drop-off Analysis', chart: { chartType: 'funnel', data: [
    { step: 'App Download', users: 50000 },
    { step: 'Account Created', users: 32000 },
    { step: 'ID Verified', users: 21000 },
    { step: 'Bank Linked', users: 14500 },
    { step: 'First Transfer', users: 9800 },
  ], xKey: 'step', yKeys: ['users'] } },

  // Gauge
  { type: 'chart', bg: 'dark', badge: 'Gauge', title: 'NPS Score — Q4 2025', chart: { chartType: 'gauge', data: [
    { metric: 'NPS', score: 68 },
  ], xKey: 'metric', yKeys: ['score'], max: 100, yLabel: 'Net Promoter Score' } },

  // Heatmap
  { type: 'chart', bg: 'dark', badge: 'Heatmap', title: 'Transfer Volume by Day & Hour', chart: { chartType: 'heatmap', data: [
    { day: 'Mon', volume: [12, 8, 5, 3, 2, 4, 15, 32, 45, 38, 30, 28, 35, 40, 42, 38, 30, 25, 20, 18, 15, 12, 10, 8] },
    { day: 'Tue', volume: [10, 7, 4, 3, 2, 5, 14, 30, 42, 35, 28, 25, 32, 38, 40, 35, 28, 22, 18, 15, 12, 10, 8, 6] },
    { day: 'Wed', volume: [11, 8, 5, 3, 2, 4, 16, 34, 48, 40, 32, 30, 38, 42, 44, 40, 32, 28, 22, 20, 16, 14, 11, 9] },
    { day: 'Thu', volume: [10, 7, 4, 2, 2, 5, 15, 31, 44, 36, 29, 26, 33, 39, 41, 36, 29, 23, 19, 16, 13, 11, 9, 7] },
    { day: 'Fri', volume: [14, 10, 6, 4, 3, 6, 18, 38, 52, 48, 40, 36, 42, 50, 55, 48, 38, 32, 26, 22, 18, 15, 12, 10] },
    { day: 'Sat', volume: [8, 5, 3, 2, 2, 3, 8, 18, 28, 32, 35, 38, 40, 42, 38, 32, 25, 20, 15, 12, 10, 8, 6, 5] },
    { day: 'Sun', volume: [6, 4, 3, 2, 1, 2, 6, 12, 20, 25, 30, 34, 38, 40, 36, 30, 22, 18, 14, 10, 8, 6, 5, 4] },
  ], xKey: 'day', yKeys: ['volume'], columns: ['12a','','','3a','','','6a','','','9a','','','12p','','','3p','','','6p','','','9p','','',''] } },

  // Treemap
  { type: 'chart', bg: 'dark', badge: 'Treemap', title: 'Revenue by Corridor', chart: { chartType: 'treemap', data: [
    { corridor: 'US → Mexico', share: 42 },
    { corridor: 'US → Guatemala', share: 18 },
    { corridor: 'US → Honduras', share: 14 },
    { corridor: 'US → El Salvador', share: 10 },
    { corridor: 'US → Colombia', share: 8 },
    { corridor: 'US → Dominican Rep.', share: 5 },
    { corridor: 'Other', share: 3 },
  ], xKey: 'corridor', yKeys: ['share'] } },

  // Bubble
  { type: 'chart', bg: 'light', badge: 'Bubble', title: 'Corridor Analysis — Volume vs Growth', chart: { chartType: 'bubble', data: [
    { corridor: 'Mexico', volume: 180, growth: 25, size: 4200 },
    { corridor: 'Guatemala', volume: 45, growth: 85, size: 1800 },
    { corridor: 'Honduras', volume: 32, growth: 120, size: 1400 },
    { corridor: 'El Salvador', volume: 28, growth: 45, size: 1000 },
    { corridor: 'Colombia', volume: 15, growth: 200, size: 800 },
  ], xKey: 'volume', yKeys: ['growth'], zKey: 'size', xLabel: 'Monthly Volume ($M)', yLabel: 'YoY Growth %' } },

  // Combo (bar + line)
  { type: 'chart', bg: 'dark', badge: 'Combo', title: 'Revenue & Margin Trend', chart: { chartType: 'combo', data: [
    { quarter: 'Q1', revenue: 1200, margin: 28 },
    { quarter: 'Q2', revenue: 1850, margin: 32 },
    { quarter: 'Q3', revenue: 2400, margin: 35 },
    { quarter: 'Q4', revenue: 3400, margin: 38 },
  ], xKey: 'quarter', yKeys: ['revenue', 'margin'], lineKeys: ['margin'] } },

  // Histogram
  { type: 'chart', bg: 'light', badge: 'Histogram', title: 'Transfer Amount Distribution', chart: { chartType: 'histogram', data: [
    { range: '$0-50', count: 2400 },
    { range: '$50-100', count: 4800 },
    { range: '$100-200', count: 8200 },
    { range: '$200-300', count: 12500 },
    { range: '$300-500', count: 9800 },
    { range: '$500-1K', count: 5200 },
    { range: '$1K+', count: 1800 },
  ], xKey: 'range', yKeys: ['count'] } },

  // Candlestick
  { type: 'chart', bg: 'dark', badge: 'Candlestick', title: 'MXN/USD Exchange Rate — Weekly', chart: { chartType: 'candlestick', data: [
    { week: 'W1', open: 17.2, close: 17.5, high: 17.8, low: 17.0 },
    { week: 'W2', open: 17.5, close: 17.3, high: 17.7, low: 17.1 },
    { week: 'W3', open: 17.3, close: 17.8, high: 18.0, low: 17.2 },
    { week: 'W4', open: 17.8, close: 17.6, high: 18.1, low: 17.4 },
    { week: 'W5', open: 17.6, close: 18.0, high: 18.3, low: 17.5 },
    { week: 'W6', open: 18.0, close: 17.7, high: 18.2, low: 17.4 },
    { week: 'W7', open: 17.7, close: 18.2, high: 18.5, low: 17.6 },
    { week: 'W8', open: 18.2, close: 18.4, high: 18.6, low: 18.0 },
  ], xKey: 'week', yKeys: ['close'] } },

  // Pictorial
  { type: 'chart', bg: 'dark', badge: 'Pictorial', title: 'Payout Preference by Country', chart: { chartType: 'pictorial', data: [
    { country: 'Mexico', bankPct: 72 },
    { country: 'Guatemala', bankPct: 45 },
    { country: 'Honduras', bankPct: 38 },
    { country: 'El Salvador', bankPct: 55 },
    { country: 'Colombia', bankPct: 68 },
  ], xKey: 'country', yKeys: ['bankPct'] } },

  // Gantt
  { type: 'chart', bg: 'dark', badge: 'Gantt', title: 'H1 2026 Project Timeline', chart: { chartType: 'gantt', data: [
    { task: 'Guatemala Launch', start: 1, end: 4, label: 'Jan–Apr' },
    { task: 'Recurring Transfers', start: 1, end: 3, label: 'Jan–Mar' },
    { task: 'Honduras Launch', start: 3, end: 6, label: 'Mar–Jun' },
    { task: 'Business API', start: 2, end: 5, label: 'Feb–May' },
    { task: 'Referral v2', start: 4, end: 6, label: 'Apr–Jun' },
    { task: 'SOC 2 Audit', start: 1, end: 6, label: 'Jan–Jun' },
  ], xKey: 'task', yKeys: ['start'] } },

  // ═══════════════════════════════════════════
  //  CLOSING VARIATIONS
  // ═══════════════════════════════════════════
  { type: 'section', bg: 'light', badge: '11', title: 'Closing Slides' },

  // With subtitle
  { type: 'closing', bg: 'dark', title: 'Thank You', subtitle: 'felixpago.com | @felixpago | team@felixpago.com' },
  // Without subtitle
  { type: 'closing', bg: 'brand', title: 'Let\'s Build' },
]

export default function DemoPage() {
  return (
    <SlideRenderer
      slides={DEMO_SLIDES}
      title="Template Demo"
      deckId="demo"
      isFullScreen
    />
  )
}
