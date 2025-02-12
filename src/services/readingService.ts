import { db } from "@/firebase/client_app";
import { doc, setDoc } from "firebase/firestore";

export const readingService = {
  
    async setTime(studentId: string, materialId: string, time: Record<string, string>) {
        
        try {
            const ref = doc(db, `submissions`, `${studentId}_${materialId}`);
            const docRef = await setDoc(ref, time, {
              merge: true,
            });
            
        } catch (error) {

        }
    }

};