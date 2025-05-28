'use client'

import { useAuthStore } from '@/hooks/useAuthStore'
import { useSubmissionStore } from '@/hooks/useSubmissionStore'
import { Submission } from '@/interface/submission'
import { useEffect } from 'react'

// Helper function to calculate reading level based on Phil-IRI formula
const calculateReadingLevel = (duration: number, numberOfWords: number) => {
  const wordsPerMinute = (numberOfWords / duration) * 60

  if (wordsPerMinute >= 90) {
    return { level: 'Independent', color: 'text-green-600' }
  } else if (wordsPerMinute >= 60) {
    return { level: 'Instructional', color: 'text-yellow-600' }
  } else {
    return { level: 'Frustration', color: 'text-red-600' }
  }
}

// 📊 Score Page for Multiple Materials
const ScorePage = () => {
  const { user } = useAuthStore()
  const { submissions, fetchSubmissions } = useSubmissionStore()

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
      (acc, sub) => ({
        totalScore: acc.totalScore + sub.score,
        totalQuestions: acc.totalQuestions + sub.totalQuestions,
      }),
      { totalScore: 0, totalQuestions: 0 },
    )

    // Calculate overall average percentage
    return Math.round((totals.totalScore / totals.totalQuestions) * 100)
  }

  const preTestAverage = calculateAverageScore(preTestSubmissions)
  const postTestAverage = calculateAverageScore(postTestSubmissions)

  const renderSubmissionCard = (submission: any) => {
    const readingLevel = calculateReadingLevel(
      submission.duration,
      submission.numberOfWords,
    )

    return (
      <div key={submission.id} className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h2 className="text-lg font-semibold">
              Material {submission.materialId}
            </h2>
            <p className="text-sm text-gray-500">
              Submitted on{' '}
              {submission.submittedAt.toDate().toLocaleDateString()}
            </p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-blue-600">
              {submission.score}%
            </p>
            <p className={`text-sm font-medium ${readingLevel.color}`}>
              {readingLevel.level} Level
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-gray-600">Reading Duration</p>
            <p className="font-medium">
              {Math.round(submission.duration)} seconds
            </p>
          </div>
          <div>
            <p className="text-gray-600">Words Read</p>
            <p className="font-medium">{submission.numberOfWords}</p>
          </div>
          <div>
            <p className="text-gray-600">Words per Minute</p>
            <p className="font-medium">
              {Math.round(
                (submission.numberOfWords / submission.duration) * 60,
              )}
            </p>
          </div>
          <div>
            <p className="text-gray-600">Miscues</p>
            {/* <p className="font-medium">{submission.miscues.length}</p> */}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-gray-50 min-h-screen py-10">
      <div className="max-w-6xl mx-auto px-6">
        <h1 className="text-2xl font-bold mb-6">Reading Scores</h1>

        {submissions.length === 0 ? (
          <p className="text-gray-500">No submissions found.</p>
        ) : (
          <div className="space-y-8">
            {/* Pre-test Section */}
            <div>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-blue-600">
                  Pre-test Results
                </h2>
                {preTestSubmissions.length > 0 && (
                  <div className="bg-blue-50 px-4 py-2 rounded-lg">
                    <p className="text-sm text-blue-600">Average Score</p>
                    <p className="text-xl font-bold text-blue-700">
                      {preTestAverage}%
                    </p>
                  </div>
                )}
              </div>
              {preTestSubmissions.length === 0 ? (
                <p className="text-gray-500">No pre-test submissions found.</p>
              ) : (
                <div className="grid gap-6">
                  {preTestSubmissions.map(renderSubmissionCard)}
                </div>
              )}
            </div>

            {/* Post-test Section */}
            <div>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-green-600">
                  Post-test Results
                </h2>
                {postTestSubmissions.length > 0 && (
                  <div className="bg-green-50 px-4 py-2 rounded-lg">
                    <p className="text-sm text-green-600">Average Score</p>
                    <p className="text-xl font-bold text-green-700">
                      {postTestAverage}%
                    </p>
                  </div>
                )}
              </div>
              {postTestSubmissions.length === 0 ? (
                <p className="text-gray-500">No post-test submissions found.</p>
              ) : (
                <div className="grid gap-6">
                  {postTestSubmissions.map(renderSubmissionCard)}
                </div>
              )}
            </div>

            {/* Overall Progress */}
            {submissions.length > 0 && (
              <div className="mt-8 p-6 bg-white rounded-lg shadow-md">
                <h2 className="text-xl font-semibold mb-4">Overall Progress</h2>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <p className="text-sm text-gray-600">Pre-test Average</p>
                    <p className="text-2xl font-bold text-blue-600">
                      {preTestAverage}%
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Post-test Average</p>
                    <p className="text-2xl font-bold text-green-600">
                      {postTestAverage}%
                    </p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-sm text-gray-600">Improvement</p>
                    <p
                      className={`text-2xl font-bold ${postTestAverage > preTestAverage ? 'text-green-600' : 'text-red-600'}`}
                    >
                      {postTestAverage - preTestAverage}%
                      {postTestAverage > preTestAverage ? ' ↑' : ' ↓'}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default ScorePage
