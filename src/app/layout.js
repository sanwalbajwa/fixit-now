import { Inter, Poppins, Space_Grotesk } from 'next/font/google'
import './globals.css'

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
})

const poppins = Poppins({ 
  weight: ['400', '500', '600', '700', '800', '900'],
  subsets: ['latin'],
  variable: '--font-poppins',
})

const spaceGrotesk = Space_Grotesk({ 
  subsets: ['latin'],
  variable: '--font-space-grotesk',
})

export const metadata = {
  title: 'FixItNow - Your Trusted Home Services Platform',
  description: 'Book verified professionals for plumbing, electrical, cleaning, carpentry and more. Fast, reliable, and affordable home services.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${poppins.variable} ${spaceGrotesk.variable}`}>
        {children}
      </body>
    </html>
  )
}