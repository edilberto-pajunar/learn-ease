'use client'

import React, { useState } from 'react'
import { useReadStore } from '@/hooks/useReadStore'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Question } from '@/interface/material'
import { Answer } from '@/interface/submission'
import { useSearchParams } from 'next/navigation'

interface QuestionCardProps {
  questions: Question[]
  studentId: string
  setShowCompletionDialog: (show: boolean) => void
}

const QuestionCard: React.FC<QuestionCardProps> = ({
  questions,
  studentId,
  setShowCompletionDialog,
}) => {
  const searchParams = useSearchParams()
  const testType = (searchParams.get('testType') as 'preTest' | 'postTest') || 'preTest'
  
  const {
    currentAnswers,
    setCurrentAnswers,
    setIndexQuestion,
    indexQuestion,
    materials,
    indexMaterial,
    setIndexMaterial,
    setDuration,
    clearMiscues,
    setComprehensionScore,
    setVocabularyScore,
    submitBatchAnswers,
    addMaterialSubmission,
  } = useReadStore()
  const [selectedAnswer, setSelectedAnswer] = useState<Answer | null>(null)
  const [showFeedback, setShowFeedback] = useState(false)
  const currentQuestion = questions[indexQuestion]
  const hasSubmission = currentAnswers.length > indexQuestion

  const totalQuestions = questions.length

  const handleAnswerSubmit = () => {
    if (!selectedAnswer) return

    const correct = selectedAnswer.answer === currentQuestion.answer
    if (correct) {
      if (currentQuestion.type === 'COMPREHENSION') {
        setComprehensionScore()
      } else if (currentQuestion.type === 'VOCABULARY') {
        setVocabularyScore()
      }
    }
    setShowFeedback(true)

    setCurrentAnswers(selectedAnswer)

    if (indexQuestion === questions.length - 1) {
      setTimeout(async () => {
        try {
          addMaterialSubmission(studentId)

          if (indexMaterial < materials.length - 1) {
            setIndexMaterial(indexMaterial + 1)
            setIndexQuestion(0)
            setSelectedAnswer(null)
            setShowFeedback(false)
            setDuration(null)
            clearMiscues()
          } else {
            await submitBatchAnswers(studentId, 'Q1', testType)
            setShowCompletionDialog(true)
          }
        } catch (error) {
          console.error('Error processing answers:', error)
        }
      }, 1500)
    } else {
      setTimeout(() => {
        setIndexQuestion(indexQuestion + 1)
        setSelectedAnswer(null)
        setShowFeedback(false)
      }, 1500)
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
      return 'answered'
    }
    return 'unanswered'
  }

  return (
    <>
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
              <p className="text-sm text-muted-foreground">
                {currentQuestion.type}
              </p>
            </div>

            {/* Answer Options */}
            <div className="space-y-3 mb-6">
              {currentQuestion.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() =>
                    !hasSubmission &&
                    setSelectedAnswer({
                      answer: option,
                      type: currentQuestion.type,
                      isCorrect: option === currentQuestion.answer,
                    })
                  }
                  disabled={hasSubmission}
                  className={`w-full p-4 text-left rounded-lg border-2 transition-all duration-200 ${
                    selectedAnswer?.answer === option
                      ? 'border-blue-500 bg-blue-50 text-blue-800'
                      : 'border-border hover:border-blue-300 hover:bg-accent/50'
                  } ${hasSubmission ? 'cursor-default' : 'cursor-pointer hover:shadow-md'}`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                        selectedAnswer?.answer === option
                          ? 'border-blue-500 bg-blue-500 text-white'
                          : 'border-border bg-background'
                      }`}
                    >
                      {selectedAnswer?.answer === option && (
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
              <div className="mt-6 p-4 rounded-lg border-2 border-blue-200 bg-blue-50 text-blue-800">
                <div className="flex items-center gap-3">
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
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <div>
                    <h4 className="font-semibold">Answer Submitted</h4>
                    <p className="text-sm">
                      Your answer has been recorded. Moving to the next question...
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
                    : getQuestionStatus(index) === 'answered'
                      ? 'bg-green-500'
                      : 'bg-gray-300 hover:bg-gray-400'
                }`}
                aria-label={`Go to question ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </>
  )
}

export default QuestionCard
