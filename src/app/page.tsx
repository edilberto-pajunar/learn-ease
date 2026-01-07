'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import {
  BookOpen,
  Target,
  TrendingUp,
  Users,
  BookMarked,
  Lightbulb,
  GraduationCap,
  ArrowRight,
} from 'lucide-react'

const HomePage = () => {
  const router = useRouter()

  const handleGetStarted = () => {
    router.push('/login')
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="relative overflow-hidden bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-24">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 sm:w-24 sm:h-24 bg-blue-600 rounded-2xl mb-6 sm:mb-8">
              <BookOpen className="w-10 h-10 sm:w-12 sm:h-12 text-white" />
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-slate-900 mb-4 sm:mb-6 leading-tight">
              Welcome to T-BRITE
            </h1>

            <div className="max-w-4xl mx-auto mb-6 sm:mb-8">
              <p className="text-xl sm:text-2xl md:text-3xl text-slate-700 leading-relaxed">
                <span className="font-bold text-blue-600">T</span>echnology-
                <span className="font-bold text-blue-600">B</span>ased{' '}
                <span className="font-bold text-blue-600">R</span>eading for{' '}
                <span className="font-bold text-blue-600">I</span>nteractive{' '}
                <span className="font-bold text-blue-600">T</span>eaching and{' '}
                <span className="font-bold text-blue-600">E</span>ngagement
              </p>
            </div>

            <p className="text-base sm:text-lg md:text-xl text-slate-600 max-w-3xl mx-auto mb-8 sm:mb-12 leading-relaxed px-4">
              Your comprehensive platform for enhancing reading comprehension
              and tracking academic progress through innovative,
              technology-driven learning experiences.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button
                onClick={handleGetStarted}
                className="w-full sm:w-auto px-8 py-6 text-lg font-semibold bg-blue-600 hover:bg-blue-700 text-white transition-colors"
              >
                Get Started Today
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              <p className="text-sm text-slate-500">
                Join educators and students improving reading skills
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-slate-900 mb-4">
            Why Choose T-BRITE?
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-slate-600 max-w-3xl mx-auto">
            A powerful reading assessment platform designed for both educators
            and students
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mb-16">
          {[
            {
              icon: BookMarked,
              title: 'Interactive Reading Materials',
              description:
                'Access a comprehensive library of reading materials with built-in comprehension assessments and vocabulary exercises.',
            },
            {
              icon: Target,
              title: 'Skill-Based Evaluation',
              description:
                'Track and evaluate reading proficiency across multiple skill areas including comprehension, vocabulary, and fluency.',
            },
            {
              icon: TrendingUp,
              title: 'Real-Time Progress Tracking',
              description:
                'Monitor student performance with detailed analytics, submission history, and visual progress indicators.',
            },
            {
              icon: Users,
              title: 'Teacher Dashboard',
              description:
                'Comprehensive admin tools for managing students, materials, and viewing aggregated performance data.',
            },
            {
              icon: Lightbulb,
              title: 'Personalized Learning',
              description:
                'Adaptive assessments that adjust to individual reading levels and provide targeted feedback for improvement.',
            },
            {
              icon: GraduationCap,
              title: 'Educational Excellence',
              description:
                'Built on research-based methodologies to support effective reading instruction and student achievement.',
            },
          ].map((feature, index) => (
            <div
              key={index}
              className="bg-white rounded-lg border border-slate-200 p-6 sm:p-8 hover:border-blue-300 hover:shadow-lg transition-all"
            >
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <feature.icon className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-3">
                {feature.title}
              </h3>
              <p className="text-slate-600 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        <div className="bg-blue-50 rounded-2xl p-8 sm:p-12 lg:p-16 text-center border border-blue-100">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900 mb-4">
            Ready to Transform Reading Education?
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-slate-700 mb-8 max-w-2xl mx-auto">
            Join T-BRITE today and experience the future of interactive reading
            assessment and instruction.
          </p>
          <Button
            onClick={handleGetStarted}
            className="px-8 py-6 text-lg font-semibold bg-blue-600 hover:bg-blue-700 text-white transition-colors"
          >
            Start Your Journey
            <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
        </div>
      </div>

      <footer className="bg-white border-t border-slate-200 py-8">
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
