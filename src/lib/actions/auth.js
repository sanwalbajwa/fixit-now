'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createAdminClient, createClient } from '@/lib/supabase/server'

const PROFILE_IMAGE_BUCKET = 'profile-images'

function resolveFormData(arg1, arg2) {
  if (typeof FormData !== 'undefined' && arg1 instanceof FormData) {
    return arg1
  }

  if (typeof FormData !== 'undefined' && arg2 instanceof FormData) {
    return arg2
  }

  return null
}

export async function uploadProfileImage(adminSupabase, userId, file) {
  if (!adminSupabase || !file || typeof file === 'string' || file.size === 0) {
    return null
  }

  const extension = file.type?.split('/')?.[1] || 'png'
  const path = `${userId}/${Date.now()}.${extension}`

  const { error: uploadError } = await adminSupabase.storage
    .from(PROFILE_IMAGE_BUCKET)
    .upload(path, file, {
      upsert: true,
      contentType: file.type || 'image/png',
      cacheControl: '3600',
    })

  if (uploadError) {
    throw new Error(`Profile image upload failed: ${uploadError.message}`)
  }

  const { data } = adminSupabase.storage
    .from(PROFILE_IMAGE_BUCKET)
    .getPublicUrl(path)

  return data.publicUrl || null
}

async function confirmCustomerAccount(email) {
  const adminSupabase = process.env.SUPABASE_SERVICE_ROLE_KEY ? createAdminClient() : null

  if (!adminSupabase) {
    return false
  }

  const { data: profile } = await adminSupabase
    .from('users')
    .select('user_id, role')
    .eq('email', email)
    .maybeSingle()

  if (!profile || profile.role !== 'customer') {
    return false
  }

  const { error } = await adminSupabase.auth.admin.updateUserById(profile.user_id, {
    email_confirm: true,
  })

  return !error
}

export async function login(arg1, arg2) {
  try {
    const supabase = await createClient()
    const formData = resolveFormData(arg1, arg2)

    if (!formData) {
      return { error: 'Invalid login request.' }
    }

    const data = {
      email: formData.get('email'),
      password: formData.get('password'),
    }

    const { error } = await supabase.auth.signInWithPassword(data)

    if (error) {
      if (/confirm/i.test(error.message) && data.email) {
        const confirmed = await confirmCustomerAccount(data.email)

        if (confirmed) {
          const retry = await supabase.auth.signInWithPassword(data)

          if (!retry.error) {
            revalidatePath('/', 'layout')
            redirect('/dashboard')
          }

          return { error: retry.error?.message || 'Login failed. Please try again.' }
        }
      }

      return { error: error.message }
    }

    revalidatePath('/', 'layout')
    redirect('/dashboard')
  } catch (error) {
    if (typeof error === 'object' && error !== null && 'digest' in error && typeof error.digest === 'string' && error.digest.startsWith('NEXT_REDIRECT')) {
      throw error
    }

    return {
      error: error instanceof Error ? error.message : 'Login failed. Please try again.',
    }
  }
}

export async function signup(arg1, arg2) {
  try {
    const supabase = await createClient()
    const adminSupabase = process.env.SUPABASE_SERVICE_ROLE_KEY ? createAdminClient() : null
    const formData = resolveFormData(arg1, arg2)

    if (!formData) {
      return { error: 'Invalid signup request.' }
    }

    const email = formData.get('email')
    const password = formData.get('password')
    const name = formData.get('name')
    const role = formData.get('role')
    const phone = formData.get('phone')

    if (!adminSupabase) {
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

      revalidatePath('/', 'layout')
      redirect('/dashboard')
    }

    const { data: authData, error: createUserError } = await adminSupabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: {
        name,
        role,
        phone,
      },
    })

    if (createUserError) {
      return { error: createUserError.message }
    }

    if (!authData.user) {
      return { error: 'Failed to create user' }
    }

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
          is_verified: false,
        })

      if (providerError) {
        return { error: providerError.message }
      }
    }

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (signInError) {
      return { error: signInError.message }
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
    const profileImage = formData.get('profile_image')
    const currentProfileImageUrl = currentUser.profile?.profile_image_url || currentUser.user_metadata?.profile_image_url || null

    let profileImageUrl = currentProfileImageUrl

    if (profileImage instanceof File && profileImage.size > 0) {
      if (!adminSupabase) {
        return { error: 'Profile image upload requires SUPABASE_SERVICE_ROLE_KEY and a public profile-images storage bucket.' }
      }

      profileImageUrl = await uploadProfileImage(adminSupabase, currentUser.id, profileImage)
        || currentProfileImageUrl
    }

    if (adminSupabase) {
      const updateData = {
        name,
        phone,
      }

      if (profileImageUrl) {
        updateData.profile_image_url = profileImageUrl
      }

      const { error: updateProfileError } = await adminSupabase
        .from('users')
        .update(updateData)
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
        profile_image_url: profileImageUrl,
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