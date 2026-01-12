import { db } from '@/firebase/client_app'
import { Lesson } from '@/interface/lesson'
import {
  LessonProgress,
  LessonContentProgress,
} from '@/interface/lessonProgress'
import {
  collection,
  onSnapshot,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDoc,
  setDoc,
} from 'firebase/firestore'

export const lessonService = {
  listenToLessons(callback: (data: Lesson[]) => void): () => void {
    const unsubscribe = onSnapshot(
      collection(db, 'lessons'),
      (snapshot) => {
        const data: Lesson[] = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Lesson[]

        data.sort((a, b) => {
          if (a.lesson && b.lesson && a.lesson < b.lesson) return -1
          if (a.lesson && b.lesson && a.lesson > b.lesson) return 1
          return 0
        })

        return callback(data)
      },
      (error) => {
        console.error('Error listening to lessons:', error)
        throw new Error('Failed to listen to lessons: ' + error.message)
      },
    )

    return unsubscribe
  },

  async addLesson(data: Omit<Lesson, 'id'>): Promise<void> {
    try {
      const ref = collection(db, 'lessons')
      await addDoc(ref, data)
      console.log('Lesson added successfully')
    } catch (error) {
      console.error('Error adding lesson:', error)
      throw error
    }
  },

  async updateLesson(id: string, data: Partial<Lesson>): Promise<void> {
    try {
      const docRef = doc(db, 'lessons', id)
      await updateDoc(docRef, data)
      console.log('Lesson updated successfully')
    } catch (error) {
      console.error('Error updating lesson:', error)
      throw error
    }
  },

  async deleteLesson(id: string): Promise<void> {
    try {
      const docRef = doc(db, 'lessons', id)
      await deleteDoc(docRef)
      console.log('Lesson deleted successfully')
    } catch (error) {
      console.error('Error deleting lesson:', error)
      throw error
    }
  },

  async markContentComplete(
    lessonId: string,
    userId: string,
    contentId: string,
    isComplete: boolean,
    totalContents: number,
  ): Promise<void> {
    try {
      const progressRef = doc(db, 'users', userId, 'lessonProgress', lessonId)

      const progressDoc = await getDoc(progressRef)
      const now = new Date()

      if (progressDoc.exists()) {
        const currentProgress = progressDoc.data() as LessonProgress
        let contents = currentProgress.contents || []

        if (isComplete) {
          const existingIndex = contents.findIndex((c) => c.id === contentId)
          if (existingIndex >= 0) {
            contents[existingIndex] = {
              id: contentId,
              completed: true,
              completedAt: now,
            }
          } else {
            contents.push({
              id: contentId,
              completed: true,
              completedAt: now,
            })
          }
        } else {
          contents = contents.filter((c) => c.id !== contentId)
        }

        const completedCount = contents.filter((c) => c.completed).length
        const isCompleted = completedCount === totalContents

        await updateDoc(progressRef, {
          contents,
          completedCount,
          totalContents,
          isCompleted,
        })
      } else {
        const contents: LessonContentProgress[] = isComplete
          ? [
              {
                id: contentId,
                completed: true,
                completedAt: now,
              },
            ]
          : []

        const completedCount = contents.length
        const isCompleted = completedCount === totalContents

        await setDoc(progressRef, {
          contents,
          completedCount,
          totalContents,
          isCompleted,
        })
      }

      console.log('Content progress updated successfully')
    } catch (error) {
      console.error('Error updating content progress:', error)
      throw error
    }
  },
}
