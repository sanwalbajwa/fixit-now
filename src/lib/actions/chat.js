'use server'

import { createAdminClient } from '@/lib/supabase/server'
import { getCurrentUser } from './auth'

async function getCurrentChatContext(bookingId) {
  const supabase = createAdminClient()
  const user = await getCurrentUser()

  if (!user) {
    return { user: null, booking: null, supabase }
  }

  const role = user.profile?.role || user.user_metadata?.role

  const { data: booking } = await supabase
    .from('bookings')
    .select(`
      booking_id,
      provider_id,
      customer_id,
      customers(customer_id, user_id, users(name, email, profile_image_url)),
      service_providers(provider_id, user_id, users(name, email, profile_image_url))
    `)
    .eq('booking_id', bookingId)
    .maybeSingle()

  if (!booking) {
    return { user, booking: null, supabase }
  }

  const customerRecord = Array.isArray(booking.customers) ? booking.customers[0] || null : booking.customers
  const providerRecord = Array.isArray(booking.service_providers) ? booking.service_providers[0] || null : booking.service_providers
  const isCustomer = customerRecord?.user_id === user.id
  const isProvider = providerRecord?.user_id === user.id || booking.provider_id === user.id

  if (!isCustomer && !isProvider && role !== 'admin') {
    return { user, booking: null, supabase }
  }

  return { user, booking, supabase }
}

function pickRecord(value) {
  if (Array.isArray(value)) return value[0] || null
  return value || null
}

function buildThreadTitle(booking) {
  return booking.service_listings?.title || 'Chat'
}

function buildCounterpart(role, booking) {
  if (role === 'provider') {
    const customerRecord = pickRecord(booking.customers)
    const customerUser = pickRecord(customerRecord?.users)

    return {
      id: customerRecord?.user_id || null,
      name: customerUser?.name || customerUser?.email || 'Customer',
      avatar: customerUser?.profile_image_url || null,
    }
  }

  const providerRecord = pickRecord(booking.service_providers)
  const providerUser = pickRecord(providerRecord?.users)

  return {
    id: providerRecord?.user_id || null,
    name: providerUser?.name || providerUser?.email || 'Provider',
    avatar: providerUser?.profile_image_url || null,
  }
}

export async function getMyChatThreads() {
  const supabase = createAdminClient()
  const user = await getCurrentUser()

  if (!user) return []

  const role = user.profile?.role || user.user_metadata?.role

  let query = supabase
    .from('bookings')
    .select(`
      booking_id,
      status,
      created_at,
      service_listings (
        title
      ),
      customers (
        customer_id,
        user_id,
        users (
          name,
          email,
          profile_image_url
        )
      ),
      service_providers (
        provider_id,
        user_id,
        users (
          name,
          email,
          profile_image_url
        )
      )
    `)
    .neq('status', 'cancelled')
    .order('created_at', { ascending: false })

  if (role === 'customer') {
    const { data: customer } = await supabase
      .from('customers')
      .select('customer_id')
      .eq('user_id', user.id)
      .maybeSingle()

    if (!customer) return []

    query = query.eq('customer_id', customer.customer_id)
  } else if (role === 'provider') {
    const { data: provider } = await supabase
      .from('service_providers')
      .select('provider_id')
      .eq('user_id', user.id)
      .maybeSingle()

    if (!provider) return []

    query = query.eq('provider_id', provider.provider_id)
  } else {
    return []
  }

  const { data: bookings, error } = await query

  if (error || !bookings?.length) return []

  const bookingIds = bookings.map((booking) => booking.booking_id)
  const { data: messages } = await supabase
    .from('chat_messages')
    .select('message_id, booking_id, sender_id, receiver_id, message, timestamp')
    .in('booking_id', bookingIds)
    .order('timestamp', { ascending: true })

  const latestByBookingId = new Map()
  for (const message of messages || []) {
    latestByBookingId.set(message.booking_id, message)
  }

  return bookings.map((booking) => {
    const counterpart = buildCounterpart(role, booking)
    const latestMessage = latestByBookingId.get(booking.booking_id) || null

    return {
      bookingId: booking.booking_id,
      title: buildThreadTitle(booking),
      href: `/dashboard/chat/${booking.booking_id}`,
      status: booking.status,
      counterpart,
      latestMessage: latestMessage?.message || null,
      latestMessageAt: latestMessage?.timestamp || booking.created_at,
    }
  })
}

export async function getChatMessages(bookingId) {
  const { booking, supabase } = await getCurrentChatContext(bookingId)

  if (!booking) return []

  const { data } = await supabase
    .from('chat_messages')
    .select('*')
    .eq('booking_id', bookingId)
    .order('timestamp', { ascending: true })
    
  return data || []
}

export async function sendMessage(bookingId, receiverId, message) {
  const { user, booking, supabase } = await getCurrentChatContext(bookingId)
  
  if (!user) throw new Error('Unauthorized')
  if (!booking) throw new Error('Booking not found')
  
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
