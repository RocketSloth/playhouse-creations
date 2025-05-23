"use client"

import type React from "react"
import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useDemo } from "@/contexts/demo-context"
import { DemoHeader } from "@/components/demo-header"
import { Footer } from "@/components/footer"
import { DemoGuide } from "@/components/demo-guide"

export default function DemoLayout({ children }: { children: React.ReactNode }) {
  const { isDemoMode, enterDemoMode, exitDemoMode } = useDemo()
  const router = useRouter()

  useEffect(() => {
    if (!isDemoMode) {
      enterDemoMode()
    }
  }, [isDemoMode, enterDemoMode])

  return (
    <div className="min-h-screen flex flex-col">
      <div className="container max-w-5xl mx-auto py-8 px-4">
        <DemoHeader />
        <main className="flex-grow relative">
          {children}
          <DemoGuide />
        </main>
      </div>
      <Footer />
    </div>
  )
}
