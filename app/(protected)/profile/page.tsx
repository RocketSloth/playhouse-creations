"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/auth-context"
import { useSupabase } from "@/hooks/use-supabase"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2, Save, User, CreditCard } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

export default function Profile() {
  const { profile, refreshProfile, signOut } = useAuth()
  const { supabase, isLoading: isClientLoading } = useSupabase()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    businessType: "",
  })
  const { toast } = useToast()

  // Initialize form data when profile is loaded
  useEffect(() => {
    if (profile) {
      setFormData({
        name: profile.name || "",
        businessType: profile.business_type || "",
      })
    }
  }, [profile])

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!supabase) {
      toast({
        title: "Error",
        description: "Unable to connect to the database",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          name: formData.name,
          business_type: formData.businessType,
          updated_at: new Date().toISOString(),
        })
        .eq("id", profile?.id)

      if (error) {
        throw error
      }

      await refreshProfile()

      toast({
        title: "Profile updated",
        description: "Your profile information has been updated successfully.",
      })
    } catch (error: any) {
      toast({
        title: "Update failed",
        description: error.message || "Failed to update profile",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (isClientLoading || !profile) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-cyber-blue" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight glow-text bg-gradient-to-r from-cyber-blue to-cyber-purple bg-clip-text text-transparent">
          Your Profile
        </h1>
        <p className="text-muted-foreground mt-1">Manage your account information and preferences</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="glass border-cyber-blue/20">
          <CardHeader>
            <CardTitle className="flex items-center">
              <User className="h-5 w-5 mr-2 text-cyber-blue" />
              Account Information
            </CardTitle>
            <CardDescription>Update your personal details</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" value={profile.email} disabled className="border-cyber-blue/30 bg-cyber-blue/5" />
                <p className="text-xs text-muted-foreground">Email cannot be changed</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                  className="border-cyber-blue/30 focus:border-cyber-blue focus:ring-cyber-blue/20"
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="business-type">Business Type</Label>
                <Select
                  value={formData.businessType}
                  onValueChange={(value) => handleChange("businessType", value)}
                  disabled={isLoading}
                >
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
              </div>

              <Button
                type="submit"
                className="w-full bg-cyber-blue hover:bg-cyber-blue/80 text-black btn-hover-effect"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Save Changes
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card className="glass border-cyber-blue/20">
          <CardHeader>
            <CardTitle className="flex items-center">
              <CreditCard className="h-5 w-5 mr-2 text-cyber-blue" />
              Credits
            </CardTitle>
            <CardDescription>Manage your service credits</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 glass rounded-md">
              <div>
                <p className="text-sm text-muted-foreground">Available Credits</p>
                <p className="text-3xl font-bold text-cyber-blue">{profile.credits}</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-cyber-blue/10 flex items-center justify-center">
                <CreditCard className="h-6 w-6 text-cyber-blue" />
              </div>
            </div>

            <Button
              className="w-full bg-cyber-blue/20 hover:bg-cyber-blue/30 text-cyber-blue border border-cyber-blue/30"
              disabled
            >
              Purchase Credits (Coming Soon)
            </Button>

            <p className="text-xs text-muted-foreground text-center">
              Credit purchasing will be available in a future update
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-end">
        <Button
          variant="outline"
          onClick={signOut}
          className="border-cyber-blue/30 text-cyber-blue hover:bg-cyber-blue/10"
        >
          Sign Out
        </Button>
      </div>
    </div>
  )
}
