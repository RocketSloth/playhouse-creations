"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"
import { cn } from "@/lib/utils"
import { Menu, Search, ShoppingCart, X } from "lucide-react"
import { useCart } from "@/components/cart-provider"
import CartDrawer from "@/components/cart-drawer"

export default function Navbar() {
  const pathname = usePathname()
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [isCartOpen, setIsCartOpen] = useState(false)
  const { cartItems } = useCart()

  const totalItems = cartItems.reduce((total, item) => total + item.quantity, 0)

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-800 bg-gray-950/80 backdrop-blur-sm">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-2 md:gap-6">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="bg-gray-950 text-gray-100 border-gray-800">
              <nav className="grid gap-6 text-lg font-medium">
                <Link
                  href="/"
                  className={cn(
                    "hover:text-purple-400 transition-colors",
                    pathname === "/" ? "text-purple-400" : "text-gray-100",
                  )}
                >
                  Home
                </Link>
                <Link
                  href="/products"
                  className={cn(
                    "hover:text-purple-400 transition-colors",
                    pathname === "/products" ? "text-purple-400" : "text-gray-100",
                  )}
                >
                  Products
                </Link>
                <Link
                  href="/categories"
                  className={cn(
                    "hover:text-purple-400 transition-colors",
                    pathname === "/categories" ? "text-purple-400" : "text-gray-100",
                  )}
                >
                  Categories
                </Link>
                <Link
                  href="/contact"
                  className={cn(
                    "hover:text-purple-400 transition-colors",
                    pathname === "/contact" ? "text-purple-400" : "text-gray-100",
                  )}
                >
                  Contact
                </Link>
              </nav>
            </SheetContent>
          </Sheet>

          <Link href="/" className="flex items-center gap-2">
            <span className="text-xl font-bold tracking-tight">PLAyhouse Creations</span>
          </Link>
        </div>

        <NavigationMenu className="hidden md:flex">
          <NavigationMenuList>
            <NavigationMenuItem>
              <Link href="/" legacyBehavior passHref>
                <NavigationMenuLink className={navigationMenuTriggerStyle()}>Home</NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuTrigger>Products</NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                  <li className="row-span-3">
                    <NavigationMenuLink asChild>
                      <a
                        className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-purple-500 to-purple-900 p-6 no-underline outline-none focus:shadow-md"
                        href="/products"
                      >
                        <div className="mt-4 mb-2 text-lg font-medium text-white">Featured Products</div>
                        <p className="text-sm leading-tight text-white/90">
                          Check out our most popular 3D printed creations
                        </p>
                      </a>
                    </NavigationMenuLink>
                  </li>
                  <li>
                    <Link href="/categories/figurines" legacyBehavior passHref>
                      <NavigationMenuLink className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-gray-800 hover:text-purple-400">
                        <div className="text-sm font-medium leading-none">Figurines</div>
                        <p className="line-clamp-2 text-sm leading-snug text-gray-400">
                          Character models and collectible figurines
                        </p>
                      </NavigationMenuLink>
                    </Link>
                  </li>
                  <li>
                    <Link href="/categories/home-decor" legacyBehavior passHref>
                      <NavigationMenuLink className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-gray-800 hover:text-purple-400">
                        <div className="text-sm font-medium leading-none">Home Decor</div>
                        <p className="line-clamp-2 text-sm leading-snug text-gray-400">
                          Decorative items for your living space
                        </p>
                      </NavigationMenuLink>
                    </Link>
                  </li>
                  <li>
                    <Link href="/categories/gadgets" legacyBehavior passHref>
                      <NavigationMenuLink className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-gray-800 hover:text-purple-400">
                        <div className="text-sm font-medium leading-none">Gadgets</div>
                        <p className="line-clamp-2 text-sm leading-snug text-gray-400">
                          Functional 3D printed tools and gadgets
                        </p>
                      </NavigationMenuLink>
                    </Link>
                  </li>
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link href="/contact" legacyBehavior passHref>
                <NavigationMenuLink className={navigationMenuTriggerStyle()}>Contact</NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>

        <div className="flex items-center gap-4">
          {isSearchOpen ? (
            <div className="flex items-center">
              <Input
                type="search"
                placeholder="Search..."
                className="w-[200px] bg-gray-900 border-gray-800 focus-visible:ring-purple-500"
                autoFocus
              />
              <Button variant="ghost" size="icon" onClick={() => setIsSearchOpen(false)}>
                <X className="h-5 w-5" />
                <span className="sr-only">Close search</span>
              </Button>
            </div>
          ) : (
            <Button variant="ghost" size="icon" onClick={() => setIsSearchOpen(true)}>
              <Search className="h-5 w-5" />
              <span className="sr-only">Search</span>
            </Button>
          )}

          <Button variant="ghost" size="icon" className="relative" onClick={() => setIsCartOpen(true)}>
            <ShoppingCart className="h-5 w-5" />
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-purple-600 text-xs font-bold">
                {totalItems}
              </span>
            )}
            <span className="sr-only">Open cart</span>
          </Button>

          <CartDrawer open={isCartOpen} setOpen={setIsCartOpen} />
        </div>
      </div>
    </header>
  )
}
