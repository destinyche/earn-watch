import { NextResponse } from 'next/server'
import { PaymentOperation } from '@hachther/mesomb'

const applicationKey = process.env.MESOMB_APPLICATION_KEY || ''
const accessKey = process.env.MESOMB_ACCESS_KEY || ''
const secretKey = process.env.MESOMB_SECRET_KEY || ''

export async function POST(req: Request) {
  const { amount, phoneNumber } = await req.json()

  const payment = new PaymentOperation({
    applicationKey,
    accessKey,
    secretKey,
  })

  try {
    const response = await payment.makeCollect({
      amount: parseFloat(amount),
      service: 'MTN', // or 'ORANGE' or 'AIRTEL', depending on the user's carrier
      payer: phoneNumber,
      currency: 'XAF', // Change this to the appropriate currency code
    })

    if (response.isOperationSuccess()) {
      // Update user's coin balance in your database here
      return NextResponse.json({ success: true, message: 'Payment successful' })
    } else {
      return NextResponse.json({ success: false, message: 'Payment failed' }, { status: 400 })
    }
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json({ success: false, message: 'An error occurred' }, { status: 500 })
  }
}

