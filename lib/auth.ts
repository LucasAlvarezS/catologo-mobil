import { createClient } from "@/lib/supabase/server"

/**
 * Verifies if the current user is an admin
 * Checks if the user's email is in the ADMIN_EMAILS environment variable
 */
export async function isUserAdmin(): Promise<boolean> {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user?.email) {
      return false
    }

    const adminEmails = (process.env.ADMIN_EMAILS || "").split(",").map((email) => email.trim().toLowerCase())

    return adminEmails.includes(user.email.toLowerCase())
  } catch {
    return false
  }
}

/**
 * Gets the current authenticated user
 */
export async function getCurrentUser() {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    return user
  } catch {
    return null
  }
}

/**
 * Checks if user is authenticated
 */
export async function isAuthenticated(): Promise<boolean> {
  try {
    const user = await getCurrentUser()
    return !!user
  } catch {
    return false
  }
}
