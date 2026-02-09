import { DesignSystemLayout } from "@/components/design-system/design-system-layout"
import { Section } from "@/components/design-system/section"
import { ColorSwatch } from "@/components/design-system/color-swatch"
import { Colorway } from "@/components/design-system/colorway"

const primaryColors = [
  { name: "Turquoise", hex: "#2BF2F1", rgb: "43/242/241", pms: "3105 C", textColor: "dark" as const, tailwindClass: "bg-turquoise" },
  { name: "Slate", hex: "#082422", rgb: "8/36/34", pms: "5535 C", textColor: "light" as const, tailwindClass: "bg-slate" },
]

const neutralColors = [
  { name: "Concrete", hex: "#CFCABF", rgb: "207/202/191", pms: "Warm Gray 2 C", textColor: "dark" as const, tailwindClass: "bg-concrete" },
  { name: "Stone", hex: "#EFEBE7", rgb: "239/235/231", pms: "2330 C", textColor: "dark" as const, tailwindClass: "bg-stone" },
  { name: "Linen", hex: "#FEFCF9", rgb: "254/252/249", textColor: "dark" as const, tailwindClass: "bg-linen" },
]

const turquoiseScale = [
  { name: "Turquoise 50", hex: "#EEFEFE", tailwindClass: "bg-turquoise-50", semantic: "Surface" },
  { name: "Turquoise 100", hex: "#D4FFFE", tailwindClass: "bg-turquoise-100", semantic: "Background" },
  { name: "Turquoise 200", hex: "#AEFFFE", tailwindClass: "bg-turquoise-200", semantic: "Background Alt" },
  { name: "Turquoise 300", hex: "#8DFDFA", tailwindClass: "bg-turquoise-300", semantic: "Border Light" },
  { name: "Turquoise 400", hex: "#5DF7F5", tailwindClass: "bg-turquoise-400", semantic: "Border" },
  { name: "Turquoise 500", hex: "#2BF2F1", tailwindClass: "bg-turquoise-500", semantic: "Base" },
  { name: "Turquoise 600", hex: "#14D4D3", tailwindClass: "bg-turquoise-600", semantic: "Hover" },
  { name: "Turquoise 700", hex: "#10A8A7", tailwindClass: "bg-turquoise-700", semantic: "Text on Light" },
  { name: "Turquoise 800", hex: "#128585", tailwindClass: "bg-turquoise-800", semantic: "Text Muted" },
  { name: "Turquoise 900", hex: "#156D6C", tailwindClass: "bg-turquoise-900", semantic: "Text Strong" },
  { name: "Turquoise 950", hex: "#064949", tailwindClass: "bg-turquoise-950", semantic: "Text on Dark" },
]

const slateScale = [
  { name: "Slate 50", hex: "#F0F5F5", tailwindClass: "bg-slate-50", semantic: "Surface" },
  { name: "Slate 100", hex: "#DAE5E4", tailwindClass: "bg-slate-100", semantic: "Background" },
  { name: "Slate 200", hex: "#B9CCCB", tailwindClass: "bg-slate-200", semantic: "Background Alt" },
  { name: "Slate 300", hex: "#90ADAB", tailwindClass: "bg-slate-300", semantic: "Border Light" },
  { name: "Slate 400", hex: "#698988", tailwindClass: "bg-slate-400", semantic: "Border" },
  { name: "Slate 500", hex: "#4F6F6E", tailwindClass: "bg-slate-500", semantic: "Base" },
  { name: "Slate 600", hex: "#3F5958", tailwindClass: "bg-slate-600", semantic: "Hover" },
  { name: "Slate 700", hex: "#354949", tailwindClass: "bg-slate-700", semantic: "Text on Light" },
  { name: "Slate 800", hex: "#2D3D3C", tailwindClass: "bg-slate-800", semantic: "Text Muted" },
  { name: "Slate 900", hex: "#1A2928", tailwindClass: "bg-slate-900", semantic: "Text Strong" },
  { name: "Slate 950", hex: "#082422", tailwindClass: "bg-slate-950", semantic: "Text on Dark" },
]

const secondaryColors = [
  { name: "Blueberry", hex: "#6060BF", rgb: "96/96/191", pms: "7455 C", textColor: "light" as const },
  { name: "Evergreen", hex: "#35605F", rgb: "53/96/95", pms: "5473 C", textColor: "light" as const },
  { name: "Mocha", hex: "#877867", rgb: "135/120/103", pms: "409 C", textColor: "light" as const },
  { name: "Papaya", hex: "#F26629", rgb: "242/102/41", pms: "7579 C", textColor: "dark" as const },
  { name: "Sky", hex: "#8DFDFA", rgb: "141/253/250", pms: "304 C", textColor: "dark" as const },
  { name: "Cactus", hex: "#60D06F", rgb: "96/208/111", pms: "2256 C", textColor: "dark" as const },
  { name: "Yam", hex: "#C1A98A", rgb: "193/169/138", pms: "407 C", textColor: "dark" as const },
  { name: "Mango", hex: "#F19D38", rgb: "241/157/56", pms: "143 C", textColor: "dark" as const },
  { name: "Light Sky", hex: "#D4FFFE", rgb: "212/255/254", pms: "7457 C", textColor: "dark" as const },
  { name: "Lime", hex: "#DCFF00", rgb: "220/255/0", pms: "380 C", textColor: "dark" as const },
  { name: "Lychee", hex: "#FFCD9C", rgb: "255/205/156", pms: "2309 C", textColor: "dark" as const },
  { name: "Fortuna", hex: "#FFB05A", rgb: "255/176/90", pms: "156 C", textColor: "dark" as const },
]

const primaryColorways = [
  { bgHex: "#2BF2F1", textHex: "#082422", label: "Slate + Turquoise" },
  { bgHex: "#082422", textHex: "#2BF2F1", label: "Turquoise + Slate" },
  { bgHex: "#FEFCF9", textHex: "#082422", label: "Slate + White" },
  { bgHex: "#CFCABF", textHex: "#082422", label: "Slate + Concrete" },
  { bgHex: "#EFEBE7", textHex: "#082422", label: "Slate + Stone" },
  { bgHex: "#FEFCF9", textHex: "#082422", label: "Linen + Slate" },
]

const secondaryColorways = [
  { bgHex: "#6060BF", textHex: "#FEFCF9", label: "White + Blueberry" },
  { bgHex: "#35605F", textHex: "#FEFCF9", label: "White + Evergreen" },
  { bgHex: "#877867", textHex: "#FEFCF9", label: "White + Mocha" },
  { bgHex: "#F26629", textHex: "#082422", label: "Slate + Papaya" },
  { bgHex: "#8DFDFA", textHex: "#082422", label: "Slate + Sky" },
  { bgHex: "#60D06F", textHex: "#082422", label: "Slate + Cactus" },
  { bgHex: "#C1A98A", textHex: "#082422", label: "Slate + Yam" },
  { bgHex: "#F19D38", textHex: "#082422", label: "Slate + Mango" },
  { bgHex: "#D4FFFE", textHex: "#082422", label: "Slate + Light Sky" },
  { bgHex: "#DCFF00", textHex: "#082422", label: "Slate + Lime" },
  { bgHex: "#FFCD9C", textHex: "#082422", label: "Slate + Lychee" },
  { bgHex: "#FFB05A", textHex: "#082422", label: "Slate + Fortuna" },
]

export default function ColorsPage() {
  return (
    <DesignSystemLayout
      title="Colors"
      description="Primary colors should be used in important brand moments to build recognition and association with our brand. These should be followed at all times for consistency."
    >
      <Section
        id="primary"
        title="Primary Palette"
        description="The core colors that define the Felix Pago brand identity."
      >
        <div className="grid gap-6 md:grid-cols-2">
          {primaryColors.map((color) => (
            <ColorSwatch
              key={color.name}
              name={color.name}
              hex={color.hex}
              rgb={color.rgb}
              pms={color.pms}
              tailwindClass={color.tailwindClass}
              textColor={color.textColor}
            />
          ))}
        </div>
        
        <h3 className="mb-4 mt-8 font-display text-xl font-bold text-foreground">Neutrals</h3>
        <div className="grid gap-6 md:grid-cols-3">
          {neutralColors.map((color) => (
            <ColorSwatch
              key={color.name}
              name={color.name}
              hex={color.hex}
              rgb={color.rgb}
              pms={color.pms}
              tailwindClass={color.tailwindClass}
              textColor={color.textColor}
              size="small"
            />
          ))}
        </div>
      </Section>

      <Section
        id="tailwind-scales"
        title="Tailwind Color Scales"
        description="Full color scales for primary colors, following Tailwind's 50-950 convention. Use these for hover states, backgrounds, borders, and other UI variations."
      >
        <h3 className="mb-4 font-display text-lg font-bold text-foreground">Turquoise Scale</h3>
        <div className="mb-8 grid grid-cols-11 gap-1">
          {turquoiseScale.map((color) => (
            <div key={color.name} className="text-center">
              <div 
                className="mb-2 aspect-square w-full rounded-lg border border-border"
                style={{ backgroundColor: color.hex }}
              />
              <p className="text-xs font-medium text-foreground">
                {color.name.split(" ")[1]}
              </p>
              <p className="text-[10px] text-muted-foreground">{color.semantic}</p>
              <p className="font-mono text-[10px] text-muted-foreground">{color.hex}</p>
            </div>
          ))}
        </div>

        <h3 className="mb-4 font-display text-lg font-bold text-foreground">Slate Scale</h3>
        <div className="mb-8 grid grid-cols-11 gap-1">
          {slateScale.map((color) => (
            <div key={color.name} className="text-center">
              <div 
                className="mb-2 aspect-square w-full rounded-lg border border-border"
                style={{ backgroundColor: color.hex }}
              />
              <p className="text-xs font-medium text-foreground">
                {color.name.split(" ")[1]}
              </p>
              <p className="text-[10px] text-muted-foreground">{color.semantic}</p>
              <p className="font-mono text-[10px] text-muted-foreground">{color.hex}</p>
            </div>
          ))}
        </div>

        <h3 className="mb-4 font-display text-lg font-bold text-foreground">Usage Examples</h3>
        <div className="rounded-lg border border-border bg-stone p-6">
          <pre className="overflow-x-auto text-sm text-slate">
            <code>{`// Backgrounds
<div className="bg-turquoise">Primary turquoise</div>
<div className="bg-turquoise-100">Light turquoise background</div>
<div className="bg-turquoise-700">Dark turquoise background</div>

// Text
<p className="text-slate">Primary text color</p>
<p className="text-slate-600">Muted text</p>
<p className="text-turquoise-600">Accent text</p>

// Borders
<div className="border-turquoise-300">Light border</div>
<div className="border-slate-200">Subtle border</div>

// Hover States
<button className="bg-turquoise hover:bg-turquoise-600">
  Hover me
</button>`}</code>
          </pre>
        </div>
      </Section>

      <Section
        id="secondary"
        title="Secondary Palette"
        description="The secondary palette complements the primary colors, offering flexibility for backgrounds or additional design elements while maintaining brand consistency."
      >
        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-4">
          {secondaryColors.map((color) => (
            <ColorSwatch
              key={color.name}
              name={color.name}
              hex={color.hex}
              rgb={color.rgb}
              pms={color.pms}
              textColor={color.textColor}
              size="small"
            />
          ))}
        </div>
      </Section>

      <Section
        id="colorways"
        title="Primary Colorways"
        description="When using our primary palette, make sure to stick to the following combinations to ensure the legibility of text and visibility of graphic elements. The examples below follow WCAG (Web Content Accessibility Guidelines)."
      >
        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
          {primaryColorways.map((colorway, index) => (
            <Colorway
              key={index}
              bgColor=""
              textColor=""
              bgHex={colorway.bgHex}
              textHex={colorway.textHex}
              label={colorway.label}
            />
          ))}
        </div>

        <h3 className="mb-4 mt-12 font-display text-xl font-bold text-foreground">Secondary Colorways</h3>
        <p className="mb-6 text-muted-foreground">
          When using our secondary palette, the following color combinations should be adhered to, similar to the primary palette.
        </p>
        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-4">
          {secondaryColorways.map((colorway, index) => (
            <Colorway
              key={index}
              bgColor=""
              textColor=""
              bgHex={colorway.bgHex}
              textHex={colorway.textHex}
              label={colorway.label}
            />
          ))}
        </div>
      </Section>

      <Section
        id="proportions"
        title="Color Proportions"
        description="An approximate overview of the proportions colors should be used in relation to others. Use this to help create visuals with the correct color ratio."
      >
        <div className="overflow-hidden rounded-xl border border-border">
          <div className="flex h-48">
            <div className="flex-[30] bg-turquoise" title="Turquoise" />
            <div className="flex-[30] bg-slate" title="Slate" />
            <div className="flex-[15] bg-concrete" title="Concrete" />
            <div className="flex-[15] bg-stone" title="Stone" />
            <div className="flex-1 bg-blueberry" title="Blueberry" />
            <div className="flex-1 bg-evergreen" title="Evergreen" />
            <div className="flex-1 bg-mocha" title="Mocha" />
            <div className="flex-1 bg-papaya" title="Papaya" />
            <div className="flex-1 bg-sky" title="Sky" />
            <div className="flex-1 bg-cactus" title="Cactus" />
            <div className="flex-1 bg-yam" title="Yam" />
            <div className="flex-1 bg-lime" title="Lime" />
            <div className="flex-1 bg-mango" title="Mango" />
            <div className="flex-1 bg-fortuna" title="Fortuna" />
          </div>
        </div>
        <div className="mt-4 flex flex-wrap gap-4">
          <div className="flex items-center gap-2">
            <div className="h-4 w-4 rounded bg-turquoise" />
            <span className="text-sm text-muted-foreground">Turquoise (Primary)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-4 w-4 rounded bg-slate" />
            <span className="text-sm text-muted-foreground">Slate (Primary)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-4 w-4 rounded bg-concrete" />
            <span className="text-sm text-muted-foreground">Neutrals</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-4 w-4 rounded bg-mango" />
            <span className="text-sm text-muted-foreground">Secondary (Accents)</span>
          </div>
        </div>
      </Section>
    </DesignSystemLayout>
  )
}
