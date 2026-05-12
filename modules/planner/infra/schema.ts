import { Schema, model, models } from 'mongoose'

const plannerMirrorTaskSchema = new Schema(
  {
    plannerTaskId: { type: String, required: true, unique: true },
    plannerPlanId: { type: String, required: true },
    plannerBucketId: { type: String, required: true },
    plannerEtag: { type: String },

    planTitle: { type: String },
    bucketName: { type: String },

    title: { type: String, required: true },
    percentComplete: { type: Number, required: true, default: 0 },
    dueDate: { type: Date, default: null },

    lastPlannerModifiedAt: { type: Date, default: null },
    lastSyncedAt: { type: Date, default: null },

    syncStatus: {
      type: String,
      enum: ['sincronizado', 'pendenteCodata', 'pendentePlanner', 'erro'],
      default: 'sincronizado',
    },
  },
  { timestamps: true }
)

export const PlannerMirrorTaskModel =
  models.PlannerMirrorTask ||
  model('PlannerMirrorTask', plannerMirrorTaskSchema)