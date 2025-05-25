"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { useDemo } from "@/contexts/demo-context"
import { DemoHeader } from "@/components/demo-header"
import { Footer } from "@/components/footer"
import { DemoGuide } from "@/components/demo-guide"

export default function DemoLayout({ children }: { children: React.ReactNode }) {
  const [isClient, setIsClient] = useState(false)
  const [demoInitialized, setDemoInitialized] = useState(false)

  // Ensure this only runs on the client
  useEffect(() => {
    setIsClient(true)
  }, [])

  // Don't render anything until we're on the client
  if (!isClient) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse-slow text-cyber-blue text-center">
          <div className="h-16 w-16 border-4 border-t-transparent border-cyber-blue rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 font-light tracking-wider">LOADING DEMO...</p>
        </div>
      </div>
    )
  }

  return <DemoLayoutContent>{children}</DemoLayoutContent>
}

function DemoLayoutContent({ children }: { children: React.ReactNode }) {
  const { isDemoMode, enterDemoMode } = useDemo()
  const [demoInitialized, setDemoInitialized] = useState(false)

  useEffect(() => {
    if (!isDemoMode && !demoInitialized) {
      enterDemoMode()
      setDemoInitialized(true)
    }
  }, [isDemoMode, enterDemoMode, demoInitialized])

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
