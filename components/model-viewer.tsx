"use client"

import { useEffect, useRef, useState } from "react"
import { Canvas } from "@react-three/fiber"
import { OrbitControls, Stage, Environment, Grid } from "@react-three/drei"
import { STLLoader } from "three/examples/jsm/loaders/STLLoader"
import type { Mesh, BufferGeometry } from "three"
import { Vector3 } from "three" // Import Vector3 directly
import { Loader2 } from "lucide-react"
import { useMediaQuery } from "@/hooks/use-media-query"

interface ModelViewerProps {
  file: File
  color?: string
}

function STLModel({ url, color = "#4299e1" }: { url: string; color?: string }) {
  const meshRef = useRef<Mesh>(null)
  const [geometry, setGeometry] = useState<BufferGeometry | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loader = new STLLoader()

    loader.load(
      url,
      (geometry) => {
        try {
          // Center the geometry
          geometry.computeBoundingBox()
          const center = new Vector3()
          if (geometry.boundingBox) {
            geometry.boundingBox.getCenter(center)
            geometry.center()
          }

          // Normalize the size
          geometry.computeBoundingSphere()
          if (geometry.boundingSphere) {
            const radius = geometry.boundingSphere.radius
            const scale = 10 / radius // Scale to a reasonable size
            geometry.scale(scale, scale, scale)
          }

          setGeometry(geometry)
          setLoading(false)
        } catch (err) {
          console.error("Error processing STL geometry:", err)
          setError("Failed to process 3D model")
          setLoading(false)
        }
      },
      (progressEvent) => {
        // Progress callback
        console.log(`Loading progress: ${Math.round((progressEvent.loaded / progressEvent.total) * 100)}%`)
      },
      (err) => {
        console.error("Error loading STL:", err)
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
  const isMobile = useMediaQuery("(max-width: 768px)")

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

  useEffect(() => {
    const handleResize = () => {
      // Force a re-render when window is resized
      if (objectUrl) {
        const url = objectUrl
        setObjectUrl(null)
        // Small delay to ensure the state update is processed
        setTimeout(() => {
          setObjectUrl(url)
        }, 10)
      }
    }

    // Add resize listener
    window.addEventListener("resize", handleResize)

    // Clean up
    return () => {
      window.removeEventListener("resize", handleResize)
    }
  }, [objectUrl])

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
        <Canvas
          camera={{
            position: isMobile ? [20, 20, 20] : [15, 15, 15],
            fov: isMobile ? 60 : 50,
          }}
          className="w-full h-full"
          dpr={[1, 2]} // Optimize for different device pixel ratios
        >
          <color attach="background" args={["#0f172a"]} />
          <fog attach="fog" args={["#0f172a", 30, 100]} />

          <Environment preset="night" />

          <Stage
            environment="night"
            intensity={0.5}
            contactShadow
            shadows
            adjustCamera={true} // Automatically adjust camera to fit the model
            preset="rembrandt"
          >
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

          <OrbitControls
            autoRotate
            autoRotateSpeed={isMobile ? 0.5 : 1}
            enableZoom={true}
            enablePan={true}
            minDistance={5}
            maxDistance={50}
            makeDefault
          />
        </Canvas>
      ) : (
        <div className="h-full flex items-center justify-center text-muted-foreground">
          <p>No model available</p>
        </div>
      )}
    </div>
  )
}
