import { cookies } from 'next/headers'
import { listUnifiedAgenda } from '@/modules/agenda/application/list'
import { AgendaRepo } from '@/modules/agenda/infra/repo'
import { ProjectRepo } from '@/modules/projects/infra/repo'
import { TaskRepo } from '@/modules/tasks/infra/repo'
import { UserRepo } from '@/modules/users/infra/repo'
import { AgendaList } from '@/modules/agenda/ui/list'
import { SESSION_COOKIE } from '@/core/security/cookie'
import { readSessionToken } from '@/core/security/session'
import { generateFeedToken } from '@/core/security/feed-token'

export default async function AgendaPage() {
  const agendaRepo = new AgendaRepo()
  const projectRepo = new ProjectRepo()
  const taskRepo = new TaskRepo()
  const userRepo = new UserRepo()

  const cookieStore = await cookies()
  const sessionValue = cookieStore.get(SESSION_COOKIE)?.value
  const session = readSessionToken(sessionValue)
  
  const feedToken = session ? generateFeedToken(session.userId) : ''
  
  // Buscar os dados do usuário atual para ler a URL do calendário dele
  const currentUser = session ? await userRepo.findById(session.userId) : null
  const externalUrl = currentUser?.externalCalendarUrl || null

  // Agora passamos a URL externa para a função misturar os eventos
  const items = await listUnifiedAgenda(agendaRepo, projectRepo, taskRepo, externalUrl)

  return <AgendaList items={items} feedToken={feedToken} initialExternalUrl={externalUrl} />
}