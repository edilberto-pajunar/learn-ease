export interface LessonContentProgress {
  id: string
  completed: boolean
  completedAt: Date
}

export interface LessonProgress {
  contents: LessonContentProgress[]
  completedCount: number
  totalContents: number
  isCompleted: boolean
}
