import Link from 'next/link'
import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/lib/actions/auth'
import { getAllCategories, getVerifiedProviders } from '@/lib/actions/services'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

function withParams(basePath, currentParams, updates = {}) {
  const next = new URLSearchParams()

  Object.entries({
    category: currentParams?.category,
    rating: currentParams?.rating,
    sort: currentParams?.sort,
    q: currentParams?.q,
    availability: currentParams?.availability,
    min_price: currentParams?.min_price,
    max_price: currentParams?.max_price,
    ...updates,
  }).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      next.set(key, String(value))
    }
  })

  const query = next.toString()
  return query ? `${basePath}?${query}` : basePath
}

export default async function CustomerServicesPage({ searchParams }) {
  const user = await getCurrentUser()

  if (!user) {
    redirect('/login')
  }

  const [categories, providers] = await Promise.all([
    getAllCategories(),
    getVerifiedProviders({
      category_id: searchParams?.category,
      min_rating: searchParams?.rating,
      sort_by: searchParams?.sort,
      search: searchParams?.q,
      availability: searchParams?.availability,
      min_price: searchParams?.min_price,
      max_price: searchParams?.max_price,
    }),
  ])

  return (
    <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
      <Card className="h-fit">
        <CardHeader>
          <CardTitle>Filters</CardTitle>
          <CardDescription>Refine providers by search, category, availability, price, and rating.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          <form action="/dashboard/customer/services" className="space-y-3 pb-4">
            <input
              name="q"
              defaultValue={searchParams?.q || ''}
              placeholder="Search providers or services"
              className="h-10 w-full rounded-md border border-slate-200 bg-white px-3 text-sm outline-none focus:border-slate-400"
            />
            <select
              name="availability"
              defaultValue={searchParams?.availability || ''}
              className="h-10 w-full rounded-md border border-slate-200 bg-white px-3 text-sm outline-none focus:border-slate-400"
            >
              <option value="">Any availability</option>
              <option value="available">Available</option>
              <option value="busy">Busy</option>
            </select>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="number"
                min="0"
                name="min_price"
                defaultValue={searchParams?.min_price || ''}
                placeholder="Min PKR"
                className="h-10 w-full rounded-md border border-slate-200 bg-white px-3 text-sm outline-none focus:border-slate-400"
              />
              <input
                type="number"
                min="0"
                name="max_price"
                defaultValue={searchParams?.max_price || ''}
                placeholder="Max PKR"
                className="h-10 w-full rounded-md border border-slate-200 bg-white px-3 text-sm outline-none focus:border-slate-400"
              />
            </div>
            {searchParams?.category && <input type="hidden" name="category" value={searchParams.category} />}
            {searchParams?.rating && <input type="hidden" name="rating" value={searchParams.rating} />}
            {searchParams?.sort && <input type="hidden" name="sort" value={searchParams.sort} />}
            <Button type="submit" className="w-full gradient-primary text-white">Apply Filters</Button>
          </form>

          <Link href="/dashboard/customer/services"><Button variant={!searchParams?.category ? 'default' : 'outline'} className="w-full justify-start">All Services</Button></Link>
          {categories.map((category) => (
            <Link key={category.category_id} href={withParams('/dashboard/customer/services', searchParams, { category: category.category_id })}>
              <Button variant={searchParams?.category === category.category_id ? 'default' : 'outline'} className="w-full justify-start">
                <span className="mr-2">{category.icon_url || '•'}</span>{category.category_name}
              </Button>
            </Link>
          ))}

          <div className="pt-4">
            <p className="mb-2 text-sm font-semibold text-slate-900">Minimum Rating</p>
            {[4.5, 4.0, 3.5].map((rating) => (
              <Link key={rating} href={withParams('/dashboard/customer/services', searchParams, { rating })}>
                <Button variant="outline" className="mb-2 w-full justify-start">⭐ {rating}+ Stars</Button>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>

      <section className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Verified Providers</CardTitle>
            <CardDescription>Book directly from the public provider directory.</CardDescription>
          </CardHeader>
        </Card>

        <div className="grid gap-4 xl:grid-cols-2">
          {providers.length === 0 ? (
            <Card>
              <CardContent className="pt-6 text-sm text-slate-500">
                No providers matched your filters. Try adjusting your search or price range.
              </CardContent>
            </Card>
          ) : providers.map((provider) => (
            <Card key={provider.provider_id}>
              <CardContent className="pt-6">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-lg font-semibold text-slate-900">{provider.users?.name || provider.users?.email}</p>
                    <p className="text-sm text-slate-500">{provider.users?.phone || 'No phone provided'}</p>
                  </div>
                  <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200">Verified</Badge>
                </div>

                <p className="mt-3 text-sm text-slate-600">{provider.skills || 'No skills listed'}</p>

                <div className="mt-4 flex items-center justify-between text-sm text-slate-600">
                  <span>Rating {Number(provider.rating || 0).toFixed(1)} • {provider.total_reviews || 0} reviews</span>
                  <span>{provider.availability || 'availability unknown'}</span>
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  <Link href={`/services/${provider.provider_id}`}><Button variant="outline">View Profile</Button></Link>
                  <Link href={`/dashboard/customer/book/${provider.provider_id}`}><Button className="gradient-primary text-white">Book Now</Button></Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  )
}