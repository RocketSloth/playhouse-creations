export interface STLAnalysisResult {
  triangles: number
  dimensions: {
    x: number
    y: number
    z: number
  }
  volume: number
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
    }
  }

  try {
    // Create a temporary iframe to analyze the STL
    const iframe = document.createElement("iframe")
    iframe.style.display = "none"
    document.body.appendChild(iframe)

    // Create a document in the iframe
    const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document
    if (!iframeDoc) {
      throw new Error("Could not access iframe document")
    }

    // Write the analyzer script to the iframe
    iframeDoc.open()
    iframeDoc.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>STL Analyzer</title>
      </head>
      <body>
        <script type="module">
          // Import THREE.js ES modules from CDN
          import * as THREE from 'https://cdn.skypack.dev/three@0.159.0';
          import { STLLoader } from 'https://cdn.skypack.dev/three@0.159.0/examples/jsm/loaders/STLLoader.js';
          
          // Function to analyze STL
          window.analyzeSTL = function(arrayBuffer) {
            try {
              const loader = new STLLoader();
              const geometry = loader.parse(arrayBuffer);
              
              // Get triangle count
              const triangles = geometry.attributes.position.count / 3;
              
              // Compute bounding box to get dimensions
              geometry.computeBoundingBox();
              const boundingBox = geometry.boundingBox;
              const dimensions = {
                x: Math.abs(boundingBox.max.x - boundingBox.min.x),
                y: Math.abs(boundingBox.max.y - boundingBox.min.y),
                z: Math.abs(boundingBox.max.z - boundingBox.min.z)
              };
              
              // Calculate volume
              const volume = calculateVolume(geometry, THREE);
              
              return {
                triangles,
                dimensions,
                volume
              };
            } catch (error) {
              console.error('Error analyzing STL:', error);
              return null;
            }
          };
          
          // Function to calculate volume of a 3D mesh
          function calculateVolume(geometry, THREE) {
            try {
              // Get position attribute
              const positions = geometry.attributes.position;
              
              let volume = 0;
              
              // Calculate volume using the signed tetrahedron volume method
              for (let i = 0; i < positions.count; i += 3) {
                const v1 = new THREE.Vector3();
                const v2 = new THREE.Vector3();
                const v3 = new THREE.Vector3();
                
                v1.fromBufferAttribute(positions, i);
                v2.fromBufferAttribute(positions, i + 1);
                v3.fromBufferAttribute(positions, i + 2);
                
                // Calculate signed volume of tetrahedron formed by triangle and origin
                volume += signedVolumeOfTriangle(v1, v2, v3);
              }
              
              // Convert to cubic centimeters (assuming STL is in mm)
              return Math.abs(volume) / 1000;
            } catch (error) {
              console.error('Error calculating volume:', error);
              return 50; // Return a default volume if calculation fails
            }
          }
          
          // Calculate signed volume of tetrahedron
          function signedVolumeOfTriangle(p1, p2, p3) {
            try {
              return p1.dot(p2.cross(p3)) / 6.0;
            } catch (error) {
              console.error('Error in volume calculation:', error);
              return 0;
            }
          }
          
          // Signal that the analyzer is ready
          window.parent.postMessage('stl-analyzer-ready', '*');
        </script>
      </body>
      </html>
    `)
    iframeDoc.close()

    // Wait for the analyzer to be ready
    await new Promise<void>((resolve) => {
      const handleMessage = (event: MessageEvent) => {
        if (event.data === "stl-analyzer-ready") {
          window.removeEventListener("message", handleMessage)
          resolve()
        }
      }
      window.addEventListener("message", handleMessage)
    })

    // Analyze the STL
    const result = iframe.contentWindow?.analyzeSTL(fileBuffer)

    // Clean up
    document.body.removeChild(iframe)

    if (!result) {
      throw new Error("Failed to analyze STL")
    }

    return result
  } catch (error) {
    console.error("Error analyzing STL:", error)
    // Return fallback data if THREE.js fails to load or process
    return {
      triangles: 1000,
      dimensions: { x: 100, y: 100, z: 100 },
      volume: 50,
    }
  }
}
