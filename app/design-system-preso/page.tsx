'use client'

import { useState, useEffect, useCallback, createContext, useContext } from 'react'

const CanvasContext = createContext(false)

/* ─────────────────────── Shared Components ─────────────────────── */

function SlideFooter({ num, total, dark }: { num: number; total: number; dark?: boolean }) {
  return (
    <div className="absolute bottom-0 inset-x-0 flex items-center justify-between px-8 sm:px-12 pb-5 sm:pb-6 text-sm font-sans">
      <span className={`font-display font-extrabold text-xs sm:text-sm ${dark ? 'text-linen' : 'text-foreground'}`}>Félix Design System</span>
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

function ScreenPlaceholder({ label, illoSrc }: { label: string; illoSrc: string }) {
  return (
    <div className="bg-concrete/10 border-2 border-dashed border-concrete/40 rounded-2xl flex flex-col items-center justify-center p-8 sm:p-10 min-h-[200px] lg:min-h-[280px]">
      <div className="w-16 h-16 sm:w-20 sm:h-20 mb-4 opacity-30">
        <Illo src={illoSrc} className="w-full h-full" />
      </div>
      <span className="text-sm sm:text-base text-muted-foreground font-medium text-center">{label}</span>
      <span className="text-xs text-muted-foreground/60 mt-1">Screenshot to be added</span>
    </div>
  )
}

function DNACallout({ items }: { items: string[] }) {
  return (
    <div className="flex flex-wrap gap-2">
      {items.map((item) => (
        <span key={item} className="inline-flex items-center gap-1.5 rounded-full bg-turquoise/10 border border-turquoise/20 px-3 py-1 text-xs sm:text-sm font-medium text-turquoise-700">
          <span className="w-1.5 h-1.5 rounded-full bg-turquoise" />
          {item}
        </span>
      ))}
    </div>
  )
}

function ProductCallout({ items }: { items: string[] }) {
  return (
    <div className="flex flex-wrap gap-2">
      {items.map((item) => (
        <span key={item} className="inline-flex items-center gap-1.5 rounded-full bg-mango/10 border border-mango/20 px-3 py-1 text-xs sm:text-sm font-medium text-mango-700">
          <span className="w-1.5 h-1.5 rounded-full bg-mango" />
          {item}
        </span>
      ))}
    </div>
  )
}

function AbsentCallout({ items }: { items: string[] }) {
  return (
    <div className="flex flex-wrap gap-2">
      {items.map((item) => (
        <span key={item} className="inline-flex items-center gap-1.5 rounded-full bg-concrete/10 border border-concrete/30 px-3 py-1 text-xs sm:text-sm font-medium text-muted-foreground line-through decoration-concrete/60">
          <span className="w-1.5 h-1.5 rounded-full bg-concrete/50" />
          {item}
        </span>
      ))}
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════════ */
/*                         SLIDE COMPONENTS                           */
/* ═══════════════════════════════════════════════════════════════════ */

const TOTAL = 18

/* ── Slide 1: Title ──────────────────────────────────────────────── */
function SlideTitle() {
  return (
    <div className="relative h-full w-full bg-stone flex flex-col overflow-hidden">
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute top-[6%] left-[3%] w-[100px] lg:w-[140px] opacity-[0.18] -rotate-12" style={{ animation: 'ds-float 7s ease-in-out infinite' }}>
          <Illo src="Hand%20-%20Tool.svg" />
        </div>
        <div className="absolute top-[8%] right-[8%] w-[90px] lg:w-[120px] opacity-[0.16] rotate-6" style={{ animation: 'ds-drift 8s ease-in-out infinite 1s' }}>
          <Illo src="Hand%20-%20Stars.svg" />
        </div>
        <div className="absolute bottom-[18%] left-[6%] w-[80px] lg:w-[110px] opacity-[0.15] rotate-3" style={{ animation: 'ds-float 9s ease-in-out infinite 2s' }}>
          <Illo src="Magnifying%20Glass.svg" />
        </div>
        <div className="absolute bottom-[12%] right-[4%] w-[100px] lg:w-[130px] opacity-[0.14] -rotate-6" style={{ animation: 'ds-drift 7s ease-in-out infinite 0.5s' }}>
          <Illo src="Bot.svg" />
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center px-8 sm:px-12 lg:px-16 py-10 relative z-10">
        <div className="flex flex-col items-center text-center max-w-3xl">
          <div className="mb-6 lg:mb-8 w-[180px] h-[180px] sm:w-[220px] sm:h-[220px] lg:w-[280px] lg:h-[280px]">
            <Illo src="Paper%20Airplane%20%2B%20Dollar%20Bills.svg" className="h-full w-full" label="Sending money" />
          </div>
          <div className="mb-5 lg:mb-6">
            <PillBadge>Félix Design System</PillBadge>
          </div>
          <h1 className="font-display font-black text-foreground text-5xl sm:text-6xl lg:text-7xl xl:text-8xl leading-[0.95] tracking-tight mb-5 lg:mb-7">
            Preparing Félix for{'\u00A0'}Multi&#8209;Product
          </h1>
          <p className="text-lg sm:text-xl lg:text-2xl text-muted-foreground leading-relaxed max-w-2xl">
            Designing the connective tissue between every product, surface, and market Félix touches.
          </p>
        </div>
      </div>
      <SlideFooter num={1} total={TOTAL} />
    </div>
  )
}

/* ── Slide 2: What is a Design System? ───────────────────────────── */
function SlideWhatIsDS() {
  const points = [
    { icon: 'Survey.svg', title: 'Customer-Led', body: 'Designers, engineers, partners, product teams and possibly agents rely on it to build faster and more\u00A0consistently.' },
    { icon: 'Map%20%2B%20F%20symbol.svg', title: 'Mission Oriented', body: 'Provide shared foundations so teams can move quickly without drifting apart.' },
    { icon: 'Rocket%20Launch%20-%20Growth%20%2B%20Coin%20-%20Turquoise.svg', title: 'Constantly Evolving', body: 'Like any product, it improves through feedback, iteration, and validation with customers.' },
  ]

  return (
    <div className="relative h-full w-full bg-stone flex flex-col overflow-hidden">
      <div className="absolute -bottom-8 -right-8 w-[200px] lg:w-[280px] opacity-[0.08] pointer-events-none" style={{ animation: 'ds-float 10s ease-in-out infinite' }}>
        <Illo src="F%C3%A9lix%20Illo%205.svg" className="w-full h-full" />
      </div>

      <div className="flex-1 flex flex-col items-center justify-center px-8 sm:px-12 lg:px-16 py-8 relative z-10">
        <div className="w-full max-w-[1100px]">
          <div className="mb-5 lg:mb-6 text-center">
            <PillBadge>What is a Design System?</PillBadge>
          </div>
          <h1 className="font-display font-black text-foreground text-4xl sm:text-5xl lg:text-6xl xl:text-7xl leading-[0.95] tracking-tight mb-8 lg:mb-10 text-center">
            A Product<br />Serving Products
          </h1>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 lg:gap-6">
            {points.map((p) => (
              <div key={p.title} className="bg-white rounded-2xl p-6 sm:p-8 border border-border shadow-sm flex flex-col items-center text-center gap-3">
                <div className="w-14 h-14 sm:w-16 sm:h-16 mb-1">
                  <Illo src={p.icon} className="w-full h-full" />
                </div>
                <h3 className="font-display font-extrabold text-foreground text-lg sm:text-xl lg:text-2xl leading-snug">{p.title}</h3>
                <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">{p.body}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      <SlideFooter num={2} total={TOTAL} />
    </div>
  )
}

/* ── Slide 3: One Brand, Many Products ───────────────────────────── */
const productCards = [
  { title: 'Remittances', desc: 'Send money across borders — the core Félix experience.', accent: 'bg-turquoise', illo: 'Hand%20-%20Cell%20Phone%20OK.svg' },
  { title: 'Credit & Credit Building', desc: 'Help users build credit history with tailored flows.', accent: 'bg-lime', illo: 'Credit%20Score%20%2B%20Calculator.svg' },
  { title: 'Top Ups & Bill Pays', desc: 'New financial tools with their own interaction needs.', accent: 'bg-blueberry', illo: 'Calculator%20%2B%20Stack%20of%20coins.svg' },
  { title: 'Accounts & Wallets', desc: 'Manage balances, transactions, and digital wallets.', accent: 'bg-cactus', illo: 'Stack%20of%20coins%20-%20Lime.svg' },
  { title: 'Future Products', desc: 'Insurance, investments, and services we haven\u0027t built yet.', accent: 'bg-mango', illo: 'Magic%20hat%20and%20magic%20wand%20%2B%20dollar%20bill.svg' },
]

function SlideOneBrandProducts() {
  return (
    <div className="relative h-full w-full bg-stone flex flex-col overflow-hidden">
      <div className="flex-1 flex items-center px-8 sm:px-12 lg:px-16 py-10 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-14 items-center w-full max-w-[1400px] mx-auto">
          <div className="flex flex-col justify-center">
            <div className="mb-4 w-[120px] h-[120px] sm:w-[140px] sm:h-[140px]">
              <Illo src="ATM%20%2B%20cell%20phone.svg" className="w-full h-full" />
            </div>
            <h1 className="font-display font-black text-foreground text-4xl sm:text-5xl lg:text-6xl xl:text-7xl leading-[0.95] tracking-tight mb-6 lg:mb-8">
              Serves One Brand,<br />Many Products
            </h1>
            <p className="text-lg sm:text-xl lg:text-2xl text-muted-foreground leading-relaxed max-w-lg">
              Each product serves a different need, but the user should always know they&apos;re with Félix. The design system is what makes that possible.
            </p>
          </div>

          <div className="flex flex-col gap-4">
            {productCards.map((p) => (
              <div key={p.title} className="flex items-stretch bg-white rounded-xl border border-border shadow-sm overflow-hidden">
                <div className={`w-2 flex-shrink-0 ${p.accent}`} />
                <div className="flex items-center gap-4 sm:gap-5 px-5 sm:px-6 py-4 sm:py-5 flex-1">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 flex-shrink-0">
                    <Illo src={p.illo} className="w-full h-full" />
                  </div>
                  <div>
                    <h4 className="font-display font-extrabold text-foreground text-base sm:text-lg lg:text-xl leading-snug">{p.title}</h4>
                    <p className="text-sm sm:text-base text-muted-foreground leading-relaxed mt-0.5">{p.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <SlideFooter num={3} total={TOTAL} />
    </div>
  )
}

/* ── Slide 4: One Brand, Many Surfaces ───────────────────────────── */
function SlideOneBrandSurfaces() {
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
                { app: 'whatsapp', screen: 'chats', label: 'WhatsApp', left: 10, top: 50, rotate: -10, url: 'https://felix-app-lovat.vercel.app/apps/whatsapp' },
                { app: 'instagram', screen: 'chat-list', label: 'Instagram', left: 175, top: 0, rotate: 0, url: 'https://felix-app-lovat.vercel.app/apps/instagram#felix-chat' },
                { app: 'tiktok', screen: 'felix-chat', label: 'TikTok', left: 340, top: 50, rotate: 10, url: 'https://felix-app-lovat.vercel.app/apps/tiktok#felix-chat' },
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
                          src={s.url || `http://localhost:3001/embed/social/${s.app}/${s.screen}?frame=false`}
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
      <SlideFooter num={4} total={TOTAL} />
    </div>
  )
}

/* ── Slide 5: The Shared DNA ─────────────────────────────────────── */
function SlideSharedDNA() {
  const [revealed, setRevealed] = useState(0)

  const features = [
    { title: 'Colors', desc: 'Primary and secondary color palettes with\nWCAG-compliant colorways.', img: '/navicons/colors.png' },
    { title: 'Typography', desc: 'Font families, weights, and type scale\nfor consistent text styling.', img: '/navicons/typography.png' },
    { title: 'Iconography', desc: 'Curated duotone icons that pair\nwith our illustration style.', img: '/illustrations/iconography.png' },
    { title: 'Illustrations', desc: 'The full illustration library with SVG and\nPNG downloads for every asset.', img: '/navicons/illustrations.png' },
    { title: 'Components', desc: 'Pre-built UI components following\nthe Félix Pago design language.', img: '/navicons/components.png' },
    { title: 'Tokens', desc: 'Design tokens mapped to shadcn/ui\nnaming conventions.', img: '/navicons/tokens.png' },
    { title: 'Design Principles', desc: 'Core design principles that guide how\nwe build experiences at Félix Pago.', img: '/navicons/principles.png', full: true },
  ]

  // 4 rows: [0,1], [2,3], [4,5], [6 full-width]
  const rows = [[0, 1], [2, 3], [4, 5], [6]]

  useEffect(() => {
    if (revealed >= rows.length) return
    const timer = setTimeout(() => setRevealed(r => r + 1), revealed === 0 ? 400 : 500)
    return () => clearTimeout(timer)
  }, [revealed, rows.length])

  return (
    <div className="relative h-full w-full bg-stone flex flex-col overflow-hidden">
      <div className="flex-1 flex flex-col items-center justify-center px-8 sm:px-12 lg:px-16 py-8 relative z-10">
        <div className="w-full max-w-[1200px]">
          <div className="mb-5 lg:mb-6 text-center">
            <PillBadge>The Shared DNA</PillBadge>
          </div>
          <h1 className="font-display font-black text-foreground text-3xl sm:text-4xl lg:text-5xl xl:text-6xl leading-[0.95] tracking-tight mb-6 sm:mb-8 text-center max-w-3xl mx-auto">
            The threads that make every product unmistakably Félix
          </h1>

          <div className="space-y-3 lg:space-y-4">
            {rows.map((rowIndices, rowIdx) => (
              <div
                key={rowIdx}
                className={`grid gap-3 lg:gap-4 ${rowIndices.length === 1 ? 'grid-cols-1' : 'grid-cols-2'}`}
                style={{
                  opacity: rowIdx < revealed ? 1 : 0,
                  transform: rowIdx < revealed ? 'translateY(0)' : 'translateY(16px)',
                  transition: 'opacity 500ms ease-out, transform 500ms ease-out',
                }}
              >
                {rowIndices.map((i) => {
                  const f = features[i]
                  const isFull = 'full' in f && f.full
                  return (
                    <div key={f.title} className={`bg-white rounded-2xl border border-border/80 shadow-sm p-5 sm:p-6 flex items-center gap-5 ${isFull ? 'justify-center' : ''}`}>
                      <img src={f.img} alt="" className="w-16 h-16 sm:w-20 sm:h-20 object-contain flex-shrink-0" />
                      <div className="min-w-0">
                        <h3 className="font-display font-extrabold text-foreground text-lg sm:text-xl leading-snug mb-1">{f.title}</h3>
                        <p className="text-sm sm:text-base text-muted-foreground leading-relaxed whitespace-pre-line">{f.desc}</p>
                      </div>
                    </div>
                  )
                })}
              </div>
            ))}
          </div>
        </div>
      </div>
      <SlideFooter num={5} total={TOTAL} />
    </div>
  )
}

/* ── Slide 6: Colors Deep-Dive ───────────────────────────────────── */
function SlideColors() {
  return (
    <div className="relative h-full w-full bg-white flex flex-col overflow-hidden">
      <div className="flex-1 flex flex-col items-center justify-center px-8 sm:px-12 lg:px-16 py-8 relative z-10">
        <div className="w-full max-w-[1100px] flex-1 min-h-0 bg-linen rounded-2xl border border-border/60 shadow-sm overflow-hidden">
          <div className="w-full h-full overflow-y-auto">
            <iframe
              src="/colors"
              className="border-0"
              style={{ width: 'calc(100% + 256px)', height: '100%', marginLeft: '-256px' }}
              title="Félix colors"
            />
          </div>
        </div>
      </div>
      <SlideFooter num={6} total={TOTAL} />
    </div>
  )
}

/* ── Slide 7: Typography ─────────────────────────────────────────── */
function SlideTypography() {
  return (
    <div className="relative h-full w-full bg-white flex flex-col overflow-hidden">
      <div className="flex-1 flex flex-col items-center justify-center px-8 sm:px-12 lg:px-16 py-8 relative z-10">
        <div className="w-full max-w-[1100px] flex-1 min-h-0 bg-linen rounded-2xl border border-border/60 shadow-sm overflow-hidden">
          <div className="w-full h-full overflow-y-auto">
            <iframe
              src="/typography"
              className="border-0"
              style={{ width: 'calc(100% + 256px)', height: '100%', marginLeft: '-256px' }}
              title="Félix typography"
            />
          </div>
        </div>
      </div>
      <SlideFooter num={7} total={TOTAL} />
    </div>
  )
}

/* ── Slide 8: Iconography ───────────────────────────────────────── */
function SlideIconography() {
  return (
    <div className="relative h-full w-full bg-white flex flex-col overflow-hidden">
      <div className="flex-1 flex flex-col items-center justify-center px-8 sm:px-12 lg:px-16 py-8 relative z-10">
        <div className="w-full max-w-[1100px] flex-1 min-h-0 bg-linen rounded-2xl border border-border/60 shadow-sm overflow-hidden">
          <div className="w-full h-full overflow-y-auto">
            <iframe
              src="/iconography"
              className="border-0"
              style={{ width: 'calc(100% + 256px)', height: '100%', marginLeft: '-256px' }}
              title="Félix iconography"
            />
          </div>
        </div>
      </div>
      <SlideFooter num={8} total={TOTAL} />
    </div>
  )
}

/* ── Slide 9: Illustrations ─────────────────────────────────────── */
function SlideIllustrations() {
  return (
    <div className="relative h-full w-full bg-white flex flex-col overflow-hidden">
      <div className="flex-1 flex flex-col items-center justify-center px-8 sm:px-12 lg:px-16 py-8 relative z-10">
        <div className="w-full max-w-[1100px] flex-1 min-h-0 bg-linen rounded-2xl border border-border/60 shadow-sm overflow-hidden">
          <div className="w-full h-full overflow-y-auto">
            <iframe
              src="/illustrations"
              className="border-0"
              style={{ width: 'calc(100% + 256px)', height: '100%', marginLeft: '-256px' }}
              title="Félix illustrations"
            />
          </div>
        </div>
      </div>
      <SlideFooter num={9} total={TOTAL} />
    </div>
  )
}

/* ── Slide 10: Components ───────────────────────────────────────── */
function SlideComponents() {
  return (
    <div className="relative h-full w-full bg-white flex flex-col overflow-hidden">
      <div className="flex-1 flex flex-col items-center justify-center px-8 sm:px-12 lg:px-16 py-8 relative z-10">
        <div className="w-full max-w-[1100px] flex-1 min-h-0 bg-linen rounded-2xl border border-border/60 shadow-sm overflow-hidden">
          <div className="w-full h-full overflow-y-auto">
            <iframe
              src="/components"
              className="border-0"
              style={{ width: 'calc(100% + 256px)', height: '100%', marginLeft: '-256px' }}
              title="Félix components"
            />
          </div>
        </div>
      </div>
      <SlideFooter num={10} total={TOTAL} />
    </div>
  )
}

/* ── Slide 11: Tokens ───────────────────────────────────────────── */
function SlideTokens() {
  return (
    <div className="relative h-full w-full bg-white flex flex-col overflow-hidden">
      <div className="flex-1 flex flex-col items-center justify-center px-8 sm:px-12 lg:px-16 py-8 relative z-10">
        <div className="w-full max-w-[1100px] flex-1 min-h-0 bg-linen rounded-2xl border border-border/60 shadow-sm overflow-hidden">
          <div className="w-full h-full overflow-y-auto">
            <iframe
              src="/tokens"
              className="border-0"
              style={{ width: 'calc(100% + 256px)', height: '100%', marginLeft: '-256px' }}
              title="Félix tokens"
            />
          </div>
        </div>
      </div>
      <SlideFooter num={11} total={TOTAL} />
    </div>
  )
}


/* ── Slide 12: Design Principles Bento ─────────────────────────── */
function SlideDesignPrinciples() {
  const [visible, setVisible] = useState<number[]>([])

  useEffect(() => {
    setVisible([])
    const timers = [0, 1, 2, 3, 4].map((i) =>
      setTimeout(() => setVisible((v) => [...v, i]), 300 + i * 300)
    )
    return () => timers.forEach(clearTimeout)
  }, [])

  const principles = [
    {
      number: '01',
      title: 'Conversational Transactions,\nNot Transactional Experiences',
      desc: 'Our voice should be warm, concise and always provide clarity.',
      bg: 'bg-turquoise',
      text: 'text-slate',
      span: 'col-span-3',
      illo: 'Speech%20Bubbles.svg',
      illoSize: 'lg',
      titleSize: 'text-[56px] sm:text-[72px] lg:text-[88px]',
      titlePt: 'pt-24 sm:pt-28',
    },
    {
      number: '02',
      title: 'Guide Beginners.\nAccelerate Regulars.',
      desc: 'Guide new users with simple explanation. As they grow familiar, get them there faster.',
      bg: 'bg-blueberry',
      text: 'text-slate',
      span: 'col-span-2',
      illo: 'Hand%20-%20Cell%20Phone%20OK.svg',
      illoPos: 'bottom',
      illoSize: 'lg',
    },
    {
      number: '03',
      title: 'Never Leave Users Guessing',
      desc: 'Acknowledge what just happened, show what comes next, and set time expectations.',
      bg: 'bg-mango',
      text: 'text-slate',
      span: 'col-span-1',
      illo: 'Map%20%2B%20F%20symbol.svg',
      titleSize: 'text-[48px] sm:text-[60px] lg:text-[72px]',
      illoPos: 'bottom',
    },
    {
      number: '04',
      title: 'Protection Without Friction',
      desc: 'Catch mistakes early through smart defaults and real-time validation.',
      bg: 'bg-lime',
      text: 'text-slate',
      span: 'col-span-1',
      illo: 'Lock.svg',
      titleSize: 'text-[48px] sm:text-[60px] lg:text-[72px]',
    },
    {
      number: '05',
      title: 'Grow With\nYour Journey',
      desc: 'Meet users where they are,\nthen gradually reveal new possibilities.',
      bg: 'bg-cactus',
      text: 'text-slate',
      span: 'col-span-2',
      titlePt: 'pt-12 sm:pt-14',
      illo: 'Rocket%20Launch%20-%20Growth%20%2B%20Coin%20-%20Turquoise.svg',
      illoPos: 'bottom',
      illoSize: 'lg',
    },
  ]

  return (
    <div className="relative h-full w-full bg-linen flex flex-col overflow-hidden">
      <div className="flex-1 flex flex-col px-4 sm:px-6 lg:px-8 pt-4 pb-12 relative z-10">
        <div className="w-full flex-1 min-h-0 grid grid-cols-3 gap-3 grid-rows-[1fr_1fr_1fr]">
          {principles.map((p, i) => (
            <div
              key={p.number}
              className={`${p.bg} ${p.text} ${p.span} rounded-2xl p-6 sm:p-8 flex flex-col justify-end relative overflow-hidden transition-all duration-700 ease-out ${visible.includes(i) ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'}`}
            >
              <span className={`absolute inset-0 flex items-start justify-start font-display font-black ${p.titleSize || 'text-[64px] sm:text-[80px] lg:text-[96px]'} leading-[0.9] text-left opacity-[0.2] select-none pointer-events-none px-6 sm:px-8 ${p.titlePt || 'pt-6 sm:pt-8'} whitespace-pre-line`} aria-hidden="true">
                {p.title}
              </span>
              <div className={`absolute ${p.illoPos === 'bottom' ? '-bottom-2 right-3 sm:right-4' : 'top-3 right-3 sm:top-4 sm:right-4'} ${p.illoSize === 'lg' ? 'w-32 h-32 sm:w-40 sm:h-40 lg:w-48 lg:h-48' : 'w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24'} pointer-events-none`} aria-hidden="true">
                <Illo src={p.illo} className="w-full h-full" />
              </div>
              <div className="relative z-10">
                <p className="text-base sm:text-lg lg:text-xl leading-relaxed opacity-90 font-medium whitespace-pre-line">{p.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <SlideFooter num={12} total={TOTAL} />
    </div>
  )
}

/* ── Slide 13: Cohesion Scales ───────────────────────────────────── */
function SlideCohesionScales() {
  return (
    <div className="relative h-full w-full bg-slate flex flex-col overflow-hidden">
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute top-[8%] left-[5%] w-[100px] lg:w-[140px] opacity-[0.1]" style={{ animation: 'ds-float 8s ease-in-out infinite' }}>
          <Illo src="3%20Paper%20Airplanes%20%2B%20Coins.svg" className="w-full h-full" />
        </div>
        <div className="absolute bottom-0 right-0 w-[180px] lg:w-[260px] opacity-[0.1] -rotate-6" style={{ animation: 'ds-drift 9s ease-in-out infinite 1s' }}>
          <Illo src="Rocket%20Launch%20-%20Growth%20%2B%20Coin%20-%20Turquoise.svg" className="w-full h-full" />
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center px-8 sm:px-12 lg:px-16 py-10 relative z-10">
        <div className="max-w-5xl text-center">
          <h1 className="font-display font-black text-linen text-5xl sm:text-6xl lg:text-7xl xl:text-8xl leading-[0.95] tracking-tight mb-6 lg:mb-8 whitespace-nowrap">
            Cohesion scales.<br />
            <span className="text-linen/40">Rigid consistency<br />does not.</span>
          </h1>
          <p className="text-xl sm:text-2xl lg:text-3xl text-linen/60 leading-relaxed">
            When the next product launches on the next surface, whether it&apos;s an owned app or an embedded experience inside a platform we don&apos;t control, it should inherit the DNA and bring its own innovations back.
          </p>
        </div>
      </div>
      <SlideFooter num={13} total={TOTAL} dark />
    </div>
  )
}

/* ── Slide 14: Where We Are Today ────────────────────────────────── */
function SlideWhereWeAre() {
  const foundations = [
    { title: 'Principles', desc: 'Shared language for critique and decision-making', illo: 'Speech%20Bubbles.svg', status: 'Live' },
    { title: 'Foundations', desc: 'Color, typography, spacing, and elevation tokens', illo: 'Stack%20of%20coins%20-%20Lime.svg', status: 'Live' },
    { title: 'Components', desc: 'Core UI building blocks available to teams', illo: 'Hand%20-%20Tool.svg', status: 'Live' },
    { title: 'AI-Ready', desc: 'Machine-readable .md files for on-brand AI development', illo: 'Bot.svg', status: 'Live' },
  ]

  return (
    <div className="relative h-full w-full bg-stone flex flex-col overflow-hidden">
      <div className="absolute bottom-[8%] right-[3%] w-[100px] lg:w-[130px] opacity-[0.1] pointer-events-none" style={{ animation: 'ds-float 8s ease-in-out infinite' }}>
        <Illo src="Check.svg" className="w-full h-full" />
      </div>

      <div className="flex-1 flex flex-col items-center justify-center px-8 sm:px-12 lg:px-16 py-8 relative z-10">
        <div className="w-full max-w-[1100px]">
          <div className="mb-5 lg:mb-6 text-center">
            <PillBadge>Where We Are Today</PillBadge>
          </div>
          <h1 className="font-display font-black text-foreground text-4xl sm:text-5xl lg:text-6xl xl:text-7xl leading-[0.95] tracking-tight mb-3 text-center">
            The Foundation<br />Is in Place
          </h1>
          <p className="text-lg sm:text-xl text-muted-foreground text-center mb-8 lg:mb-10 max-w-2xl mx-auto">
            We have the foundation. What follows is the infrastructure.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 lg:gap-6 mb-8 lg:mb-10">
            {foundations.map((f) => (
              <div key={f.title} className="bg-white rounded-2xl p-6 sm:p-8 border border-border shadow-sm relative overflow-hidden">
                <div className="absolute top-3 right-3">
                  <span className="inline-flex items-center rounded-full bg-turquoise/10 px-2.5 py-0.5 text-xs font-semibold text-turquoise-700">{f.status}</span>
                </div>
                <div className="w-12 h-12 sm:w-14 sm:h-14 mb-3">
                  <Illo src={f.illo} className="w-full h-full" />
                </div>
                <h3 className="font-display font-extrabold text-foreground text-lg sm:text-xl lg:text-2xl leading-snug mb-2">{f.title}</h3>
                <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-3 gap-4 lg:gap-6">
            {[
              { stat: '5', label: 'Design principles' },
              { stat: '40+', label: 'Tokens defined' },
              { stat: '15+', label: 'Core components' },
            ].map((m) => (
              <div key={m.label} className="bg-white/60 rounded-xl p-4 sm:p-5 border border-border/60 text-center">
                <span className="font-display font-black text-turquoise-700 text-3xl sm:text-4xl lg:text-5xl leading-none">{m.stat}</span>
                <p className="text-sm sm:text-base text-muted-foreground mt-1">{m.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      <SlideFooter num={14} total={TOTAL} />
    </div>
  )
}

/* ── Slide 15: Where We're Headed ────────────────────────────────── */
function SlideWhereHeaded() {
  const roadmap = [
    {
      phase: 'Soon',
      color: 'bg-turquoise',
      textColor: 'text-foreground',
      borderColor: 'border-turquoise/30',
      title: 'Robust Component Library',
      desc: 'Teams stop rebuilding common UI from scratch',
    },
    {
      phase: 'Next',
      color: 'bg-cactus',
      textColor: 'text-foreground',
      borderColor: 'border-cactus/30',
      title: 'UX Pattern Library & Templates',
      desc: 'Documented flows for forms, onboarding, navigation, error states — solved once, used everywhere',
    },
    {
      phase: 'Later',
      color: 'bg-mango',
      textColor: 'text-foreground',
      borderColor: 'border-mango/30',
      title: 'Content Guidelines & Tokens',
      desc: 'Consistent voice at scale, with tokenized strings for translation and localization across every surface',
    },
  ]

  return (
    <div className="relative h-full w-full bg-stone flex flex-col overflow-hidden">
      <div className="absolute top-[6%] right-[4%] w-[90px] lg:w-[120px] opacity-[0.12] pointer-events-none rotate-6" style={{ animation: 'ds-drift 8s ease-in-out infinite' }}>
        <Illo src="Hand%20-%20Stars.svg" className="w-full h-full" />
      </div>

      <div className="flex-1 flex flex-col items-center justify-center px-8 sm:px-12 lg:px-16 py-8 relative z-10">
        <div className="w-full max-w-[1100px]">
          <div className="mb-5 lg:mb-6 text-center">
            <PillBadge>Where We&apos;re Headed</PillBadge>
          </div>
          <h1 className="font-display font-black text-foreground text-4xl sm:text-5xl lg:text-6xl xl:text-7xl leading-[0.95] tracking-tight mb-3 text-center">
            From Foundation<br />to Infrastructure
          </h1>
          <p className="text-lg sm:text-xl text-muted-foreground text-center mb-8 lg:mb-10 max-w-2xl mx-auto">
            A roadmap framed around solving real pain points
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 lg:gap-6">
            {roadmap.map((phase) => (
              <div key={phase.phase} className={`bg-white rounded-2xl border ${phase.borderColor} shadow-sm overflow-hidden`}>
                <div className={`${phase.color} px-5 py-2.5`}>
                  <span className="font-display font-extrabold text-white text-sm sm:text-base uppercase tracking-wider">{phase.phase}</span>
                </div>
                <div className="p-5 sm:p-6 lg:p-8">
                  <h3 className={`font-display font-extrabold ${phase.textColor} text-lg sm:text-xl lg:text-2xl leading-snug mb-2`}>{phase.title}</h3>
                  <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">{phase.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 lg:mt-6 bg-white rounded-2xl border border-blueberry/30 shadow-sm overflow-hidden">
            <div className="bg-blueberry px-5 py-2.5">
              <span className="font-display font-extrabold text-white text-sm sm:text-base uppercase tracking-wider">Play and Exploration</span>
            </div>
            <div className="p-5 sm:p-6 lg:p-8 flex items-center gap-6">
              <div>
                <h3 className="font-display font-extrabold text-blueberry-700 text-lg sm:text-xl lg:text-2xl leading-snug mb-1">Imagery, Texture, Motion & Audio</h3>
                <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">Explore how illustration, animation, and sound can deepen the Félix brand experience across every surface and interaction.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <SlideFooter num={15} total={TOTAL} />
    </div>
  )
}

/* ── Slide 16: Content Design Is Product Design ──────────────────── */
function SlideDemo() {
  return (
    <div className="relative h-full w-full bg-stone flex flex-col overflow-hidden">
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute top-[5%] left-[3%] w-[80px] lg:w-[110px] opacity-[0.15] -rotate-6" style={{ animation: 'ds-float 8s ease-in-out infinite' }}>
          <Illo src="Speech%20Bubbles.svg" className="w-full h-full" />
        </div>
        <div className="absolute bottom-[8%] right-[4%] w-[90px] lg:w-[120px] opacity-[0.12] rotate-6" style={{ animation: 'ds-drift 9s ease-in-out infinite 1s' }}>
          <Illo src="Bot.svg" className="w-full h-full" />
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center px-8 sm:px-12 lg:px-16 py-10 relative z-10">
        <div className="max-w-4xl text-center">
          <div className="mb-5 lg:mb-6">
            <PillBadge>Content Design &amp; Tools</PillBadge>
          </div>

          <h1 className="font-display font-black text-foreground text-4xl sm:text-5xl lg:text-6xl xl:text-7xl leading-[0.95] tracking-tight mb-4 lg:mb-6">
            Content Design Is<br />Product Design
          </h1>

          <p className="text-lg sm:text-xl lg:text-2xl text-muted-foreground leading-relaxed max-w-2xl mx-auto mb-8 lg:mb-10">
            Words shape every interaction. We design with real content, in code, so what we prototype is what customers experience.
          </p>

          <div className="grid grid-cols-3 gap-4 lg:gap-6">
            <div className="bg-white rounded-2xl border border-border shadow-sm p-6 sm:p-8 text-left">
              <div className="w-12 h-12 mb-3">
                <Illo src="Speech%20Bubbles.svg" className="w-full h-full" />
              </div>
              <h3 className="font-display font-extrabold text-foreground text-lg sm:text-xl leading-snug mb-2">Words Are UI</h3>
              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">Every string shapes the experience. Editorial guidelines keep Félix warm, clear, and consistent across every market.</p>
            </div>
            <div className="bg-white rounded-2xl border border-border shadow-sm p-6 sm:p-8 text-left">
              <div className="w-12 h-12 mb-3">
                <Illo src="Survey.svg" className="w-full h-full" />
              </div>
              <h3 className="font-display font-extrabold text-foreground text-lg sm:text-xl leading-snug mb-2">Design With Real{'\u00A0'}Data</h3>
              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">Prototypes use real content tokens, real translations, and real market context. No lorem{'\u00A0'}ipsum.</p>
            </div>
            <div className="bg-white rounded-2xl border border-border shadow-sm p-6 sm:p-8 text-left">
              <div className="w-12 h-12 mb-3">
                <Illo src="Bot.svg" className="w-full h-full" />
              </div>
              <h3 className="font-display font-extrabold text-foreground text-lg sm:text-xl leading-snug mb-2">Tools That Think in Content</h3>
              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">Our design tools understand language, locale, and context natively. Working in code means we see what customers see.</p>
            </div>
          </div>
        </div>
      </div>
      <SlideFooter num={16} total={TOTAL} />
    </div>
  )
}

/* ── Slide 17: Fintech Flow Demo ──────────────────────────────────── */
function SlideFintechDemo() {
  const canvasOpen = useContext(CanvasContext)
  return (
    <div className="relative h-full w-full bg-stone flex flex-col overflow-hidden">
      <div className="flex-1 flex flex-col items-center justify-center relative z-10">
        <div className="w-full h-full overflow-hidden relative">
          <iframe
            src="/fintechtestflow/embed"
            className="border-0 transition-all duration-300"
            style={canvasOpen
              ? { width: '100%', height: 'calc(100% + 40px)', marginTop: '-20px', marginLeft: '0' }
              : { width: 'calc(100% + 600px)', height: 'calc(100% + 60px)', marginTop: '36px', marginLeft: '-160px' }
            }
            title="Fintech checkout flow with token viewer and translator"
          />
        </div>
      </div>
      <SlideFooter num={17} total={TOTAL} />
    </div>
  )
}

/* ── Slide 18: Close ─────────────────────────────────────────────── */
function SlideClose() {
  return (
    <div className="relative h-full w-full bg-slate flex flex-col overflow-hidden">
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute top-[6%] left-[4%] w-[100px] lg:w-[140px] opacity-[0.12]" style={{ animation: 'ds-float 8s ease-in-out infinite' }}>
          <Illo src="Gift%20Box%20%2B%20Coins.svg" className="w-full h-full" />
        </div>
        <div className="absolute top-[10%] right-[6%] w-[90px] lg:w-[120px] opacity-[0.1] rotate-12" style={{ animation: 'ds-drift 9s ease-in-out infinite 1.5s' }}>
          <Illo src="3%20Paper%20Airplanes%20%2B%20Coins.svg" className="w-full h-full" />
        </div>
        <div className="absolute bottom-[12%] right-[10%] w-[80px] lg:w-[100px] opacity-[0.1] -rotate-6" style={{ animation: 'ds-float 7s ease-in-out infinite 0.5s' }}>
          <Illo src="Heart%20-F%C3%A9lix.svg" className="w-full h-full" />
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center px-8 sm:px-12 lg:px-16 py-10 relative z-10">
        <div className="mb-8 lg:mb-10 w-[120px] h-[120px] sm:w-[150px] sm:h-[150px] lg:w-[200px] lg:h-[200px]">
          <Illo src="F%C3%A9lix%20Illo%201.svg" className="h-full w-full" label="Félix mascot" />
        </div>
        <h1 className="font-display font-black text-linen text-4xl sm:text-5xl lg:text-6xl xl:text-7xl leading-[0.95] tracking-tight text-center max-w-4xl">
          Every product, on every surface, should feel like coming home to Félix.
        </h1>
      </div>
      <SlideFooter num={18} total={TOTAL} dark />
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════════ */
/*                       MAIN PRESENTATION                            */
/* ═══════════════════════════════════════════════════════════════════ */

const slides = [
  SlideTitle,            // 1
  SlideWhatIsDS,         // 2
  SlideOneBrandProducts, // 3
  SlideOneBrandSurfaces, // 4
  SlideSharedDNA,        // 5
  SlideColors,           // 6
  SlideTypography,       // 7
  SlideIconography,      // 8
  SlideIllustrations,    // 9
  SlideComponents,       // 10
  SlideTokens,           // 11
  SlideDesignPrinciples, // 12
  SlideCohesionScales,   // 13
  SlideWhereWeAre,       // 14
  SlideWhereHeaded,      // 15
  SlideDemo,             // 16
  SlideFintechDemo,      // 17
  SlideClose,            // 18
]

const darkSlides = new Set([12, 17]) // 0-indexed: slide 13 & 18

export default function DesignSystemPresoPage() {
  const [current, setCurrent] = useState(0)
  const [mounted, setMounted] = useState(false)
  const [canvasOpen, setCanvasOpen] = useState(false)
  const total = slides.length
  const isDark = darkSlides.has(current)

  useEffect(() => {
    setMounted(true)
    const hash = window.location.hash
    if (hash) {
      const n = parseInt(hash.replace('#slide-', ''), 10)
      if (!isNaN(n) && n >= 0 && n < total) setCurrent(n)
    }
  }, [total])

  useEffect(() => {
    const handler = (e: MessageEvent) => {
      if (e.data?.type === 'canvas') setCanvasOpen(!!e.data.open)
    }
    window.addEventListener('message', handler)
    return () => window.removeEventListener('message', handler)
  }, [])

  useEffect(() => {
    if (mounted) window.history.replaceState(null, '', `#slide-${current}`)
  }, [current, mounted])

  const next = useCallback(() => setCurrent((p) => Math.min(p + 1, total - 1)), [total])
  const prev = useCallback(() => setCurrent((p) => Math.max(p - 1, 0)), [])

  useEffect(() => {
    if (!mounted) return
    const handler = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement | null
      if (t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA')) return
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown' || e.key === ' ') { e.preventDefault(); next() }
      else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') { e.preventDefault(); prev() }
      else if (e.key === 'Home') { e.preventDefault(); setCurrent(0) }
      else if (e.key === 'End') { e.preventDefault(); setCurrent(total - 1) }
    }
    window.addEventListener('keydown', handler, true)
    return () => window.removeEventListener('keydown', handler, true)
  }, [mounted, total, next, prev])

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

  return (
    <CanvasContext.Provider value={canvasOpen}>
    <div
      className="h-screen w-screen overflow-hidden relative select-none"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Progress bar */}
      <div className={`absolute top-0 inset-x-0 h-1 z-50 transition-all duration-300 ${isDark ? 'bg-white/10' : 'bg-concrete/30'} ${canvasOpen ? 'opacity-0 pointer-events-none' : ''}`}>
        <div
          className="h-full bg-turquoise-600 transition-all duration-500 ease-out"
          style={{ width: `${((current + 1) / total) * 100}%` }}
        />
      </div>

      {/* Slide counter */}
      <div className={`absolute top-4 left-4 sm:top-6 sm:left-6 z-50 transition-opacity duration-300 ${canvasOpen ? 'opacity-0 pointer-events-none' : ''}`}>
        <div className={`px-3 py-1.5 backdrop-blur-sm rounded-full border shadow-xs transition-colors duration-300 ${isDark ? 'bg-white/10 border-white/10' : 'bg-white/90 border-border'}`}>
          <span className={`text-xs sm:text-sm font-medium transition-colors duration-300 ${isDark ? 'text-white/60' : 'text-foreground'}`}>
            {current + 1} / {total}
          </span>
        </div>
      </div>

      {/* Nav hint */}
      <div className={`hidden md:block absolute top-4 right-4 sm:top-6 sm:right-6 z-50 transition-opacity duration-300 ${canvasOpen ? 'opacity-0 pointer-events-none' : ''}`}>
        <div className={`px-3 py-1.5 backdrop-blur-sm rounded-full border shadow-xs transition-colors duration-300 ${isDark ? 'bg-white/10 border-white/10' : 'bg-white/90 border-border'}`}>
          <span className={`text-xs transition-colors duration-300 ${isDark ? 'text-white/40' : 'text-muted-foreground'}`}>&larr; &rarr; to navigate</span>
        </div>
      </div>

      {/* Slide content */}
      <div className="h-full w-full" key={current}>
        <div className="h-full w-full animate-in fade-in duration-300">
          <Slide />
        </div>
      </div>

      {/* Dot indicators */}
      <div className={`absolute bottom-10 sm:bottom-12 left-1/2 -translate-x-1/2 z-50 flex gap-1.5 transition-opacity duration-300 ${canvasOpen ? 'opacity-0 pointer-events-none' : ''}`}>
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

      {/* Prev / Next buttons */}
      <button
        onClick={prev}
        disabled={current === 0}
        className={`hidden md:flex absolute left-4 sm:left-8 top-1/2 -translate-y-1/2 z-[100] p-3 rounded-full backdrop-blur-sm border transition-all ${isDark ? 'bg-white/10 border-white/10 hover:bg-white/20' : 'bg-white/90 border-border hover:bg-white hover:shadow-md'} ${
          current === 0 || canvasOpen ? 'opacity-0 pointer-events-none' : ''
        }`}
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
        className={`hidden md:flex absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 z-[100] p-3 rounded-full backdrop-blur-sm border transition-all ${isDark ? 'bg-white/10 border-white/10 hover:bg-white/20' : 'bg-white/90 border-border hover:bg-white hover:shadow-md'} ${
          current === total - 1 || canvasOpen ? 'opacity-0 pointer-events-none' : ''
        }`}
        aria-label="Next slide"
        type="button"
      >
        <svg className={`w-5 h-5 ${isDark ? 'text-white/60' : 'text-foreground'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* Mobile swipe hint */}
      <div className="md:hidden absolute bottom-20 left-1/2 -translate-x-1/2 z-40">
        <div className="px-3 py-1.5 bg-white/80 backdrop-blur-sm rounded-full border border-border">
          <span className="text-xs text-muted-foreground">Swipe to navigate</span>
        </div>
      </div>
    </div>
    </CanvasContext.Provider>
  )
}
