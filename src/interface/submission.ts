interface Submission {
  answers: Record<string, string>;
  materialId: string;
  score: number;
  studentId: string;
  submittedAt: Date;
  recordTime: Record<string, string>;
  miscues: string[];
  numberOfWords: number;
}
