import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getCurrentUser } from '@/lib/actions/auth'

export async function POST(req) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { bookingId } = await req.json()

    if (!bookingId) {
      return NextResponse.json({ error: 'Missing booking ID' }, { status: 400 })
    }

    const supabase = await createClient()

    // Get customer_id
    const { data: customer } = await supabase
      .from('customers')
      .select('customer_id')
      .eq('user_id', user.id)
      .single()

    if (!customer) {
      return NextResponse.json({ error: 'Customer not found' }, { status: 404 })
    }

    // Get booking details
    const { data: booking, error: bookingError } = await supabase
      .from('bookings')
      .select('*, service_listings(title, price)')
      .eq('booking_id', bookingId)
      .single()

    if (bookingError || !booking) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 })
    }

    if (booking.customer_id !== customer.customer_id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // Check if already paid
    const { data: existingPayment } = await supabase
      .from('payments')
      .select('*')
      .eq('booking_id', bookingId)
      .eq('status', 'paid')
      .maybeSingle()

    if (existingPayment) {
      return NextResponse.json({ error: 'Already paid' }, { status: 400 })
    }

    const price = booking.service_listings?.price || 0

    // Create cash payment - use a marker like empty stripe_session_id to indicate cash payment
    const { data: paymentData, error: paymentError } = await supabase
      .from('payments')
      .insert({
        booking_id: bookingId,
        customer_id: booking.customer_id,
        amount: price,
        status: 'pending',
        stripe_session_id: 'cash_payment'
      })
      .select()

    if (paymentError) {
      console.error('Payment insertion error:', paymentError)
      return NextResponse.json({ error: 'Failed to record payment: ' + paymentError.message }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      message: 'Cash payment recorded. Please complete payment with the provider.',
      payment: paymentData
    })
  } catch (error) {
    console.error('Cash payment error:', error)
    return NextResponse.json({ error: 'Internal server error: ' + error.message }, { status: 500 })
  }
}
