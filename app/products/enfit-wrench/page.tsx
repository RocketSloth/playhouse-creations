"use client"

import { useState } from "react"
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
import { Minus, Plus, ShoppingCart, Heart, Share2, ChevronRight, Star } from "lucide-react"
import { useCart } from "@/components/cart-provider"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"

// Product data
const product = {
  id: 10,
  slug: "enfit-wrench",
  name: "Enfit Wrench Set",
  description:
    "A set of five high-quality 3D printed Enfit wrenches designed specifically for tube feeding. These durable wrenches provide the perfect grip and leverage for connecting and disconnecting Enfit connectors, making tube feeding management easier and more convenient.",
  price: 10.0,
  images: [
    "/products/enfit-wrench/image-1.webp",
    "/products/enfit-wrench/image-2.webp",
    "/products/enfit-wrench/image-3.webp",
  ],
  category: "Medical",
  isNew: true,
  isFeatured: true,
  specifications: {
    material: "PLA+ Filament (Medical Grade)",
    dimensions: '3" x 1" x 0.25" (each)',
    weight: "15g per wrench",
    finish: "Smooth",
    quantity: "Set of 5 wrenches",
    washable: "Dishwasher safe (top rack)",
  },
  relatedProducts: [1, 3], // IDs of related products (Asthma Inhaler Case and Phone Stand)
}

// Color options
const colorOptions = [
  { value: "red", label: "Red", class: "bg-red-500" },
  { value: "orange", label: "Orange", class: "bg-orange-500" },
  { value: "yellow", label: "Yellow", class: "bg-yellow-500" },
  { value: "green", label: "Green", class: "bg-green-500" },
  { value: "blue", label: "Blue", class: "bg-blue-500" },
]

// Customer reviews
const reviews = [
  {
    id: 1,
    name: "Sarah Johnson",
    avatar: "/placeholder.svg?height=80&width=80",
    rating: 5,
    date: "March 15, 2023",
    text: "These Enfit wrenches have been a game-changer for my daughter's tube feeding routine. The color options are great - we got one in each color so we can keep them in different locations around the house. They're durable and provide the perfect grip.",
  },
  {
    id: 2,
    name: "Michael Thompson",
    avatar: "/placeholder.svg?height=80&width=80",
    rating: 5,
    date: "April 2, 2023",
    text: "As a caregiver, I've struggled with Enfit connections for years. These wrenches make it so much easier! The blue ones match our medical supplies bag perfectly. Will definitely order more for backup.",
  },
  {
    id: 3,
    name: "Lisa Rodriguez",
    avatar: "/placeholder.svg?height=80&width=80",
    rating: 4,
    date: "May 10, 2023",
    text: "Great quality and very functional. The only reason I'm giving 4 stars instead of 5 is that I wish they came with a storage case. Otherwise, they're perfect for our needs!",
  },
]

export default function ProductPage() {
  const [quantity, setQuantity] = useState(1)
  const [activeImage, setActiveImage] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [selectedColor, setSelectedColor] = useState("blue")

  const { addToCart } = useCart()

  const increaseQuantity = () => setQuantity((prev) => prev + 1)
  const decreaseQuantity = () => setQuantity((prev) => (prev > 1 ? prev - 1 : 1))

  const handleAddToCart = () => {
    setIsLoading(true)
    // Simulate loading
    setTimeout(() => {
      addToCart({
        id: product.id,
        name: `${product.name} (${selectedColor.charAt(0).toUpperCase() + selectedColor.slice(1)})`,
        price: product.price,
        image: product.images[0],
        quantity: quantity,
      })
      setIsLoading(false)
    }, 600)
  }

  // Use placeholder images for now
  const productImages = [
    "/placeholder.svg?height=600&width=600&text=Enfit+Wrench+Set",
    "/placeholder.svg?height=600&width=600&text=Enfit+Wrench+Close+Up",
    "/placeholder.svg?height=600&width=600&text=Enfit+Wrench+In+Use",
  ]

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
              <BreadcrumbLink href={`/categories/medical`}>{product.category}</BreadcrumbLink>
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
            <div className="relative aspect-square rounded-lg overflow-hidden border border-gray-800">
              <Image
                src={productImages[activeImage] || "/placeholder.svg"}
                alt={product.name}
                fill
                className="object-cover"
              />
              {product.isNew && <Badge className="absolute top-2 right-2 bg-purple-600">New</Badge>}
            </div>
            <div className="flex gap-2">
              {productImages.map((image, index) => (
                <button
                  key={index}
                  className={`relative w-20 h-20 rounded-md overflow-hidden border ${
                    activeImage === index ? "border-purple-500" : "border-gray-800"
                  }`}
                  onClick={() => setActiveImage(index)}
                >
                  <Image
                    src={image || "/placeholder.svg"}
                    alt={`${product.name} view ${index + 1}`}
                    fill
                    className="object-cover"
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
              <div className="flex items-center mt-2">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 text-yellow-400" fill="currentColor" />
                ))}
                <span className="ml-2 text-sm text-gray-400">({reviews.length} reviews)</span>
              </div>
            </div>

            <p className="text-gray-300">{product.description}</p>

            {/* Color Selection */}
            <div className="space-y-4">
              <h3 className="font-medium">Select Color</h3>
              <RadioGroup value={selectedColor} onValueChange={setSelectedColor} className="flex flex-wrap gap-3">
                {colorOptions.map((color) => (
                  <div key={color.value} className="flex items-center space-x-2">
                    <RadioGroupItem value={color.value} id={color.value} className="peer sr-only" />
                    <Label
                      htmlFor={color.value}
                      className="flex flex-col items-center justify-between rounded-md border-2 border-gray-800 bg-gray-900 p-4 hover:bg-gray-800 hover:text-gray-50 peer-data-[state=checked]:border-purple-600"
                    >
                      <div className={`w-8 h-8 rounded-full ${color.class} mb-2`}></div>
                      <span>{color.label}</span>
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>

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
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
            <TabsTrigger value="shipping">Shipping</TabsTrigger>
          </TabsList>
          <TabsContent value="details" className="p-6 bg-gray-900 border border-gray-800 rounded-b-lg mt-0">
            <div className="space-y-4">
              <h3 className="text-xl font-semibold">Product Details</h3>
              <p>
                The Enfit Wrench Set includes five high-quality 3D printed wrenches specifically designed for tube
                feeding management. These wrenches provide the perfect grip and leverage for connecting and
                disconnecting Enfit connectors, making tube feeding easier and more convenient for both patients and
                caregivers.
              </p>
              <p>
                Each set comes with five wrenches in different colors (Red, Orange, Yellow, Green, and Blue), allowing
                you to keep them in different locations or assign them to different users. The bright colors also make
                them easy to find when needed.
              </p>
              <p>
                Made from medical-grade PLA+ filament, these wrenches are durable, dishwasher safe, and designed to
                withstand daily use. The ergonomic design provides comfortable handling and effective leverage for easy
                connection and disconnection of Enfit connectors.
              </p>
              <div className="mt-6">
                <h4 className="font-semibold mb-2">Key Benefits:</h4>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Improves grip and leverage for Enfit connections</li>
                  <li>Color-coded for easy identification and organization</li>
                  <li>Dishwasher safe for easy cleaning</li>
                  <li>Durable design for long-term use</li>
                  <li>Ergonomic shape for comfortable handling</li>
                </ul>
              </div>
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
          <TabsContent value="reviews" className="p-6 bg-gray-900 border border-gray-800 rounded-b-lg mt-0">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold">Customer Reviews</h3>
                <div className="flex items-center">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 text-yellow-400" fill="currentColor" />
                    ))}
                  </div>
                  <span className="ml-2 text-sm">Based on {reviews.length} reviews</span>
                </div>
              </div>

              <div className="space-y-4">
                {reviews.map((review) => (
                  <Card key={review.id} className="bg-gray-900 border-gray-800">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-4 mb-2">
                        <div className="relative h-10 w-10 rounded-full overflow-hidden">
                          <Image
                            src={review.avatar || "/placeholder.svg"}
                            alt={review.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div>
                          <h4 className="font-medium">{review.name}</h4>
                          <div className="flex items-center">
                            <div className="flex">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`h-4 w-4 ${i < review.rating ? "text-yellow-400" : "text-gray-600"}`}
                                  fill={i < review.rating ? "currentColor" : "none"}
                                />
                              ))}
                            </div>
                            <span className="ml-2 text-xs text-gray-400">{review.date}</span>
                          </div>
                        </div>
                      </div>
                      <p className="text-gray-300">{review.text}</p>
                    </CardContent>
                  </Card>
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

        {/* Related Products Section */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold">You May Also Like</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {/* This would typically be populated with actual related products */}
            <Card className="bg-gray-900 border-gray-800 overflow-hidden">
              <div className="relative aspect-square">
                <Image
                  src="/placeholder.svg?height=300&width=300&text=Related+Product"
                  alt="Related Product"
                  fill
                  className="object-cover transition-transform duration-300 hover:scale-105"
                />
              </div>
              <CardContent className="p-4">
                <div className="text-sm text-gray-400 mb-1">Medical</div>
                <h3 className="font-semibold text-lg mb-1">Asthma Inhaler Case</h3>
                <div className="mt-2 font-bold">$25.00</div>
                <Button className="w-full mt-3 bg-purple-600 hover:bg-purple-700" size="sm" asChild>
                  <Link href="/products/asthma-inhaler-case">View Product</Link>
                </Button>
              </CardContent>
            </Card>
            <Card className="bg-gray-900 border-gray-800 overflow-hidden">
              <div className="relative aspect-square">
                <Image
                  src="/placeholder.svg?height=300&width=300&text=Related+Product"
                  alt="Related Product"
                  fill
                  className="object-cover transition-transform duration-300 hover:scale-105"
                />
              </div>
              <CardContent className="p-4">
                <div className="text-sm text-gray-400 mb-1">Gadgets</div>
                <h3 className="font-semibold text-lg mb-1">Phone Stand</h3>
                <div className="mt-2 font-bold">$19.99</div>
                <Button className="w-full mt-3 bg-purple-600 hover:bg-purple-700" size="sm" asChild>
                  <Link href="/products/phone-stand">View Product</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
