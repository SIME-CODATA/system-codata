import { getDashboardSummary } from './application/summary'
import { DashboardCards } from './ui/cards'
import { ProjectRepo } from '@/modules/projects/infra/repo'
import { TaskRepo } from '@/modules/tasks/infra/repo'

export default async function DashboardPage() {
  const projectRepo = new ProjectRepo()
  const taskRepo = new TaskRepo()

  const summary = await getDashboardSummary(projectRepo, taskRepo)

  return <DashboardCards summary={summary} />
}