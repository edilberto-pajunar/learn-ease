'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import { useReadStore } from '@/hooks/useReadStore'
import { useAdminStore } from '@/hooks/useAdminStore'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

function ModePage() {
  const router = useRouter()
  const { materials, resetAll } = useReadStore()
  const { getQuarter, quarter } = useAdminStore()

  const handleTestType = async (testType: string) => {
    await getQuarter()

    // Reset all reading progress when starting a new test
    if (materials.length !== 0) {
      resetAll()
    }

    router.push(`/student/reading?testType=${testType}&quarter=${quarter}`)
  }

  const testOptions = [
    {
      type: 'pre_test',
      title: 'Pre Test',
      description: 'Take this before starting your learning journey',
      icon: '📝',
      color: 'from-emerald-500 to-green-600',
      bgColor: 'from-emerald-50 to-green-100',
      borderColor: 'border-emerald-200',
      shadowColor: 'shadow-emerald-500/25',
      hoverColor: 'hover:from-emerald-600 hover:to-green-700',
    },
    {
      type: 'post_test',
      title: 'Post Test',
      description: 'Assess your progress after completing the course',
      icon: '🎯',
      color: 'from-amber-500 to-orange-600',
      bgColor: 'from-amber-50 to-orange-100',
      borderColor: 'border-amber-200',
      shadowColor: 'shadow-amber-500/25',
      hoverColor: 'hover:from-amber-600 hover:to-orange-700',
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-blue-50/30 to-indigo-50/50">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-[0.02]" />

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6 py-20">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl shadow-xl shadow-blue-500/25 mb-6">
            <svg
              className="w-8 h-8 text-white"
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

          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-foreground via-blue-600 to-indigo-600 bg-clip-text text-transparent mb-4">
            Choose Your Test Type
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Select whether you are taking a pre-test to assess your current
            knowledge or a post-test to measure your progress
          </p>
        </div>

        {/* Test Options */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl">
          {testOptions.map((option) => (
            <Card
              key={option.type}
              className="group cursor-pointer border-0 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 bg-gradient-to-br from-card to-card/50 overflow-hidden"
            >
              <div className={`h-2 bg-gradient-to-r ${option.color}`} />
              <CardContent className="p-8">
                <div className="text-center">
                  {/* Icon */}
                  <div
                    className={`inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br ${option.bgColor} ${option.borderColor} border-2 rounded-2xl mb-6 group-hover:scale-110 transition-transform duration-300`}
                  >
                    <span className="text-3xl">{option.icon}</span>
                  </div>

                  {/* Title */}
                  <h3 className="text-2xl font-bold text-foreground mb-3">
                    {option.title}
                  </h3>

                  {/* Description */}
                  <p className="text-muted-foreground mb-8 leading-relaxed">
                    {option.description}
                  </p>

                  {/* Action Button */}
                  <Button
                    onClick={() => handleTestType(option.type)}
                    size="lg"
                    className={`w-full bg-gradient-to-r ${option.color} ${option.hoverColor} text-white font-semibold py-3 px-6 shadow-xl ${option.shadowColor} hover:shadow-2xl transition-all duration-300 transform group-hover:scale-105`}
                  >
                    Start {option.title}
                    <svg
                      className="w-5 h-5 ml-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 7l5 5m0 0l-5 5m5-5H6"
                      />
                    </svg>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Additional Info */}
        <div className="mt-16 text-center">
          <div className="inline-flex items-center space-x-2 px-6 py-3 bg-accent/50 rounded-full border border-border/50">
            <svg
              className="w-5 h-5 text-muted-foreground"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span className="text-sm text-muted-foreground">
              Your test results will help personalize your learning experience
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ModePage
