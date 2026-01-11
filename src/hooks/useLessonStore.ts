import { Lesson } from '@/interface/lesson'
import { lessonService } from '@/services/lessonService'
import { Unsubscribe } from 'firebase/firestore'
import { create } from 'zustand'

interface LessonState {
  lessons: Lesson[]
  loading: boolean
  unsubscribe: Unsubscribe | null
  setLessons: () => void
}

export const useLessonStore = create<LessonState>((set, get) => ({
  lessons: [],
  loading: false,
  unsubscribe: null,
  setLessons: () => {
    const { unsubscribe } = get()
    if (unsubscribe) {
      unsubscribe()
      set({ unsubscribe: null })
    }
    const lessonListener = lessonService.listenToLessons((data) => {
      set({ lessons: data })
    })
    set({ unsubscribe: lessonListener })
  },
}))
