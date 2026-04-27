import { Schema, model, models } from 'mongoose'
import { EVENT_TYPES } from '@/modules/agenda/domain/event'

const agendaEventSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, trim: true, default: '' },
    type: {
      type: String,
      enum: EVENT_TYPES,
      required: true,
      default: 'reuniao',
    },
    date: { type: Date, required: true },
    startTime: { type: String, required: true, trim: true },
    endTime: { type: String, required: true, trim: true },
    projectId: { type: String, default: null },
    taskId: { type: String, default: null },
    participantIds: { type: [String], default: [] },
  },
  { timestamps: true }
)

export const AgendaEventModel = models.AgendaEvent || model('AgendaEvent', agendaEventSchema)