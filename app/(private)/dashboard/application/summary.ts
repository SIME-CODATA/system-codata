import { ProjectRepo } from '@/modules/projects/infra/repo'
import { TaskRepo } from '@/modules/tasks/infra/repo'
import { UserRepo } from '@/modules/users/infra/repo'

export async function getDashboardSummary(
  projectRepo: ProjectRepo,
  taskRepo: TaskRepo,
  userRepo: UserRepo
) {
  const [projects, tasks, users] = await Promise.all([
    projectRepo.list(),
    taskRepo.list(),
    userRepo.list(),
  ])

  const now = new Date()

  const projectsMap = new Map(projects.map((project) => [project.id, project.name]))
  const usersMap = new Map(users.map((user) => [user.id, user.name]))

  const overdueTasks = tasks
    .filter((task) => {
      if (!task.dueDate) return false

      return (
        new Date(task.dueDate) < now &&
        task.status !== 'concluida' &&
        task.status !== 'cancelada'
      )
    })
    .map((task) => ({
      id: task.id,
      title: task.title,
      projectName: projectsMap.get(task.projectId) ?? 'Projeto não encontrado',
      assigneeName:
        usersMap.get(task.assigneeId) ?? 'Responsável não encontrado',
      dueDate: task.dueDate,
      status: task.status,
      priority: task.priority,
    }))
    .sort((a, b) => {
      const aTime = a.dueDate ? new Date(a.dueDate).getTime() : 0
      const bTime = b.dueDate ? new Date(b.dueDate).getTime() : 0
      return aTime - bTime
    })
    .slice(0, 5)

  const recentTasks = tasks
    .map((task) => ({
      id: task.id,
      title: task.title,
      projectName: projectsMap.get(task.projectId) ?? 'Projeto não encontrado',
      assigneeName:
        usersMap.get(task.assigneeId) ?? 'Responsável não encontrado',
      dueDate: task.dueDate,
      status: task.status,
      priority: task.priority,
      createdAt: task.createdAt,
    }))
    .sort((a, b) => {
      return (
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )
    })
    .slice(0, 5)

  const pendingTasks = tasks.filter((task) => task.status === 'pendente')
  const inProgressTasks = tasks.filter((task) => task.status === 'emAndamento')
  const completedTasks = tasks.filter((task) => task.status === 'concluida')

  return {
    summary: {
      totalProjects: projects.length,
      totalTasks: tasks.length,
      pendingTasks: pendingTasks.length,
      inProgressTasks: inProgressTasks.length,
      completedTasks: completedTasks.length,
      overdueTasks: overdueTasks.length,
    },
    overdueTasks,
    recentTasks,
  }
}