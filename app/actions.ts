"use server"

import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"

interface ModelData {
  dimensions: {
    x: number
    y: number
    z: number
  }
  volume: number
  surfaceArea: number
  triangleCount: number
  fileName: string
  color?: string
}

interface FormData {
  filamentType: string
  costPerSpool: number
  spoolWeight: number
  printerHourlyRate: number
  printSpeed: number
  otherCosts: number
  density: number
}

interface QuoteRequest {
  modelData: ModelData
  formData: FormData
}

// Updated interface to include market comparison
interface QuoteResult {
  priceRange: {
    min: number
    max: number
  }
  breakdown: {
    material: number
    time: number
    electricity: number
    profit: number
    other: number
  }
  marketComparison: {
    averageMarketPrice: number
    pricePosition: "below" | "competitive" | "premium"
    competitorPrices: {
      low: number
      average: number
      high: number
    }
  }
  suggestions: string[]
  communicationTips: string[]
}

// Helper function to extract JSON from a string that might contain markdown
function extractJsonFromString(text: string): string {
  // Check if the response contains markdown code blocks
  const jsonRegex = /```(?:json)?\s*(\{[\s\S]*?\})\s*```/
  const match = text.match(jsonRegex)

  if (match && match[1]) {
    // Return just the JSON part
    return match[1]
  }

  // If no code blocks found, return the original text
  // (it might be valid JSON without markdown formatting)
  return text
}

export async function generateQuoteAction(request: QuoteRequest): Promise<QuoteResult> {
  const { modelData, formData } = request

  // Calculate estimated print time
  const estimatedPrintTimeHours = modelData.volume / formData.printSpeed

  // Calculate material cost
  const weightGrams = modelData.volume * formData.density
  const materialCost = (weightGrams / formData.spoolWeight) * formData.costPerSpool

  // Calculate electricity cost (rough estimate)
  const electricityCost = estimatedPrintTimeHours * 0.1 // Assuming $0.10 per hour for electricity

  // Calculate time cost
  const timeCost = estimatedPrintTimeHours * formData.printerHourlyRate

  // Basic cost calculation
  const baseCost = materialCost + timeCost + electricityCost + formData.otherCosts

  // Generate AI-based quote suggestions
  try {
    const prompt = `
You are an expert 3D printing service provider with extensive knowledge of market rates and competitive pricing. Please provide a detailed quote for printing a 3D model with the following specifications:

Model Information:
- Number of Parts: ${modelData.fileName.includes("parts") ? modelData.fileName : "1 part"}
- Dimensions: ${modelData.dimensions.x.toFixed(2)} × ${modelData.dimensions.y.toFixed(2)} × ${modelData.dimensions.z.toFixed(2)} mm
- Volume: ${modelData.volume.toFixed(2)} cm³
- Surface Area: ${modelData.surfaceArea.toFixed(2)} cm²
- Triangle Count: ${modelData.triangleCount}
- Estimated Weight: ${(modelData.volume * formData.density).toFixed(2)} g

Printing Parameters:
- Filament Type: ${formData.filamentType}
- Cost Per Spool: $${formData.costPerSpool.toFixed(2)}
- Spool Weight: ${formData.spoolWeight} g
- Printer Hourly Rate: $${formData.printerHourlyRate.toFixed(2)}
- Print Speed: ${formData.printSpeed} cm³/hr
- Other Costs: $${formData.otherCosts.toFixed(2)}

Calculated Estimates:
- Estimated Print Time: ${estimatedPrintTimeHours.toFixed(2)} hours
- Material Cost: $${materialCost.toFixed(2)}
- Time Cost: $${timeCost.toFixed(2)}
- Electricity Cost: $${electricityCost.toFixed(2)}
- Base Cost: $${baseCost.toFixed(2)}

${modelData.fileName.includes("parts") ? "This is a multi-part model that requires printing multiple separate pieces. Consider assembly time and complexity in your pricing." : ""}

IMPORTANT: You must analyze and compare with current market rates for similar 3D printing services. Consider what competitors would charge for a similar print with these specifications. Research typical pricing for ${formData.filamentType} prints of this size and complexity in the market.

Please provide:
1. A recommended price range (minimum and maximum price in USD)
2. A detailed breakdown of costs including material, time, electricity, profit margin, and other costs
3. A market comparison analysis showing:
   - The average market price for similar prints
   - Whether your suggested price is below market, competitive, or premium
   - Typical competitor price ranges (low, average, high)
4. 3-5 specific suggestions for pricing this particular print
5. 2-3 tips for communicating the value to customers

Format your response as a JSON object with the following structure without any markdown formatting or code blocks:
{
  "priceRange": {
    "min": number,
    "max": number
  },
  "breakdown": {
    "material": number,
    "time": number,
    "electricity": number,
    "profit": number,
    "other": number
  },
  "marketComparison": {
    "averageMarketPrice": number,
    "pricePosition": "below" | "competitive" | "premium",
    "competitorPrices": {
      "low": number,
      "average": number,
      "high": number
    }
  },
  "suggestions": [string, string, ...],
  "communicationTips": [string, string, ...]
}

IMPORTANT: Return ONLY the JSON object without any additional text, markdown formatting, or code blocks.
`

    const { text } = await generateText({
      model: openai("gpt-4o"),
      prompt,
    })

    try {
      // Extract JSON from the response text
      const jsonText = extractJsonFromString(text)
      console.log("Extracted JSON:", jsonText)

      const result = JSON.parse(jsonText)
      return result as QuoteResult
    } catch (error) {
      console.error("Error parsing OpenAI response:", error)
      console.error("Raw response:", text)

      // Fallback to a default response if parsing fails
      return {
        priceRange: {
          min: baseCost * 1.2,
          max: baseCost * 2,
        },
        breakdown: {
          material: materialCost,
          time: timeCost,
          electricity: electricityCost,
          profit: baseCost * 0.3,
          other: formData.otherCosts,
        },
        marketComparison: {
          averageMarketPrice: baseCost * 1.5,
          pricePosition: "competitive",
          competitorPrices: {
            low: baseCost * 1.1,
            average: baseCost * 1.5,
            high: baseCost * 2.2,
          },
        },
        suggestions: [
          "Consider the complexity of the model when setting your final price",
          "Factor in any post-processing time that might be required",
          "Compare with market rates for similar prints in your area",
        ],
        communicationTips: [
          "Explain the quality of materials used in your quote",
          "Highlight your experience and print quality when discussing pricing",
        ],
      }
    }
  } catch (error) {
    console.error("Error calling OpenAI API:", error)

    // Fallback response
    return {
      priceRange: {
        min: baseCost * 1.2,
        max: baseCost * 2,
      },
      breakdown: {
        material: materialCost,
        time: timeCost,
        electricity: electricityCost,
        profit: baseCost * 0.3,
        other: formData.otherCosts,
      },
      marketComparison: {
        averageMarketPrice: baseCost * 1.5,
        pricePosition: "competitive",
        competitorPrices: {
          low: baseCost * 1.1,
          average: baseCost * 1.5,
          high: baseCost * 2.2,
        },
      },
      suggestions: [
        "Consider the complexity of the model when setting your final price",
        "Factor in any post-processing time that might be required",
        "Compare with market rates for similar prints in your area",
      ],
      communicationTips: [
        "Explain the quality of materials used in your quote",
        "Highlight your experience and print quality when discussing pricing",
      ],
    }
  }
}
