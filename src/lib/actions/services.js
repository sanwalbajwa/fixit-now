'use server'

import { createClient } from '@/lib/supabase/server'

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
  const supabase = await createClient()
  
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

  // Filter by category if provided
  if (filters.category_id) {
    return providersWithListings.filter(provider => 
      provider.service_listings.some(listing => 
        listing.category_id === filters.category_id
      )
    )
  }

  return providersWithListings
}

export async function getProviderById(providerId) {
  const supabase = await createClient()
  
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
  const supabase = await createClient()
  
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