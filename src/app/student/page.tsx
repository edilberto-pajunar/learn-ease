'use client'

import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/hooks/useAuthStore'
import { useReadStore } from '@/hooks/useReadStore'
import { useAdminStore } from '@/hooks/useAdminStore'
import { useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  BookOpen,
  BarChart3,
  FolderOpen,
  MessageSquare,
  ArrowRight,
  Sparkles,
  Star,
  Loader2,
} from 'lucide-react'

const HomePage: React.FC = () => {
  const { user } = useAuthStore()
  const { getQuarter } = useAdminStore()
  const router = useRouter()

  useEffect(() => {
    getQuarter()
  }, [])

  const { materials, setIndexMaterial, setIndexQuestion, resetScore } =
    useReadStore()

  if (!user) {
    return (
      <div className="min-h-screen bg-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-2xl shadow-lg mb-6 animate-pulse">
            <Loader2 className="w-8 h-8 text-white animate-spin" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">
            Loading Your Dashboard...
          </h2>
          <p className="text-slate-600">
            Please wait while we prepare your learning space
          </p>
        </div>
      </div>
    )
  }

  const cards = [
    {
      id: 1,
      icon: BookOpen,
      title: 'Start Reading Adventure',
      description:
        'Dive into exciting stories and level up your reading skills! Practice with interactive assessments and watch yourself improve.',
      color: 'bg-emerald-600',
      iconBg: 'bg-emerald-100',
      iconColor: 'text-emerald-600',
      borderColor: 'border-emerald-300',
      hoverBorder: 'hover:border-emerald-400',
      action: () => {
        console.log(materials)
        if (materials.length !== 0) {
          setIndexMaterial(0)
          setIndexQuestion(0)
          resetScore()
        }
        router.push('/student/mode')
      },
      buttonText: 'Start Reading Now',
      badge: 'Most Popular',
    },
    {
      id: 2,
      icon: BarChart3,
      title: 'Track Your Progress',
      description:
        'See how awesome you are becoming! Check out cool charts, stats, and watch your reading superpowers grow.',
      color: 'bg-blue-600',
      iconBg: 'bg-blue-100',
      iconColor: 'text-blue-600',
      borderColor: 'border-blue-300',
      hoverBorder: 'hover:border-blue-400',
      action: () => router.push('/student/score'),
      buttonText: 'View Dashboard',
      badge: 'Analytics',
    },
    {
      id: 3,
      icon: FolderOpen,
      title: 'Explore Resources',
      description:
        'Discover amazing learning materials! Access curated resources designed to boost your skills and knowledge.',
      color: 'bg-amber-600',
      iconBg: 'bg-amber-100',
      iconColor: 'text-amber-600',
      borderColor: 'border-amber-300',
      hoverBorder: 'hover:border-amber-400',
      action: () => router.push('/student/resources'),
      buttonText: 'Explore Now',
      badge: 'Library',
    },
    {
      id: 4,
      icon: MessageSquare,
      title: 'Share Your Thoughts',
      description:
        'Help us make T-BRITE even better! Share your feedback, ideas, and experiences with our team.',
      color: 'bg-pink-600',
      iconBg: 'bg-pink-100',
      iconColor: 'text-pink-600',
      borderColor: 'border-pink-300',
      hoverBorder: 'hover:border-pink-400',
      action: () => router.push('/student/feedback'),
      buttonText: 'Give Feedback',
      badge: 'Community',
    },
  ]

  return (
    <div className="min-h-screen bg-blue-50">
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/images/background.svg')] opacity-5"></div>
        <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
          {/* Welcome Section */}
          <section className="text-center mb-12 sm:mb-16">
            <div className="mb-6 sm:mb-8">
              <div className="inline-flex items-center justify-center w-20 h-20 sm:w-24 sm:h-24 bg-blue-600 rounded-3xl shadow-xl mb-6 hover:scale-110 transition-transform duration-300">
                <BookOpen className="w-10 h-10 sm:w-12 sm:h-12 text-white" />
              </div>
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-slate-900 mb-4 sm:mb-6 leading-tight">
              Welcome back,{' '}
              <span className="text-blue-600">{user.name || 'Student'}!</span>{' '}
              👋
            </h1>
            <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-600 px-4 py-2 rounded-full text-sm font-semibold mb-4">
              <Sparkles className="w-4 h-4" />
              Ready to Level Up?
            </div>
            <p className="text-lg sm:text-xl md:text-2xl text-slate-700 max-w-3xl mx-auto leading-relaxed mb-4">
              <span className="font-bold text-blue-600">T</span>echnology-
              <span className="font-bold text-blue-600">B</span>ased{' '}
              <span className="font-bold text-blue-600">R</span>eading for{' '}
              <span className="font-bold text-blue-600">I</span>nteractive{' '}
              <span className="font-bold text-blue-600">T</span>eaching and{' '}
              <span className="font-bold text-blue-600">E</span>ngagement
            </p>
            <p className="text-base sm:text-lg text-slate-600 max-w-3xl mx-auto leading-relaxed">
              Your personalized learning hub where every story is an adventure
              and every challenge makes you stronger!
            </p>
          </section>

          {/* Cards Section */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 max-w-6xl mx-auto mb-12">
            {cards.map((card) => (
              <Card
                key={card.id}
                className={`group cursor-pointer border-2 bg-white shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden relative ${card.borderColor} ${card.hoverBorder}`}
              >
                <div className={`h-2 ${card.color}`} />
                <CardContent className="p-6 sm:p-8">
                  <div className="text-center">
                    <div className="relative mb-6">
                      <div
                        className={`inline-flex items-center justify-center w-20 h-20 ${card.iconBg} border-2 ${card.borderColor} rounded-2xl mb-4 group-hover:scale-110 transition-transform duration-300`}
                      >
                        <card.icon className={`w-10 h-10 ${card.iconColor}`} />
                      </div>
                      {card.badge && (
                        <div className="absolute -top-2 -right-2 sm:-right-4">
                          <span className="inline-flex items-center gap-1 bg-blue-100 text-blue-600 text-xs font-bold px-2 py-1 rounded-full border border-blue-200">
                            <Star className="w-3 h-3" />
                            {card.badge}
                          </span>
                        </div>
                      )}
                    </div>
                    <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-3 group-hover:text-blue-600 transition-colors">
                      {card.title}
                    </h2>
                    <p className="text-slate-600 mb-6 sm:mb-8 leading-relaxed text-sm sm:text-base">
                      {card.description}
                    </p>
                    <Button
                      onClick={card.action}
                      size="lg"
                      className={`w-full ${card.color} hover:opacity-90 text-white font-semibold py-3 px-6 shadow-lg hover:shadow-xl transition-all duration-300 transform group-hover:scale-105`}
                    >
                      {card.buttonText}
                      <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </section>
        </div>
      </div>
    </div>
  )
}

export default HomePage
