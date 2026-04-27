export const PROJECT_STATUS = [
  'pendente',
  'emAndamento',
  'concluido',
  'pausado',
  'bloqueada',
  'cancelado',
  'atrasado',
  'naoIniciado',
] as const

export const PROJECT_PRIORITY = [
  'baixa',
  'media',
  'alta',
  'urgente',
] as const

export type ProjectStatus = (typeof PROJECT_STATUS)[number]
export type ProjectPriority = (typeof PROJECT_PRIORITY)[number]

export type Project = {
  id: string
  name: string
  description: string
  status: ProjectStatus
  priority: ProjectPriority
  ownerId: string
  memberIds: string[]
  progress: number
  startDate: Date | null
  dueDate: Date | null
  createdAt: Date
  updatedAt: Date
}

export type CreateProjectInput = {
  name: string
  description: string
  status: ProjectStatus
  priority: ProjectPriority
  ownerId: string
  memberIds?: string[]
  progress?: number
  startDate?: string | null
  dueDate?: string | null
}