import { connectMongo } from '@/core/database/mongo'
import { hashPassword } from '@/core/security/password'
import { UserModel } from './schema'

export async function seedUsers() {
  await connectMongo()

  const users = [
    {
      name: 'Administrador Geral',
      email: 'admin@codata.local'.toLowerCase(),
      passwordHash: await hashPassword('123456'),
      role: 'adminGeral',
      jobTitle: 'Administrador',
      isActive: true,
    },
    {
      name: 'Visitante CODATA',
      email: 'visitante@codata.local'.toLowerCase(),
      passwordHash: await hashPassword('123456'),
      role: 'visitante',
      jobTitle: 'Visitante',
      isActive: true,
    },
  ]

  for (const user of users) {
    const exists = await UserModel.findOne({ email: user.email })
    if (!exists) {
      await UserModel.create(user)
    }
  }
}