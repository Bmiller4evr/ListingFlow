import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Test connection function
export async function testConnection() {
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