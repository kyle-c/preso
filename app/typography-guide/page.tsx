'use client'

import { DesignSystemLayout } from '@/components/design-system/design-system-layout'
import { Section } from '@/components/design-system/section'

/* ── Responsive patterns ─────────────────────────────────── */

const responsivePatterns = [
  {
    name: 'Hero / Display',
    description: 'Primary page headlines, marketing hero text, splash screens.',
    mobile: 'text-5xl',
    tablet: 'sm:text-6xl',
    desktop: 'lg:text-7xl',
    mobileToken: 'Display MD (48px)',
    desktopToken: 'Display XL (72px)',
    sample: 'Meet the hardest working chat',
    font: 'font-display font-black',
  },
  {
    name: 'Page Title',
    description: 'Top-level page headings, section landing pages.',
    mobile: 'text-3xl',
    tablet: 'sm:text-4xl',
    desktop: 'lg:text-5xl',
    mobileToken: 'Heading 2 (30px)',
    desktopToken: 'Display MD (48px)',
    sample: 'Send money instantly',
    font: 'font-display font-extrabold',
  },
  {
    name: 'Section Heading',
    description: 'Major content sections, card group titles.',
    mobile: 'text-2xl',
    tablet: 'sm:text-3xl',
    desktop: 'lg:text-4xl',
    mobileToken: 'Heading 3 (24px)',
    desktopToken: 'Heading 1 (36px)',
    sample: 'How it works',
    font: 'font-display font-extrabold',
  },
  {
    name: 'Card Heading',
    description: 'Card titles, list group headers, dialog titles.',
    mobile: 'text-xl',
    tablet: 'sm:text-2xl',
    desktop: '',
    mobileToken: 'Heading 4 (20px)',
    desktopToken: 'Heading 3 (24px)',
    sample: 'Features & Benefits',
    font: 'font-display font-bold',
  },
  {
    name: 'Body Large',
    description: 'Lead paragraphs, hero subtitles, introductory text.',
    mobile: 'text-base',
    tablet: 'sm:text-lg',
    desktop: 'lg:text-xl',
    mobileToken: 'Body (16px)',
    desktopToken: 'Heading 4 (20px)',
    sample: 'Our technology makes financial tasks as easy as sending a text.',
    font: 'font-sans',
  },
  {
    name: 'Body',
    description: 'Default paragraph text. Usually stays fixed across breakpoints.',
    mobile: 'text-base',
    tablet: '',
    desktop: '',
    mobileToken: 'Body (16px)',
    desktopToken: 'Body (16px)',
    sample: 'Terms and conditions may apply. See our website for full details about our services.',
    font: 'font-sans',
  },
  {
    name: 'Caption / Meta',
    description: 'Timestamps, labels, badges, footnotes.',
    mobile: 'text-xs',
    tablet: 'sm:text-sm',
    desktop: '',
    mobileToken: 'Caption (12px)',
    desktopToken: 'Body Small (14px)',
    sample: 'LAST UPDATED: MARCH 2026',
    font: 'font-sans font-medium uppercase tracking-wide',
  },
]

/* ── Type scale reference ────────────────────────────────── */

const typeScale = [
  { token: 'Display XL', size: '72px', tailwind: 'text-7xl', leading: '1', tracking: '-0.02em' },
  { token: 'Display LG', size: '60px', tailwind: 'text-6xl', leading: '1', tracking: '-0.02em' },
  { token: 'Display MD', size: '48px', tailwind: 'text-5xl', leading: '1.1', tracking: '-0.01em' },
  { token: 'Heading 1', size: '36px', tailwind: 'text-4xl', leading: '1.2', tracking: '-0.01em' },
  { token: 'Heading 2', size: '30px', tailwind: 'text-3xl', leading: '1.3', tracking: '0' },
  { token: 'Heading 3', size: '24px', tailwind: 'text-2xl', leading: '1.4', tracking: '0' },
  { token: 'Heading 4', size: '20px', tailwind: 'text-xl', leading: '1.5', tracking: '0' },
  { token: 'Body Large', size: '18px', tailwind: 'text-lg', leading: '1.6', tracking: '0' },
  { token: 'Body', size: '16px', tailwind: 'text-base', leading: '1.6', tracking: '0' },
  { token: 'Body Small', size: '14px', tailwind: 'text-sm', leading: '1.5', tracking: '0' },
  { token: 'Caption', size: '12px', tailwind: 'text-xs', leading: '1.4', tracking: '0.01em' },
]

/* ── Breakpoints reference ───────────────────────────────── */

const breakpoints = [
  { name: 'Default', prefix: '—', range: '0 – 639px', description: 'Mobile phones' },
  { name: 'sm', prefix: 'sm:', range: '640px +', description: 'Large phones, small tablets' },
  { name: 'md', prefix: 'md:', range: '768px +', description: 'Tablets' },
  { name: 'lg', prefix: 'lg:', range: '1024px +', description: 'Laptops, desktops' },
  { name: 'xl', prefix: 'xl:', range: '1280px +', description: 'Large desktops' },
]

export default function TypographyGuidePage() {
  return (
    <DesignSystemLayout
      title="Typography Guide"
      description="How to use the Félix type scale responsively. Tokens define fixed sizes — breakpoint prefixes control how you step through the scale at each viewport."
    >
      {/* ── Core Principle ─────────────────────────────────── */}
      <Section
        id="principle"
        title="How Responsive Type Works"
        description="The type scale is the menu. Breakpoint prefixes are how you order from it."
      >
        <div className="rounded-xl border border-border bg-white p-6 sm:p-8">
          <div className="grid gap-6 lg:grid-cols-2">
            <div>
              <h3 className="font-display font-bold text-lg text-foreground mb-2">Tokens are fixed</h3>
              <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                Each token maps to a single size. <code className="text-xs bg-stone rounded px-1.5 py-0.5">heading-1</code> is always 2.25rem (36px). It doesn't change based on screen size.
              </p>
              <h3 className="font-display font-bold text-lg text-foreground mb-2">Context determines scaling</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                A page title might drop 2 steps on mobile, but a card heading might only drop 1. The right responsive step depends on the component, not the token.
              </p>
            </div>
            <div className="bg-slate rounded-xl p-5 font-mono text-sm">
              <p className="text-muted-foreground/50 mb-2">{'<!-- Page title: drops 2 steps on mobile -->'}</p>
              <p className="text-turquoise">{'<h1 class="'}
                <span className="text-linen">text-3xl sm:text-4xl lg:text-5xl</span>
                {'">'}</p>
              <p className="text-muted-foreground/50 mt-4 mb-2">{'<!-- Card heading: drops 1 step -->'}</p>
              <p className="text-turquoise">{'<h3 class="'}
                <span className="text-linen">text-xl sm:text-2xl</span>
                {'">'}</p>
              <p className="text-muted-foreground/50 mt-4 mb-2">{'<!-- Body: stays fixed -->'}</p>
              <p className="text-turquoise">{'<p class="'}
                <span className="text-linen">text-base</span>
                {'">'}</p>
            </div>
          </div>
        </div>
      </Section>

      {/* ── Responsive Patterns ────────────────────────────── */}
      <Section
        id="patterns"
        title="Recommended Patterns"
        description="Standard responsive type recipes for common UI contexts. Use these as defaults — adjust when a specific layout requires it."
      >
        <div className="space-y-6">
          {responsivePatterns.map((p) => {
            const classes = [p.mobile, p.tablet, p.desktop].filter(Boolean).join(' ')
            return (
              <div key={p.name} className="rounded-xl border border-border bg-white overflow-hidden">
                <div className="px-6 py-4 border-b border-border bg-stone/30 flex flex-wrap items-center gap-x-6 gap-y-2">
                  <h3 className="font-display font-bold text-base text-foreground">{p.name}</h3>
                  <p className="text-sm text-muted-foreground">{p.description}</p>
                </div>
                <div className="px-6 py-5">
                  <p className={`text-foreground leading-tight tracking-tight mb-4 ${classes} ${p.font}`}>
                    {p.sample}
                  </p>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {[p.mobile, p.tablet, p.desktop].filter(Boolean).map((cls) => (
                      <code key={cls} className="text-xs font-mono bg-slate text-turquoise rounded px-2 py-1">{cls}</code>
                    ))}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Mobile: <span className="font-medium text-foreground">{p.mobileToken}</span>
                    <span className="mx-2 text-border">→</span>
                    Desktop: <span className="font-medium text-foreground">{p.desktopToken}</span>
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      </Section>

      {/* ── Quick Reference ────────────────────────────────── */}
      <Section
        id="scale"
        title="Type Scale Reference"
        description="The complete token-to-Tailwind mapping. Each token is a fixed size — pick the right one for each breakpoint."
      >
        <div className="rounded-xl border border-border bg-white overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-stone/30">
                  <th className="text-left px-5 py-3 font-display font-bold text-xs uppercase tracking-wide text-muted-foreground">Token</th>
                  <th className="text-left px-5 py-3 font-display font-bold text-xs uppercase tracking-wide text-muted-foreground">Size</th>
                  <th className="text-left px-5 py-3 font-display font-bold text-xs uppercase tracking-wide text-muted-foreground">Tailwind</th>
                  <th className="text-left px-5 py-3 font-display font-bold text-xs uppercase tracking-wide text-muted-foreground">Leading</th>
                  <th className="text-left px-5 py-3 font-display font-bold text-xs uppercase tracking-wide text-muted-foreground">Tracking</th>
                </tr>
              </thead>
              <tbody>
                {typeScale.map((t) => (
                  <tr key={t.token} className="border-b border-border last:border-0 hover:bg-stone/20 transition-colors">
                    <td className="px-5 py-3 font-medium text-foreground">{t.token}</td>
                    <td className="px-5 py-3 text-muted-foreground">{t.size}</td>
                    <td className="px-5 py-3"><code className="text-xs font-mono bg-slate text-turquoise rounded px-2 py-0.5">{t.tailwind}</code></td>
                    <td className="px-5 py-3 text-muted-foreground">{t.leading}</td>
                    <td className="px-5 py-3 text-muted-foreground">{t.tracking}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </Section>

      {/* ── Breakpoints ────────────────────────────────────── */}
      <Section
        id="breakpoints"
        title="Breakpoints"
        description="Tailwind breakpoints used across the system. All breakpoints are mobile-first (min-width)."
      >
        <div className="rounded-xl border border-border bg-white overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-stone/30">
                  <th className="text-left px-5 py-3 font-display font-bold text-xs uppercase tracking-wide text-muted-foreground">Name</th>
                  <th className="text-left px-5 py-3 font-display font-bold text-xs uppercase tracking-wide text-muted-foreground">Prefix</th>
                  <th className="text-left px-5 py-3 font-display font-bold text-xs uppercase tracking-wide text-muted-foreground">Range</th>
                  <th className="text-left px-5 py-3 font-display font-bold text-xs uppercase tracking-wide text-muted-foreground">Typical Devices</th>
                </tr>
              </thead>
              <tbody>
                {breakpoints.map((b) => (
                  <tr key={b.name} className="border-b border-border last:border-0 hover:bg-stone/20 transition-colors">
                    <td className="px-5 py-3 font-medium text-foreground">{b.name}</td>
                    <td className="px-5 py-3"><code className="text-xs font-mono bg-slate text-turquoise rounded px-2 py-0.5">{b.prefix}</code></td>
                    <td className="px-5 py-3 text-muted-foreground">{b.range}</td>
                    <td className="px-5 py-3 text-muted-foreground">{b.description}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </Section>

      {/* ── Rules of Thumb ─────────────────────────────────── */}
      <Section
        id="rules"
        title="Rules of Thumb"
        description="General guidance for making responsive type decisions."
      >
        <div className="grid gap-4 sm:grid-cols-2">
          {[
            { title: 'Display text drops 2 steps', desc: 'Hero headlines at text-7xl on desktop should land around text-5xl on mobile. The visual impact still reads at the smaller size.' },
            { title: 'Page headings drop 1–2 steps', desc: 'A text-5xl desktop heading works at text-3xl on mobile. Use sm: as the middle step when jumping more than one size.' },
            { title: 'Card headings drop 1 step', desc: 'Cards are already constrained by their container. One step down (text-2xl → text-xl) is usually enough.' },
            { title: 'Body text stays fixed', desc: 'text-base (16px) is readable at every viewport. Don\'t scale body text down — it hurts readability on the devices that need it most.' },
            { title: 'Don\'t skip more than 2 steps', desc: 'Jumping from text-7xl to text-3xl between breakpoints creates a jarring shift. If you need a big range, add an intermediate sm: or md: step.' },
            { title: 'Test at 375px and 1440px', desc: 'These are the realistic extremes. If it looks good at both, the breakpoints in between will work.' },
          ].map((rule) => (
            <div key={rule.title} className="rounded-xl border border-border bg-white px-5 py-4">
              <h3 className="font-display font-bold text-sm text-foreground mb-1.5">{rule.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{rule.desc}</p>
            </div>
          ))}
        </div>
      </Section>
    </DesignSystemLayout>
  )
}
