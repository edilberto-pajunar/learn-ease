'use client'

import React, { useEffect } from 'react'
import { useSubmissionStore } from '@/hooks/useSubmissionStore'
import { useAuthStore } from '@/hooks/useAuthStore'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useDashboardStore } from '@/hooks/useDashboardStore'
import { useRouter } from 'next/navigation'

function StudentProgressChart() {
  const { fetchSubmissions, submissions } = useSubmissionStore()
  const router = useRouter()
  const {
    preTestComprehensionScore,
    preTestVocabularyScore,
    preTestAccuracy,
    preTestWPM,
    preTestAverageScore,
    postTestComprehensionScore,
    postTestVocabularyScore,
    postTestAccuracy,
    postTestWPM,
    postTestAverageScore,
    setPreTestScore,
    setPostTestScore,
  } = useDashboardStore()
  const { user } = useAuthStore()

  useEffect(() => {
    if (user?.id) {
      fetchSubmissions(user.id)
    }
  }, [user?.id, fetchSubmissions])

  useEffect(() => {
    const preTestSubmissions = submissions.filter(
      (sub) => sub.testType === 'pre_test',
    )
    const postTestSubmissions = submissions.filter(
      (sub) => sub.testType === 'post_test',
    )
    setPreTestScore(preTestSubmissions)
    setPostTestScore(postTestSubmissions)
  }, [submissions, setPreTestScore, setPostTestScore])

  const preTestSubmissions = submissions.filter(
    (sub) => sub.testType === 'pre_test',
  )
  const postTestSubmissions = submissions.filter(
    (sub) => sub.testType === 'post_test',
  )

  const hasPreTest = preTestSubmissions.length > 0
  const hasPostTest = postTestSubmissions.length > 0

  const calculateImprovement = (preValue: number, postValue: number) => {
    if (!hasPostTest) return null
    return postValue - preValue
  }

  const comprehensionImprovement = calculateImprovement(
    preTestComprehensionScore,
    postTestComprehensionScore,
  )
  const vocabularyImprovement = calculateImprovement(
    preTestVocabularyScore,
    postTestVocabularyScore,
  )
  const accuracyImprovement = calculateImprovement(
    preTestAccuracy,
    postTestAccuracy,
  )
  const wpmImprovement = calculateImprovement(preTestWPM, postTestWPM)
  const averageScoreImprovement = calculateImprovement(
    preTestAverageScore,
    postTestAverageScore,
  )

  return (
    <div className="space-y-8">
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
          Learning Dashboard
        </h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Track your reading progress and performance across all materials
        </p>
      </div>

      {/* Overall Summary */}
      <Card className="border-0 shadow-xl bg-gradient-to-br from-white to-blue-50/30 mb-8">
        <CardContent className="p-8">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-foreground mb-2">
              Your Learning Progress
            </h2>
            <p className="text-muted-foreground">
              {hasPostTest
                ? 'See how much you have improved from pre-test to post-test'
                : 'Complete your post-test to see your improvement'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-blue-100">
              <CardContent className="p-6 text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-500 rounded-xl mb-4">
                  <svg
                    className="w-6 h-6 text-white"
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
                <div className="text-3xl font-bold text-blue-600 mb-2">
                  {preTestSubmissions.length}
                </div>
                <div className="text-sm text-blue-600 font-medium">
                  Pre-test Materials Completed
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-green-100">
              <CardContent className="p-6 text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-green-500 rounded-xl mb-4">
                  <svg
                    className="w-6 h-6 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <div className="text-3xl font-bold text-green-600 mb-2">
                  {postTestSubmissions.length}
                </div>
                <div className="text-sm text-green-600 font-medium">
                  Post-test Materials Completed
                </div>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>

      {/* Improvement Metrics */}
      <div className="space-y-6">
        {/* Average Score Improvement */}
        {/* <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
          <CardContent className="p-8"> */}
            {/* <div className="flex items-start gap-4 mb-6">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-lg">
                <svg
                  className="w-6 h-6 text-white"
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
              <div className="flex-1">
                <h3 className="text-xl font-bold text-foreground mb-2">
                  Overall Score Performance
                </h3>
                <p className="text-muted-foreground text-sm">
                  Your average score represents your overall performance across
                  all questions
                </p>
              </div>
            </div> */}
            {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-6 bg-blue-50 rounded-xl border-2 border-blue-200">
                <div className="text-4xl font-bold text-blue-600 mb-2">
                  {preTestAverageScore}%
                </div>
                <div className="text-sm text-blue-600 font-medium">
                  Pre-test
                </div>
              </div>
              <div className="text-center p-6 bg-green-50 rounded-xl border-2 border-green-200">
                <div className="text-4xl font-bold text-green-600 mb-2">
                  {postTestAverageScore}%
                </div>
                <div className="text-sm text-green-600 font-medium">
                  Post-test
                </div>
              </div>
              <div
                className={`text-center p-6 rounded-xl border-2 ${
                  averageScoreImprovement === null
                    ? 'bg-gray-50 border-gray-200'
                    : averageScoreImprovement > 0
                      ? 'bg-emerald-50 border-emerald-200'
                      : averageScoreImprovement < 0
                        ? 'bg-red-50 border-red-200'
                        : 'bg-amber-50 border-amber-200'
                }`}
              >
                <div
                  className={`text-4xl font-bold mb-2 ${
                    averageScoreImprovement === null
                      ? 'text-gray-500'
                      : averageScoreImprovement > 0
                        ? 'text-emerald-600'
                        : averageScoreImprovement < 0
                          ? 'text-red-600'
                          : 'text-amber-600'
                  }`}
                >
                  {averageScoreImprovement === null
                    ? 'N/A'
                    : `${averageScoreImprovement > 0 ? '+' : ''}${averageScoreImprovement.toFixed(1)}%`}
                </div>
                <div
                  className={`text-sm font-medium ${
                    averageScoreImprovement === null
                      ? 'text-gray-600'
                      : averageScoreImprovement > 0
                        ? 'text-emerald-600'
                        : averageScoreImprovement < 0
                          ? 'text-red-600'
                          : 'text-amber-600'
                  }`}
                >
                  {averageScoreImprovement === null
                    ? 'Complete post-test'
                    : averageScoreImprovement > 0
                      ? 'Improvement ↑'
                      : averageScoreImprovement < 0
                        ? 'Decreased ↓'
                        : 'No Change'}
                </div>
              </div>
            </div> */}
          {/* </CardContent>
        </Card> */}

        {/* Reading Speed Improvement */}
        <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
          <CardContent className="p-8">
            <div className="flex items-start gap-4 mb-6">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl shadow-lg">
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-foreground mb-2">
                  Reading Speed
                </h3>
                <p className="text-muted-foreground text-sm">
                  Words per minute (WPM) measures how fast you read. Higher
                  speed with good comprehension shows reading fluency
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-6 bg-blue-50 rounded-xl border-2 border-blue-200">
                <div className="text-4xl font-bold text-blue-600 mb-2">
                  {preTestWPM}
                </div>
                <div className="text-sm text-blue-600 font-medium">
                  Pre-test WPM
                </div>
              </div>
              <div className="text-center p-6 bg-green-50 rounded-xl border-2 border-green-200">
                <div className="text-4xl font-bold text-green-600 mb-2">
                  {postTestWPM}
                </div>
                <div className="text-sm text-green-600 font-medium">
                  Post-test WPM
                </div>
              </div>
              <div
                className={`text-center p-6 rounded-xl border-2 ${
                  wpmImprovement === null
                    ? 'bg-gray-50 border-gray-200'
                    : wpmImprovement > 0
                      ? 'bg-emerald-50 border-emerald-200'
                      : wpmImprovement < 0
                        ? 'bg-red-50 border-red-200'
                        : 'bg-amber-50 border-amber-200'
                }`}
              >
                <div
                  className={`text-4xl font-bold mb-2 ${
                    wpmImprovement === null
                      ? 'text-gray-500'
                      : wpmImprovement > 0
                        ? 'text-emerald-600'
                        : wpmImprovement < 0
                          ? 'text-red-600'
                          : 'text-amber-600'
                  }`}
                >
                  {wpmImprovement === null
                    ? 'N/A'
                    : `${wpmImprovement > 0 ? '+' : ''}${wpmImprovement.toFixed(0)}`}
                </div>
                <div
                  className={`text-sm font-medium ${
                    wpmImprovement === null
                      ? 'text-gray-600'
                      : wpmImprovement > 0
                        ? 'text-emerald-600'
                        : wpmImprovement < 0
                          ? 'text-red-600'
                          : 'text-amber-600'
                  }`}
                >
                  {wpmImprovement === null
                    ? 'Complete post-test'
                    : wpmImprovement > 0
                      ? 'Faster ↑'
                      : wpmImprovement < 0
                        ? 'Slower ↓'
                        : 'Same Speed'}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Comprehension Improvement */}
        <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
          <CardContent className="p-8">
            <div className="flex items-start gap-4 mb-6">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl shadow-lg">
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-foreground mb-2">
                  Reading Comprehension
                </h3>
                <p className="text-muted-foreground text-sm">
                  Comprehension score shows how well you understand what you
                  read. This is crucial for learning and academic success
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-6 bg-blue-50 rounded-xl border-2 border-blue-200">
                <div className="text-4xl font-bold text-blue-600 mb-2">
                  {preTestComprehensionScore}%
                </div>
                <div className="text-sm text-blue-600 font-medium">
                  Pre-test
                </div>
              </div>
              <div className="text-center p-6 bg-green-50 rounded-xl border-2 border-green-200">
                <div className="text-4xl font-bold text-green-600 mb-2">
                  {postTestComprehensionScore}%
                </div>
                <div className="text-sm text-green-600 font-medium">
                  Post-test
                </div>
              </div>
              <div
                className={`text-center p-6 rounded-xl border-2 ${
                  comprehensionImprovement === null
                    ? 'bg-gray-50 border-gray-200'
                    : comprehensionImprovement > 0
                      ? 'bg-emerald-50 border-emerald-200'
                      : comprehensionImprovement < 0
                        ? 'bg-red-50 border-red-200'
                        : 'bg-amber-50 border-amber-200'
                }`}
              >
                <div
                  className={`text-4xl font-bold mb-2 ${
                    comprehensionImprovement === null
                      ? 'text-gray-500'
                      : comprehensionImprovement > 0
                        ? 'text-emerald-600'
                        : comprehensionImprovement < 0
                          ? 'text-red-600'
                          : 'text-amber-600'
                  }`}
                >
                  {comprehensionImprovement === null
                    ? 'N/A'
                    : `${comprehensionImprovement > 0 ? '+' : ''}${comprehensionImprovement.toFixed(1)}%`}
                </div>
                <div
                  className={`text-sm font-medium ${
                    comprehensionImprovement === null
                      ? 'text-gray-600'
                      : comprehensionImprovement > 0
                        ? 'text-emerald-600'
                        : comprehensionImprovement < 0
                          ? 'text-red-600'
                          : 'text-amber-600'
                  }`}
                >
                  {comprehensionImprovement === null
                    ? 'Complete post-test'
                    : comprehensionImprovement > 0
                      ? 'Improved ↑'
                      : comprehensionImprovement < 0
                        ? 'Decreased ↓'
                        : 'No Change'}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Vocabulary Improvement */}
        <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
          <CardContent className="p-8">
            <div className="flex items-start gap-4 mb-6">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-xl shadow-lg">
                <svg
                  className="w-6 h-6 text-white"
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
              <div className="flex-1">
                <h3 className="text-xl font-bold text-foreground mb-2">
                  Vocabulary Knowledge
                </h3>
                <p className="text-muted-foreground text-sm">
                  Vocabulary score measures your understanding of word meanings.
                  A strong vocabulary enhances reading comprehension and
                  communication
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-6 bg-blue-50 rounded-xl border-2 border-blue-200">
                <div className="text-4xl font-bold text-blue-600 mb-2">
                  {preTestVocabularyScore}%
                </div>
                <div className="text-sm text-blue-600 font-medium">
                  Pre-test
                </div>
              </div>
              <div className="text-center p-6 bg-green-50 rounded-xl border-2 border-green-200">
                <div className="text-4xl font-bold text-green-600 mb-2">
                  {postTestVocabularyScore}%
                </div>
                <div className="text-sm text-green-600 font-medium">
                  Post-test
                </div>
              </div>
              <div
                className={`text-center p-6 rounded-xl border-2 ${
                  vocabularyImprovement === null
                    ? 'bg-gray-50 border-gray-200'
                    : vocabularyImprovement > 0
                      ? 'bg-emerald-50 border-emerald-200'
                      : vocabularyImprovement < 0
                        ? 'bg-red-50 border-red-200'
                        : 'bg-amber-50 border-amber-200'
                }`}
              >
                <div
                  className={`text-4xl font-bold mb-2 ${
                    vocabularyImprovement === null
                      ? 'text-gray-500'
                      : vocabularyImprovement > 0
                        ? 'text-emerald-600'
                        : vocabularyImprovement < 0
                          ? 'text-red-600'
                          : 'text-amber-600'
                  }`}
                >
                  {vocabularyImprovement === null
                    ? 'N/A'
                    : `${vocabularyImprovement > 0 ? '+' : ''}${vocabularyImprovement.toFixed(1)}%`}
                </div>
                <div
                  className={`text-sm font-medium ${
                    vocabularyImprovement === null
                      ? 'text-gray-600'
                      : vocabularyImprovement > 0
                        ? 'text-emerald-600'
                        : vocabularyImprovement < 0
                          ? 'text-red-600'
                          : 'text-amber-600'
                  }`}
                >
                  {vocabularyImprovement === null
                    ? 'Complete post-test'
                    : vocabularyImprovement > 0
                      ? 'Improved ↑'
                      : vocabularyImprovement < 0
                        ? 'Decreased ↓'
                        : 'No Change'}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Reading Accuracy Improvement */}
        <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
          <CardContent className="p-8">
            <div className="flex items-start gap-4 mb-6">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl shadow-lg">
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
                  />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-foreground mb-2">
                  Reading Accuracy
                </h3>
                <p className="text-muted-foreground text-sm">
                  Reading accuracy measures how correctly you read words. Higher
                  accuracy means fewer mistakes and better word recognition
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-6 bg-blue-50 rounded-xl border-2 border-blue-200">
                <div className="text-4xl font-bold text-blue-600 mb-2">
                  {preTestAccuracy}%
                </div>
                <div className="text-sm text-blue-600 font-medium">
                  Pre-test
                </div>
              </div>
              <div className="text-center p-6 bg-green-50 rounded-xl border-2 border-green-200">
                <div className="text-4xl font-bold text-green-600 mb-2">
                  {postTestAccuracy}%
                </div>
                <div className="text-sm text-green-600 font-medium">
                  Post-test
                </div>
              </div>
              <div
                className={`text-center p-6 rounded-xl border-2 ${
                  accuracyImprovement === null
                    ? 'bg-gray-50 border-gray-200'
                    : accuracyImprovement > 0
                      ? 'bg-emerald-50 border-emerald-200'
                      : accuracyImprovement < 0
                        ? 'bg-red-50 border-red-200'
                        : 'bg-amber-50 border-amber-200'
                }`}
              >
                <div
                  className={`text-4xl font-bold mb-2 ${
                    accuracyImprovement === null
                      ? 'text-gray-500'
                      : accuracyImprovement > 0
                        ? 'text-emerald-600'
                        : accuracyImprovement < 0
                          ? 'text-red-600'
                          : 'text-amber-600'
                  }`}
                >
                  {accuracyImprovement === null
                    ? 'N/A'
                    : `${accuracyImprovement > 0 ? '+' : ''}${accuracyImprovement.toFixed(1)}%`}
                </div>
                <div
                  className={`text-sm font-medium ${
                    accuracyImprovement === null
                      ? 'text-gray-600'
                      : accuracyImprovement > 0
                        ? 'text-emerald-600'
                        : accuracyImprovement < 0
                          ? 'text-red-600'
                          : 'text-amber-600'
                  }`}
                >
                  {accuracyImprovement === null
                    ? 'Complete post-test'
                    : accuracyImprovement > 0
                      ? 'More Accurate ↑'
                      : accuracyImprovement < 0
                        ? 'Less Accurate ↓'
                        : 'Same Accuracy'}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* No Data State */}
      {!hasPreTest && (
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
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-2">
              No Assessment Data Yet
            </h3>
            <p className="text-muted-foreground mb-6">
              Start your learning journey by completing your first pre-test to
              track your progress
            </p>
            <Button
              onClick={() => router.push('/student/mode')}
              className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700"
            >
              Start Pre-Test
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

export default StudentProgressChart
