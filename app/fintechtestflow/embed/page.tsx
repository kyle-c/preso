'use client'

import { useState } from 'react'
import { FelixLogo } from '@/components/design-system/felix-logo'
import { Button } from '@/components/ui/button'
import { FloatingInput } from '@/components/ui/floating-input'
import { FormField, formatCardNumber, formatExpiry, formatCVV } from '@/components-next/form-field'
import { Wifi, Battery, Signal, CreditCard, ChevronDown, Lock, MapPin, Building2 } from 'lucide-react'
import { content } from '../content'

const t = content['en']

/* ─── Shared ──────────────────────────────────────────────────────── */

function StatusBar() {
  return (
    <div className="flex items-center justify-between px-8 pt-[14px] h-[54px] bg-linen sticky top-0 z-40">
      <span className="text-[15px] font-semibold text-slate">9:41</span>
      <div className="flex items-center gap-1.5">
        <Signal className="h-3.5 w-3.5 text-slate" />
        <Wifi className="h-3.5 w-3.5 text-slate" />
        <Battery className="h-3.5 w-3.5 text-slate" />
      </div>
    </div>
  )
}

function ProgressBar({ progress }: { progress: number }) {
  return (
    <div className="h-[3px] bg-slate/10">
      <div className="h-full bg-turquoise transition-[width] duration-300 ease-out" style={{ width: `${progress}%` }} />
    </div>
  )
}

function ScreenHeader() {
  return (
    <div className="flex flex-col items-center pt-5 pb-4">
      <FelixLogo className="h-8 text-slate" />
      <div className="mt-3.5 rounded-full bg-turquoise px-2.5 py-0.5">
        <span className="text-[10px] font-semibold text-slate">{t.common.badge}</span>
      </div>
    </div>
  )
}

function ApplePayIcon({ className }: { className?: string }) {
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

/* ─── Screens ─────────────────────────────────────────────────────── */

function PaymentMethodScreen({ onNext }: { onNext: (method: string) => void }) {
  const [selected, setSelected] = useState<string>('card')

  return (
    <div className="flex flex-col px-5 pb-8">
      <ScreenHeader />

      <h1 className="font-display text-[26px] font-extrabold leading-tight tracking-tight text-slate mb-2">
        {t.paymentMethod.titleLine1}
      </h1>
      <div className="flex items-center gap-3 mb-3">
        <div className="flex-1 h-px bg-slate/15" />
        <span className="text-[12px] font-semibold text-mocha uppercase tracking-wider">{t.paymentMethod.subtitle}</span>
        <div className="flex-1 h-px bg-slate/15" />
      </div>

      <button
        onClick={() => onNext('apple')}
        className="w-full flex items-center justify-center bg-slate rounded-2xl py-3 hover:bg-slate/90 active:scale-[0.98] transition-all"
      >
        <ApplePayIcon className="h-7 w-auto fill-linen" />
      </button>

      <div className="flex items-center gap-3 my-4">
        <div className="flex-1 h-px bg-slate/15" />
        <span className="text-[11px] font-medium text-mocha uppercase tracking-wider">{t.paymentMethod.orPayAnotherWay}</span>
        <div className="flex-1 h-px bg-slate/15" />
      </div>

      <div className="space-y-3">
        {([
          { id: 'card', title: t.paymentMethod.creditDebitName, desc: t.paymentMethod.creditDebitDesc, badges: [t.paymentMethod.badgeNoFeeDebit, t.paymentMethod.badgeInstant], illo: '/illustrations/card.svg', imgH: 'h-[40px]' },
          { id: 'bank', title: t.paymentMethod.bankName, desc: t.paymentMethod.bankDesc, badges: [t.paymentMethod.badgeNoFee, t.paymentMethod.badgeBusinessDays], illo: '/illustrations/Bank.svg', imgH: 'h-[56px]' },
          { id: 'cash', title: t.paymentMethod.cashName, desc: t.paymentMethod.cashDesc, badges: [t.paymentMethod.badgeCashFee, t.paymentMethod.badgeSameDay], illo: '/illustrations/cash.svg', imgH: 'h-[52px]' },
        ] as const).map((m) => (
          <button
            key={m.id}
            onClick={() => setSelected(m.id)}
            className={`relative w-full text-left rounded-2xl p-5 border transition-all overflow-hidden ${
              selected === m.id ? 'bg-white border-slate/60 shadow-lg' : 'bg-white border-slate/20 shadow-sm'
            }`}
          >
            <div className="flex items-center justify-between gap-2">
              <p className="font-bold text-[17px] text-slate">{m.title}</p>
              {selected === m.id && (
                <span className="flex-shrink-0 bg-turquoise text-slate text-[11px] font-semibold px-2.5 py-1 rounded-full">
                  {t.common.selected}
                </span>
              )}
            </div>
            <p className="text-[13px] text-mocha mt-1.5 leading-snug max-w-[80%]">{m.desc}</p>
            <div className="mt-3 flex gap-2 flex-wrap">
              {m.badges.map(b => <BadgePill key={b} label={b} />)}
            </div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={m.illo} alt="" aria-hidden className={`absolute bottom-3 right-3 w-auto pointer-events-none ${m.imgH}`} />
          </button>
        ))}
      </div>

      <div className="mt-5 space-y-2.5">
        <Button size="lg" className="w-full text-[15px]" onClick={() => onNext(selected)} disabled={!selected}>
          {t.common.continue}
        </Button>
      </div>
    </div>
  )
}

function AddressScreen({ onNext, onBack, paymentMethod }: { onNext: () => void; onBack: () => void; paymentMethod: string }) {
  const [address, setAddress] = useState('')
  const [zip, setZip] = useState('')
  const [city, setCity] = useState('')
  const [state, setState] = useState('')
  const [touched, setTouched] = useState(false)
  const isCash = paymentMethod === 'cash'
  const isBank = paymentMethod === 'bank'

  const validateAddress = (v: string) => !v ? 'Address is required' : undefined
  const validateZip = (v: string) => !v ? 'ZIP code is required' : !/^\d{5}$/.test(v) ? 'Enter a valid 5-digit ZIP' : undefined
  const validateCity = (v: string) => !v ? 'City is required' : undefined

  const canContinue = !validateAddress(address) && !validateZip(zip) && !validateCity(city) && !!state

  const fieldClass = '!rounded-2xl bg-white'
  const labelClass = 'bg-white text-mocha'

  return (
    <div className="flex flex-col h-full">
      <ScreenHeader />
      <div className="flex-1 px-6 pb-6 overflow-y-auto">
        <h1 className="font-display text-[22px] font-extrabold leading-tight tracking-tight text-slate mb-2">
          {isCash ? t.address.titleCash : isBank ? t.address.titleBank : t.address.titleBilling}
        </h1>
        {isCash && <p className="text-[14px] text-mocha mb-5 leading-snug">{t.address.helperCash}</p>}
        {!isCash && <div className="mb-6" />}

        <div className="space-y-4">
          <FormField label={t.address.fieldAddress} className={fieldClass} labelClassName={labelClass} value={address} onChange={setAddress} validate={validateAddress} />
          <FloatingInput label={t.address.fieldApt} className={fieldClass} labelClassName={labelClass} />
          <FormField label={t.address.fieldZip} className={fieldClass} labelClassName={labelClass} value={zip} onChange={setZip} format={(v) => v.replace(/\D/g, '').slice(0, 5)} validate={validateZip} inputMode="numeric" />
          <FormField label={t.address.fieldCity} className={fieldClass} labelClassName={labelClass} value={city} onChange={setCity} validate={validateCity} />
          <div className="relative">
            <select
              value={state}
              onChange={e => { setState(e.target.value); setTouched(true) }}
              onBlur={() => setTouched(true)}
              className={`h-14 w-full rounded-2xl bg-white border px-4 pr-10 text-base appearance-none transition-colors outline-none cursor-pointer focus:ring-[3px] ${
                touched && !state
                  ? 'border-destructive ring-[3px] ring-destructive/20 text-slate'
                  : state
                    ? 'border-turquoise/60 focus:border-turquoise focus:ring-turquoise/25 text-slate'
                    : 'border-border focus:border-turquoise focus:ring-turquoise/25 text-muted-foreground'
              }`}
            >
              <option value="" disabled>{t.address.fieldState}</option>
              {['AL','AK','AZ','AR','CA','CO','CT','DE','FL','GA','HI','ID','IL','IN','IA','KS','KY','LA','ME','MD','MA','MI','MN','MS','MO','MT','NE','NV','NH','NJ','NM','NY','NC','ND','OH','OK','OR','PA','RI','SC','SD','TN','TX','UT','VT','VA','WA','WV','WI','WY'].map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
          </div>
        </div>

        <div className="pt-8 space-y-2.5">
          <Button size="lg" className="w-full text-[15px]" onClick={onNext} disabled={!canContinue}>{t.common.continue}</Button>
          <Button variant="outline" size="lg" className="w-full text-[15px]" onClick={onBack}>{t.common.previous}</Button>
        </div>
      </div>
    </div>
  )
}

function CardDetailsScreen({ onNext, onBack }: { onNext: () => void; onBack: () => void }) {
  const [name, setName] = useState('')
  const [cardNumber, setCardNumber] = useState('')
  const [expiry, setExpiry] = useState('')
  const [cvv, setCvv] = useState('')

  const validateName = (v: string) => !v ? 'Name is required' : undefined
  const validateCard = (v: string) => !v ? 'Card number is required' : v.replace(/\s/g, '').length < 16 ? 'Enter a 16-digit card number' : undefined
  const validateExpiry = (v: string) => {
    if (!v) return 'Expiry date is required'
    if (!/^\d{2}\/\d{2}$/.test(v)) return 'Use MM/YY format'
    const month = parseInt(v.slice(0, 2))
    if (month < 1 || month > 12) return 'Invalid month'
    return undefined
  }
  const validateCvv = (v: string) => !v ? 'CVV is required' : !/^\d{3,4}$/.test(v) ? 'Enter 3 or 4 digits' : undefined

  const canContinue = !validateName(name) && !validateCard(cardNumber) && !validateExpiry(expiry) && !validateCvv(cvv)

  const fieldClass = '!rounded-2xl bg-white'
  const labelClass = 'bg-white text-mocha'

  return (
    <div className="flex flex-col h-full">
      <ScreenHeader />
      <div className="flex-1 px-6 pb-6 overflow-y-auto">
        <h1 className="font-display text-[22px] font-extrabold leading-tight tracking-tight text-slate mb-6">
          {t.cardDetails.title}
        </h1>

        <div className="space-y-4">
          <div>
            <FormField label={t.cardDetails.fieldFullName} className={fieldClass} labelClassName={labelClass} value={name} onChange={setName} validate={validateName} autoComplete="cc-name" />
            {!validateName(name) || !name ? <p className="text-[12px] text-mocha mt-1.5 px-1 leading-snug">{t.cardDetails.helperName}</p> : null}
          </div>
          <FormField label={t.cardDetails.fieldCardNumber} className={fieldClass} labelClassName={labelClass} value={cardNumber} onChange={setCardNumber} format={formatCardNumber} validate={validateCard} inputMode="numeric" autoComplete="cc-number" />
          <FormField label={t.cardDetails.fieldExpiry} className={fieldClass} labelClassName={labelClass} value={expiry} onChange={setExpiry} format={formatExpiry} validate={validateExpiry} inputMode="numeric" autoComplete="cc-exp" maxLength={5} />
          <FormField label={t.cardDetails.fieldCvv} className={fieldClass} labelClassName={labelClass} value={cvv} onChange={setCvv} format={formatCVV} validate={validateCvv} inputMode="numeric" autoComplete="cc-csc" maxLength={4} />
        </div>

        <div className="pt-8 space-y-3">
          <Button size="lg" className="w-full text-[15px]" onClick={onNext} disabled={!canContinue}>{t.common.continue}</Button>
          <Button variant="outline" size="lg" className="w-full text-[15px]" onClick={onBack}>{t.common.previous}</Button>
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

function ReviewScreen({ onNext, onBack, paymentMethod }: { onNext: () => void; onBack: () => void; paymentMethod: string }) {
  const [feesExpanded, setFeesExpanded] = useState(false)

  return (
    <div className="flex flex-col h-full">
      <ScreenHeader />
      <div className="flex-1 px-5 pb-4 overflow-y-auto">
        <h1 className="font-display text-[24px] font-extrabold leading-tight tracking-tight text-slate mt-4 mb-6">
          {t.review.title}
        </h1>

        <div className="bg-white rounded-2xl border border-slate/15 overflow-hidden divide-y divide-slate/10 mb-5">
          <div className="px-4 py-3.5 flex items-center justify-between">
            <span className="text-[13px] text-mocha">{t.review.youSend}</span>
            <span className="font-bold text-[16px] text-slate">USD $10.00</span>
          </div>
          <div className="px-4 py-3.5 flex items-center justify-between">
            <span className="text-[13px] text-mocha">{t.review.recipientGets}</span>
            <span className="font-bold text-[16px] text-slate">MXN $174.20</span>
          </div>
          <div className="px-4 py-3.5 flex items-center justify-between">
            <span className="text-[13px] text-mocha">{t.review.paymentMethodLabel}</span>
            <div className="flex items-center gap-2">
              {paymentMethod === 'apple' ? <ApplePayIcon className="h-4 w-auto fill-slate/40" /> : paymentMethod === 'bank' ? <Building2 className="h-4 w-4 text-slate/40" /> : paymentMethod === 'cash' ? <MapPin className="h-4 w-4 text-slate/40" /> : <CreditCard className="h-4 w-4 text-slate/40" />}
              <span className="font-semibold text-[14px] text-slate">
                {paymentMethod === 'apple' ? 'Apple Pay' : paymentMethod === 'bank' ? 'Bank account' : paymentMethod === 'cash' ? 'Cash at store' : '**** 5164'}
              </span>
            </div>
          </div>
          <button onClick={() => setFeesExpanded(v => !v)} className="w-full px-4 py-3.5 flex items-center justify-between text-left">
            <span className="text-[13px] text-mocha">{t.review.amountFees}</span>
            <div className="flex items-center gap-1">
              <span className="font-semibold text-[14px] text-slate">USD $10.00</span>
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
                  <span className="text-[12px] text-slate font-medium">+ USD 0.00</span>
                </div>
                <div className="px-4 py-2.5 flex items-center justify-between">
                  <span className="text-[12px] text-mocha">{t.review.otherFees}</span>
                  <span className="text-[12px] text-slate font-medium">+ USD 0.00</span>
                </div>
                <div className="px-4 py-3 flex items-center justify-between border-t border-slate/15">
                  <span className="text-[13px] font-bold text-slate">{t.review.total}</span>
                  <span className="text-[13px] font-bold text-slate">USD 10.00</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-2.5 mb-4">
          <Button size="lg" className="w-full text-[15px]" onClick={onNext}>{t.review.sendNow}</Button>
          <Button variant="outline" size="lg" className="w-full text-[15px]" onClick={onBack}>{t.common.previous}</Button>
        </div>

        <p className="text-[11px] text-mocha leading-relaxed text-center">
          {t.review.legal}{' '}
          <span className="underline decoration-mocha underline-offset-2">{t.review.learnMore}</span>
        </p>
      </div>
    </div>
  )
}

function SuccessScreen({ onRestart }: { onRestart: () => void }) {
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
          {t.success.shareWhatsApp}
        </Button>
      </div>

      <Button variant="outline" size="lg" className="w-full text-[15px]" onClick={onRestart}>
        Send another
      </Button>
    </div>
  )
}

/* ─── Main ────────────────────────────────────────────────────────── */

type Screen = 'payment' | 'address' | 'card' | 'review' | 'success'

const progressMap: Record<Screen, number> = {
  payment: 10,
  address: 40,
  card: 70,
  review: 100,
  success: 100,
}

export default function FintechEmbedPage() {
  const [screen, setScreen] = useState<Screen>('payment')
  const [paymentMethod, setPaymentMethod] = useState('card')

  return (
    <div className="h-screen bg-linen flex flex-col overflow-hidden">
      <StatusBar />
      <ProgressBar progress={progressMap[screen]} />
      <div className="flex-1 overflow-y-auto">
        {screen === 'payment' && (
          <PaymentMethodScreen onNext={(method) => {
            setPaymentMethod(method)
            setScreen('address')
          }} />
        )}
        {screen === 'address' && (
          <AddressScreen
            paymentMethod={paymentMethod}
            onNext={() => setScreen(paymentMethod === 'apple' ? 'review' : 'card')}
            onBack={() => setScreen('payment')}
          />
        )}
        {screen === 'card' && (
          <CardDetailsScreen
            onNext={() => setScreen('review')}
            onBack={() => setScreen('address')}
          />
        )}
        {screen === 'review' && (
          <ReviewScreen
            paymentMethod={paymentMethod}
            onNext={() => setScreen('success')}
            onBack={() => setScreen(paymentMethod === 'apple' ? 'address' : 'card')}
          />
        )}
        {screen === 'success' && (
          <SuccessScreen onRestart={() => { setScreen('payment'); setPaymentMethod('card') }} />
        )}
      </div>
    </div>
  )
}
