import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-md">
      <div className="container mx-auto flex h-20 items-center justify-between px-4">
        <Link href="/" className="flex items-center space-x-3">
          <img src="/fix-it-logo.png" alt="FixItNow" className="h-16 w-auto" />
          <span className="font-accent text-3xl font-semibold text-slate-900 hidden sm:block">
            FixItNow
          </span>
        </Link>

        <div className="hidden md:flex items-center space-x-8">
          <Link href="#services" className="text-sm font-medium text-slate-700 hover:text-red-400 transition-colors">
            Services
          </Link>
          <Link href="#how-it-works" className="text-sm font-medium text-slate-700 hover:text-red-400 transition-colors">
            How It Works
          </Link>
          <Link href="#about" className="text-sm font-medium text-slate-700 hover:text-red-400 transition-colors">
            About
          </Link>
        </div>

        <div className="flex items-center space-x-4">
          <Link href="/login">
            <Button variant="ghost">Sign In</Button>
          </Link>
          <Link href="/register">
            <Button className="gradient-primary text-white">
              Get Started
            </Button>
          </Link>
        </div>
      </div>
    </nav>
  )
}