"use client"

import { useState } from "react"
import { saveQuote, type QuoteResponse } from "@/app/actions"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Loader2, Download, Mail, Copy, Check } from "lucide-react"
import { formatCurrency } from "@/lib/utils"

interface QuoteDisplayProps {
  quote: QuoteResponse
}

export function QuoteDisplay({ quote }: QuoteDisplayProps) {
  const [isSaving, setIsSaving] = useState(false)
  const [isCopied, setIsCopied] = useState(false)
  const [isExporting, setIsExporting] = useState(false)
  const [isEmailing, setIsEmailing] = useState(false)

  const handleSave = async () => {
    setIsSaving(true)
    try {
      await saveQuote(quote)
      // Show success message or redirect
    } catch (error) {
      console.error("Error saving quote:", error)
    } finally {
      setIsSaving(false)
    }
  }

  const handleCopyToClipboard = async () => {
    try {
      // Create a formatted text version of the quote
      const formattedQuote = `
QUOTE #${quote.id}
Date: ${quote.quoteDate}
Valid Until: ${quote.expiryDate}

TO:
${quote.customerName}
${quote.companyName}
${quote.customerEmail}

PROJECT: ${quote.projectType}

${quote.introduction}

SCOPE OF WORK:
${quote.scopeOfWork}

DELIVERABLES:
${quote.deliverables.map((item) => `- ${item}`).join("\n")}

TIMELINE:
${quote.timeline}

PRICING:
${quote.pricing.breakdown.map((item) => `${item.item}: ${formatCurrency(item.cost)}`).join("\n")}

Subtotal: ${formatCurrency(quote.pricing.subtotal)}
Tax (10%): ${formatCurrency(quote.pricing.tax)}
TOTAL: ${formatCurrency(quote.pricing.total)}

TERMS AND CONDITIONS:
${quote.terms.map((item) => `- ${item}`).join("\n")}

NEXT STEPS:
${quote.nextSteps.map((item) => `- ${item}`).join("\n")}
      `

      await navigator.clipboard.writeText(formattedQuote)
      setIsCopied(true)
      setTimeout(() => setIsCopied(false), 2000)
    } catch (error) {
      console.error("Failed to copy to clipboard:", error)
    }
  }

  const handleExportPDF = () => {
    setIsExporting(true)
    // In a real application, you would generate a PDF here
    // For now, we'll just simulate it
    setTimeout(() => {
      setIsExporting(false)
      alert("PDF export functionality would be implemented here in a real application.")
    }, 1000)
  }

  const handleSendEmail = () => {
    setIsEmailing(true)
    // In a real application, you would send an email here
    // For now, we'll just simulate it
    setTimeout(() => {
      setIsEmailing(false)
      alert("Email functionality would be implemented here in a real application.")
    }, 1000)
  }

  return (
    <div className="space-y-6">
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader className="border-b">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <CardTitle className="text-2xl">Quote #{quote.id}</CardTitle>
              <CardDescription>
                Generated on {quote.quoteDate} • Valid until {quote.expiryDate}
              </CardDescription>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button size="sm" variant="outline" onClick={handleCopyToClipboard}>
                {isCopied ? <Check className="h-4 w-4 mr-2" /> : <Copy className="h-4 w-4 mr-2" />}
                {isCopied ? "Copied!" : "Copy"}
              </Button>
              <Button size="sm" variant="outline" onClick={handleExportPDF} disabled={isExporting}>
                {isExporting ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Download className="h-4 w-4 mr-2" />
                )}
                Export PDF
              </Button>
              <Button size="sm" onClick={handleSendEmail} disabled={isEmailing}>
                {isEmailing ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Mail className="h-4 w-4 mr-2" />}
                Send to Client
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-sm font-medium text-gray-500">From</h3>
              <div className="mt-1">
                <p className="font-medium">Your Company Name</p>
                <p>your.email@example.com</p>
                <p>Your Company Address</p>
                <p>Phone: (123) 456-7890</p>
              </div>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">To</h3>
              <div className="mt-1">
                <p className="font-medium">{quote.customerName}</p>
                <p>{quote.companyName}</p>
                <p>{quote.customerEmail}</p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-medium">Project: {quote.projectType}</h3>
            <p className="mt-2 text-gray-700">{quote.introduction}</p>
          </div>

          <div>
            <h3 className="text-lg font-medium">Scope of Work</h3>
            <p className="mt-2 text-gray-700 whitespace-pre-line">{quote.scopeOfWork}</p>
          </div>

          <div>
            <h3 className="text-lg font-medium">Deliverables</h3>
            <ul className="mt-2 list-disc list-inside space-y-1">
              {quote.deliverables.map((deliverable, index) => (
                <li key={index} className="text-gray-700">
                  {deliverable}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-medium">Timeline</h3>
            <p className="mt-2 text-gray-700 whitespace-pre-line">{quote.timeline}</p>
          </div>

          <div>
            <h3 className="text-lg font-medium">Pricing</h3>
            <Table className="mt-2">
              <TableHeader>
                <TableRow>
                  <TableHead>Item</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead className="text-right">Cost</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {quote.pricing.breakdown.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{item.item}</TableCell>
                    <TableCell>{item.description}</TableCell>
                    <TableCell className="text-right">{formatCurrency(item.cost)}</TableCell>
                  </TableRow>
                ))}
                <TableRow>
                  <TableCell colSpan={2} className="text-right font-medium">
                    Subtotal
                  </TableCell>
                  <TableCell className="text-right">{formatCurrency(quote.pricing.subtotal)}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell colSpan={2} className="text-right font-medium">
                    Tax (10%)
                  </TableCell>
                  <TableCell className="text-right">{formatCurrency(quote.pricing.tax)}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell colSpan={2} className="text-right font-medium">
                    Total
                  </TableCell>
                  <TableCell className="text-right font-bold">{formatCurrency(quote.pricing.total)}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>

          <div>
            <h3 className="text-lg font-medium">Terms & Conditions</h3>
            <ul className="mt-2 list-disc list-inside space-y-1">
              {quote.terms.map((term, index) => (
                <li key={index} className="text-gray-700">
                  {term}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-medium">Next Steps</h3>
            <ol className="mt-2 list-decimal list-inside space-y-1">
              {quote.nextSteps.map((step, index) => (
                <li key={index} className="text-gray-700">
                  {step}
                </li>
              ))}
            </ol>
          </div>
        </CardContent>
        <CardFooter className="border-t flex justify-between pt-6">
          <p className="text-sm text-gray-500">
            Thank you for your business. If you have any questions, please contact us.
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}
