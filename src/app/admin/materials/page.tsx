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
import { Label } from '@/components/ui/label'
import CreateMaterial from './component/CreateMaterial'
import EditMaterial from './component/EditMaterial'
import MaterialHeader from './component/MaterialHeader'

export default function MaterialsPage() {
  const {
    quarter,
    testType,
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
  const [selectedTestTypes, setSelectedTestTypes] = useState<{
    preTest: boolean
    postTest: boolean
  }>({
    preTest: true,
    postTest: true,
  })
  const [selectedChapter, setSelectedChapter] = useState<string>('all')
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
  }, [getQuarter, getSkills, setMaterials])

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

  const handleToggleMaterialTestType = async (
    materialId: string,
    currentTestType: string | undefined,
  ) => {
    const newTestType = currentTestType === 'preTest' ? 'postTest' : 'preTest'
    await updateMaterial(materialId, { testType: newTestType })
  }

  const handleUpdateMaterialChapter = async (
    materialId: string,
    newChapter: string,
  ) => {
    await updateMaterial(materialId, { quarter: newChapter })
  }

  const filteredMaterials = materials.filter((material) => {
    const matchesChapter =
      selectedChapter === 'all' || material.quarter === selectedChapter
    const matchesTestType =
      !material.testType ||
      (selectedTestTypes.preTest && material.testType === 'preTest') ||
      (selectedTestTypes.postTest && material.testType === 'postTest')
    return matchesChapter && matchesTestType
  })

  console.log(skills)

  return (
    <div className="container mx-auto p-6">
      <MaterialHeader />

      <div className="mb-6 space-y-4">
        <div className="flex flex-wrap gap-4 items-center">
          <div className="flex items-center gap-2">
            <Label htmlFor="chapter-filter">Chapter:</Label>
            <select
              id="chapter-filter"
              value={selectedChapter}
              onChange={(e) => setSelectedChapter(e.target.value)}
              className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 min-w-[150px]"
            >
              <option value="all">All Chapters</option>
              <option value="Q1">Chapter 1</option>
              <option value="Q2">Chapter 2</option>
            </select>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="filter-pretest"
                checked={selectedTestTypes.preTest}
                onChange={(e) =>
                  setSelectedTestTypes((prev) => ({
                    ...prev,
                    preTest: e.target.checked,
                  }))
                }
                className="h-4 w-4 rounded border-gray-300"
              />
              <Label htmlFor="filter-pretest" className="cursor-pointer">
                Pre Test
              </Label>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="filter-posttest"
                checked={selectedTestTypes.postTest}
                onChange={(e) =>
                  setSelectedTestTypes((prev) => ({
                    ...prev,
                    postTest: e.target.checked,
                  }))
                }
                className="h-4 w-4 rounded border-gray-300"
              />
              <Label htmlFor="filter-posttest" className="cursor-pointer">
                Post Test
              </Label>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-4">
        {filteredMaterials.map((material) => (
          <Card key={material.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <CardTitle>{material.title || 'Untitled Material'}</CardTitle>
                  <CardDescription>
                    {material.author && `By ${material.author}`} •{' '}
                    {material.skill} •{' '}
                    {material.quarter === 'Q1' ? 'Chapter 1' : 'Chapter 2'}
                    {material.testType &&
                      ` • ${material.testType === 'preTest' ? 'Pre Test' : 'Post Test'}`}
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
              <div className="mb-4">
                <p className="text-sm text-gray-600 mb-4">{material.text}</p>
                <div className="text-sm text-gray-500 mb-4">
                  {material.questions.length} question
                  {material.questions.length !== 1 ? 's' : ''}
                </div>
              </div>
              <div className="flex flex-wrap gap-4 items-center pt-4 border-t">
                <div className="flex items-center gap-2">
                  <Label htmlFor={`chapter-${material.id}`} className="text-sm">
                    Chapter:
                  </Label>
                  <select
                    id={`chapter-${material.id}`}
                    value={material.quarter}
                    onChange={(e) =>
                      handleUpdateMaterialChapter(material.id, e.target.value)
                    }
                    className="flex h-9 items-center justify-between rounded-md border border-input bg-background px-2 py-1 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                  >
                    <option value="Q1">Chapter 1</option>
                    <option value="Q2">Chapter 2</option>
                  </select>
                </div>
                <div className="flex items-center gap-2">
                  <Label
                    htmlFor={`test-type-${material.id}`}
                    className="text-sm"
                  >
                    Test Type:
                  </Label>
                  <button
                    type="button"
                    onClick={() =>
                      handleToggleMaterialTestType(
                        material.id,
                        material.testType,
                      )
                    }
                    role="switch"
                    aria-checked={material.testType === 'preTest'}
                    className={`
                      relative inline-flex h-6 w-11 items-center rounded-full transition-colors
                      focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                      ${
                        material.testType === 'preTest'
                          ? 'bg-blue-600'
                          : material.testType === 'postTest'
                            ? 'bg-amber-600'
                            : 'bg-gray-300 dark:bg-gray-700'
                      }
                    `}
                  >
                    <span
                      className={`
                        inline-block h-4 w-4 transform rounded-full bg-white transition-transform
                        ${
                          material.testType === 'preTest'
                            ? 'translate-x-6'
                            : 'translate-x-1'
                        }
                      `}
                    />
                  </button>
                  <span className="text-sm text-gray-600">
                    {material.testType === 'preTest'
                      ? 'Pre Test'
                      : material.testType === 'postTest'
                        ? 'Post Test'
                        : 'Not Set'}
                  </span>
                </div>
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
