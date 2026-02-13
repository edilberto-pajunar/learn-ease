'use client'

import { useState, useEffect } from 'react'
import { Lesson } from '@/interface/lesson'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { BookOpen, CheckCircle2, Circle, XCircle, HelpCircle } from 'lucide-react'
import ContentSection from './ContentSection'
import MaterialSection from './MaterialSection'
import { useLessonStore } from '@/hooks/useLessonStore'
import { useAuthStore } from '@/hooks/useAuthStore'
import { lessonService } from '@/services/lessonService'
import { useRouter } from 'next/navigation'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '@/firebase/client_app'

export default function LessonPage({
  lesson,
  filteredLessons,
}: {
  lesson: Lesson
  filteredLessons?: Lesson[]
}) {
  const { lessons: allLessons, setLessons } = useLessonStore()
  const { user } = useAuthStore()
  const router = useRouter()
  
  const lessons = filteredLessons || allLessons

  const [expandedExamples, setExpandedExamples] = useState<Set<string>>(
    new Set(),
  )
  const [highlightedText, setHighlightedText] = useState<string | null>(null)
  const [completedSections, setCompletedSections] = useState<Set<string>>(
    new Set(),
  )
  const [bookmarkedSections, setBookmarkedSections] = useState<Set<string>>(
    new Set(),
  )
  const [additionalExamples, setAdditionalExamples] = useState<
    Record<string, Array<{ example: string; explanation: string }>>
  >({})
  const [activitySelections, setActivitySelections] = useState<
    Record<number, string>
  >({})
  const [activityChecked, setActivityChecked] = useState<
    Record<number, 'correct' | 'incorrect' | null>
  >({})

  useEffect(() => {
    setLessons()
  }, [setLessons])

  useEffect(() => {
    const loadProgress = async () => {
      if (!user?.id || !lesson.id) return

      try {
        const progressRef = doc(
          db,
          'users',
          user.id,
          'lessonProgress',
          lesson.id,
        )
        const progressDoc = await getDoc(progressRef)

        if (progressDoc.exists()) {
          const progress = progressDoc.data()
          const completedIds = new Set<string>()
          if (progress.contents && Array.isArray(progress.contents)) {
            progress.contents.forEach(
              (content: { id: string; completed: boolean }) => {
                if (content.completed && content.id) {
                  completedIds.add(content.id)
                }
              },
            )
          }
          setCompletedSections(completedIds)
        }
      } catch (error) {
        console.error('Error loading progress:', error)
      }
    }

    loadProgress()
  }, [user?.id, lesson.id])

  const toggleExample = (contentId: string, exampleIndex: number) => {
    const key = `${contentId}-${exampleIndex}`
    const newSet = new Set(expandedExamples)
    if (newSet.has(key)) {
      newSet.delete(key)
    } else {
      newSet.add(key)
    }
    setExpandedExamples(newSet)
  }

  const toggleBookmark = (sectionId: string) => {
    const newSet = new Set(bookmarkedSections)
    if (newSet.has(sectionId)) {
      newSet.delete(sectionId)
    } else {
      newSet.add(sectionId)
    }
    setBookmarkedSections(newSet)
  }

  const markSectionComplete = async (contentId: string) => {
    if (!user?.id || !lesson.id) return

    const isCurrentlyComplete = completedSections.has(contentId)
    const newIsComplete = !isCurrentlyComplete

    try {
      const totalContents = lesson.contents?.length || 0
      await lessonService.markContentComplete(
        lesson.id,
        user.id,
        contentId,
        newIsComplete,
        totalContents,
      )

      const newSet = new Set(completedSections)
      if (newIsComplete) {
        newSet.add(contentId)
      } else {
        newSet.delete(contentId)
      }
      setCompletedSections(newSet)
    } catch (error) {
      console.error('Error marking content complete:', error)
    }
  }

  const handleTextHighlight = (text: string) => {
    if (highlightedText === text) {
      setHighlightedText(null)
    } else {
      setHighlightedText(text)
    }
  }

  const addExample = (
    contentId: string,
    example: string,
    explanation: string,
  ) => {
    setAdditionalExamples((prev) => ({
      ...prev,
      [contentId]: [...(prev[contentId] || []), { example, explanation }],
    }))
  }

  const setActivitySelection = (activityIndex: number, value: string) => {
    setActivitySelections((prev) => ({ ...prev, [activityIndex]: value }))
    setActivityChecked((prev) => ({ ...prev, [activityIndex]: null }))
  }

  const checkActivity = (activityIndex: number) => {
    const activity = lesson.activities?.[activityIndex]
    if (!activity) return
    const selected = activitySelections[activityIndex]
    const correct = (activity.answer ?? '').trim() === (selected ?? '').trim()
    setActivityChecked((prev) => ({
      ...prev,
      [activityIndex]: correct ? 'correct' : 'incorrect',
    }))
  }

  const totalSections = lesson.contents?.length || 0
  const completedCount = completedSections.size
  const progress =
    totalSections > 0 ? (completedCount / totalSections) * 100 : 0

  return (
    <div className="min-h-screen bg-stone-50">
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <Card className="border-0 shadow-lg bg-white/90 backdrop-blur-sm mb-6">
          <CardHeader className="pb-4">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                {lesson.chapter && (
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm font-medium mb-3 border border-blue-200">
                    <BookOpen className="w-4 h-4" />
                    {lesson.chapter === 'Q1' ? 'Chapter 1' : 'Chapter 2'}
                  </div>
                )}
                {lessons.length > 1 && (
                  <div className="mb-4">
                    <div className="flex flex-wrap gap-2">
                      {lessons.map((l) => {
                        const isActive = l.id === lesson.id
                        return (
                          <Button
                            key={l.id}
                            variant={isActive ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => {
                              if (l.id && l.id !== lesson.id) {
                                router.push(`/student/lessons/${l.id}`)
                              }
                            }}
                            className={
                              isActive
                                ? 'bg-blue-600 hover:bg-blue-700'
                                : 'hover:bg-blue-50'
                            }
                          >
                            {l.title || 'Untitled Lesson'}
                          </Button>
                        )
                      })}
                    </div>
                  </div>
                )}
                <CardTitle className="text-3xl font-bold text-foreground mb-2">
                  {lesson.title || 'Untitled Lesson'}
                </CardTitle>
                {lesson.overview && (
                  <p className="text-base text-muted-foreground leading-relaxed max-w-3xl">
                    Description: {lesson.overview}
                  </p>
                )}
              </div>
            </div>
          </CardHeader>
        </Card>

        <MaterialSection materials={lesson.materials} />

        {totalSections > 0 && (
          <Card className="border-0 shadow-md bg-white/80 backdrop-blur-sm mb-6">
            <CardContent className="p-4">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3 flex-1">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-foreground">
                        Progress
                      </span>
                      <span className="text-sm font-semibold text-blue-600">
                        {completedCount}/{totalSections} sections
                      </span>
                    </div>
                    <div className="w-full bg-stone-200 rounded-full h-3 overflow-hidden">
                      <div
                        className="h-full bg-blue-600 transition-all duration-500 ease-out rounded-full"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>
                </div>
                {progress === 100 && (
                  <div className="flex items-center gap-2 text-green-600">
                    <CheckCircle2 className="w-5 h-5" />
                    <span className="text-sm font-medium">Completed!</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {lesson.contents && lesson.contents.length > 0 ? (
          <Tabs
            defaultValue={
              lesson.contents[0]?.id || lesson.contents[0]?.title || '0'
            }
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 h-auto bg-stone-100 p-2 rounded-lg">
              {lesson.contents.map((content, index) => {
                const contentId = content.id || content.title || String(index)
                return (
                  <TabsTrigger
                    key={index}
                    value={contentId}
                    className="data-[state=active]:bg-white data-[state=active]:shadow-md transition-all duration-200"
                  >
                    <div className="flex items-center gap-2">
                      {completedSections.has(contentId) ? (
                        <CheckCircle2 className="w-4 h-4 text-green-600" />
                      ) : (
                        <Circle className="w-4 h-4 text-muted-foreground" />
                      )}
                      <span className="truncate">{content.title}</span>
                    </div>
                  </TabsTrigger>
                )
              })}
            </TabsList>

            {lesson.contents.map((content, contentIndex) => {
              const contentId =
                content.id || content.title || String(contentIndex)
              return (
                <TabsContent
                  key={contentIndex}
                  value={contentId}
                  className="mt-6"
                >
                  <ContentSection
                    content={content}
                    contentId={contentId}
                    expandedExamples={expandedExamples}
                    highlightedText={highlightedText}
                    onToggleExample={toggleExample}
                    onTextHighlight={handleTextHighlight}
                    onToggleBookmark={toggleBookmark}
                    onMarkComplete={markSectionComplete}
                    isBookmarked={bookmarkedSections.has(contentId)}
                    isCompleted={completedSections.has(contentId)}
                    additionalExamples={additionalExamples[contentId] || []}
                    onAddExample={addExample}
                  />
                </TabsContent>
              )
            })}
          </Tabs>
        ) : (
          <Card className="border-0 shadow-md bg-white/80 backdrop-blur-sm">
            <CardContent className="p-12 text-center">
              <BookOpen className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
              <p className="text-lg text-muted-foreground">
                No content available for this lesson yet.
              </p>
            </CardContent>
          </Card>
        )}

        {lesson.activities && lesson.activities.length > 0 && (
          <Card className="border-0 shadow-md bg-white/80 backdrop-blur-sm mb-6 mt-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <HelpCircle className="w-5 h-5" />
                Activities
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Answer each question and check to see if you got it right.
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              {lesson.activities.map((activity, activityIndex) => {
                const selected = activitySelections[activityIndex]
                const checked = activityChecked[activityIndex]
                const options = activity.options || []
                return (
                  <Card
                    key={activityIndex}
                    className={`p-4 ${
                      checked === 'incorrect'
                        ? 'border-red-200 bg-red-50/30'
                        : 'bg-white border-border'
                    }`}
                  >
                    <p className="font-medium text-foreground mb-3">
                      {activityIndex + 1}. {activity.question || 'Question'}
                    </p>
                    <div className="flex flex-col gap-2 mb-3">
                      {options.map((opt, optIndex) => (
                        <Button
                          key={optIndex}
                          type="button"
                          variant={
                            selected === opt ? 'default' : 'outline'
                          }
                          size="sm"
                          onClick={() =>
                            setActivitySelection(activityIndex, opt)
                          }
                          className={
                            selected === opt
                              ? 'bg-blue-600 hover:bg-blue-700'
                              : ''
                          }
                        >
                          {opt}
                        </Button>
                      ))}
                    </div>
                    <div className="flex items-center gap-3 flex-wrap">
                      <Button
                        type="button"
                        size="sm"
                        onClick={() => checkActivity(activityIndex)}
                        disabled={selected == null || selected === ''}
                      >
                        Check answer
                      </Button>
                      {checked === 'correct' && (
                        <span className="flex items-center gap-1.5 text-green-600 text-sm font-medium">
                          <CheckCircle2 className="w-4 h-4" />
                          Correct!
                        </span>
                      )}
                      {checked === 'incorrect' && (
                        <span className="flex items-center gap-1.5 text-red-600 text-sm font-medium">
                          <XCircle className="w-4 h-4" />
                          Incorrect. Correct answer: {activity.answer ?? '—'}
                        </span>
                      )}
                    </div>
                  </Card>
                )
              })}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
