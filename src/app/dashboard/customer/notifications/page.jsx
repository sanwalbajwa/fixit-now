import Link from 'next/link'
import { redirect } from 'next/navigation'
import {
  Bell, CheckCircle2, AlertTriangle, XCircle,
  Info, ExternalLink, Clock,
} from 'lucide-react'
import { getCurrentUser } from '@/lib/actions/auth'
import { getMyNotifications } from '@/lib/actions/notifications'

/* ─── helpers ──────────────────────────────────────────────── */

const TONE = {
  success: {
    bg:     'bg-emerald-50',
    border: 'border-emerald-200',
    icon:   <CheckCircle2 className="size-5 text-emerald-500" />,
    pill:   'bg-emerald-100 text-emerald-700',
    label:  'Success',
  },
  warning: {
    bg:     'bg-amber-50',
    border: 'border-amber-200',
    icon:   <AlertTriangle className="size-5 text-amber-500" />,
    pill:   'bg-amber-100 text-amber-700',
    label:  'Warning',
  },
  danger: {
    bg:     'bg-rose-50',
    border: 'border-rose-200',
    icon:   <XCircle className="size-5 text-rose-500" />,
    pill:   'bg-rose-100 text-rose-700',
    label:  'Alert',
  },
  info: {
    bg:     'bg-sky-50',
    border: 'border-sky-200',
    icon:   <Info className="size-5 text-sky-500" />,
    pill:   'bg-sky-100 text-sky-700',
    label:  'Info',
  },
}

function getT(tone) {
  return TONE[tone] || TONE.info
}

function relativeTime(date) {
  const diff = Date.now() - new Date(date).getTime()
  const mins  = Math.floor(diff / 60_000)
  const hours = Math.floor(diff / 3_600_000)
  const days  = Math.floor(diff / 86_400_000)
  if (mins  < 1)  return 'just now'
  if (mins  < 60) return `${mins}m ago`
  if (hours < 24) return `${hours}h ago`
  if (days  < 7)  return `${days}d ago`
  return new Date(date).toLocaleDateString('en', { month: 'short', day: 'numeric' })
}

/* ─── page ──────────────────────────────────────────────────── */
export default async function CustomerNotificationsPage() {
  const user = await getCurrentUser()
  if (!user) redirect('/login')

  const notifications = await getMyNotifications(20)
  const unread = notifications.filter((n) => !n.read_at).length

  return (
    <div className="space-y-6">

      {/* ── Header ───────────────────────────────────────────── */}
      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Notifications</h1>
          <p className="text-sm text-slate-500">
            {unread > 0
              ? `${unread} unread · ${notifications.length} total`
              : `${notifications.length} notification${notifications.length !== 1 ? 's' : ''}`}
          </p>
        </div>
        {unread > 0 && (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
            <Bell className="size-3.5" />
            {unread} new
          </span>
        )}
      </div>

      {/* ── Empty state ───────────────────────────────────────── */}
      {notifications.length === 0 && (
        <div className="flex flex-col items-center justify-center gap-4 rounded-2xl border-2 border-dashed border-slate-200 bg-white py-20 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
            <Bell className="size-8" />
          </div>
          <div>
            <p className="font-semibold text-slate-700">No notifications yet</p>
            <p className="text-sm text-slate-500 mt-1">
              Activity on your bookings will appear here.
            </p>
          </div>
        </div>
      )}

      {/* ── Notification list ─────────────────────────────────── */}
      {notifications.length > 0 && (
        <div className="space-y-3">
          {notifications.map((item) => {
            const t = getT(item.tone)
            return (
              <div
                key={item.id}
                className={`flex gap-4 rounded-2xl border-2 p-4 transition-shadow hover:shadow-sm ${t.bg} ${t.border}`}
              >
                {/* icon */}
                <div className="mt-0.5 shrink-0">{t.icon}</div>

                {/* content */}
                <div className="flex-1 min-w-0 space-y-1">
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <p className="font-semibold text-slate-900 leading-snug">{item.title}</p>
                    <span className={`rounded-full px-2 py-0.5 text-xs font-medium shrink-0 ${t.pill}`}>
                      {t.label}
                    </span>
                  </div>
                  <p className="text-sm text-slate-600">{item.description}</p>
                  <div className="flex items-center justify-between gap-3 pt-1">
                    <span className="flex items-center gap-1 text-xs text-slate-400">
                      <Clock className="size-3" />
                      {relativeTime(item.created_at)}
                    </span>
                    {item.href && (
                      <Link
                        href={item.href}
                        className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 hover:text-emerald-800"
                      >
                        View <ExternalLink className="size-3" />
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
