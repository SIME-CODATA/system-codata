import { listTasks } from '@/modules/tasks/application/list'
import { TaskRepo } from '@/modules/tasks/infra/repo'
import { TaskTable } from '@/modules/tasks/ui/table'
import { TaskFilters } from '@/modules/tasks/ui/filters'
import { ProjectRepo } from '@/modules/projects/infra/repo'
import { UserRepo } from '@/modules/users/infra/repo'

export default async function TasksPage({
  searchParams,
}: {
  searchParams: Promise<{
    status?: string
    priority?: string
    projectId?: string
    assigneeId?: string
  }>
}) {
  const params = await searchParams

  const taskRepo = new TaskRepo()
  const projectRepo = new ProjectRepo()
  const userRepo = new UserRepo()

  const [tasks, projects, users] = await Promise.all([
    listTasks(taskRepo, projectRepo, userRepo, {
      status: params.status as
        | 'pendente'
        | 'emAndamento'
        | 'concluida'
        | 'bloqueada'
        | 'cancelada'
        | undefined,
      priority: params.priority as
        | 'baixa'
        | 'media'
        | 'alta'
        | 'urgente'
        | undefined,
      projectId: params.projectId || undefined,
      assigneeId: params.assigneeId || undefined,
    }),
    projectRepo.list(),
    userRepo.list(),
  ])

  return (
    <div>
      <TaskFilters
        projects={projects.map((project) => ({
          id: project.id,
          name: project.name,
        }))}
        users={users.map((user) => ({
          id: user.id,
          name: user.name,
        }))}
        currentStatus={params.status}
        currentPriority={params.priority}
        currentProjectId={params.projectId}
        currentAssigneeId={params.assigneeId}
      />

      <TaskTable tasks={tasks} />
    </div>
  )
}