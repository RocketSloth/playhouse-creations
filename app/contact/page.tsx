"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Mail } from "lucide-react"
import { toast } from "sonner"

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target
    setFormData(prev => ({ ...prev, [id]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await fetch('/api/send-request', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName: formData.name.split(' ')[0],
          lastName: formData.name.split(' ').slice(1).join(' ') || 'N/A',
          email: formData.email,
          message: `Subject: ${formData.subject}\n\n${formData.message}`,
          cartItems: [] // Empty array since this is a contact form
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to send message')
      }

      if (data.success) {
        toast.success('Message sent successfully! We will get back to you soon.')
        setFormData({
          name: "",
          email: "",
          subject: "",
          message: ""
        })
      } else {
        toast.error(data.error || 'Failed to send message. Please try again.')
      }
    } catch (error) {
      console.error('Error sending message:', error)
      toast.error(error instanceof Error ? error.message : 'Failed to send message. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      <div className="container mx-auto px-4 py-12 md:px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl mb-4">Contact Us</h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Have questions about our 3D prints or need a custom design? We're here to help!
            </p>
          </div>

          <div className="flex justify-center mb-12">
            <Card className="bg-gray-900 border-gray-800 max-w-md w-full">
              <CardContent className="pt-6 text-center">
                <Mail className="h-10 w-10 text-purple-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Email</h3>
                <p className="text-gray-300">
                  <a href="mailto:Designs@PLAyhousecreations.com" className="text-purple-400 hover:underline">
                    Designs@PLAyhousecreations.com
                  </a>
                </p>
              </CardContent>
            </Card>
          </div>

          <Card className="bg-gray-900 border-gray-800">
            <CardHeader>
              <CardTitle className="text-2xl">Send Us a Message</CardTitle>
              <CardDescription className="text-gray-400">
                Fill out the form below and we'll get back to you as soon as possible.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label htmlFor="name" className="text-sm font-medium">
                      Name
                    </label>
                    <Input
                      id="name"
                      placeholder="Your name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="bg-gray-800 border-gray-700 focus-visible:ring-purple-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-medium">
                      Email
                    </label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="Your email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="bg-gray-800 border-gray-700 focus-visible:ring-purple-500"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label htmlFor="subject" className="text-sm font-medium">
                    Subject
                  </label>
                  <Input
                    id="subject"
                    placeholder="What is this regarding?"
                    value={formData.subject}
                    onChange={handleInputChange}
                    required
                    className="bg-gray-800 border-gray-700 focus-visible:ring-purple-500"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="message" className="text-sm font-medium">
                    Message
                  </label>
                  <Textarea
                    id="message"
                    placeholder="Your message"
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    className="min-h-[150px] bg-gray-800 border-gray-700 focus-visible:ring-purple-500"
                  />
                </div>
                <Button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="w-full bg-purple-600 hover:bg-purple-700"
                >
                  {isSubmitting ? (
                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  ) : (
                    "Send Message"
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          <div className="mt-12 p-6 bg-gray-900 border border-gray-800 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Custom Design Requests</h2>
            <p className="mb-4">
              Looking for a custom 3D print design? We specialize in bringing your ideas to life! Please include as much
              detail as possible in your message, including:
            </p>
            <ul className="list-disc pl-5 space-y-2 mb-4">
              <li>Description of the item you want created</li>
              <li>Approximate dimensions</li>
              <li>Color preferences</li>
              <li>Any reference images or sketches (can be attached in a follow-up email)</li>
              <li>Timeline requirements</li>
            </ul>
            <p>
              For complex custom designs, we'll schedule a consultation to discuss your project in detail before
              providing a quote.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
