'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createAdminClient, createClient } from '@/lib/supabase/server'
import { getCurrentUser } from './auth'

export async function createBooking(formData) {
  const supabase = await createClient()
  const user = await getCurrentUser()

  if (!user) {
    return { error: 'You must be logged in to book a service' }
  }

  // Get customer_id
  const { data: customer } = await supabase
    .from('customers')
    .select('customer_id')
    .eq('user_id', user.id)
    .single()

  if (!customer) {
    return { error: 'Customer profile not found' }
  }

  const providerId = formData.get('provider_id')
  const listingId = formData.get('listing_id')
  const serviceDate = formData.get('service_date')
  const serviceTime = formData.get('service_time')
  const serviceLocation = formData.get('service_location')
  const description = formData.get('description')
  const notes = formData.get('notes')

  const notePrefix = [
    serviceTime ? `[Time] ${serviceTime}` : null,
    serviceLocation ? `[Location] ${serviceLocation}` : null,
  ].filter(Boolean).join('\n')

  // Try storing dedicated fields first, then gracefully fallback to notes-only if columns are unavailable.
  const primaryInsertPayload = {
    customer_id: customer.customer_id,
    provider_id: providerId,
    listing_id: listingId,
    service_date: serviceDate,
    service_time: serviceTime || null,
    service_location: serviceLocation || null,
    description,
    notes: notes || null,
    status: 'pending'
  }

  let booking = null
  let error = null

  const primaryInsert = await supabase
    .from('bookings')
    .insert(primaryInsertPayload)
    .select()
    .single()

  booking = primaryInsert.data
  error = primaryInsert.error

  if (error) {
    const fallbackNotes = [notePrefix, notes || null].filter(Boolean).join('\n\n') || null

    const fallbackInsert = await supabase
      .from('bookings')
      .insert({
        customer_id: customer.customer_id,
        provider_id: providerId,
        listing_id: listingId,
        service_date: serviceDate,
        description,
        notes: fallbackNotes,
        status: 'pending'
      })
      .select()
      .single()

    booking = fallbackInsert.data
    error = fallbackInsert.error
  }

  if (error) {
    console.error('Error creating booking:', error)
    return { error: 'Failed to create booking. Please try again.' }
  }

  revalidatePath('/dashboard/customer')
  redirect('/dashboard/customer/bookings')
}

export async function getCustomerBookings() {
  const supabase = await createClient()
  const user = await getCurrentUser()

  if (!user) return []

  const { data: customer } = await supabase
    .from('customers')
    .select('customer_id')
    .eq('user_id', user.id)
    .single()

  if (!customer) return []

  const { data, error } = await supabase
    .from('bookings')
    .select(`
      *,
      service_providers (
        provider_id,
        rating,
        users (
          name,
          phone,
          email,
          profile_image_url
        )
      ),
      service_listings (
        title,
        price,
        service_categories (
          category_name,
          icon_url
        )
      ),
      payments (
        status,
        amount,
        method
      ),
      ratings (
        rating_id,
        rating,
        review
      )
    `)
    .eq('customer_id', customer.customer_id)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching bookings:', error)
    return []
  }

  return data || []
}

export async function getProviderBookings() {
  const supabase = await createClient()
  const user = await getCurrentUser()

  if (!user) return []

  const { data: provider } = await supabase
    .from('service_providers')
    .select('provider_id')
    .eq('user_id', user.id)
    .single()

  if (!provider) return []

  const { data, error } = await supabase
    .from('bookings')
    .select(`
      *,
      customers (
        customer_id,
        users (
          name,
          phone,
          email,
          profile_image_url
        )
      ),
      service_listings (
        title,
        price,
        service_categories (
          category_name,
          icon_url
        )
      )
    `)
    .eq('provider_id', provider.provider_id)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching bookings:', error)
    return []
  }

  return data || []
}

export async function updateBookingStatus(bookingId, newStatus) {
  const supabase = await createClient()
  
  const { error } = await supabase
    .from('bookings')
    .update({ status: newStatus })
    .eq('booking_id', bookingId)

  if (error) {
    console.error('Error updating booking:', error)
    return { error: 'Failed to update booking status' }
  }

  revalidatePath('/dashboard')
  return { success: true }
}

export async function cancelMyBooking(formData) {
  let shouldRedirect = false

  try {
    const supabase = await createClient()
    const user = await getCurrentUser()

    if (!user) {
      return { error: 'You must be logged in to cancel a booking' }
    }

    const bookingId = formData.get('booking_id')
    const adminSupabase = createAdminClient()

    const { data: customer } = await supabase
      .from('customers')
      .select('customer_id')
      .eq('user_id', user.id)
      .single()

    if (!customer) {
      return { error: 'Customer profile not found' }
    }

    const { data: booking, error: bookingError } = await supabase
      .from('bookings')
      .select('booking_id, status, customer_id, provider_id')
      .eq('booking_id', bookingId)
      .eq('customer_id', customer.customer_id)
      .single()

    if (bookingError || !booking) {
      return { error: 'Booking not found' }
    }

    if (['completed', 'cancelled'].includes(booking.status)) {
      return { error: 'This booking can no longer be cancelled' }
    }

    const { error } = await supabase
      .from('bookings')
      .update({ status: 'cancelled' })
      .eq('booking_id', booking.booking_id)
      .eq('customer_id', customer.customer_id)

    if (error) {
      return { error: error.message }
    }

    const { data: providerBookings, error: providerBookingsError } = await adminSupabase
      .from('bookings')
      .select('status')
      .eq('provider_id', booking.provider_id)

    if (!providerBookingsError) {
      const hasActiveBookings = (providerBookings || []).some((item) => !['completed', 'cancelled'].includes(item.status))
      const nextAvailability = hasActiveBookings ? 'busy' : 'available'

      await adminSupabase
        .from('service_providers')
        .update({ availability: nextAvailability })
        .eq('provider_id', booking.provider_id)

      revalidatePath('/dashboard/provider')
      revalidatePath('/dashboard/provider/profile')
      revalidatePath('/dashboard/provider/bookings')
      revalidatePath('/services')
      revalidatePath(`/services/${booking.provider_id}`)
      revalidatePath('/dashboard/customer/services')
    }

    revalidatePath('/dashboard/customer')
    revalidatePath('/dashboard/customer/bookings')
    revalidatePath(`/dashboard/chat/${booking.booking_id}`)

    shouldRedirect = true
  } catch (error) {
    return { error: error instanceof Error ? error.message : 'Failed to cancel booking' }
  }

  if (shouldRedirect) {
    redirect('/dashboard/customer/bookings')
  }
}

export async function submitBookingRating(formData) {
  let redirectPath = null

  try {
    const supabase = await createClient()
    const user = await getCurrentUser()

    if (!user) {
      return { error: 'You must be logged in to submit a rating' }
    }

    const ratingValue = Number(formData.get('rating'))
    const review = formData.get('review')
    const bookingId = formData.get('booking_id')

    if (!ratingValue || ratingValue < 1 || ratingValue > 5) {
      return { error: 'Rating must be between 1 and 5' }
    }

    const { data: customer } = await supabase
      .from('customers')
      .select('customer_id')
      .eq('user_id', user.id)
      .single()

    if (!customer) {
      return { error: 'Customer profile not found' }
    }

    const { data: booking } = await supabase
      .from('bookings')
      .select('booking_id, customer_id, provider_id, status')
      .eq('booking_id', bookingId)
      .eq('customer_id', customer.customer_id)
      .single()

    if (!booking || booking.status !== 'completed') {
      return { error: 'Only completed bookings can be rated' }
    }

    // Prefer booking-bound uniqueness. If booking_id is unsupported in ratings, fallback to provider-level check.
    const existingByBooking = await supabase
      .from('ratings')
      .select('rating_id')
      .eq('customer_id', customer.customer_id)
      .eq('booking_id', booking.booking_id)
      .maybeSingle()

    if (!existingByBooking.error && existingByBooking.data) {
      return { error: 'You already submitted a rating for this booking' }
    }

    if (existingByBooking.error) {
      const existingByProvider = await supabase
        .from('ratings')
        .select('rating_id')
        .eq('customer_id', customer.customer_id)
        .eq('provider_id', booking.provider_id)
        .maybeSingle()

      if (existingByProvider.data) {
        return { error: 'You already submitted a rating for this provider' }
      }
    }

    const insertWithBooking = await supabase
      .from('ratings')
      .insert({
        customer_id: customer.customer_id,
        provider_id: booking.provider_id,
        booking_id: booking.booking_id,
        rating: ratingValue,
        review: review || null,
      })

    if (insertWithBooking.error) {
      const fallbackInsert = await supabase
        .from('ratings')
        .insert({
          customer_id: customer.customer_id,
          provider_id: booking.provider_id,
          rating: ratingValue,
          review: review || null,
        })

      if (fallbackInsert.error) {
        return { error: fallbackInsert.error.message }
      }
    }

    const { data: providerRatings } = await supabase
      .from('ratings')
      .select('rating')
      .eq('provider_id', booking.provider_id)

    const totalReviews = providerRatings?.length || 0
    const avgRating = totalReviews > 0
      ? providerRatings.reduce((sum, item) => sum + Number(item.rating || 0), 0) / totalReviews
      : 0

    await supabase
      .from('service_providers')
      .update({
        rating: Number(avgRating.toFixed(2)),
        total_reviews: totalReviews,
      })
      .eq('provider_id', booking.provider_id)

    revalidatePath('/dashboard/customer')
    revalidatePath('/dashboard/customer/bookings')
    revalidatePath(`/services/${booking.provider_id}`)
    redirectPath = '/dashboard/customer/bookings'
  } catch (error) {
    return { error: error instanceof Error ? error.message : 'Failed to submit rating' }
  }

  if (redirectPath) redirect(redirectPath)
}