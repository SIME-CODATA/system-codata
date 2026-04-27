import { cookies } from 'next/headers'
import { SESSION_COOKIE } from '@/core/security/cookie'
import { readSessionToken } from '@/core/security/session'
import { ProjectRepo } from '@/modules/projects/infra/repo'
import { TaskRepo } from '@/modules/tasks/infra/repo'
import { UserRepo } from '@/modules/users/infra/repo'
import { AnnouncementRepo } from '@/modules/announcements/infra/repo'

import { DashboardCards } from './ui/cards'
import { DashboardLists } from './ui/lists'
import { DashboardAnnouncements } from './ui/announcements'


async function getDashboardData(userId?: string) {
  const projectRepo = new ProjectRepo()
  const taskRepo = new TaskRepo()
  const userRepo = new UserRepo()
  const announcementRepo = new AnnouncementRepo()

  try {
    // Buscar projetos, tarefas, usuários e avisos em paralelo
    const [allProjects, allTasks, allUsers, announcements] = await Promise.all([
      projectRepo.list(),
      taskRepo.list(),
      userRepo.list(),
      userId ? announcementRepo.listActive(userId) : Promise.resolve([])
    ])

    // Criar mapas para lookup rápido
    const usersMap = new Map(allUsers.map(u => [u.id, u]))
    const projectsMap = new Map(allProjects.map(p => [p.id, p]))

    // Contar projetos por status
    const totalProjects = allProjects.length
    const completedProjects = allProjects.filter(p => p.status === 'concluido').length
    
    // Contar tarefas por status
    const totalTasks = allTasks.length
    const pendingTasks = allTasks.filter(t => t.status === 'pendente').length
    const inProgressTasks = allTasks.filter(t => t.status === 'emAndamento').length
    const completedTasks = allTasks.filter(t => t.status === 'concluida').length
    
    // Tarefas atrasadas (dueDate no passado e não concluída)
    const now = new Date()
    const overdueTasks = allTasks.filter(t => 
      t.dueDate && new Date(t.dueDate) < now && t.status !== 'concluida'
    )

    // Tarefas recentes (últimas 5)
    const recentTasks = allTasks
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5)
      .map(t => ({
        id: t.id,
        title: t.title,
        projectName: projectsMap.get(t.projectId)?.name || 'Projeto desconhecido',
        assigneeName: usersMap.get(t.assigneeId)?.name || 'Não atribuído',
        dueDate: t.dueDate,
        status: t.status,
        priority: t.priority
      }))

    const overdueMapped = overdueTasks.map(t => ({
      id: t.id,
      title: t.title,
      projectName: projectsMap.get(t.projectId)?.name || 'Projeto desconhecido',
      assigneeName: usersMap.get(t.assigneeId)?.name || 'Não atribuído',
      dueDate: t.dueDate,
      status: t.status,
      priority: t.priority
    }))

    // Mapear avisos com nomes de publicadores
    const avisosMapeados = announcements.map(a => ({
      id: a.id,
      title: a.title,
      content: a.content,
      isUrgent: a.isUrgent,
      expiresAt: a.expiresAt,
      publisherName: usersMap.get(a.publishedBy)?.name || 'Administração',
      isPersonal: a.targetUserIds.length > 0 && a.targetUserIds.includes(userId || ''),
      isForCurrentUser: !a.targetUserIds.length || a.targetUserIds.includes(userId || ''),
      createdAt: a.createdAt
    }))

    return {
      summary: {
        totalProjects,
        totalTasks,
        pendingTasks,
        inProgressTasks,
        completedTasks,
        overdueTasks: overdueTasks.length,
      },
      recentTasks,
      overdueTasks: overdueMapped,
      avisos: avisosMapeados
    }
  } catch (error) {
    console.error('Erro ao buscar dados do dashboard:', error)
    // Retornar dados vazios em caso de erro ao invés de quebrar a página
    return {
      summary: {
        totalProjects: 0,
        totalTasks: 0,
        pendingTasks: 0,
        inProgressTasks: 0,
        completedTasks: 0,
        overdueTasks: 0,
      },
      recentTasks: [],
      overdueTasks: [],
      avisos: []
    }
  }
}

export default async function DashboardPage() {
  const cookieStore = await cookies()
  const sessionValue = cookieStore.get(SESSION_COOKIE)?.value

  type SessionData = {
    id?: string
    nome?: string
    name?: string
    role?: string
  }

  const session = readSessionToken(sessionValue) as SessionData | null

  // Passamos o ID do usuário para o banco de dados saber de quem puxar as tarefas
  const data = await getDashboardData(session?.id)

  const userName = session?.nome || session?.name || 'Servidor'
  const userRole = session?.role || 'operador'

  const dataAtual = new Intl.DateTimeFormat('pt-BR', { dateStyle: 'full' }).format(new Date())
  const dataCapitalizada = dataAtual.charAt(0).toUpperCase() + dataAtual.slice(1)

  return (
    <div className="flex flex-col gap-10 pb-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* HEADER DINÂMICO */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-black/5 dark:border-white/5 pb-6">
        <div>
          <h1 className="text-[35px] font-bold text-foreground tracking-tight mb-1">
            Olá, <span className="text-primary">{userName}</span>
          </h1>
          <p className="text-muted text-[16px] font-medium capitalize">
            <i className="fa-regular fa-calendar mr-2"></i>
            {dataCapitalizada}
          </p>
        </div>
        
        <button className="px-6 py-3 bg-primary text-white text-sm font-bold rounded-xl shadow-md hover:opacity-90 transition-opacity flex items-center gap-2 w-fit">
          <i className="fa-solid fa-plus"></i>
          Nova Demanda
        </button>
      </header>
      <DashboardCards summary={data.summary} />
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 items-start">
        <div className="xl:col-span-2">
          <DashboardLists overdueTasks={data.overdueTasks} recentTasks={data.recentTasks} />
        </div>
        <div className="xl:col-span-1">
          <DashboardAnnouncements 
            avisos={data.avisos} 
            canManage={userRole === 'superAdmin' || userRole === 'adminGeral'} 
          />
        </div>
      </div>
    </div>
  )
}