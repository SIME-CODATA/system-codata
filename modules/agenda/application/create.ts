import type { CreateEventInput } from '@/modules/agenda/domain/event'
import { AgendaRepo } from '@/modules/agenda/infra/repo'

export async function createEvent(repo: AgendaRepo, input: CreateEventInput) {
  const title = input.title.trim()

  if (!title) {
    throw new Error('Título do evento é obrigatório.')
  }

  if (!input.date) {
    throw new Error('Data do evento é obrigatória.')
  }

  return repo.create({
    title,
    description: input.description.trim(),
    type: input.type,
    date: new Date(input.date),
    startTime: input.startTime.trim(),
    endTime: input.endTime.trim(),
    projectId: input.projectId || null,
    taskId: input.taskId || null,
    participantIds: input.participantIds ?? [],
  })
}