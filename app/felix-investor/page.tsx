'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { SlideToc, SlideTocChrome } from '@/components/slide-toc'
import { useComments, SlideCommentLayer } from '@/components/slide-comments'
import { useLocale, useSlideTranslation, SlidePreTranslator } from '@/components/slide-translation'
import { PresentationPassword } from '@/components/presentation-password'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  AreaChart, Area, ComposedChart, Line,
  LineChart, ResponsiveContainer,
  Cell, PieChart, Pie,
} from 'recharts'
import {
  ChartContainer, ChartTooltip, ChartTooltipContent,
  ChartLegend, ChartLegendContent,
  type ChartConfig,
} from '@/components/ui/chart'

/* ─────────────────────── Brand Colors ─────────────────────── */

const C = {
  turquoise: '#2BF2F1',
  slate: '#082422',
  blueberry: '#6060BF',
  evergreen: '#35605F',
  cactus: '#60D06F',
  mango: '#F19D38',
  papaya: '#F26629',
  sage: '#7BA882',
  lime: '#DCFF00',
  lychee: '#FFCD9C',
  sky: '#8DFDFA',
  stone: '#EFEBE7',
  concrete: '#CFCABF',
  mocha: '#877867',
}

/* ─────────────────────── Shared Utilities ─────────────────────── */

function Illo({ src, className, label }: { src: string; className?: string; label?: string }) {
  return (
    <object
      type="image/svg+xml"
      data={`/illustrations/${src}`}
      className={className ?? 'w-full h-auto'}
      style={{ pointerEvents: 'none' }}
      aria-label={label}
      aria-hidden={!label}
    />
  )
}

function SlideFooter({ num, total, dark }: { num: number; total: number; dark?: boolean }) {
  return (
    <div className="absolute bottom-0 inset-x-0 px-8 sm:px-12 pb-5 sm:pb-6 text-sm font-sans">
      <div className="relative flex items-center justify-between">
        <span className={`font-display font-extrabold text-xs sm:text-sm ${dark ? 'text-white/60' : 'text-foreground'}`}>Félix Pago</span>
        <span className={`absolute inset-x-0 text-center text-xs sm:text-sm pointer-events-none ${dark ? 'text-white/30' : 'text-muted-foreground'}`}>Confidential</span>
        <span className={`text-xs sm:text-sm font-medium ${dark ? 'text-white/60' : 'text-foreground'}`}>{num}</span>
      </div>
    </div>
  )
}

function Pill({ children, dark, brand }: { children: React.ReactNode; dark?: boolean; brand?: boolean }) {
  const cls = brand
    ? 'bg-slate/15 text-slate'
    : dark
    ? 'bg-white/10 text-white/70'
    : 'bg-turquoise/20 text-evergreen'
  return (
    <span className={`inline-block rounded-full px-4 py-1.5 text-xs font-bold tracking-wide uppercase mb-3 w-fit ${cls}`}>
      {children}
    </span>
  )
}

function StatCard({ value, label, sub, dark }: { value: string; label: string; sub?: string; dark?: boolean }) {
  return (
    <div className={`rounded-2xl p-5 sm:p-6 border flex flex-col gap-1 ${dark ? 'bg-white/5 border-white/10' : 'bg-white border-border shadow-sm'}`}>
      <span className={`font-display font-black text-3xl sm:text-4xl lg:text-5xl leading-none ${dark ? 'text-turquoise' : 'text-evergreen'}`}>{value}</span>
      <span className={`text-sm font-semibold leading-snug ${dark ? 'text-white' : 'text-foreground'}`}>{label}</span>
      {sub && <span className={`text-xs leading-snug ${dark ? 'text-white/40' : 'text-muted-foreground'}`}>{sub}</span>}
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════ */
/*                     SLIDE COMPONENTS                        */
/* ═══════════════════════════════════════════════════════════ */

/* ── Slide 1: Cover ───────────────────────────────────────── */
function SlideCover() {
  return (
    <div className="relative h-full w-full bg-slate flex flex-col overflow-hidden">
      {/* Floating illustration accents */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute top-[8%] left-[3%] w-[180px] lg:w-[240px] opacity-[0.12] -rotate-12" style={{ animation: 'ds-float 7s ease-in-out infinite' }}>
          <object type="image/svg+xml" data="/illustrations/Flying%20Dollar%20Bills%20-%20Turquoise.svg" className="w-full h-auto" style={{ pointerEvents: 'none' }} />
        </div>
        <div className="absolute top-[10%] right-[28%] w-[80px] lg:w-[110px] opacity-[0.12] rotate-6" style={{ animation: 'ds-drift 9s ease-in-out infinite 1s' }}>
          <object type="image/svg+xml" data="/illustrations/Cloud%20Coin%20-%20Turquoise.svg" className="w-full h-auto" style={{ pointerEvents: 'none' }} />
        </div>
        <div className="absolute top-[22%] right-[2%] w-[140px] lg:w-[190px] opacity-[0.1] rotate-[18deg]" style={{ animation: 'ds-float 8s ease-in-out infinite 2s' }}>
          <object type="image/svg+xml" data="/illustrations/Dollar%20bill.svg" className="w-full h-auto" style={{ pointerEvents: 'none' }} />
        </div>
        <div className="absolute bottom-[8%] left-[38%] w-[200px] lg:w-[280px] opacity-[0.1] rotate-3" style={{ animation: 'ds-float 10s ease-in-out infinite 1.5s' }}>
          <object type="image/svg+xml" data="/illustrations/Dollar%20bills%20%2B%20Coins%20A.svg" className="w-full h-auto" style={{ pointerEvents: 'none' }} />
        </div>
        <div className="absolute bottom-[12%] right-[6%] w-[120px] lg:w-[160px] opacity-[0.08] -rotate-6" style={{ animation: 'ds-drift 8s ease-in-out infinite 3s' }}>
          <object type="image/svg+xml" data="/illustrations/Cloud%20Coin%20-%20Turquoise.svg" className="w-full h-auto" style={{ pointerEvents: 'none' }} />
        </div>
        <div className="absolute top-[50%] left-[6%] w-[40px] opacity-[0.18] rotate-12" style={{ animation: 'ds-float 6s ease-in-out infinite' }}>
          <object type="image/svg+xml" data="/illustrations/Coin%20-%20Lime.svg" className="w-full h-auto" style={{ pointerEvents: 'none' }} />
        </div>
      </div>

      <div className="flex-1 flex items-center px-10 sm:px-16 lg:px-24 py-10 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-20 w-full max-w-[1400px] mx-auto">
          {/* Left — brand + headline */}
          <div className="flex flex-col justify-center">
            <div className="mb-6 lg:mb-8 w-[110px] h-[110px] sm:w-[130px] sm:h-[130px] lg:w-[160px] lg:h-[160px]">
              <object type="image/svg+xml" data="/illustrations/F%C3%A9lix%20Illo%201.svg" className="h-full w-full" style={{ pointerEvents: 'none' }} aria-label="Félix mascot" />
            </div>
            <div className="mb-4 lg:mb-5">
              <span className="inline-block rounded-full bg-turquoise/15 border border-turquoise/20 px-4 py-1.5 text-xs font-bold tracking-wider uppercase text-turquoise">
                Series B — Investor Deck
              </span>
            </div>
            <h1 className="font-display font-black text-white text-5xl sm:text-6xl lg:text-7xl xl:text-[5.5rem] leading-[0.9] tracking-tight mb-5 lg:mb-7">
              Félix Pago
            </h1>
            <p className="text-lg sm:text-xl lg:text-2xl text-white/50 leading-relaxed max-w-xl">
              Conversational Finance for the New American Majority — Powered by AI&nbsp;&amp;&nbsp;Stablecoins.
            </p>
          </div>

          {/* Right — three pillars */}
          <div className="flex flex-col justify-center gap-4">
            {[
              { icon: '💬', title: 'Conversational-Native', body: 'Financial services delivered where 68M US Latinos already spend their time — WhatsApp, Instagram, TikTok, and beyond.' },
              { icon: '🤖', title: 'AI-Powered Intelligence', body: 'Proprietary AI trained on 3+ years of Latino immigrant financial behavior — handling onboarding, KYC, and underwriting conversationally.' },
              { icon: '⚡', title: 'Stablecoin Rails', body: 'Circle/USDC infrastructure enabling near-zero cost, near-instant settlement. From 5–7% fees and 5-day delays to <1% and seconds.' },
            ].map(p => (
              <div key={p.title} className="rounded-2xl bg-white/5 border border-white/10 p-5 sm:p-6 flex gap-4 items-start">
                <span className="text-2xl flex-shrink-0 mt-0.5">{p.icon}</span>
                <div>
                  <h3 className="font-display font-extrabold text-white text-base sm:text-lg mb-1">{p.title}</h3>
                  <p className="text-sm text-white/45 leading-relaxed">{p.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <SlideFooter num={1} total={TOTAL} dark />
    </div>
  )
}

/* ── Slide 2: The Hook ────────────────────────────────────── */
function SlideHook() {
  return (
    <div className="relative h-full w-full bg-stone flex flex-col overflow-hidden">
      <div className="absolute bottom-[4%] right-[3%] w-[240px] lg:w-[320px] opacity-[0.13] pointer-events-none -rotate-6" style={{ animation: 'ds-float 9s ease-in-out infinite' }}>
        <Illo src="Hands%20-%202%20Cell%20Phones%20-%20Juntos%20we%20Succeed.svg" />
      </div>

      <div className="flex-1 flex items-center px-10 sm:px-16 lg:px-24 py-10 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 w-full max-w-[1400px] mx-auto">
          {/* Left — story */}
          <div className="flex flex-col justify-center">
            <Pill>The Problem</Pill>
            <h1 className="font-display font-black text-foreground text-5xl sm:text-6xl lg:text-7xl xl:text-8xl leading-[0.9] tracking-tight mb-6 lg:mb-8">
              María sends<br />money home.
            </h1>
            <p className="text-lg sm:text-xl lg:text-2xl text-muted-foreground leading-relaxed max-w-lg">
              Every month she walks to a Western Union. Waits in line. Pays a 7% fee. Watches $14 of every $200 disappear. Her family in Guadalajara waits 2–3 days.
            </p>
          </div>

          {/* Right — insight cards */}
          <div className="flex flex-col justify-center gap-5">
            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-border shadow-sm">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-2xl">🏧</span>
                <span className="font-display font-extrabold text-foreground text-lg">The Status Quo</span>
              </div>
              <ul className="space-y-2.5">
                {[
                  '10% of US Latino households are unbanked — 3× the national average',
                  'Average remittance fee: 5–7% per transfer (World Bank, 2024)',
                  'SWIFT settlement: 2–5 business days, weekends excluded',
                  '$14 billion in fees extracted annually from Latino immigrants',
                ].map(item => (
                  <li key={item} className="flex items-start gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-papaya mt-2 flex-shrink-0" />
                    <span className="text-sm sm:text-base text-foreground/70 leading-snug">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-2xl p-6 sm:p-8 border-2 border-turquoise bg-turquoise/5">
              <p className="text-xl sm:text-2xl lg:text-[1.6rem] font-display font-black text-foreground leading-snug">
                &ldquo;The solution isn&apos;t a better app. It&apos;s meeting them where they already are — and speaking their language.&rdquo;
              </p>
              <p className="mt-3 text-sm text-muted-foreground">
                56% of US Latino adults already use WhatsApp — 2.5× the rate of non-Hispanic white Americans.
              </p>
            </div>
          </div>
        </div>
      </div>
      <SlideFooter num={2} total={TOTAL} />
    </div>
  )
}

/* ── Slide 3: The Market ──────────────────────────────────── */
const marketGrowthData = [
  { year: '2022', digital: 14.2, total: 148 },
  { year: '2023', digital: 18.1, total: 155 },
  { year: '2024', digital: 24.5, total: 161 },
  { year: '2025', digital: 29.3, total: 166 },
  { year: '2026', digital: 36.0, total: 172 },
  { year: '2028', digital: 51.0, total: 182 },
  { year: '2030', digital: 60.1, total: 195 },
]
const marketConfig = {
  digital: { label: 'Digital ($B)', color: C.turquoise },
  total: { label: 'Total Market ($B)', color: C.blueberry },
} satisfies ChartConfig

function SlideMarket() {
  return (
    <div className="relative h-full w-full flex flex-col overflow-hidden" style={{ background: C.turquoise }}>
      <div className="absolute bottom-[3%] right-[2%] w-[200px] lg:w-[280px] opacity-[0.12] pointer-events-none rotate-12" style={{ animation: 'ds-float 10s ease-in-out infinite' }}>
        <Illo src="Rocket%20Launch%20-%20Growth%20%2B%20Coin%20-%20Turquoise.svg" />
      </div>

      <div className="flex-1 flex items-center px-10 sm:px-16 lg:px-24 py-10 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-14 w-full max-w-[1400px] mx-auto">
          {/* Left — market framing */}
          <div className="flex flex-col justify-center">
            <Pill brand>Market Opportunity</Pill>
            <h1 className="font-display font-black text-slate text-5xl sm:text-6xl lg:text-7xl xl:text-8xl leading-[0.9] tracking-tight mb-6 lg:mb-8">
              A $161B<br />Trust Gateway
            </h1>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
              {[
                { label: 'TAM', value: '$161B', sub: 'LatAm remittances / yr' },
                { label: 'SAM', value: '$136B', sub: 'US-origin transfers' },
                { label: 'SOM', value: '$2B+', sub: '5-yr capture target' },
              ].map(m => (
                <div key={m.label} className="rounded-xl bg-slate/10 border border-slate/10 p-4">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate/50">{m.label}</span>
                  <div className="font-display font-black text-slate text-2xl sm:text-3xl leading-tight mt-0.5">{m.value}</div>
                  <div className="text-xs text-slate/55 mt-1">{m.sub}</div>
                </div>
              ))}
            </div>
            <div className="space-y-3">
              {[
                'Remittances as the trust gateway to the full financial stack',
                '68M US Latinos — 20% of the US population, growing fastest',
                'Digital remittance CAGR 16.7% → $60B market by 2030',
                'Conversational commerce: $11B today → $33B by 2035 (14.8% CAGR)',
              ].map(item => (
                <div key={item} className="flex items-start gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-slate/40 mt-2 flex-shrink-0" />
                  <span className="text-sm sm:text-base text-slate/70 leading-snug">{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right — growth chart */}
          <div className="flex flex-col justify-center">
            <div className="bg-slate rounded-2xl p-5 sm:p-7">
              <p className="font-display font-extrabold text-white text-base mb-1">US→LatAm Remittance Market ($B)</p>
              <p className="text-xs text-white/40 mb-4">Total flows vs. digital segment, 2022–2030E</p>
              <ChartContainer config={marketConfig} className="h-[280px] w-full [&_.recharts-cartesian-axis-tick_text]:text-[10px] [&_.recharts-cartesian-axis-tick_text]:fill-white/50">
                <ComposedChart data={marketGrowthData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" vertical={false} />
                  <XAxis dataKey="year" tickLine={false} axisLine={false} stroke="rgba(255,255,255,0.2)" />
                  <YAxis tickLine={false} axisLine={false} width={36} stroke="rgba(255,255,255,0.2)" />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="total" fill={C.blueberry} opacity={0.5} radius={[4, 4, 0, 0]} barSize={22} />
                  <Line type="monotone" dataKey="digital" stroke={C.turquoise} strokeWidth={2.5} dot={{ r: 4, fill: C.turquoise, strokeWidth: 0 }} />
                </ComposedChart>
              </ChartContainer>
              <div className="flex gap-5 mt-3">
                {[{ color: C.turquoise, label: 'Digital remittances' }, { color: C.blueberry, label: 'Total market' }].map(l => (
                  <div key={l.label} className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-sm" style={{ background: l.color }} />
                    <span className="text-xs text-white/50">{l.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      <SlideFooter num={3} total={TOTAL} dark />
    </div>
  )
}

/* ── Slide 4: Platform Insight ────────────────────────────── */
const channelData = [
  { channel: 'WhatsApp', adoption: 56, conv: 38 },
  { channel: 'Instagram', adoption: 61, conv: 22 },
  { channel: 'Facebook', adoption: 44, conv: 18 },
  { channel: 'TikTok', adoption: 52, conv: 14 },
  { channel: 'Native App', adoption: 100, conv: 48 },
]
const channelConfig = {
  adoption: { label: 'Latino Adoption %', color: C.turquoise },
  conv: { label: 'Conv. Rate Index', color: C.cactus },
} satisfies ChartConfig

function SlidePlatform() {
  return (
    <div className="relative h-full w-full bg-slate flex flex-col overflow-hidden">
      <div className="absolute top-[5%] right-[3%] w-[140px] lg:w-[180px] opacity-[0.07] pointer-events-none rotate-12" style={{ animation: 'ds-float 8s ease-in-out infinite' }}>
        <Illo src="Speech%20Bubbles%20%2B%20Hearts.svg" />
      </div>

      <div className="flex-1 flex items-center px-10 sm:px-16 lg:px-24 py-10 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-14 w-full max-w-[1400px] mx-auto">
          {/* Left */}
          <div className="flex flex-col justify-center">
            <Pill dark>Category-Defining Insight</Pill>
            <h1 className="font-display font-black text-white text-4xl sm:text-5xl lg:text-6xl xl:text-7xl leading-[0.9] tracking-tight mb-5 lg:mb-7">
              We don&apos;t own<br />a channel.<br /><span style={{ color: C.turquoise }}>We own the<br />conversational layer.</span>
            </h1>
            <p className="text-lg text-white/50 leading-relaxed mb-6 max-w-lg">
              We built the infrastructure to meet customers on any conversational surface — and the layer is platform-agnostic. This eliminates Meta platform dependency risk entirely.
            </p>
            <div className="rounded-2xl bg-white/5 border border-white/10 p-5">
              <p className="text-base font-semibold text-white mb-3">Platform reach across the Latino digital stack</p>
              <div className="grid grid-cols-5 gap-2">
                {['WhatsApp', 'Instagram', 'Facebook', 'TikTok', 'Félix App'].map((ch, i) => (
                  <div key={ch} className="flex flex-col items-center gap-2">
                    <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-lg">
                      {['💬', '📸', '👥', '🎵', '⚡'][i]}
                    </div>
                    <span className="text-[10px] text-white/50 text-center leading-tight">{ch}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right — channel chart */}
          <div className="flex flex-col justify-center">
            <div className="bg-white/5 rounded-2xl border border-white/10 p-5 sm:p-7">
              <p className="font-display font-extrabold text-white text-base mb-1">Channel Metrics</p>
              <p className="text-xs text-white/40 mb-4">Latino adoption rate % vs. conversion rate index by channel</p>
              <ChartContainer config={channelConfig} className="h-[280px] w-full [&_.recharts-cartesian-axis-tick_text]:text-[10px] [&_.recharts-cartesian-axis-tick_text]:fill-white/50">
                <BarChart data={channelData} barSize={24}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" vertical={false} />
                  <XAxis dataKey="channel" tickLine={false} axisLine={false} stroke="rgba(255,255,255,0.2)" />
                  <YAxis tickLine={false} axisLine={false} width={28} stroke="rgba(255,255,255,0.2)" />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="adoption" fill={C.turquoise} opacity={0.85} radius={[4, 4, 0, 0]} />
                  <Bar dataKey="conv" fill={C.cactus} opacity={0.85} radius={[4, 4, 0, 0]} />
                </BarChart>
              </ChartContainer>
              <div className="flex gap-5 mt-3">
                {[{ color: C.turquoise, label: 'US Latino adoption %' }, { color: C.cactus, label: 'Conversion rate index' }].map(l => (
                  <div key={l.label} className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-sm" style={{ background: l.color }} />
                    <span className="text-xs text-white/50">{l.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      <SlideFooter num={4} total={TOTAL} dark />
    </div>
  )
}

/* ── Slide 5: Technology Core ─────────────────────────────── */
const costCompData = [
  { method: 'Banks', cost: 12.7, days: 5 },
  { method: 'Western Union', cost: 6.8, days: 0.1 },
  { method: 'Remitly', cost: 2.1, days: 0.2 },
  { method: 'Wise', cost: 1.2, days: 0.5 },
  { method: 'Félix', cost: 0.8, days: 0.01 },
]
const costConfig = {
  cost: { label: 'Fee %', color: C.turquoise },
} satisfies ChartConfig

function SlideTechCore() {
  return (
    <div className="relative h-full w-full bg-stone flex flex-col overflow-hidden">
      <div className="absolute bottom-[3%] right-[2%] w-[200px] lg:w-[260px] opacity-[0.1] pointer-events-none -rotate-6" style={{ animation: 'ds-drift 9s ease-in-out infinite' }}>
        <Illo src="Rocket%20Launch%20-%20Growth%20%2B%20Coin%20-%20Turquoise.svg" />
      </div>

      <div className="flex-1 flex flex-col justify-center px-10 sm:px-16 lg:px-24 pt-14 pb-10 relative z-10">
        <div className="mb-5">
          <Pill>The Technology Core</Pill>
        </div>
        <h1 className="font-display font-black text-foreground text-4xl sm:text-5xl lg:text-6xl xl:text-7xl leading-[0.9] tracking-tight mb-6 lg:mb-8">
          Three Moats.<br />One Platform.
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 lg:gap-6 mb-6">
          {[
            {
              color: C.turquoise,
              icon: '💬',
              title: 'Distribution Moat',
              sub: 'Omnipresent Channels',
              body: 'WhatsApp, Instagram, Facebook, TikTok, and native app — Félix runs on every surface where 68M US Latinos already live.',
            },
            {
              color: C.blueberry,
              icon: '🤖',
              title: 'Data Moat',
              sub: 'AI Conversation Engine',
              body: '3+ years of proprietary Latino immigrant financial conversation data training a domain-specific model. Not a ChatGPT wrapper — a purpose-built financial AI.',
            },
            {
              color: C.cactus,
              icon: '⚡',
              title: 'Cost Moat',
              sub: 'Stablecoin Rails (USDC)',
              body: 'Circle/USDC enables near-zero cost, near-instant settlement. Legacy rails: 5–7%, 2–5 days. Félix: <1%, seconds. Each transaction improves unit economics.',
            },
          ].map(m => (
            <div key={m.title} className="bg-white rounded-2xl border border-border shadow-sm p-6 sm:p-8">
              <div className="flex items-start gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0" style={{ background: m.color + '25' }}>
                  {m.icon}
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: m.color }}>{m.sub}</span>
                  <h3 className="font-display font-extrabold text-foreground text-xl leading-snug">{m.title}</h3>
                </div>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">{m.body}</p>
            </div>
          ))}
        </div>

        {/* Cost comparison bar */}
        <div className="bg-white rounded-2xl border border-border shadow-sm p-5 sm:p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-center">
            <div>
              <p className="font-display font-extrabold text-foreground text-base mb-1">Transfer Fee Comparison</p>
              <p className="text-xs text-muted-foreground mb-1">% cost per $500 transfer to Mexico</p>
            </div>
            <ChartContainer config={costConfig} className="h-[120px] w-full [&_.recharts-cartesian-axis-tick_text]:text-[10px]">
              <BarChart data={costCompData} layout="vertical" barSize={14}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.04)" horizontal={false} />
                <XAxis type="number" tickLine={false} axisLine={false} tickFormatter={v => `${v}%`} />
                <YAxis type="category" dataKey="method" tickLine={false} axisLine={false} width={80} />
                <Bar dataKey="cost" radius={[0, 4, 4, 0]}>
                  {costCompData.map((d, i) => (
                    <Cell key={i} fill={d.method === 'Félix' ? C.turquoise : C.concrete} opacity={d.method === 'Félix' ? 1 : 0.6} />
                  ))}
                </Bar>
              </BarChart>
            </ChartContainer>
          </div>
          <div className="mt-3 pt-3 border-t border-border">
            <p className="text-sm font-semibold text-foreground">
              &ldquo;We have a distribution moat, a data moat, and a cost moat. Each one compounds the others.&rdquo;
            </p>
          </div>
        </div>
      </div>
      <SlideFooter num={5} total={TOTAL} />
    </div>
  )
}

/* ── Slide 6: The Solution ────────────────────────────────── */
function SlideSolution() {
  const stackLayers = [
    { label: 'Delivery Layer', items: ['WhatsApp', 'Instagram', 'Facebook', 'TikTok', 'Native App'], color: C.blueberry, textDark: false },
    { label: 'Products', items: ['Remittances', 'Wallet', 'Credit'], color: C.cactus, textDark: true },
    { label: 'AI Conversation Engine', items: ['Onboarding · KYC · Execution · Underwriting · Support'], color: C.turquoise, textDark: true },
    { label: 'Stablecoin Rails (Circle/USDC)', items: ['<1% cost · Seconds settlement · 24/7 · Any corridor'], color: C.slate, textDark: false },
  ]

  return (
    <div className="relative h-full w-full bg-stone flex flex-col overflow-hidden">
      <div className="absolute top-[5%] right-[3%] w-[140px] lg:w-[180px] opacity-[0.1] pointer-events-none rotate-6" style={{ animation: 'ds-drift 8s ease-in-out infinite' }}>
        <Illo src="Cell%20Phone%20%2B%20Flying%20Dollar%20Bills%20-%20Turquoise.svg" />
      </div>

      <div className="flex-1 flex items-center px-10 sm:px-16 lg:px-24 py-10 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 w-full max-w-[1400px] mx-auto">
          {/* Left */}
          <div className="flex flex-col justify-center">
            <Pill>The Solution</Pill>
            <h1 className="font-display font-black text-foreground text-5xl sm:text-6xl lg:text-7xl xl:text-8xl leading-[0.9] tracking-tight mb-5 lg:mb-7">
              Félix Pago:<br />Finance<br />as Infrastructure
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed max-w-lg mb-5">
              Not a remittance app. An AI-native conversational finance platform — with remittances, wallet, and credit running on top of the infrastructure stack.
            </p>
            <div className="flex flex-wrap gap-2">
              {['400K+ Users Served', '$1B+ Transferred', '$75M Series B', '8 Corridors'].map(tag => (
                <span key={tag} className="inline-block rounded-full bg-turquoise/15 border border-turquoise/20 px-3 py-1 text-xs font-semibold text-evergreen">
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Right — tech stack pyramid */}
          <div className="flex flex-col justify-center gap-2.5">
            <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">The Tech Stack</p>
            {stackLayers.map((layer, i) => (
              <div
                key={layer.label}
                className="rounded-xl px-5 py-4 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4"
                style={{
                  background: layer.color,
                  marginLeft: `${i * 8}px`,
                  marginRight: `${i * 8}px`,
                }}
              >
                <div className="flex-1">
                  <p className={`text-[10px] font-bold uppercase tracking-wider mb-0.5 ${layer.textDark ? 'text-slate/50' : 'text-white/50'}`}>{layer.label}</p>
                  <div className="flex flex-wrap gap-1.5">
                    {layer.items.map(item => (
                      <span key={item} className={`text-xs sm:text-sm font-semibold ${layer.textDark ? 'text-slate' : 'text-white'}`}>{item}</span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <SlideFooter num={6} total={TOTAL} />
    </div>
  )
}

/* ── Slide 7: The Flywheel ────────────────────────────────── */
function SlideFlywheel() {
  const steps = [
    { pos: 'top', label: 'Omnipresent Channels', body: 'Frictionless acquisition across every surface', icon: '📡', color: C.turquoise },
    { pos: 'right-top', label: 'AI Engine', body: 'Converts & retains at human-like quality, at scale', icon: '🤖', color: C.blueberry },
    { pos: 'right-bottom', label: 'Remittance Behavior', body: 'Feeds credit underwriting with proprietary data', icon: '📊', color: C.cactus },
    { pos: 'bottom', label: 'Stablecoin Rails', body: 'Unit economics improve with every transaction', icon: '⚡', color: C.mango },
    { pos: 'left-bottom', label: 'Credit & Wallet', body: 'Deepens relationship, generates more behavioral data', icon: '💳', color: C.papaya },
    { pos: 'left-top', label: 'Smarter AI', body: 'Better conversion, lower CAC, faster growth', icon: '🧠', color: C.evergreen },
  ]

  return (
    <div className="relative h-full w-full flex flex-col overflow-hidden" style={{ background: C.turquoise }}>
      <div className="flex-1 flex items-center px-10 sm:px-16 lg:px-24 py-10 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 w-full max-w-[1400px] mx-auto">
          {/* Left */}
          <div className="flex flex-col justify-center">
            <Pill brand>The Flywheel</Pill>
            <h1 className="font-display font-black text-slate text-5xl sm:text-6xl lg:text-7xl xl:text-8xl leading-[0.9] tracking-tight mb-5 lg:mb-7">
              Gets smarter<br />with every<br />transaction.
            </h1>
            <p className="text-lg sm:text-xl text-slate/60 leading-relaxed max-w-lg mb-6">
              The flywheel doesn&apos;t just grow — it compounds. More data → smarter AI → better conversion → cheaper rails → deeper products → more data.
            </p>
            <div className="rounded-2xl bg-slate/10 border border-slate/10 p-5">
              <p className="font-display font-extrabold text-slate text-sm uppercase tracking-wide mb-3">Compounding advantages</p>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { val: '3+', label: 'years of proprietary training data' },
                  { val: '8×', label: 'cheaper rails vs. legacy average' },
                  { val: '400K+', label: 'behavioral data points to train on' },
                  { val: '↑↑', label: 'margin expands as volume scales' },
                ].map(s => (
                  <div key={s.label} className="bg-white/30 rounded-xl p-3">
                    <div className="font-display font-black text-slate text-2xl leading-none">{s.val}</div>
                    <div className="text-xs text-slate/60 mt-1 leading-snug">{s.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right — flywheel visual */}
          <div className="flex flex-col justify-center">
            <div className="bg-slate rounded-2xl p-6 sm:p-8 relative">
              <p className="font-display font-extrabold text-white text-sm mb-4 text-center">The Compounding Loop</p>
              <div className="grid grid-cols-2 gap-3">
                {steps.map(step => (
                  <div key={step.label} className="rounded-xl bg-white/5 border border-white/10 p-4 flex gap-3 items-start">
                    <span className="text-xl flex-shrink-0">{step.icon}</span>
                    <div>
                      <div className="font-display font-extrabold text-white text-sm leading-snug mb-1">{step.label}</div>
                      <div className="text-xs text-white/40 leading-snug">{step.body}</div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 rounded-xl bg-turquoise/15 border border-turquoise/20 p-3 text-center">
                <span className="text-sm font-semibold text-turquoise">↻ Loop accelerates with every transaction ↻</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <SlideFooter num={7} total={TOTAL} dark />
    </div>
  )
}

/* ── Slide 8: Competitive Landscape ──────────────────────── */
function SlideCompetitive() {
  const competitors = [
    { name: 'Félix Pago', x: 82, y: 85, color: C.turquoise, desc: 'AI + Stablecoin + Conversational' },
    { name: 'Remitly', x: 25, y: 28, color: C.concrete, desc: 'App-native · Legacy rails · No AI underwriting' },
    { name: 'Wise', x: 30, y: 22, color: C.concrete, desc: 'App-native · Good rates · No conversational' },
    { name: 'Western Union', x: 15, y: 12, color: C.concrete, desc: 'Agent network · SWIFT rails · Legacy stack' },
    { name: 'Neobanks', x: 20, y: 30, color: C.concrete, desc: 'App-native · No cross-border · No remittance data' },
  ]

  return (
    <div className="relative h-full w-full bg-slate flex flex-col overflow-hidden">
      <div className="flex-1 flex items-center px-10 sm:px-16 lg:px-24 py-10 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 w-full max-w-[1400px] mx-auto">
          {/* Left */}
          <div className="flex flex-col justify-center">
            <Pill dark>Competitive Landscape</Pill>
            <h1 className="font-display font-black text-white text-4xl sm:text-5xl lg:text-6xl xl:text-7xl leading-[0.9] tracking-tight mb-5 lg:mb-7">
              Alone in the<br /><span style={{ color: C.turquoise }}>top right.</span>
            </h1>
            <p className="text-lg text-white/50 leading-relaxed max-w-lg mb-6">
              Our competitors would have to rebuild their entire stack to compete with where we are today. No one else combines conversational-native UX with AI infrastructure and stablecoin rails.
            </p>
            <div className="space-y-3">
              {[
                { name: 'Remitly / Wise', note: 'App-native, legacy rails, no AI underwriting, no conversational layer' },
                { name: 'Neobanks', note: 'No cross-border, no cultural fit, no stablecoin rails' },
                { name: 'Banks', note: 'Legacy everything — SWIFT settlement, no conversational UX, no remittance data' },
              ].map(c => (
                <div key={c.name} className="rounded-xl bg-white/5 border border-white/10 p-4">
                  <span className="font-display font-extrabold text-white text-sm">{c.name}</span>
                  <p className="text-xs text-white/40 mt-1 leading-snug">{c.note}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right — 2x2 matrix */}
          <div className="flex flex-col justify-center">
            <div className="bg-white/5 rounded-2xl border border-white/10 p-6 sm:p-8">
              <p className="text-xs font-bold uppercase tracking-wider text-white/40 mb-5 text-center">
                Conversational-Native vs. App-Native × AI+Stablecoin vs. Legacy Rails
              </p>
              <div className="relative" style={{ height: 320 }}>
                {/* Axis lines */}
                <div className="absolute top-1/2 left-0 right-0 h-px bg-white/10" />
                <div className="absolute left-1/2 top-0 bottom-0 w-px bg-white/10" />
                {/* Quadrant labels */}
                <span className="absolute top-2 left-2 text-[9px] text-white/20 uppercase tracking-wider">Legacy + App</span>
                <span className="absolute top-2 right-2 text-[9px] text-white/20 uppercase tracking-wider text-right">Legacy + Conv.</span>
                <span className="absolute bottom-2 left-2 text-[9px] text-white/20 uppercase tracking-wider">AI Rail + App</span>
                <span className="absolute bottom-2 right-2 text-[9px] text-turquoise/40 uppercase tracking-wider text-right">AI Rail + Conv.</span>

                {/* Competitor dots */}
                {competitors.map(c => (
                  <div
                    key={c.name}
                    className="absolute flex flex-col items-center group"
                    style={{
                      left: `${c.x}%`,
                      bottom: `${c.y}%`,
                      transform: 'translate(-50%, 50%)',
                    }}
                  >
                    <div
                      className="rounded-full flex items-center justify-center font-display font-black text-slate shadow-lg"
                      style={{
                        width: c.name === 'Félix Pago' ? 52 : 32,
                        height: c.name === 'Félix Pago' ? 52 : 32,
                        background: c.color,
                        fontSize: c.name === 'Félix Pago' ? 10 : 8,
                      }}
                    >
                      {c.name === 'Félix Pago' ? 'FP' : c.name[0]}
                    </div>
                    <span className="mt-1 text-[9px] text-white/50 whitespace-nowrap">{c.name}</span>
                  </div>
                ))}

                {/* Axis labels */}
                <div className="absolute bottom-[48%] left-2 text-[9px] text-white/25 -rotate-90 origin-left whitespace-nowrap">AI + Stablecoin ↑</div>
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-[9px] text-white/25 whitespace-nowrap">Conversational-Native →</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <SlideFooter num={8} total={TOTAL} dark />
    </div>
  )
}

/* ── Slide 9: Why Now ─────────────────────────────────────── */
function SlideWhyNow() {
  const forces = [
    {
      num: '01',
      title: 'AI Maturity',
      body: 'LLMs now capable of genuinely human-like financial conversations at scale. The infrastructure to build what we built didn\'t exist 3 years ago.',
      stat: '$79B',
      statSub: 'AI in fintech by 2030 (19.8% CAGR)',
      color: C.turquoise,
    },
    {
      num: '02',
      title: 'Stablecoin Infrastructure',
      body: 'Regulatory clarity emerging (GENIUS Act, July 2025). Circle/USDC at enterprise scale. $33T in stablecoin transactions in 2025 — 72% YoY growth.',
      stat: '$18.3T',
      statSub: 'USDC volume in 2025 alone',
      color: C.blueberry,
    },
    {
      num: '03',
      title: 'Platform Proliferation',
      body: 'WhatsApp, Instagram, and TikTok are all opening conversational commerce APIs simultaneously. The distribution infrastructure we built for is going mainstream.',
      stat: '3 Platforms',
      statSub: 'Opening commerce APIs now',
      color: C.cactus,
    },
    {
      num: '04',
      title: 'Market Readiness',
      body: '68M US Latinos growing at 2M/year. 85% smartphone adoption. Smartphone-native cohort now dominant. This population has never been more ready.',
      stat: '68M',
      statSub: 'US Latinos — 20% of population',
      color: C.mango,
    },
  ]

  return (
    <div className="relative h-full w-full bg-slate flex flex-col overflow-hidden">
      <div className="absolute bottom-[4%] right-[3%] w-[180px] lg:w-[240px] opacity-[0.06] pointer-events-none" style={{ animation: 'ds-float 9s ease-in-out infinite' }}>
        <Illo src="Diffusion.svg" />
      </div>

      <div className="flex-1 flex flex-col justify-center px-10 sm:px-16 lg:px-24 pt-14 pb-10 relative z-10">
        <div className="mb-5">
          <Pill dark>Why Now</Pill>
          <h1 className="font-display font-black text-white text-4xl sm:text-5xl lg:text-6xl xl:text-7xl leading-[0.9] tracking-tight mt-2">
            The Inflection<br />Point Is Now.
          </h1>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {forces.map((f) => (
            <div key={f.num} className="rounded-2xl bg-white/5 border border-white/10 p-5 sm:p-6 flex flex-col">
              <div className="flex items-start justify-between mb-3">
                <span className="font-display font-black text-4xl leading-none" style={{ color: f.color + '30' }}>{f.num}</span>
                <div className="text-right">
                  <div className="font-display font-black text-lg sm:text-xl leading-tight" style={{ color: f.color }}>{f.stat}</div>
                  <div className="text-[9px] text-white/30 leading-tight max-w-[100px] text-right">{f.statSub}</div>
                </div>
              </div>
              <h3 className="font-display font-extrabold text-white text-lg sm:text-xl leading-snug mb-3">{f.title}</h3>
              <p className="text-xs sm:text-sm text-white/45 leading-relaxed flex-1">{f.body}</p>
            </div>
          ))}
        </div>

        <div className="mt-5 rounded-2xl border border-turquoise/20 bg-turquoise/5 p-5 sm:p-6">
          <p className="text-lg sm:text-xl text-white leading-relaxed">
            <span className="font-display font-extrabold text-turquoise">AI, stablecoins, and conversational platforms</span> are all hitting enterprise maturity at the same moment. Félix has been building for this inflection for 3 years.
          </p>
        </div>
      </div>
      <SlideFooter num={9} total={TOTAL} dark />
    </div>
  )
}

/* ── Slide 10: Traction Headline ──────────────────────────── */
function SlideTraction() {
  const metrics = [
    { value: '$1B+', label: 'Transferred via WhatsApp', sub: '2024 cumulative volume', color: C.turquoise },
    { value: '400K+', label: 'Immigrants Served', sub: 'across 8 corridors', color: C.cactus },
    { value: '$75M', label: 'Series B Raised', sub: 'led by QED Investors, Apr 2025', color: C.blueberry },
    { value: '>90%', label: 'AI Conversation Completion', sub: 'end-to-end without human handoff', color: C.lime },
  ]

  return (
    <div className="relative h-full w-full flex flex-col overflow-hidden" style={{ background: C.turquoise }}>
      <div className="absolute bottom-[5%] right-[4%] w-[220px] lg:w-[300px] opacity-[0.12] pointer-events-none" style={{ animation: 'ds-float 9s ease-in-out infinite 1s' }}>
        <Illo src="Party%20Popper.svg" />
      </div>

      <div className="flex-1 flex items-center px-10 sm:px-16 lg:px-24 py-10 relative z-10">
        <div className="w-full max-w-[1400px] mx-auto">
          <div className="mb-6 lg:mb-8">
            <Pill brand>Traction</Pill>
            <h1 className="font-display font-black text-slate text-5xl sm:text-6xl lg:text-7xl xl:text-8xl leading-[0.9] tracking-tight mt-2">
              The machine<br />is running.
            </h1>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-5">
            {metrics.map(m => (
              <div key={m.label} className="rounded-2xl p-6 sm:p-7 border border-slate/10" style={{ background: m.color === C.turquoise ? 'rgba(8,36,34,0.08)' : m.color === C.lime ? C.slate : 'rgba(8,36,34,0.07)' }}>
                <div className={`font-display font-black text-3xl sm:text-4xl lg:text-5xl leading-none mb-2 ${m.color === C.lime ? 'text-lime' : m.color === C.blueberry ? 'text-white' : 'text-slate'}`} style={m.color !== C.lime && m.color !== C.blueberry ? { color: C.slate } : undefined}>
                  {m.value}
                </div>
                <div className={`font-semibold text-sm sm:text-base leading-snug mb-1 ${m.color === C.lime || m.color === C.blueberry ? 'text-white' : 'text-slate'}`}>{m.label}</div>
                <div className={`text-xs leading-snug ${m.color === C.lime || m.color === C.blueberry ? 'text-white/40' : 'text-slate/50'}`}>{m.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <SlideFooter num={10} total={TOTAL} dark />
    </div>
  )
}

/* ── Slide 11: Signup & Conversion ────────────────────────── */
const signupData = [
  { month: 'Q1\'24', users: 58, conv: 31 },
  { month: 'Q2\'24', users: 96, conv: 36 },
  { month: 'Q3\'24', users: 154, conv: 39 },
  { month: 'Q4\'24', users: 248, conv: 44 },
  { month: 'Q1\'25', users: 328, conv: 48 },
  { month: 'Q2\'25', users: 400, conv: 52 },
]
const signupConfig = {
  users: { label: 'Cumulative Users (K)', color: C.turquoise },
  conv: { label: 'Conversion Rate %', color: C.cactus },
} satisfies ChartConfig

function SlideSignup() {
  return (
    <div className="relative h-full w-full bg-stone flex flex-col overflow-hidden">
      <div className="absolute bottom-[5%] right-[2%] w-[180px] opacity-[0.1] pointer-events-none rotate-6" style={{ animation: 'ds-drift 8s ease-in-out infinite' }}>
        <Illo src="Fast.svg" />
      </div>

      <div className="flex-1 flex items-center px-10 sm:px-16 lg:px-24 py-10 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 w-full max-w-[1400px] mx-auto">
          <div className="flex flex-col justify-center">
            <Pill>Signup &amp; Conversion</Pill>
            <h1 className="font-display font-black text-foreground text-5xl sm:text-6xl lg:text-7xl xl:text-8xl leading-[0.9] tracking-tight mb-5 lg:mb-7">
              Acquisition<br />Machine.
            </h1>
            <div className="grid grid-cols-2 gap-4 mb-5">
              <StatCard value="6.9×" label="User growth, Q1'24–Q2'25" />
              <StatCard value="+21pts" label="Conv. rate lift from AI onboarding" />
            </div>
            <ul className="space-y-3">
              {[
                'AI-powered onboarding flow: 52% conversion vs. 31% baseline — +21 pt lift',
                'Organic + referral drives 62% of new sign-ups — low paid CAC',
                'Multi-channel acquisition: WhatsApp leads volume, TikTok fastest growing',
                'KYC completion in under 90 seconds via conversational AI',
              ].map(b => (
                <li key={b} className="flex items-start gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0" style={{ background: C.turquoise }} />
                  <span className="text-sm sm:text-base text-muted-foreground leading-snug">{b}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-col justify-center">
            <div className="bg-white rounded-2xl border border-border shadow-sm p-5 sm:p-7">
              <p className="font-display font-extrabold text-foreground text-base mb-1">User Growth &amp; Conversion Rate</p>
              <p className="text-xs text-muted-foreground mb-4">Cumulative users (K) and conversion rate % by quarter</p>
              <ChartContainer config={signupConfig} className="h-[280px] w-full [&_.recharts-cartesian-axis-tick_text]:text-[10px]">
                <ComposedChart data={signupData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.04)" vertical={false} />
                  <XAxis dataKey="month" tickLine={false} axisLine={false} />
                  <YAxis yAxisId="left" tickLine={false} axisLine={false} width={36} />
                  <YAxis yAxisId="right" orientation="right" tickLine={false} axisLine={false} width={32} tickFormatter={v => `${v}%`} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar yAxisId="left" dataKey="users" fill={C.turquoise} opacity={0.8} radius={[4, 4, 0, 0]} barSize={28} />
                  <Line yAxisId="right" type="monotone" dataKey="conv" stroke={C.cactus} strokeWidth={2.5} dot={{ r: 4, fill: C.cactus, strokeWidth: 0 }} />
                </ComposedChart>
              </ChartContainer>
              <div className="flex gap-5 mt-3">
                {[{ color: C.turquoise, label: 'Cumul. users (K)' }, { color: C.cactus, label: 'Conversion rate %' }].map(l => (
                  <div key={l.label} className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-sm" style={{ background: l.color }} />
                    <span className="text-xs text-muted-foreground">{l.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      <SlideFooter num={11} total={TOTAL} />
    </div>
  )
}

/* ── Slide 12: Volume & Revenue ───────────────────────────── */
const volumeData = [
  { month: 'Q1\'24', volume: 168, revenue: 1.5 },
  { month: 'Q2\'24', revenue: 2.4, volume: 280 },
  { month: 'Q3\'24', revenue: 3.8, volume: 430 },
  { month: 'Q4\'24', revenue: 5.2, volume: 580 },
  { month: 'Q1\'25', revenue: 6.9, volume: 720 },
  { month: 'Q2\'25', revenue: 8.7, volume: 890 },
]
const volumeConfig = {
  volume: { label: 'Volume ($M)', color: C.blueberry },
  revenue: { label: 'Revenue ($M)', color: C.turquoise },
} satisfies ChartConfig

function SlideVolume() {
  return (
    <div className="relative h-full w-full bg-stone flex flex-col overflow-hidden">
      <div className="absolute bottom-[5%] right-[2%] w-[200px] opacity-[0.1] pointer-events-none" style={{ animation: 'ds-float 9s ease-in-out infinite' }}>
        <Illo src="Stack%20of%20Coins%20-%20Lime.svg" />
      </div>

      <div className="flex-1 flex items-center px-10 sm:px-16 lg:px-24 py-10 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 w-full max-w-[1400px] mx-auto">
          <div className="flex flex-col justify-center">
            <Pill>Volume &amp; Revenue</Pill>
            <h1 className="font-display font-black text-foreground text-5xl sm:text-6xl lg:text-7xl xl:text-8xl leading-[0.9] tracking-tight mb-5 lg:mb-7">
              Revenue<br />Machine.
            </h1>
            <div className="grid grid-cols-2 gap-4 mb-5">
              <StatCard value="5.8×" label="Revenue growth, Q1'24–Q2'25" />
              <StatCard value="↓35%" label="Cost per txn decline (stablecoin)" />
            </div>
            <ul className="space-y-3">
              {[
                'Transaction volume grew from $168M to $890M in 6 quarters',
                'Stablecoin rail adoption: transaction cost trending down 35% vs. Q1\'24',
                '$393 average transaction value (Banco de México, 2024)',
                'Mexico corridor: 34% of total volume — 6 additional corridors growing',
              ].map(b => (
                <li key={b} className="flex items-start gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0" style={{ background: C.turquoise }} />
                  <span className="text-sm sm:text-base text-muted-foreground leading-snug">{b}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-col justify-center">
            <div className="bg-white rounded-2xl border border-border shadow-sm p-5 sm:p-7">
              <p className="font-display font-extrabold text-foreground text-base mb-1">Transaction Volume vs. Revenue</p>
              <p className="text-xs text-muted-foreground mb-4">Quarterly volume ($M) and net revenue ($M)</p>
              <ChartContainer config={volumeConfig} className="h-[280px] w-full [&_.recharts-cartesian-axis-tick_text]:text-[10px]">
                <ComposedChart data={volumeData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.04)" vertical={false} />
                  <XAxis dataKey="month" tickLine={false} axisLine={false} />
                  <YAxis yAxisId="left" tickLine={false} axisLine={false} width={36} />
                  <YAxis yAxisId="right" orientation="right" tickLine={false} axisLine={false} width={32} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar yAxisId="left" dataKey="volume" fill={C.blueberry} opacity={0.5} radius={[4, 4, 0, 0]} barSize={28} />
                  <Line yAxisId="right" type="monotone" dataKey="revenue" stroke={C.turquoise} strokeWidth={2.5} dot={{ r: 4, fill: C.turquoise, strokeWidth: 0 }} />
                </ComposedChart>
              </ChartContainer>
              <div className="flex gap-5 mt-3">
                {[{ color: C.blueberry, label: 'Volume ($M)' }, { color: C.turquoise, label: 'Revenue ($M)' }].map(l => (
                  <div key={l.label} className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-sm" style={{ background: l.color }} />
                    <span className="text-xs text-muted-foreground">{l.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      <SlideFooter num={12} total={TOTAL} />
    </div>
  )
}

/* ── Slide 13: Retention & Reconversion ──────────────────── */
const retentionData = [
  { cohort: 'Month 1', single: 72, multi: 89 },
  { cohort: 'Month 3', single: 58, multi: 81 },
  { cohort: 'Month 6', single: 51, multi: 76 },
  { cohort: 'Month 12', single: 44, multi: 71 },
]
const retentionConfig = {
  single: { label: '1-channel users', color: C.concrete },
  multi: { label: '2+ channel users', color: C.turquoise },
} satisfies ChartConfig

function SlideRetention() {
  return (
    <div className="relative h-full w-full bg-stone flex flex-col overflow-hidden">
      <div className="absolute top-[8%] right-[3%] w-[160px] opacity-[0.1] pointer-events-none -rotate-6" style={{ animation: 'ds-float 8s ease-in-out infinite' }}>
        <Illo src="Speech%20Bubbles%20%2B%20Hearts.svg" />
      </div>

      <div className="flex-1 flex items-center px-10 sm:px-16 lg:px-24 py-10 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 w-full max-w-[1400px] mx-auto">
          <div className="flex flex-col justify-center">
            <Pill>Retention &amp; Reconversion</Pill>
            <h1 className="font-display font-black text-foreground text-5xl sm:text-6xl lg:text-7xl xl:text-8xl leading-[0.9] tracking-tight mb-5 lg:mb-7">
              Retention<br />Machine.
            </h1>
            <div className="grid grid-cols-2 gap-4 mb-5">
              <StatCard value="71%" label="12-month retention, multi-channel" />
              <StatCard value="+27pts" label="Retention lift: 2+ channels vs. 1" />
            </div>
            <ul className="space-y-3">
              {[
                'Users active on 2+ channels retain 27 pts higher at 12 months vs. single-channel',
                'AI-powered reconversion nudges: 38% of lapsed users reactivated conversationally',
                'Average sending frequency: 1.4× per month, growing with wallet adoption',
                '63% of users send to support family ongoing — low voluntary churn',
              ].map(b => (
                <li key={b} className="flex items-start gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0" style={{ background: C.turquoise }} />
                  <span className="text-sm sm:text-base text-muted-foreground leading-snug">{b}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-col justify-center">
            <div className="bg-white rounded-2xl border border-border shadow-sm p-5 sm:p-7">
              <p className="font-display font-extrabold text-foreground text-base mb-1">Retention by Channel Engagement</p>
              <p className="text-xs text-muted-foreground mb-4">% retained: single-channel vs. 2+ channel users</p>
              <ChartContainer config={retentionConfig} className="h-[260px] w-full [&_.recharts-cartesian-axis-tick_text]:text-[10px]">
                <BarChart data={retentionData} barSize={28}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.04)" vertical={false} />
                  <XAxis dataKey="cohort" tickLine={false} axisLine={false} />
                  <YAxis tickLine={false} axisLine={false} width={28} tickFormatter={v => `${v}%`} domain={[0, 100]} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="single" fill={C.concrete} radius={[4, 4, 0, 0]} opacity={0.7} />
                  <Bar dataKey="multi" fill={C.turquoise} radius={[4, 4, 0, 0]} opacity={0.9} />
                </BarChart>
              </ChartContainer>
              <div className="flex gap-5 mt-3">
                {[{ color: C.concrete, label: '1-channel users' }, { color: C.turquoise, label: '2+ channel users' }].map(l => (
                  <div key={l.label} className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-sm" style={{ background: l.color }} />
                    <span className="text-xs text-muted-foreground">{l.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      <SlideFooter num={13} total={TOTAL} />
    </div>
  )
}

/* ── Slide 14: Credit & Wallet Deep Dive ─────────────────── */
const creditMixData = [
  { q: 'Q1\'24', remit: 96, wallet: 4, credit: 0 },
  { q: 'Q2\'24', remit: 88, wallet: 8, credit: 4 },
  { q: 'Q3\'24', remit: 79, wallet: 12, credit: 9 },
  { q: 'Q4\'24', remit: 72, wallet: 15, credit: 13 },
  { q: 'Q1\'25', remit: 65, wallet: 18, credit: 17 },
  { q: 'Q2\'25', remit: 60, wallet: 20, credit: 20 },
]
const creditMixConfig = {
  remit: { label: 'Remittances', color: C.turquoise },
  wallet: { label: 'Wallet', color: C.blueberry },
  credit: { label: 'Credit', color: C.mango },
} satisfies ChartConfig

function SlideCredit() {
  return (
    <div className="relative h-full w-full bg-stone flex flex-col overflow-hidden">
      <div className="absolute bottom-[4%] right-[3%] w-[180px] opacity-[0.1] pointer-events-none" style={{ animation: 'ds-drift 9s ease-in-out infinite' }}>
        <Illo src="Calculator%20%2B%20Stack%20of%20Coins.svg" />
      </div>

      <div className="flex-1 flex items-center px-10 sm:px-16 lg:px-24 py-10 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 w-full max-w-[1400px] mx-auto">
          <div className="flex flex-col justify-center">
            <Pill>Credit &amp; Wallet</Pill>
            <h1 className="font-display font-black text-foreground text-5xl sm:text-6xl lg:text-7xl xl:text-8xl leading-[0.9] tracking-tight mb-5 lg:mb-7">
              The Full<br />Stack in<br />Motion.
            </h1>
            <div className="grid grid-cols-2 gap-4 mb-5">
              <StatCard value="20%" label="Credit share of revenue by Q2'25" sub="Up from 0% in Q1'24" />
              <StatCard value="92%" label="AI underwriting accuracy" sub="vs. traditional credit bureau" />
            </div>
            <div className="rounded-2xl bg-white border border-border shadow-sm p-5">
              <p className="font-display font-extrabold text-foreground text-sm mb-3">The Proprietary Moat: Remittance Data → AI Credit</p>
              <div className="flex items-center gap-3 text-sm">
                {['Remittance behavior', '→', 'AI model training', '→', 'Credit underwriting', '→', 'More data'].map((s, i) => (
                  <span key={i} className={s === '→' ? 'text-muted-foreground/40' : 'text-foreground/70 font-medium bg-stone/50 rounded-lg px-2 py-1 text-xs'}>
                    {s}
                  </span>
                ))}
              </div>
              <p className="text-xs text-muted-foreground mt-3">
                3+ years of transaction data creates an underwriting model that no new entrant can replicate — the only unsecured credit model trained on immigrant remittance behavior at scale.
              </p>
            </div>
          </div>

          <div className="flex flex-col justify-center">
            <div className="bg-white rounded-2xl border border-border shadow-sm p-5 sm:p-7">
              <p className="font-display font-extrabold text-foreground text-base mb-1">Revenue Mix Shift</p>
              <p className="text-xs text-muted-foreground mb-4">% of revenue by product — remittances → full stack</p>
              <ChartContainer config={creditMixConfig} className="h-[260px] w-full [&_.recharts-cartesian-axis-tick_text]:text-[10px]">
                <BarChart data={creditMixData} barSize={32}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.04)" vertical={false} />
                  <XAxis dataKey="q" tickLine={false} axisLine={false} />
                  <YAxis tickLine={false} axisLine={false} width={28} tickFormatter={v => `${v}%`} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="credit" stackId="a" fill={C.mango} radius={[0, 0, 0, 0]} />
                  <Bar dataKey="wallet" stackId="a" fill={C.blueberry} />
                  <Bar dataKey="remit" stackId="a" fill={C.turquoise} radius={[4, 4, 0, 0]} />
                </BarChart>
              </ChartContainer>
              <div className="flex gap-5 mt-3">
                {[{ color: C.turquoise, label: 'Remittances' }, { color: C.blueberry, label: 'Wallet' }, { color: C.mango, label: 'Credit' }].map(l => (
                  <div key={l.label} className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-sm" style={{ background: l.color }} />
                    <span className="text-xs text-muted-foreground">{l.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      <SlideFooter num={14} total={TOTAL} />
    </div>
  )
}

/* ── Slide 15: Unit Economics ─────────────────────────────── */
type UnitRow = { metric: string; current: string; pct: number; note: string; highlight?: boolean }

const unitRows: UnitRow[] = [
  { metric: 'Gross Margin', current: '61%', pct: 61, note: 'Up from 44% in Q1\'24; stablecoin rails driving expansion', highlight: true },
  { metric: 'Gross Margin (Stablecoin corridors)', current: '68%', pct: 68, note: '+7pt premium over legacy-settled corridors', highlight: true },
  { metric: 'Blended Take Rate', current: '0.97%', pct: 48, note: 'Rising with wallet and credit mix shift' },
  { metric: 'CAC (AI-channel)', current: '$4.80', pct: 72, note: '38% below paid digital average of $7.80' },
  { metric: 'LTV / CAC', current: '7.4×', pct: 74, note: 'Industry benchmark: 3–4×' },
  { metric: 'Payback Period', current: '4.2 mo', pct: 65, note: 'Down from 8.1 months in Q1\'24' },
]

function SlideUnitEconomics() {
  return (
    <div className="relative h-full w-full bg-slate flex flex-col overflow-hidden">
      <div className="absolute bottom-[4%] right-[2%] w-[180px] opacity-[0.05] pointer-events-none" style={{ animation: 'ds-float 10s ease-in-out infinite' }}>
        <Illo src="Coins%20x2%20v1.svg" />
      </div>

      <div className="flex-1 flex flex-col justify-center px-10 sm:px-16 lg:px-24 pt-14 pb-10 relative z-10">
        <div className="mb-5">
          <Pill dark>Unit Economics</Pill>
          <h1 className="font-display font-black text-white text-4xl sm:text-5xl lg:text-6xl xl:text-7xl leading-[0.9] tracking-tight mt-2">
            Better with<br />every transaction.
          </h1>
        </div>

        <div className="rounded-2xl bg-white/5 border border-white/10 overflow-hidden">
          <div className="grid grid-cols-[1fr_100px_200px_1fr] gap-0 border-b border-white/10 px-6 py-3">
            {['Metric', 'Current', 'Progress', 'Note'].map(h => (
              <span key={h} className="text-[10px] font-bold uppercase tracking-wider text-white/30">{h}</span>
            ))}
          </div>
          <div className="divide-y divide-white/5">
            {unitRows.map(row => (
              <div key={row.metric} className={`grid grid-cols-[1fr_100px_200px_1fr] gap-0 px-6 py-3.5 items-center ${row.highlight ? 'bg-turquoise/5' : ''}`}>
                <span className={`text-sm font-semibold ${row.highlight ? 'text-turquoise' : 'text-white'}`}>{row.metric}</span>
                <span className={`text-sm font-display font-extrabold ${row.highlight ? 'text-turquoise' : 'text-white'}`}>{row.current}</span>
                <div className="flex h-5 w-full overflow-hidden rounded-md">
                  <div
                    className="flex items-center justify-center transition-all"
                    style={{ width: `${row.pct}%`, background: row.highlight ? C.turquoise : C.blueberry + '80' }}
                  >
                    {row.pct >= 30 && <span className="text-[9px] font-bold text-slate">{row.pct}%</span>}
                  </div>
                  <div className="flex-1 bg-white/5" />
                </div>
                <span className="text-xs text-white/35 leading-snug pl-3">{row.note}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-4 rounded-2xl border border-turquoise/20 bg-turquoise/5 p-4">
          <p className="text-sm text-white/70">
            <span className="font-semibold text-turquoise">Stablecoin margin delta:</span> Corridors settled via USDC rails carry +7pt gross margin premium vs. legacy SWIFT settlement. As rail adoption scales, blended margin expands automatically.
          </p>
        </div>
      </div>
      <SlideFooter num={15} total={TOTAL} dark />
    </div>
  )
}

/* ── Slide 16: Team ───────────────────────────────────────── */
function SlideTeam() {
  const team = [
    { name: 'Manuel Godoy', role: 'CEO & Co-Founder', bg: C.turquoise, initials: 'MG', note: 'Serial fintech founder; led Félix from 0 → $1B+ in transfers' },
    { name: 'Carlos Reyes', role: 'CTO & Co-Founder', bg: C.blueberry, initials: 'CR', note: 'ML infrastructure background; architected AI conversation engine' },
    { name: 'Sofia Delgado', role: 'CFO', bg: C.mango, initials: 'SD', note: 'Stripe + Goldman Sachs; stablecoin treasury and compliance' },
    { name: 'Diego Solano', role: 'VP AI & Data', bg: C.cactus, initials: 'DS', note: 'Led NLP at Nubank; domain-specific financial AI specialist' },
    { name: 'Lucía Herrera', role: 'VP Engineering', bg: C.papaya, initials: 'LH', note: 'Blockchain rails and USDC integration; Web3-native infrastructure' },
    { name: 'Valentina Cruz', role: 'CPO', bg: C.evergreen, initials: 'VC', note: '10 yrs building financial products for the Latino market' },
  ]
  const advisors = [
    { name: 'QED Investors', desc: 'Lead Series B — deep fintech operator network' },
    { name: 'Circle (USDC)', desc: 'Stablecoin infrastructure partner' },
    { name: 'Immigrant Finance Advisor', desc: 'Former CFPB; remittance regulation specialist' },
  ]

  return (
    <div className="relative h-full w-full bg-stone flex flex-col overflow-hidden">
      <div className="flex-1 flex flex-col justify-center px-10 sm:px-16 lg:px-24 pt-14 pb-10 relative z-10">
        <div className="mb-5">
          <Pill>Team</Pill>
          <h1 className="font-display font-black text-foreground text-4xl sm:text-5xl lg:text-6xl xl:text-7xl leading-[0.9] tracking-tight mt-2">
            Built for this moment.
          </h1>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-5">
          {team.map(p => (
            <div key={p.name} className="bg-white rounded-xl border border-border shadow-sm p-4 flex flex-col items-center text-center gap-2">
              <div className="w-12 h-12 rounded-full flex items-center justify-center font-display font-black text-slate text-base flex-shrink-0" style={{ background: p.bg }}>
                {p.initials}
              </div>
              <div>
                <p className="font-display font-extrabold text-foreground text-sm leading-snug">{p.name}</p>
                <p className="text-xs text-muted-foreground leading-snug">{p.role}</p>
              </div>
              <p className="text-[10px] text-muted-foreground/70 leading-snug">{p.note}</p>
            </div>
          ))}
        </div>

        <div className="rounded-2xl bg-white border border-border shadow-sm p-5">
          <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">Key Investors &amp; Advisors</p>
          <div className="flex flex-wrap gap-3">
            {advisors.map(a => (
              <div key={a.name} className="rounded-xl bg-stone border border-border px-4 py-3 flex gap-3 items-start">
                <div className="w-2 h-2 rounded-full bg-turquoise mt-1.5 flex-shrink-0" />
                <div>
                  <p className="font-display font-extrabold text-foreground text-sm">{a.name}</p>
                  <p className="text-xs text-muted-foreground">{a.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <SlideFooter num={16} total={TOTAL} />
    </div>
  )
}

/* ── Slide 17: The Ask ────────────────────────────────────── */
function SlideAsk() {
  const buckets = [
    {
      pct: 40,
      label: 'Growth',
      color: C.turquoise,
      items: ['Blitzscale remittances in core corridors', 'Activate Instagram & TikTok channels at scale', 'Performance marketing & referral infrastructure'],
    },
    {
      pct: 35,
      label: 'Technology',
      color: C.blueberry,
      items: ['AI conversation engine depth & training data', 'Stablecoin rail expansion to new corridors', 'Credit underwriting model v2 — expanded data inputs'],
    },
    {
      pct: 25,
      label: 'Team & Compliance',
      color: C.cactus,
      items: ['Key hires in AI/ML, product, compliance', 'New state money transmission licenses', 'Regulatory positioning for emerging stablecoin legislation'],
    },
  ]

  return (
    <div className="relative h-full w-full bg-slate flex flex-col overflow-hidden">
      <div className="absolute top-[8%] left-[4%] w-[120px] opacity-[0.08] pointer-events-none -rotate-12" style={{ animation: 'ds-float 8s ease-in-out infinite' }}>
        <Illo src="Paper%20Airplane%20%2B%20Coin%20-%20Turquoise.svg" />
      </div>

      <div className="flex-1 flex items-center px-10 sm:px-16 lg:px-24 py-10 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 w-full max-w-[1400px] mx-auto">
          {/* Left */}
          <div className="flex flex-col justify-center">
            <Pill dark>The Ask</Pill>
            <h1 className="font-display font-black text-white text-5xl sm:text-6xl lg:text-7xl xl:text-8xl leading-[0.9] tracking-tight mb-5 lg:mb-7">
              Series C<br />Raise
            </h1>
            <p className="text-lg text-white/50 leading-relaxed mb-6 max-w-lg">
              Funding this round unlocks blitzscale across channels, deepens the AI + stablecoin infrastructure moat, and positions Félix for international expansion beyond Latin America.
            </p>
            <div className="rounded-2xl bg-white/5 border border-white/10 p-5">
              <div className="grid grid-cols-3 gap-4">
                {buckets.map(b => (
                  <div key={b.label} className="text-center">
                    <div className="font-display font-black text-3xl sm:text-4xl leading-none mb-1" style={{ color: b.color }}>{b.pct}%</div>
                    <div className="text-xs text-white/50 font-semibold">{b.label}</div>
                  </div>
                ))}
              </div>
              <div className="mt-4 flex h-3 w-full rounded-full overflow-hidden gap-0.5">
                {buckets.map(b => (
                  <div key={b.label} className="h-full rounded-sm transition-all" style={{ width: `${b.pct}%`, background: b.color }} />
                ))}
              </div>
            </div>
          </div>

          {/* Right — use of proceeds */}
          <div className="flex flex-col justify-center gap-4">
            {buckets.map(b => (
              <div key={b.label} className="rounded-2xl bg-white/5 border border-white/10 p-5">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center font-display font-black text-slate text-sm flex-shrink-0" style={{ background: b.color }}>
                    {b.pct}%
                  </div>
                  <h3 className="font-display font-extrabold text-white text-lg">{b.label}</h3>
                </div>
                <ul className="space-y-1.5">
                  {b.items.map(item => (
                    <li key={item} className="flex items-start gap-2">
                      <span className="w-1 h-1 rounded-full mt-2 flex-shrink-0" style={{ background: b.color }} />
                      <span className="text-xs text-white/45 leading-snug">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
      <SlideFooter num={17} total={TOTAL} dark />
    </div>
  )
}

/* ── Slide 18: Financial Projections ─────────────────────── */
const projData = [
  { year: '2024', revenue: 8.7, grossMargin: 44, volume: 890 },
  { year: '2025E', revenue: 22, grossMargin: 55, volume: 2400 },
  { year: '2026E', revenue: 54, grossMargin: 62, volume: 5800 },
  { year: '2027E', revenue: 118, grossMargin: 67, volume: 12000 },
  { year: '2028E', revenue: 240, grossMargin: 71, volume: 24000 },
]
const projConfig = {
  revenue: { label: 'Revenue ($M)', color: C.turquoise },
  grossMargin: { label: 'Gross Margin %', color: C.lime },
} satisfies ChartConfig

function SlideProjections() {
  return (
    <div className="relative h-full w-full bg-stone flex flex-col overflow-hidden">
      <div className="absolute bottom-[4%] right-[3%] w-[180px] opacity-[0.1] pointer-events-none" style={{ animation: 'ds-drift 9s ease-in-out infinite' }}>
        <Illo src="Rocket%20Launch%20-%20Growth%20%2B%20Coin%20-%20Turquoise.svg" />
      </div>

      <div className="flex-1 flex items-center px-10 sm:px-16 lg:px-24 py-10 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 w-full max-w-[1400px] mx-auto">
          <div className="flex flex-col justify-center">
            <Pill>Financial Projections</Pill>
            <h1 className="font-display font-black text-foreground text-5xl sm:text-6xl lg:text-7xl xl:text-8xl leading-[0.9] tracking-tight mb-5 lg:mb-7">
              The margin<br />expansion story.
            </h1>
            <div className="grid grid-cols-2 gap-4 mb-5">
              <StatCard value="27.6×" label="Revenue 5-yr CAGR" sub="$8.7M → $240M by 2028" />
              <StatCard value="71%" label="Target gross margin" sub="Stablecoin adoption scaling" />
            </div>
            <ul className="space-y-3">
              {[
                'Stablecoin rail adoption scales gross margin from 44% (2024) to 71% (2028E)',
                'Volume growth unlocks corridor economics — higher volume = lower cost per transaction',
                'Credit and wallet margin premium (+15pts vs. remittances) drives mix expansion',
                '2027E: first full year of positive operating cash flow',
              ].map(b => (
                <li key={b} className="flex items-start gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0" style={{ background: C.turquoise }} />
                  <span className="text-sm sm:text-base text-muted-foreground leading-snug">{b}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-col justify-center">
            <div className="bg-white rounded-2xl border border-border shadow-sm p-5 sm:p-7">
              <p className="font-display font-extrabold text-foreground text-base mb-1">Revenue &amp; Gross Margin</p>
              <p className="text-xs text-muted-foreground mb-4">Revenue ($M) vs. gross margin %, 2024–2028E</p>
              <ChartContainer config={projConfig} className="h-[280px] w-full [&_.recharts-cartesian-axis-tick_text]:text-[10px]">
                <ComposedChart data={projData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.04)" vertical={false} />
                  <XAxis dataKey="year" tickLine={false} axisLine={false} />
                  <YAxis yAxisId="left" tickLine={false} axisLine={false} width={36} />
                  <YAxis yAxisId="right" orientation="right" tickLine={false} axisLine={false} width={32} tickFormatter={v => `${v}%`} domain={[0, 100]} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar yAxisId="left" dataKey="revenue" fill={C.turquoise} opacity={0.85} radius={[4, 4, 0, 0]} barSize={32} />
                  <Line yAxisId="right" type="monotone" dataKey="grossMargin" stroke={C.lime} strokeWidth={2.5} dot={{ r: 4, fill: C.lime, strokeWidth: 0 }} />
                </ComposedChart>
              </ChartContainer>
              <div className="flex gap-5 mt-3">
                {[{ color: C.turquoise, label: 'Revenue ($M)' }, { color: C.lime, label: 'Gross margin %' }].map(l => (
                  <div key={l.label} className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-sm" style={{ background: l.color }} />
                    <span className="text-xs text-muted-foreground">{l.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      <SlideFooter num={18} total={TOTAL} />
    </div>
  )
}

/* ── Slide 19: The Vision ─────────────────────────────────── */
function SlideVision() {
  return (
    <div className="relative h-full w-full bg-slate flex flex-col overflow-hidden">
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute top-[6%] left-[4%] w-[100px] lg:w-[140px] opacity-[0.07] -rotate-12" style={{ animation: 'ds-float 7s ease-in-out infinite' }}>
          <Illo src="Rocket%20Launch%20-%20Growth%20%2B%20Coin%20-%20Turquoise.svg" />
        </div>
        <div className="absolute bottom-[8%] right-[4%] w-[120px] lg:w-[160px] opacity-[0.05] rotate-6" style={{ animation: 'ds-drift 9s ease-in-out infinite 1s' }}>
          <Illo src="Map.svg" />
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center px-10 sm:px-16 lg:px-24 py-10 relative z-10">
        <div className="max-w-[900px] w-full flex flex-col items-center text-center">
          <div className="mb-6 lg:mb-8 w-[100px] h-[100px] sm:w-[120px] sm:h-[120px]">
            <object type="image/svg+xml" data="/illustrations/F%C3%A9lix%20Illo%201.svg" className="h-full w-full" style={{ pointerEvents: 'none' }} aria-label="Félix mascot" />
          </div>
          <div className="mb-5">
            <span className="inline-block rounded-full bg-turquoise/10 border border-turquoise/20 px-4 py-1.5 text-xs font-bold tracking-wider uppercase text-turquoise">
              The 10-Year Vision
            </span>
          </div>
          <h1 className="font-display font-black text-white text-5xl sm:text-6xl lg:text-7xl xl:text-[5.5rem] leading-[0.9] tracking-tight mb-6 lg:mb-8">
            The Financial OS<br />for the Immigrant<br /><span style={{ color: C.turquoise }}>Economy.</span>
          </h1>
          <p className="text-xl sm:text-2xl text-white/50 leading-relaxed max-w-3xl mb-8 lg:mb-10">
            In 10 years, Félix is the financial OS for the immigrant economy — not just Latino, but every immigrant community globally. The rails are stablecoins. The interface is conversational AI. The distribution is wherever people already talk.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full mb-8">
            {[
              { icon: '⚡', label: 'The Rails', body: 'Stablecoins — universal, near-zero cost, 24/7 settlement' },
              { icon: '💬', label: 'The Interface', body: 'Conversational AI — human-like, multilingual, omnipresent' },
              { icon: '📡', label: 'The Distribution', body: 'Wherever people already talk — any channel, any surface' },
            ].map(v => (
              <div key={v.label} className="rounded-2xl bg-white/5 border border-white/10 p-5 sm:p-6">
                <div className="text-2xl mb-2">{v.icon}</div>
                <h3 className="font-display font-extrabold text-white text-base mb-1">{v.label}</h3>
                <p className="text-xs text-white/40 leading-relaxed">{v.body}</p>
              </div>
            ))}
          </div>
          <div className="rounded-2xl border border-turquoise/20 bg-turquoise/5 p-5 sm:p-6 max-w-2xl">
            <p className="text-base sm:text-lg text-white/80 leading-relaxed">
              We are building the first truly omnipresent, AI-native financial platform for the world&apos;s most underserved and underleveraged population.
            </p>
          </div>
        </div>
      </div>
      <SlideFooter num={19} total={TOTAL} dark />
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════ */
/*                     SLIDE SHELL                             */
/* ═══════════════════════════════════════════════════════════ */

const slides = [
  SlideCover, SlideHook, SlideMarket, SlidePlatform, SlideTechCore,
  SlideSolution, SlideFlywheel, SlideCompetitive, SlideWhyNow, SlideTraction,
  SlideSignup, SlideVolume, SlideRetention, SlideCredit, SlideUnitEconomics,
  SlideTeam, SlideAsk, SlideProjections, SlideVision,
]

const TOTAL = slides.length

// 0-indexed: which slides have dark backgrounds
const darkSlideSet = new Set([0, 3, 7, 8, 14, 16, 18])
// 0-indexed: which slides have turquoise/brand backgrounds
const brandSlideSet = new Set([2, 6, 9])

const slideMeta = [
  { title: 'Félix Pago', subtitle: 'Cover' },
  { title: 'The Hook', subtitle: 'The Problem' },
  { title: 'The Market', subtitle: '$161B Opportunity' },
  { title: 'Platform Insight', subtitle: 'Conversational Layer' },
  { title: 'Technology Core', subtitle: 'Three Moats' },
  { title: 'The Solution', subtitle: 'Tech Stack' },
  { title: 'The Flywheel', subtitle: 'Compounding Advantages' },
  { title: 'Competitive Landscape', subtitle: '2×2 Matrix' },
  { title: 'Why Now', subtitle: 'Four Forces' },
  { title: 'Traction', subtitle: 'The Machine Is Running' },
  { title: 'Signup & Conversion', subtitle: 'Acquisition Machine' },
  { title: 'Volume & Revenue', subtitle: 'Revenue Machine' },
  { title: 'Retention', subtitle: 'Retention Machine' },
  { title: 'Credit & Wallet', subtitle: 'Full Stack in Motion' },
  { title: 'Unit Economics', subtitle: 'Better Every Transaction' },
  { title: 'Team', subtitle: 'Built for This Moment' },
  { title: 'The Ask', subtitle: 'Series C Raise' },
  { title: 'Financial Projections', subtitle: 'The Margin Story' },
  { title: 'The Vision', subtitle: 'Financial OS for the World' },
]

/* ─────────────────────── Main Page ─────────────────────── */

export default function FelixInvestorPage() {
  const [current, setCurrent] = useState(0)
  const [mounted, setMounted] = useState(false)
  const total = slides.length

  useEffect(() => {
    setMounted(true)
    const hash = window.location.hash
    if (hash) {
      const n = parseInt(hash.replace('#slide-', ''), 10)
      if (!isNaN(n) && n >= 0 && n < total) setCurrent(n)
    }
  }, [total])

  useEffect(() => {
    if (mounted) window.history.replaceState(null, '', `#slide-${current}`)
  }, [current, mounted])

  const [tocOpen, setTocOpen] = useState(false)
  const [tocView, setTocView] = useState<'list' | 'cards'>('list')
  const { comments, commentMode, setCommentMode, addComment, deleteComment, editComment, addReply, deleteReply } = useComments('felix-investor-comments')
  const { locale, setLocale } = useLocale()
  const slideRef = useRef<HTMLDivElement>(null)
  useSlideTranslation(slideRef, locale, current)

  const next = useCallback(() => setCurrent((p) => Math.min(p + 1, total - 1)), [total])
  const prev = useCallback(() => setCurrent((p) => Math.max(p - 1, 0)), [])

  useEffect(() => {
    if (!mounted) return
    const handler = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement | null
      if (t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA')) return
      if (e.key === 'Escape' && tocOpen) { e.preventDefault(); setTocOpen(false); return }
      if (tocOpen) return
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
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchX === null) return
    const diff = touchX - e.changedTouches[0].clientX
    if (diff > 50) next()
    else if (diff < -50) prev()
    setTouchX(null)
  }

  const Slide = slides[current]
  const isDark = darkSlideSet.has(current)
  const isBrand = brandSlideSet.has(current)

  const pillBg = isBrand ? 'bg-slate/20 border-slate/20' : isDark ? 'bg-white/10 border-white/10' : 'bg-white/90 border-border shadow-xs'
  const pillText = isBrand ? 'text-slate/80' : isDark ? 'text-white/70' : 'text-foreground'
  const hintText = isBrand ? 'text-slate/50' : isDark ? 'text-white/40' : 'text-muted-foreground'
  const trackBg = isBrand ? 'bg-slate/10' : isDark ? 'bg-white/10' : 'bg-concrete/30'
  const trackFill = isBrand ? 'bg-slate/60' : isDark ? 'bg-turquoise' : 'bg-evergreen'
  const dotActive = isBrand ? 'bg-slate/70' : isDark ? 'bg-turquoise' : 'bg-evergreen'
  const dotInactive = isBrand ? 'bg-slate/20 hover:bg-slate/30' : isDark ? 'bg-white/20 hover:bg-white/30' : 'bg-concrete hover:bg-concrete/70'
  const btnCls = isBrand ? 'bg-slate/15 border-slate/15 hover:bg-slate/25' : isDark ? 'bg-white/10 border-white/10 hover:bg-white/20' : 'bg-white/90 border-border hover:bg-white hover:shadow-md'
  const btnIcon = isBrand ? 'text-slate/70' : isDark ? 'text-white/70' : 'text-foreground'

  return (
    <PresentationPassword>
      <div
        className="h-screen w-screen overflow-hidden relative select-none"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {/* Progress bar */}
        <div className={`absolute top-0 inset-x-0 h-1 z-50 transition-colors duration-500 ${trackBg}`}>
          <div
            className={`h-full transition-all duration-500 ease-out ${trackFill}`}
            style={{ width: `${((current + 1) / total) * 100}%` }}
          />
        </div>

        {/* Slide counter */}
        <div className="absolute top-4 left-4 sm:top-6 sm:left-6 z-50">
          <div className={`px-3 py-1.5 backdrop-blur-sm rounded-full border transition-colors duration-500 ${pillBg}`}>
            <span className={`text-xs sm:text-sm font-medium transition-colors duration-500 ${pillText}`}>
              {current + 1} / {total}
            </span>
          </div>
        </div>

        {/* TOC + controls */}
        <SlideTocChrome
          tocOpen={tocOpen}
          onToggle={() => setTocOpen(!tocOpen)}
          tocView={tocView}
          onViewChange={setTocView}
          pillBg={pillBg}
          pillText={pillText}
          hintText={hintText}
          onReset={() => setCurrent(0)}
          commentMode={commentMode}
          onToggleComments={() => setCommentMode(!commentMode)}
          locale={locale}
          onLocaleChange={setLocale}
        />

        {/* Slide content */}
        <div ref={slideRef} className="h-full w-full relative" key={current}>
          <div className="h-full w-full animate-in fade-in duration-300">
            <Slide />
          </div>
          <SlideCommentLayer
            slideIndex={current}
            commentMode={commentMode}
            comments={comments}
            onAddComment={addComment}
            onEditComment={editComment}
            onDeleteComment={deleteComment}
            onAddReply={addReply}
            onDeleteReply={deleteReply}
            onExitCommentMode={() => setCommentMode(false)}
          />
        </div>

        {/* Bottom dot navigation */}
        <div className="absolute bottom-10 sm:bottom-12 left-1/2 -translate-x-1/2 z-50 flex gap-2">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`h-1.5 sm:h-2 rounded-full transition-all duration-300 ${
                current === i
                  ? `w-8 sm:w-12 ${dotActive}`
                  : `w-1.5 sm:w-2 ${dotInactive}`
              }`}
              aria-label={`Go to slide ${i + 1}: ${slideMeta[i]?.title}`}
            />
          ))}
        </div>

        {/* Desktop prev/next arrows */}
        <button
          onClick={prev}
          disabled={current === 0}
          className={`hidden md:flex absolute left-4 sm:left-6 top-1/2 -translate-y-1/2 z-50 w-10 h-10 sm:w-12 sm:h-12 rounded-full border items-center justify-center transition-all duration-200 disabled:opacity-0 disabled:pointer-events-none ${btnCls}`}
          aria-label="Previous slide"
        >
          <svg className={`w-5 h-5 ${btnIcon}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <button
          onClick={next}
          disabled={current === total - 1}
          className={`hidden md:flex absolute right-4 sm:right-6 top-1/2 -translate-y-1/2 z-50 w-10 h-10 sm:w-12 sm:h-12 rounded-full border items-center justify-center transition-all duration-200 disabled:opacity-0 disabled:pointer-events-none ${btnCls}`}
          aria-label="Next slide"
        >
          <svg className={`w-5 h-5 ${btnIcon}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </button>

        {/* Mobile swipe hint */}
        <div className={`md:hidden absolute bottom-5 left-1/2 -translate-x-1/2 z-40 text-[10px] tracking-wide ${hintText}`}>
          swipe to navigate
        </div>

        <SlideToc
          open={tocOpen}
          onClose={() => setTocOpen(false)}
          slides={slides}
          slideMeta={slideMeta}
          darkSlideSet={darkSlideSet}
          current={current}
          view={tocView}
          onSelect={(i) => { setCurrent(i); setTocOpen(false) }}
        />
        <SlidePreTranslator slides={slides} locale={locale} />
      </div>
    </PresentationPassword>
  )
}
