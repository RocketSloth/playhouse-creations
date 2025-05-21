"use client"

import { useEffect, useRef, useState } from "react"
import { STLFallback } from "./stl-fallback"
import { Loader2 } from "lucide-react"

interface STLPreviewProps {
  file: File
}

export function STLPreview({ file }: STLPreviewProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!canvasRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) {
      setError("Canvas not supported in your browser")
      setIsLoading(false)
      return
    }

    const renderPreview = async () => {
      try {
        setIsLoading(true)
        setError(null)

        // Clear canvas
        ctx.fillStyle = "#f0f0f0"
        ctx.fillRect(0, 0, canvas.width, canvas.height)

        // Draw file info
        ctx.fillStyle = "#333"
        ctx.font = "16px sans-serif"
        ctx.textAlign = "center"
        ctx.fillText(file.name, canvas.width / 2, canvas.height / 2 - 20)

        ctx.font = "14px sans-serif"
        ctx.fillText(`Size: ${(file.size / 1024 / 1024).toFixed(2)} MB`, canvas.width / 2, canvas.height / 2 + 10)

        // Draw a simple 3D cube representation
        const centerX = canvas.width / 2
        const centerY = canvas.height / 2 + 50
        const size = 40

        // Draw cube faces
        ctx.fillStyle = "#3f51b5"
        ctx.beginPath()
        ctx.moveTo(centerX - size, centerY - size / 2)
        ctx.lineTo(centerX, centerY - size)
        ctx.lineTo(centerX + size, centerY - size / 2)
        ctx.lineTo(centerX, centerY)
        ctx.closePath()
        ctx.fill()

        ctx.fillStyle = "#5c6bc0"
        ctx.beginPath()
        ctx.moveTo(centerX + size, centerY - size / 2)
        ctx.lineTo(centerX, centerY)
        ctx.lineTo(centerX, centerY + size)
        ctx.lineTo(centerX + size, centerY + size / 2)
        ctx.closePath()
        ctx.fill()

        ctx.fillStyle = "#303f9f"
        ctx.beginPath()
        ctx.moveTo(centerX, centerY)
        ctx.lineTo(centerX - size, centerY - size / 2)
        ctx.lineTo(centerX - size, centerY + size / 2)
        ctx.lineTo(centerX, centerY + size)
        ctx.closePath()
        ctx.fill()

        // Add a note about 3D preview
        ctx.fillStyle = "#666"
        ctx.font = "12px sans-serif"
        ctx.fillText("3D preview simplified for compatibility", canvas.width / 2, canvas.height - 20)

        setIsLoading(false)
      } catch (err) {
        console.error("Error rendering preview:", err)
        setError("Failed to render preview")
        setIsLoading(false)
      }
    }

    renderPreview()
  }, [file])

  if (error) {
    return <STLFallback fileName={file.name} fileSize={file.size} error={error} />
  }

  return (
    <div className="w-full">
      <div className="w-full h-64 rounded-lg overflow-hidden bg-gray-100 relative">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
            <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
          </div>
        )}
        <canvas ref={canvasRef} width={400} height={256} className="w-full h-full" />
      </div>
    </div>
  )
}

export default STLPreview
