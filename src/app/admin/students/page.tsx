'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAdminStore } from '@/hooks/useAdminStore'

const AdminStudentsPage: React.FC = () => {
  const { students, setStudents } = useAdminStore()
  const router = useRouter()

  useEffect(() => {
    setStudents() // Fetch students when the component mounts
  }, [setStudents]) // Add setStudents to dependency array to prevent unnecessary re-renders

  const handleNavigate = (id: string) => {
    router.push(`/admin/students/${id}`)
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6 text-center">List of Students</h1>
      <div className="grid grid-cols-1 gap-6">
        {students.length > 0 ? (
          students.map((student) => (
            <div
              key={student.id}
              className="flex justify-between items-center p-4 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow"
            >
              <div>
                <h2 className="text-lg font-semibold text-gray-800">
                  {student.name || 'Unnamed Student'}
                </h2>
                <p className="text-gray-600">{student.email}</p>
              </div>
              <button
                onClick={() => handleNavigate(student.id)}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                View Details
              </button>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-600">No students found.</p>
        )}
      </div>
    </div>
  )
}

export default AdminStudentsPage
