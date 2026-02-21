'use client'

import { useState } from 'react'
import { FelixLogo } from '@/components/design-system/felix-logo'
import { Button } from '@/components/ui/button'
import { FloatingInput } from '@/components/ui/floating-input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { ChevronLeft, Wifi, Battery, Signal, Lock, CreditCard, ChevronDown } from 'lucide-react'

function PhoneFrame({ children }: { children: React.ReactNode }) {
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
      <div className="h-full w-full overflow-y-auto bg-linen pt-[54px] pb-[34px]">
        {children}
      </div>
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-50 w-[134px] h-[5px] rounded-full bg-slate" />
    </div>
  )
}

const badge = (label: string) => (
  <span className="inline-block border border-slate/30 text-slate text-[12px] font-semibold px-3 py-1 rounded-full">
    {label}
  </span>
)

function PaymentMethodScreen({ onNext }: { onNext: () => void }) {
  const [selected, setSelected] = useState<string | null>(null)

  const cardClass = (id: string) =>
    `relative w-full text-left rounded-2xl p-5 border transition-all ${
      selected === id
        ? 'bg-white border-turquoise/50 ring-[3px] ring-turquoise/30'
        : 'bg-white border-slate/20 shadow-sm'
    }`

  return (
    <div className="flex flex-col px-5 pb-8">
      <div className="flex flex-col items-center pt-4 pb-1">
        <FelixLogo className="h-8 text-slate" />
        <div className="mt-2.5 rounded-full bg-stone px-2.5 py-0.5">
          <span className="text-[10px] font-semibold text-slate">
            Authorized UniTeller Agent
          </span>
        </div>
      </div>

      {/* Progress */}
      <div className="flex items-center gap-3 px-1 py-3">
        <div className="h-9 w-9 flex-shrink-0" />
        <div className="flex flex-1 gap-1.5">
          <div className="h-1.5 flex-1 rounded-full bg-slate" />
          <div className="h-1.5 flex-1 rounded-full bg-slate/20" />
          <div className="h-1.5 flex-1 rounded-full bg-slate/20" />
          <div className="h-1.5 flex-1 rounded-full bg-slate/20" />
        </div>
        <div className="w-9 flex-shrink-0" />
      </div>

      <h1 className="font-display text-[26px] font-extrabold leading-tight tracking-tight text-slate mb-2">
        Almost done.<br />How do you want to pay?
      </h1>
      <p className="text-[15px] text-slate/60 mb-5">
        Pick whatever's easiest for you.
      </p>

      <div className="space-y-3">
        {/* Credit/debit card */}
        <button className={cardClass('card')} onClick={() => setSelected('card')}>
          {selected === 'card' && <span className="absolute top-4 right-4 bg-turquoise text-slate text-[11px] font-semibold px-2.5 py-1 rounded-full">Selected</span>}
          <p className="font-bold text-[17px] text-slate">Credit/debit card</p>
          <p className="text-[13px] text-mocha mt-1.5 leading-snug">
            Credit cards may have extra fees from your issuer.
          </p>
          <div className="mt-3 flex gap-2">
            {badge('No fee for debit')}
            {badge('Instant')}
          </div>
        </button>

        {/* Bank account */}
        <button className={cardClass('bank')} onClick={() => setSelected('bank')}>
          {selected === 'bank' && <span className="absolute top-4 right-4 bg-turquoise text-slate text-[11px] font-semibold px-2.5 py-1 rounded-full">Selected</span>}
          <p className="font-bold text-[17px] text-slate">Bank account</p>
          <div className="mt-3 flex gap-2">
            {badge('No fee')}
            {badge('1–3 business days')}
          </div>
        </button>

        {/* Cash at a store */}
        <button className={cardClass('cash')} onClick={() => setSelected('cash')}>
          {selected === 'cash' && <span className="absolute top-4 right-4 bg-turquoise text-slate text-[11px] font-semibold px-2.5 py-1 rounded-full">Selected</span>}
          <p className="font-bold text-[17px] text-slate">Cash at a store</p>
          <p className="text-[13px] text-mocha mt-1.5 leading-snug">
            Find a store near you — available in Florida and 33 other states.
          </p>
          <div className="mt-3 flex gap-2">
            {badge('$3.95')}
            {badge('Same day')}
          </div>
        </button>
      </div>

      <div className="mt-5 space-y-2.5">
        <Button size="lg" className="w-full text-[15px]" onClick={onNext} disabled={!selected}>
          Continue
        </Button>
        <Button variant="outline" size="lg" className="w-full text-[15px]">
          Cancel
        </Button>
      </div>

    </div>
  )
}

function AddressScreen({ onNext, onBack }: { onNext: () => void; onBack: () => void }) {
  const [address, setAddress] = useState('')
  const [zip, setZip] = useState('')
  const [city, setCity] = useState('')
  const [state, setState] = useState('')
  const canContinue = address && zip && city && state

  return (
    <div className="flex flex-col h-full">
      <div className="flex flex-col items-center pt-4 pb-1">
        <FelixLogo className="h-8 text-slate" />
        <div className="mt-2.5 rounded-full bg-stone px-2.5 py-0.5">
          <span className="text-[10px] font-semibold text-slate">
            Authorized UniTeller Agent
          </span>
        </div>
      </div>

      <div className="flex items-center gap-3 px-6 py-3">
        <button
          onClick={onBack}
          className="flex h-9 w-9 items-center justify-center rounded-full border border-slate/15 text-slate hover:bg-white"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <div className="flex flex-1 gap-1.5">
          <div className="h-1.5 flex-1 rounded-full bg-slate" />
          <div className="h-1.5 flex-1 rounded-full bg-slate" />
          <div className="h-1.5 flex-1 rounded-full bg-slate/20" />
          <div className="h-1.5 flex-1 rounded-full bg-slate/20" />
        </div>
        <div className="w-9 flex-shrink-0" />
      </div>

      <div className="flex-1 px-6 pb-6 overflow-y-auto">
        <h1 className="font-display text-[22px] font-extrabold leading-tight tracking-tight text-slate mb-6">
          What's the billing address on your card?
        </h1>

        <div className="space-y-4">
          <FloatingInput label="Address *" className="!rounded-2xl bg-white [&+label]:bg-white [&+label]:text-mocha" value={address} onChange={e => setAddress(e.target.value)} />
          <FloatingInput label="Apt, suite, or floor" className="!rounded-2xl bg-white [&+label]:bg-white [&+label]:text-mocha" />
          <FloatingInput label="ZIP Code *" className="!rounded-2xl bg-white [&+label]:bg-white [&+label]:text-mocha" value={zip} onChange={e => setZip(e.target.value)} />
          <FloatingInput label="City *" className="!rounded-2xl bg-white [&+label]:bg-white [&+label]:text-mocha" value={city} onChange={e => setCity(e.target.value)} />
          <Select onValueChange={setState}>
            <SelectTrigger className="!h-14 w-full rounded-2xl bg-white px-4 text-base data-[placeholder]:text-muted-foreground">
              <SelectValue placeholder="State *" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="AL">Alabama</SelectItem>
              <SelectItem value="AK">Alaska</SelectItem>
              <SelectItem value="AZ">Arizona</SelectItem>
              <SelectItem value="AR">Arkansas</SelectItem>
              <SelectItem value="CA">California</SelectItem>
              <SelectItem value="CO">Colorado</SelectItem>
              <SelectItem value="CT">Connecticut</SelectItem>
              <SelectItem value="DE">Delaware</SelectItem>
              <SelectItem value="FL">Florida</SelectItem>
              <SelectItem value="GA">Georgia</SelectItem>
              <SelectItem value="HI">Hawaii</SelectItem>
              <SelectItem value="ID">Idaho</SelectItem>
              <SelectItem value="IL">Illinois</SelectItem>
              <SelectItem value="IN">Indiana</SelectItem>
              <SelectItem value="IA">Iowa</SelectItem>
              <SelectItem value="KS">Kansas</SelectItem>
              <SelectItem value="KY">Kentucky</SelectItem>
              <SelectItem value="LA">Louisiana</SelectItem>
              <SelectItem value="ME">Maine</SelectItem>
              <SelectItem value="MD">Maryland</SelectItem>
              <SelectItem value="MA">Massachusetts</SelectItem>
              <SelectItem value="MI">Michigan</SelectItem>
              <SelectItem value="MN">Minnesota</SelectItem>
              <SelectItem value="MS">Mississippi</SelectItem>
              <SelectItem value="MO">Missouri</SelectItem>
              <SelectItem value="MT">Montana</SelectItem>
              <SelectItem value="NE">Nebraska</SelectItem>
              <SelectItem value="NV">Nevada</SelectItem>
              <SelectItem value="NH">New Hampshire</SelectItem>
              <SelectItem value="NJ">New Jersey</SelectItem>
              <SelectItem value="NM">New Mexico</SelectItem>
              <SelectItem value="NY">New York</SelectItem>
              <SelectItem value="NC">North Carolina</SelectItem>
              <SelectItem value="ND">North Dakota</SelectItem>
              <SelectItem value="OH">Ohio</SelectItem>
              <SelectItem value="OK">Oklahoma</SelectItem>
              <SelectItem value="OR">Oregon</SelectItem>
              <SelectItem value="PA">Pennsylvania</SelectItem>
              <SelectItem value="RI">Rhode Island</SelectItem>
              <SelectItem value="SC">South Carolina</SelectItem>
              <SelectItem value="SD">South Dakota</SelectItem>
              <SelectItem value="TN">Tennessee</SelectItem>
              <SelectItem value="TX">Texas</SelectItem>
              <SelectItem value="UT">Utah</SelectItem>
              <SelectItem value="VT">Vermont</SelectItem>
              <SelectItem value="VA">Virginia</SelectItem>
              <SelectItem value="WA">Washington</SelectItem>
              <SelectItem value="WV">West Virginia</SelectItem>
              <SelectItem value="WI">Wisconsin</SelectItem>
              <SelectItem value="WY">Wyoming</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="pt-8 space-y-2.5">
          <Button size="lg" className="w-full text-[15px]" onClick={onNext} disabled={!canContinue}>
            Continue
          </Button>
          <Button variant="outline" size="lg" className="w-full text-[15px]">
            Cancel
          </Button>
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
  const canContinue = name && cardNumber && expiry && cvv

  return (
    <div className="flex flex-col h-full">
      <div className="flex flex-col items-center pt-4 pb-1">
        <FelixLogo className="h-8 text-slate" />
        <div className="mt-2.5 rounded-full bg-stone px-2.5 py-0.5">
          <span className="text-[10px] font-semibold text-slate">
            Authorized UniTeller Agent
          </span>
        </div>
      </div>

      <div className="flex items-center gap-3 px-6 py-3">
        <button
          onClick={onBack}
          className="flex h-9 w-9 items-center justify-center rounded-full border border-slate/15 text-slate hover:bg-white"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <div className="flex flex-1 gap-1.5">
          <div className="h-1.5 flex-1 rounded-full bg-slate" />
          <div className="h-1.5 flex-1 rounded-full bg-slate" />
          <div className="h-1.5 flex-1 rounded-full bg-slate" />
          <div className="h-1.5 flex-1 rounded-full bg-slate/20" />
        </div>
        <div className="w-9 flex-shrink-0" />
      </div>

      <div className="flex-1 px-6 pb-6 overflow-y-auto">
        <h1 className="font-display text-[22px] font-extrabold leading-tight tracking-tight text-slate mb-6">
          Enter your card details
        </h1>

        <div className="space-y-4">
          <div>
            <FloatingInput label="Full name on card *" className="!rounded-2xl bg-white [&+label]:bg-white [&+label]:text-mocha" value={name} onChange={e => setName(e.target.value)} />
            <p className="text-[12px] text-mocha mt-1.5 px-1 leading-snug">
              If your card shows a bank name, enter the account holder's name.
            </p>
          </div>
          <FloatingInput label="Card number *" className="!rounded-2xl bg-white [&+label]:bg-white [&+label]:text-mocha" value={cardNumber} onChange={e => setCardNumber(e.target.value)} />
          <FloatingInput label="Expiry date * (MM / YY)" className="!rounded-2xl bg-white [&+label]:bg-white [&+label]:text-mocha" value={expiry} onChange={e => setExpiry(e.target.value)} />
          <FloatingInput label="CVV *" className="!rounded-2xl bg-white [&+label]:bg-white [&+label]:text-mocha" value={cvv} onChange={e => setCvv(e.target.value)} />
        </div>

        <div className="pt-8 space-y-3">
          <Button size="lg" className="w-full text-[15px]" onClick={onNext} disabled={!canContinue}>
            Continue
          </Button>
          <p className="text-[11px] text-mocha text-center leading-relaxed px-2">
            By tapping Continue, you agree to our{' '}
            <span className="text-mocha underline underline-offset-2">terms and conditions</span>
            {' '}and{' '}
            <span className="text-mocha underline underline-offset-2">privacy policy</span>.
          </p>
          <div className="mt-4 rounded-2xl bg-blueberry/10 px-4 py-3.5 flex gap-3 items-start">
            <Lock className="h-4 w-4 text-blueberry mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-[13px] font-semibold text-blueberry">Your payment is safe with us</p>
              <p className="text-[13px] text-blueberry/70 mt-0.5">
                Encrypted with 256-bit SSL — your info stays private.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function ReviewScreen({ onNext, onBack }: { onNext: () => void; onBack: () => void }) {
  return (
    <div className="flex flex-col h-full">
      <div className="flex flex-col items-center pt-4 pb-1">
        <FelixLogo className="h-8 text-slate" />
        <div className="mt-2.5 rounded-full bg-stone px-2.5 py-0.5">
          <span className="text-[10px] font-semibold text-slate">
            Authorized UniTeller Agent
          </span>
        </div>
      </div>

      <div className="flex items-center gap-3 px-6 py-3">
        <button
          onClick={onBack}
          className="flex h-9 w-9 items-center justify-center rounded-full border border-slate/15 text-slate hover:bg-white"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <div className="flex flex-1 gap-1.5">
          <div className="h-1.5 flex-1 rounded-full bg-slate" />
          <div className="h-1.5 flex-1 rounded-full bg-slate" />
          <div className="h-1.5 flex-1 rounded-full bg-slate" />
          <div className="h-1.5 flex-1 rounded-full bg-slate" />
        </div>
        <div className="w-9 flex-shrink-0" />
      </div>

      <div className="flex-1 px-5 pb-4 overflow-y-auto">
        <h1 className="font-display text-[24px] font-extrabold leading-tight tracking-tight text-slate mt-4 mb-6">
          Review your transfer to Patricia Caballero
        </h1>

        {/* Receipt card */}
        <div className="bg-white rounded-2xl border border-slate/15 overflow-hidden divide-y divide-slate/10 mb-5">
          <div className="px-4 py-3.5 flex items-center justify-between">
            <span className="text-[13px] text-mocha">You send</span>
            <span className="font-bold text-[16px] text-slate">🇺🇸 USD $10.00</span>
          </div>
          <div className="px-4 py-3.5 flex items-center justify-between">
            <span className="text-[13px] text-mocha">Recipient gets</span>
            <span className="font-bold text-[16px] text-slate">🇲🇽 MXN $174.20</span>
          </div>
          <div className="px-4 py-3.5 flex items-center justify-between">
            <span className="text-[13px] text-mocha">Payment method</span>
            <div className="flex items-center gap-2">
              <CreditCard className="h-4 w-4 text-slate/40" />
              <span className="font-semibold text-[14px] text-slate">**** 5164</span>
              <button className="text-[13px] font-semibold text-mocha underline decoration-mocha underline-offset-4 hover:text-slate hover:decoration-slate ml-1">Change</button>
            </div>
          </div>
          <div className="px-4 py-3.5 flex items-center justify-between">
            <span className="text-[13px] text-mocha">Amount + fees</span>
            <div className="flex items-center gap-1">
              <span className="font-semibold text-[14px] text-slate">USD $10.00</span>
              <ChevronDown className="h-4 w-4 text-slate/40" />
            </div>
          </div>
        </div>

        <Button size="lg" className="w-full text-[15px] mb-4" onClick={onNext}>
          Send now
        </Button>

        <p className="text-[11px] text-mocha leading-relaxed text-center">
          For questions or complaints about Zero Hash LLC, contact your state's regulatory agency.{' '}
          <span className="text-mocha underline decoration-mocha underline-offset-2 hover:text-slate hover:decoration-slate">Learn more.</span>
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
  return (
    <div className="flex flex-col h-full px-5 pb-8">
      <div className="flex flex-col items-center pt-4 pb-1">
        <FelixLogo className="h-8 text-slate" />
        <div className="mt-2.5 rounded-full bg-stone px-2.5 py-0.5">
          <span className="text-[10px] font-semibold text-slate">
            Authorized UniTeller Agent
          </span>
        </div>
      </div>

      <div className="flex justify-center py-5">
        <PaperPlane />
      </div>

      <div className="text-center mb-6">
        <h1 className="font-display text-[28px] font-extrabold leading-tight tracking-tight text-slate mb-3">
          Your payment went through!
        </h1>
        <p className="text-[14px] text-slate/60 leading-relaxed">
          💸 Patricia Caballero will receive 52.26 MXN for your $3 USD transfer.
        </p>
      </div>

      {/* Referral */}
      <div className="bg-slate rounded-2xl p-5 mb-3 text-center">
        <p className="font-display text-[20px] font-extrabold text-white mb-1">
          Earn up to $1,000 USD
        </p>
        <p className="text-[13px] text-white/60 mb-4 leading-snug">
          Earn $20 USD for each friend who makes their first transfer
        </p>
        <Button
          size="lg"
          className="w-full bg-[#22c55e] hover:bg-[#16a34a] text-white font-semibold text-[15px] border-0"
        >
          📱 Share on WhatsApp
        </Button>
      </div>

      <Button variant="outline" size="lg" className="w-full text-[15px]">
        Back to WhatsApp
      </Button>
    </div>
  )
}

export default function FintechTestFlowPage() {
  const [screen, setScreen] = useState<'payment' | 'address' | 'card' | 'review' | 'success'>('payment')

  return (
    <div className="flex min-h-screen items-center justify-center bg-stone p-8">
      <PhoneFrame>
        {screen === 'payment' && (
          <PaymentMethodScreen onNext={() => setScreen('address')} />
        )}
        {screen === 'address' && (
          <AddressScreen onBack={() => setScreen('payment')} onNext={() => setScreen('card')} />
        )}
        {screen === 'card' && (
          <CardDetailsScreen onBack={() => setScreen('address')} onNext={() => setScreen('review')} />
        )}
        {screen === 'review' && (
          <ReviewScreen onBack={() => setScreen('card')} onNext={() => setScreen('success')} />
        )}
        {screen === 'success' && (
          <SuccessScreen />
        )}
      </PhoneFrame>
    </div>
  )
}
