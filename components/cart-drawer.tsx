"use client"

import Image from "next/image"
import Link from "next/link"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Minus, Plus, Trash2 } from "lucide-react"
import { useCart } from "@/components/cart-provider"
import { Separator } from "@/components/ui/separator"

interface CartDrawerProps {
  open: boolean
  setOpen: (open: boolean) => void
}

export default function CartDrawer({ open, setOpen }: CartDrawerProps) {
  const { cartItems, removeFromCart, updateQuantity, subtotal } = useCart()

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent className="w-full sm:max-w-md bg-gray-950 text-gray-100 border-gray-800">
        <SheetHeader>
          <SheetTitle className="text-gray-100">Your Cart</SheetTitle>
        </SheetHeader>

        {cartItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-[70vh]">
            <p className="text-gray-400 mb-4">Your cart is empty</p>
            <Button onClick={() => setOpen(false)} className="bg-purple-600 hover:bg-purple-700" asChild>
              <Link href="/products">Continue Shopping</Link>
            </Button>
          </div>
        ) : (
          <>
            <div className="flex flex-col gap-4 my-6 overflow-y-auto max-h-[calc(100vh-220px)]">
              {cartItems.map((item) => (
                <div key={item.id} className="flex gap-4">
                  <div className="relative h-20 w-20 rounded-md overflow-hidden flex-shrink-0">
                    <Image
                      src={item.image || "/placeholder.svg?height=80&width=80"}
                      alt={item.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex flex-col flex-1">
                    <h4 className="font-medium">{item.name}</h4>
                    <p className="text-sm text-gray-400">${item.price.toFixed(2)}</p>
                    <div className="flex items-center mt-auto">
                      <div className="flex items-center border border-gray-800 rounded-md">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 rounded-none text-gray-400 hover:text-white"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        >
                          <Minus className="h-3 w-3" />
                          <span className="sr-only">Decrease quantity</span>
                        </Button>
                        <span className="w-8 text-center">{item.quantity}</span>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 rounded-none text-gray-400 hover:text-white"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        >
                          <Plus className="h-3 w-3" />
                          <span className="sr-only">Increase quantity</span>
                        </Button>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="ml-auto text-gray-400 hover:text-red-500"
                        onClick={() => removeFromCart(item.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Remove item</span>
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-4 mt-auto">
              <Separator className="bg-gray-800" />
              <div className="flex justify-between">
                <span className="font-medium">Subtotal</span>
                <span className="font-medium">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-400">
                <span>Shipping</span>
                <span>Calculated at checkout</span>
              </div>
              <Separator className="bg-gray-800" />
              <div className="flex justify-between font-bold">
                <span>Total</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>

              <SheetFooter className="flex flex-col gap-2 sm:flex-col">
                <Button className="w-full bg-purple-600 hover:bg-purple-700" asChild>
                  <Link href="/checkout">Checkout</Link>
                </Button>
                <Button
                  variant="outline"
                  className="w-full border-gray-800 text-gray-300 hover:bg-gray-800"
                  onClick={() => setOpen(false)}
                >
                  Continue Shopping
                </Button>
              </SheetFooter>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  )
}
