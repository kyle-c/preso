import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from '@/lib/studio-auth'
import { getUserSettings } from '@/lib/studio-db'

export const runtime = 'nodejs'
export const maxDuration = 60

const SYSTEM_PROMPT = `You are a presentation slide designer. Given a slide that needs improvement and specific feedback, generate a single replacement slide as a JSON object.

The slide must follow the Félix design system:
- Types: title, section, content, bullets, two-column, cards, quote, image, checklist, closing, chart
- bg: "dark" | "light" | "brand"
- Required fields: type, bg, title
- Optional: subtitle, body, badge, bullets, cards, columns, quote, imageUrl, chart, notes
- style: Optional object for presentation-layer overrides:
  * titleSize: Tailwind size ("sm" to "7xl")
  * bodySize: Tailwind size for body/subtitle text
  * cardSize: Tailwind size for card content
  * columnRatio: "50:50" | "40:60" | "60:40" | "30:70" | "70:30" for two-column layouts

Return ONLY a valid JSON object. No markdown fences, no commentary.`

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession()
    if (!session) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })

    const { feedback, currentSlide, prevTitle, nextTitle } = await req.json()
    if (!feedback || !currentSlide) {
      return NextResponse.json({ error: 'feedback and currentSlide required' }, { status: 400 })
    }

    const settings = await getUserSettings(session.userId)
    const apiKey = settings.anthropicKey || ''
    if (!apiKey) {
      return NextResponse.json({ error: 'No API key configured' }, { status: 400 })
    }

    const userPrompt = `CURRENT SLIDE (source of truth — preserve all unchanged fields):
${JSON.stringify(currentSlide, null, 2)}

${prevTitle ? `Previous slide title: "${prevTitle}"` : ''}
${nextTitle ? `Next slide title: "${nextTitle}"` : ''}

User's edit request: ${feedback}

RULES:
1. SURGICAL EDIT — Only change what the user asked for. Copy every other field exactly as-is.
2. The JSON above is the current state. Do not revert, rewrite, or reimagine fields the user didn't mention.
3. If the request involves styling that the JSON schema can't control (font size, spacing, etc.), add a note explaining what's possible instead.
4. Always include a "notes" field.`

    // Direct Anthropic API call
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 2000,
        system: SYSTEM_PROMPT,
        messages: [{ role: 'user', content: userPrompt }],
      }),
    })

    if (!res.ok) {
      const err = await res.text()
      console.error('[regenerate-slide] Anthropic error:', res.status, err.slice(0, 200))
      return NextResponse.json({ error: 'Slide generation failed. Please try again.' }, { status: 502 })
    }

    const data = await res.json()
    const text = data.content?.[0]?.text || ''

    // Parse JSON from response
    let slide = null
    try {
      // Try direct parse
      slide = JSON.parse(text)
    } catch {
      // Try extracting JSON from markdown fences
      const match = text.match(/```(?:json)?\s*([\s\S]*?)```/)
      if (match) {
        try { slide = JSON.parse(match[1]) } catch {}
      }
      // Try finding a JSON object
      if (!slide) {
        const objMatch = text.match(/\{[\s\S]*"type"\s*:[\s\S]*"title"\s*:[\s\S]*\}/)
        if (objMatch) {
          try { slide = JSON.parse(objMatch[0]) } catch {}
        }
      }
    }

    if (!slide || !slide.type || !slide.title) {
      console.error('[regenerate-slide] Failed to parse slide from:', text.slice(0, 300))
      return NextResponse.json({ error: 'Failed to parse slide from LLM response' }, { status: 500 })
    }

    return NextResponse.json({ slide })
  } catch (err) {
    console.error('[regenerate-slide]', err)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
