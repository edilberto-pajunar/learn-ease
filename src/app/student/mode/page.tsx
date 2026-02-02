'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useReadStore } from '@/hooks/useReadStore'
import { useAdminStore } from '@/hooks/useAdminStore'
import { useAuthStore } from '@/hooks/useAuthStore'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
  Loader2,
  AlertTriangle,
  FileText,
  ArrowRight,
  Info,
  ClipboardList,
  Target,
  CheckCircle2,
  BookOpen,
} from 'lucide-react'
import { readingService } from '@/services/readingService'

function ModePage() {
  const router = useRouter()
  const { materials, resetAll } = useReadStore()
  const { getQuarter, quarter } = useAdminStore()
  const { user } = useAuthStore()
  const [preTestCompleted, setPreTestCompleted] = useState(false)
  const [postTestCompleted, setPostTestCompleted] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getQuarter()
  }, [getQuarter])

  useEffect(() => {
    const checkTestsCompletion = async () => {
      if (user?.id) {
        setLoading(true)
        const preTestDone = await readingService.checkIfUserTookTest(user.id, 'preTest')
        const postTestDone = await readingService.checkIfUserTookTest(user.id, 'postTest')
        setPreTestCompleted(preTestDone)
        setPostTestCompleted(postTestDone)
        setLoading(false)
      }
    }
    checkTestsCompletion()
  }, [user?.id])

  const handleTestType = async (testType: string) => {
    if (materials.length !== 0) {
      resetAll()
    }

    router.push(
      `/student/reading?testType=${testType}&quarter=${quarter?.quarter}`,
    )
  }

  const handleGoToLessons = () => {
    router.push('/student/lessons')
  }

  const isTestCompleted = (testType: string) => {
    return testType === 'preTest' ? preTestCompleted : postTestCompleted
  }


  const allTestOptions = [
    {
      type: 'preTest',
      title: 'Pre Test',
      description: 'Take this before starting your learning journey',
      icon: ClipboardList,
    },
    {
      type: 'postTest',
      title: 'Post Test',
      description: 'Assess your progress after completing the course',
      icon: Target,
    },
  ]

  // Filter test options based on quarter availability
  const availableTestOptions = allTestOptions.filter((option) => {
    if (!quarter) return false
    if (option.type === 'preTest') return quarter.preTest
    if (option.type === 'postTest') return quarter.postTest
    return false
  })

  // Determine header content based on available test types
  const getHeaderContent = () => {
    if (!quarter) return null

    const hasPreTest = quarter.preTest
    const hasPostTest = quarter.postTest

    if (hasPreTest && hasPostTest) {
      return {
        title: 'Choose Your Test Type',
        description:
          'Select whether you are taking a pre-test to assess your current knowledge or a post-test to measure your progress after completing the course.',
      }
    } else if (hasPreTest && !hasPostTest) {
      return {
        title: 'Start Your Pre-Test',
        description:
          'Take this assessment to evaluate your current reading skills and comprehension level. This will help establish your baseline and guide your learning journey.',
      }
    } else if (!hasPreTest && hasPostTest) {
      return {
        title: 'Take Your Post-Test',
        description:
          'Complete this final assessment to measure your progress and see how much you&apos;ve improved. This test will evaluate your reading comprehension and vocabulary skills.',
      }
    }

    return null
  }

  const headerContent = getHeaderContent()

  if (!quarter || loading) {
    return (
      <div className="min-h-screen bg-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-2xl shadow-lg mb-6">
            <Loader2 className="w-8 h-8 text-white animate-spin" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Loading...</h2>
          <p className="text-slate-600">
            Please wait while we prepare your test options...
          </p>
        </div>
      </div>
    )
  }

  // Show message if no tests are available
  if (availableTestOptions.length === 0) {
    return (
      <div className="min-h-screen bg-blue-50 flex items-center justify-center">
        <div className="text-center max-w-md px-6">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-amber-100 rounded-2xl shadow-lg mb-6">
            <AlertTriangle className="w-8 h-8 text-amber-600" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">
            No Tests Available
          </h2>
          <p className="text-slate-600">
            There are no tests available for this quarter at the moment. Please
            check back later or contact your instructor.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-blue-50">
      <div className="absolute inset-0 bg-[url('/images/background.svg')] opacity-5"></div>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 sm:px-6 py-12 sm:py-20">
        {/* Header Section */}
        <div className="text-center mb-8 sm:mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-2xl shadow-lg mb-6 hover:scale-110 transition-transform duration-300">
            <FileText className="w-8 h-8 text-white" />
          </div>

          <div className="flex flex-col items-center gap-3 mb-4">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-slate-900">
              {headerContent?.title || 'Choose Your Test Type'}
            </h1>
            {/* {quarter?.quarter && (
              <span className="inline-flex items-center px-4 py-1.5 rounded-full text-sm font-semibold bg-blue-100 text-blue-700 border-2 border-blue-200">
                {quarter.quarter === 'Q1' ? 'Chapter 1' : 'Chapter 2'}
              </span>
            )} */}
          </div>

          {headerContent?.description && (
            <p className="text-base sm:text-lg md:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
              {headerContent.description}
            </p>
          )}
        </div>

        {/* Test Options */}
        <div
          className={`grid gap-6 sm:gap-8 w-full max-w-4xl ${
            availableTestOptions.length === 1
              ? 'grid-cols-1 max-w-md'
              : 'grid-cols-1 md:grid-cols-2'
          }`}
        >
          {availableTestOptions.map((option) => {
            const isPreTest = option.type === 'preTest'
            const isCompleted = isTestCompleted(option.type)

            return (
              <Card
                key={option.type}
                className={`group border-2 shadow-lg bg-white transition-all duration-300 transform overflow-hidden ${
                  isCompleted
                    ? 'border-slate-300 opacity-90'
                    : 'border-slate-200 cursor-pointer hover:shadow-2xl hover:-translate-y-2'
                }`}
              >
                <div
                  className={`h-2 ${
                    isPreTest ? 'bg-emerald-600' : 'bg-amber-600'
                  }`}
                />
                <CardContent className="p-6 sm:p-8">
                  <div className="text-center">
                    <div
                      className={`inline-flex items-center justify-center w-20 h-20 border-2 rounded-2xl mb-6 transition-transform duration-300 ${
                        isCompleted ? '' : 'group-hover:scale-110'
                      } ${
                        isPreTest
                          ? 'bg-emerald-100 border-emerald-200'
                          : 'bg-amber-100 border-amber-200'
                      }`}
                    >
                      {isCompleted ? (
                        <CheckCircle2
                          className={`w-10 h-10 ${
                            isPreTest ? 'text-emerald-600' : 'text-amber-600'
                          }`}
                        />
                      ) : (
                        <option.icon
                          className={`w-10 h-10 ${
                            isPreTest ? 'text-emerald-600' : 'text-amber-600'
                          }`}
                        />
                      )}
                    </div>

                    <h3 className="text-2xl font-bold text-slate-900 mb-3">
                      {option.title}
                    </h3>

                    <p className="text-slate-600 mb-6 sm:mb-8 leading-relaxed">
                      {option.description}
                    </p>

                    {isCompleted && (
                      <div className="mb-4 inline-flex items-center gap-2 px-4 py-2 bg-green-50 rounded-full border border-green-200">
                        <CheckCircle2 className="w-4 h-4 text-green-600" />
                        <span className="text-sm font-medium text-green-700">
                          Test Completed
                        </span>
                      </div>
                    )}

                    {isCompleted ? (
                      <div className="space-y-3">
                        <Button
                          onClick={handleGoToLessons}
                          size="lg"
                          className="w-full font-semibold py-3 px-6 shadow-lg transition-all duration-300 hover:shadow-xl bg-blue-600 hover:bg-blue-700 text-white"
                        >
                          Go to Lessons
                          <BookOpen className="w-5 h-5 ml-2" />
                        </Button>
                        <p className="text-xs text-slate-500">
                          You have already completed this test. Continue with
                          your lessons.
                        </p>
                      </div>
                    ) : (
                      <Button
                        onClick={() => handleTestType(option.type)}
                        size="lg"
                        className={`w-full font-semibold py-3 px-6 shadow-lg transition-all duration-300 hover:shadow-xl transform group-hover:scale-105 ${
                          isPreTest
                            ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                            : 'bg-amber-600 hover:bg-amber-700 text-white'
                        }`}
                      >
                        Start {option.title}
                        <ArrowRight className="w-5 h-5 ml-2" />
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Additional Info */}
        <div className="mt-12 sm:mt-16 text-center">
          <div className="inline-flex items-center gap-2 px-4 sm:px-6 py-3 bg-blue-50 rounded-full border-2 border-blue-200">
            <Info className="w-5 h-5 text-blue-600 flex-shrink-0" />
            <span className="text-sm text-slate-700 font-medium">
              Your test results will help personalize your learning experience
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ModePage
