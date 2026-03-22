/**
 * Prompt Strengthener
 *
 * Interprets user intent and enhances prompts with business document structure.
 * Focuses on product development and common business use cases.
 */

export type DocumentType =
  | 'prd'
  | 'proposal'
  | 'launch'
  | 'review'
  | 'research'
  | 'onboarding'
  | 'strategy'
  | 'general'

interface IntentResult {
  type: DocumentType
  label: string
  strengthenedPrompt: string
}

export interface PreprocessedIntent {
  type: DocumentType
  label: string
  /** Key topics/entities extracted from the prompt */
  topics: string[]
  /** Summary of what was found in uploaded files */
  fileSummary: string | null
  /** Enriched context string to prepend to the generation prompt */
  enrichedContext: string
}

const INTENT_PATTERNS: { type: DocumentType; label: string; keywords: RegExp }[] = [
  {
    type: 'prd',
    label: 'Product Requirements',
    keywords: /\b(prd|product\s+require|feature\s+spec|product\s+spec|build\s+a|new\s+feature|product\s+brief|user\s+stor|acceptance\s+criteria|mvp|minimum\s+viable|product\s+develop|feature\s+request|product\s+proposal|product\s+plan)\b/i,
  },
  {
    type: 'launch',
    label: 'Product Launch',
    keywords: /\b(launch|ship|release|go[\s-]to[\s-]market|gtm|rollout|announce|announcement|beta|ga\s|general\s+availability)\b/i,
  },
  {
    type: 'review',
    label: 'Business Review',
    keywords: /\b(quarterly|q[1-4]|review|retro|retrospective|results|kpi|okr|metrics|performance|dashboard|report)\b/i,
  },
  {
    type: 'research',
    label: 'Research & Insights',
    keywords: /\b(research|insight|finding|user\s+interview|survey|usability|ux\s+research|discovery|competitive\s+analysis|market\s+research|persona)\b/i,
  },
  {
    type: 'proposal',
    label: 'Business Proposal',
    keywords: /\b(proposal|pitch|invest|funding|series|raise|deck|business\s+case|roi|cost[\s-]benefit)\b/i,
  },
  {
    type: 'strategy',
    label: 'Strategy',
    keywords: /\b(strateg|roadmap|vision|initiative|priority|prioriti|plan\s+for|objectives|goals|north\s+star)\b/i,
  },
  {
    type: 'onboarding',
    label: 'Onboarding',
    keywords: /\b(onboard|welcome|new\s+hire|joining|orientation|first\s+day|first\s+week|starter)\b/i,
  },
]

const DOCUMENT_GUIDANCE: Record<DocumentType, string> = {
  prd: `This is a Product Requirements Document (PRD). Structure the document with these sections — this is a proven, high-quality PRD structure used by top product teams:

- **TL;DR**: 2-3 sentence executive summary of what we're building and why. The reader should immediately understand scope and value.
- **Goals**: Split into Business Goals (measurable KPIs — e.g. "Reduce drop-off rate by 15% within 3 months") and User Goals (what the user can now do — e.g. "Enable one-tap payment without leaving WhatsApp"). Also include Non-Goals to explicitly scope out what this does NOT cover.
- **User Stories**: Define the primary persona with a vivid 1-sentence description (e.g. "Maria, 34-year-old Mexican immigrant, sends money to family monthly"). Then list 5-7 user stories in "As a [role], I want [action], so that [benefit]" format. Stories should be specific and testable.
- **Functional Requirements**: Organized by feature area with priority labels (High/Medium/Low). Each requirement should be specific enough to be built and tested. Group related requirements under clear subheadings.
- **User Experience**: The end-to-end flow broken into numbered steps (Step 1, Step 2...). Include entry point, first-time experience, core flow, advanced features, and edge cases. Specify performance targets (e.g. "page loads in <2s"). Include UI/UX highlights covering design guidelines compliance, accessibility, and responsive behavior.
- **Narrative**: A vivid, human story (3-5 sentences) showing a real user completing the flow. Make the reader feel the experience — time, place, emotion, speed. This is the "golden path" that makes the product real.
- **Success Metrics**: A table of 5-8 metrics with columns for Metric name, Measurement Approach (tool + method), and Target. Include both business metrics (conversion rate, volume) and user-centric metrics (satisfaction, time-to-complete). Be specific about how each metric will be measured.`,

  launch: `This is a Product Launch plan. Structure the document with these sections:
- **Launch Overview**: What's launching, for whom, and why it matters.
- **Key Features & Benefits**: What's new and how it helps users.
- **Target Audience**: Who this is for, segmentation.
- **Go-to-Market Strategy**: Channels, messaging, rollout plan.
- **Timeline**: Key dates, phases, dependencies.
- **Success Metrics**: How we measure launch success.
- **Risks & Contingencies**: Potential issues and backup plans.
- **Support & Enablement**: Training, documentation, support readiness.`,

  review: `This is a Business Review. Structure the document with these sections:
- **Executive Summary**: Key takeaways at a glance.
- **Goals Recap**: What we set out to achieve.
- **Key Results & Metrics**: Actual performance vs. targets with data.
- **Wins & Highlights**: What went well and why.
- **Challenges & Learnings**: What didn't go as planned and what we learned.
- **Deep Dives**: 2-3 areas that warrant detailed analysis.
- **Next Period Plan**: Priorities and targets going forward.
- **Asks & Resources Needed**: Support required from stakeholders.`,

  research: `This is a Research & Insights document. Structure with these sections:
- **Research Objectives**: What questions we set out to answer.
- **Methodology**: How the research was conducted.
- **Key Findings**: Top insights organized by theme.
- **User Quotes & Evidence**: Direct evidence supporting findings.
- **Implications**: What this means for the product/business.
- **Recommendations**: Specific actions based on the findings.
- **Next Steps**: Follow-up research or immediate actions.`,

  proposal: `This is a Business Proposal. Structure the document with these sections:
- **Executive Summary**: The opportunity in brief.
- **Problem / Opportunity**: Market need or business gap.
- **Proposed Solution**: What we're proposing and why.
- **Market Context**: Competitive landscape, market size, trends.
- **Business Model**: Revenue model, unit economics, projections.
- **Team & Capabilities**: Why we can execute.
- **Ask**: What's needed (funding, resources, approval).
- **Timeline & Milestones**: Key phases and deliverables.`,

  strategy: `This is a Strategy document. Structure with these sections:
- **Context & Landscape**: Current state, market conditions, competitive position.
- **Vision**: Where we're headed and why.
- **Strategic Pillars**: 3-5 key focus areas.
- **Objectives & Key Results**: Measurable goals per pillar.
- **Roadmap**: Phased plan with milestones.
- **Resource Requirements**: What's needed to execute.
- **Risks & Trade-offs**: What we're choosing NOT to do and why.
- **Success Criteria**: How we know the strategy is working.`,

  onboarding: `This is an Onboarding document. Structure with these sections:
- **Welcome & Introduction**: Warm greeting, company overview.
- **Role & Expectations**: What the role entails and success criteria.
- **Team & Stakeholders**: Key people and relationships.
- **First 90 Days**: Phased ramp-up plan.
- **Tools & Access**: Systems, accounts, and resources.
- **Culture & Values**: How we work together.
- **Resources & Support**: Where to get help.`,

  general: `Structure the document with clear sections that match the presentation content. Each section should provide detailed context that the slides summarize visually.`,
}

export function detectIntent(prompt: string): DocumentType {
  for (const { type, keywords } of INTENT_PATTERNS) {
    if (keywords.test(prompt)) return type
  }
  return 'general'
}

// ---------------------------------------------------------------------------
// Narrative Structure Detection
// ---------------------------------------------------------------------------

export type NarrativeArc =
  | 'problem-solution-impact'
  | 'status-progress-plan'
  | 'context-challenge-recommendation'
  | 'welcome-role-roadmap'
  | 'thesis-evidence-ask'
  | 'general'

interface NarrativeStructure {
  arc: NarrativeArc
  label: string
  sections: string[]
}

const NARRATIVE_ARCS: Record<DocumentType, NarrativeStructure> = {
  launch: {
    arc: 'problem-solution-impact',
    label: 'Problem → Solution → Impact',
    sections: ['Problem/Opportunity', 'What We Built', 'How It Works', 'Key Features', 'Impact & Metrics', 'Rollout Plan', 'Next Steps'],
  },
  prd: {
    arc: 'problem-solution-impact',
    label: 'Problem → Solution → Impact',
    sections: ['Problem Statement', 'User Pain Points', 'Proposed Solution', 'Key Features', 'User Experience', 'Success Metrics', 'Timeline'],
  },
  review: {
    arc: 'status-progress-plan',
    label: 'Status → Progress → Plan',
    sections: ['Executive Summary', 'Goals Recap', 'Key Results', 'Wins', 'Challenges & Learnings', 'Deep Dives', 'Next Period Plan'],
  },
  strategy: {
    arc: 'context-challenge-recommendation',
    label: 'Context → Challenge → Recommendation',
    sections: ['Landscape & Context', 'Core Challenges', 'Strategic Vision', 'Strategic Pillars', 'Roadmap', 'Resources Needed', 'Success Criteria'],
  },
  onboarding: {
    arc: 'welcome-role-roadmap',
    label: 'Welcome → Your Role → First 90 Days',
    sections: ['Welcome', 'About the Company', 'Your Role', 'Meet the Team', 'First 90 Days', 'Tools & Resources', 'Culture & Values'],
  },
  proposal: {
    arc: 'thesis-evidence-ask',
    label: 'Thesis → Evidence → Ask',
    sections: ['Executive Summary', 'The Opportunity', 'Our Solution', 'Market Evidence', 'Business Model', 'Traction & Team', 'The Ask'],
  },
  research: {
    arc: 'context-challenge-recommendation',
    label: 'Context → Findings → Recommendations',
    sections: ['Research Objectives', 'Methodology', 'Key Findings', 'User Evidence', 'Implications', 'Recommendations', 'Next Steps'],
  },
  general: {
    arc: 'general',
    label: 'General',
    sections: [],
  },
}

/** Detect the narrative arc for a given intent type */
export function detectNarrative(type: DocumentType): NarrativeStructure {
  return NARRATIVE_ARCS[type] || NARRATIVE_ARCS.general
}

/** Format narrative arc as a generation constraint */
export function formatNarrativeConstraint(narrative: NarrativeStructure): string {
  if (narrative.arc === 'general' || narrative.sections.length === 0) return ''
  const sectionList = narrative.sections.map((s, i) => `  ${i + 1}. ${s}`).join('\n')
  return `\n\n--- NARRATIVE STRUCTURE (${narrative.label}) ---
Follow this storytelling arc to ensure the presentation tells a coherent story:
${sectionList}

Each section should be 1-3 slides. The arc should feel like a natural progression — the audience should never wonder "why am I seeing this slide now?"`
}

export function strengthenPrompt(prompt: string): IntentResult {
  const type = detectIntent(prompt)
  const label = INTENT_PATTERNS.find((p) => p.type === type)?.label ?? 'Presentation'
  const narrative = detectNarrative(type)

  const guidance = DOCUMENT_GUIDANCE[type]
  const narrativeConstraint = formatNarrativeConstraint(narrative)

  const strengthenedPrompt = `${prompt}

--- DOCUMENT STRUCTURE GUIDANCE ---
${guidance}
${narrativeConstraint}

Generate both a detailed business document AND a visual slide presentation from this prompt.

QUALITY BAR:
- The document should be thorough, stakeholder-ready prose — the kind you'd confidently present to a VP or investor. Each section should be 3-5 paragraphs with specific details, not generic filler.
- The slides should be a compelling visual narrative that stands on its own. Use insight-driven titles that convey the key takeaway, not placeholder headings.
- Every slide MUST include a "notes" field with 3-5 sentences expanding on the visual content.
- Aim for 12-16 slides minimum. Don't rush — give each topic the depth it deserves.
- When the prompt references data, metrics, or results, generate "chart" type slides with concrete ChartSpec data rather than just describing numbers in text.
- ANTI-SLOP: No dense paragraphs on slides. No titles longer than 6 words on cover slides. No 5 or 7 card grids. No consecutive slides with the same background color. Vary slide types — don't use the same type 3x in a row.`

  return { type, label, strengthenedPrompt }
}

/* ─── Topic Extraction ─── */

/** Extract key entities and topics from text for context enrichment */
function extractTopics(text: string): string[] {
  const topics: string[] = []

  // Product/feature names (capitalized multi-word phrases)
  const capitalizedPhrases = text.match(/\b[A-Z][a-z]+(?:\s+[A-Z][a-z]+)+\b/g) ?? []
  topics.push(...capitalizedPhrases.slice(0, 5))

  // Technical terms and integrations
  const techTerms = text.match(/\b(?:API|SDK|iOS|Android|WhatsApp|KYC|NPS|CSAT|P2P|B2B|B2C|UX|UI|CTA|MVP|OKR|KPI|ROI|NFC|PCI|DSS|GDPR)\b/gi) ?? []
  topics.push(...[...new Set(techTerms.map(t => t.toUpperCase()))].slice(0, 8))

  // Metrics / percentages
  const metrics = text.match(/\d+(?:\.\d+)?%/g) ?? []
  topics.push(...metrics.slice(0, 4))

  // Currency amounts
  const amounts = text.match(/\$[\d,.]+[MKBmkb]?/g) ?? []
  topics.push(...amounts.slice(0, 3))

  // Time-based targets
  const timeframes = text.match(/\b(?:within|by|after)\s+(?:\d+\s+)?(?:days?|weeks?|months?|quarters?|years?)\b/gi) ?? []
  topics.push(...timeframes.slice(0, 3))

  return [...new Set(topics)]
}

/** Summarize uploaded file content for context enrichment */
function summarizeFiles(files: { name: string; type: string; data: string }[]): string | null {
  if (files.length === 0) return null

  const parts: string[] = []

  for (const file of files) {
    if (file.type === 'data') {
      // Text-based files — extract structure hints
      const lines = file.data.split('\n').filter(l => l.trim())
      const preview = lines.slice(0, 5).join(' | ')
      const hasNumbers = /\d+/.test(file.data)
      const hasColumns = file.data.includes(',') || file.data.includes('\t')
      parts.push(`${file.name}: ${lines.length} lines${hasColumns ? ', tabular data' : ''}${hasNumbers ? ', contains metrics' : ''} — preview: "${preview.slice(0, 120)}"`)
    } else {
      parts.push(`${file.name}: ${file.type} file attached`)
    }
  }

  return parts.join('\n')
}

/** Pre-process user intent from prompt + files before generation.
 *  This runs client-side (debounced) to build enriched context early. */
export function preprocessIntent(
  prompt: string,
  files: { name: string; type: string; data: string }[] = [],
): PreprocessedIntent {
  const type = detectIntent(prompt)
  const label = INTENT_PATTERNS.find((p) => p.type === type)?.label ?? 'Presentation'
  const topics = extractTopics(prompt)
  const fileSummary = summarizeFiles(files)

  // Build enriched context that will be prepended to the generation prompt
  const contextParts: string[] = []

  if (type !== 'general') {
    contextParts.push(`DETECTED INTENT: ${label} (${type})`)
  }

  if (topics.length > 0) {
    contextParts.push(`KEY TOPICS: ${topics.join(', ')}`)
  }

  if (fileSummary) {
    contextParts.push(`UPLOADED FILES ANALYSIS:\n${fileSummary}`)

    // Add file-specific guidance
    const hasData = files.some(f => f.type === 'data')
    const hasImages = files.some(f => f.type === 'image')
    if (hasData) {
      contextParts.push('IMPORTANT: The user uploaded data files. Analyze the data carefully and create chart slides with accurate ChartSpec visualizations based on the actual data provided. Do not invent data — use what was uploaded.')
    }
    if (hasImages) {
      contextParts.push('IMPORTANT: The user uploaded images. Reference them in relevant slides and analyze any charts/diagrams in the images to recreate them as interactive chart slides.')
    }
  }

  // Intent-specific enrichment
  if (type === 'prd') {
    contextParts.push(
      'PRD GENERATION NOTES: Structure the presentation to mirror a professional PRD. Lead with the TL;DR/problem, then goals, user stories, requirements, UX flow, and success metrics. Each slide should map to a PRD section. Use chart slides for any metrics or success criteria. Include a narrative slide showing the golden-path user experience.',
    )
  } else if (type === 'review') {
    contextParts.push(
      'REVIEW GENERATION NOTES: Lead with executive summary and key metrics. Use chart slides heavily for data visualization. Include wins, challenges, and forward-looking priorities. Every metric should be presented as a chart, not just text.',
    )
  } else if (type === 'launch') {
    contextParts.push(
      'LAUNCH GENERATION NOTES: Create excitement while being informative. Lead with what\'s new and why it matters. Include user flow walkthrough, key features, timeline, and success metrics. Use before/after comparisons where relevant.',
    )
  } else if (type === 'research') {
    contextParts.push(
      'RESEARCH GENERATION NOTES: Lead with key findings, not methodology. Use quote slides for user verbatims. Visualize quantitative data with charts. End with clear, actionable recommendations prioritized by impact.',
    )
  }

  const enrichedContext = contextParts.length > 0
    ? `--- PRE-PROCESSED CONTEXT ---\n${contextParts.join('\n\n')}\n--- END PRE-PROCESSED CONTEXT ---\n\n`
    : ''

  return { type, label, topics, fileSummary, enrichedContext }
}
