import React, { createContext, useContext, useEffect, useState } from 'react'
import { User, Session } from '@supabase/supabase-js'
import { AuthService } from '../services/authService'
import type { UserProfile } from '../lib/supabase'

interface AuthContextType {
  user: User | null
  profile: UserProfile | null
  session: Session | null
  loading: boolean
  error: string | null
  signUp: (data: any) => Promise<void>
  signIn: (data: any) => Promise<void>
  signOut: () => Promise<void>
  updateProfile: (updates: Partial<UserProfile>) => Promise<void>
  retryProfileLoad: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

interface AuthProviderProps {
  children: React.ReactNode
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadUserProfile = async (userId: string) => {
    try {
      setError(null)
      console.log('Loading profile for user:', userId)
      const userProfile = await AuthService.getUserProfile(userId)
      setProfile(userProfile)
      console.log('Profile loaded successfully:', userProfile)
    } catch (error) {
      console.error('Error fetching user profile:', error)
      const errorMessage = error instanceof Error ? error.message : 'Failed to load user profile'
      setError(errorMessage)
      setProfile(null)
      
      // Show user-friendly error notification
      if (errorMessage.includes('connection') || errorMessage.includes('fetch')) {
        console.warn('Connection issue detected. Profile will be retried on next interaction.')
      }
    }
  }

  const retryProfileLoad = async () => {
    if (user) {
      await loadUserProfile(user.id)
    }
  }

  useEffect(() => {
    let mounted = true

    // Get initial session with better error handling and shorter timeout
    const getInitialSession = async () => {
      try {
        setError(null)
        console.log('Getting initial session...')
        
        // Reduced timeout from 60000ms to 15000ms (15 seconds) for faster failure detection
        const controller = new AbortController()
        const timeoutId = setTimeout(() => {
          controller.abort()
        }, 15000)
        
        try {
          const currentUser = await AuthService.getCurrentUser()
          clearTimeout(timeoutId)
          
          if (!mounted) return
          
          console.log('Initial session result:', currentUser ? 'User found' : 'No user')
          setUser(currentUser)
          
          if (currentUser) {
            // Load profile in background, don't block UI
            await loadUserProfile(currentUser.id)
          }
        } catch (authError) {
          clearTimeout(timeoutId)
          throw authError
        }
      } catch (error) {
        console.error('Error getting initial session:', error)
        const errorMessage = error instanceof Error ? error.message : 'Session initialization failed'
        
        if (mounted) {
          setUser(null)
          setProfile(null)
          
          // Provide more specific error messages
          if (errorMessage.includes('timeout') || errorMessage.includes('AbortError')) {
            setError('Connection timeout - please check your internet connection and Supabase configuration')
          } else if (errorMessage.includes('fetch')) {
            setError('Network error - unable to connect to authentication service')
          } else {
            setError('Authentication service unavailable - please try again later')
          }
        }
      } finally {
        if (mounted) setLoading(false)
      }
    }

    getInitialSession()

    // Listen for auth changes with optimized handling
    const { data: { subscription } } = AuthService.onAuthStateChange(
      async (event, session) => {
        if (!mounted) return
        
        console.log('Auth state change:', event, session ? 'Session exists' : 'No session')
        setError(null) // Clear errors on auth state change
        setSession(session)
        setUser(session?.user ?? null)
        
        if (session?.user) {
          // Load profile asynchronously
          await loadUserProfile(session.user.id)
        } else {
          setProfile(null)
        }
        
        // Set loading to false immediately for auth state changes
        setLoading(false)
      }
    )

    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, [])

  const signUp = async (data: any) => {
    try {
      setLoading(true)
      setError(null)
      await AuthService.signUp(data)
      // Don't set loading to false here - let auth state change handle it
    } catch (error) {
      setLoading(false)
      const errorMessage = error instanceof Error ? error.message : 'Sign up failed'
      setError(errorMessage)
      throw error
    }
  }

  const signIn = async (data: any) => {
    try {
      setLoading(true)
      setError(null)
      await AuthService.signIn(data)
      // Don't set loading to false here - let auth state change handle it
    } catch (error) {
      setLoading(false)
      const errorMessage = error instanceof Error ? error.message : 'Sign in failed'
      setError(errorMessage)
      throw error
    }
  }

  const signOut = async () => {
    try {
      setLoading(true)
      setError(null)
      await AuthService.signOut()
      setUser(null)
      setProfile(null)
      setSession(null)
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Sign out failed'
      setError(errorMessage)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!user) throw new Error('No user logged in')
    
    try {
      setError(null)
      const updatedProfile = await AuthService.updateUserProfile(user.id, updates)
      setProfile(updatedProfile)
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Profile update failed'
      setError(errorMessage)
      throw error
    }
  }

  const value: AuthContextType = {
    user,
    profile,
    session,
    loading,
    error,
    signUp,
    signIn,
    signOut,
    updateProfile,
    retryProfileLoad,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}