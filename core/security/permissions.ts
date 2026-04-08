import type { UserRole } from '@/modules/users/domain/user'

export function canManageUsers(role: UserRole) {
  return role === 'adminGeral' || role === 'superAdmin'
}