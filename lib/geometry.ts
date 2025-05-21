// This file contains functions for geometry calculations

import { Vector3 } from "three"

interface Triangle {
  vertices: [
    { x: number; y: number; z: number },
    { x: number; y: number; z: number },
    { x: number; y: number; z: number },
  ]
  normal: { x: number; y: number; z: number }
}

// Calculate volume of a 3D model
export function calculateVolume(triangles: Triangle[]): number {
  let volume = 0

  for (const triangle of triangles) {
    // Convert to Vector3 for easier calculations
    const v1 = new Vector3(triangle.vertices[0].x, triangle.vertices[0].y, triangle.vertices[0].z)
    const v2 = new Vector3(triangle.vertices[1].x, triangle.vertices[1].y, triangle.vertices[1].z)
    const v3 = new Vector3(triangle.vertices[2].x, triangle.vertices[2].y, triangle.vertices[2].z)

    // Calculate signed volume of tetrahedron formed by triangle and origin
    const signedVolume = v1.dot(v2.cross(v3)) / 6.0
    volume += signedVolume
  }

  // Convert to cm³ (STL is typically in mm)
  return Math.abs(volume) / 1000
}

// Calculate surface area of a 3D model
export function calculateSurfaceArea(triangles: Triangle[]): number {
  let area = 0

  for (const triangle of triangles) {
    // Convert to Vector3 for easier calculations
    const v1 = new Vector3(triangle.vertices[0].x, triangle.vertices[0].y, triangle.vertices[0].z)
    const v2 = new Vector3(triangle.vertices[1].x, triangle.vertices[1].y, triangle.vertices[1].z)
    const v3 = new Vector3(triangle.vertices[2].x, triangle.vertices[2].y, triangle.vertices[2].z)

    // Calculate two edges of the triangle
    const edge1 = new Vector3().subVectors(v2, v1)
    const edge2 = new Vector3().subVectors(v3, v1)

    // Calculate the cross product to get the area
    const crossProduct = new Vector3().crossVectors(edge1, edge2)
    const triangleArea = crossProduct.length() / 2

    area += triangleArea
  }

  // Convert to cm² (STL is typically in mm)
  return area / 100
}
