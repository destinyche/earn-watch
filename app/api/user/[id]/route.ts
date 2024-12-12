import { NextResponse } from "next/server"
import { connectDB } from "@/lib/db"
import { User } from "@/lib/models/User"

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    await connectDB()
    
    const user = await User.findById(id).select('-password')
    
    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      )
    }

    return NextResponse.json({
      username: user.username,
      balance: user.balance,
      watchBalance: user.watchBalance || 0,
      hasPaidInitialFee: user.hasPaidInitialFee
    })
  } catch (error) {
    console.error('Error fetching user:', error)
    return NextResponse.json(
      { error: "Failed to fetch user data" },
      { status: 500 }
    )
  }
}

