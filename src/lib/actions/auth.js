'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export async function login(formData) {
  const supabase = createClient()

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
  const supabase = createClient()

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

  // Step 2: Create user profile
  const { error: profileError } = await supabase
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
    const { error: customerError } = await supabase
      .from('customers')
      .insert({
        user_id: authData.user.id,
      })

    if (customerError) {
      return { error: customerError.message }
    }
  } else if (role === 'provider') {
    const { error: providerError } = await supabase
      .from('service_providers')
      .insert({
        user_id: authData.user.id,
      })

    if (providerError) {
      return { error: providerError.message }
    }
  }

  revalidatePath('/', 'layout')
  redirect('/dashboard')
}

export async function signout() {
  const supabase = createClient()
  await supabase.auth.signOut()
  revalidatePath('/', 'layout')
  redirect('/login')
}

export async function getCurrentUser() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) return null

  // Get user profile with role
  const { data: profile } = await supabase
    .from('users')
    .select('*')
    .eq('user_id', user.id)
    .single()

  return { ...user, profile }
}