import { connectMongo } from '@/core/database/mongo'
import { TaskModel } from './schema'
import type { Task, TaskPriority, TaskStatus } from '@/modules/tasks/domain/task'

type ListTaskFilters = {
  status?: TaskStatus
  priority?: TaskPriority
  projectId?: string
  assigneeId?: string
}

function toTask(doc: typeof TaskModel.prototype): Task {
  return {
    id: doc._id.toString(),
    title: doc.title,
    description: doc.description,
    projectId: doc.projectId,
    assigneeId: doc.assigneeId,
    status: doc.status,
    priority: doc.priority,
    dueDate: doc.dueDate,
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
  }
}

export class TaskRepo {
  async create(data: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) {
    await connectMongo()
    const created = await TaskModel.create(data)
    return toTask(created)
  }

  async list(filters?: ListTaskFilters) {
    await connectMongo()

    const query: Record<string, unknown> = {}

    if (filters?.status) {
      query.status = filters.status
    }

    if (filters?.priority) {
      query.priority = filters.priority
    }

    if (filters?.projectId) {
      query.projectId = filters.projectId
    }

    if (filters?.assigneeId) {
      query.assigneeId = filters.assigneeId
    }

    const docs = await TaskModel.find(query).sort({ createdAt: -1 })
    return docs.map(toTask)
  }

  async findById(id: string) {
    await connectMongo()
    const doc = await TaskModel.findById(id)
    return doc ? toTask(doc) : null
  }

  async update(
    id: string,
    data: Partial<Omit<Task, 'id' | 'createdAt' | 'updatedAt'>>
  ) {
    await connectMongo()

    const updated = await TaskModel.findByIdAndUpdate(id, data, {
      new: true,
    })

    return updated ? toTask(updated) : null
  }
}