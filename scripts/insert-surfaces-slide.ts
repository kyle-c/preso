/**
 * Insert the "One Brand, Many Surfaces" slide from design-system-preso
 * into the Series C deck after slide 5 (The Solution).
 *
 * Run: set -a && source .env.local && set +a && npx tsx scripts/insert-surfaces-slide.ts
 */
import { redis, presKey } from '../lib/studio-db'

const PRES_ID = 'd6016a31-6df1-4392-925a-da604145f0d2'

const surfacesSlide = {
  type: 'two-column',
  bg: 'dark',
  badge: 'One Brand, Many Surfaces',
  title: 'Félix Meets Users Where They Already Are',
  body: 'We don\'t ask users to download a new app or learn a new interface. Félix lives inside the platforms they already use every day — and adapts its brand, UX, and interaction patterns to each surface. One product. Seven entry points. Zero behavior change.',
  columns: [
    {
      heading: 'Owned Surfaces',
      body: 'Full control over layout, palette, and interactions. These are the surfaces where Félix defines the experience end-to-end.',
      bullets: [
        { text: '📱 **Mobile App** — Native iOS & Android app with dark theme, biometric auth, and full wallet/credit/remittance features' },
        { text: '🌐 **Web App (Wallet)** — Browser-based wallet for balance checks, top-ups, and transaction history' },
        { text: '💸 **Web App (Remittances)** — Dedicated send-money flow with real-time FX, recipient management, and fee transparency' },
        { text: '🔄 **Web App (Top-Ups)** — Monto-branded top-up flow for adding funds via debit card, ACH, or cash' },
      ],
    },
    {
      heading: 'Embedded Surfaces',
      body: 'Someone else\'s chrome — Félix adapts to fit. These platforms provide the distribution; we provide the financial infrastructure.',
      bullets: [
        { text: '💬 **WhatsApp** — Conversational UI via Business API. 90%+ of our target users are here daily. No app download required.' },
        { text: '📸 **Instagram** — Discovery and onboarding via DMs and Story interactions. Reaches the 18-30 demographic.' },
        { text: '🎵 **TikTok** — Commerce API integration for viral acquisition. Lowest CAC channel in testing ($2.40 vs. $7.80 paid avg).' },
      ],
    },
  ],
  imageUrl: '/illustrations/Hands%20-%202%20Cell%20Phones%20-%20Juntos%20we%20Succeed.svg',
  notes: 'Imported from design-system-preso slide 4. Félix is a platform-native product — it lives where users already are. Owned surfaces (app, web) give us full brand control. Embedded surfaces (WhatsApp, Instagram, TikTok) give us distribution at zero acquisition friction. The competitive advantage: no other remittance player has a multi-surface strategy like this. Western Union requires a store visit. Wise requires an app download. We require a text message.',
}

async function main() {
  const raw = await redis.get(presKey(PRES_ID))
  if (!raw) {
    console.error('Presentation not found')
    process.exit(1)
  }

  const pres = typeof raw === 'string' ? JSON.parse(raw) : raw
  const slides = typeof pres.slides === 'string' ? JSON.parse(pres.slides) : Array.isArray(pres.slides) ? pres.slides : []

  // Insert after slide 5 (index 4, "The Solution") → becomes new slide 6
  const insertIndex = 5
  slides.splice(insertIndex, 0, surfacesSlide)
  pres.slides = slides
  pres.updatedAt = Date.now()

  await redis.set(presKey(PRES_ID), JSON.stringify(pres))
  console.log(`✅ Inserted "One Brand, Many Surfaces" as slide ${insertIndex + 1} of ${pres.slides.length}`)
}

main().catch(console.error)
