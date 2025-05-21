// This file handles parsing STL files and extracting model data

interface Vector3 {
  x: number
  y: number
  z: number
}

interface Triangle {
  vertices: [Vector3, Vector3, Vector3]
  normal: Vector3
}

interface STLParseResult {
  triangles: Triangle[]
  dimensions: {
    min: Vector3
    max: Vector3
  }
}

export async function parseSTL(file: File): Promise<STLParseResult> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()

    reader.onload = (event) => {
      try {
        const buffer = event.target?.result as ArrayBuffer

        // Check if binary or ASCII STL
        const isBinary = isSTLBinary(buffer)

        const triangles = isBinary ? parseBinarySTL(buffer) : parseASCIISTL(new TextDecoder().decode(buffer))

        // Calculate model dimensions
        const dimensions = calculateDimensions(triangles)

        resolve({
          triangles,
          dimensions,
        })
      } catch (error) {
        reject(error)
      }
    }

    reader.onerror = () => {
      reject(new Error("Error reading file"))
    }

    reader.readAsArrayBuffer(file)
  })
}

// Check if STL is binary format
function isSTLBinary(buffer: ArrayBuffer): boolean {
  // Binary STL files have a specific size pattern
  const fileSize = buffer.byteLength

  // ASCII files start with "solid"
  const header = new Uint8Array(buffer, 0, 5)
  const headerStr = new TextDecoder().decode(header).toLowerCase()

  if (headerStr.startsWith("solid")) {
    // Further check to avoid false positives
    // Some binary STLs might accidentally start with "solid"
    const possibleASCII = new TextDecoder().decode(new Uint8Array(buffer))
    return !possibleASCII.includes("facet") || !possibleASCII.includes("endsolid")
  }

  return true
}

// Parse binary STL format
function parseBinarySTL(buffer: ArrayBuffer): Triangle[] {
  const triangles: Triangle[] = []
  const view = new DataView(buffer)

  // Skip header (80 bytes) and read number of triangles (4 bytes)
  const triangleCount = view.getUint32(80, true)

  // Each triangle is 50 bytes: normal (3 floats), vertices (9 floats), attribute (2 bytes)
  for (let i = 0; i < triangleCount; i++) {
    const offset = 84 + i * 50

    // Read normal
    const normal: Vector3 = {
      x: view.getFloat32(offset, true),
      y: view.getFloat32(offset + 4, true),
      z: view.getFloat32(offset + 8, true),
    }

    // Read vertices
    const vertices: [Vector3, Vector3, Vector3] = [
      {
        x: view.getFloat32(offset + 12, true),
        y: view.getFloat32(offset + 16, true),
        z: view.getFloat32(offset + 20, true),
      },
      {
        x: view.getFloat32(offset + 24, true),
        y: view.getFloat32(offset + 28, true),
        z: view.getFloat32(offset + 32, true),
      },
      {
        x: view.getFloat32(offset + 36, true),
        y: view.getFloat32(offset + 40, true),
        z: view.getFloat32(offset + 44, true),
      },
    ]

    triangles.push({ normal, vertices })
  }

  return triangles
}

// Parse ASCII STL format
function parseASCIISTL(data: string): Triangle[] {
  const triangles: Triangle[] = []
  const lines = data.split("\n")

  let currentNormal: Vector3 = { x: 0, y: 0, z: 0 }
  let currentVertices: Vector3[] = []

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim()

    if (line.startsWith("facet normal ")) {
      // Parse normal
      const parts = line.split(" ").filter((p) => p.trim().length > 0)
      currentNormal = {
        x: Number.parseFloat(parts[2]),
        y: Number.parseFloat(parts[3]),
        z: Number.parseFloat(parts[4]),
      }
      currentVertices = []
    } else if (line.startsWith("vertex ")) {
      // Parse vertex
      const parts = line.split(" ").filter((p) => p.trim().length > 0)
      currentVertices.push({
        x: Number.parseFloat(parts[1]),
        y: Number.parseFloat(parts[2]),
        z: Number.parseFloat(parts[3]),
      })
    } else if (line.startsWith("endfacet") && currentVertices.length === 3) {
      // End of facet, add triangle
      triangles.push({
        normal: currentNormal,
        vertices: [currentVertices[0], currentVertices[1], currentVertices[2]] as [Vector3, Vector3, Vector3],
      })
    }
  }

  return triangles
}

// Calculate model dimensions
function calculateDimensions(triangles: Triangle[]): { min: Vector3; max: Vector3 } {
  if (triangles.length === 0) {
    return {
      min: { x: 0, y: 0, z: 0 },
      max: { x: 0, y: 0, z: 0 },
    }
  }

  const min: Vector3 = {
    x: Number.POSITIVE_INFINITY,
    y: Number.POSITIVE_INFINITY,
    z: Number.POSITIVE_INFINITY,
  }

  const max: Vector3 = {
    x: Number.NEGATIVE_INFINITY,
    y: Number.NEGATIVE_INFINITY,
    z: Number.NEGATIVE_INFINITY,
  }

  // Iterate through all vertices to find min/max
  triangles.forEach((triangle) => {
    triangle.vertices.forEach((vertex) => {
      min.x = Math.min(min.x, vertex.x)
      min.y = Math.min(min.y, vertex.y)
      min.z = Math.min(min.z, vertex.z)

      max.x = Math.max(max.x, vertex.x)
      max.y = Math.max(max.y, vertex.y)
      max.z = Math.max(max.z, vertex.z)
    })
  })

  return { min, max }
}
