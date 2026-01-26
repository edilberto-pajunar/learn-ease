'use client'

import { useEffect, useState } from 'react'
import { useAdminStore } from '@/hooks/useAdminStore'
import { Quarter } from '@/interface/quarter'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { BookOpen, AlertCircle, Edit, CheckCircle, XCircle } from 'lucide-react'
import { adminService } from '@/services/adminService'

export default function ChaptersPage() {
  const { quarter, getQuarter } = useAdminStore()
  const [loading, setLoading] = useState(true)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [formData, setFormData] = useState<Quarter>({
    quarter: 'Q1',
    postTest: false,
    preTest: false,
    overview1: '',
    overview2: '',
  })

  useEffect(() => {
    const loadQuarter = async () => {
      try {
        await getQuarter()
      } catch (err) {
        setError('Failed to load chapter data')
      } finally {
        setLoading(false)
      }
    }
    loadQuarter()

    return () => {
      const { quarterUnsubscribe } = useAdminStore.getState()
      if (quarterUnsubscribe) {
        quarterUnsubscribe()
      }
    }
  }, [getQuarter])

  useEffect(() => {
    if (quarter) {
      setFormData(quarter)
    }
  }, [quarter])

  const handleEdit = () => {
    if (quarter) {
      setFormData(quarter)
      setIsEditDialogOpen(true)
    }
  }

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true)
      setError(null)
      await adminService.updateQuarter(formData)
      setIsEditDialogOpen(false)
    } catch (err) {
      setError('Failed to update chapter')
      console.error('Failed to update chapter:', err)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleToggleTest = async (testType: 'preTest' | 'postTest') => {
    try {
      setLoading(true)
      await adminService.toggleTestType(testType)
    } catch (err) {
      setError(`Failed to toggle ${testType}`)
    } finally {
      setLoading(false)
    }
  }

  if (loading && !quarter) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="text-gray-600">Loading chapter data...</p>
        </div>
      </div>
    )
  }

  if (!quarter) {
    return (
      <div className="container mx-auto p-6 max-w-4xl">
        <Card className="border-yellow-200 bg-yellow-50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 text-yellow-600">
              <AlertCircle className="h-5 w-5" />
              <p className="font-medium">No chapter configuration found</p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <BookOpen className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Chapter Management
            </h1>
            <p className="text-gray-600">
              Configure quarters and test settings
            </p>
          </div>
        </div>
      </div>

      {error && (
        <Card className="mb-6 border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 text-red-600">
              <AlertCircle className="h-5 w-5" />
              <p className="font-medium">Error: {error}</p>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="space-y-6">
        <Card className="hover:shadow-lg transition-shadow duration-200">
          <CardHeader>
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <CardTitle className="text-xl font-semibold text-gray-900 mb-2">
                  Current Quarter: {quarter.quarter === 'Q1' ? 'Chapter 1' : 'Chapter 2'}
                </CardTitle>
                <CardDescription className="text-sm text-gray-600">
                  Active quarter configuration
                </CardDescription>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleEdit}
                disabled={isSubmitting}
                className="flex items-center gap-1"
              >
                <Edit className="h-3 w-3" />
                Edit
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <Label className="text-sm font-medium text-gray-700">
                    Pre-Test
                  </Label>
                  {quarter.preTest ? (
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  ) : (
                    <XCircle className="h-5 w-5 text-gray-400" />
                  )}
                </div>
                <p className="text-xs text-gray-600 mb-3">
                  {quarter.preTest ? 'Enabled' : 'Disabled'}
                </p>
                <Button
                  size="sm"
                  variant={quarter.preTest ? 'destructive' : 'default'}
                  onClick={() => handleToggleTest('preTest')}
                  disabled={loading}
                  className="w-full"
                >
                  {quarter.preTest ? 'Disable' : 'Enable'}
                </Button>
              </div>

              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <Label className="text-sm font-medium text-gray-700">
                    Post-Test
                  </Label>
                  {quarter.postTest ? (
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  ) : (
                    <XCircle className="h-5 w-5 text-gray-400" />
                  )}
                </div>
                <p className="text-xs text-gray-600 mb-3">
                  {quarter.postTest ? 'Enabled' : 'Disabled'}
                </p>
                <Button
                  size="sm"
                  variant={quarter.postTest ? 'destructive' : 'default'}
                  onClick={() => handleToggleTest('postTest')}
                  disabled={loading}
                  className="w-full"
                >
                  {quarter.postTest ? 'Disable' : 'Enable'}
                </Button>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <Label className="text-sm font-medium text-gray-700 mb-2 block">
                  Chapter 1 Overview
                </Label>
                <div className="p-3 bg-gray-50 rounded-md">
                  <p className="text-sm text-gray-800">
                    {quarter.overview1 || 'No overview provided'}
                  </p>
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-700 mb-2 block">
                  Chapter 2 Overview
                </Label>
                <div className="p-3 bg-gray-50 rounded-md">
                  <p className="text-sm text-gray-800">
                    {quarter.overview2 || 'No overview provided'}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Chapter Configuration</DialogTitle>
            <DialogDescription>
              Update quarter settings and overview information
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="quarter">Active Quarter</Label>
              <select
                id="quarter"
                value={formData.quarter}
                onChange={(e) =>
                  setFormData({ ...formData, quarter: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Q1">Chapter 1</option>
                <option value="Q2">Chapter 2</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="preTest"
                  checked={formData.preTest}
                  onChange={(e) =>
                    setFormData({ ...formData, preTest: e.target.checked })
                  }
                  className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <Label htmlFor="preTest" className="cursor-pointer">
                  Enable Pre-Test
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="postTest"
                  checked={formData.postTest}
                  onChange={(e) =>
                    setFormData({ ...formData, postTest: e.target.checked })
                  }
                  className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <Label htmlFor="postTest" className="cursor-pointer">
                  Enable Post-Test
                </Label>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="overview1">Chapter 1 Overview</Label>
              <Textarea
                id="overview1"
                value={formData.overview1}
                onChange={(e) =>
                  setFormData({ ...formData, overview1: e.target.value })
                }
                placeholder="Enter overview for Chapter 1"
                rows={4}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="overview2">Chapter 2 Overview</Label>
              <Textarea
                id="overview2"
                value={formData.overview2}
                onChange={(e) =>
                  setFormData({ ...formData, overview2: e.target.value })
                }
                placeholder="Enter overview for Chapter 2"
                rows={4}
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsEditDialogOpen(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Saving...
                </>
              ) : (
                'Save Changes'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
