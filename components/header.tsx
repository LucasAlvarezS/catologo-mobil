"use client"

import Link from "next/link"
import { useState, useEffect, useRef } from "react"
import { cn } from "@/lib/utils"

export function Header() {
  const [isVisible, setIsVisible] = useState(true)
  const lastScrollY = useRef(0)

  useEffect(() => {
    const controlNavbar = () => {
      if (typeof window !== 'undefined') {
        const currentScrollY = window.scrollY
        
        // Hide if scrolling down and past 100px, show if scrolling up
        if (currentScrollY > lastScrollY.current && currentScrollY > 100) {
          setIsVisible(false)
        } else {
          setIsVisible(true)
        }
        
        lastScrollY.current = currentScrollY
      }
    }

    window.addEventListener('scroll', controlNavbar)

    return () => {
      window.removeEventListener('scroll', controlNavbar)
    }
  }, [])

  return (
    <header className={cn(
      "sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/60 shadow-sm transition-transform duration-300",
      !isVisible && "-translate-y-full"
    )}>
      <div className="container flex h-20 items-center justify-center relative px-4 mx-auto">
        {/* Logo Centrado */}
        <Link href="/" className="relative z-10 flex items-center justify-center w-full">
          <h1 className="font-black text-3xl md:text-5xl tracking-tighter text-center uppercase bg-gradient-to-r from-blue-700 to-red-600 bg-clip-text text-transparent">
            Catálogo Portabilidad
          </h1>
        </Link>
      </div>
      {/* Gradient Line */}
      <div className="h-1 w-full bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-600 opacity-20"></div>
    </header>
  )
}
