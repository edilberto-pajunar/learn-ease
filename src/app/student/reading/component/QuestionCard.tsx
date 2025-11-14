'use client'

import React, { useState } from 'react'
import { useReadStore } from '@/hooks/useReadStore'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Question } from '@/interface/material'
import { useRouter, useSearchParams } from 'next/navigation'

interface QuestionCardProps {
  questions: Question[]
  studentId: string
}

const QuestionCard: React.FC<QuestionCardProps> = ({
  questions,
  studentId,
}) => {
  const searchParams = useSearchParams()
  const testType = searchParams.get('testType') || 'pre_test'

  const {
    submitAnswer,
    currentAnswers,
    setCurrentAnswers,
    setIndexQuestion,
    indexQuestion,
    materials,
    indexMaterial,
    setIndexMaterial,
    setDuration,
    clearMiscues,
    materialBatch,
    setComprehensionScore,
    setVocabularyScore,
  } = useReadStore()
  const [selectedAnswer, setSelectedAnswer] = useState<string>('')
  const [showFeedback, setShowFeedback] = useState(false)
  const [isCorrect, setIsCorrect] = useState(false)
  const router = useRouter()

  const currentQuestion = questions[indexQuestion]
  const hasSubmission = currentAnswers.length > indexQuestion

  const totalQuestions = questions.length

  const handleAnswerSubmit = () => {
    if (!selectedAnswer) return

    const correct = selectedAnswer === currentQuestion.answer
    if (correct) {
      if (currentQuestion.type === 'COMPREHENSION') {
        setComprehensionScore()
      } else if (currentQuestion.type === 'VOCABULARY') {
        setVocabularyScore()
      }
    }
    setIsCorrect(correct)
    setShowFeedback(true)

    setCurrentAnswers(selectedAnswer)

    // Check if this is the last question
    if (indexQuestion === questions.length - 1) {
      // This is the last question - submit answers and move to next material
      setTimeout(async () => {
        try {
          await submitAnswer(studentId, testType, totalQuestions)

          // Check if there are more materials
          if (indexMaterial < materials.length - 1) {
            setIndexMaterial(indexMaterial + 1)
            setIndexQuestion(0)
            setSelectedAnswer('')
            setShowFeedback(false)
            // Reset reading state for next material
            setDuration(null)
            clearMiscues()
          } else {
            // All materials completed - redirect to scores page
            console.log('All materials completed! Redirecting to scores...')
            console.log('Material Batch: ', materialBatch)
            router.push(`/student/reading/score/${materialBatch}`)

            // router.push('/student/reading/score')
          }
        } catch (error) {
          console.error('Error submitting answers:', error)
        }
      }, 2000)
    } else {
      // Auto-advance to next question after 2 seconds
      setTimeout(() => {
        setIndexQuestion(indexQuestion + 1)
        setSelectedAnswer('')
        setShowFeedback(false)
      }, 2000)
    }
  }

  // const handleNextQuestion = () => {
  //   if (indexQuestion < questions.length - 1) {
  //     setIndexQuestion(indexQuestion + 1)
  //     setSelectedAnswer('')
  //     setShowFeedback(false)
  //   }
  // }

  // const handlePreviousQuestion = () => {
  //   if (indexQuestion > 0) {
  //     setIndexQuestion(indexQuestion - 1)
  //     setSelectedAnswer('')
  //     setShowFeedback(false)
  //   }
  // }

  const getQuestionStatus = (questionIndex: number) => {
    if (questionIndex < currentAnswers.length) {
      const answer = currentAnswers[questionIndex]
      const question = questions[questionIndex]
      return answer === question.answer ? 'correct' : 'incorrect'
    }
    return 'unanswered'
  }

  return (
    <div className="space-y-6">
      {/* Question Progress */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-muted-foreground">
            Question
          </span>
          <span className="text-2xl font-bold text-foreground">
            {indexQuestion + 1}
          </span>
          <span className="text-muted-foreground">of {totalQuestions}</span>
        </div>

        {/* Progress Bar */}
        <div className="flex-1 max-w-md mx-4">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-blue-500 to-indigo-600 h-2 rounded-full transition-all duration-300"
              style={{
                width: `${((indexQuestion + 1) / totalQuestions) * 100}%`,
              }}
            />
          </div>
        </div>
      </div>

      {/* Question Card */}
      <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
        <CardContent className="p-6">
          {/* Question Text */}
          <div className="mb-6">
            <h3 className="text-xl font-semibold text-foreground mb-4 leading-relaxed">
              {currentQuestion.title}
            </h3>
          </div>

          {/* Answer Options */}
          <div className="space-y-3 mb-6">
            {currentQuestion.options.map((option, index) => (
              <button
                key={index}
                onClick={() => !hasSubmission && setSelectedAnswer(option)}
                disabled={hasSubmission}
                className={`w-full p-4 text-left rounded-lg border-2 transition-all duration-200 ${
                  selectedAnswer === option
                    ? 'border-blue-500 bg-blue-50 text-blue-800'
                    : hasSubmission && option === currentQuestion.answer
                      ? 'border-green-500 bg-green-50 text-green-800'
                      : hasSubmission &&
                          option === selectedAnswer &&
                          option !== currentQuestion.answer
                        ? 'border-red-500 bg-red-50 text-red-800'
                        : 'border-border hover:border-blue-300 hover:bg-accent/50'
                } ${hasSubmission ? 'cursor-default' : 'cursor-pointer hover:shadow-md'}`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                      selectedAnswer === option
                        ? 'border-blue-500 bg-blue-500 text-white'
                        : hasSubmission && option === currentQuestion.answer
                          ? 'border-green-500 bg-green-500 text-white'
                          : hasSubmission &&
                              option === selectedAnswer &&
                              option !== currentQuestion.answer
                            ? 'border-red-500 bg-red-500 text-white'
                            : 'border-border bg-background'
                    }`}
                  >
                    {selectedAnswer === option && (
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
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    )}
                    {hasSubmission && option === currentQuestion.answer && (
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
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    )}
                    {hasSubmission &&
                      option === selectedAnswer &&
                      option !== currentQuestion.answer && (
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
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      )}
                  </div>
                  <span className="font-medium">{option}</span>
                </div>
              </button>
            ))}
          </div>

          {/* Submit Button */}
          {!hasSubmission && (
            <div className="flex justify-center">
              <Button
                onClick={handleAnswerSubmit}
                disabled={!selectedAnswer}
                className="px-8 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Submit Answer
              </Button>
            </div>
          )}

          {/* Feedback */}
          {showFeedback && (
            <div
              className={`mt-6 p-4 rounded-lg border-2 ${
                isCorrect
                  ? 'border-green-200 bg-green-50 text-green-800'
                  : 'border-red-200 bg-red-50 text-red-800'
              }`}
            >
              <div className="flex items-center gap-3">
                {isCorrect ? (
                  <svg
                    className="w-6 h-6 text-green-600"
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
                ) : (
                  <svg
                    className="w-6 h-6 text-red-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                )}
                <div>
                  <h4 className="font-semibold">
                    {isCorrect ? 'Correct!' : 'Incorrect'}
                  </h4>
                  <p className="text-sm">
                    {isCorrect
                      ? 'Great job! You answered correctly.'
                      : `The correct answer is: ${currentQuestion.answer}`}
                  </p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Question Navigation Dots */}
      <div className="flex justify-center">
        <div className="flex space-x-2">
          {questions.map((_, index) => (
            <button
              key={index}
              onClick={() => setIndexQuestion(index)}
              className={`w-3 h-3 rounded-full transition-all duration-200 ${
                index === indexQuestion
                  ? 'bg-blue-600 scale-125'
                  : getQuestionStatus(index) === 'correct'
                    ? 'bg-green-500'
                    : getQuestionStatus(index) === 'incorrect'
                      ? 'bg-red-500'
                      : 'bg-gray-300 hover:bg-gray-400'
              }`}
              aria-label={`Go to question ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

export default QuestionCard
