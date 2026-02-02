'use client'

import { useEffect, useState, use } from 'react'
import { Submission, Answer } from '@/interface/submission'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useAdminStore } from '@/hooks/useAdminStore'
import { Material, Question } from '@/interface/material'
import { useSubmissionStore } from '@/hooks/useSubmissionStore'
import {
  CheckCircle2,
  XCircle,
  ChevronDown,
  ChevronUp,
  BookOpen,
  Clock,
  AlertTriangle,
} from 'lucide-react'
import { Button } from '@/components/ui/button'

const calculateReadingSpeed = (words: number, duration: number): number => {
  if (duration === 0) return 0
  const minutes = duration / 60
  return Math.round(words / minutes)
}

const calculateTotalScore = (submission: Submission): number => {
  const totalQuestions = submission.answers.length
  const correctAnswers =
    submission.comprehensionScore + submission.vocabularyScore
  return totalQuestions > 0
    ? Math.round((correctAnswers / totalQuestions) * 100)
    : 0
}

const formatDuration = (seconds: number): string => {
  if (seconds < 60) {
    return `${Math.round(seconds)}s`
  }
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = Math.round(seconds % 60)
  return remainingSeconds > 0
    ? `${minutes}m ${remainingSeconds}s`
    : `${minutes}m`
}

export default function ScorePage({
  params,
}: {
  params: Promise<{ materialBatch: string }>
}) {
  const { fetchAllMaterials, allMaterials } = useAdminStore()
  const { batchSubmissions, setBatchSubmissions, loading } = useSubmissionStore()

  const resolvedParams = use(params)
  const materialBatch = resolvedParams.materialBatch

  // Fetch materials - only once on mount
  useEffect(() => {
    fetchAllMaterials()
  }, [fetchAllMaterials])

  useEffect(() => {
    if (materialBatch) {
      setBatchSubmissions(materialBatch)
    }
  }, [materialBatch, setBatchSubmissions]);

  // Load batch submissions when materialBatch changes
  // useEffect(() => {

  //   const loadData = async () => {
  //     setLoading(true)
  //     await setBatchSubmissions(materialBatch)
  //     setLoading(false)
  //   }


  //   loadData()
  // }, [materialBatch, setBatchSubmissions]);
  // useEffect(() => {
  //   const loadData = async () => {
  //     if (materialBatch) {
  //       setLoading(true)
  //       await setBatchSubmissions(materialBatch)
  //       setLoading(false)
  //     }
  //   }
  //   loadData()
  // }, [materialBatch, setBatchSubmissions])

  const getMaterialDetails = (materialId: string): Material | undefined => {
    return allMaterials.find((material) => material.id === materialId)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-blue-50/30 to-indigo-50/50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl shadow-xl shadow-blue-500/25 mb-6">
            <svg
              className="w-8 h-8 text-white animate-spin"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-2">
            Loading Results
          </h2>
          <p className="text-muted-foreground">
            Please wait while we fetch your assessment results...
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-blue-50/30 to-indigo-50/50">
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-[0.02]" />
        <div className="relative z-10 container mx-auto px-6 py-12">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-3xl shadow-2xl shadow-blue-500/25 mb-6">
              <svg
                className="w-10 h-10 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-foreground via-blue-600 to-indigo-600 bg-clip-text text-transparent mb-4">
              Assessment Results
            </h1>
            <p className="text-lg text-muted-foreground">
              Great job! Take a moment to review your answers and see how much
              you&apos;ve improved.
            </p>
          </div>

          {batchSubmissions.length === 0 ? (
            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
              <CardContent className="p-12 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-2xl mb-6">
                  <svg
                    className="w-8 h-8 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  No Results Found
                </h3>
                <p className="text-muted-foreground mb-6">
                  No submissions found for material batch &quot;{materialBatch}
                  &quot;. Complete some reading assessments to see your results
                  here.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-6">
              {batchSubmissions.map((submission) => {
                const material = getMaterialDetails(submission.materialId)
                if (!material) return null

                return (
                  <SubmissionScoreCard
                    key={submission.id}
                    submission={submission}
                    material={material}
                  />
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

interface SubmissionScoreCardProps {
  submission: Submission
  material: Material
}

function SubmissionScoreCard({
  submission,
  material,
}: SubmissionScoreCardProps) {
  const [expandedQuestions, setExpandedQuestions] = useState<Set<number>>(
    new Set(),
  )
  const [showAllQuestions, setShowAllQuestions] = useState(false)

  const comprehensionQuestions = material.questions.filter(
    (q) => q.type === 'COMPREHENSION',
  )
  const vocabularyQuestions = material.questions.filter(
    (q) => q.type === 'VOCABULARY',
  )

  useEffect(() => {
    if (showAllQuestions) {
      const allIndices = new Set<number>()
      comprehensionQuestions.forEach((_, index) => allIndices.add(index))
      vocabularyQuestions.forEach((_, index) =>
        allIndices.add(index + comprehensionQuestions.length),
      )
      setExpandedQuestions(allIndices)
    } else {
      setExpandedQuestions(new Set())
    }
  }, [showAllQuestions])

  const totalScore = calculateTotalScore(submission)
  const readingSpeed = calculateReadingSpeed(
    submission.numberOfWords,
    submission.duration,
  )
  const miscuesCount = submission.miscues?.length || 0

  const toggleQuestion = (index: number) => {
    const newExpanded = new Set(expandedQuestions)
    if (newExpanded.has(index)) {
      newExpanded.delete(index)
    } else {
      newExpanded.add(index)
    }
    setExpandedQuestions(newExpanded)
  }

  const getAnswerForQuestion = (
    questionIndex: number,
    questionType: string,
  ): Answer | undefined => {
    if (questionType === 'COMPREHENSION') {
      return submission.answers.find(
        (a) =>
          a.type === 'COMPREHENSION' &&
          submission.answers
            .filter((ans) => ans.type === 'COMPREHENSION')
            .indexOf(a) === questionIndex,
      )
    } else {
      const vocabAnswers = submission.answers.filter(
        (a) => a.type === 'VOCABULARY',
      )
      return vocabAnswers[questionIndex]
    }
  }

  const renderQuestion = (
    question: Question,
    index: number,
    type: string,
    forceExpanded?: boolean,
  ) => {
    const answer = getAnswerForQuestion(index, type)
    const isCorrect = answer?.isCorrect || false
    const isExpanded =
      forceExpanded !== undefined ? forceExpanded : expandedQuestions.has(index)

    return (
      <Card
        key={`${type}-${index}`}
        className={`border-l-4 transition-all duration-200 hover:shadow-md ${
          isCorrect
            ? 'border-l-green-500 bg-green-50/30'
            : 'border-l-red-500 bg-red-50/30'
        }`}
      >
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <div
              className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                isCorrect ? 'bg-green-500' : 'bg-red-500'
              }`}
            >
              {isCorrect ? (
                <CheckCircle2 className="w-5 h-5 text-white" />
              ) : (
                <XCircle className="w-5 h-5 text-white" />
              )}
            </div>
            <div className="flex-1">
              <div className="flex items-start justify-between gap-2 mb-2">
                <p className="text-sm font-semibold text-gray-900 flex-1">
                  {question.title}
                </p>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => toggleQuestion(index)}
                  className="h-6 w-6 p-0"
                >
                  {isExpanded ? (
                    <ChevronUp className="w-4 h-4" />
                  ) : (
                    <ChevronDown className="w-4 h-4" />
                  )}
                </Button>
              </div>

              {isExpanded && (
                <div className="mt-3 space-y-3 pl-11">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-medium text-gray-600">
                        Your Answer:
                      </span>
                      <span
                        className={`px-2 py-1 rounded text-xs font-medium ${
                          isCorrect
                            ? 'bg-green-100 text-green-700 border border-green-300'
                            : 'bg-red-100 text-red-700 border border-red-300'
                        }`}
                      >
                        {answer?.answer || 'No answer provided'}
                      </span>
                    </div>
                    {!isCorrect && (
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-medium text-gray-600">
                          Correct Answer:
                        </span>
                        <span className="px-2 py-1 rounded text-xs font-medium bg-green-100 text-green-700 border border-green-300">
                          {question.answer}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="mt-3 pt-3 border-t border-gray-200">
                    <p className="text-xs font-medium text-gray-700 mb-2">
                      Options:
                    </p>
                    <div className="grid grid-cols-2 gap-2">
                      {question.options.map((option, optIdx) => {
                        const isSelected = answer?.answer === option
                        const isCorrectOption = option === question.answer
                        return (
                          <div
                            key={optIdx}
                            className={`p-2 rounded text-xs border ${
                              isCorrectOption
                                ? 'bg-green-50 border-green-300 text-green-700 font-medium'
                                : isSelected && !isCorrect
                                  ? 'bg-red-50 border-red-300 text-red-700'
                                  : 'bg-gray-50 border-gray-200 text-gray-600'
                            }`}
                          >
                            {option}
                            {isCorrectOption && (
                              <CheckCircle2 className="w-3 h-3 inline ml-1" />
                            )}
                          </div>
                        )
                      })}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm overflow-hidden">
      <div className="h-2 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500" />
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-2xl font-bold mb-1">
              {material.title || 'Reading Assessment'}
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              {submission.submittedAt?.toDate?.().toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              }) || 'Date not available'}
            </p>
          </div>
          <div className="text-right">
            <div className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              {totalScore}%
            </div>
            <p className="text-xs text-muted-foreground">
              {submission.comprehensionScore + submission.vocabularyScore} /{' '}
              {submission.answers.length} correct
            </p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border border-blue-200">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-blue-500 rounded-lg">
                <BookOpen className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-blue-700">
                  {totalScore}%
                </p>
                <p className="text-xs text-blue-600 font-medium">
                  Overall Score
                </p>
              </div>
            </div>
          </div>

          <div className="p-4 bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-xl border border-emerald-200">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-emerald-500 rounded-lg">
                <Clock className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-emerald-700">
                  {formatDuration(submission.duration ?? 0)}
                </p>
                <p className="text-xs text-emerald-600 font-medium">
                  Words/Min
                </p>
              </div>
            </div>
          </div>

          <div className="p-4 bg-gradient-to-br from-amber-50 to-amber-100 rounded-xl border border-amber-200">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-amber-500 rounded-lg">
                <AlertTriangle className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-amber-700">
                  {miscuesCount}
                </p>
                <p className="text-xs text-amber-600 font-medium">Miscues</p>
                {miscuesCount > 0 && (
                  <p className="text-xs text-amber-500 mt-1">
                    {Math.round(
                      (miscuesCount / submission.numberOfWords) * 100,
                    )}
                    % error rate
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* <div className="pt-4 border-t">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Question Details
            </h3>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowAllQuestions(!showAllQuestions)}
            >
              {showAllQuestions ? 'Collapse All' : 'Expand All'}
            </Button>
          </div>

          {comprehensionQuestions.length > 0 && (
            <div className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-sm font-semibold text-purple-700 flex items-center gap-2">
                  <div className="w-1 h-5 bg-purple-500 rounded-full" />
                  Comprehension Questions ({submission.comprehensionScore}/
                  {comprehensionQuestions.length})
                </h4>
              </div>
              <div className="space-y-3">
                {comprehensionQuestions.map((question, index) => {
                  const isExpanded =
                    showAllQuestions || expandedQuestions.has(index)
                  return renderQuestion(
                    question,
                    index,
                    'COMPREHENSION',
                    isExpanded,
                  )
                })}
              </div>
            </div>
          )}

          {vocabularyQuestions.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-sm font-semibold text-indigo-700 flex items-center gap-2">
                  <div className="w-1 h-5 bg-indigo-500 rounded-full" />
                  Vocabulary Questions ({submission.vocabularyScore}/
                  {vocabularyQuestions.length})
                </h4>
              </div>
              <div className="space-y-3">
                {vocabularyQuestions.map((question, index) => {
                  const isExpanded =
                    showAllQuestions || expandedQuestions.has(index)
                  return renderQuestion(
                    question,
                    index,
                    'VOCABULARY',
                    isExpanded,
                  )
                })}
              </div>
            </div>
          )}
        </div> */}
      </CardContent>
    </Card>
  )
}
