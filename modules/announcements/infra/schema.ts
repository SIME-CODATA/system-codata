import { Schema, model, models } from 'mongoose'

const announcementSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    content: { type: String, required: true, trim: true },
    isUrgent: { type: Boolean, default: false },
    expiresAt: { type: Date, default: null },
    publishedBy: { type: String, required: true },
    targetUserIds: { type: [String], default: [] },
  },
  { timestamps: true }
)

export const AnnouncementModel =
  models.Announcement || model('Announcement', announcementSchema)