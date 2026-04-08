import { ProjectRepo } from '@/modules/projects/infra/repo'
import { UserRepo } from '@/modules/users/infra/repo'

export async function listProjects(projectRepo: ProjectRepo, userRepo: UserRepo) {
  const [projects, users] = await Promise.all([
    projectRepo.list(),
    userRepo.list(),
  ])

  const usersMap = new Map(users.map((user) => [user.id, user.name]))

  return projects.map((project) => ({
    id: project.id,
    name: project.name,
    description: project.description,
    status: project.status,
    priority: project.priority,
    ownerId: project.ownerId,
    ownerName: usersMap.get(project.ownerId) ?? 'Responsável não encontrado',
    memberIds: project.memberIds,
    progress: project.progress,
    startDate: project.startDate,
    dueDate: project.dueDate,
    createdAt: project.createdAt,
  }))
}