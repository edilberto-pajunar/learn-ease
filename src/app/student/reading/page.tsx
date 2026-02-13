'use client'

import { FC, useEffect, useRef, useState, Suspense } from 'react'
import { useReadStore } from '@/hooks/useReadStore'
import { useAuthStore } from '@/hooks/useAuthStore'
import { wordCount } from '@/app/utils/wordCount'
import FunFact from './component/FunFact'
import QuestionCard from './component/QuestionCard'
import TimeCard from './component/TimeCard'
import { useAdminStore } from '@/hooks/useAdminStore'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
  Loader2,
  BookOpen,
  AlertCircle,
  AlertTriangle,
  HelpCircle,
  Lock,
} from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'
import ReadingCompletedDialog from './component/ReadingCompletedDialog'

const ReadingPageContent: FC = () => {

  const {
    materials,
    indexMaterial,
    miscues,
    duration,
    fetchMaterials,
    materialBatch,
    checkIfTestTaken,
    hasAlreadyTakenTest,
  } = useReadStore()
  const { quarter, getQuarter } = useAdminStore()
  const { user } = useAuthStore()
  const router = useRouter()
  const searchParams = useSearchParams()
  const testType = searchParams.get('testType') || 'preTest'

  const [formError] = useState<string | null>(null)
  const [showCompletionDialog, setShowCompletionDialog] = useState(false)
  const questionsSectionRef = useRef<HTMLDivElement>(null)
  const readingSectionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!quarter) {
      getQuarter()
    }
  }, [quarter, getQuarter])

  useEffect(() => {
    if (user?.id && testType) {
      checkIfTestTaken(user.id, testType as 'preTest' | 'postTest')
    }
  }, [user?.id, testType, checkIfTestTaken])

  useEffect(() => {
    if (quarter?.quarter) {
      fetchMaterials('Q1')
    }
  }, [fetchMaterials, quarter?.quarter])

  if (hasAlreadyTakenTest) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-blue-50/30 to-indigo-50/50 flex items-center justify-center">
        <Card className="max-w-md border-0 shadow-lg bg-white/80 backdrop-blur-sm">
          <CardContent className="p-8 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-amber-100 rounded-2xl shadow-lg mb-6">
              <Lock className="w-8 h-8 text-amber-600" />
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-2">
              Test Already Completed
            </h2>
            <p className="text-muted-foreground mb-6">
              You have already completed this {testType === 'preTest' ? 'pre-test' : 'post-test'}. You can only take each test once.
            </p>
            <Button
              onClick={() => router.push('/student/mode')}
              className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700"
            >
              Back to Tests
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (materials.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-blue-50/30 to-indigo-50/50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-2xl shadow-lg mb-6">
            <Loader2 className="w-8 h-8 text-white animate-spin" />
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-2">
            Loading Materials
          </h2>
          <p className="text-muted-foreground">
            Please wait while we prepare your reading materials...
          </p>
        </div>
      </div>
    )
  }

  const studentId = user?.id
  const material = materials[indexMaterial]


  return (
    <>
      <ReadingCompletedDialog
        isOpen={showCompletionDialog}
        materialBatch={materialBatch || ''}
        totalMaterials={materials.length}
        onClose={() => setShowCompletionDialog(false)}
      />

      <div className="min-h-screen bg-gradient-to-br from-background via-blue-50/30 to-indigo-50/50">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-grid-pattern opacity-[0.02]" />

        <div className="relative z-10 container mx-auto px-6 py-8 max-w-6xl">
          {/* Header Section */}
          <div className="mb-8">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              {/* Title and Quarter */}
              <div className="flex-1">
                <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-foreground via-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">
                  {testType === 'preTest' ? 'Pre-Test' : 'Post-Test'} Assessment
                </h1>
                <p className="text-lg text-muted-foreground">
                  {quarter?.overview1 || 'Complete the reading materials and answer all questions'}
                </p>
              </div>


            </div>
          </div>

          {/* Progress and Stats */}
          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm mb-8">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                {/* Word Count */}
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-xl border border-blue-200">
                    <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                      <BookOpen className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <span className="text-2xl font-bold text-blue-600">
                        {wordCount(material.text)}
                      </span>
                      <p className="text-sm text-muted-foreground">words</p>
                    </div>
                  </div>
                </div>

                {/* Progress Indicator */}
                <div className="flex items-center gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-foreground">
                      {indexMaterial + 1}
                    </div>
                    <div className="text-sm text-muted-foreground">Current</div>
                  </div>
                  <div className="text-muted-foreground">of</div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-foreground">
                      {materials.length}
                    </div>
                    <div className="text-sm text-muted-foreground">Total</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Show Form Error if exists */}
          {formError && (
            <Card className="border-red-200 bg-red-50 mb-6">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <AlertCircle className="w-5 h-5 text-red-600" />
                  Question
                  <span className="text-red-600 font-medium">{formError}</span>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Reading Passage */}
          <div ref={readingSectionRef}>
            <TimeCard
              material={material}
              onFinishReading={() =>
                questionsSectionRef.current?.scrollIntoView({ behavior: 'smooth' })
              }
            />
          </div>

          {/* Miscues Display */}
          {miscues.length > 0 && (
            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm mb-8">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-amber-600" />
                  Reading Miscues
                </h3>
                <div className="flex flex-wrap gap-2">
                  {miscues.map((word, index) => (
                    <span
                      key={index}
                      className="bg-amber-100 text-amber-800 px-3 py-2 rounded-lg text-sm font-medium border border-amber-200 hover:bg-amber-200 transition-colors duration-200 pointer-events-none"
                    >
                      {word}
                    </span>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Comprehension Questions */}
          <Card
            ref={questionsSectionRef}
            className="border-0 shadow-lg bg-white/80 backdrop-blur-sm mb-8"
          >
            <CardContent className="p-6">
              <div className="border-b border-border/50 pb-4 mb-6">
                <h2 className="text-2xl font-bold text-foreground mb-2 flex items-center gap-3">
                  <HelpCircle className="w-6 h-6 text-blue-600" />
                  Questions
                </h2>
                <p className="text-muted-foreground">
                  Answer the following questions to test your understanding of
                  the reading passage. This will test your comprehension and
                  vocabulary of the reading passage
                </p>
              </div>

              {duration ? (
                <QuestionCard
                  questions={material.questions}
                  studentId={studentId!}
                  setShowCompletionDialog={setShowCompletionDialog}
                  onFinishMaterial={() =>
                    readingSectionRef.current?.scrollIntoView({ behavior: 'smooth' })
                  }
                />
              ) : (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <AlertTriangle className="w-8 h-8 text-amber-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    Complete the Reading First
                  </h3>
                  <p className="text-muted-foreground">
                    Please finish reading the passage before attempting the
                    questions.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Fun Facts Section */}
          <FunFact />
        </div>
      </div>
    </>
  )
}

const ReadingPage: FC = () => {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gradient-to-br from-background via-blue-50/30 to-indigo-50/50 flex items-center justify-center">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-2xl shadow-lg mb-6">
              <Loader2 className="w-8 h-8 text-white animate-spin" />
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-2">
              Loading Page
            </h2>
            <p className="text-muted-foreground">
              Please wait while we prepare the page...
            </p>
          </div>
        </div>
      }
    >
      <ReadingPageContent />
    </Suspense>
  )
}

export default ReadingPage
