'use client'

import { useAuthStore } from '@/hooks/useAuthStore'
import { useSubmissionStore } from '@/hooks/useSubmissionStore'
import { useReadStore } from '@/hooks/useReadStore'
import { useAdminStore } from '@/hooks/useAdminStore'
import { Submission } from '@/interface/submission'
import { useEffect, useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import {
  BookOpen,
  Clock,
  CheckCircle2,
  XCircle,
  TrendingUp,
  FileText,
} from 'lucide-react'
import { Material } from '@/interface/material'

const formatDuration = (seconds: number): string => {
  if (seconds < 60) {
    return `${Math.round(seconds)}s`
  } else {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = Math.round(seconds % 60)
    return remainingSeconds > 0
      ? `${minutes}m ${remainingSeconds}s`
      : `${minutes}m`
  }
}

const calculateOverallScore = (
  comprehensionScore: number,
  vocabularyScore: number,
  totalQuestions: number,
): number => {
  return Math.round(
    ((comprehensionScore + vocabularyScore) / totalQuestions) * 100,
  )
}

const getScoreLevel = (
  percentage: number,
): {
  level: string
  color: string
  bgColor: string
  borderColor: string
} => {
  if (percentage >= 80) {
    return {
      level: 'Excellent',
      color: 'text-green-700',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-300',
    }
  } else if (percentage >= 60) {
    return {
      level: 'Good',
      color: 'text-blue-700',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-300',
    }
  } else {
    return {
      level: 'Needs Improvement',
      color: 'text-amber-700',
      bgColor: 'bg-amber-50',
      borderColor: 'border-amber-300',
    }
  }
}

export default function PretestScorePage() {
  const { user } = useAuthStore()
  const { submissions, fetchSubmissions } = useSubmissionStore()
  const { materials, fetchMaterials } = useReadStore()
  const { quarter, getQuarter } = useAdminStore()
  const router = useRouter()
  const [expandedCard, setExpandedCard] = useState<string | null>(null)
  const [selectedTestType, setSelectedTestType] = useState<'preTest' | 'postTest'>('preTest')

  const studentId = user?.id

  useEffect(() => {
    if (!studentId) return
    fetchSubmissions(studentId)
  }, [studentId, fetchSubmissions])

  useEffect(() => {
    if (!quarter) {
      getQuarter()
    }
  }, [quarter, getQuarter])

  useEffect(() => {
    if (quarter?.quarter) {
      fetchMaterials(quarter.quarter)
    }
  }, [quarter?.quarter, fetchMaterials])

  const filteredSubmissions = submissions.filter(
    (sub) => sub.testType === selectedTestType,
  )

  const getMaterialDetails = (materialId: string): Material | undefined => {
    return materials.find((material) => material.id === materialId)
  }

  const groupSubmissionsByBatch = (submissions: Submission[]) => {
    const grouped = submissions.reduce(
      (acc, submission) => {
        const batch = submission.materialBatch || 'no-batch'
        if (!acc[batch]) {
          acc[batch] = []
        }
        acc[batch].push(submission)
        return acc
      },
      {} as Record<string, Submission[]>,
    )

    return Object.entries(grouped).map(([batch, subs]) => ({
      batch,
      submissions: subs.sort(
        (a, b) => b.submittedAt.toMillis() - a.submittedAt.toMillis(),
      ),
    }))
  }

  const testBatches = groupSubmissionsByBatch(filteredSubmissions)

  if (!studentId) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center p-6">
        <Card className="border border-stone-200 shadow-md bg-white max-w-md w-full">
          <CardContent className="p-8 text-center">
            <p className="text-stone-600">Please log in to view your scores.</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-stone-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-stone-100 rounded-xl border border-stone-200">
              <FileText className="w-6 h-6 text-stone-700" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-stone-900">
                Assessment Results
              </h1>
              <p className="text-stone-600 mt-1">
                Review your test performance
              </p>
            </div>
          </div>
        </div>

        {submissions.length === 0 ? (
          <Card className="border border-stone-200 shadow-sm bg-white">
            <CardContent className="p-12 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-stone-100 rounded-xl mb-4 border border-stone-200">
                <BookOpen className="w-8 h-8 text-stone-400" />
              </div>
              <h3 className="text-lg font-semibold text-stone-900 mb-2">
                No Results Yet
              </h3>
              <p className="text-stone-600 mb-6">
                Complete an assessment to see your results here.
              </p>
              <Button
                onClick={() => router.push('/student/mode')}
                className="bg-stone-900 hover:bg-stone-800 text-white transition-all duration-300 hover:scale-105"
              >
                Start Assessment
              </Button>
            </CardContent>
          </Card>
        ) : (
          <>
            <div className="flex justify-center mb-6">
              <div className="inline-flex bg-white rounded-lg p-1 shadow-sm border border-stone-200">
                <Button
                  onClick={() => setSelectedTestType('preTest')}
                  className={`px-6 py-2 rounded-md font-medium transition-all ${
                    selectedTestType === 'preTest'
                      ? 'bg-stone-900 text-white'
                      : 'bg-transparent text-stone-600 hover:text-stone-900 hover:bg-stone-50'
                  }`}
                >
                  Pre-Test
                </Button>
                <Button
                  onClick={() => setSelectedTestType('postTest')}
                  className={`px-6 py-2 rounded-md font-medium transition-all ${
                    selectedTestType === 'postTest'
                      ? 'bg-stone-900 text-white'
                      : 'bg-transparent text-stone-600 hover:text-stone-900 hover:bg-stone-50'
                  }`}
                >
                  Post-Test
                </Button>
              </div>
            </div>

            {filteredSubmissions.length === 0 ? (
              <Card className="border border-stone-200 shadow-sm bg-white">
                <CardContent className="p-12 text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-stone-100 rounded-xl mb-4 border border-stone-200">
                    <BookOpen className="w-8 h-8 text-stone-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-stone-900 mb-2">
                    No {selectedTestType === 'preTest' ? 'Pre-Test' : 'Post-Test'} Results Yet
                  </h3>
                  <p className="text-stone-600 mb-6">
                    Complete the {selectedTestType === 'preTest' ? 'pre-test' : 'post-test'} assessment to see your results here.
                  </p>
                  <Button
                    onClick={() => router.push('/student/mode')}
                    className="bg-stone-900 hover:bg-stone-800 text-white transition-all duration-300 hover:scale-105"
                  >
                    Start {selectedTestType === 'preTest' ? 'Pre-Test' : 'Post-Test'}
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-6">
                {testBatches.map((batchGroup) => (
              <div key={batchGroup.batch} className="space-y-4">
                {batchGroup.batch !== 'no-batch' && (
                  <div className="flex items-center gap-2 mb-2">
                    <div className="h-px flex-1 bg-stone-200" />
                    <span className="text-sm font-medium text-stone-600 px-3 py-1 bg-stone-100 rounded-full border border-stone-200">
                      Batch {batchGroup.batch}
                    </span>
                    <div className="h-px flex-1 bg-stone-200" />
                  </div>
                )}

                <div className="grid gap-4">
                  {batchGroup.submissions.map((submission) => {
                    const material = getMaterialDetails(submission.materialId)
                    const materialTitle =
                      material?.title || `Material ${submission.materialId}`
                    const overallScore = calculateOverallScore(
                      submission.comprehensionScore,
                      submission.vocabularyScore,
                      submission.answers.length,
                    )
                    const scoreLevel = getScoreLevel(overallScore)
                    const isExpanded = expandedCard === submission.id

                    const comprehensionQuestions =
                      material?.questions.filter(
                        (q) => q.type === 'COMPREHENSION',
                      ) || []
                    const vocabularyQuestions =
                      material?.questions.filter(
                        (q) => q.type === 'VOCABULARY',
                      ) || []

                    return (
                      <Card
                        key={submission.id}
                        className="border border-stone-200 shadow-sm bg-white hover:shadow-md transition-all duration-300 hover:-translate-y-1 overflow-hidden"
                      >
                        <CardContent className="p-6">
                          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 mb-6 pb-6 border-b border-stone-200">
                            <div className="flex-1">
                              <div className="flex items-start gap-3">
                                <div className="inline-flex items-center justify-center w-10 h-10 bg-stone-100 rounded-lg border border-stone-200">
                                  <BookOpen className="w-5 h-5 text-stone-700" />
                                </div>
                                <div className="flex-1">
                                  <h2 className="text-lg font-semibold text-stone-900 mb-1">
                                    {materialTitle}
                                  </h2>
                                  <p className="text-sm text-stone-500">
                                    {submission.submittedAt
                                      .toDate()
                                      .toLocaleDateString('en-US', {
                                        year: 'numeric',
                                        month: 'short',
                                        day: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit',
                                      })}
                                  </p>
                                  {submission.quarter && (
                                    <span className="inline-block mt-2 text-xs font-medium text-stone-600 bg-stone-100 px-2 py-1 rounded border border-stone-200">
                                      {submission.quarter}
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>

                            <div className="flex flex-col items-end gap-2">
                              <div
                                className={`text-center px-5 py-3 rounded-xl border ${scoreLevel.bgColor} ${scoreLevel.borderColor}`}
                              >
                                <div
                                  className={`text-3xl font-bold ${scoreLevel.color} mb-1`}
                                >
                                  {overallScore}%
                                </div>
                                <div className="text-xs font-medium text-stone-600">
                                  {submission.comprehensionScore +
                                    submission.vocabularyScore}
                                  /{submission.answers.length} correct
                                </div>
                              </div>
                              <div
                                className={`px-3 py-1.5 rounded-lg border text-xs font-semibold ${scoreLevel.bgColor} ${scoreLevel.borderColor} ${scoreLevel.color}`}
                              >
                                {scoreLevel.level}
                              </div>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-4">
                            <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                              <div className="text-sm font-semibold text-blue-700">
                                {formatDuration(submission.duration)}
                              </div>
                              <div className="text-xs text-blue-600 mt-0.5 flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                Duration
                              </div>
                            </div>
                            <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-200">
                              <div className="text-sm font-semibold text-emerald-700">
                                {submission.numberOfWords}
                              </div>
                              <div className="text-xs text-emerald-600 mt-0.5">
                                Words
                              </div>
                            </div>
                            <div className="p-3 bg-purple-50 rounded-lg border border-purple-200">
                              <div className="text-sm font-semibold text-purple-700">
                                {submission.comprehensionScore}/
                                {comprehensionQuestions.length}
                              </div>
                              <div className="text-xs text-purple-600 mt-0.5">
                                Comprehension
                              </div>
                            </div>
                            <div className="p-3 bg-indigo-50 rounded-lg border border-indigo-200">
                              <div className="text-sm font-semibold text-indigo-700">
                                {submission.vocabularyScore}/
                                {vocabularyQuestions.length}
                              </div>
                              <div className="text-xs text-indigo-600 mt-0.5">
                                Vocabulary
                              </div>
                            </div>
                            <div className="p-3 bg-amber-50 rounded-lg border border-amber-200">
                              <div className="text-sm font-semibold text-amber-700">
                                {submission.miscues
                                  ? Array.isArray(submission.miscues)
                                    ? submission.miscues.length
                                    : 0
                                  : 0}
                              </div>
                              <div className="text-xs text-amber-600 mt-0.5">
                                Miscues
                              </div>
                            </div>
                          </div>

                          {/* <button
                            onClick={() =>
                              setExpandedCard(
                                isExpanded ? null : submission.id || null,
                              )
                            }
                            className="w-full flex items-center justify-between p-3 bg-stone-50 hover:bg-stone-100 rounded-lg border border-stone-200 transition-all duration-200"
                          >
                            <span className="text-sm font-semibold text-stone-700">
                              {isExpanded ? 'Hide' : 'Show'} Answer Details
                            </span>
                            <TrendingUp
                              className={`w-4 h-4 text-stone-600 transition-transform duration-200 ${
                                isExpanded ? 'rotate-180' : ''
                              }`}
                            />
                          </button> */}

                          {isExpanded && material && (
                            <div className="mt-6 pt-6 border-t border-stone-200 space-y-6">
                              <div>
                                <div className="flex items-center gap-2 mb-3">
                                  <div className="w-1 h-4 bg-purple-500 rounded-full" />
                                  <h3 className="text-sm font-semibold text-stone-700 uppercase tracking-wide">
                                    Comprehension Questions
                                  </h3>
                                  <span className="ml-auto text-xs font-medium text-purple-600 bg-purple-50 px-2 py-1 rounded-full border border-purple-200">
                                    {submission.comprehensionScore}/
                                    {comprehensionQuestions.length} correct
                                  </span>
                                </div>
                                <div className="space-y-3">
                                  {comprehensionQuestions.map(
                                    (question, index) => {
                                      const studentAnswer =
                                        submission.answers.find(
                                          (a) =>
                                            a.type === 'COMPREHENSION' &&
                                            submission.answers.indexOf(a) ===
                                              index,
                                        )
                                      const isCorrect =
                                        studentAnswer?.isCorrect || false

                                      return (
                                        <div
                                          key={index}
                                          className={`p-4 rounded-lg border-l-4 ${
                                            isCorrect
                                              ? 'bg-green-50 border-l-green-500 border-green-200'
                                              : 'bg-red-50 border-l-red-500 border-red-200'
                                          }`}
                                        >
                                          <div className="flex items-start gap-3 mb-3">
                                            {isCorrect ? (
                                              <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                                            ) : (
                                              <XCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                                            )}
                                            <p className="flex-1 text-sm font-medium text-stone-800">
                                              {question.title}
                                            </p>
                                          </div>
                                          <div className="ml-8 space-y-2 text-sm">
                                            <div className="flex flex-wrap items-center gap-2">
                                              <span className="text-xs font-medium text-stone-600">
                                                Your answer:
                                              </span>
                                              <span
                                                className={`px-3 py-1 rounded-md text-xs font-medium ${
                                                  isCorrect
                                                    ? 'bg-green-100 text-green-700 border border-green-200'
                                                    : 'bg-red-100 text-red-700 border border-red-200 line-through'
                                                }`}
                                              >
                                                {studentAnswer?.answer ||
                                                  'No answer'}
                                              </span>
                                            </div>
                                            {!isCorrect && (
                                              <div className="flex flex-wrap items-center gap-2">
                                                <span className="text-xs font-medium text-stone-600">
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
                                    },
                                  )}
                                </div>
                              </div>

                              <div>
                                <div className="flex items-center gap-2 mb-3">
                                  <div className="w-1 h-4 bg-indigo-500 rounded-full" />
                                  <h3 className="text-sm font-semibold text-stone-700 uppercase tracking-wide">
                                    Vocabulary Questions
                                  </h3>
                                  <span className="ml-auto text-xs font-medium text-indigo-600 bg-indigo-50 px-2 py-1 rounded-full border border-indigo-200">
                                    {submission.vocabularyScore}/
                                    {vocabularyQuestions.length} correct
                                  </span>
                                </div>
                                <div className="space-y-3">
                                  {vocabularyQuestions.map(
                                    (question, index) => {
                                      const vocabAnswers =
                                        submission.answers.filter(
                                          (a) => a.type === 'VOCABULARY',
                                        )
                                      const studentAnswer = vocabAnswers[index]
                                      const isCorrect =
                                        studentAnswer?.isCorrect || false

                                      return (
                                        <div
                                          key={index}
                                          className={`p-4 rounded-lg border-l-4 ${
                                            isCorrect
                                              ? 'bg-green-50 border-l-green-500 border-green-200'
                                              : 'bg-red-50 border-l-red-500 border-red-200'
                                          }`}
                                        >
                                          <div className="flex items-start gap-3 mb-3">
                                            {isCorrect ? (
                                              <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                                            ) : (
                                              <XCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                                            )}
                                            <p className="flex-1 text-sm font-medium text-stone-800">
                                              {question.title}
                                            </p>
                                          </div>
                                          <div className="ml-8 space-y-2 text-sm">
                                            <div className="flex flex-wrap items-center gap-2">
                                              <span className="text-xs font-medium text-stone-600">
                                                Your answer:
                                              </span>
                                              <span
                                                className={`px-3 py-1 rounded-md text-xs font-medium ${
                                                  isCorrect
                                                    ? 'bg-green-100 text-green-700 border border-green-200'
                                                    : 'bg-red-100 text-red-700 border border-red-200 line-through'
                                                }`}
                                              >
                                                {studentAnswer?.answer ||
                                                  'No answer'}
                                              </span>
                                            </div>
                                            {!isCorrect && (
                                              <div className="flex flex-wrap items-center gap-2">
                                                <span className="text-xs font-medium text-stone-600">
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
                                    },
                                  )}
                                </div>
                              </div>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    )
                  })}
                </div>
                </div>
              ))}
            </div>
          )}
        </>
        )}
      </div>
    </div>
  )
}
