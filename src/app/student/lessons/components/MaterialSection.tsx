"use client"

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { LessonMaterial } from '@/interface/lesson'
import { Square, Volume2, ExternalLink } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

interface MaterialSectionProps {
  materials: LessonMaterial[]
}

export default function MaterialSection({ materials }: MaterialSectionProps) {
  const [isSpeaking, setIsSpeaking] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current.currentTime = 0
        audioRef.current.src = ""
        audioRef.current = null
      }
    }
  }, [])

  const speakText = async (material: LessonMaterial) => {
    console.log(material.audioUrl)
    if (!material.audioUrl) {
      return;
    }
    if (!audioRef.current) {
      audioRef.current = new Audio(material.audioUrl!)
    }

    const audio = audioRef.current

    if (isSpeaking) {
      audio.pause()
      audio.currentTime = 0
      setIsSpeaking(false)
      return;
    }

    setIsSpeaking(true)
    try {
      await audio.play()
    } catch (err) {
      setIsSpeaking(false)
    }

    audio.onended = () => {
      setIsSpeaking(false)
    }
  }





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

                {(material.content || material.link) && (
                  <CardContent>
                    <div className="prose prose-stone max-w-none">
                      {material.content && (
                        <>
                          <Button
                            onClick={() => speakText(material)}
                            variant="outline"
                            size="sm"
                            className={`transition-all duration-200 ${isSpeaking
                              ? 'border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300'
                              : 'border-blue-200 text-blue-600 hover:bg-blue-50 hover:border-blue-300'
                              }`}
                            aria-label={isSpeaking ? 'Stop speaking' : 'Speak text'}
                          >
                            {isSpeaking ? (
                              <Square className="h-4 w-4 mr-2" />
                            ) : (
                              <Volume2 className="h-4 w-4 mr-2" />
                            )}
                            {isSpeaking ? 'Stop' : 'Listen'}
                          </Button>
                          <p className="text-base leading-relaxed whitespace-pre-wrap">
                            {material.content}
                          </p>
                        </>
                      )}
                      {material.link && (
                        <a
                          href={material.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 mt-4 text-sm font-medium text-blue-600 hover:text-blue-700 hover:underline"
                        >
                          <ExternalLink className="h-4 w-4" />
                          Reference
                        </a>
                      )}
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
