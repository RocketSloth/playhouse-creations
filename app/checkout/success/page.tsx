"use client"

import { useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useCart } from "@/components/cart-provider"

export default function CheckoutSuccessPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { clearCart } = useCart()

  useEffect(() => {
    // Check if we have a payment_intent parameter
    const paymentIntent = searchParams.get("payment_intent")

    if (paymentIntent) {
      // Clear the cart on successful payment
      clearCart()
    } else {
      // If no payment intent, redirect to checkout
      router.push("/checkout")
    }
  }, [searchParams, clearCart, router])

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 py-12">
      <div className="container mx-auto px-4 max-w-3xl">
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
              <svg
                className="h-8 w-8 text-green-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <CardTitle className="text-2xl">Order Confirmed!</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p>
              Thank you for your order with PLAyhouse Creations. We've received your payment and will begin processing
              your items right away.
            </p>
            <p>
              Order #: <span className="font-medium">ORD-{Math.floor(100000 + Math.random() * 900000)}</span>
            </p>
            <p>A confirmation email has been sent to your email address.</p>
          </CardContent>
          <CardFooter className="flex justify-center">
            <Button asChild className="bg-purple-600 hover:bg-purple-700">
              <Link href="/products">Continue Shopping</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
