'use client'

import { useEffect, useState } from 'react'
import { useAdminStore } from '@/hooks/useAdminStore'
import { Material } from '@/interface/material'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { collection, onSnapshot } from 'firebase/firestore'
import { db } from '@/firebase/client_app'
import { useRouter } from 'next/navigation'
import { BookOpen, Filter, ArrowRight } from 'lucide-react'

export default function StudentMaterialsPage() {
  const { getQuarter, quarter } = useAdminStore()
  const router = useRouter()
  const [allMaterials, setAllMaterials] = useState<Material[]>([])
  const [selectedChapter, setSelectedChapter] = useState<string>('all')
  const [selectedTestTypes, setSelectedTestTypes] = useState<{
    preTest: boolean
    postTest: boolean
  }>({
    preTest: true,
    postTest: true,
  })

  useEffect(() => {
    getQuarter()
  }, [getQuarter])

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'materials'), (snapshot) => {
      const materials: Material[] = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Material[]
      setAllMaterials(materials)
    })

    return () => unsubscribe()
  }, [])

  const filteredMaterials = allMaterials.filter((material) => {
    const matchesChapter =
      selectedChapter === 'all' || material.quarter === selectedChapter
    const matchesTestType =
      !material.testType ||
      (selectedTestTypes.preTest && material.testType === 'preTest') ||
      (selectedTestTypes.postTest && material.testType === 'postTest')
    return matchesChapter && matchesTestType
  })

  const handleStartReading = (material: Material) => {
    const testType = material.testType || 'preTest'
    router.push(
      `/student/reading?testType=${testType}&quarter=${material.quarter}`,
    )
  }

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Reading Materials</h1>
        <p className="text-muted-foreground">
          Browse and filter available reading materials by chapter and test type
        </p>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5" />
            <CardTitle>Filters</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-6 items-center">
            <div className="flex items-center gap-2">
              <Label htmlFor="student-chapter-filter">Chapter:</Label>
              <select
                id="student-chapter-filter"
                value={selectedChapter}
                onChange={(e) => setSelectedChapter(e.target.value)}
                className="flex h-10 items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 min-w-[150px]"
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
                  id="student-filter-pretest"
                  checked={selectedTestTypes.preTest}
                  onChange={(e) =>
                    setSelectedTestTypes((prev) => ({
                      ...prev,
                      preTest: e.target.checked,
                    }))
                  }
                  className="h-4 w-4 rounded border-gray-300"
                />
                <Label
                  htmlFor="student-filter-pretest"
                  className="cursor-pointer"
                >
                  Pre Test
                </Label>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="student-filter-posttest"
                  checked={selectedTestTypes.postTest}
                  onChange={(e) =>
                    setSelectedTestTypes((prev) => ({
                      ...prev,
                      postTest: e.target.checked,
                    }))
                  }
                  className="h-4 w-4 rounded border-gray-300"
                />
                <Label
                  htmlFor="student-filter-posttest"
                  className="cursor-pointer"
                >
                  Post Test
                </Label>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="mb-4">
        <p className="text-sm text-muted-foreground">
          Showing {filteredMaterials.length} material
          {filteredMaterials.length !== 1 ? 's' : ''}
        </p>
      </div>

      <div className="grid gap-4">
        {filteredMaterials.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <BookOpen className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-lg font-medium text-muted-foreground">
                No materials found
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                Try adjusting your filters to see more materials
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredMaterials.map((material) => (
            <Card
              key={material.id}
              className="hover:shadow-lg transition-shadow"
            >
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <CardTitle>
                      {material.title || 'Untitled Material'}
                    </CardTitle>
                    <CardDescription className="mt-2">
                      {material.author && `By ${material.author}`}
                      {material.author && ' • '}
                      {material.skill}
                      {' • '}
                      {material.quarter === 'Q1' ? 'Chapter 1' : 'Chapter 2'}
                      {material.testType &&
                        ` • ${material.testType === 'preTest' ? 'Pre Test' : 'Post Test'}`}
                    </CardDescription>
                  </div>
                  <Button
                    onClick={() => handleStartReading(material)}
                    className="ml-4"
                  >
                    Start Reading
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                  {material.text}
                </p>
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <span>
                    {material.questions.length} question
                    {material.questions.length !== 1 ? 's' : ''}
                  </span>
                  {material.testType && (
                    <span className="px-2 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-medium">
                      {material.testType === 'preTest'
                        ? 'Pre Test'
                        : 'Post Test'}
                    </span>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
