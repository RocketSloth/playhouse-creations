"use client"

import { useAuth } from "@/contexts/auth-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calculator, CreditCard, User, History, FileText, TrendingUp, Clock, Package } from "lucide-react"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"

export default function Dashboard() {
  const { profile } = useAuth()

  // Sample recent activity data (in a real app, this would come from your database)
  const recentQuotes = [
    {
      id: 1,
      fileName: "phone_case.stl",
      material: "TPU",
      priceRange: { min: 15.25, max: 22.8 },
      volume: 18.7,
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
    },
    {
      id: 2,
      fileName: "miniature_figure.stl",
      material: "PLA",
      priceRange: { min: 8.5, max: 12.75 },
      volume: 12.3,
      createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
    },
    {
      id: 3,
      fileName: "gear_assembly.stl",
      material: "PETG",
      priceRange: { min: 22.0, max: 33.0 },
      volume: 45.2,
      createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
    },
  ]

  // Sample statistics
  const stats = {
    totalQuotes: 12,
    totalVolume: 234.5,
    avgQuoteValue: 28.75,
    creditsUsed: 8,
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight glow-text bg-gradient-to-r from-cyber-blue to-cyber-purple bg-clip-text text-transparent">
            Welcome back, {profile?.name?.split(" ")[0] || "User"}
          </h1>
          <p className="text-muted-foreground mt-1">Manage your 3D printing projects and quotes</p>
        </div>
        <div className="glass px-4 py-2 rounded-md flex items-center">
          <CreditCard className="h-5 w-5 mr-2 text-cyber-blue" />
          <span className="font-medium">Credits: </span>
          <span className="ml-1 text-cyber-blue font-bold">{profile?.credits || 0}</span>
        </div>
      </div>

      {/* Quick Actions */}
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

        <Card className="glass border-cyber-blue/20">
          <CardHeader>
            <CardTitle className="flex items-center">
              <History className="h-5 w-5 mr-2 text-cyber-blue" />
              Quote History
            </CardTitle>
            <CardDescription>View your previous quotes</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full bg-cyber-blue hover:bg-cyber-blue/80 text-black btn-hover-effect">
              <Link href="/history">View History</Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Statistics Overview */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="glass border-cyber-blue/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Quotes</p>
                <p className="text-2xl font-bold text-cyber-blue">{stats.totalQuotes}</p>
              </div>
              <FileText className="h-8 w-8 text-cyber-blue/50" />
            </div>
          </CardContent>
        </Card>

        <Card className="glass border-cyber-blue/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Volume</p>
                <p className="text-2xl font-bold text-cyber-blue">{stats.totalVolume} cm³</p>
              </div>
              <Package className="h-8 w-8 text-cyber-blue/50" />
            </div>
          </CardContent>
        </Card>

        <Card className="glass border-cyber-blue/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Avg Quote Value</p>
                <p className="text-2xl font-bold text-cyber-blue">${stats.avgQuoteValue}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-cyber-blue/50" />
            </div>
          </CardContent>
        </Card>

        <Card className="glass border-cyber-blue/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Credits Used</p>
                <p className="text-2xl font-bold text-cyber-blue">{stats.creditsUsed}</p>
              </div>
              <Clock className="h-8 w-8 text-cyber-blue/50" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Quotes */}
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
            {recentQuotes.map((quote) => (
              <div
                key={quote.id}
                className="flex justify-between items-center p-4 glass rounded-md hover:bg-cyber-blue/5 transition-colors"
              >
                <div className="flex-1">
                  <div className="font-medium text-cyber-blue">{quote.fileName}</div>
                  <div className="text-sm text-muted-foreground flex items-center gap-4 mt-1">
                    <span className="flex items-center">
                      <Clock className="h-3 w-3 mr-1" />
                      {format(quote.createdAt, "MMM d, yyyy")}
                    </span>
                    <span className="flex items-center">
                      <Package className="h-3 w-3 mr-1" />
                      {quote.volume.toFixed(1)} cm³
                    </span>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <Badge variant="outline" className="border-cyber-blue/30 text-cyber-blue">
                    {quote.material}
                  </Badge>
                  <div className="text-sm font-medium">
                    ${quote.priceRange.min.toFixed(2)} - ${quote.priceRange.max.toFixed(2)}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {recentQuotes.length === 0 && (
            <div className="text-center py-8">
              <FileText className="h-12 w-12 mx-auto text-cyber-blue/50 mb-4" />
              <h3 className="text-lg font-medium text-cyber-blue mb-2">No quotes yet</h3>
              <p className="text-muted-foreground mb-4">
                Create your first quote to get started with pricing your 3D prints.
              </p>
              <Button asChild className="bg-cyber-blue hover:bg-cyber-blue/80 text-black btn-hover-effect">
                <Link href="/calculator">Create Your First Quote</Link>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Tips */}
      <Card className="glass border-cyber-blue/20">
        <CardHeader>
          <CardTitle className="text-cyber-blue">Quick Tips</CardTitle>
          <CardDescription>Get the most out of your 3D printing quotes</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <h4 className="font-medium text-cyber-blue">Accurate Measurements</h4>
              <p className="text-sm text-muted-foreground">
                Upload STL files for the most accurate volume and surface area calculations.
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium text-cyber-blue">Material Selection</h4>
              <p className="text-sm text-muted-foreground">
                Choose the right filament type based on your project requirements and budget.
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium text-cyber-blue">Batch Printing</h4>
              <p className="text-sm text-muted-foreground">
                Consider printing multiple parts together to optimize costs and time.
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium text-cyber-blue">Market Pricing</h4>
              <p className="text-sm text-muted-foreground">
                Use our market comparison feature to stay competitive with your pricing.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
