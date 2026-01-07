'use client'

import { auth, db } from '@/firebase/client_app'
import { useAuthStore } from '@/hooks/useAuthStore'
import { AppUser, UserRole } from '@/interface/user'
import { onAuthStateChanged, User } from 'firebase/auth'
import { doc, getDoc } from 'firebase/firestore'
import { redirect, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export default function AdminPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const { setUser, setIsAuthenticated } = useAuthStore()

  const fetchData = async () => {
    onAuthStateChanged(auth, async (firebaseUser: User | null) => {
      console.log(firebaseUser)
      if (firebaseUser) {
        try {
          const userRef = doc(db, 'users', firebaseUser.uid)
          const userSnap = await getDoc(userRef)

          let user: AppUser

          if (userSnap.exists()) {
            user = userSnap.data() as AppUser
          } else {
            // 🔹 If no Firestore record, create a fallback user object
            user = {
              id: firebaseUser.uid,
              name: firebaseUser.displayName || 'Anonymous',
              email: firebaseUser.email || '',
              createdAt: new Date(firebaseUser.metadata.creationTime || ''),
              role: UserRole.STUDENT,
            }
          }
          setUser(user)
          setIsAuthenticated(true)
          if (user.role === UserRole.STUDENT) {
            router.push('/student')
          }
          setLoading(false)
        } catch (e) {
          console.error('Error initializing auth state: ', e)
        }
      } else {
        setUser(null)
        setIsAuthenticated(false)
        redirect('/login')
      }
    })
  }

  useEffect(() => {
    fetchData()
  }, [])

  const handleNavigation = (path: string) => {
    router.push(path)
  }

  if (loading) {
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
            Loading Admin Panel...
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
          {/* Header Section */}
          <div className="text-center mb-16">
            
            <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-foreground via-blue-600 to-indigo-600 bg-clip-text text-transparent mb-6 leading-tight">
              Admin Dashboard
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Manage students, materials, and view overall progress from one
              centralized dashboard with powerful insights and controls.
            </p>
          </div>

          {/* Admin Cards Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
            {/* Manage Students Card */}
            <Card className="group cursor-pointer border-0 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 bg-gradient-to-br from-card to-card/50 overflow-hidden">
              <div className="h-2 bg-gradient-to-r from-blue-500 to-indigo-600" />
              <CardContent className="p-8 h-full flex flex-col">
                <div className="text-center flex-1 flex flex-col">
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
                        d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
                      />
                    </svg>
                  </div>
                  <h2 className="text-2xl font-bold text-foreground mb-3">
                    Student Management
                  </h2>
                  <p className="text-muted-foreground mb-8 leading-relaxed flex-1">
                    View, add, or manage student details and performance
                    records. Track individual progress and provide personalized
                    support.
                  </p>
                  <Button
                    onClick={() => handleNavigation('/admin/students')}
                    size="lg"
                    className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-semibold py-3 px-6 shadow-xl shadow-blue-500/25 hover:shadow-2xl transition-all duration-300 transform group-hover:scale-105"
                  >
                    Manage Students
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

            {/* Manage Materials Card */}
            <Card className="group cursor-pointer border-0 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 bg-gradient-to-br from-card to-card/50 overflow-hidden">
              <div className="h-2 bg-gradient-to-r from-emerald-500 to-green-600" />
              <CardContent className="p-8 h-full flex flex-col">
                <div className="text-center flex-1 flex flex-col">
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
                    Content Management
                  </h2>
                  <p className="text-muted-foreground mb-8 leading-relaxed flex-1">
                    Add, edit, or delete reading materials for your students.
                    Create engaging content that matches learning objectives.
                  </p>
                  <Button
                    onClick={() => handleNavigation('/admin/materials')}
                    size="lg"
                    className="w-full bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white font-semibold py-3 px-6 shadow-xl shadow-emerald-500/25 hover:shadow-2xl transition-all duration-300 transform group-hover:scale-105"
                  >
                    Manage Materials
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

            {/* View Summary Card */}
            <Card className="group cursor-pointer border-0 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 bg-gradient-to-br from-card to-card/50 overflow-hidden">
              <div className="h-2 bg-gradient-to-r from-purple-500 to-violet-600" />
              <CardContent className="p-8 h-full flex flex-col">
                <div className="text-center flex-1 flex flex-col">
                  <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-purple-50 to-violet-100 border-2 border-purple-200 rounded-2xl mb-6 group-hover:scale-110 transition-transform duration-300">
                    <svg
                      className="w-10 h-10 text-purple-600"
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
                    Analytics & Insights
                  </h2>
                  <p className="text-muted-foreground mb-8 leading-relaxed flex-1">
                    Analyze overall student performance and material
                    effectiveness. Get data-driven insights to improve learning
                    outcomes.
                  </p>
                  <Button
                    onClick={() => handleNavigation('/admin/summary')}
                    size="lg"
                    className="w-full bg-gradient-to-r from-purple-500 to-violet-600 hover:from-purple-600 hover:to-violet-700 text-white font-semibold py-3 px-6 shadow-xl shadow-purple-500/25 hover:shadow-2xl transition-all duration-300 transform group-hover:scale-105"
                  >
                    View Summary
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

            {/* Feedback Management Card */}
            <Card className="group cursor-pointer border-0 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 bg-gradient-to-br from-card to-card/50 overflow-hidden">
              <div className="h-2 bg-gradient-to-r from-pink-500 to-rose-600" />
              <CardContent className="p-8 h-full flex flex-col">
                <div className="text-center flex-1 flex flex-col">
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
                    Feedback Management
                  </h2>
                  <p className="text-muted-foreground mb-8 leading-relaxed flex-1">
                    Monitor and analyze student feedback to improve the learning
                    experience and platform quality. Track satisfaction metrics.
                  </p>
                  <Button
                    onClick={() => handleNavigation('/admin/feedback')}
                    size="lg"
                    className="w-full bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-600 hover:to-rose-700 text-white font-semibold py-3 px-6 shadow-xl shadow-pink-500/25 hover:shadow-2xl transition-all duration-300 transform group-hover:scale-105"
                  >
                    View Feedback
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
          </div>

          {/* Info Section */}
          <div className="mt-20 text-center">
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
                Need Help?
              </h3>
              <p className="text-muted-foreground">
                Explore the admin panel to manage your learning platform
                effectively. Each section provides powerful tools to enhance
                student learning outcomes.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
