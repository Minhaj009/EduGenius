import { createClient } from '@supabase/supabase-js'

// Get environment variables with fallbacks for development
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || ''
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || ''

// Check if we have placeholder values
const hasPlaceholderValues = 
  supabaseUrl.includes('your-project-id') || 
  supabaseAnonKey.includes('your-anon-key') ||
  !supabaseUrl || 
  !supabaseAnonKey

// Enhanced debugging for environment variables
console.log('Supabase Environment Check:', {
  url: supabaseUrl ? `${supabaseUrl.substring(0, 20)}...` : 'MISSING',
  key: supabaseAnonKey ? `${supabaseAnonKey.substring(0, 20)}...` : 'MISSING',
  hasUrl: !!supabaseUrl,
  hasKey: !!supabaseAnonKey,
  hasPlaceholders: hasPlaceholderValues
})

// Create a mock client if environment variables are missing or contain placeholders
let supabase: any

if (hasPlaceholderValues) {
  console.warn('Supabase environment variables missing or contain placeholder values. Creating mock client for development.')
  
  // Create a mock Supabase client for development
  supabase = {
    auth: {
      getUser: () => Promise.resolve({ data: { user: null }, error: null }),
      getSession: () => Promise.resolve({ data: { session: null }, error: null }),
      signUp: () => Promise.resolve({ data: { user: null, session: null }, error: { message: 'Supabase not configured' } }),
      signInWithPassword: () => Promise.resolve({ data: { user: null, session: null }, error: { message: 'Supabase not configured' } }),
      signOut: () => Promise.resolve({ error: null }),
      onAuthStateChange: (callback: any) => {
        // Call callback immediately with no session
        setTimeout(() => callback('SIGNED_OUT', null), 100)
        return { data: { subscription: { unsubscribe: () => {} } } }
      }
    },
    from: () => ({
      select: () => ({
        eq: () => ({
          single: () => Promise.resolve({ data: null, error: { code: 'PGRST116', message: 'No rows found' } }),
          limit: () => ({
            abortSignal: () => Promise.resolve({ data: [], error: null })
          })
        }),
        limit: () => ({
          abortSignal: () => Promise.resolve({ data: [], error: null })
        })
      }),
      insert: () => Promise.resolve({ data: null, error: { message: 'Supabase not configured' } }),
      update: () => ({
        eq: () => ({
          select: () => ({
            single: () => Promise.resolve({ data: null, error: { message: 'Supabase not configured' } })
          })
        })
      })
    })
  }
} else {
  // Validate URL format
  try {
    new URL(supabaseUrl)
  } catch (error) {
    throw new Error(`Invalid Supabase URL format: ${supabaseUrl}. Please check your VITE_SUPABASE_URL in the .env file.`)
  }

  supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true,
      flowType: 'pkce'
    },
    global: {
      headers: {
        'Content-Type': 'application/json',
      },
      fetch: (url, options = {}) => {
        return fetch(url, {
          ...options,
          signal: AbortSignal.timeout(10000) // Reduced to 10 second timeout
        }).catch(error => {
          // Enhanced error handling for network issues
          if (error.name === 'AbortError') {
            throw new Error('Connection timeout - please check your internet connection')
          }
          if (error.message.includes('Failed to fetch')) {
            throw new Error('Unable to connect to Supabase - please check your project URL and internet connection')
          }
          throw error
        })
      }
    },
    db: {
      schema: 'public',
    },
    realtime: {
      params: {
        eventsPerSecond: 2,
      },
    },
  })

  // Test connection with better error handling
  const testConnection = async () => {
    try {
      console.log('Testing Supabase connection...')
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 3000) // Reduced to 3 second timeout for test
      
      const { data, error } = await supabase
        .from('user_profiles')
        .select('count')
        .limit(1)
        .abortSignal(controller.signal)
      
      clearTimeout(timeoutId)
      
      if (error) {
        if (error.code === 'PGRST116') {
          console.log('Supabase connection successful - user_profiles table exists but is empty')
        } else if (error.message.includes('relation "user_profiles" does not exist')) {
          console.warn('Supabase connected but user_profiles table not found. Please run the migration.')
        } else {
          console.error('Supabase connection test failed:', error.message)
        }
      } else {
        console.log('Supabase connection test successful')
      }
    } catch (error) {
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          console.warn('Supabase connection test timed out - please check your project URL and internet connection')
        } else if (error.message.includes('Failed to fetch')) {
          console.error('Cannot connect to Supabase - please verify your project URL and internet connection')
        } else {
          console.warn('Supabase connection test error:', error.message)
        }
      }
    }
  }

  // Run connection test in development
  if (import.meta.env.DEV) {
    testConnection()
  }
}

export { supabase }

// Types for our database
export interface UserProfile {
  id: string
  first_name: string
  last_name: string
  grade: string
  created_at: string
  updated_at: string
}

export interface Database {
  public: {
    Tables: {
      user_profiles: {
        Row: UserProfile
        Insert: Omit<UserProfile, 'created_at' | 'updated_at'>
        Update: Partial<Omit<UserProfile, 'id' | 'created_at' | 'updated_at'>>
      }
    }
  }
}