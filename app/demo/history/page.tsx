"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FileText, Download, Eye, Lock, ArrowRight } from "lucide-react"
import { useDemo } from "@/contexts/demo-context"
import { useRouter } from "next/navigation"
import { getDemoQuoteHistory } from "@/lib/services/demo-service"
import { format } from "date-fns"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export default function DemoHistory() {
  const quoteHistory = getDemoQuoteHistory()
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
          Quote History (Demo)
        </h1>
        <p className="text-muted-foreground mt-1">View and manage your previous quotes</p>
      </div>

      <Card className="glass border-cyber-blue/20 mb-6">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg text-cyber-blue">Save Your Quote History</CardTitle>
          <CardDescription>Create an account to save and access your quotes anytime</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-sm text-muted-foreground">
              <p>With a free account, you can:</p>
              <ul className="list-disc list-inside mt-1 space-y-1">
                <li>Save unlimited quotes</li>
                <li>Export quotes as PDF</li>
                <li>Compare different pricing options</li>
                <li>Track your printing projects</li>
              </ul>
            </div>
            <Button onClick={handleSignUp} className="bg-cyber-blue hover:bg-cyber-blue/80 text-black btn-hover-effect">
              <ArrowRight className="mr-2 h-4 w-4" />
              Sign Up Now
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="glass border-cyber-blue/20">
        <CardHeader>
          <CardTitle className="flex items-center">
            <FileText className="h-5 w-5 mr-2 text-cyber-blue" />
            Quote History
          </CardTitle>
          <CardDescription>Your saved quotes and estimates</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="border-cyber-blue/20">
                <TableHead>Date</TableHead>
                <TableHead>File Name</TableHead>
                <TableHead>Material</TableHead>
                <TableHead>Volume</TableHead>
                <TableHead>Price Range</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {quoteHistory.map((quote) => (
                <TableRow key={quote.id} className="border-cyber-blue/10">
                  <TableCell className="font-medium">{format(new Date(quote.created_at), "MMM d, yyyy")}</TableCell>
                  <TableCell>{quote.file_name}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="border-cyber-blue/30 text-cyber-blue">
                      {quote.material}
                    </Badge>
                  </TableCell>
                  <TableCell>{quote.volume.toFixed(1)} cm³</TableCell>
                  <TableCell>
                    ${quote.price_min.toFixed(2)} - ${quote.price_max.toFixed(2)}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 hover:bg-cyber-blue/10 hover:text-cyber-blue"
                        disabled
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 hover:bg-cyber-blue/10 hover:text-cyber-blue"
                        disabled
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <div className="flex justify-center mt-6">
            <Button
              className="bg-cyber-blue/20 hover:bg-cyber-blue/30 text-cyber-blue border border-cyber-blue/30"
              disabled
            >
              <Lock className="mr-2 h-4 w-4" />
              Demo Mode - Actions Disabled
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
