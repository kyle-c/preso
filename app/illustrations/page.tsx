'use client'

import { DesignSystemLayout } from "@/components/design-system/design-system-layout"
import { Section } from "@/components/design-system/section"
import { useDSLang } from "@/components/design-system/ds-lang-context"

type Illustration = {
  name: string
  token: string
  hasPng: boolean
  hasSvg?: boolean // defaults to true
}

type IllusCatKey = 'brand' | 'flags3d' | 'flagsOg' | 'hands' | 'money' | 'communication' | 'status' | 'navigation' | 'other'

type Category = {
  id: string
  catKey: IllusCatKey
  items: Illustration[]
}

const categories: Category[] = [
  {
    id: "brand",
    catKey: "brand",
    items: [
      { name: "Félix Illo 1", token: "illustration/brand/felix-1", hasPng: true },
      { name: "Félix Illo 2", token: "illustration/brand/felix-2", hasPng: true },
      { name: "Félix Illo 3", token: "illustration/brand/felix-3", hasPng: true },
      { name: "Félix Illo 4", token: "illustration/brand/felix-4", hasPng: true },
      { name: "Félix Illo 5", token: "illustration/brand/felix-5", hasPng: true },
    ],
  },
  {
    id: "flags-3d",
    catKey: "flags3d",
    items: [
      { name: "Flag 3d MX", token: "illustration/flags-3d/mx", hasPng: true },
      { name: "Flag 3d GT", token: "illustration/flags-3d/gt", hasPng: true },
      { name: "Flag 3d SV", token: "illustration/flags-3d/sv", hasPng: true },
      { name: "Flag 3d a HND", token: "illustration/flags-3d/hnd", hasPng: true },
      { name: "Flag 3d NIC", token: "illustration/flags-3d/nic", hasPng: true },
      { name: "Flag 3d RD", token: "illustration/flags-3d/rd", hasPng: true },
      { name: "Flag 3d CO", token: "illustration/flags-3d/co", hasPng: true },
      { name: "Flags", token: "illustration/flags-3d/all", hasPng: true },
    ],
  },
  {
    id: "flags-og",
    catKey: "flagsOg",
    items: [
      { name: "Flag OG - Mexico", token: "illustration/flags-og/mx", hasPng: true },
      { name: "Flag OG - Guatemala", token: "illustration/flags-og/gt", hasPng: true },
      { name: "Flag OG - El Salvador", token: "illustration/flags-og/sv", hasPng: true },
      { name: "Flag OG - Honduras", token: "illustration/flags-og/hnd", hasPng: true },
      { name: "Flag OG - Nicaragua", token: "illustration/flags-og/nic", hasPng: true },
      { name: "Flag OG - Republica Dominicana", token: "illustration/flags-og/rd", hasPng: true },
      { name: "Flag OG - Colombia", token: "illustration/flags-og/co", hasPng: true },
    ],
  },
  {
    id: "hands",
    catKey: "hands",
    items: [
      { name: "Hand - Dollar Bills 1", token: "illustration/hands/dollar-bills-1", hasPng: true },
      { name: "Hand - Dollar Bills 2", token: "illustration/hands/dollar-bills-2", hasPng: true },
      { name: "Hand - Dollar Bills 3", token: "illustration/hands/dollar-bills-3", hasPng: true },
      { name: "Hand - Card 1", token: "illustration/hands/card-1", hasPng: true },
      { name: "Hand - Card 2", token: "illustration/hands/card-2", hasPng: true },
      { name: "Hand - Cell Phone OK", token: "illustration/hands/cell-phone-ok", hasPng: true },
      { name: "Hand - Star - Perks", token: "illustration/hands/star-perks", hasPng: true },
      { name: "Hand - Stars", token: "illustration/hands/stars", hasPng: true },
      { name: "Hand - Tool", token: "illustration/hands/tool", hasPng: true },
      { name: "Hands - 2 Cell Phones - Love", token: "illustration/hands/2-phones-love", hasPng: true },
      { name: "Hands - 2 Cell Phones - Juntos we Succeed", token: "illustration/hands/2-phones-juntos", hasPng: true },
    ],
  },
  {
    id: "money",
    catKey: "money",
    items: [
      { name: "Dollar bill", token: "illustration/money/dollar-bill", hasPng: true },
      { name: "Dollar bills + Coins A", token: "illustration/money/dollar-bills-coins-a", hasPng: true },
      { name: "Dollar bills + Coins B - Turquoise", token: "illustration/money/dollar-bills-coins-b", hasPng: true },
      { name: "Flying Dollar Bills - Turquoise", token: "illustration/money/flying-bills", hasPng: true },
      { name: "Coin - Lime", token: "illustration/money/coin-lime", hasPng: true },
      { name: "Coins x2 v1", token: "illustration/money/coins-v1", hasPng: true },
      { name: "Coins x2 v2", token: "illustration/money/coins-v2", hasPng: true },
      { name: "Stack of coins - Lime", token: "illustration/money/coin-stack", hasPng: true },
      { name: "Cloud Coin - Turquoise", token: "illustration/money/cloud-coin", hasPng: true },
      { name: "Cards", token: "illustration/money/cards", hasPng: true },
      { name: "ATM + cell phone", token: "illustration/money/atm-phone", hasPng: true },
      { name: "Credit Score + Calculator", token: "illustration/money/credit-score", hasPng: true },
      { name: "Calculator + Stack of coins", token: "illustration/money/calculator-coins", hasPng: true },
      { name: "Cell Phone + Flying Dollar Bills - Turquoise", token: "illustration/money/phone-bills", hasPng: true },
      { name: "Cell Phone + Flying Dollar Bills - Turquoise 2", token: "illustration/money/phone-bills-2", hasPng: true },
      { name: "Paper Airplane + Coin - Turquoise", token: "illustration/money/paper-plane-coin", hasPng: true },
      { name: "Paper Airplane + Dollar Bills", token: "illustration/money/paper-plane-bills", hasPng: true },
      { name: "3 Paper Airplanes + Coins", token: "illustration/money/3-paper-planes", hasPng: true },
      { name: "Gift Box + Coins", token: "illustration/money/gift-coins", hasPng: true },
      { name: "Gift Box + Hands + Bills", token: "illustration/money/gift-hands-bills", hasPng: true },
      { name: "Magic hat and magic wand + dollar bill", token: "illustration/money/magic-hat", hasPng: true },
      { name: "Rocket Launch - Growth + Coin - Turquoise", token: "illustration/money/rocket-coin-turquoise", hasPng: true },
      { name: "Rocket Launch + Coin - Growth - Lime", token: "illustration/money/rocket-coin-lime", hasPng: true },
      { name: "Speaker + Dollar Bill", token: "illustration/money/speaker-bill", hasPng: true },
      { name: "Payday + Calendar + Cell Phone", token: "illustration/money/payday", hasPng: true },
      { name: "Repeat A", token: "illustration/money/repeat-a", hasPng: true },
      { name: "Repeat B", token: "illustration/money/repeat-b", hasPng: true },
      { name: "cashAirplane", token: "illustration/money/cash-airplane", hasPng: true },
      { name: "card", token: "illustration/money/card", hasPng: false },
      { name: "cash", token: "illustration/money/cash", hasPng: false },
    ],
  },
  {
    id: "communication",
    catKey: "communication",
    items: [
      { name: "Speech Bubble", token: "illustration/communication/speech-bubble", hasPng: true },
      { name: "Speech Bubble 2", token: "illustration/communication/speech-bubble-2", hasPng: true },
      { name: "Speech Bubbles", token: "illustration/communication/speech-bubbles", hasPng: true },
      { name: "Speech Bubbles + Hearts", token: "illustration/communication/speech-bubbles-hearts", hasPng: true },
      { name: "Letter in Envelope", token: "illustration/communication/letter", hasPng: true },
      { name: "Headphones", token: "illustration/communication/headphones", hasPng: true },
      { name: "Speaker", token: "illustration/communication/speaker", hasPng: true },
      { name: "Heart -Félix", token: "illustration/communication/heart", hasPng: true },
      { name: "Survey", token: "illustration/communication/survey", hasPng: true },
      { name: "Verification WA 1", token: "illustration/communication/verification-1", hasPng: true },
      { name: "Verification WA 3", token: "illustration/communication/verification-3", hasPng: true },
    ],
  },
  {
    id: "status",
    catKey: "status",
    items: [
      { name: "Check", token: "illustration/status/check", hasPng: true },
      { name: "Party Popper", token: "illustration/status/party-popper", hasPng: true },
      { name: "Attention", token: "illustration/status/attention", hasPng: true },
      { name: "Attention - Siren", token: "illustration/status/siren", hasPng: true },
      { name: "Error", token: "illustration/status/error", hasPng: true },
      { name: "Fast", token: "illustration/status/fast", hasPng: true },
      { name: "Lock", token: "illustration/status/lock", hasPng: true },
      { name: "Diffusion", token: "illustration/status/diffusion", hasPng: true },
    ],
  },
  {
    id: "navigation",
    catKey: "navigation",
    items: [
      { name: "Map", token: "illustration/navigation/map", hasPng: true },
      { name: "Map + F symbol", token: "illustration/navigation/map-f", hasPng: true },
      { name: "Map Marker", token: "illustration/navigation/map-marker", hasPng: true },
    ],
  },
  {
    id: "other",
    catKey: "other",
    items: [
      { name: "Bank", token: "illustration/other/bank", hasPng: true },
      { name: "Bot", token: "illustration/other/bot", hasPng: true },
      { name: "Laptop Dark", token: "illustration/other/laptop-dark", hasPng: true },
      { name: "Laptop Dark-1", token: "illustration/other/laptop-dark-1", hasPng: true },
      { name: "Magnifying Glass", token: "illustration/other/magnifying-glass", hasPng: true },
      { name: "Passport", token: "illustration/other/passport", hasPng: true },
      { name: "ray", token: "illustration/other/ray", hasPng: true },
    ],
  },
]

function IllustrationCard({ item, svgLabel, pngLabel }: { item: Illustration; svgLabel: string; pngLabel: string }) {
  const hasSvg = item.hasSvg !== false
  const svgPath = `/illustrations/${encodeURIComponent(item.name)}.svg`
  const pngPath = hasSvg
    ? `/illustrations/PNGs/${encodeURIComponent(item.name)}.png`
    : `/illustrations/${encodeURIComponent(item.name)}.png`

  return (
    <div className="group flex flex-col overflow-hidden rounded-xl border border-border bg-white">
      {/* Preview */}
      <div className="relative flex h-36 items-center justify-center bg-stone/40 p-4"
           style={{ backgroundImage: 'radial-gradient(circle, #d1cdc7 1px, transparent 1px)', backgroundSize: '16px 16px' }}>
        {hasSvg ? (
          <object
            type="image/svg+xml"
            data={svgPath}
            className="h-full w-full"
            style={{ pointerEvents: 'none' }}
            aria-label={item.name}
          />
        ) : (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={pngPath}
            alt={item.name}
            className="h-full w-auto object-contain"
          />
        )}
      </div>

      {/* Name + Token + Actions */}
      <div className="flex flex-col gap-2.5 p-3">
        <div>
          <p className="text-[13px] font-medium leading-snug text-foreground line-clamp-2">
            {item.name}
          </p>
          <p className="mt-0.5 text-[10px] font-mono text-muted-foreground/60 leading-tight truncate">
            {item.token}
          </p>
        </div>
        <div className="flex gap-1.5">
          {hasSvg ? (
            <a
              href={svgPath}
              download={`${item.name}.svg`}
              className="flex h-7 flex-1 items-center justify-center rounded-lg border border-border bg-linen text-[11px] font-semibold text-foreground/70 transition-colors hover:bg-stone hover:text-foreground"
            >
              {svgLabel}
            </a>
          ) : (
            <span className="flex h-7 flex-1 items-center justify-center rounded-lg border border-border/50 bg-stone/30 text-[11px] font-semibold text-foreground/30 cursor-not-allowed select-none">
              {svgLabel}
            </span>
          )}
          {item.hasPng ? (
            <a
              href={pngPath}
              download={`${item.name}.png`}
              className="flex h-7 flex-1 items-center justify-center rounded-lg border border-border bg-linen text-[11px] font-semibold text-foreground/70 transition-colors hover:bg-stone hover:text-foreground"
            >
              {pngLabel}
            </a>
          ) : (
            <span className="flex h-7 flex-1 items-center justify-center rounded-lg border border-border/50 bg-stone/30 text-[11px] font-semibold text-foreground/30 cursor-not-allowed select-none">
              {pngLabel}
            </span>
          )}
        </div>
      </div>
    </div>
  )
}

export default function IllustrationsPage() {
  const { t } = useDSLang()
  const illus = t.illustrations

  return (
    <DesignSystemLayout title="">
      {categories.map((category) => {
        const cat = illus[category.catKey] as { label: string; description: string }
        return (
          <Section
            key={category.id}
            id={category.id}
            title={cat.label}
            description={cat.description}
          >
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
              {category.items.map((item) => (
                <IllustrationCard key={item.token} item={item} svgLabel={illus.svg} pngLabel={illus.png} />
              ))}
            </div>
          </Section>
        )
      })}
    </DesignSystemLayout>
  )
}
