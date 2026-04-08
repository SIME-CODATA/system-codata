import type { CreateProjectInput } from '@/modules/projects/domain/project'
import { ProjectRepo } from '@/modules/projects/infra/repo'

export async function createProject(repo: ProjectRepo, input: CreateProjectInput) {
  const name = input.name.trim()
  const description = input.description.trim()

  if (!name) {
    throw new Error('Nome do projeto é obrigatório.')
  }

  if (!description) {
    throw new Error('Descrição do projeto é obrigatória.')
  }

  const progress = input.progress ?? 0

  if (progress < 0 || progress > 100) {
    throw new Error('Progresso deve estar entre 0 e 100.')
  }

  return repo.create({
    name,
    description,
    status: input.status,
    priority: input.priority,
    ownerId: input.ownerId,
    memberIds: input.memberIds ?? [],
    progress,
    startDate: input.startDate ? new Date(input.startDate) : null,
    dueDate: input.dueDate ? new Date(input.dueDate) : null,
  })
}