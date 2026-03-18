'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { SlideToc, SlideTocChrome } from '@/components/slide-toc'
import { useComments, SlideCommentLayer } from '@/components/slide-comments'
import { useLocale, useSlideTranslation, SlidePreTranslator } from '@/components/slide-translation'
import { useSlidePdf } from '@/components/use-slide-pdf'
import { SlidePdfOverlay } from '@/components/slide-pdf-overlay'
import { PresentationPassword } from '@/components/presentation-password'

/* ─────────────────────── Colors ─────────────────────── */

const C = {
  turquoise: '#2BF2F1', slate: '#082422', blueberry: '#6060BF',
  evergreen: '#35605F', cactus: '#60D06F', mango: '#F19D38',
  papaya: '#F26629', lime: '#DCFF00', lychee: '#FFCD9C',
  sky: '#8DFDFA', stone: '#EFEBE7', concrete: '#CFCABF', mocha: '#877867',
}

/* ─────────────────────── Shared Components ─────────────────────── */

function SlideFooter({ num, total, dark }: { num: number; total: number; dark?: boolean }) {
  return (
    <div className="absolute bottom-0 inset-x-0 flex items-center justify-between px-8 sm:px-12 pb-5 sm:pb-6 text-sm font-sans">
      <span className={`font-display font-extrabold text-xs sm:text-sm ${dark ? 'text-linen' : 'text-foreground'}`}>Felix Training</span>
      <span className={`text-xs sm:text-sm ${dark ? 'text-linen/50' : 'text-muted-foreground'} absolute left-1/2 -translate-x-1/2`}>felixpago.com</span>
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

function TagBadge({ children, color }: { children: React.ReactNode; color: string }) {
  return (
    <span className="inline-flex items-center justify-center rounded-full px-4 py-1 font-display font-black text-xs tracking-wide" style={{ backgroundColor: `${color}20`, color }}>
      {children}
    </span>
  )
}

function InfoCard({ title, titleColor, children }: { title: string; titleColor: string; children: React.ReactNode }) {
  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-5 sm:p-6">
      <h3 className="font-display font-black text-[10px] sm:text-xs uppercase tracking-[0.2em] mb-3 sm:mb-4" style={{ color: titleColor }}>{title}</h3>
      {children}
    </div>
  )
}

function ChatTemplate({ color, children }: { color: string; children: React.ReactNode }) {
  return (
    <div className="bg-black/30 rounded-2xl rounded-bl-none p-4 sm:p-5 text-xs sm:text-sm leading-relaxed text-white/80 italic border-l-[3px]" style={{ borderColor: color }}>
      {children}
    </div>
  )
}

function WarnBox({ emoji, title, titleColor, bgColor, borderColor, children }: { emoji: string; title: string; titleColor: string; bgColor: string; borderColor: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl p-4 sm:p-5 flex gap-3 items-start" style={{ backgroundColor: bgColor, border: `1px solid ${borderColor}` }}>
      <span className="text-xl flex-shrink-0">{emoji}</span>
      <div>
        <div className="font-display font-black text-[10px] uppercase tracking-[0.2em] mb-1" style={{ color: titleColor }}>{title}</div>
        <div className="text-xs sm:text-sm text-white/80 leading-relaxed">{children}</div>
      </div>
    </div>
  )
}

const TOTAL = 10

/* ═══════════════════════════════════════════════════════════ */
/*                     SLIDE COMPONENTS                       */
/* ═══════════════════════════════════════════════════════════ */

/* ── Slide 1: Title ──────────────────────────────────────── */
function SlideTitle() {
  return (
    <div className="relative h-full w-full flex flex-col overflow-hidden" style={{ backgroundColor: C.turquoise }}>
      <div className="flex-1 flex items-center justify-center px-8 sm:px-12 lg:px-16 py-10 relative z-10">
        <div className="flex flex-col items-center text-center max-w-3xl">
          <h1 className="font-display font-black text-slate text-4xl sm:text-5xl lg:text-7xl xl:text-8xl leading-[0.95] tracking-tight mb-5">
            Bank Transaction:<br />
            <span className="text-slate/70">Where is{'\u00A0'}my{'\u00A0'}money?</span>
          </h1>
          <p className="font-mono text-sm uppercase tracking-[0.2em] text-evergreen mb-6">
            Customer Support Training - Ninja Guide
          </p>
          <div className="bg-slate text-turquoise font-mono text-xs sm:text-sm px-5 py-2 rounded-full">
            4 Tags - Every scenario covered
          </div>
        </div>
      </div>
      <SlideFooter num={1} total={TOTAL} />
    </div>
  )
}

/* ── Slide 2: Overview ───────────────────────────────────── */
function SlideOverview() {
  return (
    <div className="relative h-full w-full bg-slate flex flex-col overflow-hidden">
      <div className="flex-1 flex items-center justify-center px-8 sm:px-12 lg:px-16 py-10 relative z-10">
        <div className="w-full max-w-[1000px]">
          <div className="mb-4">
            <PillBadge dark>Overview</PillBadge>
          </div>
          <h2 className="font-display font-black text-linen text-3xl sm:text-4xl lg:text-5xl leading-[0.95] tracking-tight mb-8">
            What does<br /><span className="text-turquoise">this module cover?</span>
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            <InfoCard title="Objective" titleColor={C.lime}>
              <p className="text-sm text-white/75 leading-relaxed">
                Every Ninja should be able to identify the correct scenario for a missing deposit and respond with the right tag — without over-escalating or under-escalating.
              </p>
            </InfoCard>
            <InfoCard title="The 4 Tags" titleColor={C.lime}>
              <div className="space-y-3">
                <div className="flex items-start gap-3 text-sm text-white/75"><span className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0" style={{ backgroundColor: C.turquoise }} /><span><strong className="text-white/90">Tag 1</strong> - On track (within SLA)</span></div>
                <div className="flex items-start gap-3 text-sm text-white/75"><span className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0 bg-red-400" /><span><strong className="text-white/90">Tag 2</strong> - Delayed, first contact</span></div>
                <div className="flex items-start gap-3 text-sm text-white/75"><span className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0" style={{ backgroundColor: C.mango }} /><span><strong className="text-white/90">Tag 3</strong> - Delayed, already escalated</span></div>
                <div className="flex items-start gap-3 text-sm text-white/75"><span className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0" style={{ backgroundColor: C.blueberry }} /><span><strong className="text-white/90">Tag 4</strong> - Night shift</span></div>
              </div>
            </InfoCard>
          </div>
        </div>
      </div>
      <SlideFooter num={2} total={TOTAL} dark />
    </div>
  )
}

/* ── Slide 3: Decision Tree ──────────────────────────────── */
function SlideDecisionTree() {
  return (
    <div className="relative h-full w-full bg-slate flex flex-col overflow-hidden">
      <div className="flex-1 flex items-center justify-center px-6 sm:px-10 lg:px-14 py-8 relative z-10">
        <div className="w-full max-w-[750px]">
          <h2 className="font-display font-black text-linen text-3xl sm:text-4xl lg:text-5xl leading-[0.95] tracking-tight mb-6 text-center">
            Which tag <span className="text-lime">do I use?</span>
          </h2>

          <div className="flex flex-col items-center gap-2">
            {/* Bancolombia gate */}
            <div className="w-full bg-yellow-400/10 border border-yellow-400/30 rounded-xl p-3 sm:p-4 text-xs sm:text-sm text-white/80 leading-relaxed text-center">
              <strong className="text-yellow-300">Is the destination bank Bancolombia?</strong> First ask if they have <strong className="text-yellow-300">automatic deposit enabled</strong> and follow that process.
            </div>
            <span className="text-yellow-300 text-lg">&#8595;</span>

            {/* Night check */}
            <div className="w-full bg-turquoise/10 border border-turquoise/30 rounded-xl p-3 sm:p-4 text-center font-bold text-sm text-white">
              <span className="text-turquoise">Did the customer contact between 10 PM - 8 AM?</span>
            </div>
            <span className="text-white/30 text-lg">&#8595;</span>

            {/* Branches */}
            <div className="grid grid-cols-2 gap-3 w-full">
              {/* YES */}
              <div className="flex flex-col items-center gap-2">
                <span className="bg-turquoise/15 text-turquoise font-mono text-[10px] uppercase tracking-widest px-3 py-1 rounded-full">Yes</span>
                <div className="w-full rounded-xl p-3 text-center text-xs sm:text-sm border" style={{ backgroundColor: `${C.blueberry}10`, borderColor: `${C.blueberry}50` }}>
                  <strong className="text-white/90">Tag 4</strong>
                  <span className="text-white/50 block text-[11px] mt-0.5">Night Shift</span>
                </div>
              </div>

              {/* NO */}
              <div className="flex flex-col items-center gap-2">
                <span className="bg-red-400/15 text-red-300 font-mono text-[10px] uppercase tracking-widest px-3 py-1 rounded-full">No</span>
                <div className="w-full bg-turquoise/10 border border-turquoise/30 rounded-xl p-3 text-center font-bold text-xs text-white">
                  <span className="text-turquoise">Has it exceeded the country SLA?</span>
                </div>
                <span className="text-white/30 text-sm">&#8595;</span>
                <div className="grid grid-cols-2 gap-2 w-full">
                  <div className="flex flex-col items-center gap-1">
                    <span className="bg-red-400/15 text-red-300 font-mono text-[9px] uppercase tracking-widest px-2 py-0.5 rounded-full">No</span>
                    <div className="w-full rounded-lg p-2 text-center text-[11px] border" style={{ backgroundColor: `${C.turquoise}10`, borderColor: `${C.turquoise}40` }}>
                      <strong className="text-white/90">Tag 1</strong>
                      <span className="text-white/50 block text-[10px]">On Track</span>
                    </div>
                  </div>
                  <div className="flex flex-col items-center gap-1">
                    <span className="bg-turquoise/15 text-turquoise font-mono text-[9px] uppercase tracking-widest px-2 py-0.5 rounded-full">Yes</span>
                    <div className="w-full bg-turquoise/10 border border-turquoise/30 rounded-lg p-2 text-center text-[11px] font-bold text-white">
                      <span className="text-turquoise text-[10px]">Dojo case open?</span>
                    </div>
                    <div className="grid grid-cols-2 gap-1 w-full mt-1">
                      <div className="flex flex-col items-center gap-0.5">
                        <span className="text-red-300 font-mono text-[8px]">NO</span>
                        <div className="w-full rounded-md p-1.5 text-center text-[10px] border" style={{ backgroundColor: 'rgba(255,77,77,0.06)', borderColor: 'rgba(255,77,77,0.3)' }}>
                          <strong>Tag 2</strong>
                        </div>
                      </div>
                      <div className="flex flex-col items-center gap-0.5">
                        <span className="text-turquoise font-mono text-[8px]">YES</span>
                        <div className="w-full rounded-md p-1.5 text-center text-[10px] border" style={{ backgroundColor: `${C.mango}10`, borderColor: `${C.mango}50` }}>
                          <strong>Tag 3</strong>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <SlideFooter num={3} total={TOTAL} dark />
    </div>
  )
}

/* ── Slide 4: Tag 1 ──────────────────────────────────────── */
function SlideTag1() {
  return (
    <div className="relative h-full w-full bg-slate flex flex-col overflow-hidden">
      <div className="flex-1 flex items-center justify-center px-6 sm:px-10 lg:px-14 py-8 relative z-10">
        <div className="w-full max-w-[1050px]">
          <div className="flex items-center gap-3 mb-5">
            <TagBadge color={C.turquoise}>TAG 1</TagBadge>
            <h2 className="font-display font-black text-linen text-xl sm:text-2xl lg:text-3xl leading-tight tracking-tight">
              <span className="text-turquoise">bank_trax_on_track</span><br />On track - Within SLA
            </h2>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <InfoCard title="When to use it?" titleColor={C.turquoise}>
              <div className="space-y-2.5 text-xs sm:text-sm text-white/75 leading-relaxed">
                <div className="flex gap-2"><span className="flex-shrink-0">&#128336;</span><span>The deposit has <strong className="text-white/90">NOT exceeded</strong> the country SLA.</span></div>
                <div className="flex gap-2"><span className="flex-shrink-0">&#127758;</span><span><strong className="text-white/90">All countries</strong> (except Dom. Rep.): up to <strong className="text-white/90">59 min</strong>.</span></div>
                <div className="flex gap-2"><span className="flex-shrink-0">&#127465;&#127476;</span><span><strong className="text-white/90">Dominican Republic:</strong> up to <strong className="text-white/90">3h 59min</strong>.</span></div>
              </div>
            </InfoCard>
            <InfoCard title="Ninja Action" titleColor={C.turquoise}>
              <div className="space-y-2.5 text-xs sm:text-sm text-white/80 leading-relaxed">
                <div className="flex gap-2"><span className="text-turquoise flex-shrink-0">&#9745;</span><span>Inform that the transaction is within normal processing time.</span></div>
                <div className="flex gap-2"><span className="text-turquoise flex-shrink-0">&#9745;</span><span>Provide the estimated time based on the SLA table.</span></div>
                <div className="flex gap-2"><span className="text-yellow-400 flex-shrink-0">&#9888;</span><span>If over <strong className="text-white/90">30 min</strong> but within SLA: open a Dojo ticket <strong className="text-white/90">for statistics only</strong>.</span></div>
              </div>
            </InfoCard>
            <div className="lg:col-span-2">
              <ChatTemplate color={C.turquoise}>
                &ldquo;Thank you for reaching out. I&apos;ve reviewed your transaction and can confirm the deposit is being processed and within the normal delivery time for your country. The estimated arrival time is up to <strong className="not-italic">[1 hour / 4 hours depending on country]</strong>. If you don&apos;t receive the deposit after that time, please contact us again and we&apos;ll review it with priority.&rdquo;
              </ChatTemplate>
            </div>
            <div className="lg:col-span-2">
              <WarnBox emoji="&#127974;" title="Bancolombia Exception" titleColor="#FFD93D" bgColor="rgba(255,196,0,0.08)" borderColor="rgba(255,196,0,0.35)">
                If the destination bank is <strong className="text-yellow-300">Bancolombia</strong>, waiting for the SLA is NOT enough. You must ask if the customer has <strong className="text-yellow-300">automatic deposit enabled</strong>. If they don&apos;t have it activated, the money <strong>will not arrive</strong> even if the time has passed.
              </WarnBox>
            </div>
          </div>
        </div>
      </div>
      <SlideFooter num={4} total={TOTAL} dark />
    </div>
  )
}

/* ── Slide 5: Tag 2 ──────────────────────────────────────── */
function SlideTag2() {
  return (
    <div className="relative h-full w-full bg-slate flex flex-col overflow-hidden">
      <div className="flex-1 flex items-center justify-center px-6 sm:px-10 lg:px-14 py-8 relative z-10">
        <div className="w-full max-w-[1050px]">
          <div className="flex items-center gap-3 mb-5">
            <TagBadge color="#FF8A8A">TAG 2</TagBadge>
            <h2 className="font-display font-black text-linen text-xl sm:text-2xl lg:text-3xl leading-tight tracking-tight">
              <span className="text-red-400">bank_trax_delayed_to_escalate</span><br />Delayed - First contact
            </h2>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <InfoCard title="When to use it?" titleColor="#FF8A8A">
              <div className="space-y-2.5 text-xs sm:text-sm text-white/75 leading-relaxed">
                <div className="flex gap-2"><span className="flex-shrink-0">&#9201;</span><span>The deposit has already <strong className="text-white/90">exceeded the SLA</strong>: over 1h (or over 4h in Dom. Rep.).</span></div>
                <div className="flex gap-2"><span className="flex-shrink-0">1&#65039;&#8419;</span><span>This is the customer&apos;s <strong className="text-white/90">FIRST contact</strong> about this transaction.</span></div>
                <div className="flex gap-2"><span className="flex-shrink-0">&#128269;</span><span>Verify that a Dojo case <strong className="text-white/90">does NOT exist</strong> before using this tag.</span></div>
              </div>
            </InfoCard>
            <InfoCard title="Ninja Action" titleColor="#FF8A8A">
              <div className="space-y-2.5 text-xs sm:text-sm text-white/80 leading-relaxed">
                <div className="flex gap-2"><span className="text-red-400 flex-shrink-0">&#128680;</span><span>Escalate to the Dojo team as <strong className="text-white/90">Delayed Transaction</strong>.</span></div>
                <div className="flex gap-2"><span className="text-red-400 flex-shrink-0">&#128236;</span><span>Inform they will receive a response within <strong className="text-white/90">3 business days</strong> max.</span></div>
                <div className="flex gap-2"><span className="text-red-400 flex-shrink-0">&#128683;</span><span>Do NOT re-escalate if a case already exists — use Tag 3.</span></div>
              </div>
            </InfoCard>
            <div className="lg:col-span-2">
              <ChatTemplate color="#FF8A8A">
                &ldquo;I apologize for the inconvenience. I&apos;ve reviewed your case and see that your deposit has exceeded the expected processing time. I&apos;ve escalated your request to our specialized team so they can investigate it with priority. You&apos;ll receive an update within a maximum of <strong className="not-italic">3 business days</strong>.&rdquo;
              </ChatTemplate>
            </div>
          </div>
        </div>
      </div>
      <SlideFooter num={5} total={TOTAL} dark />
    </div>
  )
}

/* ── Slide 6: Tag 3 ──────────────────────────────────────── */
function SlideTag3() {
  return (
    <div className="relative h-full w-full bg-slate flex flex-col overflow-hidden">
      <div className="flex-1 flex items-center justify-center px-6 sm:px-10 lg:px-14 py-8 relative z-10">
        <div className="w-full max-w-[1050px]">
          <div className="flex items-center gap-3 mb-5">
            <TagBadge color={C.mango}>TAG 3</TagBadge>
            <h2 className="font-display font-black text-linen text-xl sm:text-2xl lg:text-3xl leading-tight tracking-tight">
              <span style={{ color: C.mango }}>bank_trax_delayed_recontact</span><br />Delayed - Already escalated
            </h2>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <InfoCard title="When to use it?" titleColor={C.mango}>
              <div className="space-y-2.5 text-xs sm:text-sm text-white/75 leading-relaxed">
                <div className="flex gap-2"><span className="flex-shrink-0">&#128260;</span><span>The deposit is still delayed and <strong className="text-white/90">already escalated</strong>.</span></div>
                <div className="flex gap-2"><span className="flex-shrink-0">&#128203;</span><span>Verify that an active Dojo case for <strong className="text-white/90">&ldquo;Delayed Trx&rdquo;</strong> exists for this transaction.</span></div>
                <div className="flex gap-2"><span className="flex-shrink-0">&#128295;</span><span>The Dojo team <strong className="text-white/90">is already working on it</strong>.</span></div>
              </div>
            </InfoCard>
            <InfoCard title="Ninja Action" titleColor={C.mango}>
              <div className="space-y-2.5 text-xs sm:text-sm text-white/80 leading-relaxed">
                <div className="flex gap-2"><span style={{ color: C.mango }} className="flex-shrink-0">&#9745;</span><span>Confirm the case is already with the specialized team.</span></div>
                <div className="flex gap-2"><span style={{ color: C.mango }} className="flex-shrink-0">&#128197;</span><span>Check the <strong className="text-white/90">escalation date</strong> and calculate remaining business days.</span></div>
                <div className="flex gap-2"><span style={{ color: C.mango }} className="flex-shrink-0">&#128683;</span><span><strong className="text-white/90">Do NOT re-escalate</strong> the case under any circumstances.</span></div>
              </div>
            </InfoCard>
            <div className="lg:col-span-2">
              <ChatTemplate color={C.mango}>
                &ldquo;Thank you for following up. I&apos;ve reviewed your case and can confirm it has been with our specialized team since <strong className="not-italic">[escalation date]</strong>. The team has a 3-business-day window to respond, so they still have <strong className="not-italic">[X business days]</strong> to resolve it.&rdquo;
              </ChatTemplate>
            </div>
          </div>
        </div>
      </div>
      <SlideFooter num={6} total={TOTAL} dark />
    </div>
  )
}

/* ── Slide 7: Tag 4 ──────────────────────────────────────── */
function SlideTag4() {
  return (
    <div className="relative h-full w-full bg-slate flex flex-col overflow-hidden">
      <div className="flex-1 flex items-center justify-center px-6 sm:px-10 lg:px-14 py-8 relative z-10">
        <div className="w-full max-w-[1050px]">
          <div className="flex items-center gap-3 mb-5">
            <TagBadge color={C.blueberry}>TAG 4</TagBadge>
            <h2 className="font-display font-black text-linen text-xl sm:text-2xl lg:text-3xl leading-tight tracking-tight">
              <span style={{ color: C.blueberry }}>bank_trax_night_shift</span><br />Night shift - 10 PM - 8 AM
            </h2>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <InfoCard title="When to use it?" titleColor={C.blueberry}>
              <div className="space-y-2.5 text-xs sm:text-sm text-white/75 leading-relaxed">
                <div className="flex gap-2"><span className="flex-shrink-0">&#127769;</span><span>The customer contacts between <strong className="text-white/90">10:00 PM and 8:00 AM</strong>.</span></div>
                <div className="flex gap-2"><span className="flex-shrink-0">&#9200;</span><span>Applies based on <strong className="text-white/90">THE TIME OF CONTACT</strong>, regardless of when the transaction was made.</span></div>
              </div>
            </InfoCard>
            <InfoCard title="Ninja Action" titleColor={C.blueberry}>
              <div className="space-y-2.5 text-xs sm:text-sm text-white/80 leading-relaxed">
                <div className="flex gap-2"><span style={{ color: C.blueberry }} className="flex-shrink-0">&#128161;</span><span>Explain that during night hours, payers <strong className="text-white/90">do not process deposits</strong>.</span></div>
                <div className="flex gap-2"><span style={{ color: C.blueberry }} className="flex-shrink-0">&#127749;</span><span>Confirm the deposit will arrive <strong className="text-white/90">after 8:00 AM</strong> the next day.</span></div>
                <div className="flex gap-2"><span style={{ color: C.blueberry }} className="flex-shrink-0">&#128683;</span><span><strong className="text-white/90">Do NOT escalate</strong> the case. No team action is needed.</span></div>
              </div>
            </InfoCard>
            <div className="lg:col-span-2">
              <ChatTemplate color={C.blueberry}>
                &ldquo;Thank you for reaching out. We are currently in night hours (10:00 PM - 8:00 AM), a period during which payment processors do not have active operations. Your deposit will be processed and arrive <strong className="not-italic">after 8:00 AM today/tomorrow</strong>. No additional action is needed.&rdquo;
              </ChatTemplate>
            </div>
          </div>
        </div>
      </div>
      <SlideFooter num={7} total={TOTAL} dark />
    </div>
  )
}

/* ── Slide 8: SLA Table ──────────────────────────────────── */
function SlideSLA() {
  return (
    <div className="relative h-full w-full flex flex-col overflow-hidden" style={{ backgroundColor: C.turquoise }}>
      <div className="flex-1 flex items-center justify-center px-8 sm:px-12 lg:px-16 py-10 relative z-10">
        <div className="flex flex-col items-center w-full max-w-[700px]">
          <h2 className="font-display font-black text-slate text-3xl sm:text-4xl lg:text-5xl tracking-tight mb-8 text-center">
            SLA Table
          </h2>
          <div className="w-full overflow-hidden rounded-xl border border-slate/20">
            <table className="w-full">
              <thead>
                <tr className="bg-slate text-turquoise">
                  <th className="font-mono text-[10px] sm:text-xs uppercase tracking-[0.15em] text-left px-5 py-3">Country / Region</th>
                  <th className="font-mono text-[10px] sm:text-xs uppercase tracking-[0.15em] text-left px-5 py-3">Max SLA</th>
                  <th className="font-mono text-[10px] sm:text-xs uppercase tracking-[0.15em] text-left px-5 py-3">Dojo Ticket</th>
                </tr>
              </thead>
              <tbody className="text-slate">
                <tr className="bg-white/20">
                  <td className="px-5 py-4 text-sm font-medium">All countries (except Dom. Rep.)</td>
                  <td className="px-5 py-4"><span className="font-mono font-bold text-lg">59 min</span></td>
                  <td className="px-5 py-4 text-sm">If over 30 min but under 59</td>
                </tr>
                <tr className="bg-white/10">
                  <td className="px-5 py-4 text-sm font-medium">Dominican Republic</td>
                  <td className="px-5 py-4"><span className="font-mono font-bold text-lg">3h 59min</span></td>
                  <td className="px-5 py-4 text-sm">If over 30 min but under 3h 59min</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="mt-6 bg-slate text-white/70 font-mono text-xs sm:text-sm px-6 py-3 rounded-xl text-center">
            The statistical ticket does NOT trigger an investigation — Black Belts will close it
          </div>
        </div>
      </div>
      <SlideFooter num={8} total={TOTAL} />
    </div>
  )
}

/* ── Slide 9: Do's & Don'ts ──────────────────────────────── */
function SlideDosAndDonts() {
  const dos = [
    'Check the country SLA before responding',
    'Review if a Dojo case already exists',
    'Provide the specific estimated time for the country',
    'Calculate remaining business days for Tag 3',
    'Open a statistical ticket if over 30 min for Tag 1',
    'Use Tag 4 based on time of contact, not the transaction',
  ]
  const donts = [
    'Escalate before the SLA has been exceeded',
    'Re-escalate if an active Dojo case already exists',
    'Escalate night cases — payers do not operate at night',
    'Confuse the statistical ticket with a real investigation',
    'Forget to mention business days in Tag 2 and Tag 3',
    'Apply Tag 4 outside of night hours (10 PM - 8 AM)',
  ]

  return (
    <div className="relative h-full w-full bg-slate flex flex-col overflow-hidden">
      <div className="flex-1 flex items-center justify-center px-8 sm:px-12 lg:px-16 py-10 relative z-10">
        <div className="w-full max-w-[900px]">
          <h2 className="font-display font-black text-linen text-3xl sm:text-4xl lg:text-5xl tracking-tight mb-6 text-center">
            Do&apos;s &amp; Don&apos;ts
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            <div className="bg-turquoise/10 border border-turquoise/20 rounded-2xl p-5 sm:p-6">
              <h3 className="font-display font-black text-[10px] sm:text-xs uppercase tracking-[0.2em] text-turquoise mb-4">Always</h3>
              <div className="space-y-3">
                {dos.map((item, i) => (
                  <div key={i} className="flex gap-2.5 text-xs sm:text-sm text-white/80 leading-relaxed">
                    <span className="text-turquoise flex-shrink-0">&#10003;</span>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-red-400/10 border border-red-400/20 rounded-2xl p-5 sm:p-6">
              <h3 className="font-display font-black text-[10px] sm:text-xs uppercase tracking-[0.2em] text-red-400 mb-4">Never</h3>
              <div className="space-y-3">
                {donts.map((item, i) => (
                  <div key={i} className="flex gap-2.5 text-xs sm:text-sm text-white/80 leading-relaxed">
                    <span className="text-red-400 flex-shrink-0">&#10007;</span>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      <SlideFooter num={9} total={TOTAL} dark />
    </div>
  )
}

/* ── Slide 10: Closing ───────────────────────────────────── */
function SlideClosing() {
  return (
    <div className="relative h-full w-full flex flex-col overflow-hidden" style={{ backgroundColor: C.turquoise }}>
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none" aria-hidden="true">
        <span className="font-mono font-bold text-slate/10 select-none" style={{ fontSize: 'clamp(100px, 20vw, 240px)' }}>4</span>
      </div>
      <div className="flex-1 flex items-center justify-center px-8 sm:px-12 lg:px-16 py-10 relative z-10">
        <div className="flex flex-col items-center text-center max-w-2xl">
          <h2 className="font-display font-black text-slate text-4xl sm:text-5xl lg:text-6xl leading-[0.95] tracking-tight mb-5">
            4 Tags.<br />1 Correct Answer.
          </h2>
          <p className="text-base sm:text-lg text-slate/60 leading-relaxed max-w-xl mb-7">
            Identify the scenario, use the right tag, communicate clearly. Always check Dojo before escalating.
          </p>
          <div className="flex flex-wrap justify-center gap-2.5">
            <span className="bg-slate text-turquoise font-mono text-[11px] px-4 py-1.5 rounded-full tracking-wide">Tag 1 - On Track</span>
            <span className="bg-slate text-turquoise font-mono text-[11px] px-4 py-1.5 rounded-full tracking-wide">Tag 2 - Escalate</span>
            <span className="bg-slate text-turquoise font-mono text-[11px] px-4 py-1.5 rounded-full tracking-wide">Tag 3 - Recontact</span>
            <span className="bg-slate text-turquoise font-mono text-[11px] px-4 py-1.5 rounded-full tracking-wide">Tag 4 - Night Shift</span>
          </div>
        </div>
      </div>
      <SlideFooter num={10} total={TOTAL} />
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════ */
/*                 PRESENTATION CHROME                         */
/* ═══════════════════════════════════════════════════════════ */

const slides = [SlideTitle, SlideOverview, SlideDecisionTree, SlideTag1, SlideTag2, SlideTag3, SlideTag4, SlideSLA, SlideDosAndDonts, SlideClosing]

const slideMeta = [
  { title: 'Bank Transaction', subtitle: 'Where is my money?' },
  { title: 'Overview', subtitle: 'What does this module cover?' },
  { title: 'Decision Tree', subtitle: 'Which tag do I use?' },
  { title: 'Tag 1', subtitle: 'bank_trax_on_track' },
  { title: 'Tag 2', subtitle: 'bank_trax_delayed_to_escalate' },
  { title: 'Tag 3', subtitle: 'bank_trax_delayed_recontact' },
  { title: 'Tag 4', subtitle: 'bank_trax_night_shift' },
  { title: 'SLA Table', subtitle: 'Times by country' },
  { title: "Do's & Don'ts", subtitle: 'Always / Never' },
  { title: '4 Tags', subtitle: '1 Correct Answer' },
]

const darkSlideSet = new Set([1, 2, 3, 4, 5, 6, 8])
const brandSlideSet = new Set([0, 7, 9])

export default function GisellePresentationPage() {
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
  const { comments, commentMode, setCommentMode, addComment, deleteComment, editComment, flagComment, resolveComment, addReply, deleteReply } = useComments('giselle-presentation-comments')
  const { progress: pdfProgress, download: downloadPdf, cancel: cancelPdf } = useSlidePdf('giselle-presentation.pdf')
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
  const isBrand = brandSlideSet.has(current)

  const pillBg = isBrand ? 'bg-slate/20 border-slate/20' : isDark ? 'bg-white/10 border-white/10' : 'bg-white/90 border-border shadow-xs'
  const pillText = isBrand ? 'text-slate/80' : isDark ? 'text-white/70' : 'text-foreground'
  const hintText = isBrand ? 'text-slate/50' : isDark ? 'text-white/40' : 'text-muted-foreground'
  const trackBg = isBrand ? 'bg-slate/10' : isDark ? 'bg-white/10' : 'bg-concrete/30'
  const trackFill = isBrand ? 'bg-slate/60' : isDark ? 'bg-turquoise-400' : 'bg-turquoise-600'
  const dotActive = isBrand ? 'bg-slate/70' : isDark ? 'bg-turquoise-400' : 'bg-turquoise-600'
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
      <div className={`absolute top-0 inset-x-0 h-1 z-50 transition-colors duration-500 ${trackBg}`}>
        <div
          className={`h-full transition-all duration-500 ease-out ${trackFill}`}
          style={{ width: `${((current + 1) / total) * 100}%` }}
        />
      </div>

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
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>

      <button
        onClick={prev}
        disabled={current === 0}
        className={`hidden md:flex absolute left-4 sm:left-8 top-1/2 -translate-y-1/2 z-[100] p-3 rounded-full backdrop-blur-sm border transition-all duration-500 ${btnCls} ${current === 0 ? 'opacity-0 pointer-events-none' : ''}`}
        aria-label="Previous slide"
        type="button"
      >
        <svg className={`w-5 h-5 transition-colors duration-500 ${btnIcon}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      <button
        onClick={next}
        disabled={current === total - 1}
        className={`hidden md:flex absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 z-[100] p-3 rounded-full backdrop-blur-sm border transition-all duration-500 ${btnCls} ${current === total - 1 ? 'opacity-0 pointer-events-none' : ''}`}
        aria-label="Next slide"
        type="button"
      >
        <svg className={`w-5 h-5 transition-colors duration-500 ${btnIcon}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>

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
    </PresentationPassword>
  )
}
