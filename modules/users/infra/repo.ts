import { connectMongo } from '@/core/database/mongo'
import { UserModel } from './schema'
import type { User } from '@/modules/users/domain/user'

function toUser(doc: any): User {
  return {
    id: doc._id.toString(),
    name: doc.name,
    email: doc.email,
    passwordHash: doc.passwordHash,
    role: doc.role,
    jobTitle: doc.jobTitle,
    isActive: doc.isActive,
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
  }
}

export class UserRepo {
  async findByEmail(email: string) {
  await connectMongo()
  const doc = await UserModel.findOne({ email: email.toLowerCase() })
  return doc ? toUser(doc) : null
    }

  async findById(id: string) {
    await connectMongo()
    const doc = await UserModel.findById(id)
    return doc ? toUser(doc) : null
  }

  async list() {
    await connectMongo()
    const docs = await UserModel.find().sort({ name: 1 })
    return docs.map(toUser)
  }
}