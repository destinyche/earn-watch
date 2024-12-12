"use client";

import { useState, useEffect, useRef } from 'react';
import YouTube from 'react-youtube';
import { Progress } from "@/components/ui/progress";

interface VideoPlayerProps {
  videoId: string;
  onVideoEnd: () => void;
}

export function VideoPlayer({ videoId, onVideoEnd }: VideoPlayerProps) {
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [isWatching, setIsWatching] = useState(false);
  const playerRef = useRef<any>(null);
  const WATCH_TIME = 10; // 10 seconds required watching time

  const opts = {
    height: '390',
    width: '640',
    playerVars: {
      autoplay: 1,
      controls: 0,
      disablekb: 1,
      fs: 0,
      modestbranding: 1,
      rel: 0,
    },
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isWatching) {
      interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            onVideoEnd();
            return 100;
          }
          return prev + (100 / WATCH_TIME);
        });
      }, 1000);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isWatching, onVideoEnd]);

  const handleReady = (event: any) => {
    playerRef.current = event.target;
    setIsWatching(true);
  };

  const handleError = (event: any) => {
    console.error('YouTube Player Error:', event);
    setError('An error occurred while loading the video. Please try again.');
  };

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <YouTube
        videoId={videoId}
        opts={opts}
        onReady={handleReady}
        onError={handleError}
      />
      <div className="w-full max-w-[640px]">
        <Progress value={progress} className="h-2" />
        <p className="text-center mt-2">
          Watch for {Math.ceil(WATCH_TIME - (progress / 100 * WATCH_TIME))} more seconds to earn 50 XAF
        </p>
      </div>
    </div>
  );
} 