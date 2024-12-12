"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function DBTest() {
  const [status, setStatus] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const checkConnection = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch('/api/db-status')
      const data = await response.json()
      setStatus(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Database Connection Test</CardTitle>
        </CardHeader>
        <CardContent>
          <Button 
            onClick={checkConnection} 
            disabled={loading}
          >
            {loading ? 'Checking...' : 'Check Connection'}
          </Button>

          {error && (
            <div className="mt-4 p-4 bg-red-100 text-red-700 rounded">
              {error}
            </div>
          )}

          {status && (
            <div className="mt-4">
              <h3 className="font-bold">Connection Status:</h3>
              <pre className="mt-2 p-4 bg-gray-50 rounded overflow-auto">
                {JSON.stringify(status, null, 2)}
              </pre>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
} 