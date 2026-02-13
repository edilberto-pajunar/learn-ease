export interface Content {
  id?: string
  title: string
  examples?: string[]
  description?: string
}

export interface LessonMaterial {
  title?: string
  content?: string
  type?: string // poem | prose
  author?: string
  audioUrl?: string
  link?: string
}

export interface Activity {
  question?: string;
  options?: string[];
  answer?: string;
}

export interface Lesson {
  id?: string
  chapter?: string
  title?: string
  skill?: string
  overview?: string
  contents?: Content[]
  materials: LessonMaterial[]
  activities: Activity[]
  lesson?: number
}
