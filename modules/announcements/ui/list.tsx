'use client'

import { useRouter } from 'next/navigation'

type AnnouncementRow = {
  id: string
  title: string
  content: string
  isUrgent: boolean
  expiresAt: Date | null
  publisherName: string
  isPersonal: boolean
  createdAt: Date
}

type Props = {
  announcements: AnnouncementRow[]
  canManage?: boolean // Nova prop para mostrar botão de excluir
}

export function AnnouncementList({ announcements, canManage }: Props) {
  const router = useRouter()

  async function handleDelete(id: string) {
    if (!confirm('Deseja excluir este aviso permanentemente?')) return

    const res = await fetch(`/api/avisos/${id}`, { method: 'DELETE' })
    if (res.ok) router.refresh()
  }

  if (announcements.length === 0) return <p style={{ color: '#6b7280' }}>Não há avisos ativos.</p>

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {announcements.map((aviso) => (
        <div 
          key={aviso.id} 
          style={{ 
            padding: 16, borderRadius: 8, position: 'relative',
            borderLeft: aviso.isUrgent ? '6px solid #dc2626' : aviso.isPersonal ? '6px solid #8b5cf6' : '6px solid #3b82f6',
            backgroundColor: aviso.isUrgent ? '#fef2f2' : aviso.isPersonal ? '#f5f3ff' : '#ffffff',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
          }}
        >
          {/* Adicione este bloco dentro da div onde está o botão da Lixeira: */}
          {canManage && (
            <div style={{ position: 'absolute', top: 12, right: 12, display: 'flex', gap: 8 }}>
              <button 
                onClick={() => router.push(`/avisos?edit=${aviso.id}`)}
                style={{ cursor: 'pointer', border: 'none', background: 'none', fontSize: 16 }}
                title="Editar Aviso"
              >
                editar
              </button>
              <button 
                onClick={() => handleDelete(aviso.id)}
                style={{ cursor: 'pointer', border: 'none', background: 'none', fontSize: 16 }}
                title="Excluir Aviso"
              >
                excluir
              </button>
            </div>
          )}

          <div style={{ paddingRight: canManage ? 30 : 0 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <h3 style={{ margin: 0, color: aviso.isUrgent ? '#991b1b' : aviso.isPersonal ? '#5b21b6' : '#111827' }}>
                {aviso.isUrgent && 'urgente'} {aviso.isPersonal && 'privado'} {aviso.title}
              </h3>
            </div>
            <p style={{ margin: '8px 0', whiteSpace: 'pre-wrap', fontSize: 14 }}>{aviso.content}</p>
            <div style={{ fontSize: 11, color: '#6b7280' }}>
              De: {aviso.publisherName} • {new Date(aviso.createdAt).toLocaleDateString('pt-BR')}
              {aviso.expiresAt && ` • Expira em: ${new Date(aviso.expiresAt).toLocaleDateString('pt-BR')}`}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}