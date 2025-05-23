"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { useDemo } from "@/contexts/demo-context"
import { Button } from "@/components/ui/button"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { PrinterIcon as Printer3d, Calculator, User, ArrowRight, CreditCard, PlayCircle } from "lucide-react"
import Link from "next/link"

export default function Home() {
  const { user, isLoading } = useAuth()
  const { enterDemoMode } = useDemo()
  const router = useRouter()

  useEffect(() => {
    // Only redirect if we have a valid user
    if (!isLoading && user) {
      try {
        router.push("/dashboard")
      } catch (error) {
        console.error("Error redirecting to dashboard:", error)
      }
    }
  }, [user, isLoading, router])

  if (isLoading || user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse-slow text-cyber-blue text-center">
          <div className="h-16 w-16 border-4 border-t-transparent border-cyber-blue rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 font-light tracking-wider">LOADING...</p>
        </div>
      </div>
    )
  }

  return (
    <main className="min-h-screen">
      <div className="container max-w-5xl mx-auto py-8 px-4">
        <Header />

        <div className="py-12 md:py-24 flex flex-col items-center text-center">
          <div className="relative mb-8">
            <Printer3d className="h-24 w-24 text-cyber-blue animate-pulse-slow" />
            <div className="absolute inset-0 bg-cyber-blue opacity-30 blur-xl rounded-full animate-pulse-slow"></div>
          </div>

          <h1 className="text-4xl md:text-6xl font-bold tracking-tight glow-text bg-gradient-to-r from-cyber-blue to-cyber-purple bg-clip-text text-transparent max-w-3xl">
            Professional 3D Printing Quote Calculator
          </h1>

          <p className="mt-6 text-xl text-muted-foreground max-w-2xl">
            Get accurate pricing estimates for your 3D printing projects with our advanced calculator. Try our demo or
            sign up to access all features.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={enterDemoMode}
              size="lg"
              className="bg-gradient-to-r from-cyber-purple to-cyber-blue hover:opacity-90 text-white btn-hover-effect"
            >
              <PlayCircle className="mr-2 h-5 w-5" />
              Try Demo
            </Button>
            <Button asChild size="lg" className="bg-cyber-blue hover:bg-cyber-blue/80 text-black btn-hover-effect">
              <Link href="/signup">
                Create Account
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-cyber-blue/30 text-cyber-blue hover:bg-cyber-blue/10"
            >
              <Link href="/login">Log In</Link>
            </Button>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 py-12">
          <div className="glass border border-cyber-blue/20 rounded-lg p-6 text-center">
            <div className="mx-auto w-12 h-12 rounded-full bg-cyber-blue/10 flex items-center justify-center mb-4">
              <Calculator className="h-6 w-6 text-cyber-blue" />
            </div>
            <h3 className="text-xl font-medium text-cyber-blue mb-2">Accurate Quotes</h3>
            <p className="text-muted-foreground">
              Get precise cost estimates based on your 3D model specifications and printing parameters.
            </p>
          </div>

          <div className="glass border border-cyber-blue/20 rounded-lg p-6 text-center">
            <div className="mx-auto w-12 h-12 rounded-full bg-cyber-blue/10 flex items-center justify-center mb-4">
              <User className="h-6 w-6 text-cyber-blue" />
            </div>
            <h3 className="text-xl font-medium text-cyber-blue mb-2">User Profiles</h3>
            <p className="text-muted-foreground">
              Create your account to save quotes, track projects, and manage your 3D printing needs.
            </p>
          </div>

          <div className="glass border border-cyber-blue/20 rounded-lg p-6 text-center">
            <div className="mx-auto w-12 h-12 rounded-full bg-cyber-blue/10 flex items-center justify-center mb-4">
              <CreditCard className="h-6 w-6 text-cyber-blue" />
            </div>
            <h3 className="text-xl font-medium text-cyber-blue mb-2">Credit System</h3>
            <p className="text-muted-foreground">
              Use credits to generate quotes and access premium features for your 3D printing projects.
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  )
}
