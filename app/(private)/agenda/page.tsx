import { TaskRepo } from '@/modules/tasks/infra/repo'
import { AgendaClient, AgendaTask } from './components/agenda-client'

async function getAgendaTasks(): Promise<AgendaTask[]> {
  const taskRepo = new TaskRepo()

  try {
    // Traz todas as tarefas
    const allTasks = await taskRepo.list()

    // Filtra: Queremos apenas tarefas que possuem uma data de vencimento (dueDate)
    const tasksWithDates = allTasks.filter(task => task.dueDate !== null && task.dueDate !== undefined)

    // Formata os dados para o Client Component
    const formattedTasks: AgendaTask[] = tasksWithDates.map(task => {
      // Pega o objeto Date do MongoDB e converte para string "YYYY-MM-DD"
      // Isso evita problemas de fuso horário no calendário do Front-end
      const dateObj = new Date(task.dueDate as Date)
      const year = dateObj.getFullYear()
      const month = String(dateObj.getMonth() + 1).padStart(2, '0')
      const day = String(dateObj.getDate()).padStart(2, '0')

      return {
        id: task.id,
        title: task.title,
        status: task.status as any,
        priority: task.priority as any,
        dueDate: `${year}-${month}-${day}` // String limpa para matemática no frontend
      }
    })

    return formattedTasks

  } catch (error) {
    console.error('Erro ao buscar tarefas para a agenda:', error)
    return []
  }
}

export default async function AgendaPage() {
  const tasksForAgenda = await getAgendaTasks()

  return <AgendaClient tasks={tasksForAgenda} />
}