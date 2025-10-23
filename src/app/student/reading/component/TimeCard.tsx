'use client'

import React, { useState, useEffect } from 'react'
import { useReadStore } from '@/hooks/useReadStore'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

import { Material } from '@/interface/material'

interface TimeCardProps {
  material: Material
}

const TimeCard: React.FC<TimeCardProps> = ({ material }) => {
  const {
    setDuration,
    setMiscues,
    clearMiscues,
    miscues,
    indexMaterial,
    setMaterialBatch,
  } = useReadStore()
  const [startTime, setStartTime] = useState<number | null>(null)
  const [endTime, setEndTime] = useState<number | null>(null)
  const [isReading, setIsReading] = useState(false)
  const [showText, setShowText] = useState(false)

  const lines = material.text.split('\n')

  // Reset reading state when material changes
  useEffect(() => {
    setStartTime(null)
    setEndTime(null)
    setIsReading(false)
    setShowText(false)
    clearMiscues() // Clear global miscues
  }, [material.id, clearMiscues])

  const handleStartReading = () => {
    setStartTime(Date.now())
    setIsReading(true)
    setShowText(true)
    if (indexMaterial === 0) {
      const randomId = Math.random().toString(36).substring(2, 15)
      setMaterialBatch(randomId)
      console.log('Random ID: ', randomId)
    }
  }

  const handleFinishReading = () => {
    const currentEndTime = Date.now()
    setEndTime(currentEndTime)
    setIsReading(false)
    setShowText(false)
    console.log('End Time: ', currentEndTime)
    console.log('Start Time: ', startTime)
    if (startTime) {
      const duration = (currentEndTime - startTime) / 1000
      setDuration(duration)
      console.log('Duration: ', duration)
    }
  }

  const handleWordTap = (word: string) => {
    if (!isReading) return

    console.log('Word tapped: ', word, 'Miscues', miscues)

    // Use the global store's setMiscues method which handles toggle behavior
    setMiscues(word)
  }

  const getWordStyle = (word: string) => {
    const isMiscue = miscues.includes(word)

    if (isMiscue) {
      return 'bg-red-100 text-red-800 border-2 border-red-300 px-2 py-1 rounded cursor-pointer hover:bg-blue-50 hover:border hover:border-blue-200 transition-colors duration-200'
    }

    return 'text-foreground px-1 py-1 cursor-pointer hover:bg-blue-50 hover:border hover:border-blue-200 rounded transition-all duration-200'
  }

  return (
    <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm mb-8">
      <CardContent className="p-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
          <div>
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
                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                />
              </svg>
              {material.title || `Reading Material ${material.id}`}
            </h2>
            <p className="text-muted-foreground">
              Read the passage at your own pace. Tap any words you mispronounce
              or struggle with.
            </p>
          </div>

          {/* Reading Controls */}
          <div className="flex items-center gap-3">
            {!isReading && !startTime && (
              <Button
                onClick={handleStartReading}
                className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
              >
                <svg
                  className="w-4 h-4 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                Start Reading
              </Button>
            )}

            {isReading && (
              <Button
                onClick={handleFinishReading}
                variant="outline"
                className="border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300"
              >
                <svg
                  className="w-4 h-4 mr-2"
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
                Finish Reading
              </Button>
            )}
          </div>
        </div>

        {/* Reading Progress */}
        {isReading && (
          <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-blue-700">
                Reading in Progress
              </span>
              <span className="text-sm text-blue-600 font-semibold">
                {miscues.length} miscues identified
              </span>
            </div>
            <div className="w-full bg-blue-200 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-blue-500 to-indigo-600 h-2 rounded-full transition-all duration-300"
                style={{
                  width: `${(miscues.length / Math.max(lines.reduce((total, line) => total + line.split(' ').length, 0) * 0.1, 1)) * 100}%`,
                }}
              />
            </div>
            <p className="text-xs text-blue-600 mt-2">
              Tap words you mispronounce or struggle with
            </p>
          </div>
        )}

        {/* Reading Text */}
        {showText && (
          <div className="mb-6">
            <div className="mb-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-green-700">
                  {isReading ? 'Reading in progress...' : 'Reading completed'}
                </span>
              </div>
            </div>

            {/* Text Display */}
            <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
              <div className="text-lg leading-relaxed text-foreground">
                {lines.map((line, lineIndex) => {
                  const words = line.split(' ')
                  return (
                    <div key={lineIndex} className="mb-2">
                      {words.map((word, wordIndex) => (
                        <span
                          key={`${lineIndex}-${wordIndex}`}
                          onClick={() => handleWordTap(word)}
                          className={`mr-1 ${getWordStyle(word)}`}
                          title={
                            miscues.includes(word)
                              ? 'Click to remove miscue'
                              : 'Click to mark as miscue'
                          }
                        >
                          {word}
                        </span>
                      ))}
                    </div>
                  )
                })}
              </div>
            </div>
            {isReading && (
              <Button
                onClick={handleFinishReading}
                variant="outline"
                className="mt-4 border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300"
              >
                <svg
                  className="w-4 h-4 mr-2"
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
                Finish Reading
              </Button>
            )}

            <div className="mt-4 text-center">
              <p className="text-sm text-muted-foreground">
                💡 <strong>Tip:</strong> Tap any word you mispronounce or
                struggle with while reading
              </p>
            </div>
          </div>
        )}

        {/* Instructions */}
        {!showText && (
          <div className="text-center py-8">
            {!startTime ? (
              // Not started yet
              <>
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg
                    className="w-8 h-8 text-blue-600"
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
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  Ready to Start Reading?
                </h3>
                <p className="text-muted-foreground max-w-md mx-auto">
                  Click &quot;Start Reading&quot; to begin. Read at your own
                  pace and tap any words you mispronounce or struggle with. This
                  helps track your reading accuracy and timing.
                </p>
              </>
            ) : (
              // Reading finished
              <>
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg
                    className="w-8 h-8 text-green-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  Reading Completed!
                </h3>
                <p className="text-muted-foreground max-w-md mx-auto">
                  Great job! You&apos;ve finished reading the passage. You
                  identified{' '}
                  <span className="font-semibold text-foreground">
                    {miscues.length} miscues
                  </span>{' '}
                  and took{' '}
                  <span className="font-semibold text-foreground">
                    {startTime && endTime
                      ? Math.round((endTime - startTime) / 1000)
                      : '--'}{' '}
                    seconds
                  </span>{' '}
                  to complete.
                </p>
                <div className="mt-4 p-3 bg-green-50 rounded-lg border border-green-200">
                  <p className="text-sm text-green-700">
                    💡 <strong>Next:</strong> You can now proceed to answer the
                    comprehension questions below.
                  </p>
                </div>
              </>
            )}
          </div>
        )}

        {/* Reading Stats */}
        {startTime && (
          <div className="mt-6 p-4 bg-accent/50 rounded-lg border border-border/50">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-foreground">
                  {lines.reduce(
                    (total, line) => total + line.split(' ').length,
                    0,
                  )}
                </div>
                <div className="text-sm text-muted-foreground">Total Words</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-foreground">
                  {miscues.length}
                </div>
                <div className="text-sm text-muted-foreground">Miscues</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-foreground">
                  {(() => {
                    const totalWords = lines.reduce(
                      (total, line) => total + line.split(' ').length,
                      0,
                    )
                    return totalWords > 0
                      ? Math.round(
                          ((totalWords - miscues.length) / totalWords) * 100,
                        )
                      : 0
                  })()}
                  %
                </div>
                <div className="text-sm text-muted-foreground">Accuracy</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-foreground">
                  {startTime && endTime
                    ? Math.round((endTime - startTime) / 1000)
                    : '--'}
                </div>
                <div className="text-sm text-muted-foreground">Seconds</div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default TimeCard
