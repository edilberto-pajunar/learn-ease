import { db } from '@/firebase/client_app'
import { Submission } from '@/interface/submission'
import {
  doc,
  setDoc,
  collection,
  updateDoc,
  getDoc,
  Timestamp,
} from 'firebase/firestore'

interface MaterialSubmission {
  materialId: string
  answers: any[]
  duration: number
  miscues: string[]
  numberOfWords: number
  mode: string
}

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

  async submitBatchAnswers(
    studentId: string,
    materialSubmissions: MaterialSubmission[],
    quarter: string,
    testType: string,
    materialBatch: string | null,
  ): Promise<string> {
    try {
      const batchId = materialBatch || `batch_${Date.now()}`
      const submissionsRef = collection(db, 'submissions')

      for (const materialSubmission of materialSubmissions) {
        const docRef = doc(submissionsRef)
        await setDoc(docRef, {
          id: docRef.id,
          answers: materialSubmission.answers,
          materialId: materialSubmission.materialId,
          studentId: studentId,
          submittedAt: Timestamp.now(),
          numberOfWords: materialSubmission.numberOfWords,
          duration: materialSubmission.duration,
          mode: materialSubmission.mode,
          testType: testType,
          materialBatch: batchId,
          miscues: materialSubmission.miscues,
          quarter: quarter,
        })
      }

      console.log(`Batch submitted with ID: ${batchId}`)
      return batchId
    } catch (error) {
      console.log('Error submitting batch answers: ', error)
      throw error
    }
  },

  async updateUserWithTestMaterial(
    userId: string,
    batchId: string,
    testType: string,
  ) {
    try {
      const userRef = doc(db, 'users', userId)
      const updateData: any = {}

      if (testType === 'preTest') {
        updateData.preTestMaterialBatchId = batchId
        updateData.preTestCompletedAt = Timestamp.now()
      } else if (testType === 'postTest') {
        updateData.postTestMaterialBatchId = batchId
        updateData.postTestCompletedAt = Timestamp.now()
      }

      await updateDoc(userRef, updateData)
      console.log(
        `User ${userId} updated with ${testType} MaterialBatch Id: ${batchId}`,
      )
      return true
    } catch (error) {
      console.log(`Error updating user with ${testType}Material: `, error)
      return false
    }
  },

  async checkIfUserTookTest(
    userId: string,
    testType: string,
  ): Promise<boolean> {
    try {
      const userRef = doc(db, 'users', userId)
      const userDoc = await getDoc(userRef)

      if (userDoc.exists()) {
        const userData = userDoc.data()

        if (testType === 'preTest') {
          return userData.preTestCompletedAt != null
        } else if (testType === 'postTest') {
          return userData.postTestCompletedAt != null
        }
      }

      return false
    } catch (error) {
      console.log('Error checking if user took test: ', error)
      return false
    }
  },
}
