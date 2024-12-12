"use client"

import { useEffect, useState } from "react"
import { AdminRoute } from "@/components/auth/AdminRoute"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"

interface Transfer {
  _id: string
  userId: {
    _id: string
    username: string
  }
  amount: number
  status: 'pending' | 'approved' | 'rejected'
  createdAt: string
}

export default function AdminDashboard() {
  const [transfers, setTransfers] = useState<Transfer[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    fetchTransfers()
  }, [])

  const fetchTransfers = async () => {
    try {
      const response = await fetch('/api/admin/transfers')
      if (response.ok) {
        const data = await response.json()
        setTransfers(data.transfers)
      }
    } catch (error) {
      console.error('Error fetching transfers:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleTransfer = async (transferId: string, action: 'approve' | 'reject') => {
    try {
      const response = await fetch(`/api/admin/transfers/${transferId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action })
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: `Transfer ${action}ed successfully`,
        })
        fetchTransfers() // Refresh the list
      } else {
        const data = await response.json()
        throw new Error(data.error)
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || `Failed to ${action} transfer`,
        variant: "destructive"
      })
    }
  }

  return (
    <AdminRoute>
      <div className="min-h-screen bg-gray-100 p-8">
        <Card>
          <CardHeader>
            <CardTitle>Pending Transfers</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-4">Loading transfers...</div>
            ) : transfers.length === 0 ? (
              <div className="text-center py-4 text-gray-500">No pending transfers</div>
            ) : (
              <div className="space-y-4">
                {transfers.map((transfer) => (
                  <Card key={transfer._id}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">{transfer.userId.username}</p>
                          <p className="text-sm text-gray-500">
                            Amount: {transfer.amount} XAF
                          </p>
                          <p className="text-xs text-gray-400">
                            Requested: {new Date(transfer.createdAt).toLocaleString()}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            onClick={() => handleTransfer(transfer._id, 'approve')}
                            variant="default"
                            size="sm"
                          >
                            Approve
                          </Button>
                          <Button
                            onClick={() => handleTransfer(transfer._id, 'reject')}
                            variant="destructive"
                            size="sm"
                          >
                            Reject
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminRoute>
  )
} 