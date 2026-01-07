'use client'

import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/hooks/useAuthStore'
import { useReadStore } from '@/hooks/useReadStore'
import { useAdminStore } from '@/hooks/useAdminStore'
import { useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

const HomePage: React.FC = () => {
  const { user } = useAuthStore()
  const { getQuarter } = useAdminStore()
  const router = useRouter()

  useEffect(() => {
    getQuarter()
  })

  const { materials, setIndexMaterial, setIndexQuestion, resetScore } =
    useReadStore()

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-blue-50/30 to-indigo-50/50 flex items-center justify-center">
        <div className="text-center">
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
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-2">
            Loading...
          </h2>
          <p className="text-muted-foreground">
            Please wait while we prepare your dashboard
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-blue-50/30 to-indigo-50/50">
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-[0.02]" />
        <div className="relative z-10 container mx-auto px-6 py-12">
          {/* Welcome Section */}
          <section className="text-center mb-16">
            <div className="mb-8">
              <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-3xl shadow-2xl shadow-blue-500/25 mb-6">
                <svg
                  className="w-12 h-12 text-white"
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
            </div>
            <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-foreground via-blue-600 to-indigo-600 bg-clip-text text-transparent mb-6 leading-tight">
              Welcome to T-BRITE!
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              <span className="font-bold text-blue-600">T</span>echnology -{' '}
              <span className="font-bold text-blue-600">B</span>ased{' '}
              <span className="font-bold text-blue-600">R</span>eading{' '}
              <span className="font-bold text-blue-600">I</span>nteractive{' '}
              <span className="font-bold text-blue-600">T</span>eaching{' '}
              <span className="font-bold text-blue-600">a</span>nd{' '}
              <span className="font-bold text-blue-600">E</span>ngagement.
            </p>
            <p className="text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Your personalized platform to track progress and enhance your
              learning journey with engaging, interactive experiences.
            </p>
          </section>

          {/* Cards Section */}
          <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {/* Reading Test Card */}
            <Card className="group cursor-pointer border-0 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 bg-gradient-to-br from-card to-card/50 overflow-hidden">
              <div className="h-2 bg-gradient-to-r from-emerald-500 to-green-600" />
              <CardContent className="p-8">
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-emerald-50 to-green-100 border-2 border-emerald-200 rounded-2xl mb-6 group-hover:scale-110 transition-transform duration-300">
                    <svg
                      className="w-10 h-10 text-emerald-600"
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
                  <h2 className="text-2xl font-bold text-foreground mb-3">
                    Reading Test
                  </h2>
                  <p className="text-muted-foreground mb-8 leading-relaxed">
                    Practice your reading skills and track your comprehension
                    progress with interactive assessments.
                  </p>
                  <Button
                    onClick={() => {
                      console.log(materials)
                      if (materials.length !== 0) {
                        setIndexMaterial(0)
                        setIndexQuestion(0)
                        resetScore()
                      }
                      router.push('/student/mode')
                    }}
                    size="lg"
                    className="w-full bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white font-semibold py-3 px-6 shadow-xl shadow-emerald-500/25 hover:shadow-2xl transition-all duration-300 transform group-hover:scale-105"
                  >
                    Start Reading Test
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

            {/* Progress Dashboard Card */}
            <Card className="group cursor-pointer border-0 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 bg-gradient-to-br from-card to-card/50 overflow-hidden">
              <div className="h-2 bg-gradient-to-r from-blue-500 to-indigo-600" />
              <CardContent className="p-8">
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-50 to-indigo-100 border-2 border-blue-200 rounded-2xl mb-6 group-hover:scale-110 transition-transform duration-300">
                    <svg
                      className="w-10 h-10 text-blue-600"
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
                  <h2 className="text-2xl font-bold text-foreground mb-3">
                    Progress Dashboard
                  </h2>
                  <p className="text-muted-foreground mb-8 leading-relaxed">
                    Visualize your learning progress with detailed charts and
                    set meaningful goals for your journey.
                  </p>
                  <Button
                    onClick={() => router.push('/student/dashboard')}
                    size="lg"
                    className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-semibold py-3 px-6 shadow-xl shadow-blue-500/25 hover:shadow-2xl transition-all duration-300 transform group-hover:scale-105"
                  >
                    View Dashboard
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

            {/* Resources Card */}
            <Card className="group cursor-pointer border-0 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 bg-gradient-to-br from-card to-card/50 overflow-hidden">
              <div className="h-2 bg-gradient-to-r from-amber-500 to-orange-600" />
              <CardContent className="p-8">
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-amber-50 to-orange-100 border-2 border-amber-200 rounded-2xl mb-6 group-hover:scale-110 transition-transform duration-300">
                    <svg
                      className="w-10 h-10 text-amber-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                      />
                    </svg>
                  </div>
                  <h2 className="text-2xl font-bold text-foreground mb-3">
                    Resources
                  </h2>
                  <p className="text-muted-foreground mb-8 leading-relaxed">
                    Access a curated collection of learning resources designed
                    to boost your skills and knowledge.
                  </p>
                  <Button
                    onClick={() => router.push('/student/resources')}
                    size="lg"
                    className="w-full bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-semibold py-3 px-6 shadow-xl shadow-amber-500/25 hover:shadow-2xl transition-all duration-300 transform group-hover:scale-105"
                  >
                    Explore Resources
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

            {/* Feedback Card */}
            <Card className="group cursor-pointer border-0 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 bg-gradient-to-br from-card to-card/50 overflow-hidden">
              <div className="h-2 bg-gradient-to-r from-pink-500 to-rose-600" />
              <CardContent className="p-8">
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-pink-50 to-rose-100 border-2 border-pink-200 rounded-2xl mb-6 group-hover:scale-110 transition-transform duration-300">
                    <svg
                      className="w-10 h-10 text-pink-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                      />
                    </svg>
                  </div>
                  <h2 className="text-2xl font-bold text-foreground mb-3">
                    Feedback
                  </h2>
                  <p className="text-muted-foreground mb-8 leading-relaxed">
                    Share your thoughts, suggestions, and experiences to help us
                    improve the learning platform.
                  </p>
                  <Button
                    onClick={() => router.push('/student/feedback')}
                    size="lg"
                    className="w-full bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-600 hover:to-rose-700 text-white font-semibold py-3 px-6 shadow-xl shadow-pink-500/25 hover:shadow-2xl transition-all duration-300 transform group-hover:scale-105"
                  >
                    Share Feedback
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
          </section>

          {/* Additional Info Section */}
          <section className="mt-20 text-center">
            <div className="max-w-2xl mx-auto">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-2xl mb-6">
                <svg
                  className="w-8 h-8 text-blue-600"
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
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">
                Ready to Begin Your Learning Journey?
              </h3>
              <p className="text-muted-foreground">
                Choose an option above to start exploring, practicing, or
                tracking your progress. Each feature is designed to help you
                achieve your learning goals effectively.
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}

export default HomePage
