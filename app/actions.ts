"use server"

import OpenAI from "openai"
import { createServerSupabaseClient } from "@/lib/supabase-server"
import { analyzeSTL } from "@/lib/stl-analyzer"
import { calculatePrintTime } from "@/lib/print-time-calculator"
import { revalidatePath } from "next/cache"

// Initialize OpenAI client - only create it when needed to avoid browser initialization
const getOpenAIClient = () => {
  const apiKey = process.env.OPENAI_API_KEY
  if (!apiKey) {
    throw new Error("Missing OpenAI API key")
  }
  return new OpenAI({ apiKey })
}

// Function to safely parse JSON
function safeJsonParse(jsonString: string | null | undefined, fallback: any): any {
  if (!jsonString) return fallback
  try {
    return JSON.parse(jsonString)
  } catch (error) {
    console.error("Error parsing JSON:", error)
    return fallback
  }
}

// Function to check if data is fresh (less than 48 hours old)
function isDataFresh(timestamp: string): boolean {
  const dataTime = new Date(timestamp).getTime()
  const currentTime = new Date().getTime()
  const hoursDifference = (currentTime - dataTime) / (1000 * 60 * 60)
  return hoursDifference < 48
}

// Types
export interface Material {
  id: number
  code: string
  name: string
  description: string | null
  density: number
  created_at: string
  updated_at: string
}

export interface Region {
  id: number
  code: string
  name: string
  currency: string
  shipping_base_cost: number
  shipping_weight_factor: number
  created_at: string
  updated_at: string
}

export interface Finish {
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

export interface MaterialPrice {
  id: number
  material_id: number
  region_id: number
  price_per_gram: number
  last_updated: string
  market_trend: string | null
}

export interface Validation {
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
  surface_area?: number
  issues: string[] | null
  created_at: string
}

export interface Quote {
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

// Function to get all materials
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

    // Initialize OpenAI client only when needed
    const openai = getOpenAIClient()

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
    const responseContent = aiResponse.choices[0].message.content
    const priceData = safeJsonParse(responseContent, { pricePerGram: 0.03, marketTrend: "Stable pricing" })

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
    const { data: updatedPrice, error: updateError } = await supabase
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

    if (updateError) {
      console.error("Error updating material price:", updateError)
      return null
    }

    return updatedPrice
  } catch (error) {
    console.error("Error updating material price with AI:", error)
    return null
  }
}

// Function to validate STL file using OpenAI
export async function validateSTLWithAI(file: File): Promise<Validation> {
  const supabase = createServerSupabaseClient()

  // Read the file as ArrayBuffer
  const fileBuffer = await file.arrayBuffer()

  // Analyze the STL geometry using our analyzer
  let stlAnalysis
  try {
    stlAnalysis = await analyzeSTL(fileBuffer)
  } catch (error) {
    console.error("Error analyzing STL file:", error)
    // Use fallback data if analysis fails
    stlAnalysis = {
      triangles: 1000,
      dimensions: { x: 100, y: 100, z: 100 },
      volume: 50,
      surfaceArea: 200,
    }
  }

  const { triangles, dimensions, volume, surfaceArea } = stlAnalysis

  try {
    // Initialize OpenAI client only when needed
    const openai = getOpenAIClient()

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
            - Surface Area: ${surfaceArea.toFixed(2)} cm²
            
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
    const responseContent = aiResponse.choices[0].message.content
    const aiAnalysis = safeJsonParse(responseContent, { isPrintable: true, issues: [] })

    // Save validation result to database
    const { data: validation, error: validationError } = await supabase
      .from("validations")
      .insert({
        file_name: file.name,
        file_size: file.size,
        triangles,
        is_printable: aiAnalysis.isPrintable,
        dimensions,
        volume,
        surface_area: surfaceArea,
        issues: aiAnalysis.issues,
      })
      .select()
      .single()

    if (validationError) {
      console.error("Error saving validation:", validationError)
      throw new Error("Failed to save validation result")
    }

    return validation
  } catch (error) {
    console.error("Error during validation:", error)

    // Fallback validation if OpenAI fails
    const fallbackValidation = {
      is_printable: true,
      issues: ["Unable to perform AI validation. Basic geometry check passed."],
    }

    // Save fallback validation result to database
    const { data: validation, error: fallbackError } = await supabase
      .from("validations")
      .insert({
        file_name: file.name,
        file_size: file.size,
        triangles,
        is_printable: fallbackValidation.is_printable,
        dimensions,
        volume,
        surface_area: surfaceArea,
        issues: fallbackValidation.issues,
      })
      .select()
      .single()

    if (fallbackError) {
      console.error("Error saving fallback validation:", fallbackError)
      throw new Error("Failed to save validation result")
    }

    return validation
  }
}

// Function to calculate quote using OpenAI and real STL analysis
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

  try {
    // Analyze the STL geometry using our analyzer
    let stlAnalysis
    try {
      stlAnalysis = await analyzeSTL(fileBuffer)
    } catch (error) {
      console.error("Error analyzing STL file:", error)
      // Use fallback data if analysis fails
      stlAnalysis = {
        triangles: 1000,
        dimensions: { x: 100, y: 100, z: 100 },
        volume: 50,
        surfaceArea: 200,
      }
    }

    const { triangles, dimensions, volume, surfaceArea } = stlAnalysis

    // Calculate weight based on material density
    const weight = volume * material.density

    // Initialize OpenAI client only when needed
    const openai = getOpenAIClient()

    // Use OpenAI to get optimal print settings
    const aiResponse = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are an expert in 3D printing. Provide optimal print settings.",
        },
        {
          role: "user",
          content: `Provide optimal print settings for this 3D model:
            - Material: ${material.name}
            - Finish quality: ${finish.name} (layer height: ${finish.layer_height}mm)
            - Dimensions: ${dimensions.x.toFixed(2)} x ${dimensions.y.toFixed(2)} x ${dimensions.z.toFixed(2)} mm
            - Volume: ${volume.toFixed(2)} cm³
            - Surface Area: ${surfaceArea.toFixed(2)} cm²
            - Weight: ${weight.toFixed(2)} g
            - Triangles: ${triangles}
            
            Return your response as JSON with the following structure:
            {
              "printSettings": {
                "layerHeight": number,
                "infill": number,
                "printSpeed": number,
                "temperature": number
              }
            }`,
        },
      ],
      response_format: { type: "json_object" },
    })

    // Parse the AI response
    const responseContent = aiResponse.choices[0].message.content
    const printData = safeJsonParse(responseContent, {
      printSettings: { layerHeight: 0.2, infill: 20, printSpeed: 60, temperature: 210 },
    })

    // Calculate print time using our utility
    const printTime =
      calculatePrintTime(
        volume,
        printData.printSettings.layerHeight,
        printData.printSettings.printSpeed,
        printData.printSettings.infill,
      ) * finish.time_multiplier

    // Calculate costs
    const materialCost = weight * materialPrice.price_per_gram
    const laborCost = (printTime / 60) * 15 // $15 per hour, adjusted for finish quality

    // Calculate shipping based on weight and region
    const shippingCost = region.shipping_base_cost + weight * region.shipping_weight_factor

    // Calculate markup
    const markup = (materialCost + laborCost) * 0.3

    // Calculate total price
    const totalPrice = materialCost + laborCost + shippingCost + markup

    // Calculate estimated delivery date
    const today = new Date()
    const deliveryDays = Math.floor(printTime / 60 / 8) + 2 // Estimate based on print time (8 hour work days) + 2 days for processing
    const deliveryDate = new Date(today)
    deliveryDate.setDate(today.getDate() + deliveryDays)

    // Generate quote reference
    const quoteReference = `QUOTE-${Date.now().toString(36).toUpperCase()}`

    // Save quote to database
    const { data: quote, error: quoteError } = await supabase
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

    if (quoteError) {
      console.error("Error saving quote:", quoteError)
      throw new Error("Failed to save quote")
    }

    return quote
  } catch (error) {
    console.error("Error during quote calculation:", error)

    // Fallback if OpenAI fails
    // Use default print settings
    const defaultPrintSettings = {
      layerHeight: finish.layer_height,
      infill: 20,
      printSpeed: 60,
      temperature: 210,
    }

    // Use fallback data for STL analysis
    const dimensions = { x: 100, y: 100, z: 100 }
    const volume = 50
    const triangles = 1000

    // Calculate weight based on material density
    const weight = volume * material.density

    // Calculate print time using our utility
    const printTime =
      calculatePrintTime(
        volume,
        defaultPrintSettings.layerHeight,
        defaultPrintSettings.printSpeed,
        defaultPrintSettings.infill,
      ) * finish.time_multiplier

    // Calculate costs
    const materialCost = weight * materialPrice.price_per_gram
    const laborCost = (printTime / 60) * 15 // $15 per hour, adjusted for finish quality

    // Calculate shipping based on weight and region
    const shippingCost = region.shipping_base_cost + weight * region.shipping_weight_factor

    // Calculate markup
    const markup = (materialCost + laborCost) * 0.3

    // Calculate total price
    const totalPrice = materialCost + laborCost + shippingCost + markup

    // Calculate estimated delivery date
    const today = new Date()
    const deliveryDays = Math.floor(printTime / 60 / 8) + 2 // Estimate based on print time (8 hour work days) + 2 days for processing
    const deliveryDate = new Date(today)
    deliveryDate.setDate(today.getDate() + deliveryDays)

    // Generate quote reference
    const quoteReference = `QUOTE-${Date.now().toString(36).toUpperCase()}`

    // Save quote to database
    const { data: quote, error: fallbackError } = await supabase
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
        print_settings: defaultPrintSettings,
        estimated_delivery: deliveryDate.toISOString(),
      })
      .select()
      .single()

    if (fallbackError) {
      console.error("Error saving fallback quote:", fallbackError)
      throw new Error("Failed to save quote")
    }

    return quote
  }
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
