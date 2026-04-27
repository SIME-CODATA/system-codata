'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'

type AgendaItem = {
  id: string
  title: string
  type: string
  date: Date
  time: string
  origin: 'agenda' | 'projeto' | 'tarefa' | 'externo' // Adicionado 'externo'
  description: string
}

type Props = {
  items: AgendaItem[]
  feedToken: string
  initialExternalUrl?: string | null
}

export function AgendaList({ items, feedToken, initialExternalUrl }: Props) {
  const [mounted, setMounted] = useState(false)
  const [externalUrl, setExternalUrl] = useState(initialExternalUrl || '')
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const feedUrl = mounted ? `${window.location.origin}/api/agenda/feed?token=${feedToken}` : ''

  const getEditLink = (item: AgendaItem) => {
    switch (item.origin) {
      case 'projeto': return `/projetos/${item.id}`
      case 'tarefa': return `/tarefas/${item.id}`
      case 'externo': return '#' // Não podemos editar o Google do usuário por aqui
      case 'agenda':
      default: return `/agenda/${item.id}`
    }
  }

  async function handleSaveExternalUrl() {
    setIsSaving(true)
    try {
      await fetch('/api/usuarios/me', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ externalCalendarUrl: externalUrl })
      })
      alert('Calendário vinculado com sucesso! A página será atualizada.')
      window.location.reload()
    } catch {
      alert('Erro ao salvar o calendário.')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 20 }}>
        <div>
          <h1 style={{ marginBottom: 4 }}>Agenda Unificada CODATA</h1>
          <p style={{ fontSize: 14, color: '#666', marginTop: 0 }}>
            Consolidação automática de Reuniões, Prazos de Projetos, Tarefas e seu Calendário Pessoal.
          </p>
        </div>

        <div style={{ display: 'flex', gap: 16 }}>
          {/* Caixa 1: O link do usuário (Externo -> CODATA) */}
          <div style={{ backgroundColor: '#f9fafb', padding: 12, borderRadius: 8, border: '1px solid #e5e7eb' }}>
            <strong style={{ fontSize: 12, display: 'block', marginBottom: 4 }}>Importar Calendário (Google/Teams)</strong>
            <div style={{ display: 'flex', gap: 4 }}>
              <input 
                placeholder="Cole o endereço secreto iCal aqui..."
                value={externalUrl} 
                onChange={(e) => setExternalUrl(e.target.value)}
                style={{ fontSize: 12, width: 200, padding: 4 }} 
              />
              <button onClick={handleSaveExternalUrl} disabled={isSaving} style={{ fontSize: 12, padding: '4px 8px' }}>
                {isSaving ? 'Salvando...' : 'Salvar'}
              </button>
            </div>
          </div>

          {/* Caixa 2: O link da CODATA (CODATA -> Externo) */}
          {mounted && feedUrl && (
            <div style={{ backgroundColor: '#f9fafb', padding: 12, borderRadius: 8, border: '1px solid #e5e7eb' }}>
              <strong style={{ fontSize: 12, display: 'block', marginBottom: 4 }}>Exportar CODATA</strong>
              <input 
                readOnly 
                value={feedUrl} 
                style={{ fontSize: 12, width: 200, padding: 4 }} 
                onClick={(e) => {
                  const target = e.target as HTMLInputElement
                  target.select()
                  navigator.clipboard.writeText(target.value)
                  alert('Link copiado! Cole no seu Google Calendar ou Outlook.')
                }}
              />
            </div>
          )}
        </div>
      </div>

      <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: 20 }}>
        <thead>
          <tr style={{ backgroundColor: '#f3f4f6' }}>
            <th align="left" style={{ padding: '12px' }}>Data</th>
            <th align="left" style={{ padding: '12px' }}>Horário</th>
            <th align="left" style={{ padding: '12px' }}>Origem</th>
            <th align="left" style={{ padding: '12px' }}>Título</th>
            <th align="left" style={{ padding: '12px' }}>Ações</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={`${item.origin}-${item.id}`} style={{ borderBottom: '1px solid #e5e7eb' }}>
              <td style={{ padding: '12px', minWidth: 100 }}>
                {new Date(item.date).toLocaleDateString('pt-BR', { timeZone: 'UTC' })}
              </td>
              <td style={{ padding: '12px' }}>
                {item.time}
              </td>
              <td style={{ padding: '12px' }}>
                <span style={{ 
                  fontSize: 11, padding: '2px 6px', borderRadius: 4,
                  backgroundColor: 
                    item.origin === 'agenda' ? '#dbeafe' : 
                    item.origin === 'projeto' ? '#fef3c7' : 
                    item.origin === 'tarefa' ? '#d1fae5' : '#f3e8ff' // Roxo para eventos externos
                }}>
                  {item.origin.toUpperCase()}
                </span>
              </td>
              <td style={{ padding: '12px' }}>
                <strong>{item.title}</strong>
                <div style={{ fontSize: 12, color: '#666' }}>{item.description}</div>
              </td>
              <td style={{ padding: '12px' }}>
                {item.origin !== 'externo' ? (
                  <Link href={getEditLink(item)}>
                    {item.origin === 'agenda' ? 'Editar Evento' : `Ver ${item.origin}`}
                  </Link>
                ) : (
                  <span style={{ fontSize: 12, color: '#9ca3af' }}>Somente Leitura</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}