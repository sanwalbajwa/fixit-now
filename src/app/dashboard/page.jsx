import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/lib/actions/auth'

export default async function DashboardPage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect('/login')
  }

  const role = user.profile?.role

  if (role === 'customer') {
    redirect('/dashboard/customer')
  } else if (role === 'provider') {
    redirect('/dashboard/provider')
  } else if (role === 'admin') {
    redirect('/dashboard/admin')
  }

  return null
}