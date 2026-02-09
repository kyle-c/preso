import { DesignSystemLayout } from "@/components/design-system/design-system-layout"
import { Section } from "@/components/design-system/section"

const fontWeights = [
  { name: "Plain Black", weight: "900", sample: "Plain Black", className: "font-display font-black" },
  { name: "Plain ExtraBold", weight: "800", sample: "Plain ExtraBold", className: "font-display font-extrabold" },
  { name: "Saans SemiBold", weight: "600", sample: "Saans SemiBold", className: "font-sans font-semibold" },
  { name: "Saans Medium", weight: "500", sample: "Saans Medium", className: "font-sans font-medium" },
  { name: "Saans Regular", weight: "400", sample: "Saans Regular", className: "font-sans font-normal" },
  { name: "Saans Light", weight: "300", sample: "Saans Light", className: "font-sans font-light" },
]

const typeScale = [
  { name: "Display XL", size: "72px", leading: "1", tracking: "-0.02em", className: "text-7xl leading-none tracking-tight", sample: "Meet the hardest working chat" },
  { name: "Display LG", size: "60px", leading: "1", tracking: "-0.02em", className: "text-6xl leading-none tracking-tight", sample: "Financial freedom" },
  { name: "Display MD", size: "48px", leading: "1.1", tracking: "-0.01em", className: "text-5xl leading-tight tracking-tight", sample: "Send money instantly" },
  { name: "Heading 1", size: "36px", leading: "1.2", tracking: "-0.01em", className: "text-4xl leading-tight tracking-tight", sample: "Build your credit score" },
  { name: "Heading 2", size: "30px", leading: "1.3", tracking: "0", className: "text-3xl leading-snug", sample: "How it works" },
  { name: "Heading 3", size: "24px", leading: "1.4", tracking: "0", className: "text-2xl leading-normal", sample: "Features & Benefits" },
  { name: "Heading 4", size: "20px", leading: "1.5", tracking: "0", className: "text-xl leading-relaxed", sample: "Get started today" },
  { name: "Body Large", size: "18px", leading: "1.6", tracking: "0", className: "text-lg leading-relaxed", sample: "Our revolutionary technology makes financial tasks, like sending money and building credit, as easy as sending a text to a friend." },
  { name: "Body", size: "16px", leading: "1.6", tracking: "0", className: "text-base leading-relaxed", sample: "Our revolutionary technology makes financial tasks, like sending money and building credit, as easy as sending a text to a friend." },
  { name: "Body Small", size: "14px", leading: "1.5", tracking: "0", className: "text-sm leading-normal", sample: "Terms and conditions apply. See website for details." },
  { name: "Caption", size: "12px", leading: "1.4", tracking: "0.01em", className: "text-xs leading-snug tracking-wide", sample: "LAST UPDATED: FEBRUARY 2026" },
]

export default function TypographyPage() {
  return (
    <DesignSystemLayout
      title="Typography"
      description="Typesetting is at the heart of our brand's visual communication. Consistent application enhances clarity and brand cohesion."
    >
      <Section
        id="fonts"
        title="Font Families"
        description="Our typography uses a mixture of fonts to create visual hierarchy."
      >
        <div className="grid gap-8 md:grid-cols-2">
          <div className="rounded-xl border border-border bg-card p-6">
            <p className="mb-2 text-sm font-medium text-muted-foreground">Display Font</p>
            <p className="font-display text-4xl font-extrabold text-foreground">Plain</p>
            <p className="mt-4 text-sm text-muted-foreground">
              Used for headlines, hero text, and important callouts. Features tight tracking and heavy weights for maximum impact.
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              <span className="rounded-full bg-turquoise px-3 py-1 text-xs font-medium text-slate">ExtraBold 800</span>
              <span className="rounded-full bg-turquoise px-3 py-1 text-xs font-medium text-slate">Black 900</span>
            </div>
          </div>
          
          <div className="rounded-xl border border-border bg-card p-6">
            <p className="mb-2 text-sm font-medium text-muted-foreground">Body Font</p>
            <p className="font-sans text-4xl font-medium text-foreground">Saans</p>
            <p className="mt-4 text-sm text-muted-foreground">
              Used for body text, UI elements, and general content. Offers excellent readability at all sizes with multiple weights.
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              <span className="rounded-full bg-stone px-3 py-1 text-xs font-medium text-slate">Light 300</span>
              <span className="rounded-full bg-stone px-3 py-1 text-xs font-medium text-slate">Regular 400</span>
              <span className="rounded-full bg-stone px-3 py-1 text-xs font-medium text-slate">Medium 500</span>
              <span className="rounded-full bg-stone px-3 py-1 text-xs font-medium text-slate">SemiBold 600</span>
            </div>
          </div>
        </div>
      </Section>

      <Section
        id="weights"
        title="Font Weights"
        description="Our typography uses a mixture of sizing and weights to create visual hierarchy. This helps us to create a typographic system that feels simple and easy to understand."
      >
        <div className="space-y-6">
          {fontWeights.map((weight) => (
            <div key={weight.name} className="flex items-center border-b border-border pb-6 last:border-0">
              <div className="w-48 shrink-0">
                <p className="text-sm font-medium text-foreground">{weight.name}</p>
                <p className="text-xs text-muted-foreground">Weight: {weight.weight}</p>
              </div>
              <p className={`text-6xl text-foreground ${weight.className}`}>
                {weight.sample}
              </p>
            </div>
          ))}
        </div>
      </Section>

      <Section
        id="scale"
        title="Type Scale"
        description="A consistent type scale ensures hierarchy and readability across all applications."
      >
        <div className="space-y-8">
          {typeScale.map((item) => (
            <div key={item.name} className="rounded-xl border border-border bg-card p-6">
              <div className="mb-4 flex flex-wrap items-baseline gap-4">
                <span className="rounded-full bg-slate px-3 py-1 text-xs font-medium text-turquoise">
                  {item.name}
                </span>
                <span className="text-xs text-muted-foreground">
                  Size: {item.size} | Line Height: {item.leading} | Letter Spacing: {item.tracking}
                </span>
              </div>
              <p className={`text-foreground ${item.className} ${item.name.includes('Display') || item.name.includes('Heading') ? 'font-display font-extrabold' : 'font-sans'}`}>
                {item.sample}
              </p>
            </div>
          ))}
        </div>
      </Section>

      <Section
        id="type-setting"
        title="Type Setting Example"
        description="See how our typography comes together in a real-world layout."
      >
        <div className="rounded-xl bg-linen p-8 md:p-12">
          <div className="grid gap-8 md:grid-cols-[200px_1fr]">
            <div>
              <p className="text-sm font-bold text-foreground">Plain Black</p>
              <p className="text-xs text-muted-foreground">Size: 72px (100% Leading)</p>
              <p className="text-xs text-muted-foreground">Tracking: -0.02em</p>
              <p className="text-xs text-muted-foreground">Word Spacing: 80%</p>
            </div>
            <h1 className="font-display text-6xl font-extrabold leading-none tracking-tight text-foreground md:text-7xl">
              Meet the hardest working chat
            </h1>
          </div>
          
          <div className="mt-12 grid gap-8 md:grid-cols-[200px_1fr]">
            <div>
              <p className="text-sm font-bold text-foreground">Saans Light</p>
              <p className="text-xs text-muted-foreground">Size: 26px (150% Leading)</p>
              <p className="text-xs text-muted-foreground">Tracking: 0</p>
              <p className="text-xs text-muted-foreground">Word Spacing: 90%</p>
            </div>
            <p className="max-w-lg text-xl font-light leading-relaxed text-foreground md:text-2xl">
              Our revolutionary technology makes financial tasks, like sending money and building credit, as easy as sending a text to a friend.
            </p>
          </div>
          
          <div className="mt-12 grid gap-8 md:grid-cols-[200px_1fr]">
            <div>
              <p className="text-sm font-bold text-foreground">Saans Light</p>
              <p className="text-xs text-muted-foreground">Size: 20px (100% Leading)</p>
              <p className="text-xs text-muted-foreground">Tracking: 0</p>
            </div>
            <button className="w-fit rounded-full bg-concrete px-8 py-4 text-lg font-light text-slate transition-colors hover:bg-concrete/80">
              Learn More
            </button>
          </div>
        </div>
      </Section>
    </DesignSystemLayout>
  )
}
