"use client";

import { useReadStore } from "@/hooks/useReadStore";
import { Question } from "@/interface/material";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function QuestionCard({
  questions,
  studentId,
}: {
  questions: Question[];
  studentId: string;
}) {
  const router = useRouter();

  const { isLoading, indexMaterial, indexQuestion, currentAnswers, materials, score, setCurrentAnswers, setIndexQuestion, setIndexMaterial, submitAnswer, setScore } = useReadStore();
  const [answer, setAnswer] = useState<string | null>(null);

  const question = questions[indexQuestion];

  const handleAnswer = (word: string) => {
    setAnswer(word);
  };

  const nextQuestion = async () => {
    setIndexQuestion(indexQuestion + 1);
    setCurrentAnswers(answer!);

    if (answer === question.answer) setScore();

    if (indexQuestion + 1 === questions.length) {
      await submitAnswer(studentId);
      setIndexMaterial(indexMaterial + 1);

      if (indexMaterial + 1 === materials.length) {
        router.push("/student/reading/score");
        setIndexMaterial(0);
      }
    }
    setAnswer(null);
  }

  return (
    isLoading ? <div>Loading...</div> : <div className="flex flex-col items-center justify-center p-4">
      {/* Question Counter */}
      <div className="mb-4 text-right">
        <span className="bg-gray-200 px-4 py-1 rounded-full text-sm font-semibold">
          Question: {indexQuestion + 1} / {questions.length}
        </span>
      </div>

      {/* Question Text */}
      <h1 className="text-2xl font-semibold mb-6">
        {question.title}
      </h1>

      {/* Options */}
      <div className="space-y-3">
        {question.options.map((option, index) => (
          <button
            key={index}
            onClick={() => handleAnswer(option)}
            className={`w-full p-4 text-left border border-gray-300 rounded-xl shadow transition-all duration-300
      ${answer === option
                ? "bg-blue-500 text-white border-blue-600 shadow-lg"
                : "bg-white text-gray-800 hover:bg-blue-50 hover:shadow-md"
              }`}
          >
            {option}
          </button>
        ))}
      </div>

      {/* Next Button */}
      <button
        onClick={nextQuestion}
        disabled={!answer}
        className={`mt-6 px-6 py-3 rounded-md text-white font-semibold transition ${!answer
          ? "bg-gray-400 cursor-not-allowed"
          : "bg-blue-500 hover:bg-blue-600"
          }`}
      >
        {indexQuestion === questions.length - 1 ? "Finish" : "Next"}
      </button>
    </div>

  );
}