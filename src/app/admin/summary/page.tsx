'use client'

import { useAdminStore } from '@/hooks/useAdminStore'
import { useSubmissionStore } from '@/hooks/useSubmissionStore'
import { useEffect, useMemo } from 'react'

export default function SummaryPage() {
  const { allSubmissions, fetchAllSubmissions } = useSubmissionStore()
  const { skills, getSkills, materials, setMaterials } = useAdminStore()

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
    return submissions.reduce((acc, submission) => acc + submission.score, 0)
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
        const preTestScore = getTotalScorePerSkill(skill.id, 'pre_test')
        const postTestScore = getTotalScorePerSkill(skill.id, 'post_test')
        const totalScore = preTestScore + postTestScore
        const hps = 5 * getUniqueStudentsCount('pre_test')
        const percentage = parseFloat(getPercentage(totalScore, hps))

        return {
          ...skill,
          percentage,
          totalScore,
          hps,
        }
      })
      .sort((a, b) => b.percentage - a.percentage)
  }, [skills, allSubmissions])

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Skills Analysis</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr className="bg-gray-50">
              <th className="w-32 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Skill
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Number of items
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Total Pre-test Score
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Total Post-test Score
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                ATS
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                HPS
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Percentage
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Rank
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            <tr className="bg-gray-50">
              <td className="w-32 px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                Total Students
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                -
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {getUniqueStudentsCount('pre_test')}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {getUniqueStudentsCount('post_test')}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                -
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                -
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                -
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                -
              </td>
            </tr>
            {skillRankings.map((skill, index) => {
              const isTopThree = index < 3
              return (
                <tr key={skill.id} className={isTopThree ? 'bg-green-50' : ''}>
                  <td className="w-32 px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {skill.title}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    5
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {getTotalScorePerSkill(skill.id, 'pre_test')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {getTotalScorePerSkill(skill.id, 'post_test')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {skill.totalScore}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {skill.hps}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {skill.percentage}%
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {index + 1}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
