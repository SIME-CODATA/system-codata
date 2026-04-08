import { Schema, model, models } from 'mongoose'
import { TASK_PRIORITY, TASK_STATUS } from '@/modules/tasks/domain/task'

const taskSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    projectId: { type: String, required: true, trim: true },
    assigneeId: { type: String, required: true, trim: true },
    status: {
      type: String,
      enum: TASK_STATUS,
      required: true,
      default: 'pendente',
    },
    priority: {
      type: String,
      enum: TASK_PRIORITY,
      required: true,
      default: 'media',
    },
    dueDate: { type: Date, default: null },
  },
  { timestamps: true }
)

export const TaskModel = models.Task || model('Task', taskSchema)