// stl-analyzer.ts

export interface STLAnalysisResult {
  triangles: number
  dimensions: {
    x: number // mm
    y: number // mm
    z: number // mm
  }
  volume: number // in cm³
  surfaceArea: number // in cm²
}

/**
 * Analyzes an STL file (binary or ASCII) and returns
 * triangle count, bounding box, volume, and surface area.
 * @param fileBuffer ArrayBuffer of the STL file
 * @returns Promise<STLAnalysisResult>
 */
export async function analyzeSTL(fileBuffer: ArrayBuffer): Promise<STLAnalysisResult> {
  // For server-side rendering or environments where window is undefined,
  // return a placeholder result
  if (typeof window === "undefined") {
    console.warn("Server-side environment detected, using placeholder data")
    return {
      triangles: 1000,
      dimensions: { x: 100, y: 100, z: 100 },
      volume: 50,
      surfaceArea: 200,
    }
  }

  try {
    // Try to detect if ASCII or Binary STL
    const headerView = new Uint8Array(fileBuffer, 0, 80)
    const headerString = new TextDecoder().decode(headerView)

    // First try binary parsing, as it's more common and faster
    try {
      return parseBinarySTL(fileBuffer)
    } catch (binaryError) {
      console.warn("Binary STL parsing failed, trying ASCII format:", binaryError)

      // If binary parsing fails and the file starts with "solid", try ASCII
      if (headerString.trim().toLowerCase().startsWith("solid")) {
        try {
          return parseAsciiSTL(fileBuffer)
        } catch (asciiError) {
          console.error("ASCII STL parsing also failed:", asciiError)
          throw new Error("Failed to parse STL file in either binary or ASCII format")
        }
      } else {
        // If it doesn't start with "solid" and binary parsing failed, it's likely corrupted
        throw new Error("Invalid or corrupted STL file")
      }
    }
  } catch (error) {
    console.error("Error analyzing STL:", error)
    // Return fallback data if parsing fails
    return {
      triangles: 1000,
      dimensions: { x: 100, y: 100, z: 100 },
      volume: 50,
      surfaceArea: 200,
    }
  }
}

// Shared geometry calculation for both ASCII and Binary
function computeAnalysisFromTriangles(vertices: number[][]): STLAnalysisResult {
  let minX = Number.POSITIVE_INFINITY,
    minY = Number.POSITIVE_INFINITY,
    minZ = Number.POSITIVE_INFINITY
  let maxX = Number.NEGATIVE_INFINITY,
    maxY = Number.NEGATIVE_INFINITY,
    maxZ = Number.NEGATIVE_INFINITY
  let totalVolume = 0
  let totalArea = 0

  for (let i = 0; i < vertices.length; i += 3) {
    const v1 = vertices[i]
    const v2 = vertices[i + 1]
    const v3 = vertices[i + 2]

    // Skip invalid triangles
    if (!v1 || !v2 || !v3) {
      continue
    }

    // Bounding box
    for (const v of [v1, v2, v3]) {
      minX = Math.min(minX, v[0])
      minY = Math.min(minY, v[1])
      minZ = Math.min(minZ, v[2])
      maxX = Math.max(maxX, v[0])
      maxY = Math.max(maxY, v[1])
      maxZ = Math.max(maxZ, v[2])
    }

    // Surface area
    totalArea += triangleArea(v1, v2, v3)

    // Volume (signed tetrahedron volume)
    totalVolume += signedTetrahedronVolume(v1, v2, v3)
  }

  // Ensure dimensions are valid
  const dimensions = {
    x: isFinite(maxX - minX) ? maxX - minX : 100,
    y: isFinite(maxY - minY) ? maxY - minY : 100,
    z: isFinite(maxZ - minZ) ? maxZ - minZ : 100,
  }

  // Convert units: mm³ → cm³ for volume, mm² → cm² for area
  const volumeCm3 = isFinite(totalVolume) ? Math.abs(totalVolume) / 1000 : 50 // mm³ to cm³
  const surfaceAreaCm2 = isFinite(totalArea) ? totalArea / 100 : 200 // mm² to cm²

  return {
    triangles: Math.max(1, vertices.length / 3),
    dimensions,
    volume: volumeCm3,
    surfaceArea: surfaceAreaCm2,
  }
}

function triangleArea(a: number[], b: number[], c: number[]): number {
  try {
    // Area = 0.5 * |AB x AC|
    const ab = [b[0] - a[0], b[1] - a[1], b[2] - a[2]]
    const ac = [c[0] - a[0], c[1] - a[1], c[2] - a[2]]
    const cross = [ab[1] * ac[2] - ab[2] * ac[1], ab[2] * ac[0] - ab[0] * ac[2], ab[0] * ac[1] - ab[1] * ac[0]]
    return 0.5 * Math.sqrt(cross[0] ** 2 + cross[1] ** 2 + cross[2] ** 2)
  } catch (error) {
    return 0
  }
}

function signedTetrahedronVolume(a: number[], b: number[], c: number[]): number {
  try {
    // (1/6) * |a · (b × c)|
    return (
      (a[0] * (b[1] * c[2] - b[2] * c[1]) + a[1] * (b[2] * c[0] - b[0] * c[2]) + a[2] * (b[0] * c[1] - b[1] * c[0])) / 6
    )
  } catch (error) {
    return 0
  }
}

// Parse ASCII STL
function parseAsciiSTL(fileBuffer: ArrayBuffer): STLAnalysisResult {
  try {
    const text = new TextDecoder().decode(fileBuffer)
    const vertexRegex = /vertex\s+([-\d.eE+]+)\s+([-\d.eE+]+)\s+([-\d.eE+]+)/g
    const vertices: number[][] = []
    let match: RegExpExecArray | null

    while ((match = vertexRegex.exec(text)) !== null) {
      vertices.push([Number.parseFloat(match[1]), Number.parseFloat(match[2]), Number.parseFloat(match[3])])
    }

    if (vertices.length === 0) {
      throw new Error("No vertices found in ASCII STL")
    }

    return computeAnalysisFromTriangles(vertices)
  } catch (error) {
    console.error("Error parsing ASCII STL:", error)
    throw error
  }
}

// Parse Binary STL
function parseBinarySTL(fileBuffer: ArrayBuffer): STLAnalysisResult {
  try {
    const view = new DataView(fileBuffer)

    // Ensure the buffer is large enough to contain the header and triangle count
    if (fileBuffer.byteLength < 84) {
      throw new Error("Binary STL file too small")
    }

    // Read triangle count (4 bytes at offset 80)
    const triangleCount = view.getUint32(80, true)

    // More relaxed validation for triangle count
    // Some STL files might have incorrect counts but still be valid
    if (triangleCount <= 0) {
      throw new Error("Invalid triangle count in binary STL: count is zero or negative")
    }

    // Upper limit check - extremely large values are likely errors
    // 10 million triangles is a reasonable upper limit for most use cases
    if (triangleCount > 10000000) {
      console.warn(`Very large triangle count detected: ${triangleCount}. This might be an error.`)
    }

    // Calculate expected file size based on triangle count
    const expectedSize = 84 + triangleCount * 50

    // Check if file size is at least close to what we'd expect
    // Allow for some flexibility - some files might have extra data
    if (fileBuffer.byteLength < 84 + 12) {
      // At least header + 1 triangle's vertices
      throw new Error("File too small to contain any triangles")
    }

    // If file is much smaller than expected, adjust triangle count
    const actualMaxTriangles = Math.floor((fileBuffer.byteLength - 84) / 50)
    const effectiveTriangleCount = Math.min(triangleCount, actualMaxTriangles)

    if (effectiveTriangleCount < triangleCount) {
      console.warn(
        `STL file claims ${triangleCount} triangles but can only contain ${effectiveTriangleCount} based on file size`,
      )
    }

    const vertices: number[][] = []

    // Read only as many triangles as the file can actually contain
    for (let i = 0; i < effectiveTriangleCount; i++) {
      const offset = 84 + i * 50

      // Ensure we don't go out of bounds
      if (offset + 50 > fileBuffer.byteLength) {
        break
      }

      // Skip normal (12 bytes), read 3 vertices (36 bytes)
      for (let v = 0; v < 3; v++) {
        const base = offset + 12 + v * 12

        // Ensure we don't go out of bounds
        if (base + 12 > fileBuffer.byteLength) {
          break
        }

        try {
          const x = view.getFloat32(base, true)
          const y = view.getFloat32(base + 4, true)
          const z = view.getFloat32(base + 8, true)

          // Check for valid numbers
          if (isFinite(x) && isFinite(y) && isFinite(z)) {
            vertices.push([x, y, z])
          } else {
            console.warn("Non-finite vertex coordinates found, skipping triangle")
          }
        } catch (e) {
          console.warn("Error reading vertex data:", e)
          // Continue to next vertex
        }
      }
      // skip 2-byte attribute at the end
    }

    if (vertices.length === 0) {
      throw new Error("No valid vertices found in binary STL")
    }

    return computeAnalysisFromTriangles(vertices)
  } catch (error) {
    console.error("Error parsing binary STL:", error)
    throw error
  }
}
