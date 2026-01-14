import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Content } from '@/interface/lesson'
import {
  Bookmark,
  BookmarkCheck,
  CheckCircle2,
  Circle,
  Plus,
  Loader2,
  Info,
} from 'lucide-react'
import { useState } from 'react'
import { generateExample } from '../action'

interface ContentSectionProps {
  content: Content
  contentId: string
  expandedExamples?: Set<string>
  highlightedText?: string | null
  onToggleExample?: (contentId: string, exampleIndex: number) => void
  onTextHighlight?: (text: string) => void
  onToggleBookmark: (sectionId: string) => void
  onMarkComplete: (sectionId: string) => void
  isBookmarked: boolean
  isCompleted: boolean
  additionalExamples?: Array<{ example: string; explanation: string }>
  onAddExample: (
    contentId: string,
    example: string,
    explanation: string,
  ) => void
}

export default function ContentSection({
  content,
  contentId,
  onToggleBookmark,
  onMarkComplete,
  isBookmarked,
  isCompleted,
  additionalExamples = [],
  onAddExample,
}: ContentSectionProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [expandedExplanations, setExpandedExplanations] = useState<Set<number>>(
    new Set(),
  )

  const handleGenerateExample = async () => {
    setIsLoading(true)
    try {
      const message = `Create an example for: ${content.title}${content.description ? `. ${content.description}` : ''}`

      const result = await generateExample(message)

      if (result.success && result.data?.example) {
        onAddExample(
          contentId,
          result.data.example,
          result.data.explanation || '',
        )
      } else {
        console.error('Failed to generate example:', result.error)
      }
    } catch (error) {
      console.error('Error generating example:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const originalExamples = (content.examples || []).map((ex) => ({
    example: ex,
    explanation: null,
    isAIGenerated: false,
  }))
  const aiExamples = (additionalExamples || []).map((ex) => ({
    example: ex.example,
    explanation: ex.explanation,
    isAIGenerated: true,
  }))
  const allExamples = [...originalExamples, ...aiExamples]

  const toggleExplanation = (index: number) => {
    const newSet = new Set(expandedExplanations)
    if (newSet.has(index)) {
      newSet.delete(index)
    } else {
      newSet.add(index)
    }
    setExpandedExplanations(newSet)
  }
  return (
    <Card className="border-0 shadow-lg bg-white/90 backdrop-blur-sm">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between gap-4">
          <CardTitle className="text-2xl font-bold text-foreground">
            {content.title}
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onToggleBookmark(contentId)}
              className="transition-all duration-200 hover:bg-blue-50"
            >
              {isBookmarked ? (
                <BookmarkCheck className="w-5 h-5 text-blue-600" />
              ) : (
                <Bookmark className="w-5 h-5 text-muted-foreground" />
              )}
            </Button>
            <Button
              variant={isCompleted ? 'secondary' : 'outline'}
              size="sm"
              onClick={() => onMarkComplete(contentId)}
              className="transition-all duration-200"
            >
              {isCompleted ? (
                <>
                  <CheckCircle2 className="w-4 h-4 mr-2" />
                  Completed
                </>
              ) : (
                <>
                  <Circle className="w-4 h-4 mr-2" />
                  Mark Complete
                </>
              )}
            </Button>
          </div>
        </div>
        {content.description && (
          <p className="text-base leading-relaxed mt-2">
            {content.description}
          </p>
        )}
      </CardHeader>

      <CardContent className="space-y-6">
        {allExamples.length > 0 ? (
          <div className="space-y-4">
            {allExamples.map((exampleData, exampleIndex) => {
              const isExplanationExpanded =
                expandedExplanations.has(exampleIndex)
              return (
                <Card
                  key={exampleIndex}
                  className="border border-stone-200 bg-stone-50/50 hover:shadow-md transition-all duration-300 hover:-translate-y-1"
                >
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-center gap-3 flex-1">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h4 className="text-sm text-muted-foreground">
                              Example {exampleIndex + 1}
                            </h4>
                            {exampleData.isAIGenerated &&
                              exampleData.explanation && (
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-5 w-5 p-0 hover:bg-blue-50"
                                  onClick={() =>
                                    toggleExplanation(exampleIndex)
                                  }
                                  title="Show explanation"
                                >
                                  <Info className="h-4 w-4 text-blue-600" />
                                </Button>
                              )}
                          </div>
                        </div>
                      </div>
                    </div>

                    {exampleData.example && (
                      <p className="font-semibold text-foreground whitespace-pre-line mt-2">
                        {exampleData.example}
                      </p>
                    )}

                    {isExplanationExpanded && exampleData.explanation && (
                      <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                        <p className="text-sm font-medium text-blue-900 mb-2">
                          Explanation:
                        </p>
                        <p className="text-sm text-blue-800 whitespace-pre-line">
                          {exampleData.explanation}
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )
            })}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-muted-foreground">
              No examples available for this section.
            </p>
          </div>
        )}

        <div className="flex justify-center pt-2">
          <Button
            onClick={handleGenerateExample}
            disabled={isLoading}
            variant="outline"
            className="gap-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Plus className="w-4 h-4" />
                Generate More Example
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
