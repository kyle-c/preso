'use client'

import { useState } from "react"
import { DesignSystemLayout } from "@/components/design-system/design-system-layout"
import { Section } from "@/components/design-system/section"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { FloatingInput } from "@/components/ui/floating-input"
import { StatusBadge } from "@/components-next/status-badge"
import { FeatureCard } from "@/components-next/feature-card"
import { FormField, formatCardNumber, formatExpiry as formatExpiryFmt, formatCVV, formatZIP } from "@/components-next/form-field"
import { ArrowRight, Send, Download, Plus, Check, X, Loader2, ChevronDown } from "lucide-react"

/* ── Interactive form demos ─────────────────────────────────── */

function ErrorStatesDemo() {
  return (
    <div className="max-w-md space-y-4">
      <FloatingInput label="Default" />
      <FloatingInput label="With error" error="This field is required" />
      <FloatingInput label="Valid state" isValid defaultValue="hello@felix.com" />
      <FloatingInput label="Disabled" disabled />
    </div>
  )
}

function FormattedInputsDemo() {
  const [card, setCard] = useState('')
  const [expiry, setExpiry] = useState('')
  const [cvv, setCvv] = useState('')
  const [zip, setZip] = useState('')

  return (
    <div className="max-w-md space-y-4">
      <FormField
        label="Card number"
        value={card}
        onChange={setCard}
        format={formatCardNumber}
        inputMode="numeric"
        autoComplete="cc-number"
      />
      <div className="grid grid-cols-2 gap-3">
        <FormField
          label="MM/YY"
          value={expiry}
          onChange={setExpiry}
          format={formatExpiryFmt}
          maxLength={5}
          inputMode="numeric"
          autoComplete="cc-exp"
        />
        <FormField
          label="CVV"
          value={cvv}
          onChange={setCvv}
          format={formatCVV}
          maxLength={4}
          inputMode="numeric"
          autoComplete="cc-csc"
        />
      </div>
      <FormField
        label="ZIP code"
        value={zip}
        onChange={setZip}
        format={formatZIP}
        inputMode="numeric"
      />
    </div>
  )
}

function ValidationDemo() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')

  const validateName = (v: string) => !v.trim() ? 'Full name is required' : undefined
  const validateEmail = (v: string) => {
    if (!v.trim()) return 'Email is required'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) return 'Enter a valid email address'
  }
  const validatePhone = (v: string) => {
    if (!v.trim()) return 'Phone number is required'
    if (v.replace(/\D/g, '').length < 10) return 'Enter a 10-digit phone number'
  }

  const canContinue = !validateName(name) && !validateEmail(email) && !validatePhone(phone)

  return (
    <div className="max-w-md space-y-4">
      <FormField
        label="Full name"
        value={name}
        onChange={setName}
        validate={validateName}
      />
      <FormField
        label="Email address"
        type="email"
        value={email}
        onChange={setEmail}
        validate={validateEmail}
      />
      <FormField
        label="Phone number"
        type="tel"
        value={phone}
        onChange={setPhone}
        validate={validatePhone}
      />
      <Button className="w-full" disabled={!canContinue}>
        Continue
      </Button>
      <p className="text-xs text-muted-foreground text-center">
        Tab through fields and leave them empty to see validation errors.
      </p>
    </div>
  )
}

function CustomSelectDemo() {
  const [state, setState] = useState('')
  const [touched, setTouched] = useState(false)
  const error = touched && !state ? 'Please select a state' : undefined

  return (
    <div className="max-w-md space-y-4">
      <div className="relative">
        <select
          value={state}
          onChange={e => setState(e.target.value)}
          onBlur={() => setTouched(true)}
          className={`h-14 w-full appearance-none rounded-xl border bg-transparent px-4 pt-4 pb-2 text-base text-foreground transition-colors outline-none ${
            error
              ? 'border-red-400 focus:border-red-400 focus:ring-[3px] focus:ring-red-400/20'
              : state
                ? 'border-turquoise/60 focus:border-turquoise focus:ring-[3px] focus:ring-turquoise/25'
                : 'border-border focus:border-turquoise focus:ring-[3px] focus:ring-turquoise/25'
          }`}
        >
          <option value="">Select a state...</option>
          {['California', 'Texas', 'New York', 'Florida', 'Illinois', 'Arizona', 'Nevada', 'Colorado'].map(s => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
        <ChevronDown className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        {error && <p className="mt-1.5 px-1 text-[12px] text-red-400 leading-snug">{error}</p>}
      </div>
      <FloatingInput label="City" />
      <FloatingInput label="ZIP code" inputMode="numeric" maxLength={5} />
    </div>
  )
}

/* ── Page ────────────────────────────────────────────────────── */

export default function ComponentsPage() {
  return (
    <DesignSystemLayout
      title="Components"
      description="Pre-built UI components following the Felix Pago design language. All components use shadcn/ui as a foundation with custom Felix Pago styling."
    >
      <Section
        id="buttons"
        title="Buttons"
        description="Buttons are used to trigger actions and navigation. They come in multiple variants and sizes."
        accessibility={{
          score: "8.5/10",
          wcag: "AA",
          notes: [
            "Primary (Slate on Turquoise): 10.5:1 - AAA",
            "Secondary (Slate on Concrete): 11.2:1 - AAA",
            "Outline (Slate on transparent): 18.5:1 - AAA",
            "Link Muted (Mocha on Linen): 4.9:1 - AA, borderline for small text",
            "Ghost: No visible boundary at rest",
          ],
        }}
      >
        <div className="space-y-8">
          {/* Primary Variants */}
          <div>
            <h4 className="mb-4 text-sm font-medium text-muted-foreground">Variants</h4>
            <div className="flex flex-wrap items-center gap-4">
              <Button>Primary</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="outline">Outline</Button>
              <Button variant="ghost">Ghost</Button>
              <Button variant="link">Link</Button>
              <Button variant="link-muted">Link Muted</Button>
              <Button variant="destructive">Destructive</Button>
            </div>
          </div>

          {/* Sizes */}
          <div>
            <h4 className="mb-4 text-sm font-medium text-muted-foreground">Sizes</h4>
            <div className="flex flex-wrap items-center gap-4">
              <Button size="sm">Small</Button>
              <Button size="default">Default</Button>
              <Button size="lg">Large</Button>
              <Button size="icon"><Plus className="h-4 w-4" /></Button>
            </div>
          </div>

          {/* With Icons */}
          <div>
            <h4 className="mb-4 text-sm font-medium text-muted-foreground">With Icons</h4>
            <div className="flex flex-wrap items-center gap-4">
              <Button>
                Get Started <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button variant="secondary">
                <Send className="mr-2 h-4 w-4" /> Send Money
              </Button>
              <Button variant="outline">
                <Download className="mr-2 h-4 w-4" /> Download
              </Button>
            </div>
          </div>

          {/* States */}
          <div>
            <h4 className="mb-4 text-sm font-medium text-muted-foreground">States</h4>
            <div className="flex flex-wrap items-center gap-4">
              <Button disabled>Disabled</Button>
              <Button disabled>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Loading
              </Button>
            </div>
          </div>


        </div>
      </Section>

      <Section
        id="cards"
        title="Cards"
        description="Cards contain content and actions about a single subject."
        accessibility={{
          score: "9.5/10",
          wcag: "AAA",
          notes: [
            "Default Card description (Slate/70 on Stone): 10.4:1 - AAA",
            "Featured Card description (Linen on Slate): 17.8:1 - AAA",
            "Accent Card description (Slate/70 on Turquoise): 7.4:1 - AAA",
            "Feature Card Sky body (Slate on Sky): 10.5:1 - AAA",
            "Feature Card Cactus body (Slate on Cactus): 6.8:1 - AA",
            "Default Card bg vs Linen: 1.1:1 - relies on border for boundary",
          ],
        }}
      >
        <div className="grid gap-6 md:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>Default Card</CardTitle>
              <CardDescription className="text-slate/70">A simple card with header and content.</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-slate/70">
                Cards are a great way to group related content and actions together.
              </p>
            </CardContent>
            <CardFooter>
              <Button className="w-full">Action</Button>
            </CardFooter>
          </Card>

          <Card className="border-turquoise bg-slate text-linen">
            <CardHeader>
              <CardTitle className="text-turquoise">Featured Card</CardTitle>
              <CardDescription className="text-linen">Highlighted with brand colors.</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-linen">
                Use this style to draw attention to important information or premium features.
              </p>
            </CardContent>
            <CardFooter>
              <Button className="w-full">Get Started</Button>
            </CardFooter>
          </Card>

          <Card className="bg-turquoise">
            <CardHeader>
              <CardTitle className="text-slate">Accent Card</CardTitle>
              <CardDescription className="text-slate/70">Turquoise background variant.</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-slate/70">
                Perfect for callouts, announcements, or promotional content.
              </p>
            </CardContent>
            <CardFooter>
              <Button className="w-full bg-linen text-slate hover:bg-linen/90">Learn More</Button>
            </CardFooter>
          </Card>
        </div>

        {/* Feature Cards */}
        <h4 className="mb-4 mt-8 text-sm font-medium text-muted-foreground">Feature Cards</h4>
        <div className="grid gap-6 md:grid-cols-2">
          <FeatureCard
            icon={<Send className="text-turquoise" />}
            title="Send Money"
            description="Transfer money to friends and family instantly with just a text message."
            accent="bg-sky"
          />
          <FeatureCard
            icon={<Check className="text-cactus" />}
            title="Build Credit"
            description="Improve your credit score with our innovative credit-building tools."
            accent="bg-cactus"
          />
        </div>
      </Section>

      <Section
        id="inputs"
        title="Form Inputs"
        description="Input components for collecting user data. FloatingInput supports error states, validation feedback, and input formatting out of the box."
        accessibility={{
          score: "8/10",
          wcag: "AA",
          notes: [
            "Label text (Slate on Linen): 18.5:1 - AAA",
            "Placeholder (Evergreen on Linen): 5.2:1 - AA",
            "Input border (Mocha on Linen): 4.9:1 - AA",
            "Error text (Red-400 on Linen): 5.8:1 - AA",
            "Valid border (Turquoise/60 on Linen): 2.1:1 - relies on color + thickness",
            "Disabled input at 50% opacity: ~2.6:1 - below 3:1 minimum",
          ],
        }}
      >
        <div className="space-y-10">
          {/* Error & Validation States */}
          <div>
            <h4 className="mb-4 text-sm font-medium text-muted-foreground">States</h4>
            <ErrorStatesDemo />
          </div>

          {/* Formatted Inputs */}
          <div>
            <h4 className="mb-2 text-sm font-medium text-muted-foreground">Formatted Inputs</h4>
            <p className="mb-4 text-sm text-muted-foreground">Auto-formatting for card numbers (groups of 4), expiry dates (MM/YY), CVV, and ZIP codes. Numeric-only inputs use <code className="rounded bg-stone px-1.5 py-0.5 text-xs font-mono text-foreground">inputMode=&quot;numeric&quot;</code>.</p>
            <FormattedInputsDemo />
          </div>

          {/* Custom Select */}
          <div>
            <h4 className="mb-2 text-sm font-medium text-muted-foreground">Custom Select</h4>
            <p className="mb-4 text-sm text-muted-foreground">Native select styled to match FloatingInput. Includes validation states and a custom chevron icon overlay.</p>
            <CustomSelectDemo />
          </div>

          {/* Validation Pattern */}
          <div>
            <h4 className="mb-2 text-sm font-medium text-muted-foreground">Touched-State Validation</h4>
            <p className="mb-4 text-sm text-muted-foreground">Errors appear only after a field loses focus, preventing premature validation while the user is still typing. The continue button stays disabled until all fields pass.</p>
            <ValidationDemo />
          </div>

          {/* Brand Styled */}
          <div>
            <h4 className="mb-4 text-sm font-medium text-muted-foreground">Brand Styled</h4>
            <div className="max-w-md flex overflow-hidden rounded-full border-2 border-concrete bg-linen">
              <input
                type="email"
                placeholder="Enter your email..."
                className="flex-1 bg-transparent px-4 py-3 text-slate placeholder:text-slate/50 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset"
              />
              <button type="button" className="rounded-full bg-turquoise px-6 py-3 font-medium text-slate transition-colors hover:bg-turquoise/90">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </Section>

      <Section
        id="badges"
        title="Badges"
        description="Small labels for status, categories, and counts."
        accessibility={{
          score: "7.5/10",
          wcag: "AA",
          notes: [
            "Default (Slate on Turquoise): 10.5:1 - AAA",
            "Secondary (Slate on Concrete): 11.2:1 - AAA",
            "Destructive (Slate on Papaya): 5.1:1 - AA",
            "Papaya brand (Slate on Papaya): 5.1:1 - AA",
            "Cactus brand (Slate on Cactus): 6.8:1 - AA",
            "Mango brand (Slate on Mango): 5.6:1 - AA",
          ],
        }}
      >
        <div className="space-y-6">
          {/* Variants */}
          <div>
            <h4 className="mb-4 text-sm font-medium text-muted-foreground">Variants</h4>
            <div className="flex flex-wrap items-center gap-2">
              <Badge>Default</Badge>
              <Badge variant="secondary">Secondary</Badge>
              <Badge variant="outline">Outline</Badge>
              <Badge variant="destructive">Destructive</Badge>
            </div>
          </div>

          {/* Status Badges */}
          <div>
            <h4 className="mb-4 text-sm font-medium text-muted-foreground">Status Badges</h4>
            <div className="flex flex-wrap items-center gap-2">
              <StatusBadge variant="success" icon={<Check />}>Completed</StatusBadge>
              <StatusBadge variant="warning" icon={<Loader2 className="animate-spin" />}>Pending</StatusBadge>
              <StatusBadge variant="error" icon={<X />}>Failed</StatusBadge>
            </div>
          </div>

          {/* Brand Colored */}
          <div>
            <h4 className="mb-4 text-sm font-medium text-muted-foreground">Brand Colors</h4>
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-turquoise px-3 py-1 text-xs font-medium text-slate">Turquoise</span>
              <span className="rounded-full bg-slate px-3 py-1 text-xs font-medium text-turquoise">Slate</span>
              <span className="rounded-full bg-blueberry px-3 py-1 text-xs font-medium text-linen">Blueberry</span>
              <span className="rounded-full bg-evergreen px-3 py-1 text-xs font-medium text-linen">Evergreen</span>
              <span className="rounded-full bg-papaya px-3 py-1 text-xs font-medium text-slate">Papaya</span>
              <span className="rounded-full bg-cactus px-3 py-1 text-xs font-medium text-slate">Cactus</span>
              <span className="rounded-full bg-mango px-3 py-1 text-xs font-medium text-slate">Mango</span>
              <span className="rounded-full bg-lime px-3 py-1 text-xs font-medium text-slate">Lime</span>
            </div>
          </div>
        </div>
      </Section>
    </DesignSystemLayout>
  )
}
