'use client'

import { useAdminStore } from '@/hooks/useAdminStore'
import { useEffect, useState } from 'react'
import { Material, Question } from '@/interface/material'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Skill } from '@/interface/skill'
import CreateMaterial from './component/create_material'
import EditMaterial from './component/edit_material'

export default function MaterialsPage() {
  const {
    quarter,
    toggleQuarter,
    getQuarter,
    materials,
    setMaterials,
    addMaterial,
    updateMaterial,
    deleteMaterial,
    skills,
    getSkills,
  } = useAdminStore()

  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editingMaterial, setEditingMaterial] = useState<Material | null>(null)
  const [isQuarterLoading, setIsQuarterLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    text: '',
    mode: '',
    skill: '',
    author: '',
    questions: [] as Question[],
  })

  useEffect(() => {
    getQuarter()
    getSkills()
    const unsubscribe = setMaterials()
    return () => unsubscribe()
  }, [])

  const handleCreateMaterial = async () => {
    const newMaterial: Material = {
      id: '',
      ...formData,
      quarter,
      questions: formData.questions,
    }
    await addMaterial(newMaterial)
    setIsCreateDialogOpen(false)
    resetForm()
  }

  const handleUpdateMaterial = async () => {
    if (editingMaterial && editingMaterial.id) {
      await updateMaterial(editingMaterial.id, formData)
      setIsEditDialogOpen(false)
      setEditingMaterial(null)
      resetForm()
    } else {
      console.error('No editing material or material ID found')
    }
  }

  const handleDeleteMaterial = async (id: string) => {
    if (confirm('Are you sure you want to delete this material?')) {
      await deleteMaterial(id)
    }
  }

  const handleEdit = (material: Material) => {
    setEditingMaterial(material)
    setFormData({
      title: material.title || '',
      text: material.text,
      mode: material.mode,
      skill: material.skill,
      author: material.author || '',
      questions: material.questions,
    })
    setIsEditDialogOpen(true)
  }

  const resetForm = () => {
    setFormData({
      title: '',
      text: '',
      mode: '',
      skill: '',
      author: '',
      questions: [],
    })
  }

  const handleQuarterToggle = async () => {
    setIsQuarterLoading(true)
    try {
      await toggleQuarter(quarter === 'Q1' ? 'Q2' : 'Q1')
    } catch (error) {
      console.error('Error toggling quarter:', error)
    } finally {
      setIsQuarterLoading(false)
    }
  }

  const addQuestion = () => {
    setFormData((prev) => ({
      ...prev,
      questions: [
        ...prev.questions,
        {
          title: '',
          options: ['', '', '', ''],
          answer: '',
          type: '',
        },
      ],
    }))
  }

  const updateQuestion = (
    index: number,
    field: keyof Question,
    value: string | string[],
  ) => {
    setFormData((prev) => ({
      ...prev,
      questions: prev.questions.map((q, i) =>
        i === index ? { ...q, [field]: value } : q,
      ),
    }))
  }

  const removeQuestion = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      questions: prev.questions.filter((_, i) => i !== index),
    }))
  }

  const filteredMaterials = materials.filter(
    (material) => material.quarter === quarter,
  )

  console.log(skills)

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Materials Management</h1>
        <div className="flex gap-4">
          <Button
            variant="outline"
            onClick={handleQuarterToggle}
            disabled={isQuarterLoading}
          >
            {isQuarterLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2"></div>
                Loading...
              </>
            ) : (
              `Current Quarter: ${quarter}`
            )}
          </Button>
          <CreateMaterial
            isCreateDialogOpen={isCreateDialogOpen}
            setIsCreateDialogOpen={setIsCreateDialogOpen}
            quarter={quarter}
            formData={formData}
            setFormData={setFormData}
            skills={skills}
            addQuestion={addQuestion}
            updateQuestion={updateQuestion}
            removeQuestion={removeQuestion}
            handleCreateMaterial={handleCreateMaterial}
          />
        </div>
      </div>

      <div className="grid gap-4">
        {filteredMaterials.map((material) => (
          <Card key={material.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle>{material.title || 'Untitled Material'}</CardTitle>
                  <CardDescription>
                    {material.author && `By ${material.author}`} •{' '}
                    {material.skill} • {material.quarter}
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(material)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDeleteMaterial(material.id)}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">
                {material.text.length > 200
                  ? `${material.text.substring(0, 200)}...`
                  : material.text}
              </p>
              <div className="text-sm text-gray-500">
                {material.questions.length} question
                {material.questions.length !== 1 ? 's' : ''}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <EditMaterial
        isEditDialogOpen={isEditDialogOpen}
        setIsEditDialogOpen={setIsEditDialogOpen}
        formData={formData}
        setFormData={setFormData}
        skills={skills}
        addQuestion={addQuestion}
        updateQuestion={updateQuestion}
        removeQuestion={removeQuestion}
        handleUpdateMaterial={handleUpdateMaterial}
      />
    </div>
  )
}
