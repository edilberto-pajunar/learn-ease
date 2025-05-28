'use client'

import { FC, useEffect, useState } from 'react'
import { useReadStore } from '@/hooks/useReadStore'
import { useAuthStore } from '@/hooks/useAuthStore'
import { wordCount } from '@/app/utils/wordCount'
import FunFact from './component/FunFact'
import QuestionCard from './component/QuestionCard'
import TimeCard from './component/TimeCard'
import { useAdminStore } from '@/hooks/useAdminStore'

const ReadingPage: FC = () => {
  const { materials, indexMaterial, miscues, duration, fetchMaterials } =
    useReadStore()
  const { quarter } = useAdminStore()

  const { user } = useAuthStore()
  const [formError] = useState<string | null>(null)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [speechRate, setSpeechRate] = useState(1)

  useEffect(() => {
    fetchMaterials(quarter)

    return () => {}
  }, [fetchMaterials])

  if (materials.length === 0) {
    return <p>Loading...</p>
  }

  const studentId = user?.id
  const material = materials[indexMaterial]

  const speakText = () => {
    if ('speechSynthesis' in window) {
      if (isSpeaking) {
        window.speechSynthesis.cancel()
        setIsSpeaking(false)
        return
      }

      const utterance = new SpeechSynthesisUtterance(material.text)
      utterance.rate = speechRate
      utterance.onend = () => setIsSpeaking(false)
      utterance.onerror = () => setIsSpeaking(false)
      window.speechSynthesis.speak(utterance)
      setIsSpeaking(true)
    }
  }

  return (
    <div className="flex flex-col items-center px-6 py-8 max-w-4xl mx-auto">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex gap-4 items-center mb-4 justify-between">
          <div className="flex gap-4">
            <h1 className="text-xl font-bold text-center">
              {quarter} Interactive Reading Passage
            </h1>

            <div className="flex items-center gap-2">
              <button
                onClick={speakText}
                className="p-2 text-gray-500 hover:text-gray-700"
                aria-label={isSpeaking ? 'Stop speaking' : 'Speak text'}
              >
                {isSpeaking ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8 7a1 1 0 00-1 1v4a1 1 0 001 1h4a1 1 0 001-1V8a1 1 0 00-1-1H8z"
                      clipRule="evenodd"
                    />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM12.293 7.293a1 1 0 011.414 0L15 8.586l1.293-1.293a1 1 0 111.414 1.414L16.414 10l1.293 1.293a1 1 0 01-1.414 1.414L15 11.414l-1.293 1.293a1 1 0 01-1.414-1.414L13.586 10l-1.293-1.293a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
              </button>
              <select
                value={speechRate}
                onChange={(e) => setSpeechRate(parseFloat(e.target.value))}
                className="text-sm border rounded px-2 py-1"
                disabled={isSpeaking}
              >
                <option value={0.5}>0.5x</option>
                <option value={0.75}>0.75x</option>
                <option value={1}>1x</option>
                <option value={1.25}>1.25x</option>
                <option value={1.5}>1.5x</option>
                <option value={2}>2x</option>
              </select>
            </div>
          </div>

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
        <TimeCard material={material} />

        {miscues.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {miscues.map((word, index) => (
              <span
                onClick={() => {}}
                key={index}
                className="bg-gray-200 text-gray-700 px-3 py-1 rounded-full text-sm"
              >
                {word}
              </span>
            ))}
          </div>
        )}

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
              totalQuestions={material.questions.length}
            />
          ) : (
            <div>
              <p className="text-red-500 text-sm mb-4 ">
                Please complete the reading passage first.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Fun Facts Section */}
      <FunFact />
    </div>
  )
}

export default ReadingPage
