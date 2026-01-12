import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'

export default function Home() {
  return (
    <>
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-50 via-white to-blue-50 pt-20 pb-32">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <Badge className="bg-accent-100 text-accent-700 border-accent-200">
                🚀 #1 Home Services Platform
              </Badge>
              
              <h1 className="font-heading text-5xl lg:text-7xl font-bold leading-tight">
                Book Trusted
                <span className="text-gradient"> Home Services</span>
                <br />
                In Minutes
              </h1>
              
              <p className="text-lg text-slate-600 max-w-xl">
                Connect with verified professionals for plumbing, electrical, cleaning, carpentry, and more. Fast, reliable, and affordable.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/register">
                  <Button size="lg" className="gradient-primary text-white text-lg px-8 py-6">
                    Get Started Free
                  </Button>
                </Link>
                <Link href="#how-it-works">
                  <Button size="lg" variant="outline" className="text-lg px-8 py-6">
                    How It Works
                  </Button>
                </Link>
              </div>

              <div className="flex items-center gap-8 pt-4">
                <div>
                  <div className="font-heading text-3xl font-bold text-primary-600">1000+</div>
                  <div className="text-sm text-slate-600">Verified Providers</div>
                </div>
                <div className="h-12 w-px bg-slate-300"></div>
                <div>
                  <div className="font-heading text-3xl font-bold text-primary-600">50K+</div>
                  <div className="text-sm text-slate-600">Happy Customers</div>
                </div>
                <div className="h-12 w-px bg-slate-300"></div>
                <div>
                  <div className="font-heading text-3xl font-bold text-primary-600">4.9/5</div>
                  <div className="text-sm text-slate-600">Average Rating</div>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="relative z-10 rounded-2xl overflow-hidden card-shadow-lg">
                <img
                  src="https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800&q=80"
                  alt="Home Services"
                  className="w-full h-auto"
                />
              </div>
              <div className="absolute -bottom-6 -right-6 w-72 h-72 bg-primary-200 rounded-full blur-3xl opacity-30"></div>
              <div className="absolute -top-6 -left-6 w-72 h-72 bg-accent-200 rounded-full blur-3xl opacity-30"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <Badge className="mb-4 bg-primary-100 text-primary-700 border-primary-200">
              Our Services
            </Badge>
            <h2 className="font-heading text-4xl lg:text-5xl font-bold mb-4">
              Everything You Need,
              <span className="text-gradient"> All In One Place</span>
            </h2>
            <p className="text-lg text-slate-600">
              Browse through our wide range of home services and find the perfect professional for your needs.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((service, index) => (
              <Card key={index} className="border-2 hover:border-primary-300 hover:shadow-lg transition-all cursor-pointer group">
                <CardContent className="p-6 text-center space-y-4">
                  <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-4xl group-hover:scale-110 transition-transform">
                    {service.icon}
                  </div>
                  <h3 className="font-heading text-xl font-semibold">{service.name}</h3>
                  <p className="text-sm text-slate-600">{service.description}</p>
                  <div className="text-sm font-medium text-primary-600">
                    {service.providers} providers →
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <Badge className="mb-4 bg-secondary-100 text-secondary-700 border-secondary-200">
              Simple Process
            </Badge>
            <h2 className="font-heading text-4xl lg:text-5xl font-bold mb-4">
              Book Services In
              <span className="text-gradient"> 3 Easy Steps</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {steps.map((step, index) => (
              <div key={index} className="relative">
                <div className="bg-white rounded-2xl p-8 card-shadow">
                  <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center text-white font-bold text-xl mb-6">
                    {index + 1}
                  </div>
                  <h3 className="font-heading text-2xl font-semibold mb-4">{step.title}</h3>
                  <p className="text-slate-600">{step.description}</p>
                </div>
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 w-8 h-0.5 bg-primary-200"></div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-primary-600 to-accent-600">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-heading text-4xl lg:text-5xl font-bold text-white mb-6">
            Ready To Get Started?
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Join thousands of satisfied customers who trust FixItNow for their home service needs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register?role=customer">
              <Button size="lg" className="bg-white text-primary-600 hover:bg-slate-100 text-lg px-8 py-6">
                Book a Service
              </Button>
            </Link>
            <Link href="/register?role=provider">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 text-lg px-8 py-6">
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
    icon: '🔧',
    description: 'Pipe repairs, leak fixing, installations',
    providers: '150+'
  },
  {
    name: 'Electrical',
    icon: '⚡',
    description: 'Wiring, repairs, installations',
    providers: '120+'
  },
  {
    name: 'Cleaning',
    icon: '🧹',
    description: 'Home, office, deep cleaning',
    providers: '200+'
  },
  {
    name: 'Carpentry',
    icon: '🪚',
    description: 'Furniture, doors, custom woodwork',
    providers: '90+'
  },
  {
    name: 'Painting',
    icon: '🎨',
    description: 'Interior, exterior, wall treatment',
    providers: '110+'
  },
  {
    name: 'AC Repair',
    icon: '❄️',
    description: 'Installation, repair, maintenance',
    providers: '80+'
  },
  {
    name: 'Pest Control',
    icon: '🦟',
    description: 'Termite, mosquito, general pest',
    providers: '60+'
  },
  {
    name: 'Appliances',
    icon: '🔌',
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