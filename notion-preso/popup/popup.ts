const generateBtn = document.getElementById('generate-btn') as HTMLButtonElement
const regenBtn = document.getElementById('regen-btn') as HTMLButtonElement
const optionsBtn = document.getElementById('options-btn') as HTMLButtonElement
const optionsBtn2 = document.getElementById('options-btn-2') as HTMLButtonElement
const statusEl = document.getElementById('status') as HTMLElement
const mainContent = document.getElementById('main-content') as HTMLElement
const notNotion = document.getElementById('not-notion') as HTMLElement
const modelBadge = document.getElementById('model-badge') as HTMLElement

// Check if we're on a supported page
chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
  const url = tabs[0]?.url || ''
  const isNotion = url.includes('notion.so')
  const isGDocs = url.includes('docs.google.com/document')
  if (!isNotion && !isGDocs) {
    mainContent.style.display = 'none'
    notNotion.style.display = 'block'
  }
})

// Check config and show active model
chrome.storage.sync.get(
  ['provider', 'anthropicKey', 'anthropicModel', 'openrouterKey', 'openrouterModel',
   'claudeApiKey', 'claudeModel'],
  (result) => {
    const provider = result.provider || 'anthropic'
    let hasKey = false
    let modelName = ''

    if (provider === 'openrouter') {
      hasKey = !!result.openrouterKey
      modelName = result.openrouterModel || 'anthropic/claude-haiku-4.5'
      modelBadge.textContent = `OpenRouter → ${modelName}`
    } else {
      hasKey = !!(result.anthropicKey || result.claudeApiKey)
      modelName = result.anthropicModel || result.claudeModel || 'claude-sonnet-4-20250514'
      const SHORT: Record<string, string> = {
        'claude-haiku-4-5-20251001': 'Haiku 4.5',
        'claude-sonnet-4-20250514': 'Sonnet 4',
        'claude-sonnet-4-5-20250514': 'Sonnet 4.5',
        'claude-sonnet-4-6-20250514': 'Sonnet 4.6',
      }
      modelBadge.textContent = `Anthropic → ${SHORT[modelName] || modelName}`
    }

    if (!hasKey) {
      statusEl.textContent = 'Set your API key in settings first'
      statusEl.classList.add('visible', 'error')
      generateBtn.disabled = true
      regenBtn.disabled = true
      modelBadge.textContent = 'No API key configured'
    }
  }
)

function triggerPresentation(forceRefresh: boolean) {
  generateBtn.disabled = true
  regenBtn.disabled = true
  generateBtn.textContent = forceRefresh ? 'Regenerating…' : 'Generating…'
  statusEl.textContent = 'Extracting page content…'
  statusEl.classList.add('visible')
  statusEl.classList.remove('error')

  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (tabs[0]?.id) {
      chrome.tabs.sendMessage(tabs[0].id, { type: 'TRIGGER_EXTRACT', forceRefresh })
      setTimeout(() => window.close(), 500)
    }
  })
}

generateBtn.addEventListener('click', () => triggerPresentation(false))
regenBtn.addEventListener('click', () => triggerPresentation(true))

const openOptions = () => chrome.runtime.openOptionsPage()
optionsBtn.addEventListener('click', openOptions)
optionsBtn2?.addEventListener('click', openOptions)
