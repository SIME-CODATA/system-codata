'use client'

import { AnnouncementList } from '@/modules/announcements/ui/list'
type AvisoRow = {
  id: string
  title: string
  content: string
  isUrgent: boolean
  expiresAt: Date | null
  publisherName: string
  isPersonal: boolean
  isForCurrentUser?: boolean
  createdAt: Date
}
type Props = {
  avisos: AvisoRow[]
  canManage?: boolean
}

export function DashboardAnnouncements({ avisos, canManage }: Props) {
  if (avisos.length === 0) return null
  const avisosPessoais = avisos.filter(a => a.isForCurrentUser)
  const avisosGerais = avisos.filter(a => !a.isForCurrentUser).slice(0, 3)
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {avisosPessoais.length > 0 && (
        <div style={{ backgroundColor: '#fdf4ff', padding: 20, borderRadius: 12, border: '1px solid #e9d5ff' }}>
          <h2 style={{ marginTop: 0, marginBottom: 16, color: '#7e22ce' }}>Meus Lembretes e Avisos Direcionados</h2>
          <AnnouncementList announcements={avisosPessoais} canManage={canManage} />
        </div>
      )}
      {avisosGerais.length > 0 && (
        <div style={{ backgroundColor: '#fff', padding: 20, borderRadius: 12, border: '1px solid #e5e7eb' }}>
          <h2 style={{ marginTop: 0, marginBottom: 16 }}>Comunicados da Equipe</h2>
          <AnnouncementList announcements={avisosGerais} canManage={canManage} />
          {avisos.filter(a => !a.isForCurrentUser).length > 3 && (
            <a href="/avisos" style={{ display: 'inline-block', marginTop: 16, fontSize: 14, color: '#3b82f6', textDecoration: 'none', fontWeight: 'bold' }}>Ver todos os comunicados &rarr;</a>
          )}
        </div>
      )}
    </div>
  )
}