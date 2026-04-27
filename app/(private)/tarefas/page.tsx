import { listTasks } from '@/modules/tasks/application/list'
import { TaskRepo } from '@/modules/tasks/infra/repo'
import { ProjectRepo } from '@/modules/projects/infra/repo'
import { UserRepo } from '@/modules/users/infra/repo'
import { TarefasClient } from './components/tarefas-client'
import type { TaskStatus, TaskPriority } from '@/modules/tasks/domain/task'

export default async function TasksPage({
  searchParams,
}: {
  searchParams: Promise<{
    status?: string
    priority?: string
    projectId?: string
    assigneeId?: string
  }>
}) {
  const params = await searchParams

  const taskRepo = new TaskRepo()
  const projectRepo = new ProjectRepo()
  const userRepo = new UserRepo()

  const [tasks, projects, users] = await Promise.all([
    listTasks(taskRepo, projectRepo, userRepo, {
      status: params.status as TaskStatus | undefined,
      priority: params.priority as TaskPriority | undefined,
      projectId: params.projectId || undefined,
      assigneeId: params.assigneeId || undefined,
    }),
    projectRepo.list(),
    userRepo.list(),
  ])

  // Formata os dados para o Client Component
  const projectsDropdown = projects.map(p => ({ id: p.id, name: p.name }))
  const usersDropdown = users.map(u => ({ id: u.id, name: u.name }))

  return (
    <TarefasClient 
      tasks={tasks} 
      projects={projectsDropdown} 
      users={usersDropdown} 
      params={params} 
    />
  )
}