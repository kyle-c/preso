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
      {/* Hero stat row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div className="bg-white rounded-2xl border border-concrete shadow-sm p-6">
          <p className="text-[14px] font-semibold text-slate/50 mb-2">Primary archetype</p>
          <p className="font-display font-black text-[36px] text-slate leading-none mb-2">60%+</p>
          <p className="text-[15px] text-slate"><strong>"Distrustful Experimenters"</strong> — test small, adopt if fast, no SSN needed</p>
        </div>
        <div className="bg-white rounded-2xl border border-concrete shadow-sm p-6">
          <p className="text-[14px] font-semibold text-slate/50 mb-2">Secondary archetype</p>
          <p className="font-display font-black text-[36px] text-slate leading-none mb-2">~40%</p>
          <p className="text-[15px] text-slate"><strong>Price hunters</strong> — compare rates, switch apps. Analytical but equally mobile-first.</p>
        </div>
        <div className="bg-white rounded-2xl border border-concrete shadow-sm p-6">
          <p className="text-[14px] font-semibold text-slate/50 mb-2">Market readiness</p>
          <p className="font-display font-black text-[36px] text-slate leading-none mb-2">92%</p>
          <p className="text-[15px] text-slate">Fintech adoption rate among Hispanic consumers. $30–40k income.</p>
        </div>
      </div>

      {/* Mental model */}
      <div className="bg-white rounded-2xl border border-concrete shadow-sm p-6 mb-4">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-9 h-9 rounded-lg flex items-center justify-center bg-stone"><ChatDots size={20} style={{ color: C.slate }} /></div>
          <h3 className="font-display font-extrabold text-[20px] text-slate">How they think about money</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="rounded-xl bg-stone/50 p-4">
            <p className="font-display font-extrabold text-[16px] text-slate mb-1">WhatsApp is home base</p>
            <p className="text-[14px] text-slate/70">Not email. Not an app store. WhatsApp.</p>
          </div>
          <div className="rounded-xl bg-stone/50 p-4">
            <p className="font-display font-extrabold text-[16px] text-slate mb-1">"Can't touch it, not mine"</p>
            <p className="text-[14px] text-slate/70">Digital money causes anxiety. Confirmation must be felt.</p>
          </div>
          <div className="rounded-xl bg-stone/50 p-4">
            <p className="font-display font-extrabold text-[16px] text-slate mb-1">Trust travels through people</p>
            <p className="text-[14px] text-slate/70">One crew member adopts, the whole crew follows.</p>
          </div>
        </div>
      </div>

      {/* Friction + Jobs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div className="bg-white rounded-2xl border border-concrete shadow-sm p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-9 h-9 rounded-lg flex items-center justify-center bg-stone"><Lightning size={20} style={{ color: C.slate }} /></div>
            <h3 className="font-display font-extrabold text-[20px] text-slate">Biggest friction points</h3>
          </div>
          <div className="rounded-xl bg-stone/50 p-4 mb-4 text-center">
            <p className="font-display font-black text-[36px] text-slate leading-none">84%</p>
            <p className="text-[13px] text-slate/50 mt-1">of drop-offs actively tried to send</p>
          </div>
          <ul className="space-y-1.5 text-[15px] text-slate">
            <Li><strong>First-tx errors kill retention</strong> — permanently</Li>
            <Li><strong>Frozen screens</strong> = trust emergency</Li>
            <Li><strong>70% Colombia abandonment</strong> at name entry</Li>
            <Li><strong>Web → WhatsApp handoff</strong> breaks flow</Li>
          </ul>
        </div>

        <div className="bg-white rounded-2xl border border-concrete shadow-sm p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-9 h-9 rounded-lg flex items-center justify-center bg-stone"><Clipboard size={20} style={{ color: C.slate }} /></div>
            <h3 className="font-display font-extrabold text-[20px] text-slate">Jobs to be done</h3>
          </div>
          <div className="grid grid-cols-3 gap-2 mb-4">
            {['Test', 'Send', 'Confirm', 'Refer', 'Repeat', 'Borrow'].map(j => (
              <div key={j} className="rounded-lg bg-stone/50 px-3 py-2 text-center">
                <p className="font-display font-extrabold text-[14px] text-slate">{j}</p>
              </div>
            ))}
          </div>
          <ul className="space-y-1.5 text-[15px] text-slate">
            <Li>$100 first send to prove "this works"</Li>
            <Li>Weekly, best rate, 2 min from job site</Li>
            <Li>51% organic/referral acquisition</Li>
            <Li>Credit = 84% retention (vs 36%)</Li>
          </ul>
        </div>
      </div>

      {/* Strategic bets — slate cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="rounded-2xl p-6 shadow-sm bg-slate">
          <div className="w-9 h-9 rounded-lg flex items-center justify-center mb-3 bg-white/10"><ChatDots size={20} style={{ color: C.turquoise }} /></div>
          <p className="font-display font-extrabold text-[18px] text-white mb-2">WhatsApp-native</p>
          <p className="text-[15px] text-white/60">Conversational first. Hybrid with practical UI. Lives where users already are.</p>
        </div>
        <div className="rounded-2xl p-6 shadow-sm bg-slate">
          <div className="w-9 h-9 rounded-lg flex items-center justify-center mb-3 bg-white/10"><UserCircle size={20} style={{ color: C.turquoise }} /></div>
          <p className="font-display font-extrabold text-[18px] text-white mb-2">Community growth</p>
          <p className="text-[15px] text-white/60">51% organic. One believer seeds an entire crew. Human support cements trust.</p>
        </div>
        <div className="rounded-2xl p-6 shadow-sm bg-slate">
          <div className="w-9 h-9 rounded-lg flex items-center justify-center mb-3 bg-white/10"><Rocket size={20} style={{ color: C.turquoise }} /></div>
          <p className="font-display font-extrabold text-[18px] text-white mb-2">Multiproduct moat</p>
          <p className="text-[15px] text-white/60">Remittances → Credit → Wallet. Credit doubles retention. Certainty over speed.</p>
        </div>
      </div>
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
          <div className="rounded-xl p-4 mb-4 text-center bg-stone/50">
            <div className="flex items-center justify-center divide-x divide-slate/10">
              <div className="flex-1 px-4">
                <p className="font-display font-black text-[40px] text-slate leading-none">4.78</p>
                <p className="text-[13px] text-slate/50 mt-1.5">Tx/month (top 20%)</p>
              </div>
              <div className="flex-1 px-4">
                <p className="font-display font-black text-[40px] text-slate leading-none">$100</p>
                <p className="text-[13px] text-slate/50 mt-1.5">First test send</p>
              </div>
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
      {/* Two-column hero */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div className="bg-white rounded-2xl border border-concrete shadow-sm p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-9 h-9 rounded-lg flex items-center justify-center bg-stone"><UserCircle size={20} style={{ color: C.slate }} /></div>
            <h3 className="font-display font-extrabold text-[20px] text-slate">The user</h3>
          </div>
          <p className="text-[16px] text-slate leading-relaxed"><strong>LatAm blue-collar migrants in the US.</strong> $30–40k income. 92% fintech-ready. 60%+ test small before committing. Trust comes from peers, not marketing. WhatsApp is their only stable digital address.</p>
        </div>
        <div className="bg-white rounded-2xl border border-concrete shadow-sm p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-9 h-9 rounded-lg flex items-center justify-center bg-stone"><ChatDots size={20} style={{ color: C.slate }} /></div>
            <h3 className="font-display font-extrabold text-[20px] text-slate">Behavior</h3>
          </div>
          <p className="text-[16px] text-slate leading-relaxed"><strong>Both types live on WhatsApp.</strong> "If I can't touch it, it's not mine." Trust is earned by trial and peer proof. One adopter on a crew converts the whole crew. 51% acquisition is organic.</p>
        </div>
      </div>

      {/* Key numbers strip */}
      <div className="bg-white rounded-2xl border border-concrete shadow-sm p-5 mb-4">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {[
            { v: '84%', l: 'tried to send but got stuck' },
            { v: '70%', l: 'CO abandonment at name entry' },
            { v: '84%', l: '6-mo retention w/ credit' },
            { v: '4.78', l: 'tx/month (top 20%)' },
            { v: '51%', l: 'organic acquisition' },
          ].map((s, i) => (
            <div key={i} className="text-center rounded-xl bg-stone/50 p-3">
              <p className="font-display font-black text-[28px] text-slate leading-none">{s.v}</p>
              <p className="text-[12px] text-slate/50 mt-1">{s.l}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Friction + Jobs condensed */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div className="bg-white rounded-2xl border border-concrete shadow-sm p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 rounded-lg flex items-center justify-center bg-stone"><Lightning size={20} style={{ color: C.slate }} /></div>
            <h3 className="font-display font-extrabold text-[20px] text-slate">What breaks</h3>
          </div>
          <p className="text-[16px] text-slate leading-relaxed">First-tx errors kill retention permanently. Frozen screens feel like lost money. Name entry and web-to-WhatsApp handoff are the biggest flow killers.</p>
        </div>
        <div className="bg-white rounded-2xl border border-concrete shadow-sm p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 rounded-lg flex items-center justify-center bg-stone"><Clipboard size={20} style={{ color: C.slate }} /></div>
            <h3 className="font-display font-extrabold text-[20px] text-slate">What they need</h3>
          </div>
          <p className="text-[16px] text-slate leading-relaxed"><strong>Test → Send → Confirm → Refer → Repeat → Borrow.</strong> Weekly ritual, 2 min from the job site, best rate. Credit is the retention moat.</p>
        </div>
      </div>

      {/* Strategic bets — slate cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="rounded-2xl p-6 shadow-sm bg-slate">
          <div className="w-9 h-9 rounded-lg flex items-center justify-center mb-3 bg-white/10"><ChatDots size={20} style={{ color: C.turquoise }} /></div>
          <p className="font-display font-extrabold text-[18px] text-white mb-2">WhatsApp-native</p>
          <p className="text-[15px] text-white/60">Conversational first. Lives where users already are.</p>
        </div>
        <div className="rounded-2xl p-6 shadow-sm bg-slate">
          <div className="w-9 h-9 rounded-lg flex items-center justify-center mb-3 bg-white/10"><UserCircle size={20} style={{ color: C.turquoise }} /></div>
          <p className="font-display font-extrabold text-[18px] text-white mb-2">Community growth</p>
          <p className="text-[15px] text-white/60">51% organic. Human support cements trust.</p>
        </div>
        <div className="rounded-2xl p-6 shadow-sm bg-slate">
          <div className="w-9 h-9 rounded-lg flex items-center justify-center mb-3 bg-white/10"><Rocket size={20} style={{ color: C.turquoise }} /></div>
          <p className="font-display font-extrabold text-[18px] text-white mb-2">Multiproduct moat</p>
          <p className="text-[15px] text-white/60">Remittances → Credit → Wallet. Credit = retention.</p>
        </div>
      </div>
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
