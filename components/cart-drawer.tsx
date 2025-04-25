"use client"

import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { 
  Sheet, 
  SheetContent, 
  SheetDescription, 
  SheetFooter, 
  SheetHeader, 
  SheetTitle, 
  SheetTrigger 
} from "@/components/ui/sheet"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Minus, Plus, ShoppingCart, ClipboardList } from "lucide-react"
import { useCart } from "@/components/cart-provider"
import { useState, useEffect } from "react"

export default function CartDrawer() {
  const { cartItems, updateCartItem, removeCartItem, subtotal } = useCart()
  const [isOpen, setIsOpen] = useState(false)

  // Close sheet when escape key is pressed
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false)
    }
    window.addEventListener("keydown", handleEscape)
    return () => window.removeEventListener("keydown", handleEscape)
  }, [])

  // Update cart count badge
  useEffect(() => {
    const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0)
    document.documentElement.style.setProperty("--cart-count", cartCount.toString())
  }, [cartItems])

  const updateQuantity = (id: string, newQuantity: number) => {
    if (newQuantity < 1) return
    updateCartItem(id, newQuantity)
  }

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button 
          variant="outline" 
          size="icon" 
          className="relative border-0 bg-transparent hover:bg-gray-800"
          aria-label="Open cart"
        >
          <ShoppingCart className="h-5 w-5" />
          {cartItems.length > 0 && (
            <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-purple-600 text-xs text-white">
              {cartItems.reduce((total, item) => total + item.quantity, 0)}
            </span>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-md border-l border-gray-800 bg-gray-900 pr-0 text-gray-100">
        <SheetHeader className="px-1 text-left">
          <SheetTitle className="text-gray-100">Your Cart</SheetTitle>
          <SheetDescription className="text-gray-400">
            {cartItems.length === 0 
              ? "Your cart is empty" 
              : `${cartItems.reduce((acc, item) => acc + item.quantity, 0)} item${cartItems.reduce((acc, item) => acc + item.quantity, 0) > 1 ? "s" : ""} in your cart`
            }
          </SheetDescription>
        </SheetHeader>
        
        {cartItems.length > 0 ? (
          <>
            <ScrollArea className="h-[60vh] pb-6 pl-1 pr-4">
              <div className="flex flex-col gap-4 pt-4">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex gap-4">
                    <div className="relative h-16 w-16 rounded-md overflow-hidden flex-shrink-0">
                      <Image 
                        src={item.image} 
                        alt={item.name} 
                        fill 
                        className="object-cover" 
                      />
                    </div>
                    <div className="flex flex-1 flex-col">
                      <div className="flex justify-between">
                        <h3 className="font-medium text-sm">{item.name}</h3>
                        <span className="text-sm font-medium">
                          ${(item.price * item.quantity).toFixed(2)}
                        </span>
                      </div>
                      <p className="text-xs text-gray-400">${item.price.toFixed(2)} each</p>
                      <div className="flex justify-between items-center mt-2">
                        <div className="flex items-center border border-gray-700 rounded-md">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-7 w-7 rounded-none hover:bg-gray-800"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <Input
                            type="number"
                            min="1"
                            className="h-7 w-10 border-0 bg-transparent p-0 text-center text-xs focus-visible:ring-0 focus-visible:ring-offset-0"
                            value={item.quantity}
                            onChange={(e) => {
                              const value = parseInt(e.target.value);
                              if (!isNaN(value) && value > 0) {
                                updateQuantity(item.id, value);
                              }
                            }}
                          />
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-7 w-7 rounded-none hover:bg-gray-800"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                        <button
                          onClick={() => removeCartItem(item.id)}
                          className="text-xs text-gray-400 hover:text-gray-300"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
            
            <div className="pl-1 pr-4">
              <Separator className="my-4 bg-gray-800" />
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm">Subtotal</span>
                  <span className="font-medium">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Shipping</span>
                  <span className="text-gray-400">Calculated at request</span>
                </div>
              </div>
              <SheetFooter className="mt-4 sm:justify-start">
                <Button 
                  asChild 
                  className="w-full bg-purple-600 hover:bg-purple-700"
                  onClick={() => setIsOpen(false)}
                >
                  <Link href="/request">
                    <ClipboardList className="mr-2 h-4 w-4" />
                    Request Quote
                  </Link>
                </Button>
              </SheetFooter>
              <p className="mt-4 text-xs text-gray-400 pl-1">
                Please note: This is a request only. We'll respond with pricing, shipping costs, and payment options within 1-2 business days.
              </p>
            </div>
          </>
        ) : (
          <div className="flex h-[60vh] flex-col items-center justify-center gap-2 text-center">
            <ShoppingCart className="h-10 w-10 text-gray-500" />
            <h3 className="font-medium">Your cart is empty</h3>
            <p className="text-sm text-gray-400">
              Add items to your cart to request a quote
            </p>
            <Button 
              asChild 
              className="mt-4 bg-purple-600 hover:bg-purple-700"
              onClick={() => setIsOpen(false)}
            >
              <Link href="/products">
                Continue Shopping
              </Link>
            </Button>
          </div>
        )}
      </SheetContent>
    </Sheet>
  )
}
