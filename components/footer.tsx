import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Facebook, Instagram, Twitter } from "lucide-react"

export default function Footer() {
  return (
    <footer className="border-t border-gray-800 bg-gray-950 text-gray-300">
      <div className="container mx-auto px-4 py-12 md:px-6">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <h3 className="mb-4 text-lg font-semibold text-white">PLAyhouse Creations</h3>
            <p className="mb-4">
              Premium quality 3D printed creations, custom designs, and unique collectibles from PLAyhouse Creations.
            </p>
            <div className="flex space-x-4">
              <Button variant="ghost" size="icon" className="hover:text-purple-400">
                <Facebook className="h-5 w-5" />
                <span className="sr-only">Facebook</span>
              </Button>
              <Button variant="ghost" size="icon" className="hover:text-purple-400">
                <Instagram className="h-5 w-5" />
                <span className="sr-only">Instagram</span>
              </Button>
              <Button variant="ghost" size="icon" className="hover:text-purple-400">
                <Twitter className="h-5 w-5" />
                <span className="sr-only">Twitter</span>
              </Button>
            </div>
          </div>
          <div>
            <h3 className="mb-4 text-lg font-semibold text-white">Shop</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/products" className="hover:text-purple-400">
                  All Products
                </Link>
              </li>
              <li>
                <Link href="/categories/figurines" className="hover:text-purple-400">
                  Figurines
                </Link>
              </li>
              <li>
                <Link href="/categories/home-decor" className="hover:text-purple-400">
                  Home Decor
                </Link>
              </li>
              <li>
                <Link href="/categories/gadgets" className="hover:text-purple-400">
                  Gadgets
                </Link>
              </li>
              <li>
                <Link href="/custom-orders" className="hover:text-purple-400">
                  Custom Orders
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="mb-4 text-lg font-semibold text-white">Information</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="hover:text-purple-400">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-purple-400">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-purple-400">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/shipping" className="hover:text-purple-400">
                  Shipping & Returns
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-purple-400">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="mb-4 text-lg font-semibold text-white">Newsletter</h3>
            <p className="mb-4">
              Subscribe to get special offers and updates on new products. Contact us at{" "}
              <a href="mailto:Designs@PLAyhousecreations.com" className="text-purple-400 hover:underline">
                Designs@PLAyhousecreations.com
              </a>
            </p>
            <div className="flex flex-col space-y-2">
              <Input
                type="email"
                placeholder="Your email"
                className="bg-gray-900 border-gray-800 focus-visible:ring-purple-500"
              />
              <Button className="bg-purple-600 hover:bg-purple-700">Subscribe</Button>
            </div>
          </div>
        </div>
        <div className="mt-12 border-t border-gray-800 pt-8 text-center">
          <p>&copy; {new Date().getFullYear()} PLAyhouse Creations. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
