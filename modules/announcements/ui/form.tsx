'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

type Props = {
  users: { id: string; name: string }[]
  currentUserId: string
  isAdmin: boolean
  initialData?: any // Dados do aviso que está sendo editado
}

export function AnnouncementForm({ users, currentUserId, isAdmin, initialData }: Props) {
  const router = useRouter()
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [isUrgent, setIsUrgent] = useState(false)
  const [expiresAt, setExpiresAt] = useState('')
  const [isGlobal, setIsGlobal] = useState(isAdmin)
  const [selectedUsers, setSelectedUsers] = useState<string[]>(isAdmin ? [] : [currentUserId])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title)
      setContent(initialData.content)
      setIsUrgent(initialData.isUrgent)
      setExpiresAt(initialData.expiresAt ? new Date(initialData.expiresAt).toISOString().split('T')[0] : '')
      if (isAdmin) {
        setIsGlobal(initialData.targetUserIds.length === 0)
        setSelectedUsers(initialData.targetUserIds)
      }
    }
  }, [initialData, isAdmin])

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setLoading(true)

    const url = initialData ? `/api/avisos/${initialData.id}` : '/api/avisos'
    const method = initialData ? 'PUT' : 'POST'

    try {
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title, content, isUrgent,
          expiresAt: expiresAt || null,
          targetUserIds: isGlobal ? [] : selectedUsers,
        }),
      })

      if (!response.ok) throw new Error('Falha ao salvar')

      setTitle(''); setContent(''); setIsUrgent(false); setExpiresAt('');
      if (isAdmin) { setIsGlobal(true); setSelectedUsers([]); }
      
      // Limpa a URL se estiver editando e recarrega
      if (initialData) router.push('/avisos') 
      else router.refresh()
      
    } catch {
      alert('Erro ao salvar aviso.')
    } finally {
      setLoading(false)
    }
  }

  function cancelarEdicao() {
    router.push('/avisos')
  }

  return (
    <form onSubmit={onSubmit} style={{ marginBottom: 32, padding: 20, backgroundColor: initialData ? '#fffbeb' : '#f9fafb', borderRadius: 8, border: initialData ? '1px solid #fcd34d' : '1px solid #e5e7eb' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ marginTop: 0, fontSize: 18 }}>
          {initialData ? 'Editando Aviso' : isAdmin ? 'Publicar Novo Aviso' : 'Criar Lembrete Pessoal'}
        </h2>
        {initialData && (
          <button type="button" onClick={cancelarEdicao} style={{ fontSize: 12, cursor: 'pointer' }}>Cancelar Edição</button>
        )}
      </div>
      
      <div style={{ display: 'grid', gap: 12 }}>
        <input required placeholder="Título" value={title} onChange={e => setTitle(e.target.value)} style={{ width: '100%', padding: 8 }} />
        <textarea required placeholder="Escreva o recado ou lembrete..." value={content} onChange={e => setContent(e.target.value)} style={{ width: '100%', padding: 8, minHeight: 80 }} />

        {isAdmin && (
          <div style={{ backgroundColor: '#fff', padding: 12, border: '1px solid #e5e7eb', borderRadius: 6 }}>
            <label style={{ display: 'block', fontSize: 14, fontWeight: 'bold', marginBottom: 8 }}>Destinatários:</label>
            <label style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8, cursor: 'pointer' }}>
              <input type="checkbox" checked={isGlobal} onChange={(e) => {
                setIsGlobal(e.target.checked)
                if (e.target.checked) setSelectedUsers([])
              }} />
              Para todos os usuários (Aviso Geral)
            </label>

            {!isGlobal && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginTop: 12, paddingLeft: 24 }}>
                {users.map(u => (
                  <label key={u.id} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, cursor: 'pointer' }}>
                    <input type="checkbox" checked={selectedUsers.includes(u.id)} onChange={() => {
                      setSelectedUsers(prev => prev.includes(u.id) ? prev.filter(id => id !== u.id) : [...prev, u.id])
                    }} />
                    {u.id === currentUserId ? 'Eu mesmo (Lembrete)' : u.name}
                  </label>
                ))}
              </div>
            )}
          </div>
        )}

        <div style={{ display: 'flex', gap: 20, alignItems: 'center' }}>
          <div>
            <label style={{ display: 'block', fontSize: 14 }}>Expira em (Opcional)</label>
            <input type="date" value={expiresAt} onChange={e => setExpiresAt(e.target.value)} style={{ padding: 8 }} />
          </div>
          <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, cursor: 'pointer', marginTop: 16 }}>
            <input type="checkbox" checked={isUrgent} onChange={e => setIsUrgent(e.target.checked)} />
            <strong style={{ color: '#dc2626' }}>URGENTE</strong>
          </label>
        </div>

        <button type="submit" disabled={loading || (!isGlobal && selectedUsers.length === 0)} style={{ padding: '8px 16px', alignSelf: 'flex-start', cursor: 'pointer', marginTop: 8 }}>
          {loading ? 'Salvando...' : initialData ? 'Salvar Alterações' : isAdmin ? 'Publicar Aviso' : 'Salvar Lembrete'}
        </button>
      </div>
    </form>
  )
}