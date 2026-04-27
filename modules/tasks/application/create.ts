import type { CreateTaskInput } from '@/modules/tasks/domain/task'
import { TaskRepo } from '@/modules/tasks/infra/repo'
import { ProjectRepo } from '@/modules/projects/infra/repo'
import { UserRepo } from '@/modules/users/infra/repo'

export async function createTask(
  taskRepo: TaskRepo,
  projectRepo: ProjectRepo,
  userRepo: UserRepo,
  input: CreateTaskInput
) {
  const title = input.title.trim()
  const description = input.description.trim()

  if (!title) {
    throw new Error('Título da tarefa é obrigatório.')
  }

  if (!description) {
    throw new Error('Descrição da tarefa é obrigatória.')
  }

  const [projects, users] = await Promise.all([
    projectRepo.list(),
    userRepo.list(),
  ])

  const projectExists = projects.some((project) => project.id === input.projectId)
  if (!projectExists) {
    throw new Error('Projeto não encontrado.')
  }

  const assigneeExists = users.some((user) => user.id === input.assigneeId)
  if (!assigneeExists) {
    throw new Error('Responsável não encontrado.')
  }

  return taskRepo.create({
    title,
    description,
    projectId: input.projectId,
    assigneeId: input.assigneeId,
    status: input.status,
    priority: input.priority,
    dueDate: input.dueDate ? new Date(input.dueDate) : null,
  })
}