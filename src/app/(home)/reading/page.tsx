"use client";

import BoldEachLetter from "@/components/BoldEachLetter";
import { FC, useState } from "react";

const ReadingPage: FC = () => {
  const [isSwitched, setIsSwitched] = useState(false);

  return (
    <div className="flex flex-col items-center px-6 py-8 max-w-4xl mx-auto">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex gap-4">
          <h1 className="text-xl font-bold text-center mb-6">
            Interactive Reading Passage
          </h1>
          <button
            onClick={() => setIsSwitched(!isSwitched)}
            className={`px-4 h-6 rounded-full flex items-center transition-colors duration-300 ${
              isSwitched ? "bg-blue-600 text-white" : "bg-gray-300"
            }`}
          >
            Bionic
          </button>
        </div>

        <div className="flex flex-col md:flex-row items-center gap-4 mb-6">
          <BoldEachLetter
            text="In a small village nestled between the mountains, there was a mysterious forest known for its magical properties. The villagers"
            bionic={isSwitched}
          />
          {/* <img
            src="/forest.jpg" // Replace with the actual image path
            alt="Forest"
            className="w-32 h-32 rounded-md object-cover"
          /> */}
        </div>

        <div className="border-t border-gray-300 pt-4">
          <h2 className="text-lg font-semibold mb-4">
            Comprehension Questions
          </h2>
          <form className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">
                1. What is the main idea of the passage?
              </label>
              <div className="flex flex-col gap-2">
                <label className="flex items-center">
                  <input type="radio" name="question1" className="mr-2" />
                  Option 1
                </label>
                <label className="flex items-center">
                  <input type="radio" name="question1" className="mr-2" />
                  Option 2
                </label>
                <label className="flex items-center">
                  <input type="radio" name="question1" className="mr-2" />
                  Option 3
                </label>
                <label className="flex items-center">
                  <input type="radio" name="question1" className="mr-2" />
                  Option 4
                </label>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                2. Which statement is true according to the passage?
              </label>
              <div className="flex flex-col gap-2">
                <label className="flex items-center">
                  <input type="radio" name="question2" className="mr-2" />
                  Statement 1
                </label>
                <label className="flex items-center">
                  <input type="radio" name="question2" className="mr-2" />
                  Statement 2
                </label>
                <label className="flex items-center">
                  <input type="radio" name="question2" className="mr-2" />
                  Statement 3
                </label>
                <label className="flex items-center">
                  <input type="radio" name="question2" className="mr-2" />
                  Statement 4
                </label>
              </div>
            </div>

            <button
              type="submit"
              className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
            >
              Submit
            </button>
          </form>
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
