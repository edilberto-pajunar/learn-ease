export interface FeedbackQuestion {
  id: string
  label: string
}

export type LikertValue = 1 | 2 | 3 | 4 | 5

export interface Feedback {
  id?: string
  responses: LikertResponse[]
  overallComment?: string
  createdAt?: Date
  studentId?: string
}

export interface LikertResponse {
  questionId: string
  value: LikertValue
}

export const FEEDBACK_QUESTIONS: FeedbackQuestion[] = [
  // 🎨 DESIGN
  { id: 'design_1', label: 'The visual design is clean and professional.' },
  { id: 'design_2', label: 'The layout is well-organized and easy to understand.' },
  { id: 'design_3', label: 'The interface is visually consistent throughout.' },

  // 🖱 INTERACTION
  { id: 'interaction_1', label: 'The system is easy to navigate.' },
  { id: 'interaction_2', label: 'Buttons and actions are clearly labeled.' },
  { id: 'interaction_3', label: 'I can complete tasks without confusion.' },

  // 📚 LEARNING
  { id: 'learning_1', label: 'The content is clear and easy to understand.' },
  { id: 'learning_2', label: 'The materials helped me achieve the learning objectives.' },
  { id: 'learning_3', label: 'I feel more confident after completing this.' },

  // 💻 TECHNOLOGY USE
  { id: 'tech_1', label: 'The platform is fast and responsive.' },
  { id: 'tech_2', label: 'The system performs reliably without errors.' },
  { id: 'tech_3', label: 'The technology enhances the overall experience.' },
]
