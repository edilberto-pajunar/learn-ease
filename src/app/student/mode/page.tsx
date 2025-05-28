'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import { useReadStore } from '@/hooks/useReadStore'

function ModePage() {
  const router = useRouter()
  const { materials, setIndexMaterial, setIndexQuestion, resetScore } =
    useReadStore()

  const handleTestType = (testType: string) => {
    // Handle difficulty selection\
    if (materials.length !== 0) {
      setIndexMaterial(0)
      setIndexQuestion(0)
      resetScore()
    }

    router.push(`/student/reading?testType=${testType}`)
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-blue-50 to-blue-100 p-4">
      <h1 className="text-2xl font-bold mb-6">
        Is this pre test or post test?
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-md">
        <button
          onClick={() => handleTestType('pre_test')}
          className="bg-green-500 text-white py-3 px-6 rounded-lg shadow-md hover:bg-green-600 transition"
        >
          Pre Test
        </button>
        <button
          onClick={() => handleTestType('post_test')}
          className="bg-yellow-500 text-white py-3 px-6 rounded-lg shadow-md hover:bg-yellow-600 transition"
        >
          Post Test
        </button>
      </div>
    </div>
  )
}

export default ModePage
