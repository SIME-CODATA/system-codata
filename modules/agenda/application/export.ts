import * as ics from 'ics'
import { listUnifiedAgenda } from './list'
import { AgendaRepo } from '@/modules/agenda/infra/repo'
import { ProjectRepo } from '@/modules/projects/infra/repo'
import { TaskRepo } from '@/modules/tasks/infra/repo'

export async function exportAgendaToICS(
  agendaRepo: AgendaRepo,
  projectRepo: ProjectRepo,
  taskRepo: TaskRepo
) {
  const items = await listUnifiedAgenda(agendaRepo, projectRepo, taskRepo)

  const events: ics.EventAttributes[] = items.map((item) => {
    const d = new Date(item.date)
    const year = d.getUTCFullYear()
    const month = d.getUTCMonth() + 1
    const day = d.getUTCDate()

    const start: ics.DateArray = [year, month, day]
    const baseEvent = {
      title: `[CODATA] ${item.title}`,
      description: `${item.description}\n\nOrigem: ${item.origin}`,
      url: `http://localhost:3000/agenda`,
      start,
    }

    // Se tiver horário específico (ex: "14:00 - 15:00")
    if (item.time && item.time.includes(':')) {
      const [startStr] = item.time.split(' - ')
      if (startStr) {
        const [hh, mm] = startStr.split(':')
        return {
          ...baseEvent,
          start: [year, month, day, parseInt(hh, 10), parseInt(mm, 10)],
          duration: { hours: 1 },
        } as ics.EventAttributes
      }
    }
    const nextDay = new Date(d)
    nextDay.setUTCDate(nextDay.getUTCDate() + 1)

    return {
      ...baseEvent,
      end: [nextDay.getUTCFullYear(), nextDay.getUTCMonth() + 1, nextDay.getUTCDate()],
    } as ics.EventAttributes
  })

  const { error, value } = ics.createEvents(events)

  if (error || !value) {
    throw new Error('Falha ao gerar calendário ICS')
  }

  return value
}