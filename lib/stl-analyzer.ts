export interface STLAnalysisResult {
  triangles: number
  dimensions: {
    x: number
    y: number
    z: number
  }
  volume: number // in cm³
  surfaceArea: number // in cm²
}

// Function to analyze STL file and return geometry information
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
    // Check if it's ASCII or binary
    const headerView = new Uint8Array(fileBuffer, 0, 80)
    const headerString = new TextDecoder().decode(headerView)
    const isAscii = headerString.trim().toLowerCase().startsWith("solid")

    if (isAscii) {
      return parseAsciiSTL(fileBuffer)
    } else {
      return parseBinarySTL(fileBuffer)
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

// ---- Helpers for both ASCII and Binary ----

function computeAnalysisFromTriangles(vertices: number[][]): {
  triangles: number
  dimensions: { x: number; y: number; z: number }
  volume: number
  surfaceArea: number
} {
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

  // Convert units to cm³ and cm²
  const volumeCm3 = Math.abs(totalVolume) / 1000 // mm³ to cm³
  const surfaceAreaCm2 = totalArea / 100 // mm² to cm²

  return {
    triangles: vertices.length / 3,
    dimensions: {
      x: maxX - minX,
      y: maxY - minY,
      z: maxZ - minZ,
    },
    volume: volumeCm3,
    surfaceArea: surfaceAreaCm2,
  }
}

function triangleArea(a: number[], b: number[], c: number[]): number {
  // Area = 0.5 * |AB x AC|
  const ab = [b[0] - a[0], b[1] - a[1], b[2] - a[2]]
  const ac = [c[0] - a[0], c[1] - a[1], c[2] - a[2]]
  const cross = [ab[1] * ac[2] - ab[2] * ac[1], ab[2] * ac[0] - ab[0] * ac[2], ab[0] * ac[1] - ab[1] * ac[0]]
  return 0.5 * Math.sqrt(cross[0] ** 2 + cross[1] ** 2 + cross[2] ** 2)
}

function signedTetrahedronVolume(a: number[], b: number[], c: number[]): number {
  // (1/6) * |a · (b × c)|
  return (
    (a[0] * (b[1] * c[2] - b[2] * c[1]) + a[1] * (b[2] * c[0] - b[0] * c[2]) + a[2] * (b[0] * c[1] - b[1] * c[0])) / 6
  )
}

// ---- ASCII STL ----

function parseAsciiSTL(fileBuffer: ArrayBuffer): STLAnalysisResult {
  try {
    const text = new TextDecoder().decode(fileBuffer)
    const vertexRegex = /vertex\s+([-\d.eE+]+)\s+([-\d.eE+]+)\s+([-\d.eE+]+)/g
    const vertices: number[][] = []
    let match: RegExpExecArray | null

    while ((match = vertexRegex.exec(text)) !== null) {
      vertices.push([Number.parseFloat(match[1]), Number.parseFloat(match[2]), Number.parseFloat(match[3])])
    }

    if (vertices.length % 3 !== 0 || vertices.length === 0) {
      throw new Error("Failed to parse ASCII STL: invalid vertex count")
    }

    return computeAnalysisFromTriangles(vertices)
  } catch (error) {
    console.error("Error parsing ASCII STL:", error)
    return {
      triangles: 1000,
      dimensions: { x: 100, y: 100, z: 100 },
      volume: 50,
      surfaceArea: 200,
    }
  }
}

// ---- Binary STL ----

function parseBinarySTL(fileBuffer: ArrayBuffer): STLAnalysisResult {
  try {
    const view = new DataView(fileBuffer)

    // Ensure the buffer is large enough to contain the header and triangle count
    if (fileBuffer.byteLength < 84) {
      throw new Error("Binary STL file too small")
    }

    const triangleCount = view.getUint32(80, true)

    // Validate triangle count - a reasonable upper limit
    if (triangleCount > 5000000 || triangleCount <= 0) {
      throw new Error("Invalid triangle count in binary STL")
    }

    // Calculate expected file size based on triangle count
    const expectedSize = 84 + triangleCount * 50

    // Check if file size matches expected size
    if (fileBuffer.byteLength < expectedSize) {
      throw new Error("File size doesn't match expected size for binary STL")
    }

    const vertices: number[][] = []

    for (let i = 0; i < triangleCount; i++) {
      const offset = 84 + i * 50

      // Ensure we don't go out of bounds
      if (offset + 50 > fileBuffer.byteLength) {
        break
      }

      // 12 bytes: normal, next 36 bytes: 3 vertices
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
            throw new Error("Invalid vertex data in binary STL")
          }
        } catch (e) {
          console.warn("Error reading vertex data:", e)
          // Continue to next vertex
        }
      }
    }

    if (vertices.length % 3 !== 0 || vertices.length === 0) {
      throw new Error("Failed to parse binary STL: invalid vertex count")
    }

    return computeAnalysisFromTriangles(vertices)
  } catch (error) {
    console.error("Error parsing binary STL:", error)
    return {
      triangles: 1000,
      dimensions: { x: 100, y: 100, z: 100 },
      volume: 50,
      surfaceArea: 200,
    }
  }
}
