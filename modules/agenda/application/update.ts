import { AgendaRepo } from '@/modules/agenda/infra/repo'
import type { CreateEventInput } from '@/modules/agenda/domain/event'

export async function updateEvent(repo: AgendaRepo, id: string, input: CreateEventInput) {
  const existing = await repo.findById(id) // Você precisará adicionar findById no AgendaRepo
  if (!existing) throw new Error('Evento não encontrado.')

  return repo.update(id, {
    title: input.title.trim(),
    description: input.description.trim(),
    type: input.type,
    date: new Date(input.date),
    startTime: input.startTime,
    endTime: input.endTime,
    projectId: input.projectId || null,
    taskId: input.taskId || null,
    participantIds: input.participantIds || [],
  })
}