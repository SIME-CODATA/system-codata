import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/core/security/session'
import { UserRepo } from '@/modules/users/infra/repo'
import { createUser } from '@/modules/users/application/manage'

function isAdmin(role?: string) {
  return role === 'adminGeral' || role === 'superAdmin'
}

export async function POST(request: NextRequest) {
  const session = getSession(request)
  if (!session || !isAdmin(session.role)) {
    return NextResponse.json({ error: 'Sem permissão' }, { status: 403 })
  }

  try {
    const body = await request.json()
    const repo = new UserRepo()
    const user = await createUser(repo, body)
    
    return NextResponse.json(user, { status: 201 })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Falha ao criar usuário.'
    return NextResponse.json({ error: message }, { status: 400 })
  }
}