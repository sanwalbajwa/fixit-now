'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createAdminClient } from '@/lib/supabase/server'
import { getCurrentUser, uploadProfileImage } from './auth'

async function requireProvider() {
  const user = await getCurrentUser()
  const role = user?.profile?.role || user?.user_metadata?.role

  if (!user || role !== 'provider') {
    throw new Error('Provider access required')
  }

  return user
}

async function getProviderRecord() {
  const user = await requireProvider()
  const supabase = createAdminClient()

  const { data: provider, error } = await supabase
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
    .eq('user_id', user.id)
    .single()

  if (error || !provider) {
    return { user, provider: null }
  }

  return { user, provider }
}

export async function getMyProviderProfile() {
  const { user, provider } = await getProviderRecord()

  return {
    user,
    provider,
  }
}

export async function getMyServiceListings() {
  const { provider } = await getProviderRecord()

  if (!provider) return []

  const supabase = createAdminClient()
  const { data, error } = await supabase
    .from('service_listings')
    .select(`
      listing_id,
      title,
      description,
      price,
      category_id,
      created_at,
      service_categories (
        category_id,
        category_name,
        icon_url
      )
    `)
    .eq('provider_id', provider.provider_id)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching provider listings:', error)
    return []
  }

  return data || []
}

export async function createServiceListing(formData) {
  try {
    const { provider } = await getProviderRecord()

    if (!provider) {
      return { error: 'Provider profile not found' }
    }

    const supabase = createAdminClient()
    const title = formData.get('title')
    const description = formData.get('description')
    const price = Number(formData.get('price'))
    const categoryId = formData.get('category_id')

    const { error } = await supabase
      .from('service_listings')
      .insert({
        provider_id: provider.provider_id,
        title,
        description,
        price,
        category_id: categoryId,
      })

    if (error) {
      return { error: error.message }
    }

    revalidatePath('/dashboard/provider')
    revalidatePath('/dashboard/provider/services')
    return { success: true }
  } catch (error) {
    return { error: error instanceof Error ? error.message : 'Failed to create service listing' }
  }
}

export async function updateProviderBookingStatus(formData) {
  try {
    const { user, provider } = await getProviderRecord()

    if (!provider) {
      return { error: 'Provider profile not found' }
    }

    const supabase = createAdminClient()
    const bookingId = formData.get('booking_id')
    const rawStatus = String(formData.get('status') || '').trim().toLowerCase()
    const status = rawStatus === 'confirm' || rawStatus === 'confirmed' ? 'accepted' : rawStatus

    if (!bookingId || !status) {
      return { error: 'Missing booking update details' }
    }

    const { data: updatedBooking, error } = await supabase
      .from('bookings')
      .update({ status })
      .eq('booking_id', bookingId)
      .eq('provider_id', provider.provider_id)
      .select('booking_id, provider_id, status')
      .maybeSingle()

    if (error) {
      return { error: error.message }
    }

    // Handle legacy data where booking.provider_id may have stored auth user id instead of provider_id.
    if (!updatedBooking) {
      const { data: legacyBooking, error: legacyError } = await supabase
        .from('bookings')
        .update({ status })
        .eq('booking_id', bookingId)
        .eq('provider_id', user.id)
        .select('booking_id, provider_id, status')
        .maybeSingle()

      if (legacyError) {
        return { error: legacyError.message }
      }

      if (!legacyBooking) {
        return { error: 'Booking update failed. This booking may not belong to your provider account.' }
      }
    }

    revalidatePath('/dashboard/provider')
    revalidatePath('/dashboard/provider/bookings')
    revalidatePath('/dashboard/customer')
    revalidatePath('/dashboard/customer/bookings')
    redirect('/dashboard/provider/bookings')
  } catch (error) {
    if (typeof error === 'object' && error !== null && 'digest' in error && typeof error.digest === 'string' && error.digest.startsWith('NEXT_REDIRECT')) {
      throw error
    }

    return { error: error instanceof Error ? error.message : 'Failed to update booking status' }
  }
}

export async function updateProviderProfile(formData) {
  try {
    const user = await requireProvider()
    const supabase = createAdminClient()

    const name = formData.get('name')
    const phone = formData.get('phone')
    const city = formData.get('city')
    const address = formData.get('address')
    const skills = formData.get('skills')
    const availability = formData.get('availability')
    const profileImage = formData.get('profile_image')
    let profileImageUrl = null

    if (profileImage instanceof File && profileImage.size > 0) {
      profileImageUrl = await uploadProfileImage(supabase, user.id, profileImage)
    }

    const { error: userError } = await supabase
      .from('users')
      .update({
        name,
        phone,
        ...(profileImageUrl ? { profile_image_url: profileImageUrl } : {}),
      })
      .eq('user_id', user.id)

    if (userError) {
      return { error: userError.message }
    }

    const { error: providerError } = await supabase
      .from('service_providers')
      .update({
        skills,
        availability,
      })
      .eq('user_id', user.id)

    if (providerError) {
      return { error: providerError.message }
    }

    const { error: authError } = await supabase.auth.admin.updateUserById(user.id, {
      user_metadata: {
        ...(user.user_metadata || {}),
        name,
        phone,
        city,
        address,
        ...(profileImageUrl ? { profile_image_url: profileImageUrl } : {}),
      },
    })

    if (authError) {
      return { error: authError.message }
    }

    revalidatePath('/dashboard/provider')
    revalidatePath('/dashboard/provider/profile')
    revalidatePath('/dashboard/provider/services')
    return { success: true }
  } catch (error) {
    return { error: error instanceof Error ? error.message : 'Failed to update provider profile' }
  }
}