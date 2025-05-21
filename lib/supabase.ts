import { createClient } from "@supabase/supabase-js"

// Create a singleton instance for the browser client
let browserClient: ReturnType<typeof createClient> | null = null

// Create a single supabase client for the browser
export const createBrowserClient = () => {
  if (typeof window === "undefined") {
    throw new Error("Browser client cannot be used on the server side")
  }

  if (!browserClient) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseAnonKey) {
      throw new Error("Supabase URL and anon key must be defined")
    }

    console.log("Creating new Supabase browser client")

    browserClient = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
      },
    })
  }

  return browserClient
}

// Server-side client with elevated permissions (creates a new instance each time)
export const createServerClient = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error("Supabase URL and service key must be defined")
  }

  return createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  })
}
