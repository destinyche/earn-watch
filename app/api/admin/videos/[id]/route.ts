import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { VideoAd } from "@/lib/models/VideoAd";
import { cookies } from 'next/headers';

const ADMIN_USERS = ['admin'];

// Helper function to check admin authorization
async function checkAdmin() {
  const cookieStore = cookies();
  const username = cookieStore.get('username')?.value;
  return username && ADMIN_USERS.includes(username);
}

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    if (!await checkAdmin()) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { isActive } = await req.json();
    await connectDB();
    
    const video = await VideoAd.findByIdAndUpdate(
      params.id,
      { isActive },
      { new: true }
    );
    
    if (!video) {
      return NextResponse.json({ error: "Video not found" }, { status: 404 });
    }
    
    return NextResponse.json(video);
  } catch (error) {
    console.error('Error updating video:', error);
    return NextResponse.json(
      { error: "Failed to update video" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    if (!await checkAdmin()) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const video = await VideoAd.findByIdAndDelete(params.id);
    
    if (!video) {
      return NextResponse.json({ error: "Video not found" }, { status: 404 });
    }
    
    return NextResponse.json({ message: "Video deleted successfully" });
  } catch (error) {
    console.error('Error deleting video:', error);
    return NextResponse.json(
      { error: "Failed to delete video" },
      { status: 500 }
    );
  }
}