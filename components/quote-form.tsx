"use client"

import type React from "react"

import { useState } from "react"
import { generateQuote, type QuoteFormData, type QuoteResponse } from "@/app/actions"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2 } from "lucide-react"
import { QuoteDisplay } from "@/components/quote-display"

const projectTypes = [
  "Web Development",
  "Mobile App Development",
  "Software Development",
  "UI/UX Design",
  "Branding",
  "Marketing Campaign",
  "Consulting",
  "Content Creation",
  "E-commerce",
  "Other",
]

const industries = [
  "Technology",
  "Healthcare",
  "Finance",
  "Education",
  "Retail",
  "Manufacturing",
  "Entertainment",
  "Real Estate",
  "Hospitality",
  "Other",
]

export default function QuoteForm() {
  const [formData, setFormData] = useState<QuoteFormData>({
    customerName: "",
    customerEmail: "",
    companyName: "",
    projectType: "",
    projectDescription: "",
    projectScope: "",
    timeline: "",
    budget: "",
    additionalRequirements: "",
    industry: "",
  })

  const [isGenerating, setIsGenerating] = useState(false)
  const [quote, setQuote] = useState<QuoteResponse | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsGenerating(true)
    setError(null)

    try {
      // Validate required fields
      if (
        !formData.customerName ||
        !formData.customerEmail ||
        !formData.projectType ||
        !formData.projectDescription ||
        !formData.projectScope ||
        !formData.timeline
      ) {
        throw new Error("Please fill in all required fields")
      }

      // Generate quote
      const generatedQuote = await generateQuote(formData)
      setQuote(generatedQuote)
    } catch (err) {
      console.error("Error generating quote:", err)
      setError(err instanceof Error ? err.message : "An unexpected error occurred")
    } finally {
      setIsGenerating(false)
    }
  }

  const handleReset = () => {
    setQuote(null)
    setError(null)
  }

  if (quote) {
    return (
      <div className="space-y-6">
        <QuoteDisplay quote={quote} />
        <div className="flex justify-center">
          <Button onClick={handleReset} variant="outline" className="mr-4">
            Generate Another Quote
          </Button>
        </div>
      </div>
    )
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Generate a Professional Quote</CardTitle>
        <CardDescription>Fill in the details below to generate a customized quote using AI</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Client Information</h3>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="customerName">
                  Client Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="customerName"
                  name="customerName"
                  value={formData.customerName}
                  onChange={handleChange}
                  placeholder="John Smith"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="customerEmail">
                  Client Email <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="customerEmail"
                  name="customerEmail"
                  type="email"
                  value={formData.customerEmail}
                  onChange={handleChange}
                  placeholder="john@example.com"
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="companyName">Company Name</Label>
              <Input
                id="companyName"
                name="companyName"
                value={formData.companyName}
                onChange={handleChange}
                placeholder="Acme Inc. (optional)"
              />
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-medium">Project Details</h3>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="projectType">
                  Project Type <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={formData.projectType}
                  onValueChange={(value) => handleSelectChange("projectType", value)}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select project type" />
                  </SelectTrigger>
                  <SelectContent>
                    {projectTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="industry">Industry</Label>
                <Select
                  value={formData.industry || ""}
                  onValueChange={(value) => handleSelectChange("industry", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select industry (optional)" />
                  </SelectTrigger>
                  <SelectContent>
                    {industries.map((industry) => (
                      <SelectItem key={industry} value={industry}>
                        {industry}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="projectDescription">
                Project Description <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="projectDescription"
                name="projectDescription"
                value={formData.projectDescription}
                onChange={handleChange}
                placeholder="Describe the project in detail..."
                rows={3}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="projectScope">
                Project Scope <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="projectScope"
                name="projectScope"
                value={formData.projectScope}
                onChange={handleChange}
                placeholder="Define the scope of work..."
                rows={3}
                required
              />
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="timeline">
                  Timeline <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="timeline"
                  name="timeline"
                  value={formData.timeline}
                  onChange={handleChange}
                  placeholder="e.g., 4 weeks, 3 months"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="budget">Budget Range</Label>
                <Input
                  id="budget"
                  name="budget"
                  value={formData.budget}
                  onChange={handleChange}
                  placeholder="e.g., $5,000-$10,000 (optional)"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="additionalRequirements">Additional Requirements</Label>
              <Textarea
                id="additionalRequirements"
                name="additionalRequirements"
                value={formData.additionalRequirements}
                onChange={handleChange}
                placeholder="Any additional requirements or special requests... (optional)"
                rows={3}
              />
            </div>
          </div>

          {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">{error}</div>}

          <Button type="submit" className="w-full" disabled={isGenerating}>
            {isGenerating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Generating Quote...
              </>
            ) : (
              "Generate Quote"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
