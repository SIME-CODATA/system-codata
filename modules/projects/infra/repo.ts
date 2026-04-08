import { connectMongo } from '@/core/database/mongo'
import { ProjectModel } from './schema'
import type { Project } from '@/modules/projects/domain/project'

function toProject(doc: any): Project {
  return {
    id: doc._id.toString(),
    name: doc.name,
    description: doc.description,
    status: doc.status,
    priority: doc.priority,
    ownerId: doc.ownerId,
    memberIds: doc.memberIds ?? [],
    progress: doc.progress,
    startDate: doc.startDate,
    dueDate: doc.dueDate,
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
  }
}

export class ProjectRepo {
  async create(data: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>) {
    await connectMongo()
    const created = await ProjectModel.create(data)
    return toProject(created)
  }

  async list() {
    await connectMongo()
    const docs = await ProjectModel.find().sort({ createdAt: -1 })
    return docs.map(toProject)
  }
}