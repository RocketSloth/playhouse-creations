import type React from "react"
import "@/app/globals.css"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import { Particles } from "@/components/particles"
import { AuthProvider } from "@/contexts/auth-context"
import { Toaster } from "@/components/ui/toaster"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "PLAyhouse Creations - 3D Print Quote Calculator",
  description: "Get accurate pricing estimates for your 3D printing projects",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} antialiased min-h-screen`}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          <AuthProvider>
            <div className="relative min-h-screen overflow-hidden">
              <div className="fixed inset-0 bg-cyber-grid bg-cyber-grid z-0"></div>
              <Particles className="fixed inset-0 z-10" />
              <div className="relative z-20">{children}</div>
              <Toaster />
            </div>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
