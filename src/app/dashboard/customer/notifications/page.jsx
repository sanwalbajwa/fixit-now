import Link from 'next/link'
import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/lib/actions/auth'
import { getMyNotifications } from '@/lib/actions/notifications'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

function toneClass(tone) {
  if (tone === 'success') return 'bg-emerald-100 text-emerald-700 border-emerald-200'
  if (tone === 'warning') return 'bg-amber-100 text-amber-700 border-amber-200'
  if (tone === 'danger') return 'bg-rose-100 text-rose-700 border-rose-200'
  return 'bg-sky-100 text-sky-700 border-sky-200'
}

export default async function CustomerNotificationsPage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect('/login')
  }

  const notifications = await getMyNotifications(20)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Notifications</CardTitle>
        <CardDescription>Booking and account activity for your customer workspace.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {notifications.length === 0 ? (
          <p className="text-sm text-slate-500">No notifications yet.</p>
        ) : (
          notifications.map((item) => (
            <div key={item.id} className="rounded-xl border p-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-semibold text-slate-900">{item.title}</p>
                  <p className="text-sm text-slate-600">{item.description}</p>
                </div>
                <Badge className={toneClass(item.tone)}>{item.tone}</Badge>
              </div>
              <div className="mt-3 text-sm text-slate-500 flex items-center justify-between gap-3">
                <span>{new Date(item.created_at).toLocaleString()}</span>
                <Link href={item.href} className="font-semibold text-emerald-700 hover:text-emerald-800">Open</Link>
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  )
}
