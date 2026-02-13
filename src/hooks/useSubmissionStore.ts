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
  fetchSubmissions: (preTestId: string, postTestId: string) => Promise<void>
  preTestSubmissions: Submission[]
  postTestSubmissions: Submission[]
  fetchPreTestSubmission: (studentId: string, materialBatchId: string) => void
  fetchPostTestSubmission: (studentId: string, materialBatchId: string) => void
  setBatchId: (batchId: string) => void
  setBatchSubmissions: (batchId: string) => Promise<void>
  preTestUnsubscribe: (() => void) | null
  postTestUnsubscribe: (() => void) | null
}

export const useSubmissionStore = create<SubmissionStore>((set, get) => ({
  submissions: [],
  allSubmissions: [],
  batchId: null,
  batchSubmissions: [],
  loading: false,
  preTestSubmissions: [],
  postTestSubmissions: [],
  preTestUnsubscribe: null,
  postTestUnsubscribe: null,
  fetchPreTestSubmission: (studentId: string, materialBatchId: string) => {
    const prevUnsub = get().preTestUnsubscribe
    if (prevUnsub) prevUnsub()

    const submissionsRef = collection(db, 'submissions')
    const constraints = [
      where('studentId', '==', studentId),
      where('testType', '==', 'preTest'),
      where('materialBatch', '==', materialBatchId),
    ]
    const q = query(submissionsRef, ...constraints)

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const submissions: Submission[] = snapshot.docs.map((d) => ({
        id: d.id,
        ...d.data(),
      })) as Submission[]
      set({ preTestSubmissions: submissions })
    })

    set({ preTestUnsubscribe: unsubscribe })
  },
  fetchPostTestSubmission: (studentId: string, materialBatchId: string) => {
    const prevUnsub = get().postTestUnsubscribe
    if (prevUnsub) prevUnsub()

    const submissionsRef = collection(db, 'submissions')
    const constraints = [
      where('studentId', '==', studentId),
      where('testType', '==', 'postTest'),
      where('materialBatch', '==', materialBatchId),
    ]
    const q = query(submissionsRef, ...constraints)

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const submissions: Submission[] = snapshot.docs.map((d) => ({
        id: d.id,
        ...d.data(),
      })) as Submission[]
      set({ postTestSubmissions: submissions })
    })

    set({ postTestUnsubscribe: unsubscribe })
  },
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

  fetchSubmissions: async (preTestId: string, postTestId: string) => {
    const submissionsRef = collection(db, 'submissions')
    const q = query(
      submissionsRef,
      where('preTestId', '==', preTestId),
      where('postTestId', '==', postTestId),
    )
    const querySnapshot = await getDocs(q)
    const submissions: Submission[] = querySnapshot.docs.map(
      (doc) => ({ id: doc.id, ...doc.data() }) as Submission,
    )
    set({ submissions })
  },
  unsubscribe: null,
}))
