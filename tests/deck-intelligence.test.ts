import { describe, it, expect } from 'vitest'
import {
  buildDeckBrief,
  evaluateDeckAgainstBrief,
  formatDeckBriefForContent,
  formatDeckBriefForOutline,
  formatDeckBriefForPrompt,
  formatDeckRepairInstructions,
} from '../lib/deck-intelligence'

describe('deck intelligence', () => {
  it('builds a typed brief from a product roadmap prompt', () => {
    const brief = buildDeckBrief({
      prompt: 'Create a product roadmap for H2 with Q3 milestones, sequencing, dependencies, and success metrics',
      documentType: 'strategy',
    })

    expect(brief.deckTypeId).toBe('product-roadmap')
    expect(brief.deckTypeLabel).toBe('Product roadmap / portfolio plan')
    expect(brief.evidenceMode).toBe('grounded')
    expect(brief.requiredMoves.join(' ')).toContain('Show now/next/later')
  })

  it('uses strict evidence mode for investor and analytical decks', () => {
    const brief = buildDeckBrief({
      prompt: 'Build a board investor update with ARR, retention, risks, and next-quarter decisions',
      documentType: 'proposal',
    })

    expect(brief.deckTypeId).toBe('board-investor-update')
    expect(brief.evidenceMode).toBe('strict')
  })

  it('formats guidance for prompt, outline, and content stages', () => {
    const brief = buildDeckBrief({ prompt: 'QBR with KPI results and risks', documentType: 'review' })

    expect(formatDeckBriefForPrompt(brief)).toContain('DECK INTELLIGENCE CONTRACT')
    expect(formatDeckBriefForOutline(brief)).toContain('DECK INTELLIGENCE FOR OUTLINE')
    expect(formatDeckBriefForContent(brief)).toContain('DECK INTELLIGENCE FOR CONTENT')
  })

  it('does not inject guidance for unclassified prompts', () => {
    const brief = buildDeckBrief({ prompt: 'Make a nice presentation about dogs', documentType: 'general' })

    expect(brief.deckTypeScore).toBe(0)
    expect(formatDeckBriefForPrompt(brief)).toBe('')
    expect(formatDeckBriefForOutline(brief)).toBe('')
    expect(formatDeckBriefForContent(brief)).toBe('')
  })

  it('flags roadmap decks that do not show sequencing or trade-offs', () => {
    const brief = buildDeckBrief({ prompt: 'Product roadmap for Q2 and Q3', documentType: 'strategy' })
    const evaluation = evaluateDeckAgainstBrief([
      {
        type: 'title',
        bg: 'dark',
        title: 'Product Roadmap',
        subtitle: 'A future-ready plan',
        notes: 'Assumption: high-level draft.',
      },
      {
        type: 'bullets',
        bg: 'light',
        title: 'Initiatives',
        bullets: [{ text: 'Build premium features' }, { text: 'Improve onboarding' }],
        notes: 'Assumption: priorities are illustrative.',
      },
    ], brief)

    expect(evaluation.passed).toBe(false)
    expect(evaluation.findings.some((finding) => finding.dimension === 'roadmap-logic')).toBe(true)
    expect(formatDeckRepairInstructions(evaluation)).toContain('DECK INTELLIGENCE REPAIR')
  })

  it('passes a grounded roadmap with sequencing, dependencies, metrics, and notes', () => {
    const brief = buildDeckBrief({ prompt: 'Product roadmap for Q2 and Q3', documentType: 'strategy' })
    const evaluation = evaluateDeckAgainstBrief([
      {
        type: 'title',
        bg: 'dark',
        title: 'Roadmap Prioritizes Retention',
        subtitle: 'Q2 improves activation; Q3 scales monetization',
        notes: 'User-provided assumption: roadmap is directional until planning lock.',
      },
      {
        type: 'cards',
        bg: 'light',
        title: 'Now Next Later Shows Sequencing',
        cards: [
          { title: 'Now', body: 'Q2 onboarding fixes target activation and reduce drop-off.' },
          { title: 'Next', body: 'Q3 premium work depends on pricing research and payment reliability.' },
          { title: 'Later', body: 'Q4 expansion waits for support capacity and retention proof.' },
        ],
        notes: 'Assumption: sequencing reflects dependency order, not committed dates.',
      },
      {
        type: 'bullets',
        bg: 'dark',
        title: 'Dependencies Shape The Order',
        bullets: [
          { text: 'Metric: activation rate improves before premium upsell begins.' },
          { text: 'Trade-off: delay expansion to focus engineering capacity.' },
          { text: 'Risk: support readiness gates launch quality.' },
        ],
        notes: 'User-provided assumption: metrics are planning targets and should be validated before exec review.',
      },
      {
        type: 'closing',
        bg: 'light',
        title: 'Leadership Can Lock Q2',
        body: 'The decision is whether to fund onboarding reliability before premium expansion.',
        notes: 'Assumption: leadership approval is needed for capacity allocation.',
      },
      {
        type: 'cards',
        bg: 'dark',
        title: 'Owners Drive Each Milestone',
        cards: [
          { title: 'Product', body: 'Define scope, owners, and acceptance criteria.' },
          { title: 'Design', body: 'Validate core flows with user research.' },
          { title: 'Engineering', body: 'Sequence dependencies and delivery confidence.' },
          { title: 'Data', body: 'Instrument activation, retention, and conversion metrics.' },
        ],
        notes: 'Assumption: owner model is illustrative until team planning is complete.',
      },
      {
        type: 'bullets',
        bg: 'light',
        title: 'Metrics Confirm The Sequence',
        bullets: [
          { text: 'Activation validates Q2 onboarding work.' },
          { text: 'Retention validates user value before monetization.' },
          { text: 'Conversion validates premium launch readiness.' },
        ],
        notes: 'Assumption: metrics need baselines from analytics before final approval.',
      },
    ], brief)

    expect(evaluation.passed).toBe(true)
    expect(evaluation.score).toBeGreaterThanOrEqual(78)
  })
})
