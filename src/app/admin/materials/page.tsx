"use client";

import { useAdminStore } from "@/hooks/useAdminStore";
import { useState, useEffect } from "react";
import { AddMaterialModal } from "./component/AddMaterialModal";

export default function MaterialsPage() {
  const { materials, loading, setMaterials } = useAdminStore((state) => state);

  // State for the form inputs
  const [newMaterialText, setNewMaterialText] = useState("");
  const [newQuestionText, setNewQuestionText] = useState("");
  const [newAnswerText, setNewAnswerText] = useState("");
  const [selectedMaterialId, setSelectedMaterialId] = useState<number | null>(
    null,
  );
  const [confirmationModelOpen, setConfirmationModelOpen] = useState(false);
  useEffect(() => {
    const unsubscribe = setMaterials();
    return () => unsubscribe();
  }, [setMaterials]);

  if (loading) return <div className="text-center py-4">Loading...</div>;

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Materials Management</h1>

      {/* Create New Material Form */}
      <div className="mb-12">
        <AddMaterialModal />

      </div>

      {/* Material List */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Materials List</h2>

        <ul className="space-y-6">
          {materials.map((material) => (
            <li key={material.id} className="border p-4 rounded-lg shadow-lg">
              <h3 className="text-2xl font-semibold">{material.text}</h3>

              {/* Show Questions and Answers */}
              {material.questions?.map((question, index) => (
                <div key={index} className="mt-4">
                  <div>
                    <p className="font-medium text-lg">Questions:</p>
                    {question.options.map((option, optionIndex) => {
                      const letters = ["a", "b", "c", "d"];
                      const letter = letters[optionIndex];
                      return (
                        <div key={optionIndex} className="pl-4">
                          <p>
                            <strong>{letter}:</strong> {option}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                  <p>
                    <strong>A:</strong> {question.answer}
                  </p>
                </div>
              ))}

              {/* Buttons for Edit and Delete */}
              <div className="mt-4 flex space-x-4">
                <button
                  onClick={() => { }}
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                >
                  Edit
                </button>
                <button className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700">
                  Delete
                </button>
              </div>

              {/* Add Question Form */}
              <div className="mt-4">
                <div>
                  <input
                    className="p-2 mb-4 w-full border rounded"
                    type="text"
                    value={newQuestionText}
                    onChange={(e) => setNewQuestionText(e.target.value)}
                    placeholder="Enter New Question"
                  />
                  <input
                    className="p-2 mb-4 w-full border rounded"
                    type="text"
                    value={newAnswerText}
                    onChange={(e) => setNewAnswerText(e.target.value)}
                    placeholder="Enter Answer"
                  />
                </div>
                <button className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 mr-4">
                  Add Question
                </button>
                <button className="px-6 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700">
                  Update Material
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
