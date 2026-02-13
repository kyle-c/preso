import { DesignSystemLayout } from "@/components/design-system/design-system-layout"
import { Section } from "@/components/design-system/section"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

const baseClasses = "inline-flex h-11 items-center justify-center rounded-full px-6 text-sm font-semibold transition-all focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:outline-none"

const explorations = [
  {
    id: "current",
    title: "Current: Slate",
    description: "Slate background with Turquoise text. Visually dominant, competes with Primary.",
    classes: "bg-slate text-turquoise hover:bg-slate/90",
    code: "bg-slate text-turquoise",
    textContrast: "10.5:1",
    textWcag: "AAA",
    boundaryContrast: "17.8:1",
    boundaryNote: "Slate bg vs Linen - highly visible",
  },
  {
    id: "option-a",
    title: "Option A: Concrete",
    description: "Warm neutral that clearly defers to the Primary button.",
    classes: "bg-concrete text-slate hover:bg-concrete/80",
    code: "bg-concrete text-slate",
    textContrast: "11.2:1",
    textWcag: "AAA",
    boundaryContrast: "1.6:1",
    boundaryNote: "Concrete bg vs Linen - subtle but visible",
  },
  {
    id: "option-b",
    title: "Option B: Stone",
    description: "Even lighter and more subtle, creates clear visual hierarchy.",
    classes: "bg-stone text-slate hover:bg-stone/80",
    code: "bg-stone text-slate",
    textContrast: "14.8:1",
    textWcag: "AAA",
    boundaryContrast: "1.1:1",
    boundaryNote: "Stone bg vs Linen - nearly invisible boundary",
    warning: "Button boundary not distinguishable on Linen",
  },
  {
    id: "option-c",
    title: "Option C: Evergreen",
    description: "Stays in the brand teal family but darker and more muted than Primary.",
    classes: "bg-evergreen text-linen hover:bg-evergreen/90",
    code: "bg-evergreen text-linen",
    textContrast: "5.5:1",
    textWcag: "AA",
    boundaryContrast: "5.2:1",
    boundaryNote: "Evergreen bg vs Linen - clearly visible",
  },
  {
    id: "option-d",
    title: "Option D: Turquoise Ghost",
    description: "Connects to Primary through color family while staying subordinate.",
    classes: "bg-turquoise-100 text-slate hover:bg-turquoise-200",
    code: "bg-turquoise-100 text-slate",
    textContrast: "14.1:1",
    textWcag: "AAA",
    boundaryContrast: "1.3:1",
    boundaryNote: "Turquoise-100 bg vs Linen - subtle boundary",
    warning: "Button boundary is faint on Linen",
  },
  {
    id: "option-e",
    title: "Option E: Turquoise Border",
    description: "Lightweight feel, pairs well without adding visual weight.",
    classes: "border-2 border-turquoise-700 bg-transparent text-slate hover:bg-turquoise-50",
    code: "border-2 border-turquoise-700 text-slate",
    textContrast: "18.5:1",
    textWcag: "AAA",
    boundaryContrast: "4.8:1",
    boundaryNote: "Turquoise-700 border vs Linen - clearly visible",
  },
  {
    id: "option-f",
    title: "Option F: Concrete Border",
    description: "Completely neutral, maximum deference to Primary.",
    classes: "border-2 border-concrete bg-transparent text-slate hover:bg-stone",
    code: "border-2 border-concrete text-slate",
    textContrast: "18.5:1",
    textWcag: "AAA",
    boundaryContrast: "1.4:1",
    boundaryNote: "Concrete border vs Linen - very faint",
    warning: "Border barely visible on Linen",
  },
]

export default function ButtonExplorationsPage() {
  return (
    <DesignSystemLayout
      title="Secondary Button Explorations"
      description="Exploring secondary button options that complement the Primary (Turquoise) button without visually overpowering it."
    >
      <div className="space-y-10">
        {explorations.map((option) => (
          <Section
            key={option.id}
            id={option.id}
            title={option.title}
            description={option.description}
          >
            <div className="rounded-lg border border-border bg-linen p-8">
              {/* Accessibility badges */}
              <div className="mb-6 space-y-2">
                <div className="flex flex-wrap items-center gap-3">
                  <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${option.textWcag === "AAA" ? "bg-cactus/20 text-evergreen" : "bg-mango/20 text-papaya"}`}>
                    Text: WCAG {option.textWcag}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    Text contrast: {option.textContrast}
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${Number.parseFloat(option.boundaryContrast) >= 3 ? "bg-cactus/20 text-evergreen" : "bg-destructive/10 text-destructive"}`}>
                    Boundary: {Number.parseFloat(option.boundaryContrast) >= 3 ? "Pass" : "Fail"}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    Boundary vs Linen: {option.boundaryContrast} - {option.boundaryNote}
                  </span>
                </div>
                {option.warning && (
                  <p className="text-xs font-medium text-destructive">
                    Warning: {option.warning}
                  </p>
                )}
              </div>

              {/* All variants row */}
              <h4 className="mb-4 text-sm font-medium text-muted-foreground">All Variants</h4>
              <div className="mb-8 flex flex-wrap items-center gap-4">
                <Button>Primary</Button>
                <button type="button" className={`${baseClasses} ${option.classes}`}>
                  Secondary
                </button>
                <Button variant="outline">Outline</Button>
                <Button variant="ghost">Ghost</Button>
                <Button variant="link">Link</Button>
                <Button variant="link-muted">Link Muted</Button>
                <Button variant="destructive">Destructive</Button>
              </div>

              {/* Primary + Secondary pairing */}
              <h4 className="mb-4 text-sm font-medium text-muted-foreground">Primary + Secondary Pairing</h4>
              <div className="mb-8 flex items-center gap-4">
                <Button>
                  Get Started <ArrowRight className="h-4 w-4" />
                </Button>
                <button type="button" className={`${baseClasses} ${option.classes} gap-2`}>
                  Learn More <ArrowRight className="h-4 w-4" />
                </button>
              </div>

              {/* Sizes */}
              <h4 className="mb-4 text-sm font-medium text-muted-foreground">Sizes</h4>
              <div className="mb-8 flex flex-wrap items-center gap-4">
                <button type="button" className={`${baseClasses} ${option.classes} h-9 px-4 text-xs`}>
                  Small
                </button>
                <button type="button" className={`${baseClasses} ${option.classes}`}>
                  Default
                </button>
                <button type="button" className={`${baseClasses} ${option.classes} h-12 px-8`}>
                  Large
                </button>
              </div>

              {/* States */}
              <h4 className="mb-4 text-sm font-medium text-muted-foreground">States</h4>
              <div className="mb-6 flex flex-wrap items-center gap-6">
                <div className="flex flex-col items-center gap-2">
                  <button type="button" className={`${baseClasses} ${option.classes}`}>
                    Enabled
                  </button>
                  <span className="text-xs text-muted-foreground">Default</span>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <button type="button" disabled className={`${baseClasses} ${option.classes} opacity-40 pointer-events-none`}>
                    Disabled
                  </button>
                  <span className="text-xs text-muted-foreground">Disabled</span>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <Button disabled>Primary Disabled</Button>
                  <span className="text-xs text-muted-foreground">Primary Disabled</span>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <Button variant="outline" disabled>Outline Disabled</Button>
                  <span className="text-xs text-muted-foreground">Outline Disabled</span>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <Button variant="destructive" disabled>Destructive Disabled</Button>
                  <span className="text-xs text-muted-foreground">Destructive Disabled</span>
                </div>
              </div>

              <code className="block text-xs text-muted-foreground">{option.code}</code>
            </div>
          </Section>
        ))}
      </div>
    </DesignSystemLayout>
  )
}
