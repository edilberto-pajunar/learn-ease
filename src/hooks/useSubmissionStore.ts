import { db } from "@/firebase/client_app";
import { Submission } from "@/interface/submission";
import { collection, doc, onSnapshot } from "firebase/firestore";
import { create } from "zustand";

interface SubmissionStore {
  submissions: Submission[],
  fetchSubmissions: (studentId: string) => Promise<void>,
  unsubscribe: (() => void) | null;
}

export const useSubmissionStore = create<SubmissionStore>((set, get) => ({
  submissions: [],
  fetchSubmissions: async (studentId) => {
    const submissionsRef = collection(doc(db, "users", studentId), "submissions");

    const unsubscribe = onSnapshot(submissionsRef, (snapshot) => {
      const submissions: Submission[] = snapshot.docs.map((doc) => (doc.data()) as Submission);


      set({ submissions });
    });

    set({ unsubscribe });
  },
  unsubscribe: null,
}));