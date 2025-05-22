"use client"

import type React from "react"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Loader2 } from "lucide-react"

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    // Add a small delay to ensure auth state is properly checked
    const redirectTimer = setTimeout(() => {
      if (!isLoading && !user) {
        console.log("No authenticated user, redirecting to login")
        router.push("/login")
      }
    }, 500)

    return () => clearTimeout(redirectTimer)
  }, [user, isLoading, router])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse-slow text-cyber-blue text-center">
          <Loader2 className="h-16 w-16 animate-spin mx-auto" />
          <p className="mt-4 font-light tracking-wider">LOADING...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse-slow text-cyber-blue text-center">
          <Loader2 className="h-16 w-16 animate-spin mx-auto" />
          <p className="mt-4 font-light tracking-wider">REDIRECTING TO LOGIN...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow container max-w-5xl mx-auto py-8 px-4">{children}</main>
      <Footer />
    </div>
  )
}
