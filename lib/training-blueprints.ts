/**
 * Training Blueprints
 *
 * Structural wireframe blueprints extracted from best-in-class presentation
 * templates in /training/. These specify LAYOUT RULES, CONTENT AMOUNTS,
 * and VISUAL TREATMENTS following the Félix design system.
 *
 * Each blueprint maps to an existing slide type and provides:
 * - Layout hierarchy (what goes where, in what order)
 * - Content density (how much text, how many items)
 * - Structural constraints (max bullets, card counts, column balance)
 * - Visual treatment (bg mode, titleColor palette, illustration, typography)
 */

import type { DocumentType } from './prompt-strengthener'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type BlueprintCategory =
  | 'product-dev'
  | 'data-viz'
  | 'hr-recruiting'
  | 'corporate-strategy'
  | 'device-frames'

interface SlideBlueprint {
  id: string
  name: string
  category: BlueprintCategory
  mapsToType: string // slide type: title, cards, two-column, chart, etc.
  /** Compact structural spec — injected into prompt */
  spec: string
  /** Visual treatment following Félix design system */
  visual: string
  /** Keywords that trigger this blueprint */
  signals: string[]
  /** Literal JSON skeleton the AI should copy and fill in. When present, the AI
   *  MUST use this exact structure — only replacing placeholder text. */
  skeleton?: Record<string, unknown>
}

// ---------------------------------------------------------------------------
// Intent → Category mapping
// ---------------------------------------------------------------------------

const INTENT_CATEGORIES: Record<DocumentType, BlueprintCategory[]> = {
  prd:        ['product-dev', 'device-frames', 'data-viz'],
  launch:     ['product-dev', 'device-frames', 'data-viz'],
  review:     ['data-viz', 'corporate-strategy', 'product-dev'],
  research:   ['product-dev', 'data-viz'],
  proposal:   ['corporate-strategy', 'data-viz'],
  strategy:   ['corporate-strategy', 'data-viz'],
  onboarding: ['hr-recruiting', 'product-dev'],
  general:    ['product-dev', 'data-viz', 'corporate-strategy'],
}

// ---------------------------------------------------------------------------
// Blueprint Library
// ---------------------------------------------------------------------------

const BLUEPRINTS: SlideBlueprint[] = [
  // ═══════════════════════════════════════════════
  // PRODUCT DEVELOPMENT
  // ═══════════════════════════════════════════════

  {
    id: 'pd-agenda',
    name: 'Agenda',
    category: 'product-dev',
    mapsToType: 'bullets',
    spec: '6 items max. Each item: large light-gray number (01-06) + topic name + right-aligned time estimate. Items separated by thin dividers. Keep topic names to 3-5 words.',
    visual: 'bg: light (Stone #EFEBE7). Headings: Plain font-black. Body: Saans font-normal. Numbers in Mocha #877867. Badge: "Agenda" pill. No illustration — clean typographic slide.',
    signals: ['agenda', 'outline', 'topics', 'schedule'],
    skeleton: {
      type: 'bullets', bg: 'light', badge: 'Agenda', title: 'Today\'s Agenda',
      bullets: [
        { text: '**01** · Welcome & context — 5 min', icon: '📋' },
        { text: '**02** · Q1 results review — 15 min', icon: '📋' },
        { text: '**03** · Product roadmap update — 10 min', icon: '📋' },
        { text: '**04** · Team announcements — 5 min', icon: '📋' },
        { text: '**05** · Open discussion — 10 min', icon: '📋' },
        { text: '**06** · Next steps & owners — 5 min', icon: '📋' },
      ],
      notes: 'Agenda slide with numbered items and time estimates. Keep topic names to 3-5 words. 6 items max.',
    },
  },
  {
    id: 'pd-team',
    name: 'Team Introduction',
    category: 'product-dev',
    mapsToType: 'cards',
    spec: '4-6 cards in responsive grid. Each card: person name as title + "[Title] — [1-sentence role description]" as body. Include imageUrl for team illustration. Max 12 words per card body.',
    visual: 'bg: dark (Slate #082422). titleColors: cycle Turquoise #2BF2F1, Cactus #60D06F, Mango #F19D38, Blueberry #6060BF. Badge: "The Team" pill. imageUrl: /illustrations/Hands%20-%202%20Cell%20Phones%20-%20Juntos%20we%20Succeed.svg. Card body text: Stone #EFEBE7.',
    signals: ['team', 'people', 'introduce', 'members', 'who we are'],
  },
  {
    id: 'pd-strategic-pillars',
    name: 'Strategic Pillars',
    category: 'product-dev',
    mapsToType: 'cards',
    spec: '3-4 cards with numbered titles ("01 · Pillar Name"). Each body: 2-3 sentences describing the initiative, key metric, and owner. Vary titleColor across secondary palette.',
    visual: 'bg: light (Stone #EFEBE7). titleColors: Blueberry #6060BF, Papaya #F26629, Evergreen #35605F, Sage #7BA882. Badge: "Strategy" pill. Heading: Plain font-black in Slate #082422. Card body: Saans in Slate.',
    signals: ['pillar', 'strategic', 'initiative', 'priority', 'focus area'],
    skeleton: {
      type: 'cards', bg: 'light', badge: 'Strategy', title: 'Strategic Pillars',
      cards: [
        { title: '01 · Pillar Name', titleColor: '#6060BF', body: '2-3 sentences describing the initiative scope, the key metric it moves, and who owns it. Be specific about measurable outcomes.' },
        { title: '02 · Pillar Name', titleColor: '#F26629', body: '2-3 sentences describing the initiative scope, the key metric it moves, and who owns it. Be specific about measurable outcomes.' },
        { title: '03 · Pillar Name', titleColor: '#35605F', body: '2-3 sentences describing the initiative scope, the key metric it moves, and who owns it. Be specific about measurable outcomes.' },
      ],
      notes: 'Strategic pillars with numbered titles. Each card body MUST be 2-3 full sentences.',
    },
  },
  {
    id: 'pd-okr',
    name: 'OKR / Goals',
    category: 'product-dev',
    mapsToType: 'two-column',
    spec: 'Left column: 2 objectives with bold titles. Under each: 2-3 key results as bullet items with percentage progress. Right column: summary card with overall completion rate and key insight. Total: 4-6 KRs.',
    visual: 'bg: dark (Slate #082422). Headings: Plain font-black in Turquoise #2BF2F1. Body text: Stone #EFEBE7. Progress percentages: Cactus #60D06F (on-track) or Mango #F19D38 (at-risk). Badge: "OKRs" pill. imageUrl: /illustrations/Rocket%20Launch%20-%20Growth%20%2B%20Coin%20-%20Turquoise.svg.',
    signals: ['okr', 'objective', 'key result', 'goal', 'target'],
    skeleton: {
      type: 'two-column', bg: 'dark', badge: 'OKRs', title: 'Goals for Q1 2026',
      columns: [
        {
          heading: 'Objectives & Key Results',
          body: '**Objective 1: [Name]**',
          bullets: [
            { text: 'KR1: [Metric] from X → Y — **72% complete**', icon: '✓' },
            { text: 'KR2: [Metric] from X → Y — **45% complete**', icon: '→' },
            { text: '**Objective 2: [Name]**' },
            { text: 'KR3: [Metric] from X → Y — **88% complete**', icon: '✓' },
            { text: 'KR4: [Metric] from X → Y — **31% complete**', icon: '⚠' },
          ],
        },
        {
          heading: 'Summary',
          body: 'Overall completion: **59%** — On track for 3 of 4 KRs.',
          bullets: [
            { text: 'Top performer: KR3 at 88%, driven by [reason]', icon: '✓' },
            { text: 'At risk: KR4 at 31%, blocked by [reason]', icon: '⚠' },
            { text: 'Action: [Specific next step to unblock KR4]', icon: '→' },
          ],
        },
      ],
      imageUrl: '/illustrations/Rocket%20Launch%20-%20Growth%20%2B%20Coin%20-%20Turquoise.svg',
      notes: 'OKR slide with two columns. Left: objectives and KRs with progress. Right: summary and action items.',
    },
  },
  {
    id: 'pd-persona',
    name: 'User Persona',
    category: 'product-dev',
    mapsToType: 'two-column',
    spec: 'Left column: persona name, demographics (age, location, role), italic serif quote (1-2 sentences). Right column: 3 sections — Needs (3 items), Pain Points (3 items), Goals (3 items) with emoji icons. Total ~120 words.',
    visual: 'bg: light (Stone #EFEBE7). Persona name: Plain font-black in Slate #082422. Quote: italic Saans. Section labels: Evergreen #35605F uppercase tracking-widest. Badge: "Persona" pill. imageUrl: /illustrations/Hand%20-%20Stars.svg.',
    signals: ['persona', 'user profile', 'target user', 'customer segment'],
  },
  {
    id: 'pd-journey',
    name: 'Customer Journey Map',
    category: 'product-dev',
    mapsToType: 'cards',
    spec: '5 stage cards in sequence: "Awareness", "Consideration", "Onboarding", "First Use", "Retention". Each body: touchpoint description (1 sentence) + key metric + opportunity. Max 30 words per card.',
    visual: 'bg: dark (Slate #082422). titleColors: sequence Turquoise #2BF2F1 → Cactus #60D06F → Mango #F19D38 → Papaya #F26629 → Lychee #FFCD9C (progression gradient). Badge: "Journey" pill. Card body: Stone #EFEBE7.',
    signals: ['journey', 'funnel stage', 'touchpoint', 'customer flow', 'user flow'],
  },
  {
    id: 'pd-problem',
    name: 'Problem Statement',
    category: 'product-dev',
    mapsToType: 'content',
    spec: 'Large centered statement: "[User segment] struggles to [action] because [root cause], which results in [negative outcome]." Below: 3 supporting evidence stats as bold number + description. Max 40 words for the statement.',
    visual: 'bg: dark (Slate #082422). Statement: Plain font-black in Stone #EFEBE7, large (text-4xl+). Stat numbers: Turquoise #2BF2F1 bold. Stat descriptions: Stone #EFEBE7 Saans. Badge: "The Problem" pill. imageUrl: /illustrations/Magnifying%20Glass.svg.',
    signals: ['problem', 'challenge', 'pain point', 'issue', 'struggle'],
  },
  {
    id: 'pd-roadmap',
    name: 'Quarterly Roadmap',
    category: 'product-dev',
    mapsToType: 'cards',
    spec: '4 cards: "Q1", "Q2", "Q3", "Q4". Each body: 3-4 initiatives with status indicators ("✓ Shipped", "→ In Progress", "○ Planned"). Max 5 items per quarter. Vary titleColor per quarter.',
    visual: 'bg: light (Stone #EFEBE7). titleColors: Blueberry #6060BF (Q1), Evergreen #35605F (Q2), Papaya #F26629 (Q3), Sage #7BA882 (Q4). Shipped items: Evergreen. In-progress: Mocha #877867. Badge: "Roadmap" pill. Heading: Plain font-black.',
    signals: ['roadmap', 'quarterly', 'timeline', 'plan', 'milestones'],
  },
  {
    id: 'pd-before-after',
    name: 'Before / After Comparison',
    category: 'product-dev',
    mapsToType: 'two-column',
    spec: 'Left column heading "Before" with 3-4 metrics or descriptions. Right column heading "After" with improved values. Include percentage change for each metric. Bold the delta. Max 6 comparison points.',
    visual: 'bg: light (Stone #EFEBE7). Column headings: Plain font-bold uppercase tracking-widest in Mocha #877867. "Before" values: Slate #082422. "After" values: Evergreen #35605F. Delta percentages: bold Blueberry #6060BF. Badge: "Impact" pill.',
    signals: ['before', 'after', 'comparison', 'improvement', 'change'],
  },
  {
    id: 'pd-now-next-later',
    name: 'Now / Next / Later',
    category: 'product-dev',
    mapsToType: 'cards',
    spec: '3 cards: "Now" (current quarter, committed), "Next" (next quarter, planned), "Later" (future, exploratory). Each body: 3-4 initiative names with 1-line descriptions. Total ~90 words across all cards.',
    visual: 'bg: dark (Slate #082422). titleColors: Turquoise #2BF2F1 (Now), Cactus #60D06F (Next), Mango #F19D38 (Later). Card body: Stone #EFEBE7 Saans. Badge: "Priorities" pill. imageUrl: /illustrations/Fast.svg.',
    signals: ['now next later', 'priority', 'prioritiz', 'backlog', 'triage'],
  },
  {
    id: 'pd-risk-register',
    name: 'Risk Register',
    category: 'product-dev',
    mapsToType: 'cards',
    spec: '4-5 cards on dark bg. Each title = risk name. Body: "**Likelihood:** High/Med/Low · **Impact:** Critical/Major/Minor · **Mitigation:** [1-sentence action] · **Owner:** [name]". Max 35 words per card.',
    visual: 'bg: dark (Slate #082422). titleColors: Mango #F19D38 (high risk), Lychee #FFCD9C (medium), Cactus #60D06F (low). Body: Stone #EFEBE7. Bold labels: Turquoise #2BF2F1. Badge: "Risks" pill. imageUrl: /illustrations/Lock.svg.',
    signals: ['risk', 'mitigation', 'contingency', 'threat'],
  },
  {
    id: 'pd-next-steps',
    name: 'Next Steps / Action Items',
    category: 'product-dev',
    mapsToType: 'cards',
    spec: '3-4 cards on dark bg. Action item as title. Body = "Owner: [name] · Deadline: [date] · Dependencies: [list]". Keep titles to 5-8 words. Each card body max 20 words.',
    visual: 'bg: dark (Slate #082422). titleColors: cycle Turquoise #2BF2F1, Cactus #60D06F, Lychee #FFCD9C. Body: Stone #EFEBE7 Saans. Badge: "Next Steps" pill. imageUrl: /illustrations/3%20Paper%20Airplanes%20%2B%20Coins.svg.',
    signals: ['next step', 'action item', 'todo', 'follow up', 'takeaway'],
  },

  // ═══════════════════════════════════════════════
  // DATA VISUALIZATION
  // ═══════════════════════════════════════════════

  {
    id: 'dv-hero-metric',
    name: 'Hero Metric',
    category: 'data-viz',
    mapsToType: 'content',
    spec: 'Centered layout. Section label (small uppercase) → insight-driven title → enormous metric value bolded ("**2.4M**") → muted date label → 2 inline trend pills ("**+18.2% MoM** · **+142% YoY**"). Title IS the takeaway. Max 15 words for title.',
    visual: 'bg: dark (Slate #082422). Metric value: Plain font-black in Turquoise #2BF2F1, enormous (text-7xl+). Title: Stone #EFEBE7 Plain font-black. Trend pills: Cactus #60D06F (positive) or Papaya #F26629 (negative). Date label: Concrete #CFCABF. Badge: section label pill.',
    signals: ['hero metric', 'big number', 'headline stat', 'key metric', 'north star'],
  },
  {
    id: 'dv-kpi-grid',
    name: 'KPI Grid (4-up)',
    category: 'data-viz',
    mapsToType: 'cards',
    spec: '4 cards in responsive grid. Each card: metric value as title (e.g., "$3.4M"), body = "Metric Name · +22% YoY" with trend context. Vary titleColor. Keep each body to 8-12 words. Include direction indicator (↑/↓).',
    visual: 'bg: light (Stone #EFEBE7). titleColors: Blueberry #6060BF, Papaya #F26629, Evergreen #35605F, Sage #7BA882. Metric titles: Plain font-black. Body: Saans in Slate #082422. Trend arrows: Evergreen (↑) or Papaya (↓). Badge: "KPIs" pill.',
    signals: ['kpi', 'dashboard', 'metrics', 'scorecard', '4-up'],
  },
  {
    id: 'dv-bar-chart',
    name: 'Bar Chart',
    category: 'data-viz',
    mapsToType: 'chart',
    spec: 'Title = insight (e.g., "Organic channels drive 73% of revenue"). Body = 1-2 sentence "so what" implication. Chart: 6-12 bars with realistic data. Highlight the bar that matters in accent color, muted tones for context. Label key values directly on bars.',
    visual: 'bg: dark (Slate #082422). Chart colors: highlight bar Turquoise #2BF2F1, context bars Evergreen #35605F. Title: Plain font-black in Stone #EFEBE7. Body: Saans in Stone. Axis labels: Concrete #CFCABF. Badge: category pill.',
    signals: ['bar chart', 'comparison', 'ranking', 'category', 'breakdown'],
  },
  {
    id: 'dv-line-trend',
    name: 'Line / Trend Chart',
    category: 'data-viz',
    mapsToType: 'chart',
    spec: 'Title = trajectory insight ("Monthly active users grew 3x in 6 months"). Body = trend explanation + inflection point commentary. Chart: 12-30 data points for smooth line. Area fill below for emphasis. Annotate inflection points.',
    visual: 'bg: light (Stone #EFEBE7). Chart line: Blueberry #6060BF. Area fill: Blueberry at 20% opacity. Annotations: Papaya #F26629. Title: Plain font-black in Slate #082422. Axis: Mocha #877867. Badge: category pill.',
    signals: ['trend', 'time series', 'growth', 'trajectory', 'over time', 'monthly', 'weekly'],
  },
  {
    id: 'dv-stacked-bar',
    name: 'Stacked Bar Chart',
    category: 'data-viz',
    mapsToType: 'chart',
    spec: 'Title = composition insight ("Enterprise segment now accounts for 42% of revenue"). Body = shift explanation. Chart: 4-8 stacked bars showing composition over time. Use 3-4 distinct segments with brand-adjacent colors. Show totals above each bar.',
    visual: 'bg: dark (Slate #082422). Chart segments: Turquoise #2BF2F1, Mango #F19D38, Cactus #60D06F, Papaya #F26629 (high contrast separation). Totals: Stone #EFEBE7. Title: Plain font-black Stone. Legend: Saans in Concrete #CFCABF.',
    signals: ['stacked', 'composition', 'segment mix', 'breakdown over time', 'revenue mix'],
  },
  {
    id: 'dv-donut',
    name: 'Donut / Part-to-Whole',
    category: 'data-viz',
    mapsToType: 'chart',
    spec: 'Title = share insight ("Direct traffic drives majority of conversions"). Body = distribution summary with top 2-3 segments called out. Chart: donut with 4-6 segments. Legend below with percentages. Largest segment highlighted.',
    visual: 'bg: light (Stone #EFEBE7). Chart segments: Blueberry #6060BF (largest), Papaya #F26629, Evergreen #35605F, Mocha #877867, Sage #7BA882 (min 3 hue steps between adjacent). Title: Plain font-black Slate. Legend: Saans.',
    signals: ['donut', 'pie', 'share', 'distribution', 'part-to-whole', 'mix'],
  },
  {
    id: 'dv-funnel',
    name: 'Funnel Analysis',
    category: 'data-viz',
    mapsToType: 'chart',
    spec: 'Title = drop-off insight ("Conversion drops 64% between Sign Up and Activation"). Body = biggest opportunity statement. Chart: horizontal-bar with 5 stages, progressively smaller values. Label each stage with name + percentage + absolute number.',
    visual: 'bg: dark (Slate #082422). Funnel bars: gradient from Turquoise #2BF2F1 (top) → Mango #F19D38 (bottom, smallest). Labels: Stone #EFEBE7. Drop-off percentages: Papaya #F26629 bold. Title: Plain font-black Stone. Badge: "Funnel" pill.',
    signals: ['funnel', 'conversion', 'drop-off', 'pipeline', 'stages'],
  },
  {
    id: 'dv-comparison-table',
    name: 'Segment Comparison',
    category: 'data-viz',
    mapsToType: 'two-column',
    spec: 'Left column: markdown table comparing 3 segments across 5-7 metrics (rows). Bold the winning values. Right column: key insight card with 2-3 bullet takeaways. Title = comparison insight.',
    visual: 'bg: light (Stone #EFEBE7). Table headers: Plain font-bold uppercase in Evergreen #35605F. Winning values: bold Blueberry #6060BF. Insight card: Saans. Title: Plain font-black Slate. Badge: "Analysis" pill.',
    signals: ['segment', 'compare', 'cohort', 'versus', 'benchmark'],
  },
  {
    id: 'dv-ab-test',
    name: 'A/B Test Results',
    category: 'data-viz',
    mapsToType: 'two-column',
    spec: 'Left column heading "Control (A)" with key metric + sample size. Right column heading "Variant (B)" with improved metric + "**+XX% lift** · p < 0.01 · 99.4% confidence". Below: recommendation. Bold the lift.',
    visual: 'bg: dark (Slate #082422). Column headings: Plain font-bold uppercase in Concrete #CFCABF. Control metric: Stone #EFEBE7. Variant metric: Turquoise #2BF2F1 bold. Lift: Cactus #60D06F bold. Confidence: Lychee #FFCD9C. Badge: "Experiment" pill.',
    signals: ['a/b test', 'experiment', 'variant', 'control', 'hypothesis'],
  },
  {
    id: 'dv-waterfall',
    name: 'Waterfall / Bridge Chart',
    category: 'data-viz',
    mapsToType: 'chart',
    spec: 'Title = bridge insight ("Price increases offset volume decline to deliver +$2.1M net growth"). Body = key driver explanation. Chart: bar chart showing starting value → additions (green) → subtractions (red) → ending value. 5-8 columns.',
    visual: 'bg: light (Stone #EFEBE7). Additions: Cactus #60D06F. Subtractions: Papaya #F26629. Start/end totals: Blueberry #6060BF. Labels: Slate #082422 Saans. Title: Plain font-black Slate. Badge: "Bridge" pill.',
    signals: ['waterfall', 'bridge', 'variance', 'walk', 'build-up'],
  },
  {
    id: 'dv-scatter',
    name: 'Scatter / Correlation',
    category: 'data-viz',
    mapsToType: 'chart',
    spec: 'Title = correlation insight ("Higher engagement correlates with 2.3x better retention"). Body = relationship explanation + outlier commentary. Chart: scatter with quadrant labels. Variable dot sizes for third dimension. Annotate outliers.',
    visual: 'bg: dark (Slate #082422). Dots: Turquoise #2BF2F1 (primary cluster), Mango #F19D38 (outliers). Quadrant dividers: Evergreen #35605F dashed. Labels: Stone #EFEBE7 Saans. Title: Plain font-black Stone. imageUrl: /illustrations/Magnifying%20Glass.svg.',
    signals: ['scatter', 'correlation', 'relationship', 'quadrant', 'bubble'],
  },
  {
    id: 'dv-dashboard',
    name: 'Dashboard (4-panel)',
    category: 'data-viz',
    mapsToType: 'cards',
    spec: '4 cards in 2×2 grid. Each card: metric name as title, body = large bold value + trend + sparkline description. Mix of revenue, users, conversion, satisfaction metrics. Keep each card body to 15-20 words.',
    visual: 'bg: light (Stone #EFEBE7). titleColors: Blueberry #6060BF, Evergreen #35605F, Papaya #F26629, Sage #7BA882. Metric values: Plain font-black. Trends: Saans — positive in Evergreen, negative in Papaya. Badge: "Dashboard" pill.',
    signals: ['dashboard', 'executive summary', 'overview', 'at a glance'],
  },

  // ═══════════════════════════════════════════════
  // CORPORATE STRATEGY
  // ═══════════════════════════════════════════════

  {
    id: 'cs-exec-summary',
    name: 'Executive Summary',
    category: 'corporate-strategy',
    mapsToType: 'two-column',
    spec: 'Left column: italicized thesis statement (2-3 sentences). Right column: 3 bullets with bold labels: "**Context:** ...", "**Recommendation:** ...", "**Ask:** ...". Max 80 words total.',
    visual: 'bg: light (Stone #EFEBE7). Thesis: Saans italic in Slate #082422. Bold labels: Plain font-bold in Evergreen #35605F. Body: Saans in Slate. Badge: "Executive Summary" pill. imageUrl: /illustrations/F%C3%A9lix%20Illo%201.svg.',
    signals: ['executive summary', 'tldr', 'overview', 'highlights', 'key points'],
    skeleton: {
      type: 'two-column', bg: 'light', badge: 'Executive Summary', title: 'Executive Summary',
      columns: [
        {
          heading: 'Thesis',
          body: '*[2-3 sentence italicized thesis statement that frames the entire deck. This is the single most important takeaway the audience should remember.]*',
        },
        {
          heading: 'Key Points',
          bullets: [
            { text: '**Context:** [1-2 sentences establishing the situation and why it matters now]', icon: '📌' },
            { text: '**Recommendation:** [1-2 sentences with the proposed action and expected outcome]', icon: '✓' },
            { text: '**Ask:** [1 sentence with the specific decision or resource needed from the audience]', icon: '→' },
          ],
        },
      ],
      imageUrl: '/illustrations/F%C3%A9lix%20Illo%201.svg',
      notes: 'Executive summary with thesis on left, 3 structured bullets on right. Max 80 words total.',
    },
  },
  {
    id: 'cs-swot',
    name: 'SWOT Analysis (2×2 Grid)',
    category: 'corporate-strategy',
    mapsToType: 'cards',
    spec: 'Exactly 4 cards in a 2×2 grid: "Strengths" (green), "Weaknesses" (red), "Opportunities" (blue), "Threats" (orange). Each body: 4 bullet points as line-separated items. Max 15 words per bullet. This is the canonical 2×2 grid pattern.',
    visual: 'bg: dark (Slate #082422). titleColors: Cactus #60D06F (Strengths), Papaya #F26629 (Weaknesses), Turquoise #2BF2F1 (Opportunities), Mango #F19D38 (Threats). Card body: Stone #EFEBE7 Saans. Badge: "SWOT" pill. Heading: Plain font-black Stone.',
    signals: ['swot', 'strengths', 'weaknesses', 'opportunities', 'threats', '2x2', 'grid', 'quadrant'],
    skeleton: {
      type: 'cards', bg: 'dark', badge: 'SWOT', title: 'SWOT Analysis',
      cards: [
        { title: 'Strengths', titleColor: '#60D06F', body: '• [Strength 1 — specific, measurable]\n• [Strength 2 — competitive advantage]\n• [Strength 3 — unique capability]\n• [Strength 4 — market position]' },
        { title: 'Weaknesses', titleColor: '#F26629', body: '• [Weakness 1 — specific gap]\n• [Weakness 2 — resource constraint]\n• [Weakness 3 — operational issue]\n• [Weakness 4 — market limitation]' },
        { title: 'Opportunities', titleColor: '#2BF2F1', body: '• [Opportunity 1 — market trend]\n• [Opportunity 2 — unmet need]\n• [Opportunity 3 — technology shift]\n• [Opportunity 4 — expansion vector]' },
        { title: 'Threats', titleColor: '#F19D38', body: '• [Threat 1 — competitive pressure]\n• [Threat 2 — regulatory risk]\n• [Threat 3 — market change]\n• [Threat 4 — technology disruption]' },
      ],
      notes: 'SWOT 2×2 grid. Exactly 4 cards, exactly 4 bullets per card. Each bullet ≤15 words.',
    },
  },
  {
    id: 'cs-market-sizing',
    name: 'Market Sizing (TAM/SAM/SOM)',
    category: 'corporate-strategy',
    mapsToType: 'two-column',
    spec: 'Left column: concentric market description ("TAM $XXB → SAM $X.XB → SOM $XXXM"). Right column: bullets defining each tier with dollar values and methodology. Be specific with numbers.',
    visual: 'bg: light (Stone #EFEBE7). Market values: Plain font-black in Blueberry #6060BF (bold, large). Methodology: Saans in Slate #082422. Tier labels: Evergreen #35605F uppercase. Badge: "Market Size" pill. imageUrl: /illustrations/Flying%20Dollar%20Bills%20-%20Turquoise.svg.',
    signals: ['tam', 'sam', 'som', 'market size', 'addressable market', 'market opportunity'],
  },
  {
    id: 'cs-three-horizons',
    name: 'Three Horizons',
    category: 'corporate-strategy',
    mapsToType: 'cards',
    spec: '3 cards on dark bg: "Horizon 1: Now" (turquoise, current core + % resources), "Horizon 2: Next" (green, emerging + timeline), "Horizon 3: Future" (orange, transformational + investment thesis). Each body: 2-3 sentences.',
    visual: 'bg: dark (Slate #082422). titleColors: Turquoise #2BF2F1 (H1), Cactus #60D06F (H2), Mango #F19D38 (H3). Card body: Stone #EFEBE7 Saans. Badge: "Horizons" pill. Heading: Plain font-black Stone. imageUrl: /illustrations/Rocket%20Launch%20-%20Growth%20%2B%20Coin%20-%20Turquoise.svg.',
    signals: ['horizon', 'h1 h2 h3', 'core adjacent', 'transformational'],
  },
  {
    id: 'cs-scenario-planning',
    name: 'Scenario Planning',
    category: 'corporate-strategy',
    mapsToType: 'cards',
    spec: '3 cards on dark bg: "Bull Case" (green), "Base Case" (orange), "Bear Case" (red). Each body: probability percentage + revenue projection + 3 key assumptions. Max 40 words per card.',
    visual: 'bg: dark (Slate #082422). titleColors: Cactus #60D06F (Bull), Mango #F19D38 (Base), Papaya #F26629 (Bear). Probability: Turquoise #2BF2F1 bold. Revenue: Lychee #FFCD9C. Card body: Stone #EFEBE7 Saans. Badge: "Scenarios" pill.',
    signals: ['scenario', 'bull case', 'bear case', 'best case', 'worst case', 'forecast'],
  },
  {
    id: 'cs-competitive',
    name: 'Competitive Positioning',
    category: 'corporate-strategy',
    mapsToType: 'two-column',
    spec: 'Left column: 2×2 framework description (axis labels + quadrant names: Leader, Niche, Challenger, Commodity). Right column: "Our Position" analysis with 3-4 competitive advantages. Max 100 words.',
    visual: 'bg: light (Stone #EFEBE7). Quadrant names: Plain font-bold in Blueberry #6060BF. Axis labels: Mocha #877867 Saans italic. "Our Position": Evergreen #35605F bold. Advantages: Slate #082422 Saans. Badge: "Competitive" pill.',
    signals: ['competitive', 'positioning', 'landscape', 'market map', 'competitor'],
  },
  {
    id: 'cs-pnl',
    name: 'P&L / Financial Summary',
    category: 'corporate-strategy',
    mapsToType: 'two-column',
    spec: 'Left column: formatted financial table (Revenue, COGS, Gross Profit, OpEx, EBITDA) with 2-3 period columns. Right column: 3-4 key takeaway bullets highlighting important trends. Use "$X.XM" format.',
    visual: 'bg: dark (Slate #082422). Table headers: Plain font-bold in Turquoise #2BF2F1. Revenue/profit values: Cactus #60D06F. Cost values: Stone #EFEBE7. Takeaway bullets: Lychee #FFCD9C bold labels. Badge: "Financials" pill. imageUrl: /illustrations/Dollar%20bills%20%2B%20Coins%20A.svg.',
    signals: ['p&l', 'financial', 'revenue', 'profit', 'income statement', 'ebitda'],
  },
  {
    id: 'cs-unit-economics',
    name: 'Unit Economics',
    category: 'corporate-strategy',
    mapsToType: 'cards',
    spec: '3 cards: "Customer Acquisition Cost" (title = "$XXX"), "Lifetime Value" (title = "$X,XXX"), "LTV:CAC Ratio" (title = "X.Xx"). Each body: supporting context + payback period. Max 20 words per body.',
    visual: 'bg: light (Stone #EFEBE7). titleColors: Papaya #F26629 (CAC), Blueberry #6060BF (LTV), Evergreen #35605F (Ratio). Metric titles: Plain font-black large. Body: Saans in Slate #082422. Badge: "Unit Economics" pill. imageUrl: /illustrations/Cloud%20Coin%20-%20Turquoise.svg.',
    signals: ['unit economics', 'cac', 'ltv', 'payback', 'acquisition cost'],
  },
  {
    id: 'cs-decision-matrix',
    name: 'Decision Matrix',
    category: 'corporate-strategy',
    mapsToType: 'two-column',
    spec: 'Left column: markdown table with options as rows (3-4), criteria as columns (4-5), scores in cells. Right column: recommendation based on highest score. Bold the winner row.',
    visual: 'bg: light (Stone #EFEBE7). Table headers: Plain font-bold Evergreen #35605F. Winner row: bold Blueberry #6060BF. Other scores: Slate #082422 Saans. Recommendation: Saans in Slate. Badge: "Decision" pill.',
    signals: ['decision', 'matrix', 'evaluate', 'options', 'criteria', 'score'],
  },
  {
    id: 'cs-investment-thesis',
    name: 'Investment Thesis',
    category: 'corporate-strategy',
    mapsToType: 'quote',
    spec: 'Large serif italic thesis statement (1-2 sentences). Body: 3 supporting evidence bullets with financial metrics. Attribution line with source. Max 50 words for the thesis.',
    visual: 'bg: dark (Slate #082422). Quote: Plain italic in Stone #EFEBE7, large (text-4xl+). Evidence metrics: Turquoise #2BF2F1 bold. Attribution: Concrete #CFCABF Saans. Badge: "Thesis" pill. imageUrl: /illustrations/ray.svg.',
    signals: ['investment', 'thesis', 'rationale', 'why invest', 'business case'],
  },

  // ═══════════════════════════════════════════════
  // HR & RECRUITING
  // ═══════════════════════════════════════════════

  {
    id: 'hr-org-chart',
    name: 'Org Structure',
    category: 'hr-recruiting',
    mapsToType: 'cards',
    spec: '4-6 department cards. Each title = department name. Body: "[Leader Name], [Title] · ~XX people" + sub-team names. Include headcount. Vary titleColor per department.',
    visual: 'bg: light (Stone #EFEBE7). titleColors: cycle Blueberry #6060BF, Papaya #F26629, Evergreen #35605F, Sage #7BA882. Headcount numbers: Plain font-bold. Body: Saans in Slate #082422. Badge: "Organization" pill. imageUrl: /illustrations/Hands%20-%202%20Cell%20Phones%20-%20Juntos%20we%20Succeed.svg.',
    signals: ['org chart', 'organization', 'structure', 'department', 'hierarchy'],
  },
  {
    id: 'hr-headcount',
    name: 'Headcount Dashboard',
    category: 'hr-recruiting',
    mapsToType: 'chart',
    spec: 'Title = headcount insight ("Engineering grew 40% while keeping attrition below 8%"). Chart: stacked bar by department. Body: total headcount + open reqs + hiring velocity. Include YoY comparison.',
    visual: 'bg: dark (Slate #082422). Chart colors: Turquoise #2BF2F1, Cactus #60D06F, Mango #F19D38, Blueberry #6060BF (per department). Title: Plain font-black Stone #EFEBE7. Body: Saans Stone. Axis: Concrete #CFCABF. Badge: "Headcount" pill.',
    signals: ['headcount', 'staffing', 'hiring', 'team size', 'workforce'],
  },
  {
    id: 'hr-recruiting-pipeline',
    name: 'Recruiting Pipeline',
    category: 'hr-recruiting',
    mapsToType: 'chart',
    spec: 'Title = pipeline insight. Chart: horizontal bar showing candidates at each stage (Applied → Screened → Interviewed → Offered → Accepted). Body: conversion rates between stages + bottleneck analysis.',
    visual: 'bg: light (Stone #EFEBE7). Chart bars: Blueberry #6060BF (graduating opacity from 100% → 40%). Conversion rates: Papaya #F26629 bold. Title: Plain font-black Slate #082422. Body: Saans Slate. Badge: "Pipeline" pill.',
    signals: ['pipeline', 'recruiting', 'candidates', 'hiring funnel', 'applicant'],
  },
  {
    id: 'hr-30-60-90',
    name: '30-60-90 Day Plan',
    category: 'hr-recruiting',
    mapsToType: 'cards',
    spec: '3 cards on dark bg: "Days 1-30: Immerse" (turquoise), "Days 31-60: Build" (green), "Days 61-90: Scale" (orange). Each body: 5-6 bullet items as newline-separated goals. Action-oriented verbs.',
    visual: 'bg: dark (Slate #082422). titleColors: Turquoise #2BF2F1 (Days 1-30), Cactus #60D06F (Days 31-60), Mango #F19D38 (Days 61-90). Card body: Stone #EFEBE7 Saans. Badge: "Onboarding" pill. imageUrl: /illustrations/Party%20Popper.svg. Heading: Plain font-black Stone.',
    signals: ['30-60-90', '30 60 90', 'first 90 days', 'ramp up', 'new hire plan'],
  },
  {
    id: 'hr-benefits',
    name: 'Benefits Summary',
    category: 'hr-recruiting',
    mapsToType: 'cards',
    spec: '6 cards for benefit categories: Health, Retirement, PTO, Parental Leave, Learning, Wellness. Each body: specific offering details in 2-3 lines. Keep factual and specific.',
    visual: 'bg: light (Stone #EFEBE7). titleColors: cycle Blueberry #6060BF, Evergreen #35605F, Papaya #F26629, Sage #7BA882. Card titles: Plain font-extrabold. Body: Saans in Slate #082422. Badge: "Benefits" pill. imageUrl: /illustrations/Heart%20-F%C3%A9lix.svg.',
    signals: ['benefits', 'perks', 'compensation', 'total rewards', 'health insurance'],
  },
  {
    id: 'hr-engagement',
    name: 'Engagement Survey Results',
    category: 'hr-recruiting',
    mapsToType: 'chart',
    spec: 'Title = engagement insight ("Growth & learning scores dropped 12pts — largest decline in 3 years"). Chart: bar showing scores by category (Growth, Management, Culture, Compensation). Body: top action items.',
    visual: 'bg: dark (Slate #082422). Chart bars: Turquoise #2BF2F1 (high scores), Mango #F19D38 (mid), Papaya #F26629 (low/declined). Title: Plain font-black Stone #EFEBE7. Body: Saans Stone. Badge: "Engagement" pill. imageUrl: /illustrations/Speech%20Bubbles%20%2B%20Hearts.svg.',
    signals: ['engagement', 'survey', 'enps', 'employee satisfaction', 'culture score'],
  },
  {
    id: 'hr-dei',
    name: 'DEI Dashboard',
    category: 'hr-recruiting',
    mapsToType: 'chart',
    spec: 'Title = diversity insight. Chart: stacked bar showing representation by level or department. Body: progress against goals + 2-3 key initiatives. Include year-over-year comparison.',
    visual: 'bg: light (Stone #EFEBE7). Chart segments: Blueberry #6060BF, Papaya #F26629, Evergreen #35605F, Sage #7BA882, Mocha #877867. Title: Plain font-black Slate #082422. Goals: bold Evergreen. Badge: "DEI" pill.',
    signals: ['dei', 'diversity', 'equity', 'inclusion', 'representation'],
  },
  {
    id: 'hr-career-ladder',
    name: 'Career Ladder',
    category: 'hr-recruiting',
    mapsToType: 'two-column',
    spec: 'Left column: level progression (IC1 → IC2 → IC3 → Staff → Principal) with scope at each level. Right column: expectations per level (impact, autonomy, complexity). Max 15 words per level.',
    visual: 'bg: dark (Slate #082422). Level names: Plain font-bold in Turquoise #2BF2F1. Scope descriptions: Saans in Stone #EFEBE7. Expectation labels: Cactus #60D06F uppercase. Badge: "Career Path" pill. imageUrl: /illustrations/Rocket%20Launch%20-%20Growth%20%2B%20Coin%20-%20Turquoise.svg.',
    signals: ['career ladder', 'promotion', 'level', 'progression', 'career path'],
  },

  // ═══════════════════════════════════════════════
  // DEVICE FRAMES
  // ═══════════════════════════════════════════════

  {
    id: 'df-single-screen',
    name: 'Single Screen + Context',
    category: 'device-frames',
    mapsToType: 'two-column',
    spec: 'Left column: screen description with key UI elements (CTA, input fields, navigation). Right column: 3 stacked metrics (e.g., "Completion Rate: **72% → 89%**", "Time: **4.2 min → 1.8 min**"). Include device type label.',
    visual: 'bg: light (Stone #EFEBE7). Screen description: Saans in Slate #082422. UI element names: Plain font-bold. Metric labels: Mocha #877867 Saans. Metric values: Blueberry #6060BF bold. Improvements: Evergreen #35605F. Badge: "UI" pill. imageUrl: /illustrations/Hand%20-%20Cell%20Phone%20OK.svg.',
    signals: ['screen', 'mockup', 'ui', 'interface', 'app screen'],
  },
  {
    id: 'df-multi-flow',
    name: 'Multi-Screen Flow',
    category: 'device-frames',
    mapsToType: 'cards',
    spec: '3-4 cards representing sequential screens: "1. [Action]", "2. [Action]", "3. [Action]". Each body: screen elements + user action. Include flow arrows in narrative. Max 25 words per card.',
    visual: 'bg: dark (Slate #082422). titleColors: sequence Turquoise #2BF2F1, Cactus #60D06F, Mango #F19D38, Lychee #FFCD9C. Step numbers: Plain font-black large. Body: Saans in Stone #EFEBE7. Badge: "User Flow" pill. imageUrl: /illustrations/Hand%20-%20Cell%20Phone%20OK.svg.',
    signals: ['flow', 'multi-screen', 'step by step', 'user journey', 'walkthrough'],
  },
  {
    id: 'df-cross-platform',
    name: 'Cross-Platform',
    category: 'device-frames',
    mapsToType: 'two-column',
    spec: 'Left column heading "Desktop" with web experience description. Right column heading "Mobile" with mobile experience description. Notes on feature parity and responsive adaptations. Max 60 words per column.',
    visual: 'bg: light (Stone #EFEBE7). Column headings: Plain font-bold uppercase in Evergreen #35605F tracking-widest. Body: Saans in Slate #082422. Feature parity notes: Mocha #877867 italic. Badge: "Platforms" pill. imageUrl: /illustrations/Hands%20-%202%20Cell%20Phones%20-%20Juntos%20we%20Succeed.svg.',
    signals: ['responsive', 'cross-platform', 'desktop mobile', 'adaptive', 'breakpoint'],
  },
  {
    id: 'df-ab-test-ui',
    name: 'A/B Test (UI)',
    category: 'device-frames',
    mapsToType: 'two-column',
    spec: 'Left column heading "Variant A (Control)" with UI description + baseline metric. Right column heading "Variant B (Winner)" with UI changes + improved metric + lift percentage. Include statistical significance.',
    visual: 'bg: dark (Slate #082422). Column headings: Plain font-bold in Concrete #CFCABF uppercase. Control metric: Stone #EFEBE7. Winner metric: Turquoise #2BF2F1 bold. Lift percentage: Cactus #60D06F bold. Significance: Lychee #FFCD9C. Badge: "A/B Test" pill.',
    signals: ['a/b test ui', 'design test', 'variant', 'ui experiment'],
  },
  {
    id: 'df-error-states',
    name: 'Error States',
    category: 'device-frames',
    mapsToType: 'cards',
    spec: '4 cards: "Validation Error", "Network Timeout", "Transaction Declined", "Session Expired". Each body: user-facing behavior + recovery flow. Max 25 words per card. Dark bg.',
    visual: 'bg: dark (Slate #082422). titleColors: Papaya #F26629 (all error cards — consistent warning signal). Card body: Stone #EFEBE7 Saans. Recovery actions: Cactus #60D06F bold. Badge: "Error States" pill. imageUrl: /illustrations/Lock.svg.',
    signals: ['error state', 'error handling', 'edge case', 'failure', 'fallback'],
  },

  // ═══════════════════════════════════════════════
  // COMMON LAYOUTS (universal patterns)
  // ═══════════════════════════════════════════════

  {
    id: 'cl-2x2-grid',
    name: '2×2 Grid (Generic)',
    category: 'corporate-strategy',
    mapsToType: 'cards',
    spec: 'Exactly 4 cards in a 2×2 grid. Each card: bold title + 2-3 sentence body. Use for any framework with 4 quadrants, categories, or dimensions. Each card must have equal content density (±10 words). Vary titleColor.',
    visual: 'bg: light (Stone #EFEBE7). titleColors: cycle Blueberry #6060BF, Papaya #F26629, Evergreen #35605F, Mango #F19D38. Card body: Saans in Slate #082422. Badge: section-appropriate pill. Heading: Plain font-black Slate.',
    signals: ['2x2', 'grid', 'quadrant', 'four', 'framework', 'matrix', '4 things', 'categories'],
    skeleton: {
      type: 'cards', bg: 'light', badge: 'Framework', title: '[Framework Name]',
      cards: [
        { title: 'Quadrant 1', titleColor: '#6060BF', body: '[2-3 sentences with specific details. Include a metric or example. Every card must have roughly equal word count.]' },
        { title: 'Quadrant 2', titleColor: '#F26629', body: '[2-3 sentences with specific details. Include a metric or example. Every card must have roughly equal word count.]' },
        { title: 'Quadrant 3', titleColor: '#35605F', body: '[2-3 sentences with specific details. Include a metric or example. Every card must have roughly equal word count.]' },
        { title: 'Quadrant 4', titleColor: '#F19D38', body: '[2-3 sentences with specific details. Include a metric or example. Every card must have roughly equal word count.]' },
      ],
      notes: '2×2 grid pattern. Exactly 4 cards with balanced content density. Use for any 4-part framework.',
    },
  },
  {
    id: 'cl-section-divider',
    name: 'Section Divider',
    category: 'product-dev',
    mapsToType: 'section',
    spec: 'Full-bleed dark slide with large centered title (3-5 words max) and optional 1-sentence subtitle. Used to break the deck into major sections. Include an illustration.',
    visual: 'bg: dark (Slate #082422). Title: Plain font-black in Stone #EFEBE7, text-6xl+ centered. Subtitle: Saans in Concrete #CFCABF, text-xl centered. Badge: section name pill in turquoise.',
    signals: ['section', 'divider', 'part', 'chapter', 'transition'],
    skeleton: {
      type: 'section', bg: 'dark', badge: 'Part 1', title: 'Section Title',
      subtitle: 'One sentence framing what this section covers.',
      imageUrl: '/illustrations/Rocket%20Launch%20-%20Growth%20%2B%20Coin%20-%20Turquoise.svg',
      notes: 'Section divider. Max 5 words for title. Used to create visual rhythm between major deck sections.',
    },
  },
  {
    id: 'cl-three-column',
    name: 'Three-Column Comparison',
    category: 'corporate-strategy',
    mapsToType: 'cards',
    spec: 'Exactly 3 cards with equal structure. Each card: title + subtitle tagline + 3-5 bullet items. Used for comparing options, tiers, or approaches. Content must be parallel across all 3 cards (same number of items, same structure).',
    visual: 'bg: light (Stone #EFEBE7). titleColors: Turquoise #2BF2F1, Blueberry #6060BF, Papaya #F26629. Card body: Saans in Slate #082422. Badge: context pill. Heading: Plain font-black Slate.',
    signals: ['three', 'compare', 'option', 'tier', 'plan', 'approach', 'vs', 'alternative'],
    skeleton: {
      type: 'cards', bg: 'light', badge: 'Comparison', title: '[What We\'re Comparing]',
      cards: [
        { title: 'Option A', titleColor: '#2BF2F1', body: '**[Tagline]**\n\n• [Feature/attribute 1]\n• [Feature/attribute 2]\n• [Feature/attribute 3]\n• [Feature/attribute 4]' },
        { title: 'Option B', titleColor: '#6060BF', body: '**[Tagline]**\n\n• [Feature/attribute 1]\n• [Feature/attribute 2]\n• [Feature/attribute 3]\n• [Feature/attribute 4]' },
        { title: 'Option C', titleColor: '#F26629', body: '**[Tagline]**\n\n• [Feature/attribute 1]\n• [Feature/attribute 2]\n• [Feature/attribute 3]\n• [Feature/attribute 4]' },
      ],
      notes: 'Three-column comparison. All 3 cards must have parallel structure and equal content density.',
    },
  },
  {
    id: 'cl-pros-cons',
    name: 'Pros & Cons / Do\'s & Don\'ts',
    category: 'product-dev',
    mapsToType: 'two-column',
    spec: 'Left column: 4-6 positive items with ✓ icons. Right column: 4-6 negative items with ✗ icons. Columns must have equal item count. Each item: 1 sentence max. Used for guidelines, tradeoffs, or evaluations.',
    visual: 'bg: light (Stone #EFEBE7). Left heading: Evergreen #35605F ("Do" / "Pros"). Right heading: Papaya #F26629 ("Don\'t" / "Cons"). Body: Saans in Slate #082422. Icons: ✓ in Evergreen, ✗ in Papaya. Badge: context pill.',
    signals: ['pros', 'cons', 'do', 'don\'t', 'tradeoff', 'guideline', 'best practice', 'avoid'],
    skeleton: {
      type: 'two-column', bg: 'light', badge: 'Guidelines', title: '[Topic] — Do\'s & Don\'ts',
      columns: [
        {
          heading: 'Do',
          bullets: [
            { text: '[Positive practice 1 — specific and actionable]', icon: '✓' },
            { text: '[Positive practice 2 — specific and actionable]', icon: '✓' },
            { text: '[Positive practice 3 — specific and actionable]', icon: '✓' },
            { text: '[Positive practice 4 — specific and actionable]', icon: '✓' },
            { text: '[Positive practice 5 — specific and actionable]', icon: '✓' },
            { text: '[Positive practice 6 — specific and actionable]', icon: '✓' },
          ],
        },
        {
          heading: 'Don\'t',
          bullets: [
            { text: '[Anti-pattern 1 — specific example to avoid]', icon: '✗' },
            { text: '[Anti-pattern 2 — specific example to avoid]', icon: '✗' },
            { text: '[Anti-pattern 3 — specific example to avoid]', icon: '✗' },
            { text: '[Anti-pattern 4 — specific example to avoid]', icon: '✗' },
            { text: '[Anti-pattern 5 — specific example to avoid]', icon: '✗' },
            { text: '[Anti-pattern 6 — specific example to avoid]', icon: '✗' },
          ],
        },
      ],
      notes: 'Pros/Cons or Do\'s/Don\'ts. Both columns MUST have equal item count (4-6 each).',
    },
  },
  {
    id: 'cl-timeline',
    name: 'Timeline / Milestones',
    category: 'product-dev',
    mapsToType: 'bullets',
    spec: '5-7 timeline items. Each: bold date/phase label + 1 sentence description. Items in chronological order. Use emoji icons to indicate status (✓ done, → in progress, ○ upcoming).',
    visual: 'bg: dark (Slate #082422). Date labels: Plain font-bold in Turquoise #2BF2F1. Descriptions: Saans in Stone #EFEBE7. Status icons: Cactus #60D06F (done), Mango #F19D38 (in-progress), Concrete #CFCABF (upcoming). Badge: "Timeline" pill.',
    signals: ['timeline', 'milestone', 'phase', 'when', 'deadline', 'launch date', 'schedule'],
    skeleton: {
      type: 'bullets', bg: 'dark', badge: 'Timeline', title: 'Key Milestones',
      bullets: [
        { text: '**Jan 2026** — [Milestone 1: what was achieved or launched]', icon: '✓' },
        { text: '**Mar 2026** — [Milestone 2: what was achieved or launched]', icon: '✓' },
        { text: '**May 2026** — [Milestone 3: currently in progress]', icon: '→' },
        { text: '**Jul 2026** — [Milestone 4: planned next]', icon: '○' },
        { text: '**Sep 2026** — [Milestone 5: future target]', icon: '○' },
        { text: '**Dec 2026** — [Milestone 6: end-of-year goal]', icon: '○' },
      ],
      notes: 'Timeline with 5-7 chronological milestones. Status icons indicate done/in-progress/upcoming.',
    },
  },
  {
    id: 'cl-key-takeaways',
    name: 'Key Takeaways',
    category: 'corporate-strategy',
    mapsToType: 'bullets',
    spec: '3-5 takeaway items. Each: bold number (1-5) + 1-2 sentence takeaway that is a complete, actionable thought. This is the "if you remember nothing else" slide. Used near the end of a presentation.',
    visual: 'bg: dark (Slate #082422). Numbers: Plain font-black in Turquoise #2BF2F1. Takeaway text: Saans in Stone #EFEBE7, text-lg. Badge: "Key Takeaways" pill. imageUrl: /illustrations/Hand%20-%20Stars.svg.',
    signals: ['takeaway', 'summary', 'recap', 'key point', 'remember', 'conclusion', 'wrap up'],
    skeleton: {
      type: 'bullets', bg: 'dark', badge: 'Key Takeaways', title: 'What to Remember',
      subtitle: 'The 3-5 things that matter most from this presentation.',
      bullets: [
        { text: '**1.** [Complete, actionable takeaway — not a vague platitude but a specific insight with evidence]', icon: '💡' },
        { text: '**2.** [Complete, actionable takeaway — tied to a metric, decision, or next step]', icon: '💡' },
        { text: '**3.** [Complete, actionable takeaway — the "so what" that changes behavior]', icon: '💡' },
      ],
      imageUrl: '/illustrations/Hand%20-%20Stars.svg',
      notes: 'Key takeaways near deck end. 3-5 items. Each MUST be a complete, specific thought (not "grow revenue" but "expand to 3 new corridors to capture $40M in unaddressed volume").',
    },
  },
]

// ---------------------------------------------------------------------------
// Selection Logic
// ---------------------------------------------------------------------------

/**
 * Detect all matching intents from a prompt, ranked by signal strength.
 * Returns multiple intents for mixed-topic decks.
 */
export function detectIntents(prompt: string): DocumentType[] {
  const lower = prompt.toLowerCase()
  const scores: { type: DocumentType; score: number }[] = []

  const SIGNALS: Record<DocumentType, RegExp[]> = {
    prd:        [/\bprd\b/, /product\s+require/, /feature\s+spec/, /user\s+stor/, /mvp\b/],
    launch:     [/\blaunch\b/, /\bship\b/, /go[\s-]to[\s-]market/, /\bgtm\b/, /\brollout\b/],
    review:     [/quarterly/, /\bq[1-4]\b/, /\breview\b/, /\bkpi\b/, /\bokr\b/, /metrics/, /performance/],
    research:   [/research/, /insight/, /finding/, /user\s+interview/, /survey/, /persona/],
    proposal:   [/proposal/, /\bpitch\b/, /invest/, /funding/, /business\s+case/, /\broi\b/],
    strategy:   [/strateg/, /roadmap/, /vision/, /initiative/, /prioriti/],
    onboarding: [/onboard/, /welcome/, /new\s+hire/, /orientation/],
    general:    [],
  }

  for (const [type, patterns] of Object.entries(SIGNALS) as [DocumentType, RegExp[]][]) {
    let score = 0
    for (const p of patterns) {
      if (p.test(lower)) score++
    }
    if (score > 0) scores.push({ type, score })
  }

  // Sort by score descending
  scores.sort((a, b) => b.score - a.score)

  const result = scores.map(s => s.type)
  if (result.length === 0) result.push('general')
  return result
}

/**
 * Select the most relevant blueprints for a given prompt and outline.
 */
export function selectBlueprints(
  prompt: string,
  outlineSlides?: Array<{ type: string; title: string; badge?: string }>,
  maxCount = 15,
): SlideBlueprint[] {
  const intents = detectIntents(prompt)
  const lower = prompt.toLowerCase()

  // Collect relevant categories from all detected intents
  const categories = new Set<BlueprintCategory>()
  for (const intent of intents) {
    for (const cat of INTENT_CATEGORIES[intent]) {
      categories.add(cat)
    }
  }

  // Score each blueprint based on category relevance + keyword matches
  const scored = BLUEPRINTS.map(bp => {
    let score = 0

    // Category match (primary intents get more weight)
    if (categories.has(bp.category)) {
      const catIndex = [...categories].indexOf(bp.category)
      score += 10 - catIndex * 2 // first category = 10, second = 8, third = 6
    }

    // Signal keyword matches against prompt
    for (const signal of bp.signals) {
      if (lower.includes(signal)) score += 5
    }

    // Signal keyword matches against outline slide titles
    if (outlineSlides) {
      for (const slide of outlineSlides) {
        const slideText = `${slide.title} ${slide.badge || ''}`.toLowerCase()
        for (const signal of bp.signals) {
          if (slideText.includes(signal)) score += 3
        }
      }
    }

    return { bp, score }
  })

  // Sort by score, take top N
  scored.sort((a, b) => b.score - a.score)

  return scored
    .filter(s => s.score > 0)
    .slice(0, maxCount)
    .map(s => s.bp)
}

/**
 * Format selected blueprints into a prompt section for injection.
 */
export function formatBlueprintsForPrompt(blueprints: SlideBlueprint[]): string {
  if (blueprints.length === 0) return ''

  // Group by category for readability
  const grouped = new Map<BlueprintCategory, SlideBlueprint[]>()
  for (const bp of blueprints) {
    const list = grouped.get(bp.category) || []
    list.push(bp)
    grouped.set(bp.category, list)
  }

  const CATEGORY_LABELS: Record<BlueprintCategory, string> = {
    'product-dev': 'Product Development',
    'data-viz': 'Data Visualization',
    'hr-recruiting': 'HR & People',
    'corporate-strategy': 'Corporate Strategy',
    'device-frames': 'Device Frames & UI',
  }

  const sections: string[] = []
  for (const [cat, bps] of grouped) {
    const lines = bps.map(bp => {
      let entry = `- **${bp.name}** (→ ${bp.mapsToType}): ${bp.spec}\n  Visual: ${bp.visual}`
      if (bp.skeleton) {
        entry += `\n  **JSON skeleton (COPY this structure exactly, replace placeholder text):**\n  \`\`\`json\n  ${JSON.stringify(bp.skeleton, null, 2).split('\n').join('\n  ')}\n  \`\`\``
      }
      return entry
    })
    sections.push(`### ${CATEGORY_LABELS[cat]}\n${lines.join('\n\n')}`)
  }

  return `## Slide Blueprints (structure + visual design)

CRITICAL: These blueprints define the EXACT content structure, density, and visual treatment for each slide pattern.
When a blueprint has a JSON skeleton, you MUST use that exact structure — copy the JSON shape and replace only the placeholder text with real content. Do NOT add or remove fields, do NOT change the number of cards/bullets/columns.

### Content Density Minimums (ENFORCED)
- **cards**: MUST have the exact number of cards specified in the skeleton. Each card body MUST be ≥30 words (2-3 full sentences). NEVER output a card with just 1 vague sentence.
- **bullets**: MUST have ≥4 items. Each item MUST be a complete thought with context (≥10 words). NEVER output "Market growth" — instead "TAM: $161B — Total LatAm remittances per year, growing 4% annually".
- **two-column**: BOTH columns MUST be fully populated. Each column needs ≥3 bullets or ≥40 words of body text. NEVER leave a column thin.
- **2×2 grids (4 cards)**: All 4 cards MUST have equal content density (±10 words). A 2×2 grid with 1 fat card and 3 thin cards is WRONG.

### Layout Catalog (use these canonical patterns)
1. **Agenda** (bullets): 5-6 numbered items with time estimates
2. **2×2 Grid** (cards): Exactly 4 cards, equal density — SWOT, frameworks, quadrants
3. **Three-Column** (cards): Exactly 3 cards, parallel structure — options, tiers, phases
4. **Section Divider** (section): Full-bleed dark, large centered title, 3-5 words
5. **Pros/Cons** (two-column): Equal-count bullet lists with ✓/✗ icons
6. **Timeline** (bullets): 5-7 chronological items with status icons
7. **Key Takeaways** (bullets): 3-5 numbered actionable insights near deck end
8. **Hero Metric** (content): Single massive number + insight title + trend pills
9. **Executive Summary** (two-column): Thesis left + Context/Recommendation/Ask right
10. **Before/After** (two-column): Parallel metrics with delta percentages

Typography: Plain (font-display) for headings/titles, Saans (font-sans) for body text.
Palette: Turquoise #2BF2F1, Slate #082422, Stone #EFEBE7, Blueberry #6060BF, Cactus #60D06F, Mango #F19D38, Papaya #F26629, Sage #7BA882, Evergreen #35605F, Mocha #877867, Lychee #FFCD9C, Lime #DCFF00.
Always follow Color Accessibility Rules — never use Turquoise/Lime/Cactus on light bg text, never use Blueberry/Mocha/Evergreen on dark bg text.

${sections.join('\n\n')}`
}

/**
 * Select and format blueprints for a given generation context.
 * Convenience function combining selection + formatting.
 */
export function getBlueprintEnrichment(
  prompt: string,
  outlineSlides?: Array<{ type: string; title: string; badge?: string }>,
): string {
  const blueprints = selectBlueprints(prompt, outlineSlides)
  return formatBlueprintsForPrompt(blueprints)
}
