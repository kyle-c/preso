const anthropicKeyInput = document.getElementById('anthropic-key') as HTMLInputElement
const anthropicModelSelect = document.getElementById('anthropic-model') as HTMLSelectElement
const anthropicModelInfo = document.getElementById('anthropic-model-info') as HTMLElement
const openrouterKeyInput = document.getElementById('openrouter-key') as HTMLInputElement
const openrouterModelSelect = document.getElementById('openrouter-model') as HTMLSelectElement
const openrouterModelInfo = document.getElementById('openrouter-model-info') as HTMLElement
const openrouterCustomInput = document.getElementById('openrouter-custom') as HTMLInputElement
const saveBtn = document.getElementById('save-btn') as HTMLButtonElement
const statusEl = document.getElementById('status') as HTMLElement
const providerTabs = document.querySelectorAll<HTMLButtonElement>('.provider-tab')

let activeProvider: 'anthropic' | 'openrouter' = 'anthropic'

/* ── Model metadata ── */

interface ModelMeta {
  name: string
  cost: string       // e.g. "~$0.01/preso"
  speed: number      // 1-5
  quality: number    // 1-5
  context: string    // e.g. "200K"
}

const ANTHROPIC_MODELS: Record<string, ModelMeta> = {
  'claude-haiku-4-5-20251001':  { name: 'Haiku 4.5',   cost: '~$0.01/preso', speed: 5, quality: 3, context: '200K' },
  'claude-sonnet-4-20250514':   { name: 'Sonnet 4',     cost: '~$0.03/preso', speed: 4, quality: 4, context: '200K' },
  'claude-sonnet-4-5-20250514': { name: 'Sonnet 4.5',   cost: '~$0.03/preso', speed: 3, quality: 4, context: '200K' },
  'claude-sonnet-4-6-20250514': { name: 'Sonnet 4.6',   cost: '~$0.03/preso', speed: 4, quality: 5, context: '1M' },
}

const OPENROUTER_MODELS: Record<string, ModelMeta> = {
  'google/gemini-2.5-flash-lite':       { name: 'Gemini 2.5 Flash Lite',  cost: '< $0.01', speed: 5, quality: 2, context: '1M' },
  'google/gemini-3.1-flash-lite-preview': { name: 'Gemini 3.1 Flash Lite', cost: '< $0.01', speed: 5, quality: 3, context: '1M' },
  'openai/gpt-4.1-nano':                { name: 'GPT-4.1 Nano',           cost: '< $0.01', speed: 5, quality: 2, context: '1M' },
  'deepseek/deepseek-v3.2':             { name: 'DeepSeek V3.2',          cost: '< $0.01', speed: 4, quality: 3, context: '164K' },
  'google/gemini-2.5-flash':            { name: 'Gemini 2.5 Flash',       cost: '~$0.01',  speed: 5, quality: 4, context: '1M' },
  'google/gemini-3-flash-preview':      { name: 'Gemini 3 Flash',         cost: '~$0.01',  speed: 5, quality: 4, context: '1M' },
  'openai/gpt-4.1-mini':                { name: 'GPT-4.1 Mini',           cost: '~$0.01',  speed: 4, quality: 3, context: '1M' },
  'moonshotai/kimi-k2.5':               { name: 'Kimi K2.5',              cost: '~$0.01',  speed: 4, quality: 4, context: '262K' },
  'deepseek/deepseek-r1-0528':          { name: 'DeepSeek R1',            cost: '~$0.01',  speed: 2, quality: 4, context: '164K' },
  'mistralai/mistral-large-2512':       { name: 'Mistral Large 3',        cost: '~$0.01',  speed: 4, quality: 3, context: '262K' },
  'anthropic/claude-3.5-haiku':         { name: 'Claude 3.5 Haiku',       cost: '~$0.02',  speed: 4, quality: 3, context: '200K' },
  'google/gemini-2.5-pro':              { name: 'Gemini 2.5 Pro',         cost: '~$0.04',  speed: 3, quality: 5, context: '1M' },
  'google/gemini-3.1-pro-preview':      { name: 'Gemini 3.1 Pro',         cost: '~$0.05',  speed: 3, quality: 5, context: '1M' },
  'openai/gpt-4.1':                     { name: 'GPT-4.1',                cost: '~$0.04',  speed: 3, quality: 4, context: '1M' },
  'x-ai/grok-4.20-beta':               { name: 'Grok 4.20',              cost: '~$0.03',  speed: 3, quality: 4, context: '2M' },
  'anthropic/claude-sonnet-4.6':        { name: 'Claude Sonnet 4.6',      cost: '~$0.06',  speed: 3, quality: 5, context: '1M' },
  'anthropic/claude-opus-4.6':          { name: 'Claude Opus 4.6',        cost: '~$0.12',  speed: 2, quality: 5, context: '1M' },
}

function renderModelInfo(el: HTMLElement, meta: ModelMeta | undefined) {
  if (!meta) {
    el.classList.remove('visible')
    return
  }
  el.classList.add('visible')
  el.innerHTML = `
    <div class="model-info-row">
      <span class="model-info-label">Cost</span>
      <span class="model-info-value">${meta.cost}</span>
    </div>
    <div class="model-info-row">
      <span class="model-info-label">Speed</span>
      <div class="model-info-bar"><div class="model-info-fill" style="width:${meta.speed * 20}%;background:#2BF2F1;"></div></div>
      <span class="model-info-label">Quality</span>
      <div class="model-info-bar"><div class="model-info-fill" style="width:${meta.quality * 20}%;background:#60D06F;"></div></div>
    </div>
    <div class="model-info-row">
      <span class="model-info-label">Context</span>
      <span class="model-info-value">${meta.context}</span>
    </div>
  `
}

/* ── Load saved settings ── */

chrome.storage.sync.get(
  ['provider', 'anthropicKey', 'anthropicModel', 'openrouterKey', 'openrouterModel',
   'claudeApiKey', 'claudeModel'],
  (result) => {
    // Migrate legacy
    if (result.claudeApiKey && !result.anthropicKey) {
      result.anthropicKey = result.claudeApiKey
      result.anthropicModel = result.claudeModel
      result.provider = 'anthropic'
    }

    if (result.anthropicKey) anthropicKeyInput.value = result.anthropicKey
    if (result.anthropicModel) anthropicModelSelect.value = result.anthropicModel
    if (result.openrouterKey) openrouterKeyInput.value = result.openrouterKey

    if (result.openrouterModel) {
      // Check if it's a known model or custom
      const opt = openrouterModelSelect.querySelector(`option[value="${result.openrouterModel}"]`)
      if (opt) {
        openrouterModelSelect.value = result.openrouterModel
      } else {
        openrouterModelSelect.value = '__custom__'
        openrouterCustomInput.value = result.openrouterModel
        openrouterCustomInput.classList.remove('hidden')
      }
    }

    if (result.provider === 'openrouter') switchProvider('openrouter')

    // Show initial model info
    renderModelInfo(anthropicModelInfo, ANTHROPIC_MODELS[anthropicModelSelect.value])
    updateOpenRouterInfo()
  }
)

/* ── Provider tabs ── */

function switchProvider(provider: 'anthropic' | 'openrouter') {
  activeProvider = provider
  providerTabs.forEach(tab => tab.classList.toggle('active', tab.dataset.provider === provider))
  document.querySelectorAll<HTMLElement>('.provider-section').forEach(sec => {
    sec.classList.toggle('active', sec.id === `section-${provider}`)
  })
  statusEl.textContent = ''
  statusEl.className = 'status'
}

providerTabs.forEach(tab => {
  tab.addEventListener('click', () => switchProvider(tab.dataset.provider as 'anthropic' | 'openrouter'))
})

/* ── Model select change handlers ── */

anthropicModelSelect.addEventListener('change', () => {
  renderModelInfo(anthropicModelInfo, ANTHROPIC_MODELS[anthropicModelSelect.value])
})

function updateOpenRouterInfo() {
  const val = openrouterModelSelect.value
  if (val === '__custom__') {
    openrouterCustomInput.classList.remove('hidden')
    openrouterModelInfo.classList.remove('visible')
  } else {
    openrouterCustomInput.classList.add('hidden')
    renderModelInfo(openrouterModelInfo, OPENROUTER_MODELS[val])
  }
}

openrouterModelSelect.addEventListener('change', updateOpenRouterInfo)

/* ── Toggle visibility ── */

document.querySelectorAll<HTMLButtonElement>('.toggle-vis').forEach(btn => {
  btn.addEventListener('click', () => {
    const target = document.getElementById(btn.dataset.target!) as HTMLInputElement
    const isPassword = target.type === 'password'
    target.type = isPassword ? 'text' : 'password'
    btn.textContent = isPassword ? '🙈' : '👁'
  })
})

/* ── Save ── */

saveBtn.addEventListener('click', async () => {
  statusEl.textContent = ''
  statusEl.className = 'status'

  if (activeProvider === 'anthropic') {
    const key = anthropicKeyInput.value.trim()
    if (!key) { showError('Please enter an API key'); return }
    if (!key.startsWith('sk-ant-')) { showError('Key should start with sk-ant-'); return }

    saveBtn.disabled = true
    saveBtn.textContent = 'Validating…'

    try {
      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': key,
          'anthropic-version': '2023-06-01',
          'anthropic-dangerous-direct-browser-access': 'true',
        },
        body: JSON.stringify({
          model: 'claude-haiku-4-5-20251001',
          max_tokens: 10,
          messages: [{ role: 'user', content: 'Hi' }],
        }),
      })

      if (res.ok) {
        const model = anthropicModelSelect.value
        const meta = ANTHROPIC_MODELS[model]
        chrome.storage.sync.set({
          provider: 'anthropic',
          anthropicKey: key,
          anthropicModel: model,
        }, () => showSuccess(`Saved — ${meta?.name || model}`))
      } else {
        const err = await res.json().catch(() => ({ error: { message: `HTTP ${res.status}` } }))
        showError(`Invalid key: ${err.error?.message || res.status}`)
      }
    } catch (e) {
      showError(`Connection error: ${e instanceof Error ? e.message : 'unknown'}`)
    }
  } else {
    const key = openrouterKeyInput.value.trim()
    const isCustom = openrouterModelSelect.value === '__custom__'
    const model = isCustom ? openrouterCustomInput.value.trim() : openrouterModelSelect.value
    if (!key) { showError('Please enter an OpenRouter API key'); return }
    if (!model) { showError('Please select or enter a model'); return }

    saveBtn.disabled = true
    saveBtn.textContent = 'Validating…'

    try {
      const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${key}`,
          'HTTP-Referer': 'https://felix.pago',
          'X-OpenRouter-Title': 'Doc Preso',
        },
        body: JSON.stringify({
          model,
          max_tokens: 10,
          messages: [{ role: 'user', content: 'Hi' }],
        }),
      })

      if (res.ok) {
        const meta = OPENROUTER_MODELS[model]
        chrome.storage.sync.set({
          provider: 'openrouter',
          openrouterKey: key,
          openrouterModel: model,
        }, () => showSuccess(`Saved — ${meta?.name || model}`))
      } else {
        const err = await res.json().catch(() => ({ error: { message: `HTTP ${res.status}` } }))
        showError(`API error: ${err.error?.message || res.status}`)
      }
    } catch (e) {
      showError(`Connection error: ${e instanceof Error ? e.message : 'unknown'}`)
    }
  }

  saveBtn.disabled = false
  saveBtn.textContent = 'Save Settings'
})

function showError(msg: string) {
  statusEl.textContent = msg
  statusEl.className = 'status error'
}

function showSuccess(msg: string) {
  statusEl.textContent = msg + ' ✓'
  statusEl.className = 'status success'
}
