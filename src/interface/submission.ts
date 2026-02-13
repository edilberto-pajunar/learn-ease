import { Timestamp } from 'firebase/firestore'

interface Answer {
  answer: string
  type: string
  isCorrect: boolean
}

interface Submission {
  id: string | null
  answers: Answer[]
  materialId: string
  // comprehensionScore: number
  // vocabularyScore: number
  studentId: string
  submittedAt: Timestamp
  recordTime: Record<string, string>
  miscues: string[]
  numberOfWords: number
  duration: number
  mode: string
  testType: string // preTest or postTest,
  materialBatch: string | null
  quarter: string // Q1 or Q2
}

interface RecordTime {
  startTime: Date
  endTime: Date
}

export type { Submission, RecordTime, Answer }
