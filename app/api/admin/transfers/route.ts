import { NextResponse } from "next/server"
import { connectDB } from "@/lib/db"
import { Transfer } from "@/lib/models/Transfer"
import { cookies } from 'next/headers'

const ADMIN_USERS = ['admin']

export async function GET(req: Request) {
  try {
    const cookieStore = cookies()
    const username = cookieStore.get('username')?.value
    
    if (!username || !ADMIN_USERS.includes(username)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    await connectDB()

    const transfers = await Transfer.find({ status: 'pending' })
      .populate('userId', 'username')
      .sort({ createdAt: -1 })

    return NextResponse.json({ transfers })
  } catch (error) {
    console.error('Error fetching transfers:', error)
    return NextResponse.json(
      { error: "Failed to fetch transfers" },
      { status: 500 }
    )
  }
} 