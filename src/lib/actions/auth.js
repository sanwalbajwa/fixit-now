'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createAdminClient, createClient } from '@/lib/supabase/server'

export async function login(formData) {
  const supabase = await createClient()

  const data = {
    email: formData.get('email'),
    password: formData.get('password'),
  }

  const { error } = await supabase.auth.signInWithPassword(data)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/', 'layout')
  redirect('/dashboard')
}

export async function signup(formData) {
  try {
    const supabase = await createClient()
    const adminSupabase = process.env.SUPABASE_SERVICE_ROLE_KEY ? createAdminClient() : null

    const email = formData.get('email')
    const password = formData.get('password')
    const name = formData.get('name')
    const role = formData.get('role')
    const phone = formData.get('phone')

    // Step 1: Sign up user
    const { data: authData, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
          role,
        }
      }
    })

    if (signUpError) {
      return { error: signUpError.message }
    }

    if (!authData.user) {
      return { error: 'Failed to create user' }
    }

    if (adminSupabase) {
      // Step 2: Create user profile
      const { error: profileError } = await adminSupabase
        .from('users')
        .insert({
          user_id: authData.user.id,
          email,
          name,
          phone,
          role,
        })

      if (profileError) {
        return { error: profileError.message }
      }

      // Step 3: Create role-specific profile
      if (role === 'customer') {
        const { error: customerError } = await adminSupabase
          .from('customers')
          .insert({
            user_id: authData.user.id,
          })

        if (customerError) {
          return { error: customerError.message }
        }
      } else if (role === 'provider') {
        const { error: providerError } = await adminSupabase
          .from('service_providers')
          .insert({
            user_id: authData.user.id,
          })

        if (providerError) {
          return { error: providerError.message }
        }
      }
    }

    revalidatePath('/', 'layout')
    redirect('/dashboard')
  } catch (error) {
    if (typeof error === 'object' && error !== null && 'digest' in error && typeof error.digest === 'string' && error.digest.startsWith('NEXT_REDIRECT')) {
      throw error
    }

    return {
      error: error instanceof Error ? error.message : 'Signup failed. Please try again.',
    }
  }
}

export async function signout() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  revalidatePath('/', 'layout')
  redirect('/login')
}

export async function getCurrentUser() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) return null

  // Get user profile with role
  const { data: profile } = await supabase
    .from('users')
    .select('*')
    .eq('user_id', user.id)
    .single()

  if (profile) {
    return { ...user, profile }
  }

  return {
    ...user,
    profile: {
      name: user.user_metadata?.name || user.email,
      role: user.user_metadata?.role || null,
      email: user.email,
      phone: user.user_metadata?.phone || null,
    },
  }
}

export async function requestPasswordReset(formData) {
  const supabase = await createClient()
  const email = formData.get('email')
  const origin = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${origin}/auth/callback?next=/reset-password`,
  })

  if (error) {
    return { error: error.message }
  }

  return { success: true }
}

export async function updatePassword(formData) {
  try {
    const supabase = await createClient()
    const password = formData.get('password')

    if (!password || password.length < 6) {
      return { error: 'Password must be at least 6 characters' }
    }

    const { error } = await supabase.auth.updateUser({ password })

    if (error) {
      return { error: error.message }
    }

    revalidatePath('/', 'layout')
  } catch (error) {
    return { error: error instanceof Error ? error.message : 'Failed to update password' }
  }

  redirect('/dashboard')
}

export async function updateMyProfile(formData) {
  try {
    const supabase = await createClient()
    const adminSupabase = process.env.SUPABASE_SERVICE_ROLE_KEY ? createAdminClient() : null
    const currentUser = await getCurrentUser()

    if (!currentUser) {
      return { error: 'You must be logged in' }
    }

    const name = formData.get('name')
    const phone = formData.get('phone')
    const city = formData.get('city')
    const address = formData.get('address')

    if (adminSupabase) {
      const { error: updateProfileError } = await adminSupabase
        .from('users')
        .update({
          name,
          phone,
        })
        .eq('user_id', currentUser.id)

      if (updateProfileError) {
        return { error: updateProfileError.message }
      }
    }

    const { error: updateAuthError } = await supabase.auth.updateUser({
      data: {
        ...(currentUser.user_metadata || {}),
        name,
        phone,
        city,
        address,
      },
    })

    if (updateAuthError) {
      return { error: updateAuthError.message }
    }

    const role = currentUser.profile?.role || currentUser.user_metadata?.role
    revalidatePath('/dashboard')
    if (role === 'customer') {
      revalidatePath('/dashboard/customer')
      revalidatePath('/dashboard/customer/profile')
    } else if (role === 'provider') {
      revalidatePath('/dashboard/provider')
      revalidatePath('/dashboard/provider/profile')
    } else if (role === 'admin') {
      revalidatePath('/dashboard/admin')
      revalidatePath('/dashboard/admin/profile')
    }

    return { success: true }
  } catch (error) {
    return { error: error instanceof Error ? error.message : 'Failed to update profile' }
  }
}