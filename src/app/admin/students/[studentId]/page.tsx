'use client'

import { useAdminStore } from '@/hooks/useAdminStore'
import { useReadStore } from '@/hooks/useReadStore'
import { useSubmissionStore } from '@/hooks/useSubmissionStore'
import { use, useEffect } from 'react'

const AdminStudentPage = ({
  params,
}: {
  params: Promise<{ studentId: string }>
}) => {
  const { students } = useAdminStore()
  const { fetchSubmissions, submissions } = useSubmissionStore()
  const { studentId } = use(params)
  const student = students.find((student) => student.id === studentId)

  useEffect(() => {
    fetchSubmissions(studentId)
  }, [])

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Student Info:  {student?.name}</h1>
      <div className="grid grid-cols-1 gap-6">
        <div className="flex justify-between items-center p-4 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
          <h2 className="text-l font-semibold text-gray-800">
            Name: {student?.name}
          </h2>
        </div>

        <div className="space-y-6">
          <h2 className="text-xl font-semibold text-gray-800">
            Submission History
          </h2>

          {/* Group submissions by materialId */}
          {Object.entries(
            submissions.reduce(
              (acc, submission) => {
                if (!acc[submission.materialId]) {
                  acc[submission.materialId] = []
                }
                acc[submission.materialId].push(submission)
                return acc
              },
              {} as Record<string, typeof submissions>,
            ),
          ).map(([materialId, materialSubmissions]) => (
            <div key={materialId} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-800">
                  Material ID: {materialId}
                </h3>
                <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                  {materialSubmissions.length} Attempts
                </span>
              </div>

              <div className="space-y-4">
                {materialSubmissions
                  .sort(
                    (a, b) =>
                      b.submittedAt.toDate().getTime() -
                      a.submittedAt.toDate().getTime(),
                  )
                  .map((submission, index) => (
                    <div
                      key={submission.id}
                      className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <span className="text-sm text-gray-600">
                            Attempt {materialSubmissions.length - index}
                          </span>
                          <p className="text-sm text-gray-500">
                            {new Date(
                              submission.submittedAt.toDate(),
                            ).toLocaleString()}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-semibold text-gray-800">
                            Score: {submission.score}
                          </p>
                          <p className="text-sm text-gray-600">
                            Mode: {submission.mode}
                          </p>
                        </div>
                      </div>
                      <div className="mt-2 text-sm text-gray-600">
                        <p>
                          Duration: {Math.round(submission.duration / 60)}{' '}
                          minutes
                        </p>
                        <p>Words: {submission.numberOfWords}</p>
                        {/* {submission.miscues.length > 0 &&
                          submission.miscues.map((miscue) => (
                            <p key={miscue}>{miscue}</p>
                          ))} */}
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default AdminStudentPage
