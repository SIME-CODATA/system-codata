import { UserRepo } from '@/modules/users/infra/repo'
import { hashPassword } from '@/core/security/password'
import type { CreateUserInput, UpdateUserInput } from '@/modules/users/domain/user'

export async function createUser(repo: UserRepo, input: CreateUserInput) {
  if (!input.name || !input.email || !input.password) {
    throw new Error('Nome, email e senha são obrigatórios.')
  }

  const existingUser = await repo.findByEmail(input.email)
  if (existingUser) {
    throw new Error('Já existe um usuário com este e-mail.')
  }

  const hashedPassword = await hashPassword(input.password)

  return repo.create({
    name: input.name.trim(),
    email: input.email.toLowerCase().trim(),
    passwordHash: hashedPassword,
    role: input.role,
    jobTitle: input.jobTitle.trim(),
    isActive: true,
  })
}

export async function updateUser(repo: UserRepo, id: string, input: UpdateUserInput) {
  const dataToUpdate: Partial<UpdateUserInput> = {}

  if (input.name) dataToUpdate.name = input.name.trim()
  if (input.email) dataToUpdate.email = input.email.toLowerCase().trim()
  if (input.role) dataToUpdate.role = input.role
  if (input.jobTitle) dataToUpdate.jobTitle = input.jobTitle.trim()
  
  if (typeof input.isActive === 'boolean') {
    dataToUpdate.isActive = input.isActive
  }

  if (input.password && input.password.trim() !== '') {
    dataToUpdate.password = await hashPassword(input.password)
  }

  return repo.update(id, dataToUpdate as Partial<UpdateUserInput & { password: string }>)
}