import { supabase } from './supabase'

// Sign up with email/password
export async function signUpWithEmail(email: string, password: string, firstName?: string, lastName?: string) {
  try {
    // Create auth user
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          first_name: firstName,
          last_name: lastName,
        }
      }
    })

    if (authError) throw authError

    // Update profile with additional info
    if (authData.user && (firstName || lastName)) {
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          first_name: firstName,
          last_name: lastName,
        })
        .eq('id', authData.user.id)

      if (profileError) console.error('Profile update error:', profileError)
    }

    return { success: true, user: authData.user }
  } catch (error) {
    console.error('Signup error:', error)
    return { success: false, error }
  }
}

// Sign in with email/password
export async function signInWithEmail(email: string, password: string) {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) throw error

    return { success: true, user: data.user, session: data.session }
  } catch (error) {
    console.error('Sign in error:', error)
    return { success: false, error }
  }
}

// Sign out
export async function signOut() {
  try {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
    return { success: true }
  } catch (error) {
    console.error('Sign out error:', error)
    return { success: false, error }
  }
}

// Get current user
export async function getCurrentUser() {
  try {
    const { data: { user }, error } = await supabase.auth.getUser()
    if (error) throw error
    return user
  } catch (error) {
    console.error('Get user error:', error)
    return null
  }
}

// Get current session
export async function getSession() {
  try {
    const { data: { session }, error } = await supabase.auth.getSession()
    if (error) throw error
    return session
  } catch (error) {
    console.error('Get session error:', error)
    return null
  }
}

// Reset password
export async function resetPassword(email: string) {
  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    })
    
    if (error) throw error
    return { success: true }
  } catch (error) {
    console.error('Reset password error:', error)
    return { success: false, error }
  }
}

// Update password
export async function updatePassword(newPassword: string) {
  try {
    const { error } = await supabase.auth.updateUser({
      password: newPassword
    })
    
    if (error) throw error
    return { success: true }
  } catch (error) {
    console.error('Update password error:', error)
    return { success: false, error }
  }
}

// Listen to auth state changes
export function onAuthStateChange(callback: (event: string, session: any) => void) {
  return supabase.auth.onAuthStateChange(callback)
}