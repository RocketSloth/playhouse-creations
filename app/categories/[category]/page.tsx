import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ShoppingCart, Eye } from "lucide-react"
import { notFound } from "next/navigation"

// Sample product data
const products = [
  {
    id: 1,
    slug: "asthma-inhaler-case",
    name: "Asthma Inhaler Case",
    description:
      "A durable, protective case designed to securely hold and organize multiple asthma inhalers. Perfect for daily use or travel, this case helps keep your essential medication safe and accessible.",
    price: 25.0,
    image: "/placeholder.svg?height=300&width=300", // Will be replaced with actual image
    category: "medical",
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
    image: "/products/geometric-vase/image-1.webp", // Using the first image as cover photo
    category: "household",
    isNew: true,
    isFeatured: true,
  },
  {
    id: 3,
    name: "Phone Stand",
    description: "Ergonomic phone stand with cable management",
    price: 19.99,
    image: "/placeholder.svg?height=300&width=300",
    category: "gadgets",
    isNew: true,
    isFeatured: true,
  },
  {
    id: 4,
    name: "Sci-Fi Spaceship",
    description: "Detailed model of a futuristic spacecraft",
    price: 39.99,
    image: "/placeholder.svg?height=300&width=300",
    category: "figurines",
    isNew: false,
    isFeatured: true,
  },
  {
    id: 5,
    name: "Desk Organizer",
    description: "Multi-compartment organizer for office supplies",
    price: 29.99,
    image: "/placeholder.svg?height=300&width=300",
    category: "household",
    isNew: false,
    isFeatured: false,
  },
  {
    id: 6,
    name: "Mechanical Puzzle Box",
    description: "Intricate puzzle box with moving parts",
    price: 34.99,
    image: "/placeholder.svg?height=300&width=300",
    category: "gadgets",
    isNew: false,
    isFeatured: false,
  },
  {
    id: 7,
    name: "Miniature Castle",
    description: "Detailed medieval castle with removable towers",
    price: 59.99,
    image: "/placeholder.svg?height=300&width=300",
    category: "figurines",
    isNew: false,
    isFeatured: false,
  },
  {
    id: 8,
    name: "Wall Planter",
    description: "Hanging planter with geometric design",
    price: 22.99,
    image: "/placeholder.svg?height=300&width=300",
    category: "household",
    isNew: true,
    isFeatured: false,
  },
  {
    id: 10,
    slug: "enfit-wrench",
    name: "Enfit Wrench Set",
    description: "A set of five high-quality 3D printed wrenches for tube feeding management.",
    price: 10.0,
    image: "/products/enfit-wrench/image-1.webp",
    category: "medical",
    isNew: true,
    isFeatured: true,
  },
]

// Category metadata
const categories = {
  medical: {
    title: "Medical Products",
    description: "Practical 3D printed solutions for medical needs and organization",
    image: "/placeholder.svg?height=600&width=1200",
  },
  household: {
    title: "Household Items",
    description: "Functional and decorative 3D printed items for your home",
    image: "/placeholder.svg?height=600&width=1200",
  },
  gadgets: {
    title: "Gadgets & Accessories",
    description: "Useful 3D printed gadgets and accessories for everyday life",
    image: "/placeholder.svg?height=600&width=1200",
  },
  figurines: {
    title: "Figurines & Models",
    description: "Detailed 3D printed figurines, models, and collectibles",
    image: "/placeholder.svg?height=600&width=1200",
  },
}

export default function CategoryPage({ params }: { params: { category: string } }) {
  const category = params.category.toLowerCase()

  // Check if category exists
  if (!categories[category as keyof typeof categories]) {
    notFound()
  }

  // Filter products by category
  const categoryProducts = products.filter((product) => product.category.toLowerCase() === category)

  const categoryInfo = categories[category as keyof typeof categories]

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      <div className="relative h-[40vh] flex items-center">
        <div className="absolute inset-0 z-0">
          <Image
            src={categoryInfo.image || "/placeholder.svg"}
            alt={categoryInfo.title}
            fill
            className="object-cover opacity-40"
            priority
          />
        </div>
        <div className="container relative z-10 mx-auto px-4 md:px-6">
          <div className="max-w-3xl space-y-4">
            <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl">{categoryInfo.title}</h1>
            <p className="text-xl text-gray-300">{categoryInfo.description}</p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12 md:px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {categoryProducts.length > 0 ? (
            categoryProducts.map((product) => (
              <Card key={product.id} className="bg-gray-900 border-gray-800 overflow-hidden">
                <div className="relative aspect-square">
                  <Image
                    src={product.image || "/placeholder.svg"}
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
                    <Link href={`/products/${product.slug || product.id}`}>
                      <Eye className="mr-2 h-4 w-4" /> View
                    </Link>
                  </Button>
                  <Button size="sm" className="bg-purple-600 hover:bg-purple-700 flex-1">
                    <ShoppingCart className="mr-2 h-4 w-4" /> Add
                  </Button>
                </CardFooter>
              </Card>
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <h2 className="text-2xl font-semibold mb-2">No products found</h2>
              <p className="text-gray-400 mb-6">We couldn't find any products in this category.</p>
              <Button asChild className="bg-purple-600 hover:bg-purple-700">
                <Link href="/products">View All Products</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
