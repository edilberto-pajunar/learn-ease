import { AppUser, UserRole } from "@/interface/user";
import { create } from "zustand";
import { db } from "@/firebase/client_app";
import { collection, getDocs, query, where } from "firebase/firestore";

interface AdminState {
  students: AppUser[];
  setStudents: () => void;
}

export const useAdminStore = create<AdminState>((set) => ({
  students: [],
  setStudents: async () => {
    try {
      const studentsRef = collection(db, "users");
      const q = query(studentsRef, where("role", "==", UserRole.STUDENT));

      const querySnapshot = await getDocs(q);

      const studentUsers = querySnapshot.docs.map((doc) => {
        const data = doc.data() as AppUser; // Get the document data
        return {
          ...data, // Include all fields from the submission
          id: doc.id, // Add the Firestore document ID explicitly
        };
      });
      set({ students: studentUsers });
    } catch (e) {}
  },
}));
