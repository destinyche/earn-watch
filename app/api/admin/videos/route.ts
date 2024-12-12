import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { VideoAd } from "@/lib/models/VideoAd";
import { cookies } from 'next/headers';

const ADMIN_USERS = ['admin'];

export async function GET() {
  try {
    // Check admin authorization
    const cookieStore = cookies();
    const username = cookieStore.get('username')?.value;
    
    if (!username || !ADMIN_USERS.includes(username)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const videos = await VideoAd.find()
      .sort({ createdAt: -1 });
    
    return NextResponse.json(videos);
  } catch (error) {
    console.error('Error fetching videos:', error);
    return NextResponse.json(
      { error: "Failed to fetch videos" }, 
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    // Check admin authorization
    const cookieStore = cookies();
    const username = cookieStore.get('username')?.value;
    
    if (!username || !ADMIN_USERS.includes(username)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { title, videoId } = await req.json();
    
    await connectDB();
    const video = await VideoAd.create({
      title,
      videoId,
    });
    
    return NextResponse.json(video, { status: 201 });
  } catch (error) {
    console.error('Error creating video:', error);
    return NextResponse.json(
      { error: "Failed to create video" }, 
      { status: 500 }
    );
  }
}