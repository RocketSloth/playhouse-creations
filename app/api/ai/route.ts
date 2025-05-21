import { type NextRequest, NextResponse } from "next/server"
import OpenAI from "openai"

// Initialize OpenAI client
let openai: OpenAI | null = null

const getOpenAIClient = () => {
  if (openai) return openai

  const apiKey = process.env.OPENAI_API_KEY
  if (!apiKey) {
    throw new Error("Missing OpenAI API key")
  }

  openai = new OpenAI({ apiKey })
  return openai
}

export async function POST(request: NextRequest) {
  try {
    // Check if the request is valid
    if (!request.body) {
      return NextResponse.json({ error: "Request body is missing" }, { status: 400 })
    }

    // Parse the request body
    let body
    try {
      body = await request.json()
    } catch (error) {
      return NextResponse.json({ error: "Invalid JSON in request body" }, { status: 400 })
    }

    const { prompt, model, systemPrompt } = body

    if (!prompt) {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 })
    }

    // Get OpenAI client
    const client = getOpenAIClient()

    // Make the API call with timeout
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 30000) // 30 second timeout

    try {
      const response = await client.chat.completions.create({
        model: model || "gpt-4o",
        messages: [
          {
            role: "system",
            content: systemPrompt || "You are a helpful assistant.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        response_format: { type: "json_object" },
        signal: controller.signal as any,
      })

      clearTimeout(timeoutId)
      return NextResponse.json({ result: response.choices[0].message.content })
    } catch (error: any) {
      clearTimeout(timeoutId)

      if (error.name === "AbortError") {
        return NextResponse.json({ error: "Request timed out" }, { status: 504 })
      }

      console.error("OpenAI API error:", error)
      return NextResponse.json(
        {
          error: "Failed to process request",
          details: error.message,
        },
        { status: 500 },
      )
    }
  } catch (error) {
    console.error("Unexpected error:", error)
    return NextResponse.json({ error: "An unexpected error occurred" }, { status: 500 })
  }
}
