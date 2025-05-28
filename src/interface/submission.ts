import { Timestamp } from 'firebase/firestore'

interface Submission {
  id: string
  answers: string[]
  materialId: string
  score: number
  studentId: string
  submittedAt: Timestamp
  recordTime: Record<string, string>
  miscues: string[]
  numberOfWords: number
  duration: number
  mode: string
  testType: string // pre_test or post_test,
  totalQuestions: number
}

interface RecordTime {
  startTime: Date
  endTime: Date
}

export type { Submission, RecordTime }
