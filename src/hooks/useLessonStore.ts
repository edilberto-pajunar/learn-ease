import { Lesson } from '@/interface/lesson'
import { lessonService } from '@/services/lessonService'
import { Unsubscribe } from 'firebase/firestore'
import { create } from 'zustand'

interface LessonState {
  lessons: Lesson[]
  loading: boolean
  error: string | null
  unsubscribe: Unsubscribe | null
  setLessons: () => void
  addLesson: (data: Omit<Lesson, 'id'>) => Promise<void>
  updateLesson: (id: string, data: Partial<Lesson>) => Promise<void>
  deleteLesson: (id: string) => Promise<void>
}

export const useLessonStore = create<LessonState>((set, get) => ({
  lessons: [],
  loading: false,
  error: null,
  unsubscribe: null,
  setLessons: () => {
    const { unsubscribe } = get()
    if (unsubscribe) {
      unsubscribe()
      set({ unsubscribe: null })
    }
    set({ loading: true, error: null })
    try {
      const lessonListener = lessonService.listenToLessons((data) => {
        set({ lessons: data, loading: false, error: null })
      })
      set({ unsubscribe: lessonListener })
    } catch (error) {
      set({
        loading: false,
        error:
          error instanceof Error ? error.message : 'Failed to load lessons',
      })
    }
  },
  addLesson: async (data: Omit<Lesson, 'id'>) => {
    try {
      set({ loading: true, error: null })
      await lessonService.addLesson(data)
      set({ loading: false })
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Failed to add lesson'
      set({ loading: false, error: errorMessage })
      throw error
    }
  },
  updateLesson: async (id: string, data: Partial<Lesson>) => {
    try {
      set({ loading: true, error: null })
      await lessonService.updateLesson(id, data)
      set({ loading: false })
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Failed to update lesson'
      set({ loading: false, error: errorMessage })
      throw error
    }
  },
  deleteLesson: async (id: string) => {
    try {
      set({ loading: true, error: null })
      await lessonService.deleteLesson(id)
      set({ loading: false })
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Failed to delete lesson'
      set({ loading: false, error: errorMessage })
      throw error
    }
  },
}))
