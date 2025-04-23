import Link from "next/link"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"

// Category data
const categories = [
  {
    id: "medical",
    title: "Medical Products",
    description: "Practical 3D printed solutions for medical needs and organization",
    image: "/placeholder.svg?height=600&width=800",
    count: 1,
  },
  {
    id: "household",
    title: "Household Items",
    description: "Functional and decorative 3D printed items for your home",
    image: "/placeholder.svg?height=600&width=800",
    count: 3,
  },
  {
    id: "gadgets",
    title: "Gadgets & Accessories",
    description: "Useful 3D printed gadgets and accessories for everyday life",
    image: "/placeholder.svg?height=600&width=800",
    count: 2,
  },
  {
    id: "figurines",
    title: "Figurines & Models",
    description: "Detailed 3D printed figurines, models, and collectibles",
    image: "/placeholder.svg?height=600&width=800",
    count: 2,
  },
]

export default function CategoriesPage() {
  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      <div className="container mx-auto px-4 py-12 md:px-6">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold tracking-tight mb-4">Product Categories</h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Browse our collection of premium 3D printed products by category
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {categories.map((category) => (
            <Link key={category.id} href={`/categories/${category.id}`} className="block group">
              <Card className="bg-gray-900 border-gray-800 overflow-hidden h-full transition-all duration-300 group-hover:border-purple-500">
                <div className="grid md:grid-cols-2 h-full">
                  <div className="relative aspect-square md:aspect-auto">
                    <Image
                      src={category.image || "/placeholder.svg"}
                      alt={category.title}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                  <CardContent className="p-6 flex flex-col justify-center">
                    <h2 className="text-2xl font-bold mb-2 group-hover:text-purple-400 transition-colors">
                      {category.title}
                    </h2>
                    <p className="text-gray-400 mb-4">{category.description}</p>
                    <p className="text-sm text-gray-500">
                      {category.count} {category.count === 1 ? "product" : "products"}
                    </p>
                  </CardContent>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
