'use client'

import { useAdminStore } from '@/hooks/useAdminStore'
import { useSubmissionStore } from '@/hooks/useSubmissionStore'
import { useEffect, useMemo, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from 'recharts'

export default function SummaryPage() {
  const { allSubmissions, fetchAllSubmissions } = useSubmissionStore()
  const { skills, getSkills, materials, setMaterials } = useAdminStore()
  const [selectedTestType, setSelectedTestType] = useState<
      'preTest' | 'postTest'
  >('preTest')
  const [selectedSkill, setSelectedSkill] = useState<string>('all')

  useEffect(() => {
    fetchAllSubmissions()
    getSkills()
    setMaterials()
  }, [])

  const getSkill = (materialId: string) => {
    const material = materials.find((material) => material.id === materialId)
    return material?.skill
  }

  const getTotalScorePerSkill = (skill: string, testType: string) => {
    const submissions = allSubmissions.filter(
      (submission) =>
        getSkill(submission.materialId) === skill &&
        submission.testType === testType,
    )
    return submissions.reduce((acc, submission) => acc + submission.comprehensionScore + submission.vocabularyScore, 0)
  }

  const getUniqueStudentsCount = (testType: string) => {
    const uniqueStudents = new Set(
      allSubmissions
        .filter((submission) => submission.testType === testType)
        .map((submission) => submission.studentId),
    )
    return uniqueStudents.size
  }

  const getPercentage = (totalScore: number, hps: number) => {
    return ((totalScore / hps) * 100).toFixed(2)
  }

  const skillRankings = useMemo(() => {
    return skills
      .map((skill) => {
        const preTestScore = getTotalScorePerSkill(skill.id, 'preTest')
        const postTestScore = getTotalScorePerSkill(skill.id, 'postTest')
        const totalScore = preTestScore + postTestScore
        const hps = 5 * getUniqueStudentsCount('preTest')
        const percentage = parseFloat(getPercentage(totalScore, hps))

        return {
          ...skill,
          percentage,
          totalScore,
          hps,
          preTestScore,
          postTestScore,
        }
      })
      .sort((a, b) => b.percentage - a.percentage)
  }, [skills, allSubmissions])

  // Chart data for skill performance
  const skillChartData = useMemo(() => {
    return skills.map((skill) => ({
      name: skill.title,
      'Pre-test': getTotalScorePerSkill(skill.id, 'preTest'),
      'Post-test': getTotalScorePerSkill(skill.id, 'postTest'),
    }))
  }, [skills, allSubmissions])

  // Chart data for individual student progress
  const studentProgressData = useMemo(() => {
    const studentIds = [...new Set(allSubmissions.map((s) => s.studentId))]

    return studentIds
      .map((studentId) => {
        const studentSubmissions = allSubmissions.filter(
          (s) => s.studentId === studentId,
        )
        const preTestSubmissions = studentSubmissions.filter(
          (s) => s.testType === 'preTest',
        )
        const postTestSubmissions = studentSubmissions.filter(
          (s) => s.testType === 'postTest',
        )

        const avgPreTest =
          preTestSubmissions.length > 0
            ? preTestSubmissions.reduce((acc, s) => acc + s.comprehensionScore + s.vocabularyScore, 0) /
              preTestSubmissions.length
            : 0

        const avgPostTest =
          postTestSubmissions.length > 0
            ? postTestSubmissions.reduce((acc, s) => acc + s.comprehensionScore + s.vocabularyScore, 0) /
              postTestSubmissions.length
            : 0

        return {
          studentId,
          'Pre-test Average': Math.round(avgPreTest * 100) / 100,
          'Post-test Average': Math.round(avgPostTest * 100) / 100,
          Improvement: Math.round((avgPostTest - avgPreTest) * 100) / 100,
        }
      })
      .sort((a, b) => b['Improvement'] - a['Improvement'])
  }, [allSubmissions])

  // Time analysis data
  const timeAnalysisData = useMemo(() => {
    const skillIds = [...new Set(materials.map((m) => m.skill))]

    return skillIds.map((skillId) => {
      const skillMaterials = materials.filter((m) => m.skill === skillId)
      const skillSubmissions = allSubmissions.filter((s) =>
        skillMaterials.some((m) => m.id === s.materialId),
      )

      const avgTime =
        skillSubmissions.length > 0
          ? skillSubmissions.reduce((acc, s) => acc + (s.duration || 0), 0) /
            skillSubmissions.length
          : 0

      return {
        skill: skills.find((s) => s.id === skillId)?.title || 'Unknown',
        'Average Time (min)': Math.round((avgTime / 60) * 100) / 100,
        Submissions: skillSubmissions.length,
      }
    })
  }, [materials, allSubmissions, skills])

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8']

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600 mt-2">
            Monitor student progress and learning analytics
          </p>
        </div>

        {/* Test Type Toggle */}
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-700">Test Type:</span>
          <div className="flex bg-gray-100 rounded-lg p-1">
            <Button
              variant={selectedTestType === 'preTest' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setSelectedTestType('preTest')}
              className="text-xs"
            >
              Pre-test
            </Button>
            <Button
              variant={selectedTestType === 'postTest' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setSelectedTestType('postTest')}
              className="text-xs"
            >
              Post-test
            </Button>
          </div>
        </div>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Students
            </CardTitle>
            <svg
              className="h-4 w-4 text-muted-foreground"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
              />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {getUniqueStudentsCount(selectedTestType)}
            </div>
            <p className="text-xs text-muted-foreground">
              Active in {selectedTestType.replace('Test', ' ')}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Skills</CardTitle>
            <svg
              className="h-4 w-4 text-muted-foreground"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
              />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{skills.length}</div>
            <p className="text-xs text-muted-foreground">
              Available learning skills
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Score</CardTitle>
            <svg
              className="h-4 w-4 text-muted-foreground"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
              />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {skillRankings.length > 0
                ? Math.round(
                    skillRankings.reduce(
                      (acc, skill) =>
                        acc +
                        (selectedTestType === 'preTest'
                          ? skill.preTestScore
                          : skill.postTestScore),
                      0,
                    ) / skillRankings.length,
                  )
                : 0}
            </div>
            <p className="text-xs text-muted-foreground">
              {selectedTestType.replace('Test', ' ')} average
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Top Skill</CardTitle>
            <svg
              className="h-4 w-4 text-muted-foreground"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
              />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {skillRankings.length > 0 ? skillRankings[0].title : 'N/A'}
            </div>
            <p className="text-xs text-muted-foreground">
              {skillRankings.length > 0
                ? `${skillRankings[0].percentage}%`
                : 'No data'}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts and Analytics */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="skills">Skills Analysis</TabsTrigger>
          <TabsTrigger value="students">Student Progress</TabsTrigger>
          <TabsTrigger value="time">Time Analysis</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Skill Performance Comparison */}
            <Card>
              <CardHeader>
                <CardTitle>Pre Test vs Post Test Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={skillChartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="Pre Test" fill="#8884d8" />
                    <Bar dataKey="Post Test" fill="#82ca9d" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Top Performing Skills */}
            <Card>
              <CardHeader>
                <CardTitle>Top Performing Skills</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={skillRankings.slice(0, 5)}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percentage }) =>
                        `${name}: ${percentage}%`
                      }
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="percentage"
                    >
                      {skillRankings.slice(0, 5).map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Skills Analysis Tab */}
        <TabsContent value="skills" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Skills Performance Ranking</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4 font-medium">Rank</th>
                      <th className="text-left py-3 px-4 font-medium">Skill</th>
                      <th className="text-left py-3 px-4 font-medium">
                        Pre Test Score
                      </th>
                      <th className="text-left py-3 px-4 font-medium">
                        Post Test Score
                      </th>
                      <th className="text-left py-3 px-4 font-medium">
                        Improvement
                      </th>
                      <th className="text-left py-3 px-4 font-medium">
                        Percentage
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {skillRankings.map((skill, index) => (
                      <tr key={skill.id} className="border-b hover:bg-gray-50">
                        <td className="py-3 px-4">
                          <Badge variant={index < 3 ? 'default' : 'secondary'}>
                            #{index + 1}
                          </Badge>
                        </td>
                        <td className="py-3 px-4 font-medium">{skill.title}</td>
                        <td className="py-3 px-4">{skill.preTestScore}</td>
                        <td className="py-3 px-4">{skill.postTestScore}</td>
                        <td className="py-3 px-4">
                          <span
                            className={`font-medium ${
                              skill.postTestScore > skill.preTestScore
                                ? 'text-green-600'
                                : 'text-red-600'
                            }`}
                          >
                            {skill.postTestScore > skill.preTestScore
                              ? '+'
                              : ''}
                            {skill.postTestScore - skill.preTestScore}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <Badge variant="outline">{skill.percentage}%</Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Student Progress Tab */}
        <TabsContent value="students" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Individual Student Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={studentProgressData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="studentId" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="Pre Test Average"
                    stroke="#8884d8"
                    strokeWidth={2}
                  />
                  <Line
                    type="monotone"
                    dataKey="Post Test Average"
                    stroke="#82ca9d"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Student Improvement Table */}
          <Card>
            <CardHeader>
              <CardTitle>Student Improvement Ranking</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4 font-medium">Rank</th>
                      <th className="text-left py-3 px-4 font-medium">
                        Student ID
                      </th>
                      <th className="text-left py-3 px-4 font-medium">
                        Pre Test Avg
                      </th>
                      <th className="text-left py-3 px-4 font-medium">
                        Post Test Avg
                      </th>
                      <th className="text-left py-3 px-4 font-medium">
                        Improvement
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {studentProgressData.map((student, index) => (
                      <tr
                        key={student.studentId}
                        className="border-b hover:bg-gray-50"
                      >
                        <td className="py-3 px-4">
                          <Badge variant={index < 3 ? 'default' : 'secondary'}>
                            #{index + 1}
                          </Badge>
                        </td>
                        <td className="py-3 px-4 font-medium">
                          {student.studentId}
                        </td>
                        {/* <td className="py-3 px-4">
                          {student['Pre-test Average']}
                        </td>
                        <td className="py-3 px-4">
                          {student['Post Test Average']}
                        </td> */}
                        <td className="py-3 px-4">
                          <span
                            className={`font-medium ${
                              student.Improvement > 0
                                ? 'text-green-600'
                                : 'text-red-600'
                            }`}
                          >
                            {student.Improvement > 0 ? '+' : ''}
                            {student.Improvement}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Time Analysis Tab */}
        <TabsContent value="time" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Time Analysis by Skill</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={timeAnalysisData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="skill" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="Average Time (min)" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Time Analysis Table */}
          <Card>
            <CardHeader>
              <CardTitle>Detailed Time Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4 font-medium">Skill</th>
                      <th className="text-left py-3 px-4 font-medium">
                        Average Time (min)
                      </th>
                      <th className="text-left py-3 px-4 font-medium">
                        Total Submissions
                      </th>
                      <th className="text-left py-3 px-4 font-medium">
                        Efficiency
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {timeAnalysisData.map((item, index) => (
                      <tr key={index} className="border-b hover:bg-gray-50">
                        <td className="py-3 px-4 font-medium">{item.skill}</td>
                        <td className="py-3 px-4">
                          {item['Average Time (min)']}
                        </td>
                        <td className="py-3 px-4">{item.Submissions}</td>
                        <td className="py-3 px-4">
                          <Badge
                            variant={
                              item['Average Time (min)'] < 5
                                ? 'default'
                                : item['Average Time (min)'] < 10
                                  ? 'secondary'
                                  : 'destructive'
                            }
                          >
                            {item['Average Time (min)'] < 5
                              ? 'Fast'
                              : item['Average Time (min)'] < 10
                                ? 'Normal'
                                : 'Slow'}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
