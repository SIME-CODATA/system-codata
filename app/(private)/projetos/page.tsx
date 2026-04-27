import { ProjectRepo } from '@/modules/projects/infra/repo'
import { TaskRepo } from '@/modules/tasks/infra/repo'
import { UserRepo } from '@/modules/users/infra/repo' // Novo import!
import { ProjetosClient, ProjectData } from './components/projetos-client'

import { cookies } from 'next/headers'
import { SESSION_COOKIE } from '@/core/security/cookie'
import { readSessionToken } from '@/core/security/session'

async function getProjectsData(): Promise<ProjectData[]> {
  const projectRepo = new ProjectRepo()
  const taskRepo = new TaskRepo()

  try {
    const [allProjects, allTasks] = await Promise.all([
      projectRepo.list(),
      taskRepo.list()
    ])

    const now = new Date()

    const formattedProjects: ProjectData[] = allProjects.map((project) => {
      const projectTasks = allTasks.filter(t => t.projectId === project.id)
      
      const tasksTotal = projectTasks.length
      const tasksDone = projectTasks.filter(t => t.status === 'concluida').length
      const progress = tasksTotal === 0 ? 0 : Math.round((tasksDone / tasksTotal) * 100)

      let currentStatus = project.status || 'naoIniciado'
      if (currentStatus !== 'concluido' && project.dueDate && new Date(project.dueDate) < now) {
        currentStatus = 'atrasado'
      }

      return {
        id: project.id,
        name: project.name,
        description: project.description || 'Sem descrição cadastrada.',
        progress,
        status: currentStatus,
        dueDate: project.dueDate as string | Date,
        tasksTotal,
        tasksDone,
        priority: project.priority,
        assignedUserId: project.ownerId // Pega o dono/responsável
      }
    })

    return formattedProjects
  } catch (error) {
    console.error('Erro ao buscar dados dos projetos:', error)
    return []
  }
}

export default async function ProjetosPage() {
    type Session = {
        id?: string
        sub?: string
        userId?: string
        role?: string
    }
  // 1. Pega os dados dos projetos
  const data = await getProjectsData()

  // 2. Pega a lista de usuários para o dropdown do Modal
  const userRepo = new UserRepo()
  const allUsers = await userRepo.list()
  const usersDropdown = allUsers.map(u => ({ id: u.id, name: u.name }))

  // 3. Descobre a role do usuário logado para liberar a exclusão
  const cookieStore = await cookies()
  const sessionValue = cookieStore.get(SESSION_COOKIE)?.value
  const session = readSessionToken(sessionValue) as Session
  const userRole = session?.role || 'operador'

  // Passa tudo certinho para o Client!
  return (
    <ProjetosClient 
      initialProjects={data} 
      userRole={userRole} 
      users={usersDropdown} 
    />
  )
}