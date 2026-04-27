import { connectMongo } from '@/core/database/mongo'
import { AgendaEventModel } from './schema'
import type { AgendaEvent } from '@/modules/agenda/domain/event'

function toEvent(doc: typeof AgendaEventModel.prototype): AgendaEvent {
  return {
    id: doc._id.toString(),
    title: doc.title,
    description: doc.description,
    type: doc.type,
    date: doc.date,
    startTime: doc.startTime,
    endTime: doc.endTime,
    projectId: doc.projectId,
    taskId: doc.taskId,
    participantIds: doc.participantIds ?? [],
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
  }
}

export class AgendaRepo {
  async create(data: Omit<AgendaEvent, 'id' | 'createdAt' | 'updatedAt'>) {
    await connectMongo()
    const created = await AgendaEventModel.create(data)
    return toEvent(created)
  }

  async list() {
    await connectMongo()
    // Ordena pela data mais próxima primeiro
    const docs = await AgendaEventModel.find().sort({ date: 1, startTime: 1 })
    return docs.map(toEvent)
  }

  async findById(id: string) {
    await connectMongo()
    const doc = await AgendaEventModel.findById(id)
    return doc ? toEvent(doc) : null
  }

  async update(
    id: string,
    data: Partial<Omit<AgendaEvent, 'id' | 'createdAt' | 'updatedAt'>>
  ) {
    await connectMongo()

    const updated = await AgendaEventModel.findByIdAndUpdate(id, data, {
      new: true, // Retorna o documento já atualizado
    })

    return updated ? toEvent(updated) : null
  }
}