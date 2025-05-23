"use client"

import { PrinterIcon as Printer3d, User, LogOut, CreditCard, AlertCircle, HelpCircle } from "lucide-react"
import Link from "next/link"
import { useDemo } from "@/contexts/demo-context"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { getDemoProfile } from "@/lib/services/demo-service"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

export function DemoHeader() {
  const { exitDemoMode } = useDemo()
  const profile = getDemoProfile()

  return (
    <>
      <Alert className="mb-4 bg-cyber-blue/10 border-cyber-blue">
        <AlertCircle className="h-4 w-4 text-cyber-blue" />
        <AlertDescription className="flex items-center justify-between">
          <span className="text-sm">You are currently in demo mode. Your changes won't be saved.</span>
          <div className="flex gap-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="sm" className="h-8 border-cyber-blue/30 text-cyber-blue">
                    <HelpCircle className="h-4 w-4 mr-1" />
                    Demo Info
                  </Button>
                </TooltipTrigger>
                <TooltipContent className="max-w-sm">
                  <p>This demo showcases the core features of our 3D Print Quote Calculator.</p>
                  <p className="mt-2">
                    You can explore the dashboard, calculator, and profile pages with pre-populated data.
                  </p>
                  <p className="mt-2">To save your work and access all features, please sign up for an account.</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <Button
              variant="default"
              size="sm"
              className="h-8 bg-cyber-blue hover:bg-cyber-blue/80 text-black"
              onClick={exitDemoMode}
            >
              Exit Demo
            </Button>
          </div>
        </AlertDescription>
      </Alert>

      <header className="mb-8 relative z-10">
        <div className="flex items-center justify-between">
          <Link href="/demo/dashboard" className="flex items-center">
            <div className="relative">
              <Printer3d className="h-10 w-10 mr-3 text-cyber-blue animate-pulse-slow" />
              <div className="absolute inset-0 bg-cyber-blue opacity-30 blur-md rounded-full animate-pulse-slow"></div>
            </div>
            <div>
              <h1 className="text-3xl md:text-5xl font-bold tracking-tight glow-text bg-gradient-to-r from-cyber-blue to-cyber-purple bg-clip-text text-transparent">
                PLAyhouse Creations
              </h1>
              <div className="text-xs text-cyber-blue/80 ml-1">DEMO MODE</div>
            </div>
          </Link>

          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center glass px-4 py-2 rounded-md">
              <CreditCard className="h-4 w-4 mr-2 text-cyber-blue" />
              <span className="text-sm">Credits: </span>
              <span className="ml-1 text-cyber-blue font-bold">{profile.credits}</span>
            </div>

            <Button variant="outline" className="border-cyber-blue/30 text-cyber-blue hover:bg-cyber-blue/10">
              <User className="h-4 w-4 mr-2" />
              {profile.name.split(" ")[0]} (Demo)
            </Button>

            <Button
              onClick={() => {
                // Force clear localStorage directly
                localStorage.removeItem("playhouse_demo_mode")
                // Then call the context function
                exitDemoMode()
              }}
              className="bg-cyber-blue hover:bg-cyber-blue/80 text-black btn-hover-effect"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Exit Demo
            </Button>
          </div>
        </div>
        <div className="w-32 h-1 bg-gradient-to-r from-cyber-blue to-cyber-purple mx-auto mt-4 rounded-full"></div>
      </header>
    </>
  )
}
