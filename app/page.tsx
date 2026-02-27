'use client'

import { DesignSystemLayout } from "@/components/design-system/design-system-layout"
import { Section } from "@/components/design-system/section"
import { useDSLang, renderBold } from "@/components/design-system/ds-lang-context"
import Link from "next/link"
import Image from "next/image"

export default function HomePage() {
  const { t } = useDSLang()
  const h = t.home

  const features = [
    { ...h.feat.principles,   href: '/principles',    img: '/navicons/principles.png' },
    { ...h.feat.colors,       href: '/colors',        img: '/navicons/colors.png' },
    { ...h.feat.typography,   href: '/typography',    img: '/navicons/typography.png' },
    { ...h.feat.components,   href: '/components',    img: '/navicons/components.png' },
    { ...h.feat.tokens,       href: '/tokens',        img: '/navicons/tokens.png' },
    { ...h.feat.illustrations,href: '/illustrations', img: '/navicons/illustrations.png' },
  ]

  return (
    <DesignSystemLayout title="">
      <Section id="foundation" title="">
        <div className="max-w-4xl space-y-8">
          <div className="-mt-2 mb-2">
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.01em] leading-[1.4] text-turquoise-700">
              {h.overviewLabel}
            </p>
            <h2 className="font-display text-4xl font-extrabold text-foreground leading-tight tracking-tight">
              {h.heroTitle}
            </h2>
          </div>

          <p className="text-xl font-light text-foreground leading-[1.5]">
            {renderBold(h.para1)}
          </p>

          <p className="text-lg font-light text-muted-foreground leading-[1.6]">
            {renderBold(h.para2)}
          </p>

          <p className="border-l-2 border-turquoise pl-6 text-lg font-light text-muted-foreground leading-[1.6]">
            {renderBold(h.para3)}
          </p>

          <p className="text-lg font-light text-muted-foreground leading-[1.6]">
            {renderBold(h.para4)}
          </p>

          <div className="mt-2 w-fit rounded-xl border border-border bg-white px-6 py-5">
            <p className="mb-3 font-display text-xl font-light text-foreground">
              {h.felixUses}
            </p>
            <ul className="space-y-2 text-base text-muted-foreground">
              {[h.bullet1, h.bullet2, h.bullet3, h.bullet4, h.bullet5].map((bullet, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-turquoise-600" />
                  <span className="leading-[1.6]">{renderBold(bullet)}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Section>

      <Section
        id="getting-started"
        title={h.gettingStarted}
        description={h.gettingStartedDesc}
      >
        <div className="grid gap-6 md:grid-cols-2">
          {features.map((feature) => (
              <Link
                key={feature.href}
                href={feature.href}
                className="group flex items-center gap-5 rounded-xl border border-border bg-white p-5 transition-all hover:shadow-md hover:-translate-y-0.5"
              >
                <div className="h-32 w-32 flex-shrink-0">
                  <Image src={feature.img} alt={feature.title} width={128} height={128} className="object-contain" />
                </div>
                <div className="min-w-0">
                  <h3 className="mb-1.5 font-display text-2xl font-bold text-foreground group-hover:text-link">
                    {feature.title}
                  </h3>
                  <p className="text-[15px] leading-relaxed text-muted-foreground">{feature.desc}</p>
                </div>
              </Link>
          ))}
        </div>
      </Section>

      <Section
        id="brand-overview"
        title={h.brandOverview}
        description={h.brandOverviewDesc}
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
