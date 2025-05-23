"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { User, CreditCard, ArrowRight, Lock } from "lucide-react"
import { useDemo } from "@/contexts/demo-context"
import { useRouter } from "next/navigation"
import { getDemoProfile } from "@/lib/services/demo-service"

export default function DemoProfile() {
  const profile = getDemoProfile()
  const { exitDemoMode } = useDemo()
  const router = useRouter()

  const handleSignUp = () => {
    exitDemoMode()
    router.push("/signup")
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight glow-text bg-gradient-to-r from-cyber-blue to-cyber-purple bg-clip-text text-transparent">
          Your Profile (Demo)
        </h1>
        <p className="text-muted-foreground mt-1">Manage your account information and preferences</p>
      </div>

      <Card className="glass border-cyber-blue/20 mb-6">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg text-cyber-blue">Create Your Real Account</CardTitle>
          <CardDescription>Sign up to unlock all features</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-sm text-muted-foreground">
              <p>With a free account, you can:</p>
              <ul className="list-disc list-inside mt-1 space-y-1">
                <li>Save your profile information</li>
                <li>Customize your business settings</li>
                <li>Purchase and manage credits</li>
                <li>Access premium features</li>
              </ul>
            </div>
            <Button onClick={handleSignUp} className="bg-cyber-blue hover:bg-cyber-blue/80 text-black btn-hover-effect">
              <ArrowRight className="mr-2 h-4 w-4" />
              Sign Up Now
            </Button>
          </div>
        </CardContent>
      </Card>

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
            <form className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Input
                    id="email"
                    value={profile.email}
                    disabled
                    className="border-cyber-blue/30 bg-cyber-blue/5 pr-10"
                  />
                  <Lock className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                </div>
                <p className="text-xs text-muted-foreground">Email cannot be changed</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <div className="relative">
                  <Input
                    id="name"
                    value={profile.name}
                    className="border-cyber-blue/30 focus:border-cyber-blue focus:ring-cyber-blue/20 pr-10"
                    disabled
                  />
                  <Lock className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="business-type">Business Type</Label>
                <div className="relative">
                  <Select disabled defaultValue={profile.business_type}>
                    <SelectTrigger
                      id="business-type"
                      className="border-cyber-blue/30 focus:border-cyber-blue focus:ring-cyber-blue/20 pr-10"
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
                  <Lock className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                </div>
              </div>

              <Button
                type="button"
                className="w-full bg-cyber-blue/20 hover:bg-cyber-blue/30 text-cyber-blue border border-cyber-blue/30"
                disabled
              >
                <Lock className="mr-2 h-4 w-4" />
                Demo Mode - Changes Disabled
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
              <Lock className="mr-2 h-4 w-4" />
              Demo Mode - Purchase Disabled
            </Button>

            <p className="text-xs text-muted-foreground text-center">
              Create a real account to purchase and use credits
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
