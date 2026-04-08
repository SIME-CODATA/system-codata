import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/core/security/session'
import { canManageUsers } from '@/core/security/permissions'
import { listUsers } from '@/modules/users/application/list'
import { UserRepo } from '@/modules/users/infra/repo'

export async function GET(request: NextRequest) {
  const session = getSession(request)

  if (!session) {
    return NextResponse.json({ error: 'Não autenticado.' }, { status: 401 })
  }

  if (!canManageUsers(session.role)) {
    return NextResponse.json({ error: 'Sem permissão.' }, { status: 403 })
  }

  const repo = new UserRepo()
  const users = await listUsers(repo)

  return NextResponse.json(users)
}