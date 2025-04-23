import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { StarIcon } from "lucide-react"

const testimonials = [
  {
    id: 1,
    name: "Alex Johnson",
    avatar: "/placeholder.svg?height=80&width=80",
    rating: 5,
    text: "The quality of these 3D prints from PLAyhouse Creations is outstanding. I ordered a custom figurine and the detail is incredible. Will definitely order again!",
  },
  {
    id: 2,
    name: "Sarah Williams",
    avatar: "/placeholder.svg?height=80&width=80",
    rating: 5,
    text: "Fast shipping and excellent customer service. The geometric planter I ordered looks even better in person than in the photos.",
  },
  {
    id: 3,
    name: "Michael Chen",
    avatar: "/placeholder.svg?height=80&width=80",
    rating: 4,
    text: "I've ordered multiple items from PLAyhouse Creations and have been impressed with the consistency in quality. The phone stand is particularly useful.",
  },
]

export default function Testimonials() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {testimonials.map((testimonial) => (
        <Card key={testimonial.id} className="bg-gray-900 border-gray-800">
          <CardContent className="p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="relative h-12 w-12 rounded-full overflow-hidden">
                <Image
                  src={testimonial.avatar || "/placeholder.svg?height=80&width=80"}
                  alt={testimonial.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <h4 className="font-semibold">{testimonial.name}</h4>
                <div className="flex">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <StarIcon
                      key={i}
                      className={`h-4 w-4 ${i < testimonial.rating ? "text-yellow-400" : "text-gray-600"}`}
                      fill={i < testimonial.rating ? "currentColor" : "none"}
                    />
                  ))}
                </div>
              </div>
            </div>
            <p className="text-gray-300 italic">&ldquo;{testimonial.text}&rdquo;</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
