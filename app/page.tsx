import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ShoppingCart, ChevronRight } from "lucide-react"
import FeaturedProducts from "@/components/featured-products"
import Testimonials from "@/components/testimonials"

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      {/* Hero Section */}
      <section className="relative h-[80vh] flex items-center">
        <div className="absolute inset-0 z-0">
          <Image
            src="/products/backgrounds/colorful-gears.webp"
            alt="Colorful 3D Printed Gears"
            fill
            quality={100}
            sizes="100vw"
            className="object-cover opacity-40"
            priority
          />
        </div>
        <div className="container relative z-10 mx-auto px-4 md:px-6">
          <div className="max-w-3xl space-y-4">
            <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl">
              PLAyhouse Creations <span className="text-purple-400">Premium 3D Prints</span>
            </h1>
            <p className="text-xl text-gray-300">
              Unique, high-quality 3D printed creations with exceptional detail and durability.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button asChild size="lg" className="bg-purple-600 hover:bg-purple-700">
                <Link href="/products">
                  Shop Collection <ChevronRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              {/* About link temporarily hidden
              <Button asChild variant="outline" size="lg" className="border-gray-700 text-gray-300 hover:bg-gray-800">
                <Link href="/about">Learn More</Link>
              </Button>
              */}
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-gray-900">
        <div className="container mx-auto px-4 md:px-6">
          <h2 className="text-3xl font-bold tracking-tight mb-8">Featured Creations</h2>
          <FeaturedProducts />
          <div className="mt-12 text-center">
            <Button asChild variant="outline" size="lg" className="border-gray-700 text-gray-300 hover:bg-gray-800">
              <Link href="/products">
                View All Products <ChevronRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 bg-gray-950">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gray-900 p-6 rounded-lg border border-gray-800">
              <h3 className="text-xl font-bold mb-3 text-purple-400">Custom Designs</h3>
              <p className="text-gray-300">
                Each piece is carefully designed and can be customized to your specifications.
              </p>
            </div>
            <div className="bg-gray-900 p-6 rounded-lg border border-gray-800">
              <h3 className="text-xl font-bold mb-3 text-purple-400">Premium Materials</h3>
              <p className="text-gray-300">
                We use only the highest quality filaments for durability and stunning finishes.
              </p>
            </div>
            <div className="bg-gray-900 p-6 rounded-lg border border-gray-800">
              <h3 className="text-xl font-bold mb-3 text-purple-400">Fast Shipping</h3>
              <p className="text-gray-300">Your order is carefully packaged and shipped quickly to your doorstep.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-gray-900">
        <div className="container mx-auto px-4 md:px-6">
          <h2 className="text-3xl font-bold tracking-tight mb-8">What Our Customers Say</h2>
          <Testimonials />
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-purple-900">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <h2 className="text-3xl font-bold tracking-tight mb-4">Ready to Order Your Custom 3D Print?</h2>
          <p className="text-xl text-purple-100 mb-8 max-w-2xl mx-auto">
            Browse our collection or request a custom design tailored to your needs.
          </p>
          <Button asChild size="lg" className="bg-gray-900 hover:bg-gray-800">
            <Link href="/products">
              Shop Now <ShoppingCart className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>
    </div>
  )
}
