import { createBrowserClient } from "@/lib/supabase"

export interface Material {
  id: number
  name: string
  code: string
  description: string
  density: number
  created_at: string
  updated_at: string
}

export interface Finish {
  id: number
  name: string
  code: string
  description: string
  cost_multiplier: number
  time_multiplier: number
  layer_height: number
  created_at: string
  updated_at: string
}

export interface MaterialPrice {
  id: number
  material_id: number
  price_per_gram: number
  region_id: number
  market_trend: string
  last_updated: string
}

export const getMaterials = async (): Promise<Material[]> => {
  const supabase = createBrowserClient()
  const { data, error } = await supabase.from("materials").select("*")

  if (error) {
    console.error("Error fetching materials:", error)
    return []
  }

  return data || []
}

export const getFinishes = async (): Promise<Finish[]> => {
  const supabase = createBrowserClient()
  const { data, error } = await supabase.from("finishes").select("*")

  if (error) {
    console.error("Error fetching finishes:", error)
    return []
  }

  return data || []
}

export const getMaterialPrices = async (materialId?: number): Promise<MaterialPrice[]> => {
  const supabase = createBrowserClient()
  let query = supabase.from("material_prices").select("*")

  if (materialId) {
    query = query.eq("material_id", materialId)
  }

  const { data, error } = await query

  if (error) {
    console.error("Error fetching material prices:", error)
    return []
  }

  return data || []
}
