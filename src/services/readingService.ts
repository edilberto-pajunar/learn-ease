import { db } from '@/firebase/client_app'
import { Submission } from '@/interface/submission'
import { doc, setDoc, collection } from 'firebase/firestore'

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

      const docRef = doc(submissionsRef)
      await setDoc(
        docRef,
        {
          id: docRef.id,
          answers: submission.answers,
          materialId: materialId,
          comprehensionScore: submission.comprehensionScore,
          vocabularyScore: submission.vocabularyScore,
          studentId: studentId,
          submittedAt: new Date(),
          numberOfWords: submission.numberOfWords,
          duration: submission.duration,
          mode: submission.mode,
          testType: submission.testType,
          materialBatch: submission.materialBatch,
          miscues: submission.miscues,
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
