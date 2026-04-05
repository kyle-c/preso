import { NextRequest } from 'next/server'
import { strengthenPrompt, detectIntent } from '@/lib/prompt-strengthener'
import { formatChartConstraint } from '@/lib/data-viz-intelligence'
import { postProcessSlides } from '@/lib/slide-layout-engine'
import { analyzeSlides, totalSlideWords } from '@/lib/slide-coach'
import { getServerSession } from '@/lib/studio-auth'
import { getBrandKit, serializeBrandForPrompt, FELIX_BRAND_KIT } from '@/lib/brand-kit'
import { computeUserStyleProfile, selectExemplars, formatProfileForPrompt, formatExemplarsForPrompt } from '@/lib/studio-quality'
import { getBlueprintEnrichment, selectBlueprints } from '@/lib/training-blueprints'
import { getExemplarSlides, getAntiExemplarSlides } from '@/lib/studio-db'
import { parseJSONResponse } from '@/lib/json-parser'
import { SYSTEM_PROMPT, FAST_OUTLINE_MODELS, OUTLINE_SYSTEM_PROMPT, ONBOARDING_OUTLINE } from '@/lib/prompt-builder'
import {
  normalizeModel,
  FALLBACK_MODEL,
  guessImageMediaType,
  modelSupportsVision,
  describeImagesWithVision,
  buildVisionHint,
  fetchWithTimeout,
  buildUserContent,
  makeNonStreamingCall as makeNonStreamingCallAdapter,
  type FileAttachment,
  type ProviderConfig,
} from '@/lib/provider-adapter'

export const runtime = 'nodejs'
export const maxDuration = 300

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface GenerateBody {
  prompt: string
  files?: FileAttachment[]
  provider: 'anthropic' | 'google' | 'openrouter'
  apiKey: string
  model: string
  parallel?: boolean
  /** When true, skip prompt strengthening — used for slide/deck edits */
  edit?: boolean
  /** Injected server-side from session — used for style profile + exemplars */
  userId?: string
  /** Enriched system prompt with user profile + exemplars (built in POST handler) */
  enrichedSystemPrompt?: string
  /** When true, skip slide generation and only produce a document object */
  documentOnly?: boolean
  /** When true, reverse-engineer slides into a rich document then distill an outline */
  reverseEngineer?: boolean
  /** Existing slides to use for document-only or reverse-engineer generation */
  slides?: any[]
  /** Merge mode: combine multiple presentations into one */
  merge?: {
    mode: 'narrative' | 'deduplicate'
    sourceIds: string[]
    sourceMaterial: string
  }
  /** AI edit target: edit document or outline in-place */
  editTarget?: 'document' | 'outline'
  /** Current document JSON for document edits */
  document?: any
  /** Current outline JSON for outline edits */
  outline?: any
  /** Selection context for targeted document edits */
  selectionContext?: { sectionIndex: number; selectedText: string }
  /** Template structure to guide slide generation */
  templateStructure?: {
    title: string
    slideCount: number
    sections: { type: string; title?: string; tone?: string }[]
  }
}

// ---------------------------------------------------------------------------
// Helpers: build request payloads
// ---------------------------------------------------------------------------

function buildTemplateConstraint(template: GenerateBody['templateStructure']): string {
  if (!template) return ''
  const sectionList = template.sections
    .map((s, i) => `  ${i + 1}. type: "${s.type}"${s.title ? ` — "${s.title}"` : ''}${s.tone ? ` (tone: ${s.tone})` : ''}`)
    .join('\n')
  return `\n\n## Template Structure (FOLLOW THIS STRUCTURE)\nGenerate exactly ${template.slideCount} slides following this structure:\n${sectionList}\n\nUse these slide types and ordering as your guide. Fill in content based on the user's prompt while preserving the template structure.`
}

function buildAnthropicPayload(body: GenerateBody) {
  // Skip prompt strengthening for edit requests — the prompt already has explicit instructions
  let promptText = body.edit ? body.prompt : strengthenPrompt(body.prompt).strengthenedPrompt
  // Append template structure constraint if provided
  if (body.templateStructure) promptText += buildTemplateConstraint(body.templateStructure)
  const content: any[] = [{ type: 'text', text: promptText }]

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
      const chartHint = formatChartConstraint(file.data)
      content.push({
        type: 'text',
        text: `\n\n--- Data file: ${file.name} ---\n${file.data}\n--- End of ${file.name} ---\n\nAnalyze this data and create appropriate data visualization slides.${chartHint}`,
      })
    }
  }

  const isExtendedThinking = body.model.includes('sonnet-4-5')

  const payload: any = {
    model: body.model,
    max_tokens: isExtendedThinking ? 32000 : 32768,
    stream: true,
    system: body.enrichedSystemPrompt || SYSTEM_PROMPT,
    messages: [{ role: 'user', content }],
  }

  // Lower temperature for more consistent, higher-quality output
  if (!isExtendedThinking) {
    payload.temperature = 0.7
  }

  // Sonnet 4.5 requires extended thinking to be enabled
  if (isExtendedThinking) {
    payload.thinking = {
      type: 'enabled',
      budget_tokens: 10000,
    }
  }

  return payload
}

function buildOpenRouterPayload(body: GenerateBody) {
  let promptText = body.edit ? body.prompt : strengthenPrompt(body.prompt).strengthenedPrompt
  if (body.templateStructure) promptText += buildTemplateConstraint(body.templateStructure)
  const content: any[] = [{ type: 'text', text: promptText }]

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
      const chartHint = formatChartConstraint(file.data)
      content.push({
        type: 'text',
        text: `\n\n--- Data file: ${file.name} ---\n${file.data}\n--- End of ${file.name} ---\n\nAnalyze this data and create appropriate data visualization slides.${chartHint}`,
      })
    }
  }

  return {
    model: body.model,
    max_tokens: 32768,
    stream: true,
    temperature: 0.7,
    messages: [
      { role: 'system', content: body.enrichedSystemPrompt || SYSTEM_PROMPT },
      { role: 'user', content },
    ],
  }
}


// ---------------------------------------------------------------------------
// Vision pre-processing — describe images via a cheap vision-capable model
// ---------------------------------------------------------------------------



/** Wrap a stream with a leading hint SSE event */
function prependHintToStream(
  innerStream: ReadableStream<Uint8Array>,
  hint: string,
): ReadableStream<Uint8Array> {
  const encoder = new TextEncoder()
  return new ReadableStream({
    async start(controller) {
      controller.enqueue(encoder.encode(`data: ${JSON.stringify({ hint })}\n\n`))
      const reader = innerStream.getReader()
      try {
        while (true) {
          const { done, value } = await reader.read()
          if (done) break
          controller.enqueue(value)
        }
      } finally {
        controller.close()
      }
    },
  })
}

// ---------------------------------------------------------------------------
// SSE parsing helpers
// ---------------------------------------------------------------------------

function createSSEStream(
  upstreamResponse: Response,
  provider: 'anthropic' | 'google' | 'openrouter',
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
                // Only extract text deltas, skip thinking deltas
                if (parsed.type === 'content_block_delta') {
                  if (parsed.delta?.type === 'text_delta' && parsed.delta?.text) {
                    text = parsed.delta.text
                  } else if (parsed.delta?.text && parsed.delta?.type !== 'thinking_delta') {
                    // Fallback for older API versions without delta.type
                    text = parsed.delta.text
                  }
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
// Parallel generation: outline → 3 concurrent batch content calls
// ---------------------------------------------------------------------------



function buildBatchPrompt(outline: any[], batchIndices: number[], userPrompt?: string, hasFiles = false, intent?: string): string {
  const outlineStr = JSON.stringify(outline, null, 2)
  const indices = batchIndices.join(', ')

  // Select per-batch blueprints based on the specific slides in this batch
  let blueprintHint = ''
  if (userPrompt) {
    try {
      const batchSlides = batchIndices.map(i => outline[i]).filter(Boolean)
      const bps = selectBlueprints(userPrompt, batchSlides, 6)
      if (bps.length > 0) {
        blueprintHint = '\n\nStructural guides for these slides:\n' +
          bps.map(bp => `- ${bp.name} (→ ${bp.mapsToType}): ${bp.spec}`).join('\n')
      }
    } catch { /* non-critical */ }
  }

  const fileHint = hasFiles
    ? '\n\nIMPORTANT: The user uploaded source files (PDF/images/data). The content for these slides MUST be derived from the uploaded files — extract the actual text, data, and structure from the source material. Do NOT invent generic content. Recreate the source content using the Félix design system.\n'
    : ''

  const onboardingHint = intent === 'onboarding'
    ? `\n\nCRITICAL — ONBOARDING TEMPLATE: This is an onboarding/welcome deck. You MUST follow the "Employee Onboarding (exactly 10 slides)" template from the system prompt EXACTLY. For each slide index, match the corresponding template slide structure:
- Slide 0 (title, light): Welcome slide — "Bienvenido, [Name]!" with Party Popper illustration. Personalize with the person's name and role from the user prompt.
- Slide 1 (two-column, light): "Who We Are" — Félix mission + products. Use Félix Illo 1 illustration. Keep the exact Félix mission and product descriptions.
- Slide 2 (cards, light): "Our Values" — ALL 6 Félix values VERBATIM: User-Obsession, Getting Sh*t Done With Urgency, Extreme Ownership, No-Ego Collaboration, Aim For Insanely Great, Insatiable Curiosity. Use the exact descriptions from the template.
- Slide 3 (two-column, dark): "Your Role" — Personalized role headline + responsibilities. Use Survey illustration. Left column: narrative about why this role matters. Right column: 6 specific responsibilities.
- Slide 4 (cards, light): "Meet the Team" — Team member cards with varied titleColor. Include new hire card with ⭐ emoji.
- Slide 5 (cards, dark): "First 90 Days" — Three phases: Days 1-30 Immerse (#2BF2F1), Days 31-60 Build (#60D06F), Days 61-90 Scale (#F19D38). Each with 5-6 specific tasks.
- Slide 6 (cards, light): "Your Toolkit" — 8 tool cards (Figma, Notion, Slack, ClickUp, Google Suite, Claude, Omni+Amplitude, role-specific).
- Slide 7 (two-column, brand): "Our Users" — User personas (María, Roberto, Gloria) with emoji icons. Use Hands/Juntos illustration.
- Slide 8 (bullets, light): "Your First Week" — Monday through Friday day-by-day schedule with 📅 icons.
- Slide 9 (closing, dark): Inspirational closing with Rocket Launch illustration. Include Slack channel, manager name, Notion link.

Replace [bracketed placeholders] with content derived from the user's prompt. If the prompt doesn't specify certain details (team members, tools, responsibilities), use plausible defaults for a Félix employee in the specified role.\n`
    : ''

  const otherIndices = outline.map((_: any, i: number) => i).filter((i: number) => !batchIndices.includes(i))
  const contextHint = otherIndices.length > 0
    ? `\nNote: Slides at indices [${otherIndices.join(', ')}] are being generated in parallel. Ensure your slides complement the full narrative — avoid repeating content from other slides' outlines.\n`
    : ''

  const userContext = userPrompt
    ? `\nUSER'S ORIGINAL BRIEF:\n${userPrompt}\n\nUse this context to generate rich, specific content that directly addresses the user's intent. Every slide should reflect the subject matter, domain expertise, and goals described above.\n`
    : ''

  return `You are completing slides for a Félix Pago presentation.
${userContext}
Here is the FULL presentation outline (${outline.length} slides):
${outlineStr}
${fileHint}${onboardingHint}${contextHint}
Generate FULL content for slides at indices [${indices}] ONLY.

Produce COMPLETE, PRESENTATION-READY slides. The user's brief above is your source material. Use it to generate specific, substantive content with real data, names, and numbers.

For each slide, keep its type, bg, badge, and title from the outline, then populate ALL content fields per the system prompt rules. Every slide MUST have subtitle + body + type-specific fields (bullets/cards/columns/chart/quote). Section slides need a data-specific subtitle, not a topic label.

Add to every content slide: notes (3-5 sentence speaker notes) and imageUrl (pick from: /illustrations/Party%20Popper.svg, /illustrations/Rocket%20Launch%20-%20Growth%20%2B%20Coin%20-%20Turquoise.svg, /illustrations/F%C3%A9lix%20Illo%201.svg, /illustrations/Dollar%20bills%20%2B%20Coins%20A.svg, /illustrations/Flying%20Dollar%20Bills%20-%20Turquoise.svg, /illustrations/Speech%20Bubbles%20%2B%20Hearts.svg, /illustrations/Hand%20-%20Stars.svg, /illustrations/Fast.svg, /illustrations/Magnifying%20Glass.svg, /illustrations/Survey.svg, /illustrations/Lock.svg, /illustrations/ray.svg).
${blueprintHint}
Return ONLY a JSON array of the completed slides (same order as requested). No markdown fences.`
}


// Local shim preserves the old call signature used throughout this file
async function makeNonStreamingCall(
  body: GenerateBody,
  systemPrompt: string,
  userMessage: string,
  maxTokens = 16000,
  enableCache = false,
  timeoutMs = 60000,
  files?: FileAttachment[],
): Promise<string> {
  return makeNonStreamingCallAdapter({
    config: { provider: body.provider, apiKey: body.apiKey, model: body.model },
    systemPrompt,
    userMessage,
    maxTokens,
    enableCache,
    timeoutMs,
    files,
  })
}


// In-memory cache with TTL for expensive enrichment queries
const enrichmentCache = new Map<string, { data: any; expiry: number }>()
const CACHE_TTL = 60 * 60 * 1000 // 1 hour

async function cachedFetch<T>(key: string, fetcher: () => Promise<T>): Promise<T> {
  const cached = enrichmentCache.get(key)
  if (cached && Date.now() < cached.expiry) {
    return cached.data as T
  }
  const data = await fetcher()
  enrichmentCache.set(key, { data, expiry: Date.now() + CACHE_TTL })
  return data
}

async function runEnrichment(body: GenerateBody): Promise<void> {
  // Enrich system prompt with user style profile + exemplars + brand kit
  try {
    const session = await getServerSession()
    if (session?.userId) {
      body.userId = session.userId

      // Load brand kit — if user has a custom brand, replace the brand section of the system prompt
      let basePrompt = SYSTEM_PROMPT
      try {
        const brandKit = await cachedFetch(`brandKit:${session.userId}`, () => getBrandKit(session.userId))
        if (brandKit) {
          // Replace the brand-specific section (lines before "### Design Principles") with the custom brand
          const designPrinciplesIdx = SYSTEM_PROMPT.indexOf('### Design Principles')
          if (designPrinciplesIdx > 0) {
            const brandSection = serializeBrandForPrompt(brandKit)
            const genericRules = SYSTEM_PROMPT.substring(designPrinciplesIdx)
            basePrompt = `You are a world-class presentation designer for ${brandKit.name}, ${brandKit.description}. You create structured slide presentations following the brand's design system.\n\n${brandSection}\n${genericRules}`
            console.log(`[studio/generate] Using custom brand kit: ${brandKit.name}`)
          }
        }
      } catch (err) {
        console.warn('[studio/generate] Brand kit load failed, using default:', err)
      }

      const intentType = detectIntent(body.prompt)
      const [profile, exemplars] = await Promise.all([
        cachedFetch(`profile:${session.userId}`, () => computeUserStyleProfile(session.userId!)),
        cachedFetch(`exemplars:${intentType}`, () => selectExemplars(intentType, 3)),
      ])

      let enrichment = ''
      if (profile.sampleSize >= 3) {
        enrichment += '\n\n' + formatProfileForPrompt(profile)
      }

      if (exemplars.length > 0) {
        enrichment += '\n\n' + formatExemplarsForPrompt(exemplars)
      }

      if (enrichment) {
        body.enrichedSystemPrompt = basePrompt + enrichment
        console.log('[studio/generate] Enriched prompt with profile + exemplars')
      } else if (basePrompt !== SYSTEM_PROMPT) {
        body.enrichedSystemPrompt = basePrompt
      }
    }
  } catch (err) {
    console.warn('[studio/generate] Profile/exemplar enrichment failed:', err)
  }

  // Inject manually-rated slide exemplars
  try {
    const [goodSlides, badSlides] = await Promise.all([
      cachedFetch('exemplarSlides', () => getExemplarSlides(undefined, 6)),
      cachedFetch('antiExemplarSlides', () => getAntiExemplarSlides(3)),
    ])

    if (goodSlides.length > 0 || badSlides.length > 0) {
      const base = body.enrichedSystemPrompt || SYSTEM_PROMPT
      const sections: string[] = []

      if (goodSlides.length > 0) {
        sections.push('## Curated Exemplar Slides (FOLLOW these patterns closely)')
        sections.push('These slides have been manually rated as high-quality by the design team. Match their structure, content density, and style:\n')
        for (const s of goodSlides) {
          const truncated: any = { type: s.slideData.type, bg: s.slideData.bg, title: s.slideData.title }
          if (s.slideData.subtitle) truncated.subtitle = s.slideData.subtitle
          if (s.slideData.body) truncated.body = s.slideData.body
          if (s.slideData.bullets) truncated.bullets = s.slideData.bullets.slice(0, 6)
          if (s.slideData.cards) truncated.cards = s.slideData.cards.slice(0, 4)
          if (s.slideData.columns) truncated.columns = s.slideData.columns
          if (s.slideData.quote) truncated.quote = s.slideData.quote
          if (s.slideData.chart) truncated.chart = s.slideData.chart
          if (s.slideData.notes) truncated.notes = s.slideData.notes
          sections.push(`### ${s.slideType} slide (bg: ${s.bg}, source: ${s.source})`)
          sections.push('```json\n' + JSON.stringify(truncated, null, 2) + '\n```\n')
        }
      }

      if (badSlides.length > 0) {
        sections.push('## Anti-Exemplars (AVOID these patterns)')
        sections.push('These slides were rated as low-quality. Do NOT follow their structure:\n')
        for (const s of badSlides) {
          sections.push(`- ${s.slideType} slide: "${s.slideData.title}"${s.note ? ` (reason: ${s.note})` : ''}`)
        }
      }

      body.enrichedSystemPrompt = base + '\n\n' + sections.join('\n')
      console.log(`[studio/generate] Injected ${goodSlides.length} exemplars + ${badSlides.length} anti-exemplars from manual ratings`)
    }
  } catch (err) {
    console.warn('[studio/generate] Manual rating enrichment failed:', err)
  }

  // Inject training blueprints based on detected intent
  try {
    const blueprintSection = getBlueprintEnrichment(body.prompt)
    if (blueprintSection) {
      const base = body.enrichedSystemPrompt || SYSTEM_PROMPT
      body.enrichedSystemPrompt = base + '\n\n' + blueprintSection
      console.log('[studio/generate] Injected training blueprints')
    }
  } catch (err) {
    console.warn('[studio/generate] Blueprint enrichment failed:', err)
  }
}

async function runDocumentGeneration(
  body: GenerateBody,
  allCompletedSlides: any[],
  totalSlides: number,
  emit: (data: any) => void,
): Promise<void> {
  try {
    const finalSlides = allCompletedSlides.filter(Boolean)
    const docPrompt = `Based on this presentation and the original brief, generate a professional document object.

Original brief: ${body.prompt}

Slides: ${JSON.stringify(finalSlides)}

Return a JSON object (not array): {"title": "...", "type": "prd"|"proposal"|"launch"|"review"|"research"|"onboarding"|"strategy"|"general", "summary": "2-3 sentences", "sections": [{"title": "...", "content": "detailed markdown (3-5 paragraphs)", "slideIndex": number}]}

IMPORTANT: Never leave widows or orphans — no single word alone on the last line of any title, section heading, paragraph, or bullet. Rewrite copy so every final line has at least two words.

Return ONLY the JSON object. No markdown fences.`

    const docTimeout = body.model.includes('opus') ? 180000 : 90000
    let docText: string
    try {
      docText = await makeNonStreamingCall(body, body.enrichedSystemPrompt || SYSTEM_PROMPT, docPrompt, 8000, true, docTimeout)
    } catch (modelErr) {
      console.warn('[studio/generate] Doc generation failed with user model, retrying with fallback:', modelErr)
      const fallbackBody = { ...body, model: FALLBACK_MODEL }
      docText = await makeNonStreamingCall(fallbackBody, body.enrichedSystemPrompt || SYSTEM_PROMPT, docPrompt, 8000, true, 90000)
    }
    const doc = parseJSONResponse(docText)
    if (doc && doc.title) {
      emit({ document: doc })

      // Generate outline from the document
      try {
        const outlinePrompt = `Distill this document into a structured outline — a concise, hierarchical summary.

Document: ${JSON.stringify(doc, null, 1)}

The presentation has ${finalSlides.length} slides.

Return a JSON object:
{
  "title": "Outline title",
  "thesis": "One sentence capturing the core argument or purpose",
  "sections": [
    {
      "title": "Section heading",
      "summary": "1-2 sentence summary",
      "slideIndices": [0, 1],
      "subsections": [
        { "title": "Subsection heading", "detail": "One sentence with specific data or conclusions" }
      ]
    }
  ]
}

Section titles should be descriptive and specific. Include numbers and conclusions in subsection details. Return ONLY the JSON object.`

        let outlineText: string
        try {
          outlineText = await makeNonStreamingCall(body, body.enrichedSystemPrompt || SYSTEM_PROMPT, outlinePrompt, 6000, true, 60000)
        } catch {
          const fb = { ...body, model: FALLBACK_MODEL }
          outlineText = await makeNonStreamingCall(fb, body.enrichedSystemPrompt || SYSTEM_PROMPT, outlinePrompt, 6000, true, 60000)
        }
        const docOutline = parseJSONResponse(outlineText)
        if (docOutline && docOutline.title) {
          emit({ outline: docOutline })
        }
      } catch (outlineErr) {
        console.error('[studio/generate] Outline generation failed:', outlineErr)
      }
    }
  } catch (err) {
    console.error('[studio/generate] Document generation failed:', err)
    emit({ hint: 'Document generation failed — you can retry from the Document tab.' })
  }
}

function createParallelSSEStream(body: GenerateBody): ReadableStream<Uint8Array> {
  const encoder = new TextEncoder()

  return new ReadableStream({
    async start(controller) {
      let streamClosed = false
      const emit = (data: any) => {
        if (streamClosed) return
        try {
          controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`))
        } catch {
          streamClosed = true
        }
      }
      const closeStream = () => {
        if (streamClosed) return
        streamClosed = true
        try {
          controller.close()
        } catch { /* already closed */ }
      }

      // Keep connection alive while waiting for LLM responses
      const keepalive = setInterval(() => {
        try { emit({ keepalive: true }) } catch { /* stream closed */ }
      }, 15000)

      try {
        const isMerge = !!body.merge
        const { strengthenedPrompt } = strengthenPrompt(body.prompt)
        const intent = isMerge ? 'general' : detectIntent(body.prompt)
        const hasFiles = (body.files ?? []).length > 0

        // For merge mode, enrich the system prompt with merge-specific instructions
        if (isMerge) {
          const mergeInstructions = body.merge!.mode === 'narrative'
            ? '\n\n## Merge Mode: Unified Narrative\nCreate a brand-new unified presentation from the source decks provided below. Design a fresh narrative arc that weaves together the best content from all sources. Do NOT simply concatenate — reimagine the story. Aim for 20-30 slides.'
            : '\n\n## Merge Mode: Merge & Deduplicate\nMerge the source decks into one cohesive presentation. Remove redundant cover/title slides (convert to section dividers where appropriate). Preserve all unique content. Consolidate without losing substance. Aim for the combined slide count minus duplicates.'
          body.enrichedSystemPrompt = (body.enrichedSystemPrompt || SYSTEM_PROMPT) + mergeInstructions
        }

        let outline: any[]

        // Run enrichment concurrently with outline generation (don't block outline)
        const enrichmentPromise = !body.edit
          ? runEnrichment(body).catch(err => {
              console.warn('[studio/generate] Enrichment failed (non-fatal):', err)
            })
          : Promise.resolve()

        // #6: Template short-circuit — skip outline API call for onboarding
        // BUT: if the user uploaded files, always use the LLM to generate an outline
        // from their content instead of the hardcoded template
        if (!isMerge && intent === 'onboarding' && !hasFiles) {
          console.log('[studio/generate] Onboarding detected (no files) — using template outline')
          outline = ONBOARDING_OUTLINE
        } else {
          // Use fast model for outline (structure only — content comes from batch step)
          console.log('[studio/generate] Parallel Phase 1: getting outline...')
          const fastModel = FAST_OUTLINE_MODELS[body.provider]
          const outlineBody: GenerateBody = { ...body, model: fastModel ?? body.model }

          // When files are attached, enhance the outline prompt and use the user's
          // full model (not the fast model) so it can process PDFs/images
          let outlinePrompt: string
          if (isMerge && body.merge) {
            // For merge outline, provide condensed summary (titles + slide types, not full JSON)
            const condensed = body.merge.sourceMaterial
              .split('=== Deck:')
              .filter(Boolean)
              .map(section => {
                const titleMatch = section.match(/"([^"]+)"/)
                const deckTitle = titleMatch ? titleMatch[1] : 'Untitled'
                try {
                  const jsonStart = section.indexOf('[')
                  if (jsonStart === -1) return `Deck: "${deckTitle}" (unknown slides)`
                  const slides = JSON.parse(section.slice(jsonStart))
                  const slideList = slides.map((s: any, i: number) =>
                    `  ${i + 1}. ${s.type} — "${s.title}" (${s.bg}${s.badge ? `, badge: ${s.badge}` : ''})`
                  ).join('\n')
                  return `Deck: "${deckTitle}" (${slides.length} slides)\n${slideList}`
                } catch {
                  return `Deck: "${deckTitle}"`
                }
              }).join('\n\n')
            outlinePrompt = `${body.prompt}\n\nSource decks to ${body.merge.mode === 'narrative' ? 'create a unified narrative from' : 'merge and deduplicate'}:\n${condensed}`
          } else if (hasFiles) {
            // For outline: use the raw prompt (not strengthened) + file hint — the outline model
            // has its own system prompt. The strengthened prompt's document guidance confuses it.
            outlinePrompt = body.prompt + '\n\nIMPORTANT: The user has uploaded files. Analyze their content carefully and structure the outline to recreate/adapt their content using the Félix design system. Do NOT default to a generic template — the outline must reflect the actual content in the uploaded files.'
          } else {
            // For outline: use the raw prompt, not the strengthened version.
            // The OUTLINE_SYSTEM_PROMPT already has JSON output instructions.
            // Sending document structure guidance causes the model to return markdown instead of JSON.
            outlinePrompt = body.prompt
          }
          const outlineFiles = hasFiles ? body.files : undefined
          // Use user's model when files are attached or merging (fast models can't handle large context)
          const effectiveOutlineBody = (hasFiles || isMerge) ? body : outlineBody
          const outlineMaxTokens = isMerge ? 6000 : 4000
          const outlineTimeout = isMerge ? 90000 : hasFiles ? 90000 : 60000

          let outlineText: string
          try {
            outlineText = await makeNonStreamingCall(
              effectiveOutlineBody,
              OUTLINE_SYSTEM_PROMPT,
              outlinePrompt,
              outlineMaxTokens,
              false,
              outlineTimeout,
              outlineFiles,
            )
          } catch (err: any) {
            // Fallback: retry with the user's selected model
            console.warn('[studio/generate] Fast outline model failed, retrying with user model:', err)
            try {
              outlineText = await makeNonStreamingCall(
                body,
                OUTLINE_SYSTEM_PROMPT,
                outlinePrompt,
                outlineMaxTokens,
                false,
                90000, // 90s timeout for fallback
                outlineFiles,
              )
            } catch (fallbackErr: any) {
              const msg = fallbackErr?.message || String(fallbackErr)
              console.error('[studio/generate] Outline fallback also failed:', msg)
              const isAuth = msg.includes('401') || msg.includes('403') || msg.includes('Unauthorized')
              const hint = isAuth
                ? 'Authentication failed. Check your API key in Settings.'
                : `Could not generate outline: ${msg.slice(0, 100)}`
              emit({ error: hint })
              clearInterval(keepalive)
              closeStream()
              return
            }
          }

          try {
            outline = parseJSONResponse(outlineText)
            if (!Array.isArray(outline) || outline.length === 0) {
              throw new Error('Invalid outline — parsed result is not a non-empty array')
            }
          } catch (parseErr: any) {
            console.error('[studio/generate] Failed to parse outline. Error:', parseErr?.message, 'Raw response (first 500 chars):', outlineText?.slice(0, 500))
            // Retry once with the user's model before giving up
            try {
              console.log('[studio/generate] Retrying outline with user model...')
              const retryText = await makeNonStreamingCall(
                body,
                OUTLINE_SYSTEM_PROMPT,
                outlinePrompt,
                outlineMaxTokens,
                false,
                90000,
                outlineFiles,
              )
              outline = parseJSONResponse(retryText)
              if (!Array.isArray(outline) || outline.length === 0) {
                throw new Error('Retry also returned invalid outline')
              }
              console.log('[studio/generate] Retry succeeded')
            } catch (retryErr: any) {
              console.error('[studio/generate] Outline retry also failed:', retryErr?.message)
              emit({ error: 'Failed to generate outline. The model returned an unexpected response — please try again.' })
              clearInterval(keepalive)
              closeStream()
              return
            }
          }
        }

        console.log(`[studio/generate] Outline: ${outline.length} slides`)

        // Sanitize outline — fix malformed bullets/cards from LLM
        for (const slide of outline) {
          if (slide.bullets) {
            slide.bullets = slide.bullets
              .map((b: any) => typeof b === 'string' ? { text: b } : b)
              .filter((b: any) => b && b.text)
          }
          if (slide.cards) {
            slide.cards = slide.cards.filter((c: any) => c && c.title)
          }
          if (slide.columns) {
            for (const col of slide.columns) {
              if (col.bullets) {
                col.bullets = col.bullets
                  .map((b: any) => typeof b === 'string' ? { text: b } : b)
                  .filter((b: any) => b && b.text)
              }
            }
          }
        }

        // Emit outline immediately so client shows slide content
        emit({ outline })

        // Wait for enrichment to complete before batch generation (runs concurrently with outline)
        await enrichmentPromise

        // Track completed slides for document generation
        const allCompletedSlides: any[] = new Array(outline.length).fill(null)
        let completedSlideCount = 0

        // #10: Dynamic batch sizing — ALL slides get content generation
        // The outline provides structure + hints; content step produces the full slide
        const allIndices = outline.map((_: any, i: number) => i)
        const batchCount = isMerge
          ? Math.min(6, Math.max(4, Math.ceil(outline.length / 5)))
          : outline.length <= 8 ? 1 : outline.length <= 16 ? 2 : 3
        const batchSize = Math.ceil(outline.length / batchCount)
        const batches: { indices: number[] }[] = []
        for (let i = 0; i < outline.length; i += batchSize) {
          const end = Math.min(i + batchSize, outline.length)
          const indices = Array.from({ length: end - i }, (_, j) => i + j)
          batches.push({ indices })
        }

        console.log(`[studio/generate] Parallel Phase 2: ${batches.length} batches (${outline.length} slides)${isMerge ? ' [MERGE]' : ''}`)
        const docThreshold = Math.ceil(outline.length * 0.8)
        let docGenStarted = false
        let docGenPromise: Promise<void> | null = null

        // Start document generation once enough slides are ready
        const maybeStartDocGen = () => {
          if (docGenStarted || completedSlideCount < docThreshold) return
          docGenStarted = true
          console.log(`[studio/generate] Starting early doc gen (${completedSlideCount}/${outline.length} slides ready)`)
          docGenPromise = runDocumentGeneration(body, allCompletedSlides, outline.length, emit)
        }

        // For merge mode, inject full source material into batch prompts
        const mergeSuffix = isMerge && body.merge
          ? `\n\nSource material from ${body.merge.sourceIds.length} decks:\n${body.merge.sourceMaterial}`
          : ''
        const batchUserPrompt = body.prompt + mergeSuffix

        await Promise.all(
          batches.map(async (batch) => {
            // Declare outside try so catch can access for retry
            const batchPrompt = buildBatchPrompt(outline, batch.indices, batchUserPrompt, hasFiles, intent)
            const tokensPerSlide = isMerge ? 3000 : 3000
            const maxTokens = Math.min(batch.indices.length * tokensPerSlide, 20000)
            const isOpus = body.model.includes('opus')
            const batchTimeout = isMerge ? 180000 : isOpus ? 180000 : hasFiles ? 120000 : 90000
            try {
              const responseText = await makeNonStreamingCall(
                body,
                body.enrichedSystemPrompt || SYSTEM_PROMPT,
                batchPrompt,
                maxTokens,
                true, // #9: enable prompt caching
                batchTimeout,
                hasFiles ? body.files : undefined, // pass files so LLM can reference uploaded content
              )

              const slides = parseJSONResponse(responseText)
              if (Array.isArray(slides) && slides.length > 0) {
                for (let i = 0; i < slides.length; i++) {
                  allCompletedSlides[batch.indices[i]] = slides[i]
                }
                completedSlideCount += slides.length
                emit({ batch: slides, startIndex: batch.indices[0] })
              } else {
                console.error(`[studio/generate] Batch parse failed. Retrying with fallback model...`, responseText?.slice(0, 300))
                emit({ hint: 'Content batch returned invalid JSON. Retrying...' })
                try {
                  const fallbackBody = { ...body, model: FALLBACK_MODEL }
                  const retryText = await makeNonStreamingCall(fallbackBody, body.enrichedSystemPrompt || SYSTEM_PROMPT, batchPrompt, maxTokens, true, batchTimeout)
                  const retrySlides = parseJSONResponse(retryText)
                  if (Array.isArray(retrySlides) && retrySlides.length > 0) {
                    for (let i = 0; i < retrySlides.length; i++) {
                      allCompletedSlides[batch.indices[i]] = retrySlides[i]
                    }
                    completedSlideCount += retrySlides.length
                    emit({ batch: retrySlides, startIndex: batch.indices[0] })
                  } else {
                    throw new Error('Retry also returned invalid JSON')
                  }
                } catch {
                  const fallback = batch.indices.map(i => outline[i])
                  for (let i = 0; i < fallback.length; i++) {
                    allCompletedSlides[batch.indices[i]] = fallback[i]
                  }
                  completedSlideCount += fallback.length
                  emit({ batch: fallback, startIndex: batch.indices[0] })
                }
              }
              // Check if we can start doc gen early
              maybeStartDocGen()
            } catch (err: any) {
              console.error(`[studio/generate] Batch at ${batch.indices[0]} failed:`, err)
              emit({ hint: `Content batch ${batch.indices[0]} failed: ${err?.message?.slice(0, 100) || 'unknown error'}. Retrying with fallback model...` })
              // Retry once with a known-good model before falling back to outline
              try {
                const fallbackBody = { ...body, model: FALLBACK_MODEL }
                const retryText = await makeNonStreamingCall(
                  fallbackBody,
                  body.enrichedSystemPrompt || SYSTEM_PROMPT,
                  batchPrompt,
                  maxTokens,
                  true,
                  batchTimeout,
                )
                const retrySlides = parseJSONResponse(retryText)
                if (Array.isArray(retrySlides) && retrySlides.length > 0) {
                  for (let i = 0; i < retrySlides.length; i++) {
                    allCompletedSlides[batch.indices[i]] = retrySlides[i]
                  }
                  completedSlideCount += retrySlides.length
                  emit({ batch: retrySlides, startIndex: batch.indices[0] })
                  emit({ hint: 'Recovered with fallback model' })
                  maybeStartDocGen()
                  return
                }
              } catch (retryErr) {
                console.error(`[studio/generate] Fallback retry also failed:`, retryErr)
              }
              const fallback = batch.indices.map(i => outline[i])
              for (let i = 0; i < fallback.length; i++) {
                allCompletedSlides[batch.indices[i]] = fallback[i]
              }
              completedSlideCount += fallback.length
              emit({ batch: fallback, startIndex: batch.indices[0] })
              maybeStartDocGen()
            }
          }),
        )

        // #3.5: Post-process slides — enforce layout rules
        // Build index map: filtered position → original allCompletedSlides position
        const validForProcess: number[] = []
        for (let i = 0; i < allCompletedSlides.length; i++) {
          const s = allCompletedSlides[i]
          if (s && s.type && s.title) validForProcess.push(i)
        }
        const slidesForProcess = validForProcess.map(i => allCompletedSlides[i])
        const processed = postProcessSlides(slidesForProcess)
        // Re-emit processed slides if layout engine made changes
        for (let i = 0; i < processed.length; i++) {
          const origIdx = validForProcess[i]
          if (JSON.stringify(processed[i]) !== JSON.stringify(allCompletedSlides[origIdx])) {
            allCompletedSlides[origIdx] = processed[i]
          }
        }
        if (processed.length > 0) {
          emit({ batch: processed, startIndex: 0 }) // Send corrected slides
        }

        // ── Thin-slide retry (max 1 attempt) ──
        // Build index map: validSlides position → allCompletedSlides position
        const validIndexMap: number[] = []
        for (let i = 0; i < allCompletedSlides.length; i++) {
          if (allCompletedSlides[i]) validIndexMap.push(i)
        }
        const validSlides = validIndexMap.map(i => allCompletedSlides[i])
        const coachResults = analyzeSlides(validSlides)
        const thinIndices = coachResults
          .filter(s => s.rule === 'thin-content' && s.severity === 'error')
          .map(s => s.slideIndex)

        if (thinIndices.length > 0 && thinIndices.length <= 6) {
          // Map thin indices back to allCompletedSlides positions
          const thinOrigIndices = thinIndices.map(i => validIndexMap[i])
          console.log(`[studio/generate] Thin-slide retry: ${thinIndices.length} slides at [${thinOrigIndices.join(', ')}]`)
          try {
            const thinSlidesInfo = thinIndices.map(i => {
              const origIdx = validIndexMap[i]
              const s = allCompletedSlides[origIdx]
              return `Slide ${origIdx} (${s?.type}): "${s?.title}" — currently ${totalSlideWords(s)} words`
            }).join('\n')

            const retryPrompt = `These slides are too thin on content. Regenerate with SIGNIFICANTLY MORE content — each must have 50+ words of visible content.

Thin slides to fix:
${thinSlidesInfo}

${buildBatchPrompt(outline, thinOrigIndices, batchUserPrompt, hasFiles, intent)}

CRITICAL: These slides were flagged for having too little content. You MUST add substantially more detail — specific examples, data points, actionable items, context. Do NOT return thin content again.`

            const retryTokens = Math.min(thinIndices.length * 3000, 20000)
            const retryText = await makeNonStreamingCall(
              body,
              body.enrichedSystemPrompt || SYSTEM_PROMPT,
              retryPrompt,
              retryTokens,
              true,
              90000,
            )

            const retrySlides = parseJSONResponse(retryText)
            if (Array.isArray(retrySlides) && retrySlides.length === thinIndices.length) {
              for (let i = 0; i < retrySlides.length; i++) {
                allCompletedSlides[thinOrigIndices[i]] = retrySlides[i]
              }
              const reprocessed = postProcessSlides(allCompletedSlides.filter(s => s && s.type && s.title))
              emit({ batch: reprocessed, startIndex: 0 })
              console.log(`[studio/generate] Thin-slide retry succeeded: replaced ${thinIndices.length} slides`)
            }
          } catch (err) {
            console.warn('[studio/generate] Thin-slide retry failed:', err)
          }
        }

        // #4: Signal slides ready — client can present immediately
        emit({ slidesReady: true })

        // If doc gen hasn't started yet (e.g. small deck), start it now
        if (!docGenStarted) {
          docGenPromise = runDocumentGeneration(body, allCompletedSlides, outline.length, emit)
        }

        // Wait for document generation to finish before closing stream
        if (docGenPromise) {
          await docGenPromise
        }

        clearInterval(keepalive)
        closeStream()
      } catch (err: any) {
        clearInterval(keepalive)
        console.error('[studio/generate parallel]', err)
        const msg = err?.message || String(err)
        const isTimeout = msg.includes('timed out') || msg.includes('AbortError')
        const isAuth = msg.includes('401') || msg.includes('403') || msg.includes('authentication') || msg.includes('Unauthorized')
        const isRate = msg.includes('429') || msg.includes('rate') || msg.includes('quota')
        const hint = isTimeout
          ? 'The request timed out. Try again or use a faster model.'
          : isAuth
          ? 'Authentication failed. Check your API key in Settings.'
          : isRate
          ? 'Rate limit hit. Wait a moment and try again.'
          : `Generation failed: ${msg.slice(0, 120)}`
        emit({ error: hint })
        closeStream()
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
    // Normalize model ID — fix short aliases and legacy stored preferences
    body.model = normalizeModel(body.model)

    if (!body.prompt && !body.reverseEngineer) {
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

    // Enrichment is deferred into createParallelSSEStream to run concurrently with outline generation.
    // For non-parallel/edit flows, run enrichment inline. Edit requests use the regular streaming path.
    if (!body.edit && !body.parallel) {
      await runEnrichment(body)
    }

    // Edit target mode: AI edit for document or outline view
    if (body.editTarget && (body.document || body.outline)) {
      console.log(`[studio/generate] Edit target mode: ${body.editTarget}`)
      const encoder = new TextEncoder()
      const stream = new ReadableStream({
        async start(controller) {
          const emit = (data: any) => controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`))
          try {
            emit({ hint: body.editTarget === 'document' ? 'Editing document…' : 'Editing outline…' })

            if (body.editTarget === 'document' && body.document) {
              const selectionClause = body.selectionContext
                ? `\n\nFOCUS: The user selected this text in section ${body.selectionContext.sectionIndex + 1}: "${body.selectionContext.selectedText}". Apply the instruction primarily to this section/selection while keeping the rest of the document coherent.`
                : ''

              const editPrompt = `You are editing an existing presentation document. Here is the current document JSON:

${JSON.stringify(body.document, null, 2)}

User instruction: ${body.prompt}${selectionClause}

Apply the user's instruction to the document. Return the COMPLETE updated document as a JSON object with the same structure:
{
  "title": "...",
  "type": "...",
  "summary": "...",
  "sections": [{ "title": "...", "content": "...", "slideIndex": 0 }, ...]
}

Guidelines:
- Preserve the existing structure unless the instruction asks to reorganize
- Keep slideIndex mappings intact unless sections are added/removed
- Write at a senior professional level
- Never leave widows or orphans
- Return ONLY the JSON object. No markdown fences, no commentary.`

              const docText = await makeNonStreamingCall(body, body.enrichedSystemPrompt || SYSTEM_PROMPT, editPrompt, 16000, true, 120000)
              const doc = parseJSONResponse(docText)
              if (doc && doc.title) {
                emit({ document: doc })
              } else {
                emit({ error: 'Failed to parse edited document' })
              }
            } else if (body.editTarget === 'outline' && body.outline) {
              const editPrompt = `You are editing an existing presentation outline. Here is the current outline JSON:

${JSON.stringify(body.outline, null, 2)}

User instruction: ${body.prompt}

Apply the user's instruction to the outline. Return the COMPLETE updated outline as a JSON object with the same structure:
{
  "title": "...",
  "thesis": "...",
  "sections": [
    {
      "title": "...",
      "summary": "...",
      "slideIndices": [0, 1],
      "subsections": [{ "title": "...", "detail": "..." }]
    }
  ]
}

Guidelines:
- Preserve the existing structure unless the instruction asks to reorganize
- Keep slideIndices mappings intact unless sections change significantly
- Be concise — outlines should be scannable in 30 seconds
- Return ONLY the JSON object. No markdown fences, no commentary.`

              const outlineText = await makeNonStreamingCall(body, body.enrichedSystemPrompt || SYSTEM_PROMPT, editPrompt, 8000, true, 60000)
              const outline = parseJSONResponse(outlineText)
              if (outline && outline.title) {
                emit({ outline })
              } else {
                emit({ error: 'Failed to parse edited outline' })
              }
            }
          } catch (err) {
            console.error(`[studio/generate] Edit target (${body.editTarget}) failed:`, err)
            emit({ error: `${body.editTarget} edit failed` })
          }
          controller.enqueue(encoder.encode('data: [DONE]\n\n'))
          controller.close()
        },
      })
      return new Response(stream, {
        headers: {
          'Content-Type': 'text/event-stream',
          'Cache-Control': 'no-cache',
          Connection: 'keep-alive',
        },
      })
    }

    // Document-only mode: skip slides, just generate the document
    if (body.documentOnly && body.slides) {
      console.log('[studio/generate] Document-only mode')
      const encoder = new TextEncoder()
      const stream = new ReadableStream({
        async start(controller) {
          const emit = (data: any) => controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`))
          try {
            const docPrompt = `You are reverse-engineering a polished presentation into a comprehensive, standalone narrative document. The document should read as a professional written piece — NOT a transcript of the slides.

Original brief / context: ${body.prompt}

Presentation slides:
${JSON.stringify(body.slides, null, 1)}

Your task:
1. Analyze each slide's content, structure, and story arc
2. Synthesize the presentation into a rich narrative document that:
   - Expands bullet points into full paragraphs with context, rationale, and supporting detail
   - Adds connective tissue between sections (transitions, context, implications)
   - Strengthens arguments with additional depth beyond what fits on a slide
   - Includes relevant data points, examples, and specifics from the slides
   - Maintains the presentation's voice and perspective while being more thorough
   - Tells a cohesive story from beginning to end

Return a JSON object:
{
  "title": "A compelling document title (can differ from the presentation title)",
  "type": "prd" | "proposal" | "launch" | "review" | "research" | "onboarding" | "strategy" | "general",
  "summary": "2-3 sentence executive summary capturing the key message",
  "sections": [
    {
      "title": "Section heading",
      "content": "Rich markdown content — 3-6 paragraphs per section. Use **bold** for emphasis, bullet lists where appropriate, and subheadings (### ) for longer sections. Each section should be substantive enough to stand alone.",
      "slideIndex": 0
    }
  ]
}

Guidelines:
- Create one section per major topic area (may combine related slides or split dense ones)
- Map each section to its primary slideIndex so readers can cross-reference
- Write at a senior professional level — authoritative, specific, insightful
- Never leave widows or orphans — no single word alone on the last line of any paragraph
- Content should be 2-3x more detailed than the slides themselves

Return ONLY the JSON object. No markdown fences, no commentary.`

            const docText = await makeNonStreamingCall(body, body.enrichedSystemPrompt || SYSTEM_PROMPT, docPrompt, 12000, true, 120000)
            const doc = parseJSONResponse(docText)
            if (doc && doc.title) {
              emit({ document: doc })
            } else {
              // Try harder to parse — sometimes the model wraps in markdown
              const cleaned = docText.replace(/```json\s*/g, '').replace(/```\s*/g, '').trim()
              try {
                const fallback = JSON.parse(cleaned)
                if (fallback && fallback.title) {
                  emit({ document: fallback })
                } else {
                  emit({ error: 'Failed to parse document response' })
                }
              } catch {
                console.error('[studio/generate] Document parse failed, raw:', docText.slice(0, 500))
                emit({ error: 'Failed to parse document response' })
              }
            }
          } catch (err) {
            console.error('[studio/generate] Document-only generation failed:', err)
            emit({ error: 'Document generation failed' })
          }
          controller.enqueue(encoder.encode('data: [DONE]\n\n'))
          controller.close()
        },
      })
      return new Response(stream, {
        headers: {
          'Content-Type': 'text/event-stream',
          'Cache-Control': 'no-cache',
          Connection: 'keep-alive',
        },
      })
    }

    // Reverse-engineer mode: slides → rich document → outline (two-step LLM)
    if (body.reverseEngineer && body.slides) {
      console.log('[studio/generate] Reverse-engineer mode: document + outline')
      const encoder = new TextEncoder()
      const stream = new ReadableStream({
        async start(controller) {
          const emit = (data: any) => controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`))
          // Keepalive: send periodic pings to prevent Vercel/proxy idle timeout
          const keepalive = setInterval(() => {
            try { emit({ keepalive: true }) } catch { /* stream may be closed */ }
          }, 15000)
          try {
            // Step 1: Generate rich document from slides
            emit({ hint: 'Analyzing presentation content and narrative arc...' })

            // Condense slides if payload is too large (>100KB of JSON)
            const fullSlidesJson = JSON.stringify(body.slides, null, 1)
            let slidesPayload: string
            if (fullSlidesJson.length > 100_000) {
              // Send condensed version: keep essential content, strip verbose fields
              const condensed = body.slides!.map((s: any, i: number) => {
                const out: any = { slide: i + 1, type: s.type, bg: s.bg, title: s.title }
                if (s.subtitle) out.subtitle = s.subtitle
                if (s.badge) out.badge = s.badge
                if (s.body) out.body = s.body.slice(0, 500)
                if (s.bullets) out.bullets = s.bullets.slice(0, 8).map((b: any) => typeof b === 'string' ? b : b.text)
                if (s.cards) out.cards = s.cards.slice(0, 4).map((c: any) => ({ title: c.title, body: c.body?.slice(0, 200) }))
                if (s.columns) out.columns = s.columns.map((col: any) => ({ heading: col.heading, body: col.body?.slice(0, 300) }))
                if (s.quote) out.quote = s.quote
                if (s.chart) out.chart = { chartType: s.chart.chartType, xKey: s.chart.xKey, yKeys: s.chart.yKeys, dataRows: s.chart.data?.length }
                return out
              })
              slidesPayload = JSON.stringify(condensed, null, 1)
              console.log(`[studio/generate] Condensed slides from ${fullSlidesJson.length} to ${slidesPayload.length} chars`)
            } else {
              slidesPayload = fullSlidesJson
            }

            const docPrompt = `You are reverse-engineering a polished presentation into a comprehensive, standalone narrative document. The document should read as a professional written piece — NOT a transcript of the slides, and NOT an outline.

Original brief / context: ${body.prompt}

Presentation slides:
${slidesPayload}

Your task:
1. Analyze each slide's content, structure, data, charts, quotes, and story arc
2. Synthesize the presentation into a richly structured professional document

The document should follow best-in-class professional document conventions (like top PRDs, strategy memos, and executive briefs):

### Formatting Requirements
- **Subheadings** (### and ####): Break sections into scannable subsections. Use ### for major subsections, #### for labeled categories
- **Bulleted lists**: Use for requirements, criteria, user stories, action items, features — anything with 3+ parallel items. Don't bury lists in prose
- **Numbered lists**: Use for sequential steps, prioritized items, or processes
- **Tables**: Use markdown tables (| col1 | col2 |) for comparisons, metrics, timelines, scoring matrices, feature grids, or any data with 2+ dimensions. Tables are STRONGLY preferred over prose for structured data
- **Bold labels**: Use **Label:** pattern for definition lists (e.g., **Owner:** Kyle, **Timeline:** Q2 2026)
- **Horizontal rules** (---): Use to separate major topic shifts within a section
- **Short paragraphs**: Max 3-4 sentences per paragraph. Break long prose into digestible chunks
- Never write a wall of unbroken text. Every section should mix prose + structured elements (lists, tables, bold labels)

### Content Structure Per Section
Each section's content should follow this pattern:
1. Opening context paragraph (2-3 sentences framing the topic)
2. Structured content (table, bulleted list, or bold-labeled items)
3. Analysis/implications paragraph (the "so what")
4. Optional: additional structured data or subsections

### Example Patterns
- **Metrics section**: Opening paragraph → Table of KPIs with Target/Actual/Status columns → Analysis paragraph
- **Requirements section**: Context → Numbered user stories → Priority table (Feature | Priority | Effort | Owner)
- **Competitive analysis**: Context → Comparison table (Competitor | Strengths | Weaknesses | Our Advantage) → Strategy implications
- **Timeline/Roadmap**: Context → Table (Phase | Dates | Deliverables | Owner) → Risk callouts as bullets
- **Goals/OKRs**: Context → Each objective as ### heading → KRs as bulleted list with metrics → Status table

Return a JSON object:
{
  "title": "A compelling document title (can differ from the presentation title)",
  "type": "prd" | "proposal" | "launch" | "review" | "research" | "onboarding" | "strategy" | "general",
  "summary": "2-3 sentence executive summary capturing the key message and conclusion",
  "sections": [
    {
      "title": "Section heading",
      "content": "Rich markdown content using ###/#### subheadings, bulleted/numbered lists, tables, **bold labels**, and short paragraphs. Each section should mix prose with structured elements. 3-8 paragraphs equivalent per section.",
      "slideIndex": 0
    }
  ]
}

Guidelines:
- Create one section per major topic area (combine related slides, split dense ones)
- Map each section to its primary slideIndex for cross-referencing
- Write at a senior professional level — authoritative, specific, insightful
- Content should be 3-5x more detailed than the slides themselves
- EVERY section must include at least one structured element (table, bulleted list, or bold-label list). Pure prose sections are not acceptable
- Tables should have clear headers and use | column | format. Include 3-8 rows of data
- Never leave widows or orphans — no single word alone on the last line of any paragraph
- The document should be complete enough that someone who never saw the slides would fully understand the material

Return ONLY the JSON object. No markdown fences, no commentary.`

            const docTimeout = body.model.includes('opus') ? 180000 : 120000
            console.log(`[studio/generate] Reverse-engineer: calling LLM for document (${body.slides!.length} slides, prompt ~${Math.round(slidesPayload.length / 1000)}KB, timeout ${docTimeout / 1000}s)`)
            emit({ hint: `Writing rich document from ${body.slides!.length} slides — this may take a minute...` })
            let docText: string
            try {
              docText = await makeNonStreamingCall(body, body.enrichedSystemPrompt || SYSTEM_PROMPT, docPrompt, 16000, true, docTimeout)
            } catch (err) {
              console.error('[studio/generate] Reverse-engineer document LLM call failed:', err)
              emit({ error: 'Document generation failed. Please try again.' })
              clearInterval(keepalive)
              controller.enqueue(encoder.encode('data: [DONE]\n\n'))
              controller.close()
              return
            }
            let doc: any
            try {
              doc = parseJSONResponse(docText)
            } catch (err) {
              console.error('[studio/generate] Reverse-engineer doc JSON parse failed:', err)
              console.error('[studio/generate] Raw response (first 1000 chars):', docText.slice(0, 1000))
              emit({ error: 'Failed to parse LLM response as JSON' })
              clearInterval(keepalive)
              controller.enqueue(encoder.encode('data: [DONE]\n\n'))
              controller.close()
              return
            }

            if (!doc || !doc.title) {
              emit({ error: 'LLM returned a document without a title field' })
            } else {
              emit({ document: doc })
              emit({ hint: 'Distilling structured outline from document...' })

              // Step 2: Generate outline FROM the document (not from slides)
              try {
                const outlinePrompt = `You have a rich narrative document that was written based on a presentation. Now distill this document into a structured outline — a concise, hierarchical summary that captures the key arguments, structure, and flow.

Document:
${JSON.stringify(doc, null, 1)}

Original presentation had ${body.slides!.length} slides.

Create a structured outline that:
1. Captures the thesis and key argument in one sentence
2. Groups content into 4-8 major sections that reflect the document's logical structure
3. Each section has a clear title, a 1-2 sentence summary, and 2-5 subsections
4. Subsections capture specific points, data, or arguments — not just topic labels
5. Maps sections to the relevant slide indices for cross-referencing

Return a JSON object:
{
  "title": "Outline title",
  "thesis": "One sentence capturing the core argument or purpose of this presentation",
  "sections": [
    {
      "title": "Section heading",
      "summary": "1-2 sentence summary of this section's key point",
      "slideIndices": [0, 1],
      "subsections": [
        { "title": "Subsection heading", "detail": "One sentence capturing the specific point, data, or argument" }
      ]
    }
  ]
}

Guidelines:
- The outline should be scannable in 30 seconds — concise, not verbose
- Use the document's depth and nuance to write better subsection details than slide bullets alone would provide
- Section titles should be descriptive and specific, not generic ("$2.4B Addressable Market" not "Market Size")
- Subsection details should include specific numbers, names, or conclusions where possible

Return ONLY the JSON object. No markdown fences, no commentary.`

                const outlineText = await makeNonStreamingCall(body, body.enrichedSystemPrompt || SYSTEM_PROMPT, outlinePrompt, 6000, true, 60000)
                const outline = parseJSONResponse(outlineText)

                if (outline && outline.title) {
                  emit({ outline })
                }
              } catch (outlineErr) {
                // Outline generation failed but document succeeded — not fatal
                console.error('[studio/generate] Outline generation failed (document OK):', outlineErr)
              }
            }
          } catch (err) {
            console.error('[studio/generate] Reverse-engineer generation failed:', err)
            emit({ error: `Document generation failed: ${err instanceof Error ? err.message : String(err)}` })
          } finally {
            clearInterval(keepalive)
          }
          controller.enqueue(encoder.encode('data: [DONE]\n\n'))
          controller.close()
        },
      })
      return new Response(stream, {
        headers: {
          'Content-Type': 'text/event-stream',
          'Cache-Control': 'no-cache',
          Connection: 'keep-alive',
        },
      })
    }

    // Parallel mode: outline → 3 concurrent batch content calls
    if (body.parallel) {
      console.log('[studio/generate] Using parallel generation mode')
      const stream = createParallelSSEStream(body)
      return new Response(stream, {
        headers: {
          'Content-Type': 'text/event-stream',
          'Cache-Control': 'no-cache',
          Connection: 'keep-alive',
        },
      })
    }

    // Proactive vision pre-processing: if the selected model is known to lack
    // vision support and there are image files, describe them upfront so we
    // don't waste a round-trip getting a 404.
    let visionHint: string | null = null
    const preImageFiles = body.files?.filter(f => f.type === 'image') ?? []
    if (preImageFiles.length > 0 && !modelSupportsVision(body.model)) {
      console.log(`[studio/generate] Model ${body.model} lacks vision — pre-processing ${preImageFiles.length} image(s)`)
      visionHint = buildVisionHint(body.model, body.provider)
      const description = await describeImagesWithVision(preImageFiles, { provider: body.provider, apiKey: body.apiKey, model: body.model })
      if (description) {
        body.prompt = `${body.prompt}\n\n--- Image description (from uploaded file${preImageFiles.length > 1 ? 's' : ''}) ---\n${description}\n--- End of image description ---`
      }
      body.files = body.files?.filter(f => f.type !== 'image')
    }

    let upstreamResponse: Response

    if (body.provider === 'anthropic') {
      const anthropicPayload = buildAnthropicPayload(body)
      console.log('[studio/generate] Anthropic request:', {
        model: anthropicPayload.model,
        max_tokens: anthropicPayload.max_tokens,
        thinking: anthropicPayload.thinking ?? 'disabled',
        contentTypes: anthropicPayload.messages[0].content.map((c: any) => c.type),
      })
      const anthropicHeaders: Record<string, string> = {
        'Content-Type': 'application/json',
        'x-api-key': body.apiKey,
        'anthropic-version': '2023-06-01',
      }
      // Extended thinking requires a beta header
      if (anthropicPayload.thinking) {
        anthropicHeaders['anthropic-beta'] = 'interleaved-thinking-2025-05-14'
      }
      upstreamResponse = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: anthropicHeaders,
        body: JSON.stringify(anthropicPayload),
      })
    } else if (body.provider === 'google') {
      // Google Gemini API (OpenAI-compatible streaming endpoint)
      upstreamResponse = await fetch('https://generativelanguage.googleapis.com/v1beta/openai/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${body.apiKey}`,
        },
        body: JSON.stringify(buildOpenRouterPayload(body)),
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

      // If the model doesn't support image input, describe images via a
      // vision-capable model and retry with text descriptions instead
      const imageFiles = body.files?.filter(f => f.type === 'image') ?? []
      const isImageError = detail.toLowerCase().includes('image input') || detail.toLowerCase().includes('image_url')
      if (imageFiles.length > 0 && isImageError) {
        console.log('[studio/generate] Model does not support images — describing via vision model and retrying')
        const description = await describeImagesWithVision(imageFiles, { provider: body.provider, apiKey: body.apiKey, model: body.model })

        // Build a new body: strip image files, inject description into prompt
        const retryBody: GenerateBody = {
          ...body,
          files: body.files?.filter(f => f.type !== 'image'),
          prompt: description
            ? `${body.prompt}\n\n--- Image description (from uploaded file${imageFiles.length > 1 ? 's' : ''}) ---\n${description}\n--- End of image description ---`
            : body.prompt,
        }

        let retryPayload: any
        let retryUrl: string
        const retryHeaders: Record<string, string> = { 'Content-Type': 'application/json' }

        if (body.provider === 'anthropic') {
          retryPayload = buildAnthropicPayload(retryBody)
          retryUrl = 'https://api.anthropic.com/v1/messages'
          retryHeaders['x-api-key'] = body.apiKey
          retryHeaders['anthropic-version'] = '2023-06-01'
          if (retryPayload.thinking) retryHeaders['anthropic-beta'] = 'interleaved-thinking-2025-05-14'
        } else if (body.provider === 'google') {
          retryPayload = buildOpenRouterPayload(retryBody)
          retryUrl = 'https://generativelanguage.googleapis.com/v1beta/openai/chat/completions'
          retryHeaders['Authorization'] = `Bearer ${body.apiKey}`
        } else {
          retryPayload = buildOpenRouterPayload(retryBody)
          retryUrl = 'https://openrouter.ai/api/v1/chat/completions'
          retryHeaders['Authorization'] = `Bearer ${body.apiKey}`
          retryHeaders['HTTP-Referer'] = 'https://felix.pago'
        }

        const retryResponse = await fetch(retryUrl, {
          method: 'POST',
          headers: retryHeaders,
          body: JSON.stringify(retryPayload),
        })

        if (retryResponse.ok) {
          const hint = buildVisionHint(body.model, body.provider)
          const retryStream = prependHintToStream(
            createSSEStream(retryResponse, body.provider),
            hint,
          )
          return new Response(retryStream, {
            headers: {
              'Content-Type': 'text/event-stream',
              'Cache-Control': 'no-cache',
              Connection: 'keep-alive',
            },
          })
        }
        // Retry also failed — fall through to original error
      }

      return new Response(
        JSON.stringify({ error: 'Generation failed. Please check your API key and try again.' }),
        { status: upstreamResponse.status, headers: { 'Content-Type': 'application/json' } },
      )
    }

    let stream: ReadableStream<Uint8Array> = createSSEStream(upstreamResponse, body.provider)
    if (visionHint) {
      stream = prependHintToStream(stream, visionHint)
    }

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
