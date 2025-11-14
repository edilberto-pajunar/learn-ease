import { Timestamp } from 'firebase/firestore'

interface Submission {
  id: string | null
  answers: string[]
  materialId: string
  comprehensionScore: number
  vocabularyScore: number
  studentId: string
  submittedAt: Timestamp
  recordTime: Record<string, string>
  miscues: string[]
  numberOfWords: number
  duration: number
  mode: string
  testType: string // pre_test or post_test,
  materialBatch: string | null
}

interface RecordTime {
  startTime: Date
  endTime: Date
}

export type { Submission, RecordTime }
