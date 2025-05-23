export interface ModelData {
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
  isManual?: boolean
  printTime?: number
}

export interface QuoteResult {
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
