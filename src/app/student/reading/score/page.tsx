"use client";

import { useAuthStore } from "@/hooks/useAuthStore";
import { useScoreStore } from "@/hooks/useScoreStore";
import { useEffect } from "react";
import MaterialCard from "../component/MaterialCard";


// 📊 Score Page for Multiple Materials
const ScorePage = () => {
  const {submissions, setSubmissions} = useScoreStore();
  const {user} = useAuthStore();

  const studentId = user?.id;

  // Simulate fetching submissions
  useEffect(() => {
    if (!studentId) return;
    setSubmissions(studentId);
  }, [studentId]);

  return (
    <div className="bg-gray-50 min-h-screen py-10">
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <h1 className="text-4xl font-bold text-blue-800 mb-6 text-center">
          📚 All Material Submissions
        </h1>

        {/* Submission List */}
        {submissions.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
            {submissions.map((submission) => (
              <MaterialCard key={submission.materialId} submission={submission} />
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500 mt-12">
            No submissions found. Start your reading journey!
          </p>
        )}
      </div>
    </div>
  );
};

export default ScorePage;
