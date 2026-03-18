'use client'

import { useState } from 'react'
import { FelixLogo } from '@/components/design-system/felix-logo'
import {
  Pause, Warning, Lock, Timer, HandPalm, IdentificationCard,
  Coins, ShieldCheck, Prohibit, Clock, WarningCircle,
} from '@/components-next/phosphor-icons'

/* ─── Shared wrapper for each exploration ─────────────────────────── */

function Card({ num, label, strategy, children }: { num: number; label: string; strategy: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-baseline gap-3">
        <span className="text-xs font-bold text-mocha/50 uppercase tracking-wider">{num}.</span>
        <div>
          <h3 className="font-display font-extrabold text-slate text-lg leading-snug">{label}</h3>
          <p className="text-sm text-mocha leading-relaxed">{strategy}</p>
        </div>
      </div>
      <div className="bg-white rounded-2xl border border-slate/10 shadow-sm overflow-hidden">
        <div className="grid grid-cols-2 divide-x divide-slate/10">
          {children}
        </div>
      </div>
    </div>
  )
}

/* ─── WhatsApp-style message frame ────────────────────────────────── */

function WAFrame({ children, time, lang }: { children: React.ReactNode; time?: string; lang: 'es' | 'en' }) {
  return (
    <div className="p-4">
      <div className="flex items-center gap-1.5 mb-2">
        <span className="text-[10px] font-bold text-mocha/40 uppercase tracking-wider">{lang === 'es' ? 'Espanol' : 'English'}</span>
      </div>
      <div className="bg-[#e2ffc7] rounded-xl px-3 py-2.5 shadow-sm relative">
        {children}
        <div className="flex justify-end items-center gap-1 mt-1">
          <span className="text-[10px] text-slate/40">{time ?? '09:24 PM'}</span>
          <svg className="w-3.5 h-3.5 text-blue-400" viewBox="0 0 16 16" fill="currentColor"><path d="M2.5 8.5l3 3 8-8M6.5 8.5l3 3 4-4" strokeWidth="0" /></svg>
        </div>
      </div>
    </div>
  )
}

/* ─── Explorations ─────────────────────────────────────────────────── */

function Exploration1({ lang }: { lang: 'es' | 'en' }) {
  const es = lang === 'es'
  return (
    <WAFrame lang={lang}>
      <div className="rounded-lg overflow-hidden">
        <div className="bg-[#FEF3C7] px-4 pt-5 pb-4">
          <div className="flex items-start gap-3">
            <Pause size={32} className="text-[#D97706] mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-display font-extrabold text-[#92400E] text-xl leading-tight">
                {es ? 'Tu envío está en pausa' : 'Your transfer is paused'}
              </p>
              <p className="text-sm text-[#92400E]/70 mt-1.5 leading-snug">
                {es ? 'Solo necesitamos confirmar tu identidad para seguir adelante' : 'We just need to confirm your identity to move forward'}
              </p>
            </div>
          </div>
          <div className="mt-4 bg-[#F59E0B]/20 rounded-lg px-3 py-2 flex items-center gap-2">
            <Timer size={16} className="text-[#92400E]" />
            <p className="text-xs font-semibold text-[#92400E]">{es ? 'Son menos de 2 minutos' : 'Less than 2 minutes'}</p>
          </div>
        </div>
      </div>
      <p className="text-[13px] text-slate mt-2 leading-snug">
        {es ? 'Hay un paso rápido pendiente 📝' : 'There\'s a quick step pending 📝'}
      </p>
      <p className="text-[13px] text-slate leading-snug">
        <span className="font-semibold">{es ? 'Tu dinero no llegará' : 'Your money won\'t arrive'}</span> {es ? 'hasta que lo completes 👆' : 'until you complete it 👆'}
      </p>
    </WAFrame>
  )
}

function Exploration2({ lang }: { lang: 'es' | 'en' }) {
  const es = lang === 'es'
  return (
    <WAFrame lang={lang}>
      <div className="rounded-lg overflow-hidden">
        <div className="bg-[#FEE2E2] px-4 pt-5 pb-4">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-[#EF4444]/15 mb-3">
              <WarningCircle size={32} className="text-[#DC2626]" />
            </div>
            <p className="font-display font-extrabold text-[#991B1B] text-xl leading-tight">
              {es ? 'Necesitamos tu ayuda' : 'We need your help'}
            </p>
            <p className="text-sm text-[#991B1B]/70 mt-1.5 leading-snug">
              {es ? 'Tus $175.00 USD están esperando a que confirmes tu identidad' : 'Your $175.00 USD is waiting for you to confirm your identity'}
            </p>
          </div>
          <div className="mt-4 bg-white/60 rounded-lg px-3 py-2.5">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-[#DC2626] animate-pulse" />
              <p className="text-xs font-semibold text-[#991B1B]">{es ? 'Confirma tu identidad y listo' : 'Confirm your identity and you\'re all set'}</p>
            </div>
          </div>
        </div>
      </div>
      <p className="text-[13px] text-slate mt-2 leading-snug">
        ⚠️ <span className="font-semibold">{es ? 'Tu dinero no llegará' : 'Your money won\'t arrive'}</span> {es ? 'hasta que completes este paso' : 'until you complete this step'}
      </p>
    </WAFrame>
  )
}

function Exploration3({ lang }: { lang: 'es' | 'en' }) {
  const es = lang === 'es'
  return (
    <WAFrame lang={lang}>
      <div className="rounded-lg overflow-hidden">
        <div className="bg-gradient-to-br from-[#1E293B] to-[#0F172A] px-4 pt-5 pb-4">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-2 h-2 rounded-full bg-[#F59E0B] animate-pulse" />
            <span className="text-[10px] font-bold text-[#F59E0B] uppercase tracking-wider">{es ? 'Envío en espera' : 'Transfer on hold'}</span>
          </div>
          <p className="font-display font-extrabold text-white text-xl leading-tight">
            {es ? 'Confirma tu identidad' : 'Confirm your identity'}
          </p>
          <p className="text-sm text-white/60 mt-1.5 leading-snug">
            {es ? 'Es un paso rápido para que tu dinero siga su camino' : 'A quick step so your money can be on its way'}
          </p>
          <div className="mt-4 flex items-center gap-3">
            <div className="flex-1 h-1.5 rounded-full bg-white/10 overflow-hidden">
              <div className="h-full w-[20%] rounded-full bg-[#F59E0B]" />
            </div>
            <span className="text-[10px] text-white/40 font-medium">{es ? '1 de 3' : '1 of 3'}</span>
          </div>
          <div className="mt-3 bg-white/10 rounded-lg px-3 py-2 flex items-center gap-2">
            <Lock size={16} className="text-[#F59E0B]" />
            <p className="text-xs text-white/70">{es ? '$175.00 USD esperando tu confirmación' : '$175.00 USD waiting on your confirmation'}</p>
          </div>
        </div>
      </div>
      <p className="text-[13px] text-slate mt-2 leading-snug">
        {es ? 'Tu envío está esperando a que confirmes tu identidad 🔒' : 'Your transfer is waiting on your identity confirmation 🔒'}
      </p>
    </WAFrame>
  )
}

function Exploration4({ lang }: { lang: 'es' | 'en' }) {
  const es = lang === 'es'
  return (
    <WAFrame lang={lang}>
      <div className="rounded-lg overflow-hidden">
        <div className="bg-[#FFF7ED] px-4 pt-5 pb-4 relative">
          <div className="absolute top-4 right-4">
            <div className="w-10 h-10 rounded-full bg-[#F97316]/15 flex items-center justify-center">
              <Prohibit size={22} className="text-[#EA580C]" />
            </div>
          </div>
          <p className="text-[10px] font-bold text-[#C2410C] uppercase tracking-wider mb-2">{es ? 'En pausa' : 'On hold'}</p>
          <p className="font-display font-extrabold text-[#7C2D12] text-xl leading-tight max-w-[220px]">
            {es ? 'Tu envío necesita un paso más' : 'Your transfer needs one more step'}
          </p>
          <p className="text-sm text-[#C2410C]/70 mt-1.5 leading-snug max-w-[240px]">
            {es ? 'Confirma tu identidad para liberar tus $175.00 USD' : 'Confirm your identity to release your $175.00 USD'}
          </p>
          <div className="mt-4 border border-[#F97316]/30 rounded-lg px-3 py-2.5 bg-white/50">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Timer size={16} className="text-[#7C2D12]" />
                <p className="text-xs text-[#7C2D12]">{es ? 'Son solo 2 min' : 'Just 2 min'}</p>
              </div>
              <span className="text-xs font-bold text-[#C2410C] underline underline-offset-2">{es ? 'Completar →' : 'Complete →'}</span>
            </div>
          </div>
        </div>
      </div>
      <p className="text-[13px] text-slate mt-2 leading-snug">
        🛑 <span className="font-semibold">{es ? 'Tu envío está en pausa.' : 'Your transfer is on hold.'}</span> {es ? 'Completa este paso y tu dinero estará en camino.' : 'Complete this step and your money will be on its way.'}
      </p>
    </WAFrame>
  )
}

function Exploration5({ lang }: { lang: 'es' | 'en' }) {
  const es = lang === 'es'
  return (
    <WAFrame lang={lang}>
      <div className="rounded-lg overflow-hidden">
        <div className="bg-[#FFFBEB] border-l-4 border-[#F59E0B] px-4 pt-5 pb-4">
          <div className="flex gap-3">
            <div className="flex flex-col items-center gap-1 pt-0.5">
              <div className="w-10 h-10 rounded-full bg-[#F59E0B] flex items-center justify-center">
                <Warning size={22} className="text-white" />
              </div>
            </div>
            <div>
              <p className="font-display font-extrabold text-[#78350F] text-lg leading-tight">
                {es ? 'Falta un paso importante' : 'There\'s an important step left'}
              </p>
              <p className="text-sm text-[#92400E]/70 mt-1 leading-snug">
                {es ? 'Tu transferencia está en pausa hasta que confirmes tu identidad' : 'Your transfer is paused until you confirm your identity'}
              </p>
              <div className="mt-3 flex items-center gap-4">
                <div className="flex items-center gap-1.5">
                  <div className="w-6 h-6 rounded-full bg-[#F59E0B]/20 flex items-center justify-center">
                    <Coins size={14} className="text-[#78350F]" />
                  </div>
                  <span className="text-xs font-semibold text-[#78350F]">$175.00</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-xs text-[#92400E]/50">→</span>
                  <div className="w-6 h-6 rounded-full bg-slate/10 flex items-center justify-center">
                    <Pause size={14} className="text-[#92400E]/60" />
                  </div>
                  <span className="text-xs text-[#92400E]/50">{es ? 'en espera' : 'on hold'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <p className="text-[13px] text-slate mt-2 leading-snug">
        ⚠️ {es ? 'Sin este paso,' : 'Without this step,'} <span className="font-semibold">{es ? 'tu dinero no llegará' : 'your money won\'t arrive'}</span>. {es ? 'Es rápido, te lo prometemos.' : 'It\'s quick, we promise.'}
      </p>
    </WAFrame>
  )
}

function Exploration6({ lang }: { lang: 'es' | 'en' }) {
  const es = lang === 'es'
  return (
    <WAFrame lang={lang}>
      <div className="rounded-lg overflow-hidden">
        <div className="bg-[#FEF2F2] px-4 pt-5 pb-4">
          <div className="flex items-center gap-2 mb-3">
            <div className="flex -space-x-1">
              <div className="w-3 h-3 rounded-full bg-[#EF4444]" />
              <div className="w-3 h-3 rounded-full bg-[#EF4444]/60" />
              <div className="w-3 h-3 rounded-full bg-[#EF4444]/30" />
            </div>
            <span className="text-[10px] font-bold text-[#DC2626] uppercase tracking-wider">{es ? 'Urgente' : 'Urgent'}</span>
          </div>
          <p className="font-display font-extrabold text-[#7F1D1D] text-xl leading-tight">
            {es ? 'Tu dinero aún no ha salido' : 'Your money hasn\'t left yet'}
          </p>
          <p className="text-sm text-[#991B1B]/60 mt-1.5 leading-snug">
            {es ? 'Confirma tu identidad y lo enviamos de inmediato' : 'Confirm your identity and we\'ll send it right away'}
          </p>
          <div className="mt-4 grid grid-cols-2 gap-2">
            <div className="bg-white/70 rounded-lg px-3 py-2 text-center">
              <p className="text-xs text-[#991B1B]/50">{es ? 'Monto' : 'Amount'}</p>
              <p className="text-sm font-bold text-[#7F1D1D]">$175.00</p>
            </div>
            <div className="bg-white/70 rounded-lg px-3 py-2 text-center">
              <p className="text-xs text-[#991B1B]/50">{es ? 'Estado' : 'Status'}</p>
              <p className="text-sm font-bold text-[#DC2626]">{es ? 'En espera' : 'On hold'}</p>
            </div>
          </div>
        </div>
      </div>
      <p className="text-[13px] text-slate mt-2 leading-snug">
        🚨 {es ? 'Tus $175.00' : 'Your $175.00'} <span className="font-semibold">{es ? 'no llegarán' : 'won\'t arrive'}</span> {es ? 'sin este paso. Es rápido.' : 'without this step. It\'s quick.'}
      </p>
    </WAFrame>
  )
}

function Exploration7({ lang }: { lang: 'es' | 'en' }) {
  const es = lang === 'es'
  return (
    <WAFrame lang={lang}>
      <div className="rounded-lg overflow-hidden">
        <div className="relative bg-[#FEF9C3] px-4 pt-5 pb-4">
          <div className="absolute top-0 left-0 right-0 h-1 bg-[#EAB308]" />
          <div className="flex items-start gap-3">
            <HandPalm size={40} className="text-[#D97706] flex-shrink-0" />
            <div>
              <p className="font-display font-extrabold text-[#713F12] text-xl leading-tight">
                {es ? 'Un momento' : 'One moment'}
              </p>
              <p className="text-sm text-[#854D0E]/70 mt-1.5 leading-snug">
                {es
                  ? <>Necesitamos confirmar tu identidad. Tus <span className="font-semibold">$175.00 USD</span> están en pausa hasta entonces.</>
                  : <>We need to confirm your identity. Your <span className="font-semibold">$175.00 USD</span> is paused until then.</>
                }
              </p>
            </div>
          </div>
          <div className="mt-4 bg-[#854D0E]/10 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-1.5">
              <Clock size={16} className="text-[#854D0E]" />
              <span className="text-xs font-semibold text-[#713F12]">{es ? 'Son solo 2 minutos' : 'Just 2 minutes'}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="h-1 flex-1 rounded-full bg-[#854D0E]/10">
                <div className="h-full w-0 rounded-full bg-[#EAB308]" />
              </div>
              <span className="text-[10px] text-[#854D0E]/50">0%</span>
            </div>
          </div>
        </div>
      </div>
      <p className="text-[13px] text-slate mt-2 leading-snug">
        ✋ {es ? 'Completa este paso y tu dinero estará en camino' : 'Complete this step and your money will be on its way'}
      </p>
    </WAFrame>
  )
}

function Exploration8({ lang }: { lang: 'es' | 'en' }) {
  const es = lang === 'es'
  return (
    <WAFrame lang={lang}>
      <div className="rounded-lg overflow-hidden">
        <div className="bg-gradient-to-b from-[#FDE68A] to-[#FEF3C7] px-4 pt-5 pb-4">
          <div className="flex items-center justify-between mb-3">
            <span className="inline-flex items-center gap-1.5 bg-[#D97706] text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
              {es ? 'Te necesitamos' : 'We need you'}
            </span>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex-shrink-0">
              <div className="w-16 h-16 rounded-2xl bg-white/80 flex items-center justify-center shadow-sm">
                <IdentificationCard size={36} className="text-[#D97706]" />
              </div>
            </div>
            <div>
              <p className="font-display font-extrabold text-[#78350F] text-lg leading-tight">
                {es ? 'Confirma tu identidad' : 'Confirm your identity'}
              </p>
              <p className="text-xs text-[#92400E]/60 mt-1 leading-snug">
                {es ? 'Para que tu dinero siga su camino' : 'So your money can be on its way'}
              </p>
            </div>
          </div>
          <div className="mt-4 bg-[#78350F] rounded-xl px-4 py-3 text-center">
            <p className="text-sm font-bold text-white">{es ? 'Confirmar ahora' : 'Confirm now'}</p>
          </div>
        </div>
      </div>
      <p className="text-[13px] text-slate mt-2 leading-snug">
        🪪 {es ? 'Un paso rápido y tu dinero estará en camino.' : 'One quick step and your money will be on its way.'} <span className="font-semibold">{es ? 'Es necesario para continuar.' : 'It\'s needed to continue.'}</span>
      </p>
    </WAFrame>
  )
}

/* ─── Dual-language pair ───────────────────────────────────────────── */

function DualExploration({ Component }: { Component: React.ComponentType<{ lang: 'es' | 'en' }> }) {
  return (
    <>
      <Component lang="es" />
      <Component lang="en" />
    </>
  )
}

/* ─── Main Page ────────────────────────────────────────────────────── */

export default function HoldsPage() {
  const [showCurrent, setShowCurrent] = useState(true)

  return (
    <div className="min-h-screen bg-stone">
      <div className="max-w-6xl mx-auto px-6 sm:px-10 py-12 sm:py-16">
        {/* Header */}
        <div className="mb-12">
          <FelixLogo className="h-8 text-slate mb-6" />
          <h1 className="font-display font-black text-slate text-3xl sm:text-4xl lg:text-5xl leading-[0.95] tracking-tight mb-4">
            Hold Template Explorations
          </h1>
          <p className="text-lg text-mocha leading-relaxed max-w-2xl">
            Exploring visual treatments that communicate urgency and required action when a remittance is on hold. The current green theme signals success/optional, leading users to skip verification.
          </p>
          <div className="mt-6 flex items-center gap-3 flex-wrap">
            <span className="text-sm font-semibold text-mocha">Key signals to convey:</span>
            <div className="flex flex-wrap gap-2">
              {['Blocked, not optional', 'Money won\'t arrive', 'Quick to complete', 'Action required'].map(s => (
                <span key={s} className="inline-block bg-slate/10 text-slate text-xs font-semibold px-3 py-1 rounded-full">{s}</span>
              ))}
            </div>
          </div>
        </div>

        {/* Current design toggle */}
        <button
          onClick={() => setShowCurrent(!showCurrent)}
          className="mb-8 flex items-center gap-2 text-sm font-semibold text-mocha hover:text-slate transition-colors"
        >
          <svg className={`w-4 h-4 transition-transform ${showCurrent ? 'rotate-90' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
          {showCurrent ? 'Hide' : 'Show'} current design
        </button>

        {showCurrent && (
          <div className="mb-12 p-6 bg-white rounded-2xl border border-red-200 shadow-sm">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-2 h-2 rounded-full bg-red-400" />
              <span className="text-xs font-bold text-red-500 uppercase tracking-wider">Current (problematic)</span>
            </div>
            <p className="text-sm text-mocha mb-4">Green theme signals success/completion. Users believe this is optional and skip it, blocking their remittance.</p>
            <div className="max-w-[340px]">
              <div className="bg-[#e2ffc7] rounded-xl px-3 py-2.5 shadow-sm">
                <div className="rounded-lg overflow-hidden">
                  <div className="bg-[#BBF7D0] px-4 pt-5 pb-4">
                    <p className="font-display font-extrabold text-slate text-xl leading-tight">
                      Valida tu identidad
                    </p>
                    <p className="text-sm text-slate/60 mt-1.5">
                      ⏱ No toma mas de 2 minutos
                    </p>
                  </div>
                </div>
                <p className="text-[13px] text-slate mt-2">Necesitamos informacion adicional 📝</p>
                <p className="text-[13px] text-slate">No te preocupes, esto es solo para completar tu perfil 🙈</p>
              </div>
            </div>
          </div>
        )}

        {/* Explorations grid */}
        <div className="grid grid-cols-1 gap-8 lg:gap-10">
          <Card
            num={1}
            label="Amber Pause"
            strategy="Amber signals caution without alarm. 'En pausa' is honest and clear. Message copy is warm but direct about the consequence."
          >
            <DualExploration Component={Exploration1} />
          </Card>

          <Card
            num={2}
            label="Red Alert"
            strategy="Red palette with warning icon conveys urgency. 'Necesitamos tu ayuda' feels personal, not robotic. Pulsing dot draws attention. Ends with a positive: 'y listo.'"
          >
            <DualExploration Component={Exploration2} />
          </Card>

          <Card
            num={3}
            label="Dark + Lock"
            strategy="Dark background signals seriousness. Lock icon reinforces funds are waiting. 'Siga su camino' is warm. Progress bar makes it feel achievable."
          >
            <DualExploration Component={Exploration3} />
          </Card>

          <Card
            num={4}
            label="Orange Blocker"
            strategy="Stop sign visual is unmistakable. 'Necesita un paso más' is clear without being scary. Shows the amount at stake and frames completion as the path forward."
          >
            <DualExploration Component={Exploration4} />
          </Card>

          <Card
            num={5}
            label="Left Border Warning"
            strategy="Classic alert bar with left border. Warning triangle in amber. Shows money flow paused visually. 'Te lo prometemos' adds warmth to the urgency."
          >
            <DualExploration Component={Exploration5} />
          </Card>

          <Card
            num={6}
            label="Status Dashboard"
            strategy="Red 'Urgente' badge catches attention. 'Aún no ha salido' is honest without blame. 'Lo enviamos de inmediato' promises a positive outcome. Mini dashboard grounds the message."
          >
            <DualExploration Component={Exploration6} />
          </Card>

          <Card
            num={7}
            label="Hand Stop + Progress"
            strategy="Universal ✋ gesture for 'wait.' Yellow caution palette. Empty progress bar reinforces nothing has happened yet. 'Un momento' is conversational and human."
          >
            <DualExploration Component={Exploration7} />
          </Card>

          <Card
            num={8}
            label="ID Card + CTA"
            strategy="ID emoji makes the task concrete. 'Te necesitamos' is personal and warm. 'Confirmar ahora' CTA inside the template makes the next step obvious and immediate."
          >
            <DualExploration Component={Exploration8} />
          </Card>
        </div>

        {/* Summary */}
        <div className="mt-16 p-6 sm:p-8 bg-white rounded-2xl border border-slate/10 shadow-sm">
          <h2 className="font-display font-extrabold text-slate text-xl mb-4">Design Principles Applied</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: '🎨', title: 'Color = Meaning', desc: 'Amber/orange/red signal caution and action. Green is reserved for success only.' },
              { icon: '💬', title: 'Warm but Honest', desc: 'Every variant is clear about the consequence while staying conversational. No blame, no jargon.' },
              { icon: '⚡', title: 'Low Effort, High Clarity', desc: '"Son solo 2 minutos" and "es rápido" reduce friction. The path forward always feels achievable.' },
              { icon: '🔒', title: 'Clear, Not Scary', desc: '"En pausa," "en espera," "tu dinero estará en camino" replace cold language like "bloqueado" or "completar tu perfil."' },
            ].map(p => (
              <div key={p.title}>
                <span className="text-2xl">{p.icon}</span>
                <h4 className="font-display font-extrabold text-slate text-sm mt-2 mb-1">{p.title}</h4>
                <p className="text-xs text-mocha leading-relaxed">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
