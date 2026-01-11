import { ChevronDown } from 'lucide-react'
import CreateMaterial from './CreateMaterial'
import { useAdminStore } from '@/hooks/useAdminStore'
import { useState } from 'react'

export default function MaterialHeader() {
  const { quarter, toggleQuarter, loading, toggleTestType } = useAdminStore()

  const preTestValue = quarter?.pre_test || false
  const postTestValue = quarter?.post_test || false

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Materials Management</h1>
        <div className="flex gap-4">
          <div className="relative">
            <select
              value={quarter?.quarter}
              onChange={async (e) => toggleQuarter(e.target.value)}
              disabled={loading}
              className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 appearance-none pr-8 min-w-[180px]"
            >
              <option value="Q1">Chapter 1</option>
              <option value="Q2">Chapter 2</option>
            </select>
            {loading && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
              </div>
            )}
            {!loading && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                <ChevronDown className="h-4 w-4 text-muted-foreground" />
              </div>
            )}
          </div>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Pre Test
              </span>
              <button
                type="button"
                onClick={() => {
                  toggleTestType('pre_test')
                }}
                role="switch"
                aria-checked={preTestValue}
                className={`
                    relative inline-flex h-6 w-11 items-center rounded-full transition-colors
                    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                    ${preTestValue ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-700'}
                    `}
              >
                <span
                  className={`
                        inline-block h-4 w-4 transform rounded-full bg-white transition-transform
                        ${preTestValue ? 'translate-x-6' : 'translate-x-1'}
                    `}
                />
              </button>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Post Test
              </span>
              <button
                type="button"
                onClick={() => {
                  toggleTestType('post_test')
                }}
                role="switch"
                aria-checked={postTestValue}
                className={`
                    relative inline-flex h-6 w-11 items-center rounded-full transition-colors
                    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                    ${postTestValue ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-700'}
                    `}
              >
                <span
                  className={`
                        inline-block h-4 w-4 transform rounded-full bg-white transition-transform
                        ${postTestValue ? 'translate-x-6' : 'translate-x-1'}
                    `}
                />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
