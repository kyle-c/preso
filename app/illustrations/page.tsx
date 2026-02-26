import { DesignSystemLayout } from "@/components/design-system/design-system-layout"
import { Section } from "@/components/design-system/section"

type Illustration = {
  name: string
  hasPng: boolean
}

type Category = {
  id: string
  label: string
  description?: string
  items: Illustration[]
}

const categories: Category[] = [
  {
    id: "brand",
    label: "Brand & Characters",
    description: "Core brand illustrations featuring the Félix character used across the product experience.",
    items: [
      { name: "Félix Illo 1", hasPng: true },
      { name: "Félix Illo 2", hasPng: true },
      { name: "Félix Illo 3", hasPng: true },
      { name: "Félix Illo 4", hasPng: true },
      { name: "Félix Illo 5", hasPng: true },
    ],
  },
  {
    id: "flags-3d",
    label: "Flags — 3D",
    description: "Three-dimensional flag illustrations for supported send-to countries.",
    items: [
      { name: "Flag 3d MX", hasPng: true },
      { name: "Flag 3d GT", hasPng: true },
      { name: "Flag 3d SV", hasPng: true },
      { name: "Flag 3d a HND", hasPng: true },
      { name: "Flag 3d NIC", hasPng: true },
      { name: "Flag 3d RD", hasPng: true },
      { name: "Flag 3d CO", hasPng: true },
      { name: "Flags", hasPng: true },
    ],
  },
  {
    id: "flags-og",
    label: "Flags — Original Style",
    description: "Flat-style flag illustrations in the original hand-drawn aesthetic.",
    items: [
      { name: "Flag OG - Mexico", hasPng: true },
      { name: "Flag OG - Guatemala", hasPng: true },
      { name: "Flag OG - El Salvador", hasPng: true },
      { name: "Flag OG - Honduras", hasPng: true },
      { name: "Flag OG - Nicaragua", hasPng: true },
      { name: "Flag OG - Republica Dominicana", hasPng: true },
      { name: "Flag OG - Colombia", hasPng: true },
    ],
  },
  {
    id: "hands",
    label: "Hands",
    description: "Hand illustrations for CTAs, feature explanations, and onboarding moments.",
    items: [
      { name: "Hand - Dollar Bills 1", hasPng: true },
      { name: "Hand - Dollar Bills 2", hasPng: true },
      { name: "Hand - Dollar Bills 3", hasPng: true },
      { name: "Hand - Card 1", hasPng: true },
      { name: "Hand - Card 2", hasPng: true },
      { name: "Hand - Cell Phone OK", hasPng: true },
      { name: "Hand - Cell Phone - Félix WA", hasPng: true },
      { name: "Hand - Star - Perks", hasPng: true },
      { name: "Hand - Stars", hasPng: true },
      { name: "Hand - Tool", hasPng: true },
      { name: "Hands - 2 Cell Phones - Love", hasPng: true },
      { name: "Hands - 2 Cell Phones - Juntos we Succeed", hasPng: true },
    ],
  },
  {
    id: "money",
    label: "Money & Payments",
    description: "Illustrations for payment flows, transfer confirmations, and financial feature moments.",
    items: [
      { name: "Dollar bill", hasPng: true },
      { name: "Dollar bills + Coins A", hasPng: true },
      { name: "Dollar bills + Coins B - Turquoise", hasPng: true },
      { name: "Flying Dollar Bills - Turquoise", hasPng: true },
      { name: "Coin - Lime", hasPng: true },
      { name: "Coins x2 v1", hasPng: true },
      { name: "Coins x2 v2", hasPng: true },
      { name: "Stack of coins - Lime", hasPng: true },
      { name: "Cloud Coin - Turquoise", hasPng: true },
      { name: "Cards", hasPng: true },
      { name: "ATM + cell phone", hasPng: true },
      { name: "Credit Score + Calculator", hasPng: true },
      { name: "Calculator + Stack of coins", hasPng: true },
      { name: "Cell Phone + Flying Dollar Bills - Turquoise", hasPng: true },
      { name: "Cell Phone + Flying Dollar Bills - Turquoise 2", hasPng: true },
      { name: "Paper Airplane + Coin - Turquoise", hasPng: true },
      { name: "Paper Airplane + Dollar Bills", hasPng: true },
      { name: "3 Paper Airplanes + Coins", hasPng: true },
      { name: "Gift Box + Coins", hasPng: true },
      { name: "Gift Box + Hands + Bills", hasPng: true },
      { name: "Magic hat and magic wand + dollar bill", hasPng: true },
      { name: "Rocket Launch - Growth + Coin - Turquoise", hasPng: true },
      { name: "Rocket Launch + Coin - Growth - Lime", hasPng: true },
      { name: "Speaker + Dollar Bill", hasPng: true },
      { name: "Payday + Calendar + Cell Phone", hasPng: true },
      { name: "Repeat A", hasPng: true },
      { name: "Repeat B", hasPng: true },
      { name: "card", hasPng: false },
      { name: "cash", hasPng: false },
    ],
  },
  {
    id: "communication",
    label: "Communication",
    description: "Illustrations for messaging, notifications, support, and social sharing.",
    items: [
      { name: "Speech Bubble", hasPng: true },
      { name: "Speech Bubble 2", hasPng: true },
      { name: "Speech Bubbles", hasPng: true },
      { name: "Speech Bubbles + Hearts", hasPng: true },
      { name: "Letter in Envelope", hasPng: true },
      { name: "Headphones", hasPng: true },
      { name: "Speaker", hasPng: true },
      { name: "Heart -Félix", hasPng: true },
      { name: "Survey", hasPng: true },
      { name: "Verification WA 1", hasPng: true },
      { name: "Verification WA 3", hasPng: true },
    ],
  },
  {
    id: "status",
    label: "Status & Alerts",
    description: "Illustrations for confirmation, error, loading, and other state communication.",
    items: [
      { name: "Check", hasPng: true },
      { name: "Party Popper", hasPng: true },
      { name: "Attention", hasPng: true },
      { name: "Attention - Siren", hasPng: true },
      { name: "Error", hasPng: true },
      { name: "Fast", hasPng: true },
      { name: "Lock", hasPng: true },
      { name: "Diffusion", hasPng: true },
    ],
  },
  {
    id: "navigation",
    label: "Navigation & Maps",
    description: "Location and map illustrations for the store finder and cash payment flows.",
    items: [
      { name: "Map", hasPng: true },
      { name: "Map + F symbol", hasPng: true },
      { name: "Map Marker", hasPng: true },
    ],
  },
  {
    id: "other",
    label: "Other",
    description: "Supporting illustrations for product features, onboarding, and utility moments.",
    items: [
      { name: "Bank", hasPng: true },
      { name: "Bot", hasPng: true },
      { name: "Laptop Dark", hasPng: true },
      { name: "Laptop Dark-1", hasPng: true },
      { name: "Magnifying Glass", hasPng: true },
      { name: "Passport", hasPng: true },
      { name: "ray", hasPng: true },
    ],
  },
]

function IllustrationCard({ item }: { item: Illustration }) {
  const svgPath = `/illustrations/${encodeURIComponent(item.name)}.svg`
  const pngPath = `/illustrations/pngs/${encodeURIComponent(item.name)}.png`

  return (
    <div className="group flex flex-col overflow-hidden rounded-xl border border-border bg-white">
      {/* Preview */}
      <div className="relative flex h-36 items-center justify-center bg-stone/40 p-4"
           style={{ backgroundImage: 'radial-gradient(circle, #d1cdc7 1px, transparent 1px)', backgroundSize: '16px 16px' }}>
        <object
          type="image/svg+xml"
          data={svgPath}
          className="h-full w-full"
          style={{ pointerEvents: 'none' }}
          aria-label={item.name}
        />
      </div>

      {/* Name + Actions */}
      <div className="flex flex-col gap-3 p-3">
        <p className="text-[13px] font-medium leading-snug text-foreground line-clamp-2 min-h-[2.5rem]">
          {item.name}
        </p>
        <div className="flex gap-1.5">
          <a
            href={svgPath}
            download={`${item.name}.svg`}
            className="flex h-7 flex-1 items-center justify-center rounded-lg border border-border bg-linen text-[11px] font-semibold text-foreground/70 transition-colors hover:bg-stone hover:text-foreground"
          >
            SVG
          </a>
          {item.hasPng ? (
            <a
              href={pngPath}
              download={`${item.name}.png`}
              className="flex h-7 flex-1 items-center justify-center rounded-lg border border-border bg-linen text-[11px] font-semibold text-foreground/70 transition-colors hover:bg-stone hover:text-foreground"
            >
              PNG
            </a>
          ) : (
            <span className="flex h-7 flex-1 items-center justify-center rounded-lg border border-border/50 bg-stone/30 text-[11px] font-semibold text-foreground/30 cursor-not-allowed select-none">
              PNG
            </span>
          )}
        </div>
      </div>
    </div>
  )
}

export default function IllustrationsPage() {
  return (
    <DesignSystemLayout
      title="Illustrations"
      description="The Felix illustration library. Download SVG for web and product use, PNG for presentations and documents."
    >
      {categories.map((category) => (
        <Section
          key={category.id}
          id={category.id}
          title={category.label}
          description={category.description}
        >
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {category.items.map((item) => (
              <IllustrationCard key={item.name} item={item} />
            ))}
          </div>
        </Section>
      ))}
    </DesignSystemLayout>
  )
}
