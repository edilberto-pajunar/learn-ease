"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AdminPage() {
  const router = useRouter();

  const handleNavigation = (path: string) => {
    router.push(path);
  };

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
