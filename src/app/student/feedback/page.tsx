'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Star, StarOff, MessageSquare, CheckCircle, Send } from 'lucide-react'
import { feedbackService } from '@/services/feedbackService'

interface FeedbackFormData {
  rating: number
  comment: string
}

interface ValidationErrors {
  rating?: string
  comment?: string
}

export default function FeedbackPage() {
  const [formData, setFormData] = useState<FeedbackFormData>({
    rating: 0,
    comment: '',
  })

  const [errors, setErrors] = useState<ValidationErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleStarClick = (starValue: number) => {
    setFormData((prev) => ({ ...prev, rating: starValue }))
    if (errors.rating) {
      setErrors((prev) => ({ ...prev, rating: undefined }))
    }
  }

  const handleCommentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value
    setFormData((prev) => ({ ...prev, comment: value }))
    if (errors.comment) {
      setErrors((prev) => ({ ...prev, comment: undefined }))
    }
  }

  const validateForm = (): boolean => {
    const newErrors: ValidationErrors = {}

    if (!formData.rating || formData.rating === 0) {
      newErrors.rating = 'Please select a rating'
    }

    if (!formData.comment.trim()) {
      newErrors.comment = 'Please provide a comment'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)

    try {
      await feedbackService.createFeedback({
        rating: formData.rating,
        comment: formData.comment,
      })
      setIsSubmitted(true)
      setFormData({ rating: 0, comment: '' })
      setErrors({})
    } catch (error) {
      console.error('Error submitting feedback:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const renderStars = () => {
    const stars = []
    for (let i = 1; i <= 5; i++) {
      const isFilled = i <= formData.rating

      stars.push(
        <button
          key={i}
          type="button"
          onClick={() => handleStarClick(i)}
          className={`p-2 transition-all duration-300 hover:scale-125 transform ${
            isFilled
              ? 'text-yellow-400 hover:text-yellow-500'
              : 'text-gray-300 hover:text-yellow-300'
          }`}
          aria-label={`Rate ${i} star${i > 1 ? 's' : ''}`}
        >
          {isFilled ? (
            <Star className="w-10 h-10 fill-current drop-shadow-lg" />
          ) : (
            <StarOff className="w-10 h-10 hover:scale-110 transition-transform duration-200" />
          )}
        </button>,
      )
    }
    return stars
  }

  if (isSubmitted) {
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
                  Thank You for Your Feedback!
                </h2>
                <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                  Your valuable input helps us improve the learning experience
                  for everyone. We appreciate you taking the time to share your
                  thoughts.
                </p>
                <Button
                  onClick={() => setIsSubmitted(false)}
                  className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-8 py-3 text-lg font-semibold shadow-xl shadow-green-500/25 hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
                >
                  Submit Another Feedback
                </Button>
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
          {/* Header Section */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-pink-500 to-rose-600 rounded-3xl shadow-2xl shadow-pink-500/25 mb-6">
              <MessageSquare className="w-12 h-12 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-foreground via-pink-600 to-rose-600 bg-clip-text text-transparent mb-4">
              Share Your Feedback
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Help us improve your learning experience by sharing your thoughts,
              suggestions, and experiences
            </p>
          </div>

          {/* Feedback Form Card */}
          <div className="max-w-3xl mx-auto">
            <Card className="border-0 shadow-2xl bg-white/90 backdrop-blur-sm">
              <CardHeader className="text-center pb-8">
                <CardTitle className="text-3xl font-bold text-foreground">
                  We Value Your Input
                </CardTitle>
                <CardDescription className="text-lg text-muted-foreground">
                  Your feedback directly influences how we enhance the platform
                  for better learning outcomes
                </CardDescription>
              </CardHeader>

              <form onSubmit={handleSubmit}>
                <CardContent className="space-y-8 px-8 pb-8">
                  {/* Star Rating Section */}
                  <div className="space-y-4">
                    <label className="text-lg font-semibold text-foreground text-center block">
                      How would you rate your overall experience? *
                    </label>
                    <div className="flex items-center justify-center space-x-2">
                      {renderStars()}
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-muted-foreground">
                        {formData.rating === 0 && 'Click to rate'}
                        {formData.rating === 1 && 'Poor'}
                        {formData.rating === 2 && 'Fair'}
                        {formData.rating === 3 && 'Good'}
                        {formData.rating === 4 && 'Very Good'}
                        {formData.rating === 5 && 'Excellent'}
                      </p>
                    </div>
                    {errors.rating && (
                      <p className="text-sm text-red-600 text-center bg-red-50 p-3 rounded-lg border border-red-200">
                        ⚠️ {errors.rating}
                      </p>
                    )}
                  </div>

                  {/* Comment Section */}
                  <div className="space-y-4">
                    <label
                      htmlFor="comment"
                      className="text-lg font-semibold text-foreground block"
                    >
                      Tell us more about your experience *
                    </label>
                    <Textarea
                      id="comment"
                      placeholder="Share your thoughts, suggestions, or any issues you encountered. What did you like? What could be improved? Your feedback helps us create a better learning environment..."
                      value={formData.comment}
                      onChange={handleCommentChange}
                      rows={5}
                      className={`min-h-[120px] text-base resize-none transition-all duration-200 ${
                        errors.comment
                          ? 'border-red-500 focus-visible:ring-red-500 bg-red-50'
                          : 'focus:border-pink-500 focus:ring-pink-500'
                      }`}
                    />
                    {errors.comment && (
                      <p className="text-sm text-red-600 bg-red-50 p-3 rounded-lg border border-red-200">
                        ⚠️ {errors.comment}
                      </p>
                    )}
                  </div>

                  {/* Submit Button */}
                  <div className="pt-4">
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-600 hover:to-rose-700 text-white py-4 text-lg font-semibold shadow-xl shadow-pink-500/25 hover:shadow-2xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                    >
                      {isSubmitting ? (
                        <div className="flex items-center gap-2">
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          Submitting Feedback...
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <Send className="w-5 h-5" />
                          Submit Feedback
                        </div>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </form>
            </Card>
          </div>

          {/* Additional Info Section */}
          <div className="mt-16 text-center">
            <div className="max-w-2xl mx-auto">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-pink-100 to-rose-100 rounded-2xl mb-6">
                <svg
                  className="w-8 h-8 text-pink-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">
                Your Voice Matters
              </h3>
              <p className="text-muted-foreground">
                Every piece of feedback helps us understand your needs better
                and create a more effective learning platform. Thank you for
                being part of our community!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
