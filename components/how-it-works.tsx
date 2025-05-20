import { Upload, Calculator, CreditCard, Package } from "lucide-react"

export default function HowItWorks() {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <div className="inline-block rounded-lg bg-gray-100 px-3 py-1 text-sm">Process</div>
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">How It Works</h2>
            <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Get your AI-powered 3D print quote in four simple steps
            </p>
          </div>
        </div>
        <div className="mx-auto grid max-w-5xl items-start gap-6 py-12 lg:grid-cols-4">
          <div className="grid gap-4 text-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary text-primary-foreground mx-auto">
              <Upload className="h-10 w-10" />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-bold">1. Upload Your File</h3>
              <p className="text-gray-500">Upload your STL, OBJ, or 3MF file to our secure platform.</p>
            </div>
          </div>
          <div className="grid gap-4 text-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary text-primary-foreground mx-auto">
              <Calculator className="h-10 w-10" />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-bold">2. Select Options</h3>
              <p className="text-gray-500">Choose your material, finish quality, and delivery region.</p>
            </div>
          </div>
          <div className="grid gap-4 text-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary text-primary-foreground mx-auto">
              <CreditCard className="h-10 w-10" />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-bold">3. Pay $5 Fee</h3>
              <p className="text-gray-500">Make a secure payment to receive your AI-generated quote.</p>
            </div>
          </div>
          <div className="grid gap-4 text-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary text-primary-foreground mx-auto">
              <Package className="h-10 w-10" />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-bold">4. Get Your Quote</h3>
              <p className="text-gray-500">
                Receive a detailed AI-powered breakdown with current pricing and optimal settings.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
