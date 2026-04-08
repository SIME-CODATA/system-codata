import { verifyPassword } from '@/core/security/password'
import { createSessionToken } from '@/core/security/session'
import { UserRepo } from '@/modules/users/infra/repo'

type Input = {
  email: string
  password: string
}

export async function signIn(repo: UserRepo, input: Input) {
  const email = input.email.trim().toLowerCase()
  const user = await repo.findByEmail(email)
  if (!user || !user.isActive) {
    throw new Error('Acesso não autorizado.')
  }

  const passwordOk = await verifyPassword(input.password, user.passwordHash)

  if (!passwordOk) {
    throw new Error('Credenciais inválidas.')
  }

  const token = createSessionToken(user.id, user.role)

  return {
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  }
}