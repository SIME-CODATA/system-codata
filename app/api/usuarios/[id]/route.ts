import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/core/security/session'
import { UserRepo } from '@/modules/users/infra/repo'
import { updateUser } from '@/modules/users/application/manage'

function isAdmin(role?: string) {
  return role === 'adminGeral' || role === 'superAdmin'
}

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const session = getSession(request)
  if (!session || !isAdmin(session.role)) {
    return NextResponse.json({ error: 'Sem permissão' }, { status: 403 })
  }

  try {
    const { id } = await context.params
    const body = await request.json()
    const repo = new UserRepo()
    
    const user = await updateUser(repo, id, body)
    return NextResponse.json(user)
  // ... (código do try)
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Falha ao criar usuário.'
    return NextResponse.json({ error: message }, { status: 400 })
  }
}