import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="text-center">
        <h1 className="text-6xl font-bold tracking-tight glow-text bg-gradient-to-r from-cyber-blue to-cyber-purple bg-clip-text text-transparent mb-4">
          404
        </h1>
        <h2 className="text-2xl font-medium text-cyber-blue mb-6">Page Not Found</h2>
        <p className="text-muted-foreground mb-8">The page you are looking for doesn't exist or has been moved.</p>
        <Button asChild className="bg-cyber-blue hover:bg-cyber-blue/80 text-black btn-hover-effect">
          <Link href="/">Return Home</Link>
        </Button>
      </div>
    </div>
  )
}
