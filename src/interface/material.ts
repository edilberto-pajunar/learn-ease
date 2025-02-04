interface Material {
  id: string;
  text: string;
  questions: Question[];
}

interface Question {
  title: string;
  options: string[];
  answer: string;
}

interface StudentAnswer {
  questionTitle: string;
  studentAnswer: string;
  isCorrect: boolean;
}

export type { Material, Question, StudentAnswer };
