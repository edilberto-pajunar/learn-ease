import { Skill } from '@/interface/skill'
import { adminService } from '@/services/adminService'
import { create } from 'zustand'

interface SkillState {
  skills: Skill[]
  setSkills: () => void
}

export const useSkillsStore = create<SkillState>((set) => ({
  skills: [],
  setSkills: () => {
    adminService.getSkills().then((skills) => {
      console.log(skills)
      set({ skills: skills as Skill[] })
    })
  },
}))
