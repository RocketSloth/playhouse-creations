import type { ModelData, QuoteResult } from "@/types/calculator-types"

// Sample model data for the demo
export const getDemoModels = (): ModelData[] => {
  return [
    {
      fileName: "robot_figure.stl",
      dimensions: {
        x: 85.4,
        y: 45.2,
        z: 120.7,
      },
      volume: 78.5,
      surfaceArea: 320.6,
      triangleCount: 24680,
      color: "#4299e1",
    },
    {
      fileName: "phone_stand.stl",
      dimensions: {
        x: 120.0,
        y: 70.5,
        z: 95.2,
      },
      volume: 42.3,
      surfaceArea: 210.8,
      triangleCount: 12450,
      color: "#48bb78",
    },
    {
      fileName: "gear_assembly.stl",
      dimensions: {
        x: 65.2,
        y: 65.2,
        z: 25.0,
      },
      volume: 35.7,
      surfaceArea: 185.4,
      triangleCount: 18320,
      color: "#ed64a6",
    },
  ]
}

// Sample quote result for the demo
export const getDemoQuoteResult = (): QuoteResult => {
  return {
    priceRange: {
      min: 28.5,
      max: 42.75,
    },
    breakdown: {
      material: 8.25,
      time: 12.5,
      electricity: 1.75,
      profit: 15.0,
      other: 5.0,
    },
    marketComparison: {
      averageMarketPrice: 35.0,
      pricePosition: "competitive",
      competitorPrices: {
        low: 25.0,
        average: 35.0,
        high: 50.0,
      },
    },
    suggestions: [
      "Consider offering a discount for first-time customers to establish a relationship",
      "Highlight the quality of your PLA filament when communicating with the customer",
      "Offer a small discount for bulk orders if the customer needs multiple prints",
      "Consider the complexity of the model when finalizing your price",
    ],
    communicationTips: [
      "Emphasize the precision and quality of your prints when discussing pricing",
      "Explain how your pricing compares to market rates for similar quality prints",
      "Highlight your experience and reliability as factors that justify your pricing",
    ],
  }
}

// Sample profile data for the demo
export const getDemoProfile = () => {
  return {
    id: "demo-user",
    name: "Demo User",
    email: "demo@example.com",
    business_type: "individual",
    credits: 10,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }
}

// Sample quote history for the demo
export const getDemoQuoteHistory = () => {
  return [
    {
      id: 1,
      created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      file_name: "chess_piece.stl",
      material: "PLA",
      price_min: 12.5,
      price_max: 18.75,
      volume: 24.3,
    },
    {
      id: 2,
      created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      file_name: "smartphone_case.stl",
      material: "TPU",
      price_min: 15.25,
      price_max: 22.8,
      volume: 18.7,
    },
    {
      id: 3,
      created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      file_name: "robot_figure.stl",
      material: "PLA",
      price_min: 28.5,
      price_max: 42.75,
      volume: 78.5,
    },
  ]
}
