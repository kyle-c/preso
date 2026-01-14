'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

const navigation = [
  { id: 'foundation', title: 'Our Foundation', href: '#foundation' },
  { id: 'principles', title: 'The Principles', href: '#principles' },
  { id: 'principle-1', title: 'Conversational Transactions, Not Transactional Experiences', href: '#principle-1', parent: 'principles' },
  { id: 'principle-2', title: 'Guide Beginners. Accelerate Regulars.', href: '#principle-2', parent: 'principles' },
  { id: 'principle-3', title: 'Never Leave Users Guessing', href: '#principle-3', parent: 'principles' },
  { id: 'principle-4', title: 'Protect Without Blocking', href: '#principle-4', parent: 'principles' },
  { id: 'principle-5', title: 'Grow With Your Journey', href: '#principle-5', parent: 'principles' },
  { id: 'resources', title: 'Resources', href: '#resources' },
  { id: 'conflicts', title: 'When Principles Overlap', href: '#conflicts', parent: 'resources' },
  { id: 'components', title: 'Component Specs', href: '#components', parent: 'resources' },
  { id: 'copy-library', title: 'Copy Library', href: '#copy-library', parent: 'resources' },
  { id: 'checklists', title: 'For Your Role', href: '#checklists', parent: 'resources' },
]

const principles = [
  {
    id: 'principle-1',
    number: 1,
    title: 'Conversational Transactions, Not Transactional Experiences',
    oneLiner: 'If it sounds like software talking to a user, rewrite it. If it sounds like one person simply helping another send money, ship it.',
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
    title: 'Never Leave Users Guessing',
    oneLiner: 'Acknowledge what just happened, show what comes next, and set time expectations. If something\'s processing, loading, or waiting, say so, and say how long.',
    presenceLens: 'When money is in motion, users are emotionally invested in their act of presence reaching its destination. Ambiguity creates anxiety, clarity creates confidence.',
    industryFoundations: ['Wayfinding', 'Reduced cognitive load', 'State transparency'],
  },
  {
    id: 'principle-4',
    number: 4,
    title: 'Protect Without Blocking',
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

export default function FrameworkPage() {
  const [activeSection, setActiveSection] = useState('foundation')

  useEffect(() => {
    if (typeof window === 'undefined') return

    const handleScroll = () => {
      const sections = navigation.map(nav => {
        const element = document.getElementById(nav.id)
        if (element) {
          const rect = element.getBoundingClientRect()
          return { id: nav.id, top: rect.top, bottom: rect.bottom }
        }
        return null
      }).filter(Boolean) as Array<{ id: string; top: number; bottom: number }>

      const current = sections.find(section => 
        section.top <= 100 && section.bottom >= 100
      ) || sections.find(section => section.top > 0 && section.top < 200)

      if (current) {
        setActiveSection(current.id)
      }
    }

    window.addEventListener('scroll', handleScroll)
    handleScroll()

    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToSection = (id: string) => {
    if (typeof window === 'undefined') return
    const element = document.getElementById(id)
    if (element) {
      const offset = 80
      const elementPosition = element.getBoundingClientRect().top
      const offsetPosition = elementPosition + window.pageYOffset - offset

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      })
    }
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b bg-white">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="border-l-4 border-cyan-500 pl-4">
              <p className="text-xs font-bold text-cyan-600 uppercase mb-1">Designing for Presence</p>
              <h1 className="text-2xl text-gray-900 font-medium">
                Félix UX Guidelines
              </h1>
            </div>
            <Link
              href="/guidelines"
              className="text-sm text-gray-600 hover:text-cyan-600 transition-colors"
            >
              ← Back to Guidelines
            </Link>
          </div>
        </div>
      </header>

      <div className="flex max-w-7xl mx-auto">
        {/* Sidebar Navigation */}
        <aside className="hidden lg:block w-64 flex-shrink-0 border-r bg-gray-50 sticky top-[73px] h-[calc(100vh-73px)] overflow-y-auto">
          <nav className="p-6 space-y-1">
            {navigation.map((item) => {
              const isActive = activeSection === item.id
              const isChild = item.parent !== undefined
              
              return (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className={`block w-full text-left px-3 py-2 rounded-sm text-sm leading-relaxed transition-colors ${
                    isActive
                      ? 'bg-cyan-50 text-cyan-600 font-medium'
                      : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                  } ${isChild ? 'ml-4 text-xs' : ''}`}
                >
                  {item.title}
                </button>
              )
            })}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 min-w-0">
          <div className="max-w-3xl mx-auto px-6 py-16">
            {/* Introduction */}
            <div className="mb-20">
              <h1 className="text-4xl md:text-5xl text-gray-900 font-medium mb-6 leading-tight tracking-tight">
                Designing for Félix
              </h1>
              <p className="text-lg md:text-xl text-gray-600 leading-relaxed max-w-2xl">
                A comprehensive guide to building products that enable presence across distance.
              </p>
            </div>

            {/* Foundation Section */}
            <section id="foundation" className="scroll-mt-20 mb-24">
              <div className="border-l-4 border-cyan-500 pl-6 mb-10">
                <h2 className="text-2xl md:text-3xl text-gray-900 font-medium leading-tight tracking-tight">
                  Our Foundation: Design for Presence
                </h2>
              </div>

              <div className="space-y-6 prose prose-lg max-w-none">
                <p className="text-base md:text-lg text-gray-700 leading-relaxed">
                  Remittances aren't transactions, they're <span className="font-semibold text-gray-900">acts of presence</span>. When someone sends money through Félix, they're <span className="font-semibold text-gray-900">showing up for family</span> back home. When they build credit here, they're ensuring <span className="font-semibold text-gray-900">future presence</span>, the ability to <span className="font-semibold text-gray-900">stay available</span> for the people they love.
                </p>

                <p className="text-base md:text-lg text-gray-700 leading-relaxed">
                  But presence isn't just about today, it's about building the <span className="font-semibold text-gray-900">capability to show up tomorrow</span>.
                </p>

                <p className="text-base md:text-lg text-gray-700 leading-relaxed">
                  The product should make users <span className="font-semibold text-gray-900">stronger over time</span>: more knowledgeable about their finances, more confident in their decisions, more capable of building the future they want.
                </p>

                <p className="text-base md:text-lg text-gray-700 leading-relaxed">
                  Félix <span className="font-semibold text-gray-900">grows with users</span>, from their first send home to comprehensive financial management across borders. We <span className="font-semibold text-gray-900">meet people where they are</span>, then <span className="font-semibold text-gray-900">gradually reveal new possibilities</span> as they're ready. <span className="font-semibold text-gray-900">Future presence</span> requires <span className="font-semibold text-gray-900">capability across your entire financial life</span>, and we're here for that <span className="font-semibold text-gray-900">full journey</span>.
                </p>

                <div className="bg-gray-50 border-l-2 border-cyan-500 pl-5 py-4 mt-8 rounded-r-sm">
                  <p className="text-sm font-semibold text-gray-900 mb-4 tracking-wide uppercase">
                    This means:
                  </p>
                  <ul className="space-y-3 text-base text-gray-700">
                    <li className="flex items-start">
                      <span className="text-cyan-600 mr-3 mt-1.5 flex-shrink-0">•</span>
                      <span>Language that reflects <span className="font-semibold text-gray-900">relationships</span>, not just transactions</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-cyan-600 mr-3 mt-1.5 flex-shrink-0">•</span>
                      <span>Interfaces that <span className="font-semibold text-gray-900">teach</span> financial concepts without condescension</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-cyan-600 mr-3 mt-1.5 flex-shrink-0">•</span>
                      <span>Features that <span className="font-semibold text-gray-900">increase capability</span>, not just provide convenience</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-cyan-600 mr-3 mt-1.5 flex-shrink-0">•</span>
                      <span><span className="font-semibold text-gray-900">Progressive revelation</span> of tools as users are ready for them</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-cyan-600 mr-3 mt-1.5 flex-shrink-0">•</span>
                      <span>Celebrations that <span className="font-semibold text-gray-900">acknowledge growth</span>, not just completion</span>
                    </li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Principles Overview */}
            <section id="principles" className="scroll-mt-20 mb-24">
              <h2 className="text-2xl md:text-3xl text-gray-900 font-medium mb-4 leading-tight tracking-tight">
                The Five Principles
              </h2>
              <p className="text-base md:text-lg text-gray-600 mb-12 leading-relaxed max-w-2xl">
                Five principles that guide every interaction, from first send to full financial companion.
              </p>

              <div className="space-y-8">
                {principles.map((principle) => (
                  <div
                    key={principle.id}
                    id={principle.id}
                    className="scroll-mt-20 border border-gray-200 rounded-lg overflow-hidden bg-white shadow-sm"
                  >
                    <div className="px-6 py-6 border-b border-gray-200">
                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-cyan-100 flex items-center justify-center mt-0.5">
                          <span className="text-sm font-semibold text-cyan-600">{principle.number}</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-lg md:text-xl font-semibold text-gray-900 mb-2.5 leading-snug">
                            {principle.title}
                          </h3>
                          <p className="text-sm md:text-base text-gray-600 leading-relaxed">
                            {principle.oneLiner}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="px-6 py-6">
                      <Tabs defaultValue="overview">
                            <TabsList className="mb-8">
                              <TabsTrigger value="overview">Overview</TabsTrigger>
                              <TabsTrigger value="whatsapp">WhatsApp Examples</TabsTrigger>
                              <TabsTrigger value="webapp">Web App Examples</TabsTrigger>
                            </TabsList>

                            <TabsContent value="overview" className="space-y-8">
                              <div className="bg-gray-50 border-l-2 border-cyan-500 pl-5 py-4 rounded-r-sm">
                                <p className="text-xs font-semibold text-gray-600 uppercase mb-3 tracking-wider">Presence lens</p>
                                <p className="text-base text-gray-900 leading-relaxed">
                                  {principle.presenceLens}
                                </p>
                              </div>

                              <div className="border-l-2 border-gray-300 pl-5 py-3">
                                <p className="text-xs font-semibold text-gray-600 uppercase mb-3 tracking-wider">Related UX Concepts</p>
                                <ul className="space-y-2.5 text-base text-gray-700">
                                  {principle.industryFoundations.map((foundation, idx) => (
                                    <li key={idx} className="flex items-start">
                                      <span className="text-gray-400 mr-3 mt-1.5 flex-shrink-0">•</span>
                                      <span>{foundation}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            </TabsContent>

                            <TabsContent value="whatsapp" className="space-y-8">
                              {principle.id === 'principle-1' && (
                                <div className="space-y-4">
                                  <div>
                                    <p className="text-xs font-semibold text-gray-600 uppercase mb-3 tracking-wider">User starts a send</p>
                                    <div className="space-y-3">
                                      <div className="bg-red-50 border-l-2 border-red-200 rounded-md p-4">
                                        <p className="text-xs font-medium text-red-700 mb-1.5">Don't</p>
                                        <p className="text-sm text-gray-700 leading-relaxed">"Enter recipient details."</p>
                                      </div>
                                      <div className="bg-cyan-50 border-l-2 border-cyan-300 rounded-md p-4">
                                        <p className="text-xs font-medium text-cyan-700 mb-1.5">Do</p>
                                        <p className="text-sm text-gray-900 leading-relaxed">"Who are you sending to?"</p>
                                      </div>
                                    </div>
                                  </div>
                                  <div>
                                    <p className="text-xs font-semibold text-gray-600 uppercase mb-3 tracking-wider">Amount confirmation</p>
                                    <div className="space-y-3">
                                      <div className="bg-red-50 border-l-2 border-red-200 rounded-md p-4">
                                        <p className="text-xs font-medium text-red-700 mb-1.5">Don't</p>
                                        <p className="text-sm text-gray-700 leading-relaxed">"Please confirm transaction amount."</p>
                                      </div>
                                      <div className="bg-cyan-50 border-l-2 border-cyan-300 rounded-md p-4">
                                        <p className="text-xs font-medium text-cyan-700 mb-1.5">Do</p>
                                        <p className="text-sm text-gray-900 leading-relaxed">"Send $100 to Juan?"</p>
                                      </div>
                                    </div>
                                  </div>
                                  <div>
                                    <p className="text-xs font-semibold text-gray-600 uppercase mb-3 tracking-wider">Processing status</p>
                                    <div className="space-y-3">
                                      <div className="bg-red-50 border-l-2 border-red-200 rounded-md p-4">
                                        <p className="text-xs font-medium text-red-700 mb-1.5">Don't</p>
                                        <p className="text-sm text-gray-700 leading-relaxed">"Processing transaction..."</p>
                                      </div>
                                      <div className="bg-cyan-50 border-l-2 border-cyan-300 rounded-md p-4">
                                        <p className="text-xs font-medium text-cyan-700 mb-1.5">Do</p>
                                        <p className="text-sm text-gray-900 leading-relaxed">"Sending to Juan now—usually takes about 30 seconds."</p>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              )}

                              {principle.id === 'principle-2' && (
                                <div className="space-y-4">
                                  <div>
                                    <p className="text-xs font-semibold text-gray-600 uppercase mb-3 tracking-wider">First-time exchange rate</p>
                                    <div className="bg-cyan-50 border-l-2 border-cyan-300 rounded-md p-4">
                                      <p className="text-sm text-gray-900 leading-relaxed">"Exchange rate: 16.8 pesos per dollar. (This is how many pesos Juan gets for each dollar you send. This rate changes daily based on the market, and we'll always show it to you before you confirm.)"</p>
                                    </div>
                                  </div>
                                  <div>
                                    <p className="text-xs font-semibold text-gray-600 uppercase mb-3 tracking-wider">Repeat user exchange rate</p>
                                    <div className="bg-cyan-50 border-l-2 border-cyan-300 rounded-md p-4">
                                      <p className="text-sm text-gray-900 leading-relaxed">"Exchange rate: 16.8 pesos per dollar—higher than last time, so Juan gets a bit more."</p>
                                    </div>
                                  </div>
                                </div>
                              )}

                              {principle.id === 'principle-3' && (
                                <div className="space-y-4">
                                  <div>
                                    <p className="text-xs font-semibold text-gray-600 uppercase mb-3 tracking-wider">Multi-step send</p>
                                    <div className="bg-cyan-50 border-l-2 border-cyan-300 rounded-md p-4">
                                      <p className="text-sm text-gray-900 leading-relaxed">"Got it. Next, how much do you want to send?"</p>
                                    </div>
                                  </div>
                                  <div>
                                    <p className="text-xs font-semibold text-gray-600 uppercase mb-3 tracking-wider">Waiting (3-10 seconds)</p>
                                    <div className="bg-cyan-50 border-l-2 border-cyan-300 rounded-md p-4">
                                      <p className="text-sm text-gray-900 leading-relaxed">"Sending now—this usually takes about 30 seconds."</p>
                                    </div>
                                  </div>
                                </div>
                              )}

                              {principle.id === 'principle-4' && (
                                <div className="space-y-4">
                                  <div>
                                    <p className="text-xs font-semibold text-gray-600 uppercase mb-3 tracking-wider">Real-time validation</p>
                                    <div className="space-y-3">
                                      <div className="bg-red-50 border-l-2 border-red-200 rounded-md p-4">
                                        <p className="text-xs font-medium text-red-700 mb-1.5">Don't</p>
                                        <p className="text-sm text-gray-700 leading-relaxed">After submit: "Invalid card number"</p>
                                      </div>
                                      <div className="bg-cyan-50 border-l-2 border-cyan-300 rounded-md p-4">
                                        <p className="text-xs font-medium text-cyan-700 mb-1.5">Do</p>
                                        <p className="text-sm text-gray-900 leading-relaxed">As typing: "Card number should be 16 digits—looks like you're missing a few"</p>
                                      </div>
                                    </div>
                                  </div>
                                  <div>
                                    <p className="text-xs font-semibold text-gray-600 uppercase mb-3 tracking-wider">Unusual amount check</p>
                                    <div className="bg-cyan-50 border-l-2 border-cyan-300 rounded-md p-4">
                                      <p className="text-sm text-gray-900 leading-relaxed">"This is higher than you usually send—does everything look right?"</p>
                                    </div>
                                  </div>
                                </div>
                              )}

                              {principle.id === 'principle-5' && (
                                <div className="space-y-4">
                                  <div>
                                    <p className="text-xs font-semibold text-gray-600 uppercase mb-3 tracking-wider">Feature introduction</p>
                                    <div className="bg-cyan-50 border-l-2 border-cyan-300 rounded-md p-4">
                                      <p className="text-sm text-gray-900 leading-relaxed">After 3rd send: "You've sent to Maria 3 times now. Want me to remind you each month?"</p>
                                    </div>
                                  </div>
                                </div>
                              )}
                            </TabsContent>

                            <TabsContent value="webapp" className="space-y-8">
                              {principle.id === 'principle-1' && (
                                <div className="space-y-4">
                                  <div>
                                    <p className="text-xs font-semibold text-gray-600 uppercase mb-3 tracking-wider">Payment review</p>
                                    <div className="space-y-3">
                                      <div className="bg-red-50 border-l-2 border-red-200 rounded-md p-4">
                                        <p className="text-xs font-medium text-red-700 mb-1.5">Don't</p>
                                        <p className="text-sm text-gray-700 leading-relaxed">"Transaction Summary"</p>
                                      </div>
                                      <div className="bg-cyan-50 border-l-2 border-cyan-300 rounded-md p-4">
                                        <p className="text-xs font-medium text-cyan-700 mb-1.5">Do</p>
                                        <p className="text-sm text-gray-900 leading-relaxed">"Here's what you're sending"</p>
                                      </div>
                                    </div>
                                  </div>
                                  <div>
                                    <p className="text-xs font-semibold text-gray-600 uppercase mb-3 tracking-wider">Error state</p>
                                    <div className="space-y-3">
                                      <div className="bg-red-50 border-l-2 border-red-200 rounded-md p-4">
                                        <p className="text-xs font-medium text-red-700 mb-1.5">Don't</p>
                                        <p className="text-sm text-gray-700 leading-relaxed">"Payment method invalid."</p>
                                      </div>
                                      <div className="bg-cyan-50 border-l-2 border-cyan-300 rounded-md p-4">
                                        <p className="text-xs font-medium text-cyan-700 mb-1.5">Do</p>
                                        <p className="text-sm text-gray-900 leading-relaxed">"This card didn't go through—want to try a different one?"</p>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              )}

                              {(principle.id === 'principle-2' || principle.id === 'principle-3' || principle.id === 'principle-4' || principle.id === 'principle-5') && (
                                <div className="text-sm text-gray-600">
                                  Web app examples coming soon.
                                </div>
                              )}
                            </TabsContent>
                      </Tabs>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Resources Section */}
            <section id="resources" className="scroll-mt-20 mb-24">
              <h2 className="text-2xl md:text-3xl text-gray-900 font-medium mb-4 leading-tight tracking-tight">
                Resources
              </h2>
              <p className="text-base md:text-lg text-gray-600 mb-12 leading-relaxed max-w-2xl">
                Quick reference guides, checklists, and specifications for teams.
              </p>
            </section>

            {/* Copy Library */}
            <section id="copy-library" className="scroll-mt-20 mb-24">
              <h3 className="text-xl md:text-2xl text-gray-900 font-semibold mb-3 leading-tight tracking-tight">
                Copy Library
              </h3>
              <p className="text-base text-gray-600 mb-8 leading-relaxed">
                Reference guide for common user actions, organized by context and experience level.
              </p>

              <div className="relative">
                <div className="overflow-x-auto rounded-lg border border-gray-200">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b border-gray-200 bg-gray-50">
                        <th className="text-left p-4 text-xs font-semibold text-gray-700 uppercase tracking-wider">Context</th>
                        <th className="text-left p-4 text-xs font-semibold text-gray-700 uppercase tracking-wider">Experience</th>
                        <th className="text-left p-4 text-xs font-semibold text-gray-700 uppercase tracking-wider">❌ Don't</th>
                        <th className="text-left p-4 text-xs font-semibold text-gray-700 uppercase tracking-wider">✅ Do</th>
                        <th className="text-left p-4 text-xs font-semibold text-gray-700 uppercase tracking-wider">Principle</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      <tr className="hover:bg-gray-50 transition-colors">
                        <td className="p-4 text-sm text-gray-700 font-medium">Send money</td>
                        <td className="p-4 text-sm text-gray-600">First-time</td>
                        <td className="p-4 text-sm text-red-600 leading-relaxed">"Enter recipient details"</td>
                        <td className="p-4 text-sm text-green-600 leading-relaxed">"Who are you sending to?"</td>
                        <td className="p-4 text-sm text-gray-500 font-mono">P1</td>
                      </tr>
                      <tr className="hover:bg-gray-50 transition-colors">
                        <td className="p-4 text-sm text-gray-700 font-medium">Send money</td>
                        <td className="p-4 text-sm text-gray-600">Repeat (5+)</td>
                        <td className="p-4 text-sm text-red-600 leading-relaxed">"Enter recipient details"</td>
                        <td className="p-4 text-sm text-green-600 leading-relaxed">"Sending to Juan again?"</td>
                        <td className="p-4 text-sm text-gray-500 font-mono">P2</td>
                      </tr>
                      <tr className="hover:bg-gray-50 transition-colors">
                        <td className="p-4 text-sm text-gray-700 font-medium">Processing</td>
                        <td className="p-4 text-sm text-gray-600">All</td>
                        <td className="p-4 text-sm text-red-600 leading-relaxed">"Processing transaction..."</td>
                        <td className="p-4 text-sm text-green-600 leading-relaxed">"Sending to Juan now—usually takes about 30 seconds."</td>
                        <td className="p-4 text-sm text-gray-500 font-mono">P3</td>
                      </tr>
                      <tr className="hover:bg-gray-50 transition-colors">
                        <td className="p-4 text-sm text-gray-700 font-medium">Error</td>
                        <td className="p-4 text-sm text-gray-600">All</td>
                        <td className="p-4 text-sm text-red-600 leading-relaxed">"Payment method invalid."</td>
                        <td className="p-4 text-sm text-green-600 leading-relaxed">"This card didn't go through—want to try a different one?"</td>
                        <td className="p-4 text-sm text-gray-500 font-mono">P1, P3</td>
                      </tr>
                      <tr className="hover:bg-gray-50 transition-colors">
                        <td className="p-4 text-sm text-gray-700 font-medium">Success</td>
                        <td className="p-4 text-sm text-gray-600">All</td>
                        <td className="p-4 text-sm text-red-600 leading-relaxed">"Transaction completed. ID: TX-123"</td>
                        <td className="p-4 text-sm text-green-600 leading-relaxed">"Done! Juan received $1,680 pesos."</td>
                        <td className="p-4 text-sm text-gray-500 font-mono">P1</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div className="absolute inset-0 bg-white/50 backdrop-blur-sm rounded-lg flex items-center justify-center pointer-events-none">
                  <div className="text-center">
                    <p className="text-base font-semibold text-gray-900 mb-1">Work in progress</p>
                    <p className="text-sm text-gray-600">This content is being refined</p>
                  </div>
                </div>
              </div>
            </section>

            {/* Checklists */}
            <section id="checklists" className="scroll-mt-20 mb-24">
              <h3 className="text-xl md:text-2xl text-gray-900 font-semibold mb-8 leading-tight tracking-tight">
                For Your Role
              </h3>
              <p className="text-base md:text-lg text-gray-600 mb-12 leading-relaxed max-w-2xl">
                Role-specific guides to help you apply these principles in your work.
              </p>

              <div className="space-y-12">
                {/* Designers */}
                <div className="border border-gray-200 rounded-lg p-8 bg-white shadow-sm">
                  <h4 className="text-lg md:text-xl text-gray-900 font-semibold mb-6 leading-snug">
                    Designers
                  </h4>
                  
                  <div className="space-y-8">
                    <div>
                      <p className="text-sm font-semibold text-gray-900 mb-4">Use principles as pattern filters:</p>
                      <ul className="space-y-3 text-sm text-gray-700">
                        <li className="flex items-start">
                          <span className="text-cyan-600 mr-3 mt-1.5 flex-shrink-0">P1</span>
                          <span className="leading-relaxed">Read every string out loud—does it sound human?</span>
                        </li>
                        <li className="flex items-start">
                          <span className="text-cyan-600 mr-3 mt-1.5 flex-shrink-0">P2</span>
                          <span className="leading-relaxed">Check user state—is this their first time or a repeat action?</span>
                        </li>
                        <li className="flex items-start">
                          <span className="text-cyan-600 mr-3 mt-1.5 flex-shrink-0">P3</span>
                          <span className="leading-relaxed">Review every screen transition—is it clear what just happened?</span>
                        </li>
                        <li className="flex items-start">
                          <span className="text-cyan-600 mr-3 mt-1.5 flex-shrink-0">P4</span>
                          <span className="leading-relaxed">Look for potential errors—can we prevent instead of handle?</span>
                        </li>
                        <li className="flex items-start">
                          <span className="text-cyan-600 mr-3 mt-1.5 flex-shrink-0">P5</span>
                          <span className="leading-relaxed">Map the user journey—when does this feature become relevant?</span>
                        </li>
                      </ul>
                    </div>

                    <div>
                      <p className="text-sm font-semibold text-gray-900 mb-4">In design reviews, ask:</p>
                      <ul className="space-y-3 text-sm text-gray-700">
                        <li className="flex items-start">
                          <span className="text-gray-400 mr-3 mt-1.5 flex-shrink-0">•</span>
                          <span className="leading-relaxed">Which principle is this screen serving?</span>
                        </li>
                        <li className="flex items-start">
                          <span className="text-gray-400 mr-3 mt-1.5 flex-shrink-0">•</span>
                          <span className="leading-relaxed">Does this pass the P1 read-aloud test?</span>
                        </li>
                        <li className="flex items-start">
                          <span className="text-gray-400 mr-3 mt-1.5 flex-shrink-0">•</span>
                          <span className="leading-relaxed">Have we considered both first-time and repeat users? (P2)</span>
                        </li>
                        <li className="flex items-start">
                          <span className="text-gray-400 mr-3 mt-1.5 flex-shrink-0">•</span>
                          <span className="leading-relaxed">Will users know what's happening here? (P3)</span>
                        </li>
                        <li className="flex items-start">
                          <span className="text-gray-400 mr-3 mt-1.5 flex-shrink-0">•</span>
                          <span className="leading-relaxed">Are we blocking or protecting? (P4)</span>
                        </li>
                        <li className="flex items-start">
                          <span className="text-gray-400 mr-3 mt-1.5 flex-shrink-0">•</span>
                          <span className="leading-relaxed">Is this the right time to introduce this? (P5)</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Product Managers */}
                <div className="border border-gray-200 rounded-lg p-8 bg-white shadow-sm">
                  <h4 className="text-lg md:text-xl text-gray-900 font-semibold mb-6 leading-snug">
                    Product Managers
                  </h4>
                  
                  <div className="space-y-8">
                    <div>
                      <p className="text-sm font-semibold text-gray-900 mb-4">Feature readiness:</p>
                      <ul className="space-y-3 text-sm text-gray-700">
                        <li className="flex items-start">
                          <span className="text-gray-400 mr-3 mt-1.5 flex-shrink-0">•</span>
                          <span className="leading-relaxed">Does the copy pass P1?</span>
                        </li>
                        <li className="flex items-start">
                          <span className="text-gray-400 mr-3 mt-1.5 flex-shrink-0">•</span>
                          <span className="leading-relaxed">Have we designed for both P2 states (beginner + expert)?</span>
                        </li>
                        <li className="flex items-start">
                          <span className="text-gray-400 mr-3 mt-1.5 flex-shrink-0">•</span>
                          <span className="leading-relaxed">Is P3 satisfied (every state communicated)?</span>
                        </li>
                        <li className="flex items-start">
                          <span className="text-gray-400 mr-3 mt-1.5 flex-shrink-0">•</span>
                          <span className="leading-relaxed">Does P4 prevent errors proactively?</span>
                        </li>
                        <li className="flex items-start">
                          <span className="text-gray-400 mr-3 mt-1.5 flex-shrink-0">•</span>
                          <span className="leading-relaxed">When does P5 say to introduce this?</span>
                        </li>
                      </ul>
                    </div>

                    <div>
                      <p className="text-sm font-semibold text-gray-900 mb-4">Success metrics:</p>
                      <ul className="space-y-3 text-sm text-gray-700">
                        <li className="flex items-start">
                          <span className="text-cyan-600 mr-3 mt-1.5 flex-shrink-0">P1</span>
                          <span className="leading-relaxed">Qualitative testing—does copy feel human?</span>
                        </li>
                        <li className="flex items-start">
                          <span className="text-cyan-600 mr-3 mt-1.5 flex-shrink-0">P2</span>
                          <span className="leading-relaxed">Time-to-proficiency, education engagement</span>
                        </li>
                        <li className="flex items-start">
                          <span className="text-cyan-600 mr-3 mt-1.5 flex-shrink-0">P3</span>
                          <span className="leading-relaxed">"What's happening?" support tickets (should decrease)</span>
                        </li>
                        <li className="flex items-start">
                          <span className="text-cyan-600 mr-3 mt-1.5 flex-shrink-0">P4</span>
                          <span className="leading-relaxed">Error prevention rate vs. error handling rate</span>
                        </li>
                        <li className="flex items-start">
                          <span className="text-cyan-600 mr-3 mt-1.5 flex-shrink-0">P5</span>
                          <span className="leading-relaxed">Feature discovery rate, multi-product adoption</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Engineers */}
                <div className="border border-gray-200 rounded-lg p-8 bg-white shadow-sm">
                  <h4 className="text-lg md:text-xl text-gray-900 font-semibold mb-6 leading-snug">
                    Engineers
                  </h4>
                  
                  <div className="space-y-6">
                    <div>
                      <p className="text-sm font-semibold text-gray-900 mb-4">Every state change should:</p>
                      <ul className="space-y-3 text-sm text-gray-700">
                        <li className="flex items-start">
                          <span className="text-gray-400 mr-3 mt-1.5 flex-shrink-0">•</span>
                          <span className="leading-relaxed">Have a human-readable message (P1)</span>
                        </li>
                        <li className="flex items-start">
                          <span className="text-gray-400 mr-3 mt-1.5 flex-shrink-0">•</span>
                          <span className="leading-relaxed">Adapt to user familiarity (P2)</span>
                        </li>
                        <li className="flex items-start">
                          <span className="text-gray-400 mr-3 mt-1.5 flex-shrink-0">•</span>
                          <span className="leading-relaxed">Communicate clearly (P3)</span>
                        </li>
                        <li className="flex items-start">
                          <span className="text-gray-400 mr-3 mt-1.5 flex-shrink-0">•</span>
                          <span className="leading-relaxed">Prevent errors (P4)</span>
                        </li>
                      </ul>
                    </div>

                    <div className="bg-gray-50 border-l-2 border-cyan-500 pl-5 py-4 rounded-r-sm">
                      <p className="text-xs font-semibold text-gray-600 uppercase mb-3 tracking-wider">Example patterns</p>
                      <div className="space-y-4 text-sm font-mono text-gray-700">
                        <div>
                          <p className="text-xs font-semibold text-gray-600 mb-1">P1: Conversational language</p>
                          <p className="text-gray-900">message = "This card didn't work—want to try another?"</p>
                          <p className="text-gray-500 text-xs mt-1"># Not: "Payment method invalid"</p>
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-gray-600 mb-1">P2: Adaptive complexity</p>
                          <p className="text-gray-900">if user.send_count {'<'} 3:</p>
                          <p className="text-gray-900 ml-4">show_explanation()</p>
                          <p className="text-gray-900">else:</p>
                          <p className="text-gray-900 ml-4">show_shortcut()</p>
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-gray-600 mb-1">P3: State transparency</p>
                          <p className="text-gray-900">status = "Sending now—usually takes 30 seconds"</p>
                          <p className="text-gray-500 text-xs mt-1"># Not just: {'<'}spinner{'>'}</p>
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-gray-600 mb-1">P4: Error prevention</p>
                          <p className="text-gray-900">if amount {'>'} user.avg_amount * 2:</p>
                          <p className="text-gray-900 ml-4">confirm("This is higher than usual—does everything look right?")</p>
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-gray-600 mb-1">P5: Feature introduction timing</p>
                          <p className="text-gray-900">if user.send_count == 10 and user.consistency_high:</p>
                          <p className="text-gray-900 ml-4">suggest_credit_building()</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* QA/Testing */}
                <div className="border border-gray-200 rounded-lg p-8 bg-white shadow-sm">
                  <h4 className="text-lg md:text-xl text-gray-900 font-semibold mb-6 leading-snug">
                    QA/Testing
                  </h4>
                  
                  <div className="space-y-6">
                    <div>
                      <p className="text-sm font-semibold text-gray-900 mb-3">P1: Conversational language</p>
                      <ul className="space-y-2 text-sm text-gray-700 ml-4">
                        <li className="flex items-start">
                          <span className="text-gray-400 mr-3 mt-1.5 flex-shrink-0">•</span>
                          <span className="leading-relaxed">Does every user-facing string pass the read-aloud test?</span>
                        </li>
                        <li className="flex items-start">
                          <span className="text-gray-400 mr-3 mt-1.5 flex-shrink-0">•</span>
                          <span className="leading-relaxed">No system jargon ("transaction", "execute", "beneficiary")?</span>
                        </li>
                        <li className="flex items-start">
                          <span className="text-gray-400 mr-3 mt-1.5 flex-shrink-0">•</span>
                          <span className="leading-relaxed">Active voice, not passive?</span>
                        </li>
                      </ul>
                    </div>

                    <div>
                      <p className="text-sm font-semibold text-gray-900 mb-3">P2: Adaptive experience</p>
                      <ul className="space-y-2 text-sm text-gray-700 ml-4">
                        <li className="flex items-start">
                          <span className="text-gray-400 mr-3 mt-1.5 flex-shrink-0">•</span>
                          <span className="leading-relaxed">Do first-time users see explanation?</span>
                        </li>
                        <li className="flex items-start">
                          <span className="text-gray-400 mr-3 mt-1.5 flex-shrink-0">•</span>
                          <span className="leading-relaxed">Do repeat users see shortcuts?</span>
                        </li>
                        <li className="flex items-start">
                          <span className="text-gray-400 mr-3 mt-1.5 flex-shrink-0">•</span>
                          <span className="leading-relaxed">Is educational content progressive?</span>
                        </li>
                      </ul>
                    </div>

                    <div>
                      <p className="text-sm font-semibold text-gray-900 mb-3">P3: State transparency</p>
                      <ul className="space-y-2 text-sm text-gray-700 ml-4">
                        <li className="flex items-start">
                          <span className="text-gray-400 mr-3 mt-1.5 flex-shrink-0">•</span>
                          <span className="leading-relaxed">Is every loading/processing state labeled?</span>
                        </li>
                        <li className="flex items-start">
                          <span className="text-gray-400 mr-3 mt-1.5 flex-shrink-0">•</span>
                          <span className="leading-relaxed">Are time expectations set?</span>
                        </li>
                        <li className="flex items-start">
                          <span className="text-gray-400 mr-3 mt-1.5 flex-shrink-0">•</span>
                          <span className="leading-relaxed">Does every transition acknowledge what happened?</span>
                        </li>
                      </ul>
                    </div>

                    <div>
                      <p className="text-sm font-semibold text-gray-900 mb-3">P4: Error prevention</p>
                      <ul className="space-y-2 text-sm text-gray-700 ml-4">
                        <li className="flex items-start">
                          <span className="text-gray-400 mr-3 mt-1.5 flex-shrink-0">•</span>
                          <span className="leading-relaxed">Are errors caught before submission?</span>
                        </li>
                        <li className="flex items-start">
                          <span className="text-gray-400 mr-3 mt-1.5 flex-shrink-0">•</span>
                          <span className="leading-relaxed">Do error messages suggest solutions?</span>
                        </li>
                        <li className="flex items-start">
                          <span className="text-gray-400 mr-3 mt-1.5 flex-shrink-0">•</span>
                          <span className="leading-relaxed">Does safety feel caring, not blocking?</span>
                        </li>
                      </ul>
                    </div>

                    <div>
                      <p className="text-sm font-semibold text-gray-900 mb-3">P5: Feature introduction</p>
                      <ul className="space-y-2 text-sm text-gray-700 ml-4">
                        <li className="flex items-start">
                          <span className="text-gray-400 mr-3 mt-1.5 flex-shrink-0">•</span>
                          <span className="leading-relaxed">Are new features introduced contextually?</span>
                        </li>
                        <li className="flex items-start">
                          <span className="text-gray-400 mr-3 mt-1.5 flex-shrink-0">•</span>
                          <span className="leading-relaxed">Is timing based on user readiness?</span>
                        </li>
                        <li className="flex items-start">
                          <span className="text-gray-400 mr-3 mt-1.5 flex-shrink-0">•</span>
                          <span className="leading-relaxed">One new thing at a time?</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Principle Conflicts */}
            <section id="conflicts" className="scroll-mt-20 mb-24">
              <h3 className="text-xl md:text-2xl text-gray-900 font-semibold mb-10 leading-tight tracking-tight">
                When Principles Overlap
              </h3>

              <div className="space-y-8">
                <div className="border border-gray-200 rounded-lg p-8 bg-white shadow-sm">
                  <h4 className="text-lg font-semibold text-gray-900 mb-6 leading-snug">P1 (Conversational) vs P3 (Clarity)</h4>
                  <div className="space-y-5">
                    <div>
                      <p className="text-xs font-semibold text-gray-600 uppercase mb-2 tracking-wider">When</p>
                      <p className="text-base text-gray-700 leading-relaxed">Brevity for conversation hurts understanding</p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-gray-600 uppercase mb-2 tracking-wider">Resolution</p>
                      <p className="text-base text-gray-900 leading-relaxed">Be conversational but complete. Add context when needed: "We need to verify your identity—it's required by U.S. law to keep everyone safe. Takes about 2 minutes."</p>
                    </div>
                    <div className="bg-gray-50 border-l-2 border-cyan-500 pl-4 py-3 rounded-r-sm">
                      <p className="text-xs font-semibold text-gray-600 uppercase mb-2 tracking-wider">Test</p>
                      <p className="text-sm text-gray-700 leading-relaxed">Can you understand what's happening and why? If no, add context while keeping tone conversational.</p>
                    </div>
                  </div>
                </div>

                <div className="border border-gray-200 rounded-lg p-8 bg-white shadow-sm">
                  <h4 className="text-lg font-semibold text-gray-900 mb-6 leading-snug">P2 (Guide Beginners) vs P4 (Protect)</h4>
                  <div className="space-y-5">
                    <div>
                      <p className="text-xs font-semibold text-gray-600 uppercase mb-2 tracking-wider">When</p>
                      <p className="text-base text-gray-700 leading-relaxed">Safety checks frustrate new users</p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-gray-600 uppercase mb-2 tracking-wider">Resolution</p>
                      <p className="text-base text-gray-900 leading-relaxed">Frame protection as collaboration: "Just to make sure this goes to the right person—can you confirm Juan's phone number ends in 1234?"</p>
                    </div>
                    <div className="bg-gray-50 border-l-2 border-cyan-500 pl-4 py-3 rounded-r-sm">
                      <p className="text-xs font-semibold text-gray-600 uppercase mb-2 tracking-wider">Test</p>
                      <p className="text-sm text-gray-700 leading-relaxed">Does this feel like someone double-checking with you, or doubting you? If doubting, reframe.</p>
                    </div>
                  </div>
                </div>

                <div className="border border-gray-200 rounded-lg p-8 bg-white shadow-sm">
                  <h4 className="text-lg font-semibold text-gray-900 mb-6 leading-snug">P4 (Protect) vs P5 (Grow)</h4>
                  <div className="space-y-5">
                    <div>
                      <p className="text-xs font-semibold text-gray-600 uppercase mb-2 tracking-wider">When</p>
                      <p className="text-base text-gray-700 leading-relaxed">To gate features vs. trust users</p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-gray-600 uppercase mb-2 tracking-wider">Resolution</p>
                      <p className="text-base text-gray-900 leading-relaxed">Protect when it's about safety/legal. Trust when it's about capability. If user has demonstrated readiness (P5 signals), reduce gates while maintaining safety checks.</p>
                    </div>
                    <div className="bg-gray-50 border-l-2 border-cyan-500 pl-4 py-3 rounded-r-sm">
                      <p className="text-xs font-semibold text-gray-600 uppercase mb-2 tracking-wider">Test</p>
                      <p className="text-sm text-gray-700 leading-relaxed">Is this gate preventing harm or preventing growth? If growth, find way to trust while protecting.</p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Component Specifications */}
            <section id="components" className="scroll-mt-20 mb-24">
              <h3 className="text-xl md:text-2xl text-gray-900 font-semibold mb-8 leading-tight tracking-tight">
                Component Specifications
              </h3>

              <div className="border border-gray-200 rounded-lg p-12 bg-gray-50">
                <div className="text-center">
                  <p className="text-base text-gray-600 mb-2">This section is in progress</p>
                  <p className="text-sm text-gray-500">Component specifications will be added here soon.</p>
                </div>
              </div>
            </section>

          </div>
        </main>
      </div>
    </div>
  )
}
