"use client"

import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function Hero() {
  return (
    <section className="relative py-20 overflow-hidden bg-gradient-to-b from-white to-gray-50">
      <div className="container px-4 md:px-6">
        <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
          <div className="flex flex-col justify-center space-y-4">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                Get Instant, Accurate 3D Printing Quotes — Upload Your STL, Get a Price in Seconds
              </h1>
              <p className="max-w-[600px] text-gray-500 md:text-xl">
                Stop guessing. Stop waiting days for emails. Upload your file, get a quote, and start printing.
              </p>
            </div>
            <div className="flex flex-col gap-2 min-[400px]:flex-row">
              <Button
                size="lg"
                className="inline-flex h-12 items-center justify-center"
                onClick={() => {
                  document.getElementById("quote-form")?.scrollIntoView({ behavior: "smooth" })
                }}
              >
                Get Started <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="inline-flex h-12 items-center justify-center"
                onClick={() => {
                  document.getElementById("validator")?.scrollIntoView({ behavior: "smooth" })
                }}
              >
                Free STL Validator
              </Button>
            </div>
          </div>
          <div className="flex items-center justify-center">
            <img
              alt="3D Printing Quote"
              className="aspect-square overflow-hidden rounded-xl object-cover object-center"
              src="/placeholder-2at86.png"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
