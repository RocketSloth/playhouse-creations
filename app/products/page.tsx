import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { ShoppingCart, Eye, Search } from "lucide-react"

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
    image: "/placeholder.svg?height=300&width=300", // Will be replaced with actual image
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
    isNew: true,
    isFeatured: true,
  },
  {
    id: 4,
    name: "Sci-Fi Spaceship",
    description: "Detailed model of a futuristic spacecraft",
    price: 39.99,
    image: "/placeholder.svg?height=300&width=300",
    category: "Figurines",
    isNew: false,
    isFeatured: true,
  },
  {
    id: 5,
    name: "Desk Organizer",
    description: "Multi-compartment organizer for office supplies",
    price: 29.99,
    image: "/placeholder.svg?height=300&width=300",
    category: "Household",
    isNew: false,
    isFeatured: false,
  },
  {
    id: 6,
    name: "Mechanical Puzzle Box",
    description: "Intricate puzzle box with moving parts",
    price: 34.99,
    image: "/placeholder.svg?height=300&width=300",
    category: "Gadgets",
    isNew: false,
    isFeatured: false,
  },
  {
    id: 7,
    name: "Miniature Castle",
    description: "Detailed medieval castle with removable towers",
    price: 59.99,
    image: "/placeholder.svg?height=300&width=300",
    category: "Figurines",
    isNew: false,
    isFeatured: false,
  },
  {
    id: 8,
    name: "Wall Planter",
    description: "Hanging planter with geometric design",
    price: 22.99,
    image: "/placeholder.svg?height=300&width=300",
    category: "Household",
    isNew: true,
    isFeatured: false,
  },
  {
    id: 10,
    slug: "enfit-wrench",
    name: "Enfit Wrench Set",
    description: "A set of five high-quality 3D printed wrenches for tube feeding management.",
    price: 10.0,
    image: "/placeholder.svg?height=300&width=300&text=Enfit+Wrench+Set",
    category: "Medical",
    isNew: true,
    isFeatured: true,
  },
]

export default function ProductsPage() {
  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      <div className="container mx-auto px-4 py-8 md:px-6">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar Filters */}
          <div className="w-full md:w-64 space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-3">Search</h3>
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search products..."
                  className="pl-8 bg-gray-900 border-gray-800 focus-visible:ring-purple-500"
                />
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-3">Categories</h3>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox id="category-all" />
                  <Label htmlFor="category-all" className="text-sm font-medium">
                    All Categories
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="category-medical" />
                  <Label htmlFor="category-medical" className="text-sm font-medium">
                    Medical
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="category-household" />
                  <Label htmlFor="category-household" className="text-sm font-medium">
                    Household
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="category-figurines" />
                  <Label htmlFor="category-figurines" className="text-sm font-medium">
                    Figurines
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="category-gadgets" />
                  <Label htmlFor="category-gadgets" className="text-sm font-medium">
                    Gadgets
                  </Label>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-3">Price Range</h3>
              <div className="grid grid-cols-2 gap-2">
                <Input
                  type="number"
                  placeholder="Min"
                  className="bg-gray-900 border-gray-800 focus-visible:ring-purple-500"
                />
                <Input
                  type="number"
                  placeholder="Max"
                  className="bg-gray-900 border-gray-800 focus-visible:ring-purple-500"
                />
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-3">Filter</h3>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox id="filter-new" />
                  <Label htmlFor="filter-new" className="text-sm font-medium">
                    New Arrivals
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="filter-featured" />
                  <Label htmlFor="filter-featured" className="text-sm font-medium">
                    Featured
                  </Label>
                </div>
              </div>
            </div>
          </div>

          {/* Product Grid */}
          <div className="flex-1">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
              <h1 className="text-2xl font-bold">All Products</h1>
              <div className="flex items-center mt-4 sm:mt-0">
                <Select>
                  <SelectTrigger className="w-[180px] bg-gray-900 border-gray-800 focus:ring-purple-500">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-900 border-gray-800">
                    <SelectItem value="featured">Featured</SelectItem>
                    <SelectItem value="price-low">Price: Low to High</SelectItem>
                    <SelectItem value="price-high">Price: High to Low</SelectItem>
                    <SelectItem value="newest">Newest</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <Card key={product.id} className="bg-gray-900 border-gray-800 overflow-hidden">
                  <div className="relative aspect-square">
                    <Image
                      src={product.image || "/placeholder.svg"}
                      alt={product.name}
                      fill
                      className="object-cover transition-transform duration-300 hover:scale-105"
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
                    <Button size="sm" className="bg-purple-600 hover:bg-purple-700 flex-1">
                      <ShoppingCart className="mr-2 h-4 w-4" /> Add
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
