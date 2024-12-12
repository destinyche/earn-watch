import { NextResponse } from "next/server"
import { userService } from "@/lib/userService"

export async function POST(req: Request) {
  const { username, password, ref } = await req.json()

  if (!username || !password) {
    return NextResponse.json({ message: "Username and password are required" }, { status: 400 })
  }

  try {
    const user = await userService.createUser(username, password, ref)
    return NextResponse.json({ 
      message: "User created successfully", 
      userId: user.id
    }, { status: 201 })
  } catch (error: any) {
    if (error.message === 'Username already exists') {
      return NextResponse.json({ message: "Username already exists" }, { status: 400 })
    }
    if (error.message === 'Invalid referral link') {
      return NextResponse.json({ message: "Invalid referral link" }, { status: 400 })
    }
    console.error('Signup error:', error);
    return NextResponse.json({ message: "Error creating user" }, { status: 500 })
  }
}

