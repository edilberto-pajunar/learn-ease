export interface Content {
  title: string
  examples?: string[]
  description?: string
}

export interface LessonMaterial {
  title?: string
  content?: string
  type?: string // poem | prose
  author?: string
}

export interface Lesson {
  id?: string
  chapter?: string
  title?: string
  skill?: string
  overview?: string
  contents?: Content[]
  materials: LessonMaterial[]
}
