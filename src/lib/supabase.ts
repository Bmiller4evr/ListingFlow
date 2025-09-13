import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || ''
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || ''

// Only create client if we have the required env vars
export const supabase = supabaseUrl && supabaseAnonKey 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null

if (!supabase) {
  console.warn('Supabase client not initialized. Check environment variables.')
}

// Test connection function
export async function testConnection() {
  if (!supabase) {
    console.error('Supabase client not initialized')
    return false
  }
  
  try {
    const { data, error } = await supabase
      .from('properties')
      .select('count')
    
    if (error) {
      console.error('Connection failed:', error)
      return false
    }
    
    console.log('✅ Connected to Supabase!')
    return true
  } catch (err) {
    console.error('Connection error:', err)
    return false
  }
}