// ---------------------------------------------------------------------------
// Felix Studio – Quality Scoring, User Style Profiling & Exemplar System
// ---------------------------------------------------------------------------

import { Redis } from '@upstash/redis'
import {
  getEditEvents,
  getViewerStats,
  getViewerSessions,
  type EditEvent,
  qualityKey,
  trainingKey,
  profileKey,
  slideScoresKey,
  patternsKey,
  exemplarsKey,
} from './studio-analytics'
import { detectIntent } from './prompt-strengthener'

const redis = Redis.fromEnv()

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface QualityScore {
  presId: string
  userId: string
  score: number // 0-100
  editRatio: number
  rebuildCount: number
  shareSignal: number // 0 or 1
  viewerCompletion: number // 0-1
  abandonment: number // 0 or 1
  computedAt: number
}

export interface UserStyleProfile {
  userId: string
  preferredSlideCount: { min: number; max: number; avg: number }
  bgDistribution: { dark: number; light: number; brand: number } // percentages 0-100
  neverUsedTypes: string[]
  frequentlyEditedFields: string[]
  preferredCardCount: number
  preferredBulletCount: number
  illustrationPreference: 'high' | 'medium' | 'low'
  toneSignal: 'concise' | 'detailed' | 'mixed'
  updatedAt: number
  sampleSize: number
}

export interface SlideEffectiveness {
  presId: string
  slideIndex: number
  score: number // 0-100
  editDistance: number
  viewerDwellAvg: number
  skipRate: number
  wasDeleted: boolean
  slideType: string
  bg: string
}

export interface Exemplar {
  slide: any // SlideData (using any to avoid circular import)
  intentType: string
  slideType: string
  position: 'opening' | 'middle' | 'closing'
  effectiveness: number
  sourcePresId: string
}

// ---------------------------------------------------------------------------
// 1. Compute Quality Score
// ---------------------------------------------------------------------------

export async function computeQualityScore(
  presId: string
): Promise<QualityScore | null> {
  const raw = await redis.get<string>(`studio:pres:${presId}`)
  if (!raw) return null

  const pres = typeof raw === 'string' ? JSON.parse(raw) : raw
  const slides: any[] = pres.slides ?? []
  const userId: string = pres.userId
  const shareToken: string | undefined = pres.shareToken
  const createdAt: number = pres.createdAt ?? 0

  const events = await getEditEvents(presId)

  let fieldEditCount = 0
  let rebuildCount = 0
  for (const ev of events) {
    if (ev.action === 'field_edit') fieldEditCount++
    if (ev.action === 'full_rebuild' || ev.action === 'slide_rebuild') rebuildCount++
  }

  const slideCount = Math.max(slides.length, 1)
  const editRatio = fieldEditCount / slideCount
  const shareSignal = shareToken ? 1 : 0

  let viewerCompletion = 0
  if (shareToken) {
    const sessions = await getViewerSessions(shareToken)
    if (sessions.length > 0) {
      const totalCompletion = sessions.reduce((sum, s) => {
        return sum + (s.completed ? 1 : s.slidesViewed / Math.max(s.totalSlides, 1))
      }, 0)
      viewerCompletion = totalCompletion / sessions.length
    }
  }

  const now = Date.now()
  const abandonment =
    fieldEditCount === 0 && !shareToken && now - createdAt > 86400_000 ? 1 : 0

  const score = Math.max(
    0,
    Math.min(
      100,
      100 -
        editRatio * 15 -
        rebuildCount * 10 +
        shareSignal * 15 +
        viewerCompletion * 20 -
        abandonment * 25
    )
  )

  const result: QualityScore = {
    presId,
    userId,
    score,
    editRatio,
    rebuildCount,
    shareSignal,
    viewerCompletion,
    abandonment,
    computedAt: now,
  }

  await redis.hset(qualityKey(presId), result as any)
  await redis.zadd(trainingKey(userId), { score, member: presId })

  return result
}

// ---------------------------------------------------------------------------
// 2. Compute User Style Profile
// ---------------------------------------------------------------------------

export async function computeUserStyleProfile(
  userId: string
): Promise<UserStyleProfile> {
  const presIds = await redis.zrange<string[]>(
    `studio:user:pres:${userId}`,
    0,
    19,
    { rev: true }
  )

  const slideCounts: number[] = []
  const bgCounts = { dark: 0, light: 0, brand: 0 }
  let totalSlides = 0
  const typeDeleteMap: Record<string, { deleted: number; appeared: number }> =
    {}
  const fieldFreq: Record<string, number> = {}
  let cardTotal = 0
  let cardSlideCount = 0
  let bulletTotal = 0
  let bulletSlideCount = 0
  let slidesWithImage = 0
  let allSlideCount = 0
  let shortenCount = 0
  let lengthenCount = 0

  for (const presId of presIds) {
    const raw = await redis.get<string>(`studio:pres:${presId}`)
    if (!raw) continue

    const pres = typeof raw === 'string' ? JSON.parse(raw) : raw
    const slides: any[] = pres.slides ?? []
    const events = await getEditEvents(presId)

    slideCounts.push(slides.length)

    for (const slide of slides) {
      totalSlides++
      allSlideCount++

      const bg = (slide.bg ?? '').toLowerCase()
      if (bg.includes('dark') || bg === '#000' || bg === '#000000' || bg === 'black') {
        bgCounts.dark++
      } else if (bg.includes('brand') || bg.includes('primary') || bg.includes('accent')) {
        bgCounts.brand++
      } else {
        bgCounts.light++
      }

      if (slide.type === 'cards' && Array.isArray(slide.cards)) {
        cardTotal += slide.cards.length
        cardSlideCount++
      }
      if (Array.isArray(slide.bullets)) {
        bulletTotal += slide.bullets.length
        bulletSlideCount++
      }
      if (slide.imageUrl) {
        slidesWithImage++
      }
    }

    // Track deleted types and field edits from events
    // EditEvent has: action, slideIndex, fields?: FieldDiff[] (each with field, before, after)
    for (const ev of events) {
      if (ev.action === 'slide_delete') {
        // Look up the slide type from the original slides at that index
        const deletedSlide = slides[ev.slideIndex]
        if (deletedSlide?.type) {
          if (!typeDeleteMap[deletedSlide.type]) typeDeleteMap[deletedSlide.type] = { deleted: 0, appeared: 0 }
          typeDeleteMap[deletedSlide.type].deleted++
          typeDeleteMap[deletedSlide.type].appeared++
        }
      }
      if (ev.action === 'field_edit' && ev.fields) {
        for (const diff of ev.fields) {
          fieldFreq[diff.field] = (fieldFreq[diff.field] ?? 0) + 1
          // Tone analysis: check if text edits shorten or lengthen
          if (diff.field === 'title' || diff.field === 'body' || diff.field === 'subtitle') {
            const oldLen = diff.before?.length ?? 0
            const newLen = diff.after?.length ?? 0
            if (newLen < oldLen) shortenCount++
            else if (newLen > oldLen) lengthenCount++
          }
        }
      }
    }

    // Track all slide types that appeared in final presentations
    for (const slide of slides) {
      if (slide.type) {
        if (!typeDeleteMap[slide.type]) typeDeleteMap[slide.type] = { deleted: 0, appeared: 0 }
        typeDeleteMap[slide.type].appeared++
      }
    }
  }

  const sampleSize = presIds.length

  const min = slideCounts.length > 0 ? Math.min(...slideCounts) : 0
  const max = slideCounts.length > 0 ? Math.max(...slideCounts) : 0
  const avg =
    slideCounts.length > 0
      ? Math.round(slideCounts.reduce((a, b) => a + b, 0) / slideCounts.length)
      : 0

  const total = totalSlides || 1
  const bgDistribution = {
    dark: Math.round((bgCounts.dark / total) * 100),
    light: Math.round((bgCounts.light / total) * 100),
    brand: Math.round((bgCounts.brand / total) * 100),
  }

  const neverUsedTypes = Object.entries(typeDeleteMap)
    .filter(([, v]) => v.appeared > 0 && v.deleted / v.appeared > 0.8)
    .map(([t]) => t)

  const frequentlyEditedFields = Object.entries(fieldFreq)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([f]) => f)

  const preferredCardCount =
    cardSlideCount > 0 ? Math.round(cardTotal / cardSlideCount) : 3
  const preferredBulletCount =
    bulletSlideCount > 0 ? Math.round(bulletTotal / bulletSlideCount) : 4

  const imagePercent =
    allSlideCount > 0 ? (slidesWithImage / allSlideCount) * 100 : 0
  const illustrationPreference: 'high' | 'medium' | 'low' =
    imagePercent > 40 ? 'high' : imagePercent > 20 ? 'medium' : 'low'

  let toneSignal: 'concise' | 'detailed' | 'mixed' = 'mixed'
  const toneTotal = shortenCount + lengthenCount
  if (toneTotal > 0) {
    const shortenRatio = shortenCount / toneTotal
    if (shortenRatio > 0.6) toneSignal = 'concise'
    else if (shortenRatio < 0.4) toneSignal = 'detailed'
  }

  const profile: UserStyleProfile = {
    userId,
    preferredSlideCount: { min, max, avg },
    bgDistribution,
    neverUsedTypes,
    frequentlyEditedFields,
    preferredCardCount,
    preferredBulletCount,
    illustrationPreference,
    toneSignal,
    updatedAt: Date.now(),
    sampleSize,
  }

  await redis.set(profileKey(userId), JSON.stringify(profile))

  return profile
}

// ---------------------------------------------------------------------------
// 3. Compute Slide Effectiveness
// ---------------------------------------------------------------------------

export async function computeSlideEffectiveness(
  presId: string
): Promise<SlideEffectiveness[]> {
  const raw = await redis.get<string>(`studio:pres:${presId}`)
  if (!raw) return []

  const pres = typeof raw === 'string' ? JSON.parse(raw) : raw
  const slides: any[] = pres.slides ?? []
  const events = await getEditEvents(presId)

  let viewerStatsMap: Record<number, { dwellAvg: number; skipRate: number }> = {}
  if (pres.shareToken) {
    const stats = await getViewerStats(pres.shareToken)
    // stats format: { slideIndex: { totalDwell, viewCount } }
    const sessions = await getViewerSessions(pres.shareToken)
    const totalSessions = Math.max(sessions.length, 1)
    for (const [idx, val] of Object.entries(stats)) {
      const i = parseInt(idx, 10)
      if (isNaN(i)) continue
      viewerStatsMap[i] = {
        dwellAvg: val.viewCount > 0 ? val.totalDwell / val.viewCount : 0,
        skipRate: 1 - (val.viewCount / totalSessions), // fraction of sessions that didn't view this slide
      }
    }
  }

  const results: SlideEffectiveness[] = []

  for (let i = 0; i < slides.length; i++) {
    const slide = slides[i]
    const slideType = slide.type ?? 'unknown'
    const bg = slide.bg ?? 'light'

    const editDistance = events.filter(
      (e) => e.action === 'field_edit' && e.slideIndex === i
    ).length

    const wasDeleted = events.some(
      (e) => e.action === 'slide_delete' && e.slideIndex === i
    )

    const viewerData = viewerStatsMap[i]
    const viewerDwellAvg = viewerData?.dwellAvg ?? 0
    const skipRate = viewerData?.skipRate ?? 0

    const normalizedDwell = Math.min(1, viewerDwellAvg / 10000)
    const score = Math.max(
      0,
      Math.min(
        100,
        80 -
          editDistance * 12 +
          normalizedDwell * 15 -
          skipRate * 25 -
          (wasDeleted ? 40 : 0)
      )
    )

    const eff: SlideEffectiveness = {
      presId,
      slideIndex: i,
      score,
      editDistance,
      viewerDwellAvg,
      skipRate,
      wasDeleted,
      slideType,
      bg,
    }

    results.push(eff)

    await redis.hset(slideScoresKey(presId), { [i]: JSON.stringify(eff) })
    await redis.zadd(patternsKey(slideType, bg), {
      score,
      member: `${presId}:${i}`,
    })
  }

  return results
}

// ---------------------------------------------------------------------------
// 4. Promote Exemplars
// ---------------------------------------------------------------------------

export async function promoteExemplars(presId: string): Promise<void> {
  const qualityRaw = await redis.hgetall<Record<string, any>>(
    qualityKey(presId)
  )
  if (!qualityRaw || !qualityRaw.score) return

  const qualityScore =
    typeof qualityRaw.score === 'string'
      ? parseFloat(qualityRaw.score)
      : qualityRaw.score
  if (qualityScore < 75) return

  const raw = await redis.get<string>(`studio:pres:${presId}`)
  if (!raw) return

  const pres = typeof raw === 'string' ? JSON.parse(raw) : raw
  const slides: any[] = pres.slides ?? []
  const prompt: string = pres.prompt ?? ''

  const intentType = detectIntent(prompt)

  const effectivenessScores = await computeSlideEffectiveness(presId)

  for (const eff of effectivenessScores) {
    if (eff.score < 70) continue

    const slide = slides[eff.slideIndex]
    if (!slide) continue

    const position: 'opening' | 'middle' | 'closing' =
      eff.slideIndex === 0
        ? 'opening'
        : eff.slideIndex === slides.length - 1
          ? 'closing'
          : 'middle'

    const exemplar: Exemplar = {
      slide,
      intentType,
      slideType: eff.slideType,
      position,
      effectiveness: eff.score,
      sourcePresId: presId,
    }

    const key = exemplarsKey(intentType)
    await redis.zadd(key, {
      score: eff.score,
      member: JSON.stringify(exemplar),
    })

    // Cap at 50 exemplars per intent type
    await redis.zremrangebyrank(key, 0, -(50 + 1))
  }
}

// ---------------------------------------------------------------------------
// 5. Select Exemplars
// ---------------------------------------------------------------------------

export async function selectExemplars(
  intentType: string,
  count: number
): Promise<Exemplar[]> {
  const members = await redis.zrange<string[]>(
    exemplarsKey(intentType),
    0,
    count - 1,
    { rev: true }
  )

  return members.map((m) =>
    typeof m === 'string' ? JSON.parse(m) : m
  ) as Exemplar[]
}

// ---------------------------------------------------------------------------
// 6. Format Profile for Prompt
// ---------------------------------------------------------------------------

export function formatProfileForPrompt(profile: UserStyleProfile): string {
  const lines: string[] = []
  lines.push(
    `## Creator Preferences (learned from ${profile.sampleSize} presentations)`
  )

  lines.push(
    `- Preferred slide count: ${profile.preferredSlideCount.min}-${profile.preferredSlideCount.max} slides (avg ${profile.preferredSlideCount.avg})`
  )

  lines.push(
    `- Background preference: ${profile.bgDistribution.dark}% dark, ${profile.bgDistribution.light}% light, ${profile.bgDistribution.brand}% brand`
  )

  if (profile.neverUsedTypes.length > 0) {
    lines.push(
      `- Avoid these slide types: ${profile.neverUsedTypes.join(', ')}`
    )
  }

  if (profile.frequentlyEditedFields.length > 0) {
    lines.push(
      `- Frequently customized fields: ${profile.frequentlyEditedFields.join(', ')}`
    )
  }

  lines.push(`- Preferred bullets per slide: ${profile.preferredBulletCount}`)
  lines.push(`- Preferred cards per slide: ${profile.preferredCardCount}`)
  lines.push(`- Illustration density: ${profile.illustrationPreference}`)
  lines.push(`- Content density: ${profile.toneSignal}`)

  return lines.join('\n')
}

// ---------------------------------------------------------------------------
// 7. Format Exemplars for Prompt
// ---------------------------------------------------------------------------

export function formatExemplarsForPrompt(exemplars: Exemplar[]): string {
  if (exemplars.length === 0) return ''

  const lines: string[] = []
  lines.push('## High-Performing Slide Examples')
  lines.push(
    'These slides scored highly with viewers and presenters. Use them as style references:'
  )
  lines.push('')

  const limited = exemplars.slice(0, 3)

  for (let i = 0; i < limited.length; i++) {
    const ex = limited[i]
    const slide = ex.slide ?? {}

    // Truncate slide to key fields only
    const truncated: Record<string, any> = {}
    if (slide.type) truncated.type = slide.type
    if (slide.bg) truncated.bg = slide.bg
    if (slide.title) truncated.title = slide.title
    if (slide.subtitle) truncated.subtitle = slide.subtitle
    if (slide.body) truncated.body = slide.body
    if (Array.isArray(slide.bullets)) {
      truncated.bullets = slide.bullets.slice(0, 3)
    }
    if (Array.isArray(slide.cards)) {
      truncated.cards = slide.cards.slice(0, 3)
    }

    lines.push(
      `### Example ${i + 1} (type: "${ex.slideType}", bg: "${slide.bg ?? 'unknown'}", score: ${ex.effectiveness})`
    )
    lines.push('```json')
    lines.push(JSON.stringify(truncated, null, 2))
    lines.push('```')
    lines.push('')
  }

  return lines.join('\n')
}
