import { db } from "@/firebase/client_app";
import { submissionService } from "@/services/submissionService";
import { collection, onSnapshot } from "firebase/firestore";
import { create } from "zustand";

interface SubmissionStore {
    submissions: Submission[],
    fetchSubmissions: () => void,
    unsubscribe: (() => void) | null;
}

export const useSubmissionStore = create<SubmissionStore>((set, get) => ({
    submissions: [],
    fetchSubmissions: () => {
        const submissionsRef = collection(db, "submissions");
    
        const unsubscribe = onSnapshot(submissionsRef, (snapshot) => {
          const submissions: Submission[] = snapshot.docs.map((doc) => (doc.data()) as Submission);
    
          set({ submissions });
        });
    
        set({ unsubscribe });
      },
    unsubscribe: null,
}));