import { db } from '@/firebase/client_app'
import { Submission } from '@/interface/submission'
import { AppUser } from '@/interface/user'
import { doc, setDoc, collection, updateDoc } from 'firebase/firestore'

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

  async submitAnswer(
    submission: Submission,
  ) {
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
          quarter: submission.quarter,
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

  async finishUserAssessment(
    userId: string,
    quarter: string,
    testType: string,
  ) {
    try {
      const userAssessmentRef = collection(db, 'userAssessments')
      const docRef = doc(userAssessmentRef)
      const preTestCompleted = testType === 'preTest'
      const postTestCompleted = testType === 'postTest'
      await setDoc(
        docRef,
        {
          id: docRef.id,
          userId: userId,
          quarter: quarter,
          preTestCompleted: preTestCompleted,
          postTestCompleted: postTestCompleted,
          updatedAt: new Date(),
        },
        { merge: true },
      )
      console.log('User assessment finished: ', docRef.id)
      return true
    } catch (e) {
      console.log('Error finishing user assessment: ', e)
      return false
    }
  },
}
