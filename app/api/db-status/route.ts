import { NextResponse } from "next/server";
import { connectDB, getConnectionStatus } from "@/lib/db";

export async function GET() {
  try {
    // Try to connect to the database with timeout
    const connectPromise = connectDB();
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Connection timeout')), 30000);
    });

    await Promise.race([connectPromise, timeoutPromise]);
    
    // Get the connection status
    const status = getConnectionStatus();
    
    return NextResponse.json({
      success: true,
      status: status,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Database connection error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    const errorDetails = {
      message: errorMessage,
      name: error instanceof Error ? error.name : 'Unknown',
      stack: process.env.NODE_ENV === 'development' ? error instanceof Error ? error.stack : '' : undefined
    };

    return NextResponse.json({
      success: false,
      error: 'Failed to connect to database',
      details: errorDetails,
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
} 