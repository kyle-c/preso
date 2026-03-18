import { NextResponse } from 'next/server'
import { getServerSession } from '@/lib/studio-auth'
import { rateSlide } from '@/lib/studio-db'
import type { SlideData } from '@/components/studio/slide-renderer'

export const runtime = 'nodejs'

/**
 * POST /api/studio/ratings/seed
 * Seeds the jose onboarding deck and preso-sample team weekly deck
 * as gold-standard exemplar slides.
 */

// Jose deck slides — hand-crafted gold standard for onboarding
const JOSE_SLIDES: SlideData[] = [
  {
    type: 'title',
    bg: 'light',
    badge: 'Welcome to Félix',
    title: 'Bienvenido, José!',
    subtitle: 'We\'re so glad you\'re here. This deck is your launchpad — everything you need to hit the ground running as our founding Senior UX Researcher.',
    imageUrl: '/illustrations/Party%20Popper%20-%20Turquoise.svg',
  },
  {
    type: 'two-column',
    bg: 'light',
    badge: 'About Félix',
    title: 'Who We Are',
    columns: [
      {
        heading: 'Our Mission',
        body: 'Félix is the companion for Latinos in the US — helping them access financial services throughout their journey as immigrants. We exist because the financial system wasn\'t built for our users, and we\'re changing that.',
        bullets: [{ text: '**To empower Latinos in the US** to care for what matters most back home.', icon: '🟡' }],
      },
      {
        heading: 'What We Build',
        body: 'Products that meet our users where they are:',
        bullets: [
          { text: 'Remittances to Latin America', icon: '✓' },
          { text: 'Mobile top-ups & bill pay', icon: '✓' },
          { text: 'Credit building products', icon: '✓' },
          { text: 'Digital wallets & accounts', icon: '✓' },
        ],
      },
    ],
    imageUrl: '/illustrations/Luggage%20-%20Going%20to%20a%20New%20Place.svg',
  },
  {
    type: 'cards',
    bg: 'light',
    badge: 'What Drives Us',
    title: 'Our Values',
    subtitle: 'Six principles that guide every decision we make.',
    cards: [
      { title: 'Juntos We Succeed', titleColor: '#2BF2F1', body: 'We rise together. Collaboration isn\'t a value — it\'s how we operate. Your win is my win.' },
      { title: 'Empathy for Our Users', titleColor: '#6060BF', body: 'We don\'t assume. We listen, observe, and build from understanding. Research is our compass.' },
      { title: 'Bias for Action', titleColor: '#60D06F', body: 'Move fast, learn faster. Perfect is the enemy of shipped. We iterate in the open.' },
      { title: 'Think Like an Owner', titleColor: '#F19D38', body: 'Take responsibility for outcomes, not just tasks. See the whole picture.' },
      { title: 'Radical Candor', titleColor: '#F26629', body: 'Say what you mean, kindly and directly. Feedback is a gift we give each other.' },
      { title: 'Celebrate the Journey', titleColor: '#7BA882', body: 'The work is hard and the mission matters. Take time to acknowledge progress.' },
    ],
  },
  {
    type: 'two-column',
    bg: 'dark',
    badge: 'Your Role',
    title: 'Our First Senior UX Researcher',
    columns: [
      {
        body: 'You\'re not joining a research team — you\'re building one. This is a founding role with the autonomy and responsibility to establish how Félix understands its users. You\'ll define the methodologies, build the infrastructure, and create the culture of evidence-based decision-making across every product squad.',
      },
      {
        heading: 'What You\'ll Own',
        bullets: [
          { text: 'Build and lead the UX research practice from the ground up', icon: '✓' },
          { text: 'Design and execute generative and evaluative research across all product lines', icon: '✓' },
          { text: 'Establish the research operations stack — tools, templates, repositories, and rituals', icon: '✓' },
          { text: 'Partner directly with PMs, designers, and engineers to embed insights into every sprint', icon: '✓' },
          { text: 'Build and maintain the company-wide user insights repository', icon: '✓' },
          { text: 'Recruit, manage, and scale a world-class UX research team over time', icon: '✓' },
        ],
      },
    ],
    imageUrl: '/illustrations/Clipboard.svg',
  },
  {
    type: 'cards',
    bg: 'light',
    badge: 'The Team',
    title: 'Meet the Team',
    subtitle: 'Your immediate collaborators across design, product, and engineering.',
    cards: [
      { title: 'Kyle C.', titleColor: '#2BF2F1', body: 'VP of Design — Your direct manager and design org lead.' },
      { title: 'Rodrigo H.', titleColor: '#6060BF', body: 'Head of Growth — Leads acquisition, activation, and the growth product squad.' },
      { title: 'Lalo G.', titleColor: '#60D06F', body: 'Product Lead — Owns core remittance experience and product strategy.' },
      { title: 'Fernando B.', titleColor: '#F19D38', body: 'Engineering Lead — Platform architecture and technical direction.' },
    ],
  },
  {
    type: 'cards',
    bg: 'dark',
    badge: 'Your Roadmap',
    title: 'First 90 Days',
    cards: [
      { title: 'Days 1-30: Immerse', titleColor: '#2BF2F1', body: '• Meet every PM, designer, and eng lead 1:1\n• Audit existing user data, support tickets, and analytics\n• Shadow customer calls and review past research\n• Assess current research skills across PMs and designers\n• Map knowledge gaps across product lines\n• Run a first evaluative study' },
      { title: 'Days 31-60: Build', titleColor: '#60D06F', body: '• Stand up the research ops stack (Dovetail, recruitment, templates)\n• Run your first foundational study\n• Publish the Félix persona framework\n• Create lightweight research toolkits for PMs and designers\n• Propose the research roadmap to leadership' },
      { title: 'Days 61-90: Scale', titleColor: '#F19D38', body: '• Launch a regular research cadence with product squads\n• Ship the company-wide insights repository\n• Train PMs and designers on basic usability testing and interviews\n• Present the case for growing the research team\n• Deliver your first quarterly research review' },
    ],
  },
  {
    type: 'cards',
    bg: 'light',
    badge: 'Tools & Access',
    title: 'Your Toolkit',
    cards: [
      { title: 'Figma', titleColor: '#2BF2F1', body: 'Design files, prototypes, and the design system' },
      { title: 'Notion', titleColor: '#6060BF', body: 'Research repos, meeting notes, and documentation' },
      { title: 'Slack', titleColor: '#60D06F', body: 'Daily communication — #design, #research, #product channels' },
      { title: 'Dovetail', titleColor: '#F19D38', body: 'Research analysis, tagging, and insight repository' },
      { title: 'Mixpanel', titleColor: '#F26629', body: 'Product analytics, user flows, and engagement data' },
      { title: 'Linear', titleColor: '#7BA882', body: 'Sprint tracking, feature specs, and bug tracking' },
      { title: 'Loom', titleColor: '#DCFF00', body: 'Async video updates and research share-outs' },
      { title: 'Google Meet', titleColor: '#FFCD9C', body: 'User interviews, team syncs, and workshops' },
    ],
  },
  {
    type: 'two-column',
    bg: 'brand',
    badge: 'Who You\'ll Serve',
    title: 'Our Users',
    columns: [
      {
        body: 'Latinos in the US caring for loved ones across borders. You\'ll define how we understand their lives — their motivations, their anxieties, their moments of joy and frustration — and build the research practice that keeps us close to them.',
      },
      {
        heading: 'Who They Are',
        bullets: [
          { text: '**María, 34** — Houston → Guadalajara. Sends $200/month to her mom.', icon: '👩' },
          { text: '**Roberto, 28** — LA → San Salvador. Just started sending money home.', icon: '👨' },
          { text: '**Gloria, 52** — Chicago → Bogotá. Helps her whole family.', icon: '👵' },
        ],
      },
    ],
    imageUrl: '/illustrations/Hands%20-%202%20Cell%20Phones%20-%20Juntos%20we%20Succeed.svg',
  },
  {
    type: 'bullets',
    bg: 'light',
    badge: 'Week One',
    title: 'Your First Week',
    subtitle: 'A day-by-day guide to getting oriented.',
    bullets: [
      { text: '**Monday** — Laptop setup, tool access, Slack intros, 1:1 with Kyle', icon: '📅' },
      { text: '**Tuesday** — Product deep-dive with Lalo, design system walkthrough, analytics overview', icon: '📅' },
      { text: '**Wednesday** — Shadow 2 customer support calls, review last 3 months of user feedback', icon: '📅' },
      { text: '**Thursday** — 1:1s with Rodrigo and Fernando, audit existing research artifacts', icon: '📅' },
      { text: '**Friday** — Set up research workspace, draft first 30-day priorities, team lunch', icon: '📅' },
    ],
  },
  {
    type: 'closing',
    bg: 'dark',
    badge: 'Let\'s Build',
    title: 'Welcome to Félix, José.',
    subtitle: 'Figma · Notion · Slack · Dovetail · Mixpanel · Linear',
    body: 'You\'re here because we believe great products start with deep understanding of the people who use them. You\'re the person who will make that real at Félix. We can\'t wait to see what you uncover.',
    imageUrl: '/illustrations/Rocket%20Launch%20-%20Growth%20%2B%20Coin%20-%20Turquoise.svg',
  },
]

// Preso-sample deck — team weekly with content slides + chart showcases
const PRESO_SAMPLE_SLIDES: SlideData[] = [
  {
    type: 'two-column',
    bg: 'light',
    badge: 'Mission',
    title: 'Félix North Star',
    columns: [
      {
        body: 'Become the companion for Latinos in the United States enabling them to access financial services throughout their journey as immigrants.',
      },
      {
        heading: 'Key Principles',
        bullets: [
          { text: 'We are obsessed about our customers', icon: '✓' },
          { text: 'We get sh*t done with urgency and focus', icon: '✓' },
          { text: 'We collaborate without ego', icon: '✓' },
          { text: 'We practice extreme ownership', icon: '✓' },
          { text: 'We aim for insanely great', icon: '✓' },
          { text: 'We are insatiably curious', icon: '✓' },
        ],
      },
    ],
    imageUrl: '/illustrations/F%C3%A9lix%20Illo%201.svg',
  },
  {
    type: 'cards',
    bg: 'light',
    title: 'Our Values',
    subtitle: 'Six principles that guide every decision we make.',
    cards: [
      { title: 'User-Obsession', titleColor: '#082422', body: 'We have to earn the right to serve our users every day and never take it for granted. We always remember the hard work our users went through to send this money.' },
      { title: 'Getting Sh*t Done With Urgency', titleColor: '#2BF2F1', body: 'We have a bias towards action. Champions adjust! We care less about what others are doing and focus on what we want to accomplish.' },
      { title: 'Extreme Ownership', titleColor: '#35605F', body: 'Each person in the company owns a mission-critical piece of the vision. No weak links. No passengers.' },
      { title: 'No-Ego Collaboration', titleColor: '#877867', body: 'We disagree clearly, and we commit once a decision is made. We break silos, we move in lockstep.' },
      { title: 'Aim For Insanely Great', titleColor: '#2BF2F1', body: 'We elevate the quality of our output by caring deeply. We obsess about every customer moment.' },
      { title: 'Insatiable Curiosity', titleColor: '#082422', body: 'We listen closely to our users and base our assumptions in data. We test assumptions and never take anything for granted.' },
    ],
  },
  {
    type: 'cards',
    bg: 'light',
    title: 'Rules of the Land',
    cards: [
      { title: 'Share What Matters', titleColor: '#2BF2F1', body: 'Lead with metrics, impact, and insights tied to quarterly goals. Ask yourself: Does this show impact? Does it connect to what we\'re building?' },
      { title: 'Be Concise', titleColor: '#6060BF', body: '• State your time upfront — we\'ll hold you to it.\n• Cap slide decks at 4 slides max.\n• If it can be a one-liner, make it a one-liner.' },
      { title: 'Limit Demos', titleColor: '#60D06F', body: 'Have links ready and keep demos under 2 minutes. Respect everyone\'s time.' },
      { title: 'Use a Clear Structure', titleColor: '#F19D38', body: '• Objective: Goal of the initiative\n• Action: What was done\n• **Impact: Results or learnings**\n• Next Steps (If applicable)' },
    ],
  },
  {
    type: 'bullets',
    bg: 'light',
    badge: 'Today',
    title: 'Agenda',
    bullets: [
      { text: '**Icebreaker** — 3 min', icon: '1️⃣' },
      { text: '**FélixBook** — 10 min', icon: '2️⃣' },
      { text: '**Weekly Recap** — 5 min', icon: '3️⃣' },
      { text: '**Félix Weekly Updates** — 35-40 min', icon: '4️⃣' },
    ],
  },
  {
    type: 'cards',
    bg: 'light',
    badge: 'OKRs',
    title: 'Goals',
    subtitle: 'Current objectives and key results with progress tracking.',
    cards: [
      { title: 'Reduce chaos caused by the geese', titleColor: '#2BF2F1', body: '• Zero goose-related HR incidents (currently 14) — 12%\n• 85% of visitors not chased by a goose — 63%\n• Successfully relocate Gerald the alpha goose — 0%' },
      { title: 'Convince the capybaras to do literally anything', titleColor: '#60D06F', body: '• At least 1 capybara visibly awake during zoo hours — 47%' },
      { title: 'Urgent Animal Situations', titleColor: '#082422', body: '• Find out who taught the parrot to say "you\'re fired"\n• Stop the raccoons from unionizing' },
    ],
  },
  {
    type: 'two-column',
    bg: 'dark',
    badge: 'Product',
    title: 'Send Money in 60 Seconds',
    columns: [
      {
        body: 'A three-step flow that makes sending remittances fast and transparent: Select Recipient → Enter Amount → Confirm & Send.',
      },
      {
        heading: 'Key Metrics',
        bullets: [
          { text: 'Completion rate: 89%', icon: '✓' },
          { text: 'Average time: 47 seconds', icon: '✓' },
          { text: 'Drop-off reduced 34% vs previous flow', icon: '✓' },
        ],
      },
    ],
  },
  {
    type: 'cards',
    bg: 'dark',
    badge: 'People',
    title: 'Our Team',
    subtitle: 'Organizational structure across the company.',
    cards: [
      { title: 'CEO & Co-founder', titleColor: '#2BF2F1', body: 'Strategy, fundraising, and company vision.' },
      { title: 'Engineering', titleColor: '#60D06F', body: 'Platform, mobile, backend, and infrastructure.' },
      { title: 'Product & Design', titleColor: '#F19D38', body: 'Product management, UX research, and design systems.' },
      { title: 'Growth & Marketing', titleColor: '#F26629', body: 'Acquisition, activation, retention, and brand.' },
    ],
  },
  {
    type: 'chart',
    bg: 'dark',
    badge: 'Revenue',
    title: 'Quarterly Revenue Crossed $3.4M in Q4',
    body: 'Consistent quarter-over-quarter growth driven by remittance volume expansion and new product lines. Q4 saw a 22% jump from organic channel optimization.',
    chart: {
      chartType: 'bar',
      data: [
        { label: 'Q1', revenue: 1800000 },
        { label: 'Q2', revenue: 2200000 },
        { label: 'Q3', revenue: 2800000 },
        { label: 'Q4', revenue: 3400000 },
      ],
      xKey: 'label',
      yKeys: ['revenue'],
      colors: ['#2BF2F1'],
    },
  },
  {
    type: 'chart',
    bg: 'light',
    badge: 'Conversion',
    title: 'Activation Funnel Drops 64% Between Sign-Up and First Send',
    body: 'Biggest opportunity: reducing the KYC verification step could recover an estimated 12,000 monthly conversions.',
    chart: {
      chartType: 'horizontal-bar',
      data: [
        { label: 'Visited', value: 100000 },
        { label: 'Signed Up', value: 42000 },
        { label: 'KYC Verified', value: 18000 },
        { label: 'First Send', value: 15200 },
        { label: 'Repeat Send', value: 9800 },
      ],
      xKey: 'label',
      yKeys: ['value'],
      colors: ['#6060BF'],
    },
  },
  {
    type: 'chart',
    bg: 'dark',
    badge: 'Growth',
    title: 'Monthly Active Users Grew 142% Year-over-Year',
    body: 'Organic growth accelerated in H2 as referral loops and word-of-mouth compounded. Paid acquisition remained flat while organic surged.',
    chart: {
      chartType: 'line',
      data: [
        { label: 'Jan', users: 340000 },
        { label: 'Feb', users: 380000 },
        { label: 'Mar', users: 450000 },
        { label: 'Apr', users: 520000 },
        { label: 'May', users: 610000 },
        { label: 'Jun', users: 740000 },
        { label: 'Jul', users: 820000 },
      ],
      xKey: 'label',
      yKeys: ['users'],
      colors: ['#60D06F'],
    },
  },
  {
    type: 'chart',
    bg: 'light',
    badge: 'Segments',
    title: 'Remittances Drive 58% of Revenue but Credit Is Growing Fastest',
    body: 'Credit products grew 4.2x quarter-over-quarter — the fastest-growing segment. Diversification strategy is working.',
    chart: {
      chartType: 'donut',
      data: [
        { label: 'Remittances', value: 58 },
        { label: 'Top-ups', value: 18 },
        { label: 'Credit', value: 14 },
        { label: 'Wallets', value: 10 },
      ],
      xKey: 'label',
      yKeys: ['value'],
      colors: ['#2BF2F1', '#6060BF', '#60D06F', '#F19D38'],
    },
  },
]

export async function POST() {
  if (process.env.NODE_ENV === 'production' && process.env.ALLOW_SEED_ROUTES !== 'true') {
    return NextResponse.json({ error: 'Seed routes are disabled in production' }, { status: 403 })
  }

  try {
    const session = await getServerSession()
    if (!session) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    // Seed all jose slides as exemplars (rating: 1)
    const joseResults = await Promise.all(
      JOSE_SLIDES.map((slide, i) =>
        rateSlide(slide.type, slide.bg, 1, slide, 'jose', i)
      )
    )

    // Seed preso-sample slides as exemplars (rating: 1)
    const presoResults = await Promise.all(
      PRESO_SAMPLE_SLIDES.map((slide, i) =>
        rateSlide(slide.type, slide.bg, 1, slide, 'preso-sample', i)
      )
    )

    const allResults = [...joseResults, ...presoResults]

    return NextResponse.json({
      seeded: allResults.length,
      jose: joseResults.length,
      'preso-sample': presoResults.length,
      slides: allResults.map(r => ({ id: r.id, type: r.slideType, bg: r.bg })),
    })
  } catch (err) {
    console.error('[studio/ratings/seed POST]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
