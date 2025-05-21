import { Suspense } from "react"
import QuoteCalculator from "@/components/quote-calculator"

export default function CalculatorPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold tracking-tight glow-text bg-gradient-to-r from-cyber-blue to-cyber-purple bg-clip-text text-transparent mb-6">
        3D Print Quote Calculator
      </h1>

      <Suspense
        fallback={
          <div className="h-[600px] flex items-center justify-center">
            <div className="animate-pulse-slow text-cyber-blue">
              <div className="h-16 w-16 border-4 border-t-transparent border-cyber-blue rounded-full animate-spin mx-auto"></div>
              <p className="mt-4 text-center font-light tracking-wider">LOADING CALCULATOR...</p>
            </div>
          </div>
        }
      >
        <QuoteCalculator />
      </Suspense>
    </div>
  )
}
