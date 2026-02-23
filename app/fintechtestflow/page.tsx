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
import { ChevronLeft, Wifi, Battery, Signal, Lock, CreditCard, ChevronDown, MapPin } from 'lucide-react'

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

function AppleIcon({ className }: { className?: string }) {
  return (
    <svg className={className ?? 'h-5 w-5 fill-slate'} viewBox="0 0 814 1000" xmlns="http://www.w3.org/2000/svg">
      <path d="M788.1 340.9c-5.8 4.5-108.2 62.2-108.2 190.5 0 148.4 130.3 200.9 134.2 202.2-.6 3.2-20.7 71.9-68.7 141.9-42.8 61.6-87.5 123.1-155.5 123.1s-85.5-39.5-164-39.5c-76 0-103.7 40.8-165.9 40.8s-105-57.8-155.5-127.4C46 376.7 0 248.9 0 136.2c0-108.2 71.4-165.6 140.6-165.6 70.3 0 115 42.5 163.8 42.5 47.1 0 99.4-44.3 174.2-44.3zm-190.5-100.1c31.7-40.2 53.9-95.2 53.9-150.2 0-7.7-.6-15.4-1.9-21.8C591.5 86.5 537.5 123 504 163.4c-30.5 36.7-56.8 92.3-56.8 148 0 8.3 1.3 16.7 1.9 19.2 3.2.6 8.4 1.3 13.6 1.3 49.3 0 99.4-33.9 130.9-92z" />
    </svg>
  )
}

const badge = (label: string) => (
  <span className="inline-block border border-mocha text-mocha text-[12px] font-semibold px-3 py-1 rounded-full">
    {label}
  </span>
)

function PaymentMethodScreen({ onNext }: { onNext: (method: string) => void }) {
  const [selected, setSelected] = useState<string | null>('card')

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
        <div className="mt-2.5 rounded-full bg-turquoise px-2.5 py-0.5">
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
            Credit cards may carry extra fees.
          </p>
          <div className="mt-3 flex gap-2">
            {badge('No fee for debit')}
            {badge('Instant')}
          </div>
        </button>

        {/* Apple Pay */}
        <button className={cardClass('apple')} onClick={() => setSelected('apple')}>
          {selected === 'apple' && <span className="absolute top-4 right-4 bg-turquoise text-slate text-[11px] font-semibold px-2.5 py-1 rounded-full">Selected</span>}
          <div className="flex items-center gap-2.5">
            <AppleIcon className="h-[18px] w-[18px] fill-slate" />
            <p className="font-bold text-[17px] text-slate">Apple Pay</p>
          </div>
          <p className="text-[13px] text-mocha mt-1.5 leading-snug">
            Pay with Face ID or Touch ID.
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
          <p className="text-[13px] text-mocha mt-1.5 leading-snug">
            From your checking or savings account.
          </p>
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
            Pay cash at a store near you.
          </p>
          <div className="mt-3 flex gap-2">
            {badge('$3.95')}
            {badge('Same day')}
          </div>
        </button>
      </div>

      <div className="mt-5 space-y-2.5">
        <Button size="lg" className="w-full text-[15px]" onClick={() => onNext(selected!)} disabled={!selected}>
          Continue
        </Button>
        <Button variant="outline" size="lg" className="w-full text-[15px]">
          Cancel
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
  const canContinue = address && zip && city && state
  const isCash = paymentMethod === 'cash'

  return (
    <div className="flex flex-col h-full">
      <div className="flex flex-col items-center pt-4 pb-1">
        <FelixLogo className="h-8 text-slate" />
        <div className="mt-2.5 rounded-full bg-turquoise px-2.5 py-0.5">
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
        <h1 className="font-display text-[22px] font-extrabold leading-tight tracking-tight text-slate mb-2">
          {isCash ? "What's your address?" : "What's the billing address on your card?"}
        </h1>
        {isCash && (
          <p className="text-[14px] text-mocha mb-5 leading-snug">
            We'll use this to find the closest store locations where you can pay.
          </p>
        )}
        {!isCash && <div className="mb-6" />}

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
        <div className="mt-2.5 rounded-full bg-turquoise px-2.5 py-0.5">
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

function ReviewScreen({ onNext, onBack, onChangePayment, paymentMethod, selectedStore }: { onNext: () => void; onBack: () => void; onChangePayment: () => void; paymentMethod: string; selectedStore: string }) {
  const [feesExpanded, setFeesExpanded] = useState(false)

  const store = stores.find(s => s.id === selectedStore)
  const storeFee = paymentMethod === 'cash' ? parseFloat(store?.fee.replace('$', '') ?? '0') : 0
  const felixFee = 0
  const otherFees = 0
  const taxes = 0
  const total = 10 + storeFee + felixFee + otherFees + taxes

  const feeLabel: Record<string, string> = {
    card: 'Felix fee',
    apple: 'Felix fee',
    bank: 'Felix fee',
    cash: 'Felix fee',
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex flex-col items-center pt-4 pb-1">
        <FelixLogo className="h-8 text-slate" />
        <div className="mt-2.5 rounded-full bg-turquoise px-2.5 py-0.5">
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
              {paymentMethod === 'cash' ? (
                <MapPin className="h-4 w-4 text-slate/40" />
              ) : (
                <CreditCard className="h-4 w-4 text-slate/40" />
              )}
              <span className="font-semibold text-[14px] text-slate">
                {paymentMethod === 'cash'
                  ? stores.find(s => s.id === selectedStore)?.name ?? 'Cash at a store'
                  : '**** 5164'}
              </span>
              <button onClick={onChangePayment} className="text-[13px] font-semibold text-mocha underline decoration-mocha underline-offset-4 hover:text-slate hover:decoration-slate ml-1">Change</button>
            </div>
          </div>
          <button
            onClick={() => setFeesExpanded(v => !v)}
            className="w-full px-4 py-3.5 flex items-center justify-between text-left"
          >
            <span className="text-[13px] text-mocha">Amount + fees</span>
            <div className="flex items-center gap-1">
              <span className="font-semibold text-[14px] text-slate">USD ${total.toFixed(2)}</span>
              <ChevronDown className={`h-4 w-4 text-slate/40 transition-transform duration-200 ${feesExpanded ? 'rotate-180' : ''}`} />
            </div>
          </button>

          <div className={`grid transition-all duration-300 ease-in-out ${feesExpanded ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}>
            <div className="overflow-hidden">
              <div className="bg-stone/40 divide-y divide-slate/10">
                <div className="px-4 py-2.5 flex items-center justify-between">
                  <span className="text-[12px] text-mocha">Exchange rate</span>
                  <span className="text-[12px] text-slate font-medium">1 USD = 17.42 MXN</span>
                </div>
                <div className="px-4 py-2.5 flex items-center justify-between">
                  <span className="text-[12px] text-mocha">Amount to send</span>
                  <span className="text-[12px] text-slate font-medium">USD 10.00</span>
                </div>
                <div className="px-4 py-2.5 flex items-center justify-between">
                  <span className="text-[12px] text-mocha">{feeLabel[paymentMethod]}</span>
                  <span className="text-[12px] text-slate font-medium">+ USD {felixFee.toFixed(2)}</span>
                </div>
                {paymentMethod === 'cash' && (
                  <div className="px-4 py-2.5 flex items-center justify-between">
                    <span className="text-[12px] text-mocha">{store?.name} fee</span>
                    <span className="text-[12px] text-slate font-medium">+ USD {storeFee.toFixed(2)}</span>
                  </div>
                )}
                <div className="px-4 py-2.5 flex items-center justify-between">
                  <span className="text-[12px] text-mocha">Other fees</span>
                  <span className="text-[12px] text-slate font-medium">+ USD {otherFees.toFixed(2)}</span>
                </div>
                <div className="px-4 py-2.5 flex items-center justify-between">
                  <span className="text-[12px] text-mocha">Taxes</span>
                  <span className="text-[12px] text-slate font-medium">+ USD {taxes.toFixed(2)}</span>
                </div>
                <div className="px-4 py-3 flex items-center justify-between border-t border-slate/15">
                  <span className="text-[13px] font-bold text-slate">Total</span>
                  <span className="text-[13px] font-bold text-slate">USD {total.toFixed(2)}</span>
                </div>
              </div>
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

const stores = [
  { id: 'walgreens', name: 'Walgreens', fee: '$3.95', bg: 'bg-[#E31837]', text: 'W' },
  { id: 'cvs', name: 'CVS Pharmacy', fee: '$3.95', bg: 'bg-[#CC0000]', text: 'CVS' },
  { id: '7eleven', name: '7-Eleven', fee: '$3.95', bg: 'bg-[#008751]', text: '7' },
  { id: 'walmart', name: 'Walmart', fee: '$3.74', bg: 'bg-[#0071CE]', text: '★' },
  { id: 'caseys', name: "Casey's", fee: '$3.95', bg: 'bg-[#C8102E]', text: 'C' },
  { id: 'officedepot', name: 'Office Depot OfficeMax', fee: '$3.95', bg: 'bg-[#CC0000]', text: 'OD' },
]

function StoreSelectionScreen({ onBack, onNext }: { onBack: () => void; onNext: (storeId: string) => void }) {
  const [selected, setSelected] = useState<string | null>(null)

  return (
    <div className="flex flex-col h-full">
      <div className="flex flex-col items-center pt-4 pb-1">
        <FelixLogo className="h-8 text-slate" />
        <div className="mt-2.5 rounded-full bg-turquoise px-2.5 py-0.5">
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

      <div className="flex-1 px-5 pb-4 overflow-y-auto">
        <h1 className="font-display text-[24px] font-extrabold leading-tight tracking-tight text-slate mt-2 mb-5">
          Where do you want to pay?
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
              <div className={`h-10 w-10 rounded-full ${store.bg} flex items-center justify-center flex-shrink-0`}>
                <span className="text-white text-[11px] font-extrabold">{store.text}</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-[15px] text-slate leading-tight">{store.name}</p>
                <p className="text-[12px] text-mocha mt-0.5">Min: $20 · Max: $500</p>
              </div>
              <span className="flex-shrink-0 inline-block border border-mocha text-mocha text-[12px] font-semibold px-3 py-1 rounded-full">
                {store.fee}
              </span>
            </button>
          ))}
        </div>

        <div className="mt-5 space-y-2.5">
          <Button size="lg" className="w-full text-[15px]" onClick={() => onNext(selected!)} disabled={!selected}>
            Continue
          </Button>
          <Button variant="outline" size="lg" className="w-full text-[15px]">
            Cancel
          </Button>
        </div>

        <p className="mt-5 text-[10px] text-mocha leading-relaxed text-center">
          Service provided by Green Dot®. ©2024 Green Dot Corporation. All rights reserved. Green Dot Corporation NMLS #914924; Green Dot Bank NMLS #908739.
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
        <div className="mt-2.5 rounded-full bg-turquoise px-2.5 py-0.5">
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
  const [screen, setScreen] = useState<'payment' | 'address' | 'store' | 'card' | 'review' | 'success'>('payment')
  const [paymentMethod, setPaymentMethod] = useState<string>('card')
  const [selectedStore, setSelectedStore] = useState<string>('')

  return (
    <div className="flex min-h-screen items-center justify-center bg-stone p-8">
      <PhoneFrame>
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
  )
}
