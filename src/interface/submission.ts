interface Submission {
  answers: string[];
  materialId: string;
  score: number;
  studentId: string;
  submittedAt: Date;
  recordTime: Record<string, string>;
  miscues: string[];
  numberOfWords: number;
  duration: number;
}

interface RecordTime {
  startTime: Date;
  endTime: Date;
}

export type { Submission, RecordTime };