"use server"

import { createOpenAI } from "@ai-sdk/openai"
import { generateText } from "ai"
import { type Telefono } from "@/lib/types"
import { revalidatePath } from "next/cache"
import { createClient } from "@/lib/supabase/server"

const groq = createOpenAI({
  baseURL: "https://api.groq.com/openai/v1",
  apiKey: process.env.GROQ_API_KEY,
})

export async function comparePhonesWithAI(phones: Telefono[]) {
  try {
    const phoneDescriptions = phones
      .map(
        (p) =>
          `${p.marca} ${p.modelo} (Procesador: ${p.procesador}, RAM: ${p.ram}, Cámara: ${p.camara}, Pantalla: ${p.pantalla})`,
      )
      .join("\n")

    const prompt = `
      Actúa como un experto en tecnología móvil. Compara los siguientes teléfonos:
      ${phoneDescriptions}

      Genera un análisis estructurado en Markdown (SIN TABLAS) diseñado para ser leído fácilmente en un móvil. Usa el siguiente formato exacto:

      # 🏆 La Mejor Opción: [Nombre del Modelo Ganador]
      [Justificación de 1 frase contundente]

      ## ⚡ Comparativa Rápida
      *   **Rendimiento:** [Quién gana y por qué brevemente]
      *   **Cámara:** [Quién gana y por qué brevemente]
      *   **Batería:** [Quién gana y por qué brevemente]
      *   **Pantalla:** [Quién gana y por qué brevemente]

      ## 📱 Análisis Individual

      ### [Nombre Modelo 1]
      *   ✅ [Punto fuerte principal]
      *   ❌ [Punto débil principal]
      *   💡 *Ideal para:* [Tipo de usuario]

      ### [Nombre Modelo 2]
      *   ✅ [Punto fuerte principal]
      *   ❌ [Punto débil principal]
      *   💡 *Ideal para:* [Tipo de usuario]

      (Repetir para otros modelos si hay)

      Mantén un tono profesional pero directo. Sé conciso.
      Recuerda ser lo más breve posible sin perder claridad.
    `

    const { text } = await generateText({
      model: groq("llama-3.3-70b-versatile"),
      prompt: prompt,
      temperature: 0.5,
    })

    return { success: true, text }
  } catch (error) {
    console.error("Error generating AI comparison:", error)
    return { success: false, error: "No se pudo generar la comparación con IA en este momento." }
  }
}

export async function deletePhoneAction(id: string) {
  const supabase = await createClient()
  const { error } = await supabase.from("telefonos").delete().eq("id", id)

  if (error) {
    return { success: false, error: error.message }
  }

  revalidatePath("/")
  revalidatePath("/admin")
  return { success: true }
}

export async function togglePhoneActiveAction(id: string, currentState: boolean) {
  const supabase = await createClient()
  const { error } = await supabase.from("telefonos").update({ activo: !currentState }).eq("id", id)

  if (error) {
    return { success: false, error: error.message }
  }

  revalidatePath("/")
  revalidatePath("/admin")
  return { success: true }
}

export async function updatePhonePriceAction(id: string, newPrice: number) {
  const supabase = await createClient()
  const { error } = await supabase.from("telefonos").update({ precio_lista: newPrice }).eq("id", id)

  if (error) {
    return { success: false, error: error.message }
  }

  revalidatePath("/")
  revalidatePath("/admin")
  return { success: true }
}
