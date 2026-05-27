import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createAdminClient } from '@/lib/supabase/server'
import { getCurrentUser } from '@/lib/actions/auth'
import ChatBox from '@/components/ChatBox'

function getRelationRecord(value) {
  if (Array.isArray(value)) return value[0] || null
  return value || null
}

export default async function ChatPage({ params }) {
  const { bookingId } = await params
  const user = await getCurrentUser()
  if (!user) redirect('/login')

  const supabase = createAdminClient()
  
  const { data: booking, error } = await supabase
    .from('bookings')
    .select(`
      booking_id,
      provider_id,
      customer_id,
      customers(customer_id, user_id, users(name)),
      service_providers(provider_id, user_id, users(name))
    `)
    .eq('booking_id', bookingId)
    .maybeSingle()
    
  if (error || !booking) {
    return <div className="text-center py-10">Booking not found.</div>
  }

  const customerRecord = getRelationRecord(booking.customers)
  const providerRecord = getRelationRecord(booking.service_providers)
  
  const isCustomer = customerRecord?.user_id === user.id
  const isProvider = providerRecord?.user_id === user.id || booking.provider_id === user.id
  
  if (!isCustomer && !isProvider) {
    return <div className="text-center py-10">Unauthorized access.</div>
  }
  
  const otherUserId = isCustomer ? providerRecord?.user_id : customerRecord?.user_id
  const otherUserName = isCustomer
    ? getRelationRecord(providerRecord?.users)?.name
    : getRelationRecord(customerRecord?.users)?.name

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
