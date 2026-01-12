import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-md">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center space-x-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg gradient-primary">
            <span className="font-accent text-xl font-bold text-white">F</span>
          </div>
          <span className="font-accent text-2xl font-bold text-gradient">
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