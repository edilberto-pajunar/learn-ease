'use client'

import { Button } from '@/components/ui/button'
import { useAdminStore } from '@/hooks/useAdminStore'
import { useSubmissionStore } from '@/hooks/useSubmissionStore'
import { use, useEffect } from 'react'
import {
  UserCircle,
  Mail,
  FileText,
  Calendar,
  Clock,
  BookOpen,
  AlertCircle,
  Download,
  ArrowLeft,
  Trophy,
} from 'lucide-react'
import { useRouter } from 'next/navigation'

const AdminStudentPage = ({
  params,
}: {
  params: Promise<{ studentId: string }>
}) => {
  const { students } = useAdminStore()
  const { fetchSubmissions, submissions } = useSubmissionStore()
  const { fetchAllMaterials, allMaterials, exportAllSubmissions } =
    useAdminStore()
  const { studentId } = use(params)
  const student = students.find((student) => student.id === studentId)
  const router = useRouter()

  useEffect(() => {
    fetchSubmissions(studentId)
    fetchAllMaterials()
  }, [fetchSubmissions, studentId, fetchAllMaterials])

  const getDuration = (duration: number) => {
    if (duration < 60) return `${duration}s`
    const minutes = Math.floor(duration / 60)
    const seconds = duration % 60
    return `${minutes}m ${seconds}s`
  }

  // const totalScore = submissions.reduce(
  //   (acc, sub) => acc + sub.comprehensionScore + sub.vocabularyScore,
  //   0,
  // )
  // const averageScore =
  //   submissions.length > 0 ? (totalScore / submissions.length).toFixed(1) : 0

  return (
    <div className="max-w-7xl mx-auto">
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-4 sm:mb-6 transition-colors"
      >
        <ArrowLeft className="w-5 h-5" />
        <span className="font-medium">Back to Students</span>
      </button>

      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-4 sm:p-6 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-start gap-4 sm:gap-6">
          <UserCircle className="w-16 h-16 sm:w-20 sm:h-20 text-blue-600 flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-2">
              {student?.name || 'Unknown Student'}
            </h1>
            <div className="flex items-center gap-2 text-slate-600 mb-4">
              <Mail className="w-4 h-4 flex-shrink-0" />
              <span className="text-sm sm:text-base truncate">
                {student?.email}
              </span>
            </div>
            {/* <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
                <div className="bg-blue-50 rounded-lg p-3">
                  <div className="flex items-center gap-2 text-blue-600 mb-1">
                    <FileText className="w-4 h-4" />
                    <span className="text-xs font-medium uppercase">
                      Submissions
                    </span>
                  </div>
                  <p className="text-xl sm:text-2xl font-bold text-slate-900">
                    {submissions.length}
                  </p>
                </div>
                <div className="bg-blue-50 rounded-lg p-3">
                  <div className="flex items-center gap-2 text-blue-600 mb-1">
                    <Trophy className="w-4 h-4" />
                    <span className="text-xs font-medium uppercase">
                      Avg Score
                    </span>
                  </div>
                  <p className="text-xl sm:text-2xl font-bold text-slate-900">
                    {averageScore}
                  </p>
                </div>
                <div className="bg-blue-50 rounded-lg p-3 col-span-2 sm:col-span-1">
                  <div className="flex items-center gap-2 text-blue-600 mb-1">
                    <Target className="w-4 h-4" />
                    <span className="text-xs font-medium uppercase">
                      Total Score
                    </span>
                  </div>
                  <p className="text-xl sm:text-2xl font-bold text-slate-900">
                    {totalScore}
                  </p>
                </div>
              </div> */}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-slate-200">
        <div className="p-4 sm:p-6 border-b border-slate-200">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-1">
                Submission History
              </h2>
              <p className="text-sm text-slate-600">
                All materials submitted by this student
              </p>
            </div>
            <Button
              onClick={() => exportAllSubmissions(studentId)}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
            >
              <Download className="w-4 h-4" />
              Export as PDF
            </Button>
          </div>
        </div>

        <div className="p-4 sm:p-6">
          {submissions.length > 0 ? (
            <div className="space-y-4">
              {submissions.map((submission) => {
                const material = allMaterials.find(
                  (material) => material.id === submission.materialId,
                )
                return (
                  <div
                    className="border border-slate-200 rounded-lg p-4 sm:p-6 hover:border-blue-300 hover:bg-slate-50 transition-all"
                    key={submission.id}
                  >
                    <div className="flex flex-col lg:flex-row lg:items-start gap-4 lg:gap-6">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start gap-3 mb-4">
                          <BookOpen className="w-5 h-5 text-blue-600 flex-shrink-0 mt-1" />
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-lg text-slate-900 mb-1">
                              {material?.title || 'Unknown Material'}
                            </h3>
                            <div className="flex items-center gap-2 text-sm text-slate-500">
                              <Calendar className="w-4 h-4" />
                              {submission.submittedAt
                                .toDate()
                                .toLocaleDateString('en-US', {
                                  year: 'numeric',
                                  month: 'long',
                                  day: 'numeric',
                                })}
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
                          <div className="bg-slate-50 rounded-lg p-3">
                            <div className="flex items-center gap-2 text-slate-600 mb-1">
                              <Trophy className="w-4 h-4" />
                              <span className="text-xs font-medium">Score</span>
                            </div>
                            <p className="text-lg font-bold text-slate-900">
                              {submission.comprehensionScore +
                                submission.vocabularyScore}
                            </p>
                          </div>

                          <div className="bg-slate-50 rounded-lg p-3">
                            <div className="flex items-center gap-2 text-slate-600 mb-1">
                              <Clock className="w-4 h-4" />
                              <span className="text-xs font-medium">
                                Duration
                              </span>
                            </div>
                            <p className="text-lg font-bold text-slate-900">
                              {getDuration(submission.duration)}
                            </p>
                          </div>

                          <div className="bg-slate-50 rounded-lg p-3">
                            <div className="flex items-center gap-2 text-slate-600 mb-1">
                              <FileText className="w-4 h-4" />
                              <span className="text-xs font-medium">Words</span>
                            </div>
                            <p className="text-lg font-bold text-slate-900">
                              {submission.numberOfWords}
                            </p>
                          </div>

                          <div className="bg-slate-50 rounded-lg p-3">
                            <div className="flex items-center gap-2 text-slate-600 mb-1">
                              <AlertCircle className="w-4 h-4" />
                              <span className="text-xs font-medium">
                                Miscues
                              </span>
                            </div>
                            <p className="text-lg font-bold text-slate-900">
                              {submission.miscues.length}
                            </p>
                          </div>
                        </div>

                        {submission.miscues.length > 0 && (
                          <div className="bg-slate-50 rounded-lg p-3">
                            <div className="flex items-center gap-2 text-slate-700 mb-2">
                              <AlertCircle className="w-4 h-4 text-slate-500" />
                              <span className="text-sm font-medium">
                                Miscue Details:
                              </span>
                            </div>
                            <p className="text-sm text-slate-600 break-words">
                              {submission.miscues.join(', ')}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 px-4">
              <FileText className="w-16 h-16 text-slate-300 mb-4" />
              <p className="text-slate-600 text-lg font-medium mb-1">
                No submissions yet
              </p>
              <p className="text-slate-500 text-sm text-center">
                This student hasn&apos;t submitted any materials
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default AdminStudentPage

// Group submissions by materialId
// {Object.entries(
//   submissions.reduce(
//     (acc, submission) => {
//       if (!acc[submission.materialId]) {
//         acc[submission.materialId] = []
//       }
//       acc[submission.materialId].push(submission)
//       return acc
//     },
//     {} as Record<string, typeof submissions>,
//   ),
// ).map(([materialId, materialSubmissions]) => (
//   <div key={materialId} className="bg-white rounded-lg shadow-md p-6">
//     <div className="flex justify-between items-center mb-4">
//       <h3 className="text-lg font-semibold text-gray-800">
//         Material Name: {materialId}
//       </h3>
//       <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
//         {materialSubmissions.length} Attempts
//       </span>
//     </div>

//     <div className="space-y-4">
//       {materialSubmissions
//         .sort(
//           (a, b) =>
//             b.submittedAt.toDate().getTime() -
//             a.submittedAt.toDate().getTime(),
//         )
//         .map((submission, index) => (
//           <div
//             key={submission.id}
//             className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
//           >
//             <div className="flex justify-between items-center">
//               <div>
//                 <span className="text-sm text-gray-600">
//                   Attempt {materialSubmissions.length - index}
//                 </span>
//                 <p className="text-sm text-gray-500">
//                   {new Date(
//                     submission.submittedAt.toDate(),
//                   ).toLocaleString()}
//                 </p>
//               </div>
//               <div className="text-right">
//                 <p className="text-lg font-semibold text-gray-800">
//                   Score:{' '}
//                   {submission.comprehensionScore +
//                     submission.vocabularyScore}
//                 </p>
//                 <p className="text-sm text-gray-600">
//                   Mode: {submission.mode}
//                 </p>
//               </div>
//             </div>
//             <div className="mt-2 text-sm text-gray-600">
//               <p>
//                 Duration: {Math.round(submission.duration / 60)}{' '}
//                 minutes
//               </p>
//               <p>Words: {submission.numberOfWords}</p>
//               {/* {submission.miscues.length > 0 &&
//                 submission.miscues.map((miscue) => (
//                   <p key={miscue}>{miscue}</p>
//                 ))} */}
//             </div>
//           </div>
//         ))}
//     </div>
//   </div>
// ))}
