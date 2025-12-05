"use client"

import type React from "react"

import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { useState } from "react"
import { Smartphone, Mail, ArrowRight, CheckCircle2 } from "lucide-react"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL

    if (!adminEmail) {
      setError("Error de configuración: Contacte al administrador")
      console.error("NEXT_PUBLIC_ADMIN_EMAIL no está definido en las variables de entorno")
      setIsLoading(false)
      return
    }

    if (email.trim().toLowerCase() !== adminEmail.trim().toLowerCase()) {
      setError("Este correo no está autorizado para acceder al panel.")
      setIsLoading(false)
      return
    }

    const supabase = createClient()

    try {
      const { error } = await supabase.auth.signInWithOtp({
        email: email.trim(),
        options: {
          emailRedirectTo: `${globalThis.location.origin}/auth/callback`,
        },
      })
      if (error) throw error
      setIsSuccess(true)
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "Error al enviar el link de acceso")
    } finally {
      setIsLoading(false)
    }
  }

  if (isSuccess) {
    return (
      <div className="flex min-h-svh w-full items-center justify-center p-6 bg-muted/40">
        <div className="w-full max-w-sm">
          <div className="flex flex-col gap-6">
            <Link href="/" className="flex items-center justify-center gap-2 mb-4">
              <Smartphone className="h-8 w-8 text-primary" />
              <span className="font-bold text-2xl">TelefonoShop</span>
            </Link>
            <Card>
              <CardHeader className="text-center">
                <div className="mx-auto bg-green-100 p-3 rounded-full w-fit mb-4">
                  <CheckCircle2 className="h-8 w-8 text-green-600" />
                </div>
                <CardTitle className="text-2xl">¡Link Enviado!</CardTitle>
                <CardDescription>
                  Hemos enviado un enlace de acceso seguro a <strong>{email}</strong>.
                  <br />
                  Revisa tu bandeja de entrada (y spam) para ingresar.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full" onClick={() => setIsSuccess(false)}>
                  Volver al login
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 bg-muted/40">
      <div className="w-full max-w-sm">
        <div className="flex flex-col gap-6">
          <Link href="/" className="flex items-center justify-center gap-2 mb-4">
            <Smartphone className="h-8 w-8 text-primary" />
            <span className="font-bold text-2xl">TelefonoShop</span>
          </Link>
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Panel Admin</CardTitle>
              <CardDescription>Ingresa tu correo autorizado para recibir un link de acceso.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleLogin}>
                <div className="flex flex-col gap-6">
                  <div className="grid gap-2">
                    <Label htmlFor="email">Email Autorizado</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="admin@ejemplo.com"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="pl-9"
                      />
                    </div>
                  </div>
                  
                  {error && <p className="text-sm text-red-500 bg-red-50 p-3 rounded-md">{error}</p>}
                  
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? (
                      "Enviando..."
                    ) : (
                      <>
                        Enviar Link de Acceso
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </Button>
                </div>
                <div className="mt-4 text-center text-sm text-muted-foreground">
                  <Link href="/" className="hover:underline">
                    Volver al catálogo
                  </Link>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
