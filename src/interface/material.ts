interface Material {
  id: string
  text: string
  questions: Question[]
  mode: string
  quarter: string
  testType?: string
  skill: string
  title?: string
  author?: string
}

interface Question {
  title: string
  options: string[]
  answer: string
  type: string // COMPREHENSION or VOCABULARY
}

export type { Material, Question }
