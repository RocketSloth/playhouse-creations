"use client"

import { useState, useEffect } from "react"
import { createBrowserClient } from "@/lib/supabase"

// This hook ensures we only create the client once per component tree
export function useSupabase() {
  // Use null as initial state and only create the client after checking we're in the browser
  const [supabase, setSupabase] = useState<ReturnType<typeof createBrowserClient> | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Only create the client in the browser
    if (typeof window !== "undefined") {
      try {
        const client = createBrowserClient()
        setSupabase(client)
      } catch (error) {
        console.error("Failed to initialize Supabase client:", error)
      } finally {
        setIsLoading(false)
      }
    }
  }, [])

  // Verify the client is valid on mount
  useEffect(() => {
    if (!supabase) return

    const checkClient = async () => {
      try {
        // A simple check that doesn't require specific table access
        // Just verify we can connect to Supabase
        const { data, error } = await supabase.auth.getSession()

        if (error) {
          console.error("Supabase session check failed:", error)
        } else {
          console.log("Supabase client initialized successfully")
        }
      } catch (e) {
        console.error("Unexpected error checking Supabase client:", e)
      }
    }

    checkClient()
  }, [supabase])

  return { supabase, isLoading }
}
