import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/lib/actions/auth'
import { getCustomerBookings } from '@/lib/actions/bookings'
import BookingsClient from './BookingsClient'

export default async function CustomerBookingsPage() {
  const user = await getCurrentUser()
  if (!user) redirect('/login')

  const bookings = await getCustomerBookings()

  return <BookingsClient bookings={bookings} />
}
