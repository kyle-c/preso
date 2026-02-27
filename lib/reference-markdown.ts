/**
 * Comprehensive Design System reference — single source of truth.
 * Consumed by:
 *   - app/reference/page.tsx  (rendered HTML)
 *   - app/md/route.ts         (raw text/plain for AI ingestion)
 */

export const referenceMarkdown = `# Felix Pago — Design System Reference

> Complete reference for replicating every screen, component, pattern, and flow in the Felix Pago design system.
> Covers the fintech test flow (\`/fintechtestflow\`), presentation system (\`/preso-sample\`), and all design tokens.

---

## Stack & Setup

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript 5 |
| Styling | Tailwind CSS v4 + CSS custom properties |
| Components | shadcn/ui (customized) |
| Icons | lucide-react |
| Fonts | Plain (display), Saans (body), Geist Mono (code) |
| i18n | Custom \`DSLangContext\` with \`localStorage\` persistence |

### File Conventions

- Pages live in \`app/<route>/page.tsx\`
- Shared components in \`components/design-system/\` and \`components/ui/\`
- Design tokens defined in \`app/globals.css\` as CSS custom properties
- Content tokens (user-facing strings) in \`app/fintechtestflow/content.ts\`

---

## Design Principles

1. **Presence Over Transaction** — Remittances are acts of presence. Design should honor the emotional weight of sending money to family.
2. **Progressive Capability** — The product should make users stronger over time — more knowledgeable, more confident, more capable.
3. **Meet People Where They Are** — Start simple, reveal complexity gradually. Progressive disclosure over feature overload.
4. **Grow With Users** — From first send to comprehensive financial management. The system expands as users are ready.
5. **Celebrate Growth** — Acknowledge milestones and learning, not just task completion.

---

## Colors

### Primary Palette

| Name | Hex | Tailwind Class | Usage |
|------|-----|---------------|-------|
| Turquoise | \`#2BF2F1\` | \`bg-turquoise\` / \`text-turquoise\` | Primary brand accent, CTAs, highlights, badges |
| Slate | \`#082422\` | \`bg-slate\` / \`text-slate\` | Primary text, phone chrome, dark backgrounds |

### Neutrals

| Name | Hex | Tailwind Class | Usage |
|------|-----|---------------|-------|
| Concrete | \`#CFCABF\` | \`bg-concrete\` | Borders, dividers, disabled states |
| Stone | \`#EFEBE7\` | \`bg-stone\` | Section backgrounds, cards, subtle fills |
| Linen | \`#FEFCF9\` | \`bg-linen\` | Page background, phone screen bg |

### Secondary Colors

| Name | Hex | Tailwind Class |
|------|-----|---------------|
| Blueberry | \`#6060BF\` | \`bg-blueberry\` / \`text-blueberry\` |
| Evergreen | \`#35605F\` | \`bg-evergreen\` |
| Mocha | \`#877867\` | \`text-mocha\` |
| Papaya | \`#F26629\` | \`bg-papaya\` / \`text-papaya\` |
| Sky | \`#8DFDFA\` | \`bg-sky\` |
| Cactus | \`#60D06F\` | \`bg-cactus\` |
| Yam | \`#C1A98A\` | \`bg-yam\` |
| Mango | \`#F19D38\` | \`bg-mango\` / \`text-mango\` |
| Light Sky | \`#D4FFFE\` | \`bg-light-sky\` |
| Lime | \`#DCFF00\` | \`bg-lime\` |
| Lychee | \`#FFCD9C\` | \`bg-lychee\` |
| Fortuna | \`#FFB05A\` | \`bg-fortuna\` |

### Turquoise Scale

| Token | Hex |
|-------|-----|
| \`turquoise-50\` | \`#EEFEFE\` |
| \`turquoise-100\` | \`#D4FFFE\` |
| \`turquoise-200\` | \`#AEFFFE\` |
| \`turquoise-300\` | \`#8DFDFA\` |
| \`turquoise-400\` | \`#5DF7F5\` |
| \`turquoise-500\` | \`#2BF2F1\` |
| \`turquoise-600\` | \`#14D4D3\` |
| \`turquoise-700\` | \`#10A8A7\` |
| \`turquoise-800\` | \`#128585\` |
| \`turquoise-900\` | \`#156D6C\` |
| \`turquoise-950\` | \`#064949\` |

### Slate Scale

| Token | Hex |
|-------|-----|
| \`slate-50\` | \`#F0F5F5\` |
| \`slate-100\` | \`#DAE5E4\` |
| \`slate-200\` | \`#B9CCCB\` |
| \`slate-300\` | \`#90ADAB\` |
| \`slate-400\` | \`#698988\` |
| \`slate-500\` | \`#4F6F6E\` |
| \`slate-600\` | \`#3F5958\` |
| \`slate-700\` | \`#354949\` |
| \`slate-800\` | \`#2D3D3C\` |
| \`slate-900\` | \`#1A2928\` |
| \`slate-950\` | \`#082422\` |

### Semantic Color Tokens

| Token | Light Value | Usage |
|-------|------------|-------|
| \`--background\` | linen \`#FEFCF9\` | Page background |
| \`--foreground\` | slate \`#082422\` | Primary text |
| \`--muted\` | stone \`#EFEBE7\` | Muted backgrounds |
| \`--muted-foreground\` | mocha \`#877867\` | Secondary text |
| \`--border\` | concrete \`#CFCABF\` | Default borders |
| \`--primary\` | turquoise \`#2BF2F1\` | Primary actions |
| \`--primary-foreground\` | slate \`#082422\` | Text on primary |
| \`--destructive\` | papaya \`#F26629\` | Error / destructive actions |

### Opacity Modifier Usage

Tailwind v4 opacity modifiers on color classes:

\`\`\`
bg-turquoise/20    → 20% opacity turquoise background
text-slate/60      → 60% opacity slate text
border-slate/15    → 15% opacity slate border
\`\`\`

---

## Typography

### Font Families

| Role | Family | Weights | Tailwind Class |
|------|--------|---------|---------------|
| Display | Plain | 800 (Extrabold), 900 (Black) | \`font-display\` |
| Body | Saans | 300–600 | \`font-sans\` (default) |
| Code | Geist Mono | 400 | \`font-mono\` |

### Type Scale

| Level | Size | Leading | Tracking | Tailwind |
|-------|------|---------|----------|----------|
| Display XL | 4.5rem (72px) | 1.0 | -0.02em | \`text-7xl\` |
| Display LG | 3.75rem (60px) | 1.0 | -0.02em | \`text-6xl\` |
| Display MD | 3rem (48px) | 1.1 | -0.01em | \`text-5xl\` |
| Heading 1 | 2.25rem (36px) | 1.2 | -0.01em | \`text-4xl\` |
| Heading 2 | 1.875rem (30px) | 1.3 | 0em | \`text-3xl\` |
| Heading 3 | 1.5rem (24px) | 1.4 | 0em | \`text-2xl\` |
| Heading 4 | 1.25rem (20px) | 1.5 | 0em | \`text-xl\` |
| Body LG | 1.125rem (18px) | 1.6 | 0em | \`text-lg\` |
| Body | 1rem (16px) | 1.6 | 0em | \`text-base\` |
| Body SM | 0.875rem (14px) | 1.5 | 0em | \`text-sm\` |
| Caption | 0.75rem (12px) | 1.4 | 0.01em | \`text-xs\` |

### In-App Heading Pattern

\`\`\`tsx
<h1 className="font-display text-[26px] font-extrabold leading-tight tracking-tight text-slate">
  Page Title
</h1>
\`\`\`

Screen headings in the fintech flow use \`font-display\` (Plain) at \`text-[22px]\` to \`text-[28px]\`, always \`font-extrabold leading-tight tracking-tight text-slate\`.

---

## Spacing

| Token | Value | Pixels | Tailwind |
|-------|-------|--------|----------|
| xs | 0.25rem | 4px | \`p-1\` / \`gap-1\` |
| sm | 0.5rem | 8px | \`p-2\` / \`gap-2\` |
| md | 1rem | 16px | \`p-4\` / \`gap-4\` |
| lg | 1.5rem | 24px | \`p-6\` / \`gap-6\` |
| xl | 2rem | 32px | \`p-8\` / \`gap-8\` |
| 2xl | 3rem | 48px | \`p-12\` / \`gap-12\` |
| 3xl | 4rem | 64px | \`p-16\` / \`gap-16\` |

---

## Border Radius

| Token | Value | Use Case |
|-------|-------|----------|
| \`radius-sm\` | 0.25rem (4px) | Small pills, inline tags |
| \`radius-md\` | 0.5rem (8px) | Buttons, inputs |
| \`radius-lg\` | 1rem (16px) | Cards, modals |
| \`radius-xl\` | 1.5rem (24px) | Phone-style cards, bottom sheets |

In-app overrides: phone cards use \`rounded-2xl\` (16px), bottom sheets use \`rounded-t-2xl\`, the phone frame itself uses \`rounded-[52px]\`.

---

## Shadows

| Token | CSS Value |
|-------|-----------|
| \`shadow-xs\` | \`0 1px 2px rgba(8,36,34,0.03)\` |
| \`shadow-sm\` | \`0 1px 3px rgba(8,36,34,0.06), 0 1px 2px rgba(8,36,34,0.04)\` |
| \`shadow-md\` | \`0 4px 6px rgba(8,36,34,0.06), 0 2px 4px rgba(8,36,34,0.04)\` |
| \`shadow-lg\` | \`0 10px 15px rgba(8,36,34,0.06), 0 4px 6px rgba(8,36,34,0.03)\` |
| \`shadow-xl\` | \`0 20px 25px rgba(8,36,34,0.06), 0 8px 10px rgba(8,36,34,0.03)\` |
| \`shadow-2xl\` | \`0 25px 50px rgba(8,36,34,0.12)\` |
| \`shadow-inner\` | \`inset 0 2px 4px rgba(8,36,34,0.04)\` |
| \`shadow-turquoise\` | \`0 4px 14px rgba(43,242,241,0.25)\` |

Note: all shadows use the slate base color \`rgba(8,36,34,...)\` instead of pure black, giving a warmer, brand-aligned shadow.

---

## Focus Style

Custom diffuse ring for interactive elements:

\`\`\`css
focus:ring-[3px] focus:ring-turquoise/25 focus:border-turquoise
\`\`\`

Error state ring:

\`\`\`css
ring-[3px] ring-red-400/20 border-red-400
\`\`\`

Valid state:

\`\`\`css
border-turquoise/60 focus:border-turquoise focus:ring-turquoise/25
\`\`\`

---

## Components

### Button

Imported from \`@/components/ui/button\`. Uses shadcn/ui \`Button\` with Felix theme overrides.

**Variants:** \`default\` | \`destructive\` | \`outline\` | \`secondary\` | \`ghost\` | \`link\`

**Sizes:** \`default\` | \`sm\` | \`lg\` | \`icon\`

Common in-app patterns:

\`\`\`tsx
{/* Primary CTA — full width */}
<Button size="lg" className="w-full text-[15px]" onClick={onNext} disabled={!canContinue}>
  {t.common.continue}
</Button>

{/* Secondary / back button */}
<Button variant="outline" size="lg" className="w-full text-[15px]" onClick={onBack}>
  {t.common.previous}
</Button>

{/* Apple Pay style dark button */}
<button className="w-full flex items-center justify-center bg-slate rounded-2xl py-3 hover:bg-slate/90 active:scale-[0.98] transition-all">
  <ApplePayIcon className="h-7 w-auto fill-linen" />
</button>

{/* WhatsApp green CTA */}
<Button size="lg" className="w-full bg-[#22c55e] hover:bg-[#16a34a] text-white font-semibold text-[15px] border-0">
  Share on WhatsApp
</Button>

{/* Stripe purple CTA */}
<Button size="lg" className="w-full text-[15px] !bg-[#635bff] hover:!bg-[#5248e6] !text-white !border-0">
  Accept and continue
</Button>
\`\`\`

### FloatingInput

Imported from \`@/components/ui/floating-input\`. A text input with a floating label that animates up on focus.

**Props:**

| Prop | Type | Description |
|------|------|-------------|
| \`label\` | string | The floating label text |
| \`className\` | string | Container classes — typically \`!rounded-2xl bg-white\` |
| \`labelClassName\` | string | Label classes — typically \`bg-white text-mocha\` |
| \`error\` | string \\| undefined | Error message (shows red border + message) |
| \`isValid\` | boolean | Shows turquoise border when true |
| \`inputMode\` | string | HTML inputMode (\`numeric\`, etc.) |
| \`autoComplete\` | string | HTML autocomplete attribute |

\`\`\`tsx
<FloatingInput
  label="Card number *"
  className="!rounded-2xl bg-white"
  labelClassName="bg-white text-mocha"
  value={cardNumber}
  onChange={e => setCardNumber(formatCard(e.target.value))}
  onBlur={() => touch('cardNumber')}
  error={err('cardNumber', cardNumber)}
  isValid={valid('cardNumber', cardNumber)}
  inputMode="numeric"
  autoComplete="cc-number"
/>
\`\`\`

### Select (native)

Used for state selection. Styled to match FloatingInput aesthetic:

\`\`\`tsx
<select
  className={\`h-14 w-full rounded-2xl bg-white border px-4 pr-10 text-base
    appearance-none transition-colors outline-none cursor-pointer focus:ring-[3px]
    \${error ? 'border-red-400 ring-[3px] ring-red-400/20' :
      value ? 'border-turquoise/60 focus:border-turquoise focus:ring-turquoise/25 text-slate' :
      'border-border focus:border-turquoise focus:ring-turquoise/25 text-muted-foreground'}\`}
>
  <option value="" disabled>State *</option>
  <option value="FL">Florida</option>
  ...
</select>
<ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
\`\`\`

### FelixLogo

Imported from \`@/components/design-system/felix-logo\`.

\`\`\`tsx
<FelixLogo className="h-8 text-slate" />    {/* Dark on light bg */}
<FelixLogo className="h-6 w-auto text-turquoise" />  {/* Turquoise in sidebar */}
\`\`\`

### Card

Shared shadcn/ui card exports: \`Card\`, \`CardContent\`, \`CardDescription\`, \`CardFooter\`, \`CardHeader\`, \`CardTitle\`.

Custom in-app card pattern:

\`\`\`tsx
<div className="bg-white rounded-2xl border border-slate/15 overflow-hidden divide-y divide-slate/10">
  {/* Row */}
  <div className="px-4 py-3.5 flex items-center justify-between">
    <span className="text-[13px] text-mocha">Label</span>
    <span className="font-bold text-[16px] text-slate">Value</span>
  </div>
</div>
\`\`\`

### Badge / Pill

Three variant patterns:

\`\`\`tsx
{/* Turquoise filled pill (brand badge) */}
<span className="rounded-full bg-turquoise px-2.5 py-0.5">
  <span className="text-[10px] font-semibold text-slate">Authorized UniTeller Agent</span>
</span>

{/* Outline pill (mocha border) */}
<span className="inline-block border border-mocha text-mocha text-[12px] font-semibold px-3 py-1 rounded-full">
  No fee for debit
</span>

{/* Selected pill (turquoise bg, small) */}
<span className="bg-turquoise text-slate text-[11px] font-semibold px-2.5 py-1 rounded-full">
  Selected
</span>
\`\`\`

---

## UI Patterns

### Screen Header (Logo + Badge)

Present at the top of every fintech flow screen:

\`\`\`tsx
<div className="flex flex-col items-center pt-5 pb-4">
  <FelixLogo className="h-8 text-slate" />
  <div className="mt-3.5 rounded-full bg-turquoise px-2.5 py-0.5">
    <span className="text-[10px] font-semibold text-slate">{t.common.badge}</span>
  </div>
</div>
\`\`\`

### Progress Bar (segmented stripe)

Pinned below the phone status bar, shows flow progress:

\`\`\`tsx
<div className="absolute top-[54px] left-0 right-0 z-30 h-[3px] bg-slate/10">
  <div
    className="h-full bg-turquoise transition-[width] duration-300 ease-out"
    style={{ width: \`\${progress}%\` }}
  />
</div>
\`\`\`

### Selectable Card (Turquoise Ring Pattern)

Used for payment method cards, store selection, Stripe account selection:

\`\`\`tsx
<button
  className={\`relative w-full text-left rounded-2xl p-5 border transition-all overflow-hidden \${
    selected
      ? 'bg-white border-slate/60 shadow-lg'
      : 'bg-white border-slate/20 shadow-sm'
  }\`}
>
  {/* Content */}
  {selected && (
    <span className="bg-turquoise text-slate text-[11px] font-semibold px-2.5 py-1 rounded-full">
      Selected
    </span>
  )}
</button>
\`\`\`

### Receipt / Summary Card

Review screen uses a divided card:

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

### Security Footer (Blueberry Callout)

\`\`\`tsx
<div className="rounded-2xl bg-blueberry/10 px-4 py-3.5 flex gap-3 items-start">
  <Lock className="h-4 w-4 text-blueberry mt-0.5 flex-shrink-0" />
  <div>
    <p className="text-[13px] font-semibold text-blueberry">Your payment is safe with us</p>
    <p className="text-[13px] text-blueberry/70 mt-0.5">Encrypted with 256-bit SSL — your info stays private.</p>
  </div>
</div>
\`\`\`

### Muted Link Pattern

\`\`\`tsx
<span className="underline underline-offset-2 decoration-mocha/40 text-[12px] text-mocha cursor-pointer">
  Or verify manually
</span>

{/* "Change" link in review */}
<button className="text-[13px] font-semibold text-mocha underline decoration-mocha underline-offset-4 hover:text-slate">
  Change
</button>
\`\`\`

### Smooth Expand/Collapse (CSS Grid Trick)

Used for fee breakdown, sidebar sub-items:

\`\`\`tsx
<div className={\`grid transition-all duration-300 ease-in-out \${
  expanded ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
}\`}>
  <div className="overflow-hidden">
    {/* Content */}
  </div>
</div>
\`\`\`

### Phone Frame

390×844px iPhone mockup:

\`\`\`tsx
<div className="relative mx-auto w-[390px] h-[844px] rounded-[52px] border-[12px] border-slate bg-slate shadow-2xl overflow-hidden">
  {/* Dynamic island notch */}
  <div className="absolute top-3 left-1/2 -translate-x-1/2 z-50 w-[126px] h-[34px] bg-slate rounded-full" />
  {/* Status bar (9:41, signal, wifi, battery) */}
  <div className="absolute top-0 left-0 right-0 z-40 flex items-center justify-between px-8 pt-[14px] h-[54px] bg-linen">
    <span className="text-[15px] font-semibold text-slate">9:41</span>
    <div className="flex items-center gap-1.5">
      <Signal className="h-3.5 w-3.5 text-slate" />
      <Wifi className="h-3.5 w-3.5 text-slate" />
      <Battery className="h-3.5 w-3.5 text-slate" />
    </div>
  </div>
  {/* Progress bar */}
  {/* Content area with scroll */}
  <div className="h-full w-full overflow-y-auto bg-linen pt-[54px] pb-[34px]">
    {children}
  </div>
  {/* Home indicator */}
  <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-50 w-[134px] h-[5px] rounded-full bg-slate" />
</div>
\`\`\`

### Bottom Sheet Overlay

\`\`\`tsx
<div className="absolute inset-0 z-50 flex flex-col justify-end">
  {/* Backdrop */}
  <div className="absolute inset-0 bg-black/40" onClick={onClose} />
  {/* Sheet */}
  <div className="relative bg-white rounded-t-2xl">
    {/* Drag handle */}
    <div className="flex justify-center pt-3 pb-1">
      <div className="w-9 h-1 rounded-full bg-slate/20" />
    </div>
    {/* Sheet content */}
  </div>
</div>
\`\`\`

---

## i18n

Three supported languages:

| Code | Label | Flag |
|------|-------|------|
| \`en\` | English | 🇺🇸 |
| \`es-mx\` | Español (MX) | 🇲🇽 |
| \`pt-br\` | Português (BR) | 🇧🇷 |

**Design System UI strings:** \`lib/ds-i18n.ts\` — \`DSStrings\` interface, \`dsStrings\` record. Used via \`useDSLang()\` hook from \`DSLangContext\`.

**Fintech content strings:** \`app/fintechtestflow/content.ts\` — \`ContentTokens\` interface, \`content\` record. Used via local \`LangContext\`.

**Persistence:** Language preference saved to \`localStorage\` key \`felix-ds-lang\`, read on mount.

---

## Content Tokens (Fintech Flow)

All user-facing strings in the fintech flow are defined in \`app/fintechtestflow/content.ts\`.

### Token Sections

#### common
| Key | EN Example |
|-----|-----------|
| \`badge\` | Authorized UniTeller Agent |
| \`continue\` | Continue |
| \`cancel\` | Cancel |
| \`previous\` | Previous |
| \`selected\` | Selected |
| \`change\` | Change |

#### paymentMethod
| Key | EN Example |
|-----|-----------|
| \`titleLine1\` | Almost done. |
| \`titleLine2\` | How do you want to pay? |
| \`subtitle\` | Express Pay |
| \`orPayAnotherWay\` | or pay another way |
| \`creditDebitName\` | Credit/debit card |
| \`creditDebitDesc\` | Credit cards may carry extra fees. |
| \`applePayName\` | Apple Pay |
| \`applePayDesc\` | Pay with Face ID or Touch ID. |
| \`bankName\` | Bank account |
| \`bankDesc\` | Checking or savings account. |
| \`cashName\` | Cash at a store |
| \`cashDesc\` | Pay cash at a store near you. |
| \`badgeNoFeeDebit\` | No fee for debit |
| \`badgeInstant\` | Instant |
| \`badgeNoFee\` | No fee |
| \`badgeBusinessDays\` | 1–3 business days |
| \`badgeCashFee\` | $3.95 |
| \`badgeSameDay\` | Same day |

#### address
| Key | EN Example |
|-----|-----------|
| \`titleBilling\` | What's the billing address on your card? |
| \`titleBank\` | Enter the address linked to your account |
| \`titleCash\` | What's your address? |
| \`helperCash\` | We'll use this to find the closest store locations where you can pay. |
| \`fieldAddress\` | Address * |
| \`fieldApt\` | Apt, suite, or floor |
| \`fieldZip\` | ZIP Code * |
| \`fieldCity\` | City * |
| \`fieldState\` | State * |

#### cardDetails
| Key | EN Example |
|-----|-----------|
| \`title\` | Enter your card details |
| \`fieldFullName\` | Full name on card * |
| \`fieldCardNumber\` | Card number * |
| \`fieldExpiry\` | Expiry date * (MM / YY) |
| \`fieldCvv\` | CVV * |
| \`helperName\` | If your card shows a bank name, enter the account holder's name. |
| \`termsPre\` | By tapping Continue, you agree to our |
| \`termsLink\` | terms and conditions |
| \`termsAnd\` | and |
| \`privacyLink\` | privacy policy |
| \`securityTitle\` | Your payment is safe with us |
| \`securityBody\` | Encrypted with 256-bit SSL — your info stays private. |

#### storeSelection
| Key | EN Example |
|-----|-----------|
| \`title\` | Where do you want to pay? |
| \`addressLabel\` | Address |
| \`addressPlaceholder\` | 8040 Brothers Walk Lane, Jacksonville |
| \`storeFeeLabel\` | {fee} store fee |
| \`limitBadge\` | Limit $20 - $500 |
| \`infoText\` | Select this store to generate your code, then you can pay at any {store}. |
| \`selectStore\` | Select store |
| \`minMax\` | Min: $20 · Max: $500 |
| \`greenDot\` | Service provided by Green Dot®. ©2024 Green Dot Corporation... |

#### review
| Key | EN Example |
|-----|-----------|
| \`title\` | Review your transfer to Patricia Caballero |
| \`youSend\` | You send |
| \`recipientGets\` | Recipient gets |
| \`paymentMethodLabel\` | Payment method |
| \`amountFees\` | Amount + fees |
| \`exchangeRate\` | Exchange rate |
| \`amountToSend\` | Amount to send |
| \`felixFee\` | Felix fee |
| \`storeFee\` | {store} fee |
| \`otherFees\` | Other fees |
| \`taxes\` | Taxes |
| \`total\` | Total |
| \`sendNow\` | Send now |
| \`legal\` | For questions or complaints about Zero Hash LLC... |
| \`learnMore\` | Learn more. |
| \`changeSheetTitle\` | Change payment |
| \`changeCard\` | Use a different card |
| \`changeBank\` | Use a different bank account |
| \`changeStore\` | Use a different store |
| \`changeMethod\` | Change payment method |

#### success
| Key | EN Example |
|-----|-----------|
| \`title\` | Your payment went through! |
| \`body\` | Patricia Caballero will receive 52.26 MXN for your $3 USD transfer. |
| \`referralTitle\` | Earn up to $1,000 USD |
| \`referralBody\` | Earn $20 USD for each friend who makes their first transfer |
| \`shareWhatsApp\` | Share on WhatsApp |
| \`backToWhatsApp\` | Back to WhatsApp |

#### bankConsent
| Key | EN Example |
|-----|-----------|
| \`title\` | Consent for bank charges |
| \`body\` | By clicking I agree, you authorize Félix Pago to charge... |
| \`agree\` | I agree |

#### bankConnect
| Key | EN Example |
|-----|-----------|
| \`title\` | Connect your account |
| \`subtitle\` | Enter the account holder's information |
| \`fieldFirstName\` | First name * |
| \`fieldMiddleName\` | Middle name |
| \`fieldLastName\` | Last name * |
| \`linkAccount\` | Link account |

#### stripe
| Key | EN Example |
|-----|-----------|
| \`selectTitle\` | Select your bank |
| \`selectSearch\` | Search |
| \`introTitle\` | Félix uses Stripe to connect your accounts |
| \`introFast\` | Fast and simple |
| \`introFastDesc\` | Connect your account in seconds. |
| \`introEncrypted\` | Your data is encrypted |
| \`introEncryptedDesc\` | Félix can access your data. You can disconnect at any time. |
| \`introConsent\` | By continuing, you accept Stripe's Terms and Privacy Policy. |
| \`introAccept\` | Accept and continue |
| \`introManual\` | Or verify manually (may take 1–2 business days) |
| \`accountTitle\` | Choose an account |
| \`accountConnect\` | Connect Account |
| \`linkTitle\` | Save your account with Link |
| \`linkDesc\` | Connect faster everywhere that accepts Link... |
| \`linkSave\` | Save with Link |
| \`linkSkip\` | Finish without saving |
| \`completedTitle\` | Completed successfully |
| \`completedSubtitle\` | Your account has been connected. |
| \`completedDone\` | Done |

### Interpolation Placeholders

| Token | Placeholder | Example |
|-------|-------------|---------|
| \`storeSelection.storeFeeLabel\` | \`{fee}\` | "$3.95 store fee" |
| \`storeSelection.infoText\` | \`{store}\` | "...pay at any Walgreens" |
| \`review.storeFee\` | \`{store}\` | "Walgreens fee" |

---

## Fintech Flow Architecture

### Screen Routing State Machine

The flow is a single-page \`'use client'\` component. A \`screen\` state drives which screen renders. Transitions are handled by \`onNext\`/\`onBack\` callbacks.

### Flow Paths

**Card flow (6 screens):**
PaymentMethod → Address → CardDetails → Review → Success

**Bank flow (12 screens):**
PaymentMethod → Address → BankConsent → BankConnect → StripeBankSelect → StripeIntro → StripeAccount → StripeLink → StripeCompleted → Review → Success

**Cash flow (6 screens):**
PaymentMethod → Address → StoreSelection → Review → Success

**Repeat user flow (5 screens):**
SavedMethodsSheet → Review (with saved method) → Success

### State Management

Key \`useState\` hooks in the main component:

| State | Type | Purpose |
|-------|------|---------|
| \`screen\` | string | Current screen identifier |
| \`paymentMethod\` | string | Selected method: \`'card'\` \\| \`'bank'\` \\| \`'cash'\` \\| \`'apple'\` |
| \`selectedStore\` | string | Store ID for cash payments |
| \`language\` | Language | Current UI language |
| \`editableContent\` | Record | Live-editable content tokens |
| \`showCanvas\` | boolean | Whether canvas overview is visible |

### Validation Patterns

Address screen:
- \`address\`: required
- \`zip\`: required, must be 5 digits (\`/^\\d{5}$/\`)
- \`city\`: required
- \`state\`: required

Card details screen:
- \`name\`: required
- \`cardNumber\`: required, 16 digits
- \`expiry\`: required, MM/YY format, month 01-12
- \`cvv\`: required, 3 or 4 digits (\`/^\\d{3,4}$/\`)

### Formatting Rules

Card number: groups of 4 digits with spaces (\`1234 5678 9012 3456\`)
\`\`\`tsx
v.replace(/\\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim()
\`\`\`

Expiry: auto-inserts slash after month (\`12/25\`)
\`\`\`tsx
const d = v.replace(/\\D/g, '').slice(0, 4)
d.length >= 3 ? d.slice(0, 2) + '/' + d.slice(2) : d
\`\`\`

ZIP: numeric only, max 5 digits:
\`\`\`tsx
e.target.value.replace(/\\D/g, '').slice(0, 5)
\`\`\`

---

## Screen-by-Screen Reference

### PaymentMethodScreen
- **Layout:** \`px-5 pb-8\`, ScreenHeader, display heading, divider with "Express Pay" label
- **Apple Pay button:** \`bg-slate rounded-2xl py-3\`, \`ApplePayIcon\` fill-linen
- **Divider:** "or pay another way" centered between two \`h-px bg-slate/15\` lines
- **PayMethodCard x3:** Selectable cards with illustration, badges, description
- **CTAs:** Continue (primary), Cancel (outline)

### AddressScreen
- **Layout:** \`flex flex-col h-full\`, ScreenHeader, \`px-6 pb-6\`
- **Dynamic title:** billing (card), bank-linked (bank), or "What's your address?" (cash)
- **Cash helper text:** \`text-[14px] text-mocha\`
- **Fields:** 4x FloatingInput + 1 native select for state
- **Validation:** touched-on-blur, red ring for errors, turquoise ring for valid

### CardDetailsScreen
- **Layout:** same flex column pattern
- **Fields:** Full name, Card number (formatted), Expiry (MM/YY), CVV
- **Helper text:** below name field, \`text-[12px] text-mocha\`
- **Legal footer:** terms + privacy links with underline
- **Security callout:** blueberry/10 bg, Lock icon, 256-bit SSL message

### StoreSelectionScreen
- **Layout:** \`relative flex flex-col h-full\`, ScreenHeader, \`px-5 pb-4\`
- **Map view:** 320px tall, \`bg-[#e8e4da]\`, SVG street grid, store pins as circle buttons
- **Store pins:** logo in white circle, turquoise border when selected, scale-125 transition
- **Bottom sheet:** appears on store select, has mini map, address, fee, limit badge, info callout, CTA
- **Green Dot legal:** \`text-[10px] text-mocha\` centered

### ReviewScreen
- **Summary card:** divided rows — you send, recipient gets, payment method (with Change link), amount + fees
- **Fee breakdown:** expandable via ChevronDown, uses grid-rows animation
- **Fee rows:** \`text-[12px]\` labels and values in stone/40 bg
- **Change sheet:** bottom sheet with contextual option (different card/bank/store) + change payment method
- **Legal footer:** \`text-[11px] text-mocha\` with "Learn more" underlined

### SuccessScreen
- **Illustration:** \`/illustrations/cashAirplane.svg\`, 144x112px centered
- **Title:** \`text-[28px] font-extrabold\`, centered
- **Referral card:** \`bg-slate rounded-2xl p-5\`, white text, WhatsApp green CTA (\`bg-[#22c55e]\`)
- **Back button:** outline, "Back to WhatsApp"

### BankConsentScreen
- **Simple layout:** title, body paragraph (\`text-[14px] text-mocha\`), "I agree" CTA, Previous

### BankConnectScreen
- **Title + subtitle:** connect account, enter holder info
- **Fields:** First name, Middle name (optional), Last name
- **CTA:** "Link account", disabled until first + last name filled

### Stripe Screens (4 screens, purple #635bff brand)

All Stripe screens share:
- **StripeHeader:** gradient \`from-[#635bff] to-[#7b73ff]\`, white "stripe" text + "Test" badge
- **White background** (\`bg-white\`) instead of linen
- **Purple accent:** \`bg-[#635bff]/10\`, \`text-[#635bff]\`, \`focus:border-[#635bff]\`

**StripeBankSelectScreen:** Bank list with search, purple icon circles, click selects + auto-advances

**StripeIntroScreen:** Felix + Stripe logo pairing with dot connectors, "Fast and simple" + "Your data is encrypted" feature rows, consent text, purple CTA

**StripeAccountScreen:** Account list (Checking, Savings, Business), purple selected state, purple check circle

**StripeLinkScreen:** Green \`#00d66f\` Lock icon, email + phone inputs, "Save with Link" green CTA, "Finish without saving" text link

### SavedMethodsSheet
- 4 saved methods: Visa card, Apple Pay, Premier bank, Walgreens cash
- Each is a selectable row with icon circle, label, sublabel
- Active: \`border-turquoise bg-turquoise/[0.06]\`, turquoise check
- "Add new method" dashed border option
- Cancel button at bottom

---

## Canvas View

The \`FlowCanvasOverlay\` provides a bird's-eye view of the entire payment flow.

### Structure
- Full-viewport overlay with horizontal scroll
- \`CANVAS_SCALE = 0.32\` — each phone is 125×270px
- Pan/zoom controls: zoom slider, fit-to-screen, close button
- Language and view mode selectors in top bar

### CanvasMiniPhone
- Scaled-down PhoneFrame with click-to-navigate
- Label below each phone
- Status badge (todo/in-review/done) indicated by colored dot

### CanvasArrow
- SVG arrows connecting sequential screens
- Branching arrows for flow divergence (card vs bank vs cash)

### CanvasSidebar (TokenInspector)
- 260px wide panel alongside active phone
- Shows all content tokens for current screen
- Grouped by section (SCREEN, LEGAL, ACTIONS, etc.)
- Hover expands inline editor with all 3 language variants
- Save button commits edits live

### Token Status Tracking
- \`ScreenStatus\`: \`'todo'\` | \`'in-review'\` | \`'done'\`
- Persisted in \`localStorage\` key \`felix-screen-statuses\`
- Visual indicators: colored dots on canvas phones

---

## Presentation System

### Slide Structure

The \`/preso-sample\` page is a full-screen slide deck rendered client-side.

\`\`\`tsx
const slides = [SlideNorthStar, SlideRules, SlideAgenda, SlideGoals]
\`\`\`

Each slide is a function component that fills \`h-full w-full\` with a \`bg-stone\` background.

### Navigation

**Keyboard:** ArrowRight/Down/Space = next, ArrowLeft/Up = prev, Home = first, End = last

**Touch:** Swipe left = next, swipe right = prev (50px threshold)

**Click:** Prev/Next arrow buttons on desktop (hidden on mobile), dot indicators at bottom

### Hash-Synced URL

\`\`\`tsx
useEffect(() => {
  window.history.replaceState(null, '', \`#slide-\${current}\`)
}, [current])
\`\`\`

On mount, reads \`#slide-N\` from URL to restore position.

### Progress Bar + Dot Indicators

**Top progress bar:** \`h-1 bg-concrete/30\` track, \`bg-turquoise-600\` fill, width = \`(current+1)/total * 100%\`

**Dot indicators:** bottom-center, \`h-1.5 rounded-full\`, active = \`w-8 bg-turquoise-600\`, inactive = \`w-1.5 bg-concrete\`

### Slide Counter

Top-left pill: \`bg-white/90 backdrop-blur-sm rounded-full border border-border\`, shows "1 / 4"

### SlideNorthStar (Slide 1)

- **Layout:** 2-column grid (\`lg:grid-cols-2\`), \`bg-stone\`, \`max-w-[1400px]\` centered
- **Left column:** Félix mascot illustration (200×200px), "Félix North Star" heading (\`font-display font-black text-5xl–8xl\`), mission statement paragraph
- **Right column:** White card (\`rounded-2xl lg:rounded-3xl\`, \`border border-border shadow-sm\`), PillBadge "Mission", mission text, PillBadge "Key Principles", 6 principles with CheckCircle2 icons
- **Decorative collage:** 7 scattered money illustrations (flying dollar bills, coins, cloud coins) at various positions, opacities (0.14–0.22), and rotations, all \`pointer-events-none\`

### SlideRules (Slide 2)

- **Layout:** 2×2 grid of RuleCards
- **RuleCard structure:** \`rounded-xl border border-border bg-white\`, large watermark number (\`text-[120px]–[180px] text-concrete/20\`), title, body, optional bullet list with CheckCircle2 icons
- 4 rules: Share Impactful Updates, Be Concise, Limit Demos, Use a Clear Structure

### SlideAgenda (Slide 3)

- **Layout:** 2-column, left = agenda card, right = title + illustration
- **Agenda card:** White card with PillBadge "Agenda", 4 items with ArrowRight icons, time allocations
- **Right side:** Paper airplane illustration, date range heading (\`text-5xl–8xl\`), description
- **Background:** Paper Airplane + Coin illustration at bottom-right, opacity 0.15

### SlideGoals (Slide 4)

- **Layout:** Vertical stack of objective cards
- **Objective card:** White card with colored left accent bar (\`bg-turquoise\`, \`bg-lime\`, \`bg-slate\`), header with objective label
- **Key Results rows:** KR description, status pill, progress bar
- **Status pills:**
  - On Track: \`bg-cactus/15 text-evergreen\`
  - In Progress: \`bg-lime/20 text-slate\`
  - At Risk: \`bg-papaya/15 text-papaya\`
  - Not Started: \`bg-mango/15 text-mango\`
- **Progress bars:** \`h-7 rounded-lg\`, turquoise fill + stone remainder, percentage label, min/max range below
- **Background:** Rocket Launch illustration, opacity 0.12, -rotate-12

### Typography in Slides

| Element | Style |
|---------|-------|
| Slide titles | \`font-display font-black text-4xl–8xl leading-[0.95] tracking-tight\` |
| Card headings | \`font-display font-extrabold text-2xl–3xl leading-snug\` |
| Body text | \`text-lg–2xl text-muted-foreground leading-relaxed\` |
| PillBadge | \`font-display font-extrabold text-lg–2xl bg-turquoise text-slate rounded-full px-5 py-1.5\` |
| Footer | \`text-xs–sm\`, "Team Weekly" in \`font-display font-extrabold\` |

### Illustration Placement in Slides

- Background collage: \`absolute\` positioned, \`pointer-events-none\`, \`opacity-[0.12]–[0.22]\`
- Rotations: \`-rotate-12\`, \`rotate-6\`, \`rotate-[18deg]\`, etc.
- Loaded via \`<object type="image/svg+xml">\` with \`style={{ pointerEvents: 'none' }}\`
- Sizes: 35px–300px depending on visual weight and viewport

### Color Usage in Slides

| Surface | Color |
|---------|-------|
| Slide background | stone \`#EFEBE7\` |
| Content cards | white, \`border border-border\` |
| Primary accent | turquoise (pills, progress bars) |
| Text headings | foreground (slate) |
| Body text | muted-foreground (mocha) |
| Objective accents | turquoise, lime, slate (black) |

---

## Illustration Library

100+ SVG illustrations organized by category. All available in \`/illustrations/\` directory.

### Usage Pattern

\`\`\`tsx
{/* As <object> for inline SVG rendering (presentations, decorative) */}
<object
  type="image/svg+xml"
  data="/illustrations/Félix Illo 1.svg"
  className="h-full w-full"
  style={{ pointerEvents: 'none' }}
  aria-hidden="true"
/>

{/* As <img> for simpler use cases */}
<img src="/illustrations/card.svg" alt="" aria-hidden className="h-[54px] pointer-events-none" />
\`\`\`

### Categories

| Category | Examples |
|----------|---------|
| **Brand & Characters** | Félix Illo 1, Félix Illo 2, Félix mascot variants |
| **Flags — 3D** | 3D flags for supported send-to countries |
| **Flags — Original** | Flat-style hand-drawn flag illustrations |
| **Hands** | Hand illustrations for CTAs, onboarding |
| **Money & Payments** | Flying Dollar Bills, Dollar bill, Coin – Lime, Cloud Coin – Turquoise, Dollar bills + Coins A, cashAirplane, card.svg, Bank.svg, cash.svg |
| **Communication** | Messaging, notifications, support illustrations |
| **Status & Alerts** | Confirmation, error, loading states |
| **Navigation & Maps** | Location pins, store finder illustrations |
| **Other** | Paper Airplane + Coin, Rocket Launch + Growth + Coin, 3 Paper Airplanes + Coins |

---

## Copy Guidelines

### Heading Style
- \`font-display\` (Plain), extrabold or black weight
- Sentence case, direct and warm
- Good: "How do you want to pay?" — Bad: "Select Payment Method"

### Body Style
- \`font-sans\` (Saans), normal or medium weight
- Short sentences, conversational tone
- Helper text at \`text-[12px]–[14px] text-mocha\`

### CTA Verbs
- "Continue", "Send now", "Share on WhatsApp", "Link account"
- Action-oriented, present tense, no jargon

### Helper Text
- Below inputs: \`text-[12px] text-mocha mt-1.5 px-1 leading-snug\`
- Contextual guidance, not validation rules
- Example: "If your card shows a bank name, enter the account holder's name."

### Tone
- Warm, supportive, confident
- Acknowledge the emotional weight of sending money home
- Never condescending about financial literacy
- Celebrate milestones ("Your payment went through!")

### Legal / Compliance Text
- \`text-[11px] text-mocha text-center leading-relaxed\`
- Links underlined with \`underline-offset-2\`
- Green Dot disclaimer at \`text-[10px]\`

---

*Felix Pago Design System · Comprehensive Reference*
`
