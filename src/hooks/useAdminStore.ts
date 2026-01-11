import { AppUser, UserRole } from '@/interface/user'
import { create } from 'zustand'
import { db } from '@/firebase/client_app'
import {
  collection,
  getDocs,
  query,
  Unsubscribe,
  where,
} from 'firebase/firestore'
import { Material } from '@/interface/material'
import { adminService } from '@/services/adminService'
import { Skill } from '@/interface/skill'
import { submissionService } from '@/services/submissionService'
import { pdfService } from '@/services/pdfService'
import { doc, getDoc } from 'firebase/firestore'
import { Quarter } from '@/interface/quarter'

interface AdminState {
  students: AppUser[]
  materials: Material[]
  quarter: Quarter | null
  testType: string
  loading: boolean
  skills: Skill[]
  allMaterials: Material[]
  quarterUnsubscribe: Unsubscribe | null
  setStudents: () => void
  setMaterials: () => () => void
  toggleQuarter: (quarter: string) => Promise<void>
  toggleTestType: (testType: string) => void
  addMaterial: (material: Material) => Promise<void>
  updateMaterial: (id: string, material: Partial<Material>) => Promise<void>
  deleteMaterial: (id: string) => Promise<void>
  getQuarter: () => Promise<void>
  getTestType: () => Promise<void>
  getSkills: () => Promise<void>
  fetchAllMaterials: () => Promise<void>
  exportAllSubmissions: (studentId: string) => Promise<void>
}

export const useAdminStore = create<AdminState>((set) => ({
  students: [],
  materials: [],
  loading: false,
  quarter: null,
  testType: 'pre_test',
  skills: [],
  allMaterials: [],
  quarterUnsubscribe: null,
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
    set({ loading: true })
    await adminService.toggleQuarter(quarter)
    set({ loading: false })
  },
  getQuarter: async () => {
    const { quarterUnsubscribe } = useAdminStore.getState()
    if (quarterUnsubscribe) {
      quarterUnsubscribe()
      set({ quarterUnsubscribe: null })
    }

    const quarterListener = adminService.listenToQuarter((data) => {
      set({ quarter: data })
    })

    set({ quarterUnsubscribe: quarterListener })
    // const quarter = await adminService.getQuarter()
    // set({ quarter: quarter?.quarter })
  },
  toggleTestType: async (testType: string) => {
    await adminService.toggleTestType(testType)
  },
  getTestType: async () => {
    const testType = await adminService.getTestType()
    set({ testType: testType?.testType || 'pre_test' })
  },
  getSkills: async () => {
    try {
      const skills = await adminService.getSkills()
      set({ skills: skills as Skill[] })
    } catch (error) {
      console.error('Error fetching skills:', error)
    }
  },
  fetchAllMaterials: async () => {
    const materialsRef = collection(db, 'materials')
    const q = query(materialsRef)
    const querySnapshot = await getDocs(q)
    const materials = querySnapshot.docs.map((doc) => doc.data() as Material)
    set({ allMaterials: materials })
  },
  exportAllSubmissions: async (studentId: string) => {
    const submissions = await submissionService.getSubmissions(studentId)

    let studentName = 'Unknown Student'
    try {
      const studentDoc = await getDoc(doc(db, 'users', studentId))
      if (studentDoc.exists()) {
        const studentData = studentDoc.data() as AppUser
        studentName = studentData.name || studentName
      } else {
        const student = useAdminStore
          .getState()
          .students.find((s) => s.id === studentId)
        if (student) {
          studentName = student.name
        }
      }
    } catch (error) {
      console.error('Error fetching student name:', error)
      const student = useAdminStore
        .getState()
        .students.find((s) => s.id === studentId)
      if (student) {
        studentName = student.name
      }
    }

    await pdfService.generatePdf({
      studentName,
      submissions: submissions || [],
    })
  },
}))
