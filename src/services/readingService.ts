import { db } from "@/firebase/client_app";
import { useAuthStore } from "@/hooks/useAuthStore";
import { Submission } from "@/interface/submission";
import { doc, setDoc, arrayUnion, getDoc, updateDoc, arrayRemove, collection } from "firebase/firestore";

export const readingService = {

    async endTime(studentId: string, materialId: string, time: Record<string, string>, miscues: string[]) {

        try {
            const ref = doc((collection(db, "users", studentId, "submissions")));
            await setDoc(ref, {
                recordTime: time,
                miscues: miscues ?? [],
            }, {
                merge: true,
            });
            console.log(`Student ID: ${studentId}: ${JSON.stringify(time)}`);

        } catch (error) {
            console.log("Error setting time: ", error);

        }
    },

    async submitAnswer(submission: Submission) {
        try {
            const ref = doc(collection(db, "submissions",));
            const studentId = submission.studentId;
            const materialId = submission.materialId;
            await setDoc(ref, {
                id: ref.id,
                answers: submission.answers,
                materialId: materialId,
                score: submission.score,
                studentId: studentId,
                submittedAt: new Date(),
                numberOfWords: submission.numberOfWords,
                duration: submission.duration,
            }, { merge: true });
            console.log(`StudentID: ${studentId}: Answer submitted: ${materialId}`);
        } catch (error) {
            console.log("Error submitting answer: ", error);
        }
    },
};