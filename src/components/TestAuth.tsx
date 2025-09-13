import { useEffect, useState } from 'react'
import { AuthForm } from './auth/AuthForm'
import { getCurrentUser, signOut } from '../lib/auth'
import { Button } from './ui/button'
import { Card, CardHeader, CardTitle, CardContent } from './ui/card'

export function TestAuth() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    checkUser()
  }, [])

  const checkUser = async () => {
    const currentUser = await getCurrentUser()
    setUser(currentUser)
    setLoading(false)
  }

  const handleSignOut = async () => {
    await signOut()
    setUser(null)
  }

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>
  }

  if (user) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle>Authentication Test</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-gray-600">Signed in as:</p>
              <p className="font-semibold">{user.email}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">User ID:</p>
              <p className="font-mono text-xs">{user.id}</p>
            </div>
            <Button onClick={handleSignOut} variant="outline" className="w-full">
              Sign Out
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="mb-8 text-center">
        <h1 className="text-2xl font-bold">Authentication Test</h1>
        <p className="text-gray-600 mt-2">Test email/password authentication with Supabase</p>
      </div>
      <AuthForm onSuccess={checkUser} />
    </div>
  )
}