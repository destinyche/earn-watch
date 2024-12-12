"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface User {
  _id: string
  username: string
  balance: number
  hasPaidInitialFee: boolean
  createdAt: string
}

export default function UsersManagement() {
  const [users, setUsers] = useState<User[]>([])

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/admin/users')
      const data = await response.json()
      setUsers(data)
    } catch (error) {
      console.error('Error fetching users:', error)
    }
  }

  const resetDailyWatches = async (userId: string) => {
    try {
      await fetch(`/api/admin/users/${userId}/reset-watches`, {
        method: 'POST',
      })
      fetchUsers()
    } catch (error) {
      console.error('Error resetting watches:', error)
    }
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Manage Users</h1>
      
      <div className="space-y-4">
        {users.map((user) => (
          <Card key={user._id}>
            <CardContent className="flex items-center justify-between p-6">
              <div>
                <h3 className="font-semibold">{user.username}</h3>
                <p className="text-sm text-gray-500">Balance: {user.balance} XAF</p>
                <p className="text-sm text-gray-500">
                  Initial Fee: {user.hasPaidInitialFee ? 'Paid' : 'Not Paid'}
                </p>
                <p className="text-sm text-gray-500">
                  Joined: {new Date(user.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div>
                <Button
                  size="sm"
                  onClick={() => resetDailyWatches(user._id)}
                >
                  Reset Daily Watches
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
} 