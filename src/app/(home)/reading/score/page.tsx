"use client";

import { useAuthStore } from "@/hooks/useAuthStore";
import { useEffect } from "react";

const ScorePage = () => {
  const { submissions, setSubmissions, isAuthenticated, user } = useAuthStore();

  useEffect(() => {
    if (isAuthenticated && user) {
      setSubmissions();
    }
  }, [isAuthenticated, user, setSubmissions]);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Your Score</h1>
      {submissions && submissions.length > 0 ? (
        <table className="table-auto border-collapse w-full border border-gray-200">
          <thead>
            <tr className="bg-gray-100 border-b border-gray-300">
              <th className="px-4 py-2 text-left">Item</th>
              <th className="px-4 py-2 text-left">Score</th>
              <th className="px-4 py-2 text-left">Date</th>
            </tr>
          </thead>
          <tbody>
            {submissions.map((submission, index) => (
              <tr
                key={index}
                className={`border-b border-gray-200 ${
                  index % 2 === 0 ? "bg-gray-50" : ""
                }`}
              >
                <td className="px-4 py-2">{submission.materialId}</td>
                <td className="px-4 py-2">{submission.score}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="text-lg">No submissions found.</p>
      )}
    </div>
  );
};

export default ScorePage;
