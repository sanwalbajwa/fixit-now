import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="border-t bg-slate-50">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg gradient-primary">
                <span className="font-accent text-xl font-bold text-white">F</span>
              </div>
              <span className="font-accent text-2xl font-bold text-gradient">
                FixItNow
              </span>
            </div>
            <p className="text-sm text-slate-600">
              Your trusted platform for home services. Connect with verified professionals instantly.
            </p>
          </div>

          <div>
            <h3 className="font-heading font-semibold mb-4">Services</h3>
            <ul className="space-y-2 text-sm text-slate-600">
              <li><Link href="#" className="hover:text-primary-600">Plumbing</Link></li>
              <li><Link href="#" className="hover:text-primary-600">Electrical</Link></li>
              <li><Link href="#" className="hover:text-primary-600">Cleaning</Link></li>
              <li><Link href="#" className="hover:text-primary-600">Carpentry</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-heading font-semibold mb-4">Company</h3>
            <ul className="space-y-2 text-sm text-slate-600">
              <li><Link href="#" className="hover:text-primary-600">About Us</Link></li>
              <li><Link href="#" className="hover:text-primary-600">Contact</Link></li>
              <li><Link href="#" className="hover:text-primary-600">Careers</Link></li>
              <li><Link href="#" className="hover:text-primary-600">Blog</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-heading font-semibold mb-4">Legal</h3>
            <ul className="space-y-2 text-sm text-slate-600">
              <li><Link href="#" className="hover:text-primary-600">Privacy Policy</Link></li>
              <li><Link href="#" className="hover:text-primary-600">Terms of Service</Link></li>
              <li><Link href="#" className="hover:text-primary-600">Refund Policy</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t text-center text-sm text-slate-600">
          <p>© 2025 FixItNow. All rights reserved. Built by Muhammad Yar Sanwal</p>
        </div>
      </div>
    </footer>
  )
}