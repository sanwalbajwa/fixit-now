'use client'

import { useState } from 'react'
import Link from 'next/link'
import { requestPasswordReset } from '@/lib/actions/auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export default function ForgotPasswordPage() {
  const [status, setStatus] = useState(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(formData) {
    setLoading(true)
    setStatus(null)

    const result = await requestPasswordReset(formData)

    if (result?.error) {
      setStatus({ type: 'error', text: result.error })
    } else {
      setStatus({ type: 'success', text: 'Check your email — a password reset link has been sent.' })
    }

    setLoading(false)
  }

  return (
    <div className="min-h-screen flex">
      <div className="hidden lg:flex lg:w-3/5 items-center justify-center p-12 bg-gradient-to-br from-emerald-50 to-emerald-100">
        <div className="max-w-lg text-center space-y-6">
          <div className="text-8xl">🔑</div>
          <h1 className="font-heading text-4xl font-bold text-slate-900">Reset Your Password</h1>
          <p className="text-lg text-slate-600">
            Enter the email address tied to your account and we will send you a secure reset link.
          </p>
        </div>
      </div>

      <div className="w-full lg:w-2/5 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center lg:text-left">
            <h2 className="text-3xl font-heading font-bold text-slate-900 mt-6">Forgot Password</h2>
            <p className="text-slate-600 mt-2">
              We will send a reset link to your registered email.
            </p>
          </div>

          {status?.type === 'success' ? (
            <div className="space-y-6">
              <div className="p-4 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm">
                {status.text}
              </div>
              <p className="text-sm text-slate-600 text-center">
                Didn&apos;t receive the email?{' '}
                <button
                  onClick={() => setStatus(null)}
                  className="font-semibold text-emerald-600 hover:text-emerald-700"
                >
                  Try again
                </button>
              </p>
              <Link href="/login">
                <Button variant="outline" className="w-full">Back to Sign In</Button>
              </Link>
            </div>
          ) : (
            <form action={handleSubmit} className="space-y-5">
              {status?.type === 'error' && (
                <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-600 text-sm">
                  {status.text}
                </div>
              )}

              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium text-slate-700">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="e.g. david@gmail.com"
                  required
                  disabled={loading}
                  className="h-11"
                />
              </div>

              <Button
                type="submit"
                className="w-full h-12 bg-emerald-600 hover:bg-emerald-700 text-white text-base font-semibold"
                disabled={loading}
              >
                {loading ? 'Sending...' : 'Send Reset Link'}
              </Button>

              <p className="text-sm text-center text-slate-600">
                Remembered your password?{' '}
                <Link href="/login" className="font-semibold text-emerald-600 hover:text-emerald-700">
                  Sign In
                </Link>
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
