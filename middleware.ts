import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Add admin usernames here
const ADMIN_USERS = ['admin'] // You can add more admin usernames

export function middleware(request: NextRequest) {
  // Only run middleware on admin routes
  if (request.nextUrl.pathname.startsWith('/admin') || request.nextUrl.pathname.startsWith('/api/admin')) {
    const userId = request.cookies.get('userId')
    const username = request.cookies.get('username')

    // Check if user is logged in and is an admin
    if (!userId?.value || !username?.value || !ADMIN_USERS.includes(username.value)) {
      // If accessing API route, return JSON response
      if (request.nextUrl.pathname.startsWith('/api/admin')) {
        return new NextResponse(
          JSON.stringify({ error: 'Unauthorized' }),
          {
            status: 401,
            headers: {
              'Content-Type': 'application/json',
            },
          }
        )
      }
      
      // If accessing admin pages, redirect to login
      const loginUrl = new URL('/login', request.url)
      loginUrl.searchParams.set('from', request.nextUrl.pathname)
      return NextResponse.redirect(loginUrl)
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*']
} 