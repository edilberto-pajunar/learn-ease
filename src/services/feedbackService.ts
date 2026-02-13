import { db } from '@/firebase/client_app'
import type { Feedback } from '@/interface/feedback'
import { addDoc, collection, getDocs, query, updateDoc, where } from 'firebase/firestore'

const FEEDBACK_SUBMITTED_KEY = 'learn_ease_feedback_submitted'

export const feedbackService = {
  async hasUserSubmitted(studentId: string): Promise<boolean> {
    try {
      const submitted = typeof window !== 'undefined' && localStorage.getItem(FEEDBACK_SUBMITTED_KEY)
      if (submitted === 'true') return true
      const ref = collection(db, 'feedbacks')
      const q = query(ref, where('studentId', '==', studentId))
      const snapshot = await getDocs(q)
      return !snapshot.empty
    } catch (e) {
      console.error(e)
      return false
    }
  },

  async getFeedbacks(): Promise<Feedback[]> {
    try {
      const ref = collection(db, 'feedbacks')
      const snapshot = await getDocs(ref)
      return snapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
        createdAt: doc.data().createdAt?.toDate?.() ?? doc.data().createdAt,
      })) as Feedback[]
    } catch (e) {
      console.error(e)
      return []
    }
  },

  async createFeedback(feedback: Feedback): Promise<void> {
    const ref = collection(db, 'feedbacks')
    const data = {
      responses: feedback.responses,
      overallComment: feedback.overallComment ?? null,
      createdAt: new Date(),
      studentId: feedback.studentId ?? null,
    }
    const docRef = await addDoc(ref, data)
    await updateDoc(docRef, { id: docRef.id })
    if (typeof window !== 'undefined' && feedback.studentId) {
      localStorage.setItem(FEEDBACK_SUBMITTED_KEY, 'true')
    }
  },
}
