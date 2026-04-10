import { ProjectRepo } from '@/modules/projects/infra/repo'
import { TaskRepo } from '@/modules/tasks/infra/repo'

export async function getDashboardSummary(
  projectRepo: ProjectRepo,
  taskRepo: TaskRepo
) {
  const [projects, tasks] = await Promise.all([
    projectRepo.list(),
    taskRepo.list(),
  ])

  const now = new Date()

  const overdueTasks = tasks.filter((task) => {
    if (!task.dueDate) return false

    return (
      new Date(task.dueDate) < now &&
      task.status !== 'concluida' &&
      task.status !== 'cancelada'
    )
  })

  const pendingTasks = tasks.filter((task) => task.status === 'pendente')
  const inProgressTasks = tasks.filter((task) => task.status === 'emAndamento')
  const completedTasks = tasks.filter((task) => task.status === 'concluida')

  return {
    totalProjects: projects.length,
    totalTasks: tasks.length,
    pendingTasks: pendingTasks.length,
    inProgressTasks: inProgressTasks.length,
    completedTasks: completedTasks.length,
    overdueTasks: overdueTasks.length,
  }
}