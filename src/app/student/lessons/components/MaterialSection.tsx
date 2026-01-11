import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { LessonMaterial } from '@/interface/lesson'

interface MaterialSectionProps {
  materials: LessonMaterial[]
}

export default function MaterialSection({ materials }: MaterialSectionProps) {
  return (
    <div>
      {materials && materials.length > 0 && (
        <Card className="border-0 shadow-md bg-white/80 backdrop-blur-sm mt-6 mb-6">
          <CardHeader>
            <CardTitle className="text-xl font-bold">Materials</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {materials.map((material, index) => (
              <Card key={index} className="border border-stone-200">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      {material.title && (
                        <CardTitle className="text-lg mb-2">
                          {material.title}
                        </CardTitle>
                      )}
                      {material.author && (
                        <p className="text-sm text-muted-foreground">
                          by {material.author}
                        </p>
                      )}
                      {material.type && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 mt-2">
                          {material.type === 'poem' ? 'Poem' : 'Prose'}
                        </span>
                      )}
                    </div>
                  </div>
                </CardHeader>
                {material.content && (
                  <CardContent>
                    <div className="prose prose-stone max-w-none">
                      <p className="text-base leading-relaxed whitespace-pre-wrap">
                        {material.content}
                      </p>
                    </div>
                  </CardContent>
                )}
              </Card>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
