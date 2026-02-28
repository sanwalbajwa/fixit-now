'use client'

import { useRouter, useSearchParams } from 'next/navigation'

export default function ServicesSortFilter() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const selectedSort = searchParams.get('sort') || 'rating'

  function handleSortChange(e) {
    const params = new URLSearchParams(searchParams.toString())
    params.set('sort', e.target.value)
    router.push(`/services?${params.toString()}`)
  }

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-slate-600">Sort by:</span>
      <select
        className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
        value={selectedSort}
        onChange={handleSortChange}
      >
        <option value="rating">Highest Rated</option>
        <option value="newest">Newest First</option>
      </select>
    </div>
  )
}