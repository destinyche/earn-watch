import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { User } from "@/lib/models/User";
import { cookies } from 'next/headers';

export async function GET() {
  try {
    const cookieStore = cookies();
    const userId = cookieStore.get('userId')?.value;
    
    if (!userId) {
      return NextResponse.json({ error: "Not logged in" }, { status: 401 });
    }

    await connectDB();
    const user = await User.findById(userId).select('-password');
    
    return NextResponse.json({
      user,
      cookies: {
        userId: cookieStore.get('userId')?.value,
        username: cookieStore.get('username')?.value,
      }
    });
  } catch (error) {
    console.error('Debug error:', error);
    return NextResponse.json({ error: "Debug failed" }, { status: 500 });
  }
} 