'use client'

import { useState, useEffect, useCallback } from 'react'
import { Eye, EyeOff, ExternalLink, Star, Zap, Crown } from 'lucide-react'
import { cn } from '@/lib/utils'

/* ─────────────────────── Model Catalogs ─────────────────────── */

interface ModelEntry {
  id: string
  label: string
  cost: string
  note: string
  tier: 'budget' | 'value' | 'premium'
}

const ANTHROPIC_MODELS: ModelEntry[] = [
  { id: 'claude-haiku-4-5-20251001', label: 'Haiku 4.5', cost: '~$0.01', note: 'Fast & cheap', tier: 'budget' },
  { id: 'claude-sonnet-4-20250514', label: 'Sonnet 4', cost: '~$0.03', note: 'Best value', tier: 'value' },
  { id: 'claude-sonnet-4-5-20250514', label: 'Sonnet 4.5', cost: '~$0.03', note: 'Extended thinking', tier: 'value' },
  { id: 'claude-sonnet-4-6', label: 'Sonnet 4.6', cost: '~$0.03', note: 'Latest', tier: 'value' },
  { id: 'claude-opus-4-6', label: 'Opus 4.6', cost: '~$0.15', note: 'Most capable', tier: 'premium' },
]

const OPENROUTER_MODELS: ModelEntry[] = [
  { id: 'google/gemini-2.5-flash-lite', label: 'Gemini 2.5 Flash Lite', cost: '< $0.01', note: 'Cheapest', tier: 'budget' },
  { id: 'google/gemini-2.5-flash', label: 'Gemini 2.5 Flash', cost: '~$0.01', note: 'Best bang for buck', tier: 'budget' },
  { id: 'google/gemini-3-flash-preview', label: 'Gemini 3 Flash', cost: '~$0.01', note: 'Latest Google', tier: 'budget' },
  { id: 'openai/gpt-4.1-mini', label: 'GPT-4.1 Mini', cost: '~$0.01', note: '', tier: 'budget' },
  { id: 'openai/o4-mini', label: 'o4 Mini', cost: '~$0.02', note: 'Reasoning', tier: 'value' },
  { id: 'x-ai/grok-3-mini', label: 'Grok 3 Mini', cost: '~$0.02', note: '', tier: 'value' },
  { id: 'deepseek/deepseek-r1-0528', label: 'DeepSeek R1', cost: '~$0.02', note: 'Reasoning', tier: 'value' },
  { id: 'google/gemini-2.5-pro', label: 'Gemini 2.5 Pro', cost: '~$0.04', note: '', tier: 'value' },
  { id: 'google/gemini-3-pro-preview', label: 'Gemini 3 Pro', cost: '~$0.05', note: '', tier: 'value' },
  { id: 'openai/gpt-4.1', label: 'GPT-4.1', cost: '~$0.04', note: '', tier: 'value' },
  { id: 'x-ai/grok-3', label: 'Grok 3', cost: '~$0.06', note: '', tier: 'premium' },
  { id: 'x-ai/grok-4.20-beta', label: 'Grok 4.20', cost: '~$0.08', note: 'Latest xAI', tier: 'premium' },
  { id: 'anthropic/claude-sonnet-4.6', label: 'Claude Sonnet 4.6', cost: '~$0.06', note: '', tier: 'premium' },
  { id: 'openai/o3', label: 'o3', cost: '~$0.10', note: 'Top reasoning', tier: 'premium' },
  { id: 'anthropic/claude-opus-4.6', label: 'Claude Opus 4.6', cost: '~$0.12', note: 'Most capable', tier: 'premium' },
]

const ANTHROPIC_DEFAULT = 'claude-sonnet-4-20250514'
const OPENROUTER_DEFAULT = 'google/gemini-2.5-flash'

/* ─────────────────────── Types ─────────────────────── */

export interface ModelSelectorProps {
  provider: 'anthropic' | 'openrouter'
  apiKey: string
  model: string
  onProviderChange: (p: 'anthropic' | 'openrouter') => void
  onApiKeyChange: (key: string) => void
  onModelChange: (model: string) => void
}

/* ─────────────────────── localStorage helpers ─────────────────────── */

const LS = {
  provider: 'studio-provider',
  anthropicKey: 'studio-anthropic-key',
  openrouterKey: 'studio-openrouter-key',
  anthropicModel: 'studio-anthropic-model',
  openrouterModel: 'studio-openrouter-model',
} as const

export function loadModelDefaults() {
  if (typeof window === 'undefined') {
    return {
      provider: 'anthropic' as const,
      apiKey: '',
      model: ANTHROPIC_DEFAULT,
    }
  }
  const provider = (localStorage.getItem(LS.provider) ?? 'anthropic') as 'anthropic' | 'openrouter'
  const apiKey = provider === 'anthropic'
    ? localStorage.getItem(LS.anthropicKey) ?? ''
    : localStorage.getItem(LS.openrouterKey) ?? ''
  const model = provider === 'anthropic'
    ? localStorage.getItem(LS.anthropicModel) ?? ANTHROPIC_DEFAULT
    : localStorage.getItem(LS.openrouterModel) ?? OPENROUTER_DEFAULT
  return { provider, apiKey, model }
}

/* ─────────────────────── Tier Badge ─────────────────────── */

function TierBadge({ tier }: { tier: ModelEntry['tier'] }) {
  if (tier === 'budget') return (
    <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-semibold bg-cactus/20 text-cactus">
      <Zap className="w-2.5 h-2.5" /> Budget
    </span>
  )
  if (tier === 'value') return (
    <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-semibold bg-turquoise/20 text-turquoise">
      <Star className="w-2.5 h-2.5" /> Value
    </span>
  )
  return (
    <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-semibold bg-mango/20 text-mango">
      <Crown className="w-2.5 h-2.5" /> Premium
    </span>
  )
}

/* ─────────────────────── Component ─────────────────────── */

export function ModelSelector({
  provider,
  apiKey,
  model,
  onProviderChange,
  onApiKeyChange,
  onModelChange,
}: ModelSelectorProps) {
  const [showKey, setShowKey] = useState(false)
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    setHydrated(true)
    const saved = loadModelDefaults()
    onProviderChange(saved.provider)
    onApiKeyChange(saved.apiKey)
    onModelChange(saved.model)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const persist = useCallback(() => {
    if (typeof window === 'undefined') return
    localStorage.setItem(LS.provider, provider)
    if (provider === 'anthropic') {
      localStorage.setItem(LS.anthropicKey, apiKey)
      localStorage.setItem(LS.anthropicModel, model)
    } else {
      localStorage.setItem(LS.openrouterKey, apiKey)
      localStorage.setItem(LS.openrouterModel, model)
    }
  }, [provider, apiKey, model])

  useEffect(() => {
    if (hydrated) persist()
  }, [hydrated, persist])

  const handleProviderChange = (p: 'anthropic' | 'openrouter') => {
    onProviderChange(p)
    const key = p === 'anthropic'
      ? localStorage.getItem(LS.anthropicKey) ?? ''
      : localStorage.getItem(LS.openrouterKey) ?? ''
    const m = p === 'anthropic'
      ? localStorage.getItem(LS.anthropicModel) ?? ANTHROPIC_DEFAULT
      : localStorage.getItem(LS.openrouterModel) ?? OPENROUTER_DEFAULT
    onApiKeyChange(key)
    onModelChange(m)
    setShowKey(false)
  }

  const models = provider === 'anthropic' ? ANTHROPIC_MODELS : OPENROUTER_MODELS
  const selectedModel = models.find((m) => m.id === model)

  return (
    <div className="space-y-5">
      {/* Provider tabs */}
      <div className="flex gap-1 p-1 rounded-xl bg-white/5">
        {(['anthropic', 'openrouter'] as const).map((p) => (
          <button
            key={p}
            type="button"
            onClick={() => handleProviderChange(p)}
            className={cn(
              'flex-1 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200',
              provider === p
                ? 'bg-turquoise text-slate-950 shadow-sm'
                : 'text-white/60 hover:text-white/80 hover:bg-white/5',
            )}
          >
            {p === 'anthropic' ? 'Anthropic' : 'OpenRouter'}
          </button>
        ))}
      </div>

      {/* Provider description + link */}
      <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5">
        {provider === 'anthropic' ? (
          <div className="space-y-2">
            <p className="text-xs text-white/50 leading-relaxed">
              Use your Anthropic API key to access Claude models directly. Best for consistent, high-quality presentations.
            </p>
            <a
              href="https://console.anthropic.com/settings/keys"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs text-turquoise hover:text-turquoise/80 transition-colors"
            >
              Get your API key at console.anthropic.com
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        ) : (
          <div className="space-y-2">
            <p className="text-xs text-white/50 leading-relaxed">
              OpenRouter gives you access to 100+ models from Google, OpenAI, Anthropic, xAI, and more — all with a single API key. Great for trying different models.
            </p>
            <a
              href="https://openrouter.ai/keys"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs text-turquoise hover:text-turquoise/80 transition-colors"
            >
              Get your API key at openrouter.ai/keys
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        )}
      </div>

      {/* API Key */}
      <div className="space-y-2">
        <label className="block text-xs font-semibold uppercase tracking-wider text-white/50">
          API Key
        </label>
        <div className="relative">
          <input
            type={showKey ? 'text' : 'password'}
            value={apiKey}
            onChange={(e) => onApiKeyChange(e.target.value)}
            placeholder={provider === 'anthropic' ? 'sk-ant-...' : 'sk-or-...'}
            className="w-full h-10 rounded-lg border border-white/10 bg-white/5 px-3 pr-10 text-sm text-white placeholder:text-white/30 outline-none focus:border-turquoise/50 focus:ring-1 focus:ring-turquoise/30 transition-all font-mono"
          />
          <button
            type="button"
            onClick={() => setShowKey(!showKey)}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-white/40 hover:text-white/70 transition-colors"
            aria-label={showKey ? 'Hide API key' : 'Show API key'}
          >
            {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Model list */}
      <div className="space-y-2">
        <label className="block text-xs font-semibold uppercase tracking-wider text-white/50">
          Model
        </label>
        <div className="space-y-1 max-h-[280px] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-white/10">
          {models.map((m) => (
            <button
              key={m.id}
              type="button"
              onClick={() => onModelChange(m.id)}
              className={cn(
                'w-full text-left px-3 py-2.5 rounded-lg border transition-all',
                model === m.id
                  ? 'bg-turquoise/10 border-turquoise/30'
                  : 'bg-white/[0.02] border-white/5 hover:bg-white/5 hover:border-white/10',
              )}
            >
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 min-w-0">
                  <span className={cn(
                    'text-sm font-medium truncate',
                    model === m.id ? 'text-white' : 'text-white/70',
                  )}>
                    {m.label}
                  </span>
                  <TierBadge tier={m.tier} />
                </div>
                <span className="text-xs text-white/30 font-mono shrink-0">{m.cost}</span>
              </div>
              {m.note && (
                <p className="text-[11px] text-white/30 mt-0.5">{m.note}</p>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Recommendation callout */}
      <div className="p-3 rounded-xl bg-turquoise/5 border border-turquoise/10">
        <p className="text-xs text-turquoise/70 leading-relaxed">
          <strong className="text-turquoise">Recommendation:</strong>{' '}
          {provider === 'anthropic'
            ? 'Sonnet 4 offers the best balance of quality and cost. Use Haiku 4.5 for quick drafts, Opus 4.6 for important presentations.'
            : 'Gemini 2.5 Flash is the best value — fast, cheap, and high quality. Gemini 3 Flash is the latest from Google. For premium results, try Claude Sonnet 4.6 or o3.'
          }
        </p>
      </div>
    </div>
  )
}
