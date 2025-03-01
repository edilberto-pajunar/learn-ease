import { db } from "@/firebase/client_app";
import { doc, setDoc, arrayUnion, getDoc, updateDoc, arrayRemove } from "firebase/firestore";

export const readingService = {
  
    async endTime(studentId: string, materialId: string, time: Record<string, string>, miscues: string[]) {
        
        try {
            const ref = doc(db, `submissions`, `${studentId}_${materialId}`);
            await setDoc(ref, {
                recordTime: time,
                miscues: miscues,
            }, {
              merge: true,
            });
            console.log(`Student ID: ${studentId}: ${JSON.stringify(time)}`);
            
        } catch (error) {
            console.log("Error setting time: ", error);

        }
    },

    async submitAnswer(studentId: string, materialId: string, answers: Record<string, string>, score: number) {
        try {
            const ref = doc(db, `submissions`, `${studentId}_${materialId}`);
            await setDoc(ref, {
                answers,
                materialId: materialId,
                score: score,
                studentId: studentId,
                submittedAt: new Date(),
            }, {merge: true});
            console.log(`StudentID: ${studentId}: Answer submitted: ${materialId}`);
        } catch (error) {
            console.log("Error submitting answer: ", error);
        }
    },
};