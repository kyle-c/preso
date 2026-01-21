'use client'

import { useState, useEffect } from 'react'

const principles = [
  {
    number: 1,
    title: 'Conversational Transactions, Not Transactional\u00A0Experiences',
    oneLiner: 'If it sounds like software talking to a user, rewrite it. If it sounds like one person simply helping another send money, ship it.',
    presenceLens: 'Use language that acknowledges the relational act "showing up," "being there," "helping" not just the mechanical transfer.',
  },
  {
    number: 2,
    title: 'Guide Beginners.\nAccelerate Regulars.',
    oneLiner: 'Guide new users with simple explanation to build trust. As they grow familiar, get them there faster, never removing control or understanding.',
    presenceLens: 'First sends are significant acts, guide users through them with care and context. Repeat sends are routine presence, make them effortless while building financial knowledge that enables future presence.',
  },
  {
    number: 3,
    title: 'Never Leave Users Guessing.\nAlways Give Next Steps.',
    oneLiner: 'Acknowledge what just happened, show what comes next, and set time expectations. Every interaction should offer a clear path forward—no dead ends, no waiting without knowing why or how\u00A0long.',
    presenceLens: 'When money is in motion, users are emotionally invested in their act of presence reaching its destination. Ambiguity creates anxiety, clarity and forward movement create confidence.',
  },
  {
    number: 4,
    title: 'Protection Without Friction',
    oneLiner: 'Catch mistakes early through smart defaults, clarifying questions, and real-time validation. Make safety feel like double-checking together, not being doubted or restricted.',
    presenceLens: 'Users are trying to show up for loved ones, our job is to ensure that act of care lands successfully, not to create obstacles that make them feel less capable.',
  },
  {
    number: 5,
    title: 'Grow With Your Journey',
    oneLiner: 'Meet users where they are, then gradually reveal new possibilities as they\'re ready. Introduce financial tools at moments when they\'re relevant and helpful—not all at once.',
    presenceLens: 'Future presence isn\'t just about today\'s remittance, it\'s about building a complete financial foundation. Guide users from sending money home to managing their entire financial life in the U.S., one empowering step at a time.',
  },
]

export default function PresoPage() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [mounted, setMounted] = useState(false)
  const totalSlides = 7 // Title + Foundation + 5 Principles
  const [touchStart, setTouchStart] = useState(0)
  const [touchEnd, setTouchEnd] = useState(0)

  // Initialize from URL hash on mount
  useEffect(() => {
    setMounted(true)
    const hash = window.location.hash
    if (hash) {
      const slideNum = parseInt(hash.replace('#slide-', ''), 10)
      if (!isNaN(slideNum) && slideNum >= 0 && slideNum < totalSlides) {
        setCurrentSlide(slideNum)
      }
    }
  }, [totalSlides])

  // Update URL hash when slide changes
  useEffect(() => {
    if (mounted) {
      window.history.replaceState(null, '', `#slide-${currentSlide}`)
    }
  }, [currentSlide, mounted])

  useEffect(() => {
    if (!mounted) return

    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't handle if user is typing in an input
      const target = e.target as HTMLElement | null
      if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA')) {
        return
      }

      if (e.key === 'ArrowRight' || e.key === 'ArrowDown' || e.key === ' ') {
        e.preventDefault()
        setCurrentSlide((prev) => Math.min(prev + 1, totalSlides - 1))
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        e.preventDefault()
        setCurrentSlide((prev) => Math.max(prev - 1, 0))
      } else if (e.key === 'Home') {
        e.preventDefault()
        setCurrentSlide(0)
      } else if (e.key === 'End') {
        e.preventDefault()
        setCurrentSlide(totalSlides - 1)
      }
    }

    window.addEventListener('keydown', handleKeyDown, true)
    return () => window.removeEventListener('keydown', handleKeyDown, true)
  }, [totalSlides, mounted])

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX)
    setTouchEnd(0)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX)
  }

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) {
      setTouchStart(0)
      setTouchEnd(0)
      return
    }
    
    const distance = touchStart - touchEnd
    const isLeftSwipe = distance > 50
    const isRightSwipe = distance < -50

    if (isLeftSwipe) {
      setCurrentSlide((prev) => Math.min(prev + 1, totalSlides - 1))
    } else if (isRightSwipe) {
      setCurrentSlide((prev) => Math.max(prev - 1, 0))
    }
    
    setTouchStart(0)
    setTouchEnd(0)
  }

  const goToSlide = (index: number) => {
    setCurrentSlide(index)
  }

  return (
    <div 
      className="h-screen w-screen bg-white overflow-hidden relative"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Progress Bar */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gray-100 z-50">
        <div 
          className="h-full bg-cyan-600 transition-all duration-700 ease-out"
          style={{ width: `${((currentSlide + 1) / totalSlides) * 100}%` }}
        />
      </div>

      {/* Slide Counter */}
      <div className="absolute top-6 left-6 z-50">
        <div className="px-4 py-2 bg-white/90 backdrop-blur-sm rounded-full border border-gray-200 shadow-sm">
          <span className="text-sm font-medium text-gray-700">
            {currentSlide + 1} / {totalSlides}
          </span>
        </div>
      </div>

      {/* Navigation Hints - Desktop Only */}
      <div className="hidden md:block absolute top-6 right-6 z-50">
        <div className="px-4 py-2 bg-white/90 backdrop-blur-sm rounded-full border border-gray-200 shadow-sm">
          <span className="text-xs text-gray-500">
            ← → to navigate
          </span>
        </div>
      </div>

      {/* Slide Container */}
      <div className="h-full w-full overflow-hidden relative">
        <div
          className="h-full flex transition-transform duration-700 ease-in-out"
          style={{
            transform: `translateX(-${currentSlide * (100 / totalSlides)}%)`,
            width: `${totalSlides * 100}%`
          }}
        >
          {/* Slide 0: Title */}
          <div className="h-full flex-shrink-0 flex flex-col items-center justify-center px-6 sm:px-12" style={{ width: `${100 / totalSlides}%` }}>
            <div className="max-w-5xl w-full text-center">
              <div className="mb-8 sm:mb-12">
                <p className="text-xs sm:text-sm font-bold text-cyan-600 uppercase tracking-[0.2em] mb-6 sm:mb-8">
                  Designing for Presence
                </p>
                <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-semibold text-gray-900 mb-6 sm:mb-8 leading-[1.1] tracking-tight">
                  Félix UX Principles
                </h1>
              </div>
              <p className="text-lg sm:text-xl md:text-2xl text-gray-600 leading-relaxed max-w-3xl mx-auto px-4">
                Five principles for building products that enable presence across&nbsp;distance
              </p>
            </div>
          </div>

          {/* Slide 1: Foundation */}
          <div className="h-full flex-shrink-0 flex flex-col items-center justify-center px-6 sm:px-12" style={{ width: `${100 / totalSlides}%` }}>
            <div className="max-w-5xl w-full">
              <div className="mb-8 sm:mb-12">
                <p className="text-xs sm:text-sm font-bold text-cyan-600 uppercase tracking-wider mb-4 sm:mb-6">
                  Our Foundation
                </p>
                <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-semibold text-gray-900 mb-8 sm:mb-12 leading-tight tracking-tight">
                  Design for Presence
                </h2>
              </div>
              <div className="space-y-4 sm:space-y-6 text-base sm:text-lg md:text-xl text-gray-700 leading-relaxed">
                <p>
                  Remittances aren't transactions, they're <span className="font-semibold text-gray-900">acts of presence</span>. When someone sends money through Félix, they're <span className="font-semibold text-gray-900">showing up for family</span> back home.
                </p>
                <p>
                  But presence isn't just about today, it's about building the <span className="font-semibold text-gray-900">capability to show up tomorrow</span>.
                </p>
                <p>
                  The product should make users <span className="font-semibold text-gray-900">stronger over time</span>: more knowledgeable, more confident, more capable of building the future they want.
                </p>
              </div>
            </div>
          </div>

          {/* Slides 2-6: Principles */}
          {principles.map((principle) => (
            <div
              key={principle.number}
              className="h-full flex-shrink-0 flex flex-col items-center justify-center px-6 sm:px-12"
              style={{ width: `${100 / totalSlides}%` }}
            >
              <div className="max-w-5xl w-full">
                <div className="flex items-center gap-3 sm:gap-4 mb-6 sm:mb-8">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-cyan-100 flex items-center justify-center flex-shrink-0">
                    <span className="text-xl sm:text-2xl font-semibold text-cyan-600">{principle.number}</span>
                  </div>
                  <p className="text-xs sm:text-sm font-bold text-cyan-600 uppercase tracking-wider">
                    Principle {principle.number}
                  </p>
                </div>
                <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-semibold text-gray-900 mb-6 sm:mb-8 leading-tight tracking-tight whitespace-pre-line">
                  {principle.title}
                </h2>
                <p className="text-lg sm:text-xl md:text-2xl text-gray-700 mb-8 sm:mb-12 leading-relaxed">
                  {principle.oneLiner}
                </p>
                <div className="border-l-4 border-cyan-500 pl-4 sm:pl-6 py-4 sm:py-5 bg-gray-50 rounded-r-sm">
                  <p className="text-xs font-semibold text-gray-600 uppercase mb-2 sm:mb-3 tracking-wider">
                    Presence lens
                  </p>
                  <p className="text-sm sm:text-base md:text-lg text-gray-900 leading-relaxed">
                    {principle.presenceLens}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Slide Indicators - Bottom */}
      <div className="absolute bottom-6 sm:bottom-8 left-1/2 transform -translate-x-1/2 z-50 flex gap-2">
        {Array.from({ length: totalSlides }).map((_, i) => (
          <button
            key={i}
            onClick={() => goToSlide(i)}
            className={`h-1.5 sm:h-2 rounded-full transition-all duration-300 ${
              currentSlide === i 
                ? 'w-8 sm:w-12 bg-cyan-600' 
                : 'w-1.5 sm:w-2 bg-gray-300 hover:bg-gray-400'
            }`}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>

      {/* Previous/Next Buttons - Desktop Only */}
      <button
        onClick={(e) => {
          e.preventDefault()
          e.stopPropagation()
          setCurrentSlide((prev) => Math.max(prev - 1, 0))
        }}
        disabled={currentSlide === 0}
        className={`hidden md:flex absolute left-4 sm:left-8 top-1/2 transform -translate-y-1/2 z-[100] p-3 sm:p-4 rounded-full bg-white/90 backdrop-blur-sm border border-gray-200 hover:bg-white hover:shadow-md transition-all ${
          currentSlide === 0 ? 'opacity-0 pointer-events-none' : 'cursor-pointer'
        }`}
        aria-label="Previous slide"
        type="button"
      >
        <svg className="w-5 h-5 sm:w-6 sm:h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      <button
        onClick={(e) => {
          e.preventDefault()
          e.stopPropagation()
          setCurrentSlide((prev) => Math.min(prev + 1, totalSlides - 1))
        }}
        disabled={currentSlide === totalSlides - 1}
        className={`hidden md:flex absolute right-4 sm:right-8 top-1/2 transform -translate-y-1/2 z-[100] p-3 sm:p-4 rounded-full bg-white/90 backdrop-blur-sm border border-gray-200 hover:bg-white hover:shadow-md transition-all ${
          currentSlide === totalSlides - 1 ? 'opacity-0 pointer-events-none' : 'cursor-pointer'
        }`}
        aria-label="Next slide"
        type="button"
      >
        <svg className="w-5 h-5 sm:w-6 sm:h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* Mobile Swipe Indicator */}
      <div className="md:hidden absolute bottom-20 left-1/2 transform -translate-x-1/2 z-40">
        <div className="px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full border border-gray-200">
          <span className="text-xs text-gray-500">Swipe to navigate</span>
        </div>
      </div>
    </div>
  )
}
