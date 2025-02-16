import { scoreService } from "@/services/scoreService";
import { create } from "zustand";

interface ScoreState {
  score: number;
  submissions: Submission[];
  setSubmissions: (studentId: string) => void;
}

export const useScoreStore = create<ScoreState>((set) => ({
  score: 0,
  submissions: [],
  setSubmissions: async (studentId)  => {
    const submissions = await scoreService.getSubmissions(studentId);
    set({ submissions });
  },
}));
