import BoldEachLetter from '@/components/BoldEachLetter'
import Clock from '@/components/Clock'
import { useReadStore } from '@/hooks/useReadStore'
import { Material } from '@/interface/material'
import { RotateCcw } from 'lucide-react'

export default function TimeCard({ material }: { material: Material }) {
  const { setDuration, duration } = useReadStore()

  const handleTime = (time: number) => {
    setDuration(time)
  }

  const poem = `${material.text}`
  console.log(poem)

  return (
    <div className="flex flex-wrap gap-6">
      <div className="flex flex-col items-center gap-4 mb-6 p-4 border rounded-lg w-full">
        <BoldEachLetter
          text={material.text}
          bionic={false}
          onWordTap={() => {}}
        />
        {duration === 0 || duration === null ? (
          <Clock onStop={(time) => handleTime(time)} />
        ) : (
          <div className="flex justify-center items-center gap-4">
            <h1>Time taken: {duration} seconds</h1>
            <button
              className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
              onClick={() => handleTime(0)}
              aria-label="Restart"
            >
              <RotateCcw size={20} />
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
