import type { SlideData, MappedComment } from '../shared/types'
import { pickCommentColor } from '../shared/colors'

/* ── Slide Renderer: converts SlideData[] to DOM elements ── */

function el(tag: string, cls?: string, attrs?: Record<string, string>): HTMLElement {
  const e = document.createElement(tag)
  if (cls) e.className = cls
  if (attrs) Object.entries(attrs).forEach(([k, v]) => e.setAttribute(k, v))
  return e
}

function textEl(tag: string, text: string, cls?: string): HTMLElement {
  const e = el(tag, cls)
  e.textContent = text
  return e
}

function htmlEl(tag: string, html: string, cls?: string): HTMLElement {
  const e = el(tag, cls)
  // Parse **bold** markers safely
  e.innerHTML = html
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
  return e
}

function textColor(bg: string, variant: 'main' | 'muted' = 'main'): string {
  if (bg === 'brand') return variant === 'muted' ? 'text-brand-muted' : 'text-brand'
  if (bg === 'light') return variant === 'muted' ? 'text-light-muted' : 'text-light'
  return variant === 'muted' ? 'text-dark-muted' : 'text-dark'
}

function svgArrow(direction: 'left' | 'right'): string {
  const path = direction === 'left' ? 'M15 19l-7-7 7-7' : 'M9 5l7 7-7 7'
  return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="${path}"/></svg>`
}

/* ── Slide Footer ── */
function renderFooter(num: number, total: number, bg: string): HTMLElement {
  const footer = el('div', `slide-footer ${textColor(bg, 'muted')}`)
  const brand = el('span', `brand-label font-display ${textColor(bg)}`)
  brand.textContent = 'Felix'
  const url = el('span', `url`)
  url.textContent = 'felixpago.com'
  const counter = el('span', textColor(bg))
  counter.textContent = `${num} / ${total}`
  footer.append(brand, url, counter)
  return footer
}

/* ── Pill Badge ── */
function renderBadge(text: string, bg: string): HTMLElement {
  return textEl('span', text, `pill-badge ${bg}`)
}

/* ── Bullet List ── */
function renderBullets(bullets: SlideData['bullets'], bg: string): HTMLElement {
  const list = el('div', 'bullet-list')
  bullets?.forEach(b => {
    const item = el('div', `bullet-item ${textColor(bg, 'muted')}`)
    if (b.icon) {
      const icon = el('span', 'bullet-icon')
      icon.textContent = b.icon
      item.appendChild(icon)
    } else {
      item.appendChild(el('div', `bullet-dot`))
    }
    item.appendChild(htmlEl('span', b.text))
    list.appendChild(item)
  })
  return list
}

/* ── Info Cards ── */
function renderCards(cards: SlideData['cards'], bg: string): HTMLElement {
  const grid = el('div', 'grid-2-3')
  cards?.forEach(c => {
    const card = el('div', `info-card ${bg === 'dark' ? 'dark' : 'light'}`)
    const title = el('div', 'info-card-title')
    title.textContent = c.title
    title.style.color = c.titleColor
    card.appendChild(title)
    card.appendChild(htmlEl('div', c.body, `info-card-body ${textColor(bg, 'muted')}`))
    grid.appendChild(card)
  })
  return grid
}

/* ── Comment Markers ── */
function renderComments(comments: MappedComment[], slideEl: HTMLElement): void {
  let activePopover: HTMLElement | null = null

  comments.forEach(c => {
    const color = pickCommentColor(c.author)
    const marker = el('button', 'comment-marker')
    marker.style.left = `${c.x}%`
    marker.style.top = `${c.y}%`
    marker.style.transform = 'translate(-50%, -50%)'

    const ring = el('div', 'comment-ring')
    ring.style.backgroundColor = color.tint
    marker.appendChild(ring)

    const circle = el('div', 'comment-circle')
    circle.style.backgroundColor = color.bg
    circle.textContent = c.author.charAt(0).toUpperCase()
    marker.appendChild(circle)

    marker.addEventListener('click', (e) => {
      e.stopPropagation()
      if (activePopover) { activePopover.remove(); activePopover = null }

      const popover = el('div', 'comment-popover')
      popover.style.left = `${Math.min(c.x, 70)}%`
      popover.style.top = `${c.y + 5}%`

      const author = textEl('div', c.author, 'comment-popover-author')
      const text = textEl('div', c.text, 'comment-popover-text')
      popover.append(author, text)

      c.replies.forEach(r => {
        const reply = el('div', 'comment-popover-reply')
        reply.appendChild(textEl('div', r.author, 'comment-popover-reply-author'))
        reply.appendChild(textEl('div', r.text, 'comment-popover-text'))
        popover.appendChild(reply)
      })

      slideEl.appendChild(popover)
      activePopover = popover
    })

    slideEl.appendChild(marker)
  })

  slideEl.addEventListener('click', () => {
    if (activePopover) { activePopover.remove(); activePopover = null }
  })
}

/* ── Individual Slide Renderers ── */

function renderTitleSlide(s: SlideData, num: number, total: number): HTMLElement {
  const slide = el('div', `slide bg-${s.bg}`)
  const body = el('div', 'slide-body')
  const inner = el('div', 'slide-inner')
  inner.style.textAlign = 'center'
  inner.style.display = 'flex'
  inner.style.flexDirection = 'column'
  inner.style.alignItems = 'center'

  const h1 = el('h1', `title-heading huge ${textColor(s.bg)}`)
  h1.innerHTML = s.title.replace(/&/g, '&amp;').replace(/</g, '&lt;')
  if (s.subtitle) {
    h1.innerHTML += `<br><span style="opacity:0.6">${s.subtitle.replace(/&/g, '&amp;').replace(/</g, '&lt;')}</span>`
  }
  inner.appendChild(h1)

  if (s.badge) {
    const badge = renderBadge(s.badge, s.bg)
    badge.style.marginTop = '1.5rem'
    inner.appendChild(badge)
  }

  body.appendChild(inner)
  slide.append(body, renderFooter(num, total, s.bg))
  return slide
}

function renderSectionSlide(s: SlideData, num: number, total: number): HTMLElement {
  const slide = el('div', `slide bg-${s.bg}`)
  const body = el('div', 'slide-body')
  const inner = el('div', 'slide-inner')
  inner.style.textAlign = 'center'
  inner.style.display = 'flex'
  inner.style.flexDirection = 'column'
  inner.style.alignItems = 'center'

  if (s.badge) inner.appendChild(renderBadge(s.badge, s.bg))

  const h2 = el('h2', `section-heading ${textColor(s.bg)}`)
  h2.style.fontSize = 'clamp(2rem, 5vw, 3.5rem)'
  h2.style.marginTop = s.badge ? '1rem' : '0'
  h2.innerHTML = s.title.replace(/&/g, '&amp;').replace(/</g, '&lt;')
  if (s.subtitle) {
    h2.innerHTML += `<br><span class="text-turquoise">${s.subtitle.replace(/&/g, '&amp;').replace(/</g, '&lt;')}</span>`
  }
  inner.appendChild(h2)

  body.appendChild(inner)
  slide.append(body, renderFooter(num, total, s.bg))
  return slide
}

function renderContentSlide(s: SlideData, num: number, total: number): HTMLElement {
  const slide = el('div', `slide bg-${s.bg}`)
  const body = el('div', 'slide-body')
  const inner = el('div', 'slide-inner')

  if (s.badge) {
    const badge = renderBadge(s.badge, s.bg)
    badge.style.marginBottom = '1rem'
    inner.appendChild(badge)
  }

  inner.appendChild(textEl('h2', s.title, `section-heading ${textColor(s.bg)}`))

  if (s.body) {
    inner.appendChild(htmlEl('p', s.body, `body-text ${textColor(s.bg, 'muted')}`))
  }

  body.appendChild(inner)
  slide.append(body, renderFooter(num, total, s.bg))
  return slide
}

function renderBulletsSlide(s: SlideData, num: number, total: number): HTMLElement {
  const slide = el('div', `slide bg-${s.bg}`)
  const body = el('div', 'slide-body')
  const inner = el('div', 'slide-inner')

  if (s.badge) {
    const badge = renderBadge(s.badge, s.bg)
    badge.style.marginBottom = '1rem'
    inner.appendChild(badge)
  }

  inner.appendChild(textEl('h2', s.title, `section-heading ${textColor(s.bg)}`))

  if (s.body) {
    const p = htmlEl('p', s.body, `body-text ${textColor(s.bg, 'muted')}`)
    p.style.marginBottom = '1.5rem'
    inner.appendChild(p)
  }

  if (s.bullets) inner.appendChild(renderBullets(s.bullets, s.bg))

  body.appendChild(inner)
  slide.append(body, renderFooter(num, total, s.bg))
  return slide
}

function renderTwoColumnSlide(s: SlideData, num: number, total: number): HTMLElement {
  const slide = el('div', `slide bg-${s.bg}`)
  const body = el('div', 'slide-body')
  const inner = el('div', 'slide-inner')

  if (s.badge) {
    const badge = renderBadge(s.badge, s.bg)
    badge.style.marginBottom = '1rem'
    inner.appendChild(badge)
  }

  inner.appendChild(textEl('h2', s.title, `section-heading ${textColor(s.bg)}`))

  const grid = el('div', 'grid-2')
  s.columns?.forEach(col => {
    const colEl = el('div', `info-card ${s.bg === 'dark' ? 'dark' : 'light'}`)
    if (col.heading) colEl.appendChild(textEl('h3', col.heading, `info-card-title text-turquoise`))
    if (col.body) colEl.appendChild(htmlEl('p', col.body, `info-card-body ${textColor(s.bg, 'muted')}`))
    if (col.bullets) colEl.appendChild(renderBullets(col.bullets, s.bg))
    grid.appendChild(colEl)
  })
  inner.appendChild(grid)

  body.appendChild(inner)
  slide.append(body, renderFooter(num, total, s.bg))
  return slide
}

function renderCardsSlide(s: SlideData, num: number, total: number): HTMLElement {
  const slide = el('div', `slide bg-${s.bg}`)
  const body = el('div', 'slide-body')
  const inner = el('div', 'slide-inner')

  if (s.badge) {
    const badge = renderBadge(s.badge, s.bg)
    badge.style.marginBottom = '1rem'
    inner.appendChild(badge)
  }

  inner.appendChild(textEl('h2', s.title, `section-heading ${textColor(s.bg)}`))
  if (s.cards) inner.appendChild(renderCards(s.cards, s.bg))

  body.appendChild(inner)
  slide.append(body, renderFooter(num, total, s.bg))
  return slide
}

function renderQuoteSlide(s: SlideData, num: number, total: number): HTMLElement {
  const slide = el('div', `slide bg-${s.bg}`)
  const body = el('div', 'slide-body')
  body.style.flexDirection = 'column'
  body.style.textAlign = 'center'

  if (s.badge) body.appendChild(renderBadge(s.badge, s.bg))

  const q = el('blockquote', `quote-text ${textColor(s.bg)}`)
  q.innerHTML = `&ldquo;${(s.quote?.text || s.body || '').replace(/&/g, '&amp;').replace(/</g, '&lt;')}&rdquo;`
  body.appendChild(q)

  if (s.quote?.attribution) {
    body.appendChild(textEl('p', `— ${s.quote.attribution}`, `quote-attribution ${textColor(s.bg, 'muted')}`))
  }

  slide.append(body, renderFooter(num, total, s.bg))
  return slide
}

function renderImageSlide(s: SlideData, num: number, total: number): HTMLElement {
  const slide = el('div', `slide bg-${s.bg}`)
  const body = el('div', 'slide-body')
  body.style.flexDirection = 'column'
  body.style.gap = '1.5rem'

  if (s.title) body.appendChild(textEl('h2', s.title, `section-heading ${textColor(s.bg)}`))
  if (s.imageUrl) {
    const img = document.createElement('img')
    img.src = s.imageUrl
    img.className = 'slide-image'
    img.alt = s.title
    body.appendChild(img)
  }
  if (s.body) body.appendChild(htmlEl('p', s.body, `body-text ${textColor(s.bg, 'muted')}`))

  slide.append(body, renderFooter(num, total, s.bg))
  return slide
}

function renderChecklistSlide(s: SlideData, num: number, total: number): HTMLElement {
  const slide = el('div', `slide bg-${s.bg}`)
  const body = el('div', 'slide-body')
  const inner = el('div', 'slide-inner')

  if (s.badge) {
    const badge = renderBadge(s.badge, s.bg)
    badge.style.marginBottom = '1rem'
    inner.appendChild(badge)
  }

  inner.appendChild(textEl('h2', s.title, `section-heading ${textColor(s.bg)}`))

  const list = el('div', 'bullet-list')
  s.bullets?.forEach(b => {
    const item = el('div', `check-item ${textColor(s.bg, 'muted')}`)
    const icon = el('span', 'check-icon')
    icon.textContent = b.icon || '✓'
    item.append(icon, htmlEl('span', b.text))
    list.appendChild(item)
  })
  inner.appendChild(list)

  body.appendChild(inner)
  slide.append(body, renderFooter(num, total, s.bg))
  return slide
}

function renderClosingSlide(s: SlideData, num: number, total: number): HTMLElement {
  const slide = el('div', `slide bg-${s.bg}`)

  // Background decorative number
  const bigText = el('div', 'closing-big')
  bigText.textContent = '✦'
  slide.appendChild(bigText)

  const body = el('div', 'slide-body')
  body.style.position = 'relative'
  body.style.zIndex = '10'
  const inner = el('div', 'slide-inner')
  inner.style.textAlign = 'center'
  inner.style.display = 'flex'
  inner.style.flexDirection = 'column'
  inner.style.alignItems = 'center'

  const h2 = el('h2', `title-heading huge ${textColor(s.bg)}`)
  h2.textContent = s.title
  inner.appendChild(h2)

  if (s.subtitle || s.body) {
    const p = htmlEl('p', s.subtitle || s.body || '', `body-text ${textColor(s.bg, 'muted')}`)
    p.style.maxWidth = '560px'
    p.style.marginTop = '1.25rem'
    inner.appendChild(p)
  }

  body.appendChild(inner)
  slide.append(body, renderFooter(num, total, s.bg))
  return slide
}

/* ── Main renderer ── */

const RENDERERS: Record<string, (s: SlideData, n: number, t: number) => HTMLElement> = {
  title: renderTitleSlide,
  section: renderSectionSlide,
  content: renderContentSlide,
  bullets: renderBulletsSlide,
  'two-column': renderTwoColumnSlide,
  cards: renderCardsSlide,
  quote: renderQuoteSlide,
  image: renderImageSlide,
  checklist: renderChecklistSlide,
  closing: renderClosingSlide,
}

export function renderSlides(slides: SlideData[]): HTMLElement[] {
  const total = slides.length
  return slides.map((s, i) => {
    const renderer = RENDERERS[s.type] || renderContentSlide
    const slideEl = renderer(s, i + 1, total)
    // Add comments if any
    if (s.comments?.length) {
      renderComments(s.comments, slideEl)
    }
    return slideEl
  })
}

export function renderSingleSlide(slide: SlideData, index: number, total: number): HTMLElement {
  const renderer = RENDERERS[slide.type] || renderContentSlide
  const slideEl = renderer(slide, index + 1, total)
  if (slide.comments?.length) {
    renderComments(slide.comments, slideEl)
  }
  return slideEl
}
