'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { CreditCard, Banknote, X } from 'lucide-react'

export default function CheckoutButton({ bookingId }) {
  const [loading, setLoading] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [error, setError] = useState('')

  const handleStripeCheckout = async () => {
    try {
      setError('')
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
        setError(data.error || 'Failed to start checkout')
      }
    } catch (error) {
      console.error(error)
      setError('Payment failed to initialize')
    } finally {
      setLoading(false)
    }
  }

  const handleCashPayment = async () => {
    try {
      setError('')
      setLoading(true)
      const res = await fetch('/api/payment/cash', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bookingId })
      })
      const data = await res.json()
      if (data.success) {
        alert('Cash payment recorded. Please complete payment with the provider.')
        setShowModal(false)
        setTimeout(() => window.location.reload(), 1000)
      } else {
        setError(data.error || 'Failed to record cash payment')
      }
    } catch (error) {
      console.error(error)
      setError('Failed to record cash payment: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Button onClick={() => setShowModal(true)} disabled={loading} className="w-full bg-slate-900 hover:bg-slate-800 text-white">
        {loading ? 'Processing...' : 'Select Payment Method'}
      </Button>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-lg max-w-sm w-full mx-4 overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
              <h3 className="text-lg font-semibold text-slate-900">Choose Payment Method</h3>
              <button
                onClick={() => {
                  setShowModal(false)
                  setError('')
                }}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="size-5" />
              </button>
            </div>

            <div className="p-6 space-y-3">
              {error && (
                <div className="rounded-xl border border-red-200 bg-red-50 p-3">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              )}

              <button
                onClick={handleStripeCheckout}
                disabled={loading}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl border-2 border-slate-200 hover:border-emerald-500 hover:bg-emerald-50 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
              >
                <CreditCard className="size-5 text-emerald-600" />
                <div className="text-left">
                  <p className="font-semibold text-slate-900">Pay with Stripe</p>
                  <p className="text-xs text-slate-500">Credit/Debit Card</p>
                </div>
              </button>

              <button
                onClick={handleCashPayment}
                disabled={loading}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl border-2 border-slate-200 hover:border-amber-500 hover:bg-amber-50 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
              >
                <Banknote className="size-5 text-amber-600" />
                <div className="text-left">
                  <p className="font-semibold text-slate-900">Pay with Cash</p>
                  <p className="text-xs text-slate-500">Pay directly to provider</p>
                </div>
              </button>
            </div>

            <div className="px-6 py-4 bg-slate-50 border-t border-slate-200">
              <p className="text-xs text-slate-600">
                Select your preferred payment method. Cash payment will be confirmed after you complete payment with the provider.
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
