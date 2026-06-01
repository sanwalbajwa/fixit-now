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

export async function getVerifiedProviderCities() {
  const supabase = await createAdminClient()

  const { data: providers, error } = await supabase
    .from('service_providers')
    .select('user_id')
    .eq('is_verified', true)

  if (error) {
    console.error('Error fetching provider cities:', error)
    return []
  }

  const uniqueUserIds = [...new Set((providers || []).map((provider) => provider.user_id).filter(Boolean))]
  if (uniqueUserIds.length === 0) {
    return []
  }

  const cityMap = new Map()

  function normalizeCityLabel(userMetadata = {}) {
    const rawCity = typeof userMetadata?.city === 'string' ? userMetadata.city.trim() : ''
    if (rawCity) {
      return rawCity
    }

    const rawAddress = typeof userMetadata?.address === 'string' ? userMetadata.address.trim() : ''
    if (!rawAddress) {
      return ''
    }

    return rawAddress.split(',')[0].trim()
  }

  await Promise.all(
    uniqueUserIds.map(async (userId) => {
      const { data, error: userError } = await supabase.auth.admin.getUserById(userId)

      if (userError) {
        console.error(`Error fetching auth metadata for city list user ${userId}:`, userError)
        return
      }

      const city = normalizeCityLabel(data?.user?.user_metadata || {})

      if (!city) {
        return
      }

      const key = city.toLowerCase()
      if (!cityMap.has(key)) {
        cityMap.set(key, city)
      }
    })
  )

  return [...cityMap.values()].sort((a, b) => a.localeCompare(b))
}

export async function getVerifiedProviders(filters = {}) {
  const supabase = await createAdminClient()
  const locationFilter = String(filters.location || '').trim().toLowerCase()
  
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

  const locationMetadataByUserId = {}
  if (locationFilter) {
    const uniqueUserIds = [...new Set(providers.map((provider) => provider.user_id).filter(Boolean))]
    const locationResults = await Promise.all(
      uniqueUserIds.map(async (userId) => {
        const { data, error } = await supabase.auth.admin.getUserById(userId)
        if (error) {
          console.error(`Error fetching auth metadata for user ${userId}:`, error)
          return [userId, null]
        }

        return [userId, data?.user?.user_metadata || null]
      })
    )

    locationResults.forEach(([userId, userMetadata]) => {
      locationMetadataByUserId[userId] = userMetadata
    })
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
  const providersWithListings = providers.map(provider => {
    const authMetadata = locationMetadataByUserId[provider.user_id] || null
    const metadataCity = typeof authMetadata?.city === 'string' && authMetadata.city.trim()
      ? authMetadata.city.trim()
      : (typeof authMetadata?.address === 'string' ? authMetadata.address.trim().split(',')[0].trim() : '')
    const metadataAddress = typeof authMetadata?.address === 'string' ? authMetadata.address.trim() : ''

    return {
      ...provider,
      provider_city: metadataCity,
      provider_address: metadataAddress,
      service_listings: listings?.filter(l => l.provider_id === provider.provider_id) || []
    }
  })

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
        provider.provider_city,
        provider.provider_address,
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

    if (locationFilter) {
      const u = Array.isArray(provider.users) ? provider.users[0] : provider.users
      const locationParts = [
        provider.provider_city,
        provider.provider_address,
        u?.city,
        u?.address,
      ]
        .filter(Boolean)
        .map((value) => String(value).toLowerCase())

      const matchesLocation = locationParts.some((value) => value.includes(locationFilter))
      if (!matchesLocation) return false
    }

    return true
  })
}

export async function getProviderById(providerId) {
  const supabase = await createAdminClient()
  
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

  // Fetch ratings — try direct provider_id lookup first, then fall back
  // to joining through bookings (in case ratings only stores booking_id FK).
  let ratings = null

  const { data: directRatings, error: ratingsError } = await supabase
    .from('ratings')
    .select(`
      rating_id,
      rating,
      review,
      created_at,
      customer_id,
      provider_id
    `)
    .eq('provider_id', providerId)
    .order('created_at', { ascending: false })

  if (ratingsError) {
    console.error('Error fetching ratings directly by provider_id:', ratingsError)

    // Fallback: join through bookings
    const { data: bookingRatings, error: bookingRatingsError } = await supabase
      .from('bookings')
      .select(`
        booking_id,
        ratings (
          rating_id,
          rating,
          review,
          created_at,
          customer_id
        )
      `)
      .eq('provider_id', providerId)
      .not('ratings', 'is', null)

    if (bookingRatingsError) {
      console.error('Error fetching ratings via bookings:', bookingRatingsError)
    } else {
      // Flatten nested ratings from bookings
      ratings = (bookingRatings || [])
        .flatMap(b => (b.ratings ? (Array.isArray(b.ratings) ? b.ratings : [b.ratings]) : []))
        .filter(Boolean)
        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    }
  } else {
    ratings = directRatings
  }

  return {
    ...provider,
    service_listings: listings || [],
    ratings: ratings || []
  }
}

export async function searchProviders(searchTerm) {
  const supabase = await createAdminClient()
  
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