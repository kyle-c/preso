import { describe, it, expect } from 'vitest'
import { parseBrandFile } from '../lib/brand-kit'

describe('parseBrandFile — JSON', () => {
  it('parses a simple JSON brand file', () => {
    const json = JSON.stringify({
      name: 'Test Brand',
      description: 'A test brand',
      colors: { primary: '#ff0000' },
    })
    const result = parseBrandFile(json, 'brand.json')
    expect('error' in result).toBe(false)
    if (!('error' in result)) {
      expect(result.name).toBe('Test Brand')
      expect(result.description).toBe('A test brand')
    }
  })

  it('unwraps designSystem wrapper', () => {
    const json = JSON.stringify({
      designSystem: {
        name: 'Wrapped Brand',
        colors: { primary: '#00ff00' },
      },
    })
    const result = parseBrandFile(json, 'brand.json')
    if (!('error' in result)) {
      expect(result.name).toBe('Wrapped Brand')
    }
  })

  it('unwraps brand wrapper', () => {
    const json = JSON.stringify({
      brand: {
        name: 'Brand Wrapped',
        colors: { primary: '#0000ff' },
      },
    })
    const result = parseBrandFile(json, 'brand.json')
    if (!('error' in result)) {
      expect(result.name).toBe('Brand Wrapped')
    }
  })

  it('unwraps theme wrapper', () => {
    const json = JSON.stringify({
      theme: {
        name: 'Theme Wrapped',
        colors: { primary: '#ff00ff' },
      },
    })
    const result = parseBrandFile(json, 'brand.json')
    if (!('error' in result)) {
      expect(result.name).toBe('Theme Wrapped')
    }
  })

  it('does NOT unwrap tokens (tokens is data, not a wrapper)', () => {
    const json = JSON.stringify({
      name: 'Token Brand',
      tokens: { spacing: { sm: '4px', md: '8px' } },
    })
    const result = parseBrandFile(json, 'brand.json')
    if (!('error' in result)) {
      expect(result.name).toBe('Token Brand')
    }
  })

  it('returns error for invalid JSON', () => {
    const result = parseBrandFile('not valid json {{{', 'brand.json')
    expect('error' in result).toBe(true)
  })

  it('resolves font from typography.fonts path', () => {
    const json = JSON.stringify({
      name: 'Font Brand',
      typography: {
        fonts: {
          display: 'Inter',
          body: 'Roboto',
        },
      },
    })
    const result = parseBrandFile(json, 'brand.json')
    if (!('error' in result)) {
      expect(result.displayFont).toBe('Inter')
      expect(result.bodyFont).toBe('Roboto')
    }
  })

  it('resolves font with family object format', () => {
    const json = JSON.stringify({
      name: 'Font Brand',
      fonts: {
        display: { family: 'Inter', weights: '400-700' },
        body: { family: 'Roboto' },
      },
    })
    const result = parseBrandFile(json, 'brand.json')
    if (!('error' in result)) {
      expect(result.displayFont).toContain('Inter')
      expect(result.bodyFont).toBe('Roboto')
    }
  })

  it('falls back to System default when no font found', () => {
    const json = JSON.stringify({ name: 'No Fonts' })
    const result = parseBrandFile(json, 'brand.json')
    if (!('error' in result)) {
      expect(result.displayFont).toBe('System default')
    }
  })

  it('resolves colors from array format', () => {
    const json = JSON.stringify({
      name: 'Array Colors',
      colors: {
        primary: [
          { name: 'Red', hex: '#ff0000' },
          { name: 'Blue', hex: '#0000ff' },
        ],
      },
    })
    const result = parseBrandFile(json, 'brand.json')
    if (!('error' in result)) {
      expect(result.primaryColors.length).toBeGreaterThan(0)
    }
  })

  it('defaults to Untitled Brand when name is missing', () => {
    const json = JSON.stringify({ colors: { primary: '#aaa' } })
    const result = parseBrandFile(json, 'brand.json')
    if (!('error' in result)) {
      expect(result.name).toBe('Untitled Brand')
    }
  })
})

describe('parseBrandFile — Markdown', () => {
  it('extracts brand name from heading', () => {
    const md = `# Acme Brand\n\nOur brand identity.\n\n## Colors\n\n| Name | Hex |\n|------|-----|\n| Red | #ff0000 |`
    const result = parseBrandFile(md, 'brand.md')
    if (!('error' in result)) {
      expect(result.name).toContain('Acme')
    }
  })

  it('extracts colors from markdown tables', () => {
    const md = `# Test\n\n## Colors\n\n| Name | Hex |\n|------|-----|\n| Primary | #ff0000 |\n| Secondary | #00ff00 |`
    const result = parseBrandFile(md, 'brand.md')
    if (!('error' in result)) {
      const allColors = [...result.primaryColors, ...result.secondaryColors, ...result.neutralColors]
      expect(allColors.length).toBeGreaterThan(0)
    }
  })

  it('handles empty markdown', () => {
    const result = parseBrandFile('', 'brand.md')
    if (!('error' in result)) {
      expect(result.name).toBe('Untitled Brand')
    }
  })

  it('detects HTML content returned instead of markdown', () => {
    const html = `<!DOCTYPE html><html><head><title>Brand Page</title></head><body><h1>Brand</h1></body></html>`
    const result = parseBrandFile(html, 'brand.md')
    // Should not crash — should strip HTML and parse as text
    expect('error' in result).toBe(false)
  })
})
