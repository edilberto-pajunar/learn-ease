interface Submission {
  id: string
  answers: string[]
  materialId: string
  score: number
  studentId: string
  submittedAt: Date
  recordTime: Record<string, string>
  miscues: string[]
  numberOfWords: number
  duration: number
  mode: string
}

interface RecordTime {
  startTime: Date
  endTime: Date
}

export type { Submission, RecordTime }
