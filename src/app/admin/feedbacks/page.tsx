'use client'

import { useEffect, useState } from 'react'
import { useFeedbackStore } from '@/hooks/useFeedbackStore'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { MessageSquare, Star, Calendar, User, Filter } from 'lucide-react'
import type { Feedback } from '@/interface/feedback'
import { FEEDBACK_QUESTIONS } from '@/interface/feedback'

function getAverageRating(f: Feedback): number {
  if (!f.responses?.length) return 0
  const sum = f.responses.reduce((a, r) => a + r.value, 0)
  return Math.round(sum / f.responses.length)
}

export default function AdminFeedbackPage() {
  const { feedback, getFeedbacks } = useFeedbackStore()
  const [filteredFeedback, setFilteredFeedback] = useState<Feedback[]>([])
  const [filterRating, setFilterRating] = useState<number | null>(null)
  const [sortBy, setSortBy] = useState<'date' | 'rating'>('date')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchFeedback = async () => {
      try {
        await getFeedbacks()
        setLoading(false)
      } catch (error) {
        console.error('Error fetching feedback:', error)
        setLoading(false)
      }
    }

    fetchFeedback()
  }, [getFeedbacks])

  useEffect(() => {
    let filtered = [...feedback]
    if (filterRating !== null) {
      filtered = filtered.filter((f) => getAverageRating(f) === filterRating)
    }
    filtered.sort((a, b) => {
      if (sortBy === 'date') {
        const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0
        const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0
        return dateB - dateA
      }
      return getAverageRating(b) - getAverageRating(a)
    })
    setFilteredFeedback(filtered)
  }, [feedback, filterRating, sortBy])

  const getRatingColor = (rating: number) => {
    if (rating >= 4) return 'bg-green-100 text-green-800 border-green-200'
    if (rating >= 3) return 'bg-yellow-100 text-yellow-800 border-yellow-200'
    return 'bg-red-100 text-red-800 border-red-200'
  }

  const getRatingLabel = (rating: number) => {
    if (rating === 5) return 'Excellent'
    if (rating === 4) return 'Good'
    if (rating === 3) return 'Average'
    if (rating === 2) return 'Poor'
    return 'Very Poor'
  }

  const formatDate = (date: Date | undefined) => {
    if (!date) return 'Date not available'
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-blue-50/30 to-indigo-50/50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl shadow-xl shadow-blue-500/25 mb-6">
            <MessageSquare className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-2">
            Loading Feedback...
          </h2>
          <p className="text-muted-foreground">
            Please wait while we fetch the feedback data
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
          {/* Header Section */}
          <div className="text-center mb-12">
            <div className="mb-6">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-3xl shadow-2xl shadow-blue-500/25 mb-4">
                <MessageSquare className="w-10 h-10 text-white" />
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-foreground via-blue-600 to-indigo-600 bg-clip-text text-transparent mb-4 leading-tight">
              Student Feedback
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Monitor and analyze student feedback to improve the learning
              experience and platform quality.
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-blue-100/50">
              <CardContent className="p-6 text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-500 rounded-xl mb-3">
                  <MessageSquare className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-blue-700 mb-1">
                  {feedback.length}
                </h3>
                <p className="text-blue-600 font-medium">Total Feedback</p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-green-100/50">
              <CardContent className="p-6 text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-green-500 rounded-xl mb-3">
                  <Star className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-green-700 mb-1">
                  {feedback.length > 0
                    ? (
feedback.reduce((acc, f) => acc + getAverageRating(f), 0) /
                          feedback.length
                      ).toFixed(1)
                    : '0'}
                </h3>
                <p className="text-green-600 font-medium">Average Rating</p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-gradient-to-br from-yellow-50 to-yellow-100/50">
              <CardContent className="p-6 text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-yellow-500 rounded-xl mb-3">
                  <Star className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-yellow-700 mb-1">
                  {feedback.filter((f) => getAverageRating(f) >= 4).length}
                </h3>
                <p className="text-yellow-600 font-medium">Positive Reviews</p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-50 to-purple-100/50">
              <CardContent className="p-6 text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-purple-500 rounded-xl mb-3">
                  <Calendar className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-purple-700 mb-1">
                  {
                    feedback.filter((f) => {
                      if (!f.createdAt) return false
                      const feedbackDate = new Date(f.createdAt)
                      const weekAgo = new Date()
                      weekAgo.setDate(weekAgo.getDate() - 7)
                      return feedbackDate >= weekAgo
                    }).length
                  }
                </h3>
                <p className="text-purple-600 font-medium">This Week</p>
              </CardContent>
            </Card>
          </div>

          {/* Filters and Controls */}
          <Card className="border-0 shadow-lg mb-8">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <Filter className="w-5 h-5 text-muted-foreground" />
                    <span className="font-medium text-foreground">
                      Filters:
                    </span>
                  </div>

                  <Button
                    variant={filterRating === null ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setFilterRating(null)}
                    className="bg-blue-500 hover:bg-blue-600 text-white"
                  >
                    All Ratings
                  </Button>

                  {[5, 4, 3, 2, 1].map((rating) => (
                    <Button
                      key={rating}
                      variant={filterRating === rating ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setFilterRating(rating)}
                      className={
                        filterRating === rating
                          ? 'bg-blue-500 hover:bg-blue-600 text-white'
                          : ''
                      }
                    >
                      {rating} Star{rating !== 1 ? 's' : ''}
                    </Button>
                  ))}
                </div>

                <div className="flex items-center gap-2">
                  <span className="font-medium text-foreground">Sort by:</span>
                  <Button
                    variant={sortBy === 'date' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSortBy('date')}
                    className={
                      sortBy === 'date'
                        ? 'bg-blue-500 hover:bg-blue-600 text-white'
                        : ''
                    }
                  >
                    Date
                  </Button>
                  <Button
                    variant={sortBy === 'rating' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSortBy('rating')}
                    className={
                      sortBy === 'rating'
                        ? 'bg-blue-500 hover:bg-blue-600 text-white'
                        : ''
                    }
                  >
                    Rating
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Feedback List */}
          <Card className="border-0 shadow-xl">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b">
              <CardTitle className="text-2xl font-bold text-foreground flex items-center gap-3">
                <MessageSquare className="w-6 h-6 text-blue-600" />
                Feedback Submissions
                <Badge variant="secondary" className="ml-2">
                  {filteredFeedback.length}{' '}
                  {filteredFeedback.length === 1 ? 'entry' : 'entries'}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              {filteredFeedback.length === 0 ? (
                <div className="text-center py-16">
                  <MessageSquare className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-muted-foreground mb-2">
                    No Feedback Found
                  </h3>
                  <p className="text-muted-foreground">
                    {filterRating !== null
                      ? `No feedback with ${filterRating} star${filterRating !== 1 ? 's' : ''} rating found.`
                      : 'No feedback submissions available yet.'}
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredFeedback.map((feedbackItem, index) => (
                    <Card
                      key={feedbackItem.id || index}
                      className="group border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 bg-gradient-to-br from-card to-card/50 overflow-hidden flex flex-col"
                    >
                      {(() => {
                        const avg = getAverageRating(feedbackItem)
                        return (
                          <div
                            className={`h-2 ${
                              avg >= 4
                                ? 'bg-gradient-to-r from-green-500 to-emerald-600'
                                : avg >= 3
                                  ? 'bg-gradient-to-r from-yellow-500 to-orange-600'
                                  : 'bg-gradient-to-r from-red-500 to-pink-600'
                            }`}
                          />
                        )
                      })()}

                      <CardContent className="p-6 flex flex-col flex-1">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center gap-2">
                            <div className="flex items-center">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <Star
                                  key={star}
                                  className={`w-4 h-4 ${
                                    star <= getAverageRating(feedbackItem)
                                      ? 'text-yellow-400 fill-current'
                                      : 'text-gray-300'
                                  }`}
                                />
                              ))}
                            </div>
                            <Badge
                              className={`ml-2 ${getRatingColor(getAverageRating(feedbackItem))}`}
                            >
                              {getRatingLabel(getAverageRating(feedbackItem))}
                            </Badge>
                          </div>

                          <div className="text-right">
                            <div className="flex items-center gap-1 text-xs text-muted-foreground mb-1">
                              <User className="w-3 h-3" />
                              <span className="text-xs">
                                {feedbackItem.studentId || 'Anonymous'}
                              </span>
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {formatDate(feedbackItem.createdAt)}
                            </div>
                          </div>
                        </div>

                        <div className="space-y-2 mb-4 flex-1">
                          {feedbackItem.responses?.map((r) => {
                            const q = FEEDBACK_QUESTIONS.find((x) => x.id === r.questionId)
                            return (
                              <p key={r.questionId} className="text-foreground text-sm">
                                <span className="font-medium">{q?.label ?? r.questionId}:</span>{' '}
                                {r.value}/5
                              </p>
                            )
                          })}
                          {(feedbackItem.overallComment?.trim() ?? '') && (
                            <p className="text-foreground text-sm leading-relaxed line-clamp-4 pt-2 border-t">
                              {feedbackItem.overallComment}
                            </p>
                          )}
                        </div>

                        {/* Footer with Actions - Always at bottom */}
                        <div className="mt-auto pt-3 border-t border-gray-100">
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              className="flex-1 text-blue-600 border-blue-200 hover:bg-blue-50 text-xs py-2"
                            >
                              View Details
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="flex-1 text-green-600 border-green-200 hover:bg-green-50 text-xs py-2"
                            >
                              Mark Resolved
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Summary Section */}
          <div className="mt-12 text-center">
            <div className="max-w-2xl mx-auto">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-2xl mb-6">
                <MessageSquare className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">
                Feedback Insights
              </h3>
              <p className="text-muted-foreground">
                Use this feedback to identify areas for improvement and enhance
                the learning experience for all students. Regular review of
                feedback helps maintain platform quality and user satisfaction.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
