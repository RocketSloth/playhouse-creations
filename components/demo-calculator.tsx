"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Loader2,
  Upload,
  FileUp,
  AlertCircle,
  Trash2,
  Eye,
  TrendingUp,
  TrendingDown,
  Minus,
  FileText,
  PenLine,
  Cpu,
  BarChart3,
  Layers,
} from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Progress } from "@/components/ui/progress"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { getDemoModels, getDemoQuoteResult } from "@/lib/services/demo-service"
import { useDemo } from "@/contexts/demo-context"

export default function DemoCalculator() {
  const [isClient, setIsClient] = useState(false)

  // Ensure this only runs on the client
  useEffect(() => {
    setIsClient(true)
  }, [])

  // Don't render anything until we're on the client
  if (!isClient) {
    return (
      <div className="h-[600px] flex items-center justify-center">
        <div className="animate-pulse-slow text-cyber-blue">
          <div className="h-16 w-16 border-4 border-t-transparent border-cyber-blue rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-center font-light tracking-wider">LOADING CALCULATOR...</p>
        </div>
      </div>
    )
  }

  return <DemoCalculatorContent />
}

function DemoCalculatorContent() {
  const { demoStep, setDemoStep } = useDemo()
  const [activeTab, setActiveTab] = useState("upload")
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analyzeProgress, setAnalyzeProgress] = useState(0)
  const [isGeneratingQuote, setIsGeneratingQuote] = useState(false)
  const [modelsData, setModelsData] = useState<any[]>([])
  const [activeModelIndex, setActiveModelIndex] = useState<number>(0)
  const [quoteResult, setQuoteResult] = useState<any>(null)
  const { toast } = useToast()

  const [formData, setFormData] = useState({
    filamentType: "PLA",
    costPerSpool: 25,
    spoolWeight: 1000, // in grams
    printerHourlyRate: 2,
    printSpeed: 15, // in cm³/hr
    otherCosts: 5,
    density: 1.24, // g/cm³ for PLA
  })

  const [entryMode, setEntryMode] = useState<"upload" | "manual">("upload")
  const [manualModelData, setManualModelData] = useState<{
    name: string
    dimensionX: number
    dimensionY: number
    dimensionZ: number
    volume: number
    surfaceArea: number
    triangleCount: number
    filamentLength: number
    filamentWeight: number
    printTime: number
  }>({
    name: "Manual Entry",
    dimensionX: 100,
    dimensionY: 100,
    dimensionZ: 100,
    volume: 100,
    surfaceArea: 6000,
    triangleCount: 1000,
    filamentLength: 0,
    filamentWeight: 0,
    printTime: 0,
  })
  const [manualEntryMode, setManualEntryMode] = useState<"simple" | "advanced">("simple")

  // Sync active tab with demo step
  useEffect(() => {
    if (activeTab === "upload" && demoStep !== 1) {
      setDemoStep(1)
    } else if (activeTab === "details" && demoStep !== 2) {
      setDemoStep(2)
    } else if (activeTab === "quote" && demoStep !== 3) {
      setDemoStep(3)
    }
  }, [activeTab, demoStep, setDemoStep])

  // Handle form input changes
  const handleInputChange = (field: string, value: string | number) => {
    setFormData((prev) => ({
      ...prev,
      [field]: typeof value === "string" && !isNaN(Number.parseFloat(value)) ? Number.parseFloat(value) : value,
    }))
  }

  // Handle filament type change
  const handleFilamentChange = (value: string) => {
    // Update density based on filament type
    const densities: Record<string, number> = {
      PLA: 1.24,
      ABS: 1.04,
      PETG: 1.27,
      TPU: 1.21,
      Nylon: 1.14,
      Resin: 1.1,
    }

    setFormData((prev) => ({
      ...prev,
      filamentType: value,
      density: densities[value as keyof typeof densities] || 1.24,
    }))
  }

  // Simulate progress for analysis
  useEffect(() => {
    if (isAnalyzing) {
      const interval = setInterval(() => {
        setAnalyzeProgress((prev) => {
          const newProgress = prev + Math.random() * 15
          return newProgress >= 100 ? 100 : newProgress
        })
      }, 200)

      return () => {
        clearInterval(interval)
        setAnalyzeProgress(0)
      }
    }
  }, [isAnalyzing])

  // Get aggregated model data
  const getAggregatedModelData = () => {
    if (modelsData.length === 0) {
      return {
        dimensions: { x: 0, y: 0, z: 0 },
        volume: 0,
        surfaceArea: 0,
        triangleCount: 0,
        fileName: "No models",
      }
    }

    // For multiple models, we sum up volume, surface area, and triangle count
    // For dimensions, we take the max of each dimension (as if all parts were in a bounding box)
    return modelsData.reduce(
      (acc, model) => {
        return {
          dimensions: {
            x: Math.max(acc.dimensions.x, model.dimensions.x),
            y: Math.max(acc.dimensions.y, model.dimensions.y),
            z: Math.max(acc.dimensions.z, model.dimensions.z),
          },
          volume: acc.volume + model.volume,
          surfaceArea: acc.surfaceArea + model.surfaceArea,
          triangleCount: acc.triangleCount + model.triangleCount,
          fileName: `${modelsData.length} parts`,
        }
      },
      {
        dimensions: { x: 0, y: 0, z: 0 },
        volume: 0,
        surfaceArea: 0,
        triangleCount: 0,
        fileName: "",
      },
    )
  }

  // Get total estimated weight
  const getTotalWeight = () => {
    return modelsData.reduce((total, model) => total + model.volume * formData.density, 0)
  }

  // Get total estimated print time
  const getTotalPrintTime = () => {
    const totalVolume = modelsData.reduce((total, model) => total + model.volume, 0)
    return totalVolume / formData.printSpeed
  }

  // Handle file upload simulation
  const handleFileUpload = () => {
    setIsAnalyzing(true)

    // Simulate file analysis
    setTimeout(() => {
      setIsAnalyzing(false)
      setModelsData(getDemoModels())
      setActiveTab("details")
      setDemoStep(2)

      toast({
        title: "Files analyzed",
        description: "Demo files have been loaded successfully",
      })
    }, 2000)
  }

  // Generate quote
  const handleGenerateQuote = () => {
    setIsGeneratingQuote(true)

    // Simulate API call
    setTimeout(() => {
      setQuoteResult(getDemoQuoteResult())
      setIsGeneratingQuote(false)
      setActiveTab("quote")
      setDemoStep(3)

      toast({
        title: "Quote generated",
        description: "Your price estimate is ready",
      })
    }, 2000)
  }

  // Get price position icon
  const getPricePositionIcon = (position: string) => {
    switch (position) {
      case "below":
        return <TrendingDown className="h-5 w-5 text-cyber-green" />
      case "premium":
        return <TrendingUp className="h-5 w-5 text-cyber-yellow" />
      case "competitive":
      default:
        return <Minus className="h-5 w-5 text-cyber-blue" />
    }
  }

  // Get price position text
  const getPricePositionText = (position: string) => {
    switch (position) {
      case "below":
        return "Below Market"
      case "premium":
        return "Premium Pricing"
      case "competitive":
      default:
        return "Competitive"
    }
  }

  // Get price position color
  const getPricePositionColor = (position: string) => {
    switch (position) {
      case "below":
        return "text-cyber-green"
      case "premium":
        return "text-cyber-yellow"
      case "competitive":
      default:
        return "text-cyber-blue"
    }
  }

  // Handle manual model data changes
  const handleManualDataChange = (field: string, value: string | number) => {
    setManualModelData((prev) => ({
      ...prev,
      [field]: typeof value === "string" && !isNaN(Number.parseFloat(value)) ? Number.parseFloat(value) : value,
    }))
  }

  // Convert simple mode data to advanced mode data
  const convertSimpleToAdvanced = () => {
    const filamentDiameter = 1.75 // mm
    const filamentRadius = filamentDiameter / 2
    const filamentCrossSectionArea = Math.PI * filamentRadius * filamentRadius

    const filamentLengthMm = manualModelData.filamentLength * 1000
    const volumeMm3 = filamentLengthMm * filamentCrossSectionArea
    const volumeCm3 = volumeMm3 / 1000

    if (manualModelData.filamentWeight > 0 && manualModelData.filamentLength === 0) {
      const volumeFromWeight = manualModelData.filamentWeight / formData.density
      handleManualDataChange("volume", volumeFromWeight)
    } else {
      handleManualDataChange("volume", volumeCm3)
    }

    const estimatedSurfaceArea = volumeCm3 * 6
    handleManualDataChange("surfaceArea", estimatedSurfaceArea)

    const dimension = Math.pow(volumeCm3, 1 / 3) * 10
    handleManualDataChange("dimensionX", dimension)
    handleManualDataChange("dimensionY", dimension)
    handleManualDataChange("dimensionZ", dimension)
  }

  // Add manually entered model
  const handleAddManualModel = () => {
    if (manualEntryMode === "simple") {
      if (
        (manualModelData.filamentLength <= 0 && manualModelData.filamentWeight <= 0) ||
        manualModelData.printTime <= 0
      ) {
        toast({
          title: "Invalid input",
          description: "Please enter either filament length or weight, and print time",
          variant: "destructive",
        })
        return
      }
      convertSimpleToAdvanced()
    } else {
      if (
        manualModelData.dimensionX <= 0 ||
        manualModelData.dimensionY <= 0 ||
        manualModelData.dimensionZ <= 0 ||
        manualModelData.volume <= 0
      ) {
        toast({
          title: "Invalid dimensions",
          description: "All dimensions and volume must be greater than zero",
          variant: "destructive",
        })
        return
      }
    }

    const colorIndex =
      modelsData.length % ["#4299e1", "#48bb78", "#f56565", "#ecc94b", "#9f7aea", "#38b2ac", "#ed64a6"].length
    const color = ["#4299e1", "#48bb78", "#f56565", "#ecc94b", "#9f7aea", "#38b2ac", "#ed64a6"][colorIndex]

    const modelData = {
      dimensions: {
        x: manualModelData.dimensionX,
        y: manualModelData.dimensionY,
        z: manualModelData.dimensionZ,
      },
      volume: manualModelData.volume,
      surfaceArea: manualModelData.surfaceArea,
      triangleCount: manualModelData.triangleCount,
      fileName: manualModelData.name || "Manual Entry",
      color,
      isManual: true,
      printTime: manualModelData.printTime > 0 ? manualModelData.printTime : undefined,
    }

    setModelsData((prev) => [...prev, modelData])

    setManualModelData({
      name: "Manual Entry " + (modelsData.length + 2),
      dimensionX: 100,
      dimensionY: 100,
      dimensionZ: 100,
      volume: 100,
      surfaceArea: 6000,
      triangleCount: 1000,
      filamentLength: 0,
      filamentWeight: 0,
      printTime: 0,
    })

    if (activeTab === "upload") {
      setActiveTab("details")
      setDemoStep(2)
    }

    toast({
      title: "Model added",
      description: "Manual model data has been added",
    })
  }

  return (
    <Card className="glass border-cyber-blue/20 animate-glow">
      <CardHeader className="border-b border-cyber-blue/20">
        <CardTitle className="text-2xl font-light tracking-wider text-cyber-blue">3D PRINT QUOTE CALCULATOR</CardTitle>
        <CardDescription className="text-muted-foreground">
          Get accurate pricing estimates for your PLAyhouse Creations order
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger
              value="upload"
              disabled={isAnalyzing}
              className="data-[state=active]:bg-cyber-blue/20 data-[state=active]:text-cyber-blue"
            >
              <FileUp className="mr-2 h-4 w-4" />
              Upload Models
            </TabsTrigger>
            <TabsTrigger
              value="details"
              disabled={modelsData.length === 0 || isAnalyzing}
              className="data-[state=active]:bg-cyber-blue/20 data-[state=active]:text-cyber-blue"
            >
              <Layers className="mr-2 h-4 w-4" />
              Model Details
            </TabsTrigger>
            <TabsTrigger
              value="quote"
              disabled={!quoteResult || isGeneratingQuote}
              className="data-[state=active]:bg-cyber-blue/20 data-[state=active]:text-cyber-blue"
            >
              <BarChart3 className="mr-2 h-4 w-4" />
              Quote Results
            </TabsTrigger>
          </TabsList>

          <TabsContent value="upload" className="py-4 space-y-6">
            <div className="grid gap-6">
              {/* Entry Mode Selection */}
              <div className="mb-4">
                <RadioGroup value={entryMode} onValueChange={setEntryMode} className="flex space-x-4">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="upload" id="upload-mode" className="border-cyber-blue text-cyber-blue" />
                    <Label htmlFor="upload-mode" className="flex items-center">
                      <FileText className="mr-2 h-4 w-4 text-cyber-blue" />
                      Upload STL File
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="manual" id="manual-mode" className="border-cyber-blue text-cyber-blue" />
                    <Label htmlFor="manual-mode" className="flex items-center">
                      <PenLine className="mr-2 h-4 w-4 text-cyber-blue" />
                      Manual Entry
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              {entryMode === "upload" ? (
                /* File upload UI with futuristic design */
                <div className="flex flex-col items-center justify-center border-2 border-dashed border-cyber-blue/30 rounded-lg p-12 text-center glass">
                  <div className="mb-4 relative">
                    <div className="absolute inset-0 bg-cyber-blue opacity-10 blur-xl rounded-full animate-pulse-slow"></div>
                    <FileUp className="h-16 w-16 text-cyber-blue mb-2 mx-auto relative z-10" />
                    <h3 className="text-xl font-light tracking-wider text-cyber-blue mt-4">DEMO STL FILES</h3>
                    <p className="text-sm text-muted-foreground mt-1">Click the button below to load demo 3D models</p>
                  </div>

                  <Button
                    onClick={handleFileUpload}
                    disabled={isAnalyzing}
                    className="mt-2 bg-cyber-blue hover:bg-cyber-blue/80 text-black btn-hover-effect"
                  >
                    {isAnalyzing ? (
                      <>
                        <div className="mr-3">
                          <Loader2 className="h-4 w-4 animate-spin" />
                        </div>
                        <div className="flex flex-col items-start">
                          <span>Analyzing demo files...</span>
                          <Progress value={analyzeProgress} className="w-full h-1 mt-1 bg-black/20 progress-glow" />
                        </div>
                      </>
                    ) : (
                      <>
                        <Upload className="mr-2 h-4 w-4" />
                        Load Demo Files
                      </>
                    )}
                  </Button>
                </div>
              ) : (
                /* Manual entry UI */
                <div className="grid gap-6">
                  <div className="mb-4">
                    <RadioGroup value={manualEntryMode} onValueChange={setManualEntryMode} className="flex space-x-4">
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="simple" id="simple-mode" className="border-cyber-blue text-cyber-blue" />
                        <Label htmlFor="simple-mode" className="flex items-center">
                          Simple
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem
                          value="advanced"
                          id="advanced-mode"
                          className="border-cyber-blue text-cyber-blue"
                        />
                        <Label htmlFor="advanced-mode" className="flex items-center">
                          Advanced
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>

                  {manualEntryMode === "simple" ? (
                    /* Simple mode */
                    <div className="grid gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor="filament-length" className="text-muted-foreground">
                          Filament Length (m)
                        </Label>
                        <Input
                          id="filament-length"
                          type="number"
                          min="0"
                          step="0.01"
                          value={manualModelData.filamentLength}
                          onChange={(e) => handleManualDataChange("filamentLength", e.target.value)}
                          className="border-cyber-blue/30 focus:border-cyber-blue focus:ring-cyber-blue/20"
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="filament-weight" className="text-muted-foreground">
                          Filament Weight (g)
                        </Label>
                        <Input
                          id="filament-weight"
                          type="number"
                          min="0"
                          step="0.01"
                          value={manualModelData.filamentWeight}
                          onChange={(e) => handleManualDataChange("filamentWeight", e.target.value)}
                          className="border-cyber-blue/30 focus:border-cyber-blue focus:ring-cyber-blue/20"
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="print-time" className="text-muted-foreground">
                          Print Time (hours)
                        </Label>
                        <Input
                          id="print-time"
                          type="number"
                          min="0"
                          step="0.01"
                          value={manualModelData.printTime}
                          onChange={(e) => handleManualDataChange("printTime", e.target.value)}
                          className="border-cyber-blue/30 focus:border-cyber-blue focus:ring-cyber-blue/20"
                        />
                      </div>
                    </div>
                  ) : (
                    /* Advanced mode */
                    <div className="grid gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor="model-name" className="text-muted-foreground">
                          Model Name
                        </Label>
                        <Input
                          id="model-name"
                          type="text"
                          value={manualModelData.name}
                          onChange={(e) => handleManualDataChange("name", e.target.value)}
                          className="border-cyber-blue/30 focus:border-cyber-blue focus:ring-cyber-blue/20"
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="dimension-x" className="text-muted-foreground">
                          Dimension X (mm)
                        </Label>
                        <Input
                          id="dimension-x"
                          type="number"
                          min="0"
                          step="0.01"
                          value={manualModelData.dimensionX}
                          onChange={(e) => handleManualDataChange("dimensionX", e.target.value)}
                          className="border-cyber-blue/30 focus:border-cyber-blue focus:ring-cyber-blue/20"
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="dimension-y" className="text-muted-foreground">
                          Dimension Y (mm)
                        </Label>
                        <Input
                          id="dimension-y"
                          type="number"
                          min="0"
                          step="0.01"
                          value={manualModelData.dimensionY}
                          onChange={(e) => handleManualDataChange("dimensionY", e.target.value)}
                          className="border-cyber-blue/30 focus:border-cyber-blue focus:ring-cyber-blue/20"
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="dimension-z" className="text-muted-foreground">
                          Dimension Z (mm)
                        </Label>
                        <Input
                          id="dimension-z"
                          type="number"
                          min="0"
                          step="0.01"
                          value={manualModelData.dimensionZ}
                          onChange={(e) => handleManualDataChange("dimensionZ", e.target.value)}
                          className="border-cyber-blue/30 focus:border-cyber-blue focus:ring-cyber-blue/20"
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="volume" className="text-muted-foreground">
                          Volume (cm³)
                        </Label>
                        <Input
                          id="volume"
                          type="number"
                          min="0"
                          step="0.01"
                          value={manualModelData.volume}
                          onChange={(e) => handleManualDataChange("volume", e.target.value)}
                          className="border-cyber-blue/30 focus:border-cyber-blue focus:ring-cyber-blue/20"
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="surface-area" className="text-muted-foreground">
                          Surface Area (cm²)
                        </Label>
                        <Input
                          id="surface-area"
                          type="number"
                          min="0"
                          step="0.01"
                          value={manualModelData.surfaceArea}
                          onChange={(e) => handleManualDataChange("surfaceArea", e.target.value)}
                          className="border-cyber-blue/30 focus:border-cyber-blue focus:ring-cyber-blue/20"
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="triangle-count" className="text-muted-foreground">
                          Triangle Count
                        </Label>
                        <Input
                          id="triangle-count"
                          type="number"
                          min="0"
                          step="1"
                          value={manualModelData.triangleCount}
                          onChange={(e) => handleManualDataChange("triangleCount", e.target.value)}
                          className="border-cyber-blue/30 focus:border-cyber-blue focus:ring-cyber-blue/20"
                        />
                      </div>
                    </div>
                  )}

                  <Button
                    onClick={handleAddManualModel}
                    className="bg-cyber-blue hover:bg-cyber-blue/80 text-black btn-hover-effect"
                  >
                    Add Model
                  </Button>
                </div>
              )}

              {modelsData.length > 0 && (
                <div className="mt-8 w-full">
                  <div className="flex items-center mb-4">
                    <Cpu className="h-5 w-5 mr-2 text-cyber-blue" />
                    <h3 className="text-lg font-light tracking-wider text-cyber-blue">
                      DEMO MODELS ({modelsData.length})
                    </h3>
                  </div>
                  <div className="glass border border-cyber-blue/20 rounded-md">
                    <Table>
                      <TableHeader>
                        <TableRow className="border-cyber-blue/20">
                          <TableHead>File Name</TableHead>
                          <TableHead className="w-[100px] text-right">Volume</TableHead>
                          <TableHead className="w-[100px] text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {modelsData.map((model, index) => (
                          <TableRow key={index} className="border-cyber-blue/10 hover:bg-cyber-blue/5">
                            <TableCell className="font-medium flex items-center">
                              <div
                                className="w-3 h-3 rounded-full mr-2 animate-pulse-slow"
                                style={{ backgroundColor: model.color }}
                              ></div>
                              {model.fileName}
                            </TableCell>
                            <TableCell className="text-right">{model.volume.toFixed(2)} cm³</TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-2">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => setActiveModelIndex(index)}
                                  title="View model"
                                  className="hover:bg-cyber-blue/10 hover:text-cyber-blue"
                                >
                                  <Eye className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  title="Remove model"
                                  className="hover:bg-cyber-blue/10 hover:text-cyber-blue"
                                  disabled
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>

                  <div className="flex justify-between mt-4">
                    <div>
                      <Badge variant="outline" className="mr-2 border-cyber-blue/30 text-cyber-blue">
                        Total Volume: {getAggregatedModelData().volume.toFixed(2)} cm³
                      </Badge>
                      <Badge variant="outline" className="border-cyber-blue/30 text-cyber-blue">
                        Est. Weight: {getTotalWeight().toFixed(2)} g
                      </Badge>
                    </div>
                    <Button
                      onClick={() => setActiveTab("details")}
                      className="bg-cyber-blue hover:bg-cyber-blue/80 text-black btn-hover-effect"
                    >
                      Continue to Details
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="details" className="py-4">
            {modelsData.length > 0 && (
              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <div className="mb-6 glass p-4 rounded-lg border border-cyber-blue/20">
                    <div className="flex items-center mb-2">
                      <Cpu className="h-5 w-5 mr-2 text-cyber-blue" />
                      <h3 className="text-lg font-light tracking-wider text-cyber-blue">MODEL INFORMATION</h3>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-sm mt-4">
                      <div className="font-medium text-muted-foreground">Parts:</div>
                      <div>{modelsData.length}</div>

                      <div className="font-medium text-muted-foreground">Total Volume:</div>
                      <div>{getAggregatedModelData().volume.toFixed(2)} cm³</div>

                      <div className="font-medium text-muted-foreground">Total Surface Area:</div>
                      <div>{getAggregatedModelData().surfaceArea.toFixed(2)} cm²</div>

                      <div className="font-medium text-muted-foreground">Total Triangle Count:</div>
                      <div>{getAggregatedModelData().triangleCount.toLocaleString()}</div>

                      <div className="font-medium text-muted-foreground">Est. Total Weight:</div>
                      <div>{getTotalWeight().toFixed(2)} g</div>

                      <div className="font-medium text-muted-foreground">Est. Print Time:</div>
                      <div>{getTotalPrintTime().toFixed(2)} hours</div>
                    </div>
                  </div>

                  {modelsData.length > 1 && (
                    <div className="mb-6 glass p-4 rounded-lg border border-cyber-blue/20">
                      <div className="flex items-center mb-2">
                        <Layers className="h-5 w-5 mr-2 text-cyber-blue" />
                        <h3 className="text-lg font-light tracking-wider text-cyber-blue">PARTS BREAKDOWN</h3>
                      </div>
                      <ScrollArea className="h-[150px] border border-cyber-blue/20 rounded-md p-2 mt-4">
                        <div className="space-y-2">
                          {modelsData.map((model, index) => (
                            <div
                              key={index}
                              className="flex justify-between items-center p-2 rounded hover:bg-cyber-blue/10 cursor-pointer"
                              onClick={() => setActiveModelIndex(index)}
                            >
                              <div className="flex items-center">
                                <div
                                  className="w-3 h-3 rounded-full mr-2 animate-pulse-slow"
                                  style={{ backgroundColor: model.color }}
                                ></div>
                                <span className="font-medium truncate max-w-[150px]">{model.fileName}</span>
                              </div>
                              <div className="text-sm text-muted-foreground">{model.volume.toFixed(2)} cm³</div>
                            </div>
                          ))}
                        </div>
                      </ScrollArea>
                    </div>
                  )}

                  <div className="mb-6 glass p-4 rounded-lg border border-cyber-blue/20">
                    <div className="flex items-center mb-2">
                      <BarChart3 className="h-5 w-5 mr-2 text-cyber-blue" />
                      <h3 className="text-lg font-light tracking-wider text-cyber-blue">PRINTING PARAMETERS</h3>
                    </div>
                    <div className="grid gap-4 mt-4">
                      <div className="grid gap-2">
                        <Label htmlFor="filament-type" className="text-muted-foreground">
                          Filament Type
                        </Label>
                        <Select value={formData.filamentType} onValueChange={handleFilamentChange}>
                          <SelectTrigger
                            id="filament-type"
                            className="border-cyber-blue/30 focus:border-cyber-blue focus:ring-cyber-blue/20"
                          >
                            <SelectValue placeholder="Select filament type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="PLA">PLA</SelectItem>
                            <SelectItem value="ABS">ABS</SelectItem>
                            <SelectItem value="PETG">PETG</SelectItem>
                            <SelectItem value="TPU">TPU</SelectItem>
                            <SelectItem value="Nylon">Nylon</SelectItem>
                            <SelectItem value="Resin">Resin</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="grid gap-2">
                        <Label htmlFor="cost-per-spool" className="text-muted-foreground">
                          Cost Per Spool (USD)
                        </Label>
                        <Input
                          id="cost-per-spool"
                          type="number"
                          min="0"
                          step="0.01"
                          value={formData.costPerSpool}
                          onChange={(e) => handleInputChange("costPerSpool", e.target.value)}
                          className="border-cyber-blue/30 focus:border-cyber-blue focus:ring-cyber-blue/20"
                        />
                      </div>

                      <div className="grid gap-2">
                        <Label htmlFor="spool-weight" className="text-muted-foreground">
                          Spool Weight (g)
                        </Label>
                        <Input
                          id="spool-weight"
                          type="number"
                          min="0"
                          step="1"
                          value={formData.spoolWeight}
                          onChange={(e) => handleInputChange("spoolWeight", e.target.value)}
                          className="border-cyber-blue/30 focus:border-cyber-blue focus:ring-cyber-blue/20"
                        />
                      </div>

                      <div className="grid gap-2">
                        <Label htmlFor="printer-hourly-rate" className="text-muted-foreground">
                          Printer Hourly Rate (USD)
                        </Label>
                        <Input
                          id="printer-hourly-rate"
                          type="number"
                          min="0"
                          step="0.01"
                          value={formData.printerHourlyRate}
                          onChange={(e) => handleInputChange("printerHourlyRate", e.target.value)}
                          className="border-cyber-blue/30 focus:border-cyber-blue focus:ring-cyber-blue/20"
                        />
                      </div>

                      <div className="grid gap-2">
                        <Label htmlFor="print-speed" className="text-muted-foreground">
                          Print Speed (cm³/hr)
                        </Label>
                        <Input
                          id="print-speed"
                          type="number"
                          min="0"
                          step="0.1"
                          value={formData.printSpeed}
                          onChange={(e) => handleInputChange("printSpeed", e.target.value)}
                          className="border-cyber-blue/30 focus:border-cyber-blue focus:ring-cyber-blue/20"
                        />
                      </div>

                      <div className="grid gap-2">
                        <Label htmlFor="other-costs" className="text-muted-foreground">
                          Other Costs (USD)
                        </Label>
                        <Input
                          id="other-costs"
                          type="number"
                          min="0"
                          step="0.01"
                          value={formData.otherCosts}
                          onChange={(e) => handleInputChange("otherCosts", e.target.value)}
                          className="border-cyber-blue/30 focus:border-cyber-blue focus:ring-cyber-blue/20"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="h-[500px] md:h-[600px] glass rounded-lg overflow-hidden border border-cyber-blue/20 flex items-center justify-center">
                  <div className="text-center p-6">
                    <div className="mb-4">
                      <div
                        className="w-16 h-16 rounded-full mx-auto animate-pulse-slow"
                        style={{ backgroundColor: modelsData[activeModelIndex]?.color || "#4299e1" }}
                      ></div>
                    </div>
                    <h3 className="text-xl font-medium text-cyber-blue mb-2">
                      {modelsData[activeModelIndex]?.fileName || "Demo Model"}
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      This is a demo visualization of your 3D model.
                      <br />
                      In the full version, you'll see an interactive 3D preview.
                    </p>
                    <div className="glass p-4 rounded-md text-left">
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div className="font-medium text-muted-foreground">Dimensions:</div>
                        <div>
                          {modelsData[activeModelIndex]?.dimensions.x.toFixed(1)} ×{" "}
                          {modelsData[activeModelIndex]?.dimensions.y.toFixed(1)} ×{" "}
                          {modelsData[activeModelIndex]?.dimensions.z.toFixed(1)} mm
                        </div>
                        <div className="font-medium text-muted-foreground">Volume:</div>
                        <div>{modelsData[activeModelIndex]?.volume.toFixed(2)} cm³</div>
                        <div className="font-medium text-muted-foreground">Surface Area:</div>
                        <div>{modelsData[activeModelIndex]?.surfaceArea.toFixed(2)} cm²</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="flex justify-end gap-2 mt-6">
              <Button
                variant="outline"
                onClick={() => setActiveTab("upload")}
                className="border-cyber-blue/30 text-cyber-blue hover:bg-cyber-blue/10"
              >
                Back
              </Button>
              <Button
                onClick={handleGenerateQuote}
                disabled={isGeneratingQuote}
                className="bg-cyber-blue hover:bg-cyber-blue/80 text-black btn-hover-effect"
              >
                {isGeneratingQuote ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  "Get Quote Suggestions"
                )}
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="quote" className="py-4">
            {quoteResult && (
              <div className="grid gap-6">
                <div className="glass border border-cyber-blue/20 rounded-lg p-6 text-center">
                  <h3 className="text-lg font-light tracking-wider text-cyber-blue mb-2">SUGGESTED PRICE RANGE</h3>
                  <p className="text-4xl font-bold bg-gradient-to-r from-cyber-blue to-cyber-purple bg-clip-text text-transparent">
                    ${quoteResult.priceRange.min.toFixed(2)} - ${quoteResult.priceRange.max.toFixed(2)}
                  </p>
                  <p className="text-sm text-muted-foreground mt-2">
                    For {modelsData.length} part{modelsData.length !== 1 ? "s" : ""} with a total volume of{" "}
                    {getAggregatedModelData().volume.toFixed(2)} cm³
                  </p>
                </div>

                {/* Market Comparison Section */}
                <div className="glass border border-cyber-blue/20 rounded-lg p-6">
                  <div className="flex items-center mb-4">
                    <BarChart3 className="h-5 w-5 mr-2 text-cyber-blue" />
                    <h3 className="text-lg font-light tracking-wider text-cyber-blue">MARKET COMPARISON</h3>
                  </div>

                  <div className="flex items-center mb-4">
                    <div className="mr-3">{getPricePositionIcon(quoteResult.marketComparison.pricePosition)}</div>
                    <div>
                      <p className="font-medium">
                        Your price is{" "}
                        <span className={getPricePositionColor(quoteResult.marketComparison.pricePosition)}>
                          {getPricePositionText(quoteResult.marketComparison.pricePosition)}
                        </span>
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Average market price: ${quoteResult.marketComparison.averageMarketPrice.toFixed(2)}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-muted-foreground">Low-end pricing</span>
                        <span>${quoteResult.marketComparison.competitorPrices.low.toFixed(2)}</span>
                      </div>
                      <Progress value={25} className="h-2 bg-cyber-blue/20 progress-glow" />
                    </div>

                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-muted-foreground">Average pricing</span>
                        <span>${quoteResult.marketComparison.competitorPrices.average.toFixed(2)}</span>
                      </div>
                      <Progress value={50} className="h-2 bg-cyber-blue/20 progress-glow" />
                    </div>

                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-muted-foreground">Premium pricing</span>
                        <span>${quoteResult.marketComparison.competitorPrices.high.toFixed(2)}</span>
                      </div>
                      <Progress value={75} className="h-2 bg-cyber-blue/20 progress-glow" />
                    </div>

                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-muted-foreground">Your suggested price (mid-range)</span>
                        <span className="text-cyber-blue">
                          ${((quoteResult.priceRange.min + quoteResult.priceRange.max) / 2).toFixed(2)}
                        </span>
                      </div>
                      <Progress
                        value={
                          ((quoteResult.priceRange.min + quoteResult.priceRange.max) /
                            2 /
                            quoteResult.marketComparison.competitorPrices.high) *
                          100
                        }
                        className="h-2 bg-cyber-blue/20 progress-glow"
                      />
                    </div>
                  </div>
                </div>

                <div className="glass border border-cyber-blue/20 rounded-lg p-6">
                  <div className="flex items-center mb-4">
                    <BarChart3 className="h-5 w-5 mr-2 text-cyber-blue" />
                    <h3 className="text-lg font-light tracking-wider text-cyber-blue">COST BREAKDOWN</h3>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Material Cost:</span>
                      <span>${quoteResult.breakdown.material.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Print Time Cost:</span>
                      <span>${quoteResult.breakdown.time.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Electricity:</span>
                      <span>${quoteResult.breakdown.electricity.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Other Costs:</span>
                      <span>${quoteResult.breakdown.other.toFixed(2)}</span>
                    </div>
                    <Separator className="my-2 bg-cyber-blue/20" />
                    <div className="flex justify-between font-medium">
                      <span className="text-cyber-blue">Profit Margin:</span>
                      <span className="text-cyber-blue">${quoteResult.breakdown.profit.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                <div className="glass border border-cyber-blue/20 rounded-lg p-6">
                  <div className="flex items-center mb-4">
                    <BarChart3 className="h-5 w-5 mr-2 text-cyber-blue" />
                    <h3 className="text-lg font-light tracking-wider text-cyber-blue">PRICING SUGGESTIONS</h3>
                  </div>
                  <ul className="list-disc list-inside space-y-1 text-sm">
                    {quoteResult.suggestions.map((suggestion: string, index: number) => (
                      <li key={index} className="text-muted-foreground">
                        {suggestion}
                      </li>
                    ))}
                  </ul>
                </div>

                <Alert className="glass border border-cyber-blue/20 bg-transparent">
                  <AlertCircle className="h-4 w-4 text-cyber-blue" />
                  <AlertTitle className="text-cyber-blue">Communication Tips</AlertTitle>
                  <AlertDescription>
                    <ul className="list-disc list-inside space-y-1 text-sm mt-2">
                      {quoteResult.communicationTips.map((tip: string, index: number) => (
                        <li key={index} className="text-muted-foreground">
                          {tip}
                        </li>
                      ))}
                    </ul>
                  </AlertDescription>
                </Alert>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
