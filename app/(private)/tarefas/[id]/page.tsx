import { notFound } from 'next/navigation'
import { TaskForm } from '@/modules/tasks/ui/form'
import { TaskRepo } from '@/modules/tasks/infra/repo'
import { ProjectRepo } from '@/modules/projects/infra/repo'
import { UserRepo } from '@/modules/users/infra/repo'

export default async function TaskDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  const taskRepo = new TaskRepo()
  const projectRepo = new ProjectRepo()
  const userRepo = new UserRepo()

  const [task, projects, users] = await Promise.all([
    taskRepo.findById(id),
    projectRepo.list(),
    userRepo.list(),
  ])

  if (!task) {
    notFound()
  }

  return (
    <TaskForm
      task={{
        id: task.id,
        title: task.title,
        description: task.description,
        projectId: task.projectId,
        assigneeId: task.assigneeId,
        status: task.status,
        priority: task.priority,
        dueDate: task.dueDate ? new Date(task.dueDate).toISOString() : null,
      }}
      projects={projects.map((project) => ({
        id: project.id,
        name: project.name,
      }))}
      users={users.map((user) => ({
        id: user.id,
        name: user.name,
      }))}
    />
  )
}