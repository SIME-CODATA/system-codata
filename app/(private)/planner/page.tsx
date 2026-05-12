import { PlannerRepo } from '@/modules/planner/infra/repo'
import { PlannerSyncButton } from '@/modules/planner/ui/sync-button'
import { PlannerTable } from '@/modules/planner/ui/table'

export default async function PlannerPage() {
  const repo = new PlannerRepo()
  const tasks = await repo.listTasks()

  return (
    <div className="pb-12">
      <header className="border-b border-black/5 pb-6">
        <h1 className="text-[35px] font-bold text-foreground">
          Microsoft Planner
        </h1>
        <p className="text-muted">
          Integração bilateral entre CODATA e Planner. Na V1, o Planner é importado como fonte oficial.
        </p>
      </header>

      <div className="mt-6">
        <PlannerSyncButton />
      </div>

      <PlannerTable tasks={tasks} />
    </div>
  )
}