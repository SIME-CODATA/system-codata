import { UserRepo } from '@/modules/users/infra/repo'

export async function listUsers(repo: UserRepo) {
  const users = await repo.list()

  return users.map((user) => ({
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    jobTitle: user.jobTitle,
    isActive: user.isActive,
    createdAt: user.createdAt,
  }))
}