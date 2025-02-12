import { db } from "@/firebase/client_app";
import { Material } from "@/interface/material";
import { addDoc, collection, onSnapshot } from "firebase/firestore"

export const adminService = {
    listenToMaterials(callback: (data: Material[]) => void) : () => void {
        const unsubscribe = onSnapshot(
            collection(db, "materials"),
            (snapshot) => {
                const data: Material[] = snapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                })) as Material[];

                callback(data);


            }, (error) => {
                throw new Error("Failed to listen to data: " + error.message);
            }
        );

        return unsubscribe;
    },

    async addMaterial(data: Material) {
        try {
            const ref = collection(db, "materials");
            const docRef = await addDoc(ref, data);

        } catch (e) {
            console.log(e);
        }
    },

    async addQuestion() {
        try {
            const ref = collection(db, "materials");
        } catch (e) {

        }
    }
}