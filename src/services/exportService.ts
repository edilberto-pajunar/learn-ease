import { collection, getDocs, query, where } from 'firebase/firestore'
import { db } from '@/firebase/client_app'
import { Submission } from '@/interface/submission'
import { Timestamp } from 'firebase/firestore'

export type SubmissionTableRow = {
  studentId: string
  studentName: string
  studentEmail: string
  submissionId: string
  materialId: string
  testType: string
  quarter: string
  materialBatch: string
  mode: string
  submittedAt: string
  totalScore: number
  totalQuestions: number
  numberOfWords: number
  durationSeconds: number
  durationFormatted: string
  miscuesCount: number
  miscuesList: string
}

type StudentInfo = { name: string; email: string }

function formatTimestamp(ts: Timestamp | undefined): string {
  if (!ts?.toDate) return ''
  return ts.toDate().toISOString()
}

function formatDuration(seconds: number): string {
  if (seconds < 60) return `${seconds}s`
  const m = Math.floor(seconds / 60)
  const s = Math.round(seconds % 60)
  return s > 0 ? `${m}m ${s}s` : `${m}m`
}

function submissionToRow(
  sub: Submission,
  student: StudentInfo,
): SubmissionTableRow {
  const totalScore = sub.answers.filter((a) => a.isCorrect).length ?? 0
  const totalQuestions = sub.answers?.length ?? 0
  return {
    studentId: sub.studentId ?? '',
    studentName: student.name,
    studentEmail: student.email,
    submissionId: sub.id ?? '',
    materialId: sub.materialId ?? '',
    testType: sub.testType ?? '',
    quarter: sub.quarter ?? '',
    materialBatch: sub.materialBatch ?? '',
    mode: sub.mode ?? '',
    submittedAt: formatTimestamp(sub.submittedAt),
    totalScore,
    totalQuestions,
    numberOfWords: sub.numberOfWords ?? 0,
    durationSeconds: sub.duration ?? 0,
    durationFormatted: formatDuration(sub.duration ?? 0),
    miscuesCount: Array.isArray(sub.miscues) ? sub.miscues.length : 0,
    miscuesList: Array.isArray(sub.miscues) ? sub.miscues.join('; ') : '',
  }
}

export const exportService = {
  async fetchAllSubmissions(): Promise<Submission[]> {
    const ref = collection(db, 'submissions')
    const snapshot = await getDocs(ref)
    return snapshot.docs.map((d) => ({ id: d.id, ...d.data() })) as Submission[]
  },

  async fetchStudents(): Promise<Record<string, StudentInfo>> {
    const usersRef = collection(db, 'users')
    const q = query(usersRef, where('role', '==', 'student'))
    const snapshot = await getDocs(q)
    const map: Record<string, StudentInfo> = {}
    snapshot.docs.forEach((d) => {
      const data = d.data()
      map[d.id] = {
        name: data.name ?? '—',
        email: data.email ?? '—',
      }
    })
    return map
  },

  submissionsToTableRows(
    submissions: Submission[],
    students: Record<string, StudentInfo>,
  ): SubmissionTableRow[] {
    const defaultStudent: StudentInfo = { name: '—', email: '—' }
    return submissions
      .map((s) => submissionToRow(s, students[s.studentId] ?? defaultStudent))
      .sort((a, b) => {
        if (a.studentId !== b.studentId)
          return a.studentId.localeCompare(b.studentId)
        const order = { preTest: 0, postTest: 1 }
        return (
          (order[a.testType as keyof typeof order] ?? 2) -
          (order[b.testType as keyof typeof order] ?? 2)
        )
      })
  },

  tableRowsToCsv(rows: SubmissionTableRow[], delimiter = ','): string {
    const headers = Object.keys(rows[0] ?? {}) as (keyof SubmissionTableRow)[]
    const escape = (v: string | number): string => {
      const s = String(v)
      if (s.includes(delimiter) || s.includes('"') || s.includes('\n'))
        return `"${s.replace(/"/g, '""')}"`
      return s
    }
    const headerLine = headers.map(escape).join(delimiter)
    const dataLines = rows.map((row) =>
      headers.map((h) => escape(row[h])).join(delimiter),
    )
    return [headerLine, ...dataLines].join('\n')
  },

  async exportSubmissionsAsTable(): Promise<{
    rows: SubmissionTableRow[]
    csv: string
    stats: {
      totalSubmissions: number
      uniqueStudents: number
      byTestType: Record<string, number>
      byQuarter: Record<string, number>
    }
  }> {
    const [submissions, students] = await Promise.all([
      this.fetchAllSubmissions(),
      this.fetchStudents(),
    ])
    const rows = this.submissionsToTableRows(submissions, students)
    const csv = this.tableRowsToCsv(rows)

    const studentIds = new Set(submissions.map((s) => s.studentId))
    const byTestType: Record<string, number> = {}
    const byQuarter: Record<string, number> = {}
    submissions.forEach((s) => {
      const tt = s.testType || 'unknown'
      byTestType[tt] = (byTestType[tt] ?? 0) + 1
      const q = s.quarter || 'unknown'
      byQuarter[q] = (byQuarter[q] ?? 0) + 1
    })

    return {
      rows,
      csv,
      stats: {
        totalSubmissions: submissions.length,
        uniqueStudents: studentIds.size,
        byTestType,
        byQuarter,
      },
    }
  },

  downloadCsv(csv: string, filename = 'submissions_export.csv'): void {
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = filename
    link.click()
    URL.revokeObjectURL(link.href)
  },
}
