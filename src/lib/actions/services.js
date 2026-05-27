'use server'

import { createAdminClient, createClient } from '@/lib/supabase/server'

export async function getAllCategories() {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('service_categories')
    .select('*')
    .order('category_name')
  
  if (error) {
    console.error('Error fetching categories:', error)
    return []
  }
  
  return data || []
}

export async function getVerifiedProviders(filters = {}) {
  const supabase = createAdminClient()
  
  // First, get all verified providers
  let query = supabase
    .from('service_providers')
    .select(`
      provider_id,
      user_id,
      skills,
      availability,
      rating,
      total_reviews,
      is_verified,
      created_at,
      users (
        user_id,
        name,
        email,
        phone,
        profile_image_url
      )
    `)
    .eq('is_verified', true)
  
  // Filter by minimum rating
  if (filters.min_rating) {
    query = query.gte('rating', parseFloat(filters.min_rating))
  }
  
  // Sort by rating or date
  const sortBy = filters.sort_by || 'rating'
  if (sortBy === 'rating') {
    query = query.order('rating', { ascending: false })
  } else if (sortBy === 'newest') {
    query = query.order('created_at', { ascending: false })
  }
  
  const { data: providers, error } = await query
  
  if (error) {
    console.error('Error fetching providers:', error)
    return []
  }

  if (!providers || providers.length === 0) {
    return []
  }

  // Now fetch service listings for each provider
  const providerIds = providers.map(p => p.provider_id)
  
  const { data: listings, error: listingsError } = await supabase
    .from('service_listings')
    .select(`
      listing_id,
      provider_id,
      category_id,
      title,
      description,
      price,
      service_categories (
        category_id,
        category_name,
        icon_url
      )
    `)
    .in('provider_id', providerIds)
  
  if (listingsError) {
    console.error('Error fetching listings:', listingsError)
  }

  // Merge listings into providers
  const providersWithListings = providers.map(provider => ({
    ...provider,
    service_listings: listings?.filter(l => l.provider_id === provider.provider_id) || []
  }))

  const searchTerm = (filters.search || '').trim().toLowerCase()
  const availability = (filters.availability || '').trim().toLowerCase()
  const minPrice = filters.min_price !== undefined && filters.min_price !== null && filters.min_price !== ''
    ? Number(filters.min_price)
    : null
  const maxPrice = filters.max_price !== undefined && filters.max_price !== null && filters.max_price !== ''
    ? Number(filters.max_price)
    : null

  return providersWithListings.filter((provider) => {
    const listingsForProvider = provider.service_listings || []

    if (filters.category_id) {
      const hasCategory = listingsForProvider.some((listing) => listing.category_id === filters.category_id)
      if (!hasCategory) return false
    }

    if (availability && availability !== 'any') {
      const providerAvailability = String(provider.availability || '').toLowerCase()
      if (providerAvailability !== availability) return false
    }

    if (minPrice !== null || maxPrice !== null) {
      const matchesPrice = listingsForProvider.some((listing) => {
        const price = Number(listing.price || 0)
        if (Number.isNaN(price)) return false
        if (minPrice !== null && price < minPrice) return false
        if (maxPrice !== null && price > maxPrice) return false
        return true
      })

      if (!matchesPrice) return false
    }

    if (searchTerm) {
      const u = Array.isArray(provider.users) ? provider.users[0] : provider.users
      const searchableParts = [
        u?.name,
        u?.email,
        u?.phone,
        provider.skills,
        ...listingsForProvider.map((listing) => listing.title),
        ...listingsForProvider.map((listing) => listing.description),
        ...listingsForProvider.map((listing) => listing.service_categories?.category_name),
      ]
        .filter(Boolean)
        .map((value) => String(value).toLowerCase())

      const matchesSearch = searchableParts.some((value) => value.includes(searchTerm))
      if (!matchesSearch) return false
    }

    return true
  })
}

export async function getProviderById(providerId) {
  const supabase = createAdminClient()
  
  const { data: provider, error } = await supabase
    .from('service_providers')
    .select(`
      provider_id,
      user_id,
      skills,
      availability,
      rating,
      total_reviews,
      is_verified,
      created_at,
      users (
        user_id,
        name,
        email,
        phone,
        profile_image_url
      )
    `)
    .eq('provider_id', providerId)
    .single()
  
  if (error) {
    console.error('Error fetching provider:', error)
    return null
  }

  // Fetch service listings
  const { data: listings } = await supabase
    .from('service_listings')
    .select(`
      listing_id,
      title,
      description,
      price,
      category_id,
      service_categories (
        category_id,
        category_name,
        icon_url
      )
    `)
    .eq('provider_id', providerId)

  // Fetch ratings
  const { data: ratings } = await supabase
    .from('ratings')
    .select(`
      rating_id,
      rating,
      review,
      created_at,
      customer_id
    `)
    .eq('provider_id', providerId)
    .order('created_at', { ascending: false })

  return {
    ...provider,
    service_listings: listings || [],
    ratings: ratings || []
  }
}

export async function searchProviders(searchTerm) {
  const supabase = createAdminClient()
  
  const { data, error } = await supabase
    .from('service_providers')
    .select(`
      provider_id,
      user_id,
      skills,
      availability,
      rating,
      total_reviews,
      users (
        user_id,
        name,
        email,
        phone
      )
    `)
    .eq('is_verified', true)
    .ilike('skills', `%${searchTerm}%`)
  
  if (error) {
    console.error('Error searching providers:', error)
    return []
  }
  
  return data || []
}