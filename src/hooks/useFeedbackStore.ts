import { feedbackService } from '@/services/feedbackService'
import { create } from 'zustand'

interface FeedbackStore {
  feedback: Feedback[]
  getFeedbacks: () => void
  createFeedback: (feedback: Feedback) => void
}

export const useFeedbackStore = create<FeedbackStore>((set, get) => ({
  feedback: [],
  getFeedbacks: async () => {
    const feedbacks = await feedbackService.getFeedbacks()
    set({ feedback: feedbacks })
  },
  createFeedback: async (feedback: Feedback) => {
    await feedbackService.createFeedback(feedback)
  },
}))
