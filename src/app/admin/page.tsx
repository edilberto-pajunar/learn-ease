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
import {
  Loader2,
  Users,
  BookOpen,
  BarChart3,
  MessageSquare,
  ArrowRight,
  Info,
} from 'lucide-react'

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
            <Loader2 className="w-8 h-8 text-white animate-spin" />
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-7xl mx-auto">
            {/* Manage Students Card */}
            <Card className="group cursor-pointer border-0 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 bg-gradient-to-br from-card to-card/50 overflow-hidden">
              <div className="h-2 bg-gradient-to-r from-blue-500 to-indigo-600" />
              <CardContent className="p-8 h-full flex flex-col">
                <div className="text-center flex-1 flex flex-col">
                  <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-50 to-indigo-100 border-2 border-blue-200 rounded-2xl mb-6 group-hover:scale-110 transition-transform duration-300">
                    <Users className="w-10 h-10 text-blue-600" />
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
                    <ArrowRight className="w-5 h-5 ml-2" />
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
                    <BookOpen className="w-10 h-10 text-emerald-600" />
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
                    <ArrowRight className="w-5 h-5 ml-2" />
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
                    <BarChart3 className="w-10 h-10 text-purple-600" />
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
                    <ArrowRight className="w-5 h-5 ml-2" />
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
                    <MessageSquare className="w-10 h-10 text-pink-600" />
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
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Info Section */}
          <div className="mt-20 text-center">
            <div className="max-w-2xl mx-auto">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-2xl mb-6">
                <Info className="w-8 h-8 text-blue-600" />
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
