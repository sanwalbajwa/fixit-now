import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createAdminClient } from '@/lib/supabase/server'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2023-10-16',
})

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET

export async function POST(req) {
  const body = await req.text()
  const sig = req.headers.get('stripe-signature')

  let event

  try {
    if (!webhookSecret) {
      throw new Error('STRIPE_WEBHOOK_SECRET is not set')
    }
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret)
  } catch (err) {
    console.error('Webhook signature verification failed.', err.message)
    return NextResponse.json({ error: err.message }, { status: 400 })
  }

  const supabase = createAdminClient()

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object
    
    // Update payment status
    const { error } = await supabase
      .from('payments')
      .update({ status: 'paid' })
      .eq('stripe_session_id', session.id)
      
    if (error) {
      console.error('Error updating payment status:', error)
    }
  }

  return NextResponse.json({ received: true })
}
