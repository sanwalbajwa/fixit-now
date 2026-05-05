import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { createServiceCategory, getAdminCatalog } from '@/lib/actions/admin'

function formatDate(value) {
  if (!value) return 'Unknown'
  return new Intl.DateTimeFormat('en', { month: 'short', day: 'numeric', year: 'numeric' }).format(new Date(value))
}

export default async function AdminServicesPage({ searchParams }) {
  const { categories, listings } = await getAdminCatalog()
  const query = String(searchParams?.q || '').toLowerCase().trim()
  const selectedCategory = String(searchParams?.category || '')

  const filteredCategories = categories.filter((category) => {
    if (!query) return true
    return String(category.category_name || '').toLowerCase().includes(query)
  })

  const filteredListings = listings.filter((listing) => {
    if (selectedCategory && listing.service_categories?.category_id !== selectedCategory) {
      return false
    }

    if (!query) {
      return true
    }

    const haystack = [
      listing.title,
      listing.description,
      listing.service_categories?.category_name,
      listing.service_providers?.users?.name,
      listing.service_providers?.users?.email,
    ]
      .filter(Boolean)
      .join(' ')
      .toLowerCase()

    return haystack.includes(query)
  })

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Create Service Category</CardTitle>
          <CardDescription>Add a new category to the catalog.</CardDescription>
        </CardHeader>
        <CardContent>
          <form action={createServiceCategory} className="grid gap-3 md:grid-cols-[1fr_1fr_auto]">
            <input
              name="category_name"
              placeholder="Category name"
              required
              className="h-11 rounded-md border border-slate-200 bg-white px-3 text-sm outline-none focus:border-slate-400"
            />
            <input
              name="icon_url"
              placeholder="Icon URL (optional)"
              className="h-11 rounded-md border border-slate-200 bg-white px-3 text-sm outline-none focus:border-slate-400"
            />
            <button type="submit" className="h-11 rounded-md bg-slate-900 px-4 text-sm font-medium text-white hover:bg-slate-800">Create</button>
          </form>
        </CardContent>
      </Card>

      <section className="grid gap-6 xl:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Categories</CardTitle>
            <CardDescription>Current service taxonomy.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <form action="/dashboard/admin/services" className="grid gap-3 md:grid-cols-[1fr_220px_auto]">
              <input
                name="q"
                defaultValue={searchParams?.q || ''}
                placeholder="Search categories or listings"
                className="h-10 rounded-md border border-slate-200 bg-white px-3 text-sm outline-none focus:border-slate-400"
              />
              <select
                name="category"
                defaultValue={searchParams?.category || ''}
                className="h-10 rounded-md border border-slate-200 bg-white px-3 text-sm outline-none focus:border-slate-400"
              >
                <option value="">All categories</option>
                {categories.map((category) => (
                  <option key={category.category_id} value={category.category_id}>{category.category_name}</option>
                ))}
              </select>
              <button type="submit" className="h-10 rounded-md border px-3 text-sm font-medium text-slate-700 hover:bg-slate-50">Filter</button>
            </form>

            {filteredCategories.length === 0 ? (
              <p className="text-sm text-slate-500">No categories found.</p>
            ) : (
              filteredCategories.map((category) => (
                <div key={category.category_id} className="flex items-center justify-between rounded-xl border p-4">
                  <div>
                    <p className="font-semibold text-slate-900">{category.category_name}</p>
                    <p className="text-sm text-slate-500">{formatDate(category.created_at)}</p>
                  </div>
                  <Badge variant="outline">Category</Badge>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Listings</CardTitle>
            <CardDescription>Latest service listings registered by providers.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {filteredListings.length === 0 ? (
              <p className="text-sm text-slate-500">No listings found.</p>
            ) : (
              filteredListings.map((listing) => (
                <div key={listing.listing_id} className="rounded-xl border p-4 space-y-2">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="font-semibold text-slate-900">{listing.title}</p>
                      <p className="text-sm text-slate-500">{listing.description || 'No description provided'}</p>
                    </div>
                    <Badge className="bg-slate-100 text-slate-700 border-slate-200">PKR {listing.price ?? 0}</Badge>
                  </div>
                  <div className="text-sm text-slate-600 flex flex-wrap gap-4">
                    <span>Category: {listing.service_categories?.category_name || 'Uncategorized'}</span>
                    <span>Provider: {listing.service_providers?.users?.name || listing.service_providers?.users?.email || 'Unknown'}</span>
                    <span>Created: {formatDate(listing.created_at)}</span>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </section>
    </div>
  )
}