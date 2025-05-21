"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2, UserPlus, AlertCircle } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function SignUp() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [name, setName] = useState("")
  const [businessType, setBusinessType] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [generalError, setGeneralError] = useState<string | null>(null)

  const { signUp } = useAuth()
  const router = useRouter()
  const { toast } = useToast()

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!name.trim()) newErrors.name = "Name is required"
    if (!email.trim()) newErrors.email = "Email is required"
    if (!/^\S+@\S+\.\S+$/.test(email)) newErrors.email = "Invalid email format"
    if (!password) newErrors.password = "Password is required"
    if (password.length < 6) newErrors.password = "Password must be at least 6 characters"
    if (password !== confirmPassword) newErrors.confirmPassword = "Passwords do not match"
    if (!businessType) newErrors.businessType = "Business type is required"

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setGeneralError(null)

    if (!validateForm()) return

    setIsLoading(true)

    try {
      const { error, data } = await signUp(email, password, name, businessType)

      if (error) {
        console.error("Signup error details:", error)
        setGeneralError(error.message || "Failed to create account. Please try again.")
        toast({
          title: "Sign-up failed",
          description: error.message || "An error occurred during sign-up",
          variant: "destructive",
        })
      } else {
        toast({
          title: "Sign-up successful",
          description: "Your account has been created. You can now log in.",
        })

        // Wait a bit to ensure the profile is created
        setTimeout(() => {
          router.push("/login")
        }, 1500)
      }
    } catch (error: any) {
      console.error("Unexpected error during signup:", error)
      setGeneralError(error.message || "An unexpected error occurred. Please try again.")
      toast({
        title: "An error occurred",
        description: error.message || "Failed to create account",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container flex items-center justify-center min-h-screen py-12">
      <Card className="w-full max-w-md glass border-cyber-blue/20">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-light tracking-wider text-cyber-blue">CREATE ACCOUNT</CardTitle>
          <CardDescription>Enter your information below to create your PLAyhouse Creations account</CardDescription>
        </CardHeader>
        <CardContent>
          {generalError && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{generalError}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="border-cyber-blue/30 focus:border-cyber-blue focus:ring-cyber-blue/20"
                disabled={isLoading}
              />
              {errors.name && <p className="text-xs text-red-500">{errors.name}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="border-cyber-blue/30 focus:border-cyber-blue focus:ring-cyber-blue/20"
                disabled={isLoading}
              />
              {errors.email && <p className="text-xs text-red-500">{errors.email}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="business-type">Business Type</Label>
              <Select value={businessType} onValueChange={setBusinessType} disabled={isLoading}>
                <SelectTrigger
                  id="business-type"
                  className="border-cyber-blue/30 focus:border-cyber-blue focus:ring-cyber-blue/20"
                >
                  <SelectValue placeholder="Select business type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="individual">Individual</SelectItem>
                  <SelectItem value="small_business">Small Business</SelectItem>
                  <SelectItem value="enterprise">Enterprise</SelectItem>
                  <SelectItem value="education">Educational Institution</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
              {errors.businessType && <p className="text-xs text-red-500">{errors.businessType}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="border-cyber-blue/30 focus:border-cyber-blue focus:ring-cyber-blue/20"
                disabled={isLoading}
              />
              {errors.password && <p className="text-xs text-red-500">{errors.password}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirm-password">Confirm Password</Label>
              <Input
                id="confirm-password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="border-cyber-blue/30 focus:border-cyber-blue focus:ring-cyber-blue/20"
                disabled={isLoading}
              />
              {errors.confirmPassword && <p className="text-xs text-red-500">{errors.confirmPassword}</p>}
            </div>

            <Button
              type="submit"
              className="w-full bg-cyber-blue hover:bg-cyber-blue/80 text-black btn-hover-effect"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating Account...
                </>
              ) : (
                <>
                  <UserPlus className="mr-2 h-4 w-4" />
                  Sign Up
                </>
              )}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link href="/login" className="text-cyber-blue hover:underline">
              Log in
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}
