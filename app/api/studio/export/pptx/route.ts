import { NextRequest, NextResponse } from 'next/server'
import PptxGenJS from 'pptxgenjs'
import { getServerSession } from '@/lib/studio-auth'
import { getBrandKit } from '@/lib/brand-kit'

export const runtime = 'nodejs'
export const maxDuration = 60

/* ── Color helpers ──────────────────────────────────────────── */

// Brand colors — loaded from the user's brand kit or Félix defaults
interface BrandPptx { darkBg: string; lightBg: string; brandBg: string }
const DEFAULTS: BrandPptx = { darkBg: '082422', lightBg: 'EFEBE7', brandBg: '2BF2F1' }

function hexToSix(hex: string): string {
  const clean = hex.replace('#', '')
  return clean.length === 3
    ? clean.split('').map(c => c + c).join('')
    : clean.substring(0, 6)
}

function isHexDark(hex: string): boolean {
  const c = hex.replace('#', '').substring(0, 6)
  if (c.length < 6) return false
  const r = parseInt(c.substring(0, 2), 16)
  const g = parseInt(c.substring(2, 4), 16)
  const b = parseInt(c.substring(4, 6), 16)
  return (r * 299 + g * 587 + b * 114) / 1000 < 128
}

function bgColor(bg: string, brand: BrandPptx): string {
  if (bg === 'dark') return brand.darkBg
  if (bg === 'brand') return brand.brandBg
  return brand.lightBg
}

function textColor(bg: string, brand: BrandPptx): string {
  const hex = bgColor(bg, brand)
  return isHexDark(hex) ? 'EFEBE7' : '082422'
}

function mutedColor(bg: string, brand: BrandPptx): string {
  const hex = bgColor(bg, brand)
  return isHexDark(hex) ? '877867' : '877867'
}

const FONT_DISPLAY = 'Arial Black'
const FONT_BODY = 'Arial'

/* ── Slide renderers ────────────────────────────────────────── */

interface SlideInput {
  type: string
  bg: string
  badge?: string
  title: string
  subtitle?: string
  body?: string
  bullets?: { text: string; icon?: string }[]
  cards?: { title: string; titleColor?: string; body: string }[]
  columns?: { heading?: string; body?: string; bullets?: { text: string; icon?: string }[] }[]
  quote?: { text: string; attribution?: string }
  imageUrl?: string
  notes?: string
}

function addBadge(slide: PptxGenJS.Slide, badge: string, y: number, bg: string, brand: BrandPptx = DEFAULTS) {
  const color = bg === 'dark' ? '2BF2F1' : '35605F'
  slide.addText(badge.toUpperCase(), {
    x: 0.6, y, w: 3, h: 0.25,
    fontSize: 9, fontFace: FONT_BODY, bold: true, color,
    charSpacing: 2.5,
  })
}

function addFooter(slide: PptxGenJS.Slide, num: number, total: number, title: string, bg: string, brand: BrandPptx = DEFAULTS) {
  const color = bg === 'dark' ? 'EFEBE7' : '082422'
  const muted = mutedColor(bg)
  slide.addText(title, { x: 0.5, y: '92%', w: 2.5, h: 0.3, fontSize: 8, fontFace: FONT_DISPLAY, color, bold: true })
  slide.addText('felixpago.com', { x: 3.5, y: '92%', w: 3, h: 0.3, fontSize: 8, fontFace: FONT_BODY, color: muted, align: 'center' })
  slide.addText(`${num} / ${total}`, { x: 7.5, y: '92%', w: 2, h: 0.3, fontSize: 8, fontFace: FONT_BODY, color: muted, align: 'right' })
}

function renderTitle(pptx: PptxGenJS, data: SlideInput, idx: number, total: number, deckTitle: string, brand: BrandPptx = DEFAULTS) {
  const s = pptx.addSlide()
  s.background = { color: bgColor(data.bg, brand) }
  const tc = textColor(data.bg, brand)

  if (data.badge) addBadge(s, data.badge!,2.0, data.bg)
  const titleY = data.badge ? 2.3 : 2.0

  s.addText(data.title, {
    x: 0.6, y: titleY, w: 8.8, h: 1.2,
    fontSize: 40, fontFace: FONT_DISPLAY, color: tc, align: 'center', bold: true,
    lineSpacing: 44,
  })
  if (data.subtitle) {
    s.addText(data.subtitle, {
      x: 1.5, y: titleY + 1.2, w: 7, h: 0.5,
      fontSize: 16, fontFace: FONT_BODY, color: mutedColor(data.bg, brand), align: 'center',
    })
  }
  if (data.notes) s.addNotes(data.notes)
  addFooter(s, idx + 1, total, deckTitle, data.bg)
}

function renderContent(pptx: PptxGenJS, data: SlideInput, idx: number, total: number, deckTitle: string, brand: BrandPptx = DEFAULTS) {
  const s = pptx.addSlide()
  s.background = { color: bgColor(data.bg, brand) }
  const tc = textColor(data.bg, brand)

  let y = 0.5
  if (data.badge) { addBadge(s, data.badge!,y, data.bg); y += 0.35 }
  s.addText(data.title, {
    x: 0.6, y, w: 8.8, h: 0.6,
    fontSize: 28, fontFace: FONT_DISPLAY, color: tc, bold: true,
  })
  y += 0.7
  if (data.body) {
    s.addText(data.body, {
      x: 0.6, y, w: 8.8, h: 3.5,
      fontSize: 14, fontFace: FONT_BODY, color: tc, lineSpacing: 22, valign: 'top',
    })
  }
  if (data.notes) s.addNotes(data.notes)
  addFooter(s, idx + 1, total, deckTitle, data.bg)
}

function renderBullets(pptx: PptxGenJS, data: SlideInput, idx: number, total: number, deckTitle: string, brand: BrandPptx = DEFAULTS) {
  const s = pptx.addSlide()
  s.background = { color: bgColor(data.bg, brand) }
  const tc = textColor(data.bg, brand)

  let y = 0.5
  if (data.badge) { addBadge(s, data.badge!,y, data.bg); y += 0.35 }
  s.addText(data.title, {
    x: 0.6, y, w: 8.8, h: 0.6,
    fontSize: 28, fontFace: FONT_DISPLAY, color: tc, bold: true,
  })
  y += 0.8

  const bulletTexts = (data.bullets || []).map(b => ({
    text: `${b.icon ? b.icon + '  ' : '•  '}${b.text}`,
    options: { fontSize: 14, fontFace: FONT_BODY, color: tc, lineSpacing: 24, breakType: 'none' as const },
  }))

  if (bulletTexts.length > 0) {
    s.addText(bulletTexts, {
      x: 0.8, y, w: 8.4, h: 3.5, valign: 'top',
      paraSpaceAfter: 8,
    })
  }

  if (data.notes) s.addNotes(data.notes)
  addFooter(s, idx + 1, total, deckTitle, data.bg)
}

function renderCards(pptx: PptxGenJS, data: SlideInput, idx: number, total: number, deckTitle: string, brand: BrandPptx = DEFAULTS) {
  const s = pptx.addSlide()
  s.background = { color: bgColor(data.bg, brand) }
  const tc = textColor(data.bg, brand)

  let y = 0.4
  if (data.badge) { addBadge(s, data.badge!,y, data.bg); y += 0.35 }
  s.addText(data.title, {
    x: 0.6, y, w: 8.8, h: 0.5,
    fontSize: 24, fontFace: FONT_DISPLAY, color: tc, bold: true,
  })
  y += 0.65

  const cards = data.cards || []
  const cols = cards.length <= 3 ? cards.length : cards.length <= 4 ? 2 : 3
  const rows = Math.ceil(cards.length / cols)
  const cardW = (8.8 - (cols - 1) * 0.2) / cols
  const cardH = rows === 1 ? 3.2 : 1.5

  const cardBg = data.bg === 'dark' ? '0D3331' : 'FFFFFF'

  cards.forEach((card, i) => {
    const col = i % cols
    const row = Math.floor(i / cols)
    const cx = 0.6 + col * (cardW + 0.2)
    const cy = y + row * (cardH + 0.15)
    const titleColor = card.titleColor ? hexToSix(card.titleColor) : (data.bg === 'dark' ? '2BF2F1' : '35605F')

    s.addShape(pptx.ShapeType.roundRect, {
      x: cx, y: cy, w: cardW, h: cardH,
      fill: { color: cardBg }, rectRadius: 0.1,
    })
    s.addText(card.title, {
      x: cx + 0.15, y: cy + 0.1, w: cardW - 0.3, h: 0.35,
      fontSize: 13, fontFace: FONT_DISPLAY, color: titleColor, bold: true,
    })
    s.addText(card.body.replace(/\\n/g, '\n'), {
      x: cx + 0.15, y: cy + 0.45, w: cardW - 0.3, h: cardH - 0.6,
      fontSize: 10, fontFace: FONT_BODY, color: tc, lineSpacing: 14, valign: 'top',
    })
  })

  if (data.notes) s.addNotes(data.notes)
  addFooter(s, idx + 1, total, deckTitle, data.bg)
}

function renderTwoColumn(pptx: PptxGenJS, data: SlideInput, idx: number, total: number, deckTitle: string, brand: BrandPptx = DEFAULTS) {
  const s = pptx.addSlide()
  s.background = { color: bgColor(data.bg, brand) }
  const tc = textColor(data.bg, brand)

  let y = 0.5
  if (data.badge) { addBadge(s, data.badge!,y, data.bg); y += 0.35 }
  s.addText(data.title, {
    x: 0.6, y, w: 8.8, h: 0.6,
    fontSize: 28, fontFace: FONT_DISPLAY, color: tc, bold: true,
  })
  y += 0.8

  const cols = data.columns || []
  cols.forEach((col, ci) => {
    const cx = ci === 0 ? 0.6 : 5.2
    const cw = 4.2
    let cy = y

    if (col.heading) {
      s.addText(col.heading, {
        x: cx, y: cy, w: cw, h: 0.35,
        fontSize: 14, fontFace: FONT_DISPLAY, color: tc, bold: true,
      })
      cy += 0.4
    }
    if (col.body) {
      s.addText(col.body, {
        x: cx, y: cy, w: cw, h: 1.0,
        fontSize: 12, fontFace: FONT_BODY, color: tc, lineSpacing: 18, valign: 'top',
      })
      cy += 1.0
    }
    if (col.bullets && col.bullets.length > 0) {
      const texts = col.bullets.map(b => ({
        text: `${b.icon ? b.icon + '  ' : '•  '}${b.text}`,
        options: { fontSize: 11, fontFace: FONT_BODY, color: tc, lineSpacing: 16, breakType: 'none' as const },
      }))
      s.addText(texts, { x: cx + 0.15, y: cy, w: cw - 0.15, h: 2.5, valign: 'top', paraSpaceAfter: 4 })
    }
  })

  if (data.notes) s.addNotes(data.notes)
  addFooter(s, idx + 1, total, deckTitle, data.bg)
}

function renderQuote(pptx: PptxGenJS, data: SlideInput, idx: number, total: number, deckTitle: string, brand: BrandPptx = DEFAULTS) {
  const s = pptx.addSlide()
  s.background = { color: bgColor(data.bg, brand) }
  const tc = textColor(data.bg, brand)

  if (data.quote) {
    s.addText(`"${data.quote.text}"`, {
      x: 1, y: 1.5, w: 8, h: 2,
      fontSize: 24, fontFace: FONT_BODY, color: tc, align: 'center', italic: true,
      lineSpacing: 32,
    })
    if (data.quote.attribution) {
      s.addText(`— ${data.quote.attribution}`, {
        x: 1, y: 3.5, w: 8, h: 0.4,
        fontSize: 14, fontFace: FONT_BODY, color: mutedColor(data.bg, brand), align: 'center',
      })
    }
  }
  if (data.notes) s.addNotes(data.notes)
  addFooter(s, idx + 1, total, deckTitle, data.bg)
}

function renderClosing(pptx: PptxGenJS, data: SlideInput, idx: number, total: number, deckTitle: string, brand: BrandPptx = DEFAULTS) {
  // Same as title but with closing style
  renderTitle(pptx, data, idx, total, deckTitle, brand)
}

function renderGeneric(pptx: PptxGenJS, data: SlideInput, idx: number, total: number, deckTitle: string, brand: BrandPptx = DEFAULTS) {
  renderContent(pptx, data, idx, total, deckTitle)
}

const RENDERERS: Record<string, typeof renderTitle> = {
  title: renderTitle,
  section: renderTitle,
  content: renderContent,
  bullets: renderBullets,
  cards: renderCards,
  'two-column': renderTwoColumn,
  quote: renderQuote,
  closing: renderClosing,
  image: renderContent,
  checklist: renderBullets,
  chart: renderContent,
}

/* ── API Route ─────────────────────────────────────────────── */

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { slides, title: deckTitle } = body as { slides: SlideInput[]; title: string }

    if (!slides || !Array.isArray(slides) || slides.length === 0) {
      return NextResponse.json({ error: 'No slides provided' }, { status: 400 })
    }

    // Load brand colors for the current user
    let brand: BrandPptx = DEFAULTS
    try {
      const session = await getServerSession()
      if (session?.userId) {
        const kit = await getBrandKit(session.userId)
        if (kit) {
          brand = {
            darkBg: hexToSix(kit.darkBg),
            lightBg: hexToSix(kit.lightBg),
            brandBg: hexToSix(kit.brandBg),
          }
        }
      }
    } catch {}

    const pptx = new PptxGenJS()
    pptx.layout = 'LAYOUT_WIDE' // 13.33 x 7.5 inches (16:9)
    pptx.author = 'Felix Studio'
    pptx.title = deckTitle || 'Presentation'

    const total = slides.length
    for (let i = 0; i < total; i++) {
      const renderer = RENDERERS[slides[i].type] || renderGeneric
      renderer(pptx, slides[i], i, total, deckTitle || 'Presentation', brand)
    }

    const buffer = await pptx.write({ outputType: 'nodebuffer' }) as Buffer
    const filename = (deckTitle || 'presentation').replace(/[^a-zA-Z0-9\s-]/g, '').replace(/\s+/g, '-').toLowerCase()

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
        'Content-Disposition': `attachment; filename="${filename}.pptx"`,
      },
    })
  } catch (err) {
    console.error('[studio/export/pptx]', err)
    return NextResponse.json({ error: 'Export failed' }, { status: 500 })
  }
}
