'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAdminStore } from '@/hooks/useAdminStore'
import { exportService } from '@/services/exportService'
import { Users, Mail, ChevronRight, UserCircle, Download } from 'lucide-react'

const AdminStudentsPage: React.FC = () => {
  const { students, setStudents } = useAdminStore()
  const router = useRouter()
  const [exporting, setExporting] = useState(false)

  useEffect(() => {
    setStudents()
  }, [setStudents])

  const handleNavigate = (id: string) => {
    router.push(`/admin/students/${id}`)
  }

  const handleExportCsv = async () => {
    setExporting(true)
    try {
      const { csv } = await exportService.exportSubmissionsAsTable()
      exportService.downloadCsv(csv, `submissions_export_${new Date().toISOString().slice(0, 10)}.csv`)
    } catch (e) {
      console.error('Export failed:', e)
    } finally {
      setExporting(false)
    }
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-6 sm:mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Users className="w-7 h-7 sm:w-8 sm:h-8 text-blue-600" />
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900">
            Student Management
          </h1>
        </div>
        <p className="text-slate-600 text-sm sm:text-base ml-0 sm:ml-11">
          View and manage all registered students
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-slate-200">
        <div className="p-4 sm:p-6 border-b border-slate-200">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="text-slate-700 font-medium">
                Total Students:
              </span>
              <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full font-semibold text-sm">
                {students.length}
              </span>
            </div>
            <button
              onClick={handleExportCsv}
              disabled={exporting}
              className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Download className="w-4 h-4" />
              {exporting ? 'Exporting...' : 'Export submissions (CSV)'}
            </button>
            {/* <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search students..."
                  className="w-full sm:w-64 pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div> */}
          </div>
        </div>

        <div className="overflow-x-auto">
          {students.length > 0 ? (
            <div className="hidden md:block">
              <table className="w-full">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                      Student
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-semibold text-slate-700 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {students.map((student) => (
                    <tr
                      key={student.id}
                      className="hover:bg-slate-50 transition-colors cursor-pointer"
                      onClick={() => handleNavigate(student.id)}
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <UserCircle className="w-10 h-10 text-blue-600" />
                          <div>
                            <div className="font-semibold text-slate-900">
                              {student.name || 'Unnamed Student'}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-slate-700">
                          <Mail className="w-4 h-4 text-slate-400" />
                          {student.email}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            handleNavigate(student.id)
                          }}
                          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                        >
                          View Details
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 px-4">
              <Users className="w-16 h-16 text-slate-300 mb-4" />
              <p className="text-slate-600 text-lg font-medium mb-1">
                No students found
              </p>
              <p className="text-slate-500 text-sm">
                Students will appear here once they register
              </p>
            </div>
          )}

          <div className="md:hidden divide-y divide-slate-200">
            {students.map((student) => (
              <div
                key={student.id}
                onClick={() => handleNavigate(student.id)}
                className="p-4 hover:bg-slate-50 transition-colors cursor-pointer"
              >
                <div className="flex items-start gap-3">
                  <UserCircle className="w-12 h-12 text-blue-600 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-slate-900 mb-1 truncate">
                      {student.name || 'Unnamed Student'}
                    </h3>
                    <div className="flex items-center gap-2 text-sm text-slate-600 mb-3">
                      <Mail className="w-4 h-4 text-slate-400 flex-shrink-0" />
                      <span className="truncate">{student.email}</span>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        handleNavigate(student.id)
                      }}
                      className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm"
                    >
                      View Details
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminStudentsPage
