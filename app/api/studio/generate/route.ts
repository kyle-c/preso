import { NextRequest } from 'next/server'
import { strengthenPrompt } from '@/lib/prompt-strengthener'
import { getBlueprintEnrichment } from '@/lib/training-blueprints'

export const runtime = 'nodejs'
export const maxDuration = 120

// ---------------------------------------------------------------------------
// System prompt
// ---------------------------------------------------------------------------

const SYSTEM_PROMPT = `You are a world-class presentation designer for Félix Pago, a fintech company that empowers Latinos in the US to care for what matters most back home. You create structured slide presentations AND companion business documents following the Félix design system.

## About Félix Pago
- Mission: Empower Latinos in the US to care for what matters most back home
- Products: Remittances to Latin America, mobile top-ups & bill pay, credit building products, digital wallets & accounts
- Culture: User-obsessed, bias towards action, extreme ownership, no-ego collaboration, insanely great quality, insatiable curiosity
- Users: Latinos in the US sending money, paying bills, and building credit — caring for families across borders

## Brand Identity
### Typography
- Display / headings: Plain (font-weight 800-900) — bold, confident, large
- Body / UI text: Saans (font-weight 300-600)

### Color Palette
Primary: Turquoise #2BF2F1 (signature brand color), Slate #082422 (dark backgrounds)
Secondary: Blueberry #6060BF, Cactus #60D06F, Mango #F19D38, Papaya #F26629, Lime #DCFF00, Lychee #FFCD9C, Sage #7BA882
Neutral: Stone #EFEBE7 (light backgrounds), Linen #FEFCF9, Concrete #CFCABF, Mocha #877867, Evergreen #35605F

### Color Accessibility Rules (WCAG 2.1 AA)
- NEVER use Turquoise #2BF2F1, Lime #DCFF00, or Cactus #60D06F for text on light (Stone/Linen/white) backgrounds — they fail contrast
- NEVER use Blueberry #6060BF, Mocha #877867, or Evergreen #35605F for text on dark (Slate) backgrounds — they fail contrast
- On dark slides: use Stone #EFEBE7, Linen, Lychee #FFCD9C, or white for body text
- On light slides: use Slate #082422 or Evergreen #35605F for body text
- Card titleColor: use Blueberry, Papaya, Evergreen, Sage on light bg; use Turquoise, Cactus, Mango, Lychee on dark bg

### Available Illustrations
Use these illustrations throughout presentations (≥30% of slides). Use the imageUrl field with these exact paths:

**Financial & Money:**
- /illustrations/Dollar%20bills%20%2B%20Coins%20A.svg — dollar bills and coins
- /illustrations/Flying%20Dollar%20Bills%20-%20Turquoise.svg — flying money (growth, revenue)
- /illustrations/Cloud%20Coin%20-%20Turquoise.svg — cloud with coin (digital finance)
- /illustrations/Paper%20Airplane%20%2B%20Coin%20-%20Turquoise.svg — paper airplane with coin (sending money)

**Growth & Achievement:**
- /illustrations/Rocket%20Launch%20-%20Growth%20%2B%20Coin%20-%20Turquoise.svg — rocket launch (growth, scaling)
- /illustrations/3%20Paper%20Airplanes%20%2B%20Coins.svg — three paper airplanes (multiple products)
- /illustrations/ray.svg — starburst ray (excellence, quality)

**People & Connection:**
- /illustrations/Hands%20-%202%20Cell%20Phones%20-%20Juntos%20we%20Succeed.svg — two hands with phones (collaboration)
- /illustrations/Hand%20-%20Stars.svg — hand with stars (welcome, celebration)
- /illustrations/Hand%20-%20Cell%20Phone%20OK.svg — hand with phone OK (mobile UX, approval)

**Communication:**
- /illustrations/Speech%20Bubbles%20%2B%20Hearts.svg — speech bubbles with hearts (user love, feedback)

**Celebration & Emotion:**
- /illustrations/Party%20Popper.svg — party popper (welcome, celebration, milestones)
- /illustrations/Heart%20-F%C3%A9lix.svg — Félix heart (brand love, values)

**Objects & Concepts:**
- /illustrations/Fast.svg — speed/lightning (urgency, fast, action)
- /illustrations/Magnifying%20Glass.svg — magnifying glass (research, discovery)
- /illustrations/Lock.svg — lock (security, trust)
- /illustrations/Survey.svg — survey/clipboard (research, planning)

**Brand Mascot:**
- /illustrations/F%C3%A9lix%20Illo%201.svg — Félix mascot (company intro, brand slides)

### Design Principles
- Clean, confident, contemporary fintech aesthetic
- Generous whitespace — never crowd a slide
- One idea per slide. If in doubt, split into two slides
- Alternate dark (#082422) and light (#EFEBE7) backgrounds — NEVER two consecutive same bg
- Use "brand" (#2BF2F1) sparingly: title + closing + at most one accent slide
- Use badge pills to categorize slide sections
- Vary slide types — don't use the same type more than twice in a row
- Use secondary palette colors for card titleColor fields — vary them

## Presentation Templates

### Employee Onboarding (10-12 slides)
1. **Welcome** (title, brand) — Personalized greeting with name, role, start date. imageUrl: Party Popper. badge: "Welcome to Félix"
2. **Who We Are** (two-column, light) — Company description + mission + products. imageUrl: Félix Illo 1
3. **Our Values** (cards, dark) — 4-6 value cards with varied titleColor
4. **Your Role** (two-column, dark) — Role description + responsibilities
5. **Meet Your Team** (cards, light) — Team member cards
6. **First 90 Days** (cards, dark) — 3 phase cards: Immerse, Build, Scale
7. **Tools & Access** (cards, light) — Tool grid
8. **Our Users** (two-column, brand) — Personas
9. **Week One** (bullets, light) — Day-by-day schedule
10. **Closing** (closing, dark) — Inspirational message + resources

### Company Overview / Investor Deck (10-14 slides)
Title (brand) → Problem (dark) → Solution (light) → Product (dark, cards) → Market (light, two-column) → Traction (dark, chart) → Team (light, cards) → Vision (dark, quote) → Closing (brand)

### Product Launch (10-14 slides)
Title (brand) → Context (dark) → What's New (light, two-column) → How It Works (dark, cards) → Benefits (light, cards) → Timeline (dark, bullets) → Impact (light, chart) → Next Steps (dark) → Closing (brand)

### Quarterly Review (10-16 slides)
Title (brand) → Exec Summary (dark, cards) → Wins (light, bullets) → Metrics (dark, chart) → Deep Dive (light, two-column) → Challenges (dark, two-column) → Learnings (light, quote) → Next Quarter (dark, cards) → Closing (brand)

### Research / Insights (10-16 slides)
Title (brand) → Goals (dark) → Methodology (light) → Key Findings (dark, cards) → Detail 1 (light, two-column) → Detail 2 (dark, two-column) → User Quote (brand, quote) → Recommendations (light, bullets) → Closing (dark)

### Strategy / Roadmap (10-16 slides)
Title (brand) → Context (dark) → Vision (light, quote) → Pillars (dark, cards) → Pillar Detail 1 (light, two-column) → Pillar Detail 2 (dark, two-column) → Roadmap (light, cards) → Metrics (dark, chart) → Risks (light, cards) → Closing (brand)

## Slide Types & Schema
- **title**: Full-screen opener. bg "brand". Bold title + subtitle.
- **section**: Section divider. bg "dark". Large display text.
- **content**: Heading + body text. For explanatory paragraphs.
- **bullets**: Heading + bullet list (4-6 items min). Each bullet: { text, icon? (emoji) }.
- **two-column**: Two-column layout. columns: [{ heading, body?, bullets? }, ...]. BOTH columns MUST be populated.
- **cards**: Grid of cards. cards: [{ title, titleColor (hex), body (≥30 words) }]. Use 3-6 cards.
- **quote**: Large quote. quote: { text, attribution? }.
- **chart**: Data visualization. chart: { chartType, data, xKey, yKeys, colors? }. chartType: "bar"|"line"|"donut"|"horizontal-bar"|"stacked-bar"|"area"|"scatter"|"combo"|"funnel"|"radar".
- **checklist**: Do's and don'ts. bullets with icon "✓" or "✗".
- **closing**: Final slide. bg "brand" or "dark".

imageUrl can be added to ANY slide type. Notes field REQUIRED on every slide.

## Content Density Rules (CRITICAL)
- **cards**: Each body MUST be ≥30 words (2-3 sentences). NEVER 1 vague sentence.
- **bullets**: ≥4 items. Each a complete thought ≥10 words. NEVER "Market growth" — instead "TAM: $161B — Total LatAm remittances per year, growing 4% annually"
- **two-column**: BOTH columns MUST have ≥3 bullets or ≥40 words body. NEVER leave a column thin.
- **2×2 grids (4 cards)**: All cards MUST have equal density (±10 words).
- **chart**: MUST have insight-driven title (the takeaway, not chart type), body explaining "so what", and 2-3 supporting bullet metrics.

## Chart Visualization Guidelines
- Title IS the insight ("Organic channels drive 73% of revenue" not "Revenue by Channel")
- One message per chart
- Use color with intent: highlight in brand color, muted for context
- Format numbers for executives ("$3.4M" not "$3,360,000")
- ChartSpec: { chartType, data: [{...}], xKey, yKeys: string[], colors?: string[], yLabel?, xLabel? }

## Critical Rules
1. ALWAYS return 10-16 slides (aim for 12-14)
2. ALWAYS start with "title" (bg "brand") + end with "closing"
3. ALWAYS alternate bg colors — never two consecutive same bg
4. ALWAYS use badge fields
5. ALWAYS include imageUrl on ≥5 slides
6. ALWAYS vary slide types (≥5 different types per presentation)
7. ALWAYS use varied titleColor on cards
8. ALWAYS include "notes" field on every slide (3-5 sentences)
9. NEVER <10 slides
10. NEVER same slide type >3 times in a row
11. When onboarding topic → ALWAYS follow Employee Onboarding template

## Output Format
Return ONLY valid JSON — no markdown fences, no commentary. Structure:
{
  "slides": [
    {
      "type": "...", "bg": "dark"|"light"|"brand",
      "badge": "optional section label",
      "title": "...", "subtitle": "optional",
      "body": "optional (supports **bold** and [links](url))",
      "bullets": [{ "text": "...", "icon": "optional emoji" }],
      "cards": [{ "title": "...", "titleColor": "#hex", "body": "..." }],
      "columns": [{ "heading": "...", "body": "...", "bullets": [...] }],
      "quote": { "text": "...", "attribution": "optional" },
      "chart": { "chartType": "...", "data": [...], "xKey": "...", "yKeys": [...], "colors": [...] },
      "imageUrl": "optional illustration path",
      "notes": "REQUIRED: 3-5 sentence speaker notes"
    }
  ],
  "document": {
    "title": "document title",
    "type": "prd"|"proposal"|"launch"|"review"|"research"|"onboarding"|"strategy"|"general",
    "summary": "2-3 sentence summary of the full document",
    "sections": [
      {
        "title": "Section Heading",
        "content": "Detailed markdown content — 3-5 paragraphs per section with specific details. This is the stakeholder-ready written document, not slide notes.",
        "slideIndex": 0
      }
    ]
  }
}

The "document" object is a FULL written companion document. Each section maps to a slide via slideIndex and should contain 3-5 paragraphs of detailed, stakeholder-ready prose. The document is independent from the slides — it reads as a complete written document.

CRITICAL: You MUST output BOTH "slides" and "document" in EVERY response. The response must be a single JSON object with two top-level keys: "slides" (array) and "document" (object). Do NOT output just a bare array. Do NOT skip the document. The document is REQUIRED.
`

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface FileAttachment {
  type: 'image' | 'pdf' | 'data'
  data: string
  name: string
}

interface GenerateBody {
  prompt: string
  files?: FileAttachment[]
  provider: 'anthropic' | 'openrouter'
  apiKey: string
  model: string
  edit?: boolean
  /** When true, generate a document from existing slides (reverse-engineer) */
  reverseEngineer?: boolean
  /** Existing slides to reverse-engineer a document from */
  slides?: any[]
}

// ---------------------------------------------------------------------------
// Helpers: build request payloads
// ---------------------------------------------------------------------------

function enrichSystemPrompt(body: GenerateBody): string {
  let enriched = SYSTEM_PROMPT

  // Inject blueprint enrichment
  const blueprintSection = getBlueprintEnrichment(body.prompt)
  if (blueprintSection) {
    enriched += '\n\n' + blueprintSection
  }

  return enriched
}

function buildAnthropicPayload(body: GenerateBody) {
  const { strengthenedPrompt } = body.edit ? { strengthenedPrompt: body.prompt } : strengthenPrompt(body.prompt)
  const systemPrompt = enrichSystemPrompt(body)

  const content: any[] = [{ type: 'text', text: strengthenedPrompt }]

  for (const file of body.files ?? []) {
    if (file.type === 'image') {
      const mediaType = guessImageMediaType(file.name)
      const base64 = file.data.includes(',') ? file.data.split(',')[1] : file.data
      content.push({
        type: 'image',
        source: { type: 'base64', media_type: mediaType, data: base64 },
      })
    } else if (file.type === 'pdf') {
      const base64 = file.data.includes(',') ? file.data.split(',')[1] : file.data
      content.push({
        type: 'document',
        source: { type: 'base64', media_type: 'application/pdf', data: base64 },
      })
    } else if (file.type === 'data') {
      content.push({
        type: 'text',
        text: `\n\n--- Data file: ${file.name} ---\n${file.data}\n--- End of ${file.name} ---\n\nAnalyze this data and create appropriate data visualization slides with ChartSpec. Choose the best chart type based on the data structure.`,
      })
    }
  }

  return {
    model: body.model,
    max_tokens: 32768,
    stream: true,
    system: systemPrompt,
    messages: [{ role: 'user', content }],
  }
}

function buildOpenRouterPayload(body: GenerateBody) {
  const { strengthenedPrompt } = body.edit ? { strengthenedPrompt: body.prompt } : strengthenPrompt(body.prompt)
  const systemPrompt = enrichSystemPrompt(body)

  const content: any[] = [{ type: 'text', text: strengthenedPrompt }]

  for (const file of body.files ?? []) {
    if (file.type === 'image') {
      const mediaType = guessImageMediaType(file.name)
      const dataUrl = file.data.startsWith('data:') ? file.data : `data:${mediaType};base64,${file.data}`
      content.push({
        type: 'image_url',
        image_url: { url: dataUrl },
      })
    } else if (file.type === 'pdf') {
      content.push({
        type: 'text',
        text: `[PDF attached: ${file.name}]`,
      })
    } else if (file.type === 'data') {
      content.push({
        type: 'text',
        text: `\n\n--- Data file: ${file.name} ---\n${file.data}\n--- End of ${file.name} ---\n\nAnalyze this data and create appropriate data visualization slides.`,
      })
    }
  }

  return {
    model: body.model,
    max_tokens: 32768,
    stream: true,
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content },
    ],
  }
}

function guessImageMediaType(filename: string): string {
  const ext = filename.split('.').pop()?.toLowerCase()
  switch (ext) {
    case 'png': return 'image/png'
    case 'gif': return 'image/gif'
    case 'webp': return 'image/webp'
    case 'svg': return 'image/svg+xml'
    default: return 'image/jpeg'
  }
}

// ---------------------------------------------------------------------------
// SSE parsing helpers
// ---------------------------------------------------------------------------

function createSSEStream(
  upstreamResponse: Response,
  provider: 'anthropic' | 'openrouter',
  extractDocument?: boolean,
): ReadableStream<Uint8Array> {
  const encoder = new TextEncoder()
  const decoder = new TextDecoder()

  return new ReadableStream({
    async start(controller) {
      const reader = upstreamResponse.body?.getReader()
      if (!reader) {
        controller.enqueue(encoder.encode('data: [DONE]\n\n'))
        controller.close()
        return
      }

      let buffer = ''
      let accumulated = '' // Accumulate all text for document extraction

      try {
        while (true) {
          const { done, value } = await reader.read()
          if (done) break

          buffer += decoder.decode(value, { stream: true })
          const lines = buffer.split('\n')
          buffer = lines.pop() ?? ''

          for (const line of lines) {
            if (!line.startsWith('data: ')) continue
            const data = line.slice(6).trim()

            if (data === '[DONE]') {
              // Before closing, try to extract document from accumulated text
              if (extractDocument && accumulated) {
                try {
                  const docMatch = accumulated.match(/"document"\s*:\s*\{/)
                  if (docMatch && docMatch.index !== undefined) {
                    const start = accumulated.indexOf('{', docMatch.index)
                    let depth = 0; let inStr = false; let esc = false
                    for (let i = start; i < accumulated.length; i++) {
                      const ch = accumulated[i]
                      if (esc) { esc = false; continue }
                      if (ch === '\\') { esc = true; continue }
                      if (ch === '"') { inStr = !inStr; continue }
                      if (inStr) continue
                      if (ch === '{') depth++
                      else if (ch === '}') { depth--; if (depth === 0) {
                        const doc = JSON.parse(accumulated.slice(start, i + 1))
                        if (doc.title && doc.sections) {
                          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ document: doc })}\n\n`))
                        }
                        break
                      }}
                    }
                  }
                } catch (_e) { /* document extraction failed */ }
              }
              controller.enqueue(encoder.encode('data: [DONE]\n\n'))
              controller.close()
              return
            }

            try {
              const parsed = JSON.parse(data)
              let text: string | undefined

              if (provider === 'anthropic') {
                if (parsed.type === 'content_block_delta' && parsed.delta?.text) {
                  text = parsed.delta.text
                }
                if (parsed.type === 'message_stop') {
                  // Extract document before closing
                  if (extractDocument && accumulated) {
                    try {
                      const docMatch = accumulated.match(/"document"\s*:\s*\{/)
                      if (docMatch && docMatch.index !== undefined) {
                        const start = accumulated.indexOf('{', docMatch.index)
                        let depth = 0; let inStr = false; let esc = false
                        for (let i = start; i < accumulated.length; i++) {
                          const ch = accumulated[i]
                          if (esc) { esc = false; continue }
                          if (ch === '\\') { esc = true; continue }
                          if (ch === '"') { inStr = !inStr; continue }
                          if (inStr) continue
                          if (ch === '{') depth++
                          else if (ch === '}') { depth--; if (depth === 0) {
                            const doc = JSON.parse(accumulated.slice(start, i + 1))
                            if (doc.title && doc.sections) {
                              controller.enqueue(encoder.encode(`data: ${JSON.stringify({ document: doc })}\n\n`))
                            }
                            break
                          }}
                        }
                      }
                    } catch (_e) { /* extraction failed */ }
                  }
                  controller.enqueue(encoder.encode('data: [DONE]\n\n'))
                  controller.close()
                  return
                }
              } else {
                const delta = parsed.choices?.[0]?.delta?.content
                if (delta) text = delta
                if (parsed.choices?.[0]?.finish_reason) {
                  // Extract document before closing
                  if (extractDocument && accumulated) {
                    try {
                      const clean = accumulated.replace(/```(?:json)?\s*/gi, '').replace(/```/g, '')
                      const docMatch = clean.match(/"document"\s*:\s*\{/)
                      if (docMatch && docMatch.index !== undefined) {
                        const start = clean.indexOf('{', docMatch.index)
                        let depth = 0; let inStr = false; let esc = false
                        for (let i = start; i < clean.length; i++) {
                          const ch = clean[i]
                          if (esc) { esc = false; continue }
                          if (ch === '\\') { esc = true; continue }
                          if (ch === '"') { inStr = !inStr; continue }
                          if (inStr) continue
                          if (ch === '{') depth++
                          else if (ch === '}') { depth--; if (depth === 0) {
                            const doc = JSON.parse(clean.slice(start, i + 1))
                            if (doc.title && doc.sections) {
                              controller.enqueue(encoder.encode(`data: ${JSON.stringify({ document: doc })}\n\n`))
                            }
                            break
                          }}
                        }
                      }
                    } catch (_e) { /* extraction failed */ }
                  }
                  controller.enqueue(encoder.encode('data: [DONE]\n\n'))
                  controller.close()
                  return
                }
              }

              if (text) {
                accumulated += text
                const chunk = JSON.stringify({ text })
                controller.enqueue(encoder.encode(`data: ${chunk}\n\n`))
              }
            } catch (_e) {
              // Ignore non-JSON lines
            }
          }
        }

        controller.enqueue(encoder.encode('data: [DONE]\n\n'))
        controller.close()
      } catch (err) {
        console.error('[studio/generate stream]', err)
        controller.enqueue(
          encoder.encode(`data: ${JSON.stringify({ error: 'Stream error' })}\n\n`),
        )
        controller.enqueue(encoder.encode('data: [DONE]\n\n'))
        controller.close()
      }
    },
  })
}

// ---------------------------------------------------------------------------
// POST handler
// ---------------------------------------------------------------------------

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as GenerateBody

    if (!body.prompt) {
      return new Response(JSON.stringify({ error: 'Prompt is required' }), {
        status: 400, headers: { 'Content-Type': 'application/json' },
      })
    }

    if (!body.apiKey) {
      return new Response(JSON.stringify({ error: 'API key is required' }), {
        status: 400, headers: { 'Content-Type': 'application/json' },
      })
    }

    if (!body.provider || !body.model) {
      return new Response(JSON.stringify({ error: 'Provider and model are required' }), {
        status: 400, headers: { 'Content-Type': 'application/json' },
      })
    }

    // Handle reverse-engineer document generation
    if (body.reverseEngineer && body.slides?.length) {
      const docPrompt = `Here are the slides from an existing presentation. Generate ONLY a "document" object (no slides) — a full written companion document that expands on these slides into stakeholder-ready prose.

${JSON.stringify(body.slides, null, 2)}

Return a JSON object with this exact structure:
{
  "document": {
    "title": "document title matching the presentation",
    "type": "general",
    "summary": "2-3 sentence summary",
    "sections": [
      { "title": "Section Name", "content": "3-5 paragraphs of detailed markdown content expanding on the slide", "slideIndex": 0 }
    ]
  }
}

Create one section per slide (or group related slides). Each section MUST have 3-5 paragraphs of detailed, stakeholder-ready prose — not just a repeat of the slide text. Expand with context, rationale, evidence, and implications.`

      const docBody = { ...body, prompt: docPrompt, edit: true }

      let upstreamResponse: Response
      if (body.provider === 'anthropic') {
        upstreamResponse = await fetch('https://api.anthropic.com/v1/messages', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': body.apiKey,
            'anthropic-version': '2025-04-14',
          },
          body: JSON.stringify(buildAnthropicPayload(docBody)),
        })
      } else {
        upstreamResponse = await fetch('https://openrouter.ai/api/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${body.apiKey}`,
            'HTTP-Referer': 'https://felix.pago',
          },
          body: JSON.stringify(buildOpenRouterPayload(docBody)),
        })
      }

      if (!upstreamResponse.ok) {
        const errorText = await upstreamResponse.text()
        return new Response(
          JSON.stringify({ error: `Provider error (${upstreamResponse.status}): ${errorText}` }),
          { status: upstreamResponse.status, headers: { 'Content-Type': 'application/json' } },
        )
      }

      const stream = createSSEStream(upstreamResponse, body.provider, true)
      return new Response(stream, {
        headers: { 'Content-Type': 'text/event-stream', 'Cache-Control': 'no-cache', Connection: 'keep-alive' },
      })
    }

    let upstreamResponse: Response

    if (body.provider === 'anthropic') {
      upstreamResponse = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': body.apiKey,
          'anthropic-version': '2025-04-14',
        },
        body: JSON.stringify(buildAnthropicPayload(body)),
      })
    } else if (body.provider === 'openrouter') {
      upstreamResponse = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${body.apiKey}`,
          'HTTP-Referer': 'https://felix.pago',
        },
        body: JSON.stringify(buildOpenRouterPayload(body)),
      })
    } else {
      return new Response(JSON.stringify({ error: 'Unsupported provider' }), {
        status: 400, headers: { 'Content-Type': 'application/json' },
      })
    }

    if (!upstreamResponse.ok) {
      const errorText = await upstreamResponse.text()
      console.error('[studio/generate] upstream error:', upstreamResponse.status, errorText)
      let detail = ''
      try {
        const parsed = JSON.parse(errorText)
        detail = parsed.error?.message || parsed.error || errorText
      } catch (_e) {
        detail = errorText
      }
      return new Response(
        JSON.stringify({ error: `Provider error (${upstreamResponse.status}): ${detail}` }),
        { status: upstreamResponse.status, headers: { 'Content-Type': 'application/json' } },
      )
    }

    const stream = createSSEStream(upstreamResponse, body.provider, true)

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
      },
    })
  } catch (err) {
    console.error('[studio/generate POST]', err)
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500, headers: { 'Content-Type': 'application/json' },
    })
  }
}
