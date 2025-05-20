import { createClient } from "@supabase/supabase-js"

// Create a single supabase client for server-side usage
export const createServerSupabaseClient = () => {
  const supabaseUrl = process.env.SUPABASE_URL
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !supabaseKey) {
    throw new Error("Missing Supabase environment variables")
  }

  return createClient(supabaseUrl, supabaseKey)
}

// Types for our database tables
export type Material = {
  id: number
  code: string
  name: string
  description: string | null
  density: number
  created_at: string
  updated_at: string
}

export type Region = {
  id: number
  code: string
  name: string
  currency: string
  shipping_base_cost: number
  shipping_weight_factor: number
  created_at: string
  updated_at: string
}

export type Finish = {
  id: number
  code: string
  name: string
  description: string | null
  layer_height: number
  time_multiplier: number
  cost_multiplier: number
  created_at: string
  updated_at: string
}

export type MaterialPrice = {
  id: number
  material_id: number
  region_id: number
  price_per_gram: number
  last_updated: string
  market_trend: string | null
}

export type Quote = {
  id: number
  quote_reference: string
  file_name: string
  file_size: number
  material_id: number
  finish_id: number
  region_id: number
  email: string | null
  dimensions: {
    x: number
    y: number
    z: number
  }
  volume: number
  weight: number
  triangles: number
  material_cost: number
  labor_cost: number
  shipping_cost: number
  markup: number
  total_price: number
  print_time: number
  print_settings: {
    layerHeight: number
    infill: number
    printSpeed: number
    temperature: number
  }
  is_paid: boolean
  estimated_delivery: string | null
  created_at: string
}

export type Validation = {
  id: number
  file_name: string
  file_size: number
  triangles: number
  is_printable: boolean
  dimensions: {
    x: number
    y: number
    z: number
  }
  volume: number
  issues: string[] | null
  created_at: string
}

// Type for joined material with price
export type MaterialWithPrice = Material & {
  price: MaterialPrice
}
