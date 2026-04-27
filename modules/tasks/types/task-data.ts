import type { TaskStatus, TaskPriority } from '@/modules/tasks/domain/task'

export type TaskData = {
  id: string
  title: string
  description: string
  projectId: string
  projectName: string
  assigneeId?: string
  assigneeName?: string
  status: TaskStatus
  priority: TaskPriority
  dueDate: Date | string | null
}