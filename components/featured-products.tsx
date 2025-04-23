"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ShoppingCart, Eye } from "lucide-react"
import { useCart } from "@/components/cart-provider"

// Sample product data
const products = [
  {
    id: 1,
    slug: "asthma-inhaler-case",
    name: "Asthma Inhaler Case",
    description: "A durable, protective case designed to securely hold and organize multiple asthma inhalers.",
    price: 25.0,
    image: "/placeholder.svg?height=300&width=300", // Will be replaced with actual image
    category: "Medical",
    isNew: true,
    isFeatured: true,
  },
  {
    id: 2,
    slug: "geometric-vase",
    name: "Geometric Vase",
    description:
      "A modern geometric vase with intricate patterns. Perfect for displaying small plants or dried flowers.",
    price: 29.99,
    image: "/products/geometric-vase/image-1.webp",
    category: "Household",
    isNew: true,
    isFeatured: true,
  },
  {
    id: 3,
    name: "Phone Stand",
    description: "Ergonomic phone stand with cable management",
    price: 19.99,
    image: "/placeholder.svg?height=300&width=300",
    category: "Gadgets",
    isNew: false,
    isFeatured: true,
  },
  {
    id: 10,
    slug: "enfit-wrench",
    name: "Enfit Wrench Set",
    description: "A set of five high-quality 3D printed wrenches for tube feeding management.",
    price: 10.0,
    image: "/products/enfit-wrench/image-1.webp",
    category: "Medical",
    isNew: true,
    isFeatured: true,
  },
]

export default function FeaturedProducts() {
  const { addToCart } = useCart()
  const [isLoading, setIsLoading] = useState<number | null>(null)

  const handleAddToCart = (product: (typeof products)[0]) => {
    setIsLoading(product.id)
    // Simulate loading
    setTimeout(() => {
      addToCart({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        quantity: 1,
      })
      setIsLoading(null)
    }, 600)
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {products.map((product) => (
        <Card key={product.id} className="bg-gray-900 border-gray-800 overflow-hidden">
          <div className="relative aspect-square">
            <Image
              src={product.image || "/placeholder.svg?height=300&width=300"}
              alt={product.name}
              fill
              className="object-contain p-2"
            />
            {product.isNew && <Badge className="absolute top-2 right-2 bg-purple-600">New</Badge>}
          </div>
          <CardContent className="p-4">
            <div className="text-sm text-gray-400 mb-1">{product.category}</div>
            <h3 className="font-semibold text-lg mb-1">{product.name}</h3>
            <p className="text-gray-400 text-sm line-clamp-2">{product.description}</p>
            <div className="mt-2 font-bold text-lg">${product.price.toFixed(2)}</div>
          </CardContent>
          <CardFooter className="p-4 pt-0 flex gap-2">
            <Button
              variant="outline"
              size="sm"
              className="border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white flex-1"
              asChild
            >
              <Link href={`/products/${product.slug}`}>
                <Eye className="mr-2 h-4 w-4" /> View
              </Link>
            </Button>
            <Button
              size="sm"
              className="bg-purple-600 hover:bg-purple-700 flex-1"
              onClick={() => handleAddToCart(product)}
              disabled={isLoading === product.id}
            >
              {isLoading === product.id ? (
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
              ) : (
                <>
                  <ShoppingCart className="mr-2 h-4 w-4" /> Add
                </>
              )}
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}
