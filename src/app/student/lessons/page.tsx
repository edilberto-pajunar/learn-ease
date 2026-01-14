'use client'

import { useLessonStore } from '@/hooks/useLessonStore'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { BookOpen, ArrowRight } from 'lucide-react'

export default function LessonsPage() {
  const { setLessons, lessons, loading } = useLessonStore()
  const router = useRouter()
  const [chapterFilter, setChapterFilter] = useState<string>('all')

  useEffect(() => {
    setLessons()
  }, [setLessons])

  const filteredLessons = lessons.filter((lesson) => {
    if (chapterFilter === 'all') return true
    return lesson.chapter === chapterFilter
  })

  const groupedLessons = filteredLessons.reduce(
    (acc, lesson) => {
      const chapter = lesson.chapter || 'other'
      if (!acc[chapter]) {
        acc[chapter] = []
      }
      acc[chapter].push(lesson)
      return acc
    },
    {} as Record<string, typeof filteredLessons>,
  )

  Object.keys(groupedLessons).forEach((chapter) => {
    groupedLessons[chapter].sort((a, b) => {
      if (a.lesson && b.lesson) {
        return a.lesson - b.lesson
      }
      if (a.lesson) return -1
      if (b.lesson) return 1
      return 0
    })
  })

  const chapterOrder = ['Q1', 'Q2', 'other']
  const sortedChapters = chapterOrder.filter((ch) => groupedLessons[ch]?.length)

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

      {lessons.length > 0 && (
        <div className="mb-6">
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-gray-700">
              Filter by Chapter:
            </span>
            <div className="flex gap-2">
              <Button
                variant={chapterFilter === 'all' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setChapterFilter('all')}
                className={
                  chapterFilter === 'all' ? 'bg-blue-600 hover:bg-blue-700' : ''
                }
              >
                All
              </Button>
              <Button
                variant={chapterFilter === 'Q1' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setChapterFilter('Q1')}
                className={
                  chapterFilter === 'Q1' ? 'bg-blue-600 hover:bg-blue-700' : ''
                }
              >
                Chapter 1
              </Button>
              <Button
                variant={chapterFilter === 'Q2' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setChapterFilter('Q2')}
                className={
                  chapterFilter === 'Q2' ? 'bg-blue-600 hover:bg-blue-700' : ''
                }
              >
                Chapter 2
              </Button>
            </div>
          </div>
        </div>
      )}

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
        <div className="space-y-8">
          {sortedChapters.map((chapter) => {
            const chapterLessons = groupedLessons[chapter]
            const chapterName =
              chapter === 'Q1'
                ? 'Chapter 1'
                : chapter === 'Q2'
                  ? 'Chapter 2'
                  : 'Other Lessons'

            return (
              <div key={chapter}>
                <div className="mb-4">
                  <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                    <BookOpen className="w-6 h-6 text-blue-600" />
                    {chapterName}
                    <span className="text-base font-normal text-gray-500">
                      ({chapterLessons.length} lesson
                      {chapterLessons.length !== 1 ? 's' : ''})
                    </span>
                  </h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {chapterLessons.map((lesson) => (
                    <Card
                      key={lesson.id}
                      className="hover:shadow-lg transition-shadow duration-200 cursor-pointer"
                      onClick={() =>
                        lesson.id &&
                        router.push(`/student/lessons/${lesson.id}`)
                      }
                    >
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            {lesson.lesson && (
                              <div className="inline-flex items-center px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium border border-gray-200 mb-2">
                                Lesson {lesson.lesson}
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
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
