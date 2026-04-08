'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export function LoginForm() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')
    setLoading(true)

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error ?? 'Falha no login.')
        return
      }

      router.push('/dashboard')
      router.refresh()
    } catch {
      setError('Erro inesperado ao tentar entrar.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={onSubmit} style={{ maxWidth: 360 }}>
      <h1>Entrar</h1>

      <div style={{ marginBottom: 12 }}>
        <label>E-mail</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{ width: '100%' }}
        />
      </div>

      <div style={{ marginBottom: 12 }}>
        <label>Senha</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ width: '100%' }}
        />
      </div>

      {error ? (
        <p style={{ color: 'crimson' }}>{error}</p>
      ) : null}

      <button type="submit" disabled={loading}>
        {loading ? 'Entrando...' : 'Entrar'}
      </button>
    </form>
  )
}