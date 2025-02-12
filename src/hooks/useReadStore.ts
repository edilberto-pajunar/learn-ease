"use client";

import { db } from "@/firebase/client_app";
import { Material, StudentAnswer } from "@/interface/material";
import { readingService } from "@/services/readingService";
import { doc, setDoc } from "firebase/firestore";
import { create } from "zustand";

interface ReadStore {
  bionic: boolean;
  currentIndex: number;
  currentMaterial: Material | null;
  studentAnswers: StudentAnswer[];
  selectedAnswers: Record<string, string>;
  mistakes: Record<string, string>;
  isSubmitted: boolean;
  score: number;
  setBionic: (bionic: boolean) => void;
  setCurrentIndex: (currentIndex: number) => void;
  setCurrentMaterial: (material: Material) => void;
  submitAnswer: (studentId: string) => void;
  handleAnswerChange: (questionTitle: string, studentAnswer: string) => void;
  calculateMistakes: () => void;
  resetAnswers: () => void;
  setIsSubmitted: () => void;
  setTime: (studentId: string, time: Record<string, any>) => void;
}

export const useReadStore = create<ReadStore>((set, get) => ({
  bionic: false,
  currentIndex: 0,
  currentMaterial: null,
  studentAnswers: [],
  selectedAnswers: {},
  mistakes: {},
  isSubmitted: false,
  score: 0,
  setBionic: (bionic) => set({ bionic }),
  setCurrentIndex: (currentIndex) => set({ currentIndex }),
  setCurrentMaterial: (material) => set({ currentMaterial: material }),
  submitAnswer: async (studentId) => {
    const { selectedAnswers, currentMaterial, resetAnswers, score } = get();

    if (!currentMaterial) return;

    const submissionRef = doc(
      db,
      "submissions",
      `${studentId}_${currentMaterial.id}`
    );

    const submissionData = {
      studentId,
      materialId: currentMaterial.id,
      answers: selectedAnswers,
      submittedAt: new Date(),
      score: score,
    };

    try {
      await setDoc(submissionRef, submissionData, { merge: true });
      console.log(`Answers submitted: ${submissionData}`);
      resetAnswers();
    } catch (e) {
      console.log(`Error submitting answers: ${e}`);
    }
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
    const { currentMaterial, selectedAnswers, score } = get();
    if (!currentMaterial) return;

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
  setIsSubmitted: () => {
    const { isSubmitted } = get();
    set({ isSubmitted: !isSubmitted });
  },
  setTime: async (studentId, time) => {
    const {currentMaterial} = get();

    if (!currentMaterial) return;

    await readingService.setTime(studentId, currentMaterial.id, time);
  },
}));
