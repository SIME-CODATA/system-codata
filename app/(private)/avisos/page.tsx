import { cookies } from 'next/headers'
import { listAnnouncements } from '@/modules/announcements/application/list'
import { AnnouncementRepo } from '@/modules/announcements/infra/repo'
import { UserRepo } from '@/modules/users/infra/repo'
import { AnnouncementForm } from '@/modules/announcements/ui/form'
import { AnnouncementList } from '@/modules/announcements/ui/list'
import { SESSION_COOKIE } from '@/core/security/cookie'
import { readSessionToken } from '@/core/security/session'

// Adicionamos searchParams para capturar a URL ?edit=ID
export default async function AvisosPage({ searchParams }: { searchParams: Promise<{ edit?: string }> }) {
  const announcementRepo = new AnnouncementRepo()
  const userRepo = new UserRepo()

  const cookieStore = await cookies()
  const sessionValue = cookieStore.get(SESSION_COOKIE)?.value
  const session = readSessionToken(sessionValue)
  
  const canPublish = session?.role === 'adminGeral' || session?.role === 'superAdmin'
  const isAdmin = session?.role === 'adminGeral' || session?.role === 'superAdmin'
  
  // Adicione o isAdmin como quarto parâmetro:
  const avisos = await listAnnouncements(announcementRepo, userRepo, session?.userId || '', isAdmin)
  const users = await userRepo.list()

  // Extrai o ID da URL se o usuário clicou em editar (Lidando com a Promise do Next 15)
  const params = await searchParams
  const editId = params.edit

  // Busca os dados originais no banco se tiver editId
  let avisoParaEditar = null
  if (editId && canPublish) {
    avisoParaEditar = await announcementRepo.findById(editId)
  }

  // Add isPersonal property to each announcement
  const avisosComIsPersonal = avisos.map(aviso => ({
    ...aviso,
    isPersonal: aviso.publisherName === session?.userId
  }))

  return (
    <div>
      <h1>Quadro de Avisos CODATA</h1>
      <p style={{ color: '#666', marginBottom: 24 }}>
        Comunicados oficiais, manutenções e recados importantes do setor.
      </p>

      {canPublish && (
        <AnnouncementForm 
          users={users} 
          currentUserId={session?.userId || ''} 
          isAdmin={canPublish} 
          initialData={avisoParaEditar} // Passa os dados para o form!
        />
      )}

      <AnnouncementList announcements={avisosComIsPersonal} canManage={canPublish} />
    </div>
  )
}