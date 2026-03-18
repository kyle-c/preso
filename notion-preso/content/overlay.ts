import type { SlideData, StreamMessage, ExtractionCache } from '../shared/types'
import { STYLES } from './styles'
import { renderSlides, renderSingleSlide } from './renderer'
import { extractNotionPage, quickExtractNotionPage, detectToggles, detectLazyImages } from './extractor'
import { extractGDocsPage } from './gdocs-extractor'

const isGDocs = () => window.location.hostname.includes('docs.google.com')

async function extractCurrentPage() {
  return isGDocs() ? extractGDocsPage() : await extractNotionPage()
}

function quickExtractCurrentPage() {
  return isGDocs() ? extractGDocsPage() : quickExtractNotionPage()
}

/* ── Content hashing (mirrors service worker) ── */

async function hashContent(text: string): Promise<string> {
  const encoded = new TextEncoder().encode(text)
  const buf = await crypto.subtle.digest('SHA-256', encoded)
  return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('')
}

function serializeForHash(page: { title: string; blocks: { type: string; text: string }[] }): string {
  return page.title + '\n' + page.blocks.map(b => b.text).join('\n')
}

/* ── Background pre-extraction ── */

let backgroundCache: ExtractionCache | null = null
let preProcessSent = false
let mutationDebounce: ReturnType<typeof setTimeout> | null = null

async function backgroundExtract() {
  try {
    const page = quickExtractCurrentPage()
    const contentStr = serializeForHash(page)
    const hash = await hashContent(contentStr)

    // Skip if content hasn't changed
    if (backgroundCache?.hash === hash) return

    backgroundCache = {
      page,
      hash,
      timestamp: Date.now(),
      hasToggles: !isGDocs() && detectToggles(),
      hasLazyImages: !isGDocs() && detectLazyImages(),
    }

    // Send to service worker for background pre-processing (outline generation)
    if (!preProcessSent || backgroundCache.hash !== hash) {
      preProcessSent = true
      chrome.runtime.sendMessage(
        { type: 'PRE_PROCESS', payload: page },
        () => { /* response handled silently */ }
      )
    }
  } catch { /* background extraction is best-effort */ }
}

function setupBackgroundExtraction() {
  // Initial extraction after page settles
  setTimeout(backgroundExtract, 3000)

  // Re-extract on content changes via MutationObserver
  const contentArea =
    document.querySelector('.notion-page-content') ||
    document.querySelector('.notion-frame') ||
    document.querySelector('.kix-appview-editor') ||
    document.body

  const observer = new MutationObserver(() => {
    if (mutationDebounce) clearTimeout(mutationDebounce)
    mutationDebounce = setTimeout(backgroundExtract, 10000)
  })

  observer.observe(contentArea, {
    childList: true,
    subtree: true,
    characterData: true,
  })
}

// Start background extraction when content script loads
setupBackgroundExtraction()

/* ── Inject bundled fonts into document so shadow DOM can use them ── */

let fontsInjected = false

function injectFonts() {
  if (fontsInjected) return
  fontsInjected = true

  const plainBlack = chrome.runtime.getURL('fonts/plain/Plain-Black.woff2')
  const plainExtrabold = chrome.runtime.getURL('fonts/plain/Plain-Extrabold.woff2')
  const saansLight = chrome.runtime.getURL('fonts/saans/SaansLight.woff2')
  const saansRegular = chrome.runtime.getURL('fonts/saans/SaansRegular.woff2')
  const saansMedium = chrome.runtime.getURL('fonts/saans/SaansMedium.woff2')
  const saansSemiBold = chrome.runtime.getURL('fonts/saans/SaansSemiBold.woff2')

  const css = `
    @font-face { font-family: 'Plain'; font-weight: 900; font-display: swap; src: url('${plainBlack}') format('woff2'); }
    @font-face { font-family: 'Plain'; font-weight: 800; font-display: swap; src: url('${plainExtrabold}') format('woff2'); }
    @font-face { font-family: 'Saans'; font-weight: 300; font-display: swap; src: url('${saansLight}') format('woff2'); }
    @font-face { font-family: 'Saans'; font-weight: 400; font-display: swap; src: url('${saansRegular}') format('woff2'); }
    @font-face { font-family: 'Saans'; font-weight: 500; font-display: swap; src: url('${saansMedium}') format('woff2'); }
    @font-face { font-family: 'Saans'; font-weight: 600; font-display: swap; src: url('${saansSemiBold}') format('woff2'); }
  `

  const style = document.createElement('style')
  style.textContent = css
  document.head.appendChild(style)
}

/* ── Full-screen presentation overlay ── */

let overlayHost: HTMLElement | null = null

function destroy() {
  if (overlayHost) {
    overlayHost.remove()
    overlayHost = null
    document.body.style.overflow = ''
  }
}

function showLoading(shadow: ShadowRoot): HTMLElement {
  const loading = document.createElement('div')
  loading.className = 'loading-overlay'
  loading.innerHTML = `
    <div class="loading-spinner"></div>
    <div class="loading-text" id="loading-phase">Extracting page content…</div>
    <div class="loading-subtitle" id="loading-model">Expanding toggles &amp; loading images</div>
  `
  shadow.appendChild(loading)
  return loading
}

function updateLoadingPhase(shadow: ShadowRoot, phase: string, subtitle?: string) {
  const phaseEl = shadow.getElementById('loading-phase')
  const sub = shadow.getElementById('loading-model')
  if (phaseEl) phaseEl.textContent = phase

  if (subtitle && sub) {
    sub.textContent = subtitle
    return
  }

  chrome.storage.sync.get(['provider', 'anthropicModel', 'openrouterModel'], (result) => {
    if (!sub) return
    const provider = result.provider || 'anthropic'
    if (provider === 'openrouter') {
      const m = result.openrouterModel || 'openrouter model'
      sub.textContent = `Using ${m} via OpenRouter`
    } else {
      const m = result.anthropicModel || 'claude-sonnet-4-20250514'
      const short: Record<string, string> = {
        'claude-haiku-4-5-20251001': 'Claude Haiku 4.5',
        'claude-sonnet-4-20250514': 'Claude Sonnet 4',
        'claude-sonnet-4-5-20250514': 'Claude Sonnet 4.5',
        'claude-sonnet-4-6-20250514': 'Claude Sonnet 4.6',
      }
      sub.textContent = `Using ${short[m] || m}`
    }
  })
}

function showError(shadow: ShadowRoot, message: string) {
  const err = document.createElement('div')
  err.className = 'error-overlay'
  err.innerHTML = `
    <div class="error-title">Something went wrong</div>
    <div class="error-message">${message.replace(/</g, '&lt;')}</div>
    <button class="error-btn">Close</button>
  `
  err.querySelector('.error-btn')?.addEventListener('click', destroy)
  shadow.appendChild(err)
}

/* ── Streaming presentation builder ── */

function createStreamingPresentation(shadow: ShadowRoot) {
  const root = document.createElement('div')
  root.className = 'preso-root'

  let current = 0
  let total = 0
  const slideEls: HTMLElement[] = []
  const slides: SlideData[] = []

  // Build chrome
  const progressTrack = document.createElement('div')
  const progressFill = document.createElement('div')
  const counter = document.createElement('div')

  const regenBtn = document.createElement('button')
  regenBtn.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M1 4v6h6"/><path d="M3.51 15a9 9 0 105.64-11.36L3 10"/></svg>`
  regenBtn.title = 'Regenerate (ignore cache)'
  regenBtn.addEventListener('click', () => triggerGeneration(true))

  const closeBtn = document.createElement('button')
  closeBtn.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M18 6L6 18M6 6l12 12"/></svg>`
  closeBtn.addEventListener('click', destroy)

  const dotsContainer = document.createElement('div')
  dotsContainer.className = 'dots'
  const dots: HTMLElement[] = []

  const prevBtn = document.createElement('button')
  prevBtn.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M15 19l-7-7 7-7"/></svg>`
  const nextBtn = document.createElement('button')
  nextBtn.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M9 5l7 7-7 7"/></svg>`

  function getBgClass(): string {
    return slides[current]?.bg || 'dark'
  }

  function updateChrome() {
    if (total === 0) return
    const bg = getBgClass()

    progressTrack.className = `progress-track ${bg}`
    progressFill.className = `progress-fill ${bg}`
    progressFill.style.width = `${((current + 1) / total) * 100}%`

    counter.className = `counter-pill ${bg}`
    counter.textContent = `${current + 1} / ${total}`

    regenBtn.className = `regen-btn ${bg}`
    closeBtn.className = `close-btn ${bg}`

    dots.forEach((d, i) => {
      d.className = `dot ${i === current ? 'active' : 'inactive'} ${bg}`
    })

    prevBtn.className = `nav-arrow prev ${bg} ${current === 0 ? 'hidden' : ''}`
    nextBtn.className = `nav-arrow next ${bg} ${current === total - 1 ? 'hidden' : ''}`
  }

  function goTo(index: number) {
    if (index < 0 || index >= slideEls.length || index === current) return
    slideEls[current]?.classList.remove('active')
    current = index
    slideEls[current]?.classList.add('active')
    updateChrome()
  }

  function next() { goTo(current + 1) }
  function prev() { goTo(current - 1) }

  // Keyboard
  const keyHandler = (e: KeyboardEvent) => {
    const t = e.target as HTMLElement | null
    if (t?.tagName === 'INPUT' || t?.tagName === 'TEXTAREA') return
    if (e.key === 'Escape') { e.preventDefault(); e.stopPropagation(); destroy(); return }
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown' || e.key === ' ') { e.preventDefault(); next() }
    else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') { e.preventDefault(); prev() }
    else if (e.key === 'Home') { e.preventDefault(); goTo(0) }
    else if (e.key === 'End') { e.preventDefault(); goTo(slideEls.length - 1) }
  }
  window.addEventListener('keydown', keyHandler, true)

  // Touch/swipe
  let touchX: number | null = null
  root.addEventListener('touchstart', (e: TouchEvent) => { touchX = e.targetTouches[0].clientX })
  root.addEventListener('touchend', (e: TouchEvent) => {
    if (touchX === null) return
    const diff = touchX - e.changedTouches[0].clientX
    if (diff > 50) next()
    else if (diff < -50) prev()
    touchX = null
  })

  // Cleanup on destroy
  const origDestroy = destroy
  destroy = () => {
    window.removeEventListener('keydown', keyHandler, true)
    origDestroy()
  }

  prevBtn.addEventListener('click', prev)
  nextBtn.addEventListener('click', next)

  // Assemble chrome
  progressTrack.appendChild(progressFill)
  root.appendChild(progressTrack)
  root.appendChild(counter)
  root.appendChild(regenBtn)
  root.appendChild(closeBtn)
  root.appendChild(dotsContainer)
  root.appendChild(prevBtn)
  root.appendChild(nextBtn)

  shadow.appendChild(root)

  // Return methods for incremental slide addition
  return {
    addSlide(slide: SlideData, index: number) {
      slides[index] = slide
      total = Math.max(total, index + 1)

      const slideEl = renderSingleSlide(slide, index, total)
      if (index === 0) slideEl.classList.add('active')
      slideEls[index] = slideEl

      // Insert before dots container
      root.insertBefore(slideEl, dotsContainer)

      // Add dot
      const dot = document.createElement('button')
      dot.addEventListener('click', () => goTo(index))
      dots[index] = dot
      dotsContainer.appendChild(dot)

      updateChrome()
    },

    finalize(finalSlides: SlideData[]) {
      total = finalSlides.length

      // Re-render all slides with correct total count for footer
      slideEls.forEach(el => el?.remove())
      slideEls.length = 0
      slides.length = 0
      dots.forEach(d => d?.remove())
      dots.length = 0
      dotsContainer.innerHTML = ''

      const rendered = renderSlides(finalSlides)
      rendered.forEach((el, i) => {
        slides[i] = finalSlides[i]
        slideEls[i] = el
        if (i === current) el.classList.add('active')
        root.insertBefore(el, dotsContainer)

        const dot = document.createElement('button')
        dot.addEventListener('click', () => goTo(i))
        dots[i] = dot
        dotsContainer.appendChild(dot)
      })

      updateChrome()
    },
  }
}

/* ── Standard (non-streaming) presentation ── */

function createPresentation(shadow: ShadowRoot, slides: SlideData[]) {
  const root = document.createElement('div')
  root.className = 'preso-root'

  let current = 0
  const total = slides.length
  const slideEls = renderSlides(slides)

  slideEls[0]?.classList.add('active')

  const progressTrack = document.createElement('div')
  const progressFill = document.createElement('div')
  const counter = document.createElement('div')

  const regenBtn = document.createElement('button')
  regenBtn.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M1 4v6h6"/><path d="M3.51 15a9 9 0 105.64-11.36L3 10"/></svg>`
  regenBtn.title = 'Regenerate (ignore cache)'
  regenBtn.addEventListener('click', () => triggerGeneration(true))

  const closeBtn = document.createElement('button')
  closeBtn.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M18 6L6 18M6 6l12 12"/></svg>`
  closeBtn.addEventListener('click', destroy)

  const dotsContainer = document.createElement('div')
  dotsContainer.className = 'dots'
  const dots: HTMLElement[] = []

  const prevBtn = document.createElement('button')
  prevBtn.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M15 19l-7-7 7-7"/></svg>`
  const nextBtn = document.createElement('button')
  nextBtn.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M9 5l7 7-7 7"/></svg>`

  function getBgClass(): string {
    return slides[current]?.bg || 'dark'
  }

  function updateChrome() {
    const bg = getBgClass()
    progressTrack.className = `progress-track ${bg}`
    progressFill.className = `progress-fill ${bg}`
    progressFill.style.width = `${((current + 1) / total) * 100}%`
    counter.className = `counter-pill ${bg}`
    counter.textContent = `${current + 1} / ${total}`
    regenBtn.className = `regen-btn ${bg}`
    closeBtn.className = `close-btn ${bg}`
    dots.forEach((d, i) => {
      d.className = `dot ${i === current ? 'active' : 'inactive'} ${bg}`
    })
    prevBtn.className = `nav-arrow prev ${bg} ${current === 0 ? 'hidden' : ''}`
    nextBtn.className = `nav-arrow next ${bg} ${current === total - 1 ? 'hidden' : ''}`
  }

  function goTo(index: number) {
    if (index < 0 || index >= total || index === current) return
    slideEls[current].classList.remove('active')
    current = index
    slideEls[current].classList.add('active')
    updateChrome()
  }

  function next() { goTo(current + 1) }
  function prev() { goTo(current - 1) }

  for (let i = 0; i < total; i++) {
    const dot = document.createElement('button')
    dot.addEventListener('click', () => goTo(i))
    dots.push(dot)
    dotsContainer.appendChild(dot)
  }

  const keyHandler = (e: KeyboardEvent) => {
    const t = e.target as HTMLElement | null
    if (t?.tagName === 'INPUT' || t?.tagName === 'TEXTAREA') return
    if (e.key === 'Escape') { e.preventDefault(); e.stopPropagation(); destroy(); return }
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown' || e.key === ' ') { e.preventDefault(); next() }
    else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') { e.preventDefault(); prev() }
    else if (e.key === 'Home') { e.preventDefault(); goTo(0) }
    else if (e.key === 'End') { e.preventDefault(); goTo(total - 1) }
  }
  window.addEventListener('keydown', keyHandler, true)

  let touchX: number | null = null
  root.addEventListener('touchstart', (e: TouchEvent) => { touchX = e.targetTouches[0].clientX })
  root.addEventListener('touchend', (e: TouchEvent) => {
    if (touchX === null) return
    const diff = touchX - e.changedTouches[0].clientX
    if (diff > 50) next()
    else if (diff < -50) prev()
    touchX = null
  })

  const origDestroy = destroy
  destroy = () => {
    window.removeEventListener('keydown', keyHandler, true)
    origDestroy()
  }

  prevBtn.addEventListener('click', prev)
  nextBtn.addEventListener('click', next)

  progressTrack.appendChild(progressFill)
  root.appendChild(progressTrack)
  root.appendChild(counter)
  root.appendChild(regenBtn)
  root.appendChild(closeBtn)
  slideEls.forEach(s => root.appendChild(s))
  root.appendChild(dotsContainer)
  root.appendChild(prevBtn)
  root.appendChild(nextBtn)

  updateChrome()
  shadow.appendChild(root)
}

/* ── Public API ── */

export function showPresentation(slides: SlideData[]) {
  injectFonts()
  destroy()

  overlayHost = document.createElement('div')
  overlayHost.id = 'notion-preso-overlay'
  overlayHost.style.cssText = 'position:fixed;inset:0;z-index:999999;'
  document.body.appendChild(overlayHost)
  document.body.style.overflow = 'hidden'

  const shadow = overlayHost.attachShadow({ mode: 'closed' })
  const style = document.createElement('style')
  style.textContent = STYLES
  shadow.appendChild(style)

  createPresentation(shadow, slides)
}

export function triggerGeneration(forceRefresh = false) {
  injectFonts()
  destroy()

  overlayHost = document.createElement('div')
  overlayHost.id = 'notion-preso-overlay'
  overlayHost.style.cssText = 'position:fixed;inset:0;z-index:999999;'
  document.body.appendChild(overlayHost)
  document.body.style.overflow = 'hidden'

  const shadow = overlayHost.attachShadow({ mode: 'closed' })
  const style = document.createElement('style')
  style.textContent = STYLES
  shadow.appendChild(style)

  const loading = showLoading(shadow)

  // Decide whether we can skip full extraction
  const canUseCached = !forceRefresh
    && backgroundCache
    && (Date.now() - backgroundCache.timestamp < 60000)
    && !backgroundCache.hasToggles
    && !backgroundCache.hasLazyImages

  const extractPromise = canUseCached
    ? Promise.resolve(backgroundCache!.page)
    : (async () => {
        if (backgroundCache && !backgroundCache.hasToggles && !backgroundCache.hasLazyImages) {
          // No toggles or lazy images — quick extract is sufficient
          return quickExtractCurrentPage()
        }
        // Full extraction needed
        updateLoadingPhase(shadow, 'Extracting page content…', 'Expanding toggles & loading images')
        return await extractCurrentPage()
      })()

  extractPromise.then(page => {
    updateLoadingPhase(shadow, 'Generating presentation…')

    // Use streaming via port
    const port = chrome.runtime.connect({ name: 'preso-stream' })
    port.postMessage({ type: 'GENERATE_STREAM', payload: page, forceRefresh })

    let streamingPreso: ReturnType<typeof createStreamingPresentation> | null = null
    let loadingRemoved = false
    let slideCount = 0

    port.onMessage.addListener((msg: StreamMessage) => {
      if (msg.type === 'STREAM_START') {
        // Don't remove loading yet — wait for first slide
      }

      if (msg.type === 'STREAM_SLIDE') {
        if (!loadingRemoved) {
          loading.remove()
          loadingRemoved = true
          streamingPreso = createStreamingPresentation(shadow)
        }
        streamingPreso!.addSlide(msg.slide, msg.index)
        slideCount++
      }

      if (msg.type === 'STREAM_DONE') {
        if (!loadingRemoved) {
          loading.remove()
          loadingRemoved = true
        }

        if (msg.slides.length > 0) {
          if (streamingPreso && slideCount > 0) {
            // Re-render with correct totals
            streamingPreso.finalize(msg.slides)
          } else {
            // Fallback: create standard presentation
            createPresentation(shadow, msg.slides)
          }
        } else {
          showError(shadow, 'No slides generated. Please try again.')
        }

        port.disconnect()
      }

      if (msg.type === 'STREAM_ERROR') {
        if (!loadingRemoved) {
          loading.remove()
          loadingRemoved = true
        }
        showError(shadow, msg.error)
        port.disconnect()
      }
    })

    port.onDisconnect.addListener(() => {
      if (!loadingRemoved) {
        loading.remove()
        showError(shadow, 'Connection to extension lost. Please try again.')
      }
    })
  }).catch(err => {
    loading.remove()
    showError(shadow, err.message || 'Failed to extract page content')
  })
}

/* ── Listen for trigger from popup ── */
chrome.runtime.onMessage.addListener((message) => {
  if (message.type === 'TRIGGER_EXTRACT') {
    triggerGeneration(!!message.forceRefresh)
  }
})
