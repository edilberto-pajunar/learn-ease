import { AppUser, UserRole } from '@/interface/user'
import { create } from 'zustand'
import { db } from '@/firebase/client_app'
import { collection, getDocs, query, where } from 'firebase/firestore'
import { Material } from '@/interface/material'
import { adminService } from '@/services/adminService'

interface AdminState {
  students: AppUser[]
  materials: Material[]
  quarter: string
  loading: boolean
  skills: any[]
  setStudents: () => void
  setMaterials: () => () => void
  toggleQuarter: (quarter: string) => void
  addMaterial: (material: Material) => Promise<void>
  updateMaterial: (id: string, material: Partial<Material>) => Promise<void>
  deleteMaterial: (id: string) => Promise<void>
  getQuarter: () => Promise<void>
  getSkills: () => Promise<void>
}

export const useAdminStore = create<AdminState>((set) => ({
  students: [],
  materials: [],
  loading: false,
  quarter: 'Q1',
  skills: [],
  setStudents: async () => {
    try {
      const studentsRef = collection(db, 'users')
      const q = query(studentsRef, where('role', '==', UserRole.STUDENT))

      const querySnapshot = await getDocs(q)

      const studentUsers = querySnapshot.docs.map((doc) => {
        const data = doc.data() as AppUser // Get the document data
        return {
          ...data, // Include all fields from the submission
          id: doc.id, // Add the Firestore document ID explicitly
        }
      })
      set({ students: studentUsers })
    } catch (e) {
      console.error('Error fetching students:', e)
    }
  },
  setMaterials: () => {
    set({ loading: true })
    const unsubscribe = adminService.listenToMaterials((data) => {
      set({ materials: data, loading: false })
    })

    return () => unsubscribe
  },
  addMaterial: async (material: Material) => {
    await adminService.addMaterial(material)
  },
  updateMaterial: async (id: string, material: Partial<Material>) => {
    await adminService.updateMaterial(id, material)
  },
  deleteMaterial: async (id: string) => {
    await adminService.deleteMaterial(id)
  },
  toggleQuarter: async (quarter: string) => {
    await adminService.toggleQuarter(quarter)
    await useAdminStore.getState().getQuarter()
  },
  getQuarter: async () => {
    const quarter = await adminService.getQuarter()
    set({ quarter: quarter?.quarter })
  },
  getSkills: async () => {
    try {
      const skills = await adminService.getSkills()
      set({ skills })
    } catch (error) {
      console.error('Error fetching skills:', error)
    }
  },
}))
