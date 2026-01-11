'use client'

import { useLessonStore } from '@/hooks/useLessonStore'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { BookOpen, ArrowRight } from 'lucide-react'

export default function LessonsPage() {
  const { setLessons, lessons, loading } = useLessonStore()
  const router = useRouter()

  useEffect(() => {
    setLessons()
  }, [setLessons])

  if (loading && lessons.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="text-gray-600">Loading lessons...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Lessons</h1>
        <p className="text-gray-600">Select a lesson to start learning</p>
      </div>

      {lessons.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <BookOpen className="h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No lessons available
            </h3>
            <p className="text-gray-600 text-center">
              Check back later for new lessons.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {lessons.map((lesson) => (
            <Card
              key={lesson.id}
              className="hover:shadow-lg transition-shadow duration-200 cursor-pointer"
              onClick={() =>
                lesson.id && router.push(`/student/lessons/${lesson.id}`)
              }
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    {lesson.chapter && (
                      <div className="inline-flex items-center gap-2 px-2 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-medium mb-2 border border-blue-200">
                        <BookOpen className="w-3 h-3" />
                        {lesson.chapter === 'Q1' ? 'Chapter 1' : 'Chapter 2'}
                      </div>
                    )}
                    <CardTitle className="text-lg font-semibold text-gray-900 mb-2">
                      {lesson.title || 'Untitled Lesson'}
                    </CardTitle>
                    {lesson.overview && (
                      <p className="text-sm text-gray-600 line-clamp-2">
                        {lesson.overview}
                      </p>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="text-xs text-gray-500">
                    {lesson.contents?.length || 0} content section
                    {(lesson.contents?.length || 0) !== 1 ? 's' : ''}
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation()
                      if (lesson.id) {
                        router.push(`/student/lessons/${lesson.id}`)
                      }
                    }}
                    className="flex items-center gap-1"
                  >
                    View
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
