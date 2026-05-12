'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export function PlannerSyncButton() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  async function sync() {
    setLoading(true)
    setMessage('')

    try {
      const response = await fetch('/api/planner/sync', {
        method: 'POST',
      })

      const data = await response.json()

      if (!response.ok) {
        setMessage(data.error ?? 'Erro ao sincronizar.')
        return
      }

      setMessage(
        `Sincronizado: ${data.importedPlans} planos, ${data.importedTasks} tarefas.`
      )

      router.refresh()
    } catch {
      setMessage('Erro inesperado ao sincronizar.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex items-center gap-3">
      <a
        href="/api/planner/auth"
        className="px-4 py-2 rounded-xl bg-surface border border-black/10 text-sm font-bold"
      >
        Conectar Microsoft Planner
      </a>

      <button
        onClick={sync}
        disabled={loading}
        className="px-4 py-2 rounded-xl bg-primary text-white text-sm font-bold disabled:opacity-50"
      >
        {loading ? 'Sincronizando...' : 'Sincronizar agora'}
      </button>

      {message ? <span className="text-sm text-muted">{message}</span> : null}
    </div>
  )
}