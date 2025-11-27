import { createClient } from "@/lib/supabase/server"
import Groq from "groq-sdk"

type PhonePayload = {
  phoneIds: string[]
  userIntent?: string
}

async function buildPrompt(phones: any[], intent?: string) {
  const lines = phones.map((p) => {
    return `- id: ${p.id}\n  marca: ${p.marca}\n  modelo: ${p.modelo}\n  precio: ${p.precio_lista}\n  precio_descuento: ${p.precio_descuento || ''}\n  ram: ${p.ram || ''}\n  almacenamiento: ${p.almacenamiento || ''}\n  procesador: ${p.procesador || ''}\n  bateria: ${p.bateria || ''}\n  camara: ${p.camara || ''}\n  pantalla: ${p.pantalla || ''}\n  tags: ${p.tags?.map((t: any) => t.nombre).join(', ') || ''}`
  })

  return `Eres un asistente comercial que ayuda a usuarios a comparar teléfonos para decidir cuál comprar.\n\n"Productos":\n${lines.join('\n\n')}\n\nObjetivo: Genera un JSON con estos campos:\n- summary: breve resumen comparativo (2-3 oraciones)\n- differences: lista de diferencias clave entre productos (objetivo claro, bulleted)\n- recommendation: { id: <phoneId>, score: 0-100, why: "explicación concisa" } indicando cuál es la mejor opción para la intención provista\n- whatsappMessage: texto breve que el vendedor puede enviar por WhatsApp para iniciar la venta (incluye referencia al modelo y precio compacto).\n\nIntención del usuario: ${intent || 'no especificada'}.\n\nDevuelve SOLO JSON válido (no texto adicional). Usa los datos tal cual provistos; no inventes specs. Si falta información para una afirmación, marca como "(no verificado)".\n`
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as PhonePayload

    if (!body?.phoneIds || !Array.isArray(body.phoneIds) || body.phoneIds.length === 0) {
      return new Response(JSON.stringify({ error: 'Necesitas enviar phoneIds (array)' }), { status: 400 })
    }

    const supabase = await createClient()
    const { data, error } = await supabase
      .from('telefonos')
      .select(`*, telefono_tags(tag_id, tags(id, nombre, descripcion))`)
      .in('id', body.phoneIds)

    if (error) {
      return new Response(JSON.stringify({ error: 'Error fetching phones', details: error }), { status: 500 })
    }

    const phones = (data || []).map((p: any) => ({
      ...p,
      tags: p.telefono_tags?.map((tt: any) => tt.tags).filter(Boolean) || []
    }))

    const prompt = await buildPrompt(phones, body.userIntent)

    const apiKey = process.env.GROQ_API_KEY
    if (!apiKey) {
      return new Response(JSON.stringify({ error: 'GROQ_API_KEY not configured' }), { status: 500 })
    }

    const groq = new Groq({ apiKey })

    const message = await groq.chat.completions.create({
      messages: [
        { role: 'system', content: 'Eres un asistente conciso, orientado a ventas y que devuelve JSON válido.' },
        { role: 'user', content: prompt }
      ],
      model: 'llama-3.3-70b-versatile',
      max_tokens: 600,
      temperature: 0.2
    })

    const content = message.choices[0]?.message?.content || ''

    // Try to parse JSON from model
    let parsed = null
    try {
      parsed = JSON.parse(content)
    } catch (e) {
      // fallback: try to extract JSON substring
      const m = content.match(/\{[\s\S]*\}/)
      if (m) {
        try {
          parsed = JSON.parse(m[0])
        } catch (er) {
          parsed = { raw: content }
        }
      } else {
        parsed = { raw: content }
      }
    }

    return new Response(JSON.stringify({ ai: parsed, raw: content }), { status: 200 })
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message || String(err) }), { status: 500 })
  }
}
