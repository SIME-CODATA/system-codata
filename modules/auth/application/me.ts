import { UserRepo } from '@/modules/users/infra/repo'
import type { SessionData } from '@/core/security/session'

export async function getCurrentUser(repo: UserRepo, session: SessionData) {
  const user = await repo.findById(session.userId)

  if (!user || !user.isActive) {
    return null
  }

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  }
}