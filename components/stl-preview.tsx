"use client"

import { useEffect, useRef, useState } from "react"
import { STLFallback } from "./stl-fallback"
import Script from "next/script"

interface STLPreviewProps {
  file: File
}

export function STLPreview({ file }: STLPreviewProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [scriptsLoaded, setScriptsLoaded] = useState(false)

  // Load THREE.js scripts
  useEffect(() => {
    if (scriptsLoaded && containerRef.current && file) {
      try {
        // Clear any existing content
        containerRef.current.innerHTML = ""

        // Create a canvas element
        const canvas = document.createElement("canvas")
        canvas.style.width = "100%"
        canvas.style.height = "100%"
        containerRef.current.appendChild(canvas)

        // Access the global THREE object
        const THREE = window.THREE
        if (!THREE) {
          throw new Error("THREE.js not loaded")
        }

        // Create scene
        const scene = new THREE.Scene()
        scene.background = new THREE.Color(0xf0f0f0)

        // Create camera
        const camera = new THREE.PerspectiveCamera(
          75,
          containerRef.current.clientWidth / containerRef.current.clientHeight,
          0.1,
          1000,
        )
        camera.position.z = 200

        // Create renderer
        const renderer = new THREE.WebGLRenderer({
          canvas: canvas,
          antialias: true,
        })
        renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight)

        // Add lights
        const ambientLight = new THREE.AmbientLight(0x404040, 1.5)
        scene.add(ambientLight)

        const directionalLight = new THREE.DirectionalLight(0xffffff, 1)
        directionalLight.position.set(1, 1, 1)
        scene.add(directionalLight)

        const directionalLight2 = new THREE.DirectionalLight(0xffffff, 1)
        directionalLight2.position.set(-1, -1, -1)
        scene.add(directionalLight2)

        // Add controls
        const controls = new THREE.OrbitControls(camera, renderer.domElement)
        controls.enableDamping = true
        controls.dampingFactor = 0.25

        // Load STL file
        const reader = new FileReader()
        reader.onload = (e) => {
          if (e.target?.result) {
            try {
              const loader = new THREE.STLLoader()
              const geometry = loader.parse(e.target.result as ArrayBuffer)

              // Center the geometry
              geometry.computeBoundingBox()
              const center = new THREE.Vector3()
              geometry.boundingBox.getCenter(center)
              geometry.center()

              // Scale the geometry to fit the view
              geometry.computeBoundingSphere()
              const radius = geometry.boundingSphere.radius
              const scale = 100 / radius

              // Create material
              const material = new THREE.MeshPhongMaterial({
                color: 0x3f51b5,
                specular: 0x111111,
                shininess: 200,
              })

              // Create mesh
              const mesh = new THREE.Mesh(geometry, material)
              mesh.scale.set(scale, scale, scale)
              mesh.rotation.x = -Math.PI / 2 // Rotate to correct orientation
              scene.add(mesh)

              // Adjust camera position
              camera.position.z = radius * 3
              controls.update()

              setIsLoading(false)
            } catch (err) {
              console.error("Error parsing STL:", err)
              setError("Failed to parse the STL file. The file may be corrupted or in an unsupported format.")
              setIsLoading(false)
            }
          }
        }
        reader.onerror = () => {
          setError("Failed to read the file.")
          setIsLoading(false)
        }
        reader.readAsArrayBuffer(file)

        // Animation loop
        const animate = () => {
          requestAnimationFrame(animate)
          controls.update()
          renderer.render(scene, camera)
        }
        animate()

        // Handle window resize
        const handleResize = () => {
          if (!containerRef.current) return

          camera.aspect = containerRef.current.clientWidth / containerRef.current.clientHeight
          camera.updateProjectionMatrix()
          renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight)
        }
        window.addEventListener("resize", handleResize)

        // Return cleanup function
        return () => {
          window.removeEventListener("resize", handleResize)
          renderer.dispose()
          scene.clear()
        }
      } catch (err) {
        console.error("Error rendering STL:", err)
        setError("Failed to render 3D model. Please try again later.")
        setIsLoading(false)
      }
    }
  }, [file, scriptsLoaded])

  // Handle script loading errors
  const handleScriptError = () => {
    console.error("Failed to load THREE.js scripts")
    setError("Failed to load 3D viewer. Please try again later.")
    setIsLoading(false)
  }

  if (error) {
    return <STLFallback fileName={file.name} fileSize={file.size} error={error} />
  }

  return (
    <div className="w-full">
      {/* Load THREE.js scripts */}
      <Script
        src="https://cdnjs.cloudflare.com/ajax/libs/three.js/0.159.0/three.min.js"
        onLoad={() => console.log("THREE.js loaded")}
        onError={handleScriptError}
      />
      <Script
        src="https://cdn.jsdelivr.net/npm/three@0.159.0/examples/js/loaders/STLLoader.js"
        onLoad={() => console.log("STLLoader loaded")}
        onError={handleScriptError}
      />
      <Script
        src="https://cdn.jsdelivr.net/npm/three@0.159.0/examples/js/controls/OrbitControls.js"
        onLoad={() => {
          console.log("OrbitControls loaded")
          setScriptsLoaded(true)
        }}
        onError={handleScriptError}
      />

      <div ref={containerRef} className="w-full h-64 rounded-lg overflow-hidden bg-gray-100">
        {isLoading && (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-500">Loading 3D preview...</p>
          </div>
        )}
      </div>
    </div>
  )
}

// Add type definitions for global THREE objects
declare global {
  interface Window {
    THREE: any
  }
}

export default STLPreview
