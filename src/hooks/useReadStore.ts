'use client'

import { wordCount } from '@/app/utils/wordCount'
import { db } from '@/firebase/client_app'
import { Material } from '@/interface/material'
import { readingService } from '@/services/readingService'
import {
  collection,
  onSnapshot,
  Timestamp,
  Unsubscribe,
} from 'firebase/firestore'
import { create } from 'zustand'
import { Answer, Submission } from '@/interface/submission'

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

interface MaterialSubmission {
  materialId: string
  answers: Answer[]
  comprehensionScore: number
  vocabularyScore: number
  duration: number
  miscues: string[]
  numberOfWords: number
  mode: string
}

interface ReadStore {
  isLoading: boolean
  materials: Material[]
  indexMaterial: number
  indexQuestion: number
  currentAnswers: Answer[]
  duration: number | null
  miscues: string[]
  comprehensionScore: number
  vocabularyScore: number
  difficulty: string
  materialBatch: string | null
  materialsUnsubscribe: Unsubscribe | null
  batchedSubmissions: MaterialSubmission[]
  hasAlreadyTakenTest: boolean
  setLoading: (value: boolean) => void
  fetchMaterials: (quarter: string, testType?: string) => void
  setIndexMaterial: (indexMaterial: number) => void
  setIndexQuestion: (indexQuestion: number) => void
  setCurrentAnswers: (answer: Answer) => void
  setDuration: (time: number | null) => void
  setMiscues: (word: string) => void
  clearMiscues: () => void
  setComprehensionScore: () => void
  setVocabularyScore: () => void
  resetScore: () => void
  resetAll: () => void
  setDifficulty: (difficulty: string) => void
  setMaterialBatch: (materialBatch: string) => void
  addMaterialSubmission: (studentId: string) => void
  submitBatchAnswers: (
    studentId: string,
    quarter: string,
    testType: string
  ) => Promise<void>
  checkIfTestTaken: (userId: string, testType: 'preTest' | 'postTest') => Promise<void>
}

export const useReadStore = create<ReadStore>((set, get) => ({
  isLoading: false,
  indexMaterial: 0,
  indexQuestion: 0,
  materials: [],
  materialsUnsubscribe: null,
  currentAnswers: [],
  duration: 0,
  miscues: [],
  comprehensionScore: 0,
  vocabularyScore: 0,
  difficulty: '',
  materialBatch: null,
  batchedSubmissions: [],
  hasAlreadyTakenTest: false,
  setLoading: (value) => set({ isLoading: value }),
  fetchMaterials: (quarter: string, testType?: string) => {
    const { materialsUnsubscribe } = get()

    if (materialsUnsubscribe) {
      materialsUnsubscribe()
    }

    if (!quarter) {
      set({ materials: [], indexMaterial: 0, materialsUnsubscribe: null })
      return
    }

    const unsubscribe = onSnapshot(collection(db, 'materials'), (snapshot) => {
      const materials: Material[] = snapshot.docs
        .map((doc) => doc.data() as Material)
        .filter((material) => {
          const matchesQuarter = material.quarter === quarter
          const matchesTestType = !testType || material.testType === testType
          return matchesQuarter && matchesTestType
        })

      set({ materials, indexMaterial: 0, materialsUnsubscribe: unsubscribe })
    })

    set({ materialsUnsubscribe: unsubscribe })
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
  setCurrentAnswers: (answer: Answer) => {
    set((state) => ({
      currentAnswers: [...state.currentAnswers, answer],
    }))
  },
  addMaterialSubmission: (studentId: string) => {
    const {
      indexMaterial,
      materials,
      currentAnswers,
      duration,
      miscues,
      comprehensionScore,
      vocabularyScore,
    } = get()
    const material = materials[indexMaterial]
    const numberOfWords = wordCount(material.text)

    const materialSubmission: MaterialSubmission = {
      materialId: material.id,
      answers: currentAnswers,
      comprehensionScore: comprehensionScore,
      vocabularyScore: vocabularyScore,
      duration: duration ?? 0,
      miscues: miscues,
      numberOfWords: numberOfWords,
      mode: material.mode,
    }

    set((state) => ({
      batchedSubmissions: [...state.batchedSubmissions, materialSubmission],
      currentAnswers: [],
      comprehensionScore: 0,
      vocabularyScore: 0,
      duration: null,
      miscues: [],
    }))
  },
  submitBatchAnswers: async (studentId, quarter, testType) => {
    const { batchedSubmissions, materialBatch, setLoading } = get()
    setLoading(true)

    try {
      const batchId = await readingService.submitBatchAnswers(
        studentId,
        batchedSubmissions,
        quarter,
        testType,
        materialBatch
      )

      await readingService.updateUserWithTestMaterial(studentId, batchId, testType)

      set({
        batchedSubmissions: [],
        isLoading: false,
      })
    } catch (e) {
      console.error('Error submitting batch answers: ', e)
      set({ isLoading: false })
    }
  },
  checkIfTestTaken: async (userId: string, testType: 'preTest' | 'postTest') => {
    try {
      const hasTaken = await readingService.checkIfUserTookTest(userId, testType)
      set({ hasAlreadyTakenTest: hasTaken })
    } catch (e) {
      console.error('Error checking if test was taken: ', e)
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
      batchedSubmissions: [],
    }),
  setDifficulty: (difficulty) => set({ difficulty }),
  setMaterialBatch: (materialBatch) => set({ materialBatch }),
}))
