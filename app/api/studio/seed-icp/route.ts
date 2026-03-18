import { NextRequest, NextResponse } from 'next/server'
import { getUserByEmail, createUser, createPresentation } from '@/lib/studio-db'
import { hash } from 'bcryptjs'

const ICP_SLIDES = [
  /* 1. Title */
  {
    type: 'title',
    bg: 'brand',
    badge: 'ICP — Investor Briefing',
    title: 'The System Wasn\'t Built for How He Actually Lives.',
    subtitle: 'Félix was designed around his reality — not against it.',
    imageUrl: '/illustrations/Hands%20-%202%20Cell%20Phones%20-%20Juntos%20we%20Succeed.svg',
  },
  /* 2. Meet Carlos */
  {
    type: 'two-column',
    bg: 'light',
    badge: 'Meet Carlos',
    title: 'He\'s Been Sending Money Home Every Week for Six Years.',
    columns: [
      {
        heading: 'The Story',
        body: 'Carlos. 34 years old. Houston. Construction worker from Guanajuato. Fridays are payday. Every Friday, **before anything else**, he sends money to his mom and his two kids.\n\nHe tried to open a credit card twice. Rejected both times. He found Félix when a coworker showed him during lunch. **Sent $100 to test it. It arrived. He hasn\'t stopped since.**',
      },
      {
        heading: 'Carlos at a Glance',
        bullets: [
          { text: 'Guanajuato → Houston. Construction crew of 8.', icon: '📍' },
          { text: '6 years sending money. Every Friday. No exceptions.', icon: '💸' },
          { text: 'Found Félix through a coworker. Peer trust, not an ad.', icon: '🤝' },
          { text: 'Rejected twice by the traditional banking system.', icon: '❌' },
        ],
      },
    ],
    imageUrl: '/illustrations/Paper%20Airplane%20%2B%20Coin%20-%20Turquoise.svg',
  },
  /* 3. Mental Model */
  {
    type: 'cards',
    bg: 'dark',
    badge: 'Mental Model',
    title: '"If I Can\'t Touch It, It\'s Not Mine."',
    subtitle: 'Three principles that govern every financial decision Carlos makes.',
    cards: [
      {
        title: 'Tangibility = Security',
        titleColor: '#2BF2F1',
        body: 'Digital money causes anxiety. A frozen screen isn\'t a UX bug — it feels like his money disappeared. He needs confirmation he can feel, not just see.',
      },
      {
        title: 'Trust Is Borrowed',
        titleColor: '#6060BF',
        body: 'He doesn\'t read terms and conditions. He watched a coworker complete a transfer successfully. That peer proof beats any ad. Trust travels through people, not channels.',
      },
      {
        title: 'Certainty > Speed',
        titleColor: '#F19D38',
        body: 'He\'d rather wait 2 hours in line at a physical store than use a 2-minute app he\'s not 100% sure about. Reliability is the product.',
      },
    ],
  },
  /* 4. Trust Journey */
  {
    type: 'bullets',
    bg: 'light',
    badge: 'Trust Journey',
    title: 'From Cash & Bodegas to Digital Trust',
    subtitle: 'Five stages from Western Union to Félix believer.',
    bullets: [
      { text: '**Arrival** — Cash only. Western Union. Long lines after exhausting workdays.', icon: '💵' },
      { text: '**First Paycheck** — Sends money home immediately. Not optional. It\'s the reason he came.', icon: '📦' },
      { text: '**Peer Discovery** — A coworker shows him Félix. Tests with $100. It works. He keeps going.', icon: '👥' },
      { text: '**Human Anchor** — Something goes wrong. A real person helps. Trust is sealed permanently.', icon: '🤝' },
      { text: '**Believer** — Weekly ritual. Refers his brother-in-law. Félix is his financial home.', icon: '⭐' },
    ],
    imageUrl: '/illustrations/Rocket%20Launch%20-%20Growth%20%2B%20Coin%20-%20Turquoise.svg',
  },
  /* 5. Turning Point */
  {
    type: 'quote',
    bg: 'dark',
    badge: 'The Turning Point',
    title: 'He Didn\'t Expect Anyone to Trust Him.',
    quote: {
      text: 'En caso de que algo se complique, nos pueden hablar también.',
      attribution: 'Carlos — on why Félix became his financial home',
    },
    body: 'The moment Félix became his financial home wasn\'t because of a feature. It was when he realized **there was someone on the other side if something went wrong.** Sent $100 → $300 → $400 → left Western Union for good.',
    imageUrl: '/illustrations/Speech%20Bubbles%20%2B%20Hearts.svg',
  },
  /* 6. Distribution */
  {
    type: 'two-column',
    bg: 'light',
    badge: 'Distribution Model',
    title: 'Adoption Is Collective, Not Personal.',
    columns: [
      {
        heading: 'Community as Channel',
        body: 'Carlos didn\'t find Félix through an ad. His coworker showed him. **This isn\'t an exception — it\'s the rule.**\n\nIn this community, trust is social. Financial decisions are made by watching, not reading. A product that wins the trust of one person on a crew wins the consideration of the whole crew.\n\n**The community IS the distribution channel.**',
      },
      {
        heading: 'The Numbers',
        bullets: [
          { text: '**51%** of active users acquired through organic or referral channels', icon: '📊' },
          { text: '**40%** of top users have organically referred someone', icon: '🔗' },
          { text: 'Word-of-mouth is the cultural default', icon: '💬' },
        ],
      },
    ],
    imageUrl: '/illustrations/3%20Paper%20Airplanes%20%2B%20Coins.svg',
  },
  /* 7. Trust Risk */
  {
    type: 'two-column',
    bg: 'dark',
    badge: 'Trust Risk',
    title: '"Getting Lost in the Flow Is Losing Them Forever."',
    columns: [
      {
        heading: '⚡ The Breakdown',
        body: '**When something goes wrong:**',
        bullets: [
          { text: 'Lands in an unexpected browser with no clear next step', icon: '✗' },
          { text: 'Doesn\'t feel his money is safe — feels like it disappeared', icon: '✗' },
          { text: 'Tries to cancel up to 6 times in a panic', icon: '✗' },
          { text: 'Calls his bank to block the app', icon: '✗' },
          { text: 'Goes back to cash. Permanently.', icon: '✗' },
        ],
      },
      {
        heading: '✦ The Rescue',
        body: '**The only exception:**',
        bullets: [
          { text: 'A real human picks up. Not a bot. Not a ticket number.', icon: '✓' },
          { text: 'Says "I\'m here, let me help you" — and doesn\'t hang up', icon: '✓' },
          { text: '"Visible human support" — his core service demand', icon: '✓' },
          { text: 'Trust isn\'t just recovered — it\'s permanently strengthened', icon: '✓' },
          { text: 'He becomes the most active referrer in his network', icon: '✓' },
        ],
      },
    ],
  },
  /* 8. Competition */
  {
    type: 'two-column',
    bg: 'light',
    badge: 'Competitive Landscape',
    title: 'The Real Competition Is the Habit.',
    columns: [
      {
        heading: 'What He\'s Leaving Behind',
        body: '**Western Union & Cash**',
        bullets: [
          { text: '$10–$20 fixed commission per transfer, every week, for years', icon: '💸' },
          { text: '1+ hour wasted after an already exhausting workday', icon: '⏰' },
          { text: 'Carrying cash on a job site — risk, hassle, no history', icon: '💰' },
          { text: 'No relationship, no trust. Anonymous transaction. Builds nothing.', icon: '🚫' },
        ],
      },
      {
        heading: 'What Keeps Him with Félix',
        body: '**Félix on WhatsApp**',
        bullets: [
          { text: 'WhatsApp — where he already lives. Nothing new to learn.', icon: '📱' },
          { text: '2 minutes from the job site. No line, no commute.', icon: '⚡' },
          { text: 'A human picks up when something goes wrong.', icon: '🤝' },
          { text: '6 years of accumulated trust. One transaction at a time.', icon: '⭐' },
        ],
      },
    ],
    imageUrl: '/illustrations/Hand%20-%20Cell%20Phone%20OK.svg',
  },
  /* 9. Geography */
  {
    type: 'chart',
    bg: 'dark',
    badge: 'Geography & Scale',
    title: 'Concentrated, Mobile, Growing.',
    body: 'TX + CA = 50% of the active base. But Carlos is mobile — he follows the projects, the harvests, the contracts. **WhatsApp moves with him.** His digital address is more stable than his physical one.\n\n**~417k active users. ~1.06M historical base.** Active expansion into Colombia, Dominican Republic, Nicaragua.',
    chart: {
      chartType: 'horizontal-bar',
      data: [
        { label: 'TX → Mexico', volume: 730 },
        { label: 'CA → Mexico', volume: 615 },
        { label: 'FL → Mexico', volume: 180 },
        { label: 'IL → Mexico', volume: 95 },
        { label: 'NY → Mexico', volume: 85 },
      ],
      xKey: 'label',
      yKeys: ['volume'],
      colors: ['#2BF2F1'],
    },
  },
  /* 10. Key Contradictions */
  {
    type: 'cards',
    bg: 'light',
    badge: 'Key Insights',
    title: '7 Contradictions That Define This Market',
    subtitle: 'What looks irrational from the outside is perfectly logical from inside his reality.',
    cards: [
      {
        title: '"Just Testing" = High Intent',
        titleColor: '#2BF2F1',
        body: '84% of non-converters actively tried to send money. The real blocker is missing info at the moment of attempt.',
      },
      {
        title: '"Nobody Sends via WhatsApp"',
        titleColor: '#6060BF',
        body: 'Then it becomes their favorite feature. "Feels like messaging, not banking."',
      },
      {
        title: '"Latinos Don\'t Save"',
        titleColor: '#60D06F',
        body: '27% of volume goes to home-country investments. $20M+/mo. They\'re transnational real estate developers.',
      },
      {
        title: 'Wants Speed, Needs Friction',
        titleColor: '#F19D38',
        body: 'Actually likes KYC because it signals legitimacy. Speed without reliability destroys value.',
      },
    ],
  },
  /* 11. User Segments */
  {
    type: 'cards',
    bg: 'dark',
    badge: 'User Archetypes',
    title: '4 Archetypes That Make Up the Base',
    cards: [
      {
        title: 'Distrustful Experimenter',
        titleColor: '#F26629',
        body: '>60% of base. Tests small amounts, adopts if fast + no SSN required. Carlos is this archetype.',
      },
      {
        title: 'Determined Experimenter',
        titleColor: '#2BF2F1',
        body: 'Established, compares rates across services, uses credit for leverage. More analytical adoption.',
      },
      {
        title: 'Distrustful Traditionalist',
        titleColor: '#7BA882',
        body: 'Cash-only, rejects credit entirely, survival mode. Hardest to convert but most loyal once won.',
      },
      {
        title: 'Determined Traditionalist',
        titleColor: '#6060BF',
        body: 'Wants US credit score, likes KYC friction as legitimacy signal. Most engaged with credit products.',
      },
    ],
  },
  /* 12. Retention Data */
  {
    type: 'chart',
    bg: 'light',
    badge: 'Product Insight',
    title: 'Credit Is the Retention Multiplier',
    body: 'Users who adopt both remittances and credit have **84% retention at 6 months** vs 36% for remittance-only users. The credit product isn\'t just revenue — it\'s the moat.\n\nTop 20% LTV: 4.78 transactions/month, 18.4 month average tenure, $175 average transaction.',
    chart: {
      chartType: 'bar',
      data: [
        { label: 'Remittance Only', retention: 36 },
        { label: 'Remittance + Credit', retention: 84 },
      ],
      xKey: 'label',
      yKeys: ['retention'],
      colors: ['#2BF2F1'],
    },
  },
  /* 13. Demographics */
  {
    type: 'chart',
    bg: 'dark',
    badge: 'Demographics',
    title: 'The Félix User Base by Origin',
    body: 'Mexico leads at 39.9%, followed by Guatemala (25.1%), Honduras (21.6%), and Colombia (4.5%). Income $30k–$40k/yr with volatile employment. **92% fintech adoption rate among Hispanic consumers** — the demand exists, the right products haven\'t.',
    chart: {
      chartType: 'donut',
      data: [
        { label: 'Mexico', value: 39.9 },
        { label: 'Guatemala', value: 25.1 },
        { label: 'Honduras', value: 21.6 },
        { label: 'Colombia', value: 4.5 },
        { label: 'Other', value: 8.9 },
      ],
      xKey: 'label',
      yKeys: ['value'],
      colors: ['#2BF2F1', '#6060BF', '#60D06F', '#F19D38', '#7BA882'],
    },
  },
  /* 14. Core Insight */
  {
    type: 'quote',
    bg: 'brand',
    badge: 'Core Insight',
    title: 'Two Competing Worldviews',
    quote: {
      text: 'Traditional finance sees "static individualism." Immigrant financial reality is "mobile and collectivist." The US system misreads their normal behavior as fraud while missing massive hidden wealth generation.',
      attribution: 'Félix Research Team',
    },
    body: 'WhatsApp is their only stable digital anchor. Community IS the distribution channel. Félix wins by living inside their reality, not fighting it.',
  },
  /* 15. Closing */
  {
    type: 'closing',
    bg: 'dark',
    badge: 'The Believer',
    title: 'Carlos Still Sends Money Every Monday.',
    body: 'Six years later, Carlos still sends money every Monday. He doesn\'t think about it. It\'s not a decision. It\'s what he does.\n\nLast month he referred his brother-in-law. Not for a bonus. **Because when something works in this community, you share it. That\'s how trust travels.**\n\nAnd there are millions of people exactly like him — working hard, sending money home, building futures across borders, waiting for a financial system that finally understands how they actually live.',
    subtitle: 'The financial system wasn\'t built for him. We were.',
    imageUrl: '/illustrations/Rocket%20Launch%20-%20Growth%20%2B%20Coin%20-%20Turquoise.svg',
  },
]

export async function POST() {
  if (process.env.NODE_ENV === 'production' && process.env.ALLOW_SEED_ROUTES !== 'true') {
    return NextResponse.json({ error: 'Seed routes are disabled in production' }, { status: 403 })
  }

  const email = 'kyle.cooney@felixpago.com'

  try {
    // Look up or create the user
    let user = await getUserByEmail(email)

    if (!user) {
      // Create the user with a placeholder password (they'll use magic link to log in)
      const pwHash = await hash('seed-account-no-password-login', 10)
      const created = await createUser(email, 'Kyle Cooney', pwHash, true)
      user = { ...created, passwordHash: pwHash, verified: true }
    }

    // Create the presentation
    const pres = await createPresentation(
      user.id,
      'Félix ICP Deck — Investor Briefing',
      'ICP investor briefing deck about Carlos, the ideal customer profile for Félix remittance and credit products.',
      ICP_SLIDES,
      'seed',
      'manual',
    )

    return NextResponse.json({
      success: true,
      presentationId: pres.id,
      userId: user.id,
      title: pres.title,
      slideCount: ICP_SLIDES.length,
    })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
