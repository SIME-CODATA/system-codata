import { getDashboardSummary } from './application/summary'
import { DashboardCards } from './ui/cards'
import { DashboardLists } from './ui/lists'
import { ProjectRepo } from '@/modules/projects/infra/repo'
import { TaskRepo } from '@/modules/tasks/infra/repo'
import { UserRepo } from '@/modules/users/infra/repo'

export default async function DashboardPage() {
  const projectRepo = new ProjectRepo()
  const taskRepo = new TaskRepo()
  const userRepo = new UserRepo()

  const data = await getDashboardSummary(projectRepo, taskRepo, userRepo)

  return (
    <div style={{ display: 'grid', gap: 24 }}>
      <DashboardCards summary={data.summary} />
      <DashboardLists
        overdueTasks={data.overdueTasks}
        recentTasks={data.recentTasks}
      />
    </div>
  )
}