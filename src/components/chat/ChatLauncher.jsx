'use client'

import { useEffect, useMemo, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { ArrowLeft, MessageCircle, X } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import ChatBox from '@/components/ChatBox'

function initials(name = '') {
  return name
    .split(' ')
    .slice(0, 2)
    .map((word) => word[0]?.toUpperCase() || '')
    .join('') || 'U'
}

function formatTime(value) {
  const parsed = value ? new Date(value) : null
  if (!parsed || Number.isNaN(parsed.getTime())) return ''

  return new Intl.DateTimeFormat('en', {
    hour: '2-digit',
    minute: '2-digit',
  }).format(parsed)
}

export default function ChatLauncher({ initialThreads = [], currentUserId }) {
  const storageKey = useMemo(() => `fixitnow_chat_threads_${currentUserId || 'guest'}`, [currentUserId])
  const selectedThreadKey = useMemo(() => `fixitnow_chat_selected_${currentUserId || 'guest'}`, [currentUserId])
  const [open, setOpen] = useState(false)
  const [threads, setThreads] = useState(() => {
    if (typeof window === 'undefined') return initialThreads

    try {
      const cachedThreads = window.localStorage.getItem(storageKey)
      if (cachedThreads) {
        const parsed = JSON.parse(cachedThreads)
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed
        }
      }
    } catch {
      // fall back to server threads
    }

    return initialThreads
  })
  const [selectedThread, setSelectedThread] = useState(() => {
    if (typeof window === 'undefined') return null

    try {
      const cachedSelectedThreadId = window.localStorage.getItem(selectedThreadKey)
      if (!cachedSelectedThreadId) return null
      return initialThreads.find((thread) => thread.bookingId === cachedSelectedThreadId) || null
    } catch {
      return null
    }
  })
  const [hydrated, setHydrated] = useState(false)
  const router = useRouter()
  const pathname = usePathname()

  const supabase = useMemo(() => createClient(), [])

  useEffect(() => {
    setHydrated(true)
  }, [])

  useEffect(() => {
    try {
      setThreads((currentThreads) => {
        const merged = new Map()
        for (const thread of currentThreads || []) merged.set(thread.bookingId, thread)
        for (const thread of initialThreads || []) merged.set(thread.bookingId, thread)
        return Array.from(merged.values())
      })
    } catch {
      // Ignore merge issues and keep current state.
    }
  }, [initialThreads])

  useEffect(() => {
    if (typeof window === 'undefined') return

    try {
      window.localStorage.setItem(storageKey, JSON.stringify(threads))
    } catch {
      // Ignore storage write errors.
    }
  }, [storageKey, threads])

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

  useEffect(() => {
    if (typeof window === 'undefined' || !selectedThread) return

    try {
      window.localStorage.setItem(selectedThreadKey, selectedThread.bookingId)
    } catch {
      // Ignore storage write errors.
    }
  }, [selectedThread, selectedThreadKey])

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end">
      {hydrated && (
      <div className={`mb-3 flex h-[78vh] w-[min(92vw,980px)] self-end flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl shadow-slate-900/10 lg:h-[74vh]${open ? '' : ' hidden'}`}>
          <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
            <div>
              <p className="text-sm font-semibold text-slate-900">
                {selectedThread ? selectedThread.counterpart?.name || 'Chat' : 'Chats'}
              </p>
              <p className="text-xs text-slate-500">
                {selectedThread ? selectedThread.title : 'Select a conversation'}
              </p>
            </div>
            <div className="flex items-center gap-2">
              {selectedThread && (
                <button
                  type="button"
                  onClick={() => setSelectedThread(null)}
                  className="inline-flex h-8 items-center gap-1.5 rounded-full border border-slate-200 px-3 text-xs font-medium text-slate-600 hover:bg-slate-50"
                >
                  <ArrowLeft className="size-3.5" />
                  Back
                </button>
              )}
              <button
                type="button"
                onClick={() => {
                  setOpen(false)
                }}
                className="inline-flex h-8 w-8 items-center justify-center rounded-full text-slate-500 hover:bg-slate-100 hover:text-slate-800"
              >
                <X className="size-4" />
              </button>
            </div>
          </div>

          <div className="grid flex-1 grid-cols-1 overflow-hidden lg:grid-cols-[320px_1fr]">
            <aside className={`border-b border-slate-100 bg-white lg:border-b-0 lg:border-r lg:border-slate-100 ${selectedThread ? 'hidden lg:block' : 'block'}`}>
              <div className="max-h-full overflow-y-auto">
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
                        onClick={() => setSelectedThread(thread)}
                        className={`flex w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-slate-50 ${selectedThread?.bookingId === thread.bookingId ? 'bg-emerald-50/70' : ''}`}
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
            </aside>

            <section className={`${selectedThread ? 'block' : 'hidden lg:block'} bg-slate-50/40`}>
              {selectedThread ? (
                <ChatBox
                  bookingId={selectedThread.bookingId}
                  currentUserId={currentUserId}
                  otherUserId={selectedThread.counterpart?.id}
                  otherUserName={selectedThread.counterpart?.name || 'User'}
                />
              ) : (
                <div className="flex h-full items-center justify-center px-6 py-10 text-center">
                  <div>
                    <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700">
                      <MessageCircle className="size-7" />
                    </div>
                    <p className="text-sm font-semibold text-slate-900">Open a conversation</p>
                    <p className="mt-1 max-w-sm text-xs text-slate-500">
                      Choose a chat from the list to continue the conversation here without leaving the popup.
                    </p>
                  </div>
                </div>
              )}
            </section>
          </div>
        </div>
      )}

      {hydrated && (
        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-600 text-white shadow-lg shadow-emerald-600/25 hover:bg-emerald-700 hover:scale-105 transition-all"
          aria-label="Open chats"
        >
          <MessageCircle className="size-6" />
        </button>
      )}
    </div>
  )
}