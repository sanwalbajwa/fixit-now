'use client'

import { useState } from 'react'
import { updatePassword } from '@/lib/actions/auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export default function ResetPasswordPage() {
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(formData) {
    const password = formData.get('password')
    const confirm = formData.get('confirm')

    if (password !== confirm) {
      setError('Passwords do not match.')
      return
    }

    setLoading(true)
    setError('')

    const result = await updatePassword(formData)

    if (result?.error) {
      setError(result.error)
      setLoading(false)
    }
    // On success, updatePassword redirects to /dashboard — no state update needed
  }

  return (
    <div className="min-h-screen flex">
      <div className="hidden lg:flex lg:w-3/5 items-center justify-center p-12 bg-gradient-to-br from-emerald-50 to-emerald-100">
        <div className="max-w-lg text-center space-y-6">
          <div className="text-8xl">🔒</div>
          <h1 className="font-heading text-4xl font-bold text-slate-900">Set New Password</h1>
          <p className="text-lg text-slate-600">
            Choose a strong password to keep your account secure.
          </p>
        </div>
      </div>

      <div className="w-full lg:w-2/5 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center lg:text-left">
            <h2 className="text-3xl font-heading font-bold text-slate-900 mt-6">New Password</h2>
            <p className="text-slate-600 mt-2">Enter and confirm your new password below.</p>
          </div>

          <form action={handleSubmit} className="space-y-5">
            {error && (
              <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-600 text-sm">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium text-slate-700">
                New Password <span className="text-red-500">*</span>
              </label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="At least 6 characters"
                required
                minLength={6}
                disabled={loading}
                className="h-11"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="confirm" className="text-sm font-medium text-slate-700">
                Confirm Password <span className="text-red-500">*</span>
              </label>
              <Input
                id="confirm"
                name="confirm"
                type="password"
                placeholder="Repeat your new password"
                required
                minLength={6}
                disabled={loading}
                className="h-11"
              />
            </div>

            <Button
              type="submit"
              className="w-full h-12 bg-emerald-600 hover:bg-emerald-700 text-white text-base font-semibold"
              disabled={loading}
            >
              {loading ? 'Updating...' : 'Update Password'}
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}
