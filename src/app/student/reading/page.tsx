'use client'

import BoldEachLetter from '@/components/BoldEachLetter'
import Clock from '@/components/Clock'
import { FC, useEffect, useState } from 'react'
import { useReadStore } from '@/hooks/useReadStore'
import { useAuthStore } from '@/hooks/useAuthStore'
import { useRouter } from 'next/navigation'
import { z } from 'zod'
import { wordCount } from '@/app/utils/wordCount'
import FunFact from './component/FunFact'

// ✅ 1. Define Zod Schema for validation
const questionSchema = z.object({
  answers: z.record(
    z.string(),
    z.string().min(1, 'All questions must be answered.'),
  ),
})

const ReadingPage: FC = () => {
  const {
    materials,
    currentIndex,
    selectedAnswers,
    mistakes,
    isSubmitted,
    miscues,
    isLoading,
    submitAnswer,
    handleAnswerChange,
    fetchMaterials,
    stopListening,
    endTime,
    calculateMistakes,
    setCurrentIndex,
    setIsSubmitted,
    addMiscues,
    removeMiscues,
  } = useReadStore()

  const { user } = useAuthStore()
  const router = useRouter()
  const [formError, setFormError] = useState<string | null>(null)

  useEffect(() => {
    fetchMaterials()

    return () => stopListening()
  }, [fetchMaterials, stopListening])

  if (materials.length === 0) {
    return <p>Loading...</p>
  }

  const studentId = user?.id
  const material = materials[currentIndex]

  // ✅ 2. Use Zod for Validation on Submit
  const handleSubmit = async () => {
    const validation = questionSchema.safeParse({
      answers: selectedAnswers,
    })

    // ✅ Show Error if Validation Fails
    if (!validation.success) {
      setFormError('❌ Please answer all questions before submitting.')
      return
    }

    setFormError(null) // Clear error if passed

    if (!isSubmitted) {
      calculateMistakes()
      if (!studentId) return
      await submitAnswer(studentId)
      setIsSubmitted()
    } else {
      if (currentIndex < materials.length - 1) {
        setCurrentIndex(currentIndex + 1)
      } else {
        router.push('/student/reading/score')
      }
      setIsSubmitted()
    }
  }

  const handleTime = async (time: number, bionic: boolean) => {
    if (!studentId) return
    endTime(studentId, bionic ? { bionic: time } : { nonBionic: time })
  }

  const handleAddMiscues = (word: string) => {
    addMiscues(word)
  }

  const handleRemoveMiscues = (word: string) => {
    removeMiscues(word)
  }

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
                {currentIndex + 1}
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
        <div className="flex flex-wrap gap-6">
          <div className="flex flex-col items-center gap-4 mb-6 p-4 border rounded-lg shadow-lg w-full md:w-auto">
            <BoldEachLetter
              text={material.text}
              bionic={false}
              onWordTap={handleAddMiscues}
            />
            <Clock onStop={(time) => handleTime(time, false)} />
          </div>
          <div className="flex flex-col items-center gap-4 mb-6 p-4 border rounded-lg shadow-lg w-full md:w-auto">
            <BoldEachLetter
              text={material.text}
              bionic={true}
              onWordTap={handleAddMiscues}
            />
            <Clock onStop={(time) => handleTime(time, true)} />
          </div>
        </div>

        {miscues.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {miscues.map((word, index) => (
              <span
                onClick={() => {
                  handleRemoveMiscues(word)
                }}
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

                {/* Show Mistakes if Submitted */}
                {isSubmitted && mistakes[question.title] && (
                  <p
                    className={`mt-2 ${
                      mistakes[question.title] === 'Correct!'
                        ? 'text-green-500'
                        : 'text-red-500'
                    }`}
                  >
                    {mistakes[question.title]}
                  </p>
                )}
              </div>
            ))}

            {/* Submit Button */}
            {isLoading ? (
              <div>
                <p>Loading...</p>
              </div>
            ) : (
              <button
                type="submit"
                className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
                onClick={handleSubmit}
              >
                {isSubmitted
                  ? currentIndex === materials.length - 1
                    ? 'Finish'
                    : 'Next'
                  : 'Submit'}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Fun Facts Section */}
      <FunFact />
    </div>
  )
}

export default ReadingPage
