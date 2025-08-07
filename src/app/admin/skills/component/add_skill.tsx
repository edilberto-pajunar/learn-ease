import { Button } from '@/components/ui/button'
import { DialogHeader } from '@/components/ui/dialog'
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
} from '@/components/ui/dialog'
import { Plus } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export default function AddSkill({
  isAddDialogOpen,
  setIsAddDialogOpen,
  newSkillTitle,
  setNewSkillTitle,
  handleAddSkill,
  isAdding,
}: {
  isAddDialogOpen: boolean
  setIsAddDialogOpen: (open: boolean) => void
  newSkillTitle: string
  setNewSkillTitle: (title: string) => void
  handleAddSkill: () => void
  isAdding: boolean
}) {
  return (
    <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
      <DialogTrigger asChild>
        <Button className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Add Skill
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Skill</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="skill-title">Skill Title</Label>
            <Input
              id="skill-title"
              value={newSkillTitle}
              onChange={(e) => setNewSkillTitle(e.target.value)}
              placeholder="Enter skill title..."
              onKeyPress={(e) => e.key === 'Enter' && handleAddSkill()}
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleAddSkill}
              disabled={!newSkillTitle.trim() || isAdding}
              className="flex items-center gap-2"
            >
              {isAdding ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Adding...
                </>
              ) : (
                'Add Skill'
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
