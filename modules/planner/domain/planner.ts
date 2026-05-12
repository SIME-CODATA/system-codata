export type PlannerSyncStatus =
  | 'sincronizado'
  | 'pendenteCodata'
  | 'pendentePlanner'
  | 'erro'

export type PlannerMirrorTask = {
  id: string
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

  syncStatus: PlannerSyncStatus

  createdAt: Date
  updatedAt: Date
}