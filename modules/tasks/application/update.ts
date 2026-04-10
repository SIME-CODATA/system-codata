import { TaskRepo } from '@/modules/tasks/infra/repo'
import { ProjectRepo } from '@/modules/projects/infra/repo'
import { UserRepo } from '@/modules/users/infra/repo'
import type { TaskPriority, TaskStatus } from '@/modules/tasks/domain/task'

type UpdateTaskInput = {
  title: string
  description: string
  projectId: string
  assigneeId: string
  status: TaskStatus
  priority: TaskPriority
  dueDate?: string | null
}

export async function updateTask(
  taskRepo: TaskRepo,
  projectRepo: ProjectRepo,
  userRepo: UserRepo,
  id: string,
  input: UpdateTaskInput
) {
  const existing = await taskRepo.findById(id)

  if (!existing) {
    throw new Error('Tarefa não encontrada.')
  }

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

  const updated = await taskRepo.update(id, {
    title,
    description,
    projectId: input.projectId,
    assigneeId: input.assigneeId,
    status: input.status,
    priority: input.priority,
    dueDate: input.dueDate ? new Date(input.dueDate) : null,
  })

  if (!updated) {
    throw new Error('Não foi possível atualizar a tarefa.')
  }

  return updated
}