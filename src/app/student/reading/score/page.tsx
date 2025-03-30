"use client";

import { useAuthStore } from "@/hooks/useAuthStore";
import { useSubmissionStore } from "@/hooks/useSubmissionStore";
import { useEffect } from "react";


// 📊 Score Page for Multiple Materials
const ScorePage = () => {
  const { user } = useAuthStore();
  const { submissions, fetchSubmissions, } = useSubmissionStore();

  const studentId = user?.id;

  // Simulate fetching submissions
  useEffect(() => {
    if (!studentId) return;

    fetchSubmissions(studentId);
  }, [studentId]);

  return (
    <div className="bg-gray-50 min-h-screen py-10">
      <div className="max-w-6xl mx-auto px-6">

      </div>
    </div>
  );
};

export default ScorePage;
