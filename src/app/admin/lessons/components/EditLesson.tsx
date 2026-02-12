'use client'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Lesson, Content, LessonMaterial } from '@/interface/lesson'
import { Skill } from '@/interface/skill'
import { Plus, Trash2 } from 'lucide-react'

interface EditLessonProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  lesson: Lesson | null
  skills: Skill[]
  onSubmit: (id: string, data: Partial<Lesson>) => Promise<void>
  isSubmitting: boolean
  formData: Partial<Lesson>
  setFormData: (
    data: Partial<Lesson> | ((prev: Partial<Lesson>) => Partial<Lesson>),
  ) => void
}

export default function EditLesson({
  isOpen,
  onOpenChange,
  lesson,
  skills,
  onSubmit,
  isSubmitting,
  formData,
  setFormData,
}: EditLessonProps) {
  const handleSubmit = async () => {
    if (!lesson?.id || !formData.title?.trim()) return
    try {
      const lessonData: Partial<Lesson> = {
        ...formData,
        materials: formData.materials || [],
        contents: formData.contents || [],
      }
      await onSubmit(lesson.id, lessonData)
      onOpenChange(false)
    } catch (error) {
      console.error('Failed to update lesson:', error)
    }
  }

  const addContent = () => {
    setFormData((prev) => ({
      ...prev,
      contents: [
        ...(prev.contents || []),
        {
          id: '',
          title: '',
          description: '',
          examples: [],
        },
      ],
    }))
  }

  const updateContent = (
    index: number,
    field: keyof Content,
    value: string | string[],
  ) => {
    setFormData((prev) => ({
      ...prev,
      contents: prev.contents?.map((c, i) =>
        i === index ? { ...c, [field]: value } : c,
      ),
    }))
  }

  const removeContent = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      contents: prev.contents?.filter((_, i) => i !== index),
    }))
  }

  const addExample = (contentIndex: number) => {
    setFormData((prev) => ({
      ...prev,
      contents: prev.contents?.map((c, i) =>
        i === contentIndex
          ? {
              ...c,
              examples: [...(c.examples || []), ''],
            }
          : c,
      ),
    }))
  }

  const updateExample = (
    contentIndex: number,
    exampleIndex: number,
    value: string,
  ) => {
    setFormData((prev) => ({
      ...prev,
      contents: prev.contents?.map((c, i) =>
        i === contentIndex
          ? {
              ...c,
              examples:
                c.examples?.map((ex, exIdx) =>
                  exIdx === exampleIndex ? value : ex,
                ) || [],
            }
          : c,
      ),
    }))
  }

  const removeExample = (contentIndex: number, exampleIndex: number) => {
    setFormData((prev) => ({
      ...prev,
      contents: prev.contents?.map((c, i) =>
        i === contentIndex
          ? {
              ...c,
              examples: c.examples?.filter(
                (_, exIdx) => exIdx !== exampleIndex,
              ),
            }
          : c,
      ),
    }))
  }

  const addMaterial = () => {
    setFormData((prev) => ({
      ...prev,
      materials: [
        ...(prev.materials || []),
        {
          title: '',
          content: '',
          type: 'prose',
          author: '',
          link: '',
          audioUrl: '',
        },
      ],
    }))
  }

  const updateMaterial = (
    index: number,
    field: keyof LessonMaterial,
    value: string,
  ) => {
    setFormData((prev) => ({
      ...prev,
      materials: prev.materials?.map((m, i) =>
        i === index ? { ...m, [field]: value } : m,
      ),
    }))
  }

  const removeMaterial = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      materials: prev.materials?.filter((_, i) => i !== index),
    }))
  }

  const titleToSnakeCase = (title: string): string => {
    return title
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '_')
      .replace(/^-+|-+$/g, '')
  }

  if (!lesson) return null

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Lesson</DialogTitle>
          <DialogDescription>
            Update lesson details, contents, examples, and materials
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label htmlFor="edit-chapter">Chapter</Label>
              <Input
                id="edit-chapter"
                value={formData.chapter || ''}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, chapter: e.target.value }))
                }
                placeholder="e.g., Q1, Q2"
              />
            </div>
            <div>
              <Label htmlFor="edit-lesson">Lesson Number</Label>
              <Input
                id="edit-lesson"
                type="number"
                value={formData.lesson || ''}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    lesson: e.target.value
                      ? parseInt(e.target.value, 10)
                      : undefined,
                  }))
                }
                placeholder="e.g., 1, 2, 3"
                min="1"
              />
            </div>
            <div>
              <Label htmlFor="edit-skill">Skill</Label>
              <select
                id="edit-skill"
                value={formData.skill || ''}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, skill: e.target.value }))
                }
                className="w-full p-2 border border-gray-300 rounded-md"
              >
                <option value="">Select a skill</option>
                {skills.map((skill) => (
                  <option key={skill.id} value={skill.title}>
                    {skill.title}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <Label htmlFor="edit-title">Title *</Label>
            <Input
              id="edit-title"
              value={formData.title || ''}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, title: e.target.value }))
              }
              placeholder="Lesson title"
              required
            />
          </div>

          <div>
            <Label htmlFor="edit-overview">Overview</Label>
            <Textarea
              id="edit-overview"
              value={formData.overview || ''}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, overview: e.target.value }))
              }
              placeholder="Lesson overview or description"
              rows={3}
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <Label>Content Sections</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addContent}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Content
              </Button>
            </div>
            {formData.contents?.map((content, contentIndex) => (
              <Card key={contentIndex} className="mb-4">
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-sm">
                      Content Section {contentIndex + 1}
                    </CardTitle>
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      onClick={() => removeContent(contentIndex)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <Label>Section Title</Label>
                    <Input
                      value={content.title || ''}
                      onChange={(e) => {
                        const newTitle = e.target.value
                        updateContent(contentIndex, 'title', newTitle)
                        if (newTitle.trim()) {
                          const generatedId = titleToSnakeCase(newTitle)
                          updateContent(contentIndex, 'id', generatedId)
                        } else {
                          updateContent(contentIndex, 'id', '')
                        }
                      }}
                      placeholder="Section title"
                    />
                  </div>
                  <div>
                    <Label>ID</Label>
                    <Input
                      value={content.id || ''}
                      onChange={(e) =>
                        updateContent(contentIndex, 'id', e.target.value)
                      }
                      placeholder="Auto-generated from title (snake_case)"
                    />
                  </div>
                  <div>
                    <Label>Description</Label>
                    <Textarea
                      value={content.description || ''}
                      onChange={(e) =>
                        updateContent(
                          contentIndex,
                          'description',
                          e.target.value,
                        )
                      }
                      placeholder="Section description"
                      rows={2}
                    />
                  </div>
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <Label>Examples</Label>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => addExample(contentIndex)}
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Example
                      </Button>
                    </div>
                    {content.examples?.map((example, exampleIndex) => (
                      <Card key={exampleIndex} className="mb-2 p-3 bg-gray-50">
                        <div className="flex justify-between items-start mb-2">
                          <span className="text-xs font-medium text-gray-600">
                            Example {exampleIndex + 1}
                          </span>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              removeExample(contentIndex, exampleIndex)
                            }
                            className="h-6 w-6 p-0"
                          >
                            <Trash2 className="h-3 w-3 text-red-600" />
                          </Button>
                        </div>
                        <Textarea
                          value={example}
                          onChange={(e) =>
                            updateExample(
                              contentIndex,
                              exampleIndex,
                              e.target.value,
                            )
                          }
                          placeholder="Enter example text"
                          rows={3}
                          className="text-sm"
                        />
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <Label>Materials</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addMaterial}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Material
              </Button>
            </div>
            {formData.materials?.map((material, materialIndex) => (
              <Card key={materialIndex} className="mb-4">
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-sm">
                      Material {materialIndex + 1}
                    </CardTitle>
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      onClick={() => removeMaterial(materialIndex)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Title</Label>
                      <Input
                        value={material.title || ''}
                        onChange={(e) =>
                          updateMaterial(materialIndex, 'title', e.target.value)
                        }
                        placeholder="Material title"
                      />
                    </div>
                    <div>
                      <Label>Type</Label>
                      <select
                        value={material.type || 'prose'}
                        onChange={(e) =>
                          updateMaterial(materialIndex, 'type', e.target.value)
                        }
                        className="w-full p-2 border border-gray-300 rounded-md"
                      >
                        <option value="prose">Prose</option>
                        <option value="poem">Poem</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <Label>Author</Label>
                    <Input
                      value={material.author || ''}
                      onChange={(e) =>
                        updateMaterial(materialIndex, 'author', e.target.value)
                      }
                      placeholder="Author name"
                    />
                  </div>
                  <div>
                    <Label>Link</Label>
                    <Input
                      type="url"
                      value={material.link || ''}
                      onChange={(e) =>
                        updateMaterial(materialIndex, 'link', e.target.value)
                      }
                      placeholder="https://..."
                    />
                  </div>
                  <div>
                    <Label>Audio URL</Label>
                    <Input
                      type="url"
                      value={material.audioUrl || ''}
                      onChange={(e) =>
                        updateMaterial(materialIndex, 'audioUrl', e.target.value)
                      }
                      placeholder="https://... (audio file or stream)"
                    />
                  </div>
                  <div>
                    <Label>Content</Label>
                    <Textarea
                      value={material.content || ''}
                      onChange={(e) =>
                        updateMaterial(materialIndex, 'content', e.target.value)
                      }
                      placeholder="Material content"
                      rows={4}
                    />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={!formData.title?.trim() || isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Updating...
                </>
              ) : (
                'Update Lesson'
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
