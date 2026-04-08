import { Schema, model, models } from 'mongoose'
import { USER_ROLES } from '@/modules/users/domain/user'

const userSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    passwordHash: { type: String, required: true },
    role: {
      type: String,
      enum: USER_ROLES,
      required: true,
      default: 'operador',
    },
    jobTitle: { type: String, required: true, trim: true },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
)

export const UserModel = models.User || model('User', userSchema)