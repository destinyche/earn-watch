import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { User } from "@/lib/models/User";

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    await User.findByIdAndUpdate(params.id, {
      'dailyAdWatches.count': 0,
      'dailyAdWatches.lastReset': new Date(),
    });
    return NextResponse.json({ message: "Daily watches reset successfully" });
  } catch (error) {
    return NextResponse.json({ error: "Failed to reset watches" }, { status: 500 });
  }
} 