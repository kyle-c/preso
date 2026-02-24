import { NextResponse } from 'next/server'

const markdown = `# Felix Pago Design System

> Reference document for building product experiences with Claude Code.
> Live at: https://felix-design.vercel.app

---

## Stack

- Next.js 16 App Router, TypeScript, Tailwind CSS v4
- Component library: shadcn/ui base + Felix custom layer
- Icons: lucide-react
- Fonts loaded via @font-face in globals.css (no next/font)

---

## Design Principles

1. **Conversational Transactions, Not Transactional Experiences** — Warm, clear language. Write like a knowledgeable friend, not a bank. Active voice, plain words, no jargon.
2. **Guide Beginners. Accelerate Regulars.** — Progressive disclosure. First-time flows explain everything; returning users skip straight to action.
3. **Never Leave Users Guessing. Always Give Next Steps.** — Every state (loading, error, empty, success) has a clear message and a clear action.
4. **Protection Without Friction** — Safety through smart defaults. Don't gate features behind warnings unless risk is real.
5. **Grow With Your Journey** — Introduce features contextually at the moment they become relevant.

---

## Colors

All colors are available as Tailwind utilities (e.g. \`bg-turquoise\`, \`text-slate\`, \`border-mocha\`).

### Primary Palette
| Token       | Hex       | Usage                                      |
|-------------|-----------|---------------------------------------------|
| turquoise   | #2BF2F1   | Primary brand, CTAs, selected states, badges |
| slate       | #082422   | Primary text, dark backgrounds, borders     |

### Neutral Palette
| Token    | Hex     | Usage                                        |
|----------|---------|-----------------------------------------------|
| concrete | #CFCABF | Secondary background, borders, dividers       |
| stone    | #EFEBE7 | Page/card backgrounds, subtle fills          |
| linen    | #FEFCF9 | App background, input backgrounds, lightest surface |

### Secondary Palette
| Token      | Hex     | Usage                                        |
|------------|---------|-----------------------------------------------|
| blueberry  | #6060BF | Security/trust callouts, informational states |
| evergreen  | #35605F | Muted foreground, success adjacent           |
| mocha      | #877867 | Helper text, secondary labels, muted links   |
| papaya     | #F26629 | Destructive, errors, warnings                |
| sky        | #8DFDFA | Turquoise scale accent                       |
| cactus     | #60D06F | Success states                               |
| yam        | #C1A98A | Warm accent                                  |
| mango      | #F19D38 | Warning, attention                           |
| light-sky  | #D4FFFE | Very light turquoise fill                    |
| lime       | #DCFF00 | High-contrast accent                         |
| lychee     | #FFCD9C | Warm highlight                               |
| fortuna    | #FFB05A | Warm highlight alt                           |

### Opacity Modifiers (Tailwind)
Use Tailwind opacity modifiers freely: \`text-slate/70\`, \`border-slate/20\`, \`bg-turquoise/30\`, etc.

### Semantic Tokens (CSS vars / Tailwind)
| Token               | Value              |
|---------------------|--------------------|
| background          | linen (#FEFCF9)    |
| foreground          | slate (#082422)    |
| muted-foreground    | evergreen (#35605F)|
| border              | concrete (#CFCABF) |
| input / ring        | mocha (#877867)    |
| destructive         | papaya (#F26629)   |
| primary             | turquoise (#2BF2F1)|

---

## Typography

### Font Families
| Family  | Tailwind Class   | Weights Available | Usage              |
|---------|------------------|-------------------|--------------------|
| Plain   | font-display     | 800 (extrabold), 900 (black) | Headings, display text |
| Saans   | font-sans (default) | 300, 400, 500, 600 | All body copy, UI labels |

### Type Scale
| Role        | Size   | Leading | Tracking | Class Example                        |
|-------------|--------|---------|----------|--------------------------------------|
| Display XL  | 72px   | 1.0     | -0.02em  | text-[72px] font-display font-extrabold tracking-tight |
| Display LG  | 60px   | 1.0     | -0.02em  | text-[60px] font-display font-extrabold tracking-tight |
| Display MD  | 48px   | 1.1     | -0.01em  | text-[48px] font-display font-extrabold tracking-tight |
| Heading 1   | 36px   | 1.2     | -0.01em  | text-[36px] font-display font-extrabold               |
| Heading 2   | 30px   | 1.3     | 0        | text-[30px] font-bold                                 |
| Heading 3   | 24px   | 1.4     | 0        | text-[24px] font-bold                                 |
| Heading 4   | 20px   | 1.5     | 0        | text-[20px] font-semibold                             |
| Body LG     | 18px   | 1.6     | 0        | text-[18px]                                           |
| Body        | 16px   | 1.6     | 0        | text-base                                             |
| Body SM     | 14px   | 1.5     | 0        | text-[14px]                                           |
| Caption     | 12px   | 1.4     | 0.01em   | text-[12px] tracking-wide                             |

### In-app heading pattern (mobile flows)
\`\`\`tsx
// Screen titles
<h1 className="font-display text-[26px] font-extrabold leading-tight tracking-tight text-slate">
  Title text
</h1>

// Section subheadings
<h2 className="font-display text-[22px] font-extrabold leading-tight tracking-tight text-slate">
  Section title
</h2>
\`\`\`

---

## Components

### Button

Import: \`import { Button } from '@/components/ui/button'\`

**Variants**
| Variant     | Tailwind Output                                              | Usage                        |
|-------------|--------------------------------------------------------------|------------------------------|
| default     | bg-turquoise text-slate hover:bg-turquoise/80               | Primary CTA                  |
| secondary   | bg-concrete text-slate hover:bg-concrete/80                 | Secondary action             |
| outline     | border-2 border-slate text-slate hover:bg-slate hover:text-linen | Secondary CTA, cancel   |
| destructive | bg-papaya text-slate                                        | Destructive actions          |
| ghost       | hover:bg-accent hover:text-accent-foreground               | Subtle, icon-adjacent        |
| link        | text-foreground underline decoration-link decoration-2      | Inline text links            |
| link-muted  | text-mocha underline decoration-mocha hover:text-slate      | Subdued inline links, helper text links |

**Sizes**
| Size    | Height | Padding  |
|---------|--------|----------|
| sm      | h-9    | px-4     |
| default | h-11   | px-6     |
| lg      | h-12   | px-8     |
| icon-sm | 36px   | square   |
| icon    | 44px   | square   |
| icon-lg | 48px   | square   |

All buttons are \`rounded-full\` by default.

\`\`\`tsx
<Button>Primary</Button>
<Button variant="outline" size="lg" className="w-full">Cancel</Button>
<Button variant="link-muted" size="sm">I'll do this later</Button>
<Button size="lg" className="w-full" disabled={!isValid}>Continue</Button>
\`\`\`

---

### FloatingInput

Import: \`import { FloatingInput } from '@/components/ui/floating-input'\`

Floating label input — label animates up on focus/fill.

\`\`\`tsx
<FloatingInput label="Address *" />

// In mobile flows with white background:
<FloatingInput
  label="Card number *"
  className="!rounded-2xl bg-white [&+label]:bg-white [&+label]:text-mocha"
  value={cardNumber}
  onChange={e => setCardNumber(e.target.value)}
/>
\`\`\`

- Default background: linen
- For white-background forms: add \`bg-white [&+label]:bg-white\`
- For mocha label text: add \`[&+label]:text-mocha\`
- Border radius override: \`!rounded-2xl\`
- Height: h-14 (56px)
- Accepts all standard \`<input>\` props

---

### Select

Import: \`import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'\`

\`\`\`tsx
<Select onValueChange={setValue}>
  <SelectTrigger className="!h-14 w-full rounded-2xl bg-white px-4 text-base data-[placeholder]:text-muted-foreground">
    <SelectValue placeholder="State *" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="CA">California</SelectItem>
    <SelectItem value="TX">Texas</SelectItem>
  </SelectContent>
</Select>
\`\`\`

---

### FelixLogo

Import: \`import { FelixLogo } from '@/components/design-system/felix-logo'\`

SVG logo, uses currentColor. Size via className.

\`\`\`tsx
<FelixLogo className="h-8 text-slate" />
<FelixLogo className="h-6 text-linen" />  // white on dark
\`\`\`

---

## UI Patterns

### Screen Header (authenticated flows)

Standard header used across all screens in payment/onboarding flows:

\`\`\`tsx
<div className="flex flex-col items-center pt-4 pb-1">
  <FelixLogo className="h-8 text-slate" />
  <div className="mt-2.5 rounded-full bg-turquoise px-2.5 py-0.5">
    <span className="text-[10px] font-semibold text-slate">
      Authorized UniTeller Agent
    </span>
  </div>
</div>
\`\`\`

---

### Segmented Progress Bar

Used in multi-step flows. Back button on left, equal-width segments, spacer div on right to center the bar.

\`\`\`tsx
// Step 2 of 4
<div className="flex items-center gap-3 px-6 py-3">
  <button
    onClick={onBack}
    className="flex h-9 w-9 items-center justify-center rounded-full border border-slate/15 text-slate hover:bg-white"
  >
    <ChevronLeft className="h-4 w-4" />
  </button>
  <div className="flex flex-1 gap-1.5">
    <div className="h-1.5 flex-1 rounded-full bg-slate" />       {/* filled */}
    <div className="h-1.5 flex-1 rounded-full bg-slate" />       {/* filled */}
    <div className="h-1.5 flex-1 rounded-full bg-slate/20" />    {/* empty */}
    <div className="h-1.5 flex-1 rounded-full bg-slate/20" />    {/* empty */}
  </div>
  <div className="w-9 flex-shrink-0" /> {/* spacer to center bar */}
</div>
\`\`\`

---

### Selectable Card

Used for payment method selection, store selection, and other option lists. Turquoise ring on selected state, "Selected" pill badge.

\`\`\`tsx
const cardClass = (id: string) =>
  \`relative w-full text-left rounded-2xl p-5 border transition-all \${
    selected === id
      ? 'bg-white border-turquoise/50 ring-[3px] ring-turquoise/30'
      : 'bg-white border-slate/20 shadow-sm'
  }\`

<button className={cardClass('card')} onClick={() => setSelected('card')}>
  {selected === 'card' && (
    <span className="absolute top-4 right-4 bg-turquoise text-slate text-[11px] font-semibold px-2.5 py-1 rounded-full">
      Selected
    </span>
  )}
  <p className="font-bold text-[17px] text-slate">Credit/debit card</p>
  <p className="text-[13px] text-mocha mt-1.5 leading-snug">
    Credit cards may carry extra fees.
  </p>
  <div className="mt-3 flex gap-2">
    {/* badges */}
  </div>
</button>
\`\`\`

---

### Badge / Pill

\`\`\`tsx
// Outlined badge (fee/speed tags on payment options)
<span className="inline-block border border-mocha text-mocha text-[12px] font-semibold px-3 py-1 rounded-full">
  No fee for debit
</span>

// Filled turquoise (status/selected indicator)
<span className="bg-turquoise text-slate text-[11px] font-semibold px-2.5 py-1 rounded-full">
  Selected
</span>

// Filled stone (neutral metadata)
<span className="bg-stone text-slate text-[10px] font-semibold px-2.5 py-0.5 rounded-full">
  Authorized UniTeller Agent
</span>
\`\`\`

---

### Security Footer

\`\`\`tsx
import { Lock } from 'lucide-react'

<div className="rounded-2xl bg-blueberry/10 px-4 py-3.5 flex gap-3 items-start">
  <Lock className="h-4 w-4 text-blueberry mt-0.5 flex-shrink-0" />
  <div>
    <p className="text-[13px] font-semibold text-blueberry">Your payment is safe with us</p>
    <p className="text-[13px] text-blueberry/70 mt-0.5">
      Encrypted with 256-bit SSL — your info stays private.
    </p>
  </div>
</div>
\`\`\`

---

### Smooth Expand / Collapse (grid-rows trick)

No max-height hacks needed. Works without knowing content height.

\`\`\`tsx
const [expanded, setExpanded] = useState(false)

<div className={\`grid transition-all duration-300 ease-in-out \${expanded ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}\`}>
  <div className="overflow-hidden">
    {/* content */}
  </div>
</div>

// Rotating chevron
<ChevronDown className={\`h-4 w-4 transition-transform duration-200 \${expanded ? 'rotate-180' : ''}\`} />
\`\`\`

---

### Receipt / Summary Card

\`\`\`tsx
<div className="bg-white rounded-2xl border border-slate/15 overflow-hidden divide-y divide-slate/10">
  <div className="px-4 py-3.5 flex items-center justify-between">
    <span className="text-[13px] text-mocha">You send</span>
    <span className="font-bold text-[16px] text-slate">🇺🇸 USD $10.00</span>
  </div>
  <div className="px-4 py-3.5 flex items-center justify-between">
    <span className="text-[13px] text-mocha">Recipient gets</span>
    <span className="font-bold text-[16px] text-slate">🇲🇽 MXN $174.20</span>
  </div>
</div>
\`\`\`

---

### Muted Link (helper text + inline links)

\`\`\`tsx
// As Button component
<Button variant="link-muted" size="sm">I'll do this later</Button>

// Inline in text
<span className="text-mocha underline decoration-mocha underline-offset-2 hover:text-slate hover:decoration-slate cursor-pointer">
  terms and conditions
</span>

// Legal / fine print block
<p className="text-[11px] text-mocha leading-relaxed text-center">
  By tapping Continue, you agree to our{' '}
  <span className="text-mocha underline decoration-mocha underline-offset-2 hover:text-slate hover:decoration-slate">
    terms and conditions
  </span>.
</p>
\`\`\`

---

### Phone Frame (prototype mockups)

\`\`\`tsx
function PhoneFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative mx-auto w-[390px] h-[844px] rounded-[52px] border-[12px] border-slate bg-slate shadow-2xl overflow-hidden">
      {/* Dynamic Island */}
      <div className="absolute top-3 left-1/2 -translate-x-1/2 z-50 w-[126px] h-[34px] bg-slate rounded-full" />
      {/* Status Bar */}
      <div className="absolute top-0 left-0 right-0 z-40 flex items-center justify-between px-8 pt-[14px] h-[54px] bg-linen">
        <span className="text-[15px] font-semibold text-slate">9:41</span>
        <div className="flex items-center gap-1.5">
          <Signal className="h-3.5 w-3.5 text-slate" />
          <Wifi className="h-3.5 w-3.5 text-slate" />
          <Battery className="h-3.5 w-3.5 text-slate" />
        </div>
      </div>
      {/* Screen Content */}
      <div className="h-full w-full overflow-y-auto bg-linen pt-[54px] pb-[34px]">
        {children}
      </div>
      {/* Home Indicator */}
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-50 w-[134px] h-[5px] rounded-full bg-slate" />
    </div>
  )
}

// Wrap in centering container:
<div className="flex min-h-screen items-center justify-center bg-stone p-8">
  <PhoneFrame>...</PhoneFrame>
</div>
\`\`\`

---

## Spacing Scale

| Token   | Value  | px  |
|---------|--------|-----|
| xs      | 0.25rem | 4px |
| sm      | 0.5rem  | 8px |
| md      | 1rem    | 16px|
| lg      | 1.5rem  | 24px|
| xl      | 2rem    | 32px|
| 2xl     | 3rem    | 48px|
| 3xl     | 4rem    | 64px|

---

## Border Radius

Default radius: \`--radius: 1rem\` (16px)

| Token      | Value                     |
|------------|---------------------------|
| radius-sm  | calc(1rem - 4px) = 12px   |
| radius-md  | calc(1rem - 2px) = 14px   |
| radius-lg  | 1rem = 16px               |
| radius-xl  | calc(1rem + 4px) = 20px   |
| rounded-2xl | 1rem (16px) — most used in flows |
| rounded-full | pill shape — buttons, badges |

---

## Focus Style

Custom diffuse ring (not the standard crisp outline):

\`\`\`css
:focus-visible {
  --tw-ring-shadow: 0 0 10px 3px color-mix(in srgb, var(--color-ring) 8%, transparent);
  border-color: var(--color-input);
}
\`\`\`

On interactive cards/inputs: \`ring-[3px] ring-turquoise/30 border-turquoise/50\`

---

## Copy Guidelines

- **Headings**: Direct, warm, action-oriented. E.g. "How do you want to pay?" not "Select Payment Method"
- **Body**: Conversational, concise. One idea per sentence.
- **CTAs**: Specific action verbs. "Send now", "Continue", "Keep this number" — not "Submit" or "OK"
- **Helper text / errors**: Use mocha (\`text-mocha\`) for secondary/helper text. Never show errors before interaction.
- **Tone**: Knowledgeable friend. Approachable, not clinical. Confident, not pushy.

---

## File Conventions

- Pages: \`app/[route]/page.tsx\` — use \`'use client'\` for interactive flows
- Components: \`components/ui/\` (shadcn base), \`components/design-system/\` (Felix custom)
- Flows with multiple screens: use \`useState\` for screen routing within a single page file
- Prototype flows wrap all screens in \`<PhoneFrame>\`
`

export function GET() {
  return new NextResponse(markdown, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  })
}
