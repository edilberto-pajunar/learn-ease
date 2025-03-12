import React from 'react'
import { textVide } from 'text-vide'

const BoldEachLetter: React.FC<{
  text: string
  bionic: boolean
  onWordTap?: (word: string) => void
}> = ({ text, bionic, onWordTap }) => {
  const words = text.split(/(\s+)/) // Split by words and spaces (capturing spaces)

  return (
    <p className="text-justify text-black-400">
      {words.map((word, index) => {
        if (/\s+/.test(word)) {
          // If it's just whitespace, render it normally
          return word
        }
        return (
          <span
            key={index}
            className="cursor-pointer hover:underline"
            onClick={() => onWordTap && onWordTap(word)}
            dangerouslySetInnerHTML={{ __html: bionic ? textVide(word) : word }}
          />
        )
      })}
    </p>
  )
}

export default BoldEachLetter
