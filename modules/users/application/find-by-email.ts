import { UserRepo } from '@/modules/users/infra/repo'

export async function findUserByEmail(repo: UserRepo, email: string) {
  return repo.findByEmail(email.trim().toLowerCase())
}