import { sendPasswordResetEmail } from 'firebase/auth'
import { auth } from '@/firebase/client_app'

export async function forgotPassword(email: string): Promise<void> {
  await sendPasswordResetEmail(auth, email)
}
