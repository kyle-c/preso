'use client'

import { createContext, useContext, useEffect, useRef, useState } from 'react'
import { FelixLogo } from '@/components/design-system/felix-logo'
import { Button } from '@/components/ui/button'
import { FloatingInput } from '@/components/ui/floating-input'
import { ChevronLeft, Wifi, Battery, Signal, Lock, CreditCard, ChevronDown, MapPin } from 'lucide-react'
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
  { id: 'walgreens',   name: 'Walgreens',             fee: '$3.95', logo: '/stores/walgreens.png' },
  { id: 'cvs',         name: 'CVS Pharmacy',           fee: '$3.95', logo: '/stores/cvs.png'       },
  { id: '7eleven',     name: '7-Eleven',               fee: '$3.95', logo: '/stores/seven.png'     },
  { id: 'walmart',     name: 'Walmart',                fee: '$3.74', logo: '/stores/walmart.png'   },
  { id: 'caseys',      name: "Casey's",                fee: '$3.95', logo: '/stores/caseys.png'    },
  { id: 'officedepot', name: 'Office Depot OfficeMax', fee: '$3.95', logo: '/stores/odepot.png'    },
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
        {t.paymentMethod.titleLine1}<br />{t.paymentMethod.titleLine2}
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
          illustration="/illustrations/bank.svg"
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
          {isCash ? t.address.titleCash : t.address.titleBilling}
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
                  ? 'bg-white border-turquoise/50 ring-[3px] ring-turquoise/30'
                  : 'bg-white border-slate/20 shadow-sm'
              }`}
            >
              <div className="h-11 w-11 rounded-xl border border-slate/10 bg-white flex items-center justify-center flex-shrink-0 overflow-hidden p-1.5">
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

function ReviewScreen({ onNext, onBack, onChangePayment, paymentMethod, selectedStore }: {
  onNext: () => void
  onBack: () => void
  onChangePayment: () => void
  paymentMethod: string
  selectedStore: string
}) {
  const t = useT()
  const [feesExpanded, setFeesExpanded] = useState(false)

  const store = stores.find(s => s.id === selectedStore)
  const storeFee = paymentMethod === 'cash' ? parseFloat(store?.fee.replace('$', '') ?? '0') : 0
  const felixFee = 0
  const otherFees = 0
  const taxes = 0
  const total = 10 + storeFee + felixFee + otherFees + taxes
  const storeFeeLabel = t.review.storeFee.replace('{store}', store?.name ?? '')

  return (
    <div className="flex flex-col h-full">
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
              {paymentMethod === 'cash' ? <MapPin className="h-4 w-4 text-slate/40" /> : <CreditCard className="h-4 w-4 text-slate/40" />}
              <span className="font-semibold text-[14px] text-slate">
                {paymentMethod === 'cash' ? (store?.name ?? t.paymentMethod.cashName) : '**** 5164'}
              </span>
              <button onClick={onChangePayment} className="text-[13px] font-semibold text-mocha underline decoration-mocha underline-offset-4 hover:text-slate hover:decoration-slate ml-1">
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
        <PaperPlane />
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

// ─── Token inspector ──────────────────────────────────────────────────────────

const INSPECTOR_STORAGE_KEY = 'felix-content-tokens-v2'

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
  const [screen, setScreen] = useState<'payment' | 'address' | 'store' | 'card' | 'review' | 'success'>('payment')
  const [paymentMethod, setPaymentMethod] = useState<string>('card')
  const [selectedStore, setSelectedStore] = useState<string>('')
  const [language, setLanguage] = useState<Language>('en')

  // Mutable token state — shared between the flow and the inspector
  const [editableContent, setEditableContent] = useState<Record<Language, ContentTokens>>(() =>
    JSON.parse(JSON.stringify(content))
  )

  // Load persisted edits on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(INSPECTOR_STORAGE_KEY)
      if (saved) setEditableContent(JSON.parse(saved))
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

  return (
    <LangContext.Provider value={editableContent[language]}>
      <div className="min-h-screen bg-stone overflow-y-auto">
        <div className="flex justify-center gap-10 pt-8 px-8">

          {/* Phone column: controls above, device below */}
          <div className="flex flex-col items-stretch w-[390px] shrink-0">
            <PhoneControls current={language} onChange={setLanguage} />
            <PhoneFrame progress={{ payment: 25, address: 50, store: 75, card: 75, review: 100, success: 100 }[screen]}>
              {screen === 'payment' && (
                <PaymentMethodScreen onNext={(method) => { setPaymentMethod(method); setScreen('address') }} />
              )}
              {screen === 'address' && (
                <AddressScreen onBack={() => setScreen('payment')} onNext={() => setScreen(paymentMethod === 'cash' ? 'store' : 'card')} paymentMethod={paymentMethod} />
              )}
              {screen === 'store' && (
                <StoreSelectionScreen onBack={() => setScreen('address')} onNext={(storeId) => { setSelectedStore(storeId); setScreen('review') }} />
              )}
              {screen === 'card' && (
                <CardDetailsScreen onBack={() => setScreen('address')} onNext={() => setScreen('review')} />
              )}
              {screen === 'review' && (
                <ReviewScreen onBack={() => setScreen(paymentMethod === 'cash' ? 'store' : 'card')} onNext={() => setScreen('success')} onChangePayment={() => setScreen('payment')} paymentMethod={paymentMethod} selectedStore={selectedStore} />
              )}
              {screen === 'success' && (
                <SuccessScreen />
              )}
            </PhoneFrame>
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
    </LangContext.Provider>
  )
}
