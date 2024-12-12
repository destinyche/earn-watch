import { NextResponse } from "next/server"
import { connectDB } from "@/lib/db"
import { User } from "@/lib/models/User"
import { VideoAd } from "@/lib/models/VideoAd"

export async function GET() {
  try {
    await connectDB()
    
    // Get counts in parallel
    const [usersCount, videosCount] = await Promise.all([
      User.countDocuments(),
      VideoAd.countDocuments({ isActive: true })
    ])

    return NextResponse.json({
      totalUsers: usersCount,
      totalVideos: videosCount
    })
  } catch (error) {
    console.error('Error fetching admin stats:', error)
    return NextResponse.json(
      { error: "Failed to fetch admin stats" },
      { status: 500 }
    )
  }
} 