'use client'

import { useEffect, useState, use } from 'react'
import { useAuthStore } from '@/hooks/useAuthStore'
import { useReadStore } from '@/hooks/useReadStore'
import { Submission } from '@/interface/submission'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import SubmissionCard from '../component/SubmissionCard'
import { useAdminStore } from '@/hooks/useAdminStore'
import { Material } from '@/interface/material'
import { db } from '@/firebase/client_app'
import { collection, query, where, onSnapshot } from 'firebase/firestore'

export default function ScorePage({
  params,
}: {
  params: Promise<{ materialBatch: string }>
}) {
  const { user } = useAuthStore()
  const { materials, fetchMaterials } = useReadStore()
  const { quarter } = useAdminStore()
  const [batchSubmissions, setBatchSubmissions] = useState<Submission[]>([])
  const [loading, setLoading] = useState(true)

  const resolvedParams = use(params)
  const studentId = user?.id
  const materialBatch = resolvedParams.materialBatch

  // Fetch materials
  useEffect(() => {
    fetchMaterials(quarter)
  }, [fetchMaterials, quarter])

  // Fetch submissions for this specific batch
  useEffect(() => {
    if (!studentId || !materialBatch) return

    setLoading(true)
    const submissionsRef = collection(db, 'submissions')
    const q = query(
      submissionsRef,
      where('studentId', '==', studentId),
      where('materialBatch', '==', materialBatch),
    )

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const submissions: Submission[] = snapshot.docs.map(
        (doc) => ({ id: doc.id, ...doc.data() }) as Submission,
      )
      setBatchSubmissions(submissions)
      setLoading(false)
    })

    return () => unsubscribe()
  }, [studentId, materialBatch])

  // Get material details by ID
  const getMaterialDetails = (materialId: string): Material | undefined => {
    return materials.find((material) => material.id === materialId)
  }

  const renderSubmissionCard = (submission: Submission) => {
    const material: Material | undefined = getMaterialDetails(
      submission.materialId,
    )
    if (!material) return null

    return (
      <SubmissionCard
        key={submission.id}
        submission={submission}
        material={material}
      />
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-blue-50/30 to-indigo-50/50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl shadow-xl shadow-blue-500/25 mb-6">
            <svg
              className="w-8 h-8 text-white animate-spin"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-2">
            Loading Results
          </h2>
          <p className="text-muted-foreground">
            Please wait while we fetch your assessment results...
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-blue-50/30 to-indigo-50/50">
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-[0.02]" />
        <div className="relative z-10 container mx-auto px-6 py-12">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-3xl shadow-2xl shadow-blue-500/25 mb-6">
              <svg
                className="w-10 h-10 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-foreground via-blue-600 to-indigo-600 bg-clip-text text-transparent mb-4">
              Assessment Results
            </h1>
            <p className="text-lg text-muted-foreground">
              Great job! Take a moment to review your answers and see how much
              you&apos;ve improved.
            </p>
          </div>

          {batchSubmissions.length === 0 ? (
            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
              <CardContent className="p-12 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-2xl mb-6">
                  <svg
                    className="w-8 h-8 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  No Results Found
                </h3>
                <p className="text-muted-foreground mb-6">
                  No submissions found for material batch &quot;{materialBatch}
                  &quot;. Complete some reading assessments to see your results
                  here.
                </p>
                <Button className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700">
                  Start Reading
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-8">
              {/* Individual Submissions */}
              <div>
                <div className="grid gap-6">
                  {batchSubmissions.map(renderSubmissionCard)}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  variant="outline"
                  className="border-blue-200 text-blue-600 hover:bg-blue-50 hover:border-blue-300"
                  onClick={() => (window.location.href = '/student/reading')}
                >
                  <svg
                    className="w-4 h-4 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                    />
                  </svg>
                  Continue Reading
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
