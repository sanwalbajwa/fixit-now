'use server'

import { createClient } from '@/lib/supabase/server'
import { getCurrentUser } from './auth'

export async function getChatMessages(bookingId) {
  const supabase = await createClient()
  const { data } = await supabase
    .from('chat_messages')
    .select('*')
    .eq('booking_id', bookingId)
    .order('timestamp', { ascending: true })
    
  return data || []
}

export async function sendMessage(bookingId, receiverId, message) {
  const supabase = await createClient()
  const user = await getCurrentUser()
  
  if (!user) throw new Error('Unauthorized')
  
  const { error } = await supabase
    .from('chat_messages')
    .insert({
      booking_id: bookingId,
      sender_id: user.id,
      receiver_id: receiverId,
      message: message
    })
    
  if (error) throw new Error('Failed to send message')
  return true
}
