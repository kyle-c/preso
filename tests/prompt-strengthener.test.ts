import { describe, it, expect } from 'vitest'
import { detectIntent, detectNarrative, strengthenPrompt, preprocessIntent } from '../lib/prompt-strengthener'

describe('detectIntent', () => {
  it('detects PRD intent', () => {
    expect(detectIntent('create a PRD for the new payments feature')).toBe('prd')
    expect(detectIntent('product spec for the wallet MVP')).toBe('prd')
    expect(detectIntent('feature spec for credit building')).toBe('prd')
  })

  it('detects launch intent', () => {
    expect(detectIntent('launch plan for the new remittance corridor')).toBe('launch')
    expect(detectIntent('go-to-market strategy for our release')).toBe('launch')
  })

  it('detects review intent', () => {
    expect(detectIntent('Q2 quarterly review for the product team')).toBe('review')
    expect(detectIntent('monthly KPI dashboard results')).toBe('review')
  })

  it('detects research intent', () => {
    expect(detectIntent('user research findings from interviews')).toBe('research')
    expect(detectIntent('competitive analysis of remittance market')).toBe('research')
  })

  it('detects proposal intent', () => {
    expect(detectIntent('investment proposal for Series B funding')).toBe('proposal')
    expect(detectIntent('business case and ROI analysis')).toBe('proposal')
  })

  it('detects strategy intent', () => {
    expect(detectIntent('strategic roadmap for 2026 with objectives and goals')).toBe('strategy')
    expect(detectIntent('vision and priorities for the north star initiative')).toBe('strategy')
  })

  it('detects onboarding intent', () => {
    expect(detectIntent('onboarding deck for a new hire joining the design team')).toBe('onboarding')
    expect(detectIntent('welcome orientation for first day')).toBe('onboarding')
  })

  it('falls back to general for unrecognized prompts', () => {
    expect(detectIntent('make a nice presentation about cats')).toBe('general')
    expect(detectIntent('hello world')).toBe('general')
  })

  // Ambiguous prompts — weighted scoring should pick the more specific match
  it('resolves "quarterly launch review" to review (more keyword matches)', () => {
    // "quarterly" and "review" both match review; only "launch" matches launch
    expect(detectIntent('quarterly launch review')).toBe('review')
  })

  it('resolves "product research findings and user interviews" to research', () => {
    // "research", "findings", "user interview" all match research
    expect(detectIntent('product research findings and user interviews')).toBe('research')
  })

  it('resolves "strategy roadmap with objectives and goals" to strategy', () => {
    // "strateg", "roadmap", "objectives", "goals" all match strategy
    expect(detectIntent('strategy roadmap with objectives and goals')).toBe('strategy')
  })
})

describe('detectNarrative', () => {
  it('returns narrative arc for known types', () => {
    expect(detectNarrative('launch').arc).toBe('problem-solution-impact')
    expect(detectNarrative('review').arc).toBe('status-progress-plan')
    expect(detectNarrative('strategy').arc).toBe('context-challenge-recommendation')
    expect(detectNarrative('onboarding').arc).toBe('welcome-role-roadmap')
    expect(detectNarrative('proposal').arc).toBe('thesis-evidence-ask')
  })

  it('returns general arc for general type', () => {
    expect(detectNarrative('general').arc).toBe('general')
    expect(detectNarrative('general').sections).toEqual([])
  })
})

describe('strengthenPrompt', () => {
  it('returns strengthened prompt with document guidance', () => {
    const result = strengthenPrompt('Q2 quarterly review')
    expect(result.type).toBe('review')
    expect(result.label).toBe('Business Review')
    expect(result.strengthenedPrompt).toContain('Q2 quarterly review')
    expect(result.strengthenedPrompt).toContain('DOCUMENT STRUCTURE GUIDANCE')
  })

  it('includes narrative constraint for typed prompts', () => {
    const result = strengthenPrompt('launch plan for new feature')
    expect(result.strengthenedPrompt).toContain('NARRATIVE STRUCTURE')
    expect(result.strengthenedPrompt).toContain('Problem → Solution → Impact')
  })

  it('returns general type for unrecognized prompts', () => {
    const result = strengthenPrompt('make slides about dogs')
    expect(result.type).toBe('general')
  })
})

describe('preprocessIntent', () => {
  it('detects intent type and label', () => {
    const result = preprocessIntent('Q2 quarterly review results')
    expect(result.type).toBe('review')
    expect(result.label).toBe('Business Review')
  })

  it('extracts capitalized multi-word topics', () => {
    const result = preprocessIntent('Create a PRD for Félix Wallet and Digital Banking')
    expect(result.topics).toEqual(expect.arrayContaining(['Digital Banking']))
  })

  it('extracts tech terms', () => {
    const result = preprocessIntent('Build an API with KYC integration and NPS tracking')
    expect(result.topics).toEqual(expect.arrayContaining(['API', 'KYC', 'NPS']))
  })

  it('extracts percentages and currency amounts', () => {
    const result = preprocessIntent('Revenue grew 22.5% to $3.4M this quarter')
    expect(result.topics).toEqual(expect.arrayContaining(['22.5%', '$3.4M']))
  })

  it('extracts timeframe targets', () => {
    const result = preprocessIntent('Ship MVP within 6 weeks and iterate after 3 months')
    expect(result.topics).toEqual(expect.arrayContaining([
      expect.stringMatching(/within 6 weeks/i),
      expect.stringMatching(/after 3 months/i),
    ]))
  })

  it('deduplicates topics', () => {
    const result = preprocessIntent('API integration with API gateway using API keys')
    const apiCount = result.topics.filter(t => t === 'API').length
    expect(apiCount).toBeLessThanOrEqual(1)
  })

  it('summarizes uploaded data files', () => {
    const files = [{ name: 'revenue.csv', type: 'data', data: 'Q1,Revenue\n2025,$3.4M\n2026,$4.1M' }]
    const result = preprocessIntent('Analyze our revenue growth', files)
    expect(result.fileSummary).toContain('revenue.csv')
    expect(result.fileSummary).toContain('tabular data')
    expect(result.fileSummary).toContain('contains metrics')
  })

  it('summarizes uploaded image files', () => {
    const files = [{ name: 'mockup.png', type: 'image', data: 'base64...' }]
    const result = preprocessIntent('Reference this design', files)
    expect(result.fileSummary).toContain('mockup.png')
    expect(result.fileSummary).toContain('image')
  })

  it('returns null fileSummary when no files', () => {
    const result = preprocessIntent('Just a prompt')
    expect(result.fileSummary).toBeNull()
  })

  it('builds enriched context for typed intents', () => {
    const result = preprocessIntent('Q2 quarterly review with KPI results')
    expect(result.enrichedContext).toContain('DETECTED INTENT: Business Review')
    expect(result.enrichedContext).toContain('KEY TOPICS')
    expect(result.enrichedContext).toContain('REVIEW GENERATION NOTES')
  })

  it('includes data file guidance in enriched context', () => {
    const files = [{ name: 'data.csv', type: 'data', data: 'a,b\n1,2' }]
    const result = preprocessIntent('Analyze this data', files)
    expect(result.enrichedContext).toContain('uploaded data files')
    expect(result.enrichedContext).toContain('ChartSpec')
  })

  it('includes image guidance in enriched context', () => {
    const files = [{ name: 'chart.png', type: 'image', data: 'base64' }]
    const result = preprocessIntent('Use this image', files)
    expect(result.enrichedContext).toContain('uploaded images')
  })

  it('returns empty enriched context for general intent with no files', () => {
    const result = preprocessIntent('hello world')
    expect(result.enrichedContext).toBe('')
  })

  it('includes PRD-specific enrichment', () => {
    const result = preprocessIntent('Create a PRD for the new payments feature')
    expect(result.enrichedContext).toContain('PRD GENERATION NOTES')
  })

  it('includes launch-specific enrichment', () => {
    const result = preprocessIntent('Launch plan for our new product release')
    expect(result.enrichedContext).toContain('LAUNCH GENERATION NOTES')
  })

  it('includes research-specific enrichment', () => {
    const result = preprocessIntent('User research findings from interviews')
    expect(result.enrichedContext).toContain('RESEARCH GENERATION NOTES')
  })
})
