import { db } from '@/firebase/client_app'
import { Submission } from '@/interface/submission'
import {
  collection,
  query,
  where,
  onSnapshot,
  getDocs,
} from 'firebase/firestore'
import { create } from 'zustand'

interface SubmissionStore {
  submissions: Submission[]
  allSubmissions: Submission[]
  batchId: string | null
  batchSubmissions: Submission[]
  loading: boolean
  fetchAllSubmissions: () => Promise<void>
  fetchSubmissions: (studentId: string) => Promise<void>
  setBatchId: (batchId: string) => void
  setBatchSubmissions: (batchId: string) => Promise<void>
  unsubscribe: (() => void) | null
}

export const useSubmissionStore = create<SubmissionStore>((set) => ({
  submissions: [],
  allSubmissions: [],
  batchId: null,
  batchSubmissions: [],
  loading: false,
  fetchAllSubmissions: async () => {
    const submissionsRef = collection(db, 'submissions')
    const q = query(submissionsRef)

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const submissions: Submission[] = snapshot.docs.map(
        (doc) => ({ id: doc.id, ...doc.data() }) as Submission,
      )
      set({ allSubmissions: submissions })
    })
  },
  setBatchId: (batchId) => set({ batchId }),
  setBatchSubmissions: async (batchId: string) => {
    try {
      set({ loading: true })
      const submissionsRef = collection(db, 'submissions')
      const q = query(submissionsRef, where('materialBatch', '==', batchId))
      const querySnapshot = await getDocs(q)

      const submissions: Submission[] = querySnapshot.docs.map(
        (doc) => ({ id: doc.id, ...doc.data() }) as Submission,
      )

      set({ batchSubmissions: submissions, loading: false })
    } catch (error) {
      console.error('Error fetching batch submissions:', error)
      set({ batchSubmissions: [], loading: false })
    }
  },

  fetchSubmissions: async (studentId) => {
    const submissionsRef = collection(db, 'submissions')
    const q = query(submissionsRef, where('studentId', '==', studentId))
    console.log(studentId)

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const submissions: Submission[] = snapshot.docs.map(
        (doc) => ({ id: doc.id, ...doc.data() }) as Submission,
      )
      console.log(submissions)

      set({ submissions })
    })

    set({ unsubscribe })
  },
  unsubscribe: null,
}))
