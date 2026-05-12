import { connectMongo } from '@/core/database/mongo'
import { PlannerMirrorTaskModel } from './schema'
import type { PlannerMirrorTask } from '@/modules/planner/domain/planner'

type UpsertPlannerTaskInput = {
  plannerTaskId: string
  plannerPlanId: string
  plannerBucketId: string
  plannerEtag?: string
  planTitle?: string
  bucketName?: string
  title: string
  percentComplete: number
  dueDate: Date | null
  lastPlannerModifiedAt: Date | null
}

function toPlannerMirrorTask(doc: {
  _id: { toString(): string }
  plannerTaskId: string
  plannerPlanId: string
  plannerBucketId: string
  plannerEtag?: string
  planTitle?: string
  bucketName?: string
  title: string
  percentComplete: number
  dueDate: Date | null
  lastPlannerModifiedAt: Date | null
  lastSyncedAt: Date | null
  syncStatus: PlannerMirrorTask['syncStatus']
  createdAt: Date
  updatedAt: Date
}): PlannerMirrorTask {
  return {
    id: doc._id.toString(),
    plannerTaskId: doc.plannerTaskId,
    plannerPlanId: doc.plannerPlanId,
    plannerBucketId: doc.plannerBucketId,
    plannerEtag: doc.plannerEtag,
    planTitle: doc.planTitle,
    bucketName: doc.bucketName,
    title: doc.title,
    percentComplete: doc.percentComplete,
    dueDate: doc.dueDate,
    lastPlannerModifiedAt: doc.lastPlannerModifiedAt,
    lastSyncedAt: doc.lastSyncedAt,
    syncStatus: doc.syncStatus,
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
  }
}

export class PlannerRepo {
  async upsertTask(input: UpsertPlannerTaskInput) {
    await connectMongo()

    const doc = await PlannerMirrorTaskModel.findOneAndUpdate(
      { plannerTaskId: input.plannerTaskId },
      {
        ...input,
        lastSyncedAt: new Date(),
        syncStatus: 'sincronizado',
      },
      { upsert: true, new: true }
    )

    return toPlannerMirrorTask(doc)
  }

  async listTasks() {
    await connectMongo()

    const docs = await PlannerMirrorTaskModel.find().sort({
      lastSyncedAt: -1,
      title: 1,
    })

    return docs.map(toPlannerMirrorTask)
  }
}