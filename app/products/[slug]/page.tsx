"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Minus, Plus, ShoppingCart, Heart, Share2, ChevronRight } from "lucide-react"
import { useCart } from "@/components/cart-provider"
import { useParams } from "next/navigation"

// Sample product data
const productsData = [
  {
    id: 1,
    slug: "asthma-inhaler-case",
    name: "Asthma Inhaler Case",
    description:
      "A durable, protective case designed to securely hold and organize multiple asthma inhalers. Perfect for daily use or travel, this case helps keep your essential medication safe and accessible.",
    price: 9.99,
    images: [
      "/products/asthma-inhaler-case/image-1.webp",
      "/products/asthma-inhaler-case/image-2.webp",
      "/products/asthma-inhaler-case/image-3.webp",
    ],
    category: "Medical",
    isNew: true,
    isFeatured: true,
    specifications: {
      material: "PLA+ Filament",
      dimensions: '4" x 3" x 6"',
      weight: "120g",
      finish: "Smooth",
      capacity: "2-3 inhalers",
    },
    relatedProducts: [10],
  },
  {
    id: 2,
    slug: "geometric-vase",
    name: "Geometric Vase",
    description:
      "A modern geometric vase with intricate patterns. Perfect for displaying small plants or dried flowers.",
    price: 29.99,
    images: [
      "/products/geometric-vase/image-1.webp",
      "/products/geometric-vase/image-2.webp",
    ],
    category: "Household",
    isNew: true,
    isFeatured: true,
    specifications: {
      material: "PLA Filament",
      dimensions: '6" x 6" x 8"',
      weight: "180g",
      finish: "Matte",
      colors: "White, Black, Teal",
    },
    relatedProducts: [1, 10],
  },
  {
    id: 10,
    slug: "enfit-wrench",
    name: "Enfit Wrench Set",
    description: "A set of five high-quality 3D printed wrenches for tube feeding management.",
    price: 10.0,
    images: [
      "/products/enfit-wrench/image-1.webp",
      "/products/enfit-wrench/image-2.webp",
    ],
    category: "Medical",
    isNew: true,
    isFeatured: true,
    specifications: {
      material: "PLA+ Filament",
      dimensions: 'Various sizes',
      weight: "30g total",
      finish: "Smooth",
      pieces: "Set of 5 wrenches",
    },
    relatedProducts: [1, 2],
  },
]

export default function ProductPage() {
  const params = useParams()
  const slug = params.slug as string

  const [product, setProduct] = useState<any>(null)
  const [relatedProducts, setRelatedProducts] = useState<any[]>([])
  const [quantity, setQuantity] = useState(1)
  const [activeImage, setActiveImage] = useState(0)
  const [isLoading, setIsLoading] = useState(false)

  const { addToCart } = useCart()

  useEffect(() => {
    // Find product by slug
    const foundProduct = productsData.find((p) => p.slug === slug)

    if (foundProduct) {
      setProduct(foundProduct)

      // Find related products
      const related = productsData.filter(
        (p) => foundProduct.relatedProducts && foundProduct.relatedProducts.includes(p.id),
      )
      setRelatedProducts(related)
    }
  }, [slug])

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-950 text-gray-100 flex items-center justify-center">
        <p>Loading product...</p>
      </div>
    )
  }

  const handleAddToCart = () => {
    setIsLoading(true)
    // Simulate loading
    setTimeout(() => {
      addToCart({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.images[0],
        quantity: quantity,
      })
      setIsLoading(false)
    }, 600)
  }

  const increaseQuantity = () => setQuantity((prev) => prev + 1)
  const decreaseQuantity = () => setQuantity((prev) => (prev > 1 ? prev - 1 : 1))

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      <div className="container mx-auto px-4 py-8 md:px-6">
        {/* Breadcrumbs */}
        <Breadcrumb className="mb-6">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator>
              <ChevronRight className="h-4 w-4" />
            </BreadcrumbSeparator>
            <BreadcrumbItem>
              <BreadcrumbLink href="/products">Products</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator>
              <ChevronRight className="h-4 w-4" />
            </BreadcrumbSeparator>
            <BreadcrumbItem>
              <BreadcrumbLink href={`/categories/${product.category.toLowerCase()}`}>{product.category}</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator>
              <ChevronRight className="h-4 w-4" />
            </BreadcrumbSeparator>
            <BreadcrumbItem>
              <BreadcrumbLink>{product.name}</BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="relative aspect-square rounded-lg overflow-hidden border border-gray-800 max-w-md mx-auto">
              <Image
                src={product.images[activeImage] || "/placeholder.svg?height=600&width=600"}
                alt={product.name}
                fill
                className="object-contain"
              />
              {product.isNew && <Badge className="absolute top-2 right-2 bg-purple-600">New</Badge>}
            </div>
            <div className="flex gap-2 justify-center">
              {product.images.map((image: string, index: number) => (
                <button
                  key={index}
                  className={`relative w-16 h-16 rounded-md overflow-hidden border ${
                    activeImage === index ? "border-purple-500" : "border-gray-800"
                  }`}
                  onClick={() => setActiveImage(index)}
                >
                  <Image
                    src={image || "/placeholder.svg"}
                    alt={`${product.name} view ${index + 1}`}
                    fill
                    className="object-contain"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <div className="text-sm text-gray-400 mb-1">{product.category}</div>
              <h1 className="text-3xl font-bold">{product.name}</h1>
              <div className="mt-2 text-2xl font-bold">${product.price.toFixed(2)}</div>
            </div>

            <p className="text-gray-300">{product.description}</p>

            <div className="space-y-4">
              <div className="flex items-center">
                <Button
                  variant="outline"
                  size="icon"
                  className="h-10 w-10 rounded-r-none border-gray-800"
                  onClick={decreaseQuantity}
                >
                  <Minus className="h-4 w-4" />
                  <span className="sr-only">Decrease quantity</span>
                </Button>
                <div className="h-10 px-4 flex items-center justify-center border-y border-gray-800">{quantity}</div>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-10 w-10 rounded-l-none border-gray-800"
                  onClick={increaseQuantity}
                >
                  <Plus className="h-4 w-4" />
                  <span className="sr-only">Increase quantity</span>
                </Button>
              </div>

              <div className="flex gap-4">
                <Button
                  className="flex-1 bg-purple-600 hover:bg-purple-700"
                  size="lg"
                  onClick={handleAddToCart}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  ) : (
                    <>
                      <ShoppingCart className="mr-2 h-5 w-5" /> Add to Cart
                    </>
                  )}
                </Button>
                <Button variant="outline" size="icon" className="h-12 w-12 border-gray-800">
                  <Heart className="h-5 w-5" />
                  <span className="sr-only">Add to wishlist</span>
                </Button>
                <Button variant="outline" size="icon" className="h-12 w-12 border-gray-800">
                  <Share2 className="h-5 w-5" />
                  <span className="sr-only">Share product</span>
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Product Details Tabs */}
        <Tabs defaultValue="details" className="mb-12">
          <TabsList className="bg-gray-900 border-gray-800">
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="specifications">Specifications</TabsTrigger>
            <TabsTrigger value="shipping">Shipping</TabsTrigger>
          </TabsList>
          <TabsContent value="details" className="p-6 bg-gray-900 border border-gray-800 rounded-b-lg mt-0">
            <div className="space-y-4">
              <h3 className="text-xl font-semibold">Product Details</h3>
              <p>{product.description}</p>
              <p>
                Each piece is 3D printed with high-quality filament and carefully finished to ensure durability and a
                professional appearance. Our printing process allows for intricate details that would be impossible with
                traditional manufacturing methods.
              </p>
              <p>
                All items are made to order, allowing for customization options. Please contact us if you'd like to
                discuss custom colors or modifications to this design.
              </p>
            </div>
          </TabsContent>
          <TabsContent value="specifications" className="p-6 bg-gray-900 border border-gray-800 rounded-b-lg mt-0">
            <div className="space-y-4">
              <h3 className="text-xl font-semibold">Specifications</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {product.specifications &&
                  Object.entries(product.specifications).map(([key, value]) => (
                    <div key={key} className="flex justify-between border-b border-gray-800 pb-2">
                      <span className="font-medium capitalize">{key.replace(/([A-Z])/g, " $1").trim()}</span>
                      <span className="text-gray-300">{value}</span>
                    </div>
                  ))}
              </div>
            </div>
          </TabsContent>
          <TabsContent value="shipping" className="p-6 bg-gray-900 border border-gray-800 rounded-b-lg mt-0">
            <div className="space-y-4">
              <h3 className="text-xl font-semibold">Shipping Information</h3>
              <p>
                All items are carefully packaged to ensure they arrive in perfect condition. Standard shipping typically
                takes 3-5 business days within the continental US.
              </p>
              <div className="space-y-2">
                <p className="font-medium">Shipping Options:</p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Standard Shipping (3-5 business days): $4.99</li>
                  <li>Express Shipping (1-2 business days): $9.99</li>
                  <li>Free shipping on orders over $50</li>
                </ul>
              </div>
              <p>
                International shipping is available at additional cost. Please note that customs fees may apply for
                international orders.
              </p>
            </div>
          </TabsContent>
        </Tabs>

        {/* Related Products */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold">You May Also Like</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {relatedProducts.map((product) => (
              <Card key={product.id} className="bg-gray-900 border-gray-800 overflow-hidden">
                <div className="relative aspect-square">
                  <Image
                    src={product.images ? product.images[0] : "/placeholder.svg?height=300&width=300"}
                    alt={product.name}
                    fill
                    className="object-cover transition-transform duration-300 hover:scale-105"
                  />
                  {product.isNew && <Badge className="absolute top-2 right-2 bg-purple-600">New</Badge>}
                </div>
                <CardContent className="p-4">
                  <div className="text-sm text-gray-400 mb-1">{product.category}</div>
                  <h3 className="font-semibold text-lg mb-1">{product.name}</h3>
                  <div className="mt-2 font-bold">${product.price.toFixed(2)}</div>
                  <Button className="w-full mt-3 bg-purple-600 hover:bg-purple-700" size="sm" asChild>
                    <Link href={`/products/${product.slug}`}>View Product</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
