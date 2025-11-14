'use client'

import { wordCount } from '@/app/utils/wordCount'
import { db } from '@/firebase/client_app'
import { Material } from '@/interface/material'
import { readingService } from '@/services/readingService'
import { collection, onSnapshot, Timestamp } from 'firebase/firestore'
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
  comprehensionScore: number
  vocabularyScore: number
  difficulty: string
  materialBatch: string | null
  setLoading: (value: boolean) => void
  fetchMaterials: (quarter: string) => void
  setIndexMaterial: (indexMaterial: number) => void
  setIndexQuestion: (indexQuestion: number) => void
  setCurrentAnswers: (word: string) => void
  setDuration: (time: number | null) => void
  setMiscues: (word: string) => void
  clearMiscues: () => void
  submitAnswer: (
    studentId: string,
    testType: string,
    totalQuestions: number,
  ) => Promise<void>
  setComprehensionScore: () => void
  setVocabularyScore: () => void
  resetScore: () => void
  resetAll: () => void
  setDifficulty: (difficulty: string) => void
  setMaterialBatch: (materialBatch: string) => void
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
  comprehensionScore: 0,
  vocabularyScore: 0,
  difficulty: '',
  materialBatch: null,
  setLoading: (value) => set({ isLoading: value }),
  fetchMaterials: (quarter: string) => {
    onSnapshot(collection(db, 'materials'), (snapshot) => {
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
  submitAnswer: async (studentId, testType) => {
    const {
      indexMaterial,
      materials,
      currentAnswers,
      duration,
      setLoading,
      miscues,
      comprehensionScore,
      vocabularyScore,
      materialBatch,
    } = get()
    const material = materials[indexMaterial]
    setLoading(true)

    try {
      const numberOfWords = wordCount(material.text)
      const submission: Submission = {
        id: null,
        answers: currentAnswers,
        materialId: material.id,
        comprehensionScore: comprehensionScore,
        vocabularyScore: vocabularyScore,
        studentId: studentId,
        submittedAt: Timestamp.now(),
        numberOfWords: numberOfWords,
        duration: duration ?? 0,
        recordTime: {},
        miscues: miscues,
        mode: material.mode,
        testType: testType,
        materialBatch: materialBatch,
      }
      console.log(`Submission: ${JSON.stringify(submission)}`)

      await readingService.submitAnswer(submission)
      set({
        currentAnswers: [],
        comprehensionScore: 0,
        vocabularyScore: 0,
        isLoading: false,
        duration: null,
        miscues: [],
      })
    } catch (e) {
      console.error('Error submitting answer: ', e)
    }
  },
  setMiscues: (word) => {
    const currentMiscues = get().miscues
    if (currentMiscues.includes(word)) {
      // Remove word if it already exists
      set({ miscues: currentMiscues.filter((w) => w !== word) })
    } else {
      // Add word if it doesn't exist
      set({ miscues: [...currentMiscues, word] })
    }
  },
  clearMiscues: () => set({ miscues: [] }),
  setDuration: (duration) => set({ duration }),
  setComprehensionScore: () =>
    set({ comprehensionScore: get().comprehensionScore + 1 }),
  setVocabularyScore: () => set({ vocabularyScore: get().vocabularyScore + 1 }),
  resetScore: () => set({ comprehensionScore: 0, vocabularyScore: 0 }),
  resetAll: () =>
    set({
      indexMaterial: 0,
      indexQuestion: 0,
      currentAnswers: [],
      duration: null,
      miscues: [],
      comprehensionScore: 0,
      vocabularyScore: 0,
    }),
  setDifficulty: (difficulty) => set({ difficulty }),
  setMaterialBatch: (materialBatch) => set({ materialBatch }),
}))
