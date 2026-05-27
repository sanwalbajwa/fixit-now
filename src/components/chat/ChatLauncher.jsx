'use client'

import { useEffect, useMemo, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { MessageCircle, X } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

function initials(name = '') {
  return name
    .split(' ')
    .slice(0, 2)
    .map((word) => word[0]?.toUpperCase() || '')
    .join('') || 'U'
}

function formatTime(value) {
  if (!value) return ''
  return new Intl.DateTimeFormat('en', {
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(value))
}

export default function ChatLauncher({ initialThreads = [] }) {
  const [open, setOpen] = useState(false)
  const [threads, setThreads] = useState(initialThreads)
  const router = useRouter()
  const pathname = usePathname()

  const supabase = useMemo(() => createClient(), [])

  useEffect(() => {
    setThreads(initialThreads)
  }, [initialThreads])

  useEffect(() => {
    const channel = supabase
      .channel('dashboard_chat_launcher')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'chat_messages',
        },
        () => {
          router.refresh()
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [router, supabase])

  useEffect(() => {
    setOpen(false)
  }, [pathname])

  const sortedThreads = useMemo(() => {
    return [...threads].sort((left, right) => new Date(right.latestMessageAt || 0) - new Date(left.latestMessageAt || 0))
  }, [threads])

  return (
    <div className="fixed bottom-5 right-5 z-50">
      {open && (
        <div className="mb-3 w-[340px] overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl shadow-slate-900/10">
          <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
            <div>
              <p className="text-sm font-semibold text-slate-900">Chats</p>
              <p className="text-xs text-slate-500">Select a booking conversation</p>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="inline-flex h-8 w-8 items-center justify-center rounded-full text-slate-500 hover:bg-slate-100 hover:text-slate-800"
            >
              <X className="size-4" />
            </button>
          </div>

          <div className="max-h-[420px] overflow-y-auto">
            {sortedThreads.length === 0 ? (
              <div className="px-4 py-8 text-center">
                <p className="text-sm font-medium text-slate-700">No chats yet</p>
                <p className="mt-1 text-xs text-slate-500">When someone messages you, it will appear here.</p>
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {sortedThreads.map((thread) => (
                  <button
                    key={thread.bookingId}
                    type="button"
                    onClick={() => router.push(thread.href)}
                    className="flex w-full items-center gap-3 px-4 py-3 text-left hover:bg-slate-50"
                  >
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-700 text-sm font-bold text-white">
                      {thread.counterpart?.avatar ? (
                        <img
                          src={thread.counterpart.avatar}
                          alt={thread.counterpart?.name || 'Chat'}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <span>{initials(thread.counterpart?.name)}</span>
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <p className="truncate text-sm font-semibold text-slate-900">
                          {thread.counterpart?.name || 'Chat'}
                        </p>
                        <span className="shrink-0 text-[11px] text-slate-400">{formatTime(thread.latestMessageAt)}</span>
                      </div>
                      <p className="truncate text-xs text-slate-500">{thread.title}</p>
                      <p className="mt-0.5 truncate text-xs text-slate-600">
                        {thread.latestMessage || 'No messages yet'}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-600 text-white shadow-lg shadow-emerald-600/25 hover:bg-emerald-700 hover:scale-105 transition-all"
        aria-label="Open chats"
      >
        <MessageCircle className="size-6" />
      </button>
    </div>
  )
}