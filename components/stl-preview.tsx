"use client"

import { useEffect, useRef, useState } from "react"
import { STLFallback } from "./stl-fallback"

interface STLPreviewProps {
  file: File
}

export function STLPreview({ file }: STLPreviewProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!containerRef.current) return

    let cleanup: (() => void) | undefined

    const loadSTL = async () => {
      try {
        setIsLoading(true)
        setError(null)

        // Clear any existing content
        if (containerRef.current) {
          containerRef.current.innerHTML = ""
        }

        // Create an iframe to isolate THREE.js loading
        const iframe = document.createElement("iframe")
        iframe.style.width = "100%"
        iframe.style.height = "100%"
        iframe.style.border = "none"
        iframe.title = "3D Model Preview"
        containerRef.current.appendChild(iframe)

        // Wait for iframe to load
        await new Promise<void>((resolve) => {
          iframe.onload = () => resolve()
          iframe.src = "about:blank"
        })

        const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document
        if (!iframeDoc) {
          throw new Error("Could not access iframe document")
        }

        // Create a basic HTML structure in the iframe
        iframeDoc.open()
        iframeDoc.write(`
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="utf-8">
            <title>STL Viewer</title>
            <style>
              body { margin: 0; overflow: hidden; background-color: #f0f0f0; }
              canvas { display: block; width: 100%; height: 100%; }
              .loading { 
                position: absolute; 
                top: 50%; 
                left: 50%; 
                transform: translate(-50%, -50%);
                color: #666;
                font-family: sans-serif;
              }
            </style>
          </head>
          <body>
            <div class="loading">Loading 3D preview...</div>
            <script type="module">
              // Import THREE.js ES modules from CDN
              import * as THREE from 'https://cdn.skypack.dev/three@0.159.0';
              import { STLLoader } from 'https://cdn.skypack.dev/three@0.159.0/examples/jsm/loaders/STLLoader.js';
              import { OrbitControls } from 'https://cdn.skypack.dev/three@0.159.0/examples/jsm/controls/OrbitControls.js';
              
              // Remove loading message
              document.querySelector('.loading').style.display = 'none';
              
              // Create scene
              const scene = new THREE.Scene();
              scene.background = new THREE.Color(0xf0f0f0);
              
              // Create camera
              const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
              camera.position.z = 200;
              
              // Create renderer
              const renderer = new THREE.WebGLRenderer({ antialias: true });
              renderer.setSize(window.innerWidth, window.innerHeight);
              document.body.appendChild(renderer.domElement);
              
              // Add lights
              const ambientLight = new THREE.AmbientLight(0x404040, 1.5);
              scene.add(ambientLight);
              
              const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
              directionalLight.position.set(1, 1, 1);
              scene.add(directionalLight);
              
              const directionalLight2 = new THREE.DirectionalLight(0xffffff, 1);
              directionalLight2.position.set(-1, -1, -1);
              scene.add(directionalLight2);
              
              // Add controls
              const controls = new OrbitControls(camera, renderer.domElement);
              controls.enableDamping = true;
              controls.dampingFactor = 0.25;
              
              // Function to load STL from ArrayBuffer
              window.loadSTLFromArrayBuffer = function(arrayBuffer) {
                try {
                  const loader = new STLLoader();
                  const geometry = loader.parse(arrayBuffer);
                  
                  // Center the geometry
                  geometry.computeBoundingBox();
                  const center = new THREE.Vector3();
                  geometry.boundingBox.getCenter(center);
                  geometry.center();
                  
                  // Scale the geometry to fit the view
                  geometry.computeBoundingSphere();
                  const radius = geometry.boundingSphere.radius;
                  const scale = 100 / radius;
                  
                  // Create material
                  const material = new THREE.MeshPhongMaterial({
                    color: 0x3f51b5,
                    specular: 0x111111,
                    shininess: 200
                  });
                  
                  // Create mesh
                  const mesh = new THREE.Mesh(geometry, material);
                  mesh.scale.set(scale, scale, scale);
                  mesh.rotation.x = -Math.PI / 2; // Rotate to correct orientation
                  scene.add(mesh);
                  
                  // Adjust camera position
                  camera.position.z = radius * 3;
                  controls.update();
                  
                  // Return success
                  return true;
                } catch (error) {
                  console.error('Error parsing STL:', error);
                  return false;
                }
              };
              
              // Handle window resize
              window.addEventListener('resize', () => {
                camera.aspect = window.innerWidth / window.innerHeight;
                camera.updateProjectionMatrix();
                renderer.setSize(window.innerWidth, window.innerHeight);
              });
              
              // Animation loop
              function animate() {
                requestAnimationFrame(animate);
                controls.update();
                renderer.render(scene, camera);
              }
              animate();
              
              // Signal that the viewer is ready
              window.parent.postMessage('stl-viewer-ready', '*');
            </script>
          </body>
          </html>
        `)
        iframeDoc.close()

        // Wait for the viewer to be ready
        await new Promise<void>((resolve) => {
          const handleMessage = (event: MessageEvent) => {
            if (event.data === "stl-viewer-ready") {
              window.removeEventListener("message", handleMessage)
              resolve()
            }
          }
          window.addEventListener("message", handleMessage)
        })

        // Read the file as ArrayBuffer
        const arrayBuffer = await file.arrayBuffer()

        // Load the STL in the iframe
        const loadResult = iframe.contentWindow?.loadSTLFromArrayBuffer(arrayBuffer)
        if (!loadResult) {
          throw new Error("Failed to load STL file")
        }

        setIsLoading(false)

        // Cleanup function
        cleanup = () => {
          if (containerRef.current && iframe) {
            containerRef.current.removeChild(iframe)
          }
        }
      } catch (err) {
        console.error("Error loading THREE.js:", err)
        setError("Failed to load 3D viewer. Please try again later.")
        setIsLoading(false)
      }
    }

    // Load the STL
    loadSTL()

    // Cleanup on unmount
    return () => {
      if (cleanup) cleanup()
    }
  }, [file])

  if (error) {
    return <STLFallback fileName={file.name} fileSize={file.size} error={error} />
  }

  return (
    <div className="w-full">
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

export default STLPreview
