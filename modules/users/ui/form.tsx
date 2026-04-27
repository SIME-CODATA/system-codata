'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { USER_ROLES } from '@/modules/users/domain/user'
import type { User } from '@/modules/users/domain/user'

type Props = {
  initialData?: User | null 
}

export function UserForm({ initialData }: Props) {
  const router = useRouter()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState<string>(USER_ROLES[0])
  const [jobTitle, setJobTitle] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (initialData) {
      setName(initialData.name)
      setEmail(initialData.email)
      setRole(initialData.role)
      setJobTitle(initialData.jobTitle)
      setPassword('') // A senha sempre começa vazia na edição
    }
  }, [initialData])

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault()
    setLoading(true)

    const url = initialData ? `/api/usuarios/${initialData.id}` : '/api/usuarios'
    const method = initialData ? 'PUT' : 'POST'

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, role, jobTitle }),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Falha ao salvar')

      setName(''); setEmail(''); setPassword(''); setRole(USER_ROLES[0]); setJobTitle('')
      
      if (initialData) router.push('/usuarios')
      else router.refresh()
    } catch (err: unknown) {
      if (err instanceof Error) {
        alert(err.message)
      } else {
        alert('Ocorreu um erro inesperado.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={onSubmit} style={{ marginBottom: 32, padding: 20, backgroundColor: initialData ? '#fffbeb' : '#f9fafb', borderRadius: 8, border: initialData ? '1px solid #fcd34d' : '1px solid #e5e7eb' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ marginTop: 0, fontSize: 18 }}>
          {initialData ? 'Editar Usuário' : 'Novo Usuário'}
        </h2>
        {initialData && (
          <button type="button" onClick={() => router.push('/usuarios')} style={{ fontSize: 12, cursor: 'pointer' }}>Cancelar Edição</button>
        )}
      </div>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <div>
          <label style={{ display: 'block', fontSize: 14 }}>Nome Completo</label>
          <input required value={name} onChange={e => setName(e.target.value)} style={{ width: '100%', padding: 8 }} />
        </div>
        <div>
          <label style={{ display: 'block', fontSize: 14 }}>Cargo / Função</label>
          <input required value={jobTitle} onChange={e => setJobTitle(e.target.value)} placeholder="Ex: Analista de Sistemas" style={{ width: '100%', padding: 8 }} />
        </div>
        <div>
          <label style={{ display: 'block', fontSize: 14 }}>E-mail</label>
          <input type="email" required value={email} onChange={e => setEmail(e.target.value)} style={{ width: '100%', padding: 8 }} />
        </div>
        <div>
          <label style={{ display: 'block', fontSize: 14 }}>Nível de Acesso no Sistema</label>
          <select value={role} onChange={e => setRole(e.target.value)} style={{ width: '100%', padding: 8 }}>
            {USER_ROLES.map(r => <option key={r} value={r}>{r.toUpperCase()}</option>)}
          </select>
        </div>
        <div style={{ gridColumn: '1 / -1' }}>
          <label style={{ display: 'block', fontSize: 14 }}>
            Senha {initialData && <span style={{ color: '#666', fontSize: 12 }}>(Deixe em branco para não alterar)</span>}
          </label>
          <input type="password" required={!initialData} value={password} onChange={e => setPassword(e.target.value)} style={{ width: '100%', padding: 8, maxWidth: 400 }} />
        </div>
      </div>
      
      <button type="submit" disabled={loading} style={{ padding: '8px 16px', cursor: 'pointer', marginTop: 16 }}>
        {loading ? 'Salvando...' : initialData ? 'Salvar Alterações' : 'Criar Usuário'}
      </button>
    </form>
  )
}