'use client'

import { FC, useEffect, useState } from 'react'
import { useReadStore } from '@/hooks/useReadStore'
import { useAuthStore } from '@/hooks/useAuthStore'
import { wordCount } from '@/app/utils/wordCount'
import FunFact from './component/FunFact'
import QuestionCard from './component/QuestionCard'
import TimeCard from './component/TimeCard'
import { useAdminStore } from '@/hooks/useAdminStore'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

const ReadingPage: FC = () => {
  const { materials, indexMaterial, miscues, duration, fetchMaterials } =
    useReadStore()
  const { quarter } = useAdminStore()

  const { user } = useAuthStore()
  const [formError] = useState<string | null>(null)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [speechRate, setSpeechRate] = useState(1)

  useEffect(() => {
    fetchMaterials(quarter?.quarter || '')

    return () => {}
  }, [fetchMaterials, quarter])

  if (materials.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-blue-50/30 to-indigo-50/50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl shadow-xl shadow-blue-500/25 mb-6">
            <svg
              className="w-8 h-8 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-2">
            Loading Materials
          </h2>
          <p className="text-muted-foreground">
            Please wait while we prepare your reading materials...
          </p>
        </div>
      </div>
    )
  }

  const studentId = user?.id
  const material = materials[indexMaterial]

  const speakText = () => {
    if ('speechSynthesis' in window) {
      if (isSpeaking) {
        window.speechSynthesis.cancel()
        setIsSpeaking(false)
        return
      }

      const utterance = new SpeechSynthesisUtterance(material.text)
      utterance.rate = speechRate
      utterance.onend = () => setIsSpeaking(false)
      utterance.onerror = () => setIsSpeaking(false)
      window.speechSynthesis.speak(utterance)
      setIsSpeaking(true)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-blue-50/30 to-indigo-50/50">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-[0.02]" />

      <div className="relative z-10 container mx-auto px-6 py-8 max-w-6xl">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            {/* Title and Quarter */}
            <div className="flex-1">
              <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-foreground via-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">
                Reading Assessment
              </h1>
              <p className="text-lg text-muted-foreground">
                Quarter:{' '}
                <span className="font-semibold text-foreground">
                  {quarter?.quarter}
                </span>
              </p>
              <p className="text-base text-muted-foreground mt-2">
                Read at your own pace and identify words you struggle with
              </p>
            </div>

            {/* Audio Controls */}
            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <Button
                    onClick={speakText}
                    variant="outline"
                    size="sm"
                    className={`transition-all duration-200 ${
                      isSpeaking
                        ? 'border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300'
                        : 'border-blue-200 text-blue-600 hover:bg-blue-50 hover:border-blue-300'
                    }`}
                    aria-label={isSpeaking ? 'Stop speaking' : 'Speak text'}
                  >
                    {isSpeaking ? (
                      <svg
                        className="h-4 w-4 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    ) : (
                      <svg
                        className="h-4 w-4 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"
                        />
                      </svg>
                    )}
                    {isSpeaking ? 'Stop' : 'Listen'}
                  </Button>

                  <select
                    value={speechRate}
                    onChange={(e) => setSpeechRate(parseFloat(e.target.value))}
                    className="text-sm border border-border rounded-lg px-3 py-2 bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50"
                    disabled={isSpeaking}
                  >
                    <option value={0.5}>0.5x</option>
                    <option value={0.75}>0.75x</option>
                    <option value={1}>1x</option>
                    <option value={1.25}>1.25x</option>
                    <option value={1.5}>1.5x</option>
                    <option value={2}>2x</option>
                  </select>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Progress and Stats */}
        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm mb-8">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              {/* Word Count */}
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                    <svg
                      className="w-5 h-5 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                      />
                    </svg>
                  </div>
                  <div>
                    <span className="text-2xl font-bold text-blue-600">
                      {wordCount(material.text)}
                    </span>
                    <p className="text-sm text-muted-foreground">words</p>
                  </div>
                </div>
              </div>

              {/* Progress Indicator */}
              <div className="flex items-center gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-foreground">
                    {indexMaterial + 1}
                  </div>
                  <div className="text-sm text-muted-foreground">Current</div>
                </div>
                <div className="text-muted-foreground">of</div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-foreground">
                    {materials.length}
                  </div>
                  <div className="text-sm text-muted-foreground">Total</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Show Form Error if exists */}
        {formError && (
          <Card className="border-red-200 bg-red-50 mb-6">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <svg
                  className="w-5 h-5 text-red-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                Question
                <span className="text-red-600 font-medium">{formError}</span>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Reading Passage */}
        <TimeCard material={material} />

        {/* Miscues Display */}
        {miscues.length > 0 && (
          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm mb-8">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                <svg
                  className="w-5 h-5 text-amber-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                  />
                </svg>
                Reading Miscues
              </h3>
              <div className="flex flex-wrap gap-2">
                {miscues.map((word, index) => (
                  <span
                    key={index}
                    className="bg-amber-100 text-amber-800 px-3 py-2 rounded-lg text-sm font-medium border border-amber-200 hover:bg-amber-200 transition-colors duration-200 pointer-events-none"
                  >
                    {word}
                  </span>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Comprehension Questions */}
        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm mb-8">
          <CardContent className="p-6">
            <div className="border-b border-border/50 pb-4 mb-6">
              <h2 className="text-2xl font-bold text-foreground mb-2 flex items-center gap-3">
                <svg
                  className="w-6 h-6 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                Questions
              </h2>
              <p className="text-muted-foreground">
                Answer the following questions to test your understanding of the
                reading passage. This will test your comprehension and
                vocabulary of the reading passage
              </p>
            </div>

            {duration ? (
              <QuestionCard
                questions={material.questions}
                studentId={studentId!}
              />
            ) : (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg
                    className="w-8 h-8 text-amber-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  Complete the Reading First
                </h3>
                <p className="text-muted-foreground">
                  Please finish reading the passage before attempting the
                  questions.
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Fun Facts Section */}
        <FunFact />
      </div>
    </div>
  )
}

export default ReadingPage
