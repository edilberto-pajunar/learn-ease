'use client'

import { useAuthStore } from '@/hooks/useAuthStore'
import { useSubmissionStore } from '@/hooks/useSubmissionStore'
import { useReadStore } from '@/hooks/useReadStore'
import { Submission } from '@/interface/submission'
import { useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

// Helper function to calculate reading level based on questionnaire performance
const calculateReadingLevel = (score: number, totalQuestions: number) => {
  const percentage = (score / totalQuestions) * 100

  if (percentage >= 80) {
    return {
      level: 'Independent',
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
    }
  } else if (percentage >= 60) {
    return {
      level: 'Instructional',
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
      borderColor: 'border-yellow-200',
    }
  } else {
    return {
      level: 'Frustration',
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
    }
  }
}

// 📊 Score Page for Multiple Materials
const ScorePage = () => {
  const { user } = useAuthStore()
  const { submissions, fetchSubmissions } = useSubmissionStore()
  const { materials } = useReadStore()

  const studentId = user?.id

  // Simulate fetching submissions
  useEffect(() => {
    if (!studentId) return
    fetchSubmissions(studentId)
  }, [studentId])

  // Separate submissions by test type
  const preTestSubmissions = submissions.filter(
    (sub) => sub.testType === 'pre_test',
  )
  const postTestSubmissions = submissions.filter(
    (sub) => sub.testType === 'post_test',
  )

  // Calculate average scores
  const calculateAverageScore = (submissions: Submission[]) => {
    if (submissions.length === 0) return 0

    // Calculate total score and total questions across all submissions
    const totals = submissions.reduce(
      (acc, sub) => {
        // Ensure we have valid numbers, default to 0 if undefined/null
        const score = typeof sub.score === 'number' ? sub.score : 0
        const totalQuestions =
          typeof sub.totalQuestions === 'number' ? sub.totalQuestions : 1

        return {
          totalScore: acc.totalScore + score,
          totalQuestions: acc.totalQuestions + totalQuestions,
        }
      },
      { totalScore: 0, totalQuestions: 0 },
    )

    // Prevent division by zero and ensure valid calculation
    if (totals.totalQuestions === 0) return 0

    // Calculate overall average percentage
    const average = (totals.totalScore / totals.totalQuestions) * 100
    return Math.round(average)
  }

  // Debug: Log the submissions to see the actual data structure
  console.log('Pre-test submissions:', preTestSubmissions)
  console.log('Post-test submissions:', postTestSubmissions)

  const preTestAverage = calculateAverageScore(preTestSubmissions)
  const postTestAverage = calculateAverageScore(postTestSubmissions)

  // Debug: Log the calculated averages
  console.log('Pre-test average:', preTestAverage)
  console.log('Post-test average:', postTestAverage)

  // Get material details by ID
  const getMaterialDetails = (materialId: string) => {
    return materials.find((material) => material.id === materialId)
  }

  const renderSubmissionCard = (submission: any) => {
    const readingLevel = calculateReadingLevel(
      submission.score,
      submission.totalQuestions,
    )

    const material = getMaterialDetails(submission.materialId)
    const materialTitle = material?.title || `Material ${submission.materialId}`
    const materialText = material?.text || 'No content available'

    return (
      <Card
        key={submission.id}
        className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-white to-gray-50/50"
      >
        <CardContent className="p-6">
          {/* Header Section */}
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 mb-6">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <div className="inline-flex items-center justify-center w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-lg shadow-blue-500/25">
                  <svg
                    className="w-5 h-5 text-white"
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
                  <h2 className="text-xl font-bold text-foreground">
                    {materialTitle}
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    Submitted on{' '}
                    {submission.submittedAt.toDate().toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>

            {/* Score and Level */}
            <div className="text-right">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl shadow-xl shadow-blue-500/25 mb-2">
                <span className="text-2xl font-bold text-white">
                  {submission.score}%
                </span>
              </div>
              <div
                className={`inline-flex items-center px-3 py-1 rounded-full ${readingLevel.bgColor} ${readingLevel.borderColor} border`}
              >
                <span className={`text-sm font-semibold ${readingLevel.color}`}>
                  {readingLevel.level} Level
                </span>
              </div>
            </div>
          </div>

          {/* Material Preview */}
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-muted-foreground mb-2 uppercase tracking-wide">
              Reading Content
            </h3>
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <p className="text-sm text-gray-700 line-clamp-3 leading-relaxed">
                {materialText}
              </p>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-3 bg-blue-50 rounded-lg border border-blue-200">
              <div className="text-lg font-bold text-blue-600">
                {Math.round(submission.duration)}s
              </div>
              <div className="text-xs text-blue-600 font-medium">Duration</div>
            </div>
            <div className="text-center p-3 bg-green-50 rounded-lg border border-green-200">
              <div className="text-lg font-bold text-green-600">
                {submission.numberOfWords}
              </div>
              <div className="text-xs text-green-600 font-medium">Words</div>
            </div>
            <div className="text-center p-3 bg-purple-50 rounded-lg border border-purple-200">
              <div className="text-lg font-bold text-purple-600">
                {Math.round(
                  (submission.numberOfWords / submission.duration) * 60,
                )}
              </div>
              <div className="text-xs text-purple-600 font-medium">WPM</div>
            </div>
            <div className="text-center p-3 bg-orange-50 rounded-lg border border-orange-200">
              <div className="text-lg font-bold text-orange-600">
                {submission.miscues
                  ? Array.isArray(submission.miscues)
                    ? submission.miscues.length
                    : 0
                  : 0}
              </div>
              <div className="text-xs text-orange-600 font-medium">Miscues</div>
            </div>
          </div>
        </CardContent>
      </Card>
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
                <Button className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700">
                  Start Reading
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-12">
              {/* Pre-test Section */}
              <div>
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-8">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    <h2 className="text-2xl font-bold text-foreground">
                      Pre-test Results
                    </h2>
                  </div>
                  {preTestSubmissions.length > 0 && (
                    <Card className="border-0 shadow-lg bg-gradient-to-r from-blue-500 to-indigo-600">
                      <CardContent className="p-4 text-center">
                        <p className="text-sm text-blue-100">Average Score</p>
                        <p className="text-2xl font-bold text-white">
                          {preTestAverage}%
                        </p>
                      </CardContent>
                    </Card>
                  )}
                </div>

                {preTestSubmissions.length === 0 ? (
                  <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                    <CardContent className="p-8 text-center">
                      <p className="text-muted-foreground">
                        No pre-test submissions found.
                      </p>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="grid gap-6">
                    {preTestSubmissions.map(renderSubmissionCard)}
                  </div>
                )}
              </div>

              {/* Post-test Section */}
              <div>
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-8">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <h2 className="text-2xl font-bold text-foreground">
                      Post-test Results
                    </h2>
                  </div>
                  {postTestSubmissions.length > 0 && (
                    <Card className="border-0 shadow-lg bg-gradient-to-r from-green-500 to-emerald-600">
                      <CardContent className="p-4 text-center">
                        <p className="text-sm text-green-100">Average Score</p>
                        <p className="text-2xl font-bold text-white">
                          {postTestAverage}%
                        </p>
                      </CardContent>
                    </Card>
                  )}
                </div>

                {postTestSubmissions.length === 0 ? (
                  <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                    <CardContent className="p-8 text-center">
                      <p className="text-muted-foreground">
                        No post-test submissions found.
                      </p>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="grid gap-6">
                    {postTestSubmissions.map(renderSubmissionCard)}
                  </div>
                )}
              </div>

              {/* Overall Progress */}
              {submissions.length > 0 && (
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

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
                    </div>
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
