"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import type { Session, User, AuthError } from "@supabase/supabase-js"
import { useSupabase } from "@/hooks/use-supabase"
import { useRouter } from "next/navigation"

type AuthContextType = {
  user: User | null
  session: Session | null
  isLoading: boolean
  signUp: (
    email: string,
    password: string,
    name: string,
    businessType: string,
  ) => Promise<{
    error: AuthError | Error | null
    data: any | null
  }>
  signIn: (
    email: string,
    password: string,
  ) => Promise<{
    error: AuthError | Error | null
    data: any | null
  }>
  signOut: () => Promise<void>
  profile: any | null
  refreshProfile: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { supabase, isLoading: isClientLoading } = useSupabase()
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [profile, setProfile] = useState<any | null>(null)
  const router = useRouter()

  useEffect(() => {
    // Don't try to get the session if the supabase client isn't ready
    if (!supabase) {
      console.log("Supabase client not ready yet")
      return
    }

    const getSession = async () => {
      try {
        console.log("Getting session...")
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession()

        if (error) {
          console.error("Error getting session:", error)
          setIsLoading(false)
          return
        }

        console.log("Session retrieved:", session ? "Valid session" : "No session")
        setSession(session)
        setUser(session?.user ?? null)

        if (session?.user) {
          try {
            await fetchProfile(session.user.id)
          } catch (e) {
            console.error("Error fetching profile during initialization:", e)
          }
        }
      } catch (error) {
        console.error("Unexpected error getting session:", error)
      } finally {
        setIsLoading(false)
      }
    }

    getSession()

    try {
      console.log("Setting up auth state change listener")
      const {
        data: { subscription },
      } = supabase.auth.onAuthStateChange(async (event, session) => {
        console.log("Auth state changed:", event, session?.user?.id)
        setSession(session)
        setUser(session?.user ?? null)

        if (session?.user) {
          try {
            await fetchProfile(session.user.id)
          } catch (e) {
            console.error("Error fetching profile after auth state change:", e)
          }
        } else {
          setProfile(null)
        }

        router.refresh()
      })

      return () => {
        subscription.unsubscribe()
      }
    } catch (error) {
      console.error("Error setting up auth state change listener:", error)
      return () => {}
    }
  }, [router, supabase])

  const fetchProfile = async (userId: string) => {
    if (!supabase) return

    try {
      console.log("Fetching profile for user:", userId)

      // First check if the profile exists
      const { data: profileData, error: countError } = await supabase
        .from("profiles")
        .select("*", { count: "exact" })
        .eq("id", userId)

      if (countError) {
        console.error("Error checking profile existence:", countError)
        return
      }

      // If no profile exists, create one
      if (!profileData || profileData.length === 0) {
        console.log("No profile found for user, creating one...")

        // Get user email from auth
        const { data: userData } = await supabase.auth.getUser()
        if (!userData.user) {
          console.error("Unable to get user data")
          return
        }

        // Create a new profile
        const { data: newProfile, error: createError } = await supabase
          .from("profiles")
          .insert({
            id: userId,
            name: userData.user.user_metadata?.name || "User",
            email: userData.user.email || "",
            business_type: userData.user.user_metadata?.business_type || "individual",
            credits: 5,
          })
          .select()
          .single()

        if (createError) {
          console.error("Error creating profile:", createError)
          return
        }

        console.log("Created new profile:", newProfile)
        setProfile(newProfile)
        return
      }

      // Profile exists, use the first one
      console.log("Profile data retrieved:", profileData[0])
      setProfile(profileData[0])
    } catch (error) {
      console.error("Unexpected error fetching profile:", error)
    }
  }

  const refreshProfile = async () => {
    if (user && supabase) {
      await fetchProfile(user.id)
    }
  }

  const signUp = async (email: string, password: string, name: string, businessType: string) => {
    if (!supabase) {
      return { error: new Error("Supabase client not initialized"), data: null }
    }

    try {
      console.log("Signing up with:", { email, name, businessType })

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
            business_type: businessType,
          },
        },
      })

      if (error) {
        console.error("Sign-up error:", error)
        return { error, data: null }
      }

      console.log("Sign-up successful:", data)

      // Wait a moment to ensure the trigger has time to create the profile
      if (data.user) {
        setTimeout(async () => {
          try {
            await fetchProfile(data.user!.id)
          } catch (e) {
            console.error("Error fetching profile after signup:", e)
          }
        }, 1000)
      }

      return { data, error: null }
    } catch (error) {
      console.error("Unexpected sign-up error:", error)
      return { error: error as Error, data: null }
    }
  }

  const signIn = async (email: string, password: string) => {
    if (!supabase) {
      return { error: new Error("Supabase client not initialized"), data: null }
    }

    try {
      console.log("Signing in with email:", email)
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        console.error("Sign-in error:", error)
        return { error, data: null }
      } else {
        console.log("Sign-in successful:", data.user?.id)

        // Ensure we have the user's profile
        if (data.user) {
          try {
            await fetchProfile(data.user.id)
          } catch (e) {
            console.error("Error fetching profile after sign-in:", e)
          }
        }
      }

      return { data, error: null }
    } catch (error) {
      console.error("Unexpected sign-in error:", error)
      return { error: error as Error, data: null }
    }
  }

  const signOut = async () => {
    if (!supabase) return

    try {
      console.log("Signing out...")
      await supabase.auth.signOut()
      setUser(null)
      setSession(null)
      setProfile(null)
      router.push("/login")
    } catch (error) {
      console.error("Sign-out error:", error)
    }
  }

  // Combine loading states
  const combinedLoading = isClientLoading || isLoading

  const value = {
    user,
    session,
    isLoading: combinedLoading,
    signUp,
    signIn,
    signOut,
    profile,
    refreshProfile,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
