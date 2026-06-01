import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/lib/actions/auth'
import { getProviderBookings } from '@/lib/actions/bookings'
import ProviderBookingsClient from './ProviderBookingsClient'

export default async function ProviderBookingsPage() {
  const user = await getCurrentUser()
  if (!user) redirect('/login')

  const bookings = await getProviderBookings()

  return <ProviderBookingsClient bookings={bookings} />
}
