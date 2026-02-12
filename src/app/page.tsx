'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import {
  BookOpen,
  Users,
  ArrowRight,
  Star,
  Sparkles,
  Trophy,
  CheckCircle2,
  Target,
  TrendingUp,
  AlertCircle,
  FileText,
  BarChart3,
  Clock,
  Globe,
  Zap,
} from 'lucide-react'

const HomePage = () => {
  const router = useRouter()

  const handleGetStarted = () => {
    router.push('/login')
  }

  // const stats = [
  //   { label: 'Reading Materials', value: '100+', icon: BookOpen },
  //   { label: 'Active Students', value: '5K+', icon: Users },
  //   { label: 'Success Rate', value: '95%', icon: Trophy },
  //   { label: 'Happy Learners', value: '10K+', icon: Star },
  // ]

  const problems = [
    {
      icon: BookOpen,
      title: 'Limited Access to Learning Materials',
      description:
        'Traditional textbooks are heavy, expensive, and not always accessible. Students struggle to carry books everywhere and access learning content when needed.',
      color: 'bg-red-100 text-red-600',
    },
    {
      icon: AlertCircle,
      title: 'Lack of Engagement',
      description:
        'Static books fail to capture student attention. Without interactive elements, students lose interest and struggle to stay motivated.',
      color: 'bg-orange-100 text-orange-600',
    },
    {
      icon: BarChart3,
      title: 'No Progress Tracking',
      description:
        "Traditional learning makes it difficult to track student progress. Teachers and students can't easily see improvement over time or identify areas that need more attention.",
      color: 'bg-yellow-100 text-yellow-600',
    },
    {
      icon: Clock,
      title: 'One-Size-Fits-All Approach',
      description:
        "Traditional methods don't adapt to individual learning paces. Students who need more time or extra challenges are left behind or unchallenged.",
      color: 'bg-purple-100 text-purple-600',
    },
  ]

  const solutions = [
    {
      icon: Globe,
      title: 'Digital Access Anytime, Anywhere',
      description:
        'Access all learning materials online from any device. No heavy books to carry - your entire curriculum is just a click away, available 24/7.',
      color: 'bg-blue-100 text-blue-600',
    },
    {
      icon: FileText,
      title: 'Structured Learning Path',
      description:
        'Follow a proven learning structure: Pre-test to assess your starting point, interactive lessons to build knowledge, and post-test to measure your growth.',
      color: 'bg-green-100 text-green-600',
    },
    {
      icon: TrendingUp,
      title: 'Real-Time Progress Tracking',
      description:
        "Watch your improvement with detailed progress charts and analytics. See exactly how you're advancing through each lesson and skill area.",
      color: 'bg-indigo-100 text-indigo-600',
    },
    {
      icon: Zap,
      title: 'Interactive & Engaging Content',
      description:
        'Experience traditional book content reimagined as an interactive website. Engaging activities, instant feedback, and gamified elements make learning fun.',
      color: 'bg-cyan-100 text-cyan-600',
    },
    {
      icon: Target,
      title: 'Personalized Learning Experience',
      description:
        "Learn at your own pace with content that adapts to your needs. Take your time with challenging concepts and move ahead when you're ready.",
      color: 'bg-teal-100 text-teal-600',
    },
    {
      icon: CheckCircle2,
      title: 'Comprehensive Assessment',
      description:
        'Pre-tests identify your knowledge gaps, lessons fill them, and post-tests confirm your mastery. Complete learning cycle for better understanding.',
      color: 'bg-emerald-100 text-emerald-600',
    },
  ]

  return (
    <div className="min-h-screen bg-blue-50">
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/images/background.svg')] opacity-5"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-24">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 sm:w-24 sm:h-24 bg-blue-600 rounded-2xl mb-6 sm:mb-8 shadow-lg hover:scale-110 transition-all duration-300 hover:shadow-xl">
              <BookOpen className="w-10 h-10 sm:w-12 sm:h-12 text-white" />
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-slate-900 mb-4 sm:mb-6 leading-tight">
              Welcome to <span className="text-blue-600">T-BRITE</span>
            </h1>

            <div className="max-w-4xl mx-auto mb-6 sm:mb-8">
              <p className="text-xl sm:text-2xl md:text-3xl text-slate-700 leading-relaxed font-medium">
                <span className="font-bold text-blue-600">T</span>echnology-
                <span className="font-bold text-blue-600">B</span>ased{' '}
                <span className="font-bold text-blue-600">R</span>eading for{' '}
                <span className="font-bold text-blue-600">I</span>nteractive{' '}
                <span className="font-bold text-blue-600">T</span>eaching and{' '}
                <span className="font-bold text-blue-600">E</span>ngagement
              </p>
            </div>

            <p className="text-lg sm:text-xl md:text-2xl text-slate-700 max-w-3xl mx-auto mb-4 sm:mb-6 leading-relaxed px-4 font-medium">
              Transforming Traditional Learning into Interactive Digital
              Experiences
            </p>
            <p className="text-base sm:text-lg text-slate-600 max-w-3xl mx-auto mb-8 sm:mb-12 leading-relaxed px-4">
              Experience the best of both worlds: the reliability of traditional
              learning methods with the convenience and engagement of modern
              technology.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <Button
                onClick={handleGetStarted}
                className="w-full sm:w-auto px-8 py-6 text-lg font-semibold bg-blue-600 hover:bg-blue-700 text-white transition-all duration-300 hover:scale-105 hover:shadow-lg group"
              >
                Start Reading Now
              </Button>
            </div>

            {/* <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 max-w-4xl mx-auto">
              {stats.map((stat, index) => (
                <div
                  key={index}
                  className="bg-white rounded-xl p-4 sm:p-6 border border-slate-200 hover:border-blue-300 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="flex flex-col items-center">
                    <stat.icon className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600 mb-2" />
                    <div className="text-2xl sm:text-3xl font-bold text-slate-900 mb-1">
                      {stat.value}
                    </div>
                    <div className="text-xs sm:text-sm text-slate-600 text-center">
                      {stat.label}
                    </div>
                  </div>
                </div>
              ))}
            </div> */}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
        <div className="text-center mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 bg-red-100 text-red-600 px-4 py-2 rounded-full text-sm font-semibold mb-4">
            <AlertCircle className="w-4 h-4" />
            Challenges in Traditional Learning
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-slate-900 mb-4">
            Problems We Solve 🔍
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-slate-600 max-w-3xl mx-auto">
            Traditional learning methods face several challenges that limit
            student engagement and success
          </p>
        </div>

        <div className="grid sm:grid-cols-2 gap-6 sm:gap-8 mb-20">
          {problems.map((problem, index) => (
            <div
              key={index}
              className="bg-white rounded-xl border-2 border-slate-200 p-6 sm:p-8 hover:border-red-300 hover:shadow-xl transition-all duration-300 hover:-translate-y-2 group"
            >
              <div
                className={`w-14 h-14 ${problem.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}
              >
                <problem.icon className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-red-600 transition-colors">
                {problem.title}
              </h3>
              <p className="text-slate-600 leading-relaxed">
                {problem.description}
              </p>
            </div>
          ))}
        </div>

        <div className="text-center mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 bg-green-100 text-green-600 px-4 py-2 rounded-full text-sm font-semibold mb-4">
            <Sparkles className="w-4 h-4" />
            How T-BRITE Helps
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-slate-900 mb-4">
            Our Solutions ✨
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-slate-600 max-w-3xl mx-auto">
            T-BRITE addresses these challenges with innovative features designed
            to enhance learning and engagement
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mb-16">
          {solutions.map((solution, index) => (
            <div
              key={index}
              className="bg-white rounded-xl border-2 border-slate-200 p-6 sm:p-8 hover:border-green-400 hover:shadow-xl transition-all duration-300 hover:-translate-y-2 cursor-pointer group"
            >
              <div
                className={`w-14 h-14 ${solution.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}
              >
                <solution.icon className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-green-600 transition-colors">
                {solution.title}
              </h3>
              <p className="text-slate-600 leading-relaxed">
                {solution.description}
              </p>
            </div>
          ))}
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-8 sm:p-12 lg:p-16 border-2 border-blue-200 shadow-lg mb-16">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900 mb-4">
                Complete Learning Cycle 📚
              </h2>
              <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto">
                T-BRITE follows a structured approach that ensures comprehensive
                learning and measurable progress
              </p>
            </div>
            <div className="grid sm:grid-cols-3 gap-6 mb-8">
              <div className="bg-white rounded-xl p-6 border-2 border-blue-200 text-center">
                <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <FileText className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-lg text-slate-900 mb-2">
                  Pre-Test
                </h3>
                <p className="text-sm text-slate-600">
                  Assess your current knowledge and identify areas for
                  improvement
                </p>
              </div>
              <div className="bg-white rounded-xl p-6 border-2 border-blue-200 text-center">
                <div className="w-12 h-12 bg-green-100 text-green-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <BookOpen className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-lg text-slate-900 mb-2">
                  Interactive Lessons
                </h3>
                <p className="text-sm text-slate-600">
                  Engage with structured content that builds your understanding
                  step by step
                </p>
              </div>
              <div className="bg-white rounded-xl p-6 border-2 border-blue-200 text-center">
                <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Target className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-lg text-slate-900 mb-2">
                  Post-Test
                </h3>
                <p className="text-sm text-slate-600">
                  Measure your growth and confirm mastery of the material
                </p>
              </div>
            </div>
            <div className="bg-white rounded-xl p-6 border-2 border-indigo-200 text-center">
              <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                <BarChart3 className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg text-slate-900 mb-2">
                Progress Tracking
              </h3>
              <p className="text-sm text-slate-600 max-w-2xl mx-auto">
                Monitor your learning journey with detailed analytics and visual
                progress charts that show your improvement over time
              </p>
            </div>
          </div>
        </div>

        <div className="bg-blue-600 rounded-2xl p-8 sm:p-12 lg:p-16 text-center border-4 border-blue-400 shadow-2xl relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <Sparkles className="absolute top-4 left-4 w-12 h-12 text-white animate-pulse" />
            <Star className="absolute top-8 right-8 w-8 h-8 text-white animate-pulse delay-75" />
            <Trophy className="absolute bottom-4 left-8 w-10 h-10 text-white animate-pulse delay-150" />
          </div>
          <div className="relative z-10">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4">
              Ready to Transform Your Learning Experience? ⭐
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Join T-BRITE today and experience the perfect blend of traditional
              learning structure with modern interactive technology. Start your
              journey with pre-tests, master lessons, and track your progress!
            </p>
            <Button
              onClick={handleGetStarted}
              className="px-8 py-6 text-lg font-semibold bg-white text-blue-600 hover:bg-blue-50 transition-all duration-300 hover:scale-105 hover:shadow-xl group"
            >
              Get Started Now
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        </div>
      </div>

      <footer className="bg-white border-t-2 border-slate-200 py-8 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-slate-600 space-y-3">
          <p className="text-sm">
            © 2026 T-BRITE. Technology-Based Reading for Interactive Teaching
            and Engagement.
          </p>
          <p className="text-sm font-medium">
            This website and all rights are owned by Karen Desiree Solilapsi.
          </p>
          <p className="text-xs text-slate-500 max-w-2xl mx-auto">
            By using this site, you agree to our terms of use. All content,
            design, and materials are protected. Unauthorized use, reproduction,
            or distribution is prohibited.
          </p>
        </div>
      </footer>
    </div>
  )
}

export default HomePage
