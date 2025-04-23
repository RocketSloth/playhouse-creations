import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      <div className="container mx-auto px-4 py-8 md:px-6">
        {/* Breadcrumb skeleton */}
        <div className="flex items-center gap-2 mb-6">
          <Skeleton className="h-4 w-20 bg-gray-800" />
          <Skeleton className="h-4 w-4 bg-gray-800" />
          <Skeleton className="h-4 w-20 bg-gray-800" />
          <Skeleton className="h-4 w-4 bg-gray-800" />
          <Skeleton className="h-4 w-24 bg-gray-800" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {/* Product image skeleton */}
          <div className="space-y-4">
            <Skeleton className="aspect-square w-full rounded-lg bg-gray-800" />
            <div className="flex gap-2">
              <Skeleton className="h-20 w-20 rounded-md bg-gray-800" />
              <Skeleton className="h-20 w-20 rounded-md bg-gray-800" />
              <Skeleton className="h-20 w-20 rounded-md bg-gray-800" />
            </div>
          </div>

          {/* Product info skeleton */}
          <div className="space-y-6">
            <div>
              <Skeleton className="h-4 w-24 mb-2 bg-gray-800" />
              <Skeleton className="h-8 w-64 mb-2 bg-gray-800" />
              <Skeleton className="h-6 w-32 mb-2 bg-gray-800" />
            </div>
            <Skeleton className="h-20 w-full bg-gray-800" />
            <div className="space-y-4">
              <Skeleton className="h-6 w-32 bg-gray-800" />
              <div className="flex gap-3">
                <Skeleton className="h-16 w-16 rounded-md bg-gray-800" />
                <Skeleton className="h-16 w-16 rounded-md bg-gray-800" />
                <Skeleton className="h-16 w-16 rounded-md bg-gray-800" />
                <Skeleton className="h-16 w-16 rounded-md bg-gray-800" />
                <Skeleton className="h-16 w-16 rounded-md bg-gray-800" />
              </div>
            </div>
            <div className="flex gap-4">
              <Skeleton className="h-12 flex-1 bg-gray-800" />
              <Skeleton className="h-12 w-12 bg-gray-800" />
              <Skeleton className="h-12 w-12 bg-gray-800" />
            </div>
          </div>
        </div>

        {/* Tabs skeleton */}
        <div className="mb-12">
          <div className="flex gap-2 mb-2">
            <Skeleton className="h-10 w-24 bg-gray-800" />
            <Skeleton className="h-10 w-24 bg-gray-800" />
            <Skeleton className="h-10 w-24 bg-gray-800" />
          </div>
          <Skeleton className="h-64 w-full bg-gray-800" />
        </div>
      </div>
    </div>
  )
}
