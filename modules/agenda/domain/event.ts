export const EVENT_TYPES = [
  'reuniao',
  'entrega',
  'marco',
  'lembrete',
] as const

export type EventType = (typeof EVENT_TYPES)[number]

export type AgendaEvent = {
  id: string
  title: string
  description: string
  type: EventType
  date: Date
  startTime: string // ex: "14:00"
  endTime: string   // ex: "15:00"
  projectId?: string | null
  taskId?: string | null
  participantIds: string[]
  createdAt: Date
  updatedAt: Date
}

export type CreateEventInput = {
  title: string
  description: string
  type: EventType
  date: string
  startTime: string
  endTime: string
  projectId?: string | null
  taskId?: string | null
  participantIds?: string[]
}