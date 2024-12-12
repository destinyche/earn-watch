import { NextResponse } from "next/server"
import { PaymentOperation, RandomGenerator } from '@hachther/mesomb'
import { connectDB } from "@/lib/db"
import { User } from "@/lib/models/User"

const applicationKey = process.env.MESOMB_APPLICATION_KEY || ''
const accessKey = process.env.MESOMB_ACCESS_KEY || ''
const secretKey = process.env.MESOMB_SECRET_KEY || ''

export async function POST(req: Request) {
  try {
    const { amount, phoneNumber, userId } = await req.json()

    // Connect to database
    await connectDB()

    // Check user's balance
    const user = await User.findById(userId)
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 })
    }

    if (user.balance < amount) {
      return NextResponse.json({ message: "Insufficient balance" }, { status: 400 })
    }

    // Initialize MeSomb payment
    const payment = new PaymentOperation({
      applicationKey,
      accessKey,
      secretKey,
    })

    // Make the deposit to user's phone number
    const response = await payment.makeDeposit({
      amount: amount,
      service: 'MTN', // You might want to make this dynamic based on the phone number
      receiver: phoneNumber,
      nonce: RandomGenerator.nonce()
    })

    if (response.isOperationSuccess() && response.isTransactionSuccess()) {
      // Update user's balance in database
      await User.findByIdAndUpdate(userId, {
        $inc: { balance: -amount }
      })

      return NextResponse.json({ message: "Withdrawal successful" })
    } else {
      return NextResponse.json({ message: "Withdrawal failed" }, { status: 400 })
    }
  } catch (error) {
    console.error('Withdrawal error:', error)
    return NextResponse.json({ message: "An error occurred during withdrawal" }, { status: 500 })
  }
} 