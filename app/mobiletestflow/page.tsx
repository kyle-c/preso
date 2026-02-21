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
import { ChevronLeft, Wifi, Battery, Signal, Lock, CreditCard } from 'lucide-react'

function PhoneFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative mx-auto w-[390px] h-[844px] rounded-[52px] border-[12px] border-slate bg-slate shadow-2xl overflow-hidden">
      {/* Dynamic Island */}
      <div className="absolute top-3 left-1/2 -translate-x-1/2 z-50 w-[126px] h-[34px] bg-slate rounded-full" />

      {/* Status Bar */}
      <div className="absolute top-0 left-0 right-0 z-40 flex items-center justify-between px-8 pt-[14px] h-[54px] bg-linen">
        <span className="text-[15px] font-semibold text-slate">9:41</span>
        <div className="flex items-center gap-1.5">
          <Signal className="h-3.5 w-3.5 text-slate" />
          <Wifi className="h-3.5 w-3.5 text-slate" />
          <Battery className="h-3.5 w-3.5 text-slate" />
        </div>
      </div>

      {/* Screen Content */}
      <div className="h-full w-full overflow-y-auto bg-linen pt-[54px] pb-[34px]">
        {children}
      </div>

      {/* Home Indicator */}
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-50 w-[134px] h-[5px] rounded-full bg-slate" />
    </div>
  )
}

function DuplicateNumberScreen({ onNext }: { onNext: () => void }) {
  return (
    <div className="flex flex-col h-full px-6 pb-4 pt-8">
      {/* Content */}
      <div className="flex-1">
        <h1 className="font-display text-[26px] font-extrabold leading-tight tracking-tight text-slate">
          Looks like you already have a number with us
        </h1>

        <div className="mt-5 space-y-4">
          <p className="text-[15px] leading-relaxed text-slate/70">
            We can only keep one number active at a time to keep your account safe. Your current number is ***1234.
          </p>

          <p className="text-[15px] font-medium text-slate">
            Which one do you want to keep?
          </p>
        </div>
      </div>

      {/* Actions pinned to bottom */}
      <div className="space-y-2.5 pt-4">
        <Button size="lg" className="w-full text-[15px]" onClick={onNext}>
          Keep this number
        </Button>
        <Button variant="outline" size="lg" className="w-full text-[15px]">
          Use my other number
        </Button>
        <Button variant="link-muted" size="sm" className="w-full">
          I'll do this later
        </Button>
      </div>
    </div>
  )
}

function AddressScreen({ onBack, onNext }: { onBack: () => void; onNext: () => void }) {
  const [address, setAddress] = useState('')
  const [zip, setZip] = useState('')
  const [city, setCity] = useState('')
  const [state, setState] = useState('')
  const canContinue = address && zip && city && state

  return (
    <div className="flex flex-col h-full">
      {/* Header with logo */}
      <div className="flex flex-col items-center pt-4 pb-1">
        <FelixLogo className="h-8 text-slate" />
        <div className="mt-2.5 rounded-full bg-stone px-2.5 py-0.5">
          <span className="text-[10px] font-semibold text-slate">
            Authorized UniTeller Agent
          </span>
        </div>
      </div>

      {/* Progress */}
      <div className="flex items-center gap-3 px-6 py-3">
        <button
          onClick={onBack}
          className="flex h-9 w-9 items-center justify-center rounded-full border border-slate/15 text-slate hover:bg-white"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <div className="flex flex-1 gap-1.5">
          <div className="h-1.5 flex-1 rounded-full bg-slate" />
          <div className="h-1.5 flex-1 rounded-full bg-slate/20" />
        </div>
        <div className="w-9 flex-shrink-0" />
      </div>

      {/* Form content */}
      <div className="flex-1 px-6 pb-6">
        <h1 className="font-display text-[22px] font-extrabold leading-tight tracking-tight text-slate mb-5">
          What's the billing address on your card?
        </h1>

        <div className="space-y-4">
          <FloatingInput label="Address *" className="!rounded-2xl bg-white [&+label]:bg-white" value={address} onChange={e => setAddress(e.target.value)} />
          <FloatingInput label="Apt, suite, or floor" className="!rounded-2xl bg-white [&+label]:bg-white" />
          <FloatingInput label="ZIP Code *" className="!rounded-2xl bg-white [&+label]:bg-white" value={zip} onChange={e => setZip(e.target.value)} />
          <FloatingInput label="City *" className="!rounded-2xl bg-white [&+label]:bg-white" value={city} onChange={e => setCity(e.target.value)} />
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

        {/* Actions */}
        <div className="space-y-2.5 pt-8">
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

function AppleIcon({ className }: { className?: string }) {
  return (
    <svg className={className ?? 'h-5 w-5 fill-slate'} viewBox="0 0 814 1000" xmlns="http://www.w3.org/2000/svg">
      <path d="M788.1 340.9c-5.8 4.5-108.2 62.2-108.2 190.5 0 148.4 130.3 200.9 134.2 202.2-.6 3.2-20.7 71.9-68.7 141.9-42.8 61.6-87.5 123.1-155.5 123.1s-85.5-39.5-164-39.5c-76 0-103.7 40.8-165.9 40.8s-105-57.8-155.5-127.4C46 376.7 0 248.9 0 136.2c0-108.2 71.4-165.6 140.6-165.6 70.3 0 115 42.5 163.8 42.5 47.1 0 99.4-44.3 174.2-44.3zm-190.5-100.1c31.7-40.2 53.9-95.2 53.9-150.2 0-7.7-.6-15.4-1.9-21.8C591.5 86.5 537.5 123 504 163.4c-30.5 36.7-56.8 92.3-56.8 148 0 8.3 1.3 16.7 1.9 19.2 3.2.6 8.4 1.3 13.6 1.3 49.3 0 99.4-33.9 130.9-92z" />
    </svg>
  )
}

function PaymentScreen({ onBack }: { onBack: () => void }) {
  const [selected, setSelected] = useState<string | null>(null)

  const cardClass = (id: string) =>
    `relative w-full text-left rounded-2xl p-5 border transition-all ${
      selected === id
        ? 'bg-white border-turquoise/50 ring-[3px] ring-turquoise/30'
        : 'bg-white border-slate/20 shadow-sm'
    }`

  const badge = (label: string) => (
    <span className="inline-block border border-mocha text-mocha text-[12px] font-semibold px-3 py-1 rounded-full">
      {label}
    </span>
  )

  return (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="flex flex-col items-center pt-4 pb-1">
        <FelixLogo className="h-8 text-slate" />
        <div className="mt-2.5 rounded-full bg-stone px-2.5 py-0.5">
          <span className="text-[10px] font-semibold text-slate">
            Authorized UniTeller Agent
          </span>
        </div>
      </div>

      {/* Progress */}
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
        </div>
        <div className="w-9 flex-shrink-0" />
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto px-5 pb-6">
        <h1 className="font-display text-[26px] font-extrabold leading-tight tracking-tight text-slate mt-4 mb-2">
          Almost done.<br />How do you want to pay?
        </h1>
        <p className="text-[15px] text-slate/60 mb-5">
          Pick whatever's easiest for you.
        </p>

        <div className="space-y-3">
          {/* Card + Apple Pay — side by side */}
          <div className="bg-white border border-slate/20 shadow-sm rounded-2xl p-3">
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setSelected('apple')}
                className={`flex flex-col items-center justify-center gap-1.5 rounded-xl py-4 px-3 border transition-all ${
                  selected === 'apple'
                    ? 'border-turquoise/50 ring-[3px] ring-turquoise/30 bg-white'
                    : 'border-transparent bg-stone/40'
                }`}
              >
                <AppleIcon className="h-5 w-5 fill-slate" />
                <span className="font-semibold text-[13px] text-slate">Apple Pay</span>
              </button>
              <button
                onClick={() => setSelected('card')}
                className={`flex flex-col items-center justify-center gap-1.5 rounded-xl py-4 px-3 border transition-all ${
                  selected === 'card'
                    ? 'border-turquoise/50 ring-[3px] ring-turquoise/30 bg-white'
                    : 'border-transparent bg-stone/40'
                }`}
              >
                <CreditCard className="h-5 w-5 text-slate" />
                <span className="font-semibold text-[13px] text-slate">Card</span>
              </button>
            </div>
            <div className="flex gap-2 mt-3 justify-center">
              {badge('Instant')}
              {badge('No fee for debit')}
            </div>
          </div>

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
            <p className="text-[13px] text-slate/60 mt-1 leading-snug">
              Find a store near you — available in Florida and 33 other states.
            </p>
            <div className="mt-3 flex gap-2">
              {badge('$3.95')}
              {badge('Same day')}
            </div>
          </button>
        </div>

        {/* Actions */}
        <div className="mt-5 space-y-2.5">
          <Button size="lg" className="w-full text-[15px]" disabled={!selected}>
            Continue
          </Button>
          <Button variant="outline" size="lg" className="w-full text-[15px]">
            Cancel
          </Button>
        </div>

        {/* Security footer */}
        <div className="mt-6 rounded-2xl bg-blueberry/10 px-4 py-3.5 flex gap-3 items-start">
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
  )
}

export default function MobileTestFlowPage() {
  const [screen, setScreen] = useState<'duplicate' | 'address' | 'payment'>('duplicate')

  return (
    <div className="flex min-h-screen items-center justify-center bg-stone p-8">
      <PhoneFrame>
        {screen === 'duplicate' ? (
          <DuplicateNumberScreen onNext={() => setScreen('address')} />
        ) : screen === 'address' ? (
          <AddressScreen onBack={() => setScreen('duplicate')} onNext={() => setScreen('payment')} />
        ) : (
          <PaymentScreen onBack={() => setScreen('address')} />
        )}
      </PhoneFrame>
    </div>
  )
}
