"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Separator } from "@/components/ui/separator"
import { useCart } from "@/components/cart-provider"
import { CheckCircle2, ShoppingCart } from "lucide-react"

export default function OrderRequestPage() {
  const { cartItems, subtotal, clearCart } = useCart()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [requestComplete, setRequestComplete] = useState(false)
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zip: "",
    message: "",
    preferredContact: "email",
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target
    setFormData((prev) => ({ ...prev, [id]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    // Send request to API endpoint
    fetch('/api/send-request', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...formData,
        cartItems,
        subtotal
      }),
    })
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        setRequestComplete(true)
        clearCart()
      } else {
        // Handle error
        alert(data.error || 'Failed to submit request. Please try again.')
      }
    })
    .catch(error => {
      console.error('Error submitting request:', error)
      alert('Failed to submit request. Please try again.')
    })
    .finally(() => {
      setIsSubmitting(false)
    })
  }

  if (requestComplete) {
    return (
      <div className="min-h-screen bg-gray-950 text-gray-100 py-12">
        <div className="container mx-auto px-4 max-w-3xl">
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                <CheckCircle2 className="h-8 w-8 text-green-600" />
              </div>
              <CardTitle className="text-2xl">Order Request Submitted!</CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <p>
                Thank you for your order request with PLAyhouse Creations. We've received your request and will get back to you within 1-2 business days with pricing and availability.
              </p>
              <p>
                Request #: <span className="font-medium">REQ-{Math.floor(100000 + Math.random() * 900000)}</span>
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

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl mb-4">Request an Order</h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Fill out the form below to request pricing and availability for your desired items.
            </p>
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
            <div className="flex-1">
              <form onSubmit={handleSubmit} className="space-y-6">
                <Card className="bg-gray-900 border-gray-800">
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
                    <div className="space-y-2">
                      <Label>Preferred Contact Method</Label>
                      <RadioGroup 
                        value={formData.preferredContact} 
                        onValueChange={(value) => setFormData(prev => ({...prev, preferredContact: value}))}
                        className="flex flex-col space-y-1"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="email" id="contact-email" />
                          <Label htmlFor="contact-email">Email</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="phone" id="contact-phone" />
                          <Label htmlFor="contact-phone">Phone</Label>
                        </div>
                      </RadioGroup>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gray-900 border-gray-800">
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
                        <Input
                          id="state"
                          value={formData.state}
                          onChange={handleInputChange}
                          required
                          className="bg-gray-800 border-gray-700 focus-visible:ring-purple-500"
                        />
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

                <Card className="bg-gray-900 border-gray-800">
                  <CardHeader>
                    <CardTitle className="text-lg">Additional Information</CardTitle>
                    <CardDescription className="text-gray-400">
                      Please provide any additional details about your order request.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <Label htmlFor="message">Message</Label>
                      <Textarea
                        id="message"
                        value={formData.message}
                        onChange={handleInputChange}
                        placeholder="Special requests, custom modifications, quantity needs, timeline requirements, etc."
                        className="min-h-[150px] bg-gray-800 border-gray-700 focus-visible:ring-purple-500"
                      />
                    </div>
                  </CardContent>
                </Card>

                <div className="flex justify-end">
                  <Button 
                    type="submit" 
                    disabled={isSubmitting} 
                    className="bg-purple-600 hover:bg-purple-700"
                  >
                    {isSubmitting ? (
                      <div className="h-5 w-5 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    ) : (
                      "Submit Order Request"
                    )}
                  </Button>
                </div>
              </form>
            </div>

            {/* Order Summary */}
            <div className="lg:w-[380px]">
              <Card className="bg-gray-900 border-gray-800">
                <CardHeader>
                  <CardTitle className="text-lg">Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {cartItems.length === 0 ? (
                    <p className="text-gray-400">Your cart is empty</p>
                  ) : (
                    <>
                      <div className="space-y-4 max-h-[350px] overflow-y-auto pr-2">
                        {cartItems.map((item) => (
                          <div key={item.id} className="flex gap-3">
                            <div className="relative h-16 w-16 rounded-md overflow-hidden flex-shrink-0">
                              <Image 
                                src={item.image} 
                                alt={item.name} 
                                fill 
                                className="object-cover" 
                              />
                            </div>
                            <div className="flex-1">
                              <h4 className="font-medium text-sm">{item.name}</h4>
                              <p className="text-sm text-gray-400">${item.price.toFixed(2)} x {item.quantity}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                      <Separator className="bg-gray-800" />
                      <div className="flex justify-between text-sm">
                        <span>Subtotal</span>
                        <span>${subtotal.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-sm text-gray-400">
                        <span>Shipping & Tax</span>
                        <span>To be calculated</span>
                      </div>
                      <p className="text-sm text-gray-400 mt-4">
                        Note: This is a request only. We will contact you with final pricing, shipping costs, and payment options after reviewing your request.
                      </p>
                    </>
                  )}
                </CardContent>
                <CardFooter>
                  {cartItems.length === 0 && (
                    <Button asChild className="w-full bg-purple-600 hover:bg-purple-700">
                      <Link href="/products">
                        <ShoppingCart className="mr-2 h-4 w-4" /> Shop Products
                      </Link>
                    </Button>
                  )}
                </CardFooter>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 