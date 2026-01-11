'use client'

import { useLessonStore } from '@/hooks/useLessonStore'
import { useAdminStore } from '@/hooks/useAdminStore'
import { useEffect, useState } from 'react'
import { Lesson } from '@/interface/lesson'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Edit, Trash2, BookOpen, AlertCircle } from 'lucide-react'
import CreateLesson from './components/CreateLesson'
import EditLesson from './components/EditLesson'

export default function LessonPage() {
  const {
    lessons,
    loading,
    error,
    setLessons,
    addLesson,
    updateLesson,
    deleteLesson,
  } = useLessonStore()

  const { skills, getSkills } = useAdminStore()

  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editingLesson, setEditingLesson] = useState<Lesson | null>(null)
  const [formData, setFormData] = useState<Partial<Lesson>>({})
  const [isCreating, setIsCreating] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)
  const [isDeleting, setIsDeleting] = useState<string | null>(null)

  useEffect(() => {
    getSkills()
    setLessons()
    return () => {
      const unsubscribe = useLessonStore.getState().unsubscribe
      if (unsubscribe) {
        unsubscribe()
      }
    }
  }, [getSkills, setLessons])

  const handleCreateLesson = async (data: Omit<Lesson, 'id'>) => {
    try {
      setIsCreating(true)
      await addLesson(data)
      setIsCreateDialogOpen(false)
    } catch (error) {
      console.error('Failed to create lesson:', error)
    } finally {
      setIsCreating(false)
    }
  }

  const handleUpdateLesson = async (id: string, data: Partial<Lesson>) => {
    try {
      setIsUpdating(true)
      await updateLesson(id, data)
      setIsEditDialogOpen(false)
      setEditingLesson(null)
      setFormData({})
    } catch (error) {
      console.error('Failed to update lesson:', error)
    } finally {
      setIsUpdating(false)
    }
  }

  const handleDeleteLesson = async (id: string) => {
    if (!confirm('Are you sure you want to delete this lesson?')) return
    try {
      setIsDeleting(id)
      await deleteLesson(id)
    } catch (error) {
      console.error('Failed to delete lesson:', error)
    } finally {
      setIsDeleting(null)
    }
  }

  const handleEdit = (lesson: Lesson) => {
    setEditingLesson(lesson)
    setFormData({
      chapter: lesson.chapter || '',
      title: lesson.title || '',
      skill: lesson.skill || '',
      overview: lesson.overview || '',
      contents: lesson.contents || [],
      materials: lesson.materials || [],
      lesson: lesson.lesson,
    })
    setIsEditDialogOpen(true)
  }

  if (loading && lessons.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="text-gray-600">Loading lessons...</p>
        </div>
      </div>
    )
  }

  const isAnyOperationLoading =
    loading || isCreating || isUpdating || isDeleting !== null

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <BookOpen className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Lessons Management
              {isAnyOperationLoading && (
                <span className="ml-2 inline-flex items-center gap-1 text-sm font-normal text-blue-600">
                  <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-blue-600"></div>
                  Processing...
                </span>
              )}
            </h1>
            <p className="text-gray-600">
              Manage and organize learning lessons
            </p>
          </div>
        </div>

        <CreateLesson
          isOpen={isCreateDialogOpen}
          onOpenChange={setIsCreateDialogOpen}
          skills={skills}
          onSubmit={handleCreateLesson}
          isSubmitting={isCreating}
        />
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

      {lessons.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <BookOpen className="h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No lessons yet
            </h3>
            <p className="text-gray-600 text-center mb-4">
              Get started by creating your first lesson to help organize
              learning content.
            </p>
            <Button onClick={() => setIsCreateDialogOpen(true)}>
              <BookOpen className="h-4 w-4 mr-2" />
              Create Your First Lesson
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {lessons.map((lesson) => (
            <Card
              key={lesson.id}
              className="hover:shadow-lg transition-shadow duration-200"
            >
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <CardTitle className="text-lg font-semibold text-gray-900 mb-2">
                      {lesson.title || 'Untitled Lesson'}
                    </CardTitle>
                    <CardDescription className="space-y-1">
                      {lesson.chapter && (
                        <div className="text-sm">
                          <span className="font-medium">Chapter:</span>{' '}
                          {lesson.chapter}
                        </div>
                      )}
                      {lesson.skill && (
                        <div className="text-sm">
                          <span className="font-medium">Skill:</span>{' '}
                          {lesson.skill}
                        </div>
                      )}
                      {lesson.overview && (
                        <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                          {lesson.overview}
                        </p>
                      )}
                      <div className="text-sm text-gray-500 mt-2 space-y-1">
                        {lesson.contents && lesson.contents.length > 0 && (
                          <div>
                            {lesson.contents.length} content section
                            {lesson.contents.length !== 1 ? 's' : ''}
                          </div>
                        )}
                        {lesson.materials && lesson.materials.length > 0 && (
                          <div>
                            {lesson.materials.length} material
                            {lesson.materials.length !== 1 ? 's' : ''}
                          </div>
                        )}
                      </div>
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(lesson)}
                    disabled={isUpdating || isDeleting === lesson.id}
                    className="flex items-center gap-1"
                  >
                    <Edit className="h-3 w-3" />
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => lesson.id && handleDeleteLesson(lesson.id)}
                    disabled={isUpdating || isDeleting === lesson.id}
                    className="flex items-center gap-1 text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    {isDeleting === lesson.id ? (
                      <>
                        <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-red-600"></div>
                        Deleting...
                      </>
                    ) : (
                      <>
                        <Trash2 className="h-3 w-3" />
                        Delete
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <EditLesson
        isOpen={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        lesson={editingLesson}
        skills={skills}
        onSubmit={handleUpdateLesson}
        isSubmitting={isUpdating}
        formData={formData}
        setFormData={setFormData}
      />
    </div>
  )
}
