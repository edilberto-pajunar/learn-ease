import { db } from '@/firebase/client_app'
import { Submission } from '@/interface/submission'
import { collection, query, where, onSnapshot } from 'firebase/firestore'
import { create } from 'zustand'

interface SubmissionStore {
  submissions: Submission[]
  fetchSubmissions: (studentId: string) => Promise<void>
  unsubscribe: (() => void) | null
}

export const useSubmissionStore = create<SubmissionStore>((set, get) => ({
  submissions: [],
  fetchSubmissions: async (studentId) => {
    const submissionsRef = collection(db, 'submissions')
    const q = query(submissionsRef, where('studentId', '==', studentId))

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
