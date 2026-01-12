import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { Wrench, Zap, Sparkles, Hammer, Paintbrush, Wind, Bug, Plug } from 'lucide-react'

export default function Home() {
  return (
    <>
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-50 via-white to-slate-100 pt-32 pb-40">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-10 animate-fade-in">
              <Badge className="inline-flex items-center gap-2 bg-red-100 text-red-800 border-red-300 px-4 py-2 text-sm font-medium shadow-sm">
                <span className="animate-pulse">⚡</span> #1 Home Services Platform
              </Badge>
              
              <h1 className="font-heading text-5xl lg:text-7xl font-bold leading-tight">
                Book Trusted
                <span className="block text-red-500 mt-2">Home Services</span>
                <span className="block text-slate-900 mt-2">In Minutes</span>
              </h1>
              
              <p className="text-xl text-slate-600 max-w-xl leading-relaxed">
                Connect with verified professionals for plumbing, electrical, cleaning, carpentry, and more. Fast, reliable, and affordable.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Link href="/register">
                  <Button size="lg" className="gradient-primary text-white text-lg px-10 py-7 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all hover:scale-105">
                    Get Started Free
                  </Button>
                </Link>
                <Link href="#how-it-works">
                  <Button size="lg" variant="outline" className="text-lg px-10 py-7 rounded-xl border-2 border-slate-300 hover:border-red-500 hover:bg-red-50 transition-all">
                    How It Works
                  </Button>
                </Link>
              </div>

              <div className="grid grid-cols-3 gap-6 pt-8 border-t border-slate-200">
                <div className="text-center sm:text-left">
                  <div className="font-heading text-4xl font-bold text-red-500 mb-1">1000+</div>
                  <div className="text-sm text-slate-500 font-medium">Verified Providers</div>
                </div>
                <div className="text-center sm:text-left">
                  <div className="font-heading text-4xl font-bold text-red-500 mb-1">50K+</div>
                  <div className="text-sm text-slate-500 font-medium">Happy Customers</div>
                </div>
                <div className="text-center sm:text-left">
                  <div className="font-heading text-4xl font-bold text-red-500 mb-1">4.9/5</div>
                  <div className="text-sm text-slate-500 font-medium">Average Rating</div>
                </div>
              </div>
            </div>

            <div className="relative lg:h-[600px] flex items-center justify-center">
              <div className="relative z-10 rounded-3xl overflow-hidden shadow-2xl transform hover:scale-105 transition-transform duration-500">
                <img
                  src="https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=900&q=80"
                  alt="Home Services"
                  className="w-full h-auto"
                />
              </div>
              <div className="absolute -bottom-8 -right-8 w-80 h-80 bg-red-200 rounded-full blur-3xl opacity-20 animate-pulse"></div>
              <div className="absolute -top-8 -left-8 w-80 h-80 bg-emerald-200 rounded-full blur-3xl opacity-20 animate-pulse" style={{animationDelay: '1s'}}></div>
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
      <section className="py-32 bg-emerald-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxNCAwIDYgMi42ODYgNiA2cy0yLjY4NiA2LTYgNi02LTIuNjg2LTYtNiAyLjY4Ni02IDYtNnoiIHN0cm9rZT0iI2ZmZiIgc3Ryb2tlLW9wYWNpdHk9Ii4xIi8+PC9nPjwvc3ZnPg==')] opacity-10"></div>
        <div className="container mx-auto px-4 lg:px-8 text-center relative z-10">
          <h2 className="font-accent text-4xl lg:text-5xl font-black text-white mb-8 leading-tight">
            Ready To Get Started?
          </h2>
          <p className="text-xl text-white/95 mb-12 max-w-3xl mx-auto leading-relaxed">
            Join thousands of satisfied customers who trust FixItNow for their home service needs.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link href="/register?role=customer">
              <Button size="lg" className="bg-white text-red-500 hover:bg-slate-100 text-lg px-12 py-7 rounded-xl font-bold shadow-2xl hover:shadow-white/50 transition-all hover:scale-105">
                Book a Service
              </Button>
            </Link>
            <Link href="/register?role=provider">
              <Button size="lg" variant="outline" className="border-2 border-white text-white hover:bg-white/20 text-lg px-12 py-7 rounded-xl font-bold backdrop-blur-sm transition-all hover:scale-105">
                Become a Provider
              </Button>
            </Link>
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