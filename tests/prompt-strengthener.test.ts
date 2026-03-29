import { describe, it, expect } from 'vitest'
import { detectIntent, detectNarrative, strengthenPrompt } from '../lib/prompt-strengthener'

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
