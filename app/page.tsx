import { Suspense } from "react"
import Hero from "@/components/hero"
import QuoteForm from "@/components/quote-form"
import Features from "@/components/features"
import HowItWorks from "@/components/how-it-works"
import Footer from "@/components/footer"

export default function Home() {
  return (
    <main className="min-h-screen">
      <Hero />
      <Suspense fallback={<div className="h-[600px] flex items-center justify-center">Loading quote form...</div>}>
        <QuoteForm />
      </Suspense>
      <Features />
      <HowItWorks />
      <Footer />
    </main>
  )
}
