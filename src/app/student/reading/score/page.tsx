'use client'

import { useAuthStore } from '@/hooks/useAuthStore'
import { useSubmissionStore } from '@/hooks/useSubmissionStore'
import { useReadStore } from '@/hooks/useReadStore'
import { Submission } from '@/interface/submission'
import { useEffect, useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import SubmissionCard from './component/SubmissionCard'
import { useAdminStore } from '@/hooks/useAdminStore'
import { Material } from '@/interface/material'
import { useRouter } from 'next/navigation'

// 📊 Score Page for Multiple Materials
const ScorePage = () => {
  const { user } = useAuthStore()
  const { preTestSubmissions, postTestSubmissions, fetchPreTestSubmission, fetchPostTestSubmission } = useSubmissionStore()
  const { materials, fetchMaterials } = useReadStore()
  const { quarter } = useAdminStore()
  const router = useRouter()

  const studentId = user?.id
  const preTestMaterialBatchId = user?.preTestMaterialBatchId ?? ''
  const postTestMaterialBatchId = user?.postTestMaterialBatchId ?? ''
  const [selectedTestType, setSelectedTestType] = useState<'preTest' | 'postTest'>('preTest')

  useEffect(() => {
    if (!studentId) return
    if (preTestMaterialBatchId) {
      fetchPreTestSubmission(studentId, preTestMaterialBatchId)
    }
    if (postTestMaterialBatchId) {
      fetchPostTestSubmission(studentId, postTestMaterialBatchId)
    }
  }, [studentId, fetchPreTestSubmission, fetchPostTestSubmission, preTestMaterialBatchId, postTestMaterialBatchId])

  useEffect(() => {
    if (quarter?.quarter) {
      fetchMaterials(quarter.quarter)
    }
  }, [quarter?.quarter, fetchMaterials])

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
      submissions: subs,
    }))
  }

  const submissions =
    selectedTestType === 'preTest' ? (preTestSubmissions ?? []) : (postTestSubmissions ?? [])
  const hasAnySubmissions =
    (preTestSubmissions?.length ?? 0) > 0 || (postTestSubmissions?.length ?? 0) > 0

  const { totalCorrect, totalQuestions, totalScorePercent } = (() => {
    const answers = submissions.flatMap((s) => s.answers ?? [])
    const correct = answers.filter((a) => a?.isCorrect).length
    const total = answers.length || 1
    return {
      totalCorrect: correct,
      totalQuestions: total,
      totalScorePercent: Math.round((correct / total) * 100),
    }
  })()

  const testBatches = groupSubmissionsByBatch(submissions)

  // Get material details by ID
  const getMaterialDetails = (materialId: string): Material | undefined => {
    return materials.find((material) => material.id === materialId)
  }

  const renderSubmissionCard = (submission: Submission) => {
    const material: Material | undefined = getMaterialDetails(
      submission.materialId,
    )
    if (!material) return null

    return (
      <SubmissionCard
        key={submission.id}
        submission={submission}
        material={material}
      />
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Assessment Results
          </h1>
          <p className="text-gray-600">
            Review your test performance and track your progress
          </p>
        </div>

        {!hasAnySubmissions ? (
          <Card className="border shadow-sm bg-white">
            <CardContent className="p-12 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-xl mb-4">
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
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No Results Yet
              </h3>
              <p className="text-gray-600 mb-6">
                Complete an assessment to see your results here.
              </p>
              <Button
                onClick={() => router.push('/student/mode')}
                className="bg-gray-900 hover:bg-gray-800"
              >
                Start Assessment
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            <div className="flex justify-center">
              <div className="inline-flex bg-white rounded-lg p-1 shadow-sm border">
                <Button
                  onClick={() => setSelectedTestType('preTest')}
                  className={`px-6 py-2 rounded-md font-medium transition-all ${selectedTestType === 'preTest'
                    ? 'bg-gray-900 text-white'
                    : 'bg-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    }`}
                >
                  Pre-Test
                </Button>
                <Button
                  onClick={() => setSelectedTestType('postTest')}
                  className={`px-6 py-2 rounded-md font-medium transition-all ${selectedTestType === 'postTest'
                    ? 'bg-gray-900 text-white'
                    : 'bg-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    }`}
                >
                  Post-Test
                </Button>
              </div>
            </div>

            {submissions.length === 0 ? (
              <Card className="border shadow-sm bg-white">
                <CardContent className="p-8 text-center">
                  <p className="text-gray-600">
                    No {selectedTestType === 'preTest' ? 'pre-test' : 'post-test'} submissions found.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-6">
                <Card className="border shadow-sm bg-white">
                  <CardContent className="p-4">
                    <div className="flex flex-wrap items-center justify-between gap-4">
                      <h3 className="text-sm font-medium text-gray-700">
                        Total score ({selectedTestType === 'preTest' ? 'Pre-Test' : 'Post-Test'})
                      </h3>
                      <div className="flex items-center gap-6">
                        <span className="text-2xl font-bold text-gray-900">
                          {totalScorePercent}%
                        </span>
                        <span className="text-sm text-gray-600">
                          {totalCorrect} / {totalQuestions} correct
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {testBatches.map((batchGroup) => (
                  <div key={batchGroup.batch}>
                    {batchGroup.batch !== 'no-batch' && (
                      <div className="flex items-center gap-2 mb-3">
                        <h3 className="text-sm font-medium text-gray-700">
                          Assessment Batch
                        </h3>
                        <span className="text-xs text-gray-500">
                          ({batchGroup.submissions.length}{' '}
                          {batchGroup.submissions.length === 1
                            ? 'material'
                            : 'materials'}
                          )
                        </span>
                      </div>
                    )}
                    <div className="grid gap-4">
                      {batchGroup.submissions.map(renderSubmissionCard)}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default ScorePage
