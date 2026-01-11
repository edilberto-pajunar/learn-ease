import { db } from '@/firebase/client_app'
import { Lesson } from '@/interface/lesson'
import {
  collection,
  onSnapshot,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
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
}
