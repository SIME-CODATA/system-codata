import { cookies } from 'next/headers'
import { getDashboardSummary } from './application/summary'
import { DashboardCards } from './ui/cards'
import { DashboardLists } from './ui/lists'
import { DashboardAnnouncements } from './ui/announcements'
import { ProjectRepo } from '@/modules/projects/infra/repo'
import { TaskRepo } from '@/modules/tasks/infra/repo'
import { UserRepo } from '@/modules/users/infra/repo'
import { AnnouncementRepo } from '@/modules/announcements/infra/repo'
import { SESSION_COOKIE } from '@/core/security/cookie'
import { readSessionToken } from '@/core/security/session'
import { redirect } from 'next/navigation'

export default async function DashboardPage() {
  const projectRepo = new ProjectRepo()
  const taskRepo = new TaskRepo()
  const userRepo = new UserRepo()
  const announcementRepo = new AnnouncementRepo()

  const cookieStore = await cookies()
  const session = readSessionToken(cookieStore.get(SESSION_COOKIE)?.value)
  if (!session) redirect('/login')
  const isAdmin = session.role === 'adminGeral' || session.role === 'superAdmin'

  const [data, todosAvisos, users] = await Promise.all([
    getDashboardSummary(projectRepo, taskRepo, userRepo),
    announcementRepo.listActive(session.userId, isAdmin),
    userRepo.list()
  ])

  // Lógica para mapear os nomes e estruturar para a UI
  const usersMap = new Map(users.map((u) => [u.id, u.name]))
  const avisosMapeados = todosAvisos.map(a => ({
    id: a.id, 
    title: a.title, 
    content: a.content, 
    isUrgent: a.isUrgent,
    expiresAt: a.expiresAt, 
    createdAt: a.createdAt,
    publisherName: usersMap.get(a.publishedBy) ?? 'Administração',
    isPersonal: a.targetUserIds && a.targetUserIds.length > 0,
    isForCurrentUser: a.targetUserIds && a.targetUserIds.includes(session.userId)
  }))

  return (
    <div style={{ display: 'grid', gap: 24 }}>
      <DashboardAnnouncements avisos={avisosMapeados} canManage={isAdmin} />
      <DashboardCards summary={data.summary} />
      <DashboardLists overdueTasks={data.overdueTasks} recentTasks={data.recentTasks} />
    </div>
  )
}