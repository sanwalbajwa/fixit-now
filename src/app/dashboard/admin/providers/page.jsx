import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { getAdminProviders, toggleProviderVerification } from '@/lib/actions/admin'

export default async function AdminProvidersPage() {
  const providers = await getAdminProviders()

  return (
    <Card>
      <CardHeader>
        <CardTitle>Provider Verification</CardTitle>
        <CardDescription>Review provider profiles and mark them verified once approved.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {providers.length === 0 ? (
          <p className="text-sm text-slate-500">No providers found.</p>
        ) : (
          providers.map((provider) => (
            <div key={provider.provider_id} className="rounded-xl border p-4 space-y-4">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="font-semibold text-slate-900">{provider.users?.name || provider.users?.email}</p>
                  <p className="text-sm text-slate-500">{provider.users?.email}</p>
                  <p className="text-sm text-slate-500">{provider.skills || 'No skills listed'}</p>
                </div>
                <Badge className={provider.is_verified ? 'bg-emerald-100 text-emerald-700 border-emerald-200' : 'bg-amber-100 text-amber-700 border-amber-200'}>
                  {provider.is_verified ? 'Verified' : 'Pending'}
                </Badge>
              </div>

              <div className="flex gap-2 text-sm text-slate-600">
                <span>Rating: {provider.rating ?? 0}</span>
                <span>Reviews: {provider.total_reviews ?? 0}</span>
              </div>

              <form action={toggleProviderVerification} className="flex flex-wrap gap-2">
                <input type="hidden" name="provider_id" value={provider.provider_id} />
                <button type="submit" name="is_verified" value="true" className="inline-flex h-9 items-center justify-center rounded-md bg-emerald-600 px-3 text-sm font-medium text-white hover:bg-emerald-700">Mark Verified</button>
                <button type="submit" name="is_verified" value="false" className="inline-flex h-9 items-center justify-center rounded-md border px-3 text-sm font-medium text-slate-700 hover:bg-slate-50">Mark Pending</button>
              </form>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  )
}