"use client"

import { useEffect, useRef, useState } from "react"
import { Canvas } from "@react-three/fiber"
import { OrbitControls, Stage, Environment, Grid } from "@react-three/drei"
import { STLLoader } from "three/examples/jsm/loaders/STLLoader"
import type { Mesh } from "three"
import { Loader2 } from "lucide-react"
import type * as THREE from "three"

interface ModelViewerProps {
  file: File
  color?: string
}

function STLModel({ url, color = "#4299e1" }: { url: string; color?: string }) {
  const meshRef = useRef<Mesh>(null)
  const [geometry, setGeometry] = useState<THREE.BufferGeometry | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loader = new STLLoader()

    loader.load(
      url,
      (geometry) => {
        setGeometry(geometry)
        setLoading(false)
      },
      undefined,
      (error) => {
        console.error("Error loading STL:", error)
        setError("Failed to load 3D model")
        setLoading(false)
      },
    )
  }, [url])

  if (loading) {
    return null
  }

  if (error) {
    return (
      <mesh ref={meshRef}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="red" />
      </mesh>
    )
  }

  return (
    <mesh ref={meshRef}>
      {geometry && <primitive object={geometry} attach="geometry" />}
      <meshStandardMaterial color={color} roughness={0.3} metalness={0.7} emissive={color} emissiveIntensity={0.2} />
    </mesh>
  )
}

export default function ModelViewer({ file, color }: ModelViewerProps) {
  const [objectUrl, setObjectUrl] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (file) {
      const url = URL.createObjectURL(file)
      setObjectUrl(url)
      setLoading(false)

      return () => {
        URL.revokeObjectURL(url)
      }
    }
  }, [file])

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="animate-pulse-slow">
          <Loader2 className="h-8 w-8 animate-spin text-cyber-blue" />
          <p className="mt-2 text-sm text-muted-foreground">Loading model...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="h-full w-full rounded-lg overflow-hidden glass">
      {objectUrl ? (
        <Canvas camera={{ position: [0, 0, 100], fov: 50 }}>
          <color attach="background" args={["#0f172a"]} />
          <fog attach="fog" args={["#0f172a", 30, 100]} />

          <Environment preset="night" />

          <Stage environment="night" intensity={0.5} contactShadow shadows>
            <STLModel url={objectUrl} color={color} />
          </Stage>

          <Grid
            position={[0, -10, 0]}
            args={[100, 100]}
            cellSize={1}
            cellThickness={0.6}
            cellColor="#4299e1"
            sectionSize={5}
            sectionThickness={1.2}
            sectionColor="#9f7aea"
            fadeDistance={50}
            fadeStrength={1}
          />

          <OrbitControls autoRotate autoRotateSpeed={1} makeDefault />
        </Canvas>
      ) : (
        <div className="h-full flex items-center justify-center text-muted-foreground">
          <p>No model available</p>
        </div>
      )}
    </div>
  )
}
