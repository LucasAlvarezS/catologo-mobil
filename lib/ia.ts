export type AiCompareResult = {
  ai: any
  raw?: string
}

export async function comparePhonesAI(phoneIds: string[], userIntent?: string): Promise<AiCompareResult> {
  const res = await fetch('/api/ia/compare', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ phoneIds, userIntent })
  })

  if (!res.ok) {
    const text = await res.text()
    throw new Error(`AI compare failed: ${text}`)
  }

  const data = await res.json()
  return data as AiCompareResult
}
