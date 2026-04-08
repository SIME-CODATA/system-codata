import { UserRepo } from '@/modules/users/infra/repo'

export async function getUser(repo: UserRepo, id: string) {
  return repo.findById(id)
}