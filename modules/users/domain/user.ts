export const USER_ROLES = [
  'visitante',
  'operador',
  'adminGeral',
  'superAdmin',
] as const

export type UserRole = (typeof USER_ROLES)[number]

export type User = {
  id: string
  name: string
  email: string
  passwordHash: string
  role: UserRole
  jobTitle: string
  isActive: boolean
  externalCalendarUrl?: string | null
  createdAt: Date
  updatedAt: Date
}

export type CreateUserInput = {
  name: string
  email: string
  password: string
  role: UserRole
  jobTitle: string
}