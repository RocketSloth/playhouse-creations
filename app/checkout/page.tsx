"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Elements } from "@stripe/react-stripe-js"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { useCart } from "@/components/cart-provider"
import { ChevronLeft, CreditCard, Truck } from "lucide-react"
import { getStripe } from "@/lib/stripe"
import PaymentForm from "@/components/payment-form"

export default function CheckoutPage() {
  const { cartItems, subtotal, clearCart } = useCart()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [orderComplete, setOrderComplete] = useState(false)
  const [clientSecret, setClientSecret] = useState("")
  const [paymentStep, setPaymentStep] = useState<"details" | "payment">("details")
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    address2: "",
    city: "",
    state: "",
    zip: "",
    shippingMethod: "standard",
  })

  const shipping = formData.shippingMethod === "standard" ? 4.99 : 9.99
  const tax = subtotal * 0.07
  const total = subtotal + shipping + tax

  useEffect(() => {
    // If cart is empty, don't try to create a payment intent
    if (cartItems.length === 0) return

    // Only create payment intent when we reach the payment step
    if (paymentStep === "payment") {
      fetch("/api/create-payment-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: total,
          items: cartItems,
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.clientSecret) {
            setClientSecret(data.clientSecret)
          }
        })
        .catch((error) => {
          console.error("Error creating payment intent:", error)
        })
    }
  }, [paymentStep, cartItems, total])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target
    setFormData((prev) => ({ ...prev, [id]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmitDetails = (e: React.FormEvent) => {
    e.preventDefault()
    setPaymentStep("payment")
    window.scrollTo(0, 0)
  }

  const handlePaymentSuccess = () => {
    setOrderComplete(true)
    clearCart()
  }

  if (orderComplete) {
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
              <p>A confirmation email has been sent to {formData.email}.</p>
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

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-950 text-gray-100 py-12">
        <div className="container mx-auto px-4 max-w-3xl text-center">
          <h1 className="text-2xl font-bold mb-4">Your cart is empty</h1>
          <p className="mb-6">Add some products to your cart to proceed with checkout.</p>
          <Button asChild className="bg-purple-600 hover:bg-purple-700">
            <Link href="/products">
              <ChevronLeft className="mr-2 h-4 w-4" /> Browse Products
            </Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 py-12">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Checkout Form */}
          <div className="flex-1">
            <h1 className="text-2xl font-bold mb-6">Checkout</h1>

            {paymentStep === "details" ? (
              <form onSubmit={handleSubmitDetails}>
                {/* Contact Information */}
                <Card className="bg-gray-900 border-gray-800 mb-6">
                  <CardHeader>
                    <CardTitle className="text-lg">Contact Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="firstName">First Name</Label>
                        <Input
                          id="firstName"
                          value={formData.firstName}
                          onChange={handleInputChange}
                          required
                          className="bg-gray-800 border-gray-700 focus-visible:ring-purple-500"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input
                          id="lastName"
                          value={formData.lastName}
                          onChange={handleInputChange}
                          required
                          className="bg-gray-800 border-gray-700 focus-visible:ring-purple-500"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        className="bg-gray-800 border-gray-700 focus-visible:ring-purple-500"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={handleInputChange}
                        required
                        className="bg-gray-800 border-gray-700 focus-visible:ring-purple-500"
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Shipping Address */}
                <Card className="bg-gray-900 border-gray-800 mb-6">
                  <CardHeader>
                    <CardTitle className="text-lg">Shipping Address</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="address">Street Address</Label>
                      <Input
                        id="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        required
                        className="bg-gray-800 border-gray-700 focus-visible:ring-purple-500"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="address2">Apartment, suite, etc. (optional)</Label>
                      <Input
                        id="address2"
                        value={formData.address2}
                        onChange={handleInputChange}
                        className="bg-gray-800 border-gray-700 focus-visible:ring-purple-500"
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="city">City</Label>
                        <Input
                          id="city"
                          value={formData.city}
                          onChange={handleInputChange}
                          required
                          className="bg-gray-800 border-gray-700 focus-visible:ring-purple-500"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="state">State</Label>
                        <Select value={formData.state} onValueChange={(value) => handleSelectChange("state", value)}>
                          <SelectTrigger className="bg-gray-800 border-gray-700 focus:ring-purple-500">
                            <SelectValue placeholder="Select" />
                          </SelectTrigger>
                          <SelectContent className="bg-gray-900 border-gray-800">
                            <SelectItem value="AL">Alabama</SelectItem>
                            <SelectItem value="AK">Alaska</SelectItem>
                            <SelectItem value="AZ">Arizona</SelectItem>
                            <SelectItem value="CA">California</SelectItem>
                            <SelectItem value="CO">Colorado</SelectItem>
                            <SelectItem value="FL">Florida</SelectItem>
                            <SelectItem value="NY">New York</SelectItem>
                            <SelectItem value="TX">Texas</SelectItem>
                            {/* Add more states as needed */}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="zip">ZIP Code</Label>
                        <Input
                          id="zip"
                          value={formData.zip}
                          onChange={handleInputChange}
                          required
                          className="bg-gray-800 border-gray-700 focus-visible:ring-purple-500"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Shipping Method */}
                <Card className="bg-gray-900 border-gray-800 mb-6">
                  <CardHeader>
                    <CardTitle className="text-lg">Shipping Method</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <RadioGroup
                      defaultValue="standard"
                      value={formData.shippingMethod}
                      onValueChange={(value) => handleSelectChange("shippingMethod", value)}
                    >
                      <div className="flex items-center justify-between border border-gray-800 rounded-md p-4 mb-2">
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="standard" id="standard" />
                          <Label htmlFor="standard" className="flex items-center">
                            <Truck className="mr-2 h-4 w-4" />
                            Standard Shipping (3-5 business days)
                          </Label>
                        </div>
                        <div className="font-medium">$4.99</div>
                      </div>
                      <div className="flex items-center justify-between border border-gray-800 rounded-md p-4">
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="express" id="express" />
                          <Label htmlFor="express" className="flex items-center">
                            <Truck className="mr-2 h-4 w-4" />
                            Express Shipping (1-2 business days)
                          </Label>
                        </div>
                        <div className="font-medium">$9.99</div>
                      </div>
                    </RadioGroup>
                  </CardContent>
                </Card>

                <div className="flex items-center space-x-2 mb-6">
                  <Checkbox id="terms" required />
                  <Label htmlFor="terms" className="text-sm">
                    I agree to the terms and conditions and privacy policy
                  </Label>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <Button type="submit" className="bg-purple-600 hover:bg-purple-700" size="lg">
                    Continue to Payment
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    className="border-gray-800 text-gray-300 hover:bg-gray-800"
                    asChild
                  >
                    <Link href="/products">
                      <ChevronLeft className="mr-2 h-4 w-4" /> Continue Shopping
                    </Link>
                  </Button>
                </div>
              </form>
            ) : (
              <div className="space-y-6">
                <Card className="bg-gray-900 border-gray-800 mb-6">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center">
                      <CreditCard className="mr-2 h-5 w-5" /> Payment
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {clientSecret ? (
                      <Elements
                        stripe={getStripe()}
                        options={{
                          clientSecret,
                          appearance: {
                            theme: "night",
                            variables: {
                              colorPrimary: "#9333ea",
                              colorBackground: "#111827",
                              colorText: "#f9fafb",
                              colorDanger: "#ef4444",
                            },
                          },
                        }}
                      >
                        <PaymentForm onSuccess={handlePaymentSuccess} total={total} />
                      </Elements>
                    ) : (
                      <div className="flex justify-center py-8">
                        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Button
                  variant="outline"
                  className="border-gray-800 text-gray-300 hover:bg-gray-800"
                  onClick={() => setPaymentStep("details")}
                >
                  <ChevronLeft className="mr-2 h-4 w-4" /> Back to Details
                </Button>
              </div>
            )}
          </div>

          {/* Order Summary */}
          <div className="lg:w-1/3">
            <Card className="bg-gray-900 border-gray-800 sticky top-6">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Cart Items */}
                <div className="space-y-4">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex gap-4">
                      <div className="relative h-16 w-16 rounded-md overflow-hidden flex-shrink-0">
                        <Image src={item.image || "/placeholder.svg"} alt={item.name} fill className="object-cover" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium">{item.name}</h4>
                        <div className="flex justify-between text-sm text-gray-400">
                          <span>Qty: {item.quantity}</span>
                          <span>${(item.price * item.quantity).toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <Separator className="bg-gray-800" />

                {/* Totals */}
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span>${shipping.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax</span>
                    <span>${tax.toFixed(2)}</span>
                  </div>
                </div>

                <Separator className="bg-gray-800" />

                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
