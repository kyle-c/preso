import PptxGenJS from 'pptxgenjs'

/* ── Brand tokens ──────────────────────────────────────────────────── */
const C = {
  turquoise: '2BF2F1',
  turquoise700: '10A8A7',
  turquoise400: '5DF7F5',
  turquoise50: 'EEFEFE',
  slate: '082422',
  slate950: '082422',
  evergreen: '35605F',
  stone: 'EFEBE7',
  linen: 'FEFCF9',
  concrete: 'CFCABF',
  mocha: '877867',
  white: 'FFFFFF',
  blueberry: '6060BF',
  cactus: '60D06F',
  mango: 'F19D38',
  papaya: 'F26629',
  sage: '7BA882',
  lime: 'DCFF00',
  lychee: 'FFCD9C',
  sky: '8DFDFA',
}

const FONT_DISPLAY = 'Arial Black'
const FONT_BODY = 'Arial'

/* ── Helper ────────────────────────────────────────────────────────── */
function footer(slide: PptxGenJS.Slide, num: number, dark = false) {
  const color = dark ? C.linen : C.slate
  const muted = dark ? C.concrete : C.mocha
  slide.addText('Felix Design System', { x: 0.5, y: '92%', w: 2.5, h: 0.3, fontSize: 8, fontFace: FONT_DISPLAY, color, bold: true })
  slide.addText('felixpago.com', { x: 3.5, y: '92%', w: 3, h: 0.3, fontSize: 8, fontFace: FONT_BODY, color: muted, align: 'center' })
  slide.addText(String(num), { x: 7.5, y: '92%', w: 2, h: 0.3, fontSize: 8, fontFace: FONT_BODY, color, align: 'right' })
}

function sectionLabel(slide: PptxGenJS.Slide, text: string, opts: { x: number; y: number; dark?: boolean }) {
  slide.addText(text.toUpperCase(), {
    x: opts.x, y: opts.y, w: 4, h: 0.3,
    fontSize: 9, fontFace: FONT_BODY, bold: true,
    color: opts.dark ? C.turquoise400 : C.turquoise700,
    charSpacing: 3,
  })
}

/* ═══════════════════════════════════════════════════════════════════ */
/*                           SLIDES                                    */
/* ═══════════════════════════════════════════════════════════════════ */

function slideTitle(pptx: PptxGenJS) {
  const s = pptx.addSlide()
  s.background = { color: C.stone }

  s.addText('Felix Design System', {
    x: 0.5, y: 1.8, w: 9, h: 0.6,
    fontSize: 18, fontFace: FONT_DISPLAY, color: C.turquoise, align: 'center', bold: true,
  })
  s.addText('The Complete Guide', {
    x: 0.5, y: 2.4, w: 9, h: 1.2,
    fontSize: 44, fontFace: FONT_DISPLAY, color: C.slate, align: 'center', bold: true,
    lineSpacing: 48,
  })
  s.addText('Brand foundations, design principles, color, typography, components,\nillustrations, and tokens — everything you need to build Felix.', {
    x: 1.5, y: 3.7, w: 7, h: 0.8,
    fontSize: 14, fontFace: FONT_BODY, color: C.mocha, align: 'center',
    lineSpacing: 20,
  })
  footer(s, 1)
}

function slidePrinciples(pptx: PptxGenJS) {
  const s = pptx.addSlide()
  s.background = { color: C.stone }

  sectionLabel(s, 'Foundations', { x: 0.6, y: 0.5 })
  s.addText('Design Principles', {
    x: 0.6, y: 0.8, w: 8, h: 0.7,
    fontSize: 36, fontFace: FONT_DISPLAY, color: C.slate, bold: true,
  })

  const principles = [
    { num: '01', title: 'Conversational\nTransactions', body: 'Warm, concise, and clear. Like one person helping another.', bg: C.slate950, text: C.white, muted: 'B0B0B0' },
    { num: '02', title: 'Guide Beginners.\nAccelerate Regulars.', body: 'First-timers get trust. Repeat users get speed.', bg: C.turquoise, text: C.slate, muted: C.slate },
    { num: '03', title: 'Never Leave\nUsers Guessing', body: 'Acknowledge, show next steps, set expectations.', bg: C.evergreen, text: C.white, muted: C.turquoise50 },
    { num: '04', title: 'Protection\nWithout Friction', body: 'Smart defaults, real-time validation. Guardrails over gates.', bg: C.stone, text: C.slate, muted: C.mocha },
    { num: '05', title: 'Grow With\nYour Journey', body: 'Meet users where they are. Reveal possibilities gradually.', bg: C.turquoise, text: C.slate, muted: C.slate },
  ]

  const cardW = 1.7
  const gap = 0.15
  const startX = 0.6
  const startY = 1.7

  principles.forEach((p, i) => {
    const x = startX + i * (cardW + gap)
    // Card background
    s.addShape(pptx.ShapeType.roundRect, {
      x, y: startY, w: cardW, h: 3.2,
      fill: { color: p.bg },
      rectRadius: 0.15,
      shadow: { type: 'outer', blur: 6, offset: 2, color: '000000', opacity: 0.15 },
    })
    // Number watermark
    s.addText(p.num, {
      x, y: startY + 0.15, w: cardW, h: 0.8,
      fontSize: 48, fontFace: FONT_DISPLAY, color: p.muted, align: 'center', bold: true,
      transparency: 70,
    })
    // Title
    s.addText(p.title, {
      x: x + 0.15, y: startY + 1.0, w: cardW - 0.3, h: 0.8,
      fontSize: 11, fontFace: FONT_DISPLAY, color: p.text, bold: true,
      lineSpacing: 13,
    })
    // Body
    s.addText(p.body, {
      x: x + 0.15, y: startY + 1.9, w: cardW - 0.3, h: 1.0,
      fontSize: 8, fontFace: FONT_BODY, color: p.muted,
      lineSpacing: 12,
    })
  })
  footer(s, 2)
}

function slideColors(pptx: PptxGenJS) {
  const s = pptx.addSlide()
  s.background = { color: C.stone }

  sectionLabel(s, 'Visual Identity', { x: 0.6, y: 0.5 })
  s.addText('Color Palette', {
    x: 0.6, y: 0.8, w: 8, h: 0.7,
    fontSize: 36, fontFace: FONT_DISPLAY, color: C.slate, bold: true,
  })

  // Primary
  s.addText('PRIMARY', { x: 0.6, y: 1.7, w: 3, h: 0.25, fontSize: 8, fontFace: FONT_BODY, bold: true, color: C.mocha, charSpacing: 2 })

  const primaries = [
    { name: 'Turquoise', hex: '#2BF2F1', bg: C.turquoise, text: C.slate },
    { name: 'Slate', hex: '#082422', bg: C.slate950, text: C.white },
  ]
  primaries.forEach((c, i) => {
    const x = 0.6 + i * 4.35
    s.addShape(pptx.ShapeType.roundRect, { x, y: 2.0, w: 4.2, h: 0.9, fill: { color: c.bg }, rectRadius: 0.1 })
    s.addText(c.name, { x: x + 0.2, y: 2.15, w: 2, h: 0.3, fontSize: 16, fontFace: FONT_DISPLAY, color: c.text, bold: true })
    s.addText(c.hex, { x: x + 0.2, y: 2.45, w: 2, h: 0.25, fontSize: 9, fontFace: FONT_BODY, color: c.text, transparency: 30 })
  })

  // Secondary
  s.addText('SECONDARY', { x: 0.6, y: 3.15, w: 3, h: 0.25, fontSize: 8, fontFace: FONT_BODY, bold: true, color: C.mocha, charSpacing: 2 })

  const secondaries = [
    { name: 'Blueberry', hex: '#6060BF', bg: C.blueberry, text: C.white },
    { name: 'Evergreen', hex: '#35605F', bg: C.evergreen, text: C.white },
    { name: 'Cactus', hex: '#60D06F', bg: C.cactus, text: C.slate },
    { name: 'Mango', hex: '#F19D38', bg: C.mango, text: C.slate },
    { name: 'Papaya', hex: '#F26629', bg: C.papaya, text: C.white },
    { name: 'Sage', hex: '#7BA882', bg: C.sage, text: C.white },
    { name: 'Lime', hex: '#DCFF00', bg: C.lime, text: C.slate },
    { name: 'Lychee', hex: '#FFCD9C', bg: C.lychee, text: C.slate },
  ]

  const swW = 1.05
  const swGap = 0.1
  secondaries.forEach((c, i) => {
    const x = 0.6 + i * (swW + swGap)
    s.addShape(pptx.ShapeType.roundRect, { x, y: 3.45, w: swW, h: swW, fill: { color: c.bg }, rectRadius: 0.08 })
    s.addText(`${c.name}\n${c.hex}`, { x: x + 0.08, y: 3.45 + swW - 0.45, w: swW - 0.16, h: 0.4, fontSize: 7, fontFace: FONT_BODY, color: c.text, lineSpacing: 10 })
  })

  // Neutrals
  s.addText('NEUTRALS', { x: 0.6, y: 4.75, w: 3, h: 0.25, fontSize: 8, fontFace: FONT_BODY, bold: true, color: C.mocha, charSpacing: 2 })

  const neutrals = [
    { name: 'Linen', hex: '#FEFCF9', bg: C.linen, text: C.slate },
    { name: 'Stone', hex: '#EFEBE7', bg: C.stone, text: C.slate },
    { name: 'Concrete', hex: '#CFCABF', bg: C.concrete, text: C.slate },
    { name: 'Mocha', hex: '#877867', bg: C.mocha, text: C.white },
  ]
  const nW = 2.15
  neutrals.forEach((c, i) => {
    const x = 0.6 + i * (nW + 0.1)
    s.addShape(pptx.ShapeType.roundRect, { x, y: 5.05, w: nW, h: 0.55, fill: { color: c.bg }, rectRadius: 0.06, line: c.name === 'Linen' ? { color: C.concrete, width: 0.5 } : undefined })
    s.addText(`${c.name}  ${c.hex}`, { x: x + 0.12, y: 5.1, w: nW - 0.2, h: 0.4, fontSize: 8, fontFace: FONT_BODY, color: c.text })
  })

  footer(s, 3)
}

function slideTypography(pptx: PptxGenJS) {
  const s = pptx.addSlide()
  s.background = { color: C.stone }

  sectionLabel(s, 'Visual Identity', { x: 0.6, y: 0.5 })
  s.addText('Typography', {
    x: 0.6, y: 0.8, w: 4, h: 0.7,
    fontSize: 36, fontFace: FONT_DISPLAY, color: C.slate, bold: true,
  })

  // Display font showcase
  s.addShape(pptx.ShapeType.roundRect, { x: 0.6, y: 1.7, w: 4.2, h: 1.5, fill: { color: C.white }, rectRadius: 0.1, line: { color: C.concrete, width: 0.5 } })
  s.addText('DISPLAY — PLAIN', { x: 0.8, y: 1.8, w: 3, h: 0.2, fontSize: 8, fontFace: FONT_BODY, bold: true, color: C.mocha, charSpacing: 2 })
  s.addText('Aa Bb Cc', { x: 0.8, y: 2.05, w: 3.5, h: 0.6, fontSize: 36, fontFace: FONT_DISPLAY, color: C.slate, bold: true })
  s.addText('Extrabold 800  &  Black 900', { x: 0.8, y: 2.7, w: 3.5, h: 0.3, fontSize: 10, fontFace: FONT_BODY, color: C.mocha })

  // Body font showcase
  s.addShape(pptx.ShapeType.roundRect, { x: 0.6, y: 3.4, w: 4.2, h: 1.3, fill: { color: C.white }, rectRadius: 0.1, line: { color: C.concrete, width: 0.5 } })
  s.addText('BODY — SAANS', { x: 0.8, y: 3.5, w: 3, h: 0.2, fontSize: 8, fontFace: FONT_BODY, bold: true, color: C.mocha, charSpacing: 2 })
  s.addText('The quick brown fox jumps over the lazy dog.', { x: 0.8, y: 3.75, w: 3.8, h: 0.45, fontSize: 16, fontFace: FONT_BODY, color: C.slate })
  s.addText('Light 300   Regular 400   Medium 500   SemiBold 600', { x: 0.8, y: 4.25, w: 3.8, h: 0.25, fontSize: 8, fontFace: FONT_BODY, color: C.mocha })

  // Type scale
  s.addText('TYPE SCALE', { x: 5.2, y: 1.7, w: 3, h: 0.2, fontSize: 8, fontFace: FONT_BODY, bold: true, color: C.mocha, charSpacing: 2 })

  const scale = [
    { name: 'Display XL', size: '72px' },
    { name: 'Display LG', size: '60px' },
    { name: 'Display MD', size: '48px' },
    { name: 'Heading 1', size: '36px' },
    { name: 'Heading 2', size: '30px' },
    { name: 'Heading 3', size: '24px' },
    { name: 'Body Large', size: '18px' },
    { name: 'Body', size: '16px' },
    { name: 'Body Small', size: '14px' },
    { name: 'Caption', size: '12px' },
  ]

  scale.forEach((t, i) => {
    const y = 2.0 + i * 0.32
    const displaySize = Math.min(parseInt(t.size), 24)
    s.addText(t.size, { x: 5.2, y, w: 0.6, h: 0.28, fontSize: 7, fontFace: FONT_BODY, color: C.mocha, align: 'right' })
    s.addText(t.name, { x: 5.9, y, w: 2.5, h: 0.28, fontSize: displaySize * 0.55, fontFace: FONT_DISPLAY, color: C.slate, bold: true })
  })

  footer(s, 4)
}

function slideVoice(pptx: PptxGenJS) {
  const s = pptx.addSlide()
  s.background = { color: C.slate950 }

  sectionLabel(s, 'Editorial', { x: 0.6, y: 0.5, dark: true })
  s.addText('Voice & Tone', {
    x: 0.6, y: 0.8, w: 4, h: 0.7,
    fontSize: 36, fontFace: FONT_DISPLAY, color: C.white, bold: true,
  })
  s.addText('Like a knowledgeable friend genuinely helping\nwith cross-border finance. Warm but not casual.\nClear but not blunt.', {
    x: 0.6, y: 1.6, w: 4, h: 0.8,
    fontSize: 13, fontFace: FONT_BODY, color: '8A9E9D',
    lineSpacing: 18,
  })

  // Quote box
  s.addShape(pptx.ShapeType.roundRect, { x: 0.6, y: 2.6, w: 4.2, h: 1.2, fill: { color: '0A3130' }, rectRadius: 0.1, line: { color: '1A4A48', width: 0.5 } })
  s.addText('THE FELIX VOICE', { x: 0.85, y: 2.7, w: 3, h: 0.2, fontSize: 8, fontFace: FONT_BODY, bold: true, color: C.turquoise400, charSpacing: 2 })
  s.addText('"Sending money home should feel as natural as being there in person. We speak like someone you trust, not software you tolerate."', {
    x: 0.85, y: 2.95, w: 3.7, h: 0.7,
    fontSize: 11, fontFace: FONT_BODY, color: 'B0C8C7',
    lineSpacing: 16,
  })

  // We Are / We Are Not table
  const traits = [
    { we: 'Conversational', not: 'Chatty or unprofessional' },
    { we: 'Warm', not: 'Sentimental or over-emotional' },
    { we: 'Concise', not: 'Curt or dismissive' },
    { we: 'Clear', not: 'Dumbed down' },
    { we: 'Confident', not: 'Arrogant or pushy' },
    { we: 'Empathetic', not: 'Patronizing' },
  ]

  s.addText('WE ARE', { x: 5.3, y: 1.7, w: 2, h: 0.25, fontSize: 8, fontFace: FONT_BODY, bold: true, color: C.turquoise400, charSpacing: 2 })
  s.addText('WE ARE NOT', { x: 7.4, y: 1.7, w: 2, h: 0.25, fontSize: 8, fontFace: FONT_BODY, bold: true, color: C.papaya, charSpacing: 2 })

  traits.forEach((t, i) => {
    const y = 2.05 + i * 0.42
    s.addShape(pptx.ShapeType.line, { x: 5.3, y, w: 4.2, h: 0, line: { color: '1A3534', width: 0.5 } })
    s.addText(t.we, { x: 5.3, y: y + 0.05, w: 2, h: 0.3, fontSize: 12, fontFace: FONT_BODY, color: C.white, bold: true })
    s.addText(t.not, { x: 7.4, y: y + 0.05, w: 2.2, h: 0.3, fontSize: 12, fontFace: FONT_BODY, color: '5A7574' })
  })

  footer(s, 5, true)
}

function slideComponents(pptx: PptxGenJS) {
  const s = pptx.addSlide()
  s.background = { color: C.stone }

  sectionLabel(s, 'UI Library', { x: 0.6, y: 0.5 })
  s.addText('Components', {
    x: 0.6, y: 0.8, w: 4, h: 0.7,
    fontSize: 36, fontFace: FONT_DISPLAY, color: C.slate, bold: true,
  })
  s.addText('A library of UI building blocks that follow the Felix design\nlanguage. Accessible, themeable, and composable.', {
    x: 0.6, y: 1.6, w: 4.2, h: 0.6,
    fontSize: 13, fontFace: FONT_BODY, color: C.mocha, lineSpacing: 18,
  })

  // Button variants
  s.addShape(pptx.ShapeType.roundRect, { x: 0.6, y: 2.4, w: 4.2, h: 1.5, fill: { color: C.white }, rectRadius: 0.1, line: { color: C.concrete, width: 0.5 } })
  s.addText('BUTTON VARIANTS', { x: 0.8, y: 2.5, w: 3, h: 0.2, fontSize: 8, fontFace: FONT_BODY, bold: true, color: C.mocha, charSpacing: 2 })

  const buttons = [
    { label: 'Primary', bg: C.turquoise, text: C.slate },
    { label: 'Secondary', bg: C.slate950, text: C.white },
    { label: 'Outline', bg: C.white, text: C.slate },
    { label: 'Destructive', bg: C.papaya, text: C.white },
  ]
  buttons.forEach((b, i) => {
    const x = 0.9 + i * 1.0
    s.addShape(pptx.ShapeType.roundRect, {
      x, y: 2.9, w: 0.88, h: 0.4,
      fill: { color: b.bg }, rectRadius: 0.06,
      line: b.label === 'Outline' ? { color: C.concrete, width: 1 } : undefined,
    })
    s.addText(b.label, { x, y: 2.92, w: 0.88, h: 0.36, fontSize: 8, fontFace: FONT_DISPLAY, color: b.text, align: 'center', bold: true })
  })

  s.addText('7 variants  ·  4 sizes  ·  Loading + disabled states  ·  Icon support', {
    x: 0.8, y: 3.5, w: 3.8, h: 0.25, fontSize: 8, fontFace: FONT_BODY, color: C.mocha,
  })

  // Component cards
  const comps = [
    { name: 'Buttons', desc: '7 variants, 4 sizes' },
    { name: 'Cards', desc: 'Default, Featured, Accent' },
    { name: 'Inputs', desc: 'Floating labels, validation' },
    { name: 'Badges', desc: 'Status + brand-colored' },
  ]
  comps.forEach((c, i) => {
    const col = i % 2
    const row = Math.floor(i / 2)
    const x = 5.3 + col * 2.2
    const y = 1.7 + row * 1.8

    s.addShape(pptx.ShapeType.roundRect, { x, y, w: 2.0, h: 1.5, fill: { color: C.white }, rectRadius: 0.1, line: { color: C.concrete, width: 0.5 } })
    s.addText(c.name, { x: x + 0.2, y: y + 0.4, w: 1.6, h: 0.35, fontSize: 14, fontFace: FONT_DISPLAY, color: C.slate, bold: true })
    s.addText(c.desc, { x: x + 0.2, y: y + 0.8, w: 1.6, h: 0.4, fontSize: 9, fontFace: FONT_BODY, color: C.mocha, lineSpacing: 13 })
  })

  footer(s, 6)
}

function slideIllustrations(pptx: PptxGenJS) {
  const s = pptx.addSlide()
  s.background = { color: C.stone }

  sectionLabel(s, 'Visual Assets', { x: 0.6, y: 0.5 })
  s.addText('Illustration Library', {
    x: 0.6, y: 0.8, w: 8, h: 0.7,
    fontSize: 36, fontFace: FONT_DISPLAY, color: C.slate, bold: true,
  })
  s.addText('89+ hand-crafted illustrations across 9 categories. Available in SVG and PNG.', {
    x: 0.6, y: 1.5, w: 6, h: 0.35,
    fontSize: 13, fontFace: FONT_BODY, color: C.mocha,
  })

  const categories = [
    { name: 'Brand & Characters', count: '5' },
    { name: 'Flags (3D + Original)', count: '15' },
    { name: 'Hands', count: '11' },
    { name: 'Money & Payments', count: '29' },
    { name: 'Communication', count: '11' },
    { name: 'Status & Alerts', count: '8' },
    { name: 'Navigation & Maps', count: '3' },
    { name: 'Other', count: '7' },
  ]

  categories.forEach((cat, i) => {
    const col = i % 4
    const row = Math.floor(i / 4)
    const x = 0.6 + col * 2.25
    const y = 2.2 + row * 1.5

    s.addShape(pptx.ShapeType.roundRect, { x, y, w: 2.1, h: 1.2, fill: { color: C.white }, rectRadius: 0.1, line: { color: C.concrete, width: 0.5 } })
    s.addText(cat.count, { x: x + 0.2, y: y + 0.15, w: 1, h: 0.4, fontSize: 24, fontFace: FONT_DISPLAY, color: C.turquoise700, bold: true })
    s.addText(cat.name, { x: x + 0.2, y: y + 0.6, w: 1.7, h: 0.4, fontSize: 10, fontFace: FONT_DISPLAY, color: C.slate, bold: true, lineSpacing: 13 })
  })

  footer(s, 7)
}

function slideTokens(pptx: PptxGenJS) {
  const s = pptx.addSlide()
  s.background = { color: C.slate950 }

  sectionLabel(s, 'System', { x: 0.6, y: 0.5, dark: true })
  s.addText('Design Tokens', {
    x: 0.6, y: 0.8, w: 4, h: 0.7,
    fontSize: 36, fontFace: FONT_DISPLAY, color: C.white, bold: true,
  })
  s.addText('The atomic values that power the entire system.\nMapped to shadcn/ui naming conventions.', {
    x: 0.6, y: 1.6, w: 4, h: 0.6,
    fontSize: 13, fontFace: FONT_BODY, color: '8A9E9D', lineSpacing: 18,
  })

  // Code snippet
  s.addShape(pptx.ShapeType.roundRect, { x: 0.6, y: 2.4, w: 4.2, h: 1.8, fill: { color: '0A2E2C' }, rectRadius: 0.1, line: { color: '1A4A48', width: 0.5 } })
  const codeLines = [
    '--primary: #2BF2F1',
    '--foreground: #082422',
    '--background: #FEFCF9',
    '--spacing-md: 1rem',
    '--radius: 1rem',
    '--shadow-md: 0 4px 6px ...',
  ]
  codeLines.forEach((line, i) => {
    s.addText(line, { x: 0.85, y: 2.55 + i * 0.25, w: 3.5, h: 0.22, fontSize: 9, fontFace: 'Courier New', color: C.turquoise400 })
  })

  // Token category cards
  const tokens = [
    { label: 'Colors', count: '42+', desc: 'Primary, secondary, semantic' },
    { label: 'Typography', count: '11', desc: 'Font sizes 12px to 72px' },
    { label: 'Spacing', count: '7', desc: '4px base unit, xs to 3xl' },
    { label: 'Shadows', count: '8', desc: 'xs to 2xl + brand glow' },
    { label: 'Radius', count: '5', desc: '4px to full pill' },
    { label: 'Weights', count: '6', desc: '300 Light to 900 Black' },
  ]

  tokens.forEach((t, i) => {
    const col = i % 2
    const row = Math.floor(i / 2)
    const x = 5.3 + col * 2.2
    const y = 1.7 + row * 1.3

    s.addShape(pptx.ShapeType.roundRect, { x, y, w: 2.0, h: 1.05, fill: { color: '0A2E2C' }, rectRadius: 0.1, line: { color: '1A4A48', width: 0.5 } })
    s.addText(t.count, { x: x + 0.15, y: y + 0.1, w: 1, h: 0.35, fontSize: 22, fontFace: FONT_DISPLAY, color: C.turquoise, bold: true })
    s.addText(t.label, { x: x + 0.15, y: y + 0.45, w: 1.7, h: 0.25, fontSize: 11, fontFace: FONT_DISPLAY, color: C.white, bold: true })
    s.addText(t.desc, { x: x + 0.15, y: y + 0.7, w: 1.7, h: 0.25, fontSize: 8, fontFace: FONT_BODY, color: '5A7574' })
  })

  footer(s, 8, true)
}

function slideMultilingual(pptx: PptxGenJS) {
  const s = pptx.addSlide()
  s.background = { color: C.stone }

  sectionLabel(s, 'Global Reach', { x: 0.6, y: 0.5 })
  s.addText('Multilingual\nby Default', {
    x: 0.6, y: 0.8, w: 4, h: 1.0,
    fontSize: 36, fontFace: FONT_DISPLAY, color: C.slate, bold: true, lineSpacing: 40,
  })
  s.addText('Every string designed for three languages from the start.\nNot localized after the fact — conceived multilingually.', {
    x: 0.6, y: 1.9, w: 4, h: 0.6,
    fontSize: 13, fontFace: FONT_BODY, color: C.mocha, lineSpacing: 18,
  })

  const langs = [
    { code: 'EN', lang: 'English', example: '"Send money home"' },
    { code: 'ES', lang: 'Mexican Spanish', example: '"Envia dinero a casa"' },
    { code: 'PT', lang: 'Brazilian Portuguese', example: '"Envie dinheiro para casa"' },
  ]

  langs.forEach((l, i) => {
    const x = 5.3
    const y = 1.7 + i * 1.1

    s.addShape(pptx.ShapeType.roundRect, { x, y, w: 4.2, h: 0.85, fill: { color: C.white }, rectRadius: 0.1, line: { color: C.concrete, width: 0.5 } })
    // Code badge
    s.addShape(pptx.ShapeType.roundRect, { x: x + 0.2, y: y + 0.18, w: 0.5, h: 0.5, fill: { color: C.turquoise50 }, rectRadius: 0.25, line: { color: C.turquoise, width: 0.5 } })
    s.addText(l.code, { x: x + 0.2, y: y + 0.22, w: 0.5, h: 0.45, fontSize: 9, fontFace: FONT_DISPLAY, color: C.turquoise700, align: 'center', bold: true })
    s.addText(l.lang, { x: x + 0.85, y: y + 0.15, w: 3, h: 0.3, fontSize: 12, fontFace: FONT_DISPLAY, color: C.slate, bold: true })
    s.addText(l.example, { x: x + 0.85, y: y + 0.45, w: 3, h: 0.25, fontSize: 10, fontFace: FONT_BODY, color: C.mocha, italic: true })
  })

  // Rule callout
  s.addShape(pptx.ShapeType.roundRect, { x: 5.3, y: 5.0, w: 4.2, h: 0.6, fill: { color: 'FEF3E0' }, rectRadius: 0.08, line: { color: 'F5D89A', width: 0.5 } })
  s.addText('Key rule: Always use tu (informal) in Spanish — Felix is friendly, not corporate.', {
    x: 5.45, y: 5.05, w: 3.9, h: 0.5, fontSize: 9, fontFace: FONT_BODY, color: C.mocha,
  })

  footer(s, 9)
}

function slideClosing(pptx: PptxGenJS) {
  const s = pptx.addSlide()
  s.background = { color: C.slate950 }

  s.addText('Build With Felix', {
    x: 0.5, y: 1.5, w: 9, h: 1.0,
    fontSize: 48, fontFace: FONT_DISPLAY, color: C.white, align: 'center', bold: true,
  })
  s.addText('The design system is a living product. Explore the docs,\nuse the tokens, ship with confidence.', {
    x: 1.5, y: 2.6, w: 7, h: 0.7,
    fontSize: 14, fontFace: FONT_BODY, color: '8A9E9D', align: 'center', lineSpacing: 20,
  })

  // Stats
  const stats = [
    { stat: '42+', label: 'Colors' },
    { stat: '89+', label: 'Illustrations' },
    { stat: '3', label: 'Languages' },
  ]
  stats.forEach((st, i) => {
    const x = 2.2 + i * 2.0
    s.addShape(pptx.ShapeType.roundRect, { x, y: 3.6, w: 1.8, h: 1.1, fill: { color: '0A2E2C' }, rectRadius: 0.1, line: { color: '1A4A48', width: 0.5 } })
    s.addText(st.stat, { x, y: 3.7, w: 1.8, h: 0.5, fontSize: 28, fontFace: FONT_DISPLAY, color: C.turquoise, align: 'center', bold: true })
    s.addText(st.label, { x, y: 4.25, w: 1.8, h: 0.3, fontSize: 9, fontFace: FONT_BODY, color: '5A7574', align: 'center' })
  })

  footer(s, 10, true)
}

/* ═══════════════════════════════════════════════════════════════════ */
/*                       ROUTE HANDLER                                 */
/* ═══════════════════════════════════════════════════════════════════ */

export async function GET() {
  const pptx = new PptxGenJS()

  pptx.layout = 'LAYOUT_WIDE'
  pptx.author = 'Felix Design System'
  pptx.title = 'Felix Design System — The Complete Guide'
  pptx.subject = 'Design System Overview'

  // Define custom slide master for default styling
  pptx.defineSlideMaster({
    title: 'FELIX_MASTER',
    background: { color: C.stone },
  })

  slideTitle(pptx)
  slidePrinciples(pptx)
  slideColors(pptx)
  slideTypography(pptx)
  slideVoice(pptx)
  slideComponents(pptx)
  slideIllustrations(pptx)
  slideTokens(pptx)
  slideMultilingual(pptx)
  slideClosing(pptx)

  const buffer = await pptx.write({ outputType: 'arraybuffer' }) as ArrayBuffer

  return new Response(buffer, {
    headers: {
      'Content-Type': 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      'Content-Disposition': 'attachment; filename="Felix-Design-System.pptx"',
    },
  })
}
