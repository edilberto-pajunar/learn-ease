import { db } from '@/firebase/client_app'
import { Submission } from '@/interface/submission'
import {
  doc,
  setDoc,
  collection,
  getDocs,
  query,
  where,
} from 'firebase/firestore'

export const readingService = {
  async endTime(
    studentId: string,
    materialId: string,
    time: Record<string, string>,
    miscues: string[],
  ) {
    try {
      const ref = doc(collection(db, 'users', studentId, 'submissions'))
      await setDoc(
        ref,
        {
          recordTime: time,
          miscues: miscues ?? [],
        },
        {
          merge: true,
        },
      )
      console.log(`Student ID: ${studentId}: ${JSON.stringify(time)}`)
    } catch (error) {
      console.log('Error setting time: ', error)
    }
  },

  async submitAnswer(submission: Submission) {
    try {
      const submissionsRef = collection(db, 'submissions')
      const studentId = submission.studentId
      const materialId = submission.materialId
      const testType = submission.testType

      // Check for existing submission
      const existingSubmissions = await getDocs(
        query(
          submissionsRef,
          where('studentId', '==', studentId),
          where('materialId', '==', materialId),
          where('testType', '==', testType),
        ),
      )

      if (!existingSubmissions.empty) {
        console.log(
          `Student ${studentId} has already submitted an answer for material ${materialId} with test type ${testType}`,
        )
        return false
      }

      const docRef = doc(submissionsRef)
      await setDoc(
        docRef,
        {
          id: docRef.id,
          answers: submission.answers,
          materialId: materialId,
          score: submission.score,
          studentId: studentId,
          submittedAt: new Date(),
          numberOfWords: submission.numberOfWords,
          duration: submission.duration,
          mode: submission.mode,
          testType: submission.testType,
        },
        { merge: true },
      )
      console.log(`StudentID: ${studentId}: Answer submitted: ${materialId}`)
      return true
    } catch (error) {
      console.log('Error submitting answer: ', error)
      return false
    }
  },
}
