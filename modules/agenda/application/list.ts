import ical from 'node-ical'
import { AgendaRepo } from '@/modules/agenda/infra/repo'
import { ProjectRepo } from '@/modules/projects/infra/repo'
import { TaskRepo } from '@/modules/tasks/infra/repo'

interface VEvent {
  type: string
  start?: Date
  end?: Date
  datetype?: string
  uid?: string
  summary?: string
  description?: string
}

export async function listUnifiedAgenda(
  agendaRepo: AgendaRepo,
  projectRepo: ProjectRepo,
  taskRepo: TaskRepo,
  externalCalendarUrl?: string | null
) {
  const [events, projects, tasks] = await Promise.all([
    agendaRepo.list(),
    projectRepo.list(),
    taskRepo.list(),
  ])

  // 1. Eventos Internos
  const mappedEvents = events.map((e) => ({
    id: e.id,
    title: e.title,
    type: e.type,
    date: e.date,
    time: `${e.startTime} - ${e.endTime}`,
    origin: 'agenda' as const,
    description: e.description,
  }))

  // 2. Projetos
  const projectDeadlines = projects
    .filter((p) => p.dueDate && p.status !== 'concluido')
    .map((p) => ({
      id: p.id,
      title: `Entrega: ${p.name}`,
      type: 'entrega' as const,
      date: p.dueDate!,
      time: 'Dia Inteiro',
      origin: 'projeto' as const,
      description: `Status: ${p.status}`,
    }))

  // 3. Tarefas
  const taskDeadlines = tasks
    .filter((t) => t.dueDate && t.status !== 'concluida')
    .map((t) => ({
      id: t.id,
      title: `Tarefa: ${t.title}`,
      type: 'marco' as const,
      date: t.dueDate!,
      time: 'Prazo Limite',
      origin: 'tarefa' as const,
      description: `Prioridade: ${t.priority}`,
    }))

  // 4. Calendário Externo (Google/Teams)
  const externalEvents: any[] = []

  if (externalCalendarUrl) {
    try {
      // Usamos o fetch nativo (mais seguro e com suporte a cache do Next.js)
      const response = await fetch(externalCalendarUrl, { next: { revalidate: 3600 } }) // Atualiza a cada 1 hora
      const icsData = await response.text()
      
      // Interpretamos o texto puro
      const webEvents = ical.sync.parseICS(icsData)
      
      for (const ev of Object.values(webEvents)) {
        const event = ev as VEvent
        
        if (event.type === 'VEVENT' && event.start) {
          const startDate = new Date(event.start)
          
          // Ignora eventos de anos passados para não pesar a lista
          if (startDate.getFullYear() < new Date().getFullYear()) continue

          const isFullDay = event.datetype === 'date'
          let timeStr = 'Dia Inteiro'
          
          if (!isFullDay) {
            const hh = String(startDate.getHours()).padStart(2, '0')
            const mm = String(startDate.getMinutes()).padStart(2, '0')
            timeStr = `${hh}:${mm}`
          }

          externalEvents.push({
            id: event.uid || Math.random().toString(),
            title: event.summary || 'Compromisso Externo',
            type: 'lembrete' as const,
            date: startDate,
            time: timeStr,
            origin: 'externo' as const,
            description: 'Sincronizado do seu calendário pessoal',
          })
        }
      }
    } catch (err) {
      console.error('Falha ao sincronizar calendário externo:', err)
    }
  }

  // Consolidar tudo e ordenar por data
  const unified = [...mappedEvents, ...projectDeadlines, ...taskDeadlines, ...externalEvents].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  )

  return unified
}