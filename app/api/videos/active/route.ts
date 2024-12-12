import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { VideoAd } from "@/lib/models/VideoAd";

export async function GET() {
  try {
    await connectDB();
    
    // Get a random active video
    const videos = await VideoAd.aggregate([
      { $match: { isActive: true } },
      { $sample: { size: 1 } }
    ]);
    
    if (!videos.length) {
      return NextResponse.json({ error: "No videos available" }, { status: 404 });
    }

    return NextResponse.json(videos[0]);
  } catch (error) {
    console.error('Error fetching video:', error);
    return NextResponse.json(
      { error: "Failed to fetch video" },
      { status: 500 }
    );
  }
} 