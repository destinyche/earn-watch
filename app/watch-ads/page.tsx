"use client"

import { ProtectedRoute } from "@/components/auth/ProtectedRoute"
import { VideoPlayer } from "@/components/VideoPlayer"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "@/components/ui/use-toast"

interface VideoAd {
  _id: string
  videoId: string
}

export default function WatchAds() {
  const [currentVideo, setCurrentVideo] = useState<VideoAd | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [watchesRemaining, setWatchesRemaining] = useState<number | null>(null)
  const router = useRouter()

  useEffect(() => {
    fetchVideo()
  }, [router])

  const fetchVideo = async () => {
    try {
      const response = await fetch('/api/videos/active')
      if (response.ok) {
        const video = await response.json()
        setCurrentVideo(video)
      } else {
        setError("No videos available at the moment")
      }
    } catch (error) {
      setError("Error loading video")
    }
  }

  const handleVideoEnd = async () => {
    if (!currentVideo) return;

    try {
      const response = await fetch('/api/watch-ad', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          videoId: currentVideo._id,
        }),
      });

      const data = await response.json();
      console.log('Watch ad response:', data); // Debug log

      if (response.ok) {
        toast({
          title: "Reward earned!",
          description: `You earned 50 XAF! New watch balance: ${data.newWatchBalance} XAF`,
        });

        // Wait a moment before redirecting
        setTimeout(() => {
          if (data.watchesRemaining <= 0) {
            toast({
              title: "Daily limit reached",
              description: "You've reached your daily limit of 4 ads",
              variant: "destructive"
            });
          }
          router.push('/dashboard');
        }, 2000);
      } else {
        setError(data.error || "Failed to process video watch");
        if (data.error === "Daily watch limit reached") {
          setTimeout(() => router.push('/dashboard'), 2000);
        }
      }
    } catch (error) {
      console.error('Error processing video watch:', error);
      setError("Error processing video watch");
    }
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-100 p-8">
        <Card className="max-w-3xl mx-auto">
          <CardHeader>
            <CardTitle>Watch Ads & Earn</CardTitle>
            {watchesRemaining !== null && (
              <p className="text-sm text-gray-500">
                You have {watchesRemaining} watches remaining today
              </p>
            )}
          </CardHeader>
          <CardContent>
            {error ? (
              <p className="text-red-500 text-center">{error}</p>
            ) : currentVideo ? (
              <div className="space-y-4">
                <VideoPlayer
                  videoId={currentVideo.videoId}
                  onVideoEnd={handleVideoEnd}
                />
                <p className="text-center text-sm text-gray-500">
                  Complete watching to earn 50 XAF in your watch balance
                </p>
              </div>
            ) : (
              <p className="text-center">Loading video...</p>
            )}
          </CardContent>
        </Card>
      </div>
    </ProtectedRoute>
  )
}

