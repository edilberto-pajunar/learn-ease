import React from 'react'
import { textVide } from 'text-vide'

const BoldEachLetter: React.FC<{
  text: string
  bionic: boolean
  onWordTap?: (word: string) => void
}> = ({ text, bionic, onWordTap }) => {
  const processedText = text.replace(/\\n/g, '\n') // <--- important!
  const lines = processedText.split('\n')

  return (
    <div className="relative">
      <p className="text-justify text-black-400 text-2xl leading-relaxed italic">
        {lines.map((line, lineIndex) => {
          const words = line.split(/(\s+)/)

          return (
            <span key={lineIndex}>
              {words.map((word, wordIndex) => {
                if (/\s+/.test(word)) {
                  return word
                }
                return (
                  <span
                    key={wordIndex}
                    className="cursor-pointer hover:underline"
                    onClick={() => onWordTap?.(word)}
                    dangerouslySetInnerHTML={{
                      __html: bionic ? textVide(word) : word,
                    }}
                  />
                )
              })}
              <br />
            </span>
          )
        })}
      </p>
    </div>
  )
}

export default BoldEachLetter