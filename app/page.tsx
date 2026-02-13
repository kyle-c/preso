import { DesignSystemLayout } from "@/components/design-system/design-system-layout"
import { Section } from "@/components/design-system/section"
import Link from "next/link"
import { Palette, Type, Component, Blend, Compass } from "lucide-react"

const features = [
  {
    title: "Principles",
    description: "Core design principles that guide how we build experiences at Felix Pago.",
    href: "/principles",
    icon: Compass,
    color: "bg-sky",
  },
  {
    title: "Colors",
    description: "Primary and secondary color palettes with WCAG-compliant colorways.",
    href: "/colors",
    icon: Palette,
    color: "bg-turquoise",
  },
  {
    title: "Typography",
    description: "Font families, weights, and type scale for consistent text styling.",
    href: "/typography",
    icon: Type,
    color: "bg-cactus",
  },
  {
    title: "Components",
    description: "Pre-built UI components following the Felix Pago design language.",
    href: "/components",
    icon: Component,
    color: "bg-mango",
  },
  {
    title: "Tokens",
    description: "Design tokens mapped to shadcn/ui naming conventions.",
    href: "/tokens",
    icon: Blend,
    color: "bg-blueberry",
  },
]

export default function HomePage() {
  return (
    <DesignSystemLayout
      title=""
    >
      <Section
        id="foundation"
        title=""
      >
        <div className="max-w-4xl space-y-8">
          <div className="-mt-2 mb-2">
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.01em] leading-[1.4] text-turquoise-700">Overview</p>
            <h2 className="font-display text-4xl font-extrabold text-foreground leading-tight tracking-tight">Designing for Presence</h2>
          </div>
          <p className="text-xl font-light text-foreground leading-[1.5]">
            Remittances aren&apos;t transactions, they&apos;re <span className="font-semibold">acts of presence</span>. When someone sends money through Felix, they&apos;re <span className="font-semibold">showing up for family</span> back home.
          </p>

          <p className="text-lg font-light text-muted-foreground leading-[1.6]">
            When they build credit here, they&apos;re ensuring <span className="font-medium text-foreground">future presence</span>, the ability to <span className="font-medium text-foreground">stay available</span> for the people they love. But presence isn&apos;t just about today, it&apos;s about building the <span className="font-medium text-foreground">capability to show up tomorrow</span>.
          </p>

          <p className="border-l-2 border-turquoise pl-6 text-lg font-light text-muted-foreground leading-[1.6]">
            The product should make users <span className="font-medium text-foreground">stronger over time</span>: more knowledgeable about their finances, more confident in their decisions, more capable of building the future they want.
          </p>

          <p className="text-lg font-light text-muted-foreground leading-[1.6]">
            Felix <span className="font-medium text-foreground">grows with users</span>, from their first send home to comprehensive financial management across borders. We <span className="font-medium text-foreground">meet people where they are</span>, then <span className="font-medium text-foreground">gradually reveal new possibilities</span> as they&apos;re ready. <span className="font-medium text-foreground">Future presence</span> requires <span className="font-medium text-foreground">capability across your entire financial life</span>, and we&apos;re here for that <span className="font-medium text-foreground">full journey</span>.
          </p>

          <div className="mt-2 w-fit rounded-xl bg-slate px-6 py-5">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.01em] leading-[1.4] text-turquoise">
              Felix uses
            </p>
            <ul className="space-y-2 text-base text-concrete">
              <li className="flex items-start gap-3">
                <span className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-turquoise" />
                <span className="leading-[1.6]">Language that reflects <span className="font-medium text-stone">relationships</span>, not just transactions</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-turquoise" />
                <span className="leading-[1.6]">Interfaces that <span className="font-medium text-stone">teach</span> financial concepts without condescension</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-turquoise" />
                <span className="leading-[1.6]">Features that <span className="font-medium text-stone">increase capability</span>, not just provide convenience</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-turquoise" />
                <span className="leading-[1.6]"><span className="font-medium text-stone">Progressive revelation</span> of tools as users are ready for them</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-turquoise" />
                <span className="leading-[1.6]">Celebrations that <span className="font-medium text-stone">acknowledge growth</span>, not just completion</span>
              </li>
            </ul>
          </div>
        </div>
      </Section>

      <Section
        id="getting-started"
        title="Getting Started"
        description="Explore the design system documentation to build consistent and beautiful interfaces."
      >
        <div className="grid gap-6 md:grid-cols-2">
          {features.map((feature) => {
            const Icon = feature.icon
            return (
              <Link
                key={feature.href}
                href={feature.href}
                className="group rounded-xl border border-border bg-white p-6 transition-all hover:shadow-md hover:-translate-y-0.5"
              >
                <div className={`mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg ${feature.color}`}>
                  <Icon className="h-6 w-6 text-slate" />
                </div>
                <h3 className="mb-2 font-display text-xl font-bold text-foreground group-hover:text-link">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </Link>
            )
          })}
        </div>
      </Section>

      <Section
        id="brand-overview"
        title="Brand Overview"
        description="The Felix Pago brand identity is built around presence, trust, accessibility, and modern financial technology."
      >
        <div className="grid gap-8 md:grid-cols-3">
          <div className="rounded-xl bg-slate p-6">
            <h4 className="mb-3 font-display text-lg font-bold text-turquoise">Primary Colors</h4>
            <p className="text-sm text-concrete">
              Turquoise and Slate form the core of our visual identity, creating a bold and trustworthy appearance.
            </p>
          </div>
          <div className="rounded-xl bg-turquoise p-6">
            <h4 className="mb-3 font-display text-lg font-bold text-slate">Typography</h4>
            <p className="text-sm text-slate/80">
              Clean, modern sans-serif typography ensures readability across all platforms and devices.
            </p>
          </div>
          <div className="rounded-xl bg-stone p-6">
            <h4 className="mb-3 font-display text-lg font-bold text-slate">Neutrals</h4>
            <p className="text-sm text-slate/80">
              Warm neutrals like Concrete, Stone, and Linen provide balance and sophisticated backgrounds.
            </p>
          </div>
        </div>
      </Section>

    </DesignSystemLayout>
  )
}
