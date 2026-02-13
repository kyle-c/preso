import { DesignSystemLayout } from "@/components/design-system/design-system-layout"
import { Section } from "@/components/design-system/section"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { FloatingInput } from "@/components/ui/floating-input"
import { ArrowRight, Send, Download, Plus, Check, X, Loader2 } from "lucide-react"

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
          <div className="rounded-xl bg-sky p-6">
            <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-slate">
              <Send className="h-6 w-6 text-turquoise" />
            </div>
            <h3 className="mb-2 font-display text-xl font-bold text-slate">Send Money</h3>
            <p className="text-sm text-slate">
              Transfer money to friends and family instantly with just a text message.
            </p>
          </div>

          <div className="rounded-xl bg-cactus p-6">
            <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-slate">
              <Check className="h-6 w-6 text-cactus" />
            </div>
            <h3 className="mb-2 font-display text-xl font-bold text-slate">Build Credit</h3>
            <p className="text-sm text-slate">
              Improve your credit score with our innovative credit-building tools.
            </p>
          </div>
        </div>
      </Section>

      <Section
        id="inputs"
        title="Form Inputs"
        description="Input components for collecting user data."
        accessibility={{
          score: "8/10",
          wcag: "AA",
          notes: [
            "Label text (Slate on Linen): 18.5:1 - AAA",
            "Placeholder (Evergreen on Linen): 5.2:1 - AA",
            "Input border (Mocha on Linen): 4.9:1 - AA",
            "Brand input border (Concrete on Linen): 1.6:1 - low boundary visibility",
            "Disabled input at 50% opacity: ~2.6:1 - below 3:1 minimum",
          ],
        }}
      >
        <div className="max-w-md space-y-6">
          {/* Floating Label Inputs */}
          <div className="space-y-4">
            <FloatingInput label="Email address" type="email" />
            <FloatingInput label="Phone number" type="tel" />
            <FloatingInput label="Disabled input" disabled />
          </div>

          {/* Brand Styled */}
          <div>
            <h4 className="mb-4 text-sm font-medium text-muted-foreground">Brand Styled</h4>
            <div className="flex overflow-hidden rounded-full border-2 border-concrete bg-linen">
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
              <span className="inline-flex items-center gap-1 rounded-full bg-cactus/20 px-3 py-1 text-xs font-medium text-evergreen">
                <Check className="h-3 w-3" /> Completed
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-mango/20 px-3 py-1 text-xs font-medium text-slate">
                <Loader2 className="h-3 w-3 animate-spin" /> Pending
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-papaya/20 px-3 py-1 text-xs font-medium text-slate">
                <X className="h-3 w-3" /> Failed
              </span>
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
