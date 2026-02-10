'use client'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { DesignSystemLayout } from '@/components/design-system/design-system-layout'
import { Section } from '@/components/design-system/section'

const principles = [
  {
    id: 'principle-1',
    number: 1,
    title: 'Conversational Transactions, Not Transactional Experiences',
    oneLiner: 'Our voice should be warm, concise and always provide clarity. If it sounds like software talking to a user, rewrite it. If it sounds like one person simply helping another send money, ship it.',
    presenceLens: 'Use language that acknowledges the relational act "showing up," "being there," "helping" not just the mechanical transfer.',
    industryFoundations: ['Conversational UX', 'Calm technology', 'Trust-centered fintech design'],
  },
  {
    id: 'principle-2',
    number: 2,
    title: 'Guide Beginners. Accelerate Regulars.',
    oneLiner: 'Guide new users with simple explanation to build trust. As they grow familiar, get them there faster, never removing control or understanding.',
    presenceLens: 'First sends are significant acts, guide users through them with care and context. Repeat sends are routine presence, make them effortless while building financial knowledge that enables future presence.',
    industryFoundations: ['Progressive disclosure', 'Adaptive UX', 'First-time vs repeat-user optimization', 'Contextual education'],
  },
  {
    id: 'principle-3',
    number: 3,
    title: 'Never Leave Users Guessing. Always Give Next Steps.',
    oneLiner: 'Acknowledge what just happened, show what comes next, and set time expectations. Every interaction should offer a clear path forward—no dead ends, no waiting without knowing why or how long.',
    presenceLens: 'When money is in motion, users are emotionally invested in their act of presence reaching its destination. Ambiguity creates anxiety, clarity and forward movement create confidence.',
    industryFoundations: ['Wayfinding', 'Reduced cognitive load', 'State transparency'],
  },
  {
    id: 'principle-4',
    number: 4,
    title: 'Protection Without Friction',
    oneLiner: 'Catch mistakes early through smart defaults, clarifying questions, and real-time validation. Make safety feel like double-checking together, not being doubted or restricted.',
    presenceLens: 'Users are trying to show up for loved ones, our job is to ensure that act of care lands successfully, not to create obstacles that make them feel less capable.',
    industryFoundations: ['Error prevention > error handling', 'Guardrails over gates', 'Fintech risk UX'],
  },
  {
    id: 'principle-5',
    number: 5,
    title: 'Grow With Your Journey',
    oneLiner: 'Meet users where they are, then gradually reveal new possibilities as they\'re ready. Introduce financial tools at moments when they\'re relevant and helpful—not all at once.',
    presenceLens: 'Future presence isn\'t just about today\'s remittance, it\'s about building a complete financial foundation. Guide users from sending money home to managing their entire financial life in the U.S., one empowering step at a time.',
    industryFoundations: ['Progressive disclosure', 'Contextual feature introduction', 'Journey-based product expansion', 'Life-stage awareness'],
  },
]

function DontDoExample({ context, dont, do: doText }: { context: string; dont: string; do: string }) {
  return (
    <div>
      <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">{context}</p>
      <div className="space-y-3">
        <div className="rounded-xl border border-border bg-papaya/5 p-4">
          <span className="inline-block rounded-full bg-papaya/20 px-2.5 py-0.5 text-xs font-semibold text-papaya mb-2">Don&apos;t</span>
          <p className="text-base text-muted-foreground leading-relaxed">{dont}</p>
        </div>
        <div className="rounded-xl border border-border bg-cactus/5 p-4">
          <span className="inline-block rounded-full bg-cactus/20 px-2.5 py-0.5 text-xs font-semibold text-evergreen mb-2">Do</span>
          <p className="text-base text-foreground leading-relaxed">{doText}</p>
        </div>
      </div>
    </div>
  )
}

function DoExample({ context, text }: { context: string; text: string }) {
  return (
    <div>
      <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">{context}</p>
      <div className="rounded-xl border border-border bg-cactus/5 p-4">
        <p className="text-base text-foreground leading-relaxed">{text}</p>
      </div>
    </div>
  )
}

export default function FrameworkPage() {
  return (
    <DesignSystemLayout
      title="Design Principles"
      description="Five principles that guide every interaction, from first send to full financial companion."
    >
      <div className="max-w-3xl">
      <Section
        id="principles"
        title="Our Five Principles"
      >
        <div className="space-y-6">
          {principles.map((principle) => (
            <div
              key={principle.id}
              id={principle.id}
              className="scroll-mt-8 rounded-xl border border-border bg-white overflow-hidden"
            >
              <div className="border-b border-border px-6 py-6">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-slate text-sm font-semibold text-turquoise">
                      {principle.number}
                    </span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-display text-lg font-bold text-foreground leading-snug">
                      {principle.title}
                    </h3>
                    <p className="mt-2 text-base text-muted-foreground leading-relaxed">
                      {principle.oneLiner}
                    </p>
                  </div>
                </div>
              </div>
              <div className="px-6 py-6">
                <Tabs defaultValue="overview">
                  <TabsList className="mb-6">
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="whatsapp">WhatsApp Examples</TabsTrigger>
                    <TabsTrigger value="webapp">Web App Examples</TabsTrigger>
                  </TabsList>

                  <TabsContent value="overview" className="space-y-6">
                    <div className="rounded-xl bg-turquoise-50 p-5">
                      <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-evergreen">Presence lens</p>
                      <p className="text-base text-foreground leading-relaxed">
                        {principle.presenceLens}
                      </p>
                    </div>

                    <div>
                      <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Related UX Concepts</p>
                      <div className="flex flex-wrap gap-2">
                        {principle.industryFoundations.map((foundation, idx) => (
                          <span key={idx} className="rounded-full bg-stone px-3 py-1 text-xs font-medium text-slate">
                            {foundation}
                          </span>
                        ))}
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="whatsapp" className="space-y-6">
                    {principle.id === 'principle-1' && (
                      <div className="space-y-6">
                        <DontDoExample context="User starts a send" dont={`"Enter recipient details."`} do={`"Who are you sending to?"`} />
                        <DontDoExample context="Amount confirmation" dont={`"Please confirm transaction amount."`} do={`"Send $100 to Juan?"`} />
                        <DontDoExample context="Processing status" dont={`"Processing transaction..."`} do={`"Sending to Juan now—usually takes about 30 seconds."`} />
                      </div>
                    )}

                    {principle.id === 'principle-2' && (
                      <div className="space-y-6">
                        <DoExample context="First-time exchange rate" text={`"Exchange rate: 16.8 pesos per dollar. That's how many pesos Juan gets for each dollar—this rate changes daily, and we'll always show it before you confirm."`} />
                        <DoExample context="Repeat user exchange rate" text={`"Exchange rate: 16.8 pesos per dollar—higher than last time, so Juan gets a bit more."`} />
                      </div>
                    )}

                    {principle.id === 'principle-3' && (
                      <div className="space-y-6">
                        <DoExample context="Multi-step send" text={`"Got it! How much do you want to send?"`} />
                        <DoExample context="Waiting (3-10 seconds)" text={`"Sending now—usually takes about 30 seconds."`} />
                      </div>
                    )}

                    {principle.id === 'principle-4' && (
                      <div className="space-y-6">
                        <DontDoExample context="Real-time validation" dont={`After submit: "Invalid card number"`} do={`As typing: "Card number should be 16 digits—looks like you're missing a few"`} />
                        <DoExample context="Unusual amount check" text={`"This is higher than you usually send—does everything look right?"`} />
                      </div>
                    )}

                    {principle.id === 'principle-5' && (
                      <div className="space-y-6">
                        <DoExample context="Feature introduction" text={`After 3rd send: "You've sent to Maria 3 times now. Want me to remind you each month?"`} />
                      </div>
                    )}
                  </TabsContent>

                  <TabsContent value="webapp" className="space-y-6">
                    {principle.id === 'principle-1' && (
                      <div className="space-y-6">
                        <DontDoExample context="Payment review" dont={`"Transaction Summary"`} do={`"Here's what you're sending"`} />
                        <DontDoExample context="Error state" dont={`"Payment method invalid."`} do={`"This card didn't go through—want to try a different one?"`} />
                      </div>
                    )}

                    {(principle.id === 'principle-2' || principle.id === 'principle-3' || principle.id === 'principle-4' || principle.id === 'principle-5') && (
                      <div className="rounded-xl border border-border bg-stone p-6 text-center">
                        <p className="text-sm text-muted-foreground">Web app examples coming soon.</p>
                      </div>
                    )}
                  </TabsContent>
                </Tabs>
              </div>
            </div>
          ))}
        </div>
      </Section>

      <Section
        id="resources"
        title="Resources"
        description="Quick reference guides, checklists, and specifications for teams."
      >
        {/* Copy Library */}
        <div className="mb-12">
          <h3 className="mb-2 font-display text-lg font-bold text-foreground">Copy Library</h3>
          <p className="mb-6 text-base text-muted-foreground">
            Reference guide for common user actions, organized by context and experience level.
          </p>


          <div className="relative">
            <div className="overflow-x-auto rounded-xl border border-border">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b border-border bg-stone">
                    <th className="p-4 text-left text-xs font-semibold uppercase tracking-wider text-foreground">Context</th>
                    <th className="p-4 text-left text-xs font-semibold uppercase tracking-wider text-foreground">Experience</th>
                    <th className="p-4 text-left text-xs font-semibold uppercase tracking-wider text-papaya">Don&apos;t</th>
                    <th className="p-4 text-left text-xs font-semibold uppercase tracking-wider text-evergreen">Do</th>
                    <th className="p-4 text-left text-xs font-semibold uppercase tracking-wider text-foreground">Principle</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  <tr className="transition-colors hover:bg-stone/50">
                    <td className="p-4 text-sm font-medium text-foreground">Send money</td>
                    <td className="p-4 text-sm text-muted-foreground">First-time</td>
                    <td className="p-4 text-sm text-papaya leading-relaxed">&quot;Enter recipient details&quot;</td>
                    <td className="p-4 text-sm text-evergreen leading-relaxed">&quot;Who are you sending to?&quot;</td>
                    <td className="p-4"><span className="rounded-full bg-slate px-2.5 py-0.5 text-xs font-medium text-turquoise">P1</span></td>
                  </tr>
                  <tr className="transition-colors hover:bg-stone/50">
                    <td className="p-4 text-sm font-medium text-foreground">Send money</td>
                    <td className="p-4 text-sm text-muted-foreground">Repeat (5+)</td>
                    <td className="p-4 text-sm text-papaya leading-relaxed">&quot;Enter recipient details&quot;</td>
                    <td className="p-4 text-sm text-evergreen leading-relaxed">&quot;Sending to Juan again?&quot;</td>
                    <td className="p-4"><span className="rounded-full bg-slate px-2.5 py-0.5 text-xs font-medium text-turquoise">P2</span></td>
                  </tr>
                  <tr className="transition-colors hover:bg-stone/50">
                    <td className="p-4 text-sm font-medium text-foreground">Processing</td>
                    <td className="p-4 text-sm text-muted-foreground">All</td>
                    <td className="p-4 text-sm text-papaya leading-relaxed">&quot;Processing transaction...&quot;</td>
                    <td className="p-4 text-sm text-evergreen leading-relaxed">&quot;Sending to Juan now—usually takes about 30 seconds.&quot;</td>
                    <td className="p-4"><span className="rounded-full bg-slate px-2.5 py-0.5 text-xs font-medium text-turquoise">P3</span></td>
                  </tr>
                  <tr className="transition-colors hover:bg-stone/50">
                    <td className="p-4 text-sm font-medium text-foreground">Error</td>
                    <td className="p-4 text-sm text-muted-foreground">All</td>
                    <td className="p-4 text-sm text-papaya leading-relaxed">&quot;Payment method invalid.&quot;</td>
                    <td className="p-4 text-sm text-evergreen leading-relaxed">&quot;This card didn't go through—want to try a different one?&quot;</td>
                    <td className="p-4"><span className="rounded-full bg-slate px-2.5 py-0.5 text-xs font-medium text-turquoise">P1, P3</span></td>
                  </tr>
                  <tr className="transition-colors hover:bg-stone/50">
                    <td className="p-4 text-sm font-medium text-foreground">Success</td>
                    <td className="p-4 text-sm text-muted-foreground">All</td>
                    <td className="p-4 text-sm text-papaya leading-relaxed">&quot;Transaction completed. ID: TX-123&quot;</td>
                    <td className="p-4 text-sm text-evergreen leading-relaxed">&quot;Done! Juan received $1,680 pesos.&quot;</td>
                    <td className="p-4"><span className="rounded-full bg-slate px-2.5 py-0.5 text-xs font-medium text-turquoise">P1</span></td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center rounded-xl bg-background/50 backdrop-blur-sm">
              <div className="text-center">
                <p className="font-display text-base font-bold text-foreground">Work in progress</p>
                <p className="mt-1 text-sm text-muted-foreground">This content is being refined</p>
              </div>
            </div>
          </div>
        </div>

        {/* For Your Role */}
        <div>
          <h3 className="mb-2 font-display text-lg font-bold text-foreground">For Your Role</h3>
          <p className="mb-6 text-base text-muted-foreground">
            Role-specific guides to help you apply these principles in your work.
          </p>

          <div className="grid gap-6 md:grid-cols-2">
            {/* Designers */}
            <div className="rounded-xl border border-border bg-card p-6">
              <div className="mb-4 flex items-center gap-3">
                <span className="rounded-full bg-blueberry/20 px-3 py-1 text-xs font-semibold text-blueberry">Designers</span>
              </div>
              <div className="space-y-6">
                <div>
                  <p className="mb-3 text-sm font-semibold text-foreground">Principles as pattern filters</p>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-start gap-3">
                      <span className="mt-0.5 inline-flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-slate text-[10px] font-semibold text-turquoise">1</span>
                      <span className="leading-relaxed">Read every string out loud—does it sound human?</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="mt-0.5 inline-flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-slate text-[10px] font-semibold text-turquoise">2</span>
                      <span className="leading-relaxed">Check user state—is this their first time or a repeat action?</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="mt-0.5 inline-flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-slate text-[10px] font-semibold text-turquoise">3</span>
                      <span className="leading-relaxed">Review every screen transition—is it clear what just happened?</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="mt-0.5 inline-flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-slate text-[10px] font-semibold text-turquoise">4</span>
                      <span className="leading-relaxed">Look for potential errors—can we prevent instead of handle?</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="mt-0.5 inline-flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-slate text-[10px] font-semibold text-turquoise">5</span>
                      <span className="leading-relaxed">Map the user journey—when does this feature become relevant?</span>
                    </li>
                  </ul>
                </div>

                <div>
                  <p className="mb-3 text-sm font-semibold text-foreground">In design reviews, ask</p>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-start gap-3">
                      <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-slate" />
                      <span className="leading-relaxed">Which principle is this screen serving?</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-slate" />
                      <span className="leading-relaxed">Does this pass the P1 read-aloud test?</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-slate" />
                      <span className="leading-relaxed">Have we considered both first-time and repeat users? (P2)</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-slate" />
                      <span className="leading-relaxed">Will users know what's happening here? (P3)</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-slate" />
                      <span className="leading-relaxed">Are we blocking or protecting? (P4)</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-slate" />
                      <span className="leading-relaxed">Is this the right time to introduce this? (P5)</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Product Managers */}
            <div className="rounded-xl border border-border bg-card p-6">
              <div className="mb-4 flex items-center gap-3">
                <span className="rounded-full bg-mango/20 px-3 py-1 text-xs font-semibold text-mango">Product Managers</span>
              </div>
              <div className="space-y-6">
                <div>
                  <p className="mb-3 text-sm font-semibold text-foreground">Feature readiness</p>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-start gap-3">
                      <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-slate" />
                      <span className="leading-relaxed">Does the copy pass P1?</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-slate" />
                      <span className="leading-relaxed">Have we designed for both P2 states (beginner + expert)?</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-slate" />
                      <span className="leading-relaxed">Is P3 satisfied (every state communicated)?</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-slate" />
                      <span className="leading-relaxed">Does P4 prevent errors proactively?</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-slate" />
                      <span className="leading-relaxed">When does P5 say to introduce this?</span>
                    </li>
                  </ul>
                </div>

                <div>
                  <p className="mb-3 text-sm font-semibold text-foreground">Success metrics</p>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-start gap-3">
                      <span className="mt-0.5 inline-flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-slate text-[10px] font-semibold text-turquoise">1</span>
                      <span className="leading-relaxed">Qualitative testing—does copy feel human?</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="mt-0.5 inline-flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-slate text-[10px] font-semibold text-turquoise">2</span>
                      <span className="leading-relaxed">Time-to-proficiency, education engagement</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="mt-0.5 inline-flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-slate text-[10px] font-semibold text-turquoise">3</span>
                      <span className="leading-relaxed">&quot;What's happening?&quot; support tickets (should decrease)</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="mt-0.5 inline-flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-slate text-[10px] font-semibold text-turquoise">4</span>
                      <span className="leading-relaxed">Error prevention rate vs. error handling rate</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="mt-0.5 inline-flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-slate text-[10px] font-semibold text-turquoise">5</span>
                      <span className="leading-relaxed">Feature discovery rate, multi-product adoption</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Engineers */}
            <div className="rounded-xl border border-border bg-card p-6">
              <div className="mb-4 flex items-center gap-3">
                <span className="rounded-full bg-evergreen/20 px-3 py-1 text-xs font-semibold text-evergreen">Engineers</span>
              </div>
              <div className="space-y-6">
                <div>
                  <p className="mb-3 text-sm font-semibold text-foreground">Every state change should</p>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-start gap-3">
                      <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-slate" />
                      <span className="leading-relaxed">Have a human-readable message (P1)</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-slate" />
                      <span className="leading-relaxed">Adapt to user familiarity (P2)</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-slate" />
                      <span className="leading-relaxed">Communicate clearly (P3)</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-slate" />
                      <span className="leading-relaxed">Prevent errors (P4)</span>
                    </li>
                  </ul>
                </div>

                <div className="rounded-xl border border-border bg-stone p-5">
                  <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Example patterns</p>
                  <div className="space-y-4 font-mono text-sm text-muted-foreground">
                    <div>
                      <p className="text-xs font-semibold text-muted-foreground">P1: Conversational language</p>
                      <p className="text-foreground">message = &quot;This card didn't work—want to try another?&quot;</p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-muted-foreground">P2: Adaptive complexity</p>
                      <p className="text-foreground">if user.send_count {'<'} 3:</p>
                      <p className="ml-4 text-foreground">show_explanation()</p>
                      <p className="text-foreground">else:</p>
                      <p className="ml-4 text-foreground">show_shortcut()</p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-muted-foreground">P4: Error prevention</p>
                      <p className="text-foreground">if amount {'>'} user.avg * 2:</p>
                      <p className="ml-4 text-foreground">confirm(&quot;Higher than usual—look right?&quot;)</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* QA/Testing */}
            <div className="rounded-xl border border-border bg-card p-6">
              <div className="mb-4 flex items-center gap-3">
                <span className="rounded-full bg-turquoise/20 px-3 py-1 text-xs font-semibold text-slate">QA / Testing</span>
              </div>
              <div className="space-y-6">
                {[
                  { label: 'P1: Conversational language', items: ['Does every user-facing string pass the read-aloud test?', 'No system jargon ("transaction", "execute", "beneficiary")?', 'Active voice, not passive?'] },
                  { label: 'P2: Adaptive experience', items: ['Do first-time users see explanation?', 'Do repeat users see shortcuts?', 'Is educational content progressive?'] },
                  { label: 'P3: State transparency', items: ['Is every loading/processing state labeled?', 'Are time expectations set?', 'Does every transition acknowledge what happened?'] },
                  { label: 'P4: Error prevention', items: ['Are errors caught before submission?', 'Do error messages suggest solutions?', 'Does safety feel caring, not blocking?'] },
                  { label: 'P5: Feature introduction', items: ['Are new features introduced contextually?', 'Is timing based on user readiness?', 'One new thing at a time?'] },
                ].map((section) => (
                  <div key={section.label}>
                    <p className="mb-2 text-sm font-semibold text-foreground">{section.label}</p>
                    <ul className="space-y-1.5 text-sm text-muted-foreground">
                      {section.items.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-3">
                          <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-slate" />
                          <span className="leading-relaxed">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Section>

      <Section
        id="conflicts"
        title="When Principles Overlap"
        description="How to navigate tensions between principles."
      >
        <div className="space-y-6">
          {[
            {
              title: 'P1 (Conversational) vs P3 (Clarity)',
              when: 'Brevity for conversation hurts understanding',
              resolution: 'Be conversational but complete. Add context when needed: "We need to verify your identity—it\'s required by U.S. law to keep everyone safe. Takes about 2 minutes."',
              test: 'Can you understand what\'s happening and why? If no, add context while keeping tone conversational.',
            },
            {
              title: 'P2 (Guide Beginners) vs P4 (Protect)',
              when: 'Safety checks frustrate new users',
              resolution: 'Frame protection as collaboration: "Just to make sure this goes to the right person—can you confirm Juan\'s phone number ends in 1234?"',
              test: 'Does this feel like someone double-checking with you, or doubting you? If doubting, reframe.',
            },
            {
              title: 'P4 (Protect) vs P5 (Grow)',
              when: 'To gate features vs. trust users',
              resolution: 'Protect when it\'s about safety/legal. Trust when it\'s about capability. If user has demonstrated readiness (P5 signals), reduce gates while maintaining safety checks.',
              test: 'Is this gate preventing harm or preventing growth? If growth, find way to trust while protecting.',
            },
          ].map((conflict) => (
            <div key={conflict.title} className="rounded-xl border border-border bg-card p-6">
              <h4 className="font-display text-base font-bold text-foreground">{conflict.title}</h4>
              <div className="mt-4 grid gap-4 md:grid-cols-3">
                <div>
                  <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">When</p>
                  <p className="text-base text-muted-foreground leading-relaxed">{conflict.when}</p>
                </div>
                <div>
                  <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Resolution</p>
                  <p className="text-base text-foreground leading-relaxed">{conflict.resolution}</p>
                </div>
                <div className="rounded-xl bg-turquoise-50 p-4">
                  <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-evergreen">Test</p>
                  <p className="text-base text-foreground leading-relaxed">{conflict.test}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Section>
      </div>
    </DesignSystemLayout>
  )
}
