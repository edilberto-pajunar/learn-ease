'use client'

import { wordCount } from '@/app/utils/wordCount'
import { db } from '@/firebase/client_app'
import { Material } from '@/interface/material'
import { readingService } from '@/services/readingService'
import {
  collection,
  doc,
  onSnapshot,
  Timestamp,
} from 'firebase/firestore'
import { create } from 'zustand'
import { Submission } from '@/interface/submission'

// enum ComprehensionStatus {
//   NOT_STARTED = 'NOT_STARTED',
//   IN_PROGRESS = 'IN_PROGRESS',
//   COMPLETED = 'COMPLETED',
// }

// enum ReadingStatus {
//   NOT_STARTED = 'NOT_STARTED',
//   IN_PROGRESS = 'IN_PROGRESS',
//   COMPLETED = 'COMPLETED',
// }

interface ReadStore {
  isLoading: boolean
  materials: Material[]
  indexMaterial: number
  indexQuestion: number
  currentAnswers: string[]
  duration: number | null
  miscues: string[]
  score: number
  difficulty: string
  setLoading: (value: boolean) => void
  fetchMaterials: (quarter: string) => void
  setIndexMaterial: (indexMaterial: number) => void
  setIndexQuestion: (indexQuestion: number) => void
  setCurrentAnswers: (word: string) => void
  setDuration: (time: number) => void
  setMiscues: (word: string) => void
  submitAnswer: (
    studentId: string,
    testType: string,
    totalQuestions: number,
  ) => Promise<void>
  setScore: () => void
  resetScore: () => void
  setDifficulty: (difficulty: string) => void
}

export const useReadStore = create<ReadStore>((set, get) => ({
  isLoading: false,
  indexMaterial: 0,
  indexQuestion: 0,
  materials: [],
  unsubscribe: null,
  currentAnswers: [],
  duration: 0,
  miscues: [],
  score: 0,
  difficulty: '',
  setLoading: (value) => set({ isLoading: value }),
  fetchMaterials: (quarter: string) => {
    const unsubscribe = onSnapshot(collection(db, 'materials'), (snapshot) => {
      const materials: Material[] = snapshot.docs
        .map((doc) => doc.data() as Material)
        .filter((material) => material.quarter === quarter)

      set({ materials })
    })
  },
  setIndexMaterial: (indexMaterial) => set({ indexMaterial }),
  setIndexQuestion: (indexQuestion) => {
    const { materials, indexMaterial } = get()
    const question = materials[indexMaterial]

    const length = question.questions.length
    if (indexQuestion < length) {
      set({ indexQuestion })
    } else {
      set({ indexQuestion: 0 })
    }
  },
  setCurrentAnswers: (word: string) => {
    set((state) => ({
      currentAnswers: [...state.currentAnswers, word],
    }))
  },
  submitAnswer: async (studentId, testType, totalQuestions) => {
    const {
      indexMaterial,
      materials,
      currentAnswers,
      duration,
      setLoading,
      miscues,
      score,
      resetScore,
      setCurrentAnswers,
    } = get()
    const material = materials[indexMaterial]
    setLoading(true)

    try {
      const numberOfWords = wordCount(material.text)
      const submission: Submission = {
        id: doc(collection(db, 'users', studentId, 'submissions')).id,
        answers: currentAnswers,
        materialId: material.id,
        score: score,
        studentId: studentId,
        submittedAt: Timestamp.now(),
        numberOfWords: numberOfWords,
        duration: duration!,
        recordTime: {},
        miscues: miscues,
        mode: material.mode,
        testType: testType,
        totalQuestions: totalQuestions,
      }

      await readingService.submitAnswer(submission)
      set({
        currentAnswers: [],
        score: 0,
        isLoading: false,
        duration: null,
        miscues: [],
      })
    } catch (e) {
      console.error('Error submitting answer: ', e)
    }
  },
  setMiscues: (word) => set({ miscues: [...get().miscues, word] }),
  setDuration: (duration) => set({ duration }),
  setScore: () => set({ score: get().score + 1 }),
  resetScore: () => set({ score: 0 }),
  setDifficulty: (difficulty) => set({ difficulty }),
}))

