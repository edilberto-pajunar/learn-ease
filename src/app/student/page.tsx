"use client";

import { useRouter } from "next/navigation";
import { useAuthStore } from "@/hooks/useAuthStore";

const HomePage: React.FC = () => {
  const {user} = useAuthStore();
  const router = useRouter();

  if (!user) {
    return <p>
      Loading...
    </p>;
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
              onClick={() => router.push("/student/reading")}
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
