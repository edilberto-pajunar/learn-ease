'use client'

import { useAdminStore } from '@/hooks/useAdminStore'
import { useEffect } from 'react'

export default function MaterialsPage() {
  const { quarter, toggleQuarter, getQuarter } = useAdminStore()

  useEffect(() => {
    getQuarter()
  }, [quarter])

  return (
    <div className="flex justify-center items-center h-screen">
      <div>
        <button
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          onClick={() => {
            console.log(quarter)
            toggleQuarter(quarter === 'Q1' ? 'Q2' : 'Q1')
          }}
        >
          Toggle Quarter {quarter}
        </button>
      </div>
    </div>
  )
}
