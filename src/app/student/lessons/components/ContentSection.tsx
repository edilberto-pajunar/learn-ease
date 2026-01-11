import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Content } from '@/interface/lesson'
import {
  Bookmark,
  BookmarkCheck,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Circle,
  Lightbulb,
  Sparkles,
} from 'lucide-react'

interface ContentSectionProps {
  content: Content
  contentId: string
  expandedExamples: Set<string>
  highlightedText: string | null
  onToggleExample: (contentId: string, exampleIndex: number) => void
  onTextHighlight: (text: string) => void
  onToggleBookmark: (sectionId: string) => void
  onMarkComplete: (sectionId: string) => void
  isBookmarked: boolean
  isCompleted: boolean
}

export default function ContentSection({
  content,
  contentId,
  expandedExamples,
  highlightedText,
  onToggleExample,
  onTextHighlight,
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
          <p className="text-base text-muted-foreground leading-relaxed mt-2">
            {content.description}
          </p>
        )}
      </CardHeader>

      <CardContent className="space-y-6">
        {content.content && content.content.length > 0 ? (
          <div className="space-y-4">
            {content.content.map((example, exampleIndex) => {
              const exampleKey = `${contentId}-${exampleIndex}`
              const isExpanded = expandedExamples.has(exampleKey)

              return (
                <Card
                  key={exampleIndex}
                  className="border border-stone-200 bg-stone-50/50 hover:shadow-md transition-all duration-300 hover:-translate-y-1"
                >
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between gap-4 mb-4">
                      <div className="flex items-center gap-3 flex-1">
                        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                          <Lightbulb className="w-5 h-5 text-blue-600" />
                        </div>
                        <div className="flex-1">
                          {example.title && (
                            <h4 className="font-semibold text-foreground mb-1">
                              {example.title}
                            </h4>
                          )}
                          {example.author && (
                            <p className="text-sm text-muted-foreground">
                              by {example.author}
                            </p>
                          )}
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onToggleExample(contentId, exampleIndex)}
                        className="transition-all duration-200 hover:bg-blue-50"
                      >
                        {isExpanded ? (
                          <ChevronUp className="w-5 h-5" />
                        ) : (
                          <ChevronDown className="w-5 h-5" />
                        )}
                      </Button>
                    </div>

                    {isExpanded && example.body && (
                      <div className="mt-4 pt-4 border-t border-stone-200">
                        <div className="prose prose-stone max-w-none">
                          <p
                            className={`text-base leading-relaxed text-foreground cursor-pointer transition-all duration-200 ${
                              highlightedText === example.body
                                ? 'bg-yellow-200 rounded px-2 py-1'
                                : 'hover:bg-stone-100 rounded px-2 py-1'
                            }`}
                            onClick={() => onTextHighlight(example.body || '')}
                          >
                            {example.body}
                          </p>
                        </div>
                        {highlightedText === example.body && (
                          <div className="mt-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                            <div className="flex items-start gap-2">
                              <Sparkles className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                              <p className="text-sm text-blue-900">
                                You&apos;ve highlighted this text. Click again
                                to unhighlight.
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {!isExpanded && example.body && (
                      <div className="mt-3">
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {example.body.substring(0, 150)}
                          {example.body.length > 150 && '...'}
                        </p>
                        <Button
                          variant="link"
                          size="sm"
                          onClick={() =>
                            onToggleExample(contentId, exampleIndex)
                          }
                          className="mt-2 p-0 h-auto text-blue-600"
                        >
                          Read more
                        </Button>
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
      </CardContent>
    </Card>
  )
}
