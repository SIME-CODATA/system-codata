import { listTasks } from '@/modules/tasks/application/list'
import { TaskRepo } from '@/modules/tasks/infra/repo'
import { TaskTable } from '@/modules/tasks/ui/table'
import { ProjectRepo } from '@/modules/projects/infra/repo'
import { UserRepo } from '@/modules/users/infra/repo'

export default async function TasksPage() {
  const taskRepo = new TaskRepo()
  const projectRepo = new ProjectRepo()
  const userRepo = new UserRepo()

  const tasks = await listTasks(taskRepo, projectRepo, userRepo)

  return <TaskTable tasks={tasks} />
}