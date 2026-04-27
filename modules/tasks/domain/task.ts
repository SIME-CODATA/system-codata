export const TASK_STATUS = [
  'pendente',
  'emAndamento',
  'concluida',
  'bloqueada',
  'cancelada',
  'atrasado',
  'naoIniciado',
] as const

export const TASK_PRIORITY = [
  'baixa',
  'media',
  'alta',
  'urgente',
] as const

export type TaskStatus = (typeof TASK_STATUS)[number]
export type TaskPriority = (typeof TASK_PRIORITY)[number]

export type Task = {
  id: string
  title: string
  description: string
  projectId: string
  assigneeId: string
  status: TaskStatus
  priority: TaskPriority
  dueDate: Date | null
  createdAt: Date
  updatedAt: Date
}

export type CreateTaskInput = {
  title: string
  description: string
  projectId: string
  assigneeId: string
  status: TaskStatus
  priority: TaskPriority
  dueDate?: string | null
}