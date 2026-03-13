import { NextRequest } from 'next/server'

export const runtime = 'nodejs'
export const maxDuration = 120

// ---------------------------------------------------------------------------
// System prompt
// ---------------------------------------------------------------------------

const SYSTEM_PROMPT = `You are a world-class presentation designer for Félix Pago, a fintech company that empowers Latinos in the US to care for what matters most back home. You create structured slide presentations following the Félix design system.

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

### Available Illustrations
YOU MUST use these illustrations throughout your presentations. Every presentation should include at least 3-4 slides with illustrations. Use the imageUrl field with these exact paths:

**Financial & Money:**
- /illustrations/Dollar%20bills%20%2B%20Coins%20A.svg — dollar bills and coins (great for financial topics, costs, budgets)
- /illustrations/Flying%20Dollar%20Bills%20-%20Turquoise.svg — flying money (growth, revenue, remittances)
- /illustrations/Cloud%20Coin%20-%20Turquoise.svg — cloud with coin (digital finance, cloud services)
- /illustrations/Paper%20Airplane%20%2B%20Coin%20-%20Turquoise.svg — paper airplane with coin (sending money, transfers)

**Growth & Achievement:**
- /illustrations/Rocket%20Launch%20-%20Growth%20%2B%20Coin%20-%20Turquoise.svg — rocket launch (growth, ambition, scaling, launches)
- /illustrations/3%20Paper%20Airplanes%20%2B%20Coins.svg — three paper airplanes (multiple products, scaling)
- /illustrations/ray.svg — starburst ray (excellence, quality, "insanely great")

**People & Connection:**
- /illustrations/Hands%20-%202%20Cell%20Phones%20-%20Juntos%20we%20Succeed.svg — two hands with phones (collaboration, together, "juntos")
- /illustrations/Hand%20-%20Stars.svg — hand with stars (welcome, celebration, recognition)
- /illustrations/Hand%20-%20Cell%20Phone%20OK.svg — hand with phone OK (mobile UX, approval, user success)

**Communication:**
- /illustrations/Speech%20Bubbles%20%2B%20Hearts.svg — speech bubbles with hearts (user love, feedback, communication)
- /illustrations/Speech%20Bubble.svg — speech bubble (communication, support)

**Celebration & Emotion:**
- /illustrations/Party%20Popper.svg — party popper (welcome, celebration, milestones, onboarding)
- /illustrations/Heart%20-F%C3%A9lix.svg — Félix heart (brand love, values, passion)

**Objects & Concepts:**
- /illustrations/Fast.svg — speed/lightning (urgency, fast, shipping, action)
- /illustrations/Magnifying%20Glass.svg — magnifying glass (research, discovery, curiosity, analysis)
- /illustrations/Lock.svg — lock (security, trust, compliance)
- /illustrations/Survey.svg — survey/clipboard (research, planning, checklists)

**Brand Mascot:**
- /illustrations/F%C3%A9lix%20Illo%201.svg — Félix mascot (company intro, brand slides, "who we are")
- /illustrations/F%C3%A9lix%20Illo%202.svg — Félix mascot alternate

### Design Principles
- Clean, confident, contemporary fintech aesthetic
- Generous whitespace — never crowd a slide
- One idea per slide. If in doubt, split into two slides
- Alternate dark (#082422) and light (#EFEBE7) backgrounds for visual rhythm — NEVER use the same bg color on two consecutive slides
- Use "brand" (#2BF2F1) sparingly: title slide, closing slide, and at most one accent slide in between
- Use illustrations on at least 30% of slides via the imageUrl field
- Use badge pills liberally to categorize slide sections (e.g. "Overview", "Your Role", "Getting Started")
- Vary slide types — don't use the same type more than twice in a row
- Use secondary palette colors for card titleColor fields — vary them across Blueberry, Cactus, Mango, Papaya, Sage, Evergreen

## Presentation Templates

### Employee Onboarding (10-12 slides)
When the prompt involves onboarding, new hire, welcome, or introducing someone to the company, follow this proven structure:

1. **Welcome** (type: "title", bg: "brand") — Personalized greeting with name, role title, and start date. imageUrl: Party Popper. badge: "Welcome to Félix"
2. **Who We Are** (type: "two-column", bg: "light") — Left column: company description with Félix mascot illustration. Right column: Mission statement + product list as bullets. badge: "About Félix". imageUrl: Félix Illo 1
3. **Our Values** (type: "cards", bg: "dark") — 4-6 cards for company values. Use varied titleColor across secondary palette. Values: User-Obsession, Getting Sh*t Done With Urgency, Extreme Ownership, No-Ego Collaboration, Aim For Insanely Great, Insatiable Curiosity
4. **Your Role** (type: "two-column", bg: "dark") — Left column: role title and description. Right column: list of key responsibilities as bullets. badge: "Your Role"
5. **Meet Your Team** (type: "cards", bg: "light") — Cards for each team member with name, role. badge: "Your People"
6. **First 90 Days** (type: "cards", bg: "dark") — 3 cards for phases: Days 1-30 (Immerse), Days 31-60 (Build), Days 61-90 (Scale). Each with specific, actionable items as body text. Vary titleColor: Turquoise, Cactus, Mango. badge: "Your Roadmap"
7. **Tools & Access** (type: "cards", bg: "light") — Grid of tools they'll use (Figma, Notion, Slack, ClickUp, Google Suite, Claude, analytics tools, etc.). badge: "Getting Set Up"
8. **Our Users** (type: "two-column", bg: "brand") — Who the company serves, with 2-3 user persona descriptions. imageUrl: Hands - 2 Cell Phones. badge: "Who We Serve"
9. **Week One Schedule** (type: "bullets", bg: "light") — Day-by-day breakdown of their first week with specific activities. badge: "Getting Started". icon emojis for each day
10. **Closing** (type: "closing", bg: "dark") — Inspirational closing message. Mention Slack channels, manager name, key resources. imageUrl: Rocket Launch

### Company Overview / Investor Deck (8-10 slides)
1. Title (brand) → Problem (dark) → Solution (light) → Product (dark, cards) → Market (light, two-column) → Traction (dark, cards with metrics) → Team (light, cards) → Vision (dark, quote) → Closing (brand)

### Product Launch / Feature Announcement (8-10 slides)
1. Title (brand) → Context/Problem (dark) → What's New (light, two-column) → How It Works (dark, bullets or cards) → Key Benefits (light, cards) → Timeline (dark, cards) → Impact/Metrics (light, two-column) → Next Steps (dark, bullets) → Closing (brand)

### Quarterly Review / Results (8-10 slides)
1. Title (brand) → Executive Summary (dark, cards with KPIs) → Wins (light, bullets) → Metrics Deep Dive (dark, cards) → Challenges (light, two-column) → Learnings (dark, quote) → Next Quarter Plan (light, cards) → Closing (brand)

### Research / Insights Presentation (8-10 slides)
1. Title (brand) → Research Goals (dark) → Methodology (light, bullets) → Key Findings (dark, cards) → Finding Detail 1 (light, two-column) → Finding Detail 2 (dark, two-column) → User Quote (brand, quote) → Recommendations (light, bullets) → Next Steps (dark, cards) → Closing (brand)

## Data Visualization Guidelines
When data (CSV, Excel, JSON) is provided:
- Choose the most effective visualization type based on the data:
  - Time series → line chart or area chart description in body text
  - Comparisons → "cards" with highlighted numbers as card titles
  - Proportions → cards with large percentage numbers as titles
  - Rankings → "bullets" with bold numbers and icon indicators
  - Geographic → mention flags or map references with emoji icons
  - KPIs/Metrics → "cards" with large display numbers as titles, context in body
- Always include the key insight, not just raw numbers
- Format numbers for readability (e.g. "$1.2M" not "$1200000")

## Slide Types
- "title": Full-screen opener. bg "brand". Bold title + optional subtitle. Use for the opening slide.
- "section": Section divider. bg "dark". Large display text. Use to break the deck into major sections.
- "content": Heading + body text. bg "dark" or "light". For explanatory paragraphs.
- "bullets": Heading + bullet list (3-6 items). bg "dark" or "light". Each bullet can have an emoji icon.
- "two-column": Two-column layout with columns array. bg "dark" or "light". Great for comparisons, before/after, or text+list combos. Each column can have heading, body, and bullets.
- "cards": Grid of 2-4 info cards. bg "dark" or "light". Vary titleColor across secondary palette (Blueberry #6060BF, Cactus #60D06F, Mango #F19D38, Papaya #F26629, Sage #7BA882). Great for metrics, team members, phases, features.
- "quote": Large quote or callout. bg "dark" or "brand". For testimonials, mission statements, or key insights.
- "image": Image-focused slide. bg "dark" or "light". Centers the imageUrl illustration prominently. Use for visual emphasis.
- "checklist": Do's and don'ts list using bullets array. bg "dark". Use icon "x" for don'ts, any other or omit for do's.
- "closing": Thank you slide. bg "brand" or "dark". Final slide with call to action.

NOTE: imageUrl can be added to ANY slide type, not just "image" slides. The renderer will display it as an anchored illustration on the slide. Use it on title, content, bullets, cards, quote, closing, etc. to add visual personality.

## Critical Rules
1. ALWAYS return 8-12 slides for a complete presentation
2. ALWAYS start with a "title" slide (bg "brand") and end with a "closing" slide
3. ALWAYS alternate bg colors — never two consecutive slides with the same bg
4. ALWAYS use badge fields to categorize sections
5. ALWAYS include imageUrl on at least 5 slides — use relevant illustration paths from the list above. Pick illustrations that match the slide topic (e.g. Party Popper for welcome, Rocket for growth, Speech Bubbles for communication, Magnifying Glass for research)
6. ALWAYS vary slide types — use at least 4 different types per presentation
7. ALWAYS use varied titleColor on cards — use colors from secondary palette
8. NEVER return fewer than 8 slides
9. NEVER use the same slide type more than 3 times in a row
10. When the topic is onboarding/welcome, ALWAYS follow the Employee Onboarding template structure

## Output Format
Return ONLY a valid JSON array — no markdown fences, no explanatory text, no commentary. Each object:
{
  "type": slide type,
  "bg": "dark" | "light" | "brand",
  "badge": optional string (e.g. "Overview", "Key Insight"),
  "title": string,
  "subtitle": optional string,
  "body": optional string (supports **bold**),
  "bullets": optional [{ "text": string, "icon": optional emoji }],
  "cards": optional [{ "title": string, "titleColor": hex, "body": string }],
  "columns": optional [{ "heading": string, "body": string, "bullets": [...] }, ...],
  "quote": optional { "text": string, "attribution": optional string },
  "imageUrl": optional string (MUST use exact paths from illustrations list above),
  "imageCaption": optional string
}`

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
}

// ---------------------------------------------------------------------------
// Helpers: build request payloads
// ---------------------------------------------------------------------------

function buildAnthropicPayload(body: GenerateBody) {
  const content: any[] = [{ type: 'text', text: body.prompt }]

  for (const file of body.files ?? []) {
    if (file.type === 'image') {
      const mediaType = guessImageMediaType(file.name)
      // Strip data URL prefix if present
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
        text: `\n\n--- Data file: ${file.name} ---\n${file.data}\n--- End of ${file.name} ---\n\nAnalyze this data and create appropriate data visualization slides. Choose the best chart/visualization type based on the data structure.`,
      })
    }
  }

  return {
    model: body.model,
    max_tokens: 8192,
    stream: true,
    system: SYSTEM_PROMPT,
    messages: [{ role: 'user', content }],
  }
}

function buildOpenRouterPayload(body: GenerateBody) {
  const content: any[] = [{ type: 'text', text: body.prompt }]

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
    max_tokens: 8192,
    stream: true,
    messages: [
      { role: 'system', content: SYSTEM_PROMPT },
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
                  controller.enqueue(encoder.encode('data: [DONE]\n\n'))
                  controller.close()
                  return
                }
              } else {
                const delta = parsed.choices?.[0]?.delta?.content
                if (delta) text = delta
                if (parsed.choices?.[0]?.finish_reason) {
                  controller.enqueue(encoder.encode('data: [DONE]\n\n'))
                  controller.close()
                  return
                }
              }

              if (text) {
                const chunk = JSON.stringify({ text })
                controller.enqueue(encoder.encode(`data: ${chunk}\n\n`))
              }
            } catch {
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
      // Try to extract a human-readable message from the provider error
      let detail = ''
      try {
        const parsed = JSON.parse(errorText)
        detail = parsed.error?.message || parsed.error || errorText
      } catch {
        detail = errorText
      }
      return new Response(
        JSON.stringify({ error: `Provider error (${upstreamResponse.status}): ${detail}` }),
        { status: upstreamResponse.status, headers: { 'Content-Type': 'application/json' } },
      )
    }

    const stream = createSSEStream(upstreamResponse, body.provider)

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
