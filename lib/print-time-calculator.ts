// Function to calculate print time based on model properties and print settings
export function calculatePrintTime(volume: number, layerHeight: number, printSpeed: number, infill: number): number {
  // Validate inputs to prevent NaN or Infinity results
  const safeVolume = Math.max(0.1, volume)
  const safeLayerHeight = Math.max(0.05, layerHeight)
  const safePrintSpeed = Math.max(10, printSpeed)
  const safeInfill = Math.min(100, Math.max(0, infill)) / 100

  // Convert infill from percentage to decimal
  const infillFactor = safeInfill

  // Base time calculation (in minutes)
  // This is a simplified model - real print time calculation is more complex
  // and depends on many factors including printer model, slicing software, etc.

  // Calculate approximate length of filament needed (in mm)
  // Assuming 1.75mm filament diameter
  const filamentCrossSectionArea = Math.PI * Math.pow(1.75 / 2, 2)
  const filamentVolume = safeVolume * infillFactor // cm³
  const filamentLength = (filamentVolume * 1000) / filamentCrossSectionArea // mm

  // Calculate time based on print speed and layer height
  const timeMinutes = (filamentLength / safePrintSpeed) * (0.2 / safeLayerHeight)

  // Add time for non-printing movements, layer changes, etc.
  const totalTimeMinutes = timeMinutes * 1.5

  // Ensure we return a reasonable value
  return Math.max(10, Math.round(totalTimeMinutes))
}
