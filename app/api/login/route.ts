import { NextResponse } from "next/server"
import { userService } from "@/lib/userService"

export async function POST(req: Request) {
  const { username, password } = await req.json()

  if (!username || !password) {
    return NextResponse.json({ message: "Username and password are required" }, { status: 400 })
  }

  try {
    const user = await userService.findUser(username, password)
    if (user) {
      const isAdmin = username === 'admin'
      
      // Create response with cookies
      const response = NextResponse.json({ 
        message: "Login successful", 
        userId: user.id,
        hasPaidInitialFee: user.hasPaidInitialFee,
        isAdmin
      })

      // Set cookies with proper options
      response.cookies.set({
        name: 'userId',
        value: user.id,
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/'
      })

      response.cookies.set({
        name: 'username',
        value: user.username,
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/'
      })

      return response
    } else {
      return NextResponse.json({ message: "Invalid username or password" }, { status: 401 })
    }
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ message: "Error during login" }, { status: 500 })
  }
}

