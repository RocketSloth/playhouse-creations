import type React from "react"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import { AuthProvider } from "@/contexts/auth-context"
import { DemoProvider } from "@/contexts/demo-context"
import { Particles } from "@/components/particles"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "PLAyhouse Creations - 3D Print Quote Calculator",
  description: "Get accurate pricing estimates for your 3D printing projects",
    generator: 'v0.dev'
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} min-h-screen bg-background text-foreground`}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false} disableTransitionOnChange>
          <DemoProvider>
            <AuthProvider>
              <div className="relative min-h-screen">
                <Particles className="fixed inset-0 z-0" />
                <div className="relative z-10">{children}</div>
              </div>
              <Toaster />
            </AuthProvider>
          </DemoProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
