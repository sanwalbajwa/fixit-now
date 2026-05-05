import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { getCurrentUser } from '@/lib/actions/auth'
import ChatBox from '@/components/ChatBox'
import { Button } from '@/components/ui/button'

export default async function ChatPage({ params }) {
  const { bookingId } = params
  const user = await getCurrentUser()
  if (!user) redirect('/login')

  const supabase = await createClient()
  
  const { data: booking, error } = await supabase
    .from('bookings')
    .select(`
      *,
      customers(user_id, users(name)),
      service_providers(user_id, users(name))
    `)
    .eq('booking_id', bookingId)
    .single()
    
  if (error || !booking) {
    return <div className="text-center py-10">Booking not found.</div>
  }
  
  const isCustomer = booking.customers?.user_id === user.id
  const isProvider = booking.service_providers?.user_id === user.id
  
  if (!isCustomer && !isProvider) {
    return <div className="text-center py-10">Unauthorized access.</div>
  }
  
  const otherUserId = isCustomer ? booking.service_providers.user_id : booking.customers.user_id
  const otherUserName = isCustomer ? booking.service_providers.users?.name : booking.customers.users?.name

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <div className="flex items-center justify-between mb-6">
        <div>
          <Link href={isCustomer ? "/dashboard/customer/bookings" : "/dashboard/provider/bookings"} className="text-sm text-slate-500 hover:text-slate-800 mb-2 inline-block">
            ← Back to bookings
          </Link>
          <h1 className="text-2xl font-bold text-slate-900">Chat with {otherUserName || 'User'}</h1>
          <p className="text-sm text-slate-500">Discussing Booking #{bookingId.split('-')[0]}</p>
        </div>
      </div>
      
      <ChatBox 
        bookingId={bookingId} 
        currentUserId={user.id} 
        otherUserId={otherUserId} 
      />
    </div>
  )
}
