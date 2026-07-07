export function prependHintToStream(
  innerStream: ReadableStream<Uint8Array>,
  hint: string,
): ReadableStream<Uint8Array> {
  const encoder = new TextEncoder()
  return new ReadableStream({
    async start(controller) {
      controller.enqueue(encoder.encode(`data: ${JSON.stringify({ hint })}\n\n`))
      const reader = innerStream.getReader()
      try {
        while (true) {
          const { done, value } = await reader.read()
          if (done) break
          controller.enqueue(value)
        }
      } finally {
        controller.close()
      }
    },
  })
}

export function createSSEStream(
  upstreamResponse: Response,
  provider: 'anthropic' | 'google' | 'openrouter',
): ReadableStream<Uint8Array> {
  const encoder = new TextEncoder()
  const decoder = new TextDecoder()

  return new ReadableStream({
    async start(controller) {
      const reader = upstreamResponse.body?.getReader()
      if (!reader) {
        controller.enqueue(encoder.encode('data: [DONE]\n\n'))
        controller.close()
        return
      }

      let buffer = ''

      try {
        while (true) {
          const { done, value } = await reader.read()
          if (done) break

          buffer += decoder.decode(value, { stream: true })
          const lines = buffer.split('\n')
          buffer = lines.pop() ?? ''

          for (const line of lines) {
            if (!line.startsWith('data: ')) continue
            const data = line.slice(6).trim()

            if (data === '[DONE]') {
              controller.enqueue(encoder.encode('data: [DONE]\n\n'))
              controller.close()
              return
            }

            try {
              const parsed = JSON.parse(data)
              let text: string | undefined

              if (provider === 'anthropic') {
                if (parsed.type === 'content_block_delta') {
                  if (parsed.delta?.type === 'text_delta' && parsed.delta?.text) {
                    text = parsed.delta.text
                  } else if (parsed.delta?.text && parsed.delta?.type !== 'thinking_delta') {
                    text = parsed.delta.text
                  }
                }
                if (parsed.type === 'message_stop') {
                  controller.enqueue(encoder.encode('data: [DONE]\n\n'))
                  controller.close()
                  return
                }
              } else {
                const delta = parsed.choices?.[0]?.delta?.content
                if (delta) text = delta
                if (parsed.choices?.[0]?.finish_reason) {
                  controller.enqueue(encoder.encode('data: [DONE]\n\n'))
                  controller.close()
                  return
                }
              }

              if (text) {
                const chunk = JSON.stringify({ text })
                controller.enqueue(encoder.encode(`data: ${chunk}\n\n`))
              }
            } catch {
              // Ignore non-JSON lines
            }
          }
        }

        controller.enqueue(encoder.encode('data: [DONE]\n\n'))
        controller.close()
      } catch (err) {
        console.error('[studio/generate stream]', err)
        controller.enqueue(
          encoder.encode(`data: ${JSON.stringify({ error: 'Stream error' })}\n\n`),
        )
        controller.enqueue(encoder.encode('data: [DONE]\n\n'))
        controller.close()
      }
    },
  })
}
