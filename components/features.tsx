import { Clock, DollarSign, Settings, FileCheck, Globe, Brain } from "lucide-react"

export default function Features() {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-50">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <div className="inline-block rounded-lg bg-gray-100 px-3 py-1 text-sm">Features</div>
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Why Choose Our Quote Tool?</h2>
            <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Our AI-powered 3D print quote tool provides accurate, instant pricing for any 3D model, saving you time
              and money.
            </p>
          </div>
        </div>
        <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-3">
          <div className="grid gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Brain className="h-6 w-6" />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-bold">AI-Powered Analysis</h3>
              <p className="text-gray-500">
                Our AI analyzes your model in detail to provide the most accurate pricing and print settings.
              </p>
            </div>
          </div>
          <div className="grid gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Clock className="h-6 w-6" />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-bold">Instant Quotes</h3>
              <p className="text-gray-500">
                Get accurate pricing in seconds, not days. No more waiting for email responses.
              </p>
            </div>
          </div>
          <div className="grid gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <DollarSign className="h-6 w-6" />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-bold">Real-Time Pricing</h3>
              <p className="text-gray-500">
                Our AI fetches current market prices to ensure your quote reflects today's costs.
              </p>
            </div>
          </div>
          <div className="grid gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Settings className="h-6 w-6" />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-bold">Optimal Settings</h3>
              <p className="text-gray-500">
                Get AI-recommended print settings for the best results with your specific model.
              </p>
            </div>
          </div>
          <div className="grid gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <FileCheck className="h-6 w-6" />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-bold">Free AI Validation</h3>
              <p className="text-gray-500">
                Check if your model is printable before you commit with our free AI-powered STL validator.
              </p>
            </div>
          </div>
          <div className="grid gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Globe className="h-6 w-6" />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-bold">Region-Specific</h3>
              <p className="text-gray-500">
                Get localized pricing based on your region's current material costs and shipping rates.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
