import { AppUser, UserRole } from "@/interface/user";
import { create } from "zustand";
import { db } from "@/firebase/client_app";
import { collection, getDocs, query, where } from "firebase/firestore";
import { Material, Question } from "@/interface/material";
import { adminService } from "@/services/adminService";

interface AdminState {
  students: AppUser[];
  materials: Material[];
  loading: boolean;
  setStudents: () => void;
  setMaterials: () => () => void;
  addMaterial: () => void;
}

export const useAdminStore = create<AdminState>((set) => ({
  students: [],
  materials: [],
  loading: false,
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
  setMaterials: () => {
    set({ loading: true});
    const unsubscribe = adminService.listenToMaterials((data) => {
      set({ materials: data, loading: false});
    });

    return unsubscribe;
  },
  addMaterial: () => {
    const question : Question = {
      title: "",
      answer: "",
      options: [],
    }

    const material : Material = {
      id: "",
      questions: [],
      text: "",
    }
    adminService.addMaterial(material);
  },
}));
