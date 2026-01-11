import { db } from '@/firebase/client_app'
import { Material } from '@/interface/material'
import { Quarter } from '@/interface/quarter'
import {
  addDoc,
  collection,
  onSnapshot,
  doc,
  getDoc,
  setDoc,
  getDocs,
  updateDoc,
  deleteDoc,
} from 'firebase/firestore'

export const adminService = {
  listenToMaterials(callback: (data: Material[]) => void): () => void {
    const unsubscribe = onSnapshot(
      collection(db, 'materials'),
      (snapshot) => {
        const data: Material[] = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Material[]

        callback(data)
      },
      (error) => {
        throw new Error('Failed to listen to data: ' + error.message)
      },
    )

    return unsubscribe
  },

  async addMaterial(data: Material) {
    try {
      const ref = collection(db, 'materials')
      const docRef = await addDoc(ref, data)
      console.log('Document written with ID: ', docRef.id)
    } catch (e) {
      console.log(e)
    }
  },

  async updateMaterial(id: string, data: Partial<Material>) {
    try {
      const docRef = doc(db, 'materials', id)
      await updateDoc(docRef, data)
      console.log('Document updated successfully')
    } catch (e) {
      console.log(e)
      throw e
    }
  },

  async deleteMaterial(id: string) {
    try {
      const docRef = doc(db, 'materials', id)
      await deleteDoc(docRef)
      console.log('Document deleted successfully')
    } catch (e) {
      console.log(e)
      throw e
    }
  },

  // async addQuestion() {
  //   try {
  //     const ref = collection(db, 'materials')
  //   } catch (e) {
  //     console.log(e)
  //   }
  // },

  async getQuarter() {
    try {
      const docRef = doc(db, 'admin', 'quarters')
      const docSnap = await getDoc(docRef)

      if (docSnap.exists()) {
        return docSnap.data()
      } else {
        console.log('No such document!')
        return null
      }
    } catch (error) {
      console.error('Error getting document:', error)
      throw error
    }
  },
  async toggleQuarter(quarter: string) {
    try {
      const ref = doc(db, 'admin', 'quarters')
      const docSnap = await getDoc(ref)
      if (docSnap.exists()) {
        const data = docSnap.data()
        data.quarter = quarter
        await updateDoc(ref, data)
      } else {
        console.log('No such document!')
      }
    } catch (e) {
      console.log(e)
    }
  },
  async getTestType() {
    try {
      const docRef = doc(db, 'admin', 'testType')
      const docSnap = await getDoc(docRef)

      if (docSnap.exists()) {
        return docSnap.data()
      } else {
        console.log('No such document!')
        return null
      }
    } catch (error) {
      console.error('Error getting document:', error)
      throw error
    }
  },
  async toggleTestType(testType: string) {
    try {
      const ref = doc(db, 'admin', 'quarters')
      const docSnap = await getDoc(ref)
      if (docSnap.exists()) {
        const data = docSnap.data()
        data[testType] = !data[testType]
        await updateDoc(ref, data)
      } else {
        console.log('No such document!')
      }
    } catch (e) {
      console.log(e)
    }
  },

  async getSkills() {
    try {
      const skillsRef = collection(db, 'skills')
      const querySnapshot = await getDocs(skillsRef)

      const skills = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }))

      return skills
    } catch (error) {
      console.error('Error getting skills:', error)
      throw error
    }
  },

  async addSkill(data: { title: string }) {
    try {
      const ref = collection(db, 'skills')
      const docRef = await addDoc(ref, data)
      console.log('Skill added with ID: ', docRef.id)
      return docRef.id
    } catch (e) {
      console.log(e)
      throw e
    }
  },

  async updateSkill(id: string, data: { title: string }) {
    try {
      const docRef = doc(db, 'skills', id)
      await updateDoc(docRef, data)
      console.log('Skill updated successfully')
    } catch (e) {
      console.log(e)
      throw e
    }
  },

  async deleteSkill(id: string) {
    try {
      const docRef = doc(db, 'skills', id)
      await deleteDoc(docRef)
      console.log('Skill deleted successfully')
    } catch (e) {
      console.log(e)
      throw e
    }
  },

  listenToQuarter(callback: (data: Quarter | null) => void) {
    const docRef = doc(db, 'admin', 'quarters')

    const unsubscribe = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        callback(docSnap.data() as Quarter)
      } else {
        callback(null)
      }
    })
    return unsubscribe
  },
}
