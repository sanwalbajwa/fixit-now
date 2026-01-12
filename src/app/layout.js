import { Outfit, Nunito_Sans, Bebas_Neue } from 'next/font/google'
import './globals.css'

const outfit = Outfit({ 
  subsets: ['latin'],
  variable: '--font-outfit',
})

const nunitoSans = Nunito_Sans({ 
  subsets: ['latin'],
  variable: '--font-nunito-sans',
})

const bebasNeue = Bebas_Neue({ 
  weight: ['400'],
  subsets: ['latin'],
  variable: '--font-bebas-neue',
})

export const metadata = {
  title: 'FixItNow - Your Trusted Home Services Platform',
  description: 'Book verified professionals for plumbing, electrical, cleaning, carpentry and more. Fast, reliable, and affordable home services.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${nunitoSans.variable} ${outfit.variable} ${bebasNeue.variable}`}>
        {children}
      </body>
    </html>
  )
}