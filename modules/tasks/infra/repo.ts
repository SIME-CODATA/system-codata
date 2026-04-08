import { connectMongo } from '@/core/database/mongo'
import { TaskModel } from './schema'
import type { Task } from '@/modules/tasks/domain/task'

function toTask(doc: any): Task {
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

  async list() {
    await connectMongo()
    const docs = await TaskModel.find().sort({ createdAt: -1 })
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