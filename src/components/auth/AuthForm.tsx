import { useState } from 'react'
import { signUpWithEmail, signInWithEmail } from '../../lib/auth'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card'
import { Label } from '../ui/label'
import { Alert, AlertDescription } from '../ui/alert'

interface AuthFormProps {
  onSuccess?: () => void
}

export function AuthForm({ onSuccess }: AuthFormProps) {
  const [isSignUp, setIsSignUp] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(null)

    if (isSignUp) {
      const result = await signUpWithEmail(email, password, firstName, lastName)
      if (result.success) {
        setSuccess('Account created! Please check your email to verify your account.')
        // Clear form
        setEmail('')
        setPassword('')
        setFirstName('')
        setLastName('')
      } else {
        setError(result.error?.message || 'Failed to create account')
      }
    } else {
      const result = await signInWithEmail(email, password)
      if (result.success) {
        setSuccess('Signed in successfully!')
        if (onSuccess) onSuccess()
      } else {
        setError(result.error?.message || 'Failed to sign in')
      }
    }

    setLoading(false)
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>{isSignUp ? 'Create Account' : 'Sign In'}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {isSignUp && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    required={isSignUp}
                  />
                </div>
                <div>
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    required={isSignUp}
                  />
                </div>
              </div>
            </>
          )}

          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="you@example.com"
            />
          </div>

          <div>
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder={isSignUp ? "Create a password" : "Enter your password"}
              minLength={6}
            />
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert>
              <AlertDescription>{success}</AlertDescription>
            </Alert>
          )}

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Loading...' : isSignUp ? 'Sign Up' : 'Sign In'}
          </Button>

          <div className="text-center text-sm">
            {isSignUp ? (
              <>
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setIsSignUp(false)
                    setError(null)
                    setSuccess(null)
                  }}
                  className="text-blue-600 hover:underline"
                >
                  Sign in
                </button>
              </>
            ) : (
              <>
                Don't have an account?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setIsSignUp(true)
                    setError(null)
                    setSuccess(null)
                  }}
                  className="text-blue-600 hover:underline"
                >
                  Sign up
                </button>
              </>
            )}
          </div>
        </form>

        {/* SSO buttons placeholder for future */}
        <div className="mt-6 pt-6 border-t">
          <p className="text-sm text-gray-500 text-center mb-4">
            SSO coming soon with custom domain
          </p>
          <div className="space-y-2 opacity-50 pointer-events-none">
            <Button variant="outline" className="w-full">
              Continue with Google
            </Button>
            <Button variant="outline" className="w-full">
              Continue with Apple
            </Button>
            <Button variant="outline" className="w-full">
              Continue with Facebook
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}