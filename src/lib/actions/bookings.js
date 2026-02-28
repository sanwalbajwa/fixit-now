'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
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
  const description = formData.get('description')
  const notes = formData.get('notes')

  // Create booking
  const { data: booking, error } = await supabase
    .from('bookings')
    .insert({
      customer_id: customer.customer_id,
      provider_id: providerId,
      listing_id: listingId,
      service_date: serviceDate,
      description,
      notes,
      status: 'pending'
    })
    .select()
    .single()

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
          email
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
          email
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