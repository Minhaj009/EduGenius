import { supabase } from '../lib/supabase'
import type { UserProfile } from '../lib/supabase'

export interface SignUpData {
  email: string
  password: string
  firstName: string
  lastName: string
  grade: string
}

export interface SignInData {
  email: string
  password: string
}

export class AuthService {
  // Sign up new user with optimized flow
  static async signUp(data: SignUpData) {
    try {
      // Create user account
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            first_name: data.firstName,
            last_name: data.lastName,
            grade: data.grade,
          }
        }
      })

      if (authError) {
        // Provide more user-friendly error messages
        if (authError.message.includes('already registered')) {
          throw new Error('An account with this email already exists. Please sign in instead.')
        }
        if (authError.message.includes('Password should be at least')) {
          throw new Error('Password must be at least 6 characters long.')
        }
        if (authError.message.includes('Invalid email')) {
          throw new Error('Please enter a valid email address.')
        }
        throw new Error(authError.message)
      }

      if (authData.user) {
        // Create user profile - this will be handled by database trigger if set up
        try {
          const { error: profileError } = await supabase
            .from('user_profiles')
            .insert({
              id: authData.user.id,
              first_name: data.firstName,
              last_name: data.lastName,
              grade: data.grade,
            })

          if (profileError && !profileError.message.includes('duplicate key')) {
            console.error('Profile creation error:', profileError)
            // Don't throw error for profile creation - user can update later
          }
        } catch (profileError) {
          console.error('Profile creation failed:', profileError)
          // Continue without throwing - profile can be created later
        }
      }

      return { user: authData.user, session: authData.session }
    } catch (error) {
      console.error('Sign up error:', error)
      throw error
    }
  }

  // Optimized sign in with faster response
  static async signIn(data: SignInData) {
    try {
      const { data: authData, error } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      })

      if (error) {
        // Provide more user-friendly error messages
        if (error.message.includes('Invalid login credentials')) {
          throw new Error('Invalid email or password. Please check your credentials and try again.')
        }
        if (error.message.includes('Email not confirmed')) {
          throw new Error('Please check your email and click the confirmation link before signing in.')
        }
        if (error.message.includes('Too many requests')) {
          throw new Error('Too many login attempts. Please wait a few minutes before trying again.')
        }
        throw new Error(error.message)
      }

      return { user: authData.user, session: authData.session }
    } catch (error) {
      console.error('Sign in error:', error)
      throw error
    }
  }

  // Sign out user
  static async signOut() {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
    } catch (error) {
      console.error('Sign out error:', error)
      throw error
    }
  }

  // Get current user with timeout
  static async getCurrentUser() {
    try {
      const { data: { user }, error } = await supabase.auth.getUser()
      if (error) {
        // Handle the specific "Auth session missing!" error gracefully
        if (error.message === 'Auth session missing!') {
          return null
        }
        throw error
      }
      return user
    } catch (error) {
      console.error('Get current user error:', error)
      return null // Return null instead of throwing to prevent blocking
    }
  }

  // Get user profile with enhanced error handling and connection diagnostics
  static async getUserProfile(userId: string): Promise<UserProfile | null> {
    try {
      // Enhanced connection diagnostics
      console.log('Attempting to fetch user profile for:', userId)
      console.log('Supabase URL:', import.meta.env.VITE_SUPABASE_URL)
      
      // First check if we have a valid session
      const { data: { session }, error: sessionError } = await supabase.auth.getSession()
      
      if (sessionError) {
        console.error('Session error:', sessionError)
        throw new Error('Authentication session error. Please sign in again.')
      }

      if (!session) {
        console.error('No active session found')
        throw new Error('No active session. Please sign in.')
      }

      console.log('Session valid, making database request...')

      // Make the profile request with timeout and better error handling
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 10000) // 10 second timeout

      try {
        const { data, error } = await supabase
          .from('user_profiles')
          .select('*')
          .eq('id', userId)
          .abortSignal(controller.signal)
          .single()

        clearTimeout(timeoutId)

        if (error) {
          console.error('Database query error:', {
            code: error.code,
            message: error.message,
            details: error.details,
            hint: error.hint
          })

          if (error.code === 'PGRST116') {
            // No profile found - this is okay, user can create one
            console.log('No profile found for user, returning null')
            return null
          }
          
          // Check for specific error types
          if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
            throw new Error('Unable to connect to the database. Please check your internet connection and try again.')
          }
          
          if (error.message.includes('JWT')) {
            throw new Error('Authentication token expired. Please sign in again.')
          }
          
          throw new Error(`Database error: ${error.message}`)
        }
        
        console.log('Profile fetched successfully')
        return data
      } catch (fetchError) {
        clearTimeout(timeoutId)
        
        if (fetchError.name === 'AbortError') {
          throw new Error('Request timed out. Please check your internet connection and try again.')
        }
        
        throw fetchError
      }
    } catch (error) {
      // Enhanced error logging with more context
      console.error('Get user profile error:', {
        error: error,
        message: error instanceof Error ? error.message : 'Unknown error',
        userId: userId,
        supabaseUrl: import.meta.env.VITE_SUPABASE_URL,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        online: navigator.onLine
      })
      
      // Check if we're offline
      if (!navigator.onLine) {
        throw new Error('You appear to be offline. Please check your internet connection and try again.')
      }
      
      // Re-throw the error with more context if it's a network error
      if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
        throw new Error('Unable to connect to the database. This might be due to:\n1. Internet connection issues\n2. Supabase service being temporarily unavailable\n3. Incorrect Supabase configuration\n\nPlease check your connection and try again.')
      }
      
      throw error
    }
  }

  // Update user profile
  static async updateUserProfile(userId: string, updates: Partial<UserProfile>) {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .update(updates)
        .eq('id', userId)
        .select()
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error('Update user profile error:', error)
      throw error
    }
  }

  // Reset password
  static async resetPassword(email: string) {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      })

      if (error) {
        if (error.message.includes('Invalid email')) {
          throw new Error('Please enter a valid email address.')
        }
        throw new Error(error.message)
      }
    } catch (error) {
      console.error('Reset password error:', error)
      throw error
    }
  }

  // Listen to auth state changes
  static onAuthStateChange(callback: (event: string, session: any) => void) {
    return supabase.auth.onAuthStateChange(callback)
  }
}