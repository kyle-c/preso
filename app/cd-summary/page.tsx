'use client'

import {
  Lightning, Rocket, Clipboard, ChatDots, UserCircle,
} from '@/components-next/phosphor-icons'

const C = { turquoise: '#2BF2F1', slate: '#082422', evergreen: '#35605F', cactus: '#60D06F', mango: '#F19D38', papaya: '#F26629', sage: '#7BA882', sky: '#8DFDFA', stone: '#EFEBE7', concrete: '#CFCABF', mocha: '#877867', lychee: '#FFCD9C', blueberry: '#6060BF' }

function Li({ children }: { children: React.ReactNode }) {
  return <li className="flex items-start gap-2"><span className="text-slate/40 mt-0.5 shrink-0">·</span><span>{children}</span></li>
}

export default function CDSummaryPage() {
  return (
    <div className="min-h-screen bg-stone p-6 md:p-10 relative overflow-hidden">
      {/* Floating illustrations */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute top-[4%] left-[2%] w-[160px] lg:w-[200px] opacity-[0.05] -rotate-12" style={{ animation: 'ds-float 8s ease-in-out infinite' }}>
          <object type="image/svg+xml" data="/illustrations/Speech%20Bubbles.svg" className="w-full h-auto" style={{ pointerEvents: 'none' }} />
        </div>
        <div className="absolute top-[15%] right-[3%] w-[120px] lg:w-[160px] opacity-[0.04] rotate-6" style={{ animation: 'ds-drift 9s ease-in-out infinite 1s' }}>
          <object type="image/svg+xml" data="/illustrations/Letter%20in%20Envelope.svg" className="w-full h-auto" style={{ pointerEvents: 'none' }} />
        </div>
        <div className="absolute bottom-[10%] left-[4%] w-[130px] lg:w-[170px] opacity-[0.05] rotate-3" style={{ animation: 'ds-drift 10s ease-in-out infinite 2s' }}>
          <object type="image/svg+xml" data="/illustrations/Speech%20Bubbles%20%2B%20Hearts.svg" className="w-full h-auto" style={{ pointerEvents: 'none' }} />
        </div>
        <div className="absolute bottom-[6%] right-[3%] w-[100px] lg:w-[140px] opacity-[0.05] -rotate-6" style={{ animation: 'ds-float 7s ease-in-out infinite 0.5s' }}>
          <object type="image/svg+xml" data="/illustrations/Hand%20-%20Stars.svg" className="w-full h-auto" style={{ pointerEvents: 'none' }} />
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto relative z-10">
        {/* Header */}
        <div className="mb-8 text-center">
          <span className="inline-block rounded-full bg-turquoise px-4 py-1 text-[12px] font-semibold text-slate uppercase tracking-wider mb-3">Content Design</span>
          <h1 className="font-display font-black text-3xl md:text-4xl text-slate tracking-tight">Copy Quality Plan</h1>
          <p className="text-slate/50 text-base mt-1">Short-term fixes and long-term system for WhatsApp copy at scale</p>
        </div>

        {/* Problem cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div className="bg-white rounded-2xl border border-concrete shadow-sm p-6">
            <p className="text-[14px] font-semibold text-slate/50 mb-2">Core problem</p>
            <p className="font-display font-black text-[28px] text-slate leading-tight mb-2">Subjective</p>
            <p className="text-[15px] text-slate">Copy feedback is opinion-based. No shared standard, no data, no sequence-level review.</p>
          </div>
          <div className="bg-white rounded-2xl border border-concrete shadow-sm p-6">
            <p className="text-[14px] font-semibold text-slate/50 mb-2">Recurring issue</p>
            <p className="font-display font-black text-[28px] text-slate leading-tight mb-2">Not Sticking</p>
            <p className="text-[15px] text-slate">Revisions come back convoluted or overly colloquial. Ad hoc feedback isn't producing lasting change.</p>
          </div>
          <div className="bg-white rounded-2xl border border-concrete shadow-sm p-6">
            <p className="text-[14px] font-semibold text-slate/50 mb-2">Opportunity</p>
            <p className="font-display font-black text-[28px] text-slate leading-tight mb-2">LLM-Ready</p>
            <p className="text-[15px] text-slate">AI copy review is rudimentary today. Significant opportunity to make LLM enforcement standard.</p>
          </div>
        </div>

        {/* Short-term / Long-term split */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          {/* Short-term */}
          <div className="bg-white rounded-2xl border border-concrete shadow-sm p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-lg flex items-center justify-center bg-stone"><Lightning size={20} style={{ color: C.slate }} /></div>
              <div>
                <h3 className="font-display font-extrabold text-[20px] text-slate">Starting now</h3>
                <p className="text-[13px] text-slate/50">This week</p>
              </div>
            </div>

            <div className="rounded-xl bg-stone/50 p-4 mb-4">
              <p className="font-display font-extrabold text-[16px] text-slate mb-2">Claude Skill for copy</p>
              <p className="text-[14px] text-slate/70 mb-3">Every string runs through a Claude Skill that generates 5-10 options optimized for:</p>
              <div className="flex gap-2">
                {['Warmth', 'Conciseness', 'Clarity'].map(q => (
                  <span key={q} className="rounded-lg bg-white px-3 py-1.5 text-[13px] font-semibold text-slate border border-concrete">{q}</span>
                ))}
              </div>
            </div>

            <div className="rounded-xl bg-stone/50 p-4">
              <p className="font-display font-extrabold text-[16px] text-slate mb-2">Design modular, review holistic</p>
              <ul className="space-y-1.5 text-[14px] text-slate/80">
                <Li><strong>Write modular</strong> — each string is self-contained</Li>
                <Li><strong>Review in context</strong> — inside designs, not spreadsheets</Li>
                <Li><strong>LLM validates the whole</strong> — checks full flow for redundancy</Li>
              </ul>
            </div>
          </div>

          {/* Long-term */}
          <div className="bg-white rounded-2xl border border-concrete shadow-sm p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-lg flex items-center justify-center bg-stone"><Rocket size={20} style={{ color: C.slate }} /></div>
              <div>
                <h3 className="font-display font-extrabold text-[20px] text-slate">Coming next</h3>
                <p className="text-[13px] text-slate/50">Five-phase framework</p>
              </div>
            </div>

            <div className="space-y-3">
              {[
                { phase: '0', title: 'Copy Audit', desc: 'Codebase inventory, LLM flag pass, pattern analysis, audit report', color: C.papaya },
                { phase: '1', title: 'Copy Bible', desc: 'Standards from audit findings + multilingual scope (PT-BR expansion, locale tone)', color: C.blueberry },
                { phase: '2', title: 'Design Flow Builder', desc: 'Source of truth tool with code-level copy, canvas view, side-by-side locales', color: C.cactus },
                { phase: '3', title: 'LLM Enforcement', desc: 'Verbosity limits, redundancy flags, tone/voice checks, multilingual parity', color: C.turquoise },
                { phase: '4', title: 'Human Sign-Off', desc: 'Fast 4-point check: LLM pass, no redundancy flags, locale parity, single CTA', color: C.mango },
              ].map(p => (
                <div key={p.phase} className="flex items-start gap-3 rounded-xl bg-stone/50 p-3.5" style={{ borderLeftWidth: 3, borderLeftColor: p.color }}>
                  <span className="font-display font-black text-[18px] text-slate/30 mt-0.5 w-5 shrink-0">{p.phase}</span>
                  <div>
                    <p className="font-display font-extrabold text-[15px] text-slate">{p.title}</p>
                    <p className="text-[13px] text-slate/60 mt-0.5">{p.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Anti-patterns */}
        <div className="bg-white rounded-2xl border border-concrete shadow-sm p-6 mb-4">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-9 h-9 rounded-lg flex items-center justify-center bg-stone"><Clipboard size={20} style={{ color: C.slate }} /></div>
            <h3 className="font-display font-extrabold text-[20px] text-slate">Common anti-patterns to fix</h3>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { title: 'Double CTA', desc: 'Same call to action in opener and closer' },
              { title: 'Echo Sequence', desc: 'Message 2 restates everything from Message 1' },
              { title: 'Preamble Problem', desc: 'Value buried behind scene-setting context' },
              { title: 'Safety Net', desc: 'Info repeated "just in case" user missed it' },
            ].map(p => (
              <div key={p.title} className="rounded-xl bg-stone/50 p-4 text-center">
                <p className="font-display font-extrabold text-[15px] text-slate mb-1">{p.title}</p>
                <p className="text-[13px] text-slate/50">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom: Measurement + Principles */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="rounded-2xl p-6 shadow-sm bg-slate">
            <div className="w-9 h-9 rounded-lg flex items-center justify-center mb-3 bg-white/10"><ChatDots size={20} style={{ color: C.turquoise }} /></div>
            <p className="font-display font-extrabold text-[18px] text-white mb-2">Succinct is non-negotiable</p>
            <p className="text-[15px] text-white/60">Clean, direct communication. Every word earns its place. No preambles, no echoes.</p>
          </div>
          <div className="rounded-2xl p-6 shadow-sm bg-slate">
            <div className="w-9 h-9 rounded-lg flex items-center justify-center mb-3 bg-white/10"><UserCircle size={20} style={{ color: C.turquoise }} /></div>
            <p className="font-display font-extrabold text-[18px] text-white mb-2">LLM before it ships</p>
            <p className="text-[15px] text-white/60">All copy runs through an LLM review. Catches verbosity, redundancy, and tone drift automatically.</p>
          </div>
          <div className="rounded-2xl p-6 shadow-sm bg-slate">
            <div className="w-9 h-9 rounded-lg flex items-center justify-center mb-3 bg-white/10"><Rocket size={20} style={{ color: C.turquoise }} /></div>
            <p className="font-display font-extrabold text-[18px] text-white mb-2">60-90 day audit cycle</p>
            <p className="text-[15px] text-white/60">Re-run the same audit. The delta between audits is proof the system is working.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
