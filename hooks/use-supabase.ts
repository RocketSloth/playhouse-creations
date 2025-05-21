"use client"

import { useState, useEffect } from "react"
import { createBrowserClient } from "@/lib/supabase"

// This hook ensures we only create the client once per component tree
export function useSupabase() {
  const [supabase] = useState(() => {
    try {
      return createBrowserClient()
    } catch (error) {
      console.error("Failed to initialize Supabase client:", error)
      throw error
    }
  })

  // Verify the client is valid on mount, but don't throw errors
  useEffect(() => {
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

  return { supabase }
}
