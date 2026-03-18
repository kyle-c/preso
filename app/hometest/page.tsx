'use client'

import { useState, useEffect, useCallback } from 'react'
import { DesignSystemLayout } from "@/components/design-system/design-system-layout"
import { useDSLang, renderBold } from "@/components/design-system/ds-lang-context"
import Link from "next/link"
import Image from "next/image"

/* ------------------------------------------------------------------ */
/*  Shared data                                                        */
/* ------------------------------------------------------------------ */

function useHomeData() {
  const { t } = useDSLang()
  const h = t.home

  const features = [
    { ...h.feat.principles,    href: '/principles',    img: '/navicons/principles.png' },
    { ...h.feat.colors,        href: '/colors',        img: '/navicons/colors.png' },
    { ...h.feat.typography,    href: '/typography',     img: '/navicons/typography.png' },
    { ...h.feat.iconography,   href: '/iconography',   img: '/illustrations/iconography.png' },
    { ...h.feat.components,    href: '/components',     img: '/navicons/components.png' },
    { ...h.feat.tokens,        href: '/tokens',         img: '/navicons/tokens.png' },
    { ...h.feat.illustrations, href: '/illustrations',  img: '/navicons/illustrations.png' },
  ]

  const bullets = [h.bullet1, h.bullet2, h.bullet3, h.bullet4, h.bullet5]

  return { h, features, bullets }
}

/* ------------------------------------------------------------------ */
/*  Shared Bento Hero (top section — same across all versions)         */
/* ------------------------------------------------------------------ */

function BentoHero() {
  const { h, bullets } = useHomeData()
  const [activeIdx, setActiveIdx] = useState(0)
  const [paused, setPaused] = useState(false)

  const next = useCallback(() => {
    setActiveIdx((i) => (i + 1) % bullets.length)
  }, [bullets.length])

  useEffect(() => {
    if (paused) return
    const id = setInterval(next, 4000)
    return () => clearInterval(id)
  }, [paused, next])

  return (
    <div className="grid gap-4 md:grid-cols-3">
      {/* Large hero card */}
      <div className="md:col-span-2 rounded-2xl bg-slate-950 p-10 text-white [&_strong]:text-inherit flex flex-col justify-end min-h-[320px]">
        <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-turquoise-400">{h.overviewLabel}</p>
        <h1 className="font-display text-5xl font-extrabold leading-tight tracking-tight">{h.heroTitle}</h1>
        <p className="mt-4 max-w-2xl text-lg font-light leading-relaxed text-white/70">{renderBold(h.para1)}</p>
      </div>

      {/* Felix Uses — editorial rotating cards */}
      <div
        className="rounded-2xl bg-cactus min-h-[320px] relative overflow-hidden cursor-pointer"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onClick={next}
      >
        {bullets.map((b, i) => {
          const offset = ((i - activeIdx + bullets.length) % bullets.length)
          const isActive = offset === 0
          const isNext = offset === 1
          const isPrev = offset === bullets.length - 1

          const boldMatch = b.match(/\*\*(.+?)\*\*/)
          const keyword = boldMatch ? boldMatch[1] : ''
          const bodyText = b.replace(/\*\*(.+?)\*\*/, '$1')

          return (
            <div
              key={i}
              className="absolute inset-0 rounded-2xl bg-cactus p-7 flex flex-col justify-between transition-all duration-700 ease-[cubic-bezier(0.34,1.56,0.64,1)]"
              style={{
                opacity: isActive ? 1 : isNext ? 0.5 : 0,
                transform: isActive
                  ? 'translateY(0) scale(1)'
                  : isNext
                    ? 'translateY(12px) scale(0.95)'
                    : isPrev
                      ? 'translateY(-30px) scale(1.02)'
                      : 'translateY(40px) scale(0.9)',
                zIndex: isActive ? 30 : isNext ? 20 : 10,
                pointerEvents: isActive ? 'auto' : 'none',
              }}
            >
              {/* Watermark */}
              <span className="absolute top-3 left-5 font-display font-black text-[72px] leading-none text-slate-950/[0.06] select-none pointer-events-none">
                Felix
              </span>

              {/* Top: counter right-aligned */}
              <div className="relative z-10 flex justify-end">
                <span className="text-[11px] font-medium text-slate-950/30">
                  {String(i + 1).padStart(2, '0')}/{String(bullets.length).padStart(2, '0')}
                </span>
              </div>

              {/* Middle: keyword as display title */}
              <div className="relative z-10 flex-1 flex flex-col justify-center py-4">
                {keyword && (
                  <h3 className="font-display text-3xl font-black leading-tight text-slate-950 mb-3 capitalize">
                    {keyword}
                  </h3>
                )}
                <p className="text-lg font-light leading-relaxed text-slate-950/70">
                  {bodyText}
                </p>
              </div>

              {/* Bottom: dot indicators */}
              <div className="relative z-10 flex items-center gap-2">
                {bullets.map((_, di) => (
                  <button
                    key={di}
                    onClick={(e) => { e.stopPropagation(); setActiveIdx(di); setPaused(true) }}
                    className={`h-1 rounded-full transition-all duration-500 ${
                      di === activeIdx ? 'w-8 bg-slate-950' : 'w-1 bg-slate-950/25'
                    }`}
                  />
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Shared Getting Started cards (same across all versions)            */
/* ------------------------------------------------------------------ */

function GettingStarted() {
  const { h, features } = useHomeData()

  return (
    <>
      <div className="mb-6">
        <h2 className="font-display text-3xl font-extrabold text-foreground">{h.gettingStarted}</h2>
        <p className="mt-2 text-muted-foreground">{h.gettingStartedDesc}</p>
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        {features.map((f) => (
          <Link key={f.href} href={f.href}
            className="group flex items-center gap-5 rounded-xl border border-border bg-white p-5 transition-all hover:shadow-md hover:-translate-y-0.5">
            <div className="h-32 w-32 flex-shrink-0">
              <Image src={f.img} alt={f.title} width={128} height={128} className="object-contain" />
            </div>
            <div className="min-w-0">
              <h3 className="mb-1.5 font-display text-2xl font-bold text-foreground group-hover:text-link">{f.title}</h3>
              <p className="text-[15px] leading-relaxed text-muted-foreground">{f.desc}</p>
            </div>
          </Link>
        ))}
      </div>
    </>
  )
}

/* ------------------------------------------------------------------ */
/*  V1 — Bento Cards (current)                                        */
/*  Two content cards: turquoise-50 left, stone right.                 */
/* ------------------------------------------------------------------ */

function ContentV1() {
  const { h } = useHomeData()
  return (
    <div className="grid gap-4 md:grid-cols-3">
      <div className="rounded-2xl bg-turquoise-50 border border-turquoise-200 p-8 flex items-center relative overflow-hidden">
        <div className="absolute -bottom-4 -right-4 w-28 h-28 opacity-20 pointer-events-none">
          <object type="image/svg+xml" data="/illustrations/Rocket%20Launch%20-%20Growth%20%2B%20Coin%20-%20Turquoise.svg" className="w-full h-full" style={{ pointerEvents: 'none' }} />
        </div>
        <p className="text-lg font-light text-evergreen leading-relaxed relative z-10">
          {renderBold(h.para3)}
        </p>
      </div>
      <div className="md:col-span-2 rounded-2xl bg-stone p-8 flex items-center relative overflow-hidden">
        <div className="absolute -bottom-4 -right-4 w-36 h-36 opacity-15 pointer-events-none">
          <object type="image/svg+xml" data="/illustrations/Hands%20-%202%20Cell%20Phones%20-%20Juntos%20we%20Succeed.svg" className="w-full h-full" style={{ pointerEvents: 'none' }} />
        </div>
        <p className="text-xl font-light text-foreground leading-[1.5] relative z-10">
          {renderBold(h.para2)}
        </p>
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  V2 — Editorial Feature Cards                                       */
/*  Big bold headlines with supporting body, inspired by the Felix     */
/*  marketing site. Each para gets a card with display-size keyword.   */
/* ------------------------------------------------------------------ */

function ContentV2() {
  const { h } = useHomeData()

  const cards = [
    {
      keyword: 'Stronger\nOver Time',
      body: h.para3,
      bg: 'bg-mango [&_strong]:font-semibold',
      text: 'text-slate',
      bodyText: 'text-slate/70',
      illustration: '/illustrations/Rocket%20Launch%20-%20Growth%20%2B%20Coin%20-%20Turquoise.svg',
    },
    {
      keyword: 'Future\nPresence',
      body: h.para2,
      bg: 'bg-lime [&_strong]:font-semibold',
      text: 'text-slate',
      bodyText: 'text-slate/70',
      illustration: '/illustrations/Credit%20Score%20%2B%20Calculator.svg',
    },
    {
      keyword: 'Grows\nWith You',
      body: h.para4,
      bg: 'bg-blueberry [&_strong]:font-semibold',
      text: 'text-slate',
      bodyText: 'text-slate/70',
      illustration: '/illustrations/Hands%20-%202%20Cell%20Phones%20-%20Juntos%20we%20Succeed.svg',
    },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {cards.map((c, i) => (
        <div
          key={i}
          className={`${c.bg} rounded-2xl p-10 relative overflow-hidden min-h-[280px] flex flex-col justify-end ${i === 0 ? 'md:col-span-2' : ''} [&_strong]:font-semibold`}
        >
          {/* Illustration */}
          <div className={`absolute ${i === 0 ? 'right-8 top-1/2 -translate-y-1/2 w-[220px] h-[220px]' : 'right-6 bottom-6 w-[160px] h-[160px]'} opacity-[0.18]`}>
            <object type="image/svg+xml" data={c.illustration} className="w-full h-full" style={{ pointerEvents: 'none' }} />
          </div>

          <div className="relative z-10">
            <h2 className={`font-display text-4xl font-black leading-[1.05] tracking-tight mb-4 ${c.text}`}>
              {c.keyword.split('\n').map((line, li) => (
                <span key={li}>{li > 0 && <br />}{line}</span>
              ))}
            </h2>
            <p className={`text-lg font-light leading-relaxed max-w-xl ${c.bodyText}`}>
              {renderBold(c.body)}
            </p>
          </div>
        </div>
      ))}
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  V3 — Three Equal Columns                                           */
/*  Each paragraph in its own tall card with a colored top accent bar. */
/* ------------------------------------------------------------------ */

function ContentV3() {
  const { h } = useHomeData()

  const cols = [
    { label: 'Capability', para: h.para3, accent: 'bg-turquoise-400' },
    { label: 'Presence',   para: h.para2, accent: 'bg-cactus' },
    { label: 'Growth',     para: h.para4, accent: 'bg-mango' },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-3">
      {cols.map((c, i) => (
        <div key={i} className="rounded-2xl bg-white border border-border overflow-hidden flex flex-col">
          <div className={`${c.accent} h-1.5`} />
          <div className="p-7 flex-1 flex flex-col">
            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground/50 mb-4">{c.label}</p>
            <p className="text-[17px] font-light leading-relaxed text-foreground flex-1">
              {renderBold(c.para)}
            </p>
          </div>
        </div>
      ))}
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  V4 — Stacked Full-Width Strips                                     */
/*  Alternating bg strips with big pull-quote style, turquoise accent  */
/*  line on the middle strip.                                          */
/* ------------------------------------------------------------------ */

function ContentV4() {
  const { h } = useHomeData()

  return (
    <div className="-mx-8 [&_strong]:font-semibold">
      <div className="bg-white px-12 py-10">
        <p className="max-w-3xl text-2xl font-light leading-[1.5] text-foreground">
          {renderBold(h.para3)}
        </p>
      </div>
      <div className="bg-turquoise-50 px-12 py-10 border-y border-turquoise-200">
        <div className="max-w-3xl border-l-4 border-turquoise-400 pl-8">
          <p className="text-2xl font-light leading-[1.5] text-evergreen">
            {renderBold(h.para2)}
          </p>
        </div>
      </div>
      <div className="bg-white px-12 py-10">
        <p className="max-w-3xl text-xl font-light leading-[1.6] text-muted-foreground">
          {renderBold(h.para4)}
        </p>
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  V5 — Two-Row Bento with Dark Statement Card                        */
/*  A big dark statement card on the left, two smaller cards stacked   */
/*  on the right.                                                      */
/* ------------------------------------------------------------------ */

function ContentV5() {
  const { h } = useHomeData()

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {/* Large dark statement */}
      <div className="rounded-2xl bg-slate-950 p-10 flex flex-col justify-center min-h-[300px] text-white [&_strong]:text-turquoise-300 [&_strong]:font-semibold">
        <p className="text-xs font-semibold uppercase tracking-widest text-turquoise-400/60 mb-4">Capability</p>
        <p className="text-2xl font-light leading-[1.5]">
          {renderBold(h.para3)}
        </p>
      </div>

      {/* Stacked right column */}
      <div className="flex flex-col gap-4">
        <div className="rounded-2xl bg-turquoise-50 border border-turquoise-200 p-8 flex-1 flex items-center">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-turquoise-700/50 mb-3">Presence</p>
            <p className="text-lg font-light text-evergreen leading-relaxed">
              {renderBold(h.para2)}
            </p>
          </div>
        </div>
        <div className="rounded-2xl bg-stone p-8 flex-1 flex items-center">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground/40 mb-3">Growth</p>
            <p className="text-lg font-light text-foreground leading-relaxed">
              {renderBold(h.para4)}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Page — Version picker                                              */
/* ------------------------------------------------------------------ */

const versions = [
  { id: 1, label: 'V1', desc: 'Bento cards — turquoise + stone' },
  { id: 2, label: 'V2', desc: 'Editorial feature cards with bold headlines' },
  { id: 3, label: 'V3', desc: 'Three equal columns with accent bars' },
  { id: 4, label: 'V4', desc: 'Full-width alternating strips with pull-quote' },
  { id: 5, label: 'V5', desc: 'Dark statement card + stacked right column' },
]

const contentVariants = [ContentV1, ContentV2, ContentV3, ContentV4, ContentV5]

export default function HomeTestPage() {
  const [active, setActive] = useState(1)

  const Content = contentVariants[active - 1]

  return (
    <DesignSystemLayout title="">
      {/* Floating version selector */}
      <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-full bg-slate-950/90 backdrop-blur-sm px-2 py-1.5 shadow-xl border border-white/10">
        {versions.map((v) => (
          <button
            key={v.id}
            onClick={() => setActive(v.id)}
            title={v.desc}
            className={`rounded-full w-9 h-9 text-xs font-bold transition-colors ${
              active === v.id
                ? 'bg-turquoise text-slate-950'
                : 'text-white/60 hover:text-white hover:bg-white/10'
            }`}
          >
            {v.label}
          </button>
        ))}
      </div>

      {/* Shared bento hero */}
      <BentoHero />

      {/* Variable content section */}
      <div className="mt-4 mb-16">
        <Content />
      </div>

      {/* Shared getting started */}
      <GettingStarted />
    </DesignSystemLayout>
  )
}
