"use client"

import { useState, useEffect } from "react"
import { Suspense } from "react"
import DemoCalculator from "@/components/demo-calculator"
import { Button } from "@/components/ui/button"
import { useDemo } from "@/contexts/demo-context"
import { useRouter } from "next/navigation"
import { ArrowRight } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function DemoCalculatorPage() {
  const [isClient, setIsClient] = useState(false)
  const [showSignupPrompt, setShowSignupPrompt] = useState(false)

  // Ensure this only runs on the client
  useEffect(() => {
    setIsClient(true)
  }, [])

  // Don't render anything until we're on the client
  if (!isClient) {
    return (
      <div className="h-[600px] flex items-center justify-center">
        <div className="animate-pulse-slow text-cyber-blue">
          <div className="h-16 w-16 border-4 border-t-transparent border-cyber-blue rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-center font-light tracking-wider">LOADING CALCULATOR...</p>
        </div>
      </div>
    )
  }

  return <DemoCalculatorContent />
}

function DemoCalculatorContent() {
  const { exitDemoMode, demoStep } = useDemo()
  const router = useRouter()
  const [showSignupPrompt, setShowSignupPrompt] = useState(false)

  const handleSignUp = () => {
    exitDemoMode()
    router.push("/signup")
  }

  // Show signup prompt after completing the quote
  useEffect(() => {
    if (demoStep === 3) {
      setShowSignupPrompt(true)
    }
  }, [demoStep])

  return (
    <div>
      <h1 className="text-3xl font-bold tracking-tight glow-text bg-gradient-to-r from-cyber-blue to-cyber-purple bg-clip-text text-transparent mb-6">
        3D Print Quote Calculator (Demo)
      </h1>

      {showSignupPrompt && (
        <Card className="mb-6 glass border-cyber-blue/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg text-cyber-blue">Ready to save your quotes?</CardTitle>
            <CardDescription>Create an account to unlock all features</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="text-sm text-muted-foreground">
                <p>With a free account, you can:</p>
                <ul className="list-disc list-inside mt-1 space-y-1">
                  <li>Save unlimited quotes</li>
                  <li>Upload your own STL files</li>
                  <li>Track your printing projects</li>
                  <li>Access premium features</li>
                </ul>
              </div>
              <Button
                onClick={handleSignUp}
                className="bg-cyber-blue hover:bg-cyber-blue/80 text-black btn-hover-effect"
              >
                <ArrowRight className="mr-2 h-4 w-4" />
                Sign Up Now
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

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
        <DemoCalculator />
      </Suspense>
    </div>
  )
}
