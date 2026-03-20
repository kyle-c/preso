'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { SlideToc, SlideTocChrome } from '@/components/slide-toc'
import { useComments, SlideCommentLayer } from '@/components/slide-comments'
import { useLocale, useSlideTranslation, SlidePreTranslator } from '@/components/slide-translation'
import { useSlidePdf } from '@/components/use-slide-pdf'
import { SlidePdfOverlay } from '@/components/slide-pdf-overlay'
import { SlideRating } from '@/components/studio/slide-rating'
import type { SlideData } from '@/components/studio/slide-renderer'
import { CheckCircle2 } from 'lucide-react'
import {
  Globe, ChartLineUp, Users, Lightning, Handshake, MapPin,
  TrendUp, TrendDown, Bank, CurrencyDollar, Rocket, Flag,
  DeviceMobile, Star, HandCoins, Megaphone, Timer, CalendarBlank,
  ShieldCheck, Wallet,
} from '@/components-next/phosphor-icons'
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  AreaChart, Area, ResponsiveContainer, Tooltip,
} from 'recharts'
import {
  ChartContainer, ChartTooltip, ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart'

const C = { turquoise: '#2BF2F1', slate: '#082422', blueberry: '#6060BF', evergreen: '#35605F', cactus: '#60D06F', mango: '#F19D38', papaya: '#F26629', sage: '#7BA882', lime: '#DCFF00', lychee: '#FFCD9C', sky: '#8DFDFA', stone: '#EFEBE7', concrete: '#CFCABF', mocha: '#877867' }
const TOTAL = 14

function Illo({ src, className }: { src: string; className?: string }) {
  return <object type="image/svg+xml" data={`/illustrations/${src}`} className={className ?? 'w-full h-auto'} style={{ pointerEvents: 'none' }} aria-hidden="true" />
}

function SlideFooter({ num, dark }: { num: number; dark?: boolean }) {
  return (
    <div className="absolute bottom-0 inset-x-0 flex items-center justify-between px-8 sm:px-12 pb-5 sm:pb-6 text-sm font-sans">
      <span className={`font-display font-extrabold text-xs sm:text-sm ${dark ? 'text-linen' : 'text-foreground'}`}>Quarterly Business Review</span>
      <span className={`text-xs sm:text-sm ${dark ? 'text-linen/60' : 'text-muted-foreground'} absolute left-1/2 -translate-x-1/2`}>felixpago.com</span>
      <span className={`text-xs sm:text-sm font-medium ${dark ? 'text-linen' : 'text-foreground'}`}>{num} / {TOTAL}</span>
    </div>
  )
}

function PillBadge({ children, dark }: { children: React.ReactNode; dark?: boolean }) {
  return <span className={`inline-block rounded-full px-5 py-1.5 font-sans font-semibold text-sm sm:text-base uppercase tracking-[0.12em] ${dark ? 'bg-turquoise/20 text-turquoise' : 'bg-turquoise text-slate'}`}>{children}</span>
}

/* ═══════════════════════════════════════════════ SLIDES ═══ */

/* ── Slide 1: Cover ─────────────────────────────────────── */
function SlideCover() {
  return (
    <div className="relative h-full w-full bg-slate-950 flex flex-col overflow-x-hidden overflow-y-auto">
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute top-[6%] left-[3%] w-[100px] lg:w-[140px] opacity-[0.08] -rotate-12" style={{ animation: 'ds-float 8s ease-in-out infinite' }}><Illo src="Flag%203d%20CO.svg" /></div>
        <div className="absolute top-[8%] right-[4%] w-[100px] lg:w-[140px] opacity-[0.08] rotate-6" style={{ animation: 'ds-drift 9s ease-in-out infinite 1s' }}><Illo src="Flag%203d%20RD.svg" /></div>
        <div className="absolute bottom-[12%] left-[8%] w-[120px] lg:w-[170px] opacity-[0.05] rotate-3" style={{ animation: 'ds-drift 10s ease-in-out infinite 2s' }}><Illo src="Paper%20Airplane%20%2B%20Dollar%20Bills.svg" /></div>
        <div className="absolute bottom-[10%] right-[6%] w-[110px] lg:w-[150px] opacity-[0.05] -rotate-6" style={{ animation: 'ds-float 9s ease-in-out infinite 0.5s' }}><Illo src="Hands%20-%202%20Cell%20Phones%20-%20Juntos%20we%20Succeed.svg" /></div>
      </div>
      <div className="flex-1 flex items-center justify-center px-8 sm:px-12 lg:px-16 py-10 relative z-10">
        <div className="flex flex-col items-center text-center max-w-3xl">
          <div className="mb-6 lg:mb-8"><PillBadge dark>QBR &middot; Q1 2026</PillBadge></div>
          <h1 className="font-display font-black text-linen text-5xl sm:text-6xl lg:text-7xl xl:text-8xl leading-[0.95] tracking-tight mb-6 lg:mb-8">A Tale of Two{'\u00A0'}Markets</h1>
          <p className="text-lg sm:text-xl lg:text-2xl text-linen/60 leading-relaxed max-w-2xl">Colombia &amp; Rep&uacute;blica Dominicana (CORD): Market Dynamics, Felix Performance &amp; Strategic&nbsp;Priorities</p>
          <p className="text-sm text-linen/30 mt-8">Confidential information</p>
        </div>
      </div>
      <SlideFooter num={1} dark />
    </div>
  )
}

/* ── Slide 2: Juntos We Succeed ─────────────────────────── */
function SlideJuntos() {
  return (
    <div className="relative h-full w-full bg-slate-950 flex flex-col overflow-x-hidden overflow-y-auto">
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute top-[10%] right-[8%] w-[130px] lg:w-[180px] opacity-[0.06] rotate-6" style={{ animation: 'ds-drift 9s ease-in-out infinite' }}><Illo src="Hands%20-%202%20Cell%20Phones%20-%20Juntos%20we%20Succeed.svg" /></div>
      </div>
      <div className="flex-1 flex items-center justify-center px-8 sm:px-12 lg:px-16 py-10 relative z-10">
        <h1 className="font-display font-black text-turquoise text-6xl sm:text-7xl lg:text-8xl xl:text-9xl leading-[0.95] tracking-tight">#JuntosWeSucceed</h1>
      </div>
      <SlideFooter num={2} dark />
    </div>
  )
}

/* ── Slide 3: Quote ─────────────────────────────────────── */
function SlideQuote() {
  return (
    <div className="relative h-full w-full bg-stone flex flex-col overflow-x-hidden overflow-y-auto">
      <div className="absolute top-[5%] right-[3%] w-[100px] lg:w-[140px] opacity-[0.12] rotate-6 pointer-events-none" style={{ animation: 'ds-drift 9s ease-in-out infinite' }}><Illo src="Speech%20Bubbles%20%2B%20Hearts.svg" /></div>
      <div className="flex-1 flex flex-col items-center justify-center px-10 sm:px-14 lg:px-20 py-8 relative z-10">
        <div className="w-full max-w-[1000px]">
          <h2 className="font-display font-black text-foreground text-3xl sm:text-4xl lg:text-5xl leading-[0.95] tracking-tight mb-10 text-center">&ldquo;&hellip;But We Are Not the&nbsp;Same&rdquo;</h2>
          <div className="flex items-center justify-center gap-6 mb-10">
            <div className="flex items-center gap-3 bg-white rounded-xl px-5 py-3 border border-border shadow-sm">
              <Illo src="Flag%20OG%20-%20Republica%20Dominicana.svg" className="w-8 h-8" />
              <span className="font-display font-bold text-foreground text-base">Rep&uacute;blica Dominicana</span>
            </div>
            <div className="flex items-center gap-3 bg-white rounded-xl px-5 py-3 border border-border shadow-sm">
              <Illo src="Flag%20OG%20-%20Colombia.svg" className="w-8 h-8" />
              <span className="font-display font-bold text-foreground text-base">Colombia</span>
            </div>
          </div>
          <blockquote className="bg-white rounded-2xl p-8 sm:p-10 border border-border shadow-sm text-center">
            <p className="text-xl sm:text-2xl lg:text-3xl text-foreground leading-relaxed font-display italic">&ldquo;A large reason why U.S. banks have failed with Latin Americans is because they&apos;ve treated them like a homogeneous&nbsp;group&rdquo;</p>
            <footer className="mt-6">
              <p className="font-display font-bold text-foreground text-base">Nigel Morris</p>
              <p className="text-sm text-muted-foreground">QED Investors</p>
            </footer>
          </blockquote>
          <p className="text-xs text-muted-foreground mt-6 text-center">Paraphrased from remarks made by Nigel Morris at the Felix Offsite (Mexico, January&nbsp;2026)</p>
        </div>
      </div>
      <SlideFooter num={3} />
    </div>
  )
}

/* ── Slide 4: Market Snapshot ───────────────────────────── */
function SlideMarketSnapshot() {
  const metrics = [
    { label: 'Market Size', co: '$13.1B', rd: '$11.8B' },
    { label: 'Population', co: '~52.2M', rd: '~11.4M' },
    { label: 'Per Capita Remittances', co: '$216', rd: '$939' },
    { label: '% of GDP', co: '~8%', rd: '~39%' },
    { label: 'YoY Growth', co: '~2.8%', rd: '~9.0%' },
    { label: 'Currency Split', co: '~20% USD / ~80% COP', rd: '~65% USD / ~35% DOP' },
    { label: 'US Corridor Share', co: '~80%', rd: '~42%' },
  ]
  const callouts = [
    { text: 'Larger market overall', flag: 'CO', color: C.mango },
    { text: 'Higher remittance dependence', flag: 'RD', color: C.blueberry },
    { text: 'Larger US corridor', flag: 'CO', color: C.mango },
    { text: 'Faster growth rate', flag: 'RD', color: C.blueberry },
  ]
  return (
    <div className="relative h-full w-full bg-slate-950 flex flex-col overflow-x-hidden overflow-y-auto">
      <div className="absolute bottom-[6%] right-[3%] w-[110px] lg:w-[150px] opacity-[0.05] rotate-6 pointer-events-none" style={{ animation: 'ds-drift 10s ease-in-out infinite' }}><Illo src="Dollar%20bills%20%2B%20Coins%20A.svg" /></div>
      <div className="flex-1 flex flex-col items-center justify-center px-10 sm:px-14 lg:px-20 py-8 relative z-10">
        <div className="w-full max-w-[1200px]">
          <div className="mb-5"><PillBadge dark>Market Overview</PillBadge></div>
          <h1 className="font-display font-black text-linen text-3xl sm:text-4xl lg:text-5xl leading-[0.95] tracking-tight mb-2">Snapshot: Remittance&nbsp;Markets</h1>
          <p className="text-linen/60 text-lg mb-6">Two corridors with very different structural&nbsp;characteristics</p>

          <div className="bg-white/5 rounded-2xl border border-white/10 overflow-hidden mb-5">
            <div className="grid grid-cols-[2fr_1fr_1fr] gap-x-6 px-5 py-3 bg-white/[0.05] border-b border-white/10">
              <span className="text-xs font-semibold uppercase tracking-wider text-linen/40">Metric</span>
              <div className="flex items-center gap-2">
                <Illo src="Flag%20OG%20-%20Colombia.svg" className="w-5 h-5" />
                <span className="text-xs font-semibold uppercase tracking-wider text-linen/40">Colombia</span>
              </div>
              <div className="flex items-center gap-2">
                <Illo src="Flag%20OG%20-%20Republica%20Dominicana.svg" className="w-5 h-5" />
                <span className="text-xs font-semibold uppercase tracking-wider text-linen/40">Rep. Dominicana</span>
              </div>
            </div>
            {metrics.map((m, i) => (
              <div key={m.label} className={`grid grid-cols-[2fr_1fr_1fr] gap-x-6 px-5 py-3 items-center ${i % 2 === 0 ? 'bg-white/[0.02]' : 'bg-transparent'} ${i < metrics.length - 1 ? 'border-b border-white/5' : ''}`}>
                <span className="text-sm font-medium text-linen/60">{m.label}</span>
                <span className="text-sm font-bold text-linen/90">{m.co}</span>
                <span className="text-sm font-bold text-linen/90">{m.rd}</span>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {callouts.map((c) => (
              <div key={c.text} className="bg-white/5 rounded-xl p-4 border border-white/10 text-center">
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full" style={{ background: `${c.color}20`, color: c.color }}>{c.flag}</span>
                <p className="text-sm text-linen/70 mt-2 leading-snug">{c.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      <SlideFooter num={4} dark />
    </div>
  )
}

/* ── Slide 5: FX Volatility ─────────────────────────────── */
const copData = [
  { month: 'Mar 25', value: 4168 }, { month: 'Apr', value: 4240.9 }, { month: 'May', value: 4155 },
  { month: 'Jun', value: 4089.5 }, { month: 'Jul', value: 4180 }, { month: 'Aug', value: 3923 },
  { month: 'Sep', value: 3860.1 }, { month: 'Oct', value: 3747.3 }, { month: 'Nov', value: 3770.8 },
  { month: 'Dec', value: 3679.7 }, { month: 'Jan 26', value: 3745.2 }, { month: 'Feb', value: 3711.1 },
  { month: 'Mar 26', value: 4010 },
]
const dopData = [
  { month: 'Mar 25', value: 63.3 }, { month: 'Apr', value: 58.7 }, { month: 'May', value: 59 },
  { month: 'Jun', value: 59.5 }, { month: 'Jul', value: 60.8 }, { month: 'Aug', value: 62.9 },
  { month: 'Sep', value: 62.3 }, { month: 'Oct', value: 64 }, { month: 'Nov', value: 62.6 },
  { month: 'Dec', value: 63.1 }, { month: 'Jan 26', value: 62.9 }, { month: 'Feb', value: 59.7 },
  { month: 'Mar 26', value: 60.1 },
]
const copConfig = { value: { label: 'COP/USD', color: C.mango } } satisfies ChartConfig
const dopConfig = { value: { label: 'DOP/USD', color: C.blueberry } } satisfies ChartConfig

function SlideFxVolatility() {
  return (
    <div className="relative h-full w-full bg-stone flex flex-col overflow-x-hidden overflow-y-auto">
      <div className="absolute bottom-[5%] left-[3%] w-[100px] lg:w-[140px] opacity-[0.1] -rotate-12 pointer-events-none" style={{ animation: 'ds-float 8s ease-in-out infinite' }}><Illo src="Calculator%20%2B%20Stack%20of%20coins.svg" /></div>
      <div className="flex-1 flex flex-col items-center justify-center px-10 sm:px-14 lg:px-20 py-8 relative z-10">
        <div className="w-full max-w-[1200px]">
          <div className="mb-5"><PillBadge>FX Analysis</PillBadge></div>
          <h1 className="font-display font-black text-foreground text-3xl sm:text-4xl lg:text-5xl leading-[0.95] tracking-tight mb-2">Both Markets Saw Extreme FX&nbsp;Volatility</h1>
          <p className="text-muted-foreground text-lg mb-6">But unlike DOP, COP has mostly trended&nbsp;downwards&hellip;</p>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {/* COP Chart */}
            <div className="bg-white rounded-2xl p-5 border border-border shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Illo src="Flag%20OG%20-%20Colombia.svg" className="w-5 h-5" />
                  <h3 className="font-display font-bold text-foreground text-base">COP to USD</h3>
                </div>
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full" style={{ background: `${C.papaya}20`, color: C.papaya }}>-13% peak-to-trough</span>
              </div>
              <ChartContainer config={copConfig} className="h-[180px] w-full [&_.recharts-cartesian-axis-tick_text]:text-[9px]">
                <AreaChart data={copData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" />
                  <defs>
                    <linearGradient id="copGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={C.mango} stopOpacity={0.2} />
                      <stop offset="100%" stopColor={C.mango} stopOpacity={0.02} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="month" tickLine={false} axisLine={false} />
                  <YAxis tickLine={false} axisLine={false} width={40} domain={['dataMin - 50', 'dataMax + 50']} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Area type="monotone" dataKey="value" fill="url(#copGrad)" stroke={C.mango} strokeWidth={2.5} dot={{ r: 3, fill: C.mango, strokeWidth: 0 }} />
                </AreaChart>
              </ChartContainer>
            </div>

            {/* DOP Chart */}
            <div className="bg-white rounded-2xl p-5 border border-border shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Illo src="Flag%20OG%20-%20Republica%20Dominicana.svg" className="w-5 h-5" />
                  <h3 className="font-display font-bold text-foreground text-base">DOP to USD</h3>
                </div>
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full" style={{ background: `${C.blueberry}20`, color: C.blueberry }}>-8% peak-to-trough</span>
              </div>
              <ChartContainer config={dopConfig} className="h-[180px] w-full [&_.recharts-cartesian-axis-tick_text]:text-[9px]">
                <AreaChart data={dopData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" />
                  <defs>
                    <linearGradient id="dopGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={C.blueberry} stopOpacity={0.2} />
                      <stop offset="100%" stopColor={C.blueberry} stopOpacity={0.02} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="month" tickLine={false} axisLine={false} />
                  <YAxis tickLine={false} axisLine={false} width={32} domain={['dataMin - 1', 'dataMax + 1']} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Area type="monotone" dataKey="value" fill="url(#dopGrad)" stroke={C.blueberry} strokeWidth={2.5} dot={{ r: 3, fill: C.blueberry, strokeWidth: 0 }} />
                </AreaChart>
              </ChartContainer>
            </div>
          </div>
        </div>
      </div>
      <SlideFooter num={5} />
    </div>
  )
}

/* ── Slide 6: Diaspora Comparison ───────────────────────── */
function SlideDiaspora() {
  const sections = [
    { title: 'Diaspora in U.S.', icon: Globe, co: '1.3M (~2% home pop)', rd: '2.4M (~20% home pop)' },
    { title: 'Sending Behavior', icon: HandCoins, co: '~$360 avg / ~16x per yr', rd: '~$351 avg / ~16x per yr' },
    { title: 'Financial Access', icon: Bank, co: '+90% bank acct, ~75% digital, ~60% digital payout', rd: '+90% bank acct, ~75% digital, ~65% digital payout' },
    { title: 'Immigration Patterns', icon: Users, co: 'Newer arrivals, 1st gen dominant', rd: 'Multi-generational, deep roots' },
  ]
  return (
    <div className="relative h-full w-full bg-slate-950 flex flex-col overflow-x-hidden overflow-y-auto">
      <div className="absolute top-[5%] left-[3%] w-[100px] lg:w-[140px] opacity-[0.06] -rotate-12 pointer-events-none" style={{ animation: 'ds-float 8s ease-in-out infinite' }}><Illo src="Map%20%2B%20F%20symbol.svg" /></div>
      <div className="flex-1 flex flex-col items-center justify-center px-10 sm:px-14 lg:px-20 py-8 relative z-10">
        <div className="w-full max-w-[1200px]">
          <div className="mb-5"><PillBadge dark>Diaspora</PillBadge></div>
          <h1 className="font-display font-black text-linen text-3xl sm:text-4xl lg:text-5xl leading-[0.95] tracking-tight mb-2">What Makes the Diasporas&nbsp;Different?</h1>
          <p className="text-linen/60 text-lg mb-8">Colombian &amp; Dominican communities in the U.S. have distinct&nbsp;profiles</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {sections.map((s) => {
              const Icon = s.icon
              return (
                <div key={s.title} className="bg-white/5 rounded-2xl p-6 border border-white/10" style={{ borderTopWidth: 3, borderTopColor: C.cactus }}>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${C.cactus}20` }}>
                      <Icon size={22} style={{ color: C.turquoise }} />
                    </div>
                    <h3 className="font-display font-bold text-linen text-lg">{s.title}</h3>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-start gap-2.5">
                      <Illo src="Flag%20OG%20-%20Colombia.svg" className="w-5 h-5 flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-linen/70 leading-snug">{s.co}</span>
                    </div>
                    <div className="flex items-start gap-2.5">
                      <Illo src="Flag%20OG%20-%20Republica%20Dominicana.svg" className="w-5 h-5 flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-linen/70 leading-snug">{s.rd}</span>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
      <SlideFooter num={6} dark />
    </div>
  )
}

/* ── Slide 7: How Money Moves ───────────────────────────── */
function SlideMoneyMoves() {
  const rows = [
    { label: 'Financial Access', co: '~90-95% Banked', rd: '~55-65% Banked' },
    { label: 'Payout Infrastructure', co: '~94% Bank deposit & wallet, ~70% Wallets', rd: '~70% Cash pickup' },
    { label: 'Payment Infrastructure', co: 'ACH + Wallets emerging as RTR', rd: 'ACH + Physical networks, SIPARD RTR underdeveloped' },
  ]
  return (
    <div className="relative h-full w-full bg-stone flex flex-col overflow-x-hidden overflow-y-auto">
      <div className="absolute top-[5%] right-[3%] w-[110px] lg:w-[150px] opacity-[0.1] rotate-6 pointer-events-none" style={{ animation: 'ds-drift 9s ease-in-out infinite' }}><Illo src="Cell%20Phone%20%2B%20Flying%20Dollar%20Bills%20-%20Turquoise.svg" /></div>
      <div className="flex-1 flex flex-col items-center justify-center px-10 sm:px-14 lg:px-20 py-8 relative z-10">
        <div className="w-full max-w-[1200px]">
          <div className="mb-5"><PillBadge>Infrastructure</PillBadge></div>
          <h1 className="font-display font-black text-foreground text-3xl sm:text-4xl lg:text-5xl leading-[0.95] tracking-tight mb-2">How Money Moves &amp; Users Are&nbsp;Reached</h1>
          <p className="text-muted-foreground text-lg mb-6">Infrastructure shapes user behavior and product&nbsp;strategy</p>

          <div className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden mb-5">
            <div className="grid grid-cols-[1.5fr_2fr_2fr] gap-x-6 px-5 py-3 bg-foreground/[0.03] border-b border-border">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Category</span>
              <div className="flex items-center gap-2">
                <Illo src="Flag%20OG%20-%20Colombia.svg" className="w-5 h-5" />
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Colombia</span>
              </div>
              <div className="flex items-center gap-2">
                <Illo src="Flag%20OG%20-%20Republica%20Dominicana.svg" className="w-5 h-5" />
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Rep. Dominicana</span>
              </div>
            </div>
            {rows.map((r, i) => (
              <div key={r.label} className={`grid grid-cols-[1.5fr_2fr_2fr] gap-x-6 px-5 py-4 items-center ${i % 2 === 0 ? 'bg-white' : 'bg-foreground/[0.02]'} ${i < rows.length - 1 ? 'border-b border-border/50' : ''}`}>
                <span className="text-sm font-semibold text-foreground">{r.label}</span>
                <span className="text-sm text-muted-foreground">{r.co}</span>
                <span className="text-sm text-muted-foreground">{r.rd}</span>
              </div>
            ))}
          </div>

          <div className="bg-white rounded-2xl p-6 border border-border shadow-sm" style={{ borderLeftWidth: 4, borderLeftColor: C.mango }}>
            <div className="flex items-center gap-3">
              <Lightning size={22} style={{ color: C.evergreen }} />
              <p className="text-base sm:text-lg text-foreground font-display font-bold">Colombia is digital &mdash; Cash is King in Rep&uacute;blica&nbsp;Dominicana</p>
            </div>
          </div>
        </div>
      </div>
      <SlideFooter num={7} />
    </div>
  )
}

/* ── Slide 8: Growth Metrics ────────────────────────────── */
const coMauData = [
  { month: 'Aug', value: 2.7 }, { month: 'Sep', value: 4.4 }, { month: 'Oct', value: 8.1 },
  { month: 'Nov', value: 11.3 }, { month: 'Dec', value: 18.6 }, { month: 'Jan', value: 19.7 },
  { month: 'Feb', value: 21.7 },
]
const coVolData = [
  { month: 'Jul', value: 0.6 }, { month: 'Aug', value: 2.7 }, { month: 'Sep', value: 4.8 },
  { month: 'Oct', value: 8.8 }, { month: 'Nov', value: 12.4 }, { month: 'Dec', value: 19.9 },
  { month: 'Jan', value: 19.5 }, { month: 'Feb', value: 24.8 },
]
const mauConfig = { value: { label: 'MAUs (thousands)', color: C.cactus } } satisfies ChartConfig
const volConfig = { value: { label: 'Volume ($M)', color: C.turquoise } } satisfies ChartConfig

function SlideGrowth() {
  return (
    <div className="relative h-full w-full bg-slate-950 flex flex-col overflow-x-hidden overflow-y-auto">
      <div className="absolute top-[5%] right-[3%] w-[120px] lg:w-[170px] opacity-[0.06] rotate-6 pointer-events-none" style={{ animation: 'ds-drift 9s ease-in-out infinite' }}><Illo src="Rocket%20Launch%20-%20Growth%20%2B%20Coin%20-%20Turquoise.svg" /></div>
      <div className="flex-1 flex flex-col items-center justify-center px-10 sm:px-14 lg:px-20 py-8 relative z-10">
        <div className="w-full max-w-[1200px]">
          <div className="mb-5"><PillBadge dark>Growth</PillBadge></div>
          <h1 className="font-display font-black text-linen text-3xl sm:text-4xl lg:text-5xl leading-[0.95] tracking-tight mb-2">Two Corridors, Two Paths to&nbsp;Growth</h1>
          <p className="text-linen/60 text-lg mb-6">Colombia is the breakout corridor with ~22k MAUs and $25M&nbsp;volume</p>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-5">
            {/* MAU Chart */}
            <div className="bg-white/5 rounded-2xl p-5 border border-white/10">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-display font-bold text-linen text-base">Colombia MAUs</h3>
                <span className="font-display font-black text-2xl" style={{ color: C.cactus }}>21.7k</span>
              </div>
              <ChartContainer config={mauConfig} className="h-[160px] w-full [&_.recharts-cartesian-axis-tick_text]:text-[9px] [&_.recharts-cartesian-axis-tick_text]:fill-white/50">
                <BarChart data={coMauData} barSize={24}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                  <XAxis dataKey="month" tickLine={false} axisLine={false} stroke="rgba(255,255,255,0.3)" />
                  <YAxis tickLine={false} axisLine={false} width={28} stroke="rgba(255,255,255,0.3)" />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="value" fill={C.cactus} radius={[4, 4, 0, 0]} />
                </BarChart>
              </ChartContainer>
            </div>

            {/* Volume Chart */}
            <div className="bg-white/5 rounded-2xl p-5 border border-white/10">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-display font-bold text-linen text-base">Colombia Volume</h3>
                <span className="font-display font-black text-2xl" style={{ color: C.turquoise }}>$24.8M</span>
              </div>
              <ChartContainer config={volConfig} className="h-[160px] w-full [&_.recharts-cartesian-axis-tick_text]:text-[9px] [&_.recharts-cartesian-axis-tick_text]:fill-white/50">
                <BarChart data={coVolData} barSize={24}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                  <XAxis dataKey="month" tickLine={false} axisLine={false} stroke="rgba(255,255,255,0.3)" />
                  <YAxis tickLine={false} axisLine={false} width={28} stroke="rgba(255,255,255,0.3)" />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="value" fill={C.turquoise} radius={[4, 4, 0, 0]} />
                </BarChart>
              </ChartContainer>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="bg-white/5 rounded-xl p-4 border border-white/10 text-center">
              <p className="font-display font-black text-2xl text-linen">~22k</p>
              <p className="text-sm text-linen/50">Colombia MAUs</p>
            </div>
            <div className="bg-white/5 rounded-xl p-4 border border-white/10 text-center">
              <p className="font-display font-black text-2xl" style={{ color: C.cactus }}>+6%</p>
              <p className="text-sm text-linen/50">Market share</p>
            </div>
            <div className="bg-white/5 rounded-xl p-4 border border-white/10 text-center">
              <p className="font-display font-black text-2xl text-linen">&lt;1k</p>
              <p className="text-sm text-linen/50">RD MAUs (early stage)</p>
            </div>
          </div>
        </div>
      </div>
      <SlideFooter num={8} dark />
    </div>
  )
}

/* ── Slide 9: Colombia Frictions ────────────────────────── */
function SlideFrictions() {
  const frictions = [
    { label: 'Monthly Churn', detail: 'CO consistently +50% higher CAC', color: C.papaya, icon: TrendUp },
    { label: 'Blended CAC', detail: 'Elevated vs other corridors', color: C.mango, icon: CurrencyDollar },
    { label: 'Funnel Analysis', detail: 'Confirm beneficiary info: 12pp vs 7pp drop-off', color: C.blueberry, icon: ChartLineUp },
    { label: 'Remittance Speed', detail: '+40% transactions >10 min', color: C.papaya, icon: Timer },
  ]
  return (
    <div className="relative h-full w-full bg-stone flex flex-col overflow-x-hidden overflow-y-auto">
      <div className="absolute bottom-[6%] left-[3%] w-[110px] lg:w-[150px] opacity-[0.1] -rotate-12 pointer-events-none" style={{ animation: 'ds-float 8s ease-in-out infinite' }}><Illo src="Attention.svg" /></div>
      <div className="flex-1 flex flex-col items-center justify-center px-10 sm:px-14 lg:px-20 py-8 relative z-10">
        <div className="w-full max-w-[1200px]">
          <div className="mb-5"><PillBadge>Colombia</PillBadge></div>
          <h1 className="font-display font-black text-foreground text-3xl sm:text-4xl lg:text-5xl leading-[0.95] tracking-tight mb-2">Scaling, But Key Frictions&nbsp;Remain</h1>
          <p className="text-muted-foreground text-lg mb-6">M1 retention ~10pp lower than other corridors</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-5">
            {frictions.map((f) => {
              const Icon = f.icon
              return (
                <div key={f.label} className="bg-white rounded-2xl p-6 border border-border shadow-sm" style={{ borderTopWidth: 3, borderTopColor: f.color }}>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${f.color}20` }}>
                      <Icon size={22} style={{ color: C.evergreen }} />
                    </div>
                    <h3 className="font-display font-bold text-foreground text-lg">{f.label}</h3>
                  </div>
                  <p className="text-base text-muted-foreground leading-relaxed">{f.detail}</p>
                </div>
              )
            })}
          </div>

          <div className="bg-white rounded-2xl p-6 border border-border shadow-sm" style={{ borderLeftWidth: 4, borderLeftColor: C.papaya }}>
            <p className="text-base text-muted-foreground"><strong className="text-foreground">Key insight:</strong> Colombia is scaling fast, but unit economics and retention need targeted intervention to sustain&nbsp;growth.</p>
          </div>
        </div>
      </div>
      <SlideFooter num={9} />
    </div>
  )
}

/* ── Slide 10: Bre-B ────────────────────────────────────── */
function SlideBreB() {
  const stats = [
    { value: '+100M', label: 'Llaves registered' },
    { value: '+3M', label: 'Merchants' },
    { value: '+35M', label: 'Adults with llave' },
    { value: '+5.7M', label: 'Daily transactions' },
  ]
  return (
    <div className="relative h-full w-full bg-slate-950 flex flex-col overflow-x-hidden overflow-y-auto">
      <div className="absolute top-[5%] left-[3%] w-[110px] lg:w-[150px] opacity-[0.06] -rotate-12 pointer-events-none" style={{ animation: 'ds-float 8s ease-in-out infinite' }}><Illo src="Hand%20-%20Cell%20Phone%20-%20F%C3%A9lix%20WA.svg" /></div>
      <div className="flex-1 flex flex-col items-center justify-center px-10 sm:px-14 lg:px-20 py-8 relative z-10">
        <div className="w-full max-w-[1200px]">
          <div className="mb-5"><PillBadge dark>Colombia</PillBadge></div>
          <h1 className="font-display font-black text-linen text-3xl sm:text-4xl lg:text-5xl leading-[0.95] tracking-tight mb-2">Bre-B: Digital Payments Inflection&nbsp;Point</h1>
          <p className="text-linen/60 text-lg mb-8">S-curve adoption approaching mainstream&nbsp;breakout</p>

          {/* Adoption S-curve visual */}
          <div className="bg-white/5 rounded-2xl p-6 border border-white/10 mb-5">
            <div className="flex items-center gap-4 mb-6">
              <div className="flex-1 h-4 rounded-full bg-white/10 relative overflow-hidden">
                <div className="h-full rounded-full" style={{ width: '62%', background: `linear-gradient(90deg, ${C.cactus}, ${C.turquoise})` }} />
              </div>
              <span className="text-sm font-bold text-turquoise whitespace-nowrap">Approaching inflection</span>
            </div>
            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="rounded-lg p-3 bg-white/5 border border-white/10">
                <p className="text-xs text-linen/40 uppercase tracking-wider mb-1">Early Adopters</p>
                <p className="text-sm text-linen/60">2019 &ndash; 2022</p>
              </div>
              <div className="rounded-lg p-3 border-2" style={{ borderColor: C.turquoise, background: `${C.turquoise}10` }}>
                <p className="text-xs uppercase tracking-wider mb-1" style={{ color: C.turquoise }}>Growth Phase</p>
                <p className="text-sm text-linen/80 font-bold">2023 &ndash; Now</p>
              </div>
              <div className="rounded-lg p-3 bg-white/5 border border-white/10">
                <p className="text-xs text-linen/40 uppercase tracking-wider mb-1">Mainstream</p>
                <p className="text-sm text-linen/60">Next 2&ndash;3 years</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-5">
            {stats.map((s) => (
              <div key={s.label} className="bg-white/5 rounded-xl p-4 border border-white/10 text-center">
                <p className="font-display font-black text-2xl text-turquoise">{s.value}</p>
                <p className="text-xs text-linen/50 mt-1">{s.label}</p>
              </div>
            ))}
          </div>

          <div className="bg-white/5 rounded-2xl p-5 border border-white/10" style={{ borderLeftWidth: 3, borderLeftColor: C.cactus }}>
            <p className="text-base text-linen/70"><strong className="text-linen font-display font-bold">Mandar con Bre-B</strong> &mdash; Future enables sending a remittance to a llave, unlocking instant payout infrastructure for&nbsp;Felix.</p>
          </div>
        </div>
      </div>
      <SlideFooter num={10} dark />
    </div>
  )
}

/* ── Slide 11: RD Preparing ─────────────────────────────── */
function SlideRdPreparing() {
  return (
    <div className="relative h-full w-full bg-stone flex flex-col overflow-x-hidden overflow-y-auto">
      <div className="absolute bottom-[5%] right-[3%] w-[110px] lg:w-[150px] opacity-[0.1] rotate-6 pointer-events-none" style={{ animation: 'ds-drift 9s ease-in-out infinite' }}><Illo src="Rocket%20Launch%20%2B%20Coin%20-%20Growth%20-%20Lime.svg" /></div>
      <div className="flex-1 flex flex-col items-center justify-center px-10 sm:px-14 lg:px-20 py-8 relative z-10">
        <div className="w-full max-w-[1200px]">
          <div className="mb-5"><PillBadge>Rep. Dominicana</PillBadge></div>
          <h1 className="font-display font-black text-foreground text-3xl sm:text-4xl lg:text-5xl leading-[0.95] tracking-tight mb-2">Preparing For Blast&nbsp;Off</h1>
          <p className="text-muted-foreground text-lg mb-8">Product fixes already showing early&nbsp;results</p>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Dual Currency Fix */}
            <div className="bg-white rounded-2xl p-7 border border-border shadow-sm" style={{ borderTopWidth: 4, borderTopColor: C.cactus }}>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${C.cactus}20` }}>
                  <Wallet size={22} style={{ color: C.evergreen }} />
                </div>
                <h3 className="font-display font-bold text-foreground text-lg">Dual Currency Flow Fix</h3>
              </div>
              <p className="text-base text-muted-foreground leading-relaxed mb-5">Allowing users to send in both USD and DOP resolves a core friction in the DR&nbsp;corridor.</p>
              <div className="flex items-center gap-4">
                <div className="flex-1 bg-foreground/5 rounded-xl p-4 text-center">
                  <p className="font-display font-black text-3xl" style={{ color: C.cactus }}>59%</p>
                  <p className="text-xs text-muted-foreground mt-1">DR users converted</p>
                </div>
                <div className="text-muted-foreground text-lg">vs</div>
                <div className="flex-1 bg-foreground/5 rounded-xl p-4 text-center">
                  <p className="font-display font-black text-3xl text-muted-foreground">51%</p>
                  <p className="text-xs text-muted-foreground mt-1">Other countries</p>
                </div>
              </div>
            </div>

            {/* Funnel Analysis */}
            <div className="bg-white rounded-2xl p-7 border border-border shadow-sm" style={{ borderTopWidth: 4, borderTopColor: C.blueberry }}>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${C.blueberry}20` }}>
                  <ChartLineUp size={22} style={{ color: C.evergreen }} />
                </div>
                <h3 className="font-display font-bold text-foreground text-lg">Funnel Improvements</h3>
              </div>
              <p className="text-base text-muted-foreground leading-relaxed mb-5">Key optimizations targeting the onboarding and first-send funnels for DR&nbsp;users.</p>
              <ul className="space-y-3">
                {['Simplified beneficiary onboarding', 'Streamlined KYC for DR corridor', 'Improved payout method selection UX'].map((item) => (
                  <li key={item} className="flex items-start gap-2.5">
                    <CheckCircle2 className="h-5 w-5 flex-shrink-0 mt-0.5 text-foreground/30" strokeWidth={1.5} />
                    <span className="text-base text-muted-foreground leading-snug">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
      <SlideFooter num={11} />
    </div>
  )
}

/* ── Slide 12: Partnership ──────────────────────────────── */
function SlidePartnership() {
  const phases = [
    { phase: 'Phase 1', date: 'April 14\u201316', color: C.cactus, items: ['Direct integration with Caribe Express', 'Felix Request feature launch'] },
    { phase: 'Phase 2', date: '~End Q2', color: C.sky, items: ['Cash pickup activation', 'Social media co-branding', 'Joint PR push'] },
    { phase: 'Phase 3', date: 'TBD', color: C.mango, items: ['Activate sender-initiated home delivery'] },
  ]
  return (
    <div className="relative h-full w-full bg-slate-950 flex flex-col overflow-x-hidden overflow-y-auto">
      <div className="absolute bottom-[6%] right-[4%] w-[110px] lg:w-[150px] opacity-[0.05] rotate-6 pointer-events-none" style={{ animation: 'ds-drift 10s ease-in-out infinite' }}><Illo src="Hands%20-%202%20Cell%20Phones%20-%20Love.svg" /></div>
      <div className="flex-1 flex flex-col items-center justify-center px-10 sm:px-14 lg:px-20 py-8 relative z-10">
        <div className="w-full max-w-[1200px]">
          <div className="mb-5"><PillBadge dark>Partnership</PillBadge></div>
          <h1 className="font-display font-black text-linen text-3xl sm:text-4xl lg:text-5xl leading-[0.95] tracking-tight mb-2">The Biggest Unlock: Caribe&nbsp;Express</h1>
          <p className="text-linen/60 text-lg mb-2">&ldquo;Establecer La Confianza&rdquo;</p>
          <p className="text-linen/40 text-sm mb-8">~1 of 2 remittances flow through Caribe Express &middot; Affiliate of Caribe Tours &middot; +200&nbsp;branches</p>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-5">
            {phases.map((p) => (
              <div key={p.phase} className="bg-white/5 rounded-2xl p-6 border border-white/10" style={{ borderTopWidth: 4, borderTopColor: p.color }}>
                <div className="mb-4">
                  <h3 className="font-display font-extrabold text-xl" style={{ color: p.color }}>{p.phase}</h3>
                  <p className="text-sm text-linen/50">{p.date}</p>
                </div>
                <ul className="space-y-3">
                  {p.items.map((item) => (
                    <li key={item} className="flex items-start gap-2.5">
                      <CheckCircle2 className="h-5 w-5 flex-shrink-0 mt-0.5 text-turquoise/40" strokeWidth={1.5} />
                      <span className="text-base text-linen/70 leading-snug">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="bg-white/5 rounded-2xl p-5 border border-white/10 flex items-center gap-4">
            <Handshake size={28} style={{ color: C.turquoise }} />
            <p className="text-base text-linen/60">This partnership unlocks the cash pickup channel that ~70% of DR recipients prefer, establishing trust with the largest payout&nbsp;player.</p>
          </div>
        </div>
      </div>
      <SlideFooter num={12} dark />
    </div>
  )
}

/* ── Slide 13: City Launcher ────────────────────────────── */
function SlideCityLauncher() {
  const colombianCities = [
    { city: 'Dallas', pop: '~31k' },
    { city: 'Phoenix', pop: '~15k' },
    { city: 'Orlando', pop: '~150k' },
    { city: 'Atlanta', pop: '~20k' },
    { city: 'Los Angeles', pop: '~30k' },
  ]
  const dominicanCities = [
    { city: 'Lawrence, MA', pop: '~48k' },
    { city: 'Orlando', pop: '~60k' },
    { city: 'Providence, RI', pop: '~34k' },
  ]
  const growthPlan = [
    'Monthly activations', 'Local partners', 'Super Ambassador program',
    'Felix Kit distribution', 'Digital community building', 'Local print media',
    'Growth experiments', 'Reporting & analytics',
  ]
  return (
    <div className="relative h-full w-full bg-stone flex flex-col overflow-x-hidden overflow-y-auto">
      <div className="absolute top-[5%] left-[3%] w-[100px] lg:w-[140px] opacity-[0.1] -rotate-6 pointer-events-none" style={{ animation: 'ds-float 8s ease-in-out infinite' }}><Illo src="Map%20Marker.svg" /></div>
      <div className="flex-1 flex flex-col items-center justify-center px-10 sm:px-14 lg:px-20 py-8 relative z-10">
        <div className="w-full max-w-[1200px]">
          <div className="mb-5"><PillBadge>Growth</PillBadge></div>
          <h1 className="font-display font-black text-foreground text-3xl sm:text-4xl lg:text-5xl leading-[0.95] tracking-tight mb-2">Community-Based Growth: City&nbsp;Launcher</h1>
          <p className="text-muted-foreground text-lg mb-6">Small teams of 2&ndash;3 college students in high-diaspora&nbsp;cities</p>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-5">
            {/* Colombian Cities */}
            <div className="bg-white rounded-2xl p-6 border border-border shadow-sm" style={{ borderTopWidth: 3, borderTopColor: C.mango }}>
              <div className="flex items-center gap-2 mb-4">
                <Illo src="Flag%20OG%20-%20Colombia.svg" className="w-6 h-6" />
                <h3 className="font-display font-bold text-foreground text-lg">Colombian Diaspora</h3>
              </div>
              <div className="space-y-2">
                {colombianCities.map((c) => (
                  <div key={c.city} className="flex items-center justify-between bg-foreground/[0.03] rounded-lg px-4 py-2.5">
                    <div className="flex items-center gap-2">
                      <MapPin size={16} style={{ color: C.evergreen }} />
                      <span className="text-sm font-medium text-foreground">{c.city}</span>
                    </div>
                    <span className="text-sm text-muted-foreground">{c.pop}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Dominican Cities */}
            <div className="bg-white rounded-2xl p-6 border border-border shadow-sm" style={{ borderTopWidth: 3, borderTopColor: C.blueberry }}>
              <div className="flex items-center gap-2 mb-4">
                <Illo src="Flag%20OG%20-%20Republica%20Dominicana.svg" className="w-6 h-6" />
                <h3 className="font-display font-bold text-foreground text-lg">Dominican Diaspora</h3>
              </div>
              <div className="space-y-2">
                {dominicanCities.map((c) => (
                  <div key={c.city} className="flex items-center justify-between bg-foreground/[0.03] rounded-lg px-4 py-2.5">
                    <div className="flex items-center gap-2">
                      <MapPin size={16} style={{ color: C.evergreen }} />
                      <span className="text-sm font-medium text-foreground">{c.city}</span>
                    </div>
                    <span className="text-sm text-muted-foreground">{c.pop}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Growth Plan */}
          <div className="bg-white rounded-2xl p-6 border border-border shadow-sm" style={{ borderBottomWidth: 3, borderBottomColor: C.cactus }}>
            <h3 className="font-display font-bold text-foreground text-base mb-3">Growth Plan Elements</h3>
            <div className="flex flex-wrap gap-2">
              {growthPlan.map((item) => (
                <span key={item} className="text-sm font-medium px-3 py-1.5 rounded-lg bg-foreground/[0.04] border border-border text-foreground">{item}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
      <SlideFooter num={13} />
    </div>
  )
}

/* ── Slide 14: Close ────────────────────────────────────── */
function SlideClose() {
  return (
    <div className="relative h-full w-full bg-slate-950 flex flex-col overflow-x-hidden overflow-y-auto">
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute top-[8%] left-[5%] w-[100px] lg:w-[140px] opacity-[0.06] -rotate-12" style={{ animation: 'ds-float 7s ease-in-out infinite' }}><Illo src="Hand%20-%20Stars.svg" /></div>
        <div className="absolute bottom-[10%] right-[5%] w-[120px] lg:w-[160px] opacity-[0.05] rotate-6" style={{ animation: 'ds-drift 9s ease-in-out infinite 1s' }}><Illo src="Heart%20-F%C3%A9lix.svg" /></div>
        <div className="absolute top-[15%] right-[8%] w-[90px] lg:w-[120px] opacity-[0.05] rotate-3" style={{ animation: 'ds-float 10s ease-in-out infinite 2s' }}><Illo src="Flag%203d%20CO.svg" /></div>
        <div className="absolute bottom-[15%] left-[8%] w-[90px] lg:w-[120px] opacity-[0.05] -rotate-3" style={{ animation: 'ds-drift 8s ease-in-out infinite 1s' }}><Illo src="Flag%203d%20RD.svg" /></div>
      </div>
      <div className="flex-1 flex flex-col items-center justify-center px-8 sm:px-12 lg:px-16 py-10 relative z-10">
        <h1 className="font-display font-black text-linen text-6xl sm:text-7xl lg:text-8xl xl:text-9xl leading-[0.95] tracking-tight mb-4">Muchas gracias</h1>
        <p className="text-lg sm:text-xl text-linen/40">#JuntosWeSucceed</p>
      </div>
      <SlideFooter num={14} dark />
    </div>
  )
}

/* ═══════════════════════════════════════ SHELL ════════════ */

const slides = [SlideCover, SlideJuntos, SlideQuote, SlideMarketSnapshot, SlideFxVolatility, SlideDiaspora, SlideMoneyMoves, SlideGrowth, SlideFrictions, SlideBreB, SlideRdPreparing, SlidePartnership, SlideCityLauncher, SlideClose]
const darkSlideSet = new Set([0, 1, 3, 5, 7, 9, 11, 13])
const slideMeta = [
  { title: 'A Tale of Two Markets', subtitle: 'Cover' },
  { title: '#JuntosWeSucceed', subtitle: 'Title Card' },
  { title: 'But We Are Not the Same', subtitle: 'Quote' },
  { title: 'Remittance Markets', subtitle: 'Market Snapshot' },
  { title: 'FX Volatility', subtitle: 'FX Analysis' },
  { title: 'Diaspora Comparison', subtitle: 'Diaspora' },
  { title: 'How Money Moves', subtitle: 'Infrastructure' },
  { title: 'Growth Metrics', subtitle: 'Growth' },
  { title: 'Colombia Frictions', subtitle: 'Colombia' },
  { title: 'Bre-B Inflection Point', subtitle: 'Colombia' },
  { title: 'RD Preparing', subtitle: 'Rep. Dominicana' },
  { title: 'Caribe Express Partnership', subtitle: 'Partnership' },
  { title: 'City Launcher', subtitle: 'Growth' },
  { title: 'Muchas Gracias', subtitle: 'Close' },
]
const slideRatingStubs: SlideData[] = slides.map((_, i) => ({ type: 'bullets' as const, bg: darkSlideSet.has(i) ? 'dark' as const : 'light' as const, title: slideMeta[i]?.title ?? '', bullets: [] }))

export default function QbrCordPage() {
  const [current, setCurrent] = useState(0)
  const [mounted, setMounted] = useState(false)
  const [tocOpen, setTocOpen] = useState(false)
  const [tocView, setTocView] = useState<'list' | 'cards'>('list')
  const { comments, commentMode, setCommentMode, addComment, deleteComment, editComment, flagComment, resolveComment, addReply, deleteReply } = useComments('qbr-cord-comments')
  const { progress: pdfProgress, download: downloadPdf, cancel: cancelPdf } = useSlidePdf('qbr-cord.pdf')
  const { locale, setLocale } = useLocale()
  const slideRef = useRef<HTMLDivElement>(null)
  useSlideTranslation(slideRef, locale, current)
  const total = slides.length

  useEffect(() => { setMounted(true); const h = window.location.hash; if (h) { const n = parseInt(h.replace('#slide-', ''), 10); if (!isNaN(n) && n >= 0 && n < total) setCurrent(n) } }, [total])
  useEffect(() => { if (mounted) window.history.replaceState(null, '', `#slide-${current}`) }, [current, mounted])

  const next = useCallback(() => setCurrent((p) => Math.min(p + 1, total - 1)), [total])
  const prev = useCallback(() => setCurrent((p) => Math.max(p - 1, 0)), [])

  useEffect(() => {
    if (!mounted) return
    const handler = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement | null
      if (t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA')) return
      if (e.key === 'Escape' && tocOpen) { e.preventDefault(); setTocOpen(false); return }
      if (e.key === 'Escape' && commentMode) { e.preventDefault(); setCommentMode(false); return }
      if (e.key === 'c' || e.key === 'C') { e.preventDefault(); setCommentMode(m => !m); return }
      if (tocOpen || commentMode) return
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown' || e.key === ' ') { e.preventDefault(); next() }
      else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') { e.preventDefault(); prev() }
      else if (e.key === 'Home') { e.preventDefault(); setCurrent(0) }
      else if (e.key === 'End') { e.preventDefault(); setCurrent(total - 1) }
    }
    window.addEventListener('keydown', handler, true)
    return () => window.removeEventListener('keydown', handler, true)
  }, [mounted, total, next, prev, tocOpen])

  const [touchX, setTouchX] = useState<number | null>(null)
  const handleTouchStart = (e: React.TouchEvent) => setTouchX(e.targetTouches[0].clientX)
  const handleTouchEnd = (e: React.TouchEvent) => { if (touchX === null) return; const diff = touchX - e.changedTouches[0].clientX; if (diff > 50) next(); else if (diff < -50) prev(); setTouchX(null) }

  const Slide = slides[current]
  const isDark = darkSlideSet.has(current)
  const pillBg = isDark ? 'bg-white/10 border-white/10' : 'bg-white/90 border-border shadow-xs'
  const pillText = isDark ? 'text-white/70' : 'text-foreground'
  const hintText = isDark ? 'text-white/40' : 'text-muted-foreground'
  const trackBg = isDark ? 'bg-white/10' : 'bg-concrete/30'
  const trackFill = isDark ? 'bg-turquoise-400' : 'bg-turquoise-600'
  const dotActive = isDark ? 'bg-turquoise-400' : 'bg-turquoise-600'
  const dotInactive = isDark ? 'bg-white/20 hover:bg-white/30' : 'bg-concrete hover:bg-concrete/70'
  const btnCls = isDark ? 'bg-white/10 border-white/10 hover:bg-white/20' : 'bg-white/90 border-border hover:bg-white hover:shadow-md'
  const btnIcon = isDark ? 'text-white/70' : 'text-foreground'

  return (
    <>
    <div className="h-screen w-screen overflow-hidden relative select-none" onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
      <div className={`absolute top-0 inset-x-0 h-1 z-50 transition-colors duration-500 ${trackBg}`}><div className={`h-full transition-all duration-500 ease-out ${trackFill}`} style={{ width: `${((current + 1) / total) * 100}%` }} /></div>
      <div className="absolute top-4 left-4 sm:top-6 sm:left-6 z-50"><div className={`px-3 py-1.5 backdrop-blur-sm rounded-full border transition-colors duration-500 ${pillBg}`}><span className={`text-xs sm:text-sm font-medium transition-colors duration-500 ${pillText}`}>{current + 1} / {total}</span></div></div>
      <SlideTocChrome tocOpen={tocOpen} onToggle={() => setTocOpen(!tocOpen)} tocView={tocView} onViewChange={setTocView} pillBg={pillBg} pillText={pillText} hintText={hintText} onReset={() => setCurrent(0)} commentMode={commentMode} onToggleComments={() => setCommentMode(!commentMode)} locale={locale} onLocaleChange={setLocale} onDownloadPdf={() => downloadPdf({ slideRef, total, currentSlide: current, goToSlide: setCurrent })} />
      <div ref={slideRef} className="group/slide h-full w-full relative" key={current}>
        <div className="h-full w-full animate-in fade-in duration-300"><Slide /></div>
        <SlideCommentLayer slideIndex={current} commentMode={commentMode} comments={comments} onAddComment={addComment} onEditComment={editComment} onDeleteComment={deleteComment} onFlagComment={flagComment} onResolveComment={(id, resolved) => resolveComment(id, resolved)} onAddReply={addReply} onDeleteReply={deleteReply} onExitCommentMode={() => setCommentMode(false)} />
        <div className="absolute bottom-12 right-6 z-[60] opacity-0 group-hover/slide:opacity-100 transition-opacity duration-200"><SlideRating slide={slideRatingStubs[current]} slideIndex={current} source="qbr-cord" dark={darkSlideSet.has(current)} /></div>
      </div>
      <div className="absolute bottom-10 sm:bottom-12 left-1/2 -translate-x-1/2 z-50 flex gap-2">{slides.map((_, i) => <button key={i} onClick={() => setCurrent(i)} className={`h-1.5 sm:h-2 rounded-full transition-all duration-300 ${current === i ? `w-8 sm:w-12 ${dotActive}` : `w-1.5 sm:w-2 ${dotInactive}`}`} aria-label={`Go to slide ${i + 1}`} />)}</div>
      <button onClick={prev} disabled={current === 0} className={`hidden md:flex absolute left-4 sm:left-8 top-1/2 -translate-y-1/2 z-[100] p-3 rounded-full backdrop-blur-sm border transition-all duration-500 ${btnCls} ${current === 0 ? 'opacity-0 pointer-events-none' : ''}`} aria-label="Previous slide" type="button"><svg className={`w-5 h-5 transition-colors duration-500 ${btnIcon}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg></button>
      <button onClick={next} disabled={current === total - 1} className={`hidden md:flex absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 z-[100] p-3 rounded-full backdrop-blur-sm border transition-all duration-500 ${btnCls} ${current === total - 1 ? 'opacity-0 pointer-events-none' : ''}`} aria-label="Next slide" type="button"><svg className={`w-5 h-5 transition-colors duration-500 ${btnIcon}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg></button>
      <div className="md:hidden absolute bottom-20 left-1/2 -translate-x-1/2 z-40"><div className={`px-3 py-1.5 backdrop-blur-sm rounded-full border transition-colors duration-500 ${pillBg}`}><span className={`text-xs transition-colors duration-500 ${hintText}`}>Swipe to navigate</span></div></div>
      <SlideToc open={tocOpen} onClose={() => setTocOpen(false)} slides={slides} slideMeta={slideMeta} darkSlideSet={darkSlideSet} current={current} view={tocView} onSelect={(i) => { setCurrent(i); setTocOpen(false) }} />
      <SlidePreTranslator slides={slides} locale={locale} />
      <SlidePdfOverlay progress={pdfProgress} onCancel={cancelPdf} />
    </div>
    </>
  )
}
