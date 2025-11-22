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

  // // Calculate average scores
  // const calculateAverageScore = (submissions: Submission[]) => {
  //   if (submissions.length === 0) return 0

  //   // Calculate total score and total questions across all submissions
  //   const totals = submissions.reduce(
  //     (acc, sub) => {
  //       // Ensure we have valid numbers, default to 0 if undefined/null
  //       const score = typeof sub.score === 'number' ? sub.score : 0
  //       const totalQuestions =
  //         typeof sub.totalQuestions === 'number' ? sub.totalQuestions : 1

  //       return {
  //         totalScore: acc.totalScore + score,
  //         totalQuestions: acc.totalQuestions + totalQuestions,
  //       }
  //     },
  //     { totalScore: 0, totalQuestions: 0 },
  //   )

  //   // Prevent division by zero and ensure valid calculation
  //   if (totals.totalQuestions === 0) return 0

  //   // Calculate overall average percentage
  //   const average = (totals.totalScore / totals.totalQuestions) * 100
  //   return Math.round(average)
  // }

  // Debug: Log the submissions to see the actual data structure
  // console.log('Pre-test submissions:', preTestSubmissions)
  // console.log('Post-test submissions:', postTestSubmissions)

  // const preTestAverage = calculateAverageScore(preTestSubmissions)
  // const postTestAverage = calculateAverageScore(postTestSubmissions)

  // Debug: Log the calculated averages
  // console.log('Pre-test average:', preTestAverage)
  // console.log('Post-test average:', postTestAverage)

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
              Reading Assessment Results
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Review your reading performance and track your progress across all
              materials
            </p>
          </div>

          {submissions.length === 0 ? (
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
                  No Results Yet
                </h3>
                <p className="text-muted-foreground mb-6">
                  Complete some reading assessments to see your results here.
                </p>
                <Button
                  onClick={() => router.push('/student/mode')}
                  className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700"
                >
                  Start Reading
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-8">
              {/* Toggle Button */}
              <div className="flex justify-center mb-8">
                <div className="gap-4 inline-flex bg-white/80 backdrop-blur-sm rounded-2xl p-2 shadow-lg border border-gray-200">
                  <Button
                    onClick={() => setSelectedTestType('pre_test')}
                    className={`px-8 py-3 rounded-xl font-semibold transition-all duration-300 ${
                      selectedTestType === 'pre_test'
                        ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-500/25'
                        : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50 opacity-50'
                    }`}
                  >
                    Pre-test Results
                  </Button>
                  <Button
                    onClick={() => setSelectedTestType('post_test')}
                    className={`px-8 py-3 rounded-xl font-semibold transition-all duration-300 ${
                      selectedTestType === 'post_test'
                        ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg shadow-green-500/25'
                        : 'text-gray-600 hover:text-green-600 hover:bg-green-50 opacity-50'
                    }`}
                  >
                    Post-test Results
                  </Button>
                </div>
              </div>

              {/* Selected Test Type Section */}
              <div>
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-8">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-3 h-3 rounded-full ${selectedTestType === 'pre_test' ? 'bg-blue-500' : 'bg-green-500'}`}
                    ></div>
                    <h2 className="text-2xl font-bold text-foreground">
                      {selectedTestType === 'pre_test'
                        ? 'Pre-test Results'
                        : 'Post-test Results'}
                    </h2>
                  </div>
                  {/* {selectedTestType === 'pre_test' &&
                    preTestSubmissions.length > 0 && (
                      <Card className="border-0 shadow-lg bg-gradient-to-r from-blue-500 to-indigo-600">
                        <CardContent className="p-4 text-center">
                          <p className="text-sm text-blue-100">Average Score</p>
                          <p className="text-2xl font-bold text-white">
                            {preTestAverage}%
                          </p>
                        </CardContent>
                      </Card>
                    )}
                  {selectedTestType === 'post_test' &&
                    postTestSubmissions.length > 0 && (
                      <Card className="border-0 shadow-lg bg-gradient-to-r from-green-500 to-emerald-600">
                        <CardContent className="p-4 text-center">
                          <p className="text-sm text-green-100">
                            Average Score
                          </p>
                          <p className="text-2xl font-bold text-white">
                            {postTestAverage}%
                          </p>
                        </CardContent>
                      </Card>
                    )} */}
                </div>

                {selectedTestType === 'pre_test' ? (
                  preTestBatches.length === 0 ? (
                    <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                      <CardContent className="p-8 text-center">
                        <p className="text-muted-foreground">
                          No pre-test submissions found.
                        </p>
                      </CardContent>
                    </Card>
                  ) : (
                    <div className="space-y-8">
                      {preTestBatches.map((batchGroup) => (
                        <div key={batchGroup.batch}>
                          {batchGroup.batch !== 'no-batch' && (
                            <div className="flex items-center gap-3 mb-4">
                              <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                              <h3 className="text-lg font-semibold text-foreground">
                                Batch: {batchGroup.batch}
                              </h3>
                              <div className="text-sm text-muted-foreground">
                                ({batchGroup.submissions.length} materials)
                              </div>
                            </div>
                          )}
                          <div className="grid gap-6">
                            {batchGroup.submissions.map(renderSubmissionCard)}
                          </div>
                        </div>
                      ))}
                    </div>
                  )
                ) : postTestBatches.length === 0 ? (
                  <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                    <CardContent className="p-8 text-center">
                      <p className="text-muted-foreground">
                        No post-test submissions found.
                      </p>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="space-y-8">
                    {postTestBatches.map((batchGroup) => (
                      <div key={batchGroup.batch}>
                        {batchGroup.batch !== 'no-batch' && (
                          <div className="flex items-center gap-3 mb-4">
                            <div className="w-3 h-3 rounded-full bg-green-500"></div>
                            <h3 className="text-lg font-semibold text-foreground">
                              Batch: {batchGroup.batch}
                            </h3>
                            <div className="text-sm text-muted-foreground">
                              ({batchGroup.submissions.length} materials)
                            </div>
                          </div>
                        )}
                        <div className="grid gap-6">
                          {batchGroup.submissions.map(renderSubmissionCard)}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Overall Progress Summary - Only show if both test types have data */}
              {submissions.length > 0 &&
                preTestSubmissions.length > 0 &&
                postTestSubmissions.length > 0 && (
                  <Card className="border-0 shadow-xl bg-gradient-to-br from-white to-blue-50/30">
                    <CardContent className="p-8">
                      <div className="text-center mb-8">
                        <h2 className="text-2xl font-bold text-foreground mb-2">
                          Overall Progress Summary
                        </h2>
                        <p className="text-muted-foreground">
                          Track your improvement from pre-test to post-test
                        </p>
                      </div>

                      {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="text-center p-6 bg-blue-50 rounded-xl border border-blue-200">
                          <div className="text-3xl font-bold text-blue-600 mb-2">
                            {preTestAverage}%
                          </div>
                          <div className="text-sm text-blue-600 font-medium">
                            Pre-test Average
                          </div>
                        </div>
                        <div className="text-center p-6 bg-green-50 rounded-xl border border-green-200">
                          <div className="text-3xl font-bold text-green-600 mb-2">
                            {postTestAverage}%
                          </div>
                          <div className="text-sm text-green-600 font-medium">
                            Post-test Average
                          </div>
                        </div>
                        <div className="text-center p-6 bg-purple-50 rounded-xl border border-purple-200">
                          <div
                            className={`text-3xl font-bold mb-2 ${postTestAverage > preTestAverage ? 'text-green-600' : 'text-red-600'}`}
                          >
                            {postTestAverage - preTestAverage}%
                          </div>
                          <div className="text-sm text-purple-600 font-medium">
                            {postTestAverage > preTestAverage
                              ? 'Improvement ↑'
                              : 'Change ↓'}
                          </div>
                        </div>
                      </div> */}
                    </CardContent>
                  </Card>
                )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ScorePage
