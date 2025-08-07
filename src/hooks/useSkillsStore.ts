import { Skill } from '@/interface/skill'
import { adminService } from '@/services/adminService'
import { create } from 'zustand'

interface SkillState {
  skills: Skill[]
  loading: boolean
  setSkills: () => void
  addSkill: (title: string) => Promise<void>
  updateSkill: (id: string, title: string) => Promise<void>
  deleteSkill: (id: string) => Promise<void>
}

export const useSkillsStore = create<SkillState>((set, get) => ({
  skills: [],
  loading: false,
  setSkills: () => {
    set({ loading: true })
    adminService
      .getSkills()
      .then((skills) => {
        console.log(skills)
        set({ skills: skills as Skill[], loading: false })
      })
      .catch(() => {
        set({ loading: false })
      })
  },
  addSkill: async (title: string) => {
    try {
      set({ loading: true })
      await adminService.addSkill({ title })
      await get().setSkills()
    } catch (error) {
      set({ loading: false })
      throw error
    }
  },
  updateSkill: async (id: string, title: string) => {
    try {
      set({ loading: true })
      await adminService.updateSkill(id, { title })
      await get().setSkills()
    } catch (error) {
      set({ loading: false })
      throw error
    }
  },
  deleteSkill: async (id: string) => {
    try {
      set({ loading: true })
      await adminService.deleteSkill(id)
      await get().setSkills()
    } catch (error) {
      set({ loading: false })
      throw error
    }
  },
}))
