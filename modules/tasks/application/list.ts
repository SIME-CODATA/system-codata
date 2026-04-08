import { TaskRepo } from '@/modules/tasks/infra/repo'
import { ProjectRepo } from '@/modules/projects/infra/repo'
import { UserRepo } from '@/modules/users/infra/repo'

export async function listTasks(
  taskRepo: TaskRepo,
  projectRepo: ProjectRepo,
  userRepo: UserRepo
) {
  const [tasks, projects, users] = await Promise.all([
    taskRepo.list(),
    projectRepo.list(),
    userRepo.list(),
  ])

  const projectsMap = new Map(projects.map((project) => [project.id, project.name]))
  const usersMap = new Map(users.map((user) => [user.id, user.name]))

  return tasks.map((task) => ({
    id: task.id,
    title: task.title,
    description: task.description,
    projectId: task.projectId,
    projectName: projectsMap.get(task.projectId) ?? 'Projeto não encontrado',
    assigneeId: task.assigneeId,
    assigneeName: usersMap.get(task.assigneeId) ?? 'Responsável não encontrado',
    status: task.status,
    priority: task.priority,
    dueDate: task.dueDate,
    createdAt: task.createdAt,
  }))
}