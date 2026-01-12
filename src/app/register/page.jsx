'use client'

import { Suspense, useState } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { signup } from '@/lib/actions/auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

function RegisterForm() {
  const searchParams = useSearchParams()
  const defaultRole = searchParams.get('role') || 'customer'
  
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [selectedRole, setSelectedRole] = useState(defaultRole)

  async function handleSubmit(formData) {
    setLoading(true)
    setError('')
    
    const result = await signup(formData)
    
    if (result?.error) {
      setError(result.error)
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-blue-50 p-4">
      <Card className="w-full max-w-md card-shadow-lg">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg gradient-primary">
              <span className="font-accent text-2xl font-bold text-white">F</span>
            </div>
          </div>
          <CardTitle className="text-3xl font-heading font-bold">Create Account</CardTitle>
          <CardDescription>Join FixItNow and get started today</CardDescription>
        </CardHeader>
        <CardContent>
          <form action={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-600 text-sm">
                {error}
              </div>
            )}

            {/* Role Selection */}
            <div className="space-y-2">
              <label className="text-sm font-medium">I want to:</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setSelectedRole('customer')}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    selectedRole === 'customer'
                      ? 'border-primary-500 bg-primary-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="text-2xl mb-2">🛒</div>
                  <div className="font-semibold">Book Services</div>
                  <div className="text-xs text-slate-600">I need help</div>
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedRole('provider')}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    selectedRole === 'provider'
                      ? 'border-primary-500 bg-primary-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="text-2xl mb-2">🔧</div>
                  <div className="font-semibold">Provide Services</div>
                  <div className="text-xs text-slate-600">I can help</div>
                </button>
              </div>
              <input type="hidden" name="role" value={selectedRole} />
            </div>

            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium">
                Full Name
              </label>
              <Input
                id="name"
                name="name"
                type="text"
                placeholder="John Doe"
                required
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">
                Email Address
              </label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="you@example.com"
                required
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="phone" className="text-sm font-medium">
                Phone Number
              </label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                placeholder="+92 300 1234567"
                required
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium">
                Password
              </label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="••••••••"
                required
                minLength={6}
                disabled={loading}
              />
              <p className="text-xs text-slate-500">Must be at least 6 characters</p>
            </div>

            <div className="flex items-start space-x-2">
              <input
                type="checkbox"
                required
                className="mt-1 rounded border-gray-300"
                disabled={loading}
              />
              <label className="text-sm text-slate-600">
                I agree to the{' '}
                <Link href="#" className="text-primary-600 hover:underline">
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link href="#" className="text-primary-600 hover:underline">
                  Privacy Policy
                </Link>
              </label>
            </div>

            <Button
              type="submit"
              className="w-full gradient-primary text-white"
              disabled={loading}
            >
              {loading ? 'Creating account...' : 'Create Account'}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm">
            <span className="text-slate-600">Already have an account? </span>
            <Link href="/login" className="text-primary-600 font-medium hover:underline">
              Sign in
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default function RegisterPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500"></div>
      </div>
    }>
      <RegisterForm />
    </Suspense>
  )
}