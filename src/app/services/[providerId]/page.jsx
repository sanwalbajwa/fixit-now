import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getProviderById } from '@/lib/actions/services'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { Star, MapPin, CheckCircle, Briefcase, Phone, Mail, Calendar, Award } from 'lucide-react'

export default async function ProviderDetailPage({ params }) {
  // Await params in Next.js 15+
  const { providerId } = await params
  const provider = await getProviderById(providerId)

  if (!provider) {
    notFound()
  }

  const user = Array.isArray(provider.users) ? provider.users[0] : provider.users
  const listings = provider.service_listings || []
  const ratings = provider.ratings || []

  // Get unique categories
  const categories = [...new Set(listings.map(l => l.service_categories?.category_name).filter(Boolean))]

  return (
    <>
      <Navbar />
      
      <div className="min-h-screen bg-slate-50">
        {/* Header Section */}
        <section className="bg-gradient-to-br from-emerald-50 to-emerald-100 py-12">
          <div className="container mx-auto px-4">
            <Link href="/services" className="text-emerald-600 hover:text-emerald-700 mb-4 inline-flex items-center gap-2">
              ← Back to Services
            </Link>
            
            <div className="bg-white rounded-2xl shadow-lg p-8 mt-4">
              <div className="flex flex-col md:flex-row gap-8">
                {/* Avatar */}
                <div className="relative flex-shrink-0">
                  {user?.profile_image_url ? (
                    <img
                      src={user.profile_image_url}
                      alt={user?.name}
                      className="w-32 h-32 rounded-2xl object-cover border-4 border-emerald-200"
                    />
                  ) : (
                    <div className="w-32 h-32 rounded-2xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-white text-5xl font-bold">
                      {user?.name?.charAt(0) || 'P'}
                    </div>
                  )}
                  {provider.is_verified && (
                    <div className="absolute -bottom-2 -right-2 bg-emerald-500 rounded-full p-2">
                      <CheckCircle className="w-6 h-6 text-white" />
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h1 className="font-heading text-4xl font-bold text-slate-900 mb-2">
                        {user?.name || user?.email?.split('@')[0] || 'Provider'}
                      </h1>
                      
                      {/* Rating */}
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          <Star className="w-6 h-6 fill-amber-400 text-amber-400" />
                          <span className="font-bold text-2xl text-slate-900">
                            {provider.rating ? provider.rating.toFixed(1) : '0.0'}
                          </span>
                          <span className="text-slate-500">
                            ({provider.total_reviews || 0} reviews)
                          </span>
                        </div>
                        
                        <Badge className={`${
                          provider.availability === 'available' 
                            ? 'bg-green-100 text-green-800 border-green-300' 
                            : 'bg-amber-100 text-amber-800 border-amber-300'
                        }`}>
                          {provider.availability === 'available' ? '✓ Available Now' : '⏳ Busy'}
                        </Badge>
                      </div>
                    </div>

                    <Link href={`/dashboard/customer/book/${provider.provider_id}`}>
                      <Button size="lg" className="gradient-primary text-white px-8">
                        Book Now
                      </Button>
                    </Link>
                  </div>

                  {/* Categories */}
                  {categories.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {categories.map((cat, idx) => (
                        <Badge key={idx} variant="outline" className="border-emerald-600 text-emerald-700">
                          {cat}
                        </Badge>
                      ))}
                    </div>
                  )}

                  {/* Contact Info */}
                  <div className="grid md:grid-cols-2 gap-4 mt-6">
                    {user?.email && (
                      <div className="flex items-center gap-2 text-slate-600">
                        <Mail className="w-4 h-4" />
                        <span className="text-sm">{user.email}</span>
                      </div>
                    )}
                    {user?.phone && (
                      <div className="flex items-center gap-2 text-slate-600">
                        <Phone className="w-4 h-4" />
                        <span className="text-sm">{user.phone}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="container mx-auto px-4 py-12">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* About */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Briefcase className="w-5 h-5" />
                    About
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-700 leading-relaxed">
                    {provider.skills || 'No description available.'}
                  </p>
                </CardContent>
              </Card>

              {/* Services Offered */}
              {listings.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Services Offered</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {listings.map((listing) => (
                      <div key={listing.listing_id} className="bg-slate-50 rounded-lg p-4 hover:bg-slate-100 transition">
                        <div className="flex justify-between items-start gap-4">
                          <div className="flex-1">
                            <h3 className="font-semibold text-lg text-slate-900 mb-1">
                              {listing.title}
                            </h3>
                            {listing.description && (
                              <p className="text-slate-600 text-sm">
                                {listing.description}
                              </p>
                            )}
                            {listing.service_categories && (
                              <Badge variant="outline" className="mt-2">
                                {listing.service_categories.category_name}
                              </Badge>
                            )}
                          </div>
                          {listing.price && (
                            <div className="text-right flex-shrink-0">
                              <p className="text-xs text-slate-500">Starting at</p>
                              <p className="font-bold text-emerald-600 text-xl">
                                PKR {listing.price.toLocaleString()}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              )}

              {/* Reviews */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Star className="w-5 h-5" />
                    Customer Reviews ({ratings.length})
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {ratings.length > 0 ? (
                    ratings.map((rating) => (
                      <div key={rating.rating_id} className="border-b pb-6 last:border-0">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-4 h-4 ${
                                  i < rating.rating
                                    ? 'fill-amber-400 text-amber-400'
                                    : 'text-slate-300'
                                }`}
                              />
                            ))}
                          </div>
                          <span className="font-semibold text-slate-900">
                            {rating.rating}/5
                          </span>
                        </div>
                        {rating.review && (
                          <p className="text-slate-700 mb-2">{rating.review}</p>
                        )}
                        <p className="text-sm text-slate-500">
                          {new Date(rating.created_at).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </p>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-slate-500">
                      <Award className="w-12 h-12 mx-auto mb-4 text-slate-300" />
                      <p>No reviews yet. Be the first to review!</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <Card className="sticky top-24">
                <CardHeader>
                  <CardTitle>Book This Provider</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="bg-emerald-50 rounded-lg p-4 border border-emerald-200">
                    <p className="text-sm text-emerald-800 mb-2">
                      <CheckCircle className="w-4 h-4 inline mr-1" />
                      Verified Professional
                    </p>
                    <p className="text-sm text-emerald-800">
                      <Award className="w-4 h-4 inline mr-1" />
                      {provider.total_reviews}+ Happy Customers
                    </p>
                  </div>

                  <Link href={`/dashboard/customer/book/${provider.provider_id}`}>
                    <Button className="w-full gradient-primary text-white h-12">
                      Book Appointment
                    </Button>
                  </Link>

                  <div className="text-center">
                    <p className="text-sm text-slate-600">
                      Response time: <span className="font-semibold">Within 2 hours</span>
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  )
}