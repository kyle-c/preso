/**
 * One-time script: copy the /jose onboarding deck into kyle.cooney@felixpago.com's studio account.
 *
 * Run: npx tsx scripts/copy-jose-deck.ts
 */

import { getUserByEmail, createPresentation } from '../lib/studio-db'

const slides = [
  {
    type: 'title',
    bg: 'light' as const,
    badge: 'Welcome to Félix',
    title: 'Bienvenido, José!',
    subtitle: 'Senior UX Researcher · Starting March 2026',
    imageUrl: '/illustrations/Party%20Popper.svg',
    notes: 'Warm, personalized welcome. Light background with Party Popper illustration creates an inviting, celebratory opening. Background illustrations include Hand with Stars, Magnifying Glass, Speech Bubbles, and Survey — all thematically tied to the research role.',
  },
  {
    type: 'two-column',
    bg: 'light' as const,
    badge: 'About Félix',
    title: 'Who We Are',
    columns: [
      {
        heading: 'Our Mission',
        body: 'Félix is the companion for Latinos in the US — helping them access financial services throughout their journey as immigrants.',
        bullets: [
          { text: '**To empower Latinos in the US** to care for what matters most back home.' },
        ],
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
    imageUrl: '/illustrations/F%C3%A9lix%20Illo%201.svg',
    notes: 'Company introduction with mission and products. The Félix mascot illustration anchors the brand identity. Two-column layout keeps it scannable.',
  },
  {
    type: 'cards',
    bg: 'light' as const,
    title: 'Our Values',
    cards: [
      {
        title: 'User-Obsession',
        titleColor: '#082422',
        body: 'We have to earn the right to serve our users every day and never take it for granted. We always remember the hard work our users went through to send this money. We are always here for them.',
      },
      {
        title: 'Getting Sh*t Done With Urgency',
        titleColor: '#2BF2F1',
        body: 'We have a bias towards action. Champions adjust! We care less about what others are doing and focus on what we want to accomplish.',
      },
      {
        title: 'Extreme Ownership',
        titleColor: '#35605F',
        body: 'Each person in the company owns a mission-critical piece of the vision. No weak links. No passengers.',
      },
      {
        title: 'No-Ego Collaboration',
        titleColor: '#877867',
        body: 'We disagree clearly, and we commit once a decision is made. We break silos, we move in lockstep. We are a team, not a group of individuals.',
      },
      {
        title: 'Aim For Insanely Great',
        titleColor: '#2BF2F1',
        body: 'We elevate the quality of our output by caring deeply. We obsess about every customer moment.',
      },
      {
        title: 'Insatiable Curiosity',
        titleColor: '#082422',
        body: 'We listen closely to our users and base our assumptions in data. We test assumptions and never take anything for granted. We experiment relentlessly.',
      },
    ],
    notes: 'Six core values with detailed descriptions. These are company canon — each card uses an interactive fan layout in the original presentation. Illustrations include Paper Airplane, Cloud Coin, Dollar Bills, and Rocket Launch as floating background elements.',
  },
  {
    type: 'two-column',
    bg: 'dark' as const,
    badge: 'Your Role',
    title: 'Our First UX Researcher',
    columns: [
      {
        heading: '',
        body: "You're not joining a research team — you're building one. This is a founding role with the autonomy and responsibility to establish how Félix understands its users.",
      },
      {
        heading: "What you'll own",
        bullets: [
          { text: 'Define and build the UX Research function from the ground up', icon: '✓' },
          { text: 'Establish research frameworks, processes, and best practices', icon: '✓' },
          { text: 'Lead foundational and evaluative research across all product lines', icon: '✓' },
          { text: 'Create and own the company-wide insights repository', icon: '✓' },
          { text: 'Embed research into product development as a core discipline', icon: '✓' },
          { text: 'Make the case for growing the research team as the company scales', icon: '✓' },
        ],
      },
    ],
    imageUrl: '/illustrations/Survey.svg',
    notes: "Role definition slide. Left column is the narrative 'why this role matters'. Right column is the concrete list of responsibilities. Dark background creates gravitas for the importance of this founding role.",
  },
  {
    type: 'cards',
    bg: 'light' as const,
    badge: 'Your People',
    title: 'Meet the Design Team',
    cards: [
      {
        title: 'Kyle Cooney',
        titleColor: '#2BF2F1',
        body: 'Head of Product Design — Your direct manager. Leading the design org and establishing how design and research work together at Félix.',
      },
      {
        title: 'Patricia Caballero',
        titleColor: '#6060BF',
        body: 'Product Designer — Core product design partner you\'ll collaborate with on research-informed design decisions.',
      },
      {
        title: 'Patricia Beltran',
        titleColor: '#60D06F',
        body: 'Product Designer — Another key design partner across product squads.',
      },
      {
        title: 'Jose Soto Marquez ⭐',
        titleColor: '#F19D38',
        body: "Senior UX Researcher — That's you! Welcome to the team.",
      },
    ],
    notes: "Team introduction. Jose's card is highlighted with a star emoji and a turquoise ring in the original presentation. Includes the 3 team members he'll work with most closely.",
  },
  {
    type: 'cards',
    bg: 'dark' as const,
    badge: 'Your Roadmap',
    title: 'First 90 Days',
    cards: [
      {
        title: 'Days 1–30: Immerse',
        titleColor: '#2BF2F1',
        body: '• Meet every PM, designer, and eng lead 1:1\n• Connect with Support team and Shadow Ninjas (CS)\n• Audit existing user data, support tickets, and analytics\n• Shadow customer calls and review past research (if any)\n• Assess current research skills across PMs and designers\n• Map knowledge gaps across product lines\n• Run a first evaluative study',
      },
      {
        title: 'Days 31–60: Build',
        titleColor: '#60D06F',
        body: '• Stand up the research ops stack (Dovetail, recruitment, templates)\n• Run your first foundational study\n• Publish the Félix persona framework\n• Create lightweight research toolkits for PMs and designers\n• Propose the research roadmap to leadership',
      },
      {
        title: 'Days 61–90: Scale',
        titleColor: '#F19D38',
        body: '• Launch a regular research cadence with product squads\n• Ship the company-wide insights repository\n• Train PMs and designers on basic usability testing and interviews\n• Present the case for growing the research team\n• Deliver your first quarterly research review',
      },
    ],
    notes: 'Three-phase 90-day plan with specific, actionable items per phase. Each phase has a one-word theme (Immerse, Build, Scale) and 5-7 concrete tasks. Uses Turquoise, Cactus, Mango for the three phases.',
  },
  {
    type: 'cards',
    bg: 'light' as const,
    badge: 'Getting Set Up',
    title: 'Your Toolkit',
    subtitle: 'Everything you need to hit the ground running',
    cards: [
      { title: 'Figma', titleColor: '#6060BF', body: 'Design files, prototypes, and the design system' },
      { title: 'Notion', titleColor: '#60D06F', body: 'Research repos, meeting notes, and documentation' },
      { title: 'Slack', titleColor: '#F19D38', body: 'Team communication and cross-functional channels' },
      { title: 'ClickUp', titleColor: '#F26629', body: 'Project tracking and sprint management' },
      { title: 'Google Suite', titleColor: '#7BA882', body: 'Docs, Sheets, Slides, Meet, and shared drives' },
      { title: 'Claude: Max Plan', titleColor: '#2BF2F1', body: 'AI assistant for research, synthesis, prototyping, and writing' },
      { title: 'Omni + Amplitude', titleColor: '#877867', body: 'Quantitative data, analytics, and user behavior' },
      { title: 'Research Stack', titleColor: '#35605F', body: "Your call — propose the tools that fit your workflow" },
    ],
    notes: '8 tool cards in a grid. Includes standard company tools plus one role-specific slot for the research stack. Each card has a category and one-line description.',
  },
  {
    type: 'two-column',
    bg: 'brand' as const,
    badge: "Who You'll Research",
    title: 'Our Users',
    columns: [
      {
        heading: '',
        body: "Latinos in the US caring for loved ones across borders. You'll define how we understand their lives — and build the practice that keeps us close to them.",
      },
      {
        heading: 'Who they are',
        bullets: [
          { text: '👩‍👧 **María, 34** — Houston → Guadalajara. Sends $200/month to her mom. Needs it fast and affordable.', icon: '👩‍👧' },
          { text: '👨‍💻 **Roberto, 28** — LA → San Salvador. Just started sending money home. Confused by fees and exchange rates.', icon: '👨‍💻' },
          { text: '👵 **Gloria, 52** — Chicago → Bogotá. Helps her whole family. Sends to 3 different people monthly.', icon: '👵' },
        ],
      },
    ],
    imageUrl: '/illustrations/Hands%20-%202%20Cell%20Phones%20-%20Juntos%20we%20Succeed.svg',
    notes: "Brand-colored slide introducing the users. Left column is the narrative framing for Jose's research mission. Right column has 3 user personas with emoji, name, age, corridor, and core need.",
  },
  {
    type: 'bullets',
    bg: 'light' as const,
    badge: 'Getting Started',
    title: 'Your First Week',
    subtitle: 'Day-by-day breakdown of your first five days',
    bullets: [
      { text: '**Monday** — HR orientation & benefits, laptop setup & tool access, lunch with Kyle (Head of Product Design)', icon: '📅' },
      { text: '**Tuesday** — Design team all-hands, product landscape deep-dive, review existing user data & analytics', icon: '📅' },
      { text: '**Wednesday** — 1:1 with each PM and squad lead, audit support tickets & NPS data, compliance training', icon: '📅' },
      { text: '**Thursday** — Meet the heads of product, evaluate research tooling options, draft initial knowledge-gap assessment', icon: '📅' },
      { text: '**Friday** — Shadow a customer support call, outline your 90-day plan draft, Week 1 retro with Kyle', icon: '📅' },
    ],
    notes: 'Day-by-day Week 1 schedule. Each day has 3 specific activities. Monday is always orientation. Friday always ends with a retro. The original slide features interactive checkboxes.',
  },
  {
    type: 'closing',
    bg: 'dark' as const,
    title: 'Build the foundation.',
    body: "You're going to shape how this company understands its users, José. We can't wait to see what you build.",
    subtitle: '#design-crew on Slack · Kyle Cooney (manager) · Notion: Research Hub',
    imageUrl: '/illustrations/Rocket%20Launch%20-%20Growth%20%2B%20Coin%20-%20Turquoise.svg',
    notes: 'Dark closing slide with rocket illustration. The original features a looping video of José. Includes key resources: Slack channel, manager name, and main knowledge base. The subtitle line serves as a quick-reference footer.',
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
    'Bienvenido, José!',
    'Onboarding presentation for José Soto Marquez, Senior UX Researcher joining the Design team in March 2026',
    slides,
    'anthropic',
    'claude-sonnet-4-20250514',
    {
      title: 'Bienvenido, José! — Onboarding',
      type: 'onboarding',
      summary: 'Onboarding presentation for José Soto Marquez, our first Senior UX Researcher. Covers company overview, values, role definition, team introductions, 90-day plan, toolkit, users, and first week schedule.',
      sections: [
        { title: 'Welcome', content: 'A warm welcome to José as he joins Félix Pago as our founding Senior UX Researcher in March 2026.', slideIndex: 0 },
        { title: 'Who We Are', content: 'Félix is the companion for Latinos in the US — empowering them to care for what matters most back home through remittances, mobile top-ups, credit building, and digital wallets.', slideIndex: 1 },
        { title: 'Our Values', content: 'Six core values define how we work: User-Obsession, Getting Sh*t Done With Urgency, Extreme Ownership, No-Ego Collaboration, Aim For Insanely Great, and Insatiable Curiosity.', slideIndex: 2 },
        { title: 'Your Role', content: "José is building the UX Research function from the ground up — a founding role with full autonomy to establish how Félix understands its users.", slideIndex: 3 },
        { title: 'The Team', content: 'The design team includes Kyle Cooney (Head of Product Design), Patricia Caballero and Patricia Beltran (Product Designers), and José himself.', slideIndex: 4 },
        { title: 'First 90 Days', content: 'Three phases: Immerse (days 1-30), Build (days 31-60), and Scale (days 61-90) with specific milestones for each phase.', slideIndex: 5 },
        { title: 'Your Toolkit', content: 'Tools include Figma, Notion, Slack, ClickUp, Google Suite, Claude, Omni + Amplitude, plus a research stack of his choosing.', slideIndex: 6 },
        { title: 'Our Users', content: 'Latinos in the US caring for loved ones across borders — represented by three personas: María, Roberto, and Gloria.', slideIndex: 7 },
        { title: 'First Week', content: 'Day-by-day breakdown from Monday orientation through Friday retro.', slideIndex: 8 },
        { title: 'Closing', content: "Build the foundation. You're going to shape how this company understands its users.", slideIndex: 9 },
      ],
    },
  )

  console.log(`Created presentation: ${pres.id}`)
  console.log(`Title: ${pres.title}`)
  console.log(`Slides: ${pres.slides.length}`)
  console.log(`Done! View at /create/${pres.id}`)
}

main().catch(console.error)
