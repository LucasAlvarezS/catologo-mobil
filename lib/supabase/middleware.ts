import { createServerClient } from "@supabase/ssr"
import { NextResponse, type NextRequest } from "next/server"

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) => supabaseResponse.cookies.set(name, value, options))
        },
      },
    },
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Protect admin routes - redirect to login if not authenticated
  if (request.nextUrl.pathname.startsWith("/admin")) {
    if (!user) {
      const url = request.nextUrl.clone()
      url.pathname = "/auth/login"
      return NextResponse.redirect(url)
    }

    // Check if user is admin
    const adminEmails = (process.env.ADMIN_EMAILS || "").split(",").map((email) => email.trim().toLowerCase())
    if (!adminEmails.includes(user.email?.toLowerCase() || "")) {
      const url = request.nextUrl.clone()
      url.pathname = "/"
      return NextResponse.redirect(url)
    }
  }

  // Redirect logged in users from auth pages to home or admin
  if (request.nextUrl.pathname.startsWith("/auth") && user) {
    const url = request.nextUrl.clone()
    const adminEmails = (process.env.ADMIN_EMAILS || "").split(",").map((email) => email.trim().toLowerCase())
    url.pathname = adminEmails.includes(user.email?.toLowerCase() || "") ? "/admin" : "/"
    return NextResponse.redirect(url)
  }

  return supabaseResponse
}
