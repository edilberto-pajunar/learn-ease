export interface Example {
  title?: string
  author?: string
  body?: string
}

export interface Content {
  title: string
  content?: Example[]
  description?: string
}

export interface Lesson {
  id?: string
  chapter?: string
  title?: string
  skill?: string
  overview?: string
  content?: Content[]
}
