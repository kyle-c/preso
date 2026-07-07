import { selectBlueprints } from '../training-blueprints'

export function buildBatchPrompt(
  outline: any[],
  batchIndices: number[],
  userPrompt?: string,
  hasFiles = false,
  intent?: string,
  deckIntelligenceContext = '',
): string {
  const outlineStr = JSON.stringify(outline, null, 2)
  const indices = batchIndices.join(', ')

  let blueprintHint = ''
  if (userPrompt) {
    try {
      const batchSlides = batchIndices.map(i => outline[i]).filter(Boolean)
      const bps = selectBlueprints(userPrompt, batchSlides, 6)
      if (bps.length > 0) {
        blueprintHint = '\n\nStructural guides for these slides:\n' +
          bps.map(bp => `- ${bp.name} (-> ${bp.mapsToType}): ${bp.spec}`).join('\n')
      }
    } catch { /* non-critical */ }
  }

  const fileHint = hasFiles
    ? '\n\nIMPORTANT: The user uploaded source files (PDF/images/data). The content for these slides MUST be derived from the uploaded files — extract the actual text, data, and structure from the source material. Do NOT invent generic content. Recreate the source content using the Félix design system.\n'
    : ''

  const onboardingHint = intent === 'onboarding'
    ? `\n\nCRITICAL — ONBOARDING TEMPLATE: This is an onboarding/welcome deck. You MUST follow the "Employee Onboarding (exactly 10 slides)" template from the system prompt EXACTLY. For each slide index, match the corresponding template slide structure:
- Slide 0 (title, light): Welcome slide — "Bienvenido, [Name]!" with Party Popper illustration. Personalize with the person's name and role from the user prompt.
- Slide 1 (two-column, light): "Who We Are" — Félix mission + products. Use Félix Illo 1 illustration. Keep the exact Félix mission and product descriptions.
- Slide 2 (cards, light): "Our Values" — ALL 6 Félix values VERBATIM: User-Obsession, Getting Sh*t Done With Urgency, Extreme Ownership, No-Ego Collaboration, Aim For Insanely Great, Insatiable Curiosity. Use the exact descriptions from the template.
- Slide 3 (two-column, dark): "Your Role" — Personalized role headline + responsibilities. Use Survey illustration. Left column: narrative about why this role matters. Right column: 6 specific responsibilities.
- Slide 4 (cards, light): "Meet the Team" — Team member cards with varied titleColor. Include new hire card with ⭐ emoji.
- Slide 5 (cards, dark): "First 90 Days" — Three phases: Days 1-30 Immerse (#2BF2F1), Days 31-60 Build (#60D06F), Days 61-90 Scale (#F19D38). Each with 5-6 specific tasks.
- Slide 6 (cards, light): "Your Toolkit" — 8 tool cards (Figma, Notion, Slack, ClickUp, Google Suite, Claude, Omni+Amplitude, role-specific).
- Slide 7 (two-column, brand): "Our Users" — User personas (María, Roberto, Gloria) with emoji icons. Use Hands/Juntos illustration.
- Slide 8 (bullets, light): "Your First Week" — Monday through Friday day-by-day schedule with 📅 icons.
- Slide 9 (closing, dark): Inspirational closing with Rocket Launch illustration. Include Slack channel, manager name, Notion link.

Replace [bracketed placeholders] with content derived from the user's prompt. If the prompt doesn't specify certain details (team members, tools, responsibilities), use plausible defaults for a Félix employee in the specified role.\n`
    : ''

  const otherIndices = outline.map((_: any, i: number) => i).filter((i: number) => !batchIndices.includes(i))
  const contextHint = otherIndices.length > 0
    ? `\nNote: Slides at indices [${otherIndices.join(', ')}] are being generated in parallel. Ensure your slides complement the full narrative — avoid repeating content from other slides' outlines.\n`
    : ''

  const userContext = userPrompt
    ? `\nUSER'S ORIGINAL BRIEF:\n${userPrompt}\n\nUse this context to generate rich, specific content that directly addresses the user's intent. Every slide should reflect the subject matter, domain expertise, and goals described above.\n`
    : ''

  return `You are completing slides for a Félix Pago presentation.
${userContext}
${deckIntelligenceContext}
Here is the FULL presentation outline (${outline.length} slides):
${outlineStr}
${fileHint}${onboardingHint}${contextHint}
Generate FULL content for slides at indices [${indices}] ONLY.

Produce COMPLETE, PRESENTATION-READY slides. The user's brief above is your source material. Use it to generate specific, substantive content with real data, names, and numbers.

For each slide, keep its type, bg, badge, and title from the outline, then populate ALL content fields per the system prompt rules. Every slide MUST have subtitle + body + type-specific fields (bullets/cards/columns/chart/quote). Section slides need a data-specific subtitle, not a topic label.

Add to every content slide: notes (3-5 sentence speaker notes) and imageUrl (pick from: /illustrations/Party%20Popper.svg, /illustrations/Rocket%20Launch%20-%20Growth%20%2B%20Coin%20-%20Turquoise.svg, /illustrations/F%C3%A9lix%20Illo%201.svg, /illustrations/Dollar%20bills%20%2B%20Coins%20A.svg, /illustrations/Flying%20Dollar%20Bills%20-%20Turquoise.svg, /illustrations/Speech%20Bubbles%20%2B%20Hearts.svg, /illustrations/Hand%20-%20Stars.svg, /illustrations/Fast.svg, /illustrations/Magnifying%20Glass.svg, /illustrations/Survey.svg, /illustrations/Lock.svg, /illustrations/ray.svg).
${blueprintHint}
Return ONLY a JSON array of the completed slides (same order as requested). No markdown fences.`
}
