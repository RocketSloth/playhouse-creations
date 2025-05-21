"use client"

import { PrinterIcon as Printer3d, User, LogOut, CreditCard } from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/contexts/auth-context"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"

export function Header() {
  const { user, profile, signOut } = useAuth()

  return (
    <header className="mb-8 relative z-10">
      <div className="flex items-center justify-between">
        <Link href={user ? "/dashboard" : "/"} className="flex items-center">
          <div className="relative">
            <Printer3d className="h-10 w-10 mr-3 text-cyber-blue animate-pulse-slow" />
            <div className="absolute inset-0 bg-cyber-blue opacity-30 blur-md rounded-full animate-pulse-slow"></div>
          </div>
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight glow-text bg-gradient-to-r from-cyber-blue to-cyber-purple bg-clip-text text-transparent">
            PLAyhouse Creations
          </h1>
        </Link>

        {user ? (
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center glass px-4 py-2 rounded-md">
              <CreditCard className="h-4 w-4 mr-2 text-cyber-blue" />
              <span className="text-sm">Credits: </span>
              <span className="ml-1 text-cyber-blue font-bold">{profile?.credits || 0}</span>
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="border-cyber-blue/30 text-cyber-blue hover:bg-cyber-blue/10">
                  <User className="h-4 w-4 mr-2" />
                  {profile?.name?.split(" ")[0] || "Account"}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="glass border-cyber-blue/20">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-cyber-blue/20" />
                <DropdownMenuItem asChild>
                  <Link href="/dashboard" className="cursor-pointer">
                    Dashboard
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/profile" className="cursor-pointer">
                    Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/calculator" className="cursor-pointer">
                    Quote Calculator
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-cyber-blue/20" />
                <DropdownMenuItem onClick={signOut} className="text-red-500 cursor-pointer">
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <Button asChild variant="outline" className="border-cyber-blue/30 text-cyber-blue hover:bg-cyber-blue/10">
              <Link href="/login">Log In</Link>
            </Button>
            <Button asChild className="bg-cyber-blue hover:bg-cyber-blue/80 text-black btn-hover-effect">
              <Link href="/signup">Sign Up</Link>
            </Button>
          </div>
        )}
      </div>
      <div className="w-32 h-1 bg-gradient-to-r from-cyber-blue to-cyber-purple mx-auto mt-4 rounded-full"></div>
    </header>
  )
}
