"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import type { Session, User } from "@supabase/supabase-js"
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
    error: any | null
    data: any | null
  }>
  signIn: (
    email: string,
    password: string,
  ) => Promise<{
    error: any | null
    data: any | null
  }>
  signOut: () => Promise<void>
  profile: any | null
  refreshProfile: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { supabase } = useSupabase()
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [profile, setProfile] = useState<any | null>(null)
  const router = useRouter()

  useEffect(() => {
    const getSession = async () => {
      try {
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession()

        if (error) {
          console.error("Error getting session:", error)
          setIsLoading(false)
          return
        }

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

        // We already have the userId, so we don't need to fetch the user again
        // Instead, get the user's email and metadata directly from the session
        const { data: sessionData } = await supabase.auth.getSession()
        const currentUser = sessionData.session?.user

        if (!currentUser) {
          console.error("No active session found when creating profile")
          // Try to get the user directly as a fallback
          const { data: userData } = await supabase.auth.getUser()
          if (!userData.user) {
            console.error("Unable to get user data for profile creation")
            return
          }
          // Use the user data from getUser() call
          await createProfileForUser(userId, userData.user)
          return
        }

        // Use the user data from the session
        await createProfileForUser(userId, currentUser)
        return
      }

      // Profile exists, use the first one
      console.log("Profile data retrieved:", profileData[0])
      setProfile(profileData[0])
    } catch (error) {
      console.error("Unexpected error fetching profile:", error)
    }
  }

  // Helper function to create a profile for a user
  const createProfileForUser = async (userId: string, userData: User) => {
    try {
      const { data: newProfile, error: createError } = await supabase
        .from("profiles")
        .insert({
          id: userId,
          name: userData.user_metadata?.name || "User",
          email: userData.email || "",
          business_type: userData.user_metadata?.business_type || "individual",
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
    } catch (error) {
      console.error("Error in createProfileForUser:", error)
    }
  }

  const refreshProfile = async () => {
    if (user) {
      await fetchProfile(user.id)
    }
  }

  const signUp = async (email: string, password: string, name: string, businessType: string) => {
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
      return { error, data: null }
    }
  }

  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        console.error("Sign-in error:", error)
      } else {
        console.log("Sign-in successful:", data.user?.id)
      }

      return { data, error }
    } catch (error) {
      console.error("Unexpected sign-in error:", error)
      return { error, data: null }
    }
  }

  const signOut = async () => {
    try {
      await supabase.auth.signOut()
      router.push("/login")
    } catch (error) {
      console.error("Sign-out error:", error)
    }
  }

  const value = {
    user,
    session,
    isLoading,
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
