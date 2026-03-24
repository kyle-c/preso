'use client'

const C = { turquoise: '#2BF2F1', slate: '#082422', evergreen: '#35605F', cactus: '#60D06F', mango: '#F19D38', papaya: '#F26629', sage: '#7BA882', sky: '#8DFDFA', stone: '#EFEBE7', concrete: '#CFCABF', mocha: '#877867', lychee: '#FFCD9C', blueberry: '#6060BF' }

function Section({ title, color, children, className = '' }: { title: string; color: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={`bg-white rounded-2xl border border-slate/10 shadow-sm overflow-hidden ${className}`}>
      <div className="px-5 py-3 border-b border-slate/10" style={{ borderLeftWidth: 4, borderLeftColor: color }}>
        <h3 className="font-display font-extrabold text-[17px] text-slate">{title}</h3>
      </div>
      <div className="px-5 py-4 text-[15px] text-slate leading-relaxed">
        {children}
      </div>
    </div>
  )
}

function Li({ children }: { children: React.ReactNode }) {
  return <li className="flex items-start gap-2"><span className="text-slate/40 mt-0.5 shrink-0">·</span><span>{children}</span></li>
}

export default function ICPSummaryPage() {
  return (
    <div className="min-h-screen bg-stone p-6 md:p-10">
      <div className="max-w-[1400px] mx-auto">
        {/* Header */}
        <div className="mb-8 text-center">
          <span className="inline-block rounded-full bg-turquoise px-4 py-1 text-[12px] font-semibold text-slate uppercase tracking-wider mb-3">ICP Summary</span>
          <h1 className="font-display font-black text-3xl md:text-4xl text-slate tracking-tight">Félix Ideal Customer Profile</h1>
          <p className="text-mocha text-base mt-1">Condensed from the full ICP investor briefing</p>
        </div>

        {/* Row 1: Who is the user */}
        <Section title="Who is the user?" color={C.turquoise} className="mb-4">
          <p className="mb-2">Blue-collar migrants from Latin America to the US. Two primary archetypes:</p>
          <ul className="space-y-1 ml-1">
            <Li><strong>Distrustful Experimenter (&gt;60% of base)</strong> — Tests small amounts, adopts if fast + no SSN required. Former brick-and-mortar user (Western Union, cash). Peer trust &gt; ads.</Li>
            <Li><strong>Determined Experimenter</strong> — More established, compares rates across services, uses credit for leverage. Analytical adoption, hunts for the best price.</Li>
          </ul>
          <p className="mt-2 text-[13px] text-slate/60">Demographics: Mexico 39.9%, Guatemala 25.1%, Honduras 21.6%, Colombia 4.5%. Income $30k–$40k/yr. 92% fintech adoption rate among Hispanic consumers.</p>
        </Section>

        {/* Row 2: Category habits */}
        <Section title="Category pre-conceptions & habits" color={C.blueberry} className="mb-4">
          <ul className="space-y-1 ml-1">
            <Li><strong>Type A:</strong> Price compares across apps and switches accordingly. Analytical, rate-sensitive.</Li>
            <Li><strong>Type B:</strong> Finds apps complicated. Prefers simplicity. Former cash/in-person user.</Li>
            <Li><strong>Both:</strong> Use WhatsApp as primary digital channel (including images, voice notes). Trust is earned via peer proof, social media comments, influencers, and trial. "If I can't touch it, it's not mine."</Li>
          </ul>
        </Section>

        {/* Row 3: Two columns — Top Issues + Jobs to be Done */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <Section title="Top issues (qualitative & quantitative)" color={C.papaya}>
            <ul className="space-y-1 ml-1">
              <Li>Website-to-WhatsApp transition confuses (tech limitations, flow breaks)</Li>
              <Li>FX rate display turns off users (contextual timing)</Li>
              <Li>Beneficiary name entry causes 16/23 Colombia users to abandon (scroll-back habit)</Li>
              <Li>Errors in first transaction destroy retention permanently</Li>
              <Li>Feature discoverability issues (e.g. how to change country)</Li>
              <Li>84% of non-converters actively tried to send — blocker is missing info at moment of attempt</Li>
              <Li>Frozen screens feel like "money disappeared" — not a UX bug, it's a trust emergency</Li>
            </ul>
          </Section>

          <Section title="Jobs to be done" color={C.cactus}>
            <ul className="space-y-1.5 ml-1">
              <Li><strong>Test with small amount</strong> — to confirm "I can trust this" ($100 first send)</Li>
              <Li><strong>Send money home:</strong>
                <ul className="ml-4 mt-1 space-y-0.5">
                  <li className="flex items-start gap-2"><span className="text-mocha">a)</span> Quickly (at end of week to help family pay rent)</li>
                  <li className="flex items-start gap-2"><span className="text-mocha">b)</span> At best rate (check rate, compare)</li>
                  <li className="flex items-start gap-2"><span className="text-mocha">c)</span> With low effort (2 min from the job site)</li>
                </ul>
              </Li>
              <Li><strong>Check status</strong> — after sending, to make sure it arrived</Li>
              <Li><strong>Recommend</strong> — share with a friend/coworker (51% organic/referral)</Li>
              <Li><strong>Repeat often</strong> — weekly ritual, 4.78 tx/month for top 20%</Li>
              <Li><strong>Access credit</strong> — 84% retention at 6mo when paired with remittances (vs 36%)</Li>
            </ul>
          </Section>
        </div>

        {/* Row 4: Company vision / strategic choices */}
        <Section title="Company vision / strategic choices" color={C.slate}>
          <ul className="space-y-1 ml-1">
            <Li><strong>Magical experience</strong> — No errors, low friction, fast, easy. Conversational as primary mode (WhatsApp), testing hybrid with practical elements (photo, WA flow, buttons)</Li>
            <Li><strong>Community as distribution</strong> — 51% organic/referral acquisition. Word-of-mouth is the cultural default. One person on a crew → the whole crew.</Li>
            <Li><strong>Multiproduct</strong> — Remittances → Credit → Wallet. Credit is the retention moat (84% vs 36%). 27% of volume goes to home-country investments.</Li>
            <Li><strong>Visible human support</strong> — A real human picks up. Not a bot. Trust isn't recovered — it's permanently strengthened. Core service demand.</Li>
            <Li><strong>Pricing</strong> — Must be decent/well-positioned. Users compare. But certainty &gt; speed.</Li>
            <Li><strong>Retention as north star</strong> — New users vs. existing vs. both. Top 20% LTV: 18.4-month tenure, $175 avg transaction.</Li>
          </ul>
        </Section>
      </div>
    </div>
  )
}
