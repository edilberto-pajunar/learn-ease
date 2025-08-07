'use client'

import { useSkillsStore } from '@/hooks/useSkillsStore'
import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Trash2, Edit, Plus, BookOpen } from 'lucide-react'
import AddSkill from './component/add_skill'

export default function SkillsPage() {
  const { skills, loading, setSkills, addSkill, updateSkill, deleteSkill } =
    useSkillsStore()
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editingSkill, setEditingSkill] = useState<{
    id: string
    title: string
  } | null>(null)
  const [newSkillTitle, setNewSkillTitle] = useState('')
  const [editSkillTitle, setEditSkillTitle] = useState('')
  const [isAdding, setIsAdding] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)
  const [isDeleting, setIsDeleting] = useState<string | null>(null)

  useEffect(() => {
    setSkills()
  }, [setSkills])

  const handleAddSkill = async () => {
    if (!newSkillTitle.trim()) return
    try {
      setIsAdding(true)
      await addSkill(newSkillTitle.trim())
      setNewSkillTitle('')
      setIsAddDialogOpen(false)
    } catch (error) {
      console.error('Failed to add skill:', error)
    } finally {
      setIsAdding(false)
    }
  }

  const handleEditSkill = async () => {
    if (!editingSkill || !editSkillTitle.trim()) return
    try {
      setIsUpdating(true)
      await updateSkill(editingSkill.id, editSkillTitle.trim())
      setEditingSkill(null)
      setEditSkillTitle('')
      setIsEditDialogOpen(false)
    } catch (error) {
      console.error('Failed to update skill:', error)
    } finally {
      setIsUpdating(false)
    }
  }

  const handleDeleteSkill = async (id: string) => {
    if (confirm('Are you sure you want to delete this skill?')) {
      try {
        setIsDeleting(id)
        await deleteSkill(id)
      } catch (error) {
        console.error('Failed to delete skill:', error)
      } finally {
        setIsDeleting(null)
      }
    }
  }

  const openEditDialog = (skill: { id: string; title: string }) => {
    setEditingSkill(skill)
    setEditSkillTitle(skill.title)
    setIsEditDialogOpen(true)
  }

  if (loading && skills.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="text-gray-600">Loading skills...</p>
        </div>
      </div>
    )
  }

  // Show loading overlay when any operation is in progress
  const isAnyOperationLoading =
    loading || isAdding || isUpdating || isDeleting !== null

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <BookOpen className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Skills Management
              {isAnyOperationLoading && (
                <span className="ml-2 inline-flex items-center gap-1 text-sm font-normal text-blue-600">
                  <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-blue-600"></div>
                  Processing...
                </span>
              )}
            </h1>
            <p className="text-gray-600">Manage and organize learning skills</p>
          </div>
        </div>

        <AddSkill
          isAddDialogOpen={isAddDialogOpen}
          setIsAddDialogOpen={setIsAddDialogOpen}
          newSkillTitle={newSkillTitle}
          setNewSkillTitle={setNewSkillTitle}
          handleAddSkill={handleAddSkill}
          isAdding={isAdding}
        />
      </div>

      {/* Skills Grid */}
      {skills.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <BookOpen className="h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No skills yet
            </h3>
            <p className="text-gray-600 text-center mb-4">
              Get started by adding your first skill to help organize learning
              materials.
            </p>
            <Button onClick={() => setIsAddDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Your First Skill
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
          {skills.map((skill) => (
            <Card
              key={skill.id}
              className="hover:shadow-lg transition-shadow duration-200"
            >
              <CardHeader className="pb-3">
                <CardTitle className="text-lg font-semibold text-gray-900">
                  {skill.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => openEditDialog(skill)}
                    className="flex items-center gap-1"
                    disabled={isUpdating || isDeleting === skill.id}
                  >
                    <Edit className="h-3 w-3" />
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDeleteSkill(skill.id)}
                    className="flex items-center gap-1 text-red-600 hover:text-red-700 hover:bg-red-50"
                    disabled={isUpdating || isDeleting === skill.id}
                  >
                    {isDeleting === skill.id ? (
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

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Skill</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="edit-skill-title">Skill Title</Label>
              <Input
                id="edit-skill-title"
                value={editSkillTitle}
                onChange={(e) => setEditSkillTitle(e.target.value)}
                placeholder="Enter skill title..."
                onKeyPress={(e) => e.key === 'Enter' && handleEditSkill()}
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => setIsEditDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={handleEditSkill}
                disabled={!editSkillTitle.trim() || isUpdating}
                className="flex items-center gap-2"
              >
                {isUpdating ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Updating...
                  </>
                ) : (
                  'Update Skill'
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
