"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/firebase/client_app";

const HomePage: React.FC = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true); // State for managing loading

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        // If user is not logged in, redirect to login
        router.push("/login");
      } else {
        // User is logged in
        setLoading(false); // Stop loading once user is authenticated
      }
    });

    return () => unsubscribe();
  }, [router]);

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
    <div className="h-screen flex items-center justify-center bg-blue-50">
      <h1 className="text-3xl font-bold text-blue-600">
        Welcome to the Home Page!
      </h1>
    </div>
  );
};

export default HomePage;
