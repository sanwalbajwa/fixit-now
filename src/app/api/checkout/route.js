import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createClient } from '@/lib/supabase/server'
import { getCurrentUser } from '@/lib/actions/auth'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2023-10-16',
})

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
    
    // Create Stripe Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'pkr',
            product_data: {
              name: booking.service_listings?.title || 'Service Booking',
              description: `Payment for booking ${bookingId}`,
            },
            unit_amount: Math.round(price * 100), // Stripe expects amount in cents
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/dashboard/customer/bookings?payment=success`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/dashboard/customer/bookings?payment=cancelled`,
      metadata: {
        bookingId: bookingId,
        customerId: booking.customer_id,
      },
    })

    // Create pending payment in db
    await supabase.from('payments').insert({
      booking_id: bookingId,
      customer_id: booking.customer_id,
      amount: price,
      status: 'pending',
      stripe_session_id: session.id,
      method: 'card'
    })

    return NextResponse.json({ url: session.url })
  } catch (error) {
    console.error('Stripe checkout error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
