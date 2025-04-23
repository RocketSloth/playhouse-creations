import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { FileText, FolderPlus, Upload } from "lucide-react"

export default function GuideToUploadingImages() {
  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      <div className="container mx-auto px-4 py-12 md:px-6">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Guide to Uploading Product Images</h1>

          <Card className="bg-gray-900 border-gray-800 mb-8">
            <CardHeader>
              <CardTitle>Image Directory Structure</CardTitle>
              <CardDescription className="text-gray-400">How to organize your product images</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                For your PLAyhouse Creations website, product images should be organized in the following directory
                structure:
              </p>

              <div className="bg-gray-800 p-4 rounded-md font-mono text-sm">
                <p>/public</p>
                <p className="pl-4">/products</p>
                <p className="pl-8">/asthma-inhaler-case</p>
                <p className="pl-12">image-1.webp</p>
                <p className="pl-12">image-2.webp</p>
                <p className="pl-12">image-3.webp</p>
                <p className="pl-8">/geometric-vase</p>
                <p className="pl-12">image-1.webp</p>
                <p className="pl-12">image-2.webp</p>
              </div>

              <p>
                Each product should have its own folder named after the product's slug (URL-friendly name), and images
                within that folder should be numbered sequentially.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-gray-800 mb-8">
            <CardHeader>
              <CardTitle>How to Upload Images</CardTitle>
              <CardDescription className="text-gray-400">
                Step-by-step guide to adding your product images
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <h3 className="text-lg font-medium flex items-center">
                  <FolderPlus className="mr-2 h-5 w-5 text-purple-400" /> Step 1: Create the Directory Structure
                </h3>
                <p>
                  First, create the necessary folders in your project's public directory. For each product, create a
                  folder with the product's slug name.
                </p>
              </div>

              <Separator className="bg-gray-800" />

              <div className="space-y-2">
                <h3 className="text-lg font-medium flex items-center">
                  <Upload className="mr-2 h-5 w-5 text-purple-400" /> Step 2: Prepare Your Images
                </h3>
                <p>Prepare your product images. For best performance:</p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Use WebP format for better compression and quality</li>
                  <li>Keep file sizes under 200KB if possible</li>
                  <li>Use consistent aspect ratios (preferably square 1:1)</li>
                  <li>Recommended dimensions: 1200x1200 pixels</li>
                </ul>
              </div>

              <Separator className="bg-gray-800" />

              <div className="space-y-2">
                <h3 className="text-lg font-medium flex items-center">
                  <FileText className="mr-2 h-5 w-5 text-purple-400" /> Step 3: Update Product Data
                </h3>
                <p>
                  After uploading your images, update the product data in the following files to reference your images:
                </p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>
                    <code className="bg-gray-800 px-1 rounded">components/featured-products.tsx</code>
                  </li>
                  <li>
                    <code className="bg-gray-800 px-1 rounded">app/products/page.tsx</code>
                  </li>
                  <li>
                    <code className="bg-gray-800 px-1 rounded">app/products/[slug]/page.tsx</code>
                  </li>
                </ul>
                <p>For each product, update the image paths to match your directory structure. For example:</p>
                <div className="bg-gray-800 p-4 rounded-md font-mono text-sm">
                  <p>image: "/products/asthma-inhaler-case/image-1.webp",</p>
                  <p>images: [</p>
                  <p className="pl-4">"/products/asthma-inhaler-case/image-1.webp",</p>
                  <p className="pl-4">"/products/asthma-inhaler-case/image-2.webp",</p>
                  <p className="pl-4">"/products/asthma-inhaler-case/image-3.webp"</p>
                  <p>],</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-gray-800">
            <CardHeader>
              <CardTitle>Next.js Image Optimization</CardTitle>
              <CardDescription className="text-gray-400">Understanding how Next.js handles images</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                Next.js automatically optimizes images using the <code className="bg-gray-800 px-1 rounded">Image</code>{" "}
                component. This provides:
              </p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Automatic responsive sizing</li>
                <li>Lazy loading (images load as they enter viewport)</li>
                <li>Image optimization and WebP conversion</li>
                <li>Prevents layout shift with proper aspect ratios</li>
              </ul>
              <p>
                The website is already set up to use these optimizations, so you just need to provide the correct image
                paths.
              </p>

              <div className="mt-6">
                <Button className="bg-purple-600 hover:bg-purple-700">
                  <Upload className="mr-2 h-4 w-4" /> Start Uploading
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
