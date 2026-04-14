import { connectMongo } from '@/core/database/mongo'
import { AnnouncementModel } from './schema'
import type { Announcement } from '@/modules/announcements/domain/announcement'

function toAnnouncement(doc: typeof AnnouncementModel.prototype): Announcement {
  return {
    id: doc._id.toString(),
    title: doc.title,
    content: doc.content,
    isUrgent: doc.isUrgent,
    expiresAt: doc.expiresAt,
    publishedBy: doc.publishedBy,
    targetUserIds: doc.targetUserIds || [],
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
  }
}

export class AnnouncementRepo {
  async create(data: Omit<Announcement, 'id' | 'createdAt' | 'updatedAt'>) {
    await connectMongo()
    const created = await AnnouncementModel.create(data)
    return toAnnouncement(created)
  }

  async listActive(currentUserId: string, isAdmin: boolean = false) {
    await connectMongo()
    const now = new Date()

    const recipientFilter = isAdmin 
      ? {} 
      : {
          $or: [
            { targetUserIds: { $exists: false } },
            { targetUserIds: null },
            { targetUserIds: { $size: 0 } },
            { targetUserIds: currentUserId }
          ]
        };

    const docs = await AnnouncementModel.find({
      $and: [
        { $or: [{ expiresAt: null }, { expiresAt: { $exists: false } }, { expiresAt: { $gte: now } }] },
        recipientFilter
      ]
    }).sort({ isUrgent: -1, createdAt: -1 })

    return docs.map(toAnnouncement)
  }

  // Método para deletar
  async delete(id: string) {
    await connectMongo()
    await AnnouncementModel.findByIdAndDelete(id)
  }

  async findById(id: string) {
    await connectMongo()
    const doc = await AnnouncementModel.findById(id)
    return doc ? toAnnouncement(doc) : null
  }

  async update(id: string, data: Partial<Announcement>) {
    await connectMongo()
    const updated = await AnnouncementModel.findByIdAndUpdate(id, data, { returnDocument: 'after' })
    return updated ? toAnnouncement(updated) : null
  }
}