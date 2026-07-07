export type DeckTypeId =
  | 'consulting-analysis'
  | 'executive-strategy'
  | 'product-roadmap'
  | 'prd-feature-spec'
  | 'product-pitch'
  | 'business-review'
  | 'board-investor-update'
  | 'fundraising-pitch'
  | 'gtm-launch'
  | 'ux-research'
  | 'data-readout'
  | 'competitive-landscape'
  | 'technical-architecture'
  | 'operating-plan'
  | 'onboarding'

export interface DeckTypePlaybook {
  id: DeckTypeId
  label: string
  description: string
  cues: string[]
  audience: string
  idealSlideCount: string
  narrativeArc: string[]
  requiredMoves: string[]
  preferredSlidePatterns: string[]
  evidenceRules: string[]
  avoid: string[]
}

export interface DeckTypeMatch {
  playbook: DeckTypePlaybook
  score: number
}

export const DECK_TYPE_PLAYBOOKS: DeckTypePlaybook[] = [
  {
    id: 'consulting-analysis',
    label: 'McKinsey-style strategy analysis',
    description: 'A recommendation-first analytical deck for senior leaders who need a clear answer, not a tour of the work.',
    cues: ['mckinsey', 'consulting', 'analysis', 'business case', 'recommendation', 'market analysis', 'unit economics', 'options', 'scenarios'],
    audience: 'CEO, CFO, GM, board, or executive sponsor',
    idealSlideCount: '12-20 slides',
    narrativeArc: ['Answer first', 'Context and issue tree', 'Evidence by branch', 'Options and trade-offs', 'Recommendation', 'Risks, sensitivities, and next steps'],
    requiredMoves: [
      'Lead with the recommendation and the 2-3 reasons it is true.',
      'Show the issue tree or decision logic before diving into evidence.',
      'Compare options with explicit trade-offs, not just benefits.',
      'End with implications, owner, timing, and the decision needed.',
    ],
    preferredSlidePatterns: ['executive summary', 'issue tree', 'option comparison', 'waterfall', 'sensitivity table', 'recommendation roadmap'],
    evidenceRules: [
      'Label every external market claim as source-backed, user-provided, or assumption.',
      'Put assumptions and calculation logic in speaker notes.',
      'Do not invent benchmarks; use ranges when the source is uncertain.',
    ],
    avoid: ['topic-title slides', 'generic market cheerleading', 'recommendations that are not tied to evidence'],
  },
  {
    id: 'executive-strategy',
    label: 'Executive strategy / decision deck',
    description: 'A decision-oriented strategy narrative for aligning leaders on direction, trade-offs, and resourcing.',
    cues: ['strategy', 'vision', 'strategic', 'pillar', 'decision', 'recommendation', 'north star', 'priority', 'priorities', 'bet'],
    audience: 'executive team, functional leaders, or cross-functional steering group',
    idealSlideCount: '10-16 slides',
    narrativeArc: ['Current state', 'Strategic tension', 'Choices', 'Recommended direction', 'Operating implications', 'Decision and asks'],
    requiredMoves: [
      'Name the decision or alignment needed by slide 2.',
      'Separate strategy from execution: where to play, how to win, what to stop doing.',
      'Show explicit trade-offs and resourcing implications.',
      'Translate the strategy into measurable operating priorities.',
    ],
    preferredSlidePatterns: ['strategy on a page', 'choice cascade', 'pillar map', 'trade-off matrix', 'investment mix', 'decision slide'],
    evidenceRules: [
      'Tie claims to internal data, customer evidence, or stated assumptions.',
      'Use confidence levels for uncertain market or competitor claims.',
    ],
    avoid: ['vision-only decks', 'three pillars with no choices', 'strategy that reads like a task list'],
  },
  {
    id: 'product-roadmap',
    label: 'Product roadmap / portfolio plan',
    description: 'A sequencing deck that explains what ships when, why that order is right, and what changes if constraints change.',
    cues: ['roadmap', 'now next later', 'h1', 'h2', 'q1', 'q2', 'q3', 'q4', 'portfolio', 'sequencing', 'milestones'],
    audience: 'product, design, engineering, go-to-market, and executive stakeholders',
    idealSlideCount: '10-16 slides',
    narrativeArc: ['Product thesis', 'Customer and business priorities', 'Sequencing logic', 'Roadmap', 'Dependencies', 'Metrics and risks'],
    requiredMoves: [
      'Show now/next/later or quarter-by-quarter sequencing.',
      'Explain why the order is correct: customer impact, business value, feasibility, dependencies.',
      'Call out trade-offs and what is explicitly not planned.',
      'Attach success metrics to each major initiative.',
    ],
    preferredSlidePatterns: ['roadmap timeline', 'initiative scorecard', 'dependency map', 'capacity allocation', 'risk register', 'metric ladder'],
    evidenceRules: [
      'Distinguish committed work from directional bets.',
      'Mark estimates, dates, and resourcing assumptions clearly.',
    ],
    avoid: ['feature lists without prioritization', 'timelines with no dependencies', 'equal-weight initiatives'],
  },
  {
    id: 'prd-feature-spec',
    label: 'PRD / feature spec',
    description: 'A product requirements deck that lets builders understand users, scope, behavior, metrics, and edge cases.',
    cues: ['prd', 'product requirements', 'requirements', 'feature spec', 'product spec', 'user stories', 'acceptance criteria', 'mvp'],
    audience: 'product, design, engineering, data, QA, and launch partners',
    idealSlideCount: '12-18 slides',
    narrativeArc: ['Problem', 'Users and jobs', 'Goals and non-goals', 'Solution', 'Requirements', 'UX flow', 'Metrics and rollout'],
    requiredMoves: [
      'Define the primary user, job, and problem in concrete language.',
      'List goals, non-goals, and acceptance criteria.',
      'Show the end-to-end UX flow including edge cases.',
      'Tie every major requirement to a success metric or user need.',
    ],
    preferredSlidePatterns: ['persona/job slide', 'requirements table', 'flow diagram', 'edge-case matrix', 'metric tree', 'launch checklist'],
    evidenceRules: [
      'Use actual uploaded requirements and data when provided.',
      'Call out unknowns as open questions instead of inventing answers.',
    ],
    avoid: ['solution-first specs', 'requirements without testability', 'missing non-goals'],
  },
  {
    id: 'product-pitch',
    label: 'Product pitch / concept narrative',
    description: 'A persuasive concept deck that makes a product opportunity feel urgent, differentiated, and buildable.',
    cues: ['pitch', 'concept', 'new product', 'subscription', 'premium', 'protect', 'opportunity', 'value proposition', 'monetization'],
    audience: 'executives, product leadership, investors, or launch sponsors',
    idealSlideCount: '10-15 slides',
    narrativeArc: ['Customer pain', 'Why now', 'Product wedge', 'Experience', 'Differentiation', 'Business case', 'Path to launch'],
    requiredMoves: [
      'Make the target customer and painful moment specific.',
      'Show why this product wins versus alternatives.',
      'Translate features into user and business outcomes.',
      'Include adoption, pricing, or monetization assumptions when relevant.',
    ],
    preferredSlidePatterns: ['customer moment', 'before-after', 'value proposition stack', 'competitive wedge', 'business model', 'launch path'],
    evidenceRules: [
      'Separate desirability evidence from business assumptions.',
      'Do not state market size, conversion, or revenue numbers without provenance.',
    ],
    avoid: ['generic empowerment language', 'feature tours', 'benefits with no proof'],
  },
  {
    id: 'business-review',
    label: 'Business review / QBR',
    description: 'A performance deck that explains what happened, why it happened, and what will change next period.',
    cues: ['qbr', 'quarterly business review', 'quarterly review', 'business review', 'results', 'metrics', 'kpi', 'okr', 'performance'],
    audience: 'executive team, business owners, finance, and operating leaders',
    idealSlideCount: '10-16 slides',
    narrativeArc: ['Executive readout', 'Goals vs. actuals', 'Drivers', 'Wins and misses', 'Risks', 'Next-period plan', 'Asks'],
    requiredMoves: [
      'Lead with the 3-5 takeaways leaders should remember.',
      'Show targets vs. actuals for the key metrics.',
      'Explain causal drivers behind over- or under-performance.',
      'End with owner-level actions and explicit asks.',
    ],
    preferredSlidePatterns: ['scorecard', 'variance chart', 'driver tree', 'cohort chart', 'risk table', 'next-quarter priorities'],
    evidenceRules: [
      'Use chart slides for all metric-heavy sections.',
      'Never invent actuals, targets, or historical performance.',
    ],
    avoid: ['status reporting without insight', 'metrics trapped in prose', 'wins with no quantified impact'],
  },
  {
    id: 'board-investor-update',
    label: 'Board / investor update',
    description: 'A candid investor-facing update that balances progress, metrics, risks, and decisions needed.',
    cues: ['board', 'investor update', 'executive update', 'briefing', 'series c', 'investor briefing', 'monthly update'],
    audience: 'board members, investors, CEO, CFO, and executive team',
    idealSlideCount: '12-20 slides',
    narrativeArc: ['What changed', 'Scorecard', 'Growth and retention', 'Strategic progress', 'Risks', 'Capital/resource implications', 'Decisions'],
    requiredMoves: [
      'Open with progress, risks, and decisions in one tight summary.',
      'Include metric definitions and period-over-period context.',
      'Be explicit about misses, constraints, and mitigations.',
      'Name board-level decisions or support needed.',
    ],
    preferredSlidePatterns: ['CEO memo slide', 'metric scorecard', 'funnel/cohort chart', 'initiative progress', 'risk heatmap', 'decision slide'],
    evidenceRules: [
      'Investor-facing numeric claims must be source-backed or clearly labeled as assumptions.',
      'Keep sensitive projections distinguishable from actuals.',
    ],
    avoid: ['placeholder import slides', 'over-polished optimism', 'unsupported market and revenue claims'],
  },
  {
    id: 'fundraising-pitch',
    label: 'Fundraising pitch deck',
    description: 'A raise narrative that earns belief in the market, team, product, traction, and use of funds.',
    cues: ['fundraising', 'raise', 'series a', 'series b', 'seed', 'investor deck', 'traction', 'market size', 'use of funds'],
    audience: 'prospective investors and internal fundraising team',
    idealSlideCount: '10-14 slides',
    narrativeArc: ['Problem', 'Solution', 'Market', 'Traction', 'Business model', 'GTM', 'Team', 'Ask and use of funds'],
    requiredMoves: [
      'State the investment thesis in the first two slides.',
      'Show traction with credible, source-labeled metrics.',
      'Explain market size with method, not just a large number.',
      'Connect the funding ask to specific milestones.',
    ],
    preferredSlidePatterns: ['problem wedge', 'product demo', 'traction chart', 'market sizing build', 'unit economics', 'use-of-funds table'],
    evidenceRules: [
      'Every traction, market, and financial claim needs a source or assumption label.',
      'Avoid fabricated customer logos, benchmarks, or competitive claims.',
    ],
    avoid: ['TAM-only market slides', 'traction without time period', 'funding ask without milestone logic'],
  },
  {
    id: 'gtm-launch',
    label: 'GTM / launch plan',
    description: 'A launch deck that coordinates audience, positioning, channels, rollout, enablement, and success metrics.',
    cues: ['launch', 'gtm', 'go-to-market', 'go to market', 'rollout', 'announce', 'beta', 'general availability', 'ga'],
    audience: 'product marketing, sales, support, growth, operations, and executives',
    idealSlideCount: '10-16 slides',
    narrativeArc: ['Launch objective', 'Audience and positioning', 'Offer and channels', 'Rollout plan', 'Enablement', 'Metrics and risks'],
    requiredMoves: [
      'Define the launch audience and positioning clearly.',
      'Map launch phases, channels, owners, and dates.',
      'Include enablement needs for sales, support, and operations.',
      'Attach success metrics and risk mitigations.',
    ],
    preferredSlidePatterns: ['launch brief', 'audience segmentation', 'message house', 'channel plan', 'timeline', 'risk/mitigation table'],
    evidenceRules: [
      'Mark dates, targets, and channel assumptions clearly.',
      'Use uploaded launch data or prior performance when provided.',
    ],
    avoid: ['announcement-only plans', 'no owner/date accountability', 'positioning that could apply to any product'],
  },
  {
    id: 'ux-research',
    label: 'UX research findings / storytelling',
    description: 'A research narrative that turns evidence into memorable user truths and prioritized product action.',
    cues: ['ux research', 'research findings', 'findings', 'user interview', 'interviews', 'survey', 'usability', 'discovery', 'insights'],
    audience: 'product, design, engineering, research, and decision-makers',
    idealSlideCount: '10-16 slides',
    narrativeArc: ['Research question', 'Method', 'Top findings', 'Evidence', 'Implications', 'Recommendations', 'Decision or next study'],
    requiredMoves: [
      'Lead with findings and recommendations, then explain method.',
      'Show sample size, participant profile, and research limits.',
      'Use quotes, observations, or artifacts as evidence.',
      'Prioritize recommendations by user impact and confidence.',
    ],
    preferredSlidePatterns: ['finding headline', 'evidence wall', 'quote slide', 'journey map', 'severity matrix', 'recommendation table'],
    evidenceRules: [
      'Never fabricate participant quotes; label synthetic examples as illustrative.',
      'Separate observed behavior, interpretation, and recommendation.',
    ],
    avoid: ['method-first slog', 'insights without evidence', 'research findings that sound like opinions'],
  },
  {
    id: 'data-readout',
    label: 'Data insights / experiment readout',
    description: 'An analytical readout that explains metric movement, experiment results, statistical confidence, and action.',
    cues: ['experiment', 'readout', 'dashboard', 'cohort', 'conversion', 'retention', 'analysis', 'ab test', 'a/b test', 'funnel'],
    audience: 'product, growth, data, engineering, and executives',
    idealSlideCount: '8-14 slides',
    narrativeArc: ['Question', 'Method and data quality', 'Results', 'Drivers', 'Interpretation', 'Recommendation', 'Next test'],
    requiredMoves: [
      'State the question and decision the analysis supports.',
      'Describe the data source, sample, time period, and caveats.',
      'Visualize actual metric movement in charts.',
      'Translate insight into action or next experiment.',
    ],
    preferredSlidePatterns: ['metric snapshot', 'funnel chart', 'cohort chart', 'segment comparison', 'confidence/caveat slide', 'next-test plan'],
    evidenceRules: [
      'Do not invent experiment results, p-values, cohorts, or sample sizes.',
      'Label directional analysis separately from statistically significant findings.',
    ],
    avoid: ['charts without interpretation', 'analysis without decision', 'unsupported causal claims'],
  },
  {
    id: 'competitive-landscape',
    label: 'Competitive / market landscape',
    description: 'A market-facing analysis that clarifies competitors, customer choice criteria, gaps, and positioning.',
    cues: ['competitive', 'competitor', 'competition', 'market landscape', 'landscape', 'category', 'positioning', 'alternatives'],
    audience: 'strategy, product, marketing, sales, and executive leaders',
    idealSlideCount: '10-16 slides',
    narrativeArc: ['Market frame', 'Customer choice criteria', 'Competitor map', 'Gap analysis', 'Positioning', 'Implications'],
    requiredMoves: [
      'Define the category and customer decision criteria.',
      'Compare competitors on meaningful axes, not feature volume alone.',
      'Show where the company can credibly win.',
      'Translate landscape into positioning and product priorities.',
    ],
    preferredSlidePatterns: ['market map', 'competitor matrix', 'positioning map', 'customer criteria table', 'gap analysis', 'strategic implications'],
    evidenceRules: [
      'Use current, source-labeled competitor claims when possible.',
      'Mark assumptions where competitor data is inferred.',
    ],
    avoid: ['cherry-picked competitor grids', 'unsupported claims of leadership', 'feature checklists with no customer logic'],
  },
  {
    id: 'technical-architecture',
    label: 'Technical architecture / platform plan',
    description: 'A technical strategy deck that makes system direction, interfaces, constraints, and migration risks legible.',
    cues: ['architecture', 'api', 'platform', 'system', 'technical', 'infrastructure', 'migration', 'integration', 'sdk'],
    audience: 'engineering, product, security, data, operations, and technical executives',
    idealSlideCount: '10-18 slides',
    narrativeArc: ['Current architecture', 'Constraints', 'Target state', 'Key interfaces', 'Migration path', 'Risks and governance'],
    requiredMoves: [
      'Show current state and target state architecture.',
      'Name constraints: reliability, security, privacy, latency, cost, maintainability.',
      'Define interfaces, ownership, and migration phases.',
      'Connect technical choices to product or operating outcomes.',
    ],
    preferredSlidePatterns: ['system diagram', 'sequence diagram', 'capability map', 'migration roadmap', 'risk register', 'decision log'],
    evidenceRules: [
      'Do not invent API behavior, compliance requirements, or performance metrics.',
      'Flag unknown implementation details as assumptions or open questions.',
    ],
    avoid: ['abstract platform language', 'diagrams without ownership', 'target state without migration plan'],
  },
  {
    id: 'operating-plan',
    label: 'Operating plan / OKRs',
    description: 'An execution deck that translates strategy into measurable priorities, resourcing, cadence, and accountability.',
    cues: ['operating plan', 'okr', 'okrs', 'goals', 'planning', 'budget', 'resources', 'headcount', 'capacity', 'annual plan'],
    audience: 'executives, functional leaders, finance, people leaders, and operating teams',
    idealSlideCount: '10-16 slides',
    narrativeArc: ['Strategic context', 'Objectives', 'Key results', 'Resourcing', 'Operating cadence', 'Risks', 'Accountability'],
    requiredMoves: [
      'Tie every objective to a measurable key result.',
      'Show resourcing, capacity, or budget implications.',
      'Define owners and review cadence.',
      'Name risks, dependencies, and what gets deprioritized.',
    ],
    preferredSlidePatterns: ['OKR table', 'resource plan', 'cadence calendar', 'dependency map', 'risk register', 'accountability matrix'],
    evidenceRules: [
      'Label budget, capacity, and target assumptions.',
      'Avoid invented headcount or cost data unless user-provided.',
    ],
    avoid: ['goals without measurement', 'plans with no owner', 'resource asks without trade-offs'],
  },
  {
    id: 'onboarding',
    label: 'Onboarding / team narrative',
    description: 'A human onboarding deck that helps a new teammate understand context, culture, role, relationships, and first steps.',
    cues: ['welcome', 'bienvenido', 'onboarding', 'new hire', 'joining', 'first day', 'first week', 'orientation', 'team'],
    audience: 'new hires, managers, mentors, or internal teams',
    idealSlideCount: '8-12 slides',
    narrativeArc: ['Welcome', 'Mission and context', 'Role and expectations', 'People and rituals', 'First 30/60/90 days', 'Resources'],
    requiredMoves: [
      'Make the new person feel oriented, not overloaded.',
      'Clarify role expectations and first milestones.',
      'Show who to meet and how the team works.',
      'End with immediate next steps and support resources.',
    ],
    preferredSlidePatterns: ['welcome cover', 'mission snapshot', 'team map', 'first 90 days', 'tools/resources', 'rituals and norms'],
    evidenceRules: [
      'Do not invent personal details beyond the prompt.',
      'Mark placeholders clearly when names, dates, or systems are unknown.',
    ],
    avoid: ['generic culture slogans', 'dense policy dumps', 'fake personalization'],
  },
]

const DEFAULT_PLAYBOOK = DECK_TYPE_PLAYBOOKS.find((playbook) => playbook.id === 'executive-strategy')!

function normalizeText(input: string): string {
  return input
    .toLowerCase()
    .replace(/[^\w\s/-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function cueMatches(text: string, cue: string): boolean {
  const normalizedCue = normalizeText(cue)
  if (!normalizedCue) return false

  if (normalizedCue.length <= 3 || /^[a-z]\d$/i.test(normalizedCue)) {
    return new RegExp(`(^|\\s)${normalizedCue.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}(\\s|$)`).test(text)
  }

  return text.includes(normalizedCue)
}

function scoreCue(cue: string): number {
  if (cue.length >= 14) return 5
  if (cue.includes(' ')) return 4
  if (cue.length >= 8) return 3
  return 2
}

export function classifyDeckType(input: string): DeckTypeMatch {
  const text = normalizeText(input)
  let best: DeckTypeMatch = { playbook: DEFAULT_PLAYBOOK, score: 0 }

  for (const playbook of DECK_TYPE_PLAYBOOKS) {
    const score = playbook.cues.reduce((total, cue) => (
      cueMatches(text, cue) ? total + scoreCue(cue) : total
    ), 0)

    if (score > best.score) {
      best = { playbook, score }
    }
  }

  return best
}

export function formatDeckTypeGuidance(input: string): string {
  const { playbook, score } = classifyDeckType(input)
  if (score === 0) return ''

  const list = (items: string[]) => items.map((item) => `- ${item}`).join('\n')

  return `\n\n--- DECK TYPE PLAYBOOK (${playbook.label}) ---
Detected deck family: ${playbook.label}
Audience: ${playbook.audience}
Ideal length: ${playbook.idealSlideCount}
Purpose: ${playbook.description}

Narrative arc:
${playbook.narrativeArc.map((step, index) => `${index + 1}. ${step}`).join('\n')}

Required moves:
${list(playbook.requiredMoves)}

Preferred slide patterns:
${list(playbook.preferredSlidePatterns)}

Evidence rules:
${list(playbook.evidenceRules)}

Avoid:
${list(playbook.avoid)}`
}
