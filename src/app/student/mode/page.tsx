"use client";

import React from 'react'
import { useRouter } from 'next/navigation';
import { useReadStore } from '@/hooks/useReadStore';

function ModePage() {
    const router = useRouter();
    const { difficulty, setDifficulty } = useReadStore();

    const handleDifficultySelect = (difficulty: string) => {
        // Handle difficulty selection
        setDifficulty(difficulty);
        router.push("/student/reading");
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
            <h1 className="text-2xl font-bold mb-6">Select Difficulty</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-md">
                <button onClick={() => handleDifficultySelect("easy")} className="bg-green-500 text-white py-3 px-6 rounded-lg shadow-md hover:bg-green-600 transition">Easy</button>
                <button onClick={() => handleDifficultySelect("medium")} className="bg-yellow-500 text-white py-3 px-6 rounded-lg shadow-md hover:bg-yellow-600 transition">Medium</button>
                <button onClick={() => handleDifficultySelect("hard")} className="bg-red-500 text-white py-3 px-6 rounded-lg shadow-md hover:bg-red-600 transition">Hard</button>
            </div>
        </div>
    );
}

export default ModePage;
