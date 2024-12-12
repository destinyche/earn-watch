import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { VideoAd } from "@/lib/models/VideoAd";

export async function POST(req: Request) {
  try {
    const { videoId } = await req.json();
    await connectDB();
    
    await VideoAd.findOneAndUpdate(
      { videoId },
      { 
        $inc: { views: 1 },
        lastViewed: new Date()
      }
    );
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error recording video view:', error);
    return NextResponse.json({ error: "Failed to record view" }, { status: 500 });
  }
} 