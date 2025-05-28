'use client'

import { useSkillsStore } from '@/hooks/useSkillsStore'

import { useEffect } from 'react'

export default function SkillsPage() {
  const { skills, setSkills } = useSkillsStore()

  useEffect(() => {
    setSkills()
  }, [])

  if (skills.length === 0) {
    return <div>Loading...</div>
  }

  return (
    <div className="flex flex-col gap-4 p-4">
      <div className="flex flex-col gap-4">
        <h1 className="text-2xl font-bold">Skills</h1>
        <div className="flex flex-col gap-4">
          {skills.map((skill) => (
            <div key={skill.id}>{skill.title}</div>
          ))}
        </div>
      </div>
    </div>
  )
}
