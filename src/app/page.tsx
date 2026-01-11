'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import {
  BookOpen,
  Users,
  BookMarked,
  Lightbulb,
  ArrowRight,
  Star,
  Sparkles,
  Trophy,
  Zap,
  CheckCircle2,
  Play,
  Target,
  TrendingUp,
} from 'lucide-react'

const HomePage = () => {
  const router = useRouter()

  const handleGetStarted = () => {
    router.push('/login')
  }

  const stats = [
    { label: 'Reading Materials', value: '100+', icon: BookOpen },
    { label: 'Active Students', value: '5K+', icon: Users },
    { label: 'Success Rate', value: '95%', icon: Trophy },
    { label: 'Happy Learners', value: '10K+', icon: Star },
  ]

  const features = [
    {
      icon: BookMarked,
      title: 'Fun Reading Adventures',
      description:
        'Dive into exciting stories and articles that make reading feel like an adventure, not homework!',
      color: 'bg-blue-100 text-blue-600',
    },
    {
      icon: Target,
      title: 'Level Up Your Skills',
      description:
        'Master reading like a pro! Track your progress and watch your skills grow with every story you read.',
    },
    {
      icon: TrendingUp,
      title: 'See Your Progress',
      description:
        'Watch your reading superpowers grow! Get cool charts and badges that show how awesome you&apos;re becoming.',
    },
    {
      icon: Zap,
      title: 'Instant Feedback',
      description:
        'Get helpful tips right away! Know what you did great and how to become even better at reading.',
    },
    {
      icon: Lightbulb,
      title: 'Learn Your Way',
      description:
        'Every story adapts to you! Read at your own pace and level - no pressure, just fun learning.',
    },
    {
      icon: Sparkles,
      title: 'Earn Rewards',
      description:
        'Unlock achievements, collect badges, and celebrate every milestone on your reading journey!',
    },
  ]

  const benefits = [
    'Read at your own pace',
    'Get instant feedback',
    'Track your progress',
    'Earn cool badges',
    'Access anytime, anywhere',
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
              Turn reading into an adventure! 🚀
            </p>
            <p className="text-base sm:text-lg text-slate-600 max-w-3xl mx-auto mb-8 sm:mb-12 leading-relaxed px-4">
              Join thousands of students who are leveling up their reading
              skills with fun, interactive stories and games.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <Button
                onClick={handleGetStarted}
                className="w-full sm:w-auto px-8 py-6 text-lg font-semibold bg-blue-600 hover:bg-blue-700 text-white transition-all duration-300 hover:scale-105 hover:shadow-lg group"
              >
                Start Reading Now
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 max-w-4xl mx-auto">
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
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
        <div className="text-center mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-600 px-4 py-2 rounded-full text-sm font-semibold mb-4">
            <Sparkles className="w-4 h-4" />
            Why Students Love T-BRITE
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-slate-900 mb-4">
            Learning Made Fun! 🎉
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-slate-600 max-w-3xl mx-auto">
            Discover why thousands of students choose T-BRITE to become reading
            champions
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mb-16">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white rounded-xl border-2 border-slate-200 p-6 sm:p-8 hover:border-blue-400 hover:shadow-xl transition-all duration-300 hover:-translate-y-2 cursor-pointer group"
            >
              <div
                className={`w-14 h-14 ${feature.color || 'bg-blue-100 text-blue-600'} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}
              >
                <feature.icon className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-blue-600 transition-colors">
                {feature.title}
              </h3>
              <p className="text-slate-600 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-2xl p-8 sm:p-12 lg:p-16 border-2 border-blue-200 shadow-lg mb-16">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900 mb-4">
                What You&apos;ll Get 🎁
              </h2>
            </div>
            <div className="grid sm:grid-cols-2 gap-4 mb-8">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-center gap-3">
                  <CheckCircle2 className="w-6 h-6 text-blue-600 flex-shrink-0" />
                  <span className="text-lg text-slate-700 font-medium">
                    {benefit}
                  </span>
                </div>
              ))}
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
              Ready to Become a Reading Superstar? ⭐
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Join T-BRITE today and start your epic reading journey! Every
              story is a new adventure waiting for you.
            </p>
            <Button
              onClick={handleGetStarted}
              className="px-8 py-6 text-lg font-semibold bg-white text-blue-600 hover:bg-blue-50 transition-all duration-300 hover:scale-105 hover:shadow-xl group"
            >
              Start Your Adventure Now
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        </div>
      </div>

      <footer className="bg-white border-t-2 border-slate-200 py-8 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-slate-600">
          <p className="text-sm">
            © 2026 T-BRITE. Technology-Based Reading for Interactive Teaching
            and Engagement.
          </p>
        </div>
      </footer>
    </div>
  )
}

export default HomePage
