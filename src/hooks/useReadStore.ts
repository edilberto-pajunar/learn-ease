"use client";

import { db } from "@/firebase/client_app";
import { Material, StudentAnswer } from "@/interface/material";
import { readingService } from "@/services/readingService";
import { unsubscribe } from "diagnostics_channel";
import { collection, doc, onSnapshot, setDoc } from "firebase/firestore";
import { create } from "zustand";

interface ReadStore {
  isLoading: boolean;
  materials: Material[];
  bionic: boolean;
  currentIndex: number;
  studentAnswers: StudentAnswer[];
  selectedAnswers: Record<string, string>;
  mistakes: Record<string, string>;
  isSubmitted: boolean;
  score: number;
  miscues: string[];
  setLoading: (value: boolean) => void;
  fetchMaterials: () => void;
  stopListening: () => void;
  unsubscribe: (() => void) | null;
  setBionic: (bionic: boolean) => void;
  setCurrentIndex: (currentIndex: number) => void;
  submitAnswer: (studentId: string) => void;
  handleAnswerChange: (questionTitle: string, studentAnswer: string) => void;
  calculateMistakes: () => void;
  resetAnswers: () => void;
  setIsSubmitted: () => void;
  endTime: (studentId: string, time: Record<string, any>) => void;
  addMiscues: (word: string) => void;
  removeMiscues: (word: string) => void;
}

export const useReadStore = create<ReadStore>((set, get) => ({
  isLoading: false,
  bionic: false,
  currentIndex: 0,
  currentMaterial: null,
  studentAnswers: [],
  selectedAnswers: {},
  mistakes: {},
  isSubmitted: false,
  score: 0,
  materials: [],
  unsubscribe: null,
  miscues: [],
  setLoading: (value) => {
    set({ isLoading: value });
  },
  setBionic: (bionic) => set({ bionic }),
  setCurrentIndex: (currentIndex) => set({ currentIndex }),
  submitAnswer: async (studentId) => {

    const { selectedAnswers, resetAnswers, score, currentIndex, materials, setLoading} = get();
    setLoading(true);
    const currentMaterial = materials[currentIndex];

    await readingService.submitAnswer(
      studentId,
      currentMaterial.id,
      selectedAnswers,
      score
    );

    resetAnswers();
    setLoading(false);
  },
  handleAnswerChange: (questionTitle, studentAnswer) => {
    const { selectedAnswers } = get();
    set({
      selectedAnswers: {
        ...selectedAnswers,
        [questionTitle]: studentAnswer,
      },
    });
  },
  calculateMistakes: () => {
    const { currentIndex, materials, selectedAnswers, score } = get();

    const currentMaterial = materials[currentIndex];

    const mistakes: Record<string, string> = {};

    currentMaterial.questions.forEach((question) => {
      const correctAnswer = question.answer;
      const userAnswer = selectedAnswers[question.title];
      if (userAnswer !== correctAnswer) {
        mistakes[question.title] = `Correct: ${correctAnswer}`;
      } else {
        set({ score: score + 1 });
        mistakes[question.title] = "Correct!";
      }
    });

    set({ mistakes });
  },
  resetAnswers: () => set({ selectedAnswers: {} }),
  setIsSubmitted: () => set((state) => ({ isSubmitted: !state.isSubmitted })),
  endTime: async (studentId, time) => {
    const {currentIndex, materials, miscues} = get();

    const currentMaterial = materials[currentIndex];

    await readingService.endTime(studentId, currentMaterial.id, time, miscues);
    set({ miscues: []});
  },
  fetchMaterials: () => {
    const materialsRef = collection(db, "materials");

    const unsubscribe = onSnapshot(materialsRef, (snapshot) => {
      const materials: Material[] = snapshot.docs.map((doc) => (doc.data()) as Material);
      console.log(materials);

      set({ materials });
    });

    set({ unsubscribe });
  },
  stopListening: () => {
    const {unsubscribe} = get();
    if (unsubscribe) {
      set({unsubscribe: null});
    }
  },
  addMiscues: (word) => {
    const {miscues} = get();

    set({miscues: [...miscues, word]});
  },
  removeMiscues: (word) => {
    const {miscues} = get();

    set({miscues: miscues.filter((m) => m !== word)});
  },
}));
