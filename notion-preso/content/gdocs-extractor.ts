import type { NotionBlock, ExtractedPage } from '../shared/types'

/* ── Google Docs DOM Content Extractor ── */

function getDocTitle(): string {
  // Docs title input field
  const titleEl =
    document.querySelector('.docs-title-input') as HTMLElement | null ||
    document.querySelector('#docs-title') as HTMLElement | null
  if (titleEl?.textContent?.trim()) return titleEl.textContent.trim()
  // Fall back to page <title> — "My Doc - Google Docs"
  return document.title.replace(/\s*[-–]\s*Google Docs$/i, '').trim() || 'Untitled'
}

/**
 * Classify a paragraph element's heading level by inspecting Docs' applied
 * paragraph style classes or aria attributes.
 */
function classifyParagraph(el: Element): NotionBlock['type'] {
  // Google Docs marks heading paragraphs with a class like "heading-1", "heading-2" etc.
  // on the inner .kix-paragraphrenderer, or via aria-level on role="heading"
  const roleEl = el.querySelector('[role="heading"]') as HTMLElement | null
  if (roleEl) {
    const level = roleEl.getAttribute('aria-level')
    if (level === '1') return 'heading1'
    if (level === '2') return 'heading2'
    if (level === '3') return 'heading3'
  }

  const cls = el.className || ''
  // Docs sometimes inlines a named style in the class list
  if (/heading.?1/i.test(cls)) return 'heading1'
  if (/heading.?2/i.test(cls)) return 'heading2'
  if (/heading.?3/i.test(cls)) return 'heading3'
  if (/title/i.test(cls)) return 'heading1'
  if (/subtitle/i.test(cls)) return 'heading2'

  // Inspect font-size as a heuristic for headings (Docs default heading sizes)
  const firstSpan = el.querySelector('span') as HTMLElement | null
  if (firstSpan) {
    const size = parseFloat(window.getComputedStyle(firstSpan).fontSize)
    if (size >= 26) return 'heading1'
    if (size >= 20) return 'heading2'
    if (size >= 16) return 'heading3'
  }

  // List items — Docs wraps these in elements with list role
  if (el.closest('[role="list"]') || el.querySelector('[role="listitem"]')) return 'bullet'

  return 'paragraph'
}

function extractBlocks(): NotionBlock[] {
  const blocks: NotionBlock[] = []

  // Primary: kix paragraph renderers
  const paraEls = document.querySelectorAll('.kix-paragraphrenderer')

  if (paraEls.length > 0) {
    paraEls.forEach(el => {
      const text = el.textContent?.trim() || ''
      if (!text) return

      const type = classifyParagraph(el)

      // Detect horizontal rule (divider) — Docs renders these as special paras
      if (el.querySelector('.kix-lineview-horizontal-rule')) {
        blocks.push({ type: 'divider', text: '---' })
        return
      }

      blocks.push({ type, text })
    })
  } else {
    // Fallback: Docs in some views renders into a plain content-editable region
    const editable = document.querySelector('[contenteditable="true"]')
    if (editable) {
      editable.querySelectorAll('p, h1, h2, h3, h4, li, blockquote, hr').forEach(el => {
        const tag = el.tagName.toLowerCase()
        let type: NotionBlock['type'] = 'paragraph'
        if (tag === 'h1') type = 'heading1'
        else if (tag === 'h2') type = 'heading2'
        else if (tag === 'h3' || tag === 'h4') type = 'heading3'
        else if (tag === 'li') type = 'bullet'
        else if (tag === 'blockquote') type = 'quote'
        else if (tag === 'hr') type = 'divider'

        const text = el.textContent?.trim() || ''
        if (text || type === 'divider') {
          blocks.push({ type, text })
        }
      })
    }
  }

  return blocks
}

export function extractGDocsPage(): ExtractedPage {
  const title = getDocTitle()
  const blocks = extractBlocks()
  return { title, icon: undefined, blocks, comments: [] }
}
