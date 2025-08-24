'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'

const FunFact: React.FC = () => {
  const [currentFactIndex, setCurrentFactIndex] = useState(0)

  const funFacts = [
    {
      fact: 'Reading for just 20 minutes a day exposes you to over 1.8 million words per year!',
      icon: '📚',
      category: 'Reading Benefits',
    },
    {
      fact: 'The average person reads at about 200-250 words per minute, but speed readers can reach 1000+ words per minute.',
      icon: '⚡',
      category: 'Speed Reading',
    },
    {
      fact: "Your brain processes written words as if you're speaking them, even when reading silently.",
      icon: '🧠',
      category: 'Brain Science',
    },
    {
      fact: "Reading fiction can improve your empathy and understanding of other people's emotions.",
      icon: '❤️',
      category: 'Emotional Intelligence',
    },
    {
      fact: 'The longest word in English has 189,819 letters and takes about 3.5 hours to pronounce!',
      icon: '🔤',
      category: 'Language Fun',
    },
    {
      fact: 'Reading reduces stress by up to 68% - more effective than listening to music or drinking tea.',
      icon: '😌',
      category: 'Wellness',
    },
    {
      fact: "Your eyes move in quick jumps called 'saccades' when reading, not smoothly across the page.",
      icon: '👁️',
      category: 'Eye Movement',
    },
    {
      fact: 'Reading before bed can help you fall asleep faster and improve sleep quality.',
      icon: '😴',
      category: 'Sleep Science',
    },
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFactIndex((prev) => (prev + 1) % funFacts.length)
    }, 8000) // Change fact every 8 seconds

    return () => clearInterval(interval)
  }, [])

  const currentFact = funFacts[currentFactIndex]

  return (
    <Card className="border-0 shadow-lg bg-gradient-to-br from-amber-50 to-orange-50 overflow-hidden">
      <div className="h-1 bg-gradient-to-r from-amber-500 to-orange-600" />
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          {/* Icon */}
          <div className="flex-shrink-0">
            <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-2xl">{currentFact.icon}</span>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-medium text-amber-700 bg-amber-100 px-2 py-1 rounded-full">
                {currentFact.category}
              </span>
              <span className="text-xs text-amber-600">Fun Fact</span>
            </div>

            <p className="text-foreground font-medium leading-relaxed mb-3">
              {currentFact.fact}
            </p>

            {/* Progress Dots */}
            <div className="flex space-x-1">
              {funFacts.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentFactIndex(index)}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    index === currentFactIndex
                      ? 'bg-amber-600 scale-125'
                      : 'bg-amber-300 hover:bg-amber-400'
                  }`}
                  aria-label={`Go to fun fact ${index + 1}`}
                />
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div className="flex flex-col gap-1">
            <button
              onClick={() =>
                setCurrentFactIndex(
                  (prev) => (prev - 1 + funFacts.length) % funFacts.length,
                )
              }
              className="p-1 text-amber-600 hover:text-amber-700 hover:bg-amber-100 rounded transition-colors duration-200"
              aria-label="Previous fun fact"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 15l7-7 7 7"
                />
              </svg>
            </button>
            <button
              onClick={() =>
                setCurrentFactIndex((prev) => (prev + 1) % funFacts.length)
              }
              className="p-1 text-amber-600 hover:text-amber-700 hover:bg-amber-100 rounded transition-colors duration-200"
              aria-label="Next fun fact"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default FunFact
