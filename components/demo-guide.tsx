"use client"

import { usePathname } from "next/navigation"
import { useDemo } from "@/contexts/demo-context"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ChevronRight, ChevronLeft, X } from "lucide-react"
import { useState } from "react"

export function DemoGuide() {
  const pathname = usePathname()
  const { demoStep, nextDemoStep, prevDemoStep, totalDemoSteps } = useDemo()
  const [isMinimized, setIsMinimized] = useState(false)

  if (!pathname?.startsWith("/demo")) return null

  // Different guides based on the current path
  const getGuideContent = () => {
    if (pathname === "/demo/dashboard") {
      return (
        <div className="space-y-2">
          <h3 className="font-medium text-cyber-blue">Welcome to the Dashboard!</h3>
          <p className="text-sm text-muted-foreground">
            This is your central hub for managing 3D printing projects. From here, you can:
          </p>
          <ul className="text-sm text-muted-foreground list-disc list-inside space-y-1">
            <li>Create new quotes with the calculator</li>
            <li>View your profile information</li>
            <li>Check your available credits</li>
          </ul>
          <p className="text-sm text-muted-foreground mt-2">Click on "Create New Quote" to continue the demo.</p>
        </div>
      )
    } else if (pathname === "/demo/calculator") {
      if (demoStep === 1) {
        return (
          <div className="space-y-2">
            <h3 className="font-medium text-cyber-blue">Step 1: Upload Models</h3>
            <p className="text-sm text-muted-foreground">
              Start by loading the demo 3D models. In a real account, you can upload your own STL files or enter
              dimensions manually.
            </p>
            <p className="text-sm text-muted-foreground mt-2">Click "Load Demo Files" to continue.</p>
          </div>
        )
      } else if (demoStep === 2) {
        return (
          <div className="space-y-2">
            <h3 className="font-medium text-cyber-blue">Step 2: Configure Print Settings</h3>
            <p className="text-sm text-muted-foreground">Now you can adjust printing parameters like:</p>
            <ul className="text-sm text-muted-foreground list-disc list-inside space-y-1">
              <li>Filament type and cost</li>
              <li>Printer hourly rate</li>
              <li>Print speed and other costs</li>
            </ul>
            <p className="text-sm text-muted-foreground mt-2">
              Try changing some values, then click "Get Quote Suggestions".
            </p>
          </div>
        )
      } else if (demoStep === 3) {
        return (
          <div className="space-y-2">
            <h3 className="font-medium text-cyber-blue">Step 3: Review Quote Results</h3>
            <p className="text-sm text-muted-foreground">Here's your detailed price quote with:</p>
            <ul className="text-sm text-muted-foreground list-disc list-inside space-y-1">
              <li>Suggested price range</li>
              <li>Cost breakdown</li>
              <li>Market comparison</li>
              <li>Pricing suggestions</li>
            </ul>
            <p className="text-sm text-muted-foreground mt-2">
              In a real account, you can save these quotes and access them later.
            </p>
          </div>
        )
      }
    } else if (pathname === "/demo/profile") {
      return (
        <div className="space-y-2">
          <h3 className="font-medium text-cyber-blue">Your Profile</h3>
          <p className="text-sm text-muted-foreground">
            This is where you can manage your account information and credits. In a real account, you can:
          </p>
          <ul className="text-sm text-muted-foreground list-disc list-inside space-y-1">
            <li>Update your personal details</li>
            <li>Change your business type</li>
            <li>Purchase and manage credits</li>
          </ul>
          <p className="text-sm text-muted-foreground mt-2">
            Try exploring the dashboard and calculator to see more features.
          </p>
        </div>
      )
    }

    return (
      <div className="space-y-2">
        <h3 className="font-medium text-cyber-blue">Exploring the Demo</h3>
        <p className="text-sm text-muted-foreground">
          Feel free to explore all the features available in demo mode. To access full functionality, create an account.
        </p>
      </div>
    )
  }

  if (isMinimized) {
    return (
      <Button
        className="fixed bottom-4 right-4 bg-cyber-blue hover:bg-cyber-blue/80 text-black rounded-full h-12 w-12 p-0"
        onClick={() => setIsMinimized(false)}
      >
        ?
      </Button>
    )
  }

  return (
    <Card className="fixed bottom-4 right-4 w-80 p-4 glass border-cyber-blue/20 shadow-lg">
      <div className="flex justify-between items-start mb-2">
        <div className="text-sm font-medium">Demo Guide</div>
        <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={() => setIsMinimized(true)}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      {getGuideContent()}

      {pathname === "/demo/calculator" && (
        <div className="flex justify-between items-center mt-4">
          <Button
            variant="outline"
            size="sm"
            onClick={prevDemoStep}
            disabled={demoStep === 1}
            className="h-8 border-cyber-blue/30 text-cyber-blue"
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Previous
          </Button>

          <div className="text-xs text-muted-foreground">
            Step {demoStep} of {totalDemoSteps}
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={nextDemoStep}
            disabled={demoStep === totalDemoSteps}
            className="h-8 border-cyber-blue/30 text-cyber-blue"
          >
            Next
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      )}
    </Card>
  )
}
