'use client'

import { useState } from 'react'
import { FelixLogo } from '@/components/design-system/felix-logo'
import { Wifi, Battery, Signal } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { topupContent } from '../../content'

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

export default function MontoEmbed() {
  const t = topupContent['es-mx']
  const [selected, setSelected] = useState(amounts[4])
  const summary = t.montoSummary
    .replace('{usd}', `$${selected.usd.toFixed(2)}`)
    .replace('{mxn}', `$${selected.mxn}`)

  return (
    <div className="w-[390px] h-[844px] bg-linen overflow-hidden relative">
      {/* Status bar */}
      <div className="absolute top-0 left-0 right-0 z-40 flex items-center justify-between px-8 pt-[14px] h-[54px] bg-linen">
        <span className="text-[15px] font-semibold text-slate">9:41</span>
        <div className="flex items-center gap-1.5">
          <Signal className="h-3.5 w-3.5 text-slate" />
          <Wifi className="h-3.5 w-3.5 text-slate" />
          <Battery className="h-3.5 w-3.5 text-slate" />
        </div>
      </div>
      {/* Progress bar */}
      <div className="absolute top-[54px] left-0 right-0 z-30 h-[3px] bg-slate/10">
        <div className="h-full bg-turquoise" style={{ width: '50%' }} />
      </div>
      {/* Content */}
      <div className="h-full w-full overflow-y-auto pt-[54px] pb-[34px]">
        <div className="flex flex-col px-5 pb-8">
          {/* Header */}
          <div className="flex flex-col items-center pt-5 pb-4">
            <FelixLogo className="h-8 text-slate" />
            <div className="mt-3.5 rounded-full bg-turquoise px-2.5 py-0.5">
              <span className="text-[10px] font-semibold text-slate">{t.badge}</span>
            </div>
          </div>

          {/* Carrier card */}
          <div className="rounded-2xl bg-white border border-slate/15 px-4 py-3.5 mb-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-[15px] font-bold text-slate">{phone}</span>
                <span className="rounded-md bg-turquoise/20 px-1.5 py-0.5 text-[11px] font-semibold text-slate">{carrier}</span>
              </div>
              <span className="text-[13px] font-semibold text-mocha underline decoration-mocha underline-offset-4">{t.change}</span>
            </div>
          </div>

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

          <p className="text-[14px] font-medium text-slate text-center mb-5">
            {summary} · <span className="text-[#22c55e]">{t.noFees}</span>
          </p>

          <Button size="lg" className="w-full text-[15px]">
            {t.continueToPay}
          </Button>
        </div>
      </div>
    </div>
  )
}
