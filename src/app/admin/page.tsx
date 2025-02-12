"use client";

import { auth, db } from "@/firebase/client_app";
import { useAuthStore } from "@/hooks/useAuthStore";
import { AppUser, UserRole } from "@/interface/user";
import { onAuthStateChanged, User } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { redirect, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function AdminPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const {user, setUser, isAuthenticated, setIsAuthenticated} = useAuthStore();

  const fetchData = async () => {
    onAuthStateChanged(auth, async (firebaseUser: User | null) => {
      console.log(firebaseUser);
      if (firebaseUser) {
        try {
          const userRef = doc(db, "users", firebaseUser.uid);
          const userSnap = await getDoc(userRef);

          let user: AppUser;

          if (userSnap.exists()) {
            user = userSnap.data() as AppUser;
          } else {
            // 🔹 If no Firestore record, create a fallback user object
            user = {
              id: firebaseUser.uid,
              name: firebaseUser.displayName || "Anonymous",
              email: firebaseUser.email || "",
              createdAt: new Date(firebaseUser.metadata.creationTime || ""),
              role: UserRole.STUDENT,
            };
          }
          setUser(user);
          setIsAuthenticated(true);
          if (user.role === UserRole.STUDENT) {
            router.push("/student");
          }
          setLoading(false);
        } catch (e) {
          console.error("Error initializing auth state: ", e);
        }
      } else {
        setUser(null);
        setIsAuthenticated(false);
        redirect("/login");
      }
    });
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleNavigation = (path: string) => {
    router.push(path);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="max-w-6xl mx-auto p-8">
      <h1 className="text-4xl font-bold text-center text-blue-700 mb-4">
        Welcome to Admin Panel!
      </h1>
      <p className="text-center text-gray-600 mb-8">
        Manage students, materials, and view overall progress from one
        centralized dashboard.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Manage Students */}
        <div className="bg-white p-6 rounded-lg shadow-md text-center">
          <h2 className="text-2xl font-semibold text-blue-700 mb-2">
            Students
          </h2>
          <p className="text-gray-600 mb-4">
            View, add, or manage student details and performance records.
          </p>
          <button
            onClick={() => handleNavigation("/admin/students")}
            className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
          >
            Manage Students
          </button>
        </div>

        {/* Manage Materials */}
        <div className="bg-white p-6 rounded-lg shadow-md text-center">
          <h2 className="text-2xl font-semibold text-green-700 mb-2">
            Materials
          </h2>
          <p className="text-gray-600 mb-4">
            Add, edit, or delete reading materials for your students.
          </p>
          <button
            onClick={() => handleNavigation("/admin/materials")}
            className="bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700"
          >
            Manage Materials
          </button>
        </div>

        {/* View Summary Graph */}
        <div className="bg-white p-6 rounded-lg shadow-md text-center">
          <h2 className="text-2xl font-semibold text-purple-700 mb-2">
            Summary
          </h2>
          <p className="text-gray-600 mb-4">
            Analyze overall student performance and material effectiveness.
          </p>
          <button
            onClick={() => handleNavigation("/admin/summary")}
            className="bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700"
          >
            View Summary
          </button>
        </div>
      </div>
    </div>
  );
}
