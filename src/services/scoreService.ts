import { db } from "@/firebase/client_app";
import { collection, getDocs, query, where } from "firebase/firestore";

export const scoreService = {
    async getSubmissions(studentId: string) {
        try {
            const ref = collection(db, "submissions");
            const q = query(ref, where("studentId", "==", studentId));
            const querySnapshot = await getDocs(q);

            const submissions = querySnapshot.docs.map((doc) => (doc.data()) as Submission);
            return submissions;
        } catch (e) {
            console.log("Error getting scores: ", e);
        }
    }
}