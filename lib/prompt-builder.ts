/**
 * Prompt builder — system prompts and generation constants.
 *
 * Contains the main SYSTEM_PROMPT, OUTLINE_SYSTEM_PROMPT,
 * onboarding template, and fast outline model mappings.
 *
 * The actual SYSTEM_PROMPT content remains in route.ts for now
 * due to its size (~740 lines). This module re-exports it and
 * provides the supporting constants.
 */

// #2: Fast models for outline phase (cheap + fast, quality doesn't matter for structure)
export const FAST_OUTLINE_MODELS: Record<string, string> = {
  anthropic: 'claude-haiku-4-5-20251001',
  openrouter: 'google/gemini-2.5-flash',
}

export const OUTLINE_SYSTEM_PROMPT = `You are a presentation architect for Félix Pago, a fintech empowering Latinos in the US.

Given a brief, output a JSON array of 12-18 slide outlines. Each outline:
{"type": "...", "bg": "dark"|"light"|"brand", "badge": "...", "title": "..."}

Types: title, section, content, bullets, two-column, cards, quote, image, checklist, chart, closing.

Rules:
- Start with "title" (bg "brand"), end with "closing"
- Title slide: max 6 words title, max 8 words subtitle
- Alternate bg — never two consecutive same bg
- "brand" sparingly (title, closing, one accent)
- At least 6 types — include 1+ chart, 1+ cards, 1+ two-column
- Insight-driven titles: "Revenue grew 22% organically" not "Revenue Overview"
- Badge categorizes sections: "Overview", "Key Insight", "Your Role"
- 14-16 slides for strategy/investor/launch decks
- Onboarding: EXACTLY 10 slides, bg: light, light, light, dark, light, dark, light, brand, light, dark

Return ONLY the JSON array.`

// #6: Pre-built onboarding template outline (skips the outline API call entirely)
export const ONBOARDING_OUTLINE = [
  { type: 'title', bg: 'light', badge: 'Welcome to Félix', title: 'Bienvenido!', notes: 'Warm welcome slide. Include the new hire\'s name if available, the team they\'re joining, and their start date. Set an excited, inclusive tone.' },
  { type: 'two-column', bg: 'light', badge: 'About Félix', title: 'Who We Are', notes: 'Left column: Félix Pago\'s mission to empower Latinos in the US with accessible financial services. Right column: Key company stats — founding year, team size, users served, funding raised. Make it concrete with numbers.' },
  { type: 'cards', bg: 'light', badge: '', title: 'Our Values', notes: 'Present 3-4 core company values as cards. Each card: bold value name + 2-3 sentences explaining what it means in practice with a specific example. Values should feel actionable, not corporate platitudes.' },
  { type: 'two-column', bg: 'dark', badge: 'Your Role', title: 'Your Role', notes: 'Left column: Role title, team, reporting structure, key responsibilities (4-5 specific items). Right column: What success looks like in 30/60/90 days — concrete deliverables, not vague goals.' },
  { type: 'cards', bg: 'light', badge: 'Your People', title: 'Meet the Team', notes: 'Cards for 4-6 key teammates. Each card: name, role, fun fact or expertise area, and how they\'ll interact with the new hire. Include direct manager and cross-functional partners.' },
  { type: 'cards', bg: 'dark', badge: 'Your Roadmap', title: 'First 90 Days', notes: 'Three cards for 30/60/90 day milestones. Each card: specific goals, key projects, skills to develop, people to meet. Be concrete — "Ship first PR" not "Get oriented."' },
  { type: 'cards', bg: 'light', badge: 'Getting Set Up', title: 'Your Toolkit', notes: 'Cards for essential tools: Slack channels to join, GitHub repos to clone, Figma files to bookmark, key docs to read. Include specific links or names where possible.' },
  { type: 'two-column', bg: 'brand', badge: "Who You'll Serve", title: 'Our Users', notes: 'Left column: User demographics — 62M Latinos in the US, pain points (high remittance fees, limited banking access, language barriers). Right column: User stories or personas with specific details about how they use Félix.' },
  { type: 'bullets', bg: 'light', badge: 'Getting Started', title: 'Your First Week', notes: 'Day-by-day checklist for week one: Day 1 (laptop setup, team lunch, HR paperwork), Day 2 (codebase tour, dev environment), Day 3 (shadow a teammate), Day 4 (first small task), Day 5 (1:1 with manager, week 1 retro). Be specific and actionable.' },
  { type: 'closing', bg: 'dark', badge: '', title: 'Welcome aboard', notes: 'Encouraging closing message. Include who to reach out to with questions (manager name, buddy name), link to the team Slack channel, and a motivating note about the impact they\'ll make.' },
]
