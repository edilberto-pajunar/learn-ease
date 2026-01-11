'use client'

import { useLessonStore } from '@/hooks/useLessonStore'
import { useEffect, use } from 'react'
import LessonPage from '../components/LessonPage'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'

export default function LessonDetailPage({
  params,
}: {
  params: Promise<{ lessonId: string }>
}) {
  const { lessonId } = use(params)
  const { lessons, setLessons, loading } = useLessonStore()
  const router = useRouter()

  useEffect(() => {
    setLessons()
  }, [setLessons])

  const lesson = lessons.find((l) => l.id === lessonId)

  if (loading && lessons.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="text-gray-600">Loading lesson...</p>
        </div>
      </div>
    )
  }

  if (!lesson) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <Button
          variant="ghost"
          onClick={() => router.push('/student/lessons')}
          className="mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Lessons
        </Button>
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Lesson not found
          </h2>
          <p className="text-gray-600 mb-4">
            The lesson you&apos;re looking for doesn&apos;t exist or has been
            removed.
          </p>
          <Button onClick={() => router.push('/student/lessons')}>
            Go to Lessons
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-4 max-w-6xl">
      <Button
        variant="ghost"
        onClick={() => router.push('/student/lessons')}
        className="mb-4"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Lessons
      </Button>
      <LessonPage lesson={lesson} />
    </div>
  )
}
