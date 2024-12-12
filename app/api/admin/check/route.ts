import { NextResponse } from "next/server"
import { cookies } from 'next/headers'

const ADMIN_USERS = ['admin']

export async function GET() {
  try {
    const cookieStore = cookies()
    const username = cookieStore.get('username')?.value
    
    if (!username || !ADMIN_USERS.includes(username)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    return NextResponse.json({ isAdmin: true })
  } catch (error) {
    console.error('Admin check error:', error)
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
} 