import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Question } from '@/interface/material'
import { Skill } from '@/interface/skill'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

interface FormData {
  title: string
  text: string
  mode: string
  skill: string
  author: string
  questions: Question[]
}

export default function EditMaterial({
  isEditDialogOpen,
  setIsEditDialogOpen,
  formData,
  setFormData,
  skills,
  addQuestion,
  updateQuestion,
  removeQuestion,
  handleUpdateMaterial,
}: {
  isEditDialogOpen: boolean
  setIsEditDialogOpen: (open: boolean) => void
  formData: FormData
  setFormData: (data: FormData | ((prev: FormData) => FormData)) => void
  skills: Skill[]
  addQuestion: () => void
  updateQuestion: (
    index: number,
    field: keyof Question,
    value: string | string[],
  ) => void
  removeQuestion: (index: number) => void
  handleUpdateMaterial: () => void
}) {
  return (
    <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Material</DialogTitle>
          <DialogDescription>
            Update the material details and questions
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="edit-title">Title</Label>
              <Input
                id="edit-title"
                value={formData.title}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, title: e.target.value }))
                }
                placeholder="Material title"
              />
            </div>
            <div>
              <Label htmlFor="edit-author">Author</Label>
              <Input
                id="edit-author"
                value={formData.author}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, author: e.target.value }))
                }
                placeholder="Author name"
              />
            </div>
          </div>
          <div>
            <Label htmlFor="edit-text">Reading Text</Label>
            <Textarea
              id="edit-text"
              value={formData.text}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, text: e.target.value }))
              }
              placeholder="Enter the reading material text..."
              rows={6}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            {/* <div>
              <Label htmlFor="edit-mode">Mode</Label>
              <Input
                id="edit-mode"
                value={formData.mode}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, mode: e.target.value }))
                }
                placeholder="e.g., Reading, Listening"
              />
            </div> */}
            <div>
              <Label htmlFor="edit-skill">Skill</Label>
              <select
                id="edit-skill"
                value={formData.skill}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, skill: e.target.value }))
                }
                className="w-full p-2 border border-gray-300 rounded-md"
              >
                <option value="">Select a skill</option>
                {skills.map((skill: Skill) => (
                  <option key={skill.id} value={skill.title}>
                    {skill.title}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <Label>Questions</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addQuestion}
              >
                Add Question
              </Button>
            </div>
            {formData.questions.map((question: Question, index: number) => (
              <Card key={index} className="mb-4">
                <CardHeader>
                  <CardTitle className="text-sm">
                    Question {index + 1}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <Label>Question Title</Label>
                    <Input
                      value={question.title}
                      onChange={(e) =>
                        updateQuestion(index, 'title', e.target.value)
                      }
                      placeholder="Enter question"
                    />
                  </div>
                  <div>
                    <Label>Options</Label>
                    {question.options.map(
                      (option: string, optionIndex: number) => (
                        <Input
                          key={optionIndex}
                          value={option}
                          onChange={(e) => {
                            const newOptions = [...question.options]
                            newOptions[optionIndex] = e.target.value
                            updateQuestion(index, 'options', newOptions)
                          }}
                          placeholder={`Option ${optionIndex + 1}`}
                          className="mb-2"
                        />
                      ),
                    )}
                  </div>
                  <div>
                    <Label>Correct Answer</Label>
                    <Input
                      value={question.answer}
                      onChange={(e) =>
                        updateQuestion(index, 'answer', e.target.value)
                      }
                      placeholder="Enter correct answer"
                    />
                  </div>
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    onClick={() => removeQuestion(index)}
                  >
                    Remove Question
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => setIsEditDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleUpdateMaterial}>Update Material</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
