/**
 * JSON parser for LLM responses.
 *
 * Handles markdown fences, leading text, incomplete JSON,
 * and nested brace/bracket matching.
 */

/** Parse JSON from LLM response (handles markdown fences and leading text) */
export function parseJSONResponse(text: string): any {
  const clean = text.replace(/```(?:json)?\s*/gi, '').replace(/```/g, '').trim()

  // Try direct parse first
  try { return JSON.parse(clean) } catch (_e) { /* fall through */ }

  // Find the first { or [ and extract the JSON object/array
  const startObj = clean.indexOf('{')
  const startArr = clean.indexOf('[')
  const start = startObj >= 0 && (startArr < 0 || startObj < startArr) ? startObj : startArr
  if (start < 0) throw new Error('No JSON found in response')

  const openChar = clean[start]
  const closeChar = openChar === '{' ? '}' : ']'
  let depth = 0; let inStr = false; let esc = false

  for (let i = start; i < clean.length; i++) {
    const ch = clean[i]
    if (esc) { esc = false; continue }
    if (ch === '\\') { esc = true; continue }
    if (ch === '"') { inStr = !inStr; continue }
    if (inStr) continue
    if (ch === openChar) depth++
    else if (ch === closeChar) {
      depth--
      if (depth === 0) {
        return JSON.parse(clean.slice(start, i + 1))
      }
    }
  }

  throw new Error('Incomplete JSON in response')
}
