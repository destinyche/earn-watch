"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"

interface VideoAd {
  _id: string
  title: string
  videoId: string
  isActive: boolean
  views: number
  lastViewed: string | null
}

export default function VideoAdsManagement() {
  const [videos, setVideos] = useState<VideoAd[]>([])
  const [newVideo, setNewVideo] = useState({ title: '', videoId: '' })
  const [error, setError] = useState('')

  useEffect(() => {
    fetchVideos()
  }, [])

  const fetchVideos = async () => {
    try {
      const response = await fetch('/api/admin/videos')
      const data = await response.json()
      setVideos(data)
    } catch (error) {
      console.error('Error fetching videos:', error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await fetch('/api/admin/videos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newVideo),
      })

      if (response.ok) {
        setNewVideo({ title: '', videoId: '' })
        fetchVideos()
      } else {
        setError('Failed to add video')
      }
    } catch (error) {
      setError('Error adding video')
    }
  }

  const toggleVideoStatus = async (videoId: string, currentStatus: boolean) => {
    try {
      await fetch(`/api/admin/videos/${videoId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !currentStatus }),
      })
      fetchVideos()
    } catch (error) {
      console.error('Error toggling video status:', error)
    }
  }

  const deleteVideo = async (videoId: string) => {
    try {
      await fetch(`/api/admin/videos/${videoId}`, {
        method: 'DELETE',
      })
      fetchVideos()
    } catch (error) {
      console.error('Error deleting video:', error)
    }
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Manage Video Ads</h1>
      
      <Card className="mb-8">
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="title">Video Title</Label>
              <Input
                id="title"
                value={newVideo.title}
                onChange={(e) => setNewVideo(prev => ({ ...prev, title: e.target.value }))}
                required
              />
            </div>
            <div>
              <Label htmlFor="videoId">YouTube Video ID</Label>
              <Input
                id="videoId"
                value={newVideo.videoId}
                onChange={(e) => setNewVideo(prev => ({ ...prev, videoId: e.target.value }))}
                required
              />
            </div>
            {error && <p className="text-red-500">{error}</p>}
            <Button type="submit">Add Video</Button>
          </form>
        </CardContent>
      </Card>

      <div className="space-y-4">
        {videos.map((video) => (
          <Card key={video._id}>
            <CardContent className="flex items-center justify-between p-6">
              <div>
                <h3 className="font-semibold">{video.title}</h3>
                <p className="text-sm text-gray-500">ID: {video.videoId}</p>
                <p className="text-sm text-gray-500">
                  Views: {video.views}
                  {video.lastViewed && ` • Last viewed: ${new Date(video.lastViewed).toLocaleDateString()}`}
                </p>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Switch
                    checked={video.isActive}
                    onCheckedChange={() => toggleVideoStatus(video._id, video.isActive)}
                  />
                  <span className="text-sm">{video.isActive ? 'Active' : 'Inactive'}</span>
                </div>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => deleteVideo(video._id)}
                >
                  Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
} 