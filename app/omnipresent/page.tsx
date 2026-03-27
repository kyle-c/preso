'use client'

import { useRef, useState, useEffect } from 'react'

/* ────────────────────────────────────────────────────────────────────
   Omnipresent Visualization — responsive web slide
   /omnipresent
──────────────────────────────────────────────────────────────────── */

function SlideFooter() {
  return (
    <div className="flex items-center justify-between px-8 sm:px-12 py-4 sm:py-5 border-t border-concrete/30">
      <span className="font-display font-extrabold text-xs sm:text-sm text-foreground">
        Félix Design System
      </span>
      <span className="text-xs sm:text-sm text-muted-foreground">felixpago.com</span>
      <span className="text-xs sm:text-sm font-medium text-foreground">3 / 18</span>
    </div>
  )
}

/* Curly brace — scales to its container height via a viewBox trick */
function CurlyBrace({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 20 120"
      fill="none"
      preserveAspectRatio="none"
      className={className ?? 'h-full w-4'}
    >
      <path
        d="M18 2 Q8 2 8 10 L8 52 Q8 60 2 60 Q8 60 8 68 L8 110 Q8 118 18 118"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

const platforms = [
  { name: 'WhatsApp',  stat: '73%', color: '#25D366' },
  { name: 'TikTok',   stat: '52%', color: '#010101' },
  { name: 'Instagram', stat: '57%', color: '#C13584' },
]

function PlatformList() {
  const items = [
    ...platforms,
    { name: 'Félix App', stat: '✦', color: 'var(--turquoise-700)', sub: 'native experience' },
  ]

  return (
    <div className="grid grid-cols-2 gap-x-8 gap-y-6">
      {items.map((p) => (
        <div key={p.name}>
          <div
            className="font-display font-black text-4xl lg:text-5xl leading-none"
            style={{ color: p.color }}
          >
            {p.stat}
          </div>
          <div className="font-display font-extrabold text-foreground text-sm lg:text-base leading-tight mt-1">
            {p.name}
          </div>
          <div className="font-sans text-xs text-muted-foreground">
            {'sub' in p ? p.sub : 'of US Latinos'}
          </div>
        </div>
      ))}
    </div>
  )
}

/* ─── Illustration helper ─────────────────────────────────────────── */
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

/* ─── Phone mockup shell ──────────────────────────────────────────── */
function PhoneFrame({
  src,
  srcW,
  srcH,
  scale,
  label,
  labelColor,
  borderColor = 'border-slate',
  bgColor = 'bg-slate',
  notchColor = 'bg-slate',
  title,
}: {
  src: string
  srcW: number
  srcH: number
  scale: number
  label?: string
  labelColor?: string
  borderColor?: string
  bgColor?: string
  notchColor?: string
  title?: string
}) {
  return (
    <div className="flex flex-col items-center gap-1.5">
      {label && (
        <span className={`text-[10px] font-semibold uppercase tracking-wider ${labelColor ?? 'text-turquoise-700'}`}>
          {label}
        </span>
      )}
      <div className={`w-[200px] h-[434px] rounded-[28px] border-[6px] ${borderColor} ${bgColor} shadow-2xl overflow-hidden relative`}>
        <div className={`absolute top-1 left-1/2 -translate-x-1/2 z-50 w-[58px] h-[15px] ${notchColor} rounded-full`} />
        <div className="absolute inset-0 rounded-[22px] overflow-hidden">
          <iframe
            src={src}
            className="border-0"
            style={{
              width: `${srcW}px`,
              height: `${srcH}px`,
              transform: `scale(${scale})`,
              transformOrigin: 'top left',
            }}
            tabIndex={-1}
            title={title ?? label ?? 'Phone embed'}
          />
        </div>
      </div>
    </div>
  )
}

/* ─── Owned surfaces data ─────────────────────────────────────────── */
const ownedSurfaces = [
  { label: 'Accounts', src: '/wallet/embed', srcW: 390, srcH: 844, scale: 0.482, left: -140, top: 40, rotate: -12, z: 4 },
  { label: 'Checkout', src: '/fintechtestflow/embed', srcW: 390, srcH: 844, scale: 0.482, left: 140, top: 40, rotate: 12, z: 4 },
  { label: 'Mobile App', src: 'https://felix-app-lovat.vercel.app/embed/felix/home?theme=dark&frame=false', srcW: 375, srcH: 812, scale: 0.501, left: 0, top: 0, rotate: 0, z: 5 },
]

/* ─── Embedded surfaces data ──────────────────────────────────────── */
const embeddedSurfaces = [
  { app: 'whatsapp', label: 'WhatsApp', left: 10, top: 50, rotate: -10, url: 'https://felix-app-lovat.vercel.app/apps/whatsapp' },
  { app: 'instagram', label: 'Instagram', left: 175, top: 0, rotate: 0, url: 'https://felix-app-lovat.vercel.app/apps/instagram#felix-chat' },
  { app: 'tiktok', label: 'TikTok', left: 340, top: 50, rotate: 10, url: 'https://felix-app-lovat.vercel.app/apps/tiktok#felix-chat' },
]

export default function OmnipresentPage() {
  return (
    <div className="h-screen bg-stone flex flex-col font-sans overflow-hidden relative">

      {/* ── Floating illustrations ── */}
      <style>{`
        @keyframes ds-float { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-12px); } }
        @keyframes ds-drift { 0%,100% { transform: translateX(0); } 50% { transform: translateX(10px); } }
      `}</style>
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute top-[5%] left-[2%] w-[100px] lg:w-[140px] opacity-[0.14] -rotate-12" style={{ animation: 'ds-float 7s ease-in-out infinite' }}>
          <Illo src="Hand%20-%20Cell%20Phone%20-%20F%C3%A9lix%20WA.svg" />
        </div>
        <div className="absolute top-[6%] right-[6%] w-[90px] lg:w-[120px] opacity-[0.12] rotate-6" style={{ animation: 'ds-drift 8s ease-in-out infinite 1s' }}>
          <Illo src="Hand%20-%20Stars.svg" />
        </div>
        <div className="absolute bottom-[16%] left-[4%] w-[80px] lg:w-[110px] opacity-[0.12] rotate-3" style={{ animation: 'ds-float 9s ease-in-out infinite 2s' }}>
          <Illo src="Paper%20Airplane%20%2B%20Coin%20-%20Turquoise.svg" />
        </div>
        <div className="absolute bottom-[14%] right-[3%] w-[100px] lg:w-[130px] opacity-[0.10] -rotate-6" style={{ animation: 'ds-drift 7s ease-in-out infinite 0.5s' }}>
          <Illo src="Hands%20-%202%20Cell%20Phones%20-%20Juntos%20we%20Succeed.svg" />
        </div>
      </div>

      {/* ── Slide body ── */}
      <div className="flex-1 flex flex-col px-8 sm:px-12 lg:px-16 pt-12 sm:pt-16 pb-4 min-h-0">

        {/* Heading */}
        <div className="mb-4 sm:mb-6 flex-shrink-0 text-center mx-auto max-w-2xl">
          <h1 className="font-display font-black text-foreground leading-[0.93] tracking-tight text-4xl sm:text-5xl lg:text-6xl xl:text-7xl">
            Félix Is<br />Already There
          </h1>
          <p className="mt-3 sm:mt-4 text-base sm:text-lg lg:text-xl text-muted-foreground leading-relaxed mx-auto max-w-xl">
            73% of US Latinos use WhatsApp daily. Félix meets them there — and in every other app they already trust.
          </p>
        </div>

        {/* ── All devices centered ── */}
        <div className="flex-1 flex items-start justify-center min-h-0 pt-4 relative">

          {/* Platform list — left side, aligned with devices */}
          <div className="absolute left-0 top-0 mt-12">
            <PlatformList />
          </div>

          {/* Center: Owned Surfaces fan — absolutely centered on page */}
          <div className="relative" style={{ width: '200px', height: '500px' }}>
            {ownedSurfaces.map((p, i) => (
              <div
                key={i}
                className="absolute"
                style={{ left: `calc(50% + ${p.left}px)`, top: p.top, transform: `translateX(-50%) rotate(${p.rotate}deg)`, zIndex: p.z }}
              >
                <PhoneFrame
                  src={p.src}
                  srcW={p.srcW}
                  srcH={p.srcH}
                  scale={p.scale}
                  label={p.label}
                  labelColor="text-turquoise-700"
                  borderColor="border-slate"
                  bgColor="bg-slate"
                  notchColor="bg-slate"
                />
              </div>
            ))}
          </div>

          {/* WhatsApp — positioned to the left of center fan */}
          <div className="absolute mt-12" style={{ right: 'calc(50% + 260px)' }}>
            <PhoneFrame
              src="https://felix-app-lovat.vercel.app/apps/whatsapp"
              srcW={375}
              srcH={812}
              scale={0.5333}
              label="WhatsApp"
              labelColor="text-mango-700"
              borderColor="border-white"
              bgColor="bg-white"
              notchColor="bg-white"
              title="Félix on WhatsApp"
            />
          </div>

          {/* Instagram — behind checkout, above tiktok */}
          <div className="absolute mt-8" style={{ left: 'calc(50% + 200px)', transform: 'rotate(2deg)', zIndex: 3 }}>
            <PhoneFrame
              src="https://felix-app-lovat.vercel.app/apps/instagram#felix-chat"
              srcW={375}
              srcH={812}
              scale={0.5333}
              label="Instagram"
              labelColor="text-mango-700"
              borderColor="border-white"
              bgColor="bg-white"
              notchColor="bg-white"
              title="Félix on Instagram"
            />
          </div>

          {/* TikTok — behind Instagram */}
          <div className="absolute mt-16" style={{ left: 'calc(50% + 350px)', transform: 'rotate(12deg)', zIndex: 2 }}>
            <PhoneFrame
              src="https://felix-app-lovat.vercel.app/apps/tiktok#felix-chat"
              srcW={375}
              srcH={812}
              scale={0.5333}
              label="TikTok"
              labelColor="text-mango-700"
              borderColor="border-white"
              bgColor="bg-white"
              notchColor="bg-white"
              title="Félix on TikTok"
            />
          </div>

        </div>
      </div>

      {/* ── Footer ── */}
      <SlideFooter />

    </div>
  )
}
