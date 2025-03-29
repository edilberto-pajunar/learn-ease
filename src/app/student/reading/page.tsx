"use client";

import { FC, useEffect, useState } from "react";
import { useReadStore } from "@/hooks/useReadStore";
import { useAuthStore } from "@/hooks/useAuthStore";
import { wordCount } from "@/app/utils/wordCount";
import FunFact from "./component/FunFact";
import QuestionCard from "./component/QuestionCard";
import TimeCard from "./component/TimeCard";

const ReadingPage: FC = () => {
  const {
    materials,
    indexMaterial,
    miscues,
    duration,
    fetchMaterials,
  } = useReadStore();

  const { user } = useAuthStore();
  const [formError] = useState<string | null>(null);

  useEffect(() => {
    fetchMaterials();

    return () => { };
  }, [fetchMaterials]);

  if (materials.length === 0) {
    return <p>Loading...</p>;
  }

  const studentId = user?.id;
  const material = materials[indexMaterial];

  return (
    <div className="flex flex-col items-center px-6 py-8 max-w-4xl mx-auto">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex gap-4 items-center mb-4 justify-between">
          <h1 className="text-xl font-bold text-center">
            Interactive Reading Passage
          </h1>

          <div className="flex items-center gap-4 p-2 bg-blue-50 border border-blue-200 rounded-lg shadow-sm">
            <div className="flex items-center gap-2">
              <span className="text-blue-500 font-bold text-lg">
                {wordCount(material.text)}
              </span>
              <p className="text-gray-500 text-sm font-semibold">words</p>
            </div>
            <div className="flex items-center gap-1 text-gray-700 text-sm font-medium">
              <span className="px-2 py-1 bg-gray-200 rounded-md">
                {indexMaterial + 1}
              </span>
              <span className="text-gray-400">/</span>
              <span className="px-2 py-1 bg-gray-200 rounded-md">
                {materials.length}
              </span>
            </div>
          </div>
        </div>

        {/* Show Form Error if exists */}
        {formError && (
          <div className="mb-4 p-3 text-red-600 bg-red-100 border border-red-400 rounded">
            {formError}
          </div>
        )}

        {/* Reading Passages */}
        <TimeCard
          material={material}
        />

        {
          miscues.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {miscues.map((word, index) => (
                <span
                  onClick={() => { }}
                  key={index}
                  className="bg-gray-200 text-gray-700 px-3 py-1 rounded-full text-sm"
                >
                  {word}
                </span>
              ))}
            </div>
          )
        }

        {/* Comprehension Questions */}
        <div className="mt-4 border-t border-gray-300 pt-4">
          <h2 className="text-lg font-semibold mb-4">
            Comprehension Questions
          </h2>
          <div>
            <p className="text-gray-500 text-sm mb-4">
              Answer the following comprehension questions.
            </p>
          </div>

          {duration ? (
            <QuestionCard
              questions={material.questions}
              studentId={studentId!}
            />
          ) : (
            <div>
              <p className="text-red-500 text-sm mb-4 ">
                Please complete the reading passage first.
              </p>
            </div>
          )
          }

        </div>
      </div>

      {/* Fun Facts Section */}
      <FunFact />
    </div >
  );
};

export default ReadingPage;
