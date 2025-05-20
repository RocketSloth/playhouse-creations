import { Mail } from "lucide-react"

export default function Footer() {
  return (
    <footer className="w-full border-t bg-gray-100">
      <div className="container px-4 md:px-6 py-12">
        <div className="grid gap-8 lg:grid-cols-2">
          <div className="space-y-4">
            <h3 className="text-xl font-bold">3D Print Quoter</h3>
            <p className="text-gray-500">
              Get instant, accurate quotes for your 3D printing projects. Upload your file, select your options, and get
              a detailed price breakdown in seconds.
            </p>
          </div>
          <div className="space-y-4">
            <h3 className="text-xl font-bold">Contact Us</h3>
            <ul className="space-y-2">
              <li className="flex items-start">
                <Mail className="mr-2 h-5 w-5 text-gray-500" />
                <span className="text-gray-500">support@3dprintquoter.com</span>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-8 border-t pt-8">
          <p className="text-center text-gray-500">© 2025 3D Print Quoter. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
