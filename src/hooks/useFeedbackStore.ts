import type { Feedback } from '@/interface/feedback'
import { feedbackService } from '@/services/feedbackService'
import { create } from 'zustand'

interface FeedbackStore {
  feedback: Feedback[]
  getFeedbacks: () => Promise<void>
  createFeedback: (feedback: Feedback) => Promise<void>
}

export const useFeedbackStore = create<FeedbackStore>((set) => ({
  feedback: [],
  getFeedbacks: async () => {
    const feedbacks = await feedbackService.getFeedbacks()
    set({ feedback: feedbacks })
  },
  createFeedback: async (feedback: Feedback) => {
    await feedbackService.createFeedback(feedback)
  },
}))
