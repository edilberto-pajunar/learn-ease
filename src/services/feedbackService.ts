import { db } from '@/firebase/client_app'
import { addDoc, collection, getDocs, updateDoc } from 'firebase/firestore'

export const feedbackService = {
  async getFeedbacks() {
    try {
      const ref = collection(db, 'feedbacks')
      const snapshot = await getDocs(ref)
      const feedbacks = snapshot.docs.map((doc) => doc.data() as Feedback)
      return feedbacks
    } catch (e) {
      console.log(e)
    }
  },
  async createFeedback(feedback: Feedback) {
    try {
      const ref = collection(db, 'feedbacks')
      const data: Feedback = {
        rating: feedback.rating,
        comment: feedback.comment,
        createdAt: new Date(),
      }

      // Add new doc
      const docRef = await addDoc(ref, data)

      // Update the same doc with its generated ID
      await updateDoc(docRef, { id: docRef.id })

      console.log('Document created with ID:', docRef.id)
    } catch (e) {
      console.log(e)
    }
  },
}
