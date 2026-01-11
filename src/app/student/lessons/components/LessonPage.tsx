'use client'

import { useState } from 'react'
import { Lesson } from '@/interface/lesson'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { BookOpen, Target, CheckCircle2, Circle } from 'lucide-react'
import ContentSection from './ContentSection'

export default function LessonPage({ lesson }: { lesson: Lesson }) {
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

  const markSectionComplete = (sectionId: string) => {
    const newSet = new Set(completedSections)
    if (newSet.has(sectionId)) {
      newSet.delete(sectionId)
    } else {
      newSet.add(sectionId)
    }
    setCompletedSections(newSet)
  }

  const handleTextHighlight = (text: string) => {
    if (highlightedText === text) {
      setHighlightedText(null)
    } else {
      setHighlightedText(text)
    }
  }

  const totalSections = lesson.content?.length || 0
  const completedCount = completedSections.size
  const progress =
    totalSections > 0 ? (completedCount / totalSections) * 100 : 0

  return (
    <div className="min-h-screen bg-stone-50">
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        {/* Header Section */}
        <Card className="border-0 shadow-lg bg-white/90 backdrop-blur-sm mb-6">
          <CardHeader className="pb-4">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                {lesson.chapter && (
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm font-medium mb-3 border border-blue-200">
                    <BookOpen className="w-4 h-4" />
                    {lesson.chapter == 'Q1' ? 'Chapter 1' : 'Chapter 2'}
                  </div>
                )}
                <CardTitle className="text-3xl font-bold text-foreground mb-2">
                  {lesson.title || 'Untitled Lesson'}
                </CardTitle>
                {/* {lesson.skill && (
                  <div className="flex items-center gap-2 text-muted-foreground mb-3">
                    <Target className="w-4 h-4" />
                    <span className="text-sm font-medium">{lesson.skill}</span>
                  </div>
                )} */}
                {lesson.overview && (
                  <p className="text-base text-muted-foreground leading-relaxed max-w-3xl">
                    Description: {lesson.overview}
                  </p>
                )}
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Progress Tracker */}
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

        {/* Content Tabs */}
        {lesson.content && lesson.content.length > 0 ? (
          <Tabs
            defaultValue={lesson.content[0]?.title || '0'}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 h-auto bg-stone-100 p-2 rounded-lg">
              {lesson.content.map((content, index) => (
                <TabsTrigger
                  key={index}
                  value={content.title || String(index)}
                  className="data-[state=active]:bg-white data-[state=active]:shadow-md transition-all duration-200"
                >
                  <div className="flex items-center gap-2">
                    {completedSections.has(content.title || String(index)) ? (
                      <CheckCircle2 className="w-4 h-4 text-green-600" />
                    ) : (
                      <Circle className="w-4 h-4 text-muted-foreground" />
                    )}
                    <span className="truncate">{content.title}</span>
                  </div>
                </TabsTrigger>
              ))}
            </TabsList>

            {lesson.content.map((content, contentIndex) => (
              <TabsContent
                key={contentIndex}
                value={content.title || String(contentIndex)}
                className="mt-6"
              >
                <ContentSection
                  content={content}
                  contentId={content.title || String(contentIndex)}
                  expandedExamples={expandedExamples}
                  highlightedText={highlightedText}
                  onToggleExample={toggleExample}
                  onTextHighlight={handleTextHighlight}
                  onToggleBookmark={toggleBookmark}
                  onMarkComplete={markSectionComplete}
                  isBookmarked={bookmarkedSections.has(
                    content.title || String(contentIndex),
                  )}
                  isCompleted={completedSections.has(
                    content.title || String(contentIndex),
                  )}
                />
              </TabsContent>
            ))}
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
      </div>
    </div>
  )
}
