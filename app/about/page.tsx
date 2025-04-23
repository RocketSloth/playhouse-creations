import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ChevronRight, PrinterIcon as Printer3d, Palette, Sparkles, Clock } from "lucide-react"

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      <div className="container mx-auto px-4 py-12 md:px-6">
        {/* Hero Section */}
        <div className="relative rounded-lg overflow-hidden mb-16">
          <div className="absolute inset-0">
            <Image
              src="/placeholder.svg?height=600&width=1200"
              alt="3D Printing Workshop"
              fill
              className="object-cover opacity-30"
            />
          </div>
          <div className="relative z-10 py-20 px-6 text-center">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl mb-6">
              About <span className="text-purple-400">PLAyhouse Creations</span>
            </h1>
            <p className="text-xl max-w-3xl mx-auto mb-8">
              Crafting imagination into reality, one layer at a time. We're passionate about creating high-quality 3D
              printed designs that bring joy and functionality to your life.
            </p>
          </div>
        </div>

        {/* Our Story */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-20">
          <div>
            <h2 className="text-3xl font-bold mb-6">Our Story</h2>
            <div className="space-y-4">
              <p>
                PLAyhouse Creations began with a simple passion: creating beautiful, functional objects through the
                magic of 3D printing. What started as a hobby in a small home office has grown into a dedicated workshop
                producing premium quality 3D printed items for customers worldwide.
              </p>
              <p>
                Our founder combined a background in design with a fascination for additive manufacturing technology,
                seeing the potential to create custom pieces that traditional manufacturing couldn't achieve at small
                scales.
              </p>
              <p>
                Today, we're proud to offer a diverse collection of 3D printed creations, from detailed figurines to
                practical household items, all made with care and precision. Every piece that leaves our workshop is
                inspected to ensure it meets our high standards.
              </p>
            </div>
            <Button asChild className="mt-6 bg-purple-600 hover:bg-purple-700">
              <Link href="/contact">
                Contact Us <ChevronRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
          <div className="relative h-[400px] rounded-lg overflow-hidden">
            <Image
              src="/placeholder.svg?height=800&width=600"
              alt="3D Printing in Action"
              fill
              className="object-cover"
            />
          </div>
        </div>

        {/* What Sets Us Apart */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold mb-10 text-center">What Sets Us Apart</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="bg-gray-900 border-gray-800">
              <CardContent className="pt-6">
                <Printer3d className="h-12 w-12 text-purple-400 mb-4" />
                <h3 className="text-xl font-semibold mb-2">Quality Equipment</h3>
                <p className="text-gray-300">
                  We use professional-grade 3D printers and premium materials to ensure exceptional quality in every
                  print.
                </p>
              </CardContent>
            </Card>
            <Card className="bg-gray-900 border-gray-800">
              <CardContent className="pt-6">
                <Palette className="h-12 w-12 text-purple-400 mb-4" />
                <h3 className="text-xl font-semibold mb-2">Custom Designs</h3>
                <p className="text-gray-300">
                  From concept to creation, we work with you to bring your unique ideas to life with personalized
                  designs.
                </p>
              </CardContent>
            </Card>
            <Card className="bg-gray-900 border-gray-800">
              <CardContent className="pt-6">
                <Sparkles className="h-12 w-12 text-purple-400 mb-4" />
                <h3 className="text-xl font-semibold mb-2">Attention to Detail</h3>
                <p className="text-gray-300">
                  Every piece is carefully finished and inspected to ensure smooth surfaces and precise details.
                </p>
              </CardContent>
            </Card>
            <Card className="bg-gray-900 border-gray-800">
              <CardContent className="pt-6">
                <Clock className="h-12 w-12 text-purple-400 mb-4" />
                <h3 className="text-xl font-semibold mb-2">Quick Turnaround</h3>
                <p className="text-gray-300">
                  Our efficient workflow allows us to produce and ship your items faster than traditional manufacturing.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Our Process */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold mb-10 text-center">Our Process</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="relative">
              <div className="rounded-lg overflow-hidden mb-4 aspect-video">
                <Image
                  src="/placeholder.svg?height=400&width=600"
                  alt="Design Process"
                  width={600}
                  height={400}
                  className="object-cover"
                />
              </div>
              <div className="absolute top-2 left-2 bg-purple-600 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold">
                1
              </div>
              <h3 className="text-xl font-semibold mb-2">Design</h3>
              <p className="text-gray-300">
                We start with digital 3D modeling, carefully designing each piece for both aesthetics and functionality.
              </p>
            </div>
            <div className="relative">
              <div className="rounded-lg overflow-hidden mb-4 aspect-video">
                <Image
                  src="/placeholder.svg?height=400&width=600"
                  alt="Printing Process"
                  width={600}
                  height={400}
                  className="object-cover"
                />
              </div>
              <div className="absolute top-2 left-2 bg-purple-600 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold">
                2
              </div>
              <h3 className="text-xl font-semibold mb-2">Print</h3>
              <p className="text-gray-300">
                Using high-quality filaments and precise printer settings, we bring the digital design into physical
                form.
              </p>
            </div>
            <div className="relative">
              <div className="rounded-lg overflow-hidden mb-4 aspect-video">
                <Image
                  src="/placeholder.svg?height=400&width=600"
                  alt="Finishing Process"
                  width={600}
                  height={400}
                  className="object-cover"
                />
              </div>
              <div className="absolute top-2 left-2 bg-purple-600 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold">
                3
              </div>
              <h3 className="text-xl font-semibold mb-2">Finish</h3>
              <p className="text-gray-300">
                Each piece is carefully post-processed, including sanding, painting, and assembly when needed.
              </p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="bg-purple-900 rounded-lg p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Ready to bring your ideas to life?</h2>
          <p className="text-xl text-purple-100 mb-6 max-w-2xl mx-auto">
            Whether you're looking for something from our collection or need a custom design, we're here to help.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-gray-900 hover:bg-gray-800">
              <Link href="/products">Browse Products</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="border-gray-100 text-white hover:bg-purple-800">
              <Link href="/contact">Request Custom Design</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
