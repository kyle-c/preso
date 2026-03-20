'use client'

import { useState, useEffect, useCallback } from 'react'

/* ─────────────────────── Shared Components ─────────────────────── */

function PillBadge({ children, dark }: { children: React.ReactNode; dark?: boolean }) {
  return (
    <span className={`inline-block rounded-full px-5 py-1.5 font-sans font-semibold text-sm sm:text-base uppercase tracking-[0.12em] ${dark ? 'bg-turquoise/20 text-turquoise' : 'bg-turquoise text-slate'}`}>
      {children}
    </span>
  )
}

function SlideFooter({ num, total, dark }: { num: number; total: number; dark?: boolean }) {
  return (
    <div className="absolute bottom-0 inset-x-0 flex items-center justify-between px-8 sm:px-12 pb-5 sm:pb-6 text-sm font-sans">
      <span className={`font-display font-extrabold text-xs sm:text-sm ${dark ? 'text-linen' : 'text-foreground'}`}>Félix Multisurface</span>
      <span className={`text-xs sm:text-sm ${dark ? 'text-linen/50' : 'text-muted-foreground'}`}>felixpago.com</span>
      <span className={`text-xs sm:text-sm font-medium ${dark ? 'text-linen' : 'text-foreground'}`}>{num} / {total}</span>
    </div>
  )
}

const TOTAL = 1

/* ═══════════════════════════════════════════════════════════ */
/*                     SLIDE: Multisurface                     */
/* ═══════════════════════════════════════════════════════════ */

function SlideMultisurface() {
  return (
    <div className="relative h-full w-full bg-stone flex flex-col overflow-hidden">
      <div className="flex-1 flex flex-col items-center justify-center px-8 sm:px-12 lg:px-16 pt-0 pb-4 relative z-10 -mt-8">
        {/* Badge + heading */}
        <div className="text-center mb-6 lg:mb-8">
          <div className="mb-2">
            <PillBadge>One Brand, Many Surfaces</PillBadge>
          </div>
          <h1 className="font-display font-black text-foreground text-4xl sm:text-5xl lg:text-6xl xl:text-7xl leading-[0.95] tracking-tight">
            Félix Meets Users<br />Where They Already Are
          </h1>
        </div>

        {/* Two groups side by side — centered */}
        <div className="flex gap-10 lg:gap-16 items-end justify-center">
          {/* Owned group */}
          <div className="flex flex-col items-center">
            {/* Owned phones — fanned */}
            <div className="relative mb-3" style={{ width: '640px', height: '560px' }}>
              {[
                { label: 'Web Apps', src: '/wallet/embed', srcW: 390, srcH: 844, scale: 0.482, left: 100, top: 20, rotate: 0, z: 0 },
                { label: 'Web Apps', src: '/topups/embed/monto', srcW: 390, srcH: 844, scale: 0.482, left: -10, top: 50, rotate: -12, z: 1 },
                { label: 'Web Apps', src: '/fintechtestflow/embed', srcW: 390, srcH: 844, scale: 0.482, left: 210, top: 50, rotate: 12, z: 1 },
                { label: 'Mobile App', src: 'https://felix-app-lovat.vercel.app/embed/felix/home?theme=dark&frame=false', srcW: 375, srcH: 812, scale: 0.501, left: 410, top: 50, rotate: 0, z: 2 },
              ].map((p, i) => (
                <div
                  key={i}
                  className="absolute"
                  style={{ left: p.left, top: p.top, transform: `rotate(${p.rotate}deg)`, zIndex: p.z }}
                >
                  <div className="flex flex-col items-center gap-1.5">
                    {p.label && <span className="text-[10px] font-semibold uppercase tracking-wider text-turquoise-700">{p.label}</span>}
                    <div className="w-[200px] h-[434px] rounded-[28px] border-[6px] border-slate bg-slate shadow-2xl overflow-hidden relative">
                      <div className="absolute top-1 left-1/2 -translate-x-1/2 z-50 w-[58px] h-[15px] bg-slate rounded-full" />
                      <div className="absolute inset-0 rounded-[22px] overflow-hidden">
                        <iframe
                          src={p.src}
                          className="border-0"
                          style={{
                            width: `${p.srcW}px`,
                            height: `${p.srcH}px`,
                            transform: `scale(${p.scale})`,
                            transformOrigin: 'top left',
                          }}
                          tabIndex={-1}
                          title={p.label}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {/* Owned card */}
            <div className="bg-white rounded-xl border border-turquoise/30 shadow-sm flex items-center gap-4 px-5 py-3 w-[640px]">
              <div className="w-2 h-8 rounded-full bg-turquoise flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="font-display font-extrabold text-foreground text-sm leading-snug">Owned Surfaces</span>
                  <span className="text-xs text-muted-foreground font-medium">App, Web</span>
                </div>
                <p className="text-[13px] text-muted-foreground leading-relaxed">
                  Full control over layout, palette, interactions.
                </p>
              </div>
            </div>
          </div>

          {/* Embedded group */}
          <div className="flex flex-col items-center">
            {/* Social phones — fanned */}
            <div className="relative mb-3" style={{ width: '540px', height: '560px' }}>
              {[
                { app: 'whatsapp', label: 'WhatsApp', left: 10, top: 50, rotate: -10, url: 'https://felix-app-lovat.vercel.app/apps/whatsapp' },
                { app: 'instagram', label: 'Instagram', left: 175, top: 0, rotate: 0, url: 'https://felix-app-lovat.vercel.app/apps/instagram#felix-chat' },
                { app: 'tiktok', label: 'TikTok', left: 340, top: 50, rotate: 10, url: 'https://felix-app-lovat.vercel.app/apps/tiktok#felix-chat' },
              ].map((s, i) => (
                <div
                  key={s.app}
                  className="absolute"
                  style={{ left: s.left, top: s.top, transform: `rotate(${s.rotate}deg)`, zIndex: i === 1 ? 2 : 1 }}
                >
                  <div className="flex flex-col items-center gap-1.5">
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-mango-700">
                      {s.label}
                    </span>
                    <div className="w-[200px] h-[434px] rounded-[28px] border-[6px] border-white bg-white shadow-lg overflow-hidden relative">
                      <div className="absolute top-1 left-1/2 -translate-x-1/2 z-50 w-[58px] h-[15px] bg-white rounded-full" />
                      <div className="absolute inset-0 rounded-[22px] overflow-hidden">
                        <iframe
                          src={s.url}
                          className="border-0"
                          style={{ width: '375px', height: '812px', transform: 'scale(0.5333)', transformOrigin: 'top left' }}
                          tabIndex={-1}
                          aria-hidden="true"
                          title={`Félix on ${s.label}`}
                        />
                      </div>
                      <div className="absolute bottom-0 inset-x-0 h-[20px] z-50 bg-white rounded-b-[22px]" />
                      <div className="absolute bottom-1 left-1/2 -translate-x-1/2 z-50 w-[60px] h-[2.5px] rounded-full bg-slate/30" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {/* Embedded card */}
            <div className="bg-white rounded-xl border border-mango/30 shadow-sm flex items-center gap-4 px-5 py-3 w-[540px]">
              <div className="w-2 h-8 rounded-full bg-mango flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="font-display font-extrabold text-foreground text-sm leading-snug">Embedded Surfaces</span>
                  <span className="text-xs text-muted-foreground font-medium">WA, IG, TikTok, FB</span>
                </div>
                <p className="text-[13px] text-muted-foreground leading-relaxed">
                  Someone else&apos;s chrome. Félix adapts to fit.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <SlideFooter num={1} total={TOTAL} />
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════ */
/*                           PAGE                              */
/* ═══════════════════════════════════════════════════════════ */

export default function MultisurfacePage() {
  return (
    <div className="h-screen w-screen overflow-hidden">
      <SlideMultisurface />
    </div>
  )
}
