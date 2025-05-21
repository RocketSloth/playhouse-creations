"use client"

import { useAuth } from "@/contexts/auth-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calculator, CreditCard, User } from "lucide-react"
import Link from "next/link"

export default function Dashboard() {
  const { profile } = useAuth()

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight glow-text bg-gradient-to-r from-cyber-blue to-cyber-purple bg-clip-text text-transparent">
            Welcome, {profile?.name}
          </h1>
          <p className="text-muted-foreground mt-1">Manage your 3D printing projects and quotes</p>
        </div>
        <div className="glass px-4 py-2 rounded-md flex items-center">
          <CreditCard className="h-5 w-5 mr-2 text-cyber-blue" />
          <span className="font-medium">Credits: </span>
          <span className="ml-1 text-cyber-blue font-bold">{profile?.credits || 0}</span>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="glass border-cyber-blue/20">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Calculator className="h-5 w-5 mr-2 text-cyber-blue" />
              Quote Calculator
            </CardTitle>
            <CardDescription>Generate price quotes for 3D prints</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full bg-cyber-blue hover:bg-cyber-blue/80 text-black btn-hover-effect">
              <Link href="/calculator">Create New Quote</Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="glass border-cyber-blue/20">
          <CardHeader>
            <CardTitle className="flex items-center">
              <User className="h-5 w-5 mr-2 text-cyber-blue" />
              Profile
            </CardTitle>
            <CardDescription>Manage your account information</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full bg-cyber-blue hover:bg-cyber-blue/80 text-black btn-hover-effect">
              <Link href="/profile">View Profile</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
