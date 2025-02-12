import { create } from "zustand";
import { onAuthStateChanged, signOut, User } from "firebase/auth";
import { auth, db } from "@/firebase/client_app";
import { AppUser, UserRole } from "@/interface/user";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";

interface AuthState {
  isAuthenticated: boolean;
  user: AppUser | null;
  submissions: Submission[] | null;
  setIsAuthenticated: (isAuthenticated: boolean) => void;
  setUser: (user: AppUser | null) => void;
  setSubmissions: () => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  isAuthenticated: false, // Default to logged out
  user: null,
  submissions: null,
  setIsAuthenticated: (isAuthenticated: boolean) => {
    set({ isAuthenticated });
  },
  setUser: (user) => set({ user }),
  setSubmissions: async () => {
    const { user } = get();
    console.log(user);
    if (user) {
      try {
        const submissionsRef = collection(db, "submissions");
        const q = query(submissionsRef, where("studentId", "==", user.id));
        const querySnapshot = await getDocs(q);

        const submissions: Submission[] = querySnapshot.docs.map((doc) => {
          const data = doc.data() as Submission; // Get the document data
          return {
            ...data, // Include all fields from the submission
            docId: doc.id, // Add the Firestore document ID explicitly
          };
        });
        set({ submissions: submissions });
      } catch (e) {
        console.error("Error fetching submissions: ", e);
        set({ submissions: null });
      }
    }
  },
  logout: async () => {
    await signOut(auth);
    set({
      user: null,
      isAuthenticated: false,
    });
  },
}));
