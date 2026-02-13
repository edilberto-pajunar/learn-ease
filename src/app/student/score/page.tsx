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
  Calendar,
  Clock,
  Percent,
  CheckCircle2,
  XCircle,
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

const getScoreLevel = (
  percentage: number,
): {
  level: string
  color: string
  bgColor: string
  borderColor: string
} => {
  const p = Number.isFinite(percentage) ? percentage : 0
  if (p >= 80) {
    return {
      level: 'Excellent',
      color: 'text-green-700',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-300',
    }
  } else if (p >= 60) {
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

function getSubmittedAtDate(submittedAt: Submission['submittedAt']): Date | null {
  if (!submittedAt) return null
  if (typeof submittedAt.toDate === 'function') return submittedAt.toDate()
  if (typeof submittedAt.toMillis === 'function') return new Date(submittedAt.toMillis())
  if (submittedAt?.seconds != null) return new Date((submittedAt as { seconds: number }).seconds * 1000)
  return null
}

export default function PretestScorePage() {
  const { user } = useAuthStore()
  const { preTestSubmissions, postTestSubmissions, fetchPreTestSubmission, fetchPostTestSubmission } = useSubmissionStore()
  const { materials, fetchMaterials } = useReadStore()
  const { quarter, getQuarter } = useAdminStore()
  const router = useRouter()
  const [expandedCard, setExpandedCard] = useState<string | null>(null)
  const [selectedTestType, setSelectedTestType] = useState<'preTest' | 'postTest'>('preTest')

  const studentId = user?.id
  const preTestMaterialBatchId = user?.preTestMaterialBatchId ?? ''
  const postTestMaterialBatchId = user?.postTestMaterialBatchId ?? ''

  console.log('preTestMaterialBatchId', preTestMaterialBatchId);
  console.log('postTestMaterialBatchId', postTestMaterialBatchId);

  useEffect(() => {
    if (!studentId) return
    if (preTestMaterialBatchId) {
      fetchPreTestSubmission(studentId, preTestMaterialBatchId)
    }
    if (!postTestMaterialBatchId) {
      fetchPostTestSubmission(studentId, postTestMaterialBatchId)
    }
  }, [studentId, fetchPreTestSubmission, fetchPostTestSubmission, preTestMaterialBatchId, postTestMaterialBatchId])

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

  const submissions =
    selectedTestType === 'preTest' ? preTestSubmissions ?? [] : postTestSubmissions ?? []
  const hasAnySubmissions =
    (preTestSubmissions?.length ?? 0) > 0 || (postTestSubmissions?.length ?? 0) > 0

  const { totalCorrect, totalQuestions, totalScorePercent, totalScoreLevel } = (() => {
    const answers = submissions.flatMap((s) => s.answers ?? [])
    const correct = answers.filter((a) => a?.isCorrect).length
    const total = answers.length || 1
    const percent = Math.round((correct / total) * 100)
    return {
      totalCorrect: correct,
      totalQuestions: total,
      totalScorePercent: percent,
      totalScoreLevel: getScoreLevel(percent),
    }
  })()

  const getMaterialDetails = (materialId: string): Material | undefined => {
    return materials.find((material) => material.id === materialId)
  }

  const groupSubmissionsByBatch = (subs: Submission[]) => {
    const grouped = (subs ?? []).reduce(
      (acc, submission) => {
        const batch = submission.materialBatch ?? 'no-batch'
        if (!acc[batch]) acc[batch] = []
        acc[batch].push(submission)
        return acc
      },
      {} as Record<string, Submission[]>,
    )

    return Object.entries(grouped).map(([batch, batchSubs]) => ({
      batch,
      submissions: batchSubs.sort((a, b) => {
        const dateA = getSubmittedAtDate(a.submittedAt)?.getTime() ?? 0
        const dateB = getSubmittedAtDate(b.submittedAt)?.getTime() ?? 0
        return dateB - dateA
      }),
    }))
  }

  const testBatches = groupSubmissionsByBatch(submissions)

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

        {!hasAnySubmissions ? (
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
              <div className="inline-flex bg-white rounded-lg p-1 shadow-sm border border-stone-200 gap-4">
                <Button
                  onClick={() => setSelectedTestType('preTest')}
                  className={`px-6 py-2 rounded-md font-medium transition-all ${selectedTestType === 'preTest'
                    ? 'bg-stone-900 text-white'
                    : 'bg-transparent text-stone-600 hover:text-stone-900 hover:bg-stone-50'
                    }`}
                >
                  Pre-Test
                </Button>
                <Button
                  onClick={() => setSelectedTestType('postTest')}
                  className={`px-6 py-2 rounded-md font-medium transition-all ${selectedTestType === 'postTest'
                    ? 'bg-stone-900 text-white'
                    : 'bg-transparent text-stone-600 hover:text-stone-900 hover:bg-stone-50'
                    }`}
                >
                  Post-Test
                </Button>
              </div>
            </div>

            {submissions.length === 0 ? (
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
                <Card className="border border-stone-200 shadow-sm bg-white">
                  <CardContent className="p-4">
                    <div className="flex flex-wrap items-center justify-between gap-4">
                      <h3 className="text-sm font-semibold text-stone-700">
                        Total score
                      </h3>
                      <span className="text-sm text-stone-600">
                        {totalCorrect} / {totalQuestions} correct
                      </span>
                    </div>
                    <div className="flex flex-wrap items-center justify-between gap-4">
                      <h3 className="text-sm font-semibold text-stone-700">
                        Percentage
                      </h3>
                      <span className="text-sm text-stone-600">
                        {totalScorePercent}%
                      </span>
                    </div>
                    <div className="flex flex-wrap items-center justify-between gap-4">
                      <h3 className="text-sm font-semibold text-stone-700">
                        Level
                      </h3>
                      <span
                        className={`px-3 py-1.5 rounded-lg border text-xs font-semibold ${totalScoreLevel.bgColor} ${totalScoreLevel.borderColor} ${totalScoreLevel.color}`}
                      >
                        {totalScoreLevel.level}
                      </span>
                    </div>
                  </CardContent>
                </Card>

                {testBatches.map((batchGroup) => (
                  <div key={batchGroup.batch} className="space-y-4">

                    <div className="grid gap-4">
                      {batchGroup.submissions.map((submission, idx) => {
                        const material = getMaterialDetails(submission.materialId ?? '')
                        const answers = submission.answers ?? []
                        const totalAnswers = answers.length || 1
                        const numberOfCorrectAnswers = answers.filter((a) => a?.isCorrect).length
                        const percentage = (numberOfCorrectAnswers / totalAnswers) * 100

                        const materialTitle =
                          material?.title ?? `Material ${submission.materialId ?? 'Unknown'}`
                        const isExpanded = expandedCard === (submission.id ?? null)
                        const submittedDate = getSubmittedAtDate(submission.submittedAt)

                        return (
                          <Card
                            key={submission.id ?? submission.materialId ?? idx}
                            className="border border-stone-200 shadow-sm bg-white hover:shadow-md transition-all duration-300 hover:-translate-y-1 overflow-hidden"
                          >
                            <CardContent className="p-6">
                              <div className="space-y-3 mb-6 pb-6 border-b border-stone-200">
                                <div className="flex items-center gap-3">
                                  <div className="inline-flex items-center justify-center w-10 h-10 bg-stone-100 rounded-lg border border-stone-200 shrink-0">
                                    <BookOpen className="w-5 h-5 text-stone-700" />
                                  </div>
                                  <span className="text-sm font-semibold text-stone-700 w-20 shrink-0">Material</span>
                                  <span className="text-sm text-stone-600">{materialTitle}</span>
                                </div>
                                <div className="flex items-center gap-3">
                                  <div className="inline-flex items-center justify-center w-10 h-10 bg-stone-100 rounded-lg border border-stone-200 shrink-0">
                                    <Calendar className="w-5 h-5 text-stone-700" />
                                  </div>
                                  <span className="text-sm font-semibold text-stone-700 w-20 shrink-0">Submitted</span>
                                  <span className="text-sm text-stone-600">
                                    {submittedDate
                                      ? submittedDate.toLocaleDateString('en-US', {
                                        year: 'numeric',
                                        month: 'short',
                                        day: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit',
                                      })
                                      : '—'}
                                  </span>
                                </div>
                                <div className="flex items-center gap-3">
                                  <div className="inline-flex items-center justify-center w-10 h-10 bg-stone-100 rounded-lg border border-stone-200 shrink-0">
                                    <Percent className="w-5 h-5 text-stone-700" />
                                  </div>
                                  <span className="text-sm font-semibold text-stone-700 w-20 shrink-0">Score</span>
                                  <span className="text-sm text-stone-600">{Math.round(percentage)}%</span>
                                </div>
                                <div className="flex items-center gap-3">
                                  <div className="inline-flex items-center justify-center w-10 h-10 bg-stone-100 rounded-lg border border-stone-200 shrink-0">
                                    <CheckCircle2 className="w-5 h-5 text-stone-700" />
                                  </div>
                                  <span className="text-sm font-semibold text-stone-700 w-20 shrink-0">Correct</span>
                                  <span className="text-sm text-stone-600">
                                    {numberOfCorrectAnswers} / {totalAnswers}
                                  </span>
                                </div>
                              </div>

                              <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-4">
                                <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                                  <div className="text-sm font-semibold text-blue-700">
                                    {formatDuration(Number(submission.duration) || 0)}
                                  </div>
                                  <div className="text-xs text-blue-600 mt-0.5 flex items-center gap-1">
                                    <Clock className="w-3 h-3" />
                                    Duration
                                  </div>
                                </div>
                                <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-200">
                                  <div className="text-sm font-semibold text-emerald-700">
                                    {submission.numberOfWords ?? 0}
                                  </div>
                                  <div className="text-xs text-emerald-600 mt-0.5">
                                    Words
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
                                    <div className="space-y-3">
                                      {(material.questions ?? []).map(
                                        (question, index) => {
                                          const studentAnswer = answers.find(
                                            (a, i) =>
                                              a?.type === 'COMPREHENSION' && i === index,
                                          )
                                          const isCorrect =
                                            studentAnswer?.isCorrect || false

                                          return (
                                            <div
                                              key={index}
                                              className={`p-4 rounded-lg border-l-4 ${isCorrect
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
                                                  {question?.title ?? ''}
                                                </p>
                                              </div>
                                              <div className="ml-8 space-y-2 text-sm">
                                                <div className="flex flex-wrap items-center gap-2">
                                                  <span className="text-xs font-medium text-stone-600">
                                                    Your answer:
                                                  </span>
                                                  <span
                                                    className={`px-3 py-1 rounded-md text-xs font-medium ${isCorrect
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
                                                      {question?.answer ?? ''}
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
