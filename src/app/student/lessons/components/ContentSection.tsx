import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Content } from '@/interface/lesson'
import { Bookmark, BookmarkCheck, CheckCircle2, Circle } from 'lucide-react'

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
}

export default function ContentSection({
  content,
  contentId,
  onToggleBookmark,
  onMarkComplete,
  isBookmarked,
  isCompleted,
}: ContentSectionProps) {
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
        {content.examples && content.examples.length > 0 ? (
          <div className="space-y-4">
            {content.examples.map((example, exampleIndex) => {
              return (
                <Card
                  key={exampleIndex}
                  className="border border-stone-200 bg-stone-50/50 hover:shadow-md transition-all duration-300 hover:-translate-y-1"
                >
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-center gap-3 flex-1">
                        <div className="flex-1">
                          <h4 className=" text-sm text-muted-foreground ">
                            Example {exampleIndex + 1}
                          </h4>
                        </div>
                      </div>
                    </div>

                    {example && (
                      <p className="font-semibold text-foreground">{example}</p>
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
      </CardContent>
    </Card>
  )
}
