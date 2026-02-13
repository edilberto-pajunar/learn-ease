'use client'

import React, { useEffect } from 'react'
import { useSubmissionStore } from '@/hooks/useSubmissionStore'
import { useAuthStore } from '@/hooks/useAuthStore'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useDashboardStore } from '@/hooks/useDashboardStore'
import { useRouter } from 'next/navigation'
import {
  BookOpen,
  Zap,
  Brain,
  BookText,
  Target,
  TrendingUp,
  TrendingDown,
  Minus,
  BookMarked,
  Award,
} from 'lucide-react'

function StudentProgressChart() {
  const { fetchSubmissions, submissions } = useSubmissionStore()
  const router = useRouter()
  const {
    preTestComprehensionScore,
    preTestVocabularyScore,
    preTestAccuracy,
    preTestWPM,
    postTestComprehensionScore,
    postTestVocabularyScore,
    postTestAccuracy,
    postTestWPM,
    setPreTestScore,
    setPostTestScore,
  } = useDashboardStore()
  const { user } = useAuthStore()

  useEffect(() => {
    if (user?.id) {
      // fetchSubmissions(user.id)
    }
  }, [user?.id, fetchSubmissions])

  useEffect(() => {
    const preTestSubmissions = submissions.filter(
      (sub) => sub.testType === 'preTest',
    )
    const postTestSubmissions = submissions.filter(
      (sub) => sub.testType === 'postTest',
    )
    setPreTestScore(preTestSubmissions)
    setPostTestScore(postTestSubmissions)
  }, [submissions, setPreTestScore, setPostTestScore])

  const preTestSubmissions = submissions.filter(
    (sub) => sub.testType === 'preTest',
  )
  const postTestSubmissions = submissions.filter(
    (sub) => sub.testType === 'postTest',
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

  return (
    <div className="min-h-screen bg-amber-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6 sm:space-y-8">
        {/* Header - Book Cover Style */}
        <div className="relative bg-blue-600 text-white rounded-2xl p-6 sm:p-8 lg:p-12 shadow-2xl overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500 rounded-full -mr-32 -mt-32 opacity-20"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-700 rounded-full -ml-24 -mb-24 opacity-20"></div>

          <div className="relative z-10 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-white rounded-2xl mb-4 sm:mb-6 shadow-lg">
              <BookOpen className="w-8 h-8 sm:w-10 sm:h-10 text-blue-600" />
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-2 sm:mb-4">
              My Learning Journey
            </h1>
            <p className="text-base sm:text-lg lg:text-xl text-blue-100 max-w-3xl mx-auto">
              Track your reading progress and celebrate your achievements
            </p>
          </div>
        </div>

        {/* Book Shelf Summary */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          {/* Pre-test Book */}
          <Card className="border-4 border-blue-600 bg-white shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
            <CardContent className="p-6 sm:p-8">
              <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
                <div className="w-16 h-20 sm:w-20 sm:h-24 bg-blue-600 rounded-lg shadow-lg flex items-center justify-center flex-shrink-0">
                  <BookMarked className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
                </div>
                <div className="text-center sm:text-left flex-1">
                  <div className="text-3xl sm:text-4xl font-bold text-blue-600 mb-1 sm:mb-2">
                    {preTestSubmissions.length}
                  </div>
                  <div className="text-sm sm:text-base font-semibold text-gray-700">
                    Pre Test Books Read
                  </div>
                  <div className="text-xs sm:text-sm text-gray-500 mt-1">
                    Your starting point
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Post-test Book */}
          <Card className="border-4 border-amber-500 bg-white shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
            <CardContent className="p-6 sm:p-8">
              <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
                <div className="w-16 h-20 sm:w-20 sm:h-24 bg-amber-500 rounded-lg shadow-lg flex items-center justify-center flex-shrink-0">
                  <Award className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
                </div>
                <div className="text-center sm:text-left flex-1">
                  <div className="text-3xl sm:text-4xl font-bold text-amber-600 mb-1 sm:mb-2">
                    {postTestSubmissions.length}
                  </div>
                  <div className="text-sm sm:text-base font-semibold text-gray-700">
                    Post Test Books Read
                  </div>
                  <div className="text-xs sm:text-sm text-gray-500 mt-1">
                    Your achievement
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Progress Stories - Book Chapter Style */}
        <div className="space-y-4 sm:space-y-6">
          {/* Chapter 1: Reading Speed */}
          <Card className="border-l-8 border-blue-600 bg-white shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardContent className="p-6 sm:p-8">
              <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-6 mb-6">
                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-blue-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md">
                  <Zap className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
                    Chapter 1: Reading Speed
                  </h3>
                  <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                    Words per minute (WPM) measures how fast you read. Higher
                    speed with good comprehension shows reading fluency
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="text-center p-4 sm:p-6 bg-blue-50 rounded-xl border-2 border-blue-200 hover:border-blue-400 transition-colors">
                  <div className="text-xs sm:text-sm font-semibold text-blue-600 mb-2">
                    BEFORE
                  </div>
                  <div className="text-3xl sm:text-4xl font-bold text-blue-600 mb-1">
                    {preTestWPM}
                  </div>
                  <div className="text-xs sm:text-sm text-gray-600">WPM</div>
                </div>

                <div className="text-center p-4 sm:p-6 bg-amber-50 rounded-xl border-2 border-amber-200 hover:border-amber-400 transition-colors">
                  <div className="text-xs sm:text-sm font-semibold text-amber-600 mb-2">
                    AFTER
                  </div>
                  <div className="text-3xl sm:text-4xl font-bold text-amber-600 mb-1">
                    {postTestWPM}
                  </div>
                  <div className="text-xs sm:text-sm text-gray-600">WPM</div>
                </div>

                <div
                  className={`text-center p-4 sm:p-6 rounded-xl border-2 transition-colors ${
                    wpmImprovement === null
                      ? 'bg-gray-50 border-gray-200'
                      : wpmImprovement > 0
                        ? 'bg-blue-100 border-blue-300'
                        : wpmImprovement < 0
                          ? 'bg-red-50 border-red-200'
                          : 'bg-gray-50 border-gray-200'
                  }`}
                >
                  <div className="text-xs sm:text-sm font-semibold text-gray-600 mb-2">
                    PROGRESS
                  </div>
                  <div
                    className={`text-3xl sm:text-4xl font-bold mb-1 flex items-center justify-center gap-2 ${
                      wpmImprovement === null
                        ? 'text-gray-400'
                        : wpmImprovement > 0
                          ? 'text-blue-600'
                          : wpmImprovement < 0
                            ? 'text-red-600'
                            : 'text-gray-600'
                    }`}
                  >
                    {wpmImprovement === null ? (
                      'N/A'
                    ) : wpmImprovement > 0 ? (
                      <>
                        <TrendingUp className="w-6 h-6 sm:w-8 sm:h-8" />+
                        {wpmImprovement.toFixed(0)}
                      </>
                    ) : wpmImprovement < 0 ? (
                      <>
                        <TrendingDown className="w-6 h-6 sm:w-8 sm:h-8" />
                        {wpmImprovement.toFixed(0)}
                      </>
                    ) : (
                      <>
                        <Minus className="w-6 h-6 sm:w-8 sm:h-8" />0
                      </>
                    )}
                  </div>
                  <div className="text-xs sm:text-sm text-gray-600">
                    {wpmImprovement === null
                      ? 'Complete postTest'
                      : wpmImprovement > 0
                        ? 'Faster!'
                        : wpmImprovement < 0
                          ? 'Slower'
                          : 'Same'}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Chapter 2: Reading Comprehension */}
          <Card className="border-l-8 border-amber-500 bg-white shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardContent className="p-6 sm:p-8">
              <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-6 mb-6">
                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-amber-500 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md">
                  <Brain className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
                    Chapter 2: Reading Comprehension
                  </h3>
                  <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                    Comprehension score shows how well you understand what you
                    read. This is crucial for learning and academic success
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="text-center p-4 sm:p-6 bg-blue-50 rounded-xl border-2 border-blue-200 hover:border-blue-400 transition-colors">
                  <div className="text-xs sm:text-sm font-semibold text-blue-600 mb-2">
                    BEFORE
                  </div>
                  <div className="text-3xl sm:text-4xl font-bold text-blue-600 mb-1">
                    {preTestComprehensionScore}%
                  </div>
                  <div className="text-xs sm:text-sm text-gray-600">Score</div>
                </div>

                <div className="text-center p-4 sm:p-6 bg-amber-50 rounded-xl border-2 border-amber-200 hover:border-amber-400 transition-colors">
                  <div className="text-xs sm:text-sm font-semibold text-amber-600 mb-2">
                    AFTER
                  </div>
                  <div className="text-3xl sm:text-4xl font-bold text-amber-600 mb-1">
                    {postTestComprehensionScore}%
                  </div>
                  <div className="text-xs sm:text-sm text-gray-600">Score</div>
                </div>

                <div
                  className={`text-center p-4 sm:p-6 rounded-xl border-2 transition-colors ${
                    comprehensionImprovement === null
                      ? 'bg-gray-50 border-gray-200'
                      : comprehensionImprovement > 0
                        ? 'bg-blue-100 border-blue-300'
                        : comprehensionImprovement < 0
                          ? 'bg-red-50 border-red-200'
                          : 'bg-gray-50 border-gray-200'
                  }`}
                >
                  <div className="text-xs sm:text-sm font-semibold text-gray-600 mb-2">
                    PROGRESS
                  </div>
                  <div
                    className={`text-3xl sm:text-4xl font-bold mb-1 flex items-center justify-center gap-2 ${
                      comprehensionImprovement === null
                        ? 'text-gray-400'
                        : comprehensionImprovement > 0
                          ? 'text-blue-600'
                          : comprehensionImprovement < 0
                            ? 'text-red-600'
                            : 'text-gray-600'
                    }`}
                  >
                    {comprehensionImprovement === null ? (
                      'N/A'
                    ) : comprehensionImprovement > 0 ? (
                      <>
                        <TrendingUp className="w-6 h-6 sm:w-8 sm:h-8" />+
                        {comprehensionImprovement.toFixed(1)}%
                      </>
                    ) : comprehensionImprovement < 0 ? (
                      <>
                        <TrendingDown className="w-6 h-6 sm:w-8 sm:h-8" />
                        {comprehensionImprovement.toFixed(1)}%
                      </>
                    ) : (
                      <>
                        <Minus className="w-6 h-6 sm:w-8 sm:h-8" />
                        0%
                      </>
                    )}
                  </div>
                  <div className="text-xs sm:text-sm text-gray-600">
                    {comprehensionImprovement === null
                      ? 'Complete postTest'
                      : comprehensionImprovement > 0
                        ? 'Improved!'
                        : comprehensionImprovement < 0
                          ? 'Decreased'
                          : 'Same'}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Chapter 3: Vocabulary Knowledge */}
          <Card className="border-l-8 border-blue-600 bg-white shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardContent className="p-6 sm:p-8">
              <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-6 mb-6">
                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-blue-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md">
                  <BookText className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
                    Chapter 3: Vocabulary Knowledge
                  </h3>
                  <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                    Vocabulary score measures your understanding of word
                    meanings. A strong vocabulary enhances reading comprehension
                    and communication
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="text-center p-4 sm:p-6 bg-blue-50 rounded-xl border-2 border-blue-200 hover:border-blue-400 transition-colors">
                  <div className="text-xs sm:text-sm font-semibold text-blue-600 mb-2">
                    BEFORE
                  </div>
                  <div className="text-3xl sm:text-4xl font-bold text-blue-600 mb-1">
                    {preTestVocabularyScore}%
                  </div>
                  <div className="text-xs sm:text-sm text-gray-600">Score</div>
                </div>

                <div className="text-center p-4 sm:p-6 bg-amber-50 rounded-xl border-2 border-amber-200 hover:border-amber-400 transition-colors">
                  <div className="text-xs sm:text-sm font-semibold text-amber-600 mb-2">
                    AFTER
                  </div>
                  <div className="text-3xl sm:text-4xl font-bold text-amber-600 mb-1">
                    {postTestVocabularyScore}%
                  </div>
                  <div className="text-xs sm:text-sm text-gray-600">Score</div>
                </div>

                <div
                  className={`text-center p-4 sm:p-6 rounded-xl border-2 transition-colors ${
                    vocabularyImprovement === null
                      ? 'bg-gray-50 border-gray-200'
                      : vocabularyImprovement > 0
                        ? 'bg-blue-100 border-blue-300'
                        : vocabularyImprovement < 0
                          ? 'bg-red-50 border-red-200'
                          : 'bg-gray-50 border-gray-200'
                  }`}
                >
                  <div className="text-xs sm:text-sm font-semibold text-gray-600 mb-2">
                    PROGRESS
                  </div>
                  <div
                    className={`text-3xl sm:text-4xl font-bold mb-1 flex items-center justify-center gap-2 ${
                      vocabularyImprovement === null
                        ? 'text-gray-400'
                        : vocabularyImprovement > 0
                          ? 'text-blue-600'
                          : vocabularyImprovement < 0
                            ? 'text-red-600'
                            : 'text-gray-600'
                    }`}
                  >
                    {vocabularyImprovement === null ? (
                      'N/A'
                    ) : vocabularyImprovement > 0 ? (
                      <>
                        <TrendingUp className="w-6 h-6 sm:w-8 sm:h-8" />+
                        {vocabularyImprovement.toFixed(1)}%
                      </>
                    ) : vocabularyImprovement < 0 ? (
                      <>
                        <TrendingDown className="w-6 h-6 sm:w-8 sm:h-8" />
                        {vocabularyImprovement.toFixed(1)}%
                      </>
                    ) : (
                      <>
                        <Minus className="w-6 h-6 sm:w-8 sm:h-8" />
                        0%
                      </>
                    )}
                  </div>
                  <div className="text-xs sm:text-sm text-gray-600">
                    {vocabularyImprovement === null
                      ? 'Complete postTest'
                      : vocabularyImprovement > 0
                        ? 'Improved!'
                        : vocabularyImprovement < 0
                          ? 'Decreased'
                          : 'Same'}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Chapter 4: Reading Accuracy */}
          <Card className="border-l-8 border-amber-500 bg-white shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardContent className="p-6 sm:p-8">
              <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-6 mb-6">
                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-amber-500 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md">
                  <Target className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
                    Chapter 4: Reading Accuracy
                  </h3>
                  <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                    Reading accuracy measures how correctly you read words.
                    Higher accuracy means fewer mistakes and better word
                    recognition
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="text-center p-4 sm:p-6 bg-blue-50 rounded-xl border-2 border-blue-200 hover:border-blue-400 transition-colors">
                  <div className="text-xs sm:text-sm font-semibold text-blue-600 mb-2">
                    BEFORE
                  </div>
                  <div className="text-3xl sm:text-4xl font-bold text-blue-600 mb-1">
                    {preTestAccuracy}%
                  </div>
                  <div className="text-xs sm:text-sm text-gray-600">
                    Accuracy
                  </div>
                </div>

                <div className="text-center p-4 sm:p-6 bg-amber-50 rounded-xl border-2 border-amber-200 hover:border-amber-400 transition-colors">
                  <div className="text-xs sm:text-sm font-semibold text-amber-600 mb-2">
                    AFTER
                  </div>
                  <div className="text-3xl sm:text-4xl font-bold text-amber-600 mb-1">
                    {postTestAccuracy}%
                  </div>
                  <div className="text-xs sm:text-sm text-gray-600">
                    Accuracy
                  </div>
                </div>

                <div
                  className={`text-center p-4 sm:p-6 rounded-xl border-2 transition-colors ${
                    accuracyImprovement === null
                      ? 'bg-gray-50 border-gray-200'
                      : accuracyImprovement > 0
                        ? 'bg-blue-100 border-blue-300'
                        : accuracyImprovement < 0
                          ? 'bg-red-50 border-red-200'
                          : 'bg-gray-50 border-gray-200'
                  }`}
                >
                  <div className="text-xs sm:text-sm font-semibold text-gray-600 mb-2">
                    PROGRESS
                  </div>
                  <div
                    className={`text-3xl sm:text-4xl font-bold mb-1 flex items-center justify-center gap-2 ${
                      accuracyImprovement === null
                        ? 'text-gray-400'
                        : accuracyImprovement > 0
                          ? 'text-blue-600'
                          : accuracyImprovement < 0
                            ? 'text-red-600'
                            : 'text-gray-600'
                    }`}
                  >
                    {accuracyImprovement === null ? (
                      'N/A'
                    ) : accuracyImprovement > 0 ? (
                      <>
                        <TrendingUp className="w-6 h-6 sm:w-8 sm:h-8" />+
                        {accuracyImprovement.toFixed(1)}%
                      </>
                    ) : accuracyImprovement < 0 ? (
                      <>
                        <TrendingDown className="w-6 h-6 sm:w-8 sm:h-8" />
                        {accuracyImprovement.toFixed(1)}%
                      </>
                    ) : (
                      <>
                        <Minus className="w-6 h-6 sm:w-8 sm:h-8" />
                        0%
                      </>
                    )}
                  </div>
                  <div className="text-xs sm:text-sm text-gray-600">
                    {accuracyImprovement === null
                      ? 'Complete postTest'
                      : accuracyImprovement > 0
                        ? 'More Accurate!'
                        : accuracyImprovement < 0
                          ? 'Less Accurate'
                          : 'Same'}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Empty State - Book on shelf */}
        {!hasPreTest && (
          <Card className="border-4 border-dashed border-blue-300 bg-white shadow-lg">
            <CardContent className="p-8 sm:p-12 text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 sm:w-24 sm:h-24 bg-blue-100 rounded-full mb-6 shadow-inner">
                <BookOpen className="w-10 h-10 sm:w-12 sm:h-12 text-blue-600" />
              </div>
              <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
                Begin Your Reading Journey
              </h3>
              <p className="text-base sm:text-lg text-gray-600 mb-8 max-w-md mx-auto">
                Open your first book and start tracking your amazing progress!
              </p>
              <Button
                onClick={() => router.push('/student/mode')}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
              >
                <BookMarked className="w-5 h-5 sm:w-6 sm:h-6 mr-2" />
                Start Pre-Test
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}

export default StudentProgressChart
