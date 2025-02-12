"use client";

import { useEffect, useLayoutEffect, useState } from "react";
import { redirect, useRouter } from "next/navigation";
import { useAuthStore } from "@/hooks/useAuthStore";
import { AppUser, UserRole } from "@/interface/user";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth, db } from "@/firebase/client_app";
import withAuth from "@/components/withAuth";
import { sessionStatus } from "../utils/session";
import { doc, getDoc } from "firebase/firestore";

const HomePage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const {setUser, setIsAuthenticated} = useAuthStore();
  const router = useRouter();

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
          if (user.role === UserRole.ADMIN) {
            router.push("/admin");
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

  if (loading) {
    // Render loading indicator while checking auth state
    return (
      <div className="h-screen flex items-center justify-center bg-blue-50">
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-blue-600 text-lg font-semibold">
            Checking authentication...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-100">
      <div className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <section className="text-center mb-12">
          <h1 className="text-4xl font-bold text-blue-600 mb-4">
            Welcome to LearnEase!
          </h1>
          <p className="text-lg text-gray-700">
            Your personalized platform to track progress and enhance your
            learning journey.
          </p>
        </section>

        {/* Cards Section */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white shadow-md rounded-lg p-6 text-center hover:shadow-lg transition-shadow">
            <h2 className="text-xl font-semibold text-blue-600 mb-4">
              Reading Test
            </h2>
            <p className="text-gray-600">
              Practice your reading skills and track your comprehension
              progress.
            </p>
            <button
              // onClick={() => router.push("/reading")}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Start Reading Test
            </button>
          </div>
          <div className="bg-white shadow-md rounded-lg p-6 text-center hover:shadow-lg transition-shadow">
            <h2 className="text-xl font-semibold text-blue-600 mb-4">
              Progress Dashboard
            </h2>
            <p className="text-gray-600">
              Visualize your learning progress and set your next goals.
            </p>
            <button
              // onClick={() => router.push("/dashboard")}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              View Dashboard
            </button>
          </div>
          <div className="bg-white shadow-md rounded-lg p-6 text-center hover:shadow-lg transition-shadow">
            <h2 className="text-xl font-semibold text-blue-600 mb-4">
              Resources
            </h2>
            <p className="text-gray-600">
              Access a curated list of resources to boost your skills.
            </p>
            <button
              // onClick={() => router.push("/resources")}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Explore Resources
            </button>
          </div>
        </section>
      </div>
    </div>
  );
};

export default HomePage;
