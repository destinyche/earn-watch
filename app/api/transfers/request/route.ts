import { NextResponse } from "next/server"
import { connectDB } from "@/lib/db"
import { User } from "@/lib/models/User"
import { Transfer } from "@/lib/models/Transfer"

export async function POST(req: Request) {
  try {
    const { userId, amount } = await req.json()

    if (!userId || !amount) {
      return NextResponse.json(
        { error: "User ID and amount are required" },
        { status: 400 }
      )
    }

    await connectDB()

    // Get user and check watch balance
    const user = await User.findById(userId)
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Check minimum transfer amount
    if (user.watchBalance < 2000) {
      return NextResponse.json(
        { error: "Minimum transfer amount is 2000 XAF" },
        { status: 400 }
      )
    }

    // Create transfer request
    const transfer = await Transfer.create({
      userId,
      amount: user.watchBalance,
      status: 'pending'
    })

    // Deduct from watch balance
    await User.findByIdAndUpdate(userId, {
      $set: { watchBalance: 0 }
    })

    return NextResponse.json({
      message: "Transfer request submitted successfully",
      transferId: transfer._id
    })
  } catch (error) {
    console.error('Transfer request error:', error)
    return NextResponse.json(
      { error: "Failed to process transfer request" },
      { status: 500 }
    )
  }
} 