'use client'

import React, { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Star, StarOff, MessageSquare, CheckCircle, Send, Lock } from 'lucide-react'
import { feedbackService } from '@/services/feedbackService'
import { useAuthStore } from '@/hooks/useAuthStore'
import {
  FEEDBACK_QUESTIONS,
  type FeedbackQuestion,
  type LikertValue,
} from '@/interface/feedback'

const LABELS: Record<LikertValue, string> = {
  1: 'Strongly disagree',
  2: 'Disagree',
  3: 'Neutral',
  4: 'Agree',
  5: 'Strongly agree',
}

export default function FeedbackPage() {
  const user = useAuthStore((s) => s.user)
  const [responses, setResponses] = useState<Record<string, LikertValue>>({})
  const [overallComment, setOverallComment] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [alreadySubmitted, setAlreadySubmitted] = useState(false)
  const [checking, setChecking] = useState(true)

  useEffect(() => {
    if (!user?.id) {
      setChecking(false)
      return
    }
    feedbackService.hasUserSubmitted(user.id).then((submitted) => {
      setAlreadySubmitted(submitted)
      setChecking(false)
    })
  }, [user?.id])

  const setResponse = (questionId: string, value: LikertValue) => {
    setResponses((prev) => ({ ...prev, [questionId]: value }))
    if (errors[questionId]) {
      setErrors((prev) => {
        const next = { ...prev }
        delete next[questionId]
        return next
      })
    }
  }

  const validate = (): boolean => {
    const next: Record<string, string> = {}
    console.log("Responses:", responses)
    FEEDBACK_QUESTIONS.forEach((q) => {
      if (!responses[q.id] || responses[q.id] < 1 || responses[q.id] > 5) {
        next[q.id] = 'Please select a response'
      }
    })
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    console.log("Feedback submitted")
    e.preventDefault()
    if (!validate() || !user?.id) return
    console.log("Feedback validated")
    setIsSubmitting(true)
    try {
      await feedbackService.createFeedback({
        responses: FEEDBACK_QUESTIONS.map((q) => ({
          questionId: q.id,
          value: responses[q.id] as LikertValue,
        })),
        overallComment: overallComment.trim() || undefined,
        studentId: user.id,
      })
      setIsSubmitted(true)
      setResponses({})
      setOverallComment('')
      setErrors({})
    } catch (error) {
      console.error('Error submitting feedback:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const renderScale = (q: FeedbackQuestion) => {
    const value = responses[q.id] ?? 0
    return (
      <div key={q.id} className="space-y-3">
        <label className="text-base font-medium text-foreground block">{q.label}</label>
        <div className="flex flex-wrap items-center gap-2">
          {([1, 2, 3, 4, 5] as const).map((n) => {
            const isFilled = n <= value
            return (
              <button
                key={n}
                type="button"
                onClick={() => setResponse(q.id, n)}
                className={`p-1.5 rounded transition-all ${
                  isFilled ? 'text-amber-500' : 'text-muted-foreground/60 hover:text-amber-400'
                }`}
                aria-label={`${n}: ${LABELS[n]}`}
              >
                {isFilled ? (
                  <Star className="w-8 h-8 fill-current" />
                ) : (
                  <StarOff className="w-8 h-8" />
                )}
              </button>
            )
          })}
        </div>
        {value > 0 && (
          <p className="text-sm text-muted-foreground">{LABELS[value as LikertValue]}</p>
        )}
        {errors[q.id] && (
          <p className="text-sm text-destructive bg-destructive/10 p-2 rounded">{errors[q.id]}</p>
        )}
      </div>
    )
  }

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-pink-50/30 to-rose-50/50">
        <div className="w-8 h-8 border-2 border-pink-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (alreadySubmitted || isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-green-50/30 to-emerald-50/50">
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 bg-grid-pattern opacity-[0.02]" />
          <div className="relative z-10 container mx-auto px-6 py-20">
            <Card className="border-0 shadow-2xl bg-white/90 backdrop-blur-sm max-w-2xl mx-auto">
              <CardContent className="p-12 text-center">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-600 rounded-3xl shadow-2xl shadow-green-500/25 mb-8">
                  <CheckCircle className="w-10 h-10 text-white" />
                </div>
                <h2 className="text-3xl font-bold text-foreground mb-4">
                  {alreadySubmitted ? 'We have already received your feedback!' : 'Thank You for Your Feedback!'}
                </h2>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  Your feedback is important to us. It helps us improve the learning experience for everyone.
                </p>
                
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-pink-50/30 to-rose-50/50">
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-[0.02]" />
        <div className="relative z-10 container mx-auto px-6 py-20">
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-pink-500 to-rose-600 rounded-3xl shadow-2xl shadow-pink-500/25 mb-6">
              <MessageSquare className="w-12 h-12 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-foreground via-pink-600 to-rose-600 bg-clip-text text-transparent mb-4">
              Share Your Feedback
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Help us improve by answering a few questions. Your response is one-time per account.
            </p>
          </div>

          <div className="max-w-3xl mx-auto">
            <Card className="border-0 shadow-2xl bg-white/90 backdrop-blur-sm">
              <CardHeader className="text-center pb-6">
                <CardTitle className="text-2xl font-bold text-foreground">
                  We Value Your Input
                </CardTitle>
                <CardDescription className="text-base text-muted-foreground">
                  Rate each statement from strongly disagree to strongly agree.
                </CardDescription>
              </CardHeader>

              <form onSubmit={handleSubmit}>
                <CardContent className="space-y-8 px-8 pb-8">
                  {FEEDBACK_QUESTIONS.map((q) => renderScale(q))}

                  <div className="space-y-3">
                    <label htmlFor="comment" className="text-base font-medium text-foreground block">
                      Additional comments (optional)
                    </label>
                    <Textarea
                      id="comment"
                      placeholder="Anything else you’d like to share..."
                      value={overallComment}
                      onChange={(e) => setOverallComment(e.target.value)}
                      rows={4}
                      className="min-h-[100px] resize-none"
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    onClick={handleSubmit}
                    className="w-full bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-600 hover:to-rose-700 text-white py-4 text-lg font-semibold shadow-xl shadow-pink-500/25 disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <span className="flex items-center gap-2">
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Submitting...
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        <Send className="w-5 h-5" />
                        Submit Feedback
                      </span>
                    )}
                  </Button>
                </CardContent>
              </form>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
