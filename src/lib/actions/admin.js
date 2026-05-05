'use server'

import { revalidatePath } from 'next/cache'
import { createAdminClient } from '@/lib/supabase/server'
import { getCurrentUser } from './auth'

async function requireAdmin() {
  const user = await getCurrentUser()
  const role = user?.profile?.role || user?.user_metadata?.role

  if (!user || role !== 'admin') {
    throw new Error('Admin access required')
  }

  return user
}

function safeCount(result) {
  return typeof result?.count === 'number' ? result.count : 0
}

export async function getAdminOverviewData() {
  const supabase = createAdminClient()

  const [
    usersCount,
    customersCount,
    providersCount,
    verifiedProvidersCount,
    pendingProvidersCount,
    bookingsCount,
    pendingBookingsCount,
    completedBookingsCount,
    categoriesCount,
    listingsCount,
    recentUsersResult,
    pendingProvidersResult,
    recentBookingsResult,
  ] = await Promise.all([
    supabase.from('users').select('user_id', { count: 'exact', head: true }),
    supabase.from('customers').select('customer_id', { count: 'exact', head: true }),
    supabase.from('service_providers').select('provider_id', { count: 'exact', head: true }),
    supabase.from('service_providers').select('provider_id', { count: 'exact', head: true }).eq('is_verified', true),
    supabase.from('service_providers').select('provider_id', { count: 'exact', head: true }).eq('is_verified', false),
    supabase.from('bookings').select('booking_id', { count: 'exact', head: true }),
    supabase.from('bookings').select('booking_id', { count: 'exact', head: true }).eq('status', 'pending'),
    supabase.from('bookings').select('booking_id', { count: 'exact', head: true }).eq('status', 'completed'),
    supabase.from('service_categories').select('category_id', { count: 'exact', head: true }),
    supabase.from('service_listings').select('listing_id', { count: 'exact', head: true }),
    supabase
      .from('users')
      .select('user_id, email, name, phone, role, created_at')
      .order('created_at', { ascending: false })
      .limit(6),
    supabase
      .from('service_providers')
      .select(`
        provider_id,
        user_id,
        skills,
        availability,
        rating,
        total_reviews,
        is_verified,
        created_at,
        users (
          user_id,
          name,
          email,
          phone,
          role
        )
      `)
      .eq('is_verified', false)
      .order('created_at', { ascending: false })
      .limit(5),
    supabase
      .from('bookings')
      .select(`
        booking_id,
        status,
        service_date,
        description,
        created_at,
        customers (
          customer_id,
          users (
            name,
            email,
            phone
          )
        ),
        service_providers (
          provider_id,
          users (
            name,
            email,
            phone
          )
        ),
        service_listings (
          title,
          price
        )
      `)
      .order('created_at', { ascending: false })
      .limit(6),
  ])

  return {
    stats: {
      users: safeCount(usersCount),
      customers: safeCount(customersCount),
      providers: safeCount(providersCount),
      verifiedProviders: safeCount(verifiedProvidersCount),
      pendingProviders: safeCount(pendingProvidersCount),
      bookings: safeCount(bookingsCount),
      pendingBookings: safeCount(pendingBookingsCount),
      completedBookings: safeCount(completedBookingsCount),
      categories: safeCount(categoriesCount),
      listings: safeCount(listingsCount),
    },
    recentUsers: recentUsersResult.data || [],
    pendingProviders: pendingProvidersResult.data || [],
    recentBookings: recentBookingsResult.data || [],
  }
}

export async function getAdminUsers() {
  const supabase = createAdminClient()
  const { data, error } = await supabase
    .from('users')
    .select('user_id, email, name, phone, role, created_at')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching admin users:', error)
    return []
  }

  return data || []
}

export async function getAdminProviders() {
  const supabase = createAdminClient()
  const { data, error } = await supabase
    .from('service_providers')
    .select(`
      provider_id,
      user_id,
      skills,
      availability,
      rating,
      total_reviews,
      is_verified,
      created_at,
      users (
        user_id,
        name,
        email,
        phone,
        role
      )
    `)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching admin providers:', error)
    return []
  }

  return data || []
}

export async function getAdminBookings() {
  const supabase = createAdminClient()
  const { data, error } = await supabase
    .from('bookings')
    .select(`
      booking_id,
      status,
      service_date,
      description,
      notes,
      created_at,
      customers (
        customer_id,
        users (
          name,
          email,
          phone
        )
      ),
      service_providers (
        provider_id,
        users (
          name,
          email,
          phone
        )
      ),
      service_listings (
        title,
        price
      )
    `)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching admin bookings:', error)
    return []
  }

  return data || []
}

export async function getAdminCatalog() {
  const supabase = createAdminClient()

  const [categoriesResult, listingsResult] = await Promise.all([
    supabase
      .from('service_categories')
      .select('category_id, category_name, icon_url, created_at')
      .order('category_name', { ascending: true }),
    supabase
      .from('service_listings')
      .select(`
        listing_id,
        title,
        description,
        price,
        created_at,
        service_categories (
          category_id,
          category_name
        ),
        service_providers (
          provider_id,
          users (
            name,
            email
          )
        )
      `)
      .order('created_at', { ascending: false })
      .limit(12),
  ])

  return {
    categories: categoriesResult.data || [],
    listings: listingsResult.data || [],
  }
}

export async function updateUserRole(formData) {
  try {
    await requireAdmin()
    const supabase = createAdminClient()

    const userId = formData.get('user_id')
    const role = formData.get('role')

    const { error } = await supabase
      .from('users')
      .update({ role })
      .eq('user_id', userId)

    if (error) {
      return { error: error.message }
    }

    revalidatePath('/dashboard/admin')
    revalidatePath('/dashboard/admin/users')
    return { success: true }
  } catch (error) {
    return { error: error instanceof Error ? error.message : 'Failed to update user role' }
  }
}

export async function toggleProviderVerification(formData) {
  try {
    await requireAdmin()
    const supabase = createAdminClient()

    const providerId = formData.get('provider_id')
    const isVerified = formData.get('is_verified') === 'true'

    const { error } = await supabase
      .from('service_providers')
      .update({ is_verified: isVerified })
      .eq('provider_id', providerId)

    if (error) {
      return { error: error.message }
    }

    revalidatePath('/dashboard/admin')
    revalidatePath('/dashboard/admin/providers')
    return { success: true }
  } catch (error) {
    return { error: error instanceof Error ? error.message : 'Failed to update provider verification' }
  }
}

export async function updateBookingStatusAdmin(formData) {
  try {
    await requireAdmin()
    const supabase = createAdminClient()

    const bookingId = formData.get('booking_id')
    const status = formData.get('status')

    const { error } = await supabase
      .from('bookings')
      .update({ status })
      .eq('booking_id', bookingId)

    if (error) {
      return { error: error.message }
    }

    revalidatePath('/dashboard/admin')
    revalidatePath('/dashboard/admin/bookings')
    return { success: true }
  } catch (error) {
    return { error: error instanceof Error ? error.message : 'Failed to update booking status' }
  }
}

export async function createServiceCategory(formData) {
  try {
    await requireAdmin()
    const supabase = createAdminClient()

    const categoryName = formData.get('category_name')
    const iconUrl = formData.get('icon_url')

    const { error } = await supabase
      .from('service_categories')
      .insert({
        category_name: categoryName,
        icon_url: iconUrl || null,
      })

    if (error) {
      return { error: error.message }
    }

    revalidatePath('/dashboard/admin')
    revalidatePath('/dashboard/admin/services')
    return { success: true }
  } catch (error) {
    return { error: error instanceof Error ? error.message : 'Failed to create service category' }
  }
}