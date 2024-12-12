import { NextResponse } from "next/server"
import { userService } from "@/lib/userService"
import { User } from "@/lib/models/User"

// Import the server version of MeSomb
import { PaymentOperation, RandomGenerator } from '@hachther/mesomb'

const applicationKey = process.env.MESOMB_APPLICATION_KEY || ''
const accessKey = process.env.MESOMB_ACCESS_KEY || ''
const secretKey = process.env.MESOMB_SECRET_KEY || ''

export async function POST(req: Request) {
  const { userId, phoneNumber, carrier } = await req.json()

  if (!userId || !phoneNumber) {
    return NextResponse.json({ message: "User ID and phone number are required" }, { status: 400 })
  }

  const payment = new PaymentOperation({
    applicationKey,
    accessKey,
    secretKey,
  })

  try {
    const response = await payment.makeCollect({
      amount: 2500, // Initial payment amount
      service: carrier || 'MTN', // Use selected carrier or default to MTN
      payer: phoneNumber,
      currency: 'XAF',
      nonce: RandomGenerator.nonce(),
    })

    if (response.isOperationSuccess()) {
      // Get user to check for referral
      const user = await User.findById(userId);
      if (!user) {
        throw new Error('User not found');
      }

      // Update payment status
      await userService.updatePaymentStatus(userId, true);

      // Process referral reward if user was referred
      if (user.referredBy) {
        await userService.processReferralReward(user.referredBy);
      }

      return NextResponse.json({ 
        message: "Payment successful",
        success: true
      })
    } else {
      return NextResponse.json({ 
        message: "Payment failed", 
        success: false,
        details: response.getData()
      }, { status: 400 })
    }
  } catch (error: any) {
    console.error('Payment error:', error)
    if (error.code === 'duplicated-request') {
      return NextResponse.json({ 
        message: "Payment request already processed. Please wait a moment and try again.",
        success: false
      }, { status: 400 })
    }
    return NextResponse.json({ 
      message: "An error occurred during payment",
      success: false,
      error: error.message
    }, { status: 500 })
  }
}

