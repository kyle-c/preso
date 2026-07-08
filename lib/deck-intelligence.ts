import {
  classifyDeckType,
  type DeckTypeId,
  type DeckTypePlaybook,
} from './deck-taxonomy'
import type { SlideData } from './slide-types'

export type EvidenceMode = 'strict' | 'grounded' | 'light'

export interface DeckBriefInput {
  prompt: string
  documentType?: string
  files?: { type: string; name: string; data?: string }[]
  templateSlideCount?: number
}

export interface DeckBrief {
  prompt: string
  documentType: string
  deckTypeId: DeckTypeId
  deckTypeLabel: string
  deckTypeScore: number
  audience: string
  purpose: string
  evidenceMode: EvidenceMode
  targetSlideCount: { min: number; max: number; requested?: number }
  sourceSummary: string[]
  planningContract: string[]
  requiredMoves: string[]
  preferredSlidePatterns: string[]
  evidenceRules: string[]
  avoid: string[]
  rubric: DeckRubricDimension[]
}

export interface DeckRubricDimension {
  id: string
  label: string
  weight: number
  checks: string[]
}

export interface DeckFinding {
  severity: 'error' | 'warning' | 'info'
  dimension: string
  message: string
  fix: string
}

export interface DeckEvaluation {
  deckTypeId: DeckTypeId
  deckTypeLabel: string
  score: number
  findings: DeckFinding[]
  passed: boolean
}

const STRICT_EVIDENCE_DECKS = new Set<DeckTypeId>([
  'consulting-analysis',
  'business-review',
  'board-investor-update',
  'fundraising-pitch',
  'data-readout',
  'competitive-landscape',
])

const LIGHT_EVIDENCE_DECKS = new Set<DeckTypeId>([
  'onboarding',
  'product-pitch',
])

const PURPOSE_BY_TYPE: Record<DeckTypeId, string> = {
  'consulting-analysis': 'recommend a decision using an explicit analytical argument',
  'executive-strategy': 'align leaders on choices, trade-offs, resourcing, and next decisions',
  'product-roadmap': 'explain sequencing, dependencies, and measurable product outcomes',
  'prd-feature-spec': 'turn a product problem into buildable, testable requirements',
  'product-pitch': 'make a product opportunity feel urgent, differentiated, and buildable',
  'business-review': 'explain performance, drivers, risks, and the next operating plan',
  'board-investor-update': 'give investors a candid view of progress, risks, and decisions',
  'fundraising-pitch': 'earn belief in the opportunity, traction, team, and use of funds',
  'gtm-launch': 'coordinate audience, positioning, channels, rollout, and success metrics',
  'ux-research': 'turn research evidence into memorable findings and prioritized action',
  'data-readout': 'answer an analytical question with data, caveats, and recommendations',
  'competitive-landscape': 'clarify competitors, choice criteria, gaps, and positioning',
  'technical-architecture': 'make system direction, interfaces, constraints, and migration legible',
  'operating-plan': 'translate strategy into measurable priorities and accountability',
  onboarding: 'orient a new teammate with context, role expectations, and first steps',
}

const RUBRIC_BASE: DeckRubricDimension[] = [
  {
    id: 'type-fit',
    label: 'Deck-type fit',
    weight: 25,
    checks: [
      'Uses the narrative arc expected for this deck family.',
      'Includes the required moves for the detected deck type.',
      'Avoids generic business-presentation structure.',
    ],
  },
  {
    id: 'evidence',
    label: 'Evidence and provenance',
    weight: 25,
    checks: [
      'Distinguishes facts, assumptions, and recommendations.',
      'Labels numeric or external claims with source, assumption, or user-provided context.',
      'Uses uploaded files or data as the source of truth when present.',
    ],
  },
  {
    id: 'specificity',
    label: 'Specificity',
    weight: 20,
    checks: [
      'Names the customer, business decision, metric, owner, or trade-off where relevant.',
      'Avoids broad filler such as seamless, empower, unlock, reimagine, and future-ready.',
      'Turns claims into concrete operating consequences.',
    ],
  },
  {
    id: 'slide-craft',
    label: 'Slide craft',
    weight: 15,
    checks: [
      'Uses action titles that state the takeaway.',
      'Varies slide patterns and avoids dense text.',
      'Uses charts when data drives the story.',
    ],
  },
  {
    id: 'executive-readiness',
    label: 'Executive readiness',
    weight: 15,
    checks: [
      'Makes the decision or ask clear.',
      'Shows trade-offs and risks.',
      'Ends with owners, next steps, or decision path.',
    ],
  },
]

const TYPE_SPECIFIC_RUBRICS: Partial<Record<DeckTypeId, DeckRubricDimension[]>> = {
  'product-roadmap': [
    {
      id: 'roadmap-logic',
      label: 'Roadmap sequencing',
      weight: 20,
      checks: ['Shows now/next/later or quarter sequencing.', 'Names dependencies, trade-offs, and success metrics.'],
    },
  ],
  'ux-research': [
    {
      id: 'research-integrity',
      label: 'Research integrity',
      weight: 20,
      checks: ['Includes method, sample, evidence, findings, confidence, and recommendations.'],
    },
  ],
  'business-review': [
    {
      id: 'performance-logic',
      label: 'Performance logic',
      weight: 20,
      checks: ['Shows targets vs actuals, drivers, misses, risks, and next-period actions.'],
    },
  ],
  'data-readout': [
    {
      id: 'analysis-integrity',
      label: 'Analysis integrity',
      weight: 20,
      checks: ['States the question, data source, time period, result, caveat, and decision.'],
    },
  ],
  'consulting-analysis': [
    {
      id: 'consulting-logic',
      label: 'Analytical logic',
      weight: 20,
      checks: ['Leads with the recommendation, uses issue-tree logic, compares options, and shows sensitivities.'],
    },
  ],
}

const GENERIC_LANGUAGE = /\b(seamless|empower|empowering|unlock|unlocked|reimagin(?:e|ed|ing)|future-ready|transformative|game-changing|world-class|innovative)\b/i
const NUMERIC_CLAIM = /(?:\b\d+(?:\.\d+)?%|\$[\d,.]+[mkbtMKBT]?|\b\d+(?:\.\d+)?x\b|\b\d{2,}\b)/
const SOURCE_LABEL = /\b(source|according to|user-provided|assumption|assume|estimate|directional|uploaded|attached|from the data|internal data|survey|interview|cohort|benchmark)\b/i
const ACTION_TITLE = /\b(increase|reduce|grow|decline|shift|creates?|drives?|requires?|enables?|wins?|loses?|depends?|outperforms?|underperforms?|should|must|can|will|because|if)\b/i

function parseIdealSlideCount(playbook: DeckTypePlaybook): { min: number; max: number } {
  const match = playbook.idealSlideCount.match(/(\d+)\D+(\d+)/)
  if (!match) return { min: 10, max: 16 }
  return { min: Number(match[1]), max: Number(match[2]) }
}

function requestedSlideCount(prompt: string, templateSlideCount?: number): number | undefined {
  if (templateSlideCount) return templateSlideCount
  const match = prompt.match(/\b(\d{1,3})\s*(?:slide|slides)\b/i)
  if (!match) return undefined
  return Number(match[1])
}

function inferEvidenceMode(deckTypeId: DeckTypeId, files: DeckBriefInput['files']): EvidenceMode {
  if (STRICT_EVIDENCE_DECKS.has(deckTypeId)) return 'strict'
  if ((files ?? []).some((file) => file.type === 'data' || file.type === 'pdf')) return 'grounded'
  if (LIGHT_EVIDENCE_DECKS.has(deckTypeId)) return 'light'
  return 'grounded'
}

function summarizeSources(files: DeckBriefInput['files']): string[] {
  if (!files || files.length === 0) return ['No uploaded source files. Treat unsupported external claims as assumptions.']
  return files.map((file) => {
    const size = typeof file.data === 'string' ? `${Math.round(file.data.length / 1000)}k chars` : 'attached'
    return `${file.name} (${file.type}, ${size})`
  })
}

function buildPlanningContract(playbook: DeckTypePlaybook, evidenceMode: EvidenceMode): string[] {
  const contract = [
    `Use the ${playbook.label} playbook, not a generic business deck.`,
    `Open with the audience's needed takeaway, decision, or job to be done.`,
    `Follow this arc: ${playbook.narrativeArc.join(' -> ')}.`,
    'Use action titles that state the conclusion of each slide.',
  ]

  if (evidenceMode === 'strict') {
    contract.push('Strict evidence mode: label numeric, market, financial, competitor, or performance claims as source-backed, user-provided, or assumption.')
  } else if (evidenceMode === 'grounded') {
    contract.push('Grounded evidence mode: prefer uploaded/user-provided data and label assumptions when details are missing.')
  } else {
    contract.push('Light evidence mode: keep claims plausible and avoid fake personalization or invented personal facts.')
  }

  return contract
}

export function buildDeckBrief(input: DeckBriefInput): DeckBrief {
  const match = classifyDeckType(input.prompt)
  const playbook = match.playbook
  const requested = requestedSlideCount(input.prompt, input.templateSlideCount)
  const ideal = parseIdealSlideCount(playbook)
  const evidenceMode = inferEvidenceMode(playbook.id, input.files)

  return {
    prompt: input.prompt,
    documentType: input.documentType ?? 'general',
    deckTypeId: playbook.id,
    deckTypeLabel: playbook.label,
    deckTypeScore: match.score,
    audience: playbook.audience,
    purpose: PURPOSE_BY_TYPE[playbook.id],
    evidenceMode,
    targetSlideCount: { ...ideal, requested },
    sourceSummary: summarizeSources(input.files),
    planningContract: buildPlanningContract(playbook, evidenceMode),
    requiredMoves: playbook.requiredMoves,
    preferredSlidePatterns: playbook.preferredSlidePatterns,
    evidenceRules: playbook.evidenceRules,
    avoid: playbook.avoid,
    rubric: [...RUBRIC_BASE, ...(TYPE_SPECIFIC_RUBRICS[playbook.id] ?? [])],
  }
}

function list(items: string[]): string {
  return items.map((item) => `- ${item}`).join('\n')
}

export function formatDeckBriefForPrompt(brief: DeckBrief): string {
  if (brief.deckTypeScore === 0) return ''

  const requested = brief.targetSlideCount.requested
    ? `${brief.targetSlideCount.requested} requested`
    : `${brief.targetSlideCount.min}-${brief.targetSlideCount.max} recommended`

  return `\n\n--- DECK INTELLIGENCE CONTRACT ---
Deck family: ${brief.deckTypeLabel}
Document intent: ${brief.documentType}
Audience: ${brief.audience}
Purpose: ${brief.purpose}
Target length: ${requested}
Evidence mode: ${brief.evidenceMode}

Planning contract:
${list(brief.planningContract)}

Required narrative moves:
${list(brief.requiredMoves)}

Preferred slide patterns:
${list(brief.preferredSlidePatterns)}

Evidence rules:
${list(brief.evidenceRules)}

Avoid:
${list(brief.avoid)}`
}

export function formatDeckBriefForOutline(brief: DeckBrief): string {
  if (brief.deckTypeScore === 0) return ''

  const target = brief.targetSlideCount.requested
    ? `exactly ${brief.targetSlideCount.requested} slides unless the source files clearly require otherwise`
    : `${brief.targetSlideCount.min}-${brief.targetSlideCount.max} slides`

  return `\n\nDECK INTELLIGENCE FOR OUTLINE:
- Deck family: ${brief.deckTypeLabel}
- Audience: ${brief.audience}
- Purpose: ${brief.purpose}
- Target: ${target}
- Arc: ${brief.requiredMoves.map((move, index) => `${index + 1}. ${move}`).join(' ')}
- Evidence mode: ${brief.evidenceMode}; include source/assumption/provenance slides where needed.
- Use these slide patterns when appropriate: ${brief.preferredSlidePatterns.slice(0, 8).join(', ')}.
- Avoid: ${brief.avoid.join('; ')}.`
}

export function formatDeckBriefForContent(brief: DeckBrief): string {
  if (brief.deckTypeScore === 0) return ''

  return `\n\nDECK INTELLIGENCE FOR CONTENT:
- Deck family: ${brief.deckTypeLabel}; every slide should serve this deck type.
- Purpose: ${brief.purpose}.
- Evidence mode: ${brief.evidenceMode}. ${brief.evidenceRules.join(' ')}
- Required moves to satisfy across the deck: ${brief.requiredMoves.join(' ')}
- Preferred patterns: ${brief.preferredSlidePatterns.join(', ')}.
- Do not use these anti-patterns: ${brief.avoid.join('; ')}.
- Speaker notes should capture provenance, assumptions, and reasoning, not repeat the slide.`
}

function slideText(slide: SlideData): string {
  const parts: string[] = [
    slide.title,
    slide.subtitle,
    slide.body,
    slide.badge,
    slide.notes,
  ].filter(Boolean) as string[]

  for (const bullet of slide.bullets ?? []) parts.push(bullet.text)
  for (const card of slide.cards ?? []) parts.push(card.title, card.body ?? '')
  for (const column of slide.columns ?? []) {
    parts.push(column.heading ?? '', column.title ?? '', column.body ?? '')
    for (const bullet of column.bullets ?? []) parts.push(bullet.text)
  }
  if (slide.quote?.text) parts.push(slide.quote.text)
  if (slide.quote?.author) parts.push(slide.quote.author)

  return parts.join(' ').replace(/\s+/g, ' ').trim()
}

function addFinding(findings: DeckFinding[], finding: DeckFinding): void {
  if (!findings.some((item) => item.dimension === finding.dimension && item.message === finding.message)) {
    findings.push(finding)
  }
}

function hasAny(text: string, terms: string[]): boolean {
  const lower = text.toLowerCase()
  return terms.some((term) => lower.includes(term))
}

function evaluateTypeSpecific(slides: SlideData[], allText: string, brief: DeckBrief, findings: DeckFinding[]): void {
  const hasChart = slides.some((slide) => slide.type === 'chart' || !!slide.chart)

  if (brief.deckTypeId === 'product-roadmap') {
    if (!hasAny(allText, ['now', 'next', 'later', 'q1', 'q2', 'q3', 'q4', 'quarter', 'timeline'])) {
      addFinding(findings, {
        severity: 'error',
        dimension: 'roadmap-logic',
        message: 'Roadmap deck does not clearly show sequencing.',
        fix: 'Add a now/next/later, quarterly roadmap, or milestone timeline slide.',
      })
    }
    if (!hasAny(allText, ['dependency', 'trade-off', 'tradeoff', 'risk', 'capacity', 'sequence'])) {
      addFinding(findings, {
        severity: 'warning',
        dimension: 'roadmap-logic',
        message: 'Roadmap does not make dependencies or trade-offs explicit.',
        fix: 'Add a dependency/trade-off slide that explains why this order is correct.',
      })
    }
  }

  if (brief.deckTypeId === 'ux-research') {
    if (!hasAny(allText, ['method', 'sample', 'participant', 'interview', 'survey', 'quote'])) {
      addFinding(findings, {
        severity: 'error',
        dimension: 'research-integrity',
        message: 'Research deck is missing method, sample, or user evidence.',
        fix: 'Add methodology, participant profile, evidence, and limitations before recommendations.',
      })
    }
  }

  if (brief.deckTypeId === 'business-review') {
    if (!hasAny(allText, ['target', 'actual', 'variance', 'driver', 'miss', 'risk'])) {
      addFinding(findings, {
        severity: 'error',
        dimension: 'performance-logic',
        message: 'Business review does not clearly show performance drivers.',
        fix: 'Add goals vs actuals, variance, drivers, wins, misses, risks, and next-period actions.',
      })
    }
    if (!hasChart) {
      addFinding(findings, {
        severity: 'warning',
        dimension: 'performance-logic',
        message: 'Metric-heavy business review has no chart slide.',
        fix: 'Use chart slides for KPI movement, funnel, cohort, or variance analysis.',
      })
    }
  }

  if (brief.deckTypeId === 'data-readout') {
    if (!hasAny(allText, ['sample', 'cohort', 'period', 'confidence', 'caveat', 'statistical', 'source'])) {
      addFinding(findings, {
        severity: 'error',
        dimension: 'analysis-integrity',
        message: 'Data readout is missing data-quality or caveat language.',
        fix: 'State data source, sample, time period, caveats, result, and decision.',
      })
    }
    if (!hasChart) {
      addFinding(findings, {
        severity: 'error',
        dimension: 'analysis-integrity',
        message: 'Data readout has no chart or structured data visualization.',
        fix: 'Add charts for the primary metric movement and segment/cohort comparison.',
      })
    }
  }

  if (brief.deckTypeId === 'consulting-analysis') {
    if (!hasAny(allText, ['recommend', 'option', 'trade-off', 'sensitivity', 'scenario', 'implication'])) {
      addFinding(findings, {
        severity: 'error',
        dimension: 'consulting-logic',
        message: 'Consulting-style deck lacks explicit recommendation logic.',
        fix: 'Lead with recommendation, issue-tree logic, option comparison, sensitivity, and implications.',
      })
    }
  }
}

export function evaluateDeckAgainstBrief(slides: SlideData[], brief: DeckBrief): DeckEvaluation {
  const findings: DeckFinding[] = []
  const usableSlides = slides.filter((slide) => slide && slide.title)
  const allText = usableSlides.map(slideText).join(' ').replace(/\s+/g, ' ')

  if (usableSlides.length < Math.max(6, brief.targetSlideCount.min - 2)) {
    addFinding(findings, {
      severity: 'warning',
      dimension: 'type-fit',
      message: `Deck has ${usableSlides.length} slides, below the expected range for ${brief.deckTypeLabel}.`,
      fix: `Use roughly ${brief.targetSlideCount.min}-${brief.targetSlideCount.max} slides unless the user requested otherwise.`,
    })
  }

  const titleCount = usableSlides.length || 1
  const actionTitleCount = usableSlides.filter((slide) => ACTION_TITLE.test(slide.title)).length
  if (actionTitleCount / titleCount < 0.35 && usableSlides.length >= 6) {
    addFinding(findings, {
      severity: 'warning',
      dimension: 'slide-craft',
      message: 'Too many titles are topic labels instead of takeaways.',
      fix: 'Rewrite titles as action titles that state the conclusion, implication, or decision.',
    })
  }

  if (GENERIC_LANGUAGE.test(allText)) {
    addFinding(findings, {
      severity: 'warning',
      dimension: 'specificity',
      message: 'Deck uses generic polished language where specific claims would be stronger.',
      fix: 'Replace broad wording with concrete customer moments, metrics, trade-offs, owners, or decisions.',
    })
  }

  const slidesWithNumbers = usableSlides.filter((slide) => NUMERIC_CLAIM.test(slideText(slide)))
  const numericSlidesWithoutSource = slidesWithNumbers.filter((slide) => !SOURCE_LABEL.test(slideText(slide)))
  if (brief.evidenceMode === 'strict' && numericSlidesWithoutSource.length > 0) {
    addFinding(findings, {
      severity: 'error',
      dimension: 'evidence',
      message: `${numericSlidesWithoutSource.length} slide(s) contain numeric claims without source or assumption labels.`,
      fix: 'Label every numeric, market, financial, competitor, or performance claim as source-backed, user-provided, or assumption in notes.',
    })
  } else if (brief.evidenceMode !== 'light' && numericSlidesWithoutSource.length >= 3) {
    addFinding(findings, {
      severity: 'warning',
      dimension: 'evidence',
      message: `${numericSlidesWithoutSource.length} slide(s) include numeric claims without provenance language.`,
      fix: 'Add source, uploaded-data, or assumption labels for metric-heavy slides.',
    })
  }

  const missingNotes = usableSlides.filter((slide) => !slide.notes).length
  if (missingNotes > 0) {
    addFinding(findings, {
      severity: 'info',
      dimension: 'evidence',
      message: `${missingNotes} slide(s) are missing speaker notes.`,
      fix: 'Add notes with reasoning, provenance, assumptions, and presenter context.',
    })
  }

  evaluateTypeSpecific(usableSlides, allText, brief, findings)

  const score = Math.max(
    0,
    100 -
      findings.filter((finding) => finding.severity === 'error').length * 18 -
      findings.filter((finding) => finding.severity === 'warning').length * 7 -
      findings.filter((finding) => finding.severity === 'info').length * 2,
  )

  return {
    deckTypeId: brief.deckTypeId,
    deckTypeLabel: brief.deckTypeLabel,
    score,
    findings,
    passed: score >= 78 && findings.every((finding) => finding.severity !== 'error'),
  }
}

export function formatDeckRepairInstructions(evaluation: DeckEvaluation): string {
  if (evaluation.findings.length === 0) return ''
  const topFindings = evaluation.findings.slice(0, 8)

  return `\n\nDECK INTELLIGENCE REPAIR:
Current score: ${evaluation.score}/100 for ${evaluation.deckTypeLabel}.
Fix these issues before returning final slides:
${topFindings.map((finding, index) => `${index + 1}. [${finding.severity}] ${finding.message} Fix: ${finding.fix}`).join('\n')}`
}
