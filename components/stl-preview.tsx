"use client"

import { useEffect, useRef, useState } from "react"
import Script from "next/script"

interface STLPreviewProps {
  file: File
}

export function STLPreview({ file }: STLPreviewProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [scriptsLoaded, setScriptsLoaded] = useState(false)

  // Handle STL rendering after scripts are loaded
  useEffect(() => {
    if (!containerRef.current || !scriptsLoaded) return

    let cleanup: (() => void) | undefined

    const loadSTL = async () => {
      try {
        setIsLoading(true)
        setError(null)

        // Access the global THREE object
        const THREE = window.THREE
        const STLLoader = window.STLLoader
        const OrbitControls = window.OrbitControls

        if (!THREE || !STLLoader || !OrbitControls) {
          throw new Error("THREE.js libraries not loaded properly")
        }

        // Create scene
        const scene = new THREE.Scene()
        scene.background = new THREE.Color(0xf0f0f0)

        // Create camera
        const camera = new THREE.PerspectiveCamera(
          75,
          containerRef.current!.clientWidth / containerRef.current!.clientHeight,
          0.1,
          1000,
        )
        camera.position.z = 200

        // Create renderer
        const renderer = new THREE.WebGLRenderer({ antialias: true })
        renderer.setSize(containerRef.current!.clientWidth, containerRef.current!.clientHeight)
        containerRef.current!.appendChild(renderer.domElement)

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
        const controls = new OrbitControls(camera, renderer.domElement)
        controls.enableDamping = true
        controls.dampingFactor = 0.25

        // Load STL file
        const reader = new FileReader()
        reader.onload = (e) => {
          if (e.target?.result) {
            try {
              const loader = new STLLoader()
              const geometry = loader.parse(e.target.result as ArrayBuffer)

              // Center the geometry
              geometry.computeBoundingBox()
              const center = new THREE.Vector3()
              geometry.boundingBox!.getCenter(center)
              geometry.center()

              // Scale the geometry to fit the view
              geometry.computeBoundingSphere()
              const radius = geometry.boundingSphere!.radius
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

        // Cleanup function
        cleanup = () => {
          window.removeEventListener("resize", handleResize)
          if (containerRef.current && renderer.domElement) {
            containerRef.current.removeChild(renderer.domElement)
          }
        }
      } catch (err) {
        console.error("Error loading THREE.js:", err)
        setError("Failed to load 3D viewer. Please try again later.")
        setIsLoading(false)
      }
    }

    loadSTL()

    // Cleanup on unmount
    return () => {
      if (cleanup) cleanup()
    }
  }, [file, scriptsLoaded])

  return (
    <div className="w-full">
      {/* Load THREE.js scripts from CDN */}
      <Script
        src="https://cdn.jsdelivr.net/npm/three@0.159.0/build/three.min.js"
        onLoad={() => {
          window.THREE = window.THREE || (window as any).THREE
        }}
      />
      <Script
        src="https://cdn.jsdelivr.net/npm/three@0.159.0/examples/jsm/loaders/STLLoader.js"
        onLoad={() => {
          if (typeof window !== "undefined") {
            // Extract STLLoader from module format to global
            const module = { exports: {} }
            window.THREE = window.THREE || {}
            window.STLLoader = window.STLLoader || THREE.STLLoader
          }
        }}
      />
      <Script
        src="https://cdn.jsdelivr.net/npm/three@0.159.0/examples/jsm/controls/OrbitControls.js"
        onLoad={() => {
          if (typeof window !== "undefined") {
            // Extract OrbitControls from module format to global
            const module = { exports: {} }
            window.THREE = window.THREE || {}
            window.OrbitControls = window.OrbitControls || THREE.OrbitControls
            setScriptsLoaded(true)
          }
        }}
      />

      <div ref={containerRef} className="w-full h-64 rounded-lg overflow-hidden bg-gray-100">
        {isLoading && (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-500">Loading 3D preview...</p>
          </div>
        )}
        {error && (
          <div className="flex items-center justify-center h-full">
            <p className="text-red-500">{error}</p>
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
    STLLoader: any
    OrbitControls: any
  }
}

export default STLPreview
