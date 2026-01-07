'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Material } from '@/interface/material'
import { Submission } from '@/interface/submission'
import { useState } from 'react'

interface SubmissionCardProps {
  submission: Submission
  material: Material
}

const formatDuration = (seconds: number): string => {
  if (seconds < 60) {
    return `${Math.round(seconds)} seconds`
  } else {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = Math.round(seconds % 60)
    return remainingSeconds > 0
      ? `${minutes} minutes ${remainingSeconds} seconds`
      : `${minutes} minutes`
  }
}

const calculateReadingLevel = (
  comprehensionScore: number,
  vocabularyScore: number,
  totalQuestions: number,
): {
  level: string
  color: string
  bgColor: string
  borderColor: string
  percentage: number
} => {
  const percentage =
    ((comprehensionScore + vocabularyScore) / totalQuestions) * 100

  if (percentage >= 80) {
    return {
      level: 'Independent',
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      percentage: percentage,
    }
  } else if (percentage >= 60) {
    return {
      level: 'Instructional',
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
      borderColor: 'border-yellow-200',
      percentage: percentage,
    }
  } else {
    return {
      level: 'Frustration',
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
      percentage: percentage,
    }
  }
}

export default function SubmissionCard(props: SubmissionCardProps) {
  const { submission, material } = props
  const [showDetails, setShowDetails] = useState(false)

  const materialTitle = material?.title || `Material ${submission.materialId}`
  const materialText = material?.text || 'No content available'

  const readingLevel = calculateReadingLevel(
    submission.comprehensionScore,
    submission.vocabularyScore,
    submission.answers.length,
  )

  const comprehensionQuestions =
    material?.questions.filter((q) => q.type === 'COMPREHENSION') || []
  const vocabularyQuestions =
    material?.questions.filter((q) => q.type === 'VOCABULARY') || []

  return (
    <Card className="border border-blue-100 shadow-sm hover:shadow-lg hover:border-blue-200 transition-all duration-300 bg-white overflow-hidden">
      <div className="h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500" />
      <CardContent className="p-6">
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 mb-6 pb-6 border-b border-gray-100">
          <div className="flex-1">
            <div className="flex items-center gap-3">
              <div className="inline-flex items-center justify-center w-10 h-10 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
                <svg
                  className="w-5 h-5 text-blue-600"
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
                <h2 className="text-lg font-semibold text-gray-900">
                  {materialTitle}
                </h2>
                <p className="text-sm text-gray-500">
                  {submission.submittedAt.toDate().toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-center px-4 py-2 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
              <div className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                {Math.round(readingLevel.percentage)}%
              </div>
              <div className="text-xs text-gray-600 mt-0.5">
                {submission.comprehensionScore + submission.vocabularyScore}/
                {submission.answers.length} correct
              </div>
            </div>
            <div
              className={`px-3 py-1.5 rounded-lg border ${readingLevel.bgColor} ${readingLevel.borderColor}`}
            >
              <span className={`text-xs font-semibold ${readingLevel.color}`}>
                {readingLevel.level}
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-4">
          <div className="p-3 bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-lg border border-blue-200">
            <div className="text-sm font-semibold text-blue-700">
              {formatDuration(submission.duration)}
            </div>
            <div className="text-xs text-blue-600 mt-0.5">Duration</div>
          </div>
          <div className="p-3 bg-gradient-to-br from-emerald-50 to-emerald-100/50 rounded-lg border border-emerald-200">
            <div className="text-sm font-semibold text-emerald-700">
              {submission.numberOfWords}
            </div>
            <div className="text-xs text-emerald-600 mt-0.5">Words</div>
          </div>
          <div className="p-3 bg-gradient-to-br from-purple-50 to-purple-100/50 rounded-lg border border-purple-200">
            <div className="text-sm font-semibold text-purple-700">
              {submission.comprehensionScore}
            </div>
            <div className="text-xs text-purple-600 mt-0.5">Comprehension</div>
          </div>
          <div className="p-3 bg-gradient-to-br from-indigo-50 to-indigo-100/50 rounded-lg border border-indigo-200">
            <div className="text-sm font-semibold text-indigo-700">
              {submission.vocabularyScore}
            </div>
            <div className="text-xs text-indigo-600 mt-0.5">Vocabulary</div>
          </div>
          <div className="p-3 bg-gradient-to-br from-amber-50 to-amber-100/50 rounded-lg border border-amber-200">
            <div className="text-sm font-semibold text-amber-700">
              {submission.miscues
                ? Array.isArray(submission.miscues)
                  ? submission.miscues.length
                  : 0
                : 0}
            </div>
            <div className="text-xs text-amber-600 mt-0.5">Miscues</div>
          </div>
        </div>

        <button
          onClick={() => setShowDetails(!showDetails)}
          className="w-full flex items-center justify-between p-3 bg-gradient-to-r from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 rounded-lg border border-blue-200 transition-all duration-200"
        >
          <span className="text-sm font-semibold text-blue-700">
            {showDetails ? 'Hide' : 'Show'} Answer Details
          </span>
          <svg
            className={`w-4 h-4 text-blue-600 transition-transform duration-200 ${showDetails ? 'rotate-180' : ''}`}
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

        {showDetails && (
          <div className="mt-6 pt-6 border-t border-gray-100 space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-1 h-4 bg-gradient-to-b from-blue-500 to-indigo-500 rounded-full" />
                <h3 className="text-xs font-semibold text-gray-700 uppercase tracking-wide">
                  Reading Content
                </h3>
              </div>
              <div className="bg-gradient-to-br from-gray-50 to-blue-50/30 rounded-lg p-4 border border-gray-200">
                <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {materialText}
                </p>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-1 h-5 bg-gradient-to-b from-purple-500 to-purple-600 rounded-full" />
                  <h3 className="text-sm font-semibold text-gray-900">
                    Comprehension Questions
                  </h3>
                </div>
                <span className="text-xs font-medium text-purple-600 bg-purple-50 px-2 py-1 rounded-full">
                  {submission.comprehensionScore}/
                  {comprehensionQuestions.length} correct
                </span>
              </div>
              <div className="space-y-3">
                {comprehensionQuestions.map((question, index) => {
                  const studentAnswer = submission.answers.find(
                    (a) =>
                      a.type === 'COMPREHENSION' &&
                      submission.answers.indexOf(a) === index,
                  )
                  const isCorrect = studentAnswer?.isCorrect || false

                  return (
                    <div
                      key={index}
                      className={`p-4 rounded-lg border-l-4 border-y border-r ${
                        isCorrect
                          ? 'bg-gradient-to-r from-green-50/50 to-transparent border-l-green-500 border-green-200'
                          : 'bg-gradient-to-r from-red-50/50 to-transparent border-l-red-500 border-red-200'
                      }`}
                    >
                      <div className="flex items-start gap-3 mb-3">
                        <span
                          className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold shadow-sm ${
                            isCorrect
                              ? 'bg-green-500 text-white'
                              : 'bg-red-500 text-white'
                          }`}
                        >
                          {isCorrect ? '✓' : '✕'}
                        </span>
                        <p className="flex-1 text-sm font-medium text-gray-800">
                          {question.title}
                        </p>
                      </div>
                      <div className="ml-9 space-y-2 text-sm">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-xs font-medium text-gray-600">
                            Your answer:
                          </span>
                          <span
                            className={`px-3 py-1 rounded-md text-xs font-medium ${
                              isCorrect
                                ? 'bg-green-100 text-green-700 border border-green-200'
                                : 'bg-red-100 text-red-700 border border-red-200 line-through'
                            }`}
                          >
                            {studentAnswer?.answer || 'No answer'}
                          </span>
                        </div>
                        {!isCorrect && (
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="text-xs font-medium text-gray-600">
                              Correct answer:
                            </span>
                            <span className="px-3 py-1 rounded-md text-xs font-medium bg-green-100 text-green-700 border border-green-200">
                              {question.answer}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-1 h-5 bg-gradient-to-b from-indigo-500 to-indigo-600 rounded-full" />
                  <h3 className="text-sm font-semibold text-gray-900">
                    Vocabulary Questions
                  </h3>
                </div>
                <span className="text-xs font-medium text-indigo-600 bg-indigo-50 px-2 py-1 rounded-full">
                  {submission.vocabularyScore}/{vocabularyQuestions.length}{' '}
                  correct
                </span>
              </div>
              <div className="space-y-3">
                {vocabularyQuestions.map((question, index) => {
                  const vocabAnswers = submission.answers.filter(
                    (a) => a.type === 'VOCABULARY',
                  )
                  const studentAnswer = vocabAnswers[index]
                  const isCorrect = studentAnswer?.isCorrect || false

                  return (
                    <div
                      key={index}
                      className={`p-4 rounded-lg border-l-4 border-y border-r ${
                        isCorrect
                          ? 'bg-gradient-to-r from-green-50/50 to-transparent border-l-green-500 border-green-200'
                          : 'bg-gradient-to-r from-red-50/50 to-transparent border-l-red-500 border-red-200'
                      }`}
                    >
                      <div className="flex items-start gap-3 mb-3">
                        <span
                          className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold shadow-sm ${
                            isCorrect
                              ? 'bg-green-500 text-white'
                              : 'bg-red-500 text-white'
                          }`}
                        >
                          {isCorrect ? '✓' : '✕'}
                        </span>
                        <p className="flex-1 text-sm font-medium text-gray-800">
                          {question.title}
                        </p>
                      </div>
                      <div className="ml-9 space-y-2 text-sm">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-xs font-medium text-gray-600">
                            Your answer:
                          </span>
                          <span
                            className={`px-3 py-1 rounded-md text-xs font-medium ${
                              isCorrect
                                ? 'bg-green-100 text-green-700 border border-green-200'
                                : 'bg-red-100 text-red-700 border border-red-200 line-through'
                            }`}
                          >
                            {studentAnswer?.answer || 'No answer'}
                          </span>
                        </div>
                        {!isCorrect && (
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="text-xs font-medium text-gray-600">
                              Correct answer:
                            </span>
                            <span className="px-3 py-1 rounded-md text-xs font-medium bg-green-100 text-green-700 border border-green-200">
                              {question.answer}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
