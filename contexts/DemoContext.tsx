"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"

type DemoContextType = {
  isDemoMode: boolean
  enterDemoMode: () => void
  exitDemoMode: () => void
  demoStep: number
  nextDemoStep: () => void
  prevDemoStep: () => void
  setDemoStep: (step: number) => void
  totalDemoSteps: number
}

const DemoContext = createContext<DemoContextType | undefined>(undefined)

export function DemoProvider({ children }: { children: React.ReactNode }) {
  const [isDemoMode, setIsDemoMode] = useState(false)
  const [demoStep, setDemoStep] = useState(1)
  const totalDemoSteps = 3 // Upload, Details, Quote
  const router = useRouter()
  const pathname = usePathname()

  // Check if demo mode is stored in localStorage on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedDemoMode = localStorage.getItem("playhouse_demo_mode")
      setIsDemoMode(storedDemoMode === "true")

      // If we're in demo mode but not on a demo page, redirect to demo
      if (storedDemoMode === "true" && pathname && !pathname.startsWith("/demo")) {
        router.push("/demo/dashboard")
      }
    }
  }, [pathname, router])

  // Update localStorage when demo mode changes
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("playhouse_demo_mode", isDemoMode.toString())
    }
  }, [isDemoMode])

  // Exit demo mode when navigating to auth pages
  useEffect(() => {
    if (isDemoMode && (pathname === "/login" || pathname === "/signup")) {
      exitDemoMode()
    }
  }, [pathname, isDemoMode])

  const enterDemoMode = () => {
    setIsDemoMode(true)
    setDemoStep(1)
    router.push("/demo/dashboard")
  }

  const exitDemoMode = () => {
    // First clear the localStorage
    if (typeof window !== "undefined") {
      localStorage.removeItem("playhouse_demo_mode")
    }

    // Then update the state
    setIsDemoMode(false)
    setDemoStep(1)

    // Use a small timeout to ensure state updates before navigation
    setTimeout(() => {
      router.push("/")
    }, 100)
  }

  const nextDemoStep = () => {
    if (demoStep < totalDemoSteps) {
      setDemoStep(demoStep + 1)
    }
  }

  const prevDemoStep = () => {
    if (demoStep > 1) {
      setDemoStep(demoStep - 1)
    }
  }

  return (
    <DemoContext.Provider
      value={{
        isDemoMode,
        enterDemoMode,
        exitDemoMode,
        demoStep,
        nextDemoStep,
        prevDemoStep,
        setDemoStep,
        totalDemoSteps,
      }}
    >
      {children}
    </DemoContext.Provider>
  )
}

export const useDemo = () => {
  const context = useContext(DemoContext)
  if (context === undefined) {
    throw new Error("useDemo must be used within a DemoProvider")
  }
  return context
}

export default DemoProvider
