'use client'

import { useState, useEffect, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import { getChatMessages, sendMessage } from '@/lib/actions/chat'
import { Button } from '@/components/ui/button'

export default function ChatBox({ bookingId, currentUserId, otherUserId }) {
  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState('')
  const supabase = createClient()
  const messagesEndRef = useRef(null)

  useEffect(() => {
    // Load initial messages
    getChatMessages(bookingId).then(setMessages)

    // Subscribe to realtime
    const channel = supabase
      .channel('chat_room')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'chat_messages',
        filter: `booking_id=eq.${bookingId}`
      }, (payload) => {
        setMessages(prev => [...prev, payload.new])
      })
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [bookingId, supabase])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSend = async (e) => {
    e.preventDefault()
    if (!newMessage.trim()) return
    
    const msg = newMessage
    setNewMessage('')
    try {
      await sendMessage(bookingId, otherUserId, msg)
    } catch (err) {
      console.error(err)
      alert('Failed to send message')
    }
  }

  return (
    <div className="flex flex-col h-[600px] border rounded-xl overflow-hidden bg-white shadow-sm">
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50">
        {messages.map(msg => {
          const isMe = msg.sender_id === currentUserId
          return (
            <div key={msg.message_id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[70%] p-3 rounded-2xl ${isMe ? 'bg-emerald-600 text-white rounded-br-sm shadow-md' : 'bg-white border text-slate-800 rounded-bl-sm shadow-sm'}`}>
                <p className="text-sm">{msg.message}</p>
                <span className={`text-[10px] mt-1 block ${isMe ? 'text-emerald-100' : 'text-slate-400'}`}>
                  {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>
          )
        })}
        <div ref={messagesEndRef} />
      </div>
      <form onSubmit={handleSend} className="p-4 border-t bg-white flex gap-2">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type your message..."
          className="flex-1 rounded-full border border-slate-300 px-5 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
        />
        <Button type="submit" className="rounded-full px-6 bg-slate-900 hover:bg-slate-800 text-white transition-all">Send</Button>
      </form>
    </div>
  )
}
