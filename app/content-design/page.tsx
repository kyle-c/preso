'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { SlideToc, SlideTocChrome } from '@/components/slide-toc'
import { useComments, SlideCommentLayer } from '@/components/slide-comments'
import { useLocale, useSlideTranslation, SlidePreTranslator } from '@/components/slide-translation'
import { useSlidePdf } from '@/components/use-slide-pdf'
import { SlidePdfOverlay } from '@/components/slide-pdf-overlay'
import { CheckCircle2, ArrowRight, AlertTriangle, Search, BookOpen, Code2, Bot, Users, MessageSquare, Globe, Layers, Zap, Sparkles, Blocks, Eye, ScanSearch } from 'lucide-react'

/* ─────────────────────── Colors ─────────────────────── */

const C = { turquoise: '#2BF2F1', slate: '#082422', blueberry: '#6060BF', evergreen: '#35605F', cactus: '#60D06F', mango: '#F19D38', papaya: '#F26629', lime: '#DCFF00', lychee: '#FFCD9C', sky: '#8DFDFA', stone: '#EFEBE7', concrete: '#CFCABF', mocha: '#877867' }

/* ─────────────────────── Shared Components ─────────────────────── */

function SlideFooter({ num, total, dark }: { num: number; total: number; dark?: boolean }) {
  return (
    <div className="absolute bottom-0 inset-x-0 flex items-center justify-between px-8 sm:px-12 pb-5 sm:pb-6 text-sm font-sans">
      <span className={`font-display font-extrabold text-xs sm:text-sm ${dark ? 'text-linen' : 'text-foreground'}`}>Content Design</span>
      <span className={`text-xs sm:text-sm ${dark ? 'text-linen/50' : 'text-muted-foreground'}`}>felixpago.com</span>
      <span className={`text-xs sm:text-sm font-medium ${dark ? 'text-linen' : 'text-foreground'}`}>{num} / {total}</span>
    </div>
  )
}

function PillBadge({ children, dark }: { children: React.ReactNode; dark?: boolean }) {
  return (
    <span className={`inline-block rounded-full px-5 py-1.5 font-sans font-semibold text-sm sm:text-base uppercase tracking-[0.12em] ${dark ? 'bg-turquoise/20 text-turquoise' : 'bg-turquoise text-slate'}`}>
      {children}
    </span>
  )
}

function Illo({ src, className }: { src: string; className?: string }) {
  return (
    <object
      type="image/svg+xml"
      data={`/illustrations/${src}`}
      className={className ?? 'w-full h-auto'}
      style={{ pointerEvents: 'none' }}
      aria-hidden="true"
    />
  )
}

const TOTAL = 20

/* ═══════════════════════════════════════════════════════════ */
/*                         SLIDES                              */
/* ═══════════════════════════════════════════════════════════ */

/* ── Slide 1: Title ───────────────────────────────────────── */
function SlideTitle() {
  return (
    <div className="relative h-full w-full bg-slate flex flex-col overflow-hidden">
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute top-[8%] right-[5%] w-[120px] lg:w-[180px] opacity-[0.08] rotate-6" style={{ animation: 'ds-float 8s ease-in-out infinite' }}>
          <Illo src="Speech%20Bubbles.svg" />
        </div>
        <div className="absolute bottom-[12%] left-[4%] w-[100px] lg:w-[140px] opacity-[0.06] -rotate-12" style={{ animation: 'ds-drift 9s ease-in-out infinite 1s' }}>
          <Illo src="Letter%20in%20Envelope.svg" />
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center px-8 sm:px-12 lg:px-16 py-10 relative z-10">
        <div className="text-center max-w-4xl">
          <div className="mb-6 lg:mb-8">
            <PillBadge dark>Content Design</PillBadge>
          </div>
          <h1 className="font-display font-black text-linen text-4xl sm:text-5xl lg:text-6xl xl:text-7xl leading-[0.95] tracking-tight mb-6 sm:mb-8">
            WhatsApp Copy Audit & Governance Framework
          </h1>
          <p className="text-lg sm:text-xl lg:text-2xl text-linen/50 leading-relaxed max-w-2xl mx-auto">
            From subjective feedback to quantified standards. A system for content quality at scale.
          </p>
        </div>
      </div>
      <SlideFooter num={1} total={TOTAL} dark />
    </div>
  )
}

/* ── Slide 2: The Problem ──────────────────────────────────── */
function SlideProblem() {
  return (
    <div className="relative h-full w-full bg-stone flex flex-col overflow-hidden">
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute bottom-[10%] right-[4%] w-[120px] lg:w-[160px] opacity-[0.08] rotate-6" style={{ animation: 'ds-drift 9s ease-in-out infinite' }}>
          <Illo src="Attention%20-%20Siren.svg" />
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center px-8 sm:px-12 lg:px-16 py-10 relative z-10">
        <div className="max-w-4xl w-full">
          <div className="mb-5 lg:mb-6 text-center">
            <PillBadge>The Challenge</PillBadge>
          </div>
          <h1 className="font-display font-black text-foreground text-4xl sm:text-5xl lg:text-6xl xl:text-7xl leading-[0.95] tracking-tight mb-8 lg:mb-10 text-center">
            Copy feedback is subjective
          </h1>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { icon: AlertTriangle, label: '"It feels verbose"', desc: 'Feedback without data makes it personal, not productive.' },
              { icon: MessageSquare, label: 'No shared standard', desc: 'Every designer writes to their own internal bar for quality.' },
              { icon: Layers, label: 'No sequence view', desc: 'Messages reviewed in isolation miss redundancy across flows.' },
            ].map((item) => (
              <div key={item.label} className="bg-white rounded-2xl p-6 sm:p-7 border border-border shadow-sm">
                <item.icon className="h-8 w-8 text-papaya mb-4" strokeWidth={1.5} />
                <h3 className="font-display font-extrabold text-foreground text-lg mb-2">{item.label}</h3>
                <p className="text-base text-foreground/70 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      <SlideFooter num={2} total={TOTAL} />
    </div>
  )
}

/* ── Slide 3: What We're Seeing ─────────────────────────────── */
function SlideWhatWereSeeing() {
  const observations = [
    {
      label: 'Lack of directness',
      desc: 'Copy that isn\u2019t direct or succinct accumulates cognitive noise across the entire experience. This isn\u2019t a style preference \u2014 it\u2019s a UX problem.',
      accent: 'border-l-papaya',
    },
    {
      label: 'Revisions don\u2019t fully land',
      desc: 'When verbose copy is flagged and revised, corrections often come back convoluted or overly colloquial \u2014 especially on high-stakes content like FX rates.',
      accent: 'border-l-blueberry',
    },
    {
      label: 'The issue is recurring',
      desc: 'This has been raised multiple times without durable improvement. Ad hoc feedback isn\u2019t producing lasting change \u2014 a system is needed.',
      accent: 'border-l-mango',
    },
    {
      label: 'Underutilised tooling',
      desc: 'Current AI usage for copy review is rudimentary. There\u2019s a significant opportunity to integrate LLM review as a standard part of the workflow.',
      accent: 'border-l-cactus',
    },
  ]

  return (
    <div className="relative h-full w-full bg-stone flex flex-col overflow-hidden">
      <div className="flex-1 flex items-center justify-center px-8 sm:px-12 lg:px-16 py-10 relative z-10">
        <div className="max-w-4xl w-full">
          <div className="mb-5 lg:mb-6 text-center">
            <PillBadge>Observations</PillBadge>
          </div>
          <h1 className="font-display font-black text-foreground text-4xl sm:text-5xl lg:text-6xl xl:text-7xl leading-[0.95] tracking-tight mb-8 lg:mb-10 text-center">
            What we&apos;re seeing
          </h1>
          <div className="space-y-3">
            {observations.map((o) => (
              <div key={o.label} className={`bg-white rounded-xl p-5 sm:p-6 border border-border shadow-sm border-l-4 ${o.accent}`}>
                <h3 className="font-display font-extrabold text-foreground text-lg mb-1 leading-tight">{o.label}</h3>
                <p className="text-base text-foreground/70 leading-relaxed">{o.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      <SlideFooter num={3} total={TOTAL} />
    </div>
  )
}

/* ── Slide 4: The Proposed Fix ──────────────────────────────── */
function SlideProposedFix() {
  return (
    <div className="relative h-full w-full bg-slate flex flex-col overflow-hidden">
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute top-[10%] right-[5%] w-[100px] lg:w-[140px] opacity-[0.08] rotate-6" style={{ animation: 'ds-float 7s ease-in-out infinite' }}>
          <Illo src="Hand%20-%20Tool.svg" />
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center px-8 sm:px-12 lg:px-16 py-10 relative z-10">
        <div className="max-w-3xl w-full text-center">
          <div className="mb-5 lg:mb-6">
            <PillBadge dark>The Fix</PillBadge>
          </div>
          <h1 className="font-display font-black text-linen text-4xl sm:text-5xl lg:text-6xl xl:text-7xl leading-[0.95] tracking-tight mb-8 lg:mb-10">
            A sustainable system,<br />not spot fixes
          </h1>
          <p className="text-xl sm:text-2xl text-linen/50 leading-relaxed max-w-2xl mx-auto mb-10">
            Stop the cycle of one-off corrections. Build a lightweight system that makes quality the default.
          </p>
          <div className="space-y-4 text-left max-w-lg mx-auto">
            {[
              { num: '01', text: 'Succinct, clean communication is non-negotiable.' },
              { num: '02', text: 'All copy must run through an LLM before it ships.' },
              { num: '03', text: 'A working editorial guideline must be in place.' },
            ].map((item) => (
              <div key={item.num} className="flex items-start gap-4">
                <span className="font-display font-black text-turquoise text-2xl leading-none">{item.num}</span>
                <p className="text-lg text-linen/80 leading-snug font-medium">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      <SlideFooter num={4} total={TOTAL} dark />
    </div>
  )
}

/* ── Slide 5: Interstitial — Start Now (Dark) ─────────────── */
function SlideStartNow() {
  return (
    <div className="relative h-full w-full bg-slate flex flex-col overflow-hidden">
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute top-[10%] left-[5%] w-[100px] lg:w-[140px] opacity-[0.06] -rotate-12" style={{ animation: 'ds-float 7s ease-in-out infinite' }}>
          <Illo src="Paper%20Airplane%20%2B%20Coin%20-%20Turquoise.svg" />
        </div>
      </div>
      <div className="flex-1 flex items-center justify-center px-8 sm:px-12 lg:px-16 py-10 relative z-10">
        <div className="text-center max-w-3xl">
          <span className="text-xs font-semibold uppercase tracking-widest text-turquoise mb-4 block">Part 1</span>
          <h1 className="font-display font-black text-linen text-5xl sm:text-6xl lg:text-7xl xl:text-8xl leading-[0.95] tracking-tight mb-6">
            Starting now
          </h1>
          <p className="text-xl sm:text-2xl text-linen/50 leading-relaxed max-w-2xl mx-auto">
            Two things we can do this week to raise copy quality immediately.
          </p>
        </div>
      </div>
      <SlideFooter num={5} total={TOTAL} dark />
    </div>
  )
}

/* ── Slide 6: Quick Win — Claude Skill ─────────────────────── */
function SlideQuickWin() {
  return (
    <div className="relative h-full w-full bg-stone flex flex-col overflow-hidden">
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute top-[8%] right-[5%] w-[100px] lg:w-[140px] opacity-[0.07] rotate-6" style={{ animation: 'ds-float 7s ease-in-out infinite' }}>
          <Illo src="Bot.svg" />
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center px-8 sm:px-12 lg:px-16 py-10 relative z-10">
        <div className="max-w-4xl w-full">
          <div className="mb-5 lg:mb-6 text-center">
            <PillBadge>Short-Term Fix</PillBadge>
          </div>
          <h1 className="font-display font-black text-foreground text-4xl sm:text-5xl lg:text-6xl xl:text-7xl leading-[0.95] tracking-tight mb-6 lg:mb-8 text-center">
            Claude Skill for copy
          </h1>
          <p className="text-lg sm:text-xl text-foreground/60 leading-relaxed text-center max-w-2xl mx-auto mb-8">
            While the full system is being built, every string runs through a Claude Skill that generates 5–10 options optimised for three qualities:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            {[
              { icon: MessageSquare, label: 'Warmth', desc: 'Friendly, human tone that feels like a conversation, not a notification.', color: 'bg-papaya/10 text-papaya' },
              { icon: Zap, label: 'Conciseness', desc: 'Every word earns its place. No preambles, no echoes, no double CTAs.', color: 'bg-turquoise/10 text-turquoise' },
              { icon: Sparkles, label: 'Clarity', desc: 'One read to understand. The user knows exactly what happened and what to do next.', color: 'bg-blueberry/10 text-blueberry' },
            ].map((q) => (
              <div key={q.label} className="bg-white rounded-2xl p-6 border border-border shadow-sm text-center">
                <div className={`${q.color} w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4`}>
                  <q.icon className="h-6 w-6" strokeWidth={2} />
                </div>
                <h3 className="font-display font-extrabold text-foreground text-xl mb-2">{q.label}</h3>
                <p className="text-sm text-foreground/60 leading-relaxed">{q.desc}</p>
              </div>
            ))}
          </div>
          <div className="bg-white rounded-2xl p-5 sm:p-6 border border-border shadow-sm flex items-start gap-4">
            <div className="bg-cactus/10 rounded-xl p-2.5 flex-shrink-0">
              <Bot className="h-5 w-5 text-cactus" strokeWidth={2} />
            </div>
            <div>
              <h3 className="font-display font-extrabold text-foreground text-base sm:text-lg mb-1 leading-tight">How it works</h3>
              <p className="text-sm text-foreground/60 leading-relaxed">
                Designer pastes a string into the Claude Skill → receives 5–10 ranked alternatives → picks the best fit → ships. No waiting for a full framework to start improving copy today.
              </p>
            </div>
          </div>
        </div>
      </div>
      <SlideFooter num={6} total={TOTAL} />
    </div>
  )
}

/* ── Slide 7: Modular + Holistic (Dark) ───────────────────── */
function SlideModularHolistic() {
  return (
    <div className="relative h-full w-full bg-slate flex flex-col overflow-hidden">
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute bottom-[8%] left-[4%] w-[100px] lg:w-[140px] opacity-[0.07] -rotate-6" style={{ animation: 'ds-drift 9s ease-in-out infinite' }}>
          <Illo src="Magnifying%20Glass.svg" />
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center px-8 sm:px-12 lg:px-16 py-10 relative z-10">
        <div className="max-w-4xl w-full">
          <div className="mb-5 lg:mb-6 text-center">
            <PillBadge dark>Short-Term Fix</PillBadge>
          </div>
          <h1 className="font-display font-black text-linen text-4xl sm:text-5xl lg:text-6xl xl:text-7xl leading-[0.95] tracking-tight mb-6 lg:mb-8 text-center">
            Design modular,<br />review holistic
          </h1>
          <p className="text-xl sm:text-2xl text-linen/50 leading-relaxed text-center max-w-2xl mx-auto mb-10">
            Every string is a discrete unit, but must be reviewed in the full flow context, inside a visual design or prototype, then validated by an LLM.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="rounded-2xl bg-linen/5 border border-linen/10 p-6 text-center">
              <div className="bg-papaya/20 w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Blocks className="h-6 w-6 text-papaya" strokeWidth={2} />
              </div>
              <h3 className="font-display font-extrabold text-linen text-lg mb-2">Write modular</h3>
              <p className="text-sm text-linen/50 leading-relaxed">Each string is a self-contained unit. Clear meaning, no dependency on surrounding copy.</p>
            </div>
            <div className="rounded-2xl bg-linen/5 border border-linen/10 p-6 text-center">
              <div className="bg-cactus/20 w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Eye className="h-6 w-6 text-cactus" strokeWidth={2} />
              </div>
              <h3 className="font-display font-extrabold text-linen text-lg mb-2">Review in context</h3>
              <p className="text-sm text-linen/50 leading-relaxed">Evaluate copy inside the visual design or prototype, not in a spreadsheet or Miro board.</p>
            </div>
            <div className="rounded-2xl bg-linen/5 border border-linen/10 p-6 text-center">
              <div className="bg-turquoise/20 w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4">
                <ScanSearch className="h-6 w-6 text-turquoise" strokeWidth={2} />
              </div>
              <h3 className="font-display font-extrabold text-linen text-lg mb-2">LLM validates the whole</h3>
              <p className="text-sm text-linen/50 leading-relaxed">An LLM reviews the entire flow for redundancy, tone consistency, and sequence-level clarity.</p>
            </div>
          </div>
        </div>
      </div>
      <SlideFooter num={7} total={TOTAL} dark />
    </div>
  )
}

/* ── Slide 8: Interstitial — Build Toward (Dark) ──────────── */
function SlideBuildToward() {
  return (
    <div className="relative h-full w-full bg-slate flex flex-col overflow-hidden">
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute bottom-[10%] right-[5%] w-[120px] lg:w-[160px] opacity-[0.06] rotate-6" style={{ animation: 'ds-drift 9s ease-in-out infinite 1s' }}>
          <Illo src="Rocket%20Launch%20-%20Growth%20%2B%20Coin%20-%20Turquoise.svg" />
        </div>
      </div>
      <div className="flex-1 flex items-center justify-center px-8 sm:px-12 lg:px-16 py-10 relative z-10">
        <div className="text-center max-w-3xl">
          <span className="text-xs font-semibold uppercase tracking-widest text-papaya mb-4 block">Part 2</span>
          <h1 className="font-display font-black text-linen text-5xl sm:text-6xl lg:text-7xl xl:text-8xl leading-[0.95] tracking-tight mb-6">
            Coming next
          </h1>
          <p className="text-xl sm:text-2xl text-linen/50 leading-relaxed max-w-2xl mx-auto">
            A five-phase framework that makes quality the default, not something we chase after the fact.
          </p>
        </div>
      </div>
      <SlideFooter num={8} total={TOTAL} dark />
    </div>
  )
}

/* ── Slide 9: Framework Overview ───────────────────────────── */
function SlideOverview() {
  const phases = [
    { num: '0', title: 'Copy Audit', desc: 'Diagnose the problem with data', color: 'bg-papaya', icon: Search },
    { num: '1', title: 'Copy Bible', desc: 'Build standards from real patterns', color: 'bg-blueberry', icon: BookOpen },
    { num: '2', title: 'Design Flow Builder', desc: 'Define & visualise all flows', color: 'bg-cactus', icon: Code2 },
    { num: '3', title: 'LLM Enforcement', desc: 'Automated style guide compliance', color: 'bg-turquoise', icon: Bot },
    { num: '4', title: 'Human Sign-Off', desc: 'Final judgment for edge cases', color: 'bg-mango', icon: Users },
  ]

  return (
    <div className="relative h-full w-full bg-stone flex flex-col overflow-hidden">
      <div className="flex-1 flex items-center justify-center px-8 sm:px-12 lg:px-16 py-10 relative z-10">
        <div className="max-w-5xl w-full">
          <div className="mb-5 lg:mb-6 text-center">
            <PillBadge>The Framework</PillBadge>
          </div>
          <h1 className="font-display font-black text-foreground text-4xl sm:text-5xl lg:text-6xl xl:text-7xl leading-[0.95] tracking-tight mb-8 lg:mb-10 text-center">
            Five phases
          </h1>
          <div className="flex flex-col sm:flex-row gap-3">
            {phases.map((p) => (
              <div key={p.num} className="flex-1 rounded-2xl bg-white border border-border shadow-sm p-5 sm:p-6 flex flex-col">
                <div className={`${p.color} w-10 h-10 rounded-xl flex items-center justify-center mb-4`}>
                  <p.icon className="h-5 w-5 text-slate" strokeWidth={2} />
                </div>
                <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-1">Phase {p.num}</span>
                <h3 className="font-display font-extrabold text-foreground text-lg sm:text-xl mb-2 leading-tight">{p.title}</h3>
                <p className="text-sm text-foreground/60 leading-relaxed mt-auto">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      <SlideFooter num={9} total={TOTAL} />
    </div>
  )
}

/* ── Slide 10: Phase 0 — Codebase Audit (Dark) ────────────── */
function SlidePhase0Intro() {
  return (
    <div className="relative h-full w-full bg-slate flex flex-col overflow-hidden">
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute top-[8%] left-[5%] w-[100px] lg:w-[140px] opacity-[0.08] -rotate-12" style={{ animation: 'ds-float 7s ease-in-out infinite' }}>
          <Illo src="Magnifying%20Glass.svg" />
        </div>
        <div className="absolute bottom-[10%] right-[5%] w-[120px] lg:w-[160px] opacity-[0.06] rotate-6" style={{ animation: 'ds-drift 9s ease-in-out infinite 1s' }}>
          <Illo src="Laptop%20Dark.svg" />
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center px-8 sm:px-12 lg:px-16 py-10 relative z-10">
        <div className="max-w-4xl text-center">
          <div className="mb-5 lg:mb-6">
            <PillBadge dark>Phase 0</PillBadge>
          </div>
          <h1 className="font-display font-black text-linen text-5xl sm:text-6xl lg:text-7xl xl:text-8xl leading-[0.95] tracking-tight mb-6 sm:mb-8">
            Platform-Wide Copy Audit
          </h1>
          <p className="text-xl sm:text-2xl text-linen/50 leading-relaxed max-w-2xl mx-auto">
            Start with Hernán&apos;s content audit pulled directly from the codebase. The most accurate inventory of what&apos;s actually live in production.
          </p>
        </div>
      </div>
      <SlideFooter num={10} total={TOTAL} dark />
    </div>
  )
}

/* ── Slide 11: Phase 0 — Audit Steps ─────────────────────── */
function SlideAuditSteps() {
  const steps = [
    {
      num: '01',
      title: 'Hernán\u2019s Codebase Audit',
      desc: 'Pull every active WhatsApp message from the codebase. Organise by campaign type, sequence, and locale. If it\u2019s in the code, it\u2019s live.',
      accent: 'border-l-papaya',
    },
    {
      num: '02',
      title: 'LLM Audit Pass',
      desc: 'Feed the inventory into an LLM to flag verbosity (character limits) and redundancy (repeated concepts within sequences). Returns structured severity scores.',
      accent: 'border-l-blueberry',
    },
    {
      num: '03',
      title: 'Pattern Analysis',
      desc: 'Identify the 3\u20135 root-cause patterns driving issues across the entire library. Each pattern gets a name and concrete example.',
      accent: 'border-l-cactus',
    },
    {
      num: '04',
      title: 'Audit Report',
      desc: 'One-pager: total messages, % flagged, top patterns, worst sequences, and locale breakdown. Evidence for your supervisor, data for your designer.',
      accent: 'border-l-turquoise',
    },
  ]

  return (
    <div className="relative h-full w-full bg-stone flex flex-col overflow-hidden">
      <div className="flex-1 flex items-center justify-center px-8 sm:px-12 lg:px-16 py-10 relative z-10">
        <div className="max-w-4xl w-full">
          <div className="mb-5 lg:mb-6 text-center">
            <PillBadge>Phase 0: Steps</PillBadge>
          </div>
          <h1 className="font-display font-black text-foreground text-4xl sm:text-5xl lg:text-6xl xl:text-7xl leading-[0.95] tracking-tight mb-8 lg:mb-10 text-center">
            Four-step audit
          </h1>
          <div className="space-y-4">
            {steps.map((s) => (
              <div key={s.num} className={`bg-white rounded-xl p-5 sm:p-6 border border-border shadow-sm border-l-4 ${s.accent} flex gap-4 sm:gap-6 items-start`}>
                <span className="font-display font-black text-3xl sm:text-4xl text-concrete leading-none">{s.num}</span>
                <div>
                  <h3 className="font-display font-extrabold text-foreground text-lg sm:text-xl mb-1 leading-tight">{s.title}</h3>
                  <p className="text-base text-foreground/70 leading-relaxed">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <SlideFooter num={11} total={TOTAL} />
    </div>
  )
}

/* ── Slide 12: Common Patterns ─────────────────────────────── */
function SlidePatterns() {
  const patterns = [
    { name: 'The Double CTA', desc: 'Same call to action in the opener and closer of a message.', emoji: '🔁' },
    { name: 'The Echo Sequence', desc: 'Message 2 restates everything Message 1 said before adding new info.', emoji: '📢' },
    { name: 'The Preamble Problem', desc: 'Messages that bury the value behind scene-setting context.', emoji: '📝' },
    { name: 'The Safety Net', desc: 'Key info repeated across messages "just in case" the user missed it.', emoji: '🛡️' },
  ]

  return (
    <div className="relative h-full w-full bg-stone flex flex-col overflow-hidden">
      <div className="flex-1 flex items-center justify-center px-8 sm:px-12 lg:px-16 py-10 relative z-10">
        <div className="max-w-4xl w-full">
          <div className="mb-5 lg:mb-6 text-center">
            <PillBadge>Pattern Library</PillBadge>
          </div>
          <h1 className="font-display font-black text-foreground text-4xl sm:text-5xl lg:text-6xl xl:text-7xl leading-[0.95] tracking-tight mb-8 lg:mb-10 text-center">
            Common anti-patterns
          </h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {patterns.map((p) => (
              <div key={p.name} className="bg-white rounded-2xl p-6 sm:p-7 border border-border shadow-sm">
                <span className="text-3xl mb-3 block">{p.emoji}</span>
                <h3 className="font-display font-extrabold text-foreground text-xl mb-2 leading-tight">{p.name}</h3>
                <p className="text-base text-foreground/70 leading-relaxed">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      <SlideFooter num={12} total={TOTAL} />
    </div>
  )
}

/* ── Slide 13: Phase 1 — Copy Bible (Dark) ─────────────────── */
function SlideCopyBible() {
  return (
    <div className="relative h-full w-full bg-slate flex flex-col overflow-hidden">
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute top-[10%] right-[6%] w-[100px] lg:w-[140px] opacity-[0.08] rotate-12" style={{ animation: 'ds-float 8s ease-in-out infinite' }}>
          <Illo src="Hand%20-%20Stars.svg" />
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center px-8 sm:px-12 lg:px-16 py-10 relative z-10">
        <div className="max-w-4xl w-full">
          <div className="mb-5 lg:mb-6 text-center">
            <PillBadge dark>Phase 1</PillBadge>
          </div>
          <h1 className="font-display font-black text-linen text-5xl sm:text-6xl lg:text-7xl xl:text-8xl leading-[0.95] tracking-tight mb-8 lg:mb-10 text-center">
            Build the<br />Copy Bible
          </h1>
          <p className="text-xl sm:text-2xl text-linen/50 leading-relaxed text-center max-w-2xl mx-auto mb-10">
            Standards built from two inputs: what the audit revealed, and what the multilingual project requires.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="rounded-2xl bg-linen/5 border border-linen/10 p-6">
              <h3 className="font-display font-extrabold text-turquoise text-lg mb-3">From the Audit</h3>
              <ul className="space-y-2">
                {[
                  'Preamble endemic → lead with value',
                  'Double CTAs common → one CTA per message',
                  'Echo sequences rife → new info per message',
                ].map((r) => (
                  <li key={r} className="flex items-start gap-2 text-linen/70 text-sm leading-relaxed">
                    <ArrowRight className="h-4 w-4 text-turquoise flex-shrink-0 mt-0.5" />
                    <span>{r}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-2xl bg-linen/5 border border-linen/10 p-6">
              <h3 className="font-display font-extrabold text-turquoise text-lg mb-3">From Multilingual Scope</h3>
              <ul className="space-y-2">
                {[
                  'Character expansion in Portuguese',
                  'Tone register differences by locale',
                  'Locale-specific CTA conventions',
                ].map((r) => (
                  <li key={r} className="flex items-start gap-2 text-linen/70 text-sm leading-relaxed">
                    <Globe className="h-4 w-4 text-turquoise flex-shrink-0 mt-0.5" />
                    <span>{r}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
      <SlideFooter num={13} total={TOTAL} dark />
    </div>
  )
}

/* ── Slide 14: Phase 2 — Design Flow Builder ──────────────── */
function SlideSourceOfTruth() {
  return (
    <div className="relative h-full w-full bg-stone flex flex-col overflow-hidden">
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute bottom-[8%] right-[3%] w-[120px] lg:w-[180px] opacity-[0.07] rotate-6" style={{ animation: 'ds-drift 10s ease-in-out infinite' }}>
          <Illo src="Laptop%20Dark-1.svg" />
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center px-8 sm:px-12 lg:px-16 py-10 relative z-10">
        <div className="max-w-4xl w-full">
          <div className="mb-5 lg:mb-6 text-center">
            <PillBadge>Phase 2</PillBadge>
          </div>
          <h1 className="font-display font-black text-foreground text-4xl sm:text-5xl lg:text-6xl xl:text-7xl leading-[0.95] tracking-tight mb-6 lg:mb-8 text-center">
            Design Flow Builder Tool
          </h1>
          <p className="text-lg sm:text-xl text-foreground/60 leading-relaxed text-center max-w-2xl mx-auto mb-8">
            We are building a Design Flow Builder to serve as our design source of truth and power localization. It is not ready yet, but the vision includes copy governance built in from the start.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { icon: Code2, title: 'Copy at the level of code', desc: 'Every string is defined inside the tool, not scattered across Miro boards and docs.' },
              { icon: Layers, title: 'Canvas view', desc: 'Full-sequence perspective makes redundancy visible at a glance before any LLM review.' },
              { icon: Globe, title: 'Side-by-side locales', desc: 'EN/PT-BR variants live together, surfacing translation inconsistencies immediately.' },
              { icon: Search, title: 'Always up to date', desc: 'Single source of truth that stays in sync. Re-auditable at any point against live production.' },
            ].map((item) => (
              <div key={item.title} className="bg-white rounded-2xl p-6 border border-border shadow-sm flex gap-4 items-start">
                <div className="bg-cactus/10 rounded-xl p-2.5 flex-shrink-0">
                  <item.icon className="h-5 w-5 text-cactus" strokeWidth={2} />
                </div>
                <div>
                  <h3 className="font-display font-extrabold text-foreground text-base sm:text-lg mb-1 leading-tight">{item.title}</h3>
                  <p className="text-sm text-foreground/60 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <SlideFooter num={14} total={TOTAL} />
    </div>
  )
}

/* ── Slide 15: Design Flow Builder — Showcase (Dark) ──────── */
function SlideFlowBuilderShowcase() {
  return (
    <div className="relative h-full w-full bg-slate flex flex-col overflow-hidden">
      <div className="flex-1 flex items-center justify-center px-6 sm:px-10 lg:px-14 py-8 relative z-10">
        <div className="max-w-6xl w-full">
          <div className="mb-4 lg:mb-5 text-center">
            <PillBadge dark>Design Flow Builder Tool</PillBadge>
          </div>
          <h1 className="font-display font-black text-linen text-3xl sm:text-4xl lg:text-5xl xl:text-6xl leading-[0.95] tracking-tight mb-4 lg:mb-5 text-center">
            In development
          </h1>
          <p className="text-base sm:text-lg text-linen/50 leading-relaxed text-center max-w-2xl mx-auto mb-6 lg:mb-8">
            The Design Flow Builder is being built as our design source of truth and localization tool. Copy governance will be built in from day one.
          </p>
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 lg:gap-5 items-start">
            {/* Flow Canvas — grid view */}
            <div className="lg:col-span-3 rounded-xl overflow-hidden border border-linen/10 shadow-2xl">
              <img
                src="/flow-canvas-grid.png"
                alt="Flow Canvas grid view showing multiple WhatsApp flows across countries with token panel"
                className="w-full h-auto block"
              />
            </div>
            {/* Detail view — phone + tokens */}
            <div className="lg:col-span-2 rounded-xl overflow-hidden border border-linen/10 shadow-2xl bg-linen/5">
              <img
                src="/flow-canvas-detail.png"
                alt="WhatsApp screen preview with content tokens panel"
                className="w-full h-auto block"
              />
            </div>
          </div>
          <div className="mt-5 flex flex-wrap justify-center gap-3">
            {[
              'Multi-country flows at a glance',
              'Content tokens per screen',
              'Live WhatsApp preview',
            ].map((label) => (
              <span key={label} className="inline-flex items-center gap-2 rounded-full bg-linen/5 border border-linen/10 px-3 py-1.5 text-xs sm:text-sm font-medium text-linen/60">
                <CheckCircle2 className="h-3.5 w-3.5 text-turquoise" />
                {label}
              </span>
            ))}
          </div>
        </div>
      </div>
      <SlideFooter num={15} total={TOTAL} dark />
    </div>
  )
}

/* ── Slide 16: Phase 3 — LLM Enforcement (Dark) ──────────── */
function SlideLLMEnforcement() {
  const rules = [
    'Verbosity limits by message type and locale',
    'Redundancy flags across a sequence',
    'Tone & voice measured against style guide',
    'Multilingual parity (meaning, not just length)',
    'CTA consistency with approved patterns',
  ]

  return (
    <div className="relative h-full w-full bg-slate flex flex-col overflow-hidden">
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute top-[6%] left-[4%] w-[100px] lg:w-[140px] opacity-[0.08] -rotate-6" style={{ animation: 'ds-float 7s ease-in-out infinite' }}>
          <Illo src="Bot.svg" />
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center px-8 sm:px-12 lg:px-16 py-10 relative z-10">
        <div className="max-w-4xl w-full">
          <div className="mb-5 lg:mb-6 text-center">
            <PillBadge dark>Phase 3</PillBadge>
          </div>
          <h1 className="font-display font-black text-linen text-4xl sm:text-5xl lg:text-6xl xl:text-7xl leading-[0.95] tracking-tight mb-6 lg:mb-8 text-center">
            Design Flow Builder<br />+ LLM Enforcement
          </h1>
          <p className="text-xl sm:text-2xl text-linen/50 leading-relaxed text-center max-w-2xl mx-auto mb-8">
            Built directly into the Design Flow Builder Tool. LLM enforcement aligned with the editorial style guide catches issues at the point of creation, not after the fact.
          </p>
          <div className="bg-linen/5 border border-linen/10 rounded-2xl p-6 sm:p-8">
            <h3 className="font-display font-extrabold text-turquoise text-lg mb-4">What it enforces</h3>
            <ul className="space-y-3">
              {rules.map((r) => (
                <li key={r} className="flex items-center gap-3 text-linen/80 text-base leading-relaxed">
                  <CheckCircle2 className="h-5 w-5 text-turquoise flex-shrink-0" />
                  <span>{r}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      <SlideFooter num={16} total={TOTAL} dark />
    </div>
  )
}

/* ── Slide 17: Workflow Diagram ────────────────────────────── */
function SlideWorkflow() {
  const steps = [
    { label: 'Content defined in Design Flow Builder Tool', color: 'bg-cactus' },
    { label: 'LLM Enforcement runs on save / submission', color: 'bg-turquoise' },
    { label: 'Returns PASS / NEEDS REVISION per message', color: 'bg-blueberry' },
    { label: 'Designer resolves flagged issues in tool', color: 'bg-mango' },
    { label: 'Human sign-off (supervisor / content lead)', color: 'bg-papaya' },
  ]

  return (
    <div className="relative h-full w-full bg-stone flex flex-col overflow-hidden">
      <div className="flex-1 flex items-center justify-center px-8 sm:px-12 lg:px-16 py-10 relative z-10">
        <div className="max-w-3xl w-full">
          <div className="mb-5 lg:mb-6 text-center">
            <PillBadge>Workflow</PillBadge>
          </div>
          <h1 className="font-display font-black text-foreground text-4xl sm:text-5xl lg:text-6xl xl:text-7xl leading-[0.95] tracking-tight mb-8 lg:mb-10 text-center">
            Enforcement at the source
          </h1>
          <div className="space-y-3">
            {steps.map((s, i) => (
              <div key={i} className="flex items-center gap-4">
                <div className={`${s.color} w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0`}>
                  <span className="font-display font-extrabold text-slate text-sm">{i + 1}</span>
                </div>
                <div className="flex-1 bg-white rounded-xl p-4 sm:p-5 border border-border shadow-sm">
                  <p className="text-base sm:text-lg font-medium text-foreground leading-snug">{s.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <SlideFooter num={17} total={TOTAL} />
    </div>
  )
}

/* ── Slide 18: Phase 4 — Human Sign-Off ───────────────────── */
function SlideSignOff() {
  const checks = [
    'All messages PASS from LLM enforcement tool',
    'No unresolved redundancy flags at sequence level',
    'Multilingual variants reviewed for parity',
    'Final message carries one clear, style-guide-approved CTA',
  ]

  return (
    <div className="relative h-full w-full bg-stone flex flex-col overflow-hidden">
      <div className="flex-1 flex items-center justify-center px-8 sm:px-12 lg:px-16 py-10 relative z-10">
        <div className="max-w-3xl w-full">
          <div className="mb-5 lg:mb-6 text-center">
            <PillBadge>Phase 4</PillBadge>
          </div>
          <h1 className="font-display font-black text-foreground text-4xl sm:text-5xl lg:text-6xl xl:text-7xl leading-[0.95] tracking-tight mb-8 lg:mb-10 text-center">
            Human sign-off
          </h1>
          <p className="text-lg sm:text-xl text-foreground/60 leading-relaxed text-center max-w-2xl mx-auto mb-8">
            A fast 4-point check after LLM review clears.
          </p>
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-border shadow-sm">
            <ul className="space-y-4">
              {checks.map((c, i) => (
                <li key={i} className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-md border-2 border-turquoise bg-turquoise/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <CheckCircle2 className="h-4 w-4 text-turquoise" />
                  </div>
                  <span className="text-base sm:text-lg text-foreground leading-snug font-medium">{c}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      <SlideFooter num={18} total={TOTAL} />
    </div>
  )
}

/* ── Slide 19: The Delta (Dark) ───────────────────────────── */
function SlideDelta() {
  return (
    <div className="relative h-full w-full bg-slate flex flex-col overflow-hidden">
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute top-[6%] right-[5%] w-[100px] lg:w-[140px] opacity-[0.08] rotate-12" style={{ animation: 'ds-float 7s ease-in-out infinite' }}>
          <Illo src="Rocket%20Launch%20-%20Growth%20%2B%20Coin%20-%20Turquoise.svg" />
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center px-8 sm:px-12 lg:px-16 py-10 relative z-10">
        <div className="max-w-4xl text-center">
          <div className="mb-5 lg:mb-6">
            <PillBadge dark>Measuring Success</PillBadge>
          </div>
          <h1 className="font-display font-black text-linen text-5xl sm:text-6xl lg:text-7xl xl:text-8xl leading-[0.95] tracking-tight mb-6 sm:mb-8">
            The audit changes everything
          </h1>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            {[
              { label: 'Quantified evidence', desc: 'Numbers replace opinions' },
              { label: 'Named patterns', desc: 'Depersonalise the critique' },
              { label: 'Before / after', desc: 'Benchmark to measure improvement' },
            ].map((item) => (
              <div key={item.label} className="rounded-2xl bg-linen/5 border border-linen/10 p-5 sm:p-6 text-left">
                <h3 className="font-display font-extrabold text-turquoise text-lg mb-1">{item.label}</h3>
                <p className="text-linen/50 text-base leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
          <p className="text-lg sm:text-xl text-linen/40 leading-relaxed max-w-2xl mx-auto">
            Run the same audit again in 60–90 days. The delta between audits is your proof the process is working.
          </p>
        </div>
      </div>
      <SlideFooter num={19} total={TOTAL} dark />
    </div>
  )
}

/* ── Slide 20: Next Steps ─────────────────────────────────── */
function SlideNextSteps() {
  return (
    <div className="relative h-full w-full bg-slate flex flex-col overflow-hidden">
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute top-[8%] left-[5%] w-[100px] lg:w-[140px] opacity-[0.08] -rotate-12" style={{ animation: 'ds-float 7s ease-in-out infinite' }}>
          <Illo src="Paper%20Airplane%20%2B%20Coin%20-%20Turquoise.svg" />
        </div>
        <div className="absolute bottom-[10%] right-[5%] w-[120px] lg:w-[160px] opacity-[0.06] rotate-6" style={{ animation: 'ds-drift 9s ease-in-out infinite 1s' }}>
          <Illo src="Hand%20-%20Star%20-%20Perks.svg" />
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center px-8 sm:px-12 lg:px-16 py-10 relative z-10">
        <div className="text-center max-w-4xl">
          <div className="mb-6 sm:mb-8 mx-auto w-[200px] h-[200px] sm:w-[260px] sm:h-[260px] lg:w-[320px] lg:h-[320px]" style={{ mask: 'radial-gradient(ellipse 80% 60% at 50% 40%, black 30%, transparent 70%)', WebkitMask: 'radial-gradient(ellipse 80% 60% at 50% 40%, black 30%, transparent 70%)' }}>
            <video autoPlay loop muted playsInline className="w-full h-full object-cover" src="/jose-finale.mp4" />
          </div>
          <h1 className="font-display font-black text-linen text-5xl sm:text-6xl lg:text-7xl xl:text-8xl leading-[0.95] tracking-tight mb-6 sm:mb-8">
            Let&apos;s build this.
          </h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
            <div className="rounded-2xl bg-linen/5 border border-linen/10 p-6 text-left">
              <span className="text-xs font-semibold uppercase tracking-widest text-turquoise mb-3 block">Starting now</span>
              <h3 className="font-display font-extrabold text-linen text-xl mb-3">Short-term fixes</h3>
              <ul className="space-y-2">
                <li className="flex items-start gap-2 text-linen/70 text-sm leading-relaxed">
                  <Zap className="h-4 w-4 text-turquoise flex-shrink-0 mt-0.5" />
                  <span>Deploy Claude Skill for copy review</span>
                </li>
                <li className="flex items-start gap-2 text-linen/70 text-sm leading-relaxed">
                  <Eye className="h-4 w-4 text-turquoise flex-shrink-0 mt-0.5" />
                  <span>Review all copy in visual context</span>
                </li>
                <li className="flex items-start gap-2 text-linen/70 text-sm leading-relaxed">
                  <BookOpen className="h-4 w-4 text-turquoise flex-shrink-0 mt-0.5" />
                  <span>Draft editorial guidelines</span>
                </li>
              </ul>
            </div>
            <div className="rounded-2xl bg-linen/5 border border-linen/10 p-6 text-left">
              <span className="text-xs font-semibold uppercase tracking-widest text-papaya mb-3 block">Coming next</span>
              <h3 className="font-display font-extrabold text-linen text-xl mb-3">The full system</h3>
              <ul className="space-y-2">
                <li className="flex items-start gap-2 text-linen/70 text-sm leading-relaxed">
                  <Search className="h-4 w-4 text-papaya flex-shrink-0 mt-0.5" />
                  <span>Run Phase 0 platform-wide audit</span>
                </li>
                <li className="flex items-start gap-2 text-linen/70 text-sm leading-relaxed">
                  <Code2 className="h-4 w-4 text-papaya flex-shrink-0 mt-0.5" />
                  <span>Build the Design Flow Builder Tool</span>
                </li>
                <li className="flex items-start gap-2 text-linen/70 text-sm leading-relaxed">
                  <Bot className="h-4 w-4 text-papaya flex-shrink-0 mt-0.5" />
                  <span>Integrate LLM enforcement into the builder</span>
                </li>
              </ul>
            </div>
          </div>
          <p className="text-lg sm:text-xl text-linen/40 leading-relaxed max-w-2xl mx-auto">
            Two tracks, one goal: quality copy at scale across every locale and every flow.
          </p>
        </div>
      </div>
      <SlideFooter num={20} total={TOTAL} dark />
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════ */
/*                     SLIDE SHELL                             */
/* ═══════════════════════════════════════════════════════════ */

const slides = [
  SlideTitle, SlideProblem, SlideWhatWereSeeing, SlideProposedFix,
  SlideStartNow, SlideQuickWin, SlideModularHolistic, SlideBuildToward,
  SlideOverview, SlidePhase0Intro,
  SlideAuditSteps, SlidePatterns, SlideCopyBible, SlideSourceOfTruth,
  SlideFlowBuilderShowcase, SlideLLMEnforcement, SlideWorkflow, SlideSignOff,
  SlideDelta, SlideNextSteps,
]

const darkSlideSet = new Set([0, 3, 4, 6, 7, 9, 12, 14, 15, 18, 19])

const slideMeta = [
  { title: 'WhatsApp Copy Governance', subtitle: 'Introduction' },
  { title: 'The Challenge', subtitle: 'Why We Need This' },
  { title: 'What We\u2019re Seeing', subtitle: 'Current State' },
  { title: 'A Sustainable System', subtitle: 'Proposed Fix' },
  { title: 'Starting Now', subtitle: 'Part 1' },
  { title: 'Claude Skill for Copy', subtitle: 'Short-Term Fix' },
  { title: 'Modular + Holistic', subtitle: 'Short-Term Fix' },
  { title: 'Coming Next', subtitle: 'Part 2' },
  { title: 'Five Phases', subtitle: 'Framework Overview' },
  { title: 'Platform-Wide Audit', subtitle: 'Phase 0' },
  { title: 'Four-Step Audit', subtitle: 'Phase 0 Steps' },
  { title: 'Anti-Patterns', subtitle: 'Common Issues' },
  { title: 'Copy Bible', subtitle: 'Phase 1' },
  { title: 'Design Flow Builder', subtitle: 'Phase 2' },
  { title: 'The Tool in Action', subtitle: 'Phase 2 Showcase' },
  { title: 'LLM Enforcement', subtitle: 'Phase 3' },
  { title: 'Workflow', subtitle: 'How It Fits Together' },
  { title: 'Human Sign-Off', subtitle: 'Phase 4' },
  { title: 'Measuring Success', subtitle: 'The Delta' },
  { title: 'Next Steps', subtitle: 'Let\u2019s Build This' },
]

export default function ContentDesignPage() {
  const [current, setCurrent] = useState(0)
  const [mounted, setMounted] = useState(false)
  const total = slides.length
  const { comments, commentMode, setCommentMode, addComment, deleteComment, editComment, flagComment, resolveComment, addReply, deleteReply } = useComments('content-design-comments')
  const { progress: pdfProgress, download: downloadPdf, cancel: cancelPdf } = useSlidePdf('content-design.pdf')
  const { locale, setLocale } = useLocale()
  const slideRef = useRef<HTMLDivElement>(null)
  useSlideTranslation(slideRef, locale, current)

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
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchX === null) return
    const diff = touchX - e.changedTouches[0].clientX
    if (diff > 50) next()
    else if (diff < -50) prev()
    setTouchX(null)
  }

  const Slide = slides[current]
  const isDark = darkSlideSet.has(current)

  const pillBg = isDark ? 'bg-white/10 border-white/10' : 'bg-white/90 border-border'
  const pillText = isDark ? 'text-white/60' : 'text-foreground'
  const hintText = isDark ? 'text-white/30' : 'text-muted-foreground'

  if (!mounted) return <div className="h-screen w-screen bg-slate" />

  return (
    <div
      className="h-screen w-screen overflow-hidden relative select-none"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Progress bar */}
      <div className={`absolute top-0 inset-x-0 h-1 z-50 transition-colors duration-500 ${isDark ? 'bg-white/10' : 'bg-concrete/30'}`}>
        <div className="h-full bg-turquoise-600 transition-all duration-500 ease-out" style={{ width: `${((current + 1) / total) * 100}%` }} />
      </div>

      {/* Slide counter */}
      <div className="absolute top-4 left-4 sm:top-6 sm:left-6 z-50">
        <div className={`px-3 py-1.5 backdrop-blur-sm rounded-full border transition-colors duration-500 ${pillBg}`}>
          <span className={`text-xs sm:text-sm font-medium transition-colors duration-500 ${pillText}`}>
            {current + 1} / {total}
          </span>
        </div>
      </div>

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
        onDownloadPdf={() => downloadPdf({ slideRef, total, currentSlide: current, goToSlide: setCurrent })}
      />

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
          onFlagComment={flagComment}
          onResolveComment={(id, resolved) => resolveComment(id, resolved)}
          onAddReply={addReply}
          onDeleteReply={deleteReply}
          onExitCommentMode={() => setCommentMode(false)}
        />
      </div>

      {/* Navigation dots */}
      <div className="absolute bottom-10 sm:bottom-12 left-1/2 -translate-x-1/2 z-50 flex gap-1.5">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`h-1.5 sm:h-2 rounded-full transition-all duration-300 ${
              current === i
                ? `w-6 sm:w-10 ${isDark ? 'bg-turquoise/60' : 'bg-turquoise-600'}`
                : `w-1.5 sm:w-2 ${isDark ? 'bg-white/20 hover:bg-white/30' : 'bg-concrete hover:bg-concrete/70'}`
            }`}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>

      {/* Prev/Next buttons */}
      <button
        onClick={prev}
        disabled={current === 0}
        className={`hidden md:flex absolute left-4 sm:left-8 top-1/2 -translate-y-1/2 z-[100] p-3 rounded-full backdrop-blur-sm border transition-all ${isDark ? 'bg-white/10 border-white/10 hover:bg-white/20' : 'bg-white/90 border-border hover:bg-white hover:shadow-md'} ${current === 0 ? 'opacity-0 pointer-events-none' : ''}`}
        aria-label="Previous slide"
        type="button"
      >
        <svg className={`w-5 h-5 ${isDark ? 'text-white/60' : 'text-foreground'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      <button
        onClick={next}
        disabled={current === total - 1}
        className={`hidden md:flex absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 z-[100] p-3 rounded-full backdrop-blur-sm border transition-all ${isDark ? 'bg-white/10 border-white/10 hover:bg-white/20' : 'bg-white/90 border-border hover:bg-white hover:shadow-md'} ${current === total - 1 ? 'opacity-0 pointer-events-none' : ''}`}
        aria-label="Next slide"
        type="button"
      >
        <svg className={`w-5 h-5 ${isDark ? 'text-white/60' : 'text-foreground'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* Mobile swipe hint */}
      <div className="md:hidden absolute bottom-20 left-1/2 -translate-x-1/2 z-40">
        <div className={`px-3 py-1.5 backdrop-blur-sm rounded-full border transition-colors duration-500 ${pillBg}`}>
          <span className={`text-xs transition-colors duration-500 ${hintText}`}>Swipe to navigate</span>
        </div>
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
        <SlidePdfOverlay progress={pdfProgress} onCancel={cancelPdf} />
    </div>
  )
}
