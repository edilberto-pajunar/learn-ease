'use client'

import { auth, db } from '@/firebase/client_app'
import { useAuthStore } from '@/hooks/useAuthStore'
import { AppUser, UserRole } from '@/interface/user'
import { onAuthStateChanged, User } from 'firebase/auth'
import { doc, getDoc } from 'firebase/firestore'
import { redirect } from 'next/navigation'
import { useEffect } from 'react'

export default function Wrapper({ children }: any) {
  const { setUser, setIsAuthenticated } = useAuthStore()

  const fetchData = async () => {
    onAuthStateChanged(auth, async (firebaseUser: User | null) => {
      console.log(firebaseUser)
      if (firebaseUser) {
        try {
          const userRef = doc(db, 'users', firebaseUser.uid)
          const userSnap = await getDoc(userRef)

          let user: AppUser

          if (userSnap.exists()) {
            user = userSnap.data() as AppUser
          } else {
            // 🔹 If no Firestore record, create a fallback user object
            user = {
              id: firebaseUser.uid,
              name: firebaseUser.displayName || 'Anonymous',
              email: firebaseUser.email || '',
              createdAt: new Date(firebaseUser.metadata.creationTime || ''),
              role: UserRole.STUDENT,
            }
          }
          setUser(user)
          setIsAuthenticated(true)
        } catch (e) {
          console.error('Error initializing auth state: ', e)
        }
      } else {
        setUser(null)
        setIsAuthenticated(false)
        redirect('/login')
      }
    })
  }

  useEffect(() => {
    fetchData()
  }, [])

  return <div className="">{children}</div>
}
