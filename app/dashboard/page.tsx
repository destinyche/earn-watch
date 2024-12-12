"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { ProtectedRoute } from "@/components/auth/ProtectedRoute"
import { toast } from "@/components/ui/use-toast"

interface UserData {
  username: string
  balance: number
  watchBalance: number
  hasPaidInitialFee: boolean
}

export default function Dashboard() {
  const [user, setUser] = useState<UserData | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  const fetchUserData = async () => {
    const userId = localStorage.getItem("userId")
    if (!userId) {
      router.push("/login")
      return
    }

    try {
      const response = await fetch(`/api/user/${userId}`)
      if (response.ok) {
        const userData = await response.json()
        setUser(userData)
        if (!userData.hasPaidInitialFee) {
          router.push("/payment")
        }
      } else {
        router.push("/login")
      }
    } catch (error) {
      console.error("Error fetching user data:", error)
      router.push("/login")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUserData()
  }, [router])

  const getReferralLink = () => {
    const baseUrl = window.location.origin;
    return `${baseUrl}/signup?ref=${user?.username}`;
  };

  const handleTransfer = async () => {
    if (!user) return;
    
    try {
      const response = await fetch('/api/transfers/request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: localStorage.getItem('userId'),
          amount: user.watchBalance
        })
      })

      const data = await response.json()
      if (response.ok) {
        toast({
          title: "Transfer requested",
          description: "Your transfer request has been submitted for approval.",
        })
        fetchUserData()
      } else {
        toast({
          title: "Transfer failed",
          description: data.error,
          variant: "destructive"
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit transfer request",
        variant: "destructive"
      })
    }
  }

  if (loading) {
    return <div className="min-h-screen bg-gray-100 p-8 flex items-center justify-center">
      Loading...
    </div>
  }

  if (!user) {
    return null
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-100 p-8">
        <h1 className="text-4xl font-bold mb-8">Welcome, {user.username}!</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Main Balance</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{user.balance} XAF</p>
              <Button 
                asChild 
                className="mt-4"
                disabled={user.balance < 2000}
              >
                <Link href="/withdraw">Withdraw Funds</Link>
              </Button>
              <p className="text-sm text-gray-500 mt-2">
                Minimum withdrawal: 2000 XAF
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Watch Balance</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{user.watchBalance} XAF</p>
              <Button
                onClick={handleTransfer}
                className="mt-4"
                disabled={user.watchBalance < 2000}
              >
                Transfer to Main Balance
              </Button>
              <p className="text-sm text-gray-500 mt-2">
                Minimum transfer amount: 2000 XAF
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Watch Ads</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Earn 50 XAF for each ad you watch!</p>
              <Button asChild className="mt-4">
                <Link href="/watch-ads">Watch Ads</Link>
              </Button>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Your Referral Link</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-lg mb-2">Share your referral link and earn 1000 XAF for each new user who pays the initial fee!</p>
              <div className="bg-gray-50 p-3 rounded-md border flex justify-between items-center">
                <code className="text-lg truncate">{getReferralLink()}</code>
                <Button
                  onClick={() => {
                    navigator.clipboard.writeText(getReferralLink());
                    toast({
                      title: "Copied!",
                      description: "Referral link copied to clipboard",
                    })
                  }}
                  variant="outline"
                  size="sm"
                >
                  Copy Link
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </ProtectedRoute>
  )
}

