import { formatChartConstraint } from '../data-viz-intelligence'
import { strengthenPrompt } from '../prompt-strengthener'
import { SYSTEM_PROMPT } from '../prompt-builder'
import { guessImageMediaType } from '../provider-adapter'
import type { GenerateBody } from './types'

export function buildTemplateConstraint(template: GenerateBody['templateStructure']): string {
  if (!template) return ''
  const sectionList = template.sections
    .map((s, i) => `  ${i + 1}. type: "${s.type}"${s.title ? ` - "${s.title}"` : ''}${s.tone ? ` (tone: ${s.tone})` : ''}`)
    .join('\n')
  return `\n\n## Template Structure (FOLLOW THIS STRUCTURE)\nGenerate exactly ${template.slideCount} slides following this structure:\n${sectionList}\n\nUse these slide types and ordering as your guide. Fill in content based on the user's prompt while preserving the template structure.`
}

export function buildAnthropicPayload(body: GenerateBody) {
  let promptText = body.edit ? body.prompt : strengthenPrompt(body.prompt).strengthenedPrompt
  if (body.templateStructure) promptText += buildTemplateConstraint(body.templateStructure)
  const content: any[] = [{ type: 'text', text: promptText }]

  for (const file of body.files ?? []) {
    if (file.type === 'image') {
      const mediaType = guessImageMediaType(file.name)
      const base64 = file.data.includes(',') ? file.data.split(',')[1] : file.data
      content.push({
        type: 'image',
        source: { type: 'base64', media_type: mediaType, data: base64 },
      })
    } else if (file.type === 'pdf') {
      const base64 = file.data.includes(',') ? file.data.split(',')[1] : file.data
      content.push({
        type: 'document',
        source: { type: 'base64', media_type: 'application/pdf', data: base64 },
      })
    } else if (file.type === 'data') {
      const chartHint = formatChartConstraint(file.data)
      content.push({
        type: 'text',
        text: `\n\n--- Data file: ${file.name} ---\n${file.data}\n--- End of ${file.name} ---\n\nAnalyze this data and create appropriate data visualization slides.${chartHint}`,
      })
    }
  }

  const isExtendedThinking = body.model.includes('sonnet-4-5')

  const payload: any = {
    model: body.model,
    max_tokens: isExtendedThinking ? 32000 : 32768,
    stream: true,
    system: body.enrichedSystemPrompt || SYSTEM_PROMPT,
    messages: [{ role: 'user', content }],
  }

  if (!isExtendedThinking) {
    payload.temperature = 0.7
  }

  if (isExtendedThinking) {
    payload.thinking = {
      type: 'enabled',
      budget_tokens: 10000,
    }
  }

  return payload
}

export function buildOpenRouterPayload(body: GenerateBody) {
  let promptText = body.edit ? body.prompt : strengthenPrompt(body.prompt).strengthenedPrompt
  if (body.templateStructure) promptText += buildTemplateConstraint(body.templateStructure)
  const content: any[] = [{ type: 'text', text: promptText }]

  for (const file of body.files ?? []) {
    if (file.type === 'image') {
      const mediaType = guessImageMediaType(file.name)
      const dataUrl = file.data.startsWith('data:') ? file.data : `data:${mediaType};base64,${file.data}`
      content.push({
        type: 'image_url',
        image_url: { url: dataUrl },
      })
    } else if (file.type === 'pdf') {
      content.push({
        type: 'text',
        text: `[PDF attached: ${file.name}]`,
      })
    } else if (file.type === 'data') {
      const chartHint = formatChartConstraint(file.data)
      content.push({
        type: 'text',
        text: `\n\n--- Data file: ${file.name} ---\n${file.data}\n--- End of ${file.name} ---\n\nAnalyze this data and create appropriate data visualization slides.${chartHint}`,
      })
    }
  }

  return {
    model: body.model,
    max_tokens: 32768,
    stream: true,
    temperature: 0.7,
    messages: [
      { role: 'system', content: body.enrichedSystemPrompt || SYSTEM_PROMPT },
      { role: 'user', content },
    ],
  }
}
