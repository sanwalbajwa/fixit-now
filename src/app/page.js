import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import HandymanShowcase from '@/components/home/HandymanShowcase'
import { Wrench, Zap, Sparkles, Hammer, Paintbrush, Wind, Bug, Plug } from 'lucide-react'

export default function Home() {
  return (
    <>
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-50 via-white to-slate-100 pt-20 pb-32">
        {/* Decorative background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-red-200 rounded-full blur-3xl opacity-20"></div>
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-emerald-200 rounded-full blur-3xl opacity-20"></div>
        </div>

        <div className="container mx-auto px-4 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <Badge className="inline-flex items-center gap-2 bg-red-100 text-red-800 border-red-300 px-4 py-2 text-sm font-semibold shadow-sm">
                <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                Trusted home services marketplace
              </Badge>
              
              <h1 className="font-heading text-5xl lg:text-7xl font-bold leading-tight">
                Book Trusted
                <span className="block text-red-500 mt-2">Home Services</span>
                <span className="block text-slate-900 mt-2">In Minutes</span>
              </h1>
              
              <p className="text-xl text-slate-600 max-w-xl leading-relaxed">
                Connect with verified professionals for plumbing, electrical, cleaning, carpentry, and more. Fast booking, clear pricing, and polished service every time.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/register?role=customer">
                  <Button size="lg" className="gradient-primary text-white text-lg px-10 py-6 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all hover:scale-105 w-full sm:w-auto">
                    Get Started Free
                  </Button>
                </Link>
                <Link href="#how-it-works">
                  <Button size="lg" variant="outline" className="text-lg px-10 py-6 rounded-xl border-2 border-slate-300 hover:border-red-500 hover:bg-red-50 transition-all w-full sm:w-auto">
                    How It Works
                  </Button>
                </Link>
              </div>

              <div className="flex flex-wrap gap-3">
                {['Verified pros', 'Same-day support', 'Upfront pricing'].map((item) => (
                  <span key={item} className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 shadow-sm">
                    {item}
                  </span>
                ))}
              </div>

              <div className="grid grid-cols-3 gap-6 pt-8 border-t border-slate-200">
                <div className="text-center sm:text-left">
                  <div className="font-heading text-3xl lg:text-4xl font-bold text-red-500 mb-1">1000+</div>
                  <div className="text-sm text-slate-500 font-medium">Verified Providers</div>
                </div>
                <div className="text-center sm:text-left">
                  <div className="font-heading text-3xl lg:text-4xl font-bold text-red-500 mb-1">50K+</div>
                  <div className="text-sm text-slate-500 font-medium">Happy Customers</div>
                </div>
                <div className="text-center sm:text-left">
                  <div className="font-heading text-3xl lg:text-4xl font-bold text-red-500 mb-1">4.9/5</div>
                  <div className="text-sm text-slate-500 font-medium">Average Rating</div>
                </div>
              </div>
            </div>

            <div className="relative lg:h-[600px] flex items-center justify-center">
              <HandymanShowcase />
            </div>
          </div>
        </div>
      </section>

      {/* Featured Work */}
      <section className="py-24 bg-slate-950 text-white overflow-hidden">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:items-end">
            <div className="space-y-6">
              <Badge className="border-emerald-400/20 bg-emerald-400/10 text-emerald-200">Built for home jobs</Badge>
              <h2 className="font-heading text-4xl lg:text-5xl font-bold leading-tight">
                A landing page that feels like a real service marketplace.
              </h2>
              <p className="text-lg leading-relaxed text-white/75">
                Customers can picture the work, providers feel credible, and the visuals make the homepage feel alive instead of static.
              </p>
              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <div className="text-2xl font-bold text-emerald-300">24/7</div>
                  <div className="text-xs uppercase tracking-wide text-white/55">Support</div>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <div className="text-2xl font-bold text-emerald-300">Fast</div>
                  <div className="text-xs uppercase tracking-wide text-white/55">Booking</div>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <div className="text-2xl font-bold text-emerald-300">Local</div>
                  <div className="text-xs uppercase tracking-wide text-white/55">Experts</div>
                </div>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              {featuredCards.map((card) => (
                <div key={card.title} className="group overflow-hidden rounded-3xl border border-white/10 bg-white/5 shadow-2xl transition-transform duration-300 hover:-translate-y-1">
                  <div className="aspect-[4/5] overflow-hidden bg-slate-800">
                    <img src={card.image} alt={card.title} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
                  </div>
                  <div className="p-4">
                    <p className="text-xs uppercase tracking-[0.28em] text-white/50">{card.kicker}</p>
                    <h3 className="mt-2 text-xl font-bold text-white">{card.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-white/70">{card.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-28 bg-white">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-[1fr_1.1fr] lg:items-center">
            <div className="space-y-6">
              <Badge className="bg-amber-100 text-amber-800 border-amber-300 px-4 py-2 text-sm font-medium shadow-sm">
                Why homeowners choose FixItNow
              </Badge>
              <h2 className="font-heading text-4xl lg:text-5xl font-bold leading-tight text-slate-900">
                A cleaner way to book the right person for the job.
              </h2>
              <p className="text-xl leading-relaxed text-slate-600 max-w-2xl">
                From emergency fixes to routine maintenance, the platform makes it easy to discover trustworthy pros, compare options, and book with confidence.
              </p>

              <div className="grid gap-4 sm:grid-cols-2">
                {benefits.map((benefit) => (
                  <Card key={benefit.title} className="border-2 border-slate-100 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300">
                    <CardContent className="p-6 space-y-3">
                      <div className="flex items-center justify-between gap-3">
                        <h3 className="text-lg font-bold text-slate-900">{benefit.title}</h3>
                        <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">{benefit.badge}</span>
                      </div>
                      <p className="text-sm leading-6 text-slate-600">{benefit.description}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {proofCards.map((card, index) => (
                <div
                  key={card.title}
                  className={`group overflow-hidden rounded-[2rem] border bg-white shadow-xl ${index === 0 ? 'sm:col-span-2' : ''}`}
                >
                  <div className={index === 0 ? 'relative h-80' : 'relative h-64'}>
                    <Image src={card.image} alt={card.title} fill className="object-cover transition duration-500 group-hover:scale-105" sizes="(max-width: 768px) 100vw, 50vw" />
                  </div>
                  <div className="p-5">
                    <p className="text-xs uppercase tracking-[0.28em] text-slate-400">{card.kicker}</p>
                    <h3 className="mt-2 text-2xl font-bold text-slate-900">{card.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-slate-600">{card.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-28 bg-white">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <Badge className="mb-6 bg-emerald-100 text-emerald-800 border-emerald-300 px-4 py-2 text-sm font-medium shadow-sm">
              Our Services
            </Badge>
            <h2 className="font-heading text-4xl lg:text-5xl font-bold mb-6 leading-tight">
              Everything You Need,
              <span className="text-red-500 block mt-2">All In One Place</span>
            </h2>
            <p className="text-xl text-slate-600 leading-relaxed">
              Browse through our wide range of home services and find the perfect professional for your needs.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.map((service, index) => (
              <Card key={index} className="border-2 border-slate-200 hover:border-red-400 hover:shadow-2xl transition-all duration-300 cursor-pointer group rounded-2xl overflow-hidden">
                <CardContent className="p-8 text-center space-y-5">
                  <div className="w-20 h-20 mx-auto rounded-2xl gradient-primary flex items-center justify-center text-white group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-lg">
                    {service.icon}
                  </div>
                  <h3 className="font-heading text-2xl font-bold text-slate-900">{service.name}</h3>
                  <p className="text-lg text-slate-600 leading-relaxed">{service.description}</p>
                  <div className="text-base font-semibold text-red-500 group-hover:text-red-600 flex items-center justify-center gap-2">
                    {service.providers} providers
                    <span className="group-hover:translate-x-1 transition-transform">→</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Real Projects Gallery */}
      <section className="py-28 bg-slate-50">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between mb-12">
            <div className="max-w-3xl space-y-4">
              <Badge className="bg-slate-900 text-white px-4 py-2 text-sm font-medium shadow-sm">Real jobs, real photos</Badge>
              <h2 className="font-heading text-4xl lg:text-5xl font-bold leading-tight text-slate-900">
                High-definition visuals that make the service feel tangible.
              </h2>
              <p className="text-xl text-slate-600 leading-relaxed">
                Use the image-led sections to showcase the quality of the work, not just the category names.
              </p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-sm">
              <p className="text-sm font-medium text-slate-500">Popular categories</p>
              <p className="mt-1 text-lg font-semibold text-slate-900">Plumbing, electrical, painting, and repairs</p>
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            {galleryCards.map((card) => (
              <Card key={card.title} className="overflow-hidden rounded-[2rem] border-0 shadow-xl bg-white">
                <div className="relative h-72">
                  <Image src={card.image} alt={card.title} fill className="object-cover" sizes="(max-width: 1024px) 100vw, 33vw" />
                </div>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between gap-3">
                    <h3 className="text-2xl font-bold text-slate-900">{card.title}</h3>
                    <Badge variant="outline">{card.tag}</Badge>
                  </div>
                  <p className="mt-3 text-sm leading-6 text-slate-600">{card.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-28 bg-gradient-to-br from-slate-50 to-emerald-50/30">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <Badge className="mb-6 bg-emerald-100 text-emerald-800 border-emerald-300 px-4 py-2 text-sm font-medium shadow-sm">
              Simple Process
            </Badge>
            <h2 className="font-heading text-4xl lg:text-5xl font-bold mb-6 leading-tight">
              Book Services In
              <span className="text-emerald-600 block mt-2">3 Easy Steps</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-12 max-w-6xl mx-auto">
            {steps.map((step, index) => (
              <div key={index} className="relative">
                <div className="bg-white rounded-3xl p-10 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
                  <div className="w-16 h-16 rounded-2xl gradient-primary flex items-center justify-center text-white font-heading font-bold text-2xl mb-8 shadow-lg">
                    {index + 1}
                  </div>
                  <h3 className="font-heading text-2xl font-bold mb-5 text-slate-900">{step.title}</h3>
                  <p className="text-slate-600 text-lg leading-relaxed">{step.description}</p>
                </div>
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-1/2 -right-6 w-12 h-0.5 bg-gradient-to-r from-red-400 to-transparent"></div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-24 bg-emerald-600 overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
            backgroundSize: '40px 40px'
          }}></div>
        </div>
        
        {/* Decorative shapes */}
        <div className="absolute top-0 left-0 w-64 h-64 bg-emerald-700 rounded-full blur-3xl opacity-30"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-emerald-400 rounded-full blur-3xl opacity-20"></div>

        <div className="container mx-auto px-4 lg:px-8 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="font-accent text-4xl lg:text-5xl font-black text-white mb-6 leading-tight">
              Ready To Get Started?
            </h2>
            <p className="text-xl text-white/95 mb-10 leading-relaxed">
              Join thousands of satisfied customers who trust FixItNow for their home service needs. Get matched with verified professionals in minutes.
            </p>
            
            {/* Trust badges */}
            <div className="flex flex-wrap justify-center gap-8 mb-12">
              <div className="flex items-center gap-2 text-white/90">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="font-semibold">Verified Professionals</span>
              </div>
              <div className="flex items-center gap-2 text-white/90">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
                </svg>
                <span className="font-semibold">24/7 Support</span>
              </div>
              <div className="flex items-center gap-2 text-white/90">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                </svg>
                <span className="font-semibold">100% Satisfaction</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/register?role=customer">
                <Button size="lg" className="bg-white text-emerald-700 hover:bg-slate-100 text-lg px-10 py-6 rounded-xl font-bold shadow-2xl hover:shadow-white/50 transition-all hover:scale-105 w-full sm:w-auto">
                  Book a Service
                </Button>
              </Link>
              <Link href="/register?role=provider">
                <Button size="lg" className="gradient-primary text-white hover:opacity-90 text-lg px-10 py-6 rounded-xl font-bold shadow-2xl transition-all hover:scale-105 w-full sm:w-auto">
                  Become a Provider
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  )
}

const services = [
  {
    name: 'Plumbing',
    icon: <Wrench className="w-8 h-8" />,
    description: 'Pipe repairs, leak fixing, installations',
    providers: '150+'
  },
  {
    name: 'Electrical',
    icon: <Zap className="w-8 h-8" />,
    description: 'Wiring, repairs, installations',
    providers: '120+'
  },
  {
    name: 'Cleaning',
    icon: <Sparkles className="w-8 h-8" />,
    description: 'Home, office, deep cleaning',
    providers: '200+'
  },
  {
    name: 'Carpentry',
    icon: <Hammer className="w-8 h-8" />,
    description: 'Furniture, doors, custom woodwork',
    providers: '90+'
  },
  {
    name: 'Painting',
    icon: <Paintbrush className="w-8 h-8" />,
    description: 'Interior, exterior, wall treatment',
    providers: '110+'
  },
  {
    name: 'AC Repair',
    icon: <Wind className="w-8 h-8" />,
    description: 'Installation, repair, maintenance',
    providers: '80+'
  },
  {
    name: 'Pest Control',
    icon: <Bug className="w-8 h-8" />,
    description: 'Termite, mosquito, general pest',
    providers: '60+'
  },
  {
    name: 'Appliances',
    icon: <Plug className="w-8 h-8" />,
    description: 'Fridge, washing machine, microwave',
    providers: '100+'
  },
]

const steps = [
  {
    title: 'Choose Service',
    description: 'Browse and select from our wide range of home services'
  },
  {
    title: 'Book Provider',
    description: 'Pick a verified professional based on ratings and availability'
  },
  {
    title: 'Get It Done',
    description: 'Relax while our expert completes your job perfectly'
  },
]

const featuredCards = [
  {
    title: 'Handyman Fixes',
    kicker: 'Home repair',
    image: 'https://images.unsplash.com/photo-1581141849291-1125c7b692b5?q=80&w=1000&auto=format&fit=crop',
    description: 'Perfect for quick fixes, furniture assembly, and on-site repairs that need a trusted set of hands.',
  },
  {
    title: 'Electrical Help',
    kicker: 'Safe work',
    image: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?q=80&w=1000&auto=format&fit=crop',
    description: 'Showcase electricians, maintenance work, and clean utility-focused service visuals.',
  },
  {
    title: 'All Tools Ready',
    kicker: 'Maintenance',
    image: 'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?q=80&w=1000&auto=format&fit=crop',
    description: 'A flexible image that feels at home on a handyman platform and supports broad services.',
  },
]

const benefits = [
  {
    title: 'Verified professionals',
    badge: 'Trust',
    description: 'Highlight review scores, identity checks, and provider profiles so customers know who is showing up.',
  },
  {
    title: 'Fast booking flow',
    badge: 'Speed',
    description: 'Turn the browsing experience into a clear, low-friction path from discovery to booking.',
  },
  {
    title: 'Clear service scope',
    badge: 'Clarity',
    description: 'Show price bands, availability, and job details before the customer commits.',
  },
  {
    title: 'Built for repeat use',
    badge: 'Retention',
    description: 'Make the homepage feel reliable enough that users come back the next time a home job appears.',
  },
]

const proofCards = [
  {
    kicker: 'Hero shot',
    title: 'Weekend repairs',
    image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?q=80&w=1000&auto=format&fit=crop',
    description: 'A confident, inviting visual for general handyman services and quick home fixes.',
  },
  {
    kicker: 'Service mood',
    title: 'Electrical support',
    image: 'https://images.unsplash.com/photo-1555963966-b7ae5404b6ed?q=80&w=1000&auto=format&fit=crop',
    description: 'Use this tighter image for technical work, safety-first service, and utility jobs.',
  },
  {
    kicker: 'Support view',
    title: 'Ready when needed',
    image: 'https://images.unsplash.com/photo-1505798577917-a65157d3320a?q=80&w=1000&auto=format&fit=crop',
    description: 'A flexible image that helps the brand feel polished and broad enough for many categories.',
  },
]

const galleryCards = [
  {
    title: 'Quick fixes',
    tag: 'Handyman',
    image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?q=80&w=1000&auto=format&fit=crop',
    description: 'Showcases the type of everyday repair customers book most often, from small installs to furniture assembly.',
  },
  {
    title: 'Safe wiring',
    tag: 'Electric',
    image: 'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?q=80&w=1000&auto=format&fit=crop',
    description: 'A stronger visual for technical service categories where trust and precision matter most.',
  },
  {
    title: 'Reliable maintenance',
    tag: 'General',
    image: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=1000&auto=format&fit=crop',
    description: 'Good for broad maintenance, appliance support, and recurring service requests across the platform.',
  },
]