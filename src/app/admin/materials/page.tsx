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
import { ChevronDown } from 'lucide-react'
import CreateMaterial from './component/CreateMaterial'
import EditMaterial from './component/EditMaterial'
import MaterialHeader from './component/MaterialHeader'

export default function MaterialsPage() {
  const {
    quarter,
    testType,
    toggleQuarter,
    getQuarter,
    materials,
    setMaterials,
    addMaterial,
    updateMaterial,
    deleteMaterial,
    skills,
    getSkills,
    toggleTestType,
  } = useAdminStore()

  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editingMaterial, setEditingMaterial] = useState<Material | null>(null)
  const [isQuarterLoading, setIsQuarterLoading] = useState(false)
  const [selectedTestTypes, setSelectedTestTypes] = useState<{
    pre_test: boolean
    post_test: boolean
  }>({
    pre_test: true,
    post_test: false,
  })
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
      quarter: quarter?.quarter || '',
      testType,
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

  const filteredMaterials = materials.filter((material) => {
    const matchesQuarter = material.quarter === quarter?.quarter
    const matchesTestType =
      !material.testType ||
      (selectedTestTypes.pre_test && material.testType === 'pre_test') ||
      (selectedTestTypes.post_test && material.testType === 'post_test')
    return matchesQuarter && matchesTestType
  })

  console.log(skills)

  return (
    <div className="container mx-auto p-6">
      <MaterialHeader />

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
                    {material.testType &&
                      ` • ${material.testType === 'pre_test' ? 'Pre-test' : 'Post-test'}`}
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
              <p className="text-sm text-gray-600 mb-4">{material.text}</p>
              <div className="text-sm text-gray-500">
                {material.questions.length} question
                {material.questions.length !== 1 ? 's' : ''}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <CreateMaterial
        isCreateDialogOpen={isCreateDialogOpen}
        setIsCreateDialogOpen={setIsCreateDialogOpen}
        quarter={quarter?.quarter || ''}
        formData={formData}
        setFormData={setFormData}
        skills={skills}
        addQuestion={addQuestion}
        updateQuestion={updateQuestion}
        removeQuestion={removeQuestion}
        handleCreateMaterial={handleCreateMaterial}
      />

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
