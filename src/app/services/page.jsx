import { Suspense } from 'react'
import Link from 'next/link'
import { getAllCategories, getVerifiedProviders } from '@/lib/actions/services'
import ProviderCard from '@/components/ProviderCard'
import ServicesSortFilter from '@/components/ServicesSortFilter'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { Search, SlidersHorizontal } from 'lucide-react'

async function ServicesContent({ searchParams }) {
  const categories = await getAllCategories()
  const providers = await getVerifiedProviders({
    category_id: searchParams?.category,
    min_rating: searchParams?.rating,
    sort_by: searchParams?.sort
  })

  const selectedCategory = searchParams?.category

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-emerald-50 to-emerald-100 py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="font-heading text-5xl font-bold text-slate-900 mb-4">
              Find Your Perfect
              <span className="text-emerald-600 block mt-2">Service Provider</span>
            </h1>
            <p className="text-xl text-slate-600 mb-8">
              Browse through {providers.length}+ verified professionals ready to help
            </p>

            {/* Search Bar */}
            <div className="bg-white rounded-2xl shadow-lg p-2 flex items-center gap-2">
              <Search className="w-5 h-5 text-slate-400 ml-4" />
              <input
                type="text"
                placeholder="Search by service, skills, or provider name..."
                className="flex-1 px-4 py-3 outline-none text-slate-900"
              />
              <Button className="gradient-primary text-white px-8">
                Search
              </Button>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar - Filters */}
          <aside className="lg:col-span-1 space-y-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <SlidersHorizontal className="w-5 h-5 text-slate-700" />
                  <h2 className="font-heading text-xl font-bold">Filters</h2>
                </div>

                {/* Categories */}
                <div className="space-y-3">
                  <h3 className="font-semibold text-slate-900 mb-3">Categories</h3>
                  <Link href="/services">
                    <Button
                      variant={!selectedCategory ? 'default' : 'outline'}
                      className="w-full justify-start"
                    >
                      All Services
                    </Button>
                  </Link>
                  {categories.map((category) => (
                    <Link
                      key={category.category_id}
                      href={`/services?category=${category.category_id}`}
                    >
                      <Button
                        variant={selectedCategory === category.category_id ? 'default' : 'outline'}
                        className="w-full justify-start"
                      >
                        <span className="mr-2">{category.icon_url}</span>
                        {category.category_name}
                      </Button>
                    </Link>
                  ))}
                </div>

                {/* Rating Filter */}
                <div className="space-y-3 mt-6">
                  <h3 className="font-semibold text-slate-900 mb-3">Minimum Rating</h3>
                  {[4.5, 4.0, 3.5, 3.0].map((rating) => (
                    <Link key={rating} href={`/services?rating=${rating}`}>
                      <Button variant="outline" className="w-full justify-start">
                        ⭐ {rating}+ Stars
                      </Button>
                    </Link>
                  ))}
                </div>

                {/* Clear Filters */}
                {(selectedCategory || searchParams?.rating) && (
                  <Link href="/services">
                    <Button variant="ghost" className="w-full mt-4 text-red-600">
                      Clear All Filters
                    </Button>
                  </Link>
                )}
              </CardContent>
            </Card>
          </aside>

          {/* Main Content - Providers Grid */}
          <main className="lg:col-span-3">
            {/* Sort & Results Header */}
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="font-heading text-2xl font-bold text-slate-900">
                  {selectedCategory 
                    ? categories.find(c => c.category_id === selectedCategory)?.category_name + ' Providers'
                    : 'All Providers'
                  }
                </h2>
                <p className="text-slate-600 mt-1">
                  {providers.length} professionals available
                </p>
              </div>

              {/* Sort Dropdown - Client Component */}
              <ServicesSortFilter />
            </div>

            {/* Providers Grid */}
            {providers.length > 0 ? (
              <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
                {providers.map((provider) => (
                  <ProviderCard key={provider.provider_id} provider={provider} />
                ))}
              </div>
            ) : (
              <Card className="p-12 text-center">
                <div className="max-w-md mx-auto">
                  <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Search className="w-12 h-12 text-slate-400" />
                  </div>
                  <h3 className="font-heading text-2xl font-bold text-slate-900 mb-2">
                    No Providers Found
                  </h3>
                  <p className="text-slate-600 mb-6">
                    We couldn't find any providers matching your criteria. Try adjusting your filters.
                  </p>
                  <Link href="/services">
                    <Button className="gradient-primary text-white">
                      View All Providers
                    </Button>
                  </Link>
                </div>
              </Card>
            )}
          </main>
        </div>
      </div>

      <Footer />
    </div>
  )
}

export default function ServicesPage({ searchParams }) {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
      </div>
    }>
      <ServicesContent searchParams={searchParams} />
    </Suspense>
  )
}