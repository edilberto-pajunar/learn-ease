"use client";

import BoldEachLetter from "@/components/BoldEachLetter";
import { FC, useEffect } from "react";
import { useReadStore } from "@/hooks/useReadStore";
import { useAuthStore } from "@/hooks/useAuthStore";
import materials from "@/data/reading_comprehension.json";
import { useRouter } from "next/navigation";

const ReadingPage: FC = () => {
  const {
    bionic,
    setBionic,
    currentIndex,
    setCurrentIndex,
    setCurrentMaterial,
    submitAnswer,
    handleAnswerChange,
    selectedAnswers,
    mistakes,
    calculateMistakes,
    isSubmitted,
    setIsSubmitted,
  } = useReadStore();
  const { user } = useAuthStore();
  const router = useRouter();

  const material = materials[currentIndex];
  const studentId = user?.id;

  const handleSubmit = async () => {
    console.log(isSubmitted);
    if (!isSubmitted) {
      calculateMistakes();
      console.log(
        `Submitted Answers: ${JSON.stringify(selectedAnswers, null, 2)}`
      );
      console.log(studentId);

      if (!studentId) return;

      await submitAnswer(studentId);
      setIsSubmitted();
    } else {
      if (currentIndex < materials.length - 1) {
        setCurrentIndex(currentIndex + 1);
      } else {
        console.log("Finished all passages");
        router.push("/reading/score");
      }
      setIsSubmitted();
    }
  };

  useEffect(() => {
    const material = materials[currentIndex];
    setCurrentMaterial(material);
  }, [currentIndex, setCurrentMaterial]);

  return (
    <div className="flex flex-col items-center px-6 py-8 max-w-4xl mx-auto">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex gap-4 items-center mb-4 justify-between">
          <h1 className="text-xl font-bold text-center">
            Interactive Reading Passage
          </h1>

          <div className="flex gap-2">
            <button
              onClick={() => setBionic(!bionic)}
              className={`px-4 h-6 rounded-full flex items-center transition-colors duration-300 ${
                bionic ? "bg-blue-600 text-white" : "bg-gray-300"
              }`}
            >
              Bionic
            </button>
            <p>
              {currentIndex + 1}/{materials.length}
            </p>
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-center gap-4 mb-6">
          <BoldEachLetter text={material["text"]} bionic={bionic} />
        </div>

        <div className="border-t border-gray-300 pt-4">
          <h2 className="text-lg font-semibold mb-4">
            Comprehension Questions
          </h2>
          <div className="space-y-6">
            {material.questions.map((question, index) => (
              <div key={index} className="mb-6">
                <h2 className="text-lg font-semibold mb-2">
                  {index + 1}. {question.title}
                </h2>

                <div className="flex flex-col gap-2">
                  {question.options.map((option, optIndex) => (
                    <label key={optIndex} className="flex items-center">
                      <input
                        className="mr-2"
                        type="radio"
                        name={question.title}
                        value={option}
                        onChange={() =>
                          handleAnswerChange(question.title, option)
                        }
                        checked={selectedAnswers[question.title] === option}
                      />
                      {option}
                    </label>
                  ))}
                </div>

                {isSubmitted && mistakes[question.title] && (
                  <p
                    className={`mt-2 ${
                      mistakes[question.title] === "Correct!"
                        ? "text-green-500"
                        : "text-red-500"
                    }`}
                  >
                    {mistakes[question.title]}
                  </p>
                )}
              </div>
            ))}

            <button
              type="submit"
              className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
              onClick={handleSubmit}
            >
              {isSubmitted
                ? currentIndex === materials.length - 1
                  ? "Finish"
                  : "Next"
                : "Submit"}
            </button>
          </div>
        </div>
      </div>

      <div className="mt-8 bg-gray-100 p-6 rounded-lg shadow-md">
        <h2 className="text-lg font-semibold mb-4">Fun Facts and Tips</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>
            <strong>Did you know?</strong> Reading can improve your focus and
            concentration!
          </li>
          <li>
            <strong>Tip:</strong> Set a daily reading goal to build a consistent
            habit!
          </li>
          <li>
            <strong>Fun Fact:</strong> Reading fiction can enhance your empathy
            and understanding of others.
          </li>
        </ul>
      </div>
    </div>
  );
};

export default ReadingPage;
