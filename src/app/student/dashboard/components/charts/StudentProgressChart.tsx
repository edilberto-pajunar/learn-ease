'use client'

import React, { useEffect } from 'react'

import { ChartContainer, type ChartConfig } from '@/components/ui/chart'
import {
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from 'recharts'
import { useSubmissionStore } from '@/hooks/useSubmissionStore'
import { useAuthStore } from '@/hooks/useAuthStore'

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

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8']

function StudentProgressChart() {
  const { fetchSubmissions, submissions } = useSubmissionStore()
  const { user } = useAuthStore()

  useEffect(() => {
    fetchSubmissions(user?.id || '')
  }, [])

  // Calculate total scores for pre-test and post-test
  const totalScores = submissions.reduce((acc: any, submission) => {
    if (submission.testType === 'pre_test') {
      acc.preTestScore = (acc.preTestScore || 0) + submission.score
    } else if (submission.testType === 'post_test') {
      acc.postTestScore = (acc.postTestScore || 0) + submission.score
    }
    return acc
  }, {})

  // Calculate reading metrics
  const readingMetrics = submissions.reduce((acc: any, submission) => {
    if (submission.testType === 'pre_test') {
      acc.preTestWords = (acc.preTestWords || 0) + submission.numberOfWords
      acc.preTestDuration = (acc.preTestDuration || 0) + submission.duration
    } else if (submission.testType === 'post_test') {
      acc.postTestWords = (acc.postTestWords || 0) + submission.numberOfWords
      acc.postTestDuration = (acc.postTestDuration || 0) + submission.duration
    }
    return acc
  }, {})

  const barChartData = [
    {
      name: 'Pre-test',
      score: totalScores.preTestScore || 0,
    },
    {
      name: 'Post-test',
      score: totalScores.postTestScore || 0,
    },
  ]

  const lineChartData = [
    {
      name: 'Pre-test',
      words: readingMetrics.preTestWords || 0,
      duration: readingMetrics.preTestDuration || 0,
    },
    {
      name: 'Post-test',
      words: readingMetrics.postTestWords || 0,
      duration: readingMetrics.postTestDuration || 0,
    },
  ]

  return (
    <div className="flex flex-col space-y-8">
      <div className="flex gap-8">
        {/* Pre-test vs Post-test Comparison Chart */}
        <div className="flex-1 p-4 bg-white rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">
            Pre-test vs Post-test Total Scores
          </h2>
          <ChartContainer config={chartConfig} className="min-h-[300px] w-full">
            <BarChart data={barChartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis
                label={{
                  value: 'Total Score',
                  angle: -90,
                  position: 'insideLeft',
                }}
              />
              <Tooltip />
              <Legend />
              <Bar
                dataKey="score"
                fill="#2563eb"
                name="Total Score"
                radius={4}
              />
            </BarChart>
          </ChartContainer>
        </div>

        {/* Reading Metrics Line Chart */}
        <div className="flex-1 p-4 bg-white rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Reading Metrics</h2>
          <ChartContainer config={chartConfig} className="min-h-[300px] w-full">
            <LineChart data={lineChartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis
                yAxisId="left"
                label={{
                  value: 'Number of Words',
                  angle: -90,
                  position: 'insideLeft',
                }}
              />
              <YAxis
                yAxisId="right"
                orientation="right"
                label={{
                  value: 'Duration (seconds)',
                  angle: 90,
                  position: 'insideRight',
                }}
              />
              <Tooltip />
              <Legend />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="words"
                stroke="#2563eb"
                name="Number of Words"
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="duration"
                stroke="#60a5fa"
                name="Duration"
              />
            </LineChart>
          </ChartContainer>
        </div>
      </div>

      {/* Pie Chart Section */}
      <div className="p-4 bg-white rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Performance Distribution</h2>
        <ChartContainer config={chartConfig} className="min-h-[300px] w-full">
          <PieChart>
            <Pie
              data={[
                {
                  name: 'Improvement',
                  value: totalScores.preTestScore
                    ? (((totalScores.postTestScore || 0) -
                        (totalScores.preTestScore || 0)) /
                        totalScores.preTestScore) *
                      100
                    : 0,
                },
              ]}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, value }) => `${name}: ${value.toFixed(1)}%`}
              outerRadius={100}
              fill="#8884d8"
              dataKey="value"
            >
              <Cell fill={COLORS[0]} />
            </Pie>
            <Tooltip formatter={(value: number) => `${value.toFixed(1)}%`} />
            <Legend />
          </PieChart>
        </ChartContainer>
      </div>
    </div>
  )
}

export default StudentProgressChart
