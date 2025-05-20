"use client"

import { Download, Printer, Clock, TrendingUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import type { Quote } from "@/lib/supabase"
import { useState, useEffect } from "react"
import { getMaterials, getRegions, getFinishes } from "@/app/actions"

interface QuoteResultProps {
  quote: Quote
}

export function QuoteResult({ quote }: QuoteResultProps) {
  const [materialName, setMaterialName] = useState<string>("")
  const [finishName, setFinishName] = useState<string>("")
  const [regionName, setRegionName] = useState<string>("")
  const [marketTrend, setMarketTrend] = useState<string | null>(null)

  // Fetch related data
  useEffect(() => {
    async function fetchRelatedData() {
      try {
        const [materials, regions, finishes] = await Promise.all([getMaterials(), getRegions(), getFinishes()])

        const material = materials.find((m) => m.id === quote.material_id)
        const region = regions.find((r) => r.id === quote.region_id)
        const finish = finishes.find((f) => f.id === quote.finish_id)

        if (material) setMaterialName(material.name)
        if (region) setRegionName(region.name)
        if (finish) setFinishName(finish.name)

        // In a real app, we would fetch the market trend from the material_prices table
        setMarketTrend("Prices trending based on current market conditions")
      } catch (error) {
        console.error("Error fetching related data:", error)
      }
    }

    fetchRelatedData()
  }, [quote])

  const handleDownloadQuote = () => {
    // In a real app, this would generate a PDF or similar
    alert("Quote downloaded!")
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your 3D Print Quote</CardTitle>
        <CardDescription>AI-powered breakdown for {quote.file_name}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="rounded-lg bg-green-50 p-4 text-green-700">
          <p className="text-lg font-semibold">Total Price: ${quote.total_price.toFixed(2)}</p>
          <p className="text-sm">Quote Reference: {quote.quote_reference}</p>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Cost Breakdown</h3>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Item</TableHead>
                <TableHead className="text-right">Cost</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>Material ({materialName})</TableCell>
                <TableCell className="text-right">${quote.material_cost.toFixed(2)}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Labor</TableCell>
                <TableCell className="text-right">${quote.labor_cost.toFixed(2)}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Shipping</TableCell>
                <TableCell className="text-right">${quote.shipping_cost.toFixed(2)}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Service Fee</TableCell>
                <TableCell className="text-right">${quote.markup.toFixed(2)}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>

        {marketTrend && (
          <div className="flex items-center gap-2 rounded-lg bg-blue-50 p-4 text-blue-700">
            <TrendingUp className="h-5 w-5" />
            <div>
              <p className="font-semibold">Market Trends</p>
              <p className="text-sm">{marketTrend}</p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <h3 className="text-lg font-semibold">Print Details</h3>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="font-medium">Dimensions:</div>
              <div>
                {quote.dimensions.x.toFixed(2)} x {quote.dimensions.y.toFixed(2)} x {quote.dimensions.z.toFixed(2)} mm
              </div>

              <div className="font-medium">Volume:</div>
              <div>{quote.volume.toFixed(2)} cm³</div>

              <div className="font-medium">Weight:</div>
              <div>{quote.weight.toFixed(2)} g</div>

              <div className="font-medium">Material:</div>
              <div>{materialName}</div>

              <div className="font-medium">Finish:</div>
              <div>{finishName}</div>

              <div className="font-medium">Region:</div>
              <div>{regionName}</div>
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="text-lg font-semibold">AI-Recommended Print Settings</h3>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="font-medium">Layer Height:</div>
              <div>{quote.print_settings.layerHeight} mm</div>

              <div className="font-medium">Infill:</div>
              <div>{quote.print_settings.infill}%</div>

              <div className="font-medium">Print Speed:</div>
              <div>{quote.print_settings.printSpeed} mm/s</div>

              <div className="font-medium">Temperature:</div>
              <div>{quote.print_settings.temperature}°C</div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 rounded-lg bg-blue-50 p-4 text-blue-700">
          <Clock className="h-5 w-5" />
          <div>
            <p className="font-semibold">
              Print Time: {Math.floor(quote.print_time / 60)} hours {quote.print_time % 60} minutes
            </p>
            <p className="text-sm">
              Estimated delivery:{" "}
              {new Date(quote.estimated_delivery).toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col gap-4 sm:flex-row">
        <Button className="w-full" onClick={handleDownloadQuote}>
          <Download className="mr-2 h-4 w-4" />
          Download Quote
        </Button>
        <Button variant="outline" className="w-full">
          <Printer className="mr-2 h-4 w-4" />
          Print Quote
        </Button>
      </CardFooter>
    </Card>
  )
}
