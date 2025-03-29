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

export type { Material, Question };
