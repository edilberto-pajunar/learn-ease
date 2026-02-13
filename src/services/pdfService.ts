import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import { Submission } from '@/interface/submission'
import { Timestamp } from 'firebase/firestore'

interface PdfData {
  studentName: string
  submissions: Submission[]
}

export const pdfService = {
  async generatePdf(data: PdfData): Promise<void> {
    const { studentName, submissions } = data
    const doc = new jsPDF()

    const formatDate = (timestamp: Timestamp) => {
      if (!timestamp || !timestamp.toDate) return 'N/A'
      return timestamp.toDate().toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    }

    const formatDuration = (seconds: number) => {
      if (seconds < 60) return `${seconds}s`
      const minutes = Math.floor(seconds / 60)
      const secs = seconds % 60
      return `${minutes}m ${secs}s`
    }

    const formatMiscues = (miscues: string[]) => {
      if (!miscues || miscues.length === 0) return 'None'
      return miscues.join(', ')
    }

    doc.setFontSize(20)
    doc.setFont('helvetica', 'bold')
    doc.text('Student Submission Report', 14, 20)

    doc.setFontSize(14)
    doc.setFont('helvetica', 'normal')
    doc.text(`Student Name: ${studentName}`, 14, 30)
    doc.text(`Total Submissions: ${submissions.length}`, 14, 37)

    const tableData = submissions.map((submission) => [
      submission.id || 'N/A',
      submission.testType || 'N/A',
      formatDate(submission.submittedAt),
      submission.answers.filter((answer) => answer.isCorrect).length.toString(),
      submission.answers.length.toString(),
      formatDuration(submission.duration),
      submission.numberOfWords.toString(),
      submission.miscues?.length?.toString() || '0',
      formatMiscues(submission.miscues || []),
    ])

    const pageWidth = doc.internal.pageSize.getWidth()
    const margin = 14
    const availableWidth = pageWidth - 2 * margin

    autoTable(doc, {
      startY: 45,
      head: [
        [
          'ID',
          'Test Type',
          'Submitted At',
          'Correct Answers',
          'Total Answers',
          'Duration',
          'Number of Words',
          'Miscues #',
          'Miscues',
        ],
      ],
      body: tableData,
      theme: 'striped',
      headStyles: {
        fillColor: [41, 128, 185],
        textColor: 255,
        fontStyle: 'bold',
        fontSize: 8,
      },
      bodyStyles: {
        fontSize: 7,
        cellPadding: 2,
        overflow: 'linebreak',
        cellWidth: 'wrap',
      },
      columnStyles: {
        0: { cellWidth: availableWidth * 0.08 },
        1: { cellWidth: availableWidth * 0.1 },
        2: { cellWidth: availableWidth * 0.12 },
        3: { cellWidth: availableWidth * 0.08 },
        4: { cellWidth: availableWidth * 0.08 },
        5: { cellWidth: availableWidth * 0.08 },
        6: { cellWidth: availableWidth * 0.08 },
        7: { cellWidth: availableWidth * 0.1 },
        8: { cellWidth: availableWidth * 0.08 },
        9: { cellWidth: availableWidth * 0.12 },
      },
      styles: {
        overflow: 'linebreak',
        cellWidth: 'wrap',
      },
      margin: { left: margin, right: margin },
      pageBreak: 'auto',
      rowPageBreak: 'avoid',
      tableWidth: 'wrap',
    })

    doc.save(`${studentName.replace(/\s+/g, '_')}_Submissions_Report.pdf`)
  },
}
