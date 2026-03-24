'use client'

import { useState, useEffect } from 'react'
import {
  UserCircle, ChatDots, Lightning, Clipboard, Rocket,
} from '@/components-next/phosphor-icons'

const C = { turquoise: '#2BF2F1', slate: '#082422', evergreen: '#35605F', cactus: '#60D06F', mango: '#F19D38', papaya: '#F26629', sage: '#7BA882', sky: '#8DFDFA', stone: '#EFEBE7', concrete: '#CFCABF', mocha: '#877867', lychee: '#FFCD9C', blueberry: '#6060BF' }

function Section({ title, color, icon, children, className = '' }: { title: string; color: string; icon: React.ReactNode; children: React.ReactNode; className?: string }) {
  return (
    <div className={`bg-white rounded-2xl border border-slate/10 shadow-sm overflow-hidden ${className}`}>
      <div className="px-6 py-4 border-b border-slate/10 flex items-center gap-3" style={{ borderLeftWidth: 4, borderLeftColor: color }}>
        <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0" style={{ background: `${color}20` }}>
          {icon}
        </div>
        <h3 className="font-display font-extrabold text-[20px] text-slate">{title}</h3>
      </div>
      <div className="px-6 py-5 text-[15px] text-slate leading-relaxed">
        {children}
      </div>
    </div>
  )
}

function Li({ children }: { children: React.ReactNode }) {
  return <li className="flex items-start gap-2"><span className="text-slate/40 mt-0.5 shrink-0">·</span><span>{children}</span></li>
}

/* ── Version 1: Bold Headlines ──────────────────────────────── */
function V1() {
  return (
    <>
      <Section title="Who is the user?" color={C.turquoise} icon={<UserCircle size={20} style={{ color: C.evergreen }} />} className="mb-4">
        <p className="font-semibold mb-2">Blue-collar LatAm migrants in the US. $30–40k income. 92% fintech-ready.</p>
        <ul className="space-y-1 ml-1">
          <Li><strong>60%+ are "Distrustful Experimenters"</strong> — test small, adopt if fast, no SSN needed. Trust comes from peers, not ads.</Li>
          <Li><strong>The rest are price hunters</strong> — compare rates, switch apps. More analytical but equally mobile-first.</Li>
        </ul>
      </Section>

      <Section title="How they think about money" color={C.blueberry} icon={<ChatDots size={20} style={{ color: C.blueberry }} />} className="mb-4">
        <ul className="space-y-1 ml-1">
          <Li><strong>WhatsApp is home base.</strong> Not email. Not an app store download. WhatsApp.</Li>
          <Li><strong>"If I can't touch it, it's not mine."</strong> Digital money causes anxiety. Confirmation must be felt, not just seen.</Li>
          <Li><strong>Trust travels through people.</strong> One person on a crew adopts → the whole crew considers it.</Li>
        </ul>
      </Section>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <Section title="Biggest friction points" color={C.papaya} icon={<Lightning size={20} style={{ color: C.papaya }} />}>
          <ul className="space-y-1 ml-1">
            <Li><strong>First-transaction errors kill retention</strong> — permanently</Li>
            <Li><strong>84% of drop-offs tried to send</strong> — blocked by missing info at the moment of attempt</Li>
            <Li><strong>Frozen screens = "my money disappeared"</strong> — trust emergency, not UX bug</Li>
            <Li><strong>Name entry causes 70% Colombia abandonment</strong> (16/23 users)</Li>
            <Li><strong>Web-to-WhatsApp handoff confuses</strong> — flow breaks destroy momentum</Li>
          </ul>
        </Section>

        <Section title="Jobs to be done" color={C.cactus} icon={<Clipboard size={20} style={{ color: C.evergreen }} />}>
          <ul className="space-y-1 ml-1">
            <Li><strong>Test</strong> — Send $100 to prove "this works"</Li>
            <Li><strong>Send</strong> — Weekly, fast, best rate, from the job site in 2 min</Li>
            <Li><strong>Confirm</strong> — Check it arrived. Peace of mind is the product.</Li>
            <Li><strong>Refer</strong> — 51% organic/referral. Community IS distribution.</Li>
            <Li><strong>Repeat</strong> — Top 20%: 4.78 tx/month, 18-month tenure</Li>
            <Li><strong>Borrow</strong> — Credit = 84% retention at 6mo (vs 36% without)</Li>
          </ul>
        </Section>
      </div>

      <Section title="Strategic bets" color={C.slate} icon={<Rocket size={20} style={{ color: C.slate }} />}>
        <ul className="space-y-1 ml-1">
          <Li><strong>Zero-friction WhatsApp experience</strong> — conversational first, hybrid with practical UI</Li>
          <Li><strong>Community-powered growth</strong> — 51% organic. One believer seeds an entire network.</Li>
          <Li><strong>Multiproduct moat</strong> — Remittances → Credit → Wallet. Credit doubles retention.</Li>
          <Li><strong>Human support as brand</strong> — A real person picks up. Trust isn't recovered — it's cemented.</Li>
          <Li><strong>Retention over acquisition</strong> — Top 20% LTV: $175/tx avg, 18-month tenure</Li>
        </ul>
      </Section>
    </>
  )
}

/* ── Version 2: Dashboard ─────────────────────────────────── */

function DashCard({ title, value, subtitle, bg, color, icon, dark }: {
  title: string; value: string; subtitle?: string; bg: string; color: string; icon: React.ReactNode; dark?: boolean; children?: React.ReactNode
}) {
  return (
    <div className="rounded-2xl p-6 shadow-sm" style={{ background: bg }}>
      <div className="flex items-center justify-between mb-4">
        <p className="text-[15px] font-semibold" style={{ color }}>{title}</p>
        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${dark ? 'bg-white/10' : 'bg-white/60'}`}>{icon}</div>
      </div>
      <p className={`font-display font-black text-[44px] leading-none tracking-tight ${dark ? 'text-white' : 'text-slate'}`}>{value}</p>
      {subtitle && <p className={`text-[14px] mt-2 ${dark ? 'text-white/50' : 'text-slate/50'}`}>{subtitle}</p>}
    </div>
  )
}

function V2() {
  return (
    <>
      {/* Top stat cards row — core brand palette */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
        <DashCard title="Distrustful Experimenters" value="60%+" subtitle="of the user base" bg="white" color={C.slate} icon={<UserCircle size={18} style={{ color: C.slate }} />} />
        <DashCard title="Annual Income" value="$30–40k" subtitle="Blue-collar LatAm migrants" bg="white" color={C.slate} icon={<Clipboard size={18} style={{ color: C.slate }} />} />
        <DashCard title="Fintech Adoption" value="92%" subtitle="Among Hispanic consumers" bg="white" color={C.slate} icon={<Rocket size={18} style={{ color: C.slate }} />} />
        <DashCard title="Organic Acquisition" value="51%" subtitle="Referral / word-of-mouth" bg="white" color={C.slate} icon={<ChatDots size={18} style={{ color: C.slate }} />} />
      </div>

      {/* Two-column: Behavior + Blockers */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div className="bg-white rounded-2xl border border-concrete shadow-sm p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-9 h-9 rounded-lg flex items-center justify-center bg-stone">
              <ChatDots size={20} style={{ color: C.slate }} />
            </div>
            <h3 className="font-display font-extrabold text-[20px] text-slate">How they behave</h3>
          </div>
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="rounded-xl p-4 bg-stone/50">
              <p className="font-display font-black text-[28px] text-slate leading-none">4.78</p>
              <p className="text-[13px] text-slate/50 mt-1">Tx/month (top 20%)</p>
            </div>
            <div className="rounded-xl p-4 bg-stone/50">
              <p className="font-display font-black text-[28px] text-slate leading-none">$100</p>
              <p className="text-[13px] text-slate/50 mt-1">First test send</p>
            </div>
          </div>
          <ul className="space-y-1.5 text-[15px] text-slate">
            <Li><strong>WhatsApp is home base.</strong> Not email, not app stores.</Li>
            <Li><strong>"If I can't touch it, it's not mine."</strong></Li>
            <Li>Trust through peer proof. One crew member adopts, the rest follow.</Li>
          </ul>
        </div>

        <div className="bg-white rounded-2xl border border-concrete shadow-sm p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-9 h-9 rounded-lg flex items-center justify-center bg-stone">
              <Lightning size={20} style={{ color: C.slate }} />
            </div>
            <h3 className="font-display font-extrabold text-[20px] text-slate">Key blockers</h3>
          </div>
          <div className="rounded-xl p-4 mb-4 text-center bg-stone/50">
            <p className="font-display font-black text-[40px] text-slate leading-none">84%</p>
            <p className="text-[14px] text-slate/50 mt-1.5">of drop-offs actively tried to send</p>
          </div>
          <ul className="space-y-1.5 text-[15px] text-slate">
            <Li>First-tx errors permanently destroy retention</Li>
            <Li>Frozen screens = "my money disappeared"</Li>
            <Li>Name entry: 70% Colombia abandonment</Li>
            <Li>Web → WhatsApp handoff breaks flow</Li>
          </ul>
        </div>
      </div>

      {/* Core jobs + Retention */}
      <div className="bg-white rounded-2xl border border-concrete shadow-sm p-6 mb-4">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-9 h-9 rounded-lg flex items-center justify-center bg-stone">
            <Clipboard size={20} style={{ color: C.slate }} />
          </div>
          <h3 className="font-display font-extrabold text-[20px] text-slate">Core jobs & retention</h3>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
          <div className="rounded-xl p-4 text-center bg-stone/50">
            <p className="font-display font-black text-[32px] text-slate leading-none">84%</p>
            <p className="text-[13px] text-slate/50 mt-1">6-mo retention w/ credit</p>
          </div>
          <div className="rounded-xl p-4 text-center bg-stone/50">
            <p className="font-display font-black text-[32px] text-slate leading-none">36%</p>
            <p className="text-[13px] text-slate/50 mt-1">Without credit</p>
          </div>
          <div className="rounded-xl p-4 text-center bg-stone/50">
            <p className="font-display font-black text-[32px] text-slate leading-none">18.4</p>
            <p className="text-[13px] text-slate/50 mt-1">Month avg tenure</p>
          </div>
          <div className="rounded-xl p-4 text-center bg-stone/50">
            <p className="font-display font-black text-[32px] text-slate leading-none">27%</p>
            <p className="text-[13px] text-slate/50 mt-1">Volume to home investments</p>
          </div>
        </div>
        <p className="text-[15px] text-slate"><strong>Test → Send → Confirm → Refer → Repeat → Borrow.</strong> Weekly ritual, 2 min from the job site, best rate. Credit is the retention moat.</p>
      </div>

      {/* Strategic bets */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="rounded-2xl p-6 shadow-sm bg-slate">
          <div className="w-9 h-9 rounded-lg flex items-center justify-center mb-3 bg-white/10">
            <ChatDots size={20} style={{ color: C.turquoise }} />
          </div>
          <p className="font-display font-extrabold text-[18px] text-white mb-2">WhatsApp-native</p>
          <p className="text-[15px] text-white/60">Conversational first. Hybrid with practical UI elements. Lives where users already are.</p>
        </div>
        <div className="rounded-2xl p-6 shadow-sm bg-slate">
          <div className="w-9 h-9 rounded-lg flex items-center justify-center mb-3 bg-white/10">
            <UserCircle size={20} style={{ color: C.turquoise }} />
          </div>
          <p className="font-display font-extrabold text-[18px] text-white mb-2">Community growth</p>
          <p className="text-[15px] text-white/60">51% organic. One believer seeds an entire crew. Human support cements trust permanently.</p>
        </div>
        <div className="rounded-2xl p-6 shadow-sm bg-slate">
          <div className="w-9 h-9 rounded-lg flex items-center justify-center mb-3 bg-white/10">
            <Rocket size={20} style={{ color: C.turquoise }} />
          </div>
          <p className="font-display font-extrabold text-[18px] text-white mb-2">Multiproduct moat</p>
          <p className="text-[15px] text-white/60">Remittances → Credit → Wallet. Credit doubles retention. Pricing competitive, certainty over speed.</p>
        </div>
      </div>
    </>
  )
}

/* ── Version 3: Ultra-Condensed ──────────────────────────── */
function V3() {
  return (
    <>
      <Section title="The user" color={C.turquoise} icon={<UserCircle size={22} style={{ color: C.evergreen }} />} className="mb-4">
        <p className="text-[17px] leading-relaxed"><strong>LatAm blue-collar migrants in the US.</strong> $30–40k income. 92% fintech-ready. 60%+ test small before committing. Trust comes from peers — not marketing. WhatsApp is their only stable digital address.</p>
      </Section>

      <Section title="Behavior patterns" color={C.blueberry} icon={<ChatDots size={22} style={{ color: C.blueberry }} />} className="mb-4">
        <p className="text-[17px] leading-relaxed"><strong>Price-compare or simplicity-seek — but both live on WhatsApp.</strong> "If I can't touch it, it's not mine." Trust is earned through trial and peer proof. One adopter on a crew converts the whole crew. 51% acquisition is organic.</p>
      </Section>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <Section title="What breaks" color={C.papaya} icon={<Lightning size={22} style={{ color: C.papaya }} />}>
          <p className="text-[17px] leading-relaxed"><strong>84% of drop-offs tried to send.</strong> They weren't disinterested — they got stuck. First-tx errors kill retention permanently. Frozen screens feel like lost money. Name entry causes 70% Colombia abandonment. Web-to-WhatsApp handoff confuses.</p>
        </Section>

        <Section title="What they need" color={C.cactus} icon={<Clipboard size={22} style={{ color: C.evergreen }} />}>
          <p className="text-[17px] leading-relaxed"><strong>Test → Send → Confirm → Refer → Repeat → Borrow.</strong> Weekly ritual, 2 min from the job site, best rate. Top 20% do 4.78 tx/month over 18 months. Credit doubles retention to 84%. 27% of volume is home-country investment.</p>
        </Section>
      </div>

      <Section title="How we win" color={C.slate} icon={<Rocket size={22} style={{ color: C.slate }} />}>
        <p className="text-[17px] leading-relaxed"><strong>WhatsApp-native, community-distributed, multiproduct.</strong> Zero friction. Human support when it breaks. Credit as retention moat. Pricing competitive but certainty over speed. Retention is the north star — not acquisition.</p>
      </Section>
    </>
  )
}

const versions = [
  { id: 'v1', label: 'Bold Headlines', desc: 'Key points bolded for scanning', Component: V1 },
  { id: 'v2', label: 'Stat-Led', desc: 'Lead with numbers, support with context', Component: V2 },
  { id: 'v3', label: 'Ultra-Condensed', desc: 'One paragraph per section, maximum density', Component: V3 },
] as const

export default function ICPExecPage() {
  const [active, setActive] = useState('v1')

  // Sync with URL hash on mount
  useEffect(() => {
    const hash = window.location.hash.replace('#', '')
    if (versions.some(v => v.id === hash)) setActive(hash)
  }, [])

  // Update hash when tab changes
  function switchTab(id: string) {
    setActive(id)
    window.history.replaceState(null, '', `#${id}`)
  }

  const { Component } = versions.find(v => v.id === active) ?? versions[0]

  return (
    <div className="min-h-screen bg-stone p-6 md:p-10 relative overflow-hidden">
      {/* Floating illustrations */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute top-[5%] left-[2%] w-[160px] lg:w-[220px] opacity-[0.06] -rotate-12" style={{ animation: 'ds-float 8s ease-in-out infinite' }}>
          <object type="image/svg+xml" data="/illustrations/Rocket%20Launch%20-%20Growth%20%2B%20Coin%20-%20Turquoise.svg" className="w-full h-auto" style={{ pointerEvents: 'none' }} />
        </div>
        <div className="absolute top-[12%] right-[3%] w-[120px] lg:w-[170px] opacity-[0.05] rotate-6" style={{ animation: 'ds-drift 9s ease-in-out infinite 1s' }}>
          <object type="image/svg+xml" data="/illustrations/Hand%20-%20Stars.svg" className="w-full h-auto" style={{ pointerEvents: 'none' }} />
        </div>
        <div className="absolute bottom-[15%] left-[5%] w-[130px] lg:w-[180px] opacity-[0.05] rotate-3" style={{ animation: 'ds-drift 10s ease-in-out infinite 2s' }}>
          <object type="image/svg+xml" data="/illustrations/Hands%20-%202%20Cell%20Phones%20-%20Juntos%20we%20Succeed.svg" className="w-full h-auto" style={{ pointerEvents: 'none' }} />
        </div>
        <div className="absolute bottom-[8%] right-[4%] w-[100px] lg:w-[140px] opacity-[0.06] -rotate-6" style={{ animation: 'ds-float 7s ease-in-out infinite 0.5s' }}>
          <object type="image/svg+xml" data="/illustrations/Paper%20Airplane%20%2B%20Coin%20-%20Turquoise.svg" className="w-full h-auto" style={{ pointerEvents: 'none' }} />
        </div>
        <div className="absolute top-[45%] right-[1%] w-[90px] lg:w-[120px] opacity-[0.04] rotate-12" style={{ animation: 'ds-float 9s ease-in-out infinite 3s' }}>
          <object type="image/svg+xml" data="/illustrations/Heart%20-F%C3%A9lix.svg" className="w-full h-auto" style={{ pointerEvents: 'none' }} />
        </div>
        <div className="absolute top-[60%] left-[1%] w-[80px] lg:w-[110px] opacity-[0.05] -rotate-3" style={{ animation: 'ds-drift 8s ease-in-out infinite 1.5s' }}>
          <object type="image/svg+xml" data="/illustrations/3%20Paper%20Airplanes%20%2B%20Coins.svg" className="w-full h-auto" style={{ pointerEvents: 'none' }} />
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto relative z-10">
        {/* Header */}
        <div className="mb-6 text-center">
          <span className="inline-block rounded-full bg-turquoise px-4 py-1 text-[12px] font-semibold text-slate uppercase tracking-wider mb-3">Executive Summary</span>
          <h1 className="font-display font-black text-3xl md:text-4xl text-slate tracking-tight">Félix ICP — At a Glance</h1>
        </div>

        {/* Version Tabs */}
        <div className="flex justify-center gap-2 mb-8">
          {versions.map(v => (
            <button
              key={v.id}
              onClick={() => switchTab(v.id)}
              className={`px-4 py-2 rounded-full text-[13px] font-semibold transition-all ${
                active === v.id
                  ? 'bg-slate text-white'
                  : 'bg-white text-slate/60 hover:text-slate border border-slate/10'
              }`}
            >
              {v.label}
            </button>
          ))}
        </div>

        <Component />
      </div>
    </div>
  )
}
