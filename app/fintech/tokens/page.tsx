'use client'

import { useEffect, useRef, useState } from 'react'
import { content, countries, type Language, type ContentTokens } from '@/app/fintechtestflow/content'

const STORAGE_KEY = 'felix-content-tokens'

const sections: { label: string; key: keyof ContentTokens }[] = [
  { label: 'Common',          key: 'common' },
  { label: 'Payment Method',  key: 'paymentMethod' },
  { label: 'Address',         key: 'address' },
  { label: 'Card Details',    key: 'cardDetails' },
  { label: 'Store Selection', key: 'storeSelection' },
  { label: 'Review',          key: 'review' },
  { label: 'Success',         key: 'success' },
  { label: 'Bank Consent',    key: 'bankConsent' },
  { label: 'Bank Connect',    key: 'bankConnect' },
  { label: 'Stripe',          key: 'stripe' },
]

function deepClone<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj))
}

// ─── Editable cell ────────────────────────────────────────────────────────────

function EditableCell({
  value,
  onChange,
}: {
  value: string
  onChange: (v: string) => void
}) {
  const ref = useRef<HTMLSpanElement>(null)

  // Keep DOM in sync when value changes externally (e.g. reset)
  useEffect(() => {
    if (ref.current && ref.current.textContent !== value) {
      ref.current.textContent = value
    }
  }, [value])

  return (
    <span
      ref={ref}
      contentEditable
      suppressContentEditableWarning
      onBlur={e => onChange(e.currentTarget.textContent ?? '')}
      className="block outline-none rounded px-1 -mx-1 cursor-text leading-snug
        hover:bg-slate/5
        focus:bg-turquoise/10 focus:ring-1 focus:ring-turquoise/40
        transition-colors"
    >
      {value}
    </span>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function FintechTokensPage() {
  const [mounted, setMounted] = useState(false)
  const [tokens, setTokens] = useState<Record<Language, ContentTokens>>(() =>
    deepClone(content)
  )
  const [dirty, setDirty] = useState(false)

  // Hydration guard + load from localStorage on mount (merge over defaults)
  useEffect(() => {
    setMounted(true)
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) {
        const parsed = JSON.parse(saved) as Record<Language, ContentTokens>
        const merged = deepClone(content)
        for (const lang of Object.keys(merged) as Language[]) {
          if (parsed[lang]) {
            for (const section of Object.keys(merged[lang]) as (keyof ContentTokens)[]) {
              if (parsed[lang][section]) {
                Object.assign(merged[lang][section], parsed[lang][section])
              }
            }
          }
        }
        setTokens(merged)
        setDirty(true)
      }
    } catch {}
  }, [])

  if (!mounted) {
    return <div className="min-h-screen bg-linen" />
  }

  function updateToken(lang: Language, section: keyof ContentTokens, key: string, value: string) {
    setTokens(prev => {
      const next = deepClone(prev)
      ;(next[lang][section] as Record<string, string>)[key] = value
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
      return next
    })
    setDirty(true)
  }

  function reset() {
    localStorage.removeItem(STORAGE_KEY)
    setTokens(deepClone(content))
    setDirty(false)
  }

  const gridCols = `200px repeat(${countries.length}, 1fr)`

  return (
    <div className="min-h-screen bg-linen px-8 py-12">
      <div className="mx-auto" style={{ maxWidth: '100%' }}>

        {/* Header */}
        <div className="mb-10 max-w-5xl">
          <p className="text-[13px] font-semibold text-mocha uppercase tracking-widest mb-2">Felix Design System</p>
          <h1 className="font-display text-[40px] font-extrabold leading-tight tracking-tight text-slate mb-3">
            Content Tokens
          </h1>
          <p className="text-[16px] text-mocha max-w-xl">
            All user-facing strings for the payment flow, organized by screen. Supports 7 markets: US, MX, BR, DR, CR, PE, and EC.
          </p>
          <div className="mt-4 flex items-center gap-3">
            <a
              href="/fintechtestflow"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-stone border border-slate/15 text-[13px] font-semibold text-slate hover:bg-concrete transition-colors"
            >
              ← View flow
            </a>
            <a
              href="/md"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-stone border border-slate/15 text-[13px] font-semibold text-slate hover:bg-concrete transition-colors"
            >
              Design system docs
            </a>
            {dirty && (
              <button
                onClick={reset}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-stone border border-slate/15 text-[13px] font-semibold text-mocha hover:bg-concrete transition-colors"
              >
                Reset to defaults
              </button>
            )}
          </div>
        </div>

        {/* Sections */}
        <div className="space-y-10">
          {sections.map(({ label, key }) => {
            const tokenKeys = Object.keys(tokens['en'][key] as Record<string, string>)

            return (
              <div key={key}>
                {/* Section header */}
                <div className="flex items-center gap-3 mb-3">
                  <h2 className="font-display text-[18px] font-extrabold text-slate">{label}</h2>
                  <code className="text-[11px] font-mono bg-stone border border-slate/10 text-mocha px-2 py-0.5 rounded-md">
                    {key}
                  </code>
                </div>

                {/* Table with horizontal scroll */}
                <div className="rounded-2xl border border-slate/10 overflow-x-auto">
                  {/* Table head */}
                  <div className="grid bg-stone border-b border-slate/10" style={{ gridTemplateColumns: gridCols, minWidth: 1200 }}>
                    <div className="px-4 py-2.5 text-[11px] font-semibold text-mocha uppercase tracking-wider">Token</div>
                    {countries.map(c => (
                      <div key={c.code} className="px-4 py-2.5 text-[11px] font-semibold text-mocha uppercase tracking-wider flex items-center gap-1.5">
                        <span>{c.flag}</span>
                        <span>{c.shortLabel}</span>
                      </div>
                    ))}
                  </div>

                  {/* Rows */}
                  {tokenKeys.map((tokenKey, i) => (
                    <div
                      key={tokenKey}
                      className={`grid divide-x divide-slate/5 ${i % 2 === 0 ? 'bg-white' : 'bg-linen'}`}
                      style={{ gridTemplateColumns: gridCols, minWidth: 1200 }}
                    >
                      {/* Token key */}
                      <div className="px-4 py-3 flex items-start">
                        <code className="text-[12px] font-mono text-blueberry">{tokenKey}</code>
                      </div>

                      {/* Editable values per country */}
                      {countries.map(c => {
                        const val = (tokens[c.code][key] as Record<string, string>)[tokenKey]
                        return (
                          <div key={c.code} className="px-4 py-3">
                            <p className="text-[13px] text-slate">
                              <EditableCell
                                value={val}
                                onChange={v => updateToken(c.code, key, tokenKey, v)}
                              />
                            </p>
                          </div>
                        )
                      })}
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>

        <p className="mt-12 text-[12px] text-mocha text-center">
          Felix Pago Design System · Content tokens for /fintechtestflow
        </p>
      </div>
    </div>
  )
}
