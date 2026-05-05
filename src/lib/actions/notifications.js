'use server'

import { getCurrentUser } from './auth'
import { createAdminClient, createClient } from '@/lib/supabase/server'

function toIso(value) {
  return value ? new Date(value).toISOString() : new Date(0).toISOString()
}

function byNewest(a, b) {
  return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
}

export async function getMyNotifications(limit = 12) {
  const user = await getCurrentUser()
  const role = user?.profile?.role || user?.user_metadata?.role

  if (!user || !role) {
    return []
  }

  if (role === 'customer') {
    const supabase = await createClient()
    const { data: customer } = await supabase
      .from('customers')
      .select('customer_id')
      .eq('user_id', user.id)
      .single()

    if (!customer) return []

    const { data: bookings } = await supabase
      .from('bookings')
      .select(`
        booking_id,
        status,
        created_at,
        updated_at,
        service_listings (title)
      `)
      .eq('customer_id', customer.customer_id)
      .order('updated_at', { ascending: false })
      .limit(limit)

    return (bookings || []).map((booking) => ({
      id: `booking-${booking.booking_id}`,
      title: `Booking ${booking.status}`,
      description: `${booking.service_listings?.title || 'Service request'} is now ${booking.status}.`,
      href: '/dashboard/customer/bookings',
      created_at: toIso(booking.updated_at || booking.created_at),
      tone: booking.status === 'completed' ? 'success' : booking.status === 'cancelled' ? 'danger' : 'info',
    }))
  }

  if (role === 'provider') {
    const supabase = createAdminClient()
    const { data: provider } = await supabase
      .from('service_providers')
      .select('provider_id, is_verified, created_at')
      .eq('user_id', user.id)
      .single()

    if (!provider) return []

    const { data: bookings } = await supabase
      .from('bookings')
      .select(`
        booking_id,
        status,
        created_at,
        updated_at,
        service_listings (title),
        customers (
          users (name, email)
        )
      `)
      .eq('provider_id', provider.provider_id)
      .order('updated_at', { ascending: false })
      .limit(limit)

    const bookingNotifications = (bookings || []).map((booking) => ({
      id: `provider-booking-${booking.booking_id}`,
      title: `Request ${booking.status}`,
      description: `${booking.customers?.users?.name || booking.customers?.users?.email || 'A customer'}: ${booking.service_listings?.title || 'Service request'}`,
      href: '/dashboard/provider/bookings',
      created_at: toIso(booking.updated_at || booking.created_at),
      tone: booking.status === 'pending' ? 'warning' : booking.status === 'completed' ? 'success' : 'info',
    }))

    const verificationNotification = {
      id: 'provider-verification',
      title: provider.is_verified ? 'Profile verified' : 'Verification pending',
      description: provider.is_verified
        ? 'Your provider profile is verified and visible to customers.'
        : 'Your provider profile is waiting for admin approval.',
      href: '/dashboard/provider/profile',
      created_at: toIso(provider.created_at),
      tone: provider.is_verified ? 'success' : 'warning',
    }

    return [verificationNotification, ...bookingNotifications]
      .sort(byNewest)
      .slice(0, limit)
  }

  if (role === 'admin') {
    const supabase = createAdminClient()
    const [pendingProviders, pendingBookings, recentUsers] = await Promise.all([
      supabase
        .from('service_providers')
        .select('provider_id, created_at, users(name, email)')
        .eq('is_verified', false)
        .order('created_at', { ascending: false })
        .limit(6),
      supabase
        .from('bookings')
        .select('booking_id, status, created_at, service_listings(title)')
        .eq('status', 'pending')
        .order('created_at', { ascending: false })
        .limit(6),
      supabase
        .from('users')
        .select('user_id, role, created_at, name, email')
        .order('created_at', { ascending: false })
        .limit(6),
    ])

    const providerNotifications = (pendingProviders.data || []).map((provider) => ({
      id: `admin-provider-${provider.provider_id}`,
      title: 'Provider pending verification',
      description: `${provider.users?.name || provider.users?.email || 'Provider'} requires review.`,
      href: '/dashboard/admin/providers',
      created_at: toIso(provider.created_at),
      tone: 'warning',
    }))

    const bookingNotifications = (pendingBookings.data || []).map((booking) => ({
      id: `admin-booking-${booking.booking_id}`,
      title: 'Pending booking in queue',
      description: `${booking.service_listings?.title || 'Service booking'} needs moderation attention.`,
      href: '/dashboard/admin/bookings',
      created_at: toIso(booking.created_at),
      tone: 'info',
    }))

    const userNotifications = (recentUsers.data || []).map((newUser) => ({
      id: `admin-user-${newUser.user_id}`,
      title: 'New account created',
      description: `${newUser.name || newUser.email} joined as ${newUser.role || 'user'}.`,
      href: '/dashboard/admin/users',
      created_at: toIso(newUser.created_at),
      tone: 'success',
    }))

    return [...providerNotifications, ...bookingNotifications, ...userNotifications]
      .sort(byNewest)
      .slice(0, limit)
  }

  return []
}
