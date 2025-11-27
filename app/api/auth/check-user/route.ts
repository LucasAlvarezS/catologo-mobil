import { createClient } from "@/lib/supabase/server"
import { NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json({ exists: false }, { status: 400 })
    }

    const supabase = await createClient()

    // Consultar si el usuario existe en auth.users
    const { data, error } = await supabase.auth.admin.listUsers()

    if (error) {
      return NextResponse.json({ exists: false, error: error.message }, { status: 500 })
    }

    // Buscar si el email existe en la lista de usuarios
    const userExists = data?.users.some((user) => user.email?.toLowerCase() === email.toLowerCase())

    return NextResponse.json({ exists: userExists })
  } catch (err: any) {
    return NextResponse.json({ exists: false, error: err.message }, { status: 500 })
  }
}
