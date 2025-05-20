"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Upload, AlertCircle, Check, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { validateSTLWithAI, calculateQuoteWithAI, getMaterials, getRegions, getFinishes } from "@/app/actions"
import { PaymentForm } from "@/components/payment-form"
import { QuoteResult } from "@/components/quote-result"
import type { Material, Region, Finish, Validation, Quote } from "@/lib/supabase"

export default function QuoteForm() {
  const [file, setFile] = useState<File | null>(null)
  const [fileError, setFileError] = useState<string | null>(null)
  const [material, setMaterial] = useState<string>("")
  const [finish, setFinish] = useState<string>("")
  const [region, setRegion] = useState<string>("")
  const [email, setEmail] = useState<string>("")
  const [validationResult, setValidationResult] = useState<Validation | null>(null)
  const [isValidating, setIsValidating] = useState<boolean>(false)
  const [quote, setQuote] = useState<Quote | null>(null)
  const [isCalculating, setIsCalculating] = useState<boolean>(false)
  const [isPaid, setIsPaid] = useState<boolean>(false)
  const [activeTab, setActiveTab] = useState<string>("quote")

  // State for dynamic data
  const [materials, setMaterials] = useState<Material[]>([])
  const [regions, setRegions] = useState<Region[]>([])
  const [finishes, setFinishes] = useState<Finish[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)

  // Fetch data on component mount
  useEffect(() => {
    async function fetchData() {
      try {
        const [materialsData, regionsData, finishesData] = await Promise.all([
          getMaterials(),
          getRegions(),
          getFinishes(),
        ])

        setMaterials(materialsData)
        setRegions(regionsData)
        setFinishes(finishesData)
      } catch (error) {
        console.error("Error fetching data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    setFileError(null)
    setValidationResult(null)

    if (!selectedFile) {
      return
    }

    if (
      !selectedFile.name.toLowerCase().endsWith(".stl") &&
      !selectedFile.name.toLowerCase().endsWith(".obj") &&
      !selectedFile.name.toLowerCase().endsWith(".3mf")
    ) {
      setFileError("Please upload a valid 3D model file (STL, OBJ, or 3MF)")
      return
    }

    setFile(selectedFile)
  }

  const handleValidate = async () => {
    if (!file) {
      setFileError("Please upload a file first")
      return
    }

    setIsValidating(true)
    try {
      // Use our AI-powered validation function
      const result = await validateSTLWithAI(file)
      setValidationResult(result)
      setActiveTab("validator")
    } catch (error) {
      console.error("Validation error:", error)
      setFileError("Error validating file. Please try again.")
    } finally {
      setIsValidating(false)
    }
  }

  const handleGetQuote = async () => {
    if (!file) {
      setFileError("Please upload a file first")
      return
    }

    if (!material) {
      return
    }

    if (!finish) {
      return
    }

    if (!region) {
      return
    }

    setIsCalculating(true)
    try {
      // Use our AI-powered quote calculation function with real data
      const quoteResult = await calculateQuoteWithAI(file, material, finish, region, email || undefined)
      setQuote(quoteResult)
    } catch (error) {
      console.error("Quote calculation error:", error)
      setFileError("Error calculating quote. Please try again.")
    } finally {
      setIsCalculating(false)
    }
  }

  const handlePaymentSuccess = () => {
    setIsPaid(true)
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Loading...</span>
      </div>
    )
  }

  return (
    <section className="py-12 md:py-24 bg-white" id="quote-form">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Get Your 3D Print Quote</h2>
            <p className="max-w-[700px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Upload your 3D model file, select your preferences, and get an instant quote.
            </p>
          </div>
        </div>
        <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-2 lg:gap-12">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="quote">Get Quote</TabsTrigger>
              <TabsTrigger value="validator" id="validator">
                Free STL Validator
              </TabsTrigger>
            </TabsList>
            <TabsContent value="quote" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Upload Your 3D Model</CardTitle>
                  <CardDescription>We support STL, OBJ, and 3MF file formats.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid w-full gap-1.5">
                    <Label htmlFor="file">Upload File</Label>
                    <div className="flex items-center justify-center w-full">
                      <label
                        htmlFor="file-upload"
                        className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
                      >
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <Upload className="w-8 h-8 mb-4 text-gray-500" />
                          <p className="mb-2 text-sm text-gray-500">
                            <span className="font-semibold">Click to upload</span> or drag and drop
                          </p>
                          <p className="text-xs text-gray-500">STL, OBJ, or 3MF (max. 50MB)</p>
                          {file && (
                            <div className="mt-4 flex items-center gap-2 text-green-600">
                              <Check className="h-5 w-5" />
                              <span>{file.name}</span>
                            </div>
                          )}
                        </div>
                        <input
                          id="file-upload"
                          type="file"
                          className="hidden"
                          accept=".stl,.obj,.3mf"
                          onChange={handleFileChange}
                        />
                      </label>
                    </div>
                    {fileError && (
                      <Alert variant="destructive" className="mt-2">
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>Error</AlertTitle>
                        <AlertDescription>{fileError}</AlertDescription>
                      </Alert>
                    )}
                  </div>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="grid gap-1.5">
                      <Label htmlFor="material">Material</Label>
                      <Select value={material} onValueChange={setMaterial}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select material" />
                        </SelectTrigger>
                        <SelectContent>
                          {materials.map((mat) => (
                            <SelectItem key={mat.id} value={mat.code}>
                              {mat.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid gap-1.5">
                      <Label htmlFor="finish">Finish</Label>
                      <Select value={finish} onValueChange={setFinish}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select finish" />
                        </SelectTrigger>
                        <SelectContent>
                          {finishes.map((fin) => (
                            <SelectItem key={fin.id} value={fin.code}>
                              {fin.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="grid gap-1.5">
                      <Label htmlFor="region">Region</Label>
                      <Select value={region} onValueChange={setRegion}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select region" />
                        </SelectTrigger>
                        <SelectContent>
                          {regions.map((reg) => (
                            <SelectItem key={reg.id} value={reg.code}>
                              {reg.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid gap-1.5">
                      <Label htmlFor="email">Email (Optional)</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="your@email.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex flex-col gap-4">
                  <div className="flex flex-col gap-2 w-full sm:flex-row">
                    <Button
                      className="w-full"
                      onClick={handleGetQuote}
                      disabled={!file || !material || !finish || !region || isCalculating}
                    >
                      {isCalculating ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Calculating with AI...
                        </>
                      ) : (
                        "Get Instant Quote"
                      )}
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={handleValidate}
                      disabled={!file || isValidating}
                    >
                      {isValidating ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Validating with AI...
                        </>
                      ) : (
                        "Free STL Validation"
                      )}
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            </TabsContent>
            <TabsContent value="validator" className="mt-4">
              {validationResult ? (
                <Card>
                  <CardHeader>
                    <CardTitle>STL Validation Results</CardTitle>
                    <CardDescription>AI-powered analysis of your 3D model file</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm font-medium">File Name</p>
                          <p className="text-sm text-gray-500">{validationResult.file_name}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium">File Size</p>
                          <p className="text-sm text-gray-500">
                            {(validationResult.file_size / 1024 / 1024).toFixed(2)} MB
                          </p>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm font-medium">Triangles</p>
                          <p className="text-sm text-gray-500">{validationResult.triangles.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium">Printability</p>
                          <p className={`text-sm ${validationResult.is_printable ? "text-green-500" : "text-red-500"}`}>
                            {validationResult.is_printable ? "Printable" : "Issues Detected"}
                          </p>
                        </div>
                      </div>
                      <div>
                        <p className="text-sm font-medium">Dimensions</p>
                        <p className="text-sm text-gray-500">
                          {validationResult.dimensions.x.toFixed(2)} x {validationResult.dimensions.y.toFixed(2)} x{" "}
                          {validationResult.dimensions.z.toFixed(2)} mm
                        </p>
                      </div>
                      {validationResult.issues && validationResult.issues.length > 0 && (
                        <div>
                          <p className="text-sm font-medium">Issues</p>
                          <ul className="list-disc pl-5 text-sm text-gray-500">
                            {validationResult.issues.map((issue: string, index: number) => (
                              <li key={index}>{issue}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button className="w-full" onClick={() => setActiveTab("quote")}>
                      Get a Quote for This Model
                    </Button>
                  </CardFooter>
                </Card>
              ) : (
                <Card>
                  <CardHeader>
                    <CardTitle>Free STL Validator</CardTitle>
                    <CardDescription>AI-powered check if your 3D model is printable before ordering</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-center w-full">
                      <label
                        htmlFor="validator-file-upload"
                        className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
                      >
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <Upload className="w-8 h-8 mb-4 text-gray-500" />
                          <p className="mb-2 text-sm text-gray-500">
                            <span className="font-semibold">Click to upload</span> or drag and drop
                          </p>
                          <p className="text-xs text-gray-500">STL, OBJ, or 3MF (max. 50MB)</p>
                          {file && (
                            <div className="mt-4 flex items-center gap-2 text-green-600">
                              <Check className="h-5 w-5" />
                              <span>{file.name}</span>
                            </div>
                          )}
                        </div>
                        <input
                          id="validator-file-upload"
                          type="file"
                          className="hidden"
                          accept=".stl,.obj,.3mf"
                          onChange={handleFileChange}
                        />
                      </label>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button className="w-full" onClick={handleValidate} disabled={!file || isValidating}>
                      {isValidating ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Validating with AI...
                        </>
                      ) : (
                        "Validate STL File"
                      )}
                    </Button>
                  </CardFooter>
                </Card>
              )}
            </TabsContent>
          </Tabs>
          <div>
            {quote && !isPaid ? (
              <PaymentForm onSuccess={handlePaymentSuccess} quoteId={quote.id} amount={5} />
            ) : quote && isPaid ? (
              <QuoteResult quote={quote} />
            ) : (
              <div className="space-y-4">
                <h3 className="text-2xl font-bold">Why Use Our Quote Tool?</h3>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <Check className="mr-2 h-5 w-5 text-green-500 mt-0.5" />
                    <span>AI-powered analysis for accurate quotes</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="mr-2 h-5 w-5 text-green-500 mt-0.5" />
                    <span>Up-to-date pricing using real-time market data</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="mr-2 h-5 w-5 text-green-500 mt-0.5" />
                    <span>Detailed breakdown of costs and print time</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="mr-2 h-5 w-5 text-green-500 mt-0.5" />
                    <span>AI-optimized print settings for best results</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="mr-2 h-5 w-5 text-green-500 mt-0.5" />
                    <span>Free AI-powered STL validation</span>
                  </li>
                </ul>
                <div className="rounded-lg bg-gray-100 p-4">
                  <p className="text-sm text-gray-500">
                    Our AI-powered tool analyzes your 3D model in detail and provides the most accurate pricing based on
                    current material costs and optimal print settings.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
