'use client'

import { createContext, useContext, useState } from 'react'
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
import { type Language, type ContentTokens, languages, content } from './content'

// ─── Language context ────────────────────────────────────────────────────────

const LangContext = createContext<ContentTokens>(content['en'])
const useT = () => useContext(LangContext)

// ─── Phone frame ─────────────────────────────────────────────────────────────

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

// ─── Shared sub-components ───────────────────────────────────────────────────

function ScreenHeader() {
  const t = useT()
  return (
    <div className="flex flex-col items-center pt-4 pb-1">
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
  { id: 'walgreens',   name: 'Walgreens',             fee: '$3.95', bg: 'bg-[#E31837]', text: 'W'   },
  { id: 'cvs',         name: 'CVS Pharmacy',           fee: '$3.95', bg: 'bg-[#CC0000]', text: 'CVS' },
  { id: '7eleven',     name: '7-Eleven',               fee: '$3.95', bg: 'bg-[#008751]', text: '7'   },
  { id: 'walmart',     name: 'Walmart',                fee: '$3.74', bg: 'bg-[#0071CE]', text: '★'   },
  { id: 'caseys',      name: "Casey's",                fee: '$3.95', bg: 'bg-[#C8102E]', text: 'C'   },
  { id: 'officedepot', name: 'Office Depot OfficeMax', fee: '$3.95', bg: 'bg-[#CC0000]', text: 'OD'  },
]

// ─── Screens ─────────────────────────────────────────────────────────────────

function PaymentMethodScreen({ onNext }: { onNext: (method: string) => void }) {
  const t = useT()
  const [selected, setSelected] = useState<string | null>('card')

  const cardClass = (id: string) =>
    `relative w-full text-left rounded-2xl p-5 border transition-all ${
      selected === id
        ? 'bg-white border-turquoise/50 ring-[3px] ring-turquoise/30'
        : 'bg-white border-slate/20 shadow-sm'
    }`

  const SelectedBadge = () => (
    <span className="absolute top-4 right-4 bg-turquoise text-slate text-[11px] font-semibold px-2.5 py-1 rounded-full">
      {t.common.selected}
    </span>
  )

  return (
    <div className="flex flex-col px-5 pb-8">
      <ScreenHeader />

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
        {t.paymentMethod.titleLine1}<br />{t.paymentMethod.titleLine2}
      </h1>
      <div className="flex items-center gap-3 mb-5">
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
        <button className={cardClass('card')} onClick={() => setSelected('card')}>
          {selected === 'card' && <SelectedBadge />}
          <p className="font-bold text-[17px] text-slate">{t.paymentMethod.creditDebitName}</p>
          <p className="text-[13px] text-mocha mt-1.5 leading-snug">{t.paymentMethod.creditDebitDesc}</p>
          <div className="mt-3 flex gap-2">
            <BadgePill label={t.paymentMethod.badgeNoFeeDebit} />
            <BadgePill label={t.paymentMethod.badgeInstant} />
          </div>
        </button>

        <button className={cardClass('bank')} onClick={() => setSelected('bank')}>
          {selected === 'bank' && <SelectedBadge />}
          <p className="font-bold text-[17px] text-slate">{t.paymentMethod.bankName}</p>
          <p className="text-[13px] text-mocha mt-1.5 leading-snug">{t.paymentMethod.bankDesc}</p>
          <div className="mt-3 flex gap-2">
            <BadgePill label={t.paymentMethod.badgeNoFee} />
            <BadgePill label={t.paymentMethod.badgeBusinessDays} />
          </div>
        </button>

        <button className={cardClass('cash')} onClick={() => setSelected('cash')}>
          {selected === 'cash' && <SelectedBadge />}
          <p className="font-bold text-[17px] text-slate">{t.paymentMethod.cashName}</p>
          <p className="text-[13px] text-mocha mt-1.5 leading-snug">{t.paymentMethod.cashDesc}</p>
          <div className="mt-3 flex gap-2">
            <BadgePill label={t.paymentMethod.badgeCashFee} />
            <BadgePill label={t.paymentMethod.badgeSameDay} />
          </div>
        </button>
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
  const canContinue = address && zip && city && state
  const isCash = paymentMethod === 'cash'

  return (
    <div className="flex flex-col h-full">
      <ScreenHeader />

      <div className="flex items-center gap-3 px-6 py-3">
        <BackButton onClick={onBack} />
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
          {isCash ? t.address.titleCash : t.address.titleBilling}
        </h1>
        {isCash && (
          <p className="text-[14px] text-mocha mb-5 leading-snug">{t.address.helperCash}</p>
        )}
        {!isCash && <div className="mb-6" />}

        <div className="space-y-4">
          <FloatingInput label={t.address.fieldAddress} className="!rounded-2xl bg-white [&+label]:bg-white [&+label]:text-mocha" value={address} onChange={e => setAddress(e.target.value)} />
          <FloatingInput label={t.address.fieldApt} className="!rounded-2xl bg-white [&+label]:bg-white [&+label]:text-mocha" />
          <FloatingInput label={t.address.fieldZip} className="!rounded-2xl bg-white [&+label]:bg-white [&+label]:text-mocha" value={zip} onChange={e => setZip(e.target.value)} />
          <FloatingInput label={t.address.fieldCity} className="!rounded-2xl bg-white [&+label]:bg-white [&+label]:text-mocha" value={city} onChange={e => setCity(e.target.value)} />
          <Select onValueChange={setState}>
            <SelectTrigger className="!h-14 w-full rounded-2xl bg-white px-4 text-base data-[placeholder]:text-muted-foreground">
              <SelectValue placeholder={t.address.fieldState} />
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
  const canContinue = name && cardNumber && expiry && cvv

  return (
    <div className="flex flex-col h-full">
      <ScreenHeader />

      <div className="flex items-center gap-3 px-6 py-3">
        <BackButton onClick={onBack} />
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
          {t.cardDetails.title}
        </h1>

        <div className="space-y-4">
          <div>
            <FloatingInput label={t.cardDetails.fieldFullName} className="!rounded-2xl bg-white [&+label]:bg-white [&+label]:text-mocha" value={name} onChange={e => setName(e.target.value)} />
            <p className="text-[12px] text-mocha mt-1.5 px-1 leading-snug">{t.cardDetails.helperName}</p>
          </div>
          <FloatingInput label={t.cardDetails.fieldCardNumber} className="!rounded-2xl bg-white [&+label]:bg-white [&+label]:text-mocha" value={cardNumber} onChange={e => setCardNumber(e.target.value)} />
          <FloatingInput label={t.cardDetails.fieldExpiry} className="!rounded-2xl bg-white [&+label]:bg-white [&+label]:text-mocha" value={expiry} onChange={e => setExpiry(e.target.value)} />
          <FloatingInput label={t.cardDetails.fieldCvv} className="!rounded-2xl bg-white [&+label]:bg-white [&+label]:text-mocha" value={cvv} onChange={e => setCvv(e.target.value)} />
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

      <div className="flex items-center gap-3 px-6 py-3">
        <BackButton onClick={onBack} />
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
              <div className={`h-10 w-10 rounded-full ${store.bg} flex items-center justify-center flex-shrink-0`}>
                <span className="text-white text-[11px] font-extrabold">{store.text}</span>
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

      <div className="flex items-center gap-3 px-6 py-3">
        <BackButton onClick={onBack} />
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

// ─── Language switcher ────────────────────────────────────────────────────────

function LanguageSwitcher({ current, onChange }: { current: Language; onChange: (l: Language) => void }) {
  return (
    <div className="flex items-center gap-2 mb-6">
      {languages.map(lang => (
        <button
          key={lang.code}
          onClick={() => onChange(lang.code)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[13px] font-semibold transition-all ${
            current === lang.code
              ? 'bg-slate text-linen'
              : 'bg-white border border-slate/20 text-slate hover:bg-stone'
          }`}
        >
          <span>{lang.flag}</span>
          <span>{lang.label}</span>
        </button>
      ))}
      <a
        href="/fintech/tokens"
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-slate/20 text-[13px] font-semibold text-slate hover:bg-stone transition-all"
      >
        Content tokens →
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

  return (
    <LangContext.Provider value={content[language]}>
      <div className="flex min-h-screen flex-col items-center justify-center bg-stone p-8">
        <LanguageSwitcher current={language} onChange={setLanguage} />
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
    </LangContext.Provider>
  )
}
