import { createBrowserClient } from "@/lib/supabase"

export interface Quote {
  id: number
  user_id: string
  file_name: string
  dimensions: {
    x: number
    y: number
    z: number
  }
  volume: number
  surface_area: number
  triangle_count: number
  material_id: number
  finish_id: number
  price_min: number
  price_max: number
  price_suggested: number
  created_at: string
  updated_at: string
}

export const saveQuote = async (
  quoteData: Omit<Quote, "id" | "user_id" | "created_at" | "updated_at">,
): Promise<Quote | null> => {
  const supabase = createBrowserClient()

  const { data: userData } = await supabase.auth.getUser()
  if (!userData.user) {
    throw new Error("User not authenticated")
  }

  const { data, error } = await supabase
    .from("quotes")
    .insert({
      ...quoteData,
      user_id: userData.user.id,
    })
    .select()
    .single()

  if (error) {
    console.error("Error saving quote:", error)
    return null
  }

  return data
}

export const getUserQuotes = async (): Promise<Quote[]> => {
  const supabase = createBrowserClient()

  const { data: userData } = await supabase.auth.getUser()
  if (!userData.user) {
    throw new Error("User not authenticated")
  }

  const { data, error } = await supabase
    .from("quotes")
    .select("*")
    .eq("user_id", userData.user.id)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching quotes:", error)
    return []
  }

  return data || []
}

export const getQuoteById = async (id: number): Promise<Quote | null> => {
  const supabase = createBrowserClient()

  const { data, error } = await supabase.from("quotes").select("*").eq("id", id).single()

  if (error) {
    console.error("Error fetching quote:", error)
    return null
  }

  return data
}
