import { redirect } from 'next/navigation'
import { getCurrentUser, signout } from '@/lib/actions/auth'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default async function CustomerDashboard() {
  const user = await getCurrentUser()

  if (!user) {
    redirect('/login')
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <nav className="bg-white border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg gradient-primary">
              <span className="font-accent text-xl font-bold text-white">F</span>
            </div>
            <span className="font-accent text-2xl font-bold text-gradient">FixItNow</span>
          </div>
          <form action={signout}>
            <Button variant="outline">Sign Out</Button>
          </form>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-heading font-bold mb-2">
            Welcome, {user.profile?.name}! 👋
          </h1>
          <p className="text-slate-600">Customer Dashboard</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Active Bookings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-primary-600">0</div>
              <p className="text-sm text-slate-600">No active bookings</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Completed</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-success">0</div>
              <p className="text-sm text-slate-600">Services completed</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Total Spent</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-secondary-600">PKR 0</div>
              <p className="text-sm text-slate-600">Lifetime spending</p>
            </CardContent>
          </Card>
        </div>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button className="w-full gradient-primary text-white">
              🔍 Browse Services
            </Button>
            <Button className="w-full" variant="outline">
              📋 View My Bookings
            </Button>
            <Button className="w-full" variant="outline">
              👤 Edit Profile
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}