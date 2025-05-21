import { Mail } from "lucide-react"

export function Footer() {
  return (
    <footer className="mt-12 py-6 border-t border-cyber-blue/20 relative z-10">
      <div className="container max-w-5xl mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <p className="font-medium text-lg bg-gradient-to-r from-cyber-blue to-cyber-purple bg-clip-text text-transparent">
              PLAyhouse Creations
            </p>
            <p className="text-sm text-muted-foreground">Quality 3D printing services</p>
          </div>

          <div className="flex items-center glass px-4 py-2 rounded-md">
            <Mail className="h-4 w-4 mr-2 text-cyber-blue" />
            <a href="mailto:designs@playhousecreations.com" className="text-sm hover:text-cyber-blue transition-colors">
              designs@playhousecreations.com
            </a>
          </div>
        </div>

        <div className="mt-6 text-center text-xs text-muted-foreground">
          <p>© {new Date().getFullYear()} PLAyhouse Creations. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
