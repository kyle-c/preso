import { describe, it, expect } from 'vitest'
import { DECK_TYPE_PLAYBOOKS, classifyDeckType, formatDeckTypeGuidance } from '../lib/deck-taxonomy'

describe('deck taxonomy', () => {
  it('defines the 15 common technology-company deck families', () => {
    expect(DECK_TYPE_PLAYBOOKS).toHaveLength(15)
    expect(DECK_TYPE_PLAYBOOKS.map((playbook) => playbook.id)).toEqual(expect.arrayContaining([
      'consulting-analysis',
      'product-roadmap',
      'product-pitch',
      'business-review',
      'ux-research',
      'technical-architecture',
    ]))
  })

  it('classifies McKinsey-style analytical strategy decks', () => {
    const match = classifyDeckType('Create a McKinsey-style market analysis with recommendation, options, and unit economics')
    expect(match.playbook.id).toBe('consulting-analysis')
    expect(match.score).toBeGreaterThan(0)
  })

  it('classifies product roadmap decks separately from general strategy', () => {
    const match = classifyDeckType('Build a product roadmap for H2 with Q3 milestones, sequencing, and dependencies')
    expect(match.playbook.id).toBe('product-roadmap')
  })

  it('classifies QBR and business review prompts', () => {
    const match = classifyDeckType('Create a QBR with KPI results, goals vs actuals, risks, and next-quarter plan')
    expect(match.playbook.id).toBe('business-review')
  })

  it('classifies UX research storytelling decks', () => {
    const match = classifyDeckType('Turn UX research findings from user interviews into a storytelling deck')
    expect(match.playbook.id).toBe('ux-research')
  })

  it('formats deck-specific generation guidance', () => {
    const guidance = formatDeckTypeGuidance('Product roadmap for Q2 and Q3')
    expect(guidance).toContain('DECK TYPE PLAYBOOK')
    expect(guidance).toContain('Product roadmap / portfolio plan')
    expect(guidance).toContain('Evidence rules')
    expect(guidance).toContain('Avoid')
  })

  it('does not inject deck guidance when no deck family is detectable', () => {
    expect(formatDeckTypeGuidance('Make a lovely presentation about cats')).toBe('')
  })
})
