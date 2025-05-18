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
} from 'recharts'
import { useSubmissionStore } from '@/hooks/useSubmissionStore'
import { useAuthStore } from '@/hooks/useAuthStore'
import { Submission } from '@/interface/submission'

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

  // Transform submissions data for the bar chart
  const barChartData = submissions.map((submission) => ({
    name: `Material ${submission.materialId}`,
    score: submission.score,
    totalQuestions: Object.keys(submission.answers).length,
  }))

  // Transform submissions data for the pie chart
  const pieChartData = submissions.map((submission) => ({
    name: `Material ${submission.materialId}`,
    value: (submission.score / Object.keys(submission.answers).length) * 100,
  }))

  return (
    <div className="flex space-y-8">
      {/* Bar Chart Section */}
      <div className="p-4 bg-white rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Scores by Material</h2>
        <ChartContainer config={chartConfig} className="min-h-[300px] w-full">
          <BarChart data={barChartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="score" fill="#2563eb" name="Score" radius={4} />
            <Bar
              dataKey="totalQuestions"
              fill="#60a5fa"
              name="Total Questions"
              radius={4}
            />
          </BarChart>
        </ChartContainer>
      </div>

      {/* Pie Chart Section */}
      <div className="p-4 bg-white rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Performance Distribution</h2>
        <ChartContainer config={chartConfig} className="min-h-[300px] w-full">
          <PieChart>
            <Pie
              data={pieChartData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, value }) => `${name}: ${value.toFixed(1)}%`}
              outerRadius={100}
              fill="#8884d8"
              dataKey="value"
            >
              {pieChartData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
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
