'use client'

import { Button } from '@/components/ui/button'
import { useAdminStore } from '@/hooks/useAdminStore'
import { useSubmissionStore } from '@/hooks/useSubmissionStore'
import { Submission } from '@/interface/submission'
import { Material } from '@/interface/material'
import { use, useEffect, useState } from 'react'
import {
  UserCircle,
  Mail,
  FileText,
  Calendar,
  Clock,
  BookOpen,
  AlertCircle,
  Download,
  ArrowLeft,
  Trophy,
  CheckCircle2,
  XCircle,
  ChevronDown,
  ChevronUp,
  Percent,
} from 'lucide-react'
import { useRouter } from 'next/navigation'

const formatDuration = (seconds: number): string => {
  if (seconds < 60) {
    return `${Math.round(seconds)}s`
  }
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = Math.round(seconds % 60)
  return remainingSeconds > 0 ? `${minutes}m ${remainingSeconds}s` : `${minutes}m`
}

const getScoreLevel = (percentage: number) => {
  const p = Number.isFinite(percentage) ? percentage : 0
  if (p >= 80) {
    return { level: 'Excellent', color: 'text-green-700', bgColor: 'bg-green-50', borderColor: 'border-green-300' }
  } else if (p >= 60) {
    return { level: 'Good', color: 'text-blue-700', bgColor: 'bg-blue-50', borderColor: 'border-blue-300' }
  }
  return { level: 'Needs Improvement', color: 'text-amber-700', bgColor: 'bg-amber-50', borderColor: 'border-amber-300' }
}

function getSubmittedAtDate(submittedAt: Submission['submittedAt']): Date | null {
  if (!submittedAt) return null
  if (typeof submittedAt.toDate === 'function') return submittedAt.toDate()
  if (typeof submittedAt.toMillis === 'function') return new Date(submittedAt.toMillis())
  if (submittedAt?.seconds != null) return new Date((submittedAt as { seconds: number }).seconds * 1000)
  return null
}

const AdminStudentPage = ({
  params,
}: {
  params: Promise<{ studentId: string }>
}) => {
  const { students, fetchAllMaterials, allMaterials, exportAllSubmissions } = useAdminStore()
  const {
    preTestSubmissions,
    postTestSubmissions,
    fetchPreTestSubmission,
    fetchPostTestSubmission,
  } = useSubmissionStore()
  const { studentId } = use(params)
  const student = students.find((s) => s.id === studentId)
  const router = useRouter()

  const [selectedTestType, setSelectedTestType] = useState<'preTest' | 'postTest'>('preTest')
  const [expandedCard, setExpandedCard] = useState<string | null>(null)

  const preTestBatchId = student?.preTestMaterialBatchId ?? ''
  const postTestBatchId = student?.postTestMaterialBatchId ?? ''

  useEffect(() => {
    fetchAllMaterials()
  }, [fetchAllMaterials])

  useEffect(() => {
    if (preTestBatchId) {
      fetchPreTestSubmission(studentId, preTestBatchId)
    }
    if (postTestBatchId) {
      fetchPostTestSubmission(studentId, postTestBatchId)
    }

    return () => {
      const { preTestUnsubscribe, postTestUnsubscribe } = useSubmissionStore.getState()
      if (preTestUnsubscribe) preTestUnsubscribe()
      if (postTestUnsubscribe) postTestUnsubscribe()
    }
  }, [studentId, preTestBatchId, postTestBatchId, fetchPreTestSubmission, fetchPostTestSubmission])

  const submissions = selectedTestType === 'preTest' ? preTestSubmissions ?? [] : postTestSubmissions ?? []

  const { totalCorrect, totalQuestions, totalScorePercent, totalScoreLevel } = (() => {
    const answers = submissions.flatMap((s) => s.answers ?? [])
    const correct = answers.filter((a) => a?.isCorrect).length
    const total = answers.length || 1
    const percent = Math.round((correct / total) * 100)
    return {
      totalCorrect: correct,
      totalQuestions: answers.length,
      totalScorePercent: percent,
      totalScoreLevel: getScoreLevel(percent),
    }
  })()

  const getMaterial = (materialId: string): Material | undefined => {
    return allMaterials.find((m) => m.id === materialId)
  }

  return (
    <div className="max-w-7xl mx-auto">
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-4 sm:mb-6 transition-colors"
      >
        <ArrowLeft className="w-5 h-5" />
        <span className="font-medium">Back to Students</span>
      </button>

      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-4 sm:p-6 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-start gap-4 sm:gap-6">
          <UserCircle className="w-16 h-16 sm:w-20 sm:h-20 text-blue-600 flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-2">
              {student?.name || 'Unknown Student'}
            </h1>
            <div className="flex items-center gap-2 text-slate-600 mb-4">
              <Mail className="w-4 h-4 flex-shrink-0" />
              <span className="text-sm sm:text-base truncate">
                {student?.email}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-slate-200">
        <div className="p-4 sm:p-6 border-b border-slate-200">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-1">
                Submission History
              </h2>
              <p className="text-sm text-slate-600">
                All materials submitted by this student
              </p>
            </div>
            <Button
              onClick={() => exportAllSubmissions(studentId)}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
            >
              <Download className="w-4 h-4" />
              Export as PDF
            </Button>
          </div>
        </div>

        <div className="p-4 sm:p-6">
          {/* Pre-test / Post-test toggle */}
          <div className="flex justify-center mb-6">
            <div className="inline-flex bg-slate-100 rounded-lg p-1 shadow-sm border border-slate-200 gap-2">
              <Button
                onClick={() => setSelectedTestType('preTest')}
                className={`px-6 py-2 rounded-md font-medium transition-all ${
                  selectedTestType === 'preTest'
                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                    : 'bg-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                Pre-Test
              </Button>
              <Button
                onClick={() => setSelectedTestType('postTest')}
                className={`px-6 py-2 rounded-md font-medium transition-all ${
                  selectedTestType === 'postTest'
                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                    : 'bg-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                Post-Test
              </Button>
            </div>
          </div>

          {/* Score summary */}
          {submissions.length > 0 && (
            <div className="bg-slate-50 rounded-lg border border-slate-200 p-4 mb-6">
              <div className="flex flex-wrap items-center justify-between gap-4 mb-2">
                <h3 className="text-sm font-semibold text-slate-700">Total Score</h3>
                <span className="text-sm text-slate-600">
                  {totalCorrect} / {totalQuestions} correct
                </span>
              </div>
              <div className="flex flex-wrap items-center justify-between gap-4 mb-2">
                <h3 className="text-sm font-semibold text-slate-700">Percentage</h3>
                <span className="text-sm text-slate-600">{totalScorePercent}%</span>
              </div>
              <div className="flex flex-wrap items-center justify-between gap-4">
                <h3 className="text-sm font-semibold text-slate-700">Level</h3>
                <span
                  className={`px-3 py-1.5 rounded-lg border text-xs font-semibold ${totalScoreLevel.bgColor} ${totalScoreLevel.borderColor} ${totalScoreLevel.color}`}
                >
                  {totalScoreLevel.level}
                </span>
              </div>
            </div>
          )}

          {submissions.length > 0 ? (
            <div className="space-y-4">
              {submissions.map((submission, idx) => {
                const material = getMaterial(submission.materialId ?? '')
                const answers = submission.answers ?? []
                const totalAnswers = answers.length || 1
                const numberOfCorrectAnswers = answers.filter((a) => a?.isCorrect).length
                const percentage = Math.round((numberOfCorrectAnswers / totalAnswers) * 100)
                const isExpanded = expandedCard === (submission.id ?? null)
                const submittedDate = getSubmittedAtDate(submission.submittedAt)

                return (
                  <div
                    className="border border-slate-200 rounded-lg p-4 sm:p-6 hover:border-blue-300 hover:bg-slate-50 transition-all"
                    key={submission.id ?? idx}
                  >
                    <div className="flex flex-col lg:flex-row lg:items-start gap-4 lg:gap-6">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start gap-3 mb-4">
                          <BookOpen className="w-5 h-5 text-blue-600 flex-shrink-0 mt-1" />
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-lg text-slate-900 mb-1">
                              {material?.title || 'Unknown Material'}
                            </h3>
                            <div className="flex items-center gap-2 text-sm text-slate-500">
                              <Calendar className="w-4 h-4" />
                              {submittedDate
                                ? submittedDate.toLocaleDateString('en-US', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric',
                                  })
                                : '—'}
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-4">
                          <div className="bg-slate-50 rounded-lg p-3">
                            <div className="flex items-center gap-2 text-slate-600 mb-1">
                              <Trophy className="w-4 h-4" />
                              <span className="text-xs font-medium">Score</span>
                            </div>
                            <p className="text-lg font-bold text-slate-900">
                              {numberOfCorrectAnswers}/{answers.length}
                            </p>
                          </div>

                          <div className="bg-slate-50 rounded-lg p-3">
                            <div className="flex items-center gap-2 text-slate-600 mb-1">
                              <Percent className="w-4 h-4" />
                              <span className="text-xs font-medium">Percentage</span>
                            </div>
                            <p className="text-lg font-bold text-slate-900">
                              {percentage}%
                            </p>
                          </div>

                          <div className="bg-slate-50 rounded-lg p-3">
                            <div className="flex items-center gap-2 text-slate-600 mb-1">
                              <Clock className="w-4 h-4" />
                              <span className="text-xs font-medium">Duration</span>
                            </div>
                            <p className="text-lg font-bold text-slate-900">
                              {formatDuration(Number(submission.duration) || 0)}
                            </p>
                          </div>

                          <div className="bg-slate-50 rounded-lg p-3">
                            <div className="flex items-center gap-2 text-slate-600 mb-1">
                              <FileText className="w-4 h-4" />
                              <span className="text-xs font-medium">Words</span>
                            </div>
                            <p className="text-lg font-bold text-slate-900">
                              {submission.numberOfWords ?? 0}
                            </p>
                          </div>

                          <div className="bg-slate-50 rounded-lg p-3">
                            <div className="flex items-center gap-2 text-slate-600 mb-1">
                              <AlertCircle className="w-4 h-4" />
                              <span className="text-xs font-medium">Miscues</span>
                            </div>
                            <p className="text-lg font-bold text-slate-900">
                              {submission.miscues
                                ? Array.isArray(submission.miscues)
                                  ? submission.miscues.length
                                  : 0
                                : 0}
                            </p>
                          </div>
                        </div>

                        {submission.miscues && Array.isArray(submission.miscues) && submission.miscues.length > 0 && (
                          <div className="bg-slate-50 rounded-lg p-3 mb-4">
                            <div className="flex items-center gap-2 text-slate-700 mb-2">
                              <AlertCircle className="w-4 h-4 text-slate-500" />
                              <span className="text-sm font-medium">Miscue Details:</span>
                            </div>
                            <p className="text-sm text-slate-600 break-words">
                              {submission.miscues.join(', ')}
                            </p>
                          </div>
                        )}

                        {/* Expandable answer details */}
                        <button
                          onClick={() => setExpandedCard(isExpanded ? null : submission.id || null)}
                          className="w-full flex items-center justify-between p-3 bg-slate-50 hover:bg-slate-100 rounded-lg border border-slate-200 transition-all duration-200"
                        >
                          <span className="text-sm font-semibold text-slate-700">
                            {isExpanded ? 'Hide' : 'Show'} Answer Details
                          </span>
                          {isExpanded ? (
                            <ChevronUp className="w-4 h-4 text-slate-600" />
                          ) : (
                            <ChevronDown className="w-4 h-4 text-slate-600" />
                          )}
                        </button>

                        {isExpanded && material && (
                          <div className="mt-4 space-y-3">
                            {(material.questions ?? []).map((question, index) => {
                              const studentAnswer = answers[index]
                              const isCorrect = studentAnswer?.isCorrect || false

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
                                    <p className="flex-1 text-sm font-medium text-slate-800">
                                      {question?.title ?? ''}
                                    </p>
                                  </div>
                                  <div className="ml-8 space-y-2 text-sm">
                                    <div className="flex flex-wrap items-center gap-2">
                                      <span className="text-xs font-medium text-slate-600">
                                        Student&apos;s answer:
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
                                        <span className="text-xs font-medium text-slate-600">
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
                            })}
                          </div>
                        )}

                        {isExpanded && !material && (
                          <div className="mt-4 p-4 bg-slate-50 rounded-lg text-sm text-slate-500">
                            Material details not available for this submission.
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 px-4">
              <FileText className="w-16 h-16 text-slate-300 mb-4" />
              <p className="text-slate-600 text-lg font-medium mb-1">
                No {selectedTestType === 'preTest' ? 'pre-test' : 'post-test'} submissions yet
              </p>
              <p className="text-slate-500 text-sm text-center">
                This student hasn&apos;t submitted any {selectedTestType === 'preTest' ? 'pre-test' : 'post-test'} materials
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default AdminStudentPage
