import { Card, CardContent } from '@/components/ui/card'
import { Submission } from '@/interface/submission'

interface SubmissionCardProps {
  submission: Submission
  materialTitle: string
  materialText: string
}

// Helper function to calculate reading level based on questionnaire performance
const calculateReadingLevel = (
  score: number,
  totalQuestions: number,
): {
  level: string
  color: string
  bgColor: string
  borderColor: string
} => {
  const percentage = (score / totalQuestions) * 100

  if (percentage >= 80) {
    return {
      level: 'Independent',
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
    }
  } else if (percentage >= 60) {
    return {
      level: 'Instructional',
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
      borderColor: 'border-yellow-200',
    }
  } else {
    return {
      level: 'Frustration',
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
    }
  }
}

export default function SubmissionCard(props: SubmissionCardProps) {
  const { submission, materialTitle, materialText } = props

  const readingLevel = calculateReadingLevel(
    submission.score,
    submission.totalQuestions,
  )

  return (
    <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-white to-gray-50/50">
      <CardContent className="p-6">
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 mb-6">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-3">
              <div className="inline-flex items-center justify-center w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-lg shadow-blue-500/25">
                <svg
                  className="w-5 h-5 text-white"
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
              </div>
              <div>
                <h2 className="text-xl font-bold text-foreground">
                  {materialTitle}
                </h2>
                <p className="text-sm text-muted-foreground">
                  Submitted on{' '}
                  {submission.submittedAt.toDate().toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>

          {/* Score and Level */}
          <div className="text-right">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl shadow-xl shadow-blue-500/25 mb-2">
              <span className="text-2xl font-bold text-white">
                {submission.score}%
              </span>
            </div>
            <div
              className={`inline-flex items-center px-3 py-1 rounded-full ${readingLevel.bgColor} ${readingLevel.borderColor} border`}
            >
              <span className={`text-sm font-semibold ${readingLevel.color}`}>
                {readingLevel.level} Level
              </span>
            </div>
          </div>
        </div>

        {/* Material Preview */}
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-muted-foreground mb-2 uppercase tracking-wide">
            Reading Content
          </h3>
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <p className="text-sm text-gray-700 line-clamp-3 leading-relaxed">
              {materialText}
            </p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-3 bg-blue-50 rounded-lg border border-blue-200">
            <div className="text-lg font-bold text-blue-600">
              {Math.round(submission.duration)}s
            </div>
            <div className="text-xs text-blue-600 font-medium">Duration</div>
          </div>
          <div className="text-center p-3 bg-green-50 rounded-lg border border-green-200">
            <div className="text-lg font-bold text-green-600">
              {submission.numberOfWords}
            </div>
            <div className="text-xs text-green-600 font-medium">Words</div>
          </div>
          <div className="text-center p-3 bg-purple-50 rounded-lg border border-purple-200">
            <div className="text-lg font-bold text-purple-600">
              {Math.round(
                (submission.numberOfWords / submission.duration) * 60,
              )}
            </div>
            <div className="text-xs text-purple-600 font-medium">WPM</div>
          </div>
          <div className="text-center p-3 bg-orange-50 rounded-lg border border-orange-200">
            <div className="text-lg font-bold text-orange-600">
              {submission.miscues
                ? Array.isArray(submission.miscues)
                  ? submission.miscues.length
                  : 0
                : 0}
            </div>
            <div className="text-xs text-orange-600 font-medium">Miscues</div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
