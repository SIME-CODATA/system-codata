import { Schema, model, models } from 'mongoose'
import { PROJECT_PRIORITY, PROJECT_STATUS } from '@/modules/projects/domain/project'

const projectSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    status: {
      type: String,
      enum: PROJECT_STATUS,
      required: true,
      default: 'naoIniciado',
    },
    priority: {
      type: String,
      enum: PROJECT_PRIORITY,
      required: true,
      default: 'media',
    },
    ownerId: { type: String, required: true, trim: true },
    memberIds: { type: [String], default: [] },
    progress: { type: Number, required: true, default: 0, min: 0, max: 100 },
    startDate: { type: Date, default: null },
    dueDate: { type: Date, default: null },
  },
  { timestamps: true }
)

export const ProjectModel = models.Project || model('Project', projectSchema)