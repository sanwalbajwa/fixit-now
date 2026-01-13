'use client'

import { Suspense, useState } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { signup } from '@/lib/actions/auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

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

  const isProvider = selectedRole === 'provider'

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Illustration */}
      <div className={`hidden lg:flex lg:w-3/5 items-center justify-center p-12 ${isProvider ? 'bg-gradient-to-br from-red-50 to-orange-50' : 'bg-gradient-to-br from-emerald-50 to-emerald-100'}`}>
        <div className="max-w-lg text-center space-y-6">
          <img
            src="/Register.png"
            alt="Handyman Services"
            className="w-full max-w-md mx-auto"
          />
          <h1 className="font-heading text-4xl font-bold text-slate-900">
            {isProvider ? 'Join Our Professional Network' : 'Welcome To FixItNow'}
          </h1>
          <p className="text-lg text-slate-600">
            {isProvider 
              ? 'Start earning by providing professional home services. Join thousands of verified providers.'
              : 'Masterful Services: Fixing, Repairing, and Enhancing Your Space with Expertise, Simplifying Life, One Project at a Time.'}
          </p>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-2/5 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center lg:text-left">
            <h2 className="text-3xl font-heading font-bold text-slate-900 mt-6">Sign Up</h2>
            <p className="text-slate-600 mt-2">Create your account to get started</p>
          </div>

          <form action={handleSubmit} className="space-y-5">
            {error && (
              <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-600 text-sm">
                {error}
              </div>
            )}

            {/* Role Selection */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">I want to:</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setSelectedRole('customer')}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    selectedRole === 'customer'
                      ? 'border-emerald-500 bg-emerald-50'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="text-2xl mb-2">🛒</div>
                  <div className="font-semibold text-sm">Book Services</div>
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedRole('provider')}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    selectedRole === 'provider'
                      ? 'border-red-500 bg-red-50'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="text-2xl mb-2">🔧</div>
                  <div className="font-semibold text-sm">Provide Services</div>
                </button>
              </div>
              <input type="hidden" name="role" value={selectedRole} />
            </div>

            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium text-slate-700">
                Full Name <span className="text-red-500">*</span>
              </label>
              <Input
                id="name"
                name="name"
                type="text"
                placeholder="e.g. David Finley"
                required
                disabled={loading}
                className="h-11"
              />
            </div>

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

            <div className="space-y-2">
              <label htmlFor="phone" className="text-sm font-medium text-slate-700">
                Contact Number <span className="text-red-500">*</span>
              </label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                placeholder="e.g. +123 932545676"
                required
                disabled={loading}
                className="h-11"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium text-slate-700">
                Your Password <span className="text-red-500">*</span>
              </label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="e.g. #123@456"
                required
                minLength={6}
                disabled={loading}
                className="h-11"
              />
            </div>

            <Button
              type="submit"
              className={`w-full h-12 text-base font-semibold ${isProvider ? 'bg-red-500 hover:bg-red-600' : 'bg-emerald-600 hover:bg-emerald-700'} text-white`}
              disabled={loading}
            >
              {loading ? 'Creating account...' : 'Sign Up'}
            </Button>

            <p className="text-sm text-center text-slate-600">
              Already have an account?{' '}
              <Link href="/login" className={`font-semibold ${isProvider ? 'text-red-500 hover:text-red-600' : 'text-emerald-600 hover:text-emerald-700'}`}>
                Sign In
              </Link>
            </p>
          </form>
        </div>
      </div>
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