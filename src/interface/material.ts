interface Material {
  id: string;
  text: string;
  questions: Question[];
  mode: string;
}

interface Question {
  title: string;
  options: string[];
  answer: string;
}

export type { Material, Question };
