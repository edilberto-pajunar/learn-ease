import { create } from "zustand";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth, db } from "@/firebase/client_app";
import { AppUser } from "@/interface/user";
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
  initializeAuthState: () => void;
  setUser: (user: AppUser | null) => void;
  setSubmissions: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  isAuthenticated: false, // Default to logged out
  user: null,
  submissions: null,
  setIsAuthenticated: (isAuthenticated: boolean) => {
    set({ isAuthenticated });
  },
  initializeAuthState: () => {
    onAuthStateChanged(auth, async (firebaseUser: User | null) => {
      if (firebaseUser) {
        try {
          const userRef = doc(db, "users", firebaseUser.uid);
          const userSnap = await getDoc(userRef);

          let user: AppUser;

          if (userSnap.exists()) {
            user = userSnap.data() as AppUser;
          } else {
            // 🔹 If no Firestore record, create a fallback user object
            user = {
              id: firebaseUser.uid,
              name: firebaseUser.displayName || "Anonymous",
              email: firebaseUser.email || "",
              createdAt: new Date(firebaseUser.metadata.creationTime || ""),
            };
          }

          set({ isAuthenticated: true, user });

          // const { setSubmissions } = get();
          // await setSubmissions();
        } catch (e) {
          console.error("Error initializing auth state: ", e);
          set({ isAuthenticated: false, user: null });
        }
      }
    });
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
}));
