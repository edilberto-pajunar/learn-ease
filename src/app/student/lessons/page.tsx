'use client'

import { useLessonStore } from '@/hooks/useLessonStore'
import { useEffect } from 'react'
import LessonPage from './components/LessonPage'

export default function LessonsPage() {
  const { setLessons, lessons } = useLessonStore()

  useEffect(() => {
    setLessons()
  }, [setLessons])

  return (
    <div className="flex flex-col gap-4">
      <div className="">
        {lessons.map((lesson) => (
          <div key={lesson.id}>
            <LessonPage lesson={lesson} />
          </div>
        ))}
      </div>
    </div>
  )
}
