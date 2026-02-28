import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Star, MapPin, CheckCircle, Briefcase } from 'lucide-react'

export default function ProviderCard({ provider }) {
  const user = provider.users
  const listings = provider.service_listings || []
  const primaryListing = listings[0]
  
  // Get unique categories
  const categories = [...new Set(listings.map(l => l.service_categories?.category_name).filter(Boolean))]
  
  return (
    <Card className="group hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 border-2 hover:border-emerald-400">
      <CardContent className="p-6 space-y-4">
        {/* Header with Avatar */}
        <div className="flex items-start gap-4">
          <div className="relative">
            {user?.profile_image_url ? (
              <img
                src={user.profile_image_url}
                alt={user?.name}
                className="w-16 h-16 rounded-full object-cover border-2 border-emerald-200"
              />
            ) : (
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-white text-2xl font-bold">
                {user?.name?.charAt(0) || 'P'}
              </div>
            )}
            {provider.is_verified && (
              <div className="absolute -bottom-1 -right-1 bg-emerald-500 rounded-full p-1">
                <CheckCircle className="w-4 h-4 text-white" />
              </div>
            )}
          </div>
          
          <div className="flex-1 min-w-0">
            <h3 className="font-heading text-xl font-bold text-slate-900 truncate">
              {user?.name || 'Provider'}
            </h3>
            
            {/* Rating */}
            <div className="flex items-center gap-2 mt-1">
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                <span className="font-semibold text-slate-900">
                  {provider.rating ? provider.rating.toFixed(1) : '0.0'}
                </span>
              </div>
              <span className="text-sm text-slate-500">
                ({provider.total_reviews || 0} reviews)
              </span>
            </div>
          </div>
        </div>

        {/* Categories */}
        {categories.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {categories.slice(0, 3).map((cat, idx) => (
              <Badge key={idx} className="bg-emerald-100 text-emerald-800 border-emerald-300">
                {cat}
              </Badge>
            ))}
            {categories.length > 3 && (
              <Badge variant="outline" className="text-slate-600">
                +{categories.length - 3} more
              </Badge>
            )}
          </div>
        )}

        {/* Skills */}
        {provider.skills && (
          <div className="flex items-start gap-2">
            <Briefcase className="w-4 h-4 text-slate-400 mt-0.5 flex-shrink-0" />
            <p className="text-sm text-slate-600 line-clamp-2">
              {provider.skills}
            </p>
          </div>
        )}

        {/* Primary Service & Price */}
        {primaryListing && (
          <div className="bg-slate-50 rounded-lg p-3">
            <div className="flex justify-between items-start gap-2">
              <div className="flex-1">
                <p className="font-semibold text-slate-900 line-clamp-1">
                  {primaryListing.title}
                </p>
                {primaryListing.description && (
                  <p className="text-sm text-slate-600 line-clamp-2 mt-1">
                    {primaryListing.description}
                  </p>
                )}
              </div>
              {primaryListing.price && (
                <div className="text-right flex-shrink-0">
                  <p className="text-xs text-slate-500">Starting at</p>
                  <p className="font-bold text-emerald-600 text-lg">
                    PKR {primaryListing.price}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Availability Badge */}
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${
            provider.availability === 'available' ? 'bg-green-500' : 'bg-amber-500'
          }`}></div>
          <span className="text-sm font-medium text-slate-700">
            {provider.availability === 'available' ? 'Available Now' : 'Busy'}
          </span>
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-2">
          <Link href={`/services/${provider.provider_id}`} className="flex-1">
            <Button variant="outline" className="w-full border-emerald-600 text-emerald-700 hover:bg-emerald-50">
              View Profile
            </Button>
          </Link>
          <Link href={`/dashboard/customer/book/${provider.provider_id}`} className="flex-1">
            <Button className="w-full gradient-primary text-white">
              Book Now
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}