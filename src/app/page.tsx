"use client";

import React from 'react';
import { useRouter } from 'next/navigation';

const HomePage = () => {
  const router = useRouter();

  const handleGetStarted = () => {
    router.push('/login');
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-blue-100 text-center p-6">
      <h1 className="text-5xl font-bold text-blue-700 mb-4">
        Welcome to Learn Ease
      </h1>
      <p className="text-lg text-gray-700 mb-8">
        Unlock knowledge and level up your skills through engaging courses.
      </p>
      <button 
        onClick={handleGetStarted} 
        className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white text-lg font-semibold rounded-2xl transition-all"
      >
        Get Started
      </button>
    </div>
  );
};

export default HomePage;
