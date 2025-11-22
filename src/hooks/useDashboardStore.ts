import { Answer, Submission } from '@/interface/submission'
import { create } from 'zustand'

export enum TestTypeTab {
  PRE_TEST = 'pre_test',
  POST_TEST = 'post_test',
  ALL = 'all',
}

interface DashboardState {
  preTestComprehensionScore: number // Pre test comprehension score
  preTestVocabularyScore: number // Pre test vocabulary score
  preTestAccuracy: number // Pre test accuracy
  preTestWPM: number // Pre test WPM
  preTestAverageScore: number // Pre test average score
  postTestComprehensionScore: number
  postTestVocabularyScore: number
  postTestAccuracy: number
  postTestWPM: number
  postTestAverageScore: number
  testTypeTab: TestTypeTab
  setPreTestScore: (submissions: Submission[]) => void
  setPostTestScore: (submissions: Submission[]) => void
  setTestTypeTab: (testTypeTab: TestTypeTab) => void
}

export const useDashboardStore = create<DashboardState>((set) => ({
  testTypeTab: TestTypeTab.PRE_TEST,
  preTestComprehensionScore: 0,
  preTestVocabularyScore: 0,
  preTestAccuracy: 0,
  preTestWPM: 0,
  preTestAverageScore: 0,
  postTestComprehensionScore: 0,
  postTestVocabularyScore: 0,
  postTestAccuracy: 0,
  postTestWPM: 0,
  postTestAverageScore: 0,
  setPreTestScore: (submissions: Submission[]) => {
    const filteredSubmissions = submissions.filter(
      (sub) => sub.testType === TestTypeTab.PRE_TEST,
    )
    const answers: Answer[] = filteredSubmissions
      .flatMap((sub) => sub.answers)
      .filter((answer) => answer.isCorrect === true)

    const totalNumberOfWords = filteredSubmissions.reduce(
      (acc, sub) => acc + sub.numberOfWords,
      0,
    )
    const totalMiscues = filteredSubmissions.reduce(
      (acc, sub) => acc + sub.miscues.length,
      0,
    )
    const totalCorrectWords = totalNumberOfWords - totalMiscues
    const totalDuration =
      filteredSubmissions.reduce((acc, sub) => acc + sub.duration, 0) / 60

    const preTestAccuracy = (totalCorrectWords / totalNumberOfWords) * 100
    const preTestWPM = totalCorrectWords / totalDuration
    const totalQuestions = filteredSubmissions.flatMap(
      (sub) => sub.answers,
    ).length
    const preTestAverageScore =
      (answers.filter((answer) => answer.type === 'COMPREHENSION').length +
        answers.filter((answer) => answer.type === 'VOCABULARY').length) /
      totalQuestions

    set({
      preTestComprehensionScore: answers.filter(
        (answer) => answer.type === 'COMPREHENSION',
      ).length,
      preTestVocabularyScore: answers.filter(
        (answer) => answer.type === 'VOCABULARY',
      ).length,
      preTestAccuracy: Math.round(preTestAccuracy),
      preTestWPM: Math.round(preTestWPM),
      preTestAverageScore: Math.round(preTestAverageScore),
    })
  },
  setPostTestScore: (submissions: Submission[]) => {
    const filteredSubmissions = submissions.filter(
      (sub) => sub.testType === TestTypeTab.POST_TEST,
    )
    const answers: Answer[] = filteredSubmissions
      .flatMap((sub) => sub.answers)
      .filter((answer) => answer.isCorrect === true)

    const totalNumberOfWords = filteredSubmissions.reduce(
      (acc, sub) => acc + sub.numberOfWords,
      0,
    )
    const totalMiscues = filteredSubmissions.reduce(
      (acc, sub) => acc + sub.miscues.length,
      0,
    )
    const totalCorrectWords = totalNumberOfWords - totalMiscues
    const totalDuration =
      filteredSubmissions.reduce((acc, sub) => acc + sub.duration, 0) / 60

    const postTestAccuracy = (totalCorrectWords / totalNumberOfWords) * 100
    const postTestWPM = totalCorrectWords / totalDuration
    const totalQuestions = filteredSubmissions.flatMap(
      (sub) => sub.answers,
    ).length
    const postTestAverageScore =
      (answers.filter((answer) => answer.type === 'COMPREHENSION').length +
        answers.filter((answer) => answer.type === 'VOCABULARY').length) /
      totalQuestions

    set({
      postTestComprehensionScore: answers.filter(
        (answer) => answer.type === 'COMPREHENSION',
      ).length,
      postTestVocabularyScore: answers.filter(
        (answer) => answer.type === 'VOCABULARY',
      ).length,
      postTestAccuracy: Math.round(postTestAccuracy),
      postTestWPM: Math.round(postTestWPM),
      postTestAverageScore: Math.round(postTestAverageScore),
    })
  },
  setTestTypeTab: (testTypeTab: TestTypeTab) => {
    set({ testTypeTab })
  },
}))
