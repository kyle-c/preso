'use client'

import { createContext, useContext, useRef, useState } from 'react'
import { FelixLogo } from '@/components/design-system/felix-logo'
import { Button } from '@/components/ui/button'
import { ChevronDown, ArrowLeft, Wifi, Battery, Signal, CreditCard, Pin } from 'lucide-react'
import { type Language, countries, staticCountries, pinnableCountries } from '../fintechtestflow/content'
import { type TopupTokens, topupContent } from './content'

/* ─── i18n context ───────────────────────────────────────────────── */

const TCtx = createContext<TopupTokens>(topupContent['es-mx'])
const useT = () => useContext(TCtx)

/* ─── Data ───────────────────────────────────────────────────────── */

const phoneCountries = [
  { flag: '\u{1F1F2}\u{1F1FD}', name: 'México', dial: '+52' },
  { flag: '\u{1F1E8}\u{1F1F4}', name: 'Colombia', dial: '+57' },
  { flag: '\u{1F1F5}\u{1F1EA}', name: 'Perú', dial: '+51' },
  { flag: '\u{1F1EA}\u{1F1E8}', name: 'Ecuador', dial: '+593' },
  { flag: '\u{1F1E9}\u{1F1F4}', name: 'Rep. Dominicana', dial: '+1' },
  { flag: '\u{1F1E7}\u{1F1F7}', name: 'Brasil', dial: '+55' },
  { flag: '\u{1F1EC}\u{1F1F9}', name: 'Guatemala', dial: '+502' },
  { flag: '\u{1F1ED}\u{1F1F3}', name: 'Honduras', dial: '+504' },
  { flag: '\u{1F1F8}\u{1F1FB}', name: 'El Salvador', dial: '+503' },
  { flag: '\u{1F1F3}\u{1F1EE}', name: 'Nicaragua', dial: '+505' },
  { flag: '\u{1F1E8}\u{1F1F7}', name: 'Costa Rica', dial: '+506' },
  { flag: '\u{1F1F5}\u{1F1E6}', name: 'Panamá', dial: '+507' },
]

const amounts = [
  { mxn: 20, usd: 1.14 },
  { mxn: 30, usd: 1.71 },
  { mxn: 50, usd: 2.84 },
  { mxn: 80, usd: 4.55 },
  { mxn: 100, usd: 5.69, popular: true },
  { mxn: 150, usd: 8.53 },
  { mxn: 200, usd: 11.38 },
  { mxn: 300, usd: 17.07 },
]

const phone = '+52 55 3399 7393'
const carrier = 'Telcel'
const selectedAmount = amounts[4] // $100 MXN

const progressMap: Record<string, number> = {
  numero: 8,
  tipo: 25,
  monto: 50,
  pago: 75,
  listo: 100,
}

/* ─── Shared Components ──────────────────────────────────────────── */

function PhoneFrame({ children, progress, label }: { children: React.ReactNode; progress: number; label: string }) {
  return (
    <div className="flex flex-col items-center gap-5">
      <div className="relative mx-auto w-[390px] h-[844px] rounded-[52px] border-[12px] border-slate bg-slate shadow-2xl overflow-hidden">
        <div className="absolute top-3 left-1/2 -translate-x-1/2 z-50 w-[126px] h-[34px] bg-slate rounded-full" />
        <div className="absolute top-0 left-0 right-0 z-40 flex items-center justify-between px-8 pt-[14px] h-[54px] bg-linen">
          <span className="text-[15px] font-semibold text-slate">9:41</span>
          <div className="flex items-center gap-1.5">
            <Signal className="h-3.5 w-3.5 text-slate" />
            <Wifi className="h-3.5 w-3.5 text-slate" />
            <Battery className="h-3.5 w-3.5 text-slate" />
          </div>
        </div>
        <div className="absolute top-[54px] left-0 right-0 z-30 h-[3px] bg-slate/10">
          <div className="h-full bg-turquoise transition-[width] duration-300 ease-out" style={{ width: `${progress}%` }} />
        </div>
        <div className="h-full w-full overflow-y-auto bg-linen pt-[54px] pb-[34px]">
          {children}
        </div>
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-50 w-[134px] h-[5px] rounded-full bg-slate" />
      </div>
      <span className="text-[13px] font-semibold text-mocha uppercase tracking-wider">{label}</span>
    </div>
  )
}

function ScreenHeader() {
  const t = useT()
  return (
    <div className="flex flex-col items-center pt-5 pb-4">
      <FelixLogo className="h-8 text-slate" />
      <div className="mt-3.5 rounded-full bg-turquoise px-2.5 py-0.5">
        <span className="text-[10px] font-semibold text-slate">{t.badge}</span>
      </div>
    </div>
  )
}

const BadgePill = ({ label }: { label: string }) => (
  <span className="inline-block border border-mocha text-mocha text-[12px] font-semibold px-3 py-1 rounded-full">
    {label}
  </span>
)

/* ─── Screen 1: Numero ───────────────────────────────────────────── */

function NumeroView() {
  const t = useT()
  const [countryOpen, setCountryOpen] = useState(false)
  const [selectedCountry, setSelectedCountry] = useState(phoneCountries[0])
  const dropdownRef = useRef<HTMLDivElement>(null)

  return (
    <div className="flex flex-col px-5 pb-8">
      <ScreenHeader />

      <h1 className="font-display text-[26px] font-extrabold leading-tight tracking-tight text-slate mb-2">
        {t.numeroTitle}
      </h1>
      <p className="text-[14px] text-mocha mb-6 leading-snug">
        {t.numeroHelper}
      </p>

      <div className="rounded-2xl bg-white border border-border overflow-hidden mb-8" ref={dropdownRef}>
        <button
          onClick={() => setCountryOpen(!countryOpen)}
          className="w-full flex items-center h-14 px-4 border-b border-border"
        >
          <div className="flex items-center gap-2 flex-1">
            <span className="text-[15px]">{selectedCountry.flag}</span>
            <span className="text-[15px] text-slate font-medium">{selectedCountry.dial}</span>
            <span className="text-[13px] text-mocha">{selectedCountry.name}</span>
          </div>
          <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform ${countryOpen ? 'rotate-180' : ''}`} />
        </button>

        {countryOpen && (
          <div className="max-h-[240px] overflow-y-auto border-b border-border">
            {phoneCountries.map(c => (
              <button
                key={c.dial}
                onClick={() => { setSelectedCountry(c); setCountryOpen(false) }}
                className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors ${
                  c.dial === selectedCountry.dial
                    ? 'bg-turquoise/10'
                    : 'hover:bg-stone'
                }`}
              >
                <span className="text-[15px]">{c.flag}</span>
                <span className="text-[14px] text-slate font-medium flex-1">{c.name}</span>
                <span className="text-[13px] text-mocha">{c.dial}</span>
              </button>
            ))}
          </div>
        )}

        <div className="flex items-center h-14 px-4">
          <span className="text-[15px] text-slate/25">{t.phonePlaceholder}</span>
        </div>
      </div>

      <Button size="lg" className="w-full text-[15px]" disabled>
        {t.continueBtn}
      </Button>
    </div>
  )
}

/* ─── Carrier Card Variants ──────────────────────────────────────── */

function CarrierCardWhite({ showChange }: { showChange?: boolean }) {
  const t = useT()
  return (
    <div className="rounded-2xl bg-white border border-slate/15 px-4 py-3.5 mb-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-[15px] font-bold text-slate">{phone}</span>
          <span className="rounded-md bg-turquoise/20 px-1.5 py-0.5 text-[11px] font-semibold text-slate">{carrier}</span>
        </div>
        {showChange && (
          <span className="text-[13px] font-semibold text-mocha underline decoration-mocha underline-offset-4 cursor-pointer">{t.change}</span>
        )}
      </div>
    </div>
  )
}

/* ─── Screen 2: Tipo ─────────────────────────────────────────────── */

function TipoCard({
  selected,
  onClick,
  title,
  desc,
  badges,
  illustration,
  imgClassName,
}: {
  selected: boolean
  onClick: () => void
  title: string
  desc: string
  badges: string[]
  illustration: string
  imgClassName: string
}) {
  return (
    <button
      onClick={onClick}
      className={`relative w-full text-left rounded-2xl p-5 border transition-all overflow-hidden ${
        selected
          ? 'bg-white border-slate/60 shadow-lg'
          : 'bg-white border-slate/20 shadow-sm'
      }`}
    >
      <div className="flex items-center justify-between gap-2">
        <p className="font-bold text-[17px] text-slate">{title}</p>
        {selected && (
          <span className="flex-shrink-0 bg-turquoise text-slate text-[11px] font-semibold px-2.5 py-1 rounded-full">
            Selected
          </span>
        )}
      </div>
      <p className="text-[13px] text-mocha mt-1.5 leading-snug max-w-[75%]">{desc}</p>
      <div className="mt-3 flex gap-2 flex-wrap">
        {badges.map(b => (
          <BadgePill key={b} label={b} />
        ))}
      </div>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={illustration}
        alt=""
        aria-hidden
        className={`absolute bottom-3 right-3 w-auto pointer-events-none ${imgClassName}`}
      />
    </button>
  )
}

function TipoView() {
  const t = useT()
  const [selectedTipo, setSelectedTipo] = useState('balance')

  return (
    <div className="flex flex-col px-5 pb-8">
      <ScreenHeader />

      <CarrierCardWhite showChange />

      <h1 className="font-display text-[26px] font-extrabold leading-tight tracking-tight text-slate mb-2">
        {t.tipoTitle}
      </h1>
      <p className="text-[14px] text-mocha mb-6 leading-snug">
        {t.tipoHelper}
      </p>

      <div className="space-y-3 mb-6">
        <TipoCard
          selected={selectedTipo === 'balance'}
          onClick={() => setSelectedTipo('balance')}
          title={t.balanceName}
          desc={t.balanceDesc}
          badges={[t.balanceBadge1, t.balanceBadge2]}
          illustration="/illustrations/Cell%20Phone%20%2B%20Flying%20Dollar%20Bills%20-%20Turquoise.svg"
          imgClassName="h-[52px]"
        />
        <TipoCard
          selected={selectedTipo === 'data'}
          onClick={() => setSelectedTipo('data')}
          title={t.dataName}
          desc={t.dataDesc}
          badges={[t.dataBadge1, t.dataBadge2]}
          illustration="/illustrations/Cloud%20Coin%20-%20Turquoise.svg"
          imgClassName="h-[48px]"
        />
        <TipoCard
          selected={selectedTipo === 'package'}
          onClick={() => setSelectedTipo('package')}
          title={t.packageName}
          desc={t.packageDesc}
          badges={[t.packageBadge1, t.packageBadge2]}
          illustration="/illustrations/Gift%20Box%20%2B%20Coins.svg"
          imgClassName="h-[52px]"
        />
      </div>

      <Button size="lg" className="w-full text-[15px]">
        {t.continueBtn}
      </Button>
    </div>
  )
}

/* ─── Screen 3: Monto ────────────────────────────────────────────── */

function MontoView() {
  const t = useT()
  const [selected, setSelected] = useState(amounts[4]) // default $100
  const summary = t.montoSummary
    .replace('{usd}', `$${selected.usd.toFixed(2)}`)
    .replace('{mxn}', `$${selected.mxn}`)

  return (
    <div className="flex flex-col px-5 pb-8">
      <ScreenHeader />

      <CarrierCardWhite showChange />

      <h1 className="font-display text-[26px] font-extrabold leading-tight tracking-tight text-slate mb-2">
        {t.montoTitle}
      </h1>

      <div className="grid grid-cols-2 gap-3 mb-4">
        {amounts.map(a => (
          <button
            key={a.mxn}
            onClick={() => setSelected(a)}
            className={`relative rounded-2xl p-4 text-left border transition-all ${
              a.mxn === selected.mxn
                ? 'bg-white border-slate/60 shadow-lg'
                : 'bg-white border-slate/20 shadow-sm'
            }`}
          >
            {a.popular && (
              <span className="absolute -top-2.5 left-3 rounded-full bg-lime px-2.5 py-0.5 text-[10px] font-bold text-slate">
                {t.popular}
              </span>
            )}
            <p className="text-[20px] font-bold text-slate">
              ${a.mxn} <span className="text-[12px] font-medium text-mocha">MXN</span>
            </p>
            <p className="text-[12px] text-mocha mt-0.5">≈ ${a.usd.toFixed(2)} USD</p>
          </button>
        ))}
      </div>

      {/* Selection summary + no fees */}
      <p className="text-[14px] font-medium text-slate text-center mb-5">
        {summary} · <span className="text-[#22c55e]">{t.noFees}</span>
      </p>

      <Button size="lg" className="w-full text-[15px]">
        {t.continueToPay}
      </Button>
    </div>
  )
}

/* ─── Screen 4: Pago ─────────────────────────────────────────────── */

function PagoView() {
  const t = useT()
  return (
    <div className="flex flex-col px-5 pb-8">
      <ScreenHeader />

      <h1 className="font-display text-[24px] font-extrabold leading-tight tracking-tight text-slate mt-4 mb-6">
        {t.pagoTitle}
      </h1>

      <div className="bg-white rounded-2xl border border-slate/15 overflow-hidden divide-y divide-slate/10 mb-5">
        <div className="px-4 py-3.5 flex items-center justify-between">
          <span className="text-[13px] text-mocha">{t.numberLabel}</span>
          <div className="flex items-center gap-2">
            <span className="font-bold text-[16px] text-slate">{phone}</span>
            <span className="rounded-md bg-turquoise/20 px-1.5 py-0.5 text-[11px] font-semibold text-slate">{carrier}</span>
          </div>
        </div>
        <div className="px-4 py-3.5 flex items-center justify-between">
          <span className="text-[13px] text-mocha">{t.youReceive}</span>
          <span className="font-bold text-[16px] text-slate">${selectedAmount.mxn} MXN</span>
        </div>
        <div className="px-4 py-3.5 flex items-center justify-between">
          <span className="text-[13px] text-mocha">{t.paymentMethod}</span>
          <div className="flex items-center gap-2">
            <CreditCard className="h-4 w-4 text-slate/40" />
            <span className="font-semibold text-[14px] text-slate">**** 5164</span>
            <span className="text-[13px] font-semibold text-mocha underline decoration-mocha underline-offset-4">{t.change}</span>
          </div>
        </div>
        <div className="px-4 py-3.5 flex items-center justify-between">
          <span className="text-[13px] text-mocha">{t.totalFees}</span>
          <div className="flex items-center gap-1">
            <span className="font-semibold text-[14px] text-slate">USD ${selectedAmount.usd.toFixed(2)}</span>
            <ChevronDown className="h-4 w-4 text-slate/40" />
          </div>
        </div>
      </div>

      <div className="space-y-2.5 mb-4">
        <Button size="lg" className="w-full text-[15px]">
          {t.payBtn} ${selectedAmount.usd.toFixed(2)} USD
        </Button>
        <Button variant="outline" size="lg" className="w-full text-[15px]">
          {t.previous}
        </Button>
      </div>

      <p className="text-[11px] text-mocha leading-relaxed text-center">
        {t.legalText}{' '}
        <span className="underline decoration-mocha underline-offset-2">{t.legalLink}</span>
      </p>
    </div>
  )
}

/* ─── Screen 5: Listo ────────────────────────────────────────────── */

function ListoView() {
  const t = useT()
  const body = t.successBody
    .replace('{amount}', `$${selectedAmount.mxn}`)
    .replace('{phone}', phone)
    .replace('{carrier}', carrier)

  return (
    <div className="flex flex-col px-5 pb-8">
      <ScreenHeader />

      <div className="flex justify-center py-5">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/illustrations/cashAirplane.svg" alt="" className="w-36 h-28 object-contain" />
      </div>

      <div className="text-center mb-6">
        <h1 className="font-display text-[28px] font-extrabold leading-tight tracking-tight text-slate mb-3">
          {t.successTitle}
        </h1>
        <p className="text-[14px] text-slate/60 leading-relaxed">{body}</p>
      </div>

      <div className="bg-slate rounded-2xl p-5 mb-3 text-center">
        <p className="font-display text-[20px] font-extrabold text-white mb-1">{t.referralTitle}</p>
        <p className="text-[13px] text-white/60 mb-4 leading-snug">{t.referralBody}</p>
        <Button size="lg" className="w-full bg-[#22c55e] hover:bg-[#16a34a] text-white font-semibold text-[15px] border-0">
          {t.shareWhatsApp}
        </Button>
      </div>

      <Button variant="outline" size="lg" className="w-full text-[15px]">
        {t.anotherTopup}
      </Button>
    </div>
  )
}

/* ─── Language Switcher (matches fintechtestflow PhoneControls) ─── */

function LanguageSwitcher({
  current,
  onChange,
  pinnedCountry,
  onPinCountry,
}: {
  current: Language
  onChange: (l: Language) => void
  pinnedCountry: Language
  onPinCountry: (l: Language) => void
}) {
  const [popoverOpen, setPopoverOpen] = useState(false)
  const pinned = countries.find(c => c.code === pinnedCountry) ?? pinnableCountries[0]
  const chevronRef = useRef<HTMLButtonElement>(null)
  const [popoverPos, setPopoverPos] = useState<{ top: number; left: number } | null>(null)

  function openPopover() {
    if (chevronRef.current) {
      const rect = chevronRef.current.getBoundingClientRect()
      setPopoverPos({ top: rect.bottom + 4, left: rect.left })
    }
    setPopoverOpen(true)
  }

  return (
    <div className="relative flex items-center justify-center gap-1">
      {staticCountries.map(c => {
        const active = current === c.code
        return (
          <button
            key={c.code}
            onClick={() => onChange(c.code)}
            className={`px-3 py-1.5 rounded-full text-[13px] font-semibold transition-all ${
              active ? 'bg-slate text-linen' : 'text-slate/50 hover:text-slate'
            }`}
          >
            {c.flag} {c.shortLabel}
          </button>
        )
      })}

      <div>
        <div className={`flex items-center rounded-full transition-all ${
          current === pinned.code ? 'bg-slate text-linen' : 'text-slate/50 hover:text-slate'
        }`}>
          <button
            onClick={() => onChange(pinned.code)}
            className="pl-3 pr-1 py-1.5 text-[13px] font-semibold"
          >
            {pinned.flag} {pinned.shortLabel}
          </button>
          <button
            ref={chevronRef}
            onClick={() => popoverOpen ? setPopoverOpen(false) : openPopover()}
            className="pr-2 pl-0.5 py-1.5 text-[13px]"
          >
            <ChevronDown className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {popoverOpen && popoverPos && (
        <>
          <div className="fixed inset-0 z-[9998]" onClick={() => setPopoverOpen(false)} />
          <div
            className="fixed z-[9999] bg-white rounded-xl shadow-xl border border-slate/10 py-1 min-w-[180px]"
            style={{ top: popoverPos.top, left: popoverPos.left }}
          >
            {pinnableCountries.map(c => (
              <button
                key={c.code}
                onClick={() => {
                  onPinCountry(c.code)
                  onChange(c.code)
                  setPopoverOpen(false)
                }}
                className={`w-full flex items-center gap-2.5 px-3 py-2 text-[13px] text-left transition-colors ${
                  c.code === pinnedCountry ? 'bg-turquoise/10 font-semibold text-slate' : 'text-mocha hover:bg-stone'
                }`}
              >
                <span>{c.flag}</span>
                <span>{c.country}</span>
                {c.code === pinnedCountry && <Pin className="h-3 w-3 ml-auto text-turquoise" />}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

/* ─── Main ───────────────────────────────────────────────────────── */

export default function TopupsPage() {
  const [language, setLanguage] = useState<Language>('es-mx')
  const [pinnedCountry, setPinnedCountry] = useState<Language>('es-co')

  return (
    <TCtx.Provider value={topupContent[language]}>
      <div className="min-h-screen bg-stone overflow-y-auto">
        <div className="flex flex-col items-center pt-10 pb-8 gap-4">
          <div className="flex items-center gap-3">
            <FelixLogo className="h-10 text-slate" />
            <span className="text-[22px] font-medium text-slate/50">recargas</span>
          </div>
          <LanguageSwitcher
            current={language}
            onChange={setLanguage}
            pinnedCountry={pinnedCountry}
            onPinCountry={setPinnedCountry}
          />
          <p className="text-[14px] text-mocha">Mobile top-up flow — 5 screens</p>
        </div>

        <div className="flex flex-wrap justify-center gap-10 px-8 pb-16">
          <PhoneFrame progress={progressMap.numero} label="1 · Número">
            <NumeroView />
          </PhoneFrame>
          <PhoneFrame progress={progressMap.tipo} label="2 · Tipo">
            <TipoView />
          </PhoneFrame>
          <PhoneFrame progress={progressMap.monto} label="3 · Monto">
            <MontoView />
          </PhoneFrame>
          <PhoneFrame progress={progressMap.pago} label="4 · Pago">
            <PagoView />
          </PhoneFrame>
          <PhoneFrame progress={progressMap.listo} label="5 · Listo">
            <ListoView />
          </PhoneFrame>
        </div>
      </div>
    </TCtx.Provider>
  )
}
