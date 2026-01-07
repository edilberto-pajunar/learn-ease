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
  const { submissions, fetchSubmissions } = useSubmissionStore()
  const { materials, fetchMaterials } = useReadStore()
  const { quarter } = useAdminStore()
  const router = useRouter()

  // State for toggling between pre-test and post-test views
  const [selectedTestType, setSelectedTestType] = useState<
    'pre_test' | 'post_test'
  >('pre_test')

  const studentId = user?.id

  // Simulate fetching submissions
  useEffect(() => {
    if (!studentId) return
    fetchSubmissions(studentId)
  }, [studentId, fetchSubmissions])

  useEffect(() => {
    fetchMaterials(quarter)
  })

  // Separate submissions by test type
  const preTestSubmissions = submissions.filter(
    (sub) => sub.testType === 'pre_test',
  )
  const postTestSubmissions = submissions.filter(
    (sub) => sub.testType === 'post_test',
  )

  // Group submissions by materialBatch
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
      // averageScore: calculateAverageScore(subs),
    }))
  }

  const preTestBatches = groupSubmissionsByBatch(preTestSubmissions)
  const postTestBatches = groupSubmissionsByBatch(postTestSubmissions)

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
            Reading Assessment Results
          </h1>
          <p className="text-gray-600">
            Review your reading performance and track your progress
          </p>
        </div>

        {submissions.length === 0 ? (
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
                Complete some reading assessments to see your results here.
              </p>
              <Button
                onClick={() => router.push('/student/mode')}
                className="bg-gray-900 hover:bg-gray-800"
              >
                Start Reading
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            <div className="flex justify-center">
              <div className="inline-flex bg-white rounded-lg p-1 shadow-sm border">
                <Button
                  onClick={() => setSelectedTestType('pre_test')}
                  className={`px-6 py-2 rounded-md font-medium transition-all ${
                    selectedTestType === 'pre_test'
                      ? 'bg-gray-900 text-white'
                      : 'bg-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  Pre-test
                </Button>
                <Button
                  onClick={() => setSelectedTestType('post_test')}
                  className={`px-6 py-2 rounded-md font-medium transition-all ${
                    selectedTestType === 'post_test'
                      ? 'bg-gray-900 text-white'
                      : 'bg-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  Post-test
                </Button>
              </div>
            </div>

            <div>
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-gray-900">
                  {selectedTestType === 'pre_test'
                    ? 'Pre-test Results'
                    : 'Post-test Results'}
                </h2>
              </div>

              {selectedTestType === 'pre_test' ? (
                preTestBatches.length === 0 ? (
                  <Card className="border shadow-sm bg-white">
                    <CardContent className="p-8 text-center">
                      <p className="text-gray-600">
                        No pre-test submissions found.
                      </p>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="space-y-6">
                    {preTestBatches.map((batchGroup) => (
                      <div key={batchGroup.batch}>
                        {batchGroup.batch !== 'no-batch' && (
                          <div className="flex items-center gap-2 mb-3">
                            <h3 className="text-sm font-medium text-gray-700">
                              Batch {batchGroup.batch}
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
                )
              ) : postTestBatches.length === 0 ? (
                <Card className="border shadow-sm bg-white">
                  <CardContent className="p-8 text-center">
                    <p className="text-gray-600">
                      No post-test submissions found.
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-6">
                  {postTestBatches.map((batchGroup) => (
                    <div key={batchGroup.batch}>
                      {batchGroup.batch !== 'no-batch' && (
                        <div className="flex items-center gap-2 mb-3">
                          <h3 className="text-sm font-medium text-gray-700">
                            Batch {batchGroup.batch}
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
          </div>
        )}
      </div>
    </div>
  )
}

export default ScorePage
