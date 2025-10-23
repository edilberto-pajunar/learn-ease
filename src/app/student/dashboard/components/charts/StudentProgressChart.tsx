'use client'

import React, { useEffect, useState } from 'react'
import { ChartContainer, type ChartConfig } from '@/components/ui/chart'
import {
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  LineChart,
  Line,
  ResponsiveContainer,
} from 'recharts'
import { useSubmissionStore } from '@/hooks/useSubmissionStore'
import { useAuthStore } from '@/hooks/useAuthStore'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

const chartConfig = {
  desktop: {
    label: 'Desktop',
    color: '#2563eb',
  },
  mobile: {
    label: 'Mobile',
    color: '#60a5fa',
  },
} satisfies ChartConfig

function StudentProgressChart() {
  const { fetchSubmissions, submissions } = useSubmissionStore()
  const { user } = useAuthStore()
  const [activeTab, setActiveTab] = useState<'pre_test' | 'post_test'>(
    'pre_test',
  )

  useEffect(() => {
    if (user?.id) {
      fetchSubmissions(user.id)
    }
  }, [user?.id, fetchSubmissions])

  // Filter submissions by active tab
  const filteredSubmissions = submissions.filter(
    (sub) => sub.testType === activeTab,
  )

  // Calculate statistics for the active tab
  const stats = filteredSubmissions.reduce(
    (acc, submission) => {
      acc.totalScore += submission.score || 0
      acc.totalQuestions += submission.answers.length || 0
      acc.totalWords += submission.numberOfWords || 0
      acc.totalDuration += submission.duration || 0
      acc.totalMiscues += Array.isArray(submission.miscues)
        ? submission.miscues.length
        : 0
      return acc
    },
    {
      totalScore: 0,
      totalQuestions: 0,
      totalWords: 0,
      totalDuration: 0,
      totalMiscues: 0,
    },
  )

  // Calculate averages
  const averageScore =
    filteredSubmissions.length > 0
      ? Math.round((stats.totalScore / stats.totalQuestions) * 100)
      : 0
  const averageWordsPerMinute =
    filteredSubmissions.length > 0
      ? Math.round((stats.totalWords / stats.totalDuration) * 60)
      : 0
  const averageAccuracy =
    filteredSubmissions.length > 0
      ? Math.round(
          ((stats.totalQuestions - stats.totalMiscues) / stats.totalQuestions) *
            100,
        )
      : 0

  // Prepare chart data for progress over time
  const progressData = filteredSubmissions.map((submission, index) => ({
    name: `Material ${index + 1}`,
    timeTaken: Math.round(submission.duration || 0),
    questionsCorrect: submission.score || 0,
    accuracy: submission.answers.length
      ? Math.round((submission.score / submission.answers.length) * 100)
      : 0,
    wordsRead: submission.numberOfWords || 0,
  }))

  // Overall progress comparison (pre-test vs post-test)
  const overallProgress = submissions.reduce(
    (acc, submission) => {
      if (submission.testType === 'pre_test') {
        acc.preTestScore += submission.score || 0
        acc.preTestQuestions += submission.answers.length || 0
        acc.preTestDuration += submission.duration || 0
        acc.preTestWords += submission.numberOfWords || 0
        acc.preTestMiscues += Array.isArray(submission.miscues)
          ? submission.miscues.length
          : 0
      } else if (submission.testType === 'post_test') {
        acc.postTestScore += submission.score || 0
        acc.postTestQuestions += submission.answers.length || 0
        acc.postTestDuration += submission.duration || 0
        acc.postTestWords += submission.numberOfWords || 0
        acc.postTestMiscues += Array.isArray(submission.miscues)
          ? submission.miscues.length
          : 0
      }
      return acc
    },
    {
      preTestScore: 0,
      preTestQuestions: 0,
      preTestDuration: 0,
      preTestWords: 0,
      preTestMiscues: 0,
      postTestScore: 0,
      postTestQuestions: 0,
      postTestDuration: 0,
      postTestWords: 0,
      postTestMiscues: 0,
    },
  )

  const preTestAverage =
    overallProgress.preTestQuestions > 0
      ? Math.round(
          (overallProgress.preTestScore / overallProgress.preTestQuestions) *
            100,
        )
      : 0
  const postTestAverage =
    overallProgress.postTestQuestions > 0
      ? Math.round(
          (overallProgress.postTestScore / overallProgress.postTestQuestions) *
            100,
        )
      : 0
  const improvement =
    overallProgress.postTestQuestions > 0
      ? postTestAverage - preTestAverage
      : null

  // Speed calculations
  const preTestWPM =
    overallProgress.preTestDuration > 0
      ? Math.round(
          (overallProgress.preTestWords / overallProgress.preTestDuration) * 60,
        )
      : 0
  const postTestWPM =
    overallProgress.postTestDuration > 0
      ? Math.round(
          (overallProgress.postTestWords / overallProgress.postTestDuration) *
            60,
        )
      : 0
  const speedImprovement =
    overallProgress.postTestDuration > 0 ? postTestWPM - preTestWPM : null

  // Accuracy calculations
  const preTestAccuracy =
    overallProgress.preTestQuestions > 0
      ? Math.round(
          ((overallProgress.preTestQuestions - overallProgress.preTestMiscues) /
            overallProgress.preTestQuestions) *
            100,
        )
      : 0
  const postTestAccuracy =
    overallProgress.postTestQuestions > 0
      ? Math.round(
          ((overallProgress.postTestQuestions -
            overallProgress.postTestMiscues) /
            overallProgress.postTestQuestions) *
            100,
        )
      : 0
  const accuracyImprovement =
    overallProgress.postTestQuestions > 0
      ? postTestAccuracy - preTestAccuracy
      : null

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

      {/* Test Type Toggle */}
      <div className="flex justify-center mb-8">
        <div className="bg-white/80 backdrop-blur-sm rounded-xl p-1 shadow-lg border border-gray-200">
          <Button
            variant={activeTab === 'pre_test' ? 'default' : 'ghost'}
            onClick={() => setActiveTab('pre_test')}
            className={`px-6 py-2 rounded-lg transition-all duration-200 ${
              activeTab === 'pre_test'
                ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            📝 Pre-Test Results
          </Button>
          <Button
            variant={activeTab === 'post_test' ? 'default' : 'ghost'}
            onClick={() => setActiveTab('post_test')}
            className={`px-6 py-2 rounded-lg transition-all duration-200 ${
              activeTab === 'post_test'
                ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            🎯 Post-Test Results
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
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
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div className="text-2xl font-bold text-blue-600 mb-2">
              {averageScore}%
            </div>
            <div className="text-sm text-blue-600 font-medium">
              Average Score
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
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div className="text-2xl font-bold text-green-600 mb-2">
              {averageWordsPerMinute}
            </div>
            <div className="text-sm text-green-600 font-medium">
              Words per Minute
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-50 to-purple-100">
          <CardContent className="p-6 text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-purple-500 rounded-xl mb-4">
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
            <div className="text-2xl font-bold text-purple-600 mb-2">
              {averageAccuracy}%
            </div>
            <div className="text-sm text-purple-600 font-medium">
              Reading Accuracy
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-br from-orange-50 to-orange-100">
          <CardContent className="p-6 text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-orange-500 rounded-xl mb-4">
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
            <div className="text-2xl font-bold text-orange-600 mb-2">
              {filteredSubmissions.length}
            </div>
            <div className="text-sm text-orange-600 font-medium">
              Materials Completed
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Progress Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Time Progress Chart */}
        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
          <CardContent className="p-6">
            <h3 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
              <svg
                className="w-5 h-5 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              Time Progress
            </h3>
            <ChartContainer
              config={chartConfig}
              className="min-h-[300px] w-full"
            >
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={progressData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="name" stroke="#6b7280" />
                  <YAxis stroke="#6b7280" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'white',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                    }}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="timeTaken"
                    stroke="#3b82f6"
                    strokeWidth={3}
                    dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6, stroke: '#3b82f6', strokeWidth: 2 }}
                    name="Time Taken (seconds)"
                  />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Questions Correct Chart */}
        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
          <CardContent className="p-6">
            <h3 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
              <svg
                className="w-5 h-5 text-green-600"
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
              Questions Correct
            </h3>
            <ChartContainer
              config={chartConfig}
              className="min-h-[300px] w-full"
            >
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={progressData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="name" stroke="#6b7280" />
                  <YAxis stroke="#6b7280" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'white',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                    }}
                  />
                  <Legend />
                  <Bar
                    dataKey="questionsCorrect"
                    fill="#10b981"
                    radius={[4, 4, 0, 0]}
                    name="Questions Correct"
                  />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      {/* Overall Progress Comparison */}
      <Card className="border-0 shadow-xl bg-gradient-to-br from-white to-blue-50/30">
        <CardContent className="p-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-foreground mb-2">
              Overall Progress Comparison
            </h2>
            <p className="text-muted-foreground">
              Track your improvement from pre-test to post-test across all
              metrics
            </p>
          </div>

          {/* Comprehension Scores */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
              <svg
                className="w-5 h-5 text-blue-600"
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
              Comprehension Scores
            </h3>
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
                  className={`text-3xl font-bold mb-2 ${
                    improvement === null
                      ? 'text-gray-500'
                      : improvement > 0
                        ? 'text-green-600'
                        : 'text-red-600'
                  }`}
                >
                  {improvement === null
                    ? 'N/A'
                    : `${improvement > 0 ? '+' : ''}${improvement}%`}
                </div>
                <div className="text-sm text-purple-600 font-medium">
                  {improvement === null
                    ? 'No Post-test Data'
                    : improvement > 0
                      ? 'Improvement ↑'
                      : 'Change ↓'}
                </div>
              </div>
            </div>
          </div>

          {/* Reading Speed */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
              <svg
                className="w-5 h-5 text-green-600"
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
              Reading Speed (Words Per Minute)
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-6 bg-blue-50 rounded-xl border border-blue-200">
                <div className="text-3xl font-bold text-blue-600 mb-2">
                  {preTestWPM}
                </div>
                <div className="text-sm text-blue-600 font-medium">
                  Pre-test WPM
                </div>
              </div>
              <div className="text-center p-6 bg-green-50 rounded-xl border border-green-200">
                <div className="text-3xl font-bold text-green-600 mb-2">
                  {postTestWPM}
                </div>
                <div className="text-sm text-green-600 font-medium">
                  Post-test WPM
                </div>
              </div>
              <div className="text-center p-6 bg-purple-50 rounded-xl border border-purple-200">
                <div
                  className={`text-3xl font-bold mb-2 ${
                    speedImprovement === null
                      ? 'text-gray-500'
                      : speedImprovement > 0
                        ? 'text-green-600'
                        : 'text-red-600'
                  }`}
                >
                  {speedImprovement === null
                    ? 'N/A'
                    : `${speedImprovement > 0 ? '+' : ''}${speedImprovement}`}
                </div>
                <div className="text-sm text-purple-600 font-medium">
                  {speedImprovement === null
                    ? 'No Post-test Data'
                    : speedImprovement > 0
                      ? 'Speed Up ↑'
                      : 'Speed Change ↓'}
                </div>
              </div>
            </div>
          </div>

          {/* Reading Accuracy */}
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
              <svg
                className="w-5 h-5 text-orange-600"
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
              Reading Accuracy (Fewer Miscues)
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-6 bg-blue-50 rounded-xl border border-blue-200">
                <div className="text-3xl font-bold text-blue-600 mb-2">
                  {preTestAccuracy}%
                </div>
                <div className="text-sm text-blue-600 font-medium">
                  Pre-test Accuracy
                </div>
              </div>
              <div className="text-center p-6 bg-green-50 rounded-xl border border-green-200">
                <div className="text-3xl font-bold text-green-600 mb-2">
                  {postTestAccuracy}%
                </div>
                <div className="text-sm text-green-600 font-medium">
                  Post-test Accuracy
                </div>
              </div>
              <div className="text-center p-6 bg-purple-50 rounded-xl border border-purple-200">
                <div
                  className={`text-3xl font-bold mb-2 ${
                    accuracyImprovement === null
                      ? 'text-gray-500'
                      : accuracyImprovement > 0
                        ? 'text-green-600'
                        : 'text-red-600'
                  }`}
                >
                  {accuracyImprovement === null
                    ? 'N/A'
                    : `${accuracyImprovement > 0 ? '+' : ''}${accuracyImprovement}%`}
                </div>
                <div className="text-sm text-purple-600 font-medium">
                  {accuracyImprovement === null
                    ? 'No Post-test Data'
                    : accuracyImprovement > 0
                      ? 'More Accurate ↑'
                      : 'Accuracy Change ↓'}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* No Data State */}
      {filteredSubmissions.length === 0 && (
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
              No {activeTab === 'pre_test' ? 'Pre-test' : 'Post-test'} Data Yet
            </h3>
            <p className="text-muted-foreground mb-6">
              Complete some{' '}
              {activeTab === 'pre_test' ? 'pre-test' : 'post-test'} assessments
              to see your progress here.
            </p>
            <Button className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700">
              Start Assessment
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

export default StudentProgressChart
