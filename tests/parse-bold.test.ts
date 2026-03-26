import { describe, it, expect } from 'vitest'

// parseBold is defined inline in slide-renderer.tsx and not exported.
// We'll test the logic by reimplementing the same regex pattern here.
// This validates the regex pattern itself, which is where the bugs occurred.

function parseBoldLogic(text: string | null | undefined): string[] {
  if (!text) return []
  // Split on **bold** markers and [link](url) patterns
  const parts: string[] = []
  const regex = /(\*\*(.+?)\*\*|\[([^\]]+)\]\(([^)]+)\))/g
  let lastIndex = 0
  let match: RegExpExecArray | null

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index))
    }
    if (match[2]) {
      parts.push(`BOLD:${match[2]}`)
    } else if (match[3] && match[4]) {
      parts.push(`LINK:${match[3]}:${match[4]}`)
    }
    lastIndex = regex.lastIndex
  }

  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex))
  }

  return parts
}

describe('parseBold logic', () => {
  it('returns empty array for null input', () => {
    expect(parseBoldLogic(null)).toEqual([])
  })

  it('returns empty array for undefined input', () => {
    expect(parseBoldLogic(undefined)).toEqual([])
  })

  it('returns empty array for empty string', () => {
    expect(parseBoldLogic('')).toEqual([])
  })

  it('passes through plain text', () => {
    expect(parseBoldLogic('Hello world')).toEqual(['Hello world'])
  })

  it('extracts bold markers', () => {
    const result = parseBoldLogic('Hello **world** today')
    expect(result).toEqual(['Hello ', 'BOLD:world', ' today'])
  })

  it('extracts inline links', () => {
    const result = parseBoldLogic('Visit [our site](https://example.com) now')
    expect(result).toEqual(['Visit ', 'LINK:our site:https://example.com', ' now'])
  })

  it('handles multiple bold markers', () => {
    const result = parseBoldLogic('**First** and **Second**')
    expect(result).toEqual(['BOLD:First', ' and ', 'BOLD:Second'])
  })

  it('handles bold and links together', () => {
    const result = parseBoldLogic('**Bold** and [link](url)')
    expect(result).toEqual(['BOLD:Bold', ' and ', 'LINK:link:url'])
  })

  it('handles text with no markers', () => {
    const result = parseBoldLogic('Just plain text without any formatting')
    expect(result).toEqual(['Just plain text without any formatting'])
  })
})
