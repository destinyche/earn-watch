import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { User, canWatchMoreAds } from "@/lib/models/User";
import { VideoAd } from "@/lib/models/VideoAd";
import { cookies } from 'next/headers';

const REWARD_AMOUNT = 50;
const DAILY_LIMIT = 4;
const ONE_DAY = 24 * 60 * 60 * 1000;

export async function POST(req: Request) {
  try {
    const cookieStore = cookies();
    const userId = await cookieStore.get('userId')?.value;
    const storedUsername = await cookieStore.get('username')?.value;

    if (!userId || !storedUsername) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { videoId } = await req.json();
    console.log('Processing video watch for user:', userId, 'video:', videoId);

    await connectDB();

    // Get user's current state
    const user = await User.findOne({
      _id: userId,
      username: storedUsername
    });
    
    if (!user) {
      return NextResponse.json({ error: "Invalid user session" }, { status: 401 });
    }

    console.log('Current user state:', {
      watchBalance: user.watchBalance,
      dailyWatches: user.dailyAdWatches
    });

    // Check daily limit
    const shouldReset = Date.now() - new Date(user.dailyAdWatches.lastReset).getTime() > ONE_DAY;
    
    if (!shouldReset && !canWatchMoreAds(user)) {
      return NextResponse.json(
        { error: "Daily watch limit reached" },
        { status: 400 }
      );
    }

    // Prepare update
    const updateQuery = {
      $inc: { watchBalance: REWARD_AMOUNT },
      $set: {
        'dailyAdWatches.count': shouldReset ? 1 : user.dailyAdWatches.count + 1,
        'dailyAdWatches.lastReset': shouldReset ? new Date() : user.dailyAdWatches.lastReset
      }
    };

    console.log('Applying update:', updateQuery);

    // Update user
    const updatedUser = await User.findOneAndUpdate(
      { _id: userId },
      updateQuery,
      { new: true }
    );

    if (!updatedUser) {
      console.error('Failed to update user');
      return NextResponse.json({ 
        error: "Failed to update user" 
      }, { status: 400 });
    }

    console.log('Updated user state:', {
      watchBalance: updatedUser.watchBalance,
      dailyWatches: updatedUser.dailyAdWatches
    });

    // Update video views
    await VideoAd.findByIdAndUpdate(videoId, {
      $inc: { views: 1 },
      lastViewed: new Date()
    });

    return NextResponse.json({
      success: true,
      newWatchBalance: updatedUser.watchBalance,
      watchesRemaining: DAILY_LIMIT - updatedUser.dailyAdWatches.count,
      dailyWatches: updatedUser.dailyAdWatches.count
    });
  } catch (error) {
    console.error('Error processing video watch:', error);
    return NextResponse.json(
      { error: "Failed to process video watch" },
      { status: 500 }
    );
  }
} 