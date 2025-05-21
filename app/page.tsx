import QuoteForm from "@/components/quote-form"
import { Suspense } from "react"

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-12">
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">AI-Powered Quote Generator</h1>
          <p className="mt-4 text-lg text-gray-600">
            Generate accurate, professional quotes in seconds using advanced AI
          </p>
        </div>
        <Suspense fallback={<div className="h-96 flex items-center justify-center">Loading...</div>}>
          <QuoteForm />
        </Suspense>
      </div>
    </main>
  )
}
