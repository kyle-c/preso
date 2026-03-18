import type { NotionBlock, NotionComment, ExtractedPage } from '../shared/types'

/* ── Notion DOM Content Extractor ── */

function getPageTitle(): string {
  const titleEl =
    document.querySelector('.notion-page-block [placeholder="Untitled"]') ||
    document.querySelector('.notion-frame [contenteditable="true"][data-root="true"]') ||
    document.querySelector('.notion-page-content')?.closest('[class*="page"]')?.querySelector('h1, [contenteditable]')
  return titleEl?.textContent?.trim() || document.title.replace(/ - Notion$/, '').trim() || 'Untitled'
}

function getPageIcon(): string | undefined {
  const iconEl = document.querySelector('.notion-page-block .notion-record-icon img') as HTMLImageElement | null
  if (iconEl) return iconEl.src
  const emojiEl = document.querySelector('.notion-page-block .notion-record-icon [aria-label]') as HTMLElement | null
  if (emojiEl) return emojiEl.textContent?.trim() || undefined
  return undefined
}

/* ── Pre-extraction: expand toggles & load images ── */

function sleep(ms: number) { return new Promise(r => setTimeout(r, ms)) }

async function expandAllToggles(): Promise<Element[]> {
  const collapsed: Element[] = []

  // Find all collapsed toggles using multiple selector strategies
  const toggles = document.querySelectorAll(
    '[class*="toggle"][aria-expanded="false"], ' +
    '.notion-toggle:not(.notion-toggle-open), ' +
    '[class*="toggle-block"]:not([class*="open"])'
  )

  for (const toggle of toggles) {
    // Find the clickable arrow/button
    const btn =
      toggle.querySelector('[class*="toggle-button"], [class*="triangleDown"], [role="button"]') ||
      toggle.querySelector('div[style*="cursor"]') ||
      toggle

    if (btn instanceof HTMLElement) {
      collapsed.push(toggle)
      btn.click()
    }
  }

  // Also try the data-block-id approach — click any toggle block that has no rendered children
  const blockToggles = document.querySelectorAll('[data-block-id]')
  for (const el of blockToggles) {
    const cls = el.className || ''
    if (!cls.includes('toggle')) continue
    // If it has aria-expanded="false" or appears collapsed
    if (el.getAttribute('aria-expanded') === 'false') {
      const btn = el.querySelector('[class*="triangle"], [class*="arrow"], [role="button"]') || el
      if (btn instanceof HTMLElement && !collapsed.includes(el)) {
        collapsed.push(el)
        btn.click()
      }
    }
  }

  // Wait for React to render toggle children
  if (collapsed.length > 0) {
    await sleep(800)
    // Second pass — some deeply nested toggles may need more time
    await sleep(400)
  }

  return collapsed
}

function collapseToggles(toggles: Element[]) {
  // Restore collapsed state
  for (const toggle of toggles) {
    const btn =
      toggle.querySelector('[class*="toggle-button"], [class*="triangleDown"], [role="button"]') ||
      toggle.querySelector('div[style*="cursor"]') ||
      toggle
    if (btn instanceof HTMLElement) btn.click()
  }
}

async function scrollToLoadImages(): Promise<void> {
  const scroller =
    document.querySelector('.notion-scroller') ||
    document.querySelector('.notion-frame') ||
    document.scrollingElement ||
    document.body

  if (!scroller) return

  const originalTop = scroller.scrollTop

  // Scroll through the page to trigger lazy image loading
  const step = window.innerHeight
  const maxScroll = scroller.scrollHeight

  for (let pos = 0; pos < maxScroll; pos += step) {
    scroller.scrollTop = pos
    await sleep(100)
  }

  // Scroll back to original position
  scroller.scrollTop = originalTop
  // Give images a moment to start loading
  await sleep(300)
}

/* ── Block classification ── */

function classifyBlock(el: Element): NotionBlock['type'] | null {
  const cls = el.className || ''

  // Use Notion's own class names first (more reliable)
  if (cls.includes('notion-h1') || cls.includes('header-block') || cls.includes('heading_1')) return 'heading1'
  if (cls.includes('notion-h2') || cls.includes('sub_header-block') || cls.includes('heading_2')) return 'heading2'
  if (cls.includes('notion-h3') || cls.includes('sub_sub_header-block') || cls.includes('heading_3')) return 'heading3'
  if (cls.includes('notion-to-do') || cls.includes('to_do-block') || cls.includes('to_do')) return 'todo'
  if (cls.includes('notion-toggle') || cls.includes('toggle-block') || cls.includes('toggle')) return 'toggle'
  if (cls.includes('notion-callout') || cls.includes('callout-block') || cls.includes('callout')) return 'callout'
  if (cls.includes('notion-quote') || cls.includes('quote-block') || cls.includes('quote')) return 'quote'
  if (cls.includes('notion-code') || cls.includes('code-block')) return 'code'
  if (cls.includes('notion-image') || cls.includes('image-block') || cls.includes('image')) return 'image'
  if (cls.includes('notion-hr') || cls.includes('divider-block') || cls.includes('divider')) return 'divider'
  if (cls.includes('notion-bookmark') || cls.includes('bookmark-block')) return 'paragraph'
  if (cls.includes('notion-simple-table') || cls.includes('table-block') || cls.includes('table_block')) return 'table'
  if (cls.includes('notion-list-disc') || cls.includes('bulleted_list-block') || cls.includes('bulleted_list')) return 'bullet'
  if (cls.includes('notion-list-numbered') || cls.includes('numbered_list-block') || cls.includes('numbered_list')) return 'numbered'

  // Check for inner elements
  if (el.querySelector('h1')) return 'heading1'
  if (el.querySelector('h2')) return 'heading2'
  if (el.querySelector('h3')) return 'heading3'

  // Check for image blocks that might not have the class
  if (el.querySelector('.notion-asset-wrapper-image, img.lazy-image-real, [class*="notion-image"]')) return 'image'

  // Generic text/paragraph
  if (cls.includes('notion-text') || cls.includes('text-block') || cls.includes('text')) return 'paragraph'

  // Fallback
  const text = el.textContent?.trim() || ''
  if (text.length > 0) return 'paragraph'
  return null
}

/* ── Image extraction helper ── */

function extractImageUrl(el: Element): string {
  // Try multiple strategies for finding the actual image URL
  // 1. Notion's lazy-loaded real image
  const lazyImg = el.querySelector('img.lazy-image-real, img.lazy-image-loaded') as HTMLImageElement | null
  if (lazyImg?.src && !lazyImg.src.startsWith('data:')) return lazyImg.src

  // 2. Any img inside an asset wrapper
  const assetImg = el.querySelector('.notion-asset-wrapper img, .notion-asset-wrapper-image img') as HTMLImageElement | null
  if (assetImg?.src && !assetImg.src.startsWith('data:')) return assetImg.src

  // 3. Regular img tag
  const img = el.querySelector('img') as HTMLImageElement | null
  if (img?.src && !img.src.startsWith('data:')) return img.src

  // 4. Check for background-image on a div (some Notion image blocks use this)
  const bgEl = el.querySelector('[style*="background-image"]') as HTMLElement | null
  if (bgEl) {
    const match = bgEl.style.backgroundImage.match(/url\(["']?([^"')]+)["']?\)/)
    if (match?.[1]) return match[1]
  }

  // 5. Check data-src for images that haven't lazy-loaded yet
  const dataSrcImg = el.querySelector('img[data-src]') as HTMLImageElement | null
  if (dataSrcImg?.getAttribute('data-src')) return dataSrcImg.getAttribute('data-src')!

  // 6. Source element in picture tag
  const source = el.querySelector('source[srcset]') as HTMLSourceElement | null
  if (source?.srcset) return source.srcset.split(',')[0].trim().split(' ')[0]

  return ''
}

function extractImageCaption(el: Element): string {
  const caption = el.querySelector('.notion-asset-caption, [class*="caption"]')
  if (caption?.textContent?.trim()) return caption.textContent.trim()

  const img = el.querySelector('img') as HTMLImageElement | null
  return img?.alt || ''
}

/* ── Block extraction ── */

function extractBlocks(container: Element): NotionBlock[] {
  const blocks: NotionBlock[] = []
  const blockEls = container.querySelectorAll('[data-block-id]')
  const seen = new Set<string>()

  blockEls.forEach(el => {
    const blockId = el.getAttribute('data-block-id')
    if (!blockId || seen.has(blockId)) return

    // For non-toggle blocks, skip if nested inside an already-processed block
    // But allow children of toggle blocks to be discovered via recursion
    const parent = el.parentElement?.closest('[data-block-id]')
    if (parent) {
      const parentId = parent.getAttribute('data-block-id') || ''
      if (seen.has(parentId)) {
        const parentCls = parent.className || ''
        // Only skip if the parent is NOT a toggle (toggle children are handled recursively)
        if (!parentCls.includes('toggle')) return
      }
    }

    seen.add(blockId)
    const type = classifyBlock(el)
    if (!type) return

    const block: NotionBlock = { type, text: '' }

    if (type === 'image') {
      block.imageUrl = extractImageUrl(el)
      block.text = extractImageCaption(el)
    } else if (type === 'code') {
      block.text = el.querySelector('code, pre')?.textContent?.trim() || el.textContent?.trim() || ''
      const langEl = el.querySelector('[class*="language"]')
      block.language = langEl?.textContent?.trim() || undefined
    } else if (type === 'todo') {
      const checkbox = el.querySelector('input[type="checkbox"]') as HTMLInputElement | null
      block.checked = checkbox?.checked || false
      // Get text without the checkbox
      const textEl = el.querySelector('[class*="to-do-children"], [contenteditable]')
      block.text = textEl?.textContent?.trim() || el.textContent?.trim() || ''
    } else if (type === 'divider') {
      block.text = '---'
    } else if (type === 'toggle') {
      // Get the toggle heading text (first text node, not children)
      const headingEl = el.querySelector('[contenteditable], [class*="toggle-content"] > span, p')
      block.text = headingEl?.textContent?.trim() || el.firstChild?.textContent?.trim() || ''

      // Extract children from the expanded toggle
      // Look for indented/nested content containers
      const childContainer =
        el.querySelector('[class*="toggle-content"] + div') ||
        el.querySelector('.notion-display-contents') ||
        el.querySelector('[class*="indented"]') ||
        el.querySelector('[style*="margin-left"]')

      if (childContainer) {
        const childBlocks = extractChildBlocks(childContainer, seen)
        if (childBlocks.length > 0) block.children = childBlocks
      }

      // If no container found, try extracting all child block-id elements directly
      if (!block.children || block.children.length === 0) {
        const childBlockEls = el.querySelectorAll(':scope > [data-block-id], :scope > div > [data-block-id]')
        const children: NotionBlock[] = []
        childBlockEls.forEach(childEl => {
          const childId = childEl.getAttribute('data-block-id')
          if (!childId || childId === blockId || seen.has(childId)) return
          seen.add(childId)
          const childType = classifyBlock(childEl)
          if (!childType) return
          const child: NotionBlock = { type: childType, text: '' }
          if (childType === 'image') {
            child.imageUrl = extractImageUrl(childEl)
            child.text = extractImageCaption(childEl)
          } else {
            child.text = childEl.textContent?.trim() || ''
          }
          if (child.text || child.imageUrl) children.push(child)
        })
        if (children.length > 0) block.children = children
      }
    } else {
      block.text = el.textContent?.trim() || ''
    }

    if (block.text || block.imageUrl || type === 'divider') {
      blocks.push(block)
    }
  })

  // Fallback: if no data-block-id elements found
  if (blocks.length === 0) {
    const allEls = container.querySelectorAll('h1, h2, h3, p, li, blockquote, pre, img, hr, table, figure')
    allEls.forEach(el => {
      const tag = el.tagName.toLowerCase()
      let type: NotionBlock['type'] = 'paragraph'
      if (tag === 'h1') type = 'heading1'
      else if (tag === 'h2') type = 'heading2'
      else if (tag === 'h3') type = 'heading3'
      else if (tag === 'li') type = 'bullet'
      else if (tag === 'blockquote') type = 'quote'
      else if (tag === 'pre') type = 'code'
      else if (tag === 'img' || tag === 'figure') type = 'image'
      else if (tag === 'hr') type = 'divider'
      else if (tag === 'table') type = 'table'

      const block: NotionBlock = { type, text: el.textContent?.trim() || '' }
      if (type === 'image') {
        block.imageUrl = tag === 'figure' ? extractImageUrl(el) : (el as HTMLImageElement).src
        block.text = tag === 'figure' ? extractImageCaption(el) : (el as HTMLImageElement).alt || ''
      }
      if (block.text || block.imageUrl || type === 'divider') {
        blocks.push(block)
      }
    })
  }

  return blocks
}

/** Extract child blocks within a toggle or nested container */
function extractChildBlocks(container: Element, parentSeen: Set<string>): NotionBlock[] {
  const blocks: NotionBlock[] = []
  const childEls = container.querySelectorAll('[data-block-id]')

  childEls.forEach(el => {
    const blockId = el.getAttribute('data-block-id')
    if (!blockId || parentSeen.has(blockId)) return
    parentSeen.add(blockId)

    const type = classifyBlock(el)
    if (!type) return

    const block: NotionBlock = { type, text: '' }

    if (type === 'image') {
      block.imageUrl = extractImageUrl(el)
      block.text = extractImageCaption(el)
    } else if (type === 'divider') {
      block.text = '---'
    } else if (type === 'toggle') {
      // Nested toggles
      const headingEl = el.querySelector('[contenteditable], p')
      block.text = headingEl?.textContent?.trim() || ''
      const nested = el.querySelector('[class*="indented"], .notion-display-contents, [style*="margin-left"]')
      if (nested) block.children = extractChildBlocks(nested, parentSeen)
    } else {
      block.text = el.textContent?.trim() || ''
    }

    if (block.text || block.imageUrl || type === 'divider') {
      blocks.push(block)
    }
  })

  return blocks
}

/* ── Comment extraction ── */

function extractComments(): NotionComment[] {
  const comments: NotionComment[] = []

  const commentContainers = document.querySelectorAll(
    '[class*="discussion"], [class*="comment-thread"], [class*="sidebar-comment"]'
  )

  commentContainers.forEach(container => {
    const authorEl = container.querySelector('[class*="author"], [class*="user-name"], [class*="name"]')
    const textEl = container.querySelector('[class*="comment-body"], [class*="discussion-body"], [class*="comment-text"]')
    const blockTextEl = container.querySelector('[class*="context"], [class*="referenced"]')

    const author = authorEl?.textContent?.trim() || 'Unknown'
    const text = textEl?.textContent?.trim() || ''
    const blockText = blockTextEl?.textContent?.trim() || ''

    if (text) {
      const replyEls = container.querySelectorAll('[class*="reply"]')
      const replies: { author: string; text: string }[] = []
      replyEls.forEach(replyEl => {
        const replyAuthor = replyEl.querySelector('[class*="author"], [class*="name"]')?.textContent?.trim() || 'Unknown'
        const replyText = replyEl.querySelector('[class*="body"], [class*="text"]')?.textContent?.trim() || replyEl.textContent?.trim() || ''
        if (replyText && replyText !== text) {
          replies.push({ author: replyAuthor, text: replyText })
        }
      })
      comments.push({ blockText, author, text, replies })
    }
  })

  const highlights = document.querySelectorAll('[class*="highlight-yellow"], [style*="background: rgba(255, 212, 0"]')
  highlights.forEach(hl => {
    const text = hl.textContent?.trim() || ''
    if (text && !comments.some(c => c.blockText === text)) {
      comments.push({
        blockText: text,
        author: 'Notion',
        text: `Comment on: "${text}"`,
        replies: [],
      })
    }
  })

  return comments
}

/* ── Detection helpers ── */

export function detectToggles(): boolean {
  return document.querySelectorAll(
    '[class*="toggle"][aria-expanded="false"], ' +
    '.notion-toggle:not(.notion-toggle-open), ' +
    '[class*="toggle-block"]:not([class*="open"])'
  ).length > 0
}

export function detectLazyImages(): boolean {
  return document.querySelectorAll(
    'img.lazy-image:not(.lazy-image-real):not(.lazy-image-loaded), ' +
    'img[data-src]:not([src]), ' +
    '.notion-image img[src*="data:"]'
  ).length > 0
}

/* ── Quick extract: no toggle expansion, no scrolling ── */

export function quickExtractNotionPage(): ExtractedPage {
  const title = getPageTitle()
  const icon = getPageIcon()

  const contentArea =
    document.querySelector('.notion-page-content') ||
    document.querySelector('.notion-frame') ||
    document.querySelector('[class*="notion-page"]') ||
    document.body

  const blocks = extractBlocks(contentArea)
  const comments = extractComments()

  return { title, icon, blocks, comments }
}

/* ── Full extract (async): expands toggles, scrolls for images ── */

export async function extractNotionPage(): Promise<ExtractedPage> {
  const title = getPageTitle()
  const icon = getPageIcon()

  const hasToggles = detectToggles()
  const hasLazy = detectLazyImages()

  // Only do expensive operations if needed
  const expandedToggles = hasToggles ? await expandAllToggles() : []
  if (hasLazy) await scrollToLoadImages()

  const contentArea =
    document.querySelector('.notion-page-content') ||
    document.querySelector('.notion-frame') ||
    document.querySelector('[class*="notion-page"]') ||
    document.body

  const blocks = extractBlocks(contentArea)
  const comments = extractComments()

  // Restore collapsed toggles
  if (expandedToggles.length > 0) {
    await sleep(200)
    collapseToggles(expandedToggles)
  }

  return { title, icon, blocks, comments }
}
