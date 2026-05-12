import { graphRequest } from '@/modules/planner/infra/graph-client'
import { PlannerRepo } from '@/modules/planner/infra/repo'

type GraphCollection<T> = {
  value: T[]
}

type GraphPlannerPlan = {
  id: string
  title: string
}

type GraphPlannerBucket = {
  id: string
  name: string
  planId: string
}

type GraphPlannerTask = {
  id: string
  planId: string
  bucketId: string
  title: string
  percentComplete: number
  dueDateTime?: string | null
  lastModifiedDateTime?: string | null
  '@odata.etag'?: string
}

export async function importAllPlannerData(accessToken: string) {
  const repo = new PlannerRepo()

  const plansResponse = await graphRequest<GraphCollection<GraphPlannerPlan>>(
    accessToken,
    '/me/planner/plans'
  )

  let importedTasks = 0

  for (const plan of plansResponse.value) {
    const bucketsResponse = await graphRequest<
      GraphCollection<GraphPlannerBucket>
    >(accessToken, `/planner/plans/${plan.id}/buckets`)

    for (const bucket of bucketsResponse.value) {
      const tasksResponse = await graphRequest<GraphCollection<GraphPlannerTask>>(
        accessToken,
        `/planner/buckets/${bucket.id}/tasks`
      )

      for (const task of tasksResponse.value) {
        await repo.upsertTask({
          plannerTaskId: task.id,
          plannerPlanId: task.planId,
          plannerBucketId: task.bucketId,
          plannerEtag: task['@odata.etag'],
          planTitle: plan.title,
          bucketName: bucket.name,
          title: task.title,
          percentComplete: task.percentComplete,
          dueDate: task.dueDateTime ? new Date(task.dueDateTime) : null,
          lastPlannerModifiedAt: task.lastModifiedDateTime
            ? new Date(task.lastModifiedDateTime)
            : null,
        })

        importedTasks += 1
      }
    }
  }

  return {
    importedPlans: plansResponse.value.length,
    importedTasks,
  }
}