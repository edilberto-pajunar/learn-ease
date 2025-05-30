import { db } from '@/firebase/client_app'
import { Material } from '@/interface/material'
import {
  addDoc,
  collection,
  onSnapshot,
  doc,
  getDoc,
  setDoc,
  getDocs,
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
      await setDoc(ref, { quarter })
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
}
