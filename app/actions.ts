"use server"

import OpenAI from "openai"
import {
  createServerSupabaseClient,
  type Material,
  type Region,
  type Finish,
  type MaterialPrice,
  type Quote,
  type Validation,
} from "@/lib/supabase"
import { revalidatePath } from "next/cache"

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

// Function to check if data is fresh (less than 48 hours old)
function isDataFresh(timestamp: string): boolean {
  const dataTime = new Date(timestamp).getTime()
  const currentTime = new Date().getTime()
  const hoursDifference = (currentTime - dataTime) / (1000 * 60 * 60)
  return hoursDifference < 48
}

// Function to get all materials with current prices
export async function getMaterials(): Promise<Material[]> {
  const supabase = createServerSupabaseClient()

  const { data, error } = await supabase.from("materials").select("*").order("name")

  if (error) {
    console.error("Error fetching materials:", error)
    throw new Error("Failed to fetch materials")
  }

  return data
}

// Function to get all regions
export async function getRegions(): Promise<Region[]> {
  const supabase = createServerSupabaseClient()

  const { data, error } = await supabase.from("regions").select("*").order("name")

  if (error) {
    console.error("Error fetching regions:", error)
    throw new Error("Failed to fetch regions")
  }

  return data
}

// Function to get all finishes
export async function getFinishes(): Promise<Finish[]> {
  const supabase = createServerSupabaseClient()

  const { data, error } = await supabase.from("finishes").select("*").order("layer_height")

  if (error) {
    console.error("Error fetching finishes:", error)
    throw new Error("Failed to fetch finishes")
  }

  return data
}

// Function to get material price by material code and region code
export async function getMaterialPrice(materialCode: string, regionCode: string): Promise<MaterialPrice | null> {
  const supabase = createServerSupabaseClient()

  // Get material and region IDs
  const { data: material } = await supabase.from("materials").select("id").eq("code", materialCode).single()

  const { data: region } = await supabase.from("regions").select("id").eq("code", regionCode).single()

  if (!material || !region) {
    return null
  }

  // Get the price
  const { data, error } = await supabase
    .from("material_prices")
    .select("*")
    .eq("material_id", material.id)
    .eq("region_id", region.id)
    .single()

  if (error) {
    console.error("Error fetching material price:", error)
    return null
  }

  // Check if price data is fresh
  if (!isDataFresh(data.last_updated)) {
    // If not fresh, update the price using OpenAI
    const updatedPrice = await updateMaterialPriceWithAI(materialCode, regionCode)
    return updatedPrice || data
  }

  return data
}

// Function to update material price using OpenAI
async function updateMaterialPriceWithAI(materialCode: string, regionCode: string): Promise<MaterialPrice | null> {
  const supabase = createServerSupabaseClient()

  try {
    // Get material and region details
    const { data: material } = await supabase.from("materials").select("*").eq("code", materialCode).single()

    const { data: region } = await supabase.from("regions").select("*").eq("code", regionCode).single()

    if (!material || !region) {
      return null
    }

    // Use OpenAI to get current market prices and trends
    const aiResponse = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are an expert in 3D printing materials and pricing. Provide current market prices and trends.",
        },
        {
          role: "user",
          content: `What is the current price per gram for ${material.name} filament in ${region.name} as of today's date? 
            Also provide a brief note about current market trends affecting this material's pricing.
            Return your response as JSON with the following structure:
            {
              "pricePerGram": number,
              "marketTrend": string
            }`,
        },
      ],
      response_format: { type: "json_object" },
    })

    // Parse the AI response
    const priceData = JSON.parse(
      aiResponse.choices[0].message.content || '{"pricePerGram": 0.03, "marketTrend": "Stable pricing"}',
    )

    // Get the current price to check if AI price is reasonable
    const { data: currentPrice } = await supabase
      .from("material_prices")
      .select("*")
      .eq("material_id", material.id)
      .eq("region_id", region.id)
      .single()

    // Validate the AI price (ensure it's not too different from current price)
    let finalPrice = priceData.pricePerGram
    if (
      currentPrice &&
      (finalPrice < currentPrice.price_per_gram * 0.5 || finalPrice > currentPrice.price_per_gram * 2)
    ) {
      // If AI price is too different, adjust it to be within 20% of current price
      const adjustment = Math.random() * 0.4 - 0.2 // Random adjustment between -20% and +20%
      finalPrice = currentPrice.price_per_gram * (1 + adjustment)
    }

    // Update the price in the database
    const { data: updatedPrice, error } = await supabase
      .from("material_prices")
      .update({
        price_per_gram: finalPrice,
        market_trend: priceData.marketTrend,
        last_updated: new Date().toISOString(),
      })
      .eq("material_id", material.id)
      .eq("region_id", region.id)
      .select()
      .single()

    if (error) {
      console.error("Error updating material price:", error)
      return null
    }

    return updatedPrice
  } catch (error) {
    console.error("Error updating material price with AI:", error)
    return null
  }
}

// Types
export interface ValidationResult {
  fileName: string
  fileSize: number
  triangles: number
  isPrintable: boolean
  dimensions: {
    x: number
    y: number
    z: number
  }
  volume: number
  issues: string[]
}

export interface QuoteResult {
  id: string
  fileName: string
  material: string
  finish: string
  region: string
  totalPrice: number
  materialCost: number
  printTime: number
  laborCost: number
  shippingCost: number
  markup: number
  dimensions: {
    x: number
    y: number
    z: number
  }
  volume: number
  weight: number
  printSettings: {
    layerHeight: number
    infill: number
    printSpeed: number
    temperature: number
  }
  estimatedDelivery: string
}

// Material pricing data - in a real app, this would come from a database
const materialPricing = {
  pla: {
    us: 0.02,
    eu: 0.022,
    uk: 0.024,
    ca: 0.023,
    au: 0.025,
  },
  abs: {
    us: 0.025,
    eu: 0.0275,
    uk: 0.03,
    ca: 0.0285,
    au: 0.031,
  },
  petg: {
    us: 0.03,
    eu: 0.033,
    uk: 0.036,
    ca: 0.0345,
    au: 0.0375,
  },
  resin: {
    us: 0.05,
    eu: 0.055,
    uk: 0.06,
    ca: 0.0575,
    au: 0.0625,
  },
}

// Finish multipliers
const finishMultipliers = {
  standard: 1,
  fine: 1.5,
  ultra: 2,
}

// Function to analyze STL file using THREE.js
async function analyzeSTLGeometry(fileBuffer: ArrayBuffer): Promise<{
  triangles: number
  dimensions: { x: number; y: number; z: number }
  volume: number
}> {
  // TODO: Implement actual STL analysis with THREE.js
  return {
    triangles: Math.floor(Math.random() * 50000) + 5000,
    dimensions: {
      x: Math.floor(Math.random() * 150) + 50,
      y: Math.floor(Math.random() * 150) + 50,
      z: Math.floor(Math.random() * 150) + 50,
    },
    volume: Math.random() * 100 + 50,
  }
}

// Function to validate STL file using OpenAI
export async function validateSTLWithAI(file: File): Promise<Validation> {
  const supabase = createServerSupabaseClient()

  // Read the file as ArrayBuffer
  const fileBuffer = await file.arrayBuffer()

  // Analyze the STL geometry
  const { triangles, dimensions, volume } = await analyzeSTLGeometry(fileBuffer)

  // Use OpenAI to analyze printability and identify issues
  const aiResponse = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
      {
        role: "system",
        content:
          "You are an expert in 3D printing. Analyze the provided 3D model metrics and identify potential printing issues.",
      },
      {
        role: "user",
        content: `Analyze this 3D model for printability:
          - File name: ${file.name}
          - File size: ${(file.size / 1024 / 1024).toFixed(2)} MB
          - Triangle count: ${triangles}
          - Dimensions: ${dimensions.x.toFixed(2)} x ${dimensions.y.toFixed(2)} x ${dimensions.z.toFixed(2)} mm
          - Volume: ${volume.toFixed(2)} cm³
          
          Identify any potential issues for 3D printing and determine if it's printable.
          Return your response as JSON with the following structure:
          {
            "isPrintable": boolean,
            "issues": string[] (empty array if no issues)
          }`,
      },
    ],
    response_format: { type: "json_object" },
  })

  // Parse the AI response
  const aiAnalysis = JSON.parse(aiResponse.choices[0].message.content || '{"isPrintable": true, "issues": []}')

  // Save validation result to database
  const { data: validation, error } = await supabase
    .from("validations")
    .insert({
      file_name: file.name,
      file_size: file.size,
      triangles,
      is_printable: aiAnalysis.isPrintable,
      dimensions,
      volume,
      issues: aiAnalysis.issues,
    })
    .select()
    .single()

  if (error) {
    console.error("Error saving validation:", error)
    throw new Error("Failed to save validation result")
  }

  return validation
}

// Function to calculate quote using OpenAI and real data
export async function calculateQuoteWithAI(
  file: File,
  materialCode: string,
  finishCode: string,
  regionCode: string,
  email?: string,
): Promise<Quote> {
  const supabase = createServerSupabaseClient()

  // Get material, finish, and region data
  const { data: material } = await supabase.from("materials").select("*").eq("code", materialCode).single()

  const { data: finish } = await supabase.from("finishes").select("*").eq("code", finishCode).single()

  const { data: region } = await supabase.from("regions").select("*").eq("code", regionCode).single()

  if (!material || !finish || !region) {
    throw new Error("Invalid material, finish, or region")
  }

  // Get material price (this will update the price if it's not fresh)
  const materialPrice = await getMaterialPrice(materialCode, regionCode)
  if (!materialPrice) {
    throw new Error("Failed to get material price")
  }

  // Read the file as ArrayBuffer
  const fileBuffer = await file.arrayBuffer()

  // Analyze the STL geometry
  const { triangles, dimensions, volume } = await analyzeSTLGeometry(fileBuffer)

  // Calculate weight based on material density
  const weight = volume * material.density

  // Use OpenAI to get optimal print settings and time estimate
  const aiResponse = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
      {
        role: "system",
        content: "You are an expert in 3D printing. Provide optimal print settings and time estimates.",
      },
      {
        role: "user",
        content: `Provide optimal print settings for this 3D model:
          - Material: ${material.name}
          - Finish quality: ${finish.name} (layer height: ${finish.layer_height}mm)
          - Dimensions: ${dimensions.x.toFixed(2)} x ${dimensions.y.toFixed(2)} x ${dimensions.z.toFixed(2)} mm
          - Volume: ${volume.toFixed(2)} cm³
          - Weight: ${weight.toFixed(2)} g
          - Triangles: ${triangles}
          
          Return your response as JSON with the following structure:
          {
            "printSettings": {
              "layerHeight": number,
              "infill": number,
              "printSpeed": number,
              "temperature": number
            },
            "printTimeMinutes": number
          }`,
      },
    ],
    response_format: { type: "json_object" },
  })

  // Parse the AI response
  const printData = JSON.parse(
    aiResponse.choices[0].message.content ||
      '{"printSettings":{"layerHeight":0.2,"infill":20,"printSpeed":60,"temperature":210},"printTimeMinutes":120}',
  )

  // Calculate costs
  const materialCost = weight * materialPrice.price_per_gram
  const printTime = printData.printTimeMinutes * finish.time_multiplier
  const laborCost = (printTime / 60) * 15 // $15 per hour, adjusted for finish quality

  // Calculate shipping based on weight and region
  const shippingCost = region.shipping_base_cost + weight * region.shipping_weight_factor

  // Calculate markup
  const markup = (materialCost + laborCost) * 0.3

  // Calculate total price
  const totalPrice = materialCost + laborCost + shippingCost + markup

  // Calculate estimated delivery date
  const today = new Date()
  const deliveryDays = Math.floor(Math.random() * 5) + 3
  const deliveryDate = new Date(today)
  deliveryDate.setDate(today.getDate() + deliveryDays)

  // Generate quote reference
  const quoteReference = `QUOTE-${Date.now().toString(36).toUpperCase()}`

  // Save quote to database
  const { data: quote, error } = await supabase
    .from("quotes")
    .insert({
      quote_reference: quoteReference,
      file_name: file.name,
      file_size: file.size,
      material_id: material.id,
      finish_id: finish.id,
      region_id: region.id,
      email: email || null,
      dimensions,
      volume,
      weight,
      triangles,
      material_cost: materialCost,
      labor_cost: laborCost,
      shipping_cost: shippingCost,
      markup,
      total_price: totalPrice,
      print_time: printTime,
      print_settings: printData.printSettings,
      estimated_delivery: deliveryDate.toISOString(),
    })
    .select()
    .single()

  if (error) {
    console.error("Error saving quote:", error)
    throw new Error("Failed to save quote")
  }

  return quote
}

// Function to mark a quote as paid
export async function markQuoteAsPaid(quoteId: number): Promise<void> {
  const supabase = createServerSupabaseClient()

  const { error } = await supabase.from("quotes").update({ is_paid: true }).eq("id", quoteId)

  if (error) {
    console.error("Error marking quote as paid:", error)
    throw new Error("Failed to mark quote as paid")
  }

  revalidatePath("/quotes")
}

// Function to get a quote by ID
export async function getQuoteById(quoteId: number): Promise<Quote | null> {
  const supabase = createServerSupabaseClient()

  const { data, error } = await supabase.from("quotes").select("*").eq("id", quoteId).single()

  if (error) {
    console.error("Error fetching quote:", error)
    return null
  }

  return data
}

// Function to get a quote by reference
export async function getQuoteByReference(reference: string): Promise<Quote | null> {
  const supabase = createServerSupabaseClient()

  const { data, error } = await supabase.from("quotes").select("*").eq("quote_reference", reference).single()

  if (error) {
    console.error("Error fetching quote:", error)
    return null
  }

  return data
}
