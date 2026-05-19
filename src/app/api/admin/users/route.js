import { getAdminUsers } from '@/lib/actions/admin'

export async function GET(request) {
  try {
    const users = await getAdminUsers()
    return Response.json(users)
  } catch (error) {
    console.error('API error:', error)
    return Response.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch users' },
      { status: 500 }
    )
  }
}
