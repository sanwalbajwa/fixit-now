'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { ArrowUpDown } from 'lucide-react'

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
      <ArrowUpDown className="size-4 text-slate-400" />
      <span className="text-sm text-slate-500">Sort:</span>
      <select
        className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 outline-none focus:border-[#009689] focus:ring-2 focus:ring-[#009689]/20 transition-colors"
        value={selectedSort}
        onChange={handleSortChange}
      >
        <option value="rating">Highest Rated</option>
        <option value="newest">Newest First</option>
      </select>
    </div>
  )
}
