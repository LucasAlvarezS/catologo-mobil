"use client"

import React, { useState } from 'react'
import { comparePhonesAI } from '@/lib/ia'

type Props = {
  phoneIds: string[]
}

export default function IACompare({ phoneIds }: Props) {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [intent, setIntent] = useState('')

  async function handleRun() {
    setError(null)
    setLoading(true)
    try {
      const res = await comparePhonesAI(phoneIds, intent || undefined)
      setResult(res.ai || res)
    } catch (err: any) {
      setError(err.message || String(err))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-4 border rounded-md bg-white">
      <div className="mb-2">
        <label className="block text-sm font-medium text-gray-700">Intención (opcional)</label>
        <input value={intent} onChange={(e) => setIntent(e.target.value)} placeholder="Ej: mejor cámara para fotos nocturnas" className="mt-1 block w-full rounded-md border-gray-300 p-2" />
      </div>

      <div className="flex gap-2">
        <button disabled={loading || phoneIds.length < 2} onClick={handleRun} className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50">
          {loading ? 'Generando...' : 'Pedir ayuda IA'}
        </button>
        <button onClick={() => { setResult(null); setError(null) }} className="px-3 py-2 border rounded">Limpiar</button>
      </div>

      {error && <div className="mt-3 text-red-600">{error}</div>}

      {result && (
        <div className="mt-4 text-sm">
          <h4 className="font-semibold">Resumen</h4>
          <pre className="whitespace-pre-wrap bg-gray-50 p-3 rounded mt-2">{JSON.stringify(result, null, 2)}</pre>
        </div>
      )}
    </div>
  )
}
