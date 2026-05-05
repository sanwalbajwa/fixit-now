'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'

export default function CheckoutButton({ bookingId }) {
  const [loading, setLoading] = useState(false)

  const handleCheckout = async () => {
    try {
      setLoading(true)
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bookingId })
      })
      const data = await res.json()
      if (data.url) {
        window.location.href = data.url
      } else {
        alert(data.error || 'Failed to start checkout')
      }
    } catch (error) {
      console.error(error)
      alert('Payment failed to initialize')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button onClick={handleCheckout} disabled={loading} className="w-full bg-slate-900 hover:bg-slate-800 text-white">
      {loading ? 'Processing...' : 'Pay with Stripe'}
    </Button>
  )
}
