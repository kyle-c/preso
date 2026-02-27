'use client'

import { createContext, useContext, useEffect, useRef, useState } from 'react'
import { FelixLogo } from '@/components/design-system/felix-logo'
import { Button } from '@/components/ui/button'
import { FloatingInput } from '@/components/ui/floating-input'
import { ChevronLeft, Wifi, Battery, Signal, Lock, CreditCard, ChevronDown, MapPin, Layers, X, Search, Shield, Zap, Check, Building2 } from 'lucide-react'
import { type Language, type ContentTokens, languages, content } from './content'

// ─── Language context ────────────────────────────────────────────────────────

const LangContext = createContext<ContentTokens>(content['en'])
const useT = () => useContext(LangContext)

// ─── Phone frame ─────────────────────────────────────────────────────────────

function PhoneFrame({ children, progress }: { children: React.ReactNode; progress?: number }) {
  return (
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
      {/* Thin progress stripe pinned just below the status bar */}
      {progress !== undefined && (
        <div className="absolute top-[54px] left-0 right-0 z-30 h-[3px] bg-slate/10">
          <div
            className="h-full bg-turquoise transition-[width] duration-300 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}
      <div className="h-full w-full overflow-y-auto bg-linen pt-[54px] pb-[34px]">
        {children}
      </div>
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-50 w-[134px] h-[5px] rounded-full bg-slate" />
    </div>
  )
}

// ─── Shared sub-components ───────────────────────────────────────────────────

function ScreenHeader() {
  const t = useT()
  return (
    <div className="flex flex-col items-center pt-4 pb-3">
      <FelixLogo className="h-8 text-slate" />
      <div className="mt-2.5 rounded-full bg-turquoise px-2.5 py-0.5">
        <span className="text-[10px] font-semibold text-slate">{t.common.badge}</span>
      </div>
    </div>
  )
}

function BackButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="flex h-9 w-9 items-center justify-center rounded-full border border-slate/15 text-slate hover:bg-white"
    >
      <ChevronLeft className="h-4 w-4" />
    </button>
  )
}

function ApplePayIcon({ className }: { className?: string }) {
  // Wordmark-only paths from the Apple Pay logo SVG (card border excluded).
  // viewBox crops tightly to the inner content region of the 333334×199007 coordinate space.
  return (
    <svg className={className ?? 'h-7 w-auto fill-current'} viewBox="80000 55000 230000 92000" xmlns="http://www.w3.org/2000/svg" aria-label="Apple Pay">
      <path d="M218507 135366v-6487c592 148 1926 148 2594 148 3706 0 5708-1556 6931-5559 0-74 705-2372 705-2409l-14085-39032h8673l9861 31730h147l9861-31730h8451l-14606 41033c-3334 9452-7189 12492-15270 12492-667 0-2670-74-3261-185zM113810 72753c2001-2503 3359-5863 3001-9297-2930 145-6503 1932-8572 4437-1859 2145-3504 5646-3074 8936 3288 285 6573-1644 8646-4076zm2963 4718c-4775-285-8835 2710-11115 2710-2282 0-5774-2567-9550-2498-4916 72-9478 2852-11972 7272-5131 8844-1354 21961 3635 29164 2423 3563 5343 7486 9191 7346 3635-143 5060-2354 9480-2354 4416 0 5700 2354 9547 2283 3991-71 6486-3565 8909-7132 2780-4062 3918-7984 3989-8198-71-72-7695-2996-7766-11767-72-7343 5986-10813 6271-11052-3421-5059-8765-5630-10619-5773zm41578-9938c10378 0 17606 7154 17606 17570 0 10452-7376 17644-17866 17644h-11491v18274h-8303V67533h20054zm-11751 28245h9526c7228 0 11343-3891 11343-10638 0-6746-4114-10600-11305-10600h-9563v21239zm31526 14160c0-6821 5226-11009 14494-11529l10674-630v-3002c0-4337-2929-6932-7820-6932-4635 0-7526 2224-8230 5708h-7561c445-7043 6449-12232 16087-12232 9451 0 15493 5004 15493 12825v26874h-7673v-6413h-185c-2260 4337-7191 7080-12306 7080-7636 0-12974-4745-12974-11750zm25168-3522v-3076l-9600 593c-4782 333-7487 2446-7487 5782 0 3410 2817 5634 7117 5634 5596 0 9970-3855 9970-8933z" />
    </svg>
  )
}

const BadgePill = ({ label }: { label: string }) => (
  <span className="inline-block border border-mocha text-mocha text-[12px] font-semibold px-3 py-1 rounded-full">
    {label}
  </span>
)

// ─── Stores data ─────────────────────────────────────────────────────────────

const stores = [
  { id: 'walgreens',   name: 'Walgreens',             fee: '$3.95', logo: '/stores/walgreens.png', logoPad: 'p-1.5' },
  { id: 'cvs',         name: 'CVS Pharmacy',           fee: '$3.95', logo: '/stores/cvs.png',       logoPad: 'p-1.5' },
  { id: '7eleven',     name: '7-Eleven',               fee: '$3.95', logo: '/stores/seven.png',     logoPad: 'p-0.5' },
  { id: 'walmart',     name: 'Walmart',                fee: '$3.74', logo: '/stores/walmart.png',   logoPad: 'p-1.5' },
  { id: 'caseys',      name: "Casey's",                fee: '$3.95', logo: '/stores/caseys.png',    logoPad: 'p-1.5' },
  { id: 'officedepot', name: 'Office Depot OfficeMax', fee: '$3.95', logo: '/stores/odepot.png',    logoPad: 'p-0.5' },
]

// ─── Screens ─────────────────────────────────────────────────────────────────

function PayMethodCard({
  id,
  selected,
  onClick,
  title,
  desc,
  badges,
  illustration,
  imgClassName,
  selectedLabel,
}: {
  id: string
  selected: boolean
  onClick: () => void
  title: string
  desc: string
  badges: string[]
  illustration: string
  imgClassName: string
  selectedLabel: string
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
            {selectedLabel}
          </span>
        )}
      </div>
      <p className="text-[13px] text-mocha mt-1.5 leading-snug max-w-[72%]">{desc}</p>
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

function PaymentMethodScreen({ onNext }: { onNext: (method: string) => void }) {
  const t = useT()
  const [selected, setSelected] = useState<string | null>('card')

  return (
    <div className="flex flex-col px-5 pb-8">
      <ScreenHeader />

      <h1 className="font-display text-[26px] font-extrabold leading-tight tracking-tight text-slate mb-2">
        {t.paymentMethod.titleLine2}
      </h1>
      <div className="flex items-center gap-3 mb-3">
        <div className="flex-1 h-px bg-slate/15" />
        <span className="text-[12px] font-semibold text-mocha uppercase tracking-wider">{t.paymentMethod.subtitle}</span>
        <div className="flex-1 h-px bg-slate/15" />
      </div>

      {/* Apple Pay button */}
      <button
        onClick={() => onNext('apple')}
        className="w-full flex items-center justify-center bg-slate rounded-2xl py-3 hover:bg-slate/90 active:scale-[0.98] transition-all"
      >
        <ApplePayIcon className="h-7 w-auto fill-linen" />
      </button>

      <div className="flex items-center gap-3 my-4">
        <div className="flex-1 h-px bg-slate/15" />
        <span className="text-[12px] font-semibold text-mocha uppercase tracking-wider">{t.paymentMethod.orPayAnotherWay}</span>
        <div className="flex-1 h-px bg-slate/15" />
      </div>

      <div className="space-y-3">
        <PayMethodCard
          id="card"
          selected={selected === 'card'}
          onClick={() => setSelected('card')}
          title={t.paymentMethod.creditDebitName}
          desc={t.paymentMethod.creditDebitDesc}
          badges={[t.paymentMethod.badgeNoFeeDebit, t.paymentMethod.badgeInstant]}
          illustration="/illustrations/card.svg"
          imgClassName="h-[54px]"
          selectedLabel={t.common.selected}
        />
        <PayMethodCard
          id="bank"
          selected={selected === 'bank'}
          onClick={() => setSelected('bank')}
          title={t.paymentMethod.bankName}
          desc={t.paymentMethod.bankDesc}
          badges={[t.paymentMethod.badgeNoFee, t.paymentMethod.badgeBusinessDays]}
          illustration="/illustrations/Bank.svg"
          imgClassName="h-[58px]"
          selectedLabel={t.common.selected}
        />
        <PayMethodCard
          id="cash"
          selected={selected === 'cash'}
          onClick={() => setSelected('cash')}
          title={t.paymentMethod.cashName}
          desc={t.paymentMethod.cashDesc}
          badges={[t.paymentMethod.badgeCashFee, t.paymentMethod.badgeSameDay]}
          illustration="/illustrations/cash.svg"
          imgClassName="h-[50px]"
          selectedLabel={t.common.selected}
        />
      </div>

      <div className="mt-5 space-y-2.5">
        <Button size="lg" className="w-full text-[15px]" onClick={() => onNext(selected!)} disabled={!selected}>
          {t.common.continue}
        </Button>
        <Button variant="outline" size="lg" className="w-full text-[15px]">{t.common.cancel}</Button>
      </div>
    </div>
  )
}

function AddressScreen({ onNext, onBack, paymentMethod }: { onNext: () => void; onBack: () => void; paymentMethod: string }) {
  const t = useT()
  const [address, setAddress] = useState('')
  const [zip, setZip] = useState('')
  const [city, setCity] = useState('')
  const [state, setState] = useState('')
  const [touched, setTouched] = useState<Record<string, boolean>>({})
  const isCash = paymentMethod === 'cash'
  const isBank = paymentMethod === 'bank'

  function validate(field: string, value: string): string | undefined {
    if (field === 'address') return !value ? 'Address is required' : undefined
    if (field === 'zip') return !value ? 'ZIP code is required' : !/^\d{5}$/.test(value) ? 'Enter a valid 5-digit ZIP' : undefined
    if (field === 'city') return !value ? 'City is required' : undefined
    if (field === 'state') return !value ? 'State is required' : undefined
  }

  const err = (f: string, v: string) => touched[f] ? validate(f, v) : undefined
  const valid = (f: string, v: string) => !!(touched[f] && !validate(f, v) && v)
  const touch = (f: string) => setTouched(p => ({ ...p, [f]: true }))

  const canContinue = !validate('address', address) && !validate('zip', zip) && !validate('city', city) && !validate('state', state)

  const fieldClass = '!rounded-2xl bg-white'
  const labelClass = 'bg-white text-mocha'

  return (
    <div className="flex flex-col h-full">
      <ScreenHeader />

      <div className="px-6 pt-3 pb-1">
        <BackButton onClick={onBack} />
        <div className="w-9 flex-shrink-0" />
      </div>

      <div className="flex-1 px-6 pb-6 overflow-y-auto">
        <h1 className="font-display text-[22px] font-extrabold leading-tight tracking-tight text-slate mb-2">
          {isCash ? t.address.titleCash : isBank ? t.address.titleBank : t.address.titleBilling}
        </h1>
        {isCash && (
          <p className="text-[14px] text-mocha mb-5 leading-snug">{t.address.helperCash}</p>
        )}
        {!isCash && <div className="mb-6" />}

        <div className="space-y-4">
          <FloatingInput
            label={t.address.fieldAddress} className={fieldClass} labelClassName={labelClass}
            value={address} onChange={e => setAddress(e.target.value)} onBlur={() => touch('address')}
            error={err('address', address)} isValid={valid('address', address)}
          />
          <FloatingInput label={t.address.fieldApt} className={fieldClass} labelClassName={labelClass} />
          <FloatingInput
            label={t.address.fieldZip} className={fieldClass} labelClassName={labelClass}
            value={zip} onChange={e => setZip(e.target.value.replace(/\D/g, '').slice(0, 5))} onBlur={() => touch('zip')}
            error={err('zip', zip)} isValid={valid('zip', zip)}
            inputMode="numeric"
          />
          <FloatingInput
            label={t.address.fieldCity} className={fieldClass} labelClassName={labelClass}
            value={city} onChange={e => setCity(e.target.value)} onBlur={() => touch('city')}
            error={err('city', city)} isValid={valid('city', city)}
          />
          <div className="relative">
            <select
              value={state}
              onChange={e => { setState(e.target.value); touch('state') }}
              onBlur={() => touch('state')}
              className={`h-14 w-full rounded-2xl bg-white border px-4 pr-10 text-base appearance-none transition-colors outline-none cursor-pointer focus:ring-[3px] ${
                touched.state && !state
                  ? 'border-red-400 ring-[3px] ring-red-400/20 text-slate'
                  : state
                    ? 'border-turquoise/60 focus:border-turquoise focus:ring-turquoise/25 text-slate'
                    : 'border-border focus:border-turquoise focus:ring-turquoise/25 text-muted-foreground'
              }`}
            >
              <option value="" disabled>{t.address.fieldState}</option>
              <option value="AL">Alabama</option>
              <option value="AK">Alaska</option>
              <option value="AZ">Arizona</option>
              <option value="AR">Arkansas</option>
              <option value="CA">California</option>
              <option value="CO">Colorado</option>
              <option value="CT">Connecticut</option>
              <option value="DE">Delaware</option>
              <option value="FL">Florida</option>
              <option value="GA">Georgia</option>
              <option value="HI">Hawaii</option>
              <option value="ID">Idaho</option>
              <option value="IL">Illinois</option>
              <option value="IN">Indiana</option>
              <option value="IA">Iowa</option>
              <option value="KS">Kansas</option>
              <option value="KY">Kentucky</option>
              <option value="LA">Louisiana</option>
              <option value="ME">Maine</option>
              <option value="MD">Maryland</option>
              <option value="MA">Massachusetts</option>
              <option value="MI">Michigan</option>
              <option value="MN">Minnesota</option>
              <option value="MS">Mississippi</option>
              <option value="MO">Missouri</option>
              <option value="MT">Montana</option>
              <option value="NE">Nebraska</option>
              <option value="NV">Nevada</option>
              <option value="NH">New Hampshire</option>
              <option value="NJ">New Jersey</option>
              <option value="NM">New Mexico</option>
              <option value="NY">New York</option>
              <option value="NC">North Carolina</option>
              <option value="ND">North Dakota</option>
              <option value="OH">Ohio</option>
              <option value="OK">Oklahoma</option>
              <option value="OR">Oregon</option>
              <option value="PA">Pennsylvania</option>
              <option value="RI">Rhode Island</option>
              <option value="SC">South Carolina</option>
              <option value="SD">South Dakota</option>
              <option value="TN">Tennessee</option>
              <option value="TX">Texas</option>
              <option value="UT">Utah</option>
              <option value="VT">Vermont</option>
              <option value="VA">Virginia</option>
              <option value="WA">Washington</option>
              <option value="WV">West Virginia</option>
              <option value="WI">Wisconsin</option>
              <option value="WY">Wyoming</option>
            </select>
            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
          </div>
        </div>

        <div className="pt-8 space-y-2.5">
          <Button size="lg" className="w-full text-[15px]" onClick={onNext} disabled={!canContinue}>
            {t.common.continue}
          </Button>
          <Button variant="outline" size="lg" className="w-full text-[15px]">{t.common.cancel}</Button>
        </div>
      </div>
    </div>
  )
}

function CardDetailsScreen({ onNext, onBack }: { onNext: () => void; onBack: () => void }) {
  const t = useT()
  const [name, setName] = useState('')
  const [cardNumber, setCardNumber] = useState('')
  const [expiry, setExpiry] = useState('')
  const [cvv, setCvv] = useState('')
  const [touched, setTouched] = useState<Record<string, boolean>>({})

  function validate(field: string, value: string): string | undefined {
    if (field === 'name') return !value ? 'Name is required' : undefined
    if (field === 'cardNumber') return !value ? 'Card number is required' : value.replace(/\s/g, '').length < 16 ? 'Enter a 16-digit card number' : undefined
    if (field === 'expiry') {
      if (!value) return 'Expiry date is required'
      if (!/^\d{2}\/\d{2}$/.test(value)) return 'Use MM/YY format'
      const month = parseInt(value.slice(0, 2))
      if (month < 1 || month > 12) return 'Invalid month'
      return undefined
    }
    if (field === 'cvv') return !value ? 'CVV is required' : !/^\d{3,4}$/.test(value) ? 'Enter 3 or 4 digits' : undefined
  }

  const err = (f: string, v: string) => touched[f] ? validate(f, v) : undefined
  const valid = (f: string, v: string) => !!(touched[f] && !validate(f, v) && v)
  const touch = (f: string) => setTouched(p => ({ ...p, [f]: true }))

  const canContinue = !validate('name', name) && !validate('cardNumber', cardNumber) && !validate('expiry', expiry) && !validate('cvv', cvv)

  function formatCard(v: string) {
    return v.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim()
  }
  function formatExpiry(v: string) {
    const d = v.replace(/\D/g, '').slice(0, 4)
    return d.length >= 3 ? d.slice(0, 2) + '/' + d.slice(2) : d
  }

  const fieldClass = '!rounded-2xl bg-white'
  const labelClass = 'bg-white text-mocha'

  return (
    <div className="flex flex-col h-full">
      <ScreenHeader />

      <div className="px-6 pt-3 pb-1">
        <BackButton onClick={onBack} />
        <div className="w-9 flex-shrink-0" />
      </div>

      <div className="flex-1 px-6 pb-6 overflow-y-auto">
        <h1 className="font-display text-[22px] font-extrabold leading-tight tracking-tight text-slate mb-6">
          {t.cardDetails.title}
        </h1>

        <div className="space-y-4">
          <div>
            <FloatingInput
              label={t.cardDetails.fieldFullName} className={fieldClass} labelClassName={labelClass}
              value={name} onChange={e => setName(e.target.value)} onBlur={() => touch('name')}
              error={err('name', name)} isValid={valid('name', name)}
              autoComplete="cc-name"
            />
            {!err('name', name) && <p className="text-[12px] text-mocha mt-1.5 px-1 leading-snug">{t.cardDetails.helperName}</p>}
          </div>
          <FloatingInput
            label={t.cardDetails.fieldCardNumber} className={fieldClass} labelClassName={labelClass}
            value={cardNumber}
            onChange={e => setCardNumber(formatCard(e.target.value))}
            onBlur={() => touch('cardNumber')}
            error={err('cardNumber', cardNumber)} isValid={valid('cardNumber', cardNumber)}
            inputMode="numeric" autoComplete="cc-number"
          />
          <FloatingInput
            label={t.cardDetails.fieldExpiry} className={fieldClass} labelClassName={labelClass}
            value={expiry}
            onChange={e => setExpiry(formatExpiry(e.target.value))}
            onBlur={() => touch('expiry')}
            error={err('expiry', expiry)} isValid={valid('expiry', expiry)}
            inputMode="numeric" autoComplete="cc-exp" maxLength={5}
          />
          <FloatingInput
            label={t.cardDetails.fieldCvv} className={fieldClass} labelClassName={labelClass}
            value={cvv}
            onChange={e => setCvv(e.target.value.replace(/\D/g, '').slice(0, 4))}
            onBlur={() => touch('cvv')}
            error={err('cvv', cvv)} isValid={valid('cvv', cvv)}
            inputMode="numeric" autoComplete="cc-csc" maxLength={4}
          />
        </div>

        <div className="pt-8 space-y-3">
          <Button size="lg" className="w-full text-[15px]" onClick={onNext} disabled={!canContinue}>
            {t.common.continue}
          </Button>
          <p className="text-[11px] text-mocha text-center leading-relaxed px-2">
            {t.cardDetails.termsPre}{' '}
            <span className="underline underline-offset-2">{t.cardDetails.termsLink}</span>
            {' '}{t.cardDetails.termsAnd}{' '}
            <span className="underline underline-offset-2">{t.cardDetails.privacyLink}</span>.
          </p>
          <div className="mt-4 rounded-2xl bg-blueberry/10 px-4 py-3.5 flex gap-3 items-start">
            <Lock className="h-4 w-4 text-blueberry mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-[13px] font-semibold text-blueberry">{t.cardDetails.securityTitle}</p>
              <p className="text-[13px] text-blueberry/70 mt-0.5">{t.cardDetails.securityBody}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function StoreSelectionScreen({ onBack, onNext }: { onBack: () => void; onNext: (storeId: string) => void }) {
  const t = useT()
  const [selected, setSelected] = useState<string | null>(null)

  return (
    <div className="flex flex-col h-full">
      <ScreenHeader />

      <div className="px-6 pt-3 pb-1">
        <BackButton onClick={onBack} />
        <div className="w-9 flex-shrink-0" />
      </div>

      <div className="flex-1 px-5 pb-4 overflow-y-auto">
        <h1 className="font-display text-[24px] font-extrabold leading-tight tracking-tight text-slate mt-2 mb-5">
          {t.storeSelection.title}
        </h1>

        <div className="space-y-2.5">
          {stores.map((store) => (
            <button
              key={store.id}
              onClick={() => setSelected(store.id)}
              className={`relative w-full text-left rounded-2xl px-4 py-3.5 border transition-all flex items-center gap-3 ${
                selected === store.id
                  ? 'bg-white border-slate/60 shadow-lg'
                  : 'bg-white border-slate/20 shadow-sm'
              }`}
            >
              <div className={`h-11 w-11 rounded-xl border border-slate/10 bg-white flex items-center justify-center flex-shrink-0 overflow-hidden ${store.logoPad}`}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={store.logo} alt={store.name} className="w-full h-full object-contain" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-[15px] text-slate leading-tight">{store.name}</p>
                <p className="text-[12px] text-mocha mt-0.5">{t.storeSelection.minMax}</p>
              </div>
              <span className="flex-shrink-0 inline-block border border-mocha text-mocha text-[12px] font-semibold px-3 py-1 rounded-full">
                {store.fee}
              </span>
            </button>
          ))}
        </div>

        <div className="mt-5 space-y-2.5">
          <Button size="lg" className="w-full text-[15px]" onClick={() => onNext(selected!)} disabled={!selected}>
            {t.common.continue}
          </Button>
          <Button variant="outline" size="lg" className="w-full text-[15px]">{t.common.cancel}</Button>
        </div>

        <p className="mt-5 text-[10px] text-mocha leading-relaxed text-center">
          {t.storeSelection.greenDot}
        </p>
      </div>
    </div>
  )
}

function ReviewScreen({ onNext, onBack, onChangeContextual, onChangePaymentMethod, paymentMethod, selectedStore, defaultShowSheet = false }: {
  onNext: () => void
  onBack: () => void
  onChangeContextual: () => void
  onChangePaymentMethod: () => void
  paymentMethod: string
  selectedStore: string
  defaultShowSheet?: boolean
}) {
  const t = useT()
  const [feesExpanded, setFeesExpanded] = useState(false)
  const [showSheet, setShowSheet] = useState(defaultShowSheet)

  const store = stores.find(s => s.id === selectedStore)
  const storeFee = paymentMethod === 'cash' ? parseFloat(store?.fee.replace('$', '') ?? '0') : 0
  const felixFee = 0
  const otherFees = 0
  const taxes = 0
  const total = 10 + storeFee + felixFee + otherFees + taxes
  const storeFeeLabel = t.review.storeFee.replace('{store}', store?.name ?? '')

  return (
    <div className="relative flex flex-col h-full">
      <ScreenHeader />

      <div className="px-6 pt-3 pb-1">
        <BackButton onClick={onBack} />
        <div className="w-9 flex-shrink-0" />
      </div>

      <div className="flex-1 px-5 pb-4 overflow-y-auto">
        <h1 className="font-display text-[24px] font-extrabold leading-tight tracking-tight text-slate mt-4 mb-6">
          {t.review.title}
        </h1>

        <div className="bg-white rounded-2xl border border-slate/15 overflow-hidden divide-y divide-slate/10 mb-5">
          <div className="px-4 py-3.5 flex items-center justify-between">
            <span className="text-[13px] text-mocha">{t.review.youSend}</span>
            <span className="font-bold text-[16px] text-slate">🇺🇸 USD $10.00</span>
          </div>
          <div className="px-4 py-3.5 flex items-center justify-between">
            <span className="text-[13px] text-mocha">{t.review.recipientGets}</span>
            <span className="font-bold text-[16px] text-slate">🇲🇽 MXN $174.20</span>
          </div>
          <div className="px-4 py-3.5 flex items-center justify-between">
            <span className="text-[13px] text-mocha">{t.review.paymentMethodLabel}</span>
            <div className="flex items-center gap-2">
              {paymentMethod === 'cash' ? <MapPin className="h-4 w-4 text-slate/40" /> : paymentMethod === 'bank' ? <Building2 className="h-4 w-4 text-slate/40" /> : <CreditCard className="h-4 w-4 text-slate/40" />}
              <span className="font-semibold text-[14px] text-slate">
                {paymentMethod === 'cash' ? (store?.name ?? t.paymentMethod.cashName) : paymentMethod === 'bank' ? 'Premier ····0010' : '**** 5164'}
              </span>
              <button onClick={() => setShowSheet(true)} className="text-[13px] font-semibold text-mocha underline decoration-mocha underline-offset-4 hover:text-slate hover:decoration-slate ml-1">
                {t.common.change}
              </button>
            </div>
          </div>
          <button onClick={() => setFeesExpanded(v => !v)} className="w-full px-4 py-3.5 flex items-center justify-between text-left">
            <span className="text-[13px] text-mocha">{t.review.amountFees}</span>
            <div className="flex items-center gap-1">
              <span className="font-semibold text-[14px] text-slate">USD ${total.toFixed(2)}</span>
              <ChevronDown className={`h-4 w-4 text-slate/40 transition-transform duration-200 ${feesExpanded ? 'rotate-180' : ''}`} />
            </div>
          </button>

          <div className={`grid transition-all duration-300 ease-in-out ${feesExpanded ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}>
            <div className="overflow-hidden">
              <div className="bg-stone/40 divide-y divide-slate/10">
                <div className="px-4 py-2.5 flex items-center justify-between">
                  <span className="text-[12px] text-mocha">{t.review.exchangeRate}</span>
                  <span className="text-[12px] text-slate font-medium">1 USD = 17.42 MXN</span>
                </div>
                <div className="px-4 py-2.5 flex items-center justify-between">
                  <span className="text-[12px] text-mocha">{t.review.amountToSend}</span>
                  <span className="text-[12px] text-slate font-medium">USD 10.00</span>
                </div>
                <div className="px-4 py-2.5 flex items-center justify-between">
                  <span className="text-[12px] text-mocha">{t.review.felixFee}</span>
                  <span className="text-[12px] text-slate font-medium">+ USD {felixFee.toFixed(2)}</span>
                </div>
                {paymentMethod === 'cash' && (
                  <div className="px-4 py-2.5 flex items-center justify-between">
                    <span className="text-[12px] text-mocha">{storeFeeLabel}</span>
                    <span className="text-[12px] text-slate font-medium">+ USD {storeFee.toFixed(2)}</span>
                  </div>
                )}
                <div className="px-4 py-2.5 flex items-center justify-between">
                  <span className="text-[12px] text-mocha">{t.review.otherFees}</span>
                  <span className="text-[12px] text-slate font-medium">+ USD {otherFees.toFixed(2)}</span>
                </div>
                <div className="px-4 py-2.5 flex items-center justify-between">
                  <span className="text-[12px] text-mocha">{t.review.taxes}</span>
                  <span className="text-[12px] text-slate font-medium">+ USD {taxes.toFixed(2)}</span>
                </div>
                <div className="px-4 py-3 flex items-center justify-between border-t border-slate/15">
                  <span className="text-[13px] font-bold text-slate">{t.review.total}</span>
                  <span className="text-[13px] font-bold text-slate">USD {total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <Button size="lg" className="w-full text-[15px] mb-4" onClick={onNext}>
          {t.review.sendNow}
        </Button>

        <p className="text-[11px] text-mocha leading-relaxed text-center">
          {t.review.legal}{' '}
          <span className="underline decoration-mocha underline-offset-2 hover:text-slate hover:decoration-slate cursor-pointer">
            {t.review.learnMore}
          </span>
        </p>
      </div>

      {/* Action sheet overlay */}
      {showSheet && (
        <div className="absolute inset-0 z-50 flex flex-col justify-end">
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/40" onClick={() => setShowSheet(false)} />
          {/* Sheet */}
          <div className="relative bg-white rounded-t-2xl">
            {/* Drag handle */}
            <div className="flex justify-center pt-3 pb-1">
              <div className="w-9 h-1 rounded-full bg-slate/20" />
            </div>
            <div className="px-5 pb-2">
              <h3 className="text-[17px] font-bold text-slate">{t.review.changeSheetTitle}</h3>
            </div>
            <div className="px-5">
              <button
                onClick={() => { setShowSheet(false); onChangeContextual() }}
                className="w-full flex items-center gap-3 py-3.5 text-left"
              >
                {paymentMethod === 'cash' ? <MapPin className="h-5 w-5 text-slate/50" /> : paymentMethod === 'bank' ? <Building2 className="h-5 w-5 text-slate/50" /> : <CreditCard className="h-5 w-5 text-slate/50" />}
                <span className="text-[15px] text-slate">
                  {paymentMethod === 'cash' ? t.review.changeStore : paymentMethod === 'bank' ? t.review.changeBank : t.review.changeCard}
                </span>
              </button>
              <div className="h-px bg-slate/10" />
              <button
                onClick={() => { setShowSheet(false); onChangePaymentMethod() }}
                className="w-full flex items-center gap-3 py-3.5 text-left"
              >
                <Layers className="h-5 w-5 text-slate/50" />
                <span className="text-[15px] text-slate">{t.review.changeMethod}</span>
              </button>
            </div>
            <div className="px-5 pt-2 pb-6">
              <button
                onClick={() => setShowSheet(false)}
                className="w-full py-3 rounded-xl bg-stone text-[15px] font-semibold text-mocha"
              >
                {t.common.cancel}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function PaperPlane() {
  return (
    <svg viewBox="0 0 140 110" className="w-36 h-28" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M10 58 L130 10 L85 100 Z" fill="white" stroke="#1a2332" strokeWidth="2.5" strokeLinejoin="round" />
      <path d="M10 58 L78 70" stroke="#1a2332" strokeWidth="1.5" />
      <path d="M78 70 L85 100" stroke="#1a2332" strokeWidth="1.5" />
      <rect x="66" y="22" width="30" height="19" rx="3" fill="#4ade80" transform="rotate(-32 81 31)" />
      <rect x="70" y="19" width="30" height="19" rx="3" fill="#22c55e" transform="rotate(-26 85 28)" />
      <rect x="74" y="16" width="30" height="19" rx="3" fill="#16a34a" transform="rotate(-20 89 25)" />
    </svg>
  )
}

function SuccessScreen() {
  const t = useT()
  return (
    <div className="flex flex-col h-full px-5 pb-8">
      <ScreenHeader />

      <div className="flex justify-center py-5">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/illustrations/cashAirplane.svg" alt="" className="w-36 h-28 object-contain" />
      </div>

      <div className="text-center mb-6">
        <h1 className="font-display text-[28px] font-extrabold leading-tight tracking-tight text-slate mb-3">
          {t.success.title}
        </h1>
        <p className="text-[14px] text-slate/60 leading-relaxed">{t.success.body}</p>
      </div>

      <div className="bg-slate rounded-2xl p-5 mb-3 text-center">
        <p className="font-display text-[20px] font-extrabold text-white mb-1">{t.success.referralTitle}</p>
        <p className="text-[13px] text-white/60 mb-4 leading-snug">{t.success.referralBody}</p>
        <Button size="lg" className="w-full bg-[#22c55e] hover:bg-[#16a34a] text-white font-semibold text-[15px] border-0">
          📱 {t.success.shareWhatsApp}
        </Button>
      </div>

      <Button variant="outline" size="lg" className="w-full text-[15px]">{t.success.backToWhatsApp}</Button>
    </div>
  )
}

// ─── Bank flow screens ───────────────────────────────────────────────────────

function BankConsentScreen({ onNext, onBack }: { onNext: () => void; onBack: () => void }) {
  const t = useT()
  return (
    <div className="flex flex-col h-full">
      <ScreenHeader />
      <div className="px-6 pt-3 pb-1 flex items-center gap-3">
        <BackButton onClick={onBack} />
        <div className="flex-1" />
        <button onClick={onBack} className="flex h-9 w-9 items-center justify-center rounded-full border border-slate/15 text-slate hover:bg-white">
          <X className="h-4 w-4" />
        </button>
      </div>
      <div className="flex-1 px-6 pb-6 overflow-y-auto">
        <h1 className="font-display text-[22px] font-extrabold leading-tight tracking-tight text-slate mt-2 mb-4">
          {t.bankConsent.title}
        </h1>
        <p className="text-[14px] text-mocha leading-relaxed mb-8">
          {t.bankConsent.body}
        </p>
        <Button size="lg" className="w-full text-[15px]" onClick={onNext}>
          {t.bankConsent.agree}
        </Button>
      </div>
    </div>
  )
}

function BankConnectScreen({ onNext, onBack }: { onNext: () => void; onBack: () => void }) {
  const t = useT()
  const [firstName, setFirstName] = useState('')
  const [middleName, setMiddleName] = useState('')
  const [lastName, setLastName] = useState('')
  const canContinue = !!firstName && !!lastName

  const fieldClass = '!rounded-2xl bg-white'
  const labelClass = 'bg-white text-mocha'

  return (
    <div className="flex flex-col h-full">
      <ScreenHeader />
      <div className="px-6 pt-3 pb-1">
        <BackButton onClick={onBack} />
      </div>
      <div className="flex-1 px-6 pb-6 overflow-y-auto">
        <h1 className="font-display text-[22px] font-extrabold leading-tight tracking-tight text-slate mb-1">
          {t.bankConnect.title}
        </h1>
        <p className="text-[14px] text-mocha mb-5 leading-snug">{t.bankConnect.subtitle}</p>
        <div className="space-y-4">
          <FloatingInput label={t.bankConnect.fieldFirstName} className={fieldClass} labelClassName={labelClass} value={firstName} onChange={e => setFirstName(e.target.value)} />
          <FloatingInput label={t.bankConnect.fieldMiddleName} className={fieldClass} labelClassName={labelClass} value={middleName} onChange={e => setMiddleName(e.target.value)} />
          <FloatingInput label={t.bankConnect.fieldLastName} className={fieldClass} labelClassName={labelClass} value={lastName} onChange={e => setLastName(e.target.value)} />
        </div>
        <div className="pt-8">
          <Button size="lg" className="w-full text-[15px]" onClick={onNext} disabled={!canContinue}>
            {t.bankConnect.linkAccount}
          </Button>
        </div>
      </div>
    </div>
  )
}

// Stripe-branded header for third-party screens
function StripeHeader({ onClose }: { onClose?: () => void }) {
  return (
    <div className="flex items-center justify-between px-5 py-3 bg-gradient-to-r from-[#635bff] to-[#7b73ff]">
      <div className="flex items-center gap-2">
        <span className="text-[16px] font-bold text-white tracking-tight">stripe</span>
        <span className="bg-white/20 text-white text-[10px] font-semibold px-2 py-0.5 rounded">Test</span>
      </div>
      {onClose && (
        <button onClick={onClose} className="flex h-7 w-7 items-center justify-center rounded-full text-white/70 hover:text-white hover:bg-white/10">
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  )
}

const simulatedBanks = [
  { id: 'chase', name: 'Chase', domain: 'chase.com' },
  { id: 'bofa', name: 'Bank of America', domain: 'bankofamerica.com' },
  { id: 'wells', name: 'Wells Fargo', domain: 'wellsfargo.com' },
  { id: 'citi', name: 'Citibank', domain: 'citibank.com' },
  { id: 'usbank', name: 'US Bank', domain: 'usbank.com' },
  { id: 'capital', name: 'Capital One', domain: 'capitalone.com' },
]

const simulatedAccounts = [
  { id: 'checking', name: 'Premier Checking', last4: '0010', selected: false },
  { id: 'savings', name: 'High-Yield Savings', last4: '4321', selected: false },
  { id: 'business', name: 'Business Checking', last4: '3335', selected: false },
]

function StripeBankSelectScreen({ onNext, onBack }: { onNext: () => void; onBack: () => void }) {
  const t = useT()
  const [selected, setSelected] = useState<string | null>(null)
  const [query, setQuery] = useState('')
  const filtered = simulatedBanks.filter(b => b.name.toLowerCase().includes(query.toLowerCase()))

  return (
    <div className="flex flex-col h-full bg-white">
      <StripeHeader onClose={onBack} />
      <div className="flex-1 px-5 pb-5 overflow-y-auto">
        <h2 className="font-bold text-[20px] text-slate mt-5 mb-4">{t.stripe.selectTitle}</h2>
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-mocha/40" />
          <input
            type="text"
            placeholder={t.stripe.selectSearch}
            value={query}
            onChange={e => setQuery(e.target.value)}
            className="w-full h-11 rounded-xl border border-slate/15 bg-stone/30 pl-10 pr-4 text-[14px] text-slate placeholder:text-mocha/40 outline-none focus:border-[#635bff] focus:ring-2 focus:ring-[#635bff]/20"
          />
        </div>
        <div className="space-y-1">
          {filtered.map(bank => (
            <button
              key={bank.id}
              onClick={() => { setSelected(bank.id); setTimeout(onNext, 200) }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all ${
                selected === bank.id ? 'bg-[#635bff]/10 border border-[#635bff]/30' : 'hover:bg-stone/40 border border-transparent'
              }`}
            >
              <div className="h-9 w-9 rounded-full bg-[#635bff]/10 flex items-center justify-center flex-shrink-0">
                <Building2 className="h-4 w-4 text-[#635bff]" />
              </div>
              <div>
                <p className="font-semibold text-[14px] text-slate">{bank.name}</p>
                <p className="text-[12px] text-mocha/50">{bank.domain}</p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

function StripeIntroScreen({ onNext, onBack }: { onNext: () => void; onBack: () => void }) {
  const t = useT()
  return (
    <div className="flex flex-col h-full bg-white">
      <StripeHeader onClose={onBack} />
      <div className="flex-1 px-6 pb-5 overflow-y-auto">
        <div className="flex items-center justify-center gap-4 pt-8 pb-6">
          <div className="h-14 w-14 rounded-2xl bg-turquoise flex items-center justify-center">
            <FelixLogo className="h-7 text-slate" />
          </div>
          <div className="flex gap-1">
            <div className="h-1.5 w-1.5 rounded-full bg-[#635bff]/30" />
            <div className="h-1.5 w-1.5 rounded-full bg-[#635bff]/50" />
            <div className="h-1.5 w-1.5 rounded-full bg-[#635bff]/70" />
          </div>
          <div className="h-14 w-14 rounded-2xl bg-[#635bff] flex items-center justify-center">
            <span className="text-white text-[18px] font-bold tracking-tight">S</span>
          </div>
        </div>

        <h2 className="font-bold text-[20px] text-slate text-center mb-6 leading-snug">{t.stripe.introTitle}</h2>

        <div className="space-y-5 mb-6">
          <div className="flex gap-3">
            <div className="h-9 w-9 rounded-full bg-[#635bff]/10 flex items-center justify-center flex-shrink-0 mt-0.5">
              <Zap className="h-4 w-4 text-[#635bff]" />
            </div>
            <div>
              <p className="font-semibold text-[14px] text-slate">{t.stripe.introFast}</p>
              <p className="text-[13px] text-mocha leading-snug">{t.stripe.introFastDesc}</p>
            </div>
          </div>
          <div className="flex gap-3">
            <div className="h-9 w-9 rounded-full bg-[#635bff]/10 flex items-center justify-center flex-shrink-0 mt-0.5">
              <Shield className="h-4 w-4 text-[#635bff]" />
            </div>
            <div>
              <p className="font-semibold text-[14px] text-slate">{t.stripe.introEncrypted}</p>
              <p className="text-[13px] text-mocha leading-snug">{t.stripe.introEncryptedDesc}</p>
            </div>
          </div>
        </div>

        <p className="text-[11px] text-mocha/60 text-center mb-5 leading-relaxed">
          {t.stripe.introConsent}
        </p>

        <Button size="lg" className="w-full text-[15px] !bg-[#635bff] hover:!bg-[#5248e6] !text-white !border-0" onClick={onNext}>
          {t.stripe.introAccept}
        </Button>
        <p className="text-[12px] text-mocha text-center mt-3 underline underline-offset-2 decoration-mocha/40 cursor-pointer">
          {t.stripe.introManual}
        </p>
      </div>
    </div>
  )
}

function StripeAccountScreen({ onNext, onBack }: { onNext: () => void; onBack: () => void }) {
  const t = useT()
  const [selected, setSelected] = useState<string | null>(null)

  return (
    <div className="flex flex-col h-full bg-white">
      <StripeHeader onClose={onBack} />
      <div className="flex-1 px-5 pb-5 overflow-y-auto">
        <div className="flex justify-center pt-6 pb-4">
          <div className="h-12 w-12 rounded-2xl bg-[#635bff]/10 flex items-center justify-center">
            <Building2 className="h-6 w-6 text-[#635bff]" />
          </div>
        </div>
        <h2 className="font-bold text-[20px] text-slate text-center mb-5">{t.stripe.accountTitle}</h2>
        <div className="space-y-2.5 mb-6">
          {simulatedAccounts.map(account => (
            <button
              key={account.id}
              onClick={() => setSelected(account.id)}
              className={`w-full flex items-center justify-between px-4 py-3.5 rounded-xl border transition-all text-left ${
                selected === account.id
                  ? 'border-[#635bff] bg-[#635bff]/5 shadow-sm'
                  : 'border-slate/15 hover:border-slate/30'
              }`}
            >
              <div>
                <p className="font-semibold text-[14px] text-slate">{account.name}</p>
                <p className="text-[12px] text-mocha/50 mt-0.5">····{account.last4}</p>
              </div>
              {selected === account.id && (
                <div className="h-5 w-5 rounded-full bg-[#635bff] flex items-center justify-center">
                  <Check className="h-3 w-3 text-white" />
                </div>
              )}
            </button>
          ))}
        </div>
        <Button size="lg" className="w-full text-[15px] !bg-[#635bff] hover:!bg-[#5248e6] !text-white !border-0" onClick={onNext} disabled={!selected}>
          {t.stripe.accountConnect}
        </Button>
      </div>
    </div>
  )
}

function StripeLinkScreen({ onNext, onBack }: { onNext: () => void; onBack: () => void }) {
  const t = useT()
  return (
    <div className="flex flex-col h-full bg-white">
      <StripeHeader onClose={onBack} />
      <div className="flex-1 px-5 pb-5 overflow-y-auto">
        <div className="flex justify-center pt-6 pb-4">
          <div className="h-12 w-12 rounded-2xl bg-[#00d66f]/10 flex items-center justify-center">
            <Lock className="h-6 w-6 text-[#00d66f]" />
          </div>
        </div>
        <h2 className="font-bold text-[20px] text-slate text-center mb-2">{t.stripe.linkTitle}</h2>
        <p className="text-[13px] text-mocha text-center mb-6 leading-snug px-2">{t.stripe.linkDesc}</p>

        <div className="space-y-3 mb-6">
          <input
            type="email"
            placeholder="you@felixpago.com"
            className="w-full h-12 rounded-xl border border-slate/15 bg-stone/30 px-4 text-[14px] text-slate placeholder:text-mocha/40 outline-none focus:border-[#635bff] focus:ring-2 focus:ring-[#635bff]/20"
          />
          <div className="flex gap-2">
            <div className="flex items-center gap-1.5 h-12 rounded-xl border border-slate/15 bg-stone/30 px-3">
              <span className="text-[14px]">🇺🇸</span>
              <span className="text-[13px] text-slate font-medium">+1</span>
            </div>
            <input
              type="tel"
              placeholder="Phone number"
              className="flex-1 h-12 rounded-xl border border-slate/15 bg-stone/30 px-4 text-[14px] text-slate placeholder:text-mocha/40 outline-none focus:border-[#635bff] focus:ring-2 focus:ring-[#635bff]/20"
            />
          </div>
        </div>

        <p className="text-[11px] text-mocha/60 text-center mb-5 leading-relaxed">
          {t.stripe.introConsent}
        </p>

        <Button size="lg" className="w-full text-[15px] !bg-[#00d66f] hover:!bg-[#00c060] !text-white !border-0" onClick={onNext}>
          {t.stripe.linkSave}
        </Button>
        <button onClick={onNext} className="w-full text-center text-[13px] text-mocha mt-3 hover:text-slate transition-colors">
          {t.stripe.linkSkip}
        </button>
      </div>
    </div>
  )
}

function StripeCompletedScreen({ onNext, onBack }: { onNext: () => void; onBack: () => void }) {
  const t = useT()
  return (
    <div className="flex flex-col h-full bg-white">
      <StripeHeader onClose={onBack} />
      <div className="flex-1 flex flex-col items-center justify-center px-6 pb-10">
        <div className="h-16 w-16 rounded-full bg-[#00d66f] flex items-center justify-center mb-5">
          <Check className="h-8 w-8 text-white" />
        </div>
        <h2 className="font-bold text-[22px] text-slate text-center mb-2">{t.stripe.completedTitle}</h2>
        <p className="text-[14px] text-mocha text-center mb-8">{t.stripe.completedSubtitle}</p>
        <Button size="lg" className="w-full text-[15px] !bg-[#635bff] hover:!bg-[#5248e6] !text-white !border-0" onClick={onNext}>
          {t.stripe.completedDone}
        </Button>
      </div>
    </div>
  )
}

// ─── Token inspector ──────────────────────────────────────────────────────────

const INSPECTOR_STORAGE_KEY = 'felix-content-tokens-v2'
const SCREEN_STATUS_KEY = 'felix-screen-statuses'
type ScreenStatus = 'todo' | 'in-review' | 'done'

// Grouped token structure for the inspector
type TRef   = { s: keyof ContentTokens; k: string }
type TGroup = { label: string | null; items: TRef[] }

const screenGroups: Record<string, TGroup[]> = {
  payment: [
    { label: null, items: [
      { s: 'common', k: 'badge' },
    ]},
    { label: 'SCREEN', items: [
      { s: 'paymentMethod', k: 'titleLine1' },
      { s: 'paymentMethod', k: 'titleLine2' },
      { s: 'paymentMethod', k: 'subtitle' },
      { s: 'paymentMethod', k: 'orPayAnotherWay' },
    ]},
    { label: 'CREDIT / DEBIT CARD', items: [
      { s: 'paymentMethod', k: 'creditDebitName' },
      { s: 'paymentMethod', k: 'creditDebitDesc' },
      { s: 'paymentMethod', k: 'badgeNoFeeDebit' },
      { s: 'paymentMethod', k: 'badgeInstant' },
    ]},
    { label: 'BANK ACCOUNT', items: [
      { s: 'paymentMethod', k: 'bankName' },
      { s: 'paymentMethod', k: 'bankDesc' },
      { s: 'paymentMethod', k: 'badgeNoFee' },
      { s: 'paymentMethod', k: 'badgeBusinessDays' },
    ]},
    { label: 'CASH AT A STORE', items: [
      { s: 'paymentMethod', k: 'cashName' },
      { s: 'paymentMethod', k: 'cashDesc' },
      { s: 'paymentMethod', k: 'badgeCashFee' },
      { s: 'paymentMethod', k: 'badgeSameDay' },
    ]},
    { label: null, items: [
      { s: 'common', k: 'continue' },
      { s: 'common', k: 'cancel' },
    ]},
  ],
  address: [
    { label: null, items: [{ s: 'common', k: 'badge' }]},
    { label: 'ADDRESS FORM', items: [
      { s: 'address', k: 'titleBilling' },
      { s: 'address', k: 'titleBank' },
      { s: 'address', k: 'titleCash' },
      { s: 'address', k: 'helperCash' },
      { s: 'address', k: 'fieldAddress' },
      { s: 'address', k: 'fieldApt' },
      { s: 'address', k: 'fieldZip' },
      { s: 'address', k: 'fieldCity' },
      { s: 'address', k: 'fieldState' },
    ]},
    { label: null, items: [
      { s: 'common', k: 'continue' },
      { s: 'common', k: 'cancel' },
    ]},
  ],
  card: [
    { label: null, items: [{ s: 'common', k: 'badge' }]},
    { label: 'CARD DETAILS', items: [
      { s: 'cardDetails', k: 'title' },
      { s: 'cardDetails', k: 'fieldFullName' },
      { s: 'cardDetails', k: 'fieldCardNumber' },
      { s: 'cardDetails', k: 'fieldExpiry' },
      { s: 'cardDetails', k: 'fieldCvv' },
      { s: 'cardDetails', k: 'helperName' },
    ]},
    { label: 'LEGAL', items: [
      { s: 'cardDetails', k: 'termsPre' },
      { s: 'cardDetails', k: 'termsLink' },
      { s: 'cardDetails', k: 'termsAnd' },
      { s: 'cardDetails', k: 'privacyLink' },
    ]},
    { label: 'SECURITY NOTICE', items: [
      { s: 'cardDetails', k: 'securityTitle' },
      { s: 'cardDetails', k: 'securityBody' },
    ]},
    { label: null, items: [
      { s: 'common', k: 'continue' },
      { s: 'common', k: 'cancel' },
    ]},
  ],
  store: [
    { label: null, items: [{ s: 'common', k: 'badge' }]},
    { label: 'STORE SELECTION', items: [
      { s: 'storeSelection', k: 'title' },
      { s: 'storeSelection', k: 'minMax' },
      { s: 'storeSelection', k: 'greenDot' },
    ]},
    { label: null, items: [
      { s: 'common', k: 'continue' },
      { s: 'common', k: 'cancel' },
    ]},
  ],
  review: [
    { label: null, items: [{ s: 'common', k: 'badge' }]},
    { label: 'TRANSFER SUMMARY', items: [
      { s: 'review', k: 'title' },
      { s: 'review', k: 'youSend' },
      { s: 'review', k: 'recipientGets' },
      { s: 'review', k: 'paymentMethodLabel' },
    ]},
    { label: 'FEE BREAKDOWN', items: [
      { s: 'review', k: 'amountFees' },
      { s: 'review', k: 'exchangeRate' },
      { s: 'review', k: 'amountToSend' },
      { s: 'review', k: 'felixFee' },
      { s: 'review', k: 'storeFee' },
      { s: 'review', k: 'otherFees' },
      { s: 'review', k: 'taxes' },
      { s: 'review', k: 'total' },
    ]},
    { label: 'LEGAL', items: [
      { s: 'review', k: 'legal' },
      { s: 'review', k: 'learnMore' },
    ]},
    { label: null, items: [
      { s: 'review', k: 'sendNow' },
      { s: 'common', k: 'change' },
    ]},
  ],
  success: [
    { label: 'CONFIRMATION', items: [
      { s: 'success', k: 'title' },
      { s: 'success', k: 'body' },
    ]},
    { label: 'REFERRAL', items: [
      { s: 'success', k: 'referralTitle' },
      { s: 'success', k: 'referralBody' },
    ]},
    { label: 'ACTIONS', items: [
      { s: 'success', k: 'shareWhatsApp' },
      { s: 'success', k: 'backToWhatsApp' },
    ]},
  ],
  bankConsent: [
    { label: null, items: [{ s: 'common', k: 'badge' }]},
    { label: 'BANK CONSENT', items: [
      { s: 'bankConsent', k: 'title' },
      { s: 'bankConsent', k: 'body' },
      { s: 'bankConsent', k: 'agree' },
    ]},
  ],
  bankConnect: [
    { label: null, items: [{ s: 'common', k: 'badge' }]},
    { label: 'CONNECT ACCOUNT', items: [
      { s: 'bankConnect', k: 'title' },
      { s: 'bankConnect', k: 'subtitle' },
      { s: 'bankConnect', k: 'fieldFirstName' },
      { s: 'bankConnect', k: 'fieldMiddleName' },
      { s: 'bankConnect', k: 'fieldLastName' },
      { s: 'bankConnect', k: 'linkAccount' },
    ]},
  ],
  stripeSelect: [
    { label: 'SELECT BANK', items: [
      { s: 'stripe', k: 'selectTitle' },
      { s: 'stripe', k: 'selectSearch' },
    ]},
  ],
  stripeIntro: [
    { label: 'STRIPE INTRO', items: [
      { s: 'stripe', k: 'introTitle' },
      { s: 'stripe', k: 'introFast' },
      { s: 'stripe', k: 'introFastDesc' },
      { s: 'stripe', k: 'introEncrypted' },
      { s: 'stripe', k: 'introEncryptedDesc' },
      { s: 'stripe', k: 'introAccept' },
      { s: 'stripe', k: 'introManual' },
    ]},
  ],
  stripeAccount: [
    { label: 'CHOOSE ACCOUNT', items: [
      { s: 'stripe', k: 'accountTitle' },
      { s: 'stripe', k: 'accountConnect' },
    ]},
  ],
  stripeLink: [
    { label: 'SAVE WITH LINK', items: [
      { s: 'stripe', k: 'linkTitle' },
      { s: 'stripe', k: 'linkDesc' },
      { s: 'stripe', k: 'linkSave' },
      { s: 'stripe', k: 'linkSkip' },
    ]},
  ],
  stripeComplete: [
    { label: 'COMPLETED', items: [
      { s: 'stripe', k: 'completedTitle' },
      { s: 'stripe', k: 'completedSubtitle' },
      { s: 'stripe', k: 'completedDone' },
    ]},
  ],
}

function TokenInspector({
  tokens,
  language,
  screen,
  onChange,
}: {
  tokens: Record<Language, ContentTokens>
  language: Language
  screen: string
  onChange: (section: keyof ContentTokens, key: string, lang: Language, value: string) => void
}) {
  const [hoveredId, setHoveredId] = useState<string | null>(null)
  const [pinnedId, setPinnedId] = useState<string | null>(null)
  const [drafts, setDrafts] = useState<Record<string, Record<string, string>>>({})
  const visibleGroups = screenGroups[screen] ?? []

  // Reset on screen change
  useEffect(() => { setHoveredId(null); setPinnedId(null) }, [screen])

  function initDrafts(id: string, s: keyof ContentTokens, k: string) {
    setDrafts(prev => {
      if (prev[id]) return prev
      const initial: Record<string, string> = {}
      languages.forEach(l => {
        initial[l.code] = (tokens[l.code][s] as Record<string, string>)[k]
      })
      return { ...prev, [id]: initial }
    })
  }

  function save(id: string, s: keyof ContentTokens, k: string) {
    const d = drafts[id] ?? {}
    languages.forEach(l => onChange(s, k, l.code, d[l.code] ?? ''))
    setPinnedId(null)
    setHoveredId(null)
  }

  function TokenRow({ s, k }: TRef) {
    const id = `${s}.${k}`
    const currentVal = (tokens[language][s] as Record<string, string>)[k]
    const isOpen = hoveredId === id || pinnedId === id

    return (
      <div
        key={id}
        onMouseEnter={() => { setHoveredId(id); initDrafts(id, s, k) }}
        onMouseLeave={() => { if (pinnedId !== id) setHoveredId(null) }}
      >
        <div className="flex items-baseline gap-2 py-1.5">
          <code className={`text-[11px] font-mono shrink-0 underline underline-offset-2 decoration-dotted transition-colors ${isOpen ? 'text-blueberry' : 'text-blueberry/70'}`}>
            {k}
          </code>
          <span className="text-[12px] text-mocha/60 truncate leading-snug">{currentVal}</span>
        </div>
        {isOpen && (
          <div className="mb-3 bg-white rounded-2xl border border-slate/10 p-3 space-y-2.5 shadow-sm">
            <p className="text-[11px] font-mono text-blueberry">{s}.{k}</p>
            {languages.map(lang => (
              <div key={lang.code}>
                <label className="text-[10px] font-semibold text-mocha uppercase tracking-wider mb-1 block">
                  {lang.code === 'en' ? 'EN' : lang.code === 'es-mx' ? 'ES-MX' : 'PT-BR'}
                </label>
                <textarea
                  value={drafts[id]?.[lang.code] ?? ''}
                  onChange={e => setDrafts(d => ({ ...d, [id]: { ...d[id], [lang.code]: e.target.value } }))}
                  onFocus={() => setPinnedId(id)}
                  onBlur={() => setPinnedId(null)}
                  rows={2}
                  className="w-full text-[13px] text-slate bg-stone border border-slate/15 rounded-xl px-3 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-turquoise/40"
                />
              </div>
            ))}
            <button
              onClick={() => save(id, s, k)}
              className="w-full py-2 bg-turquoise text-slate text-[13px] font-semibold rounded-xl hover:bg-turquoise/90 transition-colors"
            >
              Save
            </button>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="w-[260px] h-[844px] shrink-0 flex flex-col overflow-hidden opacity-40 hover:opacity-100 transition-opacity duration-200">
      {/* Header — vertically matches PhoneControls row */}
      <p className="text-[10px] font-semibold text-mocha uppercase tracking-widest py-[11px] px-1 shrink-0">
        Tokens in view
      </p>

      {/* Token list */}
      <div className="flex-1 overflow-y-auto px-1 space-y-1">
        {visibleGroups.map((group, gi) =>
          group.label === null ? (
            // Plain rows — no container
            group.items.map(ref => <TokenRow key={`${ref.s}.${ref.k}`} {...ref} />)
          ) : (
            // Labeled group — rounded stone container
            <div key={gi} className="bg-stone/70 rounded-2xl px-3 pt-2.5 pb-1">
              <p className="text-[9px] font-semibold text-mocha/50 uppercase tracking-widest mb-1">
                {group.label}
              </p>
              {group.items.map(ref => <TokenRow key={`${ref.s}.${ref.k}`} {...ref} />)}
            </div>
          )
        )}
      </div>
    </div>
  )
}

// ─── Flow canvas ─────────────────────────────────────────────────────────────

const CANVAS_SCALE = 0.32
const CANVAS_W = Math.round(390 * CANVAS_SCALE) // 125px
const CANVAS_H = Math.round(844 * CANVAS_SCALE) // 270px

function CanvasMiniPhone({
  label,
  progress,
  children,
  editableContent,
  language,
  uid,
  selectedUid,
  onSelect,
  status,
}: {
  label: string
  progress?: number
  children: React.ReactNode
  editableContent: Record<Language, ContentTokens>
  language: Language
  uid: string
  selectedUid: string | null
  onSelect: (uid: string) => void
  status: ScreenStatus
}) {
  const isSelected = selectedUid === uid

  return (
    <div className="relative flex-shrink-0">
      <div
        className="flex flex-col items-center gap-3 cursor-pointer"
        onClick={() => onSelect(isSelected ? '' : uid)}
      >
        <div
          className="relative overflow-hidden shadow-2xl transition-all duration-150"
          style={{
            width: CANVAS_W,
            height: CANVAS_H,
            borderRadius: Math.round(52 * CANVAS_SCALE),
            boxShadow: isSelected
              ? '0 0 0 2px #60a5fa, 0 8px 40px rgba(0,0,0,0.6)'
              : '0 8px 32px rgba(0,0,0,0.5)',
          }}
        >
          <div
            className="absolute top-0 left-0 pointer-events-none"
            style={{ transform: `scale(${CANVAS_SCALE})`, transformOrigin: 'top left', width: 390, height: 844 }}
          >
            <LangContext.Provider value={editableContent[language]}>
              <PhoneFrame progress={progress}>{children}</PhoneFrame>
            </LangContext.Provider>
          </div>
        </div>
        <p className={`text-[10px] font-medium tracking-wide transition-colors ${isSelected ? 'text-white/70' : 'text-white/35'}`}>
          {label}
        </p>
        {/* Status badge */}
        {status === 'in-review' && (
          <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 text-[8px] font-semibold bg-amber-400/90 text-amber-950 px-2 py-0.5 rounded-full whitespace-nowrap">
            In Review
          </span>
        )}
        {status === 'done' && (
          <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 text-[8px] font-semibold bg-emerald-400/90 text-emerald-950 px-2 py-0.5 rounded-full whitespace-nowrap">
            Done
          </span>
        )}
      </div>
    </div>
  )
}

function CanvasArrow() {
  return (
    <div
      className="flex-shrink-0 flex items-center"
      style={{ marginTop: CANVAS_H / 2 - 6 + 3, marginLeft: 6, marginRight: 6, alignSelf: 'flex-start' }}
    >
      <svg width="28" height="12" viewBox="0 0 28 12" fill="none">
        <path d="M0 6H21" stroke="rgba(255,255,255,0.15)" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M17 2L23 6L17 10" stroke="rgba(255,255,255,0.15)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  )
}

function CanvasSidebar({
  selectedUid,
  screenLabel,
  screenKey,
  tokens,
  language,
  status,
  onStatusChange,
  onChange,
  onDeselect,
}: {
  selectedUid: string | null
  screenLabel: string
  screenKey: string
  tokens: Record<Language, ContentTokens>
  language: Language
  status: ScreenStatus
  onStatusChange: (s: ScreenStatus) => void
  onChange: (section: keyof ContentTokens, key: string, lang: Language, value: string) => void
  onDeselect: () => void
}) {
  const [openId, setOpenId] = useState<string | null>(null)
  const [drafts, setDrafts] = useState<Record<string, Record<string, string>>>({})
  const visibleGroups = screenGroups[screenKey] ?? []

  useEffect(() => { setOpenId(null); setDrafts({}) }, [selectedUid])

  function initDrafts(id: string, s: keyof ContentTokens, k: string) {
    setDrafts(prev => {
      if (prev[id]) return prev
      const initial: Record<string, string> = {}
      languages.forEach(l => { initial[l.code] = (tokens[l.code][s] as Record<string, string>)[k] })
      return { ...prev, [id]: initial }
    })
  }

  function save(id: string, s: keyof ContentTokens, k: string) {
    const d = drafts[id] ?? {}
    languages.forEach(l => onChange(s, k, l.code, d[l.code] ?? ''))
    setOpenId(null)
  }

  function toggle(id: string, s: keyof ContentTokens, k: string) {
    if (openId === id) { setOpenId(null); return }
    initDrafts(id, s, k)
    setOpenId(id)
  }

  const statusTabs: { value: ScreenStatus; label: string }[] = [
    { value: 'todo', label: 'To-do' },
    { value: 'in-review', label: 'In-Review' },
    { value: 'done', label: 'Done' },
  ]

  if (!selectedUid) {
    return (
      <div className="w-[320px] shrink-0 border-l border-white/[0.12] bg-[#2a2a2a] flex items-center justify-center">
        <p className="text-[13px] text-white/40">Click a screen to inspect tokens</p>
      </div>
    )
  }

  return (
    <div className="w-[320px] shrink-0 border-l border-white/[0.12] bg-[#2a2a2a] flex flex-col overflow-hidden">
      {/* Header */}
      <div className="shrink-0 px-4 pt-4 pb-3 border-b border-white/[0.12]">
        <div className="flex items-center justify-between mb-3">
          <p className="text-[14px] font-semibold text-white truncate">{screenLabel}</p>
          <button
            onClick={onDeselect}
            className="text-[12px] text-white/50 hover:text-white/80 transition-colors whitespace-nowrap ml-2"
          >
            ← All
          </button>
        </div>
        {/* Status tabs */}
        <div className="flex gap-1">
          {statusTabs.map(tab => (
            <button
              key={tab.value}
              onClick={() => onStatusChange(tab.value)}
              className={`flex-1 py-1.5 rounded-lg text-[11px] font-semibold transition-colors ${
                status === tab.value
                  ? tab.value === 'done'
                    ? 'bg-emerald-500/25 text-emerald-300'
                    : tab.value === 'in-review'
                      ? 'bg-amber-500/25 text-amber-300'
                      : 'bg-white/15 text-white/80'
                  : 'text-white/40 hover:text-white/60 hover:bg-white/[0.06]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Token list */}
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-1">
        {visibleGroups.map((group, gi) =>
          group.label === null ? (
            group.items.map(ref => {
              const id = `${ref.s}.${ref.k}`
              const currentVal = (tokens[language][ref.s] as Record<string, string>)[ref.k]
              const isOpen = openId === id

              return (
                <div key={id}>
                  <button
                    className="flex items-baseline gap-2 py-1.5 w-full text-left cursor-pointer hover:bg-white/[0.04] rounded-lg px-1 -mx-1 transition-colors"
                    onClick={() => toggle(id, ref.s, ref.k)}
                  >
                    <code className={`text-[11px] font-mono shrink-0 underline underline-offset-2 decoration-dotted transition-colors ${isOpen ? 'text-[#93bbfc]' : 'text-[#60a5fa]/80'}`}>
                      {ref.k}
                    </code>
                    <span className="text-[12px] text-white/60 truncate leading-snug">{currentVal}</span>
                  </button>
                  {isOpen && (
                    <div className="mb-3 bg-[#333] rounded-xl border border-white/[0.12] p-3 space-y-2.5">
                      <p className="text-[11px] font-mono text-[#93bbfc]">{ref.s}.{ref.k}</p>
                      {languages.map(lang => (
                        <div key={lang.code}>
                          <label className="text-[10px] font-semibold text-white/50 uppercase tracking-wider mb-1 block">
                            {lang.code === 'en' ? 'EN' : lang.code === 'es-mx' ? 'ES-MX' : 'PT-BR'}
                          </label>
                          <textarea
                            value={drafts[id]?.[lang.code] ?? ''}
                            onChange={e => setDrafts(d => ({ ...d, [id]: { ...d[id], [lang.code]: e.target.value } }))}
                            rows={2}
                            className="w-full text-[13px] text-white/90 bg-[#252525] border border-white/15 rounded-lg px-3 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-[#60a5fa]/40"
                          />
                        </div>
                      ))}
                      <button
                        onClick={() => save(id, ref.s, ref.k)}
                        className="w-full py-2 bg-turquoise text-slate text-[13px] font-semibold rounded-lg hover:bg-turquoise/90 transition-colors"
                      >
                        Save
                      </button>
                    </div>
                  )}
                </div>
              )
            })
          ) : (
            <div key={gi} className="bg-white/[0.06] rounded-xl px-3 pt-2.5 pb-1 mb-1">
              <p className="text-[9px] font-semibold text-white/40 uppercase tracking-widest mb-1">
                {group.label}
              </p>
              {group.items.map(ref => {
                const id = `${ref.s}.${ref.k}`
                const currentVal = (tokens[language][ref.s] as Record<string, string>)[ref.k]
                const isOpen = openId === id

                return (
                  <div key={id}>
                    <button
                      className="flex items-baseline gap-2 py-1.5 w-full text-left cursor-pointer hover:bg-white/[0.04] rounded-lg px-1 -mx-1 transition-colors"
                      onClick={() => toggle(id, ref.s, ref.k)}
                    >
                      <code className={`text-[11px] font-mono shrink-0 underline underline-offset-2 decoration-dotted transition-colors ${isOpen ? 'text-[#93bbfc]' : 'text-[#60a5fa]/80'}`}>
                        {ref.k}
                      </code>
                      <span className="text-[12px] text-white/60 truncate leading-snug">{currentVal}</span>
                    </button>
                    {isOpen && (
                      <div className="mb-3 bg-[#333] rounded-xl border border-white/[0.12] p-3 space-y-2.5">
                        <p className="text-[11px] font-mono text-[#93bbfc]">{ref.s}.{ref.k}</p>
                        {languages.map(lang => (
                          <div key={lang.code}>
                            <label className="text-[10px] font-semibold text-white/50 uppercase tracking-wider mb-1 block">
                              {lang.code === 'en' ? 'EN' : lang.code === 'es-mx' ? 'ES-MX' : 'PT-BR'}
                            </label>
                            <textarea
                              value={drafts[id]?.[lang.code] ?? ''}
                              onChange={e => setDrafts(d => ({ ...d, [id]: { ...d[id], [lang.code]: e.target.value } }))}
                              rows={2}
                              className="w-full text-[13px] text-white/90 bg-[#252525] border border-white/15 rounded-lg px-3 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-[#60a5fa]/40"
                            />
                          </div>
                        ))}
                        <button
                          onClick={() => save(id, ref.s, ref.k)}
                          className="w-full py-2 bg-turquoise text-slate text-[13px] font-semibold rounded-lg hover:bg-turquoise/90 transition-colors"
                        >
                          Save
                        </button>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          )
        )}
      </div>
    </div>
  )
}

function FlowCanvasOverlay({
  editableContent,
  language,
  onLanguageChange,
  onClose,
  onChange,
}: {
  editableContent: Record<Language, ContentTokens>
  language: Language
  onLanguageChange: (lang: Language) => void
  onClose: () => void
  onChange: (section: keyof ContentTokens, key: string, lang: Language, value: string) => void
}) {
  const [selectedUid, setSelectedUid] = useState<string | null>(null)
  const [statuses, setStatuses] = useState<Record<string, ScreenStatus>>(() => {
    try { return JSON.parse(localStorage.getItem(SCREEN_STATUS_KEY) || '{}') } catch { return {} }
  })
  function setStatus(uid: string, s: ScreenStatus) {
    setStatuses(prev => {
      const next = { ...prev, [uid]: s }
      localStorage.setItem(SCREEN_STATUS_KEY, JSON.stringify(next))
      return next
    })
  }
  const viewRef = useRef<HTMLDivElement>(null)
  const canvas = useRef({ zoom: 1, ox: 0, oy: 0 })
  const [, repaint] = useState(0)
  const re = () => repaint(n => n + 1)
  const dragging = useRef(false)
  const lastMouse = useRef({ x: 0, y: 0 })

  // Fit to viewport on mount
  useEffect(() => {
    const el = viewRef.current
    if (!el) return
    const vw = el.clientWidth
    const vh = el.clientHeight
    const cw = 11 * CANVAS_W + 10 * 40 + 160
    const ch = 3 * (CANVAS_H + 36 + 56) + 120
    const zoom = Math.min((vw - 120) / cw, (vh - 100) / ch, 1.2)
    canvas.current = { zoom, ox: (vw - cw * zoom) / 2, oy: 60 }
    re()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Non-passive wheel for pan + pinch zoom
  useEffect(() => {
    const el = viewRef.current!
    function onWheel(e: WheelEvent) {
      e.preventDefault()
      const c = canvas.current
      if (e.ctrlKey || e.metaKey) {
        const rect = el.getBoundingClientRect()
        const mx = e.clientX - rect.left
        const my = e.clientY - rect.top
        const factor = 1 - e.deltaY * 0.004
        const newZoom = Math.min(Math.max(c.zoom * factor, 0.08), 4)
        const scale = newZoom / c.zoom
        c.ox = mx - (mx - c.ox) * scale
        c.oy = my - (my - c.oy) * scale
        c.zoom = newZoom
      } else {
        c.ox -= e.deltaX
        c.oy -= e.deltaY
      }
      repaint(n => n + 1)
    }
    el.addEventListener('wheel', onWheel, { passive: false })
    return () => el.removeEventListener('wheel', onWheel)
  }, [])

  function onMouseDown(e: React.MouseEvent) {
    if (e.button !== 0) return
    dragging.current = true
    lastMouse.current = { x: e.clientX, y: e.clientY }
  }
  function onMouseMove(e: React.MouseEvent) {
    if (!dragging.current) return
    canvas.current.ox += e.clientX - lastMouse.current.x
    canvas.current.oy += e.clientY - lastMouse.current.y
    lastMouse.current = { x: e.clientX, y: e.clientY }
    repaint(n => n + 1)
  }
  function stopDrag() { dragging.current = false }

  function zoomBy(factor: number) {
    const el = viewRef.current
    if (!el) return
    const c = canvas.current
    const mx = el.clientWidth / 2
    const my = el.clientHeight / 2
    const newZoom = Math.min(Math.max(c.zoom * factor, 0.08), 4)
    const scale = newZoom / c.zoom
    c.ox = mx - (mx - c.ox) * scale
    c.oy = my - (my - c.oy) * scale
    c.zoom = newZoom
    repaint(n => n + 1)
  }

  function fit() {
    const el = viewRef.current
    if (!el) return
    const vw = el.clientWidth
    const vh = el.clientHeight
    const cw = 11 * CANVAS_W + 10 * 40 + 160
    const ch = 3 * (CANVAS_H + 36 + 56) + 120
    const zoom = Math.min((vw - 120) / cw, (vh - 100) / ch, 1.2)
    canvas.current = { zoom, ox: (vw - cw * zoom) / 2, oy: 60 }
    repaint(n => n + 1)
  }

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
      if (e.key === '+' || e.key === '=') {
        if (e.metaKey || e.ctrlKey) e.preventDefault()
        zoomBy(1.15)
      }
      if (e.key === '-') {
        if (e.metaKey || e.ctrlKey) e.preventDefault()
        zoomBy(1 / 1.15)
      }
      if (e.key === '0') {
        if (e.metaKey || e.ctrlKey) e.preventDefault()
        fit()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onClose])

  const mp = (label: string, sk: string, progress: number, node: React.ReactNode) => ({ label, sk, progress, node })
  const flows = [
    {
      id: 'card', label: 'Card Flow', dot: '#60a5fa',
      screens: [
        mp('Payment Method', 'payment', 25, <PaymentMethodScreen onNext={() => {}} />),
        mp('Billing Address', 'address', 50, <AddressScreen onNext={() => {}} onBack={() => {}} paymentMethod="card" />),
        mp('Card Details', 'card', 75, <CardDetailsScreen onNext={() => {}} onBack={() => {}} />),
        mp('Review', 'review', 100, <ReviewScreen onNext={() => {}} onBack={() => {}} onChangeContextual={() => {}} onChangePaymentMethod={() => {}} paymentMethod="card" selectedStore="" />),
        mp('Change Sheet', 'changeSheet', 100, <ReviewScreen onNext={() => {}} onBack={() => {}} onChangeContextual={() => {}} onChangePaymentMethod={() => {}} paymentMethod="card" selectedStore="" defaultShowSheet />),
        mp('Success', 'success', 100, <SuccessScreen />),
      ],
    },
    {
      id: 'bank', label: 'Bank Flow', dot: '#a78bfa',
      screens: [
        mp('Payment Method', 'payment', 10, <PaymentMethodScreen onNext={() => {}} />),
        mp('Bank Consent', 'bankConsent', 20, <BankConsentScreen onNext={() => {}} onBack={() => {}} />),
        mp('Bank Address', 'address', 30, <AddressScreen onNext={() => {}} onBack={() => {}} paymentMethod="bank" />),
        mp('Connect Account', 'bankConnect', 40, <BankConnectScreen onNext={() => {}} onBack={() => {}} />),
        mp('Select Bank', 'stripeSelect', 50, <StripeBankSelectScreen onNext={() => {}} onBack={() => {}} />),
        mp('Stripe Intro', 'stripeIntro', 60, <StripeIntroScreen onNext={() => {}} onBack={() => {}} />),
        mp('Choose Account', 'stripeAccount', 70, <StripeAccountScreen onNext={() => {}} onBack={() => {}} />),
        mp('Save with Link', 'stripeLink', 80, <StripeLinkScreen onNext={() => {}} onBack={() => {}} />),
        mp('Connected', 'stripeComplete', 90, <StripeCompletedScreen onNext={() => {}} onBack={() => {}} />),
        mp('Review', 'review', 100, <ReviewScreen onNext={() => {}} onBack={() => {}} onChangeContextual={() => {}} onChangePaymentMethod={() => {}} paymentMethod="bank" selectedStore="" />),
        mp('Change Sheet', 'changeSheet', 100, <ReviewScreen onNext={() => {}} onBack={() => {}} onChangeContextual={() => {}} onChangePaymentMethod={() => {}} paymentMethod="bank" selectedStore="" defaultShowSheet />),
        mp('Success', 'success', 100, <SuccessScreen />),
      ],
    },
    {
      id: 'cash', label: 'Cash Flow', dot: '#4ade80',
      screens: [
        mp('Payment Method', 'payment', 25, <PaymentMethodScreen onNext={() => {}} />),
        mp('Cash Address', 'address', 50, <AddressScreen onNext={() => {}} onBack={() => {}} paymentMethod="cash" />),
        mp('Store Selection', 'store', 75, <StoreSelectionScreen onBack={() => {}} onNext={() => {}} />),
        mp('Review', 'review', 100, <ReviewScreen onNext={() => {}} onBack={() => {}} onChangeContextual={() => {}} onChangePaymentMethod={() => {}} paymentMethod="cash" selectedStore="walgreens" />),
        mp('Change Sheet', 'changeSheet', 100, <ReviewScreen onNext={() => {}} onBack={() => {}} onChangeContextual={() => {}} onChangePaymentMethod={() => {}} paymentMethod="cash" selectedStore="walgreens" defaultShowSheet />),
        mp('Success', 'success', 100, <SuccessScreen />),
      ],
    },
  ]

  // Derive selected screen info for the sidebar
  const selectedFlow = flows.find(f => f.screens.some(s => `${f.id}-${s.sk}` === selectedUid))
  const selectedScreen = selectedFlow?.screens.find(s => `${selectedFlow.id}-${s.sk}` === selectedUid)

  const { zoom, ox, oy } = canvas.current
  const btnCls = 'h-7 px-2.5 rounded-md text-[12px] font-semibold text-white/45 hover:text-white hover:bg-white/10 transition-colors'

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-[#1c1c1c] select-none">
      {/* Toolbar — full width */}
      <div className="shrink-0 flex items-center justify-between px-5 h-11 border-b border-white/[0.07]">
        <div className="flex items-center gap-3">
          <span className="text-[13px] font-semibold text-white/30">Flow Canvas</span>
          <a
            href="/fintech/tokens"
            className="h-7 px-3 rounded-md text-[12px] font-semibold bg-white/10 text-white/70 hover:bg-white/15 hover:text-white transition-colors flex items-center"
          >
            Tokens
          </a>
        </div>
        <div className="flex items-center gap-0.5">
          {/* Language toggles */}
          {languages.map(lang => {
            const label = lang.code === 'en' ? 'EN' : lang.code === 'es-mx' ? 'ES' : 'PT'
            const active = language === lang.code
            return (
              <button
                key={lang.code}
                onClick={() => onLanguageChange(lang.code)}
                className={`h-7 px-2.5 rounded-md text-[12px] font-semibold transition-colors ${
                  active ? 'bg-white/15 text-white' : 'text-white/35 hover:text-white hover:bg-white/10'
                }`}
              >
                {label}
              </button>
            )
          })}
          <div className="w-px h-4 bg-white/10 mx-2" />
          <button className={btnCls} onClick={() => zoomBy(1 / 1.2)}>−</button>
          <span className="text-[12px] tabular-nums text-white/35 w-12 text-center">{Math.round(zoom * 100)}%</span>
          <button className={btnCls} onClick={() => zoomBy(1.2)}>+</button>
          <div className="w-px h-4 bg-white/10 mx-2" />
          <button className={btnCls} onClick={fit}>Fit</button>
        </div>
        <button
          onClick={onClose}
          className="h-7 w-7 flex items-center justify-center rounded-md text-white/35 hover:text-white hover:bg-white/10 transition-colors text-[15px] leading-none"
        >
          ✕
        </button>
      </div>

      {/* Body — horizontal split */}
      <div className="flex-1 flex overflow-hidden">
        {/* Canvas viewport — takes remaining space */}
        <div
          ref={viewRef}
          className="flex-1 relative overflow-hidden"
          style={{ cursor: dragging.current ? 'grabbing' : 'grab' }}
          onMouseDown={onMouseDown}
          onMouseMove={onMouseMove}
          onMouseUp={stopDrag}
          onMouseLeave={stopDrag}
        >
          {/* Dot-grid background */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.07) 1px, transparent 1px)',
              backgroundSize: '24px 24px',
            }}
          />

          {/* Transformable canvas */}
          <div
            style={{
              position: 'absolute',
              transform: `translate(${ox}px, ${oy}px) scale(${zoom})`,
              transformOrigin: '0 0',
            }}
          >
            <div className="space-y-16">
              {flows.map(flow => (
                <div key={flow.id}>
                  <div className="flex items-center gap-2 mb-8">
                    <div className="h-1.5 w-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: flow.dot }} />
                    <p className="text-[11px] font-semibold text-white/22 uppercase tracking-widest">{flow.label}</p>
                    <div className="h-px w-32 bg-white/[0.05]" />
                  </div>
                  <div className="flex items-start">
                    {flow.screens.flatMap((screen, i) => {
                      const uid = `${flow.id}-${screen.sk}`
                      const nodes: React.ReactNode[] = [
                        <CanvasMiniPhone
                          key={uid}
                          label={screen.label}
                          uid={uid}
                          selectedUid={selectedUid}
                          onSelect={setSelectedUid}
                          progress={screen.progress}
                          editableContent={editableContent}
                          language={language}
                          status={statuses[uid] ?? 'todo'}
                        >
                          {screen.node}
                        </CanvasMiniPhone>,
                      ]
                      if (i < flow.screens.length - 1) nodes.push(<CanvasArrow key={`arrow-${i}`} />)
                      return nodes
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Hint */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-[11px] text-white/18 pointer-events-none">
            Scroll to pan · ⌘ scroll to zoom · Click a screen to inspect tokens
          </div>
        </div>

        {/* Right sidebar */}
        <CanvasSidebar
          selectedUid={selectedUid}
          screenLabel={selectedScreen?.label ?? ''}
          screenKey={selectedScreen?.sk ?? ''}
          tokens={editableContent}
          language={language}
          status={selectedUid ? (statuses[selectedUid] ?? 'todo') : 'todo'}
          onStatusChange={s => selectedUid && setStatus(selectedUid, s)}
          onChange={onChange}
          onDeselect={() => setSelectedUid(null)}
        />
      </div>
    </div>
  )
}

// ─── Top bar ──────────────────────────────────────────────────────────────────

function PhoneControls({ current, onChange }: { current: Language; onChange: (l: Language) => void }) {
  return (
    <div className="flex items-center justify-between w-full mb-4">
      <div className="flex items-center gap-1">
        {languages.map(lang => {
          const label = lang.code === 'en' ? 'EN' : lang.code === 'es-mx' ? 'ES-MX' : 'PT-BR'
          const active = current === lang.code
          return (
            <button
              key={lang.code}
              onClick={() => onChange(lang.code)}
              className={`px-3 py-1.5 rounded-full text-[13px] font-semibold transition-all ${
                active ? 'bg-slate text-linen' : 'text-slate/50 hover:text-slate'
              }`}
            >
              {label}
            </button>
          )
        })}
      </div>
      <a
        href="/fintech/tokens"
        className="text-[13px] font-semibold text-slate/50 hover:text-slate transition-colors"
      >
        Tokens →
      </a>
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function FintechTestFlowPage() {
  const [screen, setScreen] = useState<'payment' | 'address' | 'store' | 'card' | 'review' | 'success' | 'bankConsent' | 'bankConnect' | 'stripeSelect' | 'stripeIntro' | 'stripeAccount' | 'stripeLink' | 'stripeComplete'>('payment')
  const [paymentMethod, setPaymentMethod] = useState<string>('card')
  const [selectedStore, setSelectedStore] = useState<string>('')
  const [language, setLanguage] = useState<Language>('en')
  const [showCanvas, setShowCanvas] = useState(false)
  const [ready, setReady] = useState(false)

  // Read hash on mount and mark ready — prevents flash of prototype when refreshing in canvas view
  useEffect(() => {
    if (window.location.hash === '#canvas') setShowCanvas(true)
    setReady(true)
  }, [])

  // Sync canvas state to URL hash
  useEffect(() => {
    if (!ready) return
    const hash = showCanvas ? '#canvas' : ''
    if (window.location.hash !== hash) {
      window.history.replaceState(null, '', hash || window.location.pathname)
    }
  }, [showCanvas, ready])

  // Browser tab title
  useEffect(() => {
    document.title = showCanvas ? 'Checkout Experience: Canvas' : 'Checkout Experience: Prototype'
  }, [showCanvas])

  // Mutable token state — shared between the flow and the inspector
  const [editableContent, setEditableContent] = useState<Record<Language, ContentTokens>>(() =>
    JSON.parse(JSON.stringify(content))
  )

  // Load persisted edits on mount — merge over defaults so new sections are always present
  useEffect(() => {
    try {
      const saved = localStorage.getItem(INSPECTOR_STORAGE_KEY)
      if (saved) {
        const parsed = JSON.parse(saved) as Record<Language, ContentTokens>
        const merged = JSON.parse(JSON.stringify(content)) as Record<Language, ContentTokens>
        for (const lang of Object.keys(merged) as Language[]) {
          if (parsed[lang]) {
            for (const section of Object.keys(merged[lang]) as (keyof ContentTokens)[]) {
              if (parsed[lang][section]) {
                Object.assign(merged[lang][section], parsed[lang][section])
              }
            }
          }
        }
        setEditableContent(merged)
      }
    } catch {}
  }, [])

  function updateToken(section: keyof ContentTokens, key: string, lang: Language, value: string) {
    setEditableContent(prev => {
      const next = JSON.parse(JSON.stringify(prev))
      ;(next[lang][section] as Record<string, string>)[key] = value
      localStorage.setItem(INSPECTOR_STORAGE_KEY, JSON.stringify(next))
      return next
    })
  }

  if (!ready) return <div className="min-h-screen bg-stone" />

  return (
    <LangContext.Provider value={editableContent[language]}>
      <div className="min-h-screen bg-stone overflow-y-auto">
        <div className="flex justify-center gap-10 pt-8 px-8">

          {/* Phone column: controls above, device below */}
          <div className="flex flex-col items-stretch w-[390px] shrink-0">
            <PhoneControls current={language} onChange={setLanguage} />
            <PhoneFrame progress={{
              payment: 10, bankConsent: 20, address: 40, bankConnect: 45,
              stripeSelect: 50, stripeIntro: 60, stripeAccount: 70, stripeLink: 80, stripeComplete: 90,
              store: 75, card: 75, review: 100, success: 100,
            }[screen]}>
              {screen === 'payment' && (
                <PaymentMethodScreen onNext={(method) => {
                  setPaymentMethod(method)
                  setScreen(method === 'bank' ? 'bankConsent' : 'address')
                }} />
              )}
              {screen === 'bankConsent' && (
                <BankConsentScreen onBack={() => setScreen('payment')} onNext={() => setScreen('address')} />
              )}
              {screen === 'address' && (
                <AddressScreen
                  onBack={() => setScreen(paymentMethod === 'bank' ? 'bankConsent' : 'payment')}
                  onNext={() => setScreen(paymentMethod === 'cash' ? 'store' : paymentMethod === 'bank' ? 'bankConnect' : 'card')}
                  paymentMethod={paymentMethod}
                />
              )}
              {screen === 'bankConnect' && (
                <BankConnectScreen onBack={() => setScreen('address')} onNext={() => setScreen('stripeSelect')} />
              )}
              {screen === 'stripeSelect' && (
                <StripeBankSelectScreen onBack={() => setScreen('bankConnect')} onNext={() => setScreen('stripeIntro')} />
              )}
              {screen === 'stripeIntro' && (
                <StripeIntroScreen onBack={() => setScreen('stripeSelect')} onNext={() => setScreen('stripeAccount')} />
              )}
              {screen === 'stripeAccount' && (
                <StripeAccountScreen onBack={() => setScreen('stripeIntro')} onNext={() => setScreen('stripeLink')} />
              )}
              {screen === 'stripeLink' && (
                <StripeLinkScreen onBack={() => setScreen('stripeAccount')} onNext={() => setScreen('stripeComplete')} />
              )}
              {screen === 'stripeComplete' && (
                <StripeCompletedScreen onBack={() => setScreen('stripeLink')} onNext={() => setScreen('review')} />
              )}
              {screen === 'store' && (
                <StoreSelectionScreen onBack={() => setScreen('address')} onNext={(storeId) => { setSelectedStore(storeId); setScreen('review') }} />
              )}
              {screen === 'card' && (
                <CardDetailsScreen onBack={() => setScreen('address')} onNext={() => setScreen('review')} />
              )}
              {screen === 'review' && (
                <ReviewScreen
                  onBack={() => setScreen(paymentMethod === 'cash' ? 'store' : paymentMethod === 'bank' ? 'stripeComplete' : 'card')}
                  onNext={() => setScreen('success')}
                  onChangeContextual={() => setScreen(paymentMethod === 'cash' ? 'store' : paymentMethod === 'bank' ? 'stripeSelect' : 'card')}
                  onChangePaymentMethod={() => setScreen('payment')}
                  paymentMethod={paymentMethod}
                  selectedStore={selectedStore}
                />
              )}
              {screen === 'success' && (
                <SuccessScreen />
              )}
            </PhoneFrame>
            {/* Canvas toggle */}
            <button
              onClick={() => setShowCanvas(true)}
              className="mt-3 mx-auto flex items-center gap-1.5 text-[12px] font-semibold text-mocha/50 hover:text-mocha transition-colors py-1.5 px-3 rounded-full hover:bg-slate/5"
            >
              <Layers className="h-3.5 w-3.5" />
              View all screens
            </button>
          </div>

          {/* Inspector: top-aligned next to device */}
          <TokenInspector
            tokens={editableContent}
            language={language}
            screen={screen}
            onChange={updateToken}
          />
        </div>

      </div>

      {/* Full-screen canvas overlay */}
      {showCanvas && (
        <FlowCanvasOverlay
          editableContent={editableContent}
          language={language}
          onLanguageChange={setLanguage}
          onClose={() => setShowCanvas(false)}
          onChange={updateToken}
        />
      )}
    </LangContext.Provider>
  )
}
