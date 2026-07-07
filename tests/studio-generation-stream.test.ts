import { describe, expect, it, vi } from 'vitest'
import { consumeGenerationStream } from '../lib/studio-generation-stream'

function sseResponse(events: unknown[]): Response {
  const encoder = new TextEncoder()
  const body = new ReadableStream<Uint8Array>({
    start(controller) {
      for (const event of events) {
        if (event === '[DONE]') {
          controller.enqueue(encoder.encode('data: [DONE]\n\n'))
        } else {
          controller.enqueue(encoder.encode(`data: ${JSON.stringify(event)}\n\n`))
        }
      }
      controller.close()
    },
  })
  return new Response(body)
}

describe('consumeGenerationStream', () => {
  it('drives a parallel mocked SSE generation flow end to end', async () => {
    const onHint = vi.fn()
    const onSlides = vi.fn()
    const onDocument = vi.fn()
    const onReady = vi.fn()

    const result = await consumeGenerationStream(
      sseResponse([
        { hint: 'Building outline...' },
        {
          outline: [
            { type: 'title', bg: 'dark', title: 'Draft shell' },
            { type: 'bullets', bg: 'light', title: 'Second shell' },
          ],
        },
        {
          batch: [
            { type: 'title', bg: 'dark', title: 'Launch plan' },
            { type: 'bullets', bg: 'light', title: 'Launch moves', bullets: [{ text: 'Ship the beta' }] },
          ],
          startIndex: 0,
        },
        { slidesReady: true },
        { document: { title: 'Launch plan doc', sections: [] } },
        '[DONE]',
      ]),
      { onHint, onSlides, onDocument, onReady },
    )

    expect(result.ok).toBe(true)
    expect(result.mode).toBe('parallel')
    expect(result.slides).toHaveLength(2)
    expect(onHint).toHaveBeenCalledWith('Building outline...')
    expect(onSlides).toHaveBeenLastCalledWith(result.slides)
    expect(onReady).toHaveBeenCalledWith({ slides: result.slides, mode: 'parallel' })
    expect(onDocument).toHaveBeenCalledWith({ title: 'Launch plan doc', sections: [] })
  })

  it('surfaces SSE errors and stops the flow', async () => {
    const onError = vi.fn()
    const onReady = vi.fn()

    const result = await consumeGenerationStream(
      sseResponse([{ error: 'Bad API key' }, '[DONE]']),
      { onError, onReady },
    )

    expect(result.ok).toBe(false)
    expect(result.error).toBe('Bad API key')
    expect(onError).toHaveBeenCalledWith('Bad API key')
    expect(onReady).not.toHaveBeenCalled()
  })

  it('emits deck intelligence quality events', async () => {
    const onDeckQuality = vi.fn()

    const result = await consumeGenerationStream(
      sseResponse([
        { deckQuality: { score: 68, passed: false, deckType: 'Product roadmap / portfolio plan' } },
        '[DONE]',
      ]),
      { onDeckQuality },
    )

    expect(onDeckQuality).toHaveBeenCalledWith({ score: 68, passed: false, deckType: 'Product roadmap / portfolio plan' })
    expect(result.ok).toBe(false)
    expect(result.error).toBe('Could not parse slides from the response. Please try again.')
  })

  it('drives a sequential mocked SSE flow with a document payload', async () => {
    const onSlides = vi.fn()
    const onReady = vi.fn()
    const responseText = JSON.stringify({
      slides: [
        { type: 'title', bg: 'dark', title: 'Sequential launch' },
      ],
      document: {
        title: 'Sequential launch doc',
        type: 'brief',
        summary: 'A narrative brief',
        sections: [{ title: 'Overview', content: 'Ship it.' }],
      },
    })

    const result = await consumeGenerationStream(
      sseResponse([{ text: responseText }, '[DONE]']),
      { onSlides, onReady },
    )

    expect(result.ok).toBe(true)
    expect(result.mode).toBe('sequential')
    expect(onSlides).toHaveBeenCalledWith([{ type: 'title', bg: 'dark', title: 'Sequential launch' }])
    expect(onReady).toHaveBeenCalledWith({
      slides: [{ type: 'title', bg: 'dark', title: 'Sequential launch' }],
      mode: 'sequential',
      document: {
        title: 'Sequential launch doc',
        type: 'brief',
        summary: 'A narrative brief',
        sections: [{ title: 'Overview', content: 'Ship it.' }],
      },
    })
  })
})
