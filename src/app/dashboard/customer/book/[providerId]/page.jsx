import Link from 'next/link'
import { notFound, redirect } from 'next/navigation'
import { getCurrentUser } from '@/lib/actions/auth'
import { createBooking } from '@/lib/actions/bookings'
import { getProviderById } from '@/lib/actions/services'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

export default async function CustomerBookProviderPage({ params }) {
  const user = await getCurrentUser()

  if (!user) {
    redirect('/login')
  }

  const { providerId } = await params
  const provider = await getProviderById(providerId)

  if (!provider) {
    notFound()
  }

  const listings = provider.service_listings || []

  return (
    <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
      <Card>
        <CardHeader>
          <CardTitle>Book {provider.users?.name || 'Provider'}</CardTitle>
          <CardDescription>Select a service listing and schedule your request.</CardDescription>
        </CardHeader>
        <CardContent>
          <form action={createBooking} className="space-y-4">
            <input type="hidden" name="provider_id" value={provider.provider_id} />

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Service Listing</label>
              <select
                name="listing_id"
                required
                className="h-11 w-full rounded-md border border-slate-200 bg-white px-3 text-sm outline-none focus:border-slate-400"
              >
                <option value="">Choose a service</option>
                {listings.length > 0 ? (
                  listings.map((listing) => (
                    <option key={listing.listing_id} value={listing.listing_id}>
                      {listing.title} - PKR {Number(listing.price || 0).toLocaleString()}
                    </option>
                  ))
                ) : (
                  <option value="" disabled>No service listings available</option>
                )}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Service Date</label>
              <input
                type="date"
                name="service_date"
                required
                className="h-11 w-full rounded-md border border-slate-200 bg-white px-3 text-sm outline-none focus:border-slate-400"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Preferred Time</label>
              <input
                type="time"
                name="service_time"
                required
                className="h-11 w-full rounded-md border border-slate-200 bg-white px-3 text-sm outline-none focus:border-slate-400"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Service Location</label>
              <input
                name="service_location"
                required
                placeholder="Street, area, and landmark"
                className="h-11 w-full rounded-md border border-slate-200 bg-white px-3 text-sm outline-none focus:border-slate-400"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Description</label>
              <textarea
                name="description"
                rows={4}
                required
                placeholder="Describe the work you need done"
                className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-slate-400"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Notes</label>
              <textarea
                name="notes"
                rows={3}
                placeholder="Optional instructions or access notes"
                className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-slate-400"
              />
            </div>

            <Button type="submit" className="gradient-primary text-white">Confirm Booking</Button>
          </form>
        </CardContent>
      </Card>

      <Card className="h-fit">
        <CardHeader>
          <CardTitle>Provider Summary</CardTitle>
          <CardDescription>Review the provider before booking.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="text-lg font-semibold text-slate-900">{provider.users?.name || 'Provider'}</p>
            <p className="text-sm text-slate-500">{provider.users?.email}</p>
          </div>
          <p className="text-sm text-slate-600">{provider.skills || 'No skills description available.'}</p>
          <div className="flex flex-wrap gap-2">
            <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200">Verified</Badge>
            <Badge variant="outline">Rating {Number(provider.rating || 0).toFixed(1)}</Badge>
            <Badge variant="outline">{provider.total_reviews || 0} reviews</Badge>
          </div>
          <div className="pt-2">
            <Link href={`/services/${provider.provider_id}`} className="text-sm font-semibold text-emerald-700 hover:text-emerald-800">View full provider profile</Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}