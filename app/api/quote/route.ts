import { type NextRequest, NextResponse } from "next/server"
import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { modelData, formData } = body

    if (!modelData || !formData) {
      return NextResponse.json({ error: "Missing required data" }, { status: 400 })
    }

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

    const prompt = `
You are an expert 3D printing service provider. Please provide a detailed quote for printing a 3D model with the following specifications:

Model Information:
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

Please provide:
1. A recommended price range (minimum and maximum price in USD)
2. A detailed breakdown of costs including material, time, electricity, profit margin, and other costs
3. 3-5 specific suggestions for pricing this particular print
4. 2-3 tips for communicating the value to customers

Format your response as a JSON object with the following structure:
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
  "suggestions": [string, string, ...],
  "communicationTips": [string, string, ...]
}
`

    const { text } = await generateText({
      model: openai("gpt-4o", { apiKey: process.env.OPENAI_API_KEY }),
      prompt,
    })

    try {
      const result = JSON.parse(text)
      return NextResponse.json(result)
    } catch (error) {
      console.error("Error parsing OpenAI response:", error)

      // Fallback to a default response if parsing fails
      return NextResponse.json({
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
        suggestions: [
          "Consider the complexity of the model when setting your final price",
          "Factor in any post-processing time that might be required",
          "Compare with market rates for similar prints in your area",
        ],
        communicationTips: [
          "Explain the quality of materials used in your quote",
          "Highlight your experience and print quality when discussing pricing",
        ],
      })
    }
  } catch (error) {
    console.error("Error processing quote request:", error)
    return NextResponse.json({ error: "Failed to generate quote" }, { status: 500 })
  }
}
