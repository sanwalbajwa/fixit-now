'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { SendHorizontal } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { getChatMessages, sendMessage } from '@/lib/actions/chat'
import { Button } from '@/components/ui/button'

function bubbleTime(value) {
  const parsed = value ? new Date(value) : null
  if (!parsed || Number.isNaN(parsed.getTime())) {
    return ''
  }

  return parsed.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

function loadCachedMessages(bookingId) {
  if (typeof window === 'undefined') return []
  try {
    const raw = window.localStorage.getItem(`fixitnow_msgs_${bookingId}`)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function saveCachedMessages(bookingId, messages) {
  if (typeof window === 'undefined') return
  try {
    // Cache all confirmed messages (not optimistic)
    const toCache = messages.filter((m) => !m.__optimistic)
    if (toCache.length > 0) {
      window.localStorage.setItem(`fixitnow_msgs_${bookingId}`, JSON.stringify(toCache))
      // Also update the last sync timestamp
      window.localStorage.setItem(`fixitnow_msgs_sync_${bookingId}`, new Date().toISOString())
    }
  } catch {
    // Ignore storage errors
  }
}

export default function ChatBox({ bookingId, currentUserId, otherUserId, otherUserName = 'User' }) {
  const [messages, setMessages] = useState(() => loadCachedMessages(bookingId))
  const [newMessage, setNewMessage] = useState('')
  const [isSending, setIsSending] = useState(false)
  const messagesEndRef = useRef(null)
  const supabase = useMemo(() => createClient(), [])

  // Persist confirmed messages to localStorage whenever they change
  useEffect(() => {
    saveCachedMessages(bookingId, messages)
  }, [bookingId, messages])

  useEffect(() => {
    let isMounted = true

    // Reset to cached messages for the new bookingId before the fetch lands
    const cachedMsgs = loadCachedMessages(bookingId)
    setMessages(cachedMsgs)

    getChatMessages(bookingId).then((initialMessages) => {
      if (!isMounted) return
      // Merge cached and fetched messages, keeping all and removing duplicates
      const messageMap = new Map()

      // Add cached messages first
      cachedMsgs.forEach((msg) => messageMap.set(msg.message_id, msg))

      // Add/update with fetched messages
      if (initialMessages && Array.isArray(initialMessages)) {
        initialMessages.forEach((msg) => messageMap.set(msg.message_id, msg))
      }

      // Sort by timestamp
      const merged = Array.from(messageMap.values()).sort((a, b) => {
        const aTime = new Date(a.timestamp || a.created_at).getTime()
        const bTime = new Date(b.timestamp || b.created_at).getTime()
        return aTime - bTime
      })

      setMessages(merged)
    })

    const channel = supabase
      .channel(`chat_room_${bookingId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'chat_messages',
          filter: `booking_id=eq.${bookingId}`,
        },
        (payload) => {
          setMessages((prev) => {
            const withoutOptimisticMatch = prev.filter(
              (message) => !(message.__optimistic && message.sender_id === payload.new.sender_id && message.message === payload.new.message)
            )

            if (withoutOptimisticMatch.some((message) => message.message_id === payload.new.message_id)) {
              return withoutOptimisticMatch
            }

            return [...withoutOptimisticMatch, payload.new]
          })
        }
      )
      .subscribe()

    return () => {
      isMounted = false
      supabase.removeChannel(channel)
    }
  }, [bookingId, supabase])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSend = async (e) => {
    e.preventDefault()
    if (!newMessage.trim() || isSending) return

    const msg = newMessage.trim()
    setNewMessage('')
    setIsSending(true)

    const optimisticMessage = {
      message_id: `temp-${Date.now()}`,
      booking_id: bookingId,
      sender_id: currentUserId,
      receiver_id: otherUserId,
      message: msg,
      timestamp: new Date().toISOString(),
      __optimistic: true,
    }

    setMessages((prev) => [...prev, optimisticMessage])

    try {
      await sendMessage(bookingId, otherUserId, msg)
    } catch (err) {
      console.error(err)
      setMessages((prev) => prev.filter((message) => message.message_id !== optimisticMessage.message_id))
      alert('Failed to send message')
    } finally {
      setIsSending(false)
    }
  }

  return (
    <div className="flex h-[70vh] flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-lg">
      <div className="border-b border-slate-100 bg-gradient-to-r from-emerald-600 to-teal-700 px-5 py-4 text-white">
        <p className="text-sm font-semibold">{otherUserName}</p>
        <p className="text-xs text-emerald-100">Live booking chat</p>
      </div>

      <div className="flex-1 space-y-4 overflow-y-auto bg-slate-50/70 p-4">
        {messages.map(msg => {
          const isMe = msg.sender_id === currentUserId
          return (
            <div key={msg.message_id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[78%] rounded-2xl p-3 ${isMe ? 'rounded-br-sm bg-emerald-600 text-white shadow-md shadow-emerald-600/20' : 'rounded-bl-sm border border-slate-200 bg-white text-slate-800 shadow-sm'}`}>
                <p className="text-sm">{msg.message}</p>
                {bubbleTime(msg.timestamp || msg.created_at) && (
                  <span className={`mt-1 block text-[10px] ${isMe ? 'text-emerald-100' : 'text-slate-400'}`}>
                    {bubbleTime(msg.timestamp || msg.created_at)}
                  </span>
                )}
              </div>
            </div>
          )
        })}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSend} className="flex gap-2 border-t border-slate-100 bg-white p-4">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type your message..."
          className="h-11 flex-1 rounded-full border border-slate-300 px-5 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
        />
        <Button type="submit" disabled={isSending} className="h-11 rounded-full bg-slate-900 px-5 text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60">
          <SendHorizontal className="mr-1 size-4" />
          Send
        </Button>
      </form>
    </div>
  )
}
