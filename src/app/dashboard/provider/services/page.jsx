import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/lib/actions/auth'
import { getAllCategories } from '@/lib/actions/services'
import { createServiceListing, getMyServiceListings, getMyProviderProfile } from '@/lib/actions/provider'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

export default async function ProviderServicesPage({ searchParams }) {
  const user = await getCurrentUser()

  if (!user) {
    redirect('/login')
  }

  const [categories, listings, profileData] = await Promise.all([
    getAllCategories(),
    getMyServiceListings(),
    getMyProviderProfile(),
  ])

  const provider = profileData.provider
  const query = String(searchParams?.q || '').toLowerCase().trim()
  const selectedCategory = String(searchParams?.category || '')
  const minPrice = searchParams?.min_price ? Number(searchParams.min_price) : null
  const maxPrice = searchParams?.max_price ? Number(searchParams.max_price) : null

  const filteredListings = listings.filter((listing) => {
    if (selectedCategory && listing.category_id !== selectedCategory) {
      return false
    }

    if (minPrice !== null && Number(listing.price || 0) < minPrice) {
      return false
    }

    if (maxPrice !== null && Number(listing.price || 0) > maxPrice) {
      return false
    }

    if (query) {
      const searchable = [
        listing.title,
        listing.description,
        listing.service_categories?.category_name,
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()

      if (!searchable.includes(query)) {
        return false
      }
    }

    return true
  })

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Create Service Listing</CardTitle>
          <CardDescription>Publish a new offer so customers can book your services.</CardDescription>
        </CardHeader>
        <CardContent>
          <form action={createServiceListing} className="grid gap-3 md:grid-cols-2">
            <input
              name="title"
              placeholder="Service title"
              required
              className="h-11 rounded-md border border-slate-200 bg-white px-3 text-sm outline-none focus:border-slate-400"
            />
            <select
              name="category_id"
              required
              className="h-11 rounded-md border border-slate-200 bg-white px-3 text-sm outline-none focus:border-slate-400"
            >
              <option value="">Select category</option>
              {categories.map((category) => (
                <option key={category.category_id} value={category.category_id}>{category.category_name}</option>
              ))}
            </select>
            <input
              name="price"
              type="number"
              min="0"
              placeholder="Starting price"
              required
              className="h-11 rounded-md border border-slate-200 bg-white px-3 text-sm outline-none focus:border-slate-400"
            />
            <input
              name="description"
              placeholder="Short description"
              className="h-11 rounded-md border border-slate-200 bg-white px-3 text-sm outline-none focus:border-slate-400 md:col-span-2"
            />
            <div className="md:col-span-2">
              <Button type="submit" className="gradient-primary text-white">Publish Listing</Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <Card>
          <CardHeader>
            <CardTitle>My Listings</CardTitle>
            <CardDescription>Services currently visible to customers.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <form action="/dashboard/provider/services" className="grid gap-3 md:grid-cols-[1fr_180px_140px_140px_auto]">
              <input
                name="q"
                defaultValue={searchParams?.q || ''}
                placeholder="Search my listings"
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
              <input
                type="number"
                min="0"
                name="min_price"
                defaultValue={searchParams?.min_price || ''}
                placeholder="Min PKR"
                className="h-10 rounded-md border border-slate-200 bg-white px-3 text-sm outline-none focus:border-slate-400"
              />
              <input
                type="number"
                min="0"
                name="max_price"
                defaultValue={searchParams?.max_price || ''}
                placeholder="Max PKR"
                className="h-10 rounded-md border border-slate-200 bg-white px-3 text-sm outline-none focus:border-slate-400"
              />
              <Button type="submit" variant="outline">Filter</Button>
            </form>

            {filteredListings.length === 0 ? (
              <p className="text-sm text-slate-500">No listings published yet.</p>
            ) : (
              filteredListings.map((listing) => (
                <div key={listing.listing_id} className="rounded-xl border p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-semibold text-slate-900">{listing.title}</p>
                      <p className="text-sm text-slate-500">{listing.service_categories?.category_name || 'Uncategorized'}</p>
                    </div>
                    <Badge variant="outline">PKR {Number(listing.price || 0).toLocaleString()}</Badge>
                  </div>
                  <p className="mt-2 text-sm text-slate-600">{listing.description || 'No description provided'}</p>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Provider Profile</CardTitle>
            <CardDescription>Summary of your public-facing profile.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="font-semibold text-slate-900">{profileData.user.profile?.name || profileData.user.user_metadata?.name || profileData.user.email}</p>
              <p className="text-sm text-slate-500">{profileData.user.email}</p>
            </div>
            <p className="text-sm text-slate-600">{provider?.skills || 'Add a skills description so customers can find you.'}</p>
            <div className="flex flex-wrap gap-2">
              <Badge className={provider?.is_verified ? 'bg-emerald-100 text-emerald-700 border-emerald-200' : 'bg-amber-100 text-amber-700 border-amber-200'}>
                {provider?.is_verified ? 'Verified' : 'Pending Verification'}
              </Badge>
              <Badge variant="outline">Rating {Number(provider?.rating || 0).toFixed(1)}</Badge>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  )
}