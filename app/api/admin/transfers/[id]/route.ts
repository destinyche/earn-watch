import { NextResponse } from "next/server"
import { connectDB } from "@/lib/db"
import { User } from "@/lib/models/User"
import { Transfer } from "@/lib/models/Transfer"
import { cookies } from 'next/headers'

const ADMIN_USERS = ['admin']

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Check admin authorization
    const cookieStore = cookies()
    const username = cookieStore.get('username')?.value
    
    if (!username || !ADMIN_USERS.includes(username)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { action } = await req.json()
    if (!['approve', 'reject'].includes(action)) {
      return NextResponse.json(
        { error: "Invalid action" },
        { status: 400 }
      )
    }

    await connectDB()

    const transfer = await Transfer.findById(params.id)
    if (!transfer) {
      return NextResponse.json({ error: "Transfer not found" }, { status: 404 })
    }

    if (transfer.status !== 'pending') {
      return NextResponse.json(
        { error: "Transfer has already been processed" },
        { status: 400 }
      )
    }

    if (action === 'approve') {
      // Add to main balance
      await User.findByIdAndUpdate(transfer.userId, {
        $inc: { balance: transfer.amount }
      })
    }

    // Update transfer status
    transfer.status = action === 'approve' ? 'approved' : 'rejected'
    transfer.processedAt = new Date()
    await transfer.save()

    return NextResponse.json({
      message: `Transfer ${action}d successfully`
    })
  } catch (error) {
    console.error('Transfer processing error:', error)
    return NextResponse.json(
      { error: "Failed to process transfer" },
      { status: 500 }
    )
  }
} 