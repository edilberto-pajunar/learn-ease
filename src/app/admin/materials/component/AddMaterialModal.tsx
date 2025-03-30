import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea";
import { useAdminStore } from "@/hooks/useAdminStore";
import { Material } from "@/interface/material";
import { useState } from "react";

export function AddMaterialModal() {


    const [error, setError] = useState(""); // Error state for validation
    const { addMaterial } = useAdminStore();

    const [formData, setFormData] = useState<Material>({
        id: "", // Firestore will generate this, but initialize it
        text: "", // The main material text
        questions: [
            {
                title: "",
                options: ["", "", "", ""], // Default 4 choices
                answer: ""
            }
        ]
    });

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
        field: keyof Material,
        questionIndex?: number,
        optionIndex?: number
    ) => {
        if (field === "questions" && questionIndex !== undefined) {
            const newQuestions = [...formData.questions];

            if (optionIndex !== undefined) {
                // Updating a specific option in a question
                newQuestions[questionIndex].options[optionIndex] = e.target.value;
            } else {
                // Updating the question title or answer
                newQuestions[questionIndex] = {
                    ...newQuestions[questionIndex],
                    [e.target.name]: e.target.value
                };
            }

            setFormData({ ...formData, questions: newQuestions });
        } else {
            setFormData({ ...formData, [field]: e.target.value });
        }
    };

    const handleSave = async () => {
        if (formData.text.trim() === "") {
            setError("Material text cannot be empty.");
            return;
        }

        if (formData.questions.some(q => q.title.trim() === "" || q.answer.trim() === "")) {
            setError("Each question must have a title and an answer.");
            return;
        }

        if (formData.questions.some(q => q.options.includes("") || !q.options.includes(q.answer))) {
            setError("Each question must have 4 options, and the answer must match one of them.");
            return;
        }
    };



    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline">Add Material</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Add Material</DialogTitle>
                </DialogHeader>
                <form>
                    <FormRow label="Material Text">
                        <Textarea
                            id="text"
                            className="col-span-3 w-full"
                            rows={5}
                            placeholder="Enter material details..."
                            value={formData.text}
                            onChange={(e) => handleChange(e, "text")}
                        />
                    </FormRow>

                    {formData.questions.map((question, qIndex) => (
                        <div key={qIndex} className="border p-4 rounded-lg">
                            <FormRow label={`Question ${qIndex + 1}`}>
                                <Input
                                    name="title"
                                    value={question.title}
                                    onChange={(e) => handleChange(e, "questions", qIndex)}
                                />
                            </FormRow>

                            {question.options.map((option, oIndex) => (
                                <FormRow key={oIndex} label={`Option ${oIndex + 1}`}>
                                    <Input
                                        value={option}
                                        onChange={(e) => handleChange(e, "questions", qIndex, oIndex)}
                                    />
                                </FormRow>
                            ))}

                            <FormRow label="Answer">
                                <Input
                                    name="answer"
                                    value={question.answer}
                                    onChange={(e) => handleChange(e, "questions", qIndex)}
                                />
                            </FormRow>
                        </div>
                    ))}

                    <DialogFooter>
                        <Button onClick={handleSave} type="submit">Save changes</Button>
                    </DialogFooter>
                </form>

                {error && <p className="text-red-500 text-sm">{error}</p>}

            </DialogContent>
        </Dialog>
    )
};
// Helper component to reduce duplication
function FormRow({ label, children }: { label: string; children: React.ReactNode }) {
    return (
        <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">{label}</Label>
            {children}
        </div>
    );
}
