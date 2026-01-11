import { db } from '@/firebase/client_app'
import { Lesson } from '@/interface/lesson'
import { collection, onSnapshot } from 'firebase/firestore'

export const lessonService = {
  listenToLessons(callback: (data: Lesson[]) => void): () => void {
    const unsubscribe = onSnapshot(collection(db, 'lessons'), (snapshot) => {
      const data: Lesson[] = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Lesson[]

      return callback(data)
    })

    return unsubscribe
  },
}
