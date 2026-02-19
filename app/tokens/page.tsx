import { DesignSystemLayout } from "@/components/design-system/design-system-layout"
import { Section } from "@/components/design-system/section"

const semanticTokens = [
  { token: "--background", value: "#FEFCF9 (Linen)", description: "Page and container backgrounds", light: "#FEFCF9", dark: "#082422" },
  { token: "--foreground", value: "#082422 (Slate)", description: "Primary text color", light: "#082422", dark: "#FEFCF9" },
  { token: "--card", value: "#EFEBE7 (Stone)", description: "Card backgrounds", light: "#EFEBE7", dark: "#082422" },
  { token: "--card-foreground", value: "#082422 (Slate)", description: "Card text color", light: "#082422", dark: "#FEFCF9" },
  { token: "--primary", value: "#2BF2F1 (Turquoise)", description: "Primary actions and accents", light: "#2BF2F1", dark: "#2BF2F1" },
  { token: "--primary-foreground", value: "#082422 (Slate)", description: "Text on primary backgrounds", light: "#082422", dark: "#082422" },
  { token: "--secondary", value: "#CFCABF (Concrete)", description: "Secondary actions", light: "#CFCABF", dark: "#35605F" },
  { token: "--secondary-foreground", value: "#082422 (Slate)", description: "Text on secondary backgrounds", light: "#082422", dark: "#FEFCF9" },
  { token: "--muted", value: "#EFEBE7 (Stone)", description: "Muted backgrounds", light: "#EFEBE7", dark: "#35605F" },
  { token: "--muted-foreground", value: "#35605F (Evergreen)", description: "Muted/secondary text", light: "#35605F", dark: "#CFCABF" },
  { token: "--accent", value: "#2BF2F1 (Turquoise)", description: "Accent highlights", light: "#2BF2F1", dark: "#2BF2F1" },
  { token: "--accent-foreground", value: "#082422 (Slate)", description: "Text on accent backgrounds", light: "#082422", dark: "#082422" },
  { token: "--destructive", value: "#F26629 (Papaya)", description: "Error and destructive actions", light: "#F26629", dark: "#F26629" },
  { token: "--destructive-foreground", value: "#082422 (Slate)", description: "Text on destructive backgrounds", light: "#082422", dark: "#082422" },
  { token: "--border", value: "#CFCABF (Concrete)", description: "Borders, dividers, and default (unfocused) input borders", light: "#CFCABF", dark: "#35605F" },
  { token: "--input", value: "#877867 (Mocha)", description: "Focused/active input border state — darker than default", light: "#877867", dark: "#35605F" },
  { token: "--ring", value: "#877867 (Mocha)", description: "Focus shadow glow — tonal with the input border", light: "#877867", dark: "#CFCABF" },
]

const brandTokens = [
  { token: "--turquoise", value: "#2BF2F1", description: "Primary brand color" },
  { token: "--slate", value: "#082422", description: "Secondary brand color" },
  { token: "--concrete", value: "#CFCABF", description: "Warm gray neutral" },
  { token: "--stone", value: "#EFEBE7", description: "Light warm neutral" },
  { token: "--linen", value: "#FEFCF9", description: "Off-white background" },
  { token: "--blueberry", value: "#6060BF", description: "Secondary accent" },
  { token: "--evergreen", value: "#35605F", description: "Dark green accent" },
  { token: "--mocha", value: "#877867", description: "Brown accent" },
  { token: "--papaya", value: "#F26629", description: "Orange/error accent" },
  { token: "--sky", value: "#8DFDFA", description: "Light cyan accent" },
  { token: "--cactus", value: "#60D06F", description: "Green/success accent" },
  { token: "--yam", value: "#C1A98A", description: "Tan accent" },
  { token: "--mango", value: "#F19D38", description: "Orange accent" },
  { token: "--light-sky", value: "#D4FFFE", description: "Very light cyan" },
  { token: "--lime", value: "#DCFF00", description: "Yellow-green accent" },
  { token: "--lychee", value: "#FFCD9C", description: "Peach accent" },
  { token: "--fortuna", value: "#FFB05A", description: "Light orange accent" },
]

const chartTokens = [
  { token: "--chart-1", value: "#2BF2F1 (Turquoise)", description: "Primary chart color" },
  { token: "--chart-2", value: "#6060BF (Blueberry)", description: "Secondary chart color" },
  { token: "--chart-3", value: "#60D06F (Cactus)", description: "Tertiary chart color" },
  { token: "--chart-4", value: "#F19D38 (Mango)", description: "Fourth chart color" },
  { token: "--chart-5", value: "#F26629 (Papaya)", description: "Fifth chart color" },
]

const sidebarTokens = [
  { token: "--sidebar", value: "#082422 (Slate)", description: "Sidebar background" },
  { token: "--sidebar-foreground", value: "#FEFCF9 (Linen)", description: "Sidebar text" },
  { token: "--sidebar-primary", value: "#2BF2F1 (Turquoise)", description: "Sidebar active state" },
  { token: "--sidebar-primary-foreground", value: "#082422 (Slate)", description: "Sidebar active text" },
  { token: "--sidebar-accent", value: "#35605F (Evergreen)", description: "Sidebar hover state" },
  { token: "--sidebar-accent-foreground", value: "#FEFCF9 (Linen)", description: "Sidebar hover text" },
  { token: "--sidebar-border", value: "#35605F (Evergreen)", description: "Sidebar borders" },
  { token: "--sidebar-ring", value: "#2BF2F1 (Turquoise)", description: "Sidebar focus rings" },
]

const spacingTokens = [
  { token: "--spacing-xs", value: "0.25rem (4px)", description: "Tight gaps, icon spacing", tailwind: "gap-1, p-1" },
  { token: "--spacing-sm", value: "0.5rem (8px)", description: "Related elements, small padding", tailwind: "gap-2, p-2" },
  { token: "--spacing-md", value: "1rem (16px)", description: "Standard component padding", tailwind: "gap-4, p-4" },
  { token: "--spacing-lg", value: "1.5rem (24px)", description: "Section gaps, card padding", tailwind: "gap-6, p-6" },
  { token: "--spacing-xl", value: "2rem (32px)", description: "Large section spacing", tailwind: "gap-8, p-8" },
  { token: "--spacing-2xl", value: "3rem (48px)", description: "Major section separators", tailwind: "gap-12, py-12" },
  { token: "--spacing-3xl", value: "4rem (64px)", description: "Page-level spacing", tailwind: "gap-16, py-16" },
]

const borderRadiusTokens = [
  { token: "--radius-none", value: "0px", description: "Sharp corners, no rounding", tailwind: "rounded-none", preview: "0px" },
  { token: "--radius-sm", value: "0.25rem (4px)", description: "Subtle rounding for small elements", tailwind: "rounded-sm", preview: "4px" },
  { token: "--radius-md", value: "0.5rem (8px)", description: "Standard components (inputs, buttons)", tailwind: "rounded-md", preview: "8px" },
  { token: "--radius-lg", value: "1rem (16px)", description: "Cards, dialogs, larger components", tailwind: "rounded-lg", preview: "16px" },
  { token: "--radius-xl", value: "1.5rem (24px)", description: "Feature cards, sheets", tailwind: "rounded-xl", preview: "24px" },
  { token: "--radius-2xl", value: "2rem (32px)", description: "Large promotional cards", tailwind: "rounded-2xl", preview: "32px" },
  { token: "--radius-full", value: "9999px", description: "Pills, avatars, fully rounded", tailwind: "rounded-full", preview: "9999px" },
]

const shadowTokens = [
  {
    token: "--shadow-xs",
    value: "0 1px 2px rgba(8, 36, 34, 0.03)",
    description: "Subtle depth for inputs, small interactive elements",
    tailwind: "shadow-xs",
    css: "0 1px 2px rgba(8, 36, 34, 0.03)"
  },
  {
    token: "--shadow-sm",
    value: "0 1px 3px rgba(8, 36, 34, 0.06), 0 1px 2px rgba(8, 36, 34, 0.04)",
    description: "Buttons, form controls, subtle cards",
    tailwind: "shadow-sm",
    css: "0 1px 3px rgba(8, 36, 34, 0.06), 0 1px 2px rgba(8, 36, 34, 0.04)"
  },
  {
    token: "--shadow-md",
    value: "0 4px 6px rgba(8, 36, 34, 0.06), 0 2px 4px rgba(8, 36, 34, 0.04)",
    description: "Cards, dropdowns, hover states",
    tailwind: "shadow-md",
    css: "0 4px 6px rgba(8, 36, 34, 0.06), 0 2px 4px rgba(8, 36, 34, 0.04)"
  },
  {
    token: "--shadow-lg",
    value: "0 10px 15px rgba(8, 36, 34, 0.06), 0 4px 6px rgba(8, 36, 34, 0.03)",
    description: "Popovers, tooltips, floating elements",
    tailwind: "shadow-lg",
    css: "0 10px 15px rgba(8, 36, 34, 0.06), 0 4px 6px rgba(8, 36, 34, 0.03)"
  },
  {
    token: "--shadow-xl",
    value: "0 20px 25px rgba(8, 36, 34, 0.06), 0 8px 10px rgba(8, 36, 34, 0.03)",
    description: "Modals, dialogs, important overlays",
    tailwind: "shadow-xl",
    css: "0 20px 25px rgba(8, 36, 34, 0.06), 0 8px 10px rgba(8, 36, 34, 0.03)"
  },
  {
    token: "--shadow-2xl",
    value: "0 25px 50px rgba(8, 36, 34, 0.12)",
    description: "High-emphasis elements, dramatic depth",
    tailwind: "shadow-2xl",
    css: "0 25px 50px rgba(8, 36, 34, 0.12)"
  },
  {
    token: "--shadow-inner",
    value: "inset 0 2px 4px rgba(8, 36, 34, 0.04)",
    description: "Pressed states, inset inputs",
    tailwind: "shadow-inner",
    css: "inset 0 2px 4px rgba(8, 36, 34, 0.04)"
  },
  {
    token: "--shadow-turquoise",
    value: "0 4px 14px rgba(43, 242, 241, 0.25)",
    description: "Brand accent glow for primary actions",
    tailwind: "shadow-turquoise",
    css: "0 4px 14px rgba(43, 242, 241, 0.25)"
  },
]

const typographyTokens = [
  { token: "--text-caption", value: "0.75rem (12px)", description: "Caption - Labels, metadata", tailwind: "text-xs", typeScale: "Caption" },
  { token: "--text-body-sm", value: "0.875rem (14px)", description: "Body Small - Fine print, notes", tailwind: "text-sm", typeScale: "Body Small" },
  { token: "--text-body", value: "1rem (16px)", description: "Body - Default paragraph text", tailwind: "text-base", typeScale: "Body" },
  { token: "--text-body-lg", value: "1.125rem (18px)", description: "Body Large - Emphasized paragraphs", tailwind: "text-lg", typeScale: "Body Large" },
  { token: "--text-heading-4", value: "1.25rem (20px)", description: "Heading 4 - Small section titles", tailwind: "text-xl", typeScale: "Heading 4" },
  { token: "--text-heading-3", value: "1.5rem (24px)", description: "Heading 3 - Subsection titles", tailwind: "text-2xl", typeScale: "Heading 3" },
  { token: "--text-heading-2", value: "1.875rem (30px)", description: "Heading 2 - Section titles", tailwind: "text-3xl", typeScale: "Heading 2" },
  { token: "--text-heading-1", value: "2.25rem (36px)", description: "Heading 1 - Page titles", tailwind: "text-4xl", typeScale: "Heading 1" },
  { token: "--text-display-md", value: "3rem (48px)", description: "Display MD - Medium display text", tailwind: "text-5xl", typeScale: "Display MD" },
  { token: "--text-display-lg", value: "3.75rem (60px)", description: "Display LG - Large display text", tailwind: "text-6xl", typeScale: "Display LG" },
  { token: "--text-display-xl", value: "4.5rem (72px)", description: "Display XL - Hero headlines", tailwind: "text-7xl", typeScale: "Display XL" },
]

const lineHeightTokens = [
  { token: "--leading-none", value: "1", description: "Display XL, Display LG", tailwind: "leading-none", typeScale: "Display" },
  { token: "--leading-display", value: "1.1", description: "Display MD", tailwind: "leading-tight", typeScale: "Display MD" },
  { token: "--leading-heading-1", value: "1.2", description: "Heading 1", tailwind: "leading-tight", typeScale: "Heading 1" },
  { token: "--leading-heading-2", value: "1.3", description: "Heading 2", tailwind: "leading-snug", typeScale: "Heading 2" },
  { token: "--leading-heading-3", value: "1.4", description: "Heading 3, Caption", tailwind: "leading-normal", typeScale: "Heading 3" },
  { token: "--leading-heading-4", value: "1.5", description: "Heading 4, Body Small", tailwind: "leading-normal", typeScale: "Heading 4" },
  { token: "--leading-body", value: "1.6", description: "Body, Body Large", tailwind: "leading-relaxed", typeScale: "Body" },
]

const letterSpacingTokens = [
  { token: "--tracking-display", value: "-0.02em", description: "Display XL, Display LG", tailwind: "tracking-tight", typeScale: "Display" },
  { token: "--tracking-heading", value: "-0.01em", description: "Display MD, Heading 1", tailwind: "tracking-tight", typeScale: "Headings" },
  { token: "--tracking-normal", value: "0em", description: "Heading 2-4, Body text", tailwind: "tracking-normal", typeScale: "Body" },
  { token: "--tracking-caption", value: "0.01em", description: "Caption, uppercase text", tailwind: "tracking-wide", typeScale: "Caption" },
]

const fontWeightTokens = [
  { token: "--font-light", value: "300", description: "Light emphasis", tailwind: "font-light" },
  { token: "--font-normal", value: "400", description: "Default body text", tailwind: "font-normal" },
  { token: "--font-medium", value: "500", description: "Medium emphasis", tailwind: "font-medium" },
  { token: "--font-semibold", value: "600", description: "Strong emphasis, buttons", tailwind: "font-semibold" },
  { token: "--font-bold", value: "700", description: "Headings, important text", tailwind: "font-bold" },
  { token: "--font-extrabold", value: "800", description: "Display headlines", tailwind: "font-extrabold" },
]

export default function TokensPage() {
  return (
    <DesignSystemLayout
      title="Design Tokens"
      description="Design tokens mapped to shadcn/ui naming conventions. Use these CSS custom properties throughout your application for consistent theming."
    >
      <Section
        id="semantic"
        title="Semantic Tokens"
        description="Core shadcn/ui tokens mapped to Felix Pago brand colors. These are the primary tokens you'll use for theming components."
      >
        <div className="overflow-hidden rounded-xl border border-border">
          <table className="w-full">
            <thead className="bg-muted">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-foreground">Token</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-foreground">Light Mode</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-foreground">Dark Mode</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-foreground">Usage</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {semanticTokens.map((token) => (
                <tr key={token.token} className="bg-white">
                  <td className="px-4 py-3">
                    <code className="rounded bg-muted px-2 py-1 text-sm text-foreground">{token.token}</code>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="h-6 w-6 rounded border border-border" style={{ backgroundColor: token.light }} />
                      <span className="text-sm text-muted-foreground">{token.light}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="h-6 w-6 rounded border border-border" style={{ backgroundColor: token.dark }} />
                      <span className="text-sm text-muted-foreground">{token.dark}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-muted-foreground">{token.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      <Section
        id="brand"
        title="Brand Tokens"
        description="Direct brand color tokens available throughout the design system. Use these when you need specific brand colors rather than semantic meanings."
      >
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {brandTokens.map((token) => (
            <div key={token.token} className="flex items-start gap-3 rounded-lg border border-border bg-white p-4">
              <div 
                className="h-10 w-10 shrink-0 rounded-lg border border-border" 
                style={{ backgroundColor: token.value }} 
              />
              <div>
                <code className="text-sm font-medium text-foreground">{token.token}</code>
                <p className="text-xs text-muted-foreground">{token.value}</p>
                <p className="mt-1 text-xs text-muted-foreground">{token.description}</p>
              </div>
            </div>
          ))}
        </div>
      </Section>

      <Section
        id="chart"
        title="Chart Tokens"
        description="Colors optimized for data visualization and charts."
      >
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {chartTokens.map((token, index) => (
            <div key={token.token} className="overflow-hidden rounded-lg border border-border">
              <div 
                className="h-20" 
                style={{ backgroundColor: token.value.split(' ')[0] }} 
              />
              <div className="bg-white p-3">
                <code className="text-xs font-medium text-foreground">{token.token}</code>
                <p className="mt-1 text-xs text-muted-foreground">{token.description}</p>
              </div>
            </div>
          ))}
        </div>
      </Section>

      <Section
        id="spacing"
        title="Spacing Tokens"
        description="Consistent spacing scale for margins, padding, and gaps. Based on a 4px base unit."
      >
        <div className="overflow-hidden rounded-xl border border-border">
          <table className="w-full">
            <thead className="bg-muted">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-foreground">Token</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-foreground">Value</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-foreground">Visual</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-foreground">Usage</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-foreground">Tailwind</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {spacingTokens.map((token) => (
                <tr key={token.token} className="bg-white">
                  <td className="px-4 py-3">
                    <code className="rounded bg-muted px-2 py-1 text-sm text-foreground">{token.token}</code>
                  </td>
                  <td className="px-4 py-3 text-sm text-muted-foreground">{token.value}</td>
                  <td className="px-4 py-3">
                    <div 
                      className="h-4 rounded bg-turquoise" 
                      style={{ width: token.value.split(' ')[0] === '0.25rem' ? '4px' : 
                               token.value.split(' ')[0] === '0.5rem' ? '8px' :
                               token.value.split(' ')[0] === '1rem' ? '16px' :
                               token.value.split(' ')[0] === '1.5rem' ? '24px' :
                               token.value.split(' ')[0] === '2rem' ? '32px' :
                               token.value.split(' ')[0] === '3rem' ? '48px' : '64px' }} 
                    />
                  </td>
                  <td className="px-4 py-3 text-sm text-muted-foreground">{token.description}</td>
                  <td className="px-4 py-3">
                    <code className="rounded bg-muted px-2 py-1 text-xs text-muted-foreground">{token.tailwind}</code>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      <Section
        id="border-radius"
        title="Border Radius Tokens"
        description="Consistent corner rounding for UI elements. Use smaller radii for compact elements and larger radii for cards and containers."
      >
        <div className="overflow-hidden rounded-xl border border-border">
          <table className="w-full">
            <thead className="bg-muted">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-foreground">Token</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-foreground">Value</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-foreground">Preview</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-foreground">Usage</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-foreground">Tailwind</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {borderRadiusTokens.map((token) => (
                <tr key={token.token} className="bg-white">
                  <td className="px-4 py-3">
                    <code className="rounded bg-muted px-2 py-1 text-sm text-foreground">{token.token}</code>
                  </td>
                  <td className="px-4 py-3 text-sm text-muted-foreground">{token.value}</td>
                  <td className="px-4 py-3">
                    <div
                      className="h-12 w-12 border-2 border-turquoise bg-turquoise/20"
                      style={{ borderRadius: token.preview }}
                    />
                  </td>
                  <td className="px-4 py-3 text-sm text-muted-foreground">{token.description}</td>
                  <td className="px-4 py-3">
                    <code className="rounded bg-muted px-2 py-1 text-xs text-muted-foreground">{token.tailwind}</code>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      <Section
        id="shadows"
        title="Shadow & Elevation Tokens"
        description="Shadows use slate-tinted colors for cohesion with the brand. Use elevation to create visual hierarchy and indicate interactivity."
      >
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {shadowTokens.map((token) => (
            <div key={token.token} className="space-y-3">
              <div
                className="flex h-24 items-center justify-center rounded-xl bg-white"
                style={{ boxShadow: token.css }}
              >
                <span className="text-xs font-medium text-muted-foreground">{token.tailwind}</span>
              </div>
              <div>
                <code className="text-sm font-medium text-foreground">{token.token}</code>
                <p className="mt-1 text-xs text-muted-foreground">{token.description}</p>
              </div>
            </div>
          ))}
        </div>

        <h3 className="mb-4 mt-10 font-display text-lg font-bold text-foreground">CSS Values</h3>
        <div className="overflow-hidden rounded-xl border border-border">
          <table className="w-full">
            <thead className="bg-muted">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-foreground">Token</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-foreground">Value</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-foreground">Tailwind</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {shadowTokens.map((token) => (
                <tr key={token.token} className="bg-white">
                  <td className="px-4 py-3">
                    <code className="rounded bg-muted px-2 py-1 text-sm text-foreground">{token.token}</code>
                  </td>
                  <td className="px-4 py-3">
                    <code className="text-xs text-muted-foreground">{token.css}</code>
                  </td>
                  <td className="px-4 py-3">
                    <code className="rounded bg-muted px-2 py-1 text-xs text-muted-foreground">{token.tailwind}</code>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      <Section
        id="typography"
        title="Typography Tokens"
        description="Type scale, line heights, letter spacing, and font weights for consistent typography."
      >
        <h3 className="mb-4 font-display text-lg font-bold text-foreground">Font Sizes</h3>
        <div className="mb-8 overflow-hidden rounded-xl border border-border">
          <table className="w-full">
            <thead className="bg-muted">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-foreground">Token</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-foreground">Value</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-foreground">Preview</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-foreground">Usage</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-foreground">Tailwind</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {typographyTokens.map((token) => (
                <tr key={token.token} className="bg-white">
                  <td className="px-4 py-3">
                    <code className="rounded bg-muted px-2 py-1 text-sm text-foreground">{token.token}</code>
                  </td>
                  <td className="px-4 py-3 text-sm text-muted-foreground">{token.value}</td>
                  <td className="px-4 py-3">
                    <span style={{ fontSize: token.value.split(' ')[0] }} className="text-foreground">Aa</span>
                  </td>
                  <td className="px-4 py-3 text-sm text-muted-foreground">{token.description}</td>
                  <td className="px-4 py-3">
                    <code className="rounded bg-muted px-2 py-1 text-xs text-muted-foreground">{token.tailwind}</code>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <h3 className="mb-4 font-display text-lg font-bold text-foreground">Line Heights</h3>
        <div className="mb-8 overflow-hidden rounded-xl border border-border">
          <table className="w-full">
            <thead className="bg-muted">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-foreground">Token</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-foreground">Value</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-foreground">Used For</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-foreground">Tailwind</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {lineHeightTokens.map((token) => (
                <tr key={token.token} className="bg-white">
                  <td className="px-4 py-3">
                    <code className="rounded bg-muted px-2 py-1 text-sm text-foreground">{token.token}</code>
                  </td>
                  <td className="px-4 py-3 text-sm text-muted-foreground">{token.value}</td>
                  <td className="px-4 py-3 text-sm text-muted-foreground">{token.description}</td>
                  <td className="px-4 py-3">
                    <code className="rounded bg-muted px-2 py-1 text-xs text-muted-foreground">{token.tailwind}</code>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <h3 className="mb-4 font-display text-lg font-bold text-foreground">Letter Spacing</h3>
        <div className="mb-8 overflow-hidden rounded-xl border border-border">
          <table className="w-full">
            <thead className="bg-muted">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-foreground">Token</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-foreground">Value</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-foreground">Preview</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-foreground">Used For</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-foreground">Tailwind</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {letterSpacingTokens.map((token) => (
                <tr key={token.token} className="bg-white">
                  <td className="px-4 py-3">
                    <code className="rounded bg-muted px-2 py-1 text-sm text-foreground">{token.token}</code>
                  </td>
                  <td className="px-4 py-3 text-sm text-muted-foreground">{token.value}</td>
                  <td className="px-4 py-3">
                    <span className="text-lg text-foreground" style={{ letterSpacing: token.value }}>FELIX PAGO</span>
                  </td>
                  <td className="px-4 py-3 text-sm text-muted-foreground">{token.description}</td>
                  <td className="px-4 py-3">
                    <code className="rounded bg-muted px-2 py-1 text-xs text-muted-foreground">{token.tailwind}</code>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <h3 className="mb-4 font-display text-lg font-bold text-foreground">Font Weights</h3>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {fontWeightTokens.map((token) => (
            <div key={token.token} className="rounded-lg border border-border bg-white p-4">
              <code className="text-sm font-medium text-foreground">{token.token}</code>
              <p className="text-xs text-muted-foreground">{token.value}</p>
              <p className="mt-2 text-xl text-foreground" style={{ fontWeight: parseInt(token.value) }}>Felix Pago</p>
              <p className="mt-1 text-xs text-muted-foreground">{token.description}</p>
              <code className="mt-1 rounded bg-muted px-2 py-0.5 text-xs text-muted-foreground">{token.tailwind}</code>
            </div>
          ))}
        </div>
      </Section>

      <Section
        id="sidebar"
        title="Sidebar Tokens"
        description="Specialized tokens for sidebar navigation components."
      >
        <div className="overflow-hidden rounded-xl border border-border">
          <table className="w-full">
            <thead className="bg-muted">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-foreground">Token</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-foreground">Value</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-foreground">Usage</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {sidebarTokens.map((token) => (
                <tr key={token.token} className="bg-white">
                  <td className="px-4 py-3">
                    <code className="rounded bg-muted px-2 py-1 text-sm text-foreground">{token.token}</code>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="h-6 w-6 rounded border border-border" style={{ backgroundColor: token.value.split(' ')[0] }} />
                      <span className="text-sm text-muted-foreground">{token.value}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-muted-foreground">{token.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      <Section
        id="usage"
        title="Usage Example"
        description="How to use design tokens in your components."
      >
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-xl border border-border bg-white p-6">
            <h4 className="mb-4 font-display text-lg font-bold text-foreground">Tailwind Classes</h4>
            <pre className="overflow-x-auto rounded-lg bg-slate p-4 text-sm text-linen">
              <code>{`<!-- Using semantic tokens -->
<div class="bg-background text-foreground">
  <button class="bg-primary text-primary-foreground">
    Click me
  </button>
</div>

<!-- Using brand tokens -->
<div class="bg-turquoise text-slate">
  <span class="bg-cactus text-slate">
    Success
  </span>
</div>`}</code>
            </pre>
          </div>

          <div className="rounded-xl border border-border bg-white p-6">
            <h4 className="mb-4 font-display text-lg font-bold text-foreground">CSS Custom Properties</h4>
            <pre className="overflow-x-auto rounded-lg bg-slate p-4 text-sm text-linen">
              <code>{`/* Using CSS variables directly */
.custom-element {
  background-color: var(--primary);
  color: var(--primary-foreground);
  border: 1px solid var(--border);
}

/* Using brand colors */
.brand-element {
  background-color: var(--turquoise);
  color: var(--slate);
}`}</code>
            </pre>
          </div>
        </div>
      </Section>
    </DesignSystemLayout>
  )
}
