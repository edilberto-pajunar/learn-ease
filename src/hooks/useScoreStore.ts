import { create } from "zustand";

interface ScoreState {
  score: number;
}

export const useScoreStore = create<ScoreState>((set) => ({
  score: 0,
}));
