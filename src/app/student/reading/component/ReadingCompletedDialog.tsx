'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'

interface ReadingCompletedDialogProps {
  isOpen: boolean
  isSubmitting: boolean
  materialBatch: string
  totalMaterials: number
  onClose?: () => void
}

export default function ReadingCompletedDialog({
  isOpen,
  isSubmitting,
  totalMaterials,
  onClose,
}: ReadingCompletedDialogProps) {
  const router = useRouter()
  const [countdown, setCountdown] = useState(5)

  useEffect(() => {
    if (!isOpen || isSubmitting) {
      setCountdown(5)
      return
    }
    const timer = setInterval(() => {
      setCountdown((prev) => (prev <= 1 ? 0 : prev - 1))
    }, 1000)
    return () => clearInterval(timer)
  }, [isOpen, isSubmitting])

  useEffect(() => {
    if (countdown === 0 && isOpen && !isSubmitting) {
      router.push('/student/reading/score')
    }
  }, [countdown, isOpen, isSubmitting, router])

  const handleViewResults = () => {
    router.push(`/student/reading/score`)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center shadow-lg">
                <svg
                  className="w-8 h-8 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
            </div>
            🎉 All Materials Completed!
          </DialogTitle>
        </DialogHeader>

        <div className="text-center space-y-4 py-4">
          <p className="text-gray-600">
            Congratulations! You have successfully completed all{' '}
            <span className="font-bold text-gray-900">{totalMaterials}</span>{' '}
            reading materials.
          </p>

          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-200">
            {isSubmitting ? (
              <>
                <p className="text-sm text-gray-700 mb-2">Saving your results...</p>
                <div className="flex items-center justify-center gap-2">
                  <svg
                    className="w-8 h-8 text-blue-600 animate-spin"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8h4z"
                    />
                  </svg>
                </div>
              </>
            ) : (
              <>
                <p className="text-sm text-gray-700 mb-2">
                  Redirecting to results page in
                </p>
                <div className="flex items-center justify-center gap-2">
                  <div className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                    {countdown}
                  </div>
                  <span className="text-sm text-gray-600">seconds</span>
                </div>
              </>
            )}
          </div>

          <Button
            onClick={handleViewResults}
            disabled={isSubmitting}
            className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Saving...' : 'View Results Now'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
