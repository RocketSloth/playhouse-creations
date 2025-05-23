"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calculator, CreditCard, User, History, FileText } from "lucide-react"
import Link from "next/link"
import { getDemoProfile, getDemoQuoteHistory } from "@/lib/services/demo-service"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"

export default function DemoDashboard() {
  const profile = getDemoProfile()
  const quoteHistory = getDemoQuoteHistory()

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight glow-text bg-gradient-to-r from-cyber-blue to-cyber-purple bg-clip-text text-transparent">
            Welcome, {profile.name}
          </h1>
          <p className="text-muted-foreground mt-1">Manage your 3D printing projects and quotes</p>
        </div>
        <div className="glass px-4 py-2 rounded-md flex items-center">
          <CreditCard className="h-5 w-5 mr-2 text-cyber-blue" />
          <span className="font-medium">Credits: </span>
          <span className="ml-1 text-cyber-blue font-bold">{profile.credits}</span>
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
              <Link href="/demo/calculator">Create New Quote</Link>
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
              <Link href="/demo/profile">View Profile</Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="glass border-cyber-blue/20">
          <CardHeader>
            <CardTitle className="flex items-center">
              <History className="h-5 w-5 mr-2 text-cyber-blue" />
              Recent Activity
            </CardTitle>
            <CardDescription>Your recent quotes and projects</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full bg-cyber-blue hover:bg-cyber-blue/80 text-black btn-hover-effect">
              <Link href="/demo/history">View History</Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card className="glass border-cyber-blue/20">
        <CardHeader>
          <CardTitle className="flex items-center">
            <FileText className="h-5 w-5 mr-2 text-cyber-blue" />
            Recent Quotes
          </CardTitle>
          <CardDescription>Your most recent price quotes</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {quoteHistory.map((quote) => (
              <div key={quote.id} className="flex justify-between items-center p-3 glass rounded-md">
                <div>
                  <div className="font-medium">{quote.file_name}</div>
                  <div className="text-sm text-muted-foreground">
                    {format(new Date(quote.created_at), "MMM d, yyyy")} • {quote.volume.toFixed(1)} cm³
                  </div>
                </div>
                <div className="flex flex-col items-end">
                  <Badge variant="outline" className="mb-1 border-cyber-blue/30 text-cyber-blue">
                    {quote.material}
                  </Badge>
                  <div className="text-sm font-medium">
                    ${quote.price_min.toFixed(2)} - ${quote.price_max.toFixed(2)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
