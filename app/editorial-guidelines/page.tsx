import { DesignSystemLayout } from '@/components/design-system/design-system-layout'
import { Section } from '@/components/design-system/section'
import Link from 'next/link'

function DontDo({ dont, doText, label }: { dont: string; doText: string; label?: string }) {
  return (
    <div className="space-y-2">
      {label && <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{label}</p>}
      <div className="rounded-xl border border-border bg-papaya/5 p-4">
        <span className="mb-2 inline-block rounded-full bg-papaya/20 px-2.5 py-0.5 text-xs font-semibold text-papaya">Don&apos;t</span>
        <p className="text-base text-muted-foreground leading-relaxed">{dont}</p>
      </div>
      <div className="rounded-xl border border-border bg-cactus/5 p-4">
        <span className="mb-2 inline-block rounded-full bg-cactus/20 px-2.5 py-0.5 text-xs font-semibold text-evergreen">Do</span>
        <p className="text-base text-foreground leading-relaxed">{doText}</p>
      </div>
    </div>
  )
}

function PrinciplePill({ n }: { n: number }) {
  return (
    <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-slate text-[10px] font-semibold text-turquoise">
      {n}
    </span>
  )
}

function TokenBadge({ token }: { token: string }) {
  return (
    <code className="rounded bg-stone px-1.5 py-0.5 text-xs font-mono text-blueberry border border-slate/10">
      {token}
    </code>
  )
}

export default function EditorialGuidelinesPage() {
  return (
    <DesignSystemLayout
      title="Editorial Guidelines"
      description="Voice, tone, and writing standards for every string in the Felix Pago product."
    >
      <div className="max-w-3xl">

        {/* ── Voice & Tone ───────────────────────────────────────── */}
        <Section id="voice" title="Voice & Tone">
          <div className="space-y-8">

            <div className="rounded-xl border border-border bg-white p-6">
              <p className="mb-4 font-display text-lg font-bold text-foreground">The Felix voice</p>
              <p className="text-base text-muted-foreground leading-relaxed mb-4">
                Felix speaks the way a knowledgeable friend would — someone who happens to understand cross-border finance and genuinely wants to help. We are warm but not casual, clear but not blunt, confident but never condescending.
              </p>
              <div className="grid gap-4 md:grid-cols-3 mt-6">
                {[
                  { label: 'Warm', description: 'We acknowledge the human behind every transfer. Money moves, but so do relationships.' },
                  { label: 'Clear', description: 'No jargon. No legalese in the flow. If a 12-year-old would be confused, rewrite it.' },
                  { label: 'Capable', description: 'We know what we\'re doing. Confidence builds trust — especially in financial products.' },
                ].map(({ label, description }) => (
                  <div key={label} className="rounded-xl bg-stone p-4">
                    <p className="mb-2 font-display text-base font-bold text-foreground">{label}</p>
                    <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <p className="text-sm font-semibold text-foreground">We are / We are not</p>
              <div className="overflow-hidden rounded-xl border border-border">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b border-border bg-stone">
                      <th className="p-4 text-left text-xs font-semibold uppercase tracking-wider text-evergreen">We are</th>
                      <th className="p-4 text-left text-xs font-semibold uppercase tracking-wider text-papaya">We are not</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {[
                      ['Conversational', 'Chatty or unprofessional'],
                      ['Warm', 'Sentimental or over-emotional'],
                      ['Concise', 'Curt or dismissive'],
                      ['Clear', 'Dumbed down'],
                      ['Confident', 'Arrogant or pushy'],
                      ['Empathetic', 'Patronizing'],
                    ].map(([is, isNot]) => (
                      <tr key={is} className="hover:bg-stone/50 transition-colors">
                        <td className="p-4 text-sm font-medium text-evergreen">{is}</td>
                        <td className="p-4 text-sm text-papaya">{isNot}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="space-y-4">
              <DontDo
                label="Voice in practice"
                dont='"Transaction successfully initiated. Funds will be processed within 1–3 business days."'
                doText='"Sent! Juan should have his money by Thursday."'
              />
            </div>

          </div>
        </Section>

        {/* ── Writing Patterns ───────────────────────────────────── */}
        <Section id="patterns" title="Writing Patterns">
          <div className="space-y-10">

            {/* CTAs */}
            <div>
              <div className="mb-4 flex items-center gap-3">
                <h3 className="font-display text-lg font-bold text-foreground">Calls to Action</h3>
                <PrinciplePill n={1} />
                <PrinciplePill n={3} />
              </div>
              <p className="mb-5 text-base text-muted-foreground leading-relaxed">
                CTAs describe what happens next — not what the user is doing right now. Use verb-first phrasing. Never use generic labels when a specific one fits.
              </p>
              <div className="space-y-4">
                <DontDo dont='"Submit"' doText='"Send now"' label="Primary action" />
                <DontDo dont='"OK"' doText='"Got it"' label="Confirmation" />
                <DontDo dont='"Continue"' doText='"Continue" (acceptable only when the next step is obvious from context)' label="Multi-step flows" />
              </div>
            </div>

            {/* Labels & Titles */}
            <div>
              <div className="mb-4 flex items-center gap-3">
                <h3 className="font-display text-lg font-bold text-foreground">Screen Titles & Labels</h3>
                <PrinciplePill n={1} />
              </div>
              <p className="mb-5 text-base text-muted-foreground leading-relaxed">
                Titles should orient — not announce. Speak to the user, not about the screen.
              </p>
              <div className="space-y-4">
                <DontDo dont='"Payment Method Selection"' doText='"How do you want to pay?"' label="Screen titles" />
                <DontDo dont='"Transaction Summary"' doText='"Here\'s what you\'re sending"' label="Review screens" />
                <DontDo dont='"Billing Address"' doText='"What\'s the billing address on your card?"' label="Form screens" />
              </div>
            </div>

            {/* Error Messages */}
            <div>
              <div className="mb-4 flex items-center gap-3">
                <h3 className="font-display text-lg font-bold text-foreground">Errors & Validation</h3>
                <PrinciplePill n={4} />
              </div>
              <p className="mb-5 text-base text-muted-foreground leading-relaxed">
                Errors should feel like a helpful catch — not an accusation. Tell users what went wrong and how to fix it. Never blame the user, never use passive voice.
              </p>
              <div className="space-y-4">
                <DontDo dont='"Invalid card number"' doText='"Card number should be 16 digits"' label="Inline validation" />
                <DontDo dont='"Payment method invalid."' doText='"This card didn\'t go through — want to try a different one?"' label="Payment failure" />
                <DontDo dont='"Error: Required field"' doText='"Address is required"' label="Required fields" />
              </div>
              <div className="mt-5 rounded-xl bg-turquoise-100 p-5">
                <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-evergreen">Rule of thumb</p>
                <p className="text-base text-foreground leading-relaxed">
                  Validation messages live in content tokens. Keep them in sentence case, under 60 characters where possible. Always tell the user how to fix the problem, not just that there is one.
                </p>
              </div>
            </div>

            {/* Success States */}
            <div>
              <div className="mb-4 flex items-center gap-3">
                <h3 className="font-display text-lg font-bold text-foreground">Success States</h3>
                <PrinciplePill n={1} />
                <PrinciplePill n={3} />
              </div>
              <p className="mb-5 text-base text-muted-foreground leading-relaxed">
                Celebrate the act, not the system event. Mention the recipient by name where possible. Give users a sense of what happens next.
              </p>
              <div className="space-y-4">
                <DontDo
                  dont='"Transaction completed. ID: TX-123456"'
                  doText='"Done! Patricia will receive 52.26 MXN."'
                  label="Transfer success"
                />
                <DontDo
                  dont='"Your payment has been processed."'
                  doText='"Your payment went through!"'
                  label="Payment success"
                />
              </div>
            </div>

            {/* Empty States */}
            <div>
              <div className="mb-4 flex items-center gap-3">
                <h3 className="font-display text-lg font-bold text-foreground">Empty & Loading States</h3>
                <PrinciplePill n={3} />
              </div>
              <p className="mb-5 text-base text-muted-foreground leading-relaxed">
                Never leave users in silence. Loading states should set expectations. Empty states should invite action.
              </p>
              <div className="grid gap-4 md:grid-cols-2">
                {[
                  { context: 'Loading', dont: '"Loading..."', do: '"Sending to Juan now — usually takes about 30 seconds."' },
                  { context: 'No results', dont: '"No results found."', do: '"No stores matched. Try a nearby ZIP code."' },
                ].map(({ context, dont, do: doText }) => (
                  <div key={context} className="space-y-2">
                    <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{context}</p>
                    <div className="rounded-lg bg-papaya/5 border border-border px-4 py-3">
                      <p className="text-sm text-papaya">{dont}</p>
                    </div>
                    <div className="rounded-lg bg-cactus/5 border border-border px-4 py-3">
                      <p className="text-sm text-evergreen">{doText}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </Section>

        {/* ── Multilingual ───────────────────────────────────────── */}
        <Section id="multilingual" title="Writing for Multiple Languages">
          <div className="space-y-8">

            <p className="text-base text-muted-foreground leading-relaxed">
              All user-facing strings are tokenized and translated into English, Mexican Spanish (es-mx), and Brazilian Portuguese (pt-br). Write English copy that translates well — avoid idioms, cultural references, and phrases that expand significantly in other languages.
            </p>

            <div className="overflow-hidden rounded-xl border border-border">
              <div className="grid border-b border-border bg-stone" style={{ gridTemplateColumns: '1fr 1fr 1fr' }}>
                <div className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Consideration</div>
                <div className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-papaya">Avoid</div>
                <div className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-evergreen">Prefer</div>
              </div>
              {[
                ['Expansion', '"Almost done."', '"Nearly there." (shorter expands less)'],
                ['Idioms', '"We\'ve got you covered."', '"Your information is safe with us."'],
                ['Pronouns', '"He/she will receive..."', '"Your recipient will receive..." or use the name'],
                ['Formal vs informal', 'Mixing tu/usted in ES-MX', 'Always use tú — Felix is friendly, not corporate'],
                ['Placeholders', 'Hardcoded names or amounts', 'Use {name}, {amount}, {store} interpolation tokens'],
              ].map(([consideration, avoid, prefer], i) => (
                <div
                  key={consideration}
                  className={`grid divide-x divide-slate/5 ${i % 2 === 0 ? 'bg-white' : 'bg-linen'}`}
                  style={{ gridTemplateColumns: '1fr 1fr 1fr' }}
                >
                  <div className="px-4 py-3 text-sm font-medium text-foreground">{consideration}</div>
                  <div className="px-4 py-3 text-sm text-papaya">{avoid}</div>
                  <div className="px-4 py-3 text-sm text-evergreen">{prefer}</div>
                </div>
              ))}
            </div>

            <div className="rounded-xl bg-stone p-5">
              <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Interpolation pattern</p>
              <p className="mb-3 text-sm text-foreground leading-relaxed">
                When a string must include a dynamic value, use a <code className="rounded bg-white px-1.5 py-0.5 text-xs font-mono text-blueberry border border-slate/10">{'{placeholder}'}</code> token. The placeholder name should be descriptive — never positional.
              </p>
              <div className="space-y-2">
                {[
                  { en: '{store} fee', esMx: 'Cargo de {store}', ptBr: 'Taxa {store}' },
                  { en: '{name} will receive', esMx: '{name} recibirá', ptBr: '{name} receberá' },
                ].map(({ en, esMx, ptBr }) => (
                  <div key={en} className="grid gap-2 rounded-lg border border-slate/10 bg-white px-4 py-3" style={{ gridTemplateColumns: '1fr 1fr 1fr' }}>
                    <span className="text-xs text-muted-foreground">🇺🇸 <span className="font-mono text-foreground">{en}</span></span>
                    <span className="text-xs text-muted-foreground">🇲🇽 <span className="font-mono text-foreground">{esMx}</span></span>
                    <span className="text-xs text-muted-foreground">🇧🇷 <span className="font-mono text-foreground">{ptBr}</span></span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </Section>

        {/* ── Token Usage ────────────────────────────────────────── */}
        <Section id="tokens" title="Content Token Guidelines">
          <div className="space-y-8">

            <p className="text-base text-muted-foreground leading-relaxed">
              Every user-facing string in the payment flow is a content token — a named, translatable string stored in{' '}
              <code className="rounded bg-stone px-1.5 py-0.5 text-xs font-mono text-blueberry border border-slate/10">content.ts</code>.
              Tokens are organized by screen section and available in all three languages.{' '}
              <Link href="/fintech/tokens" className="text-link hover:underline">View and edit all tokens →</Link>
            </p>

            <div className="rounded-xl border border-border bg-white overflow-hidden">
              <div className="border-b border-border bg-stone px-6 py-4">
                <p className="font-display text-sm font-bold text-foreground">Token naming conventions</p>
              </div>
              <div className="divide-y divide-border">
                {[
                  {
                    rule: 'Scope by screen',
                    detail: 'Prefix tokens with their screen name. Tokens shared across screens live in',
                    token: 'common',
                    example: 'common.continue, cardDetails.title',
                  },
                  {
                    rule: 'camelCase keys',
                    detail: 'All token keys are camelCase. No underscores, no dashes.',
                    token: null,
                    example: 'fieldFullName ✓   field_full_name ✗',
                  },
                  {
                    rule: 'Descriptive, not generic',
                    detail: 'Name tokens for what they mean, not where they appear.',
                    token: null,
                    example: 'badgeNoFeeDebit ✓   badge1 ✗',
                  },
                  {
                    rule: 'Separate label from desc',
                    detail: 'Payment method options have a Name token and a Desc token.',
                    token: null,
                    example: 'creditDebitName + creditDebitDesc',
                  },
                ].map(({ rule, detail, token, example }) => (
                  <div key={rule} className="px-6 py-4">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="mb-1 text-sm font-semibold text-foreground">{rule}</p>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          {detail} {token && <TokenBadge token={token} />}
                        </p>
                      </div>
                      <code className="shrink-0 text-right text-xs font-mono text-blueberry whitespace-nowrap">{example}</code>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Screen-to-section map */}
            <div>
              <p className="mb-4 text-sm font-semibold text-foreground">Screen → token section map</p>
              <div className="overflow-hidden rounded-xl border border-border">
                <div className="grid border-b border-border bg-stone" style={{ gridTemplateColumns: '1fr 1fr 2fr' }}>
                  <div className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Screen</div>
                  <div className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Section key</div>
                  <div className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Notable tokens</div>
                </div>
                {[
                  { screen: 'Payment Method', key: 'paymentMethod', tokens: 'titleLine1, titleLine2, subtitle, orPayAnotherWay' },
                  { screen: 'Address', key: 'address', tokens: 'titleBilling, titleCash, helperCash, fieldAddress…' },
                  { screen: 'Card Details', key: 'cardDetails', tokens: 'title, fieldFullName, termsPre, securityTitle' },
                  { screen: 'Store Selection', key: 'storeSelection', tokens: 'title, minMax, greenDot' },
                  { screen: 'Review', key: 'review', tokens: 'title, youSend, storeFee ({store}), sendNow' },
                  { screen: 'Success', key: 'success', tokens: 'title, body, referralTitle, shareWhatsApp' },
                  { screen: 'All screens', key: 'common', tokens: 'badge, continue, cancel, selected, change' },
                ].map(({ screen, key, tokens }, i) => (
                  <div
                    key={key}
                    className={`grid divide-x divide-slate/5 ${i % 2 === 0 ? 'bg-white' : 'bg-linen'}`}
                    style={{ gridTemplateColumns: '1fr 1fr 2fr' }}
                  >
                    <div className="px-4 py-3 text-sm font-medium text-foreground">{screen}</div>
                    <div className="px-4 py-3"><TokenBadge token={key} /></div>
                    <div className="px-4 py-3 text-xs text-muted-foreground font-mono">{tokens}</div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </Section>

        {/* ── Common Pitfalls ────────────────────────────────────── */}
        <Section id="pitfalls" title="Common Pitfalls">
          <div className="space-y-6">
            {[
              {
                title: 'System language leaking into UI',
                description: 'Engineers sometimes copy error messages directly from backend responses or libraries. Always intercept and rewrite these in brand voice before surfacing them.',
                dont: '"INVALID_PAYMENT_METHOD_ERROR"',
                do: '"This card didn\'t go through — want to try a different one?"',
              },
              {
                title: 'Passive voice in errors',
                description: 'Passive voice hides agency and often sounds like something went wrong for no reason. Prefer active constructions that imply a path forward.',
                dont: '"Your payment could not be processed."',
                do: '"We couldn\'t process this payment. Try a different card or contact your bank."',
              },
              {
                title: 'All-caps for emphasis',
                description: 'All-caps reads as shouting. Use font-weight or color to create visual hierarchy instead.',
                dont: '"IMPORTANT: Verify your identity before continuing."',
                do: '"One more thing — we need to verify your identity before you can send."',
              },
              {
                title: 'Talking about the UI',
                description: 'Strings that reference UI elements ("tap the button below") break when layouts change and feel robotic. Talk about the action, not the interface.',
                dont: '"Click the Continue button below to proceed."',
                do: '"Continue to the next step."',
              },
              {
                title: 'Over-using the user\'s name',
                description: 'Using the user\'s name once is warm. Using it in every sentence feels like a sales call.',
                dont: '"Hi Carlos! Carlos, your transfer is ready. Carlos, confirm below."',
                do: '"Hi Carlos! Your transfer is ready — confirm below."',
              },
            ].map(({ title, description, dont, do: doText }) => (
              <div key={title} className="rounded-xl border border-border bg-white p-6">
                <h4 className="mb-2 font-display text-base font-bold text-foreground">{title}</h4>
                <p className="mb-4 text-sm text-muted-foreground leading-relaxed">{description}</p>
                <DontDo dont={dont} doText={doText} />
              </div>
            ))}
          </div>
        </Section>

        {/* ── Quick Reference ────────────────────────────────────── */}
        <Section id="reference" title="Quick Reference">
          <div className="space-y-8">

            <div className="rounded-xl border border-border bg-white overflow-hidden">
              <div className="border-b border-border bg-stone px-6 py-4">
                <p className="font-display text-sm font-bold text-foreground">Grammar & mechanics</p>
              </div>
              <div className="divide-y divide-border">
                {[
                  ['Capitalization', 'Sentence case everywhere. Never title case in UI strings.'],
                  ['Punctuation in labels', 'No periods on standalone labels, buttons, or titles. Use periods in body copy and helper text.'],
                  ['Exclamation marks', 'One per screen maximum. Reserve for genuine moments of celebration (success states).'],
                  ['Em dash', 'Use — (em dash) with spaces for conversational pauses: "Sent — usually takes 30 seconds."'],
                  ['Ellipsis', 'Only in loading states to indicate ongoing activity. Not for trailing off.'],
                  ['Ampersand', 'Don\'t use & in running copy. Spell out "and". OK in badge labels where space is tight.'],
                  ['Numbers', 'Always use numerals in financial contexts: $3, 52.26 MXN, 1–3 days.'],
                  ['Currency', 'Symbol before amount, no space: $3.00, not $ 3.00. Currency code after amount with space: 52.26 MXN.'],
                ].map(([rule, detail]) => (
                  <div key={rule as string} className="grid gap-2 px-6 py-4 md:grid-cols-[200px_1fr]">
                    <p className="text-sm font-semibold text-foreground">{rule}</p>
                    <p className="text-sm text-muted-foreground leading-relaxed">{detail}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-xl bg-slate p-6">
              <p className="mb-4 font-display text-lg font-bold text-turquoise">The P1 read-aloud test</p>
              <p className="text-base text-linen/80 leading-relaxed mb-4">
                Before shipping any string, read it out loud. Ask yourself: would a person actually say this to another person?
              </p>
              <p className="text-base text-linen leading-relaxed">
                If it sounds like software talking, rewrite it. If it sounds like one person simply helping another send money home — ship it.
              </p>
              <div className="mt-5 flex items-center gap-3 text-sm text-linen/60">
                <span>See also:</span>
                <Link href="/principles#principle-1" className="hover:text-turquoise transition-colors">Design Principles →</Link>
                <Link href="/fintech/tokens" className="hover:text-turquoise transition-colors">Content Tokens →</Link>
              </div>
            </div>

          </div>
        </Section>

      </div>
    </DesignSystemLayout>
  )
}
